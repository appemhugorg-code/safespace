<?php

use App\Http\Controllers\AnalyticsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'active'])->group(function () { // Removed 'verified' until domain is set up
    // Analytics dashboards by role
    Route::get('analytics/admin', [AnalyticsController::class, 'adminDashboard'])
        ->name('analytics.admin')
        ->middleware('role:admin');

    Route::get('analytics/therapist', [AnalyticsController::class, 'therapistDashboard'])
        ->name('analytics.therapist')
        ->middleware('role:therapist');

    Route::get('analytics/guardian', [AnalyticsController::class, 'guardianDashboard'])
        ->name('analytics.guardian')
        ->middleware('role:guardian');

    // Content-specific analytics
    Route::get('analytics/articles/{article}', [AnalyticsController::class, 'articleAnalytics'])
        ->name('analytics.article');

    Route::get('analytics/games/{game}', [AnalyticsController::class, 'gameAnalytics'])
        ->name('analytics.game');

    // User engagement analytics
    Route::get('analytics/user-engagement', [AnalyticsController::class, 'userEngagement'])
        ->name('analytics.user-engagement');

    Route::get('analytics/recommendations', [AnalyticsController::class, 'recommendations'])
        ->name('analytics.recommendations');

    Route::post('analytics/track', [AnalyticsController::class, 'trackEngagement'])
        ->name('analytics.track');

    Route::get('analytics/trends', [AnalyticsController::class, 'engagementTrends'])
        ->name('analytics.trends');
});
