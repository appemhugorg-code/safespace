<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'body',
        'excerpt',
        'featured_image',
        'author_id',
        'status',
        'target_audience',
        'categories',
        'tags',
        'meta_description',
        'reading_time',
        'view_count',
        'published_at',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
    ];

    protected $casts = [
        'categories' => 'array',
        'tags' => 'array',
        'published_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'view_count' => 'integer',
        'reading_time' => 'integer',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($article) {
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title);
            }

            // Calculate reading time if not set
            if (empty($article->reading_time)) {
                $article->reading_time = static::calculateReadingTime($article->body);
            }
        });

        static::updating(function ($article) {
            if ($article->isDirty('title') && empty($article->slug)) {
                $article->slug = Str::slug($article->title);
            }

            if ($article->isDirty('body')) {
                $article->reading_time = static::calculateReadingTime($article->body);
            }
        });
    }

    /**
     * Get the author of the article.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get the reviewer of the article.
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Get the article views.
     */
    public function views(): HasMany
    {
        return $this->hasMany(ArticleView::class);
    }

    /**
     * Get the article bookmarks.
     */
    public function bookmarks(): HasMany
    {
        return $this->hasMany(UserBookmark::class);
    }

    /**
     * Get the article comments.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(ArticleComment::class);
    }

    /**
     * Get approved comments only.
     */
    public function approvedComments(): HasMany
    {
        return $this->hasMany(ArticleComment::class)->where('status', 'approved');
    }

    /**
     * Get the article ratings.
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(ArticleRating::class);
    }

    /**
     * Get average rating.
     */
    public function getAverageRatingAttribute(): float
    {
        return round($this->ratings()->avg('rating') ?? 0, 1);
    }

    /**
     * Get total ratings count.
     */
    public function getRatingsCountAttribute(): int
    {
        return $this->ratings()->count();
    }

    /**
     * Scope for published articles.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /**
     * Scope for pending articles.
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for draft articles.
     */
    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', 'draft');
    }

    /**
     * Scope for articles by target audience.
     */
    public function scopeForAudience(Builder $query, string $audience): Builder
    {
        return $query->where(function ($q) use ($audience) {
            $q->where('target_audience', $audience)
                ->orWhere('target_audience', 'all');
        });
    }

    /**
     * Scope for searching articles.
     */
    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
                ->orWhere('body', 'like', "%{$search}%")
                ->orWhere('excerpt', 'like', "%{$search}%");
        });
    }

    /**
     * Check if article is published.
     */
    public function isPublished(): bool
    {
        return $this->status === 'published'
            && $this->published_at !== null
            && $this->published_at <= now();
    }

    /**
     * Check if article is pending review.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if article is draft.
     */
    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    /**
     * Publish the article.
     */
    public function publish(?User $reviewer = null): void
    {
        $this->update([
            'status' => 'published',
            'published_at' => now(),
            'reviewed_by' => $reviewer?->id,
            'reviewed_at' => now(),
        ]);

        // Notify interested users about new article
        $this->notifyArticlePublished();
    }

    /**
     * Notify users about published article.
     */
    private function notifyArticlePublished(): void
    {
        $notificationService = app(\App\Services\NotificationService::class);
        
        // Get all active users (you might want to filter by preferences later)
        $users = User::where('status', 'active')
            ->whereHas('roles', function ($query) {
                $query->whereIn('name', ['child', 'guardian', 'therapist']);
            })
            ->get();

        foreach ($users as $user) {
            $notificationService->create(
                $user->id,
                \App\Services\NotificationService::TYPE_ARTICLE_PUBLISHED,
                'New Article: '.$this->title,
                $this->excerpt ?? substr(strip_tags($this->content), 0, 100).'...',
                [
                    'article_id' => $this->id,
                    'article_slug' => $this->slug,
                ],
                route('articles.show', $this->slug),
                'low'
            );
        }
    }

    /**
     * Submit article for review.
     */
    public function submitForReview(): void
    {
        $this->update(['status' => 'pending']);
    }

    /**
     * Reject the article.
     */
    public function reject(User $reviewer, string $reason): void
    {
        $this->update([
            'status' => 'draft',
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
            'rejection_reason' => $reason,
        ]);
    }

    /**
     * Archive the article.
     */
    public function archive(): void
    {
        $this->update(['status' => 'archived']);
    }

    /**
     * Increment view count.
     */
    public function incrementViews(): void
    {
        $this->increment('view_count');
    }

    /**
     * Calculate reading time in minutes.
     */
    public static function calculateReadingTime(string $content): int
    {
        $wordCount = str_word_count(strip_tags($content));
        $minutes = ceil($wordCount / 200); // Average reading speed: 200 words per minute

        return max(1, $minutes); // Minimum 1 minute
    }

    /**
     * Get route key name for slug-based routing.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
