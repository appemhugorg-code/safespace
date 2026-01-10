<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\SecurityService;

class SecurityMiddleware
{
    private SecurityService $securityService;

    public function __construct(SecurityService $securityService)
    {
        $this->securityService = $securityService;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Validate API requests
        if ($request->is('api/*')) {
            if (!$this->securityService->validateApiRequest($request->headers->all())) {
                return response()->json(['error' => 'Invalid request'], 400);
            }
        }

        // Detect suspicious activity
        $activity = $request->method() . '_' . $request->path();
        if ($this->securityService->detectSuspiciousActivity($activity)) {
            // Log but don't block for now
        }

        // Sanitize input data
        $this->sanitizeRequestData($request);

        $response = $next($request);

        // Add security headers
        $this->addSecurityHeaders($response);

        return $response;
    }

    /**
     * Sanitize request data.
     */
    private function sanitizeRequestData(Request $request): void
    {
        $input = $request->all();
        
        foreach ($input as $key => $value) {
            if (is_string($value)) {
                $request->merge([
                    $key => $this->securityService->sanitizeInput($value)
                ]);
            }
        }
    }

    /**
     * Add security headers to response.
     */
    private function addSecurityHeaders(Response $response): void
    {
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        // Only apply CSP in production
        if (!app()->environment('local')) {
            $response->headers->set('Content-Security-Policy', $this->securityService->generateCSPHeader());
        }
        
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    }
}
