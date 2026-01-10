<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PanicAlertNotification extends Model
{
    use HasFactory;

    protected $fillable = [
        'panic_alert_id',
        'notified_user_id',
        'notification_type',
        'viewed_at',
        'acknowledged_at',
    ];

    protected $casts = [
        'viewed_at' => 'datetime',
        'acknowledged_at' => 'datetime',
    ];

    /**
     * Get the panic alert this notification belongs to.
     */
    public function panicAlert(): BelongsTo
    {
        return $this->belongsTo(PanicAlert::class);
    }

    /**
     * Get the user who was notified.
     */
    public function notifiedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'notified_user_id');
    }

    /**
     * Check if the notification has been viewed.
     */
    public function isViewed(): bool
    {
        return !is_null($this->viewed_at);
    }

    /**
     * Check if the notification has been acknowledged.
     */
    public function isAcknowledged(): bool
    {
        return !is_null($this->acknowledged_at);
    }

    /**
     * Mark the notification as viewed.
     */
    public function markAsViewed(): void
    {
        if (!$this->isViewed()) {
            $this->update(['viewed_at' => now()]);
        }
    }

    /**
     * Mark the notification as acknowledged.
     */
    public function markAsAcknowledged(): void
    {
        if (!$this->isAcknowledged()) {
            $this->update(['acknowledged_at' => now()]);
        }
    }

    /**
     * Scope to get unviewed notifications.
     */
    public function scopeUnviewed($query)
    {
        return $query->whereNull('viewed_at');
    }

    /**
     * Scope to get unacknowledged notifications.
     */
    public function scopeUnacknowledged($query)
    {
        return $query->whereNull('acknowledged_at');
    }

    /**
     * Scope to get notifications for a specific user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('notified_user_id', $userId);
    }

    /**
     * Scope to get notifications by type.
     */
    public function scopeByType($query, $type)
    {
        return $query->where('notification_type', $type);
    }
}
