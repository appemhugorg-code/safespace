<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
        'config',
        'difficulty',
        'estimated_duration',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'config' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the game progress records for this game
     */
    public function progress(): HasMany
    {
        return $this->hasMany(GameProgress::class);
    }

    /**
     * Scope for active games
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for ordering games
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * Scope for games by type
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Get user's progress for this game
     */
    public function getProgressForUser(int $userId): ?GameProgress
    {
        return $this->progress()->where('user_id', $userId)->first();
    }

    /**
     * Check if user has completed this game
     */
    public function isCompletedByUser(int $userId): bool
    {
        return $this->progress()
            ->where('user_id', $userId)
            ->where('completed', true)
            ->exists();
    }

    /**
     * Get completion rate for this game
     */
    public function getCompletionRateAttribute()
    {
        $total = $this->progress()->count();
        if ($total === 0) {
            return 0;
        }

        $completed = $this->progress()->where('completed', true)->count();

        return round(($completed / $total) * 100, 1);
    }
}
