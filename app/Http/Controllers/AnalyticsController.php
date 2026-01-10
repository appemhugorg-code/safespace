<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Game;
use App\Services\EngagementAnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function __construct(
        private EngagementAnalyticsService $analyticsService
    ) {}

    /**
     * Show therapist analytics dashboard
     */
    public function therapistDashboard(): Response
    {
        $user = Auth::user();

        if (! $user->hasRole('therapist')) {
            abort(403, 'Access denied');
        }

        $analytics = $this->analyticsService->getTherapistAnalytics($user);

        return Inertia::render('analytics/therapist-dashboard', [
            'analytics' => $analytics,
        ]);
    }

    /**
     * Show admin analytics dashboard
     */
    public function adminDashboard(): Response
    {
        $user = Auth::user();

        if (! $user->hasRole('admin')) {
            abort(403, 'Access denied');
        }

        $analytics = $this->analyticsService->getAdminAnalytics();

        return Inertia::render('analytics/admin-dashboard', [
            'systemStats' => $analytics['system_stats'],
            'userGrowth' => $analytics['user_growth'],
            'engagementMetrics' => $analytics['engagement_metrics'],
            'topContent' => $analytics['top_content'],
            'recentActivity' => $analytics['recent_activity'],
        ]);
    }

    /**
     * Show guardian analytics dashboard
     */
    public function guardianDashboard(): Response
    {
        $user = Auth::user();

        if (! $user->hasRole('guardian')) {
            abort(403, 'Access denied');
        }

        $analytics = $this->analyticsService->getGuardianAnalytics($user);

        return Inertia::render('analytics/guardian-dashboard', [
            'children' => $analytics['children'],
            'moodTrends' => $analytics['mood_trends'],
            'engagementData' => $analytics['engagement_data'],
            'weeklyInsights' => $analytics['weekly_insights'],
            'upcomingAppointments' => $analytics['upcoming_appointments'],
        ]);
    }

    /**
     * Get article analytics
     */
    public function articleAnalytics(Article $article): JsonResponse
    {
        $user = Auth::user();

        // Check if user can view this article's analytics
        if (! $user->hasRole('admin') && $article->author_id !== $user->id) {
            abort(403, 'Access denied');
        }

        $analytics = $this->analyticsService->getArticleAnalytics($article);

        return response()->json($analytics);
    }

    /**
     * Get game analytics
     */
    public function gameAnalytics(Game $game): JsonResponse
    {
        $user = Auth::user();

        // Only therapists and admins can view game analytics
        if (! $user->hasAnyRole(['admin', 'therapist'])) {
            abort(403, 'Access denied');
        }

        $analytics = $this->analyticsService->getGameAnalytics($game);

        return response()->json($analytics);
    }

    /**
     * Get user engagement summary
     */
    public function userEngagement(Request $request): JsonResponse
    {
        $user = Auth::user();
        $targetUserId = $request->input('user_id');

        // If no user_id provided, get current user's engagement
        if (! $targetUserId) {
            $targetUser = $user;
        } else {
            $targetUser = \App\Models\User::findOrFail($targetUserId);

            // Check permissions
            if (! $user->hasRole('admin') &&
                ! ($user->hasRole('therapist') && $this->isTherapistClient($user, $targetUser)) &&
                ! ($user->hasRole('guardian') && $targetUser->guardian_id === $user->id) &&
                $user->id !== $targetUser->id) {
                abort(403, 'Access denied');
            }
        }

        $engagement = $this->analyticsService->getUserEngagementSummary($targetUser);

        return response()->json($engagement);
    }

    /**
     * Get content recommendations
     */
    public function recommendations(): JsonResponse
    {
        $user = Auth::user();
        $recommendations = $this->analyticsService->getContentRecommendations($user);

        return response()->json($recommendations);
    }

    /**
     * Track content engagement
     */
    public function trackEngagement(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content_type' => 'required|in:article,game',
            'content_id' => 'required|integer',
            'action' => 'required|in:view,start,pause,resume,complete',
            'duration_seconds' => 'nullable|integer|min:0',
            'progress_percentage' => 'nullable|integer|min:0|max:100',
            'metadata' => 'nullable|array',
        ]);

        $user = Auth::user();

        $engagement = $this->analyticsService->trackEngagement(
            $user,
            $validated['content_type'],
            $validated['content_id'],
            $validated['action'],
            $validated['metadata'] ?? []
        );

        // Update duration and progress if provided
        if (isset($validated['duration_seconds']) || isset($validated['progress_percentage'])) {
            $engagement->update([
                'duration_seconds' => $validated['duration_seconds'] ?? $engagement->duration_seconds,
                'progress_percentage' => $validated['progress_percentage'] ?? $engagement->progress_percentage,
            ]);
        }

        return response()->json([
            'message' => 'Engagement tracked successfully',
            'engagement' => $engagement,
        ]);
    }

    /**
     * Get engagement trends
     */
    public function engagementTrends(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (! $user->hasAnyRole(['admin', 'therapist'])) {
            abort(403, 'Access denied');
        }

        $days = $request->input('days', 30);

        // This would be implemented based on specific needs
        $trends = []; // Placeholder

        return response()->json($trends);
    }

    /**
     * Check if user is therapist's client
     */
    private function isTherapistClient($therapist, $client): bool
    {
        // This would depend on how therapist-client relationships are stored
        // For now, simplified check
        return $client->hasRole('child') && $therapist->hasRole('therapist');
    }
}
