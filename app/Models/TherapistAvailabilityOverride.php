<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TherapistAvailabilityOverride extends Model
{
    use HasFactory;

    protected $fillable = [
        'therapist_id',
        'date',
        'type',
        'start_time',
        'end_time',
        'reason',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    /**
     * Get the therapist for this override.
     */
    public function therapist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'therapist_id');
    }

    /**
     * Scope to get overrides for a specific date.
     */
    public function scopeForDate($query, Carbon $date)
    {
        return $query->whereDate('date', $date);
    }

    /**
     * Scope to get overrides within a date range.
     */
    public function scopeDateRange($query, Carbon $startDate, Carbon $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    /**
     * Scope to get unavailable dates.
     */
    public function scopeUnavailable($query)
    {
        return $query->where('type', 'unavailable');
    }

    /**
     * Scope to get custom hours.
     */
    public function scopeCustomHours($query)
    {
        return $query->where('type', 'custom_hours');
    }

    /**
     * Check if this is an unavailable override.
     */
    public function isUnavailable(): bool
    {
        return $this->type === 'unavailable';
    }

    /**
     * Check if this is a custom hours override.
     */
    public function isCustomHours(): bool
    {
        return $this->type === 'custom_hours';
    }

    /**
     * Get formatted time range for custom hours.
     */
    public function getTimeRangeAttribute(): ?string
    {
        if ($this->isUnavailable()) {
            return null;
        }

        return Carbon::parse($this->start_time)->format('g:i A').' - '.
               Carbon::parse($this->end_time)->format('g:i A');
    }
}
