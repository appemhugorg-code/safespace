<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\User;
use App\Services\ContentAnalyticsService;
use Illuminate\Http\Request;

class ContentAnalyticsController extends Controller
{
    protected ContentAnalyticsService $analyticsService;

    public function __construct(ContentAnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Get analytics for a specific article.
     */
    public function articleAnalytics(Article $article)
    {
        try {
            $analytics = $this->analyticsService->getArticleAnalytics($article);

            return response()->json($analytics, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to get article analytics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get analytics for the authenticated author.
     */
    public function myAnalytics(Request $request)
    {
        try {
            $author = $request->user();
            $analytics = $this->analyticsService->getAuthorAnalytics($author);

            return response()->json($analytics, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to get author analytics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get analytics for a specific author (admin only).
     */
    public function authorAnalytics(User $author)
    {
        try {
            $analytics = $this->analyticsService->getAuthorAnalytics($author);

            return response()->json($analytics, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to get author analytics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get platform-wide analytics (admin only).
     */
    public function platformAnalytics()
    {
        try {
            $analytics = $this->analyticsService->getPlatformAnalytics();

            return response()->json($analytics, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to get platform analytics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get articles needing attention (admin only).
     */
    public function articlesNeedingAttention(Request $request)
    {
        try {
            $minDaysPublished = $request->input('min_days_published', 7);
            $minViews = $request->input('min_views', 50);

            $articles = $this->analyticsService->getArticlesNeedingAttention($minDaysPublished, $minViews);

            return response()->json([
                'articles' => $articles,
                'count' => count($articles),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to get articles needing attention',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Archive old articles (admin only).
     */
    public function archiveOldArticles(Request $request)
    {
        try {
            $daysInactive = $request->input('days_inactive', 365);
            $minViews = $request->input('min_views', 10);

            $count = $this->analyticsService->archiveOldArticles($daysInactive, $minViews);

            return response()->json([
                'message' => 'Articles archived successfully',
                'archived_count' => $count,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to archive articles',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
