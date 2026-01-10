<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MessageFlag extends Model
{
    use HasFactory;

    protected $fillable = [
        'message_id',
        'flagged_by',
        'flag_type',
        'reason',
        'status',
        'reviewed_by',
        'admin_notes',
        'reviewed_at',
        'action_taken',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    /**
     * Get the message that was flagged.
     */
    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }

    /**
     * Get the user who flagged the message.
     */
    public function flagger(): BelongsTo
    {
        return $this->belongsTo(User::class, 'flagged_by');
    }

    /**
     * Get the admin who reviewed the flag.
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Scope to get pending flags.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope to get reviewed flags.
     */
    public function scopeReviewed($query)
    {
        return $query->where('status', 'reviewed');
    }

    /**
     * Check if the flag is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Mark the flag as reviewed.
     */
    public function markAsReviewed(User $reviewer, string $action = 'none', ?string $notes = null): void
    {
        $this->update([
            'status' => 'reviewed',
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
            'action_taken' => $action,
            'admin_notes' => $notes,
        ]);
    }

    /**
     * Dismiss the flag.
     */
    public function dismiss(User $reviewer, ?string $notes = null): void
    {
        $this->update([
            'status' => 'dismissed',
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
            'admin_notes' => $notes,
        ]);
    }

    /**
     * Get human-readable flag type.
     */
    public function getFlagTypeDisplayAttribute(): string
    {
        return match ($this->flag_type) {
            'inappropriate' => 'Inappropriate Content',
            'spam' => 'Spam',
            'harassment' => 'Harassment',
            'violence' => 'Violence/Threats',
            'self_harm' => 'Self-Harm',
            'other' => 'Other',
            default => 'Unknown',
        };
    }

    /**
     * Get human-readable action taken.
     */
    public function getActionTakenDisplayAttribute(): string
    {
        return match ($this->action_taken) {
            'none' => 'No Action',
            'warning' => 'Warning Issued',
            'message_removed' => 'Message Removed',
            'user_suspended' => 'User Suspended',
            default => 'Unknown',
        };
    }
}
