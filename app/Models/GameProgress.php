<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameProgress extends Model
{
    protected $table = 'game_progress';

    protected $fillable = [
        'user_id',
        'game_id',
        'score',
        'completion_percentage',
        'completed',
        'attempts',
        'best_score',
        'session_data',
        'completed_at',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'session_data' => 'array',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the user who owns this progress
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the game this progress belongs to
     */
    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    /**
     * Mark the game as completed
     */
    public function markCompleted(?int $score = null): void
    {
        $this->update([
            'completed' => true,
            'completion_percentage' => 100,
            'completed_at' => now(),
            'score' => $score ?? $this->score,
            'best_score' => max($this->best_score, $score ?? $this->score),
        ]);
    }

    /**
     * Update progress
     */
    public function updateProgress(int $percentage, ?int $score = null, ?array $sessionData = null): void
    {
        $updateData = [
            'completion_percentage' => min(100, max(0, $percentage)),
        ];

        if ($score !== null) {
            $updateData['score'] = $score;
            $updateData['best_score'] = max($this->best_score, $score);
        }

        if ($sessionData !== null) {
            $updateData['session_data'] = array_merge($this->session_data ?? [], $sessionData);
        }

        if ($percentage >= 100) {
            $updateData['completed'] = true;
            $updateData['completed_at'] = now();
        }

        $this->update($updateData);
    }
}
