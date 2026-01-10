<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTermsAccepted
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Skip check for guests or API routes
        if (!$user || $request->is('api/*')) {
            return $next($request);
        }

        // Skip check for legal pages and auth routes
        if ($request->is('terms-of-service') || 
            $request->is('privacy-policy') || 
            $request->is('login') || 
            $request->is('register') ||
            $request->is('logout')) {
            return $next($request);
        }

        // Check if user needs to accept terms
        if ($user->needsToAcceptTerms()) {
            // For now, we'll just log this - in the future you could redirect to a terms acceptance page
            \Log::info("User {$user->id} needs to accept terms of service");
        }

        return $next($request);
    }
}
