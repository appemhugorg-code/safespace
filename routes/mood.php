<?php

use App\Http\Controllers\MoodLogController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Mood Tracking Routes
|--------------------------------------------------------------------------
|
| Routes for mood tracking functionality available to children and
| viewing capabilities for guardians and therapists.
|
*/

Route::middleware(['auth', 'active'])->group(function () { // Removed 'verified' until domain is set up
    // Child mood tracking routes
    Route::middleware('role:child')->group(function () {
        Route::get('/mood', [MoodLogController::class, 'index'])->name('mood.index');
        Route::post('/mood', [MoodLogController::class, 'store'])->name('mood.store');
        Route::get('/mood/history', [MoodLogController::class, 'history'])->name('mood.history');
    });

    // Guardian and therapist routes for viewing child mood data
    Route::middleware('role:guardian,therapist')->group(function () {
        Route::get('/child/{child}/mood', [MoodLogController::class, 'childMoodData'])->name('child.mood.data');
    });

    // Guardian mood overview route (shows all their children's mood data)
    Route::middleware('role:guardian')->group(function () {
        Route::get('/mood/overview', [MoodLogController::class, 'guardianOverview'])->name('mood.guardian.overview');
    });

    // Therapist mood overview routes (shows all connected children's mood data)
    Route::middleware('role:therapist')->group(function () {
        Route::get('/mood/therapist-overview', [MoodLogController::class, 'therapistOverview'])->name('mood.therapist.overview');
        Route::get('/therapist/child/{child}/mood', [MoodLogController::class, 'therapistChildMoodData'])->name('therapist.child.mood.data');
    });
});
