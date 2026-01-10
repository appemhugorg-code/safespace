<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleComment;
use App\Models\ContentNewsletter;
use App\Services\ArticleCommentService;
use App\Services\ArticleRatingService;
use App\Services\ContentNewsletterService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ArticleInteractionController extends Controller
{
    protected ArticleCommentService $commentService;
    protected ArticleRatingService $ratingService;
    protected ContentNewsletterService $newsletterService;

    public function __construct(
        ArticleCommentService $commentService,
        ArticleRatingService $ratingService,
        ContentNewsletterService $newsletterService
    ) {
        $this->commentService = $commentService;
        $this->ratingService = $ratingService;
        $this->newsletterService = $newsletterService;
    }

    // ========== Comments ==========

    /**
     * Get comments for an article.
     */
    public function getComments(Article $article)
    {
        $comments = $this->commentService->getArticleComments($article);
        $stats = $this->commentService->getCommentStats($article);

        return response()->json([
            'comments' => $comments,
            'stats' => $stats,
        ]);
    }

    /**
     * Create a comment.
     */
    public function createComment(Request $request, Article $article)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:article_comments,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $comment = $this->commentService->createComment(
                $article,
                $request->user(),
                $request->content,
                $request->parent_id
            );

            return response()->json([
                'message' => 'Comment submitted for moderation',
                'comment' => $comment,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Flag a comment.
     */
    public function flagComment(ArticleComment $comment, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $this->commentService->flagComment($comment, $request->reason);

            return response()->json(['message' => 'Comment flagged for review']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // ========== Ratings ==========

    /**
     * Rate an article.
     */
    public function rateArticle(Request $request, Article $article)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'feedback' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $rating = $this->ratingService->rateArticle(
                $article,
                $request->user(),
                $request->rating,
                $request->feedback
            );

            $stats = $this->ratingService->getRatingStats($article);

            return response()->json([
                'message' => 'Rating submitted successfully',
                'rating' => $rating,
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get rating statistics for an article.
     */
    public function getRatingStats(Article $article)
    {
        $stats = $this->ratingService->getRatingStats($article);
        $userRating = $this->ratingService->getUserRating($article, auth()->user());

        return response()->json([
            'stats' => $stats,
            'user_rating' => $userRating,
        ]);
    }

    /**
     * Get top-rated articles.
     */
    public function getTopRated(Request $request)
    {
        $limit = $request->input('limit', 10);
        $articles = $this->ratingService->getTopRatedArticles($limit);

        return response()->json(['articles' => $articles]);
    }

    // ========== Sharing ==========

    /**
     * Share an article (generate shareable link).
     */
    public function shareArticle(Article $article)
    {
        $shareUrl = url("/articles/{$article->slug}");

        return response()->json([
            'share_url' => $shareUrl,
            'title' => $article->title,
            'excerpt' => $article->excerpt,
        ]);
    }

    // ========== Newsletters ==========

    /**
     * Get available newsletters.
     */
    public function getNewsletters()
    {
        $newsletters = ContentNewsletter::active()->get();

        return response()->json(['newsletters' => $newsletters]);
    }

    /**
     * Subscribe to a newsletter.
     */
    public function subscribeNewsletter(ContentNewsletter $newsletter, Request $request)
    {
        try {
            $this->newsletterService->subscribe($newsletter, $request->user());

            return response()->json(['message' => 'Subscribed successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Unsubscribe from a newsletter.
     */
    public function unsubscribeNewsletter(ContentNewsletter $newsletter, Request $request)
    {
        try {
            $this->newsletterService->unsubscribe($newsletter, $request->user());

            return response()->json(['message' => 'Unsubscribed successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get user's newsletter subscriptions.
     */
    public function getMySubscriptions(Request $request)
    {
        $subscriptions = $this->newsletterService->getUserSubscriptions($request->user());

        return response()->json(['subscriptions' => $subscriptions]);
    }
}
