<?php

namespace App\Services;

use App\Models\Article;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ContentModerationService
{
    private EmailNotificationService $emailService;

    public function __construct(EmailNotificationService $emailService)
    {
        $this->emailService = $emailService;
    }

    /**
     * Submit article for review.
     */
    public function submitForReview(Article $article): void
    {
        $article->submitForReview();

        // Notify admins of pending content
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            // TODO: Create content review notification email template
            Log::info('Content submitted for review', [
                'article_id' => $article->id,
                'title' => $article->title,
                'author' => $article->author->name,
            ]);
        }
    }

    /**
     * Approve content and publish.
     */
    public function approveContent(Article $article, User $reviewer): void
    {
        $article->publish($reviewer);

        // Notify author of approval
        // TODO: Create content approved notification email template
        Log::info('Content approved', [
            'article_id' => $article->id,
            'title' => $article->title,
            'reviewer' => $reviewer->name,
        ]);

        // Notify subscribers of new content
        $this->emailService->sendContentPublishedNotification($article);
    }

    /**
     * Reject content with reason.
     */
    public function rejectContent(Article $article, User $reviewer, string $reason): void
    {
        $article->reject($reviewer, $reason);

        // Notify author of rejection
        // TODO: Create content rejected notification email template
        Log::info('Content rejected', [
            'article_id' => $article->id,
            'title' => $article->title,
            'reviewer' => $reviewer->name,
            'reason' => $reason,
        ]);
    }

    /**
     * Archive content.
     */
    public function archiveContent(Article $article): void
    {
        $article->archive();

        Log::info('Content archived', [
            'article_id' => $article->id,
            'title' => $article->title,
        ]);
    }
}
