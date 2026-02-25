<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\GoogleCalendarService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GoogleAuthController extends Controller
{
    public function __construct(
        private GoogleCalendarService $googleCalendar
    ) {}

    /**
     * Redirect to Google OAuth.
     */
    public function redirect()
    {
        $user = Auth::user();

        if (! $user->hasRole('therapist') && ! $user->hasRole('admin')) {
            return redirect()->route('dashboard')
                ->with('error', 'Only therapists can connect Google Calendar');
        }

        $authUrl = $this->googleCalendar->getAuthorizationUrl();

        return redirect($authUrl);
    }

    /**
     * Handle Google OAuth callback.
     */
    public function callback(Request $request)
    {
        $user = Auth::user();

        if (! $request->has('code')) {
            return redirect()->route('dashboard')
                ->with('error', 'Google authorization failed');
        }

        try {
            $token = $this->googleCalendar->authenticate($request->code);

            // Store token for user
            $user->update([
                'google_access_token' => encrypt($token['access_token']),
                'google_refresh_token' => encrypt($token['refresh_token'] ?? null),
                'google_token_expires_at' => now()->addSeconds($token['expires_in']),
            ]);

            return redirect()->route('dashboard')
                ->with('success', 'Google Calendar connected successfully!');

        } catch (\Exception $e) {
            \Log::error('Google OAuth failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('dashboard')
                ->with('error', 'Failed to connect Google Calendar: '.$e->getMessage());
        }
    }

    /**
     * Disconnect Google Calendar.
     */
    public function disconnect()
    {
        $user = Auth::user();

        $user->update([
            'google_access_token' => null,
            'google_refresh_token' => null,
            'google_token_expires_at' => null,
        ]);

        return redirect()->route('dashboard')
            ->with('success', 'Google Calendar disconnected');
    }
}
