<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

/**
 * Rate limiting middleware for connection-related endpoints
 */
class ConnectionRateLimitMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $type = 'general'): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'UNAUTHORIZED',
                    'message' => 'Authentication required.',
                ]
            ], 401);
        }

        // Define rate limits based on endpoint type and user role
        $limits = $this->getRateLimits($type, $user);
        
        $key = $this->getRateLimitKey($request, $user, $type);
        
        if (RateLimiter::tooManyAttempts($key, $limits['max_attempts'])) {
            $retryAfter = RateLimiter::availableIn($key);
            
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'RATE_LIMIT_EXCEEDED',
                    'message' => 'Too many requests. Please try again later.',
                    'details' => [
                        'retry_after' => $retryAfter,
                        'limit' => $limits['max_attempts'],
                        'window' => $limits['decay_minutes'],
                    ]
                ]
            ], 429)->withHeaders([
                'X-RateLimit-Limit' => $limits['max_attempts'],
                'X-RateLimit-Remaining' => 0,
                'X-RateLimit-Reset' => now()->addSeconds($retryAfter)->timestamp,
                'Retry-After' => $retryAfter,
            ]);
        }

        RateLimiter::hit($key, $limits['decay_minutes'] * 60);
        
        $remaining = $limits['max_attempts'] - RateLimiter::attempts($key);
        
        $response = $next($request);
        
        // Add rate limit headers to successful responses
        return $response->withHeaders([
            'X-RateLimit-Limit' => $limits['max_attempts'],
            'X-RateLimit-Remaining' => max(0, $remaining - 1),
            'X-RateLimit-Reset' => now()->addMinutes($limits['decay_minutes'])->timestamp,
        ]);
    }

    /**
     * Get rate limits based on endpoint type and user role
     */
    private function getRateLimits(string $type, $user): array
    {
        $baseLimit = [
            'max_attempts' => 60,
            'decay_minutes' => 1,
        ];

        // Admin users get higher limits
        if ($user->hasRole('admin')) {
            $baseLimit['max_attempts'] = 100;
        }

        // Specific limits for different endpoint types
        switch ($type) {
            case 'search':
                return [
                    'max_attempts' => $user->hasRole('admin') ? 60 : 30,
                    'decay_minutes' => 1,
                ];
                
            case 'request_creation':
                return [
                    'max_attempts' => $user->hasRole('admin') ? 20 : 10,
                    'decay_minutes' => 5, // Longer window for creation requests
                ];
                
            case 'request_processing':
                return [
                    'max_attempts' => $user->hasRole('therapist') ? 50 : 20,
                    'decay_minutes' => 1,
                ];
                
            case 'admin_operations':
                return [
                    'max_attempts' => 100,
                    'decay_minutes' => 1,
                ];
                
            default:
                return $baseLimit;
        }
    }

    /**
     * Generate rate limit key
     */
    private function getRateLimitKey(Request $request, $user, string $type): string
    {
        $ip = $request->ip();
        $userId = $user->id;
        $endpoint = $request->route()?->getName() ?? $request->path();
        
        return "connection_rate_limit:{$type}:{$userId}:{$ip}:{$endpoint}";
    }
}