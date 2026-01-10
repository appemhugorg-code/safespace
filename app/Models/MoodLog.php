<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MoodLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'mood',
        'notes',
        'mood_date',
    ];

    protected $casts = [
        'mood_date' => 'date',
    ];

    protected $appends = [
        'mood_display',
        'mood_emoji',
        'mood_color',
    ];

    /**
     * Get the user that owns the mood log.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get mood display name.
     */
    public function getMoodDisplayAttribute(): string
    {
        return match ($this->mood) {
            'very_sad' => 'Very Sad',
            'sad' => 'Sad',
            'neutral' => 'Neutral',
            'happy' => 'Happy',
            'very_happy' => 'Very Happy',
            default => ucfirst($this->mood),
        };
    }

    /**
     * Get mood emoji.
     */
    public function getMoodEmojiAttribute(): string
    {
        return match ($this->mood) {
            'very_sad' => '😢',
            'sad' => '😔',
            'neutral' => '😐',
            'happy' => '😊',
            'very_happy' => '😄',
            default => '😐',
        };
    }

    /**
     * Get mood color for UI.
     */
    public function getMoodColorAttribute(): string
    {
        return match ($this->mood) {
            'very_sad' => 'bg-red-500',
            'sad' => 'bg-orange-500',
            'neutral' => 'bg-gray-500',
            'happy' => 'bg-green-500',
            'very_happy' => 'bg-blue-500',
            default => 'bg-gray-500',
        };
    }

    /**
     * Scope to get mood logs for a specific date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('mood_date', [$startDate, $endDate]);
    }

    /**
     * Scope to get mood logs for a specific user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to get mood logs for children connected to a therapist.
     */
    public function scopeForTherapistChildren($query, $therapistId)
    {
        return $query->whereHas('user.clientConnections', function ($q) use ($therapistId) {
            $q->where('therapist_id', $therapistId)
              ->where('status', 'active')
              ->where('client_type', 'child');
        });
    }
}
