<?php

namespace App\Services;

use App\Models\Article;
use App\Models\ArticleComment;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ArticleCommentService
{
    /**
     * Create a new comment.
     */
    public function createComment(Article $article, User $user, string $content, ?int $parentId = null): ArticleComment
    {
        $comment = ArticleComment::create([
            'article_id' => $article->id,
            'user_id' => $user->id,
            'parent_id' => $parentId,
            'content' => $content,
            'status' => 'pending', // All comments start as pending
        ]);

        Log::info('Comment created', [
            'comment_id' => $comment->id,
            'article_id' => $article->id,
            'user_id' => $user->id,
        ]);

        return $comment;
    }

    /**
     * Get comments for an article.
     */
    public function getArticleComments(Article $article, bool $includeReplies = true)
    {
        $query = $article->comments()
            ->with('user')
            ->approved()
            ->topLevel()
            ->orderBy('created_at', 'desc');

        if ($includeReplies) {
            $query->with(['replies' => function ($q) {
                $q->approved()->with('user')->orderBy('created_at', 'asc');
            }]);
        }

        return $query->get();
    }

    /**
     * Get pending comments for moderation.
     */
    public function getPendingComments()
    {
        return ArticleComment::with(['article', 'user'])
            ->pending()
            ->orderBy('created_at', 'asc')
            ->get();
    }

    /**
     * Approve a comment.
     */
    public function approveComment(ArticleComment $comment, User $moderator): void
    {
        $comment->approve($moderator);

        Log::info('Comment approved', [
            'comment_id' => $comment->id,
            'moderator_id' => $moderator->id,
        ]);
    }

    /**
     * Reject a comment.
     */
    public function rejectComment(ArticleComment $comment, User $moderator, string $reason): void
    {
        $comment->reject($moderator, $reason);

        Log::info('Comment rejected', [
            'comment_id' => $comment->id,
            'moderator_id' => $moderator->id,
            'reason' => $reason,
        ]);
    }

    /**
     * Flag a comment.
     */
    public function flagComment(ArticleComment $comment, string $reason): void
    {
        $comment->flag($reason);

        Log::warning('Comment flagged', [
            'comment_id' => $comment->id,
            'reason' => $reason,
        ]);
    }

    /**
     * Delete a comment.
     */
    public function deleteComment(ArticleComment $comment): void
    {
        $commentId = $comment->id;
        $comment->delete();

        Log::info('Comment deleted', ['comment_id' => $commentId]);
    }

    /**
     * Get comment statistics for an article.
     */
    public function getCommentStats(Article $article): array
    {
        return [
            'total_comments' => $article->comments()->count(),
            'approved_comments' => $article->comments()->approved()->count(),
            'pending_comments' => $article->comments()->pending()->count(),
            'flagged_comments' => $article->comments()->where('status', 'flagged')->count(),
        ];
    }
}
