<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\GoogleCalendarService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PlatformGoogleController extends Controller
{
    public function __construct(private GoogleCalendarService $googleCalendar)
    {
    }

    public function redirect()
    {
        $authUrl = $this->googleCalendar->getAuthorizationUrl();
        return redirect($authUrl);
    }

    public function callback(Request $request)
    {
        if ($request->has('error')) {
            return redirect()->route('dashboard')
                ->with('error', 'Google authorization cancelled');
        }

        try {
            $token = $this->googleCalendar->authenticate($request->code);
            
            // Store token for platform email user
            $platformEmail = config('services.google.platform_email');
            $user = User::where('email', $platformEmail)->first();
            
            if (!$user) {
                $user = User::create([
                    'name' => 'SafeSpace Platform',
                    'email' => $platformEmail,
                    'password' => bcrypt('platform-' . uniqid()),
                    'email_verified_at' => now(),
                ]);
                $user->assignRole('admin');
            }
            
            $updated = $user->update([
                'google_access_token' => encrypt(json_encode($token)),
                'google_refresh_token' => isset($token['refresh_token']) ? encrypt($token['refresh_token']) : null,
                'google_token_expires_at' => isset($token['expires_in']) ? now()->addSeconds($token['expires_in']) : null,
            ]);

            Log::info('Platform Google account connected', [
                'email' => $platformEmail,
                'updated' => $updated,
                'has_refresh' => isset($token['refresh_token']),
                'user_id' => $user->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Platform Google account connected successfully!',
                'email' => $platformEmail,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to connect platform Google account', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
