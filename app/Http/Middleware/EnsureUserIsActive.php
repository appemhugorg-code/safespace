<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user && $user->status !== 'active') {
            $message = match ($user->status) {
                'pending' => 'Your account is pending approval. Please wait for admin approval.',
                'suspended' => 'Your account has been suspended. Please contact support for more information.',
                'disabled' => 'Your account has been disabled. Please contact support.',
                'deleted' => 'Your account has been deleted.',
                default => 'Your account is not active. Please contact support.',
            };

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => $message,
                    'errors' => ['status' => [$message]],
                    'status' => $user->status,
                ], 403);
            }

            Auth::logout();

            return redirect()->route('login')->with('error', $message);
        }

        return $next($request);
    }
}
