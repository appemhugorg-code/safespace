<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ContentNewsletter extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'frequency',
        'target_audience',
        'last_sent_at',
        'next_send_at',
        'is_active',
        'article_ids',
        'subscriber_count',
    ];

    protected $casts = [
        'last_sent_at' => 'datetime',
        'next_send_at' => 'datetime',
        'is_active' => 'boolean',
        'article_ids' => 'array',
        'subscriber_count' => 'integer',
    ];

    /**
     * Get the subscribers for this newsletter.
     */
    public function subscribers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'newsletter_subscriptions')
            ->withPivot('is_subscribed')
            ->withTimestamps();
    }

    /**
     * Get active subscribers.
     */
    public function activeSubscribers()
    {
        return $this->subscribers()->wherePivot('is_subscribed', true);
    }

    /**
     * Check if newsletter is due to be sent.
     */
    public function isDue(): bool
    {
        return $this->is_active 
            && $this->next_send_at !== null 
            && $this->next_send_at <= now();
    }

    /**
     * Calculate next send date based on frequency.
     */
    public function calculateNextSendDate(): void
    {
        $nextDate = match ($this->frequency) {
            'daily' => now()->addDay(),
            'weekly' => now()->addWeek(),
            'monthly' => now()->addMonth(),
            default => now()->addWeek(),
        };

        $this->update(['next_send_at' => $nextDate]);
    }

    /**
     * Mark as sent.
     */
    public function markAsSent(): void
    {
        $this->update(['last_sent_at' => now()]);
        $this->calculateNextSendDate();
    }

    /**
     * Update subscriber count.
     */
    public function updateSubscriberCount(): void
    {
        $count = $this->activeSubscribers()->count();
        $this->update(['subscriber_count' => $count]);
    }

    /**
     * Scope for active newsletters.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for newsletters due to be sent.
     */
    public function scopeDue($query)
    {
        return $query->active()
            ->whereNotNull('next_send_at')
            ->where('next_send_at', '<=', now());
    }
}
