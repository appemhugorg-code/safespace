<?php

namespace App\Services;

use App\Models\Article;
use App\Models\ArticleView;
use App\Models\User;
use App\Models\UserBookmark;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ContentAnalyticsService
{
    /**
     * Get analytics for a specific article.
     */
    public function getArticleAnalytics(Article $article): array
    {
        return [
            'article_id' => $article->id,
            'title' => $article->title,
            'total_views' => $article->view_count,
            'unique_views' => $article->views()->distinct('user_id')->count('user_id'),
            'total_bookmarks' => $article->bookmarks()->count(),
            'views_last_7_days' => $this->getViewsInPeriod($article, 7),
            'views_last_30_days' => $this->getViewsInPeriod($article, 30),
            'views_by_day' => $this->getViewsByDay($article, 30),
            'views_by_audience' => $this->getViewsByAudience($article),
            'engagement_rate' => $this->calculateEngagementRate($article),
            'average_read_time' => $article->reading_time,
            'published_at' => $article->published_at,
            'days_since_published' => $article->published_at ? $article->published_at->diffInDays(now()) : null,
        ];
    }

    /**
     * Get analytics for an author.
     */
    public function getAuthorAnalytics(User $author): array
    {
        $articles = Article::where('author_id', $author->id)->get();

        return [
            'author_id' => $author->id,
            'author_name' => $author->name,
            'total_articles' => $articles->count(),
            'published_articles' => $articles->where('status', 'published')->count(),
            'draft_articles' => $articles->where('status', 'draft')->count(),
            'pending_articles' => $articles->where('status', 'pending')->count(),
            'total_views' => $articles->sum('view_count'),
            'total_bookmarks' => UserBookmark::whereIn('article_id', $articles->pluck('id'))->count(),
            'average_views_per_article' => $articles->count() > 0 ? round($articles->sum('view_count') / $articles->count(), 2) : 0,
            'most_viewed_article' => $this->getMostViewedArticle($author),
            'recent_performance' => $this->getAuthorRecentPerformance($author),
        ];
    }

    /**
     * Get platform-wide content analytics.
     */
    public function getPlatformAnalytics(): array
    {
        return [
            'total_articles' => Article::count(),
            'published_articles' => Article::where('status', 'published')->count(),
            'pending_review' => Article::where('status', 'pending')->count(),
            'total_views' => Article::sum('view_count'),
            'total_bookmarks' => UserBookmark::count(),
            'total_authors' => Article::distinct('author_id')->count('author_id'),
            'views_last_7_days' => $this->getPlatformViewsInPeriod(7),
            'views_last_30_days' => $this->getPlatformViewsInPeriod(30),
            'top_articles' => $this->getTopArticles(10),
            'top_authors' => $this->getTopAuthors(10),
            'content_by_audience' => $this->getContentByAudience(),
            'engagement_trends' => $this->getEngagementTrends(30),
        ];
    }

    /**
     * Get views for an article in a specific period (days).
     */
    private function getViewsInPeriod(Article $article, int $days): int
    {
        return $article->views()
            ->where('viewed_at', '>=', now()->subDays($days))
            ->count();
    }

    /**
     * Get views by day for an article.
     */
    private function getViewsByDay(Article $article, int $days): array
    {
        $views = $article->views()
            ->where('viewed_at', '>=', now()->subDays($days))
            ->select(DB::raw('DATE(viewed_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return $views->map(function ($view) {
            return [
                'date' => $view->date,
                'views' => $view->count,
            ];
        })->toArray();
    }

    /**
     * Get views by audience type.
     */
    private function getViewsByAudience(Article $article): array
    {
        $views = $article->views()
            ->join('users', 'article_views.user_id', '=', 'users.id')
            ->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->select('roles.name as role', DB::raw('COUNT(*) as count'))
            ->groupBy('roles.name')
            ->get();

        return $views->map(function ($view) {
            return [
                'audience' => $view->role,
                'views' => $view->count,
            ];
        })->toArray();
    }

    /**
     * Calculate engagement rate (bookmarks / views).
     */
    private function calculateEngagementRate(Article $article): float
    {
        if ($article->view_count === 0) {
            return 0;
        }

        $bookmarks = $article->bookmarks()->count();
        return round(($bookmarks / $article->view_count) * 100, 2);
    }

    /**
     * Get most viewed article for an author.
     */
    private function getMostViewedArticle(User $author): ?array
    {
        $article = Article::where('author_id', $author->id)
            ->where('status', 'published')
            ->orderBy('view_count', 'desc')
            ->first();

        if (!$article) {
            return null;
        }

        return [
            'id' => $article->id,
            'title' => $article->title,
            'slug' => $article->slug,
            'views' => $article->view_count,
            'bookmarks' => $article->bookmarks()->count(),
        ];
    }

    /**
     * Get author's recent performance (last 30 days).
     */
    private function getAuthorRecentPerformance(User $author): array
    {
        $articles = Article::where('author_id', $author->id)
            ->where('status', 'published')
            ->get();

        $recentViews = ArticleView::whereIn('article_id', $articles->pluck('id'))
            ->where('viewed_at', '>=', now()->subDays(30))
            ->count();

        $recentBookmarks = UserBookmark::whereIn('article_id', $articles->pluck('id'))
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        return [
            'views_last_30_days' => $recentViews,
            'bookmarks_last_30_days' => $recentBookmarks,
            'articles_published_last_30_days' => $articles->where('published_at', '>=', now()->subDays(30))->count(),
        ];
    }

    /**
     * Get platform views in a specific period.
     */
    private function getPlatformViewsInPeriod(int $days): int
    {
        return ArticleView::where('viewed_at', '>=', now()->subDays($days))->count();
    }

    /**
     * Get top articles by views.
     */
    private function getTopArticles(int $limit = 10): array
    {
        return Article::where('status', 'published')
            ->orderBy('view_count', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'title' => $article->title,
                    'slug' => $article->slug,
                    'author' => $article->author->name,
                    'views' => $article->view_count,
                    'bookmarks' => $article->bookmarks()->count(),
                    'published_at' => $article->published_at,
                ];
            })
            ->toArray();
    }

    /**
     * Get top authors by total views.
     */
    private function getTopAuthors(int $limit = 10): array
    {
        return Article::select('author_id', DB::raw('SUM(view_count) as total_views'), DB::raw('COUNT(*) as article_count'))
            ->where('status', 'published')
            ->groupBy('author_id')
            ->orderBy('total_views', 'desc')
            ->limit($limit)
            ->with('author')
            ->get()
            ->map(function ($item) {
                return [
                    'author_id' => $item->author_id,
                    'author_name' => $item->author->name,
                    'total_views' => $item->total_views,
                    'article_count' => $item->article_count,
                    'average_views' => round($item->total_views / $item->article_count, 2),
                ];
            })
            ->toArray();
    }

    /**
     * Get content distribution by audience.
     */
    private function getContentByAudience(): array
    {
        return Article::where('status', 'published')
            ->select('target_audience', DB::raw('COUNT(*) as count'))
            ->groupBy('target_audience')
            ->get()
            ->map(function ($item) {
                return [
                    'audience' => $item->target_audience,
                    'count' => $item->count,
                ];
            })
            ->toArray();
    }

    /**
     * Get engagement trends over time.
     */
    private function getEngagementTrends(int $days): array
    {
        $views = ArticleView::where('viewed_at', '>=', now()->subDays($days))
            ->select(DB::raw('DATE(viewed_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $bookmarks = UserBookmark::where('created_at', '>=', now()->subDays($days))
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Merge views and bookmarks by date
        $dates = collect();
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dates->push([
                'date' => $date,
                'views' => $views->firstWhere('date', $date)?->count ?? 0,
                'bookmarks' => $bookmarks->firstWhere('date', $date)?->count ?? 0,
            ]);
        }

        return $dates->toArray();
    }

    /**
     * Archive old articles based on criteria.
     */
    public function archiveOldArticles(int $daysInactive = 365, int $minViews = 10): int
    {
        $cutoffDate = now()->subDays($daysInactive);

        $articlesToArchive = Article::where('status', 'published')
            ->where('published_at', '<', $cutoffDate)
            ->where('view_count', '<', $minViews)
            ->get();

        foreach ($articlesToArchive as $article) {
            $article->archive();
        }

        return $articlesToArchive->count();
    }

    /**
     * Get articles needing attention (low performance).
     */
    public function getArticlesNeedingAttention(int $minDaysPublished = 7, int $minViews = 50): array
    {
        $cutoffDate = now()->subDays($minDaysPublished);

        return Article::where('status', 'published')
            ->where('published_at', '<', $cutoffDate)
            ->where('view_count', '<', $minViews)
            ->with('author')
            ->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'title' => $article->title,
                    'slug' => $article->slug,
                    'author' => $article->author->name,
                    'views' => $article->view_count,
                    'published_at' => $article->published_at,
                    'days_since_published' => $article->published_at->diffInDays(now()),
                ];
            })
            ->toArray();
    }
}
