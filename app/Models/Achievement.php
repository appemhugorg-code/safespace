<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Achievement extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'type',
        'criteria',
        'points',
        'rarity',
        'is_active',
    ];

    protected $casts = [
        'criteria' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the users who have earned this achievement
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_achievements')
            ->withPivot('earned_at')
            ->withTimestamps();
    }

    /**
     * Scope for active achievements
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for achievements by type
     */
    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    /**
     * Scope for achievements by rarity
     */
    public function scopeOfRarity(Builder $query, string $rarity): Builder
    {
        return $query->where('rarity', $rarity);
    }

    /**
     * Check if user has earned this achievement
     */
    public function isEarnedByUser(int $userId): bool
    {
        return $this->users()->where('user_id', $userId)->exists();
    }

    /**
     * Award this achievement to a user
     */
    public function awardToUser(int $userId): void
    {
        if (! $this->isEarnedByUser($userId)) {
            $this->users()->attach($userId, ['earned_at' => now()]);
        }
    }

    /**
     * Check if criteria is met for a user
     */
    public function checkCriteria(User $user): bool
    {
        $criteria = $this->criteria;

        switch ($this->type) {
            case 'game_completion':
                return $this->checkGameCompletionCriteria($user, $criteria);
            case 'streak':
                return $this->checkStreakCriteria($user, $criteria);
            case 'score':
                return $this->checkScoreCriteria($user, $criteria);
            case 'total_games':
                return $this->checkTotalGamesCriteria($user, $criteria);
            default:
                return false;
        }
    }

    private function checkGameCompletionCriteria(User $user, array $criteria): bool
    {
        $gameId = $criteria['game_id'] ?? null;
        if (! $gameId) {
            return false;
        }

        return GameProgress::where('user_id', $user->id)
            ->where('game_id', $gameId)
            ->where('completed', true)
            ->exists();
    }

    private function checkStreakCriteria(User $user, array $criteria): bool
    {
        // Implementation for streak checking would go here
        // For now, return false as this is more complex
        return false;
    }

    private function checkScoreCriteria(User $user, array $criteria): bool
    {
        $gameId = $criteria['game_id'] ?? null;
        $minScore = $criteria['min_score'] ?? 0;

        if (! $gameId) {
            return false;
        }

        return GameProgress::where('user_id', $user->id)
            ->where('game_id', $gameId)
            ->where('best_score', '>=', $minScore)
            ->exists();
    }

    private function checkTotalGamesCriteria(User $user, array $criteria): bool
    {
        $minGames = $criteria['min_games'] ?? 1;

        $completedGames = GameProgress::where('user_id', $user->id)
            ->where('completed', true)
            ->count();

        return $completedGames >= $minGames;
    }
}
