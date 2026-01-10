<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserEmailPreferencesController extends Controller
{
    /**
     * Display the user's email preferences.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $preferences = $user->getEmailPreferences();

        return response()->json($preferences);
    }

    /**
     * Display the email preferences edit page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $preferences = $user->getEmailPreferences();

        return Inertia::render('settings/email-preferences', [
            'preferences' => $preferences,
        ]);
    }

    /**
     * Update the user's email preferences.
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'appointment_reminders' => 'boolean',
            'message_notifications' => 'boolean',
            'content_updates' => 'boolean',
            'emergency_alerts' => 'boolean',
            'marketing_emails' => 'boolean',
        ]);

        $user = $request->user();
        $preferences = $user->getEmailPreferences();
        $preferences->update($validated);

        return response()->json([
            'message' => 'Email preferences updated successfully',
            'preferences' => $preferences,
        ]);
    }

    /**
     * Get unsubscribe token for user.
     */
    public function getUnsubscribeToken(Request $request): JsonResponse
    {
        $user = $request->user();

        // Generate a secure unsubscribe token
        $token = hash_hmac('sha256', $user->id.$user->email, config('app.key'));

        return response()->json([
            'unsubscribe_url' => url('/unsubscribe/'.$user->id.'/'.$token),
        ]);
    }

    /**
     * Handle unsubscribe from all emails.
     */
    public function unsubscribe(Request $request, int $userId, string $token): JsonResponse|Response
    {
        // Verify token
        $user = \App\Models\User::findOrFail($userId);
        $expectedToken = hash_hmac('sha256', $user->id.$user->email, config('app.key'));

        if (! hash_equals($expectedToken, $token)) {
            abort(403, 'Invalid unsubscribe token');
        }

        // Disable all non-essential notifications
        $preferences = $user->getEmailPreferences();
        $preferences->update([
            'appointment_reminders' => false,
            'message_notifications' => false,
            'content_updates' => false,
            'marketing_emails' => false,
            // Keep emergency alerts enabled for safety
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Successfully unsubscribed from email notifications',
            ]);
        }

        return Inertia::render('unsubscribe-success', [
            'user' => $user->only(['name', 'email']),
        ]);
    }
}
