<?php

namespace App\Services;

use App\Models\Article;
use App\Models\ArticleRating;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ArticleRatingService
{
    /**
     * Rate an article.
     */
    public function rateArticle(Article $article, User $user, int $rating, ?string $feedback = null): ArticleRating
    {
        $articleRating = ArticleRating::updateOrCreate(
            [
                'article_id' => $article->id,
                'user_id' => $user->id,
            ],
            [
                'rating' => $rating,
                'feedback' => $feedback,
            ]
        );

        Log::info('Article rated', [
            'article_id' => $article->id,
            'user_id' => $user->id,
            'rating' => $rating,
        ]);

        return $articleRating;
    }

    /**
     * Get user's rating for an article.
     */
    public function getUserRating(Article $article, User $user): ?ArticleRating
    {
        return ArticleRating::where('article_id', $article->id)
            ->where('user_id', $user->id)
            ->first();
    }

    /**
     * Get rating statistics for an article.
     */
    public function getRatingStats(Article $article): array
    {
        $ratings = $article->ratings;

        $distribution = [
            5 => $ratings->where('rating', 5)->count(),
            4 => $ratings->where('rating', 4)->count(),
            3 => $ratings->where('rating', 3)->count(),
            2 => $ratings->where('rating', 2)->count(),
            1 => $ratings->where('rating', 1)->count(),
        ];

        return [
            'average_rating' => $article->average_rating,
            'total_ratings' => $article->ratings_count,
            'distribution' => $distribution,
            'percentage_5_star' => $ratings->count() > 0 ? round(($distribution[5] / $ratings->count()) * 100, 1) : 0,
        ];
    }

    /**
     * Get top-rated articles.
     */
    public function getTopRatedArticles(int $limit = 10)
    {
        return Article::published()
            ->withCount('ratings')
            ->having('ratings_count', '>', 0)
            ->get()
            ->sortByDesc(function ($article) {
                return $article->average_rating;
            })
            ->take($limit)
            ->values();
    }

    /**
     * Get recent ratings with feedback.
     */
    public function getRecentRatingsWithFeedback(int $limit = 20)
    {
        return ArticleRating::with(['article', 'user'])
            ->whereNotNull('feedback')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }
}
