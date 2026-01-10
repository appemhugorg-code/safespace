<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserEmailPreferences extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'appointment_reminders',
        'message_notifications',
        'content_updates',
        'emergency_alerts',
        'marketing_emails',
    ];

    protected $casts = [
        'appointment_reminders' => 'boolean',
        'message_notifications' => 'boolean',
        'content_updates' => 'boolean',
        'emergency_alerts' => 'boolean',
        'marketing_emails' => 'boolean',
    ];

    /**
     * Relationship to the user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get or create preferences for a user.
     */
    public static function getForUser(User $user): self
    {
        return static::firstOrCreate(
            ['user_id' => $user->id],
            [
                'appointment_reminders' => true,
                'message_notifications' => true,
                'content_updates' => true,
                'emergency_alerts' => true,
                'marketing_emails' => false,
            ]
        );
    }

    /**
     * Check if user wants to receive a specific type of email.
     */
    public function wantsNotification(string $type): bool
    {
        return match ($type) {
            'appointment_reminder' => $this->appointment_reminders,
            'message_notification' => $this->message_notifications,
            'content_update' => $this->content_updates,
            'emergency_alert' => $this->emergency_alerts,
            'marketing' => $this->marketing_emails,
            default => false,
        };
    }
}
