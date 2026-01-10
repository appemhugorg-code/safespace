<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSuspension extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'suspended_by',
        'reason',
        'suspended_at',
        'suspended_until',
        'is_active',
    ];

    protected $casts = [
        'suspended_at' => 'datetime',
        'suspended_until' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user that was suspended.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin who suspended the user.
     */
    public function suspendedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'suspended_by');
    }

    /**
     * Check if the suspension is still active.
     */
    public function isActive(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        // If there's an end date and it's passed, suspension is no longer active
        if ($this->suspended_until && $this->suspended_until->isPast()) {
            return false;
        }

        return true;
    }

    /**
     * Check if the suspension is temporary (has an end date).
     */
    public function isTemporary(): bool
    {
        return $this->suspended_until !== null;
    }

    /**
     * Get the active suspension for a user.
     */
    public static function getActiveSuspension(int $userId): ?self
    {
        return self::where('user_id', $userId)
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('suspended_until')
                    ->orWhere('suspended_until', '>', now());
            })
            ->latest()
            ->first();
    }
}