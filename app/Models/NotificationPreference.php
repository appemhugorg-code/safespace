<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class NotificationPreference extends Model
{
    protected $fillable = [
        'user_id',
        'email_notifications',
        'push_notifications',
        'sound_enabled',
        'appointment_notifications',
        'message_notifications',
        'panic_alert_notifications',
        'content_notifications',
        'system_notifications',
        'quiet_hours_start',
        'quiet_hours_end',
    ];

    protected $casts = [
        'email_notifications' => 'boolean',
        'push_notifications' => 'boolean',
        'sound_enabled' => 'boolean',
        'appointment_notifications' => 'boolean',
        'message_notifications' => 'boolean',
        'panic_alert_notifications' => 'boolean',
        'content_notifications' => 'boolean',
        'system_notifications' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isInQuietHours(): bool
    {
        if (!$this->quiet_hours_start || !$this->quiet_hours_end) {
            return false;
        }

        $now = Carbon::now()->format('H:i:s');
        $start = $this->quiet_hours_start;
        $end = $this->quiet_hours_end;

        // Handle quiet hours that span midnight
        if ($start < $end) {
            return $now >= $start && $now <= $end;
        } else {
            return $now >= $start || $now <= $end;
        }
    }

    public function wantsNotification(string $type): bool
    {
        return match ($type) {
            'appointment_scheduled', 'appointment_cancelled', 'appointment_reminder' => $this->appointment_notifications,
            'message_received' => $this->message_notifications,
            'panic_alert', 'panic_alert_resolved' => $this->panic_alert_notifications,
            'article_published', 'comment_received' => $this->content_notifications,
            'system_announcement' => $this->system_notifications,
            'connection_assigned', 'connection_request_received', 'connection_request_approved', 
            'connection_request_declined', 'connection_terminated', 'child_assigned_to_therapist' => $this->system_notifications,
            default => true,
        };
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
