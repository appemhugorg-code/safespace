<?php

namespace App\Services;

use App\Models\Article;
use App\Models\ContentNewsletter;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContentNewsletterService
{
    /**
     * Create a new newsletter.
     */
    public function createNewsletter(array $data): ContentNewsletter
    {
        $newsletter = ContentNewsletter::create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'frequency' => $data['frequency'] ?? 'weekly',
            'target_audience' => $data['target_audience'] ?? 'all',
            'is_active' => $data['is_active'] ?? true,
        ]);

        // Calculate first send date
        $newsletter->calculateNextSendDate();

        Log::info('Newsletter created', ['newsletter_id' => $newsletter->id]);

        return $newsletter;
    }

    /**
     * Subscribe a user to a newsletter.
     */
    public function subscribe(ContentNewsletter $newsletter, User $user): void
    {
        DB::table('newsletter_subscriptions')->updateOrInsert(
            [
                'user_id' => $user->id,
                'newsletter_id' => $newsletter->id,
            ],
            [
                'is_subscribed' => true,
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        $newsletter->updateSubscriberCount();

        Log::info('User subscribed to newsletter', [
            'user_id' => $user->id,
            'newsletter_id' => $newsletter->id,
        ]);
    }

    /**
     * Unsubscribe a user from a newsletter.
     */
    public function unsubscribe(ContentNewsletter $newsletter, User $user): void
    {
        DB::table('newsletter_subscriptions')
            ->where('user_id', $user->id)
            ->where('newsletter_id', $newsletter->id)
            ->update([
                'is_subscribed' => false,
                'updated_at' => now(),
            ]);

        $newsletter->updateSubscriberCount();

        Log::info('User unsubscribed from newsletter', [
            'user_id' => $user->id,
            'newsletter_id' => $newsletter->id,
        ]);
    }

    /**
     * Get user's newsletter subscriptions.
     */
    public function getUserSubscriptions(User $user)
    {
        return ContentNewsletter::whereHas('subscribers', function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->where('is_subscribed', true);
        })->get();
    }

    /**
     * Prepare newsletter content.
     */
    public function prepareNewsletterContent(ContentNewsletter $newsletter): array
    {
        // Get recent published articles based on target audience
        $query = Article::published()
            ->forAudience($newsletter->target_audience)
            ->orderBy('published_at', 'desc');

        // Limit based on frequency
        $limit = match ($newsletter->frequency) {
            'daily' => 3,
            'weekly' => 10,
            'monthly' => 20,
            default => 10,
        };

        $articles = $query->limit($limit)->get();

        return [
            'newsletter' => $newsletter,
            'articles' => $articles,
            'subscriber_count' => $newsletter->subscriber_count,
        ];
    }

    /**
     * Send newsletter to all subscribers.
     */
    public function sendNewsletter(ContentNewsletter $newsletter): int
    {
        $subscribers = $newsletter->activeSubscribers()->get();
        $content = $this->prepareNewsletterContent($newsletter);

        $sentCount = 0;

        foreach ($subscribers as $subscriber) {
            try {
                // Here you would send the actual email
                // Mail::to($subscriber->email)->send(new NewsletterMail($content));
                
                $sentCount++;
            } catch (\Exception $e) {
                Log::error('Failed to send newsletter', [
                    'newsletter_id' => $newsletter->id,
                    'user_id' => $subscriber->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $newsletter->markAsSent();

        Log::info('Newsletter sent', [
            'newsletter_id' => $newsletter->id,
            'sent_count' => $sentCount,
        ]);

        return $sentCount;
    }

    /**
     * Process due newsletters.
     */
    public function processDueNewsletters(): int
    {
        $newsletters = ContentNewsletter::due()->get();
        $processedCount = 0;

        foreach ($newsletters as $newsletter) {
            try {
                $this->sendNewsletter($newsletter);
                $processedCount++;
            } catch (\Exception $e) {
                Log::error('Failed to process newsletter', [
                    'newsletter_id' => $newsletter->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $processedCount;
    }

    /**
     * Get newsletter statistics.
     */
    public function getNewsletterStats(ContentNewsletter $newsletter): array
    {
        return [
            'subscriber_count' => $newsletter->subscriber_count,
            'frequency' => $newsletter->frequency,
            'target_audience' => $newsletter->target_audience,
            'last_sent_at' => $newsletter->last_sent_at,
            'next_send_at' => $newsletter->next_send_at,
            'is_active' => $newsletter->is_active,
            'total_sends' => $newsletter->last_sent_at ? 1 : 0, // Could track this better
        ];
    }
}
