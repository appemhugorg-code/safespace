<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContentEngagement extends Model
{
    protected $fillable = [
        'user_id',
        'content_type',
        'content_id',
        'action',
        'duration_seconds',
        'progress_percentage',
        'metadata',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the user who performed this engagement
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the content (polymorphic relationship)
     */
    public function content()
    {
        if ($this->content_type === 'article') {
            return $this->belongsTo(Article::class, 'content_id');
        } elseif ($this->content_type === 'game') {
            return $this->belongsTo(Game::class, 'content_id');
        }

        return null;
    }

    /**
     * Scope for specific content type
     */
    public function scopeForContentType(Builder $query, string $type): Builder
    {
        return $query->where('content_type', $type);
    }

    /**
     * Scope for specific content
     */
    public function scopeForContent(Builder $query, string $type, int $id): Builder
    {
        return $query->where('content_type', $type)->where('content_id', $id);
    }

    /**
     * Scope for specific action
     */
    public function scopeForAction(Builder $query, string $action): Builder
    {
        return $query->where('action', $action);
    }

    /**
     * Scope for completed engagements
     */
    public function scopeCompleted(Builder $query): Builder
    {
        return $query->where('action', 'complete')->whereNotNull('completed_at');
    }

    /**
     * Create engagement record
     */
    public static function track(
        int $userId,
        string $contentType,
        int $contentId,
        string $action,
        array $metadata = []
    ): self {
        return self::create([
            'user_id' => $userId,
            'content_type' => $contentType,
            'content_id' => $contentId,
            'action' => $action,
            'metadata' => $metadata,
            'started_at' => in_array($action, ['view', 'start']) ? now() : null,
            'completed_at' => $action === 'complete' ? now() : null,
        ]);
    }

    /**
     * Update engagement with completion data
     */
    public function markCompleted(?int $durationSeconds = null, int $progressPercentage = 100): void
    {
        $this->update([
            'action' => 'complete',
            'duration_seconds' => $durationSeconds,
            'progress_percentage' => $progressPercentage,
            'completed_at' => now(),
        ]);
    }
}
