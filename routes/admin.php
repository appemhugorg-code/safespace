<?php

use App\Http\Controllers\Admin\ContentModerationController;
use App\Http\Controllers\Admin\GroupMonitoringController;
use App\Http\Controllers\Admin\UserManagementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Here are the routes for admin functionality. These routes require
| admin role and active status.
|
*/

Route::middleware(['auth', 'active', 'role:admin'])->prefix('admin')->name('admin.')->group(function () { // Removed 'verified' until domain is set up
    // User Management
    Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
    Route::patch('/users/{user}/approve', [UserManagementController::class, 'approve'])->name('users.approve');
    Route::delete('/users/{user}/reject', [UserManagementController::class, 'reject'])->name('users.reject');
    Route::patch('/users/{user}/suspend', [UserManagementController::class, 'suspend'])->name('users.suspend');
    Route::patch('/users/{user}/reactivate', [UserManagementController::class, 'reactivate'])->name('users.reactivate');

    // Group Monitoring - Web Routes
    Route::get('/groups/monitoring', function () {
        return Inertia::render('admin/group-monitoring');
    })->name('groups.monitoring');

    // Group Monitoring - API Routes
    Route::get('/groups/dashboard', [GroupMonitoringController::class, 'dashboard'])->name('groups.dashboard');
    Route::get('/groups', [GroupMonitoringController::class, 'allGroups'])->name('groups.index');
    Route::get('/groups/{group}', [GroupMonitoringController::class, 'groupDetails'])->name('groups.show');
    Route::delete('/groups/{group}/dissolve', [GroupMonitoringController::class, 'dissolveGroup'])->name('groups.dissolve');

    // Content Moderation Routes
    Route::get('/moderation/flags', [ContentModerationController::class, 'flaggedMessages'])->name('moderation.flags');
    Route::post('/moderation/flags/{flag}/review', [ContentModerationController::class, 'reviewFlag'])->name('moderation.review');
    Route::get('/moderation/statistics', [ContentModerationController::class, 'statistics'])->name('moderation.statistics');
    Route::get('/moderation/filtering', [ContentModerationController::class, 'automatedFiltering'])->name('moderation.filtering');
    Route::put('/moderation/filtering', [ContentModerationController::class, 'updateFilteringSettings'])->name('moderation.filtering.update');

    // Multi-Participant Appointment Management
    Route::prefix('appointments')->name('appointments.')->group(function () {
        Route::get('/multi-participant/create', [\App\Http\Controllers\Admin\MultiParticipantAppointmentController::class, 'create'])->name('multi-participant.create');
        Route::post('/multi-participant', [\App\Http\Controllers\Admin\MultiParticipantAppointmentController::class, 'store'])->name('multi-participant.store');
        Route::get('/multi-participant/{appointment}', [\App\Http\Controllers\Admin\MultiParticipantAppointmentController::class, 'show'])->name('multi-participant.show');
        Route::get('/multi-participant/{appointment}/manage-participants', [\App\Http\Controllers\Admin\MultiParticipantAppointmentController::class, 'manageParticipants'])->name('multi-participant.manage-participants');
    });

    // Content Management
    Route::prefix('content')->name('content.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\ContentManagementController::class, 'index'])->name('index');
        Route::get('/analytics', [\App\Http\Controllers\Admin\ContentManagementController::class, 'analytics'])->name('analytics');
        Route::get('/search', [\App\Http\Controllers\Admin\ContentManagementController::class, 'search'])->name('search');
        Route::get('/{article}', [\App\Http\Controllers\Admin\ContentManagementController::class, 'show'])->name('show');
        Route::post('/{article}/approve', [\App\Http\Controllers\Admin\ContentManagementController::class, 'approve'])->name('approve');
        Route::post('/{article}/reject', [\App\Http\Controllers\Admin\ContentManagementController::class, 'reject'])->name('reject');
        Route::post('/{article}/archive', [\App\Http\Controllers\Admin\ContentManagementController::class, 'archive'])->name('archive');
        Route::post('/{article}/restore', [\App\Http\Controllers\Admin\ContentManagementController::class, 'restore'])->name('restore');
        Route::post('/bulk-archive', [\App\Http\Controllers\Admin\ContentManagementController::class, 'bulkArchive'])->name('bulk-archive');
    });

    // Comment Moderation
    Route::prefix('comments')->name('comments.')->group(function () {
        Route::get('/pending', [\App\Http\Controllers\Admin\CommentModerationController::class, 'index'])->name('pending');
        Route::post('/{comment}/approve', [\App\Http\Controllers\Admin\CommentModerationController::class, 'approve'])->name('approve');
        Route::post('/{comment}/reject', [\App\Http\Controllers\Admin\CommentModerationController::class, 'reject'])->name('reject');
        Route::delete('/{comment}', [\App\Http\Controllers\Admin\CommentModerationController::class, 'destroy'])->name('destroy');
    });

    // Connection Management
    Route::prefix('connections')->name('connections.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\AdminConnectionController::class, 'index'])->name('index');
        Route::post('/', [\App\Http\Controllers\Admin\AdminConnectionController::class, 'store'])->name('store');
        Route::get('/analytics', [\App\Http\Controllers\Admin\AdminConnectionController::class, 'analytics'])->name('analytics');
        Route::get('/available-clients', [\App\Http\Controllers\Admin\AdminConnectionController::class, 'availableClients'])->name('available-clients');
        Route::get('/available-therapists', [\App\Http\Controllers\Admin\AdminConnectionController::class, 'availableTherapists'])->name('available-therapists');
        Route::get('/{connection}', [\App\Http\Controllers\Admin\AdminConnectionController::class, 'show'])->name('show');
        Route::delete('/{connection}', [\App\Http\Controllers\Admin\AdminConnectionController::class, 'destroy'])->name('destroy');
    });

    // System Reports
    Route::get('/reports', [\App\Http\Controllers\Admin\SystemReportsController::class, 'index'])->name('reports.index');
});
