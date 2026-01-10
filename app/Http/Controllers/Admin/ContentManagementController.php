<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Services\ContentAnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContentManagementController extends Controller
{
    protected ContentAnalyticsService $analyticsService;

    public function __construct(ContentAnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Show content management dashboard.
     */
    public function index(Request $request)
    {
        $query = Article::with('author');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by author
        if ($request->has('author_id')) {
            $query->where('author_id', $request->author_id);
        }

        // Search
        if ($request->has('search')) {
            $query->search($request->search);
        }

        // Sort
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $articles = $query->paginate(20);

        // Get platform analytics
        $platformAnalytics = $this->analyticsService->getPlatformAnalytics();

        return Inertia::render('Admin/ContentManagement/Index', [
            'articles' => $articles,
            'analytics' => $platformAnalytics,
            'filters' => $request->only(['status', 'author_id', 'search', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Show article details with analytics.
     */
    public function show(Article $article)
    {
        $article->load(['author', 'reviewer', 'views', 'bookmarks']);
        $analytics = $this->analyticsService->getArticleAnalytics($article);

        return Inertia::render('Admin/ContentManagement/Show', [
            'article' => $article,
            'analytics' => $analytics,
        ]);
    }

    /**
     * Show content analytics dashboard.
     */
    public function analytics()
    {
        $platformAnalytics = $this->analyticsService->getPlatformAnalytics();
        $articlesNeedingAttention = $this->analyticsService->getArticlesNeedingAttention();

        return Inertia::render('Admin/ContentManagement/Analytics', [
            'analytics' => $platformAnalytics,
            'articlesNeedingAttention' => $articlesNeedingAttention,
        ]);
    }

    /**
     * Approve and publish a pending article.
     */
    public function approve(Article $article)
    {
        $article->publish(auth()->user());

        return redirect()->back()->with('success', 'Article approved and published successfully.');
    }

    /**
     * Reject a pending article.
     */
    public function reject(Request $request, Article $article)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $article->reject(auth()->user(), $validated['reason']);

        return redirect()->back()->with('success', 'Article rejected and returned to draft.');
    }

    /**
     * Archive an article.
     */
    public function archive(Article $article)
    {
        $article->archive();

        return redirect()->back()->with('success', 'Article archived successfully.');
    }

    /**
     * Restore an archived article.
     */
    public function restore(Article $article)
    {
        $article->update(['status' => 'draft']);

        return redirect()->back()->with('success', 'Article restored to draft.');
    }

    /**
     * Bulk archive old articles.
     */
    public function bulkArchive(Request $request)
    {
        $validated = $request->validate([
            'days_inactive' => 'required|integer|min:30',
            'min_views' => 'required|integer|min:0',
        ]);

        $count = $this->analyticsService->archiveOldArticles(
            $validated['days_inactive'],
            $validated['min_views']
        );

        return redirect()->back()->with('success', "Archived {$count} articles.");
    }

    /**
     * Search and filter articles.
     */
    public function search(Request $request)
    {
        $query = Article::with('author');

        if ($request->has('q')) {
            $query->search($request->q);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('target_audience')) {
            $query->where('target_audience', $request->target_audience);
        }

        if ($request->has('author_id')) {
            $query->where('author_id', $request->author_id);
        }

        $articles = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($articles);
    }
}
