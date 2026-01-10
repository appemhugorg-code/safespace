<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PanicAlert extends Model
{
    use HasFactory;

    protected $fillable = [
        'child_id',
        'triggered_at',
        'location_data',
        'status',
        'resolved_at',
        'resolved_by',
        'notes',
    ];

    protected $casts = [
        'triggered_at' => 'datetime',
        'resolved_at' => 'datetime',
        'location_data' => 'array',
    ];

    /**
     * Get the child who triggered the alert.
     */
    public function child(): BelongsTo
    {
        return $this->belongsTo(User::class, 'child_id');
    }

    /**
     * Get the user who resolved the alert.
     */
    public function resolvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    /**
     * Get all notifications for this alert.
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(PanicAlertNotification::class);
    }

    /**
     * Check if the alert is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if the alert is acknowledged.
     */
    public function isAcknowledged(): bool
    {
        return $this->status === 'acknowledged';
    }

    /**
     * Check if the alert is resolved.
     */
    public function isResolved(): bool
    {
        return $this->status === 'resolved';
    }

    /**
     * Get the time elapsed since the alert was triggered.
     */
    public function getTimeElapsedAttribute(): string
    {
        return $this->triggered_at->diffForHumans();
    }

    /**
     * Check if the alert should be archived (older than 2 hours and resolved).
     */
    public function shouldBeArchived(): bool
    {
        return $this->isResolved() &&
               $this->resolved_at &&
               $this->resolved_at->diffInHours(now()) >= 2;
    }

    /**
     * Scope to get active alerts.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to get recent alerts (not archived).
     */
    public function scopeRecent($query)
    {
        return $query->where(function ($q) {
            $q->where('status', '!=', 'resolved')
              ->orWhere(function ($subQ) {
                  $subQ->where('status', 'resolved')
                       ->where('resolved_at', '>', now()->subHours(2));
              });
        });
    }

    /**
     * Scope to get alerts for a specific child.
     */
    public function scopeForChild($query, $childId)
    {
        return $query->where('child_id', $childId);
    }
}
