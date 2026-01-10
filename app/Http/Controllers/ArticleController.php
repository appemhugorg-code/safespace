<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ContentEngagement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    /**
     * Display a listing of articles
     */
    public function index(Request $request): Response|JsonResponse
    {
        $user = Auth::user();

        $query = Article::with(['author'])
            ->when($user->hasRole('therapist'), function ($q) use ($user) {
                // Therapists see their own articles
                return $q->where('author_id', $user->id);
            })
            ->when($user->hasRole('guardian') || $user->hasRole('child'), function ($q) use ($user) {
                // Guardians and children see published articles
                return $q->published()->forAudience($user->hasRole('child') ? 'children' : 'guardians');
            })
            ->when($user->hasRole('admin'), function ($q) {
                // Admins see all articles
                return $q;
            });

        $articles = $query->latest()->get();

        // Get featured articles (most viewed)
        $featuredArticles = Article::published()
            ->orderBy('view_count', 'desc')
            ->limit(3)
            ->get();

        // Get popular articles
        $popularArticles = Article::published()
            ->orderBy('view_count', 'desc')
            ->limit(9)
            ->get();

        // Get recent articles
        $recentArticles = Article::published()
            ->latest('published_at')
            ->limit(9)
            ->get();

        // Get unique categories
        $categories = Article::published()
            ->get()
            ->pluck('categories')
            ->flatten()
            ->unique()
            ->values()
            ->toArray();

        // Check if user has bookmarked articles
        if ($user) {
            $bookmarkedIds = $user->bookmarks()->pluck('article_id')->toArray();
            $articles->each(function ($article) use ($bookmarkedIds) {
                $article->is_bookmarked = in_array($article->id, $bookmarkedIds);
            });
        }

        if ($request->wantsJson()) {
            return response()->json([
                'articles' => $articles,
                'featuredArticles' => $featuredArticles,
                'popularArticles' => $popularArticles,
                'recentArticles' => $recentArticles,
                'categories' => $categories,
            ]);
        }

        return Inertia::render('articles/index-enhanced', [
            'articles' => $articles,
            'featuredArticles' => $featuredArticles,
            'popularArticles' => $popularArticles,
            'recentArticles' => $recentArticles,
            'categories' => $categories,
            'canCreate' => $user->hasAnyRole(['therapist', 'admin']),
            'isAdmin' => $user->hasRole('admin'),
            'pendingCount' => $user->hasRole('admin') ? Article::where('status', 'pending')->count() : 0,
        ]);
    }

    /**
     * Show the form for creating a new article
     */
    public function create(): Response
    {
        $this->authorize('create', Article::class);

        return Inertia::render('articles/create');
    }

    /**
     * Store a newly created article
     */
    public function store(Request $request)
    {
        $this->authorize('create', Article::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'target_audience' => ['required', Rule::in(['children', 'guardians', 'both'])],
            'categories' => 'nullable|array',
            'tags' => 'nullable|array',
            'status' => ['required', Rule::in(['draft', 'pending'])],
        ]);

        $article = Article::create([
            ...$validated,
            'author_id' => Auth::id(),
        ]);

        return redirect()->route('articles.show', $article)
            ->with('success', 'Article created successfully');
    }

    /**
     * Display the specified article
     */
    public function show(Article $article): Response|JsonResponse
    {
        $user = Auth::user();

        // Check if user can view this article
        if (! $article->isPublished() && ! ($user->hasRole('admin') || $user->hasRole('therapist')) && $article->author_id !== $user->id) {
            abort(404);
        }

        // Track article view and increment view count
        if ($article->author_id !== $user->id) {
            \App\Models\ArticleView::create([
                'article_id' => $article->id,
                'user_id' => $user->id,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            $article->incrementViews();

            // Track engagement
            ContentEngagement::track(
                $user->id,
                'article',
                $article->id,
                'view',
                ['article_title' => $article->title]
            );
        }

        $article->load(['author', 'views']);

        if (request()->wantsJson()) {
            return response()->json(['article' => $article]);
        }

        return Inertia::render('articles/show', [
            'article' => $article,
        ]);
    }

    /**
     * Show the form for editing the specified article
     */
    public function edit(Article $article): Response
    {
        $this->authorize('update', $article);

        return Inertia::render('articles/edit', [
            'article' => $article,
        ]);
    }

    /**
     * Update the specified article
     */
    public function update(Request $request, Article $article)
    {
        $this->authorize('update', $article);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'target_audience' => ['required', Rule::in(['children', 'guardians', 'both'])],
            'categories' => 'nullable|array',
            'tags' => 'nullable|array',
            'status' => ['required', Rule::in(['draft', 'pending', 'published', 'archived'])],
        ]);

        $article->update($validated);

        return redirect()->route('articles.show', $article)
            ->with('success', 'Article updated successfully');
    }

    /**
     * Remove the specified article
     */
    public function destroy(Article $article)
    {
        $this->authorize('delete', $article);

        $article->delete();

        return redirect()->route('articles.index')
            ->with('success', 'Article deleted successfully');
    }

    /**
     * Publish an article (Admin only)
     */
    public function publish(Article $article)
    {
        $this->authorize('publish', $article);

        $article->publish(Auth::user());

        return redirect()->route('articles.index')
            ->with('success', 'Article published successfully');
    }

    /**
     * Reject an article (Admin only)
     */
    public function reject(Request $request, Article $article)
    {
        $this->authorize('publish', $article);

        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $article->reject(Auth::user(), $validated['reason']);

        return redirect()->route('articles.index')
            ->with('success', 'Article rejected and returned to draft');
    }

    /**
     * Archive an article
     */
    public function archive(Article $article)
    {
        $this->authorize('update', $article);

        $article->archive();

        return redirect()->route('articles.show', $article)
            ->with('success', 'Article archived successfully');
    }
}
