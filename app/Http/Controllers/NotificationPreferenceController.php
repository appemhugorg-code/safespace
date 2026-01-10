<?php

namespace App\Http\Controllers;

use App\Models\NotificationPreference;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationPreferenceController extends Controller
{
    /**
     * Show notification preferences page
     */
    public function edit(Request $request)
    {
        $user = $request->user();
        
        // Get or create preferences
        $preferences = NotificationPreference::firstOrCreate(
            ['user_id' => $user->id],
            [
                'email_notifications' => true,
                'push_notifications' => true,
                'sound_enabled' => true,
                'appointment_notifications' => true,
                'message_notifications' => true,
                'panic_alert_notifications' => true,
                'content_notifications' => true,
                'system_notifications' => true,
            ]
        );

        return Inertia::render('settings/notification-preferences', [
            'preferences' => $preferences,
        ]);
    }

    /**
     * Update notification preferences
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'email_notifications' => 'boolean',
            'push_notifications' => 'boolean',
            'sound_enabled' => 'boolean',
            'appointment_notifications' => 'boolean',
            'message_notifications' => 'boolean',
            'panic_alert_notifications' => 'boolean',
            'content_notifications' => 'boolean',
            'system_notifications' => 'boolean',
            'quiet_hours_start' => 'nullable|date_format:H:i',
            'quiet_hours_end' => 'nullable|date_format:H:i',
        ]);

        $preferences = NotificationPreference::updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return back()->with('success', 'Notification preferences updated successfully');
    }
}
