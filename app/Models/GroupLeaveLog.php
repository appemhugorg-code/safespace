<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GroupLeaveLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'user_id',
        'reason',
        'custom_reason',
        'left_at',
    ];

    protected $casts = [
        'left_at' => 'datetime',
    ];

    /**
     * Get the group that was left.
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * Get the user who left the group.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the human-readable reason for leaving.
     */
    public function getReadableReasonAttribute(): string
    {
        return match ($this->reason) {
            'no_longer_relevant' => 'No longer relevant',
            'too_busy' => 'Too busy',
            'found_better_support' => 'Found better support',
            'privacy_concerns' => 'Privacy concerns',
            'other' => $this->custom_reason ?? 'Other',
            default => 'Unknown reason',
        };
    }

    /**
     * Create a leave log entry.
     */
    public static function createLog(Group $group, User $user, string $reason, ?string $customReason = null): self
    {
        return static::create([
            'group_id' => $group->id,
            'user_id' => $user->id,
            'reason' => $reason,
            'custom_reason' => $customReason,
            'left_at' => now(),
        ]);
    }

    /**
     * Scope to get logs by reason.
     */
    public function scopeByReason($query, string $reason)
    {
        return $query->where('reason', $reason);
    }

    /**
     * Scope to get recent leave logs.
     */
    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('left_at', '>=', now()->subDays($days));
    }
}
