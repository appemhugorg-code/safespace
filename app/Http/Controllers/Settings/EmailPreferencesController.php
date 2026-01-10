<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailPreferencesController extends Controller
{
    /**
     * Show email preferences page.
     */
    public function show(): Response
    {
        $user = auth()->user();
        $preferences = $user->getEmailPreferences();

        return Inertia::render('settings/email-preferences', [
            'preferences' => [
                'appointment_reminders' => $preferences->appointment_reminders,
                'message_notifications' => $preferences->message_notifications,
                'content_updates' => $preferences->content_updates,
                'emergency_alerts' => $preferences->emergency_alerts,
                'marketing_emails' => $preferences->marketing_emails,
            ],
        ]);
    }

    /**
     * Update email preferences.
     */
    public function update(Request $request)
    {
        $request->validate([
            'appointment_reminders' => 'boolean',
            'message_notifications' => 'boolean',
            'content_updates' => 'boolean',
            'emergency_alerts' => 'boolean',
            'marketing_emails' => 'boolean',
        ]);

        $user = auth()->user();
        $preferences = $user->getEmailPreferences();

        $preferences->update($request->only([
            'appointment_reminders',
            'message_notifications',
            'content_updates',
            'emergency_alerts',
            'marketing_emails',
        ]));

        return back()->with('success', 'Email preferences updated successfully');
    }
}
