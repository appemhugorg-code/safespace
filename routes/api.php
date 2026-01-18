<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register/guardian', [AuthController::class, 'registerGuardian']);
Route::post('/register/therapist', [AuthController::class, 'registerTherapist']);

// Protected routes
Route::middleware(['auth:sanctum', 'active'])->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Group management routes - using 'user-groups' to avoid conflict with admin routes
    Route::apiResource('user-groups', \App\Http\Controllers\GroupController::class)->names([
        'index' => 'api.groups.index',
        'store' => 'api.groups.store', 
        'show' => 'api.groups.show',
        'update' => 'api.groups.update',
        'destroy' => 'api.groups.destroy'
    ]);

    // Backward compatibility aliases for frontend
    Route::apiResource('groups', \App\Http\Controllers\GroupController::class)->names([
        'index' => 'api.groups.index.legacy',
        'store' => 'api.groups.store.legacy', 
        'show' => 'api.groups.show.legacy',
        'update' => 'api.groups.update.legacy',
        'destroy' => 'api.groups.destroy.legacy'
    ]);

    // Additional group routes
    Route::get('/user-groups/search/available', [\App\Http\Controllers\GroupController::class, 'search'])->name('api.groups.search');
    Route::get('/user-groups/manageable/list', [\App\Http\Controllers\GroupController::class, 'manageable'])->name('api.groups.manageable');
    Route::get('/user-groups/{group}/statistics', [\App\Http\Controllers\GroupController::class, 'statistics'])->name('api.groups.statistics');

    // Backward compatibility for additional routes
    Route::get('/groups/search/available', [\App\Http\Controllers\GroupController::class, 'search'])->name('api.groups.search.legacy');
    Route::get('/groups/manageable/list', [\App\Http\Controllers\GroupController::class, 'manageable'])->name('api.groups.manageable.legacy');
    Route::get('/groups/{group}/statistics', [\App\Http\Controllers\GroupController::class, 'statistics'])->name('api.groups.statistics.legacy');

    // Group join request routes
    Route::post('/user-groups/{group}/join-request', [\App\Http\Controllers\GroupController::class, 'requestJoin'])->name('api.groups.join-request');
    Route::get('/user-groups/{group}/join-requests', [\App\Http\Controllers\GroupController::class, 'joinRequests'])->name('api.groups.join-requests');
    Route::put('/user-groups/{group}/join-requests/{request}', [\App\Http\Controllers\GroupController::class, 'reviewJoinRequest'])->name('api.groups.review-join-request');
    Route::get('/my-join-requests', [\App\Http\Controllers\GroupController::class, 'myJoinRequests'])->name('api.groups.my-join-requests');

    // Backward compatibility for join request routes
    Route::post('/groups/{group}/join-request', [\App\Http\Controllers\GroupController::class, 'requestJoin'])->name('api.groups.join-request.legacy');
    Route::get('/groups/{group}/join-requests', [\App\Http\Controllers\GroupController::class, 'joinRequests'])->name('api.groups.join-requests.legacy');
    Route::put('/groups/{group}/join-requests/{request}', [\App\Http\Controllers\GroupController::class, 'reviewJoinRequest'])->name('api.groups.review-join-request.legacy');

    // Group member management routes
    Route::post('/user-groups/{group}/members', [\App\Http\Controllers\GroupController::class, 'addMember'])->name('api.groups.add-member');
    Route::delete('/user-groups/{group}/members/{user}', [\App\Http\Controllers\GroupController::class, 'removeMember'])->name('api.groups.remove-member');

    // Backward compatibility for member management routes
    Route::post('/groups/{group}/members', [\App\Http\Controllers\GroupController::class, 'addMember'])->name('api.groups.add-member.legacy');
    Route::delete('/groups/{group}/members/{user}', [\App\Http\Controllers\GroupController::class, 'removeMember'])->name('api.groups.remove-member.legacy');

    // Group leave routes
    Route::post('/user-groups/{group}/leave', [\App\Http\Controllers\GroupController::class, 'leaveGroup'])->name('api.groups.leave');
    Route::get('/user-groups/{group}/leave-logs', [\App\Http\Controllers\GroupController::class, 'leaveLogs'])->name('api.groups.leave-logs');
    Route::get('/user-groups/{group}/leave-reasons-summary', [\App\Http\Controllers\GroupController::class, 'leaveReasonsSummary'])->name('api.groups.leave-reasons-summary');

    // Backward compatibility for leave routes
    Route::post('/groups/{group}/leave', [\App\Http\Controllers\GroupController::class, 'leaveGroup'])->name('api.groups.leave.legacy');
    Route::get('/groups/{group}/leave-logs', [\App\Http\Controllers\GroupController::class, 'leaveLogs'])->name('api.groups.leave-logs.legacy');
    Route::get('/groups/{group}/leave-reasons-summary', [\App\Http\Controllers\GroupController::class, 'leaveReasonsSummary'])->name('api.groups.leave-reasons-summary.legacy');

    // User preference routes
    Route::prefix('preferences')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\UserPreferenceController::class, 'index']);
        Route::put('/', [\App\Http\Controllers\Api\UserPreferenceController::class, 'update']);
        Route::post('/sync', [\App\Http\Controllers\Api\UserPreferenceController::class, 'sync']);
        Route::get('/conflicts', [\App\Http\Controllers\Api\UserPreferenceController::class, 'conflicts']);
        Route::post('/conflicts/resolve', [\App\Http\Controllers\Api\UserPreferenceController::class, 'resolveConflicts']);
        Route::get('/export', [\App\Http\Controllers\Api\UserPreferenceController::class, 'export']);
        Route::post('/import', [\App\Http\Controllers\Api\UserPreferenceController::class, 'import']);
    });

    // Theme preference routes (existing)
    Route::prefix('theme')->group(function () {
        Route::get('/preferences', [\App\Http\Controllers\Api\ThemePreferenceController::class, 'show']);
        Route::post('/preferences', [\App\Http\Controllers\Api\ThemePreferenceController::class, 'store']);
        Route::put('/preferences', [\App\Http\Controllers\Api\ThemePreferenceController::class, 'update']);
        Route::delete('/preferences', [\App\Http\Controllers\Api\ThemePreferenceController::class, 'destroy']);
    });

    // Message routes
    Route::post('/messages', [\App\Http\Controllers\MessageController::class, 'store']);
    Route::get('/user-groups/{group}/messages', [\App\Http\Controllers\MessageController::class, 'getGroupMessages'])->name('api.groups.messages');
    Route::get('/messages/unread-count', [\App\Http\Controllers\MessageController::class, 'unreadCount']);
    Route::post('/messages/{message}/flag', [\App\Http\Controllers\MessageController::class, 'flag']);

    // Backward compatibility for message routes
    Route::get('/groups/{group}/messages', [\App\Http\Controllers\MessageController::class, 'getGroupMessages'])->name('api.groups.messages.legacy');

    // Content moderation routes
    Route::get('/admin/flagged-messages', [\App\Http\Controllers\MessageController::class, 'getFlaggedMessages']);
    Route::get('/user-groups/{group}/flagged-messages', [\App\Http\Controllers\MessageController::class, 'getFlaggedGroupMessages'])->name('api.groups.flagged-messages');

    // Backward compatibility for moderation routes
    Route::get('/groups/{group}/flagged-messages', [\App\Http\Controllers\MessageController::class, 'getFlaggedGroupMessages'])->name('api.groups.flagged-messages.legacy');
    Route::post('/messages/{message}/resolve-flag', [\App\Http\Controllers\MessageController::class, 'resolveFlaggedMessage']);
    Route::get('/admin/moderation-stats', [\App\Http\Controllers\MessageController::class, 'getModerationStats']);

    // Email preferences routes
    Route::get('/user/email-preferences', [\App\Http\Controllers\UserEmailPreferencesController::class, 'show']);
    Route::put('/user/email-preferences', [\App\Http\Controllers\UserEmailPreferencesController::class, 'update']);
    Route::get('/user/unsubscribe-token', [\App\Http\Controllers\UserEmailPreferencesController::class, 'getUnsubscribeToken']);

    // Admin email template management routes
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('admin/email-templates', \App\Http\Controllers\Admin\EmailTemplateController::class);
        Route::get('/admin/email-templates/{emailTemplate}/preview', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'preview']);
    });

    // Therapist availability routes
    Route::middleware('role:therapist')->prefix('therapist')->group(function () {
        Route::get('/availability', [\App\Http\Controllers\Api\TherapistAvailabilityController::class, 'index']);
        Route::post('/availability', [\App\Http\Controllers\Api\TherapistAvailabilityController::class, 'store']);
        Route::put('/availability/{availability}', [\App\Http\Controllers\Api\TherapistAvailabilityController::class, 'update']);
        Route::delete('/availability/{availability}', [\App\Http\Controllers\Api\TherapistAvailabilityController::class, 'destroy']);

        Route::get('/availability/overrides', [\App\Http\Controllers\Api\TherapistAvailabilityController::class, 'overrides']);
        Route::post('/availability/overrides', [\App\Http\Controllers\Api\TherapistAvailabilityController::class, 'storeOverride']);
        Route::delete('/availability/overrides/{override}', [\App\Http\Controllers\Api\TherapistAvailabilityController::class, 'destroyOverride']);
        
        // Connection request management routes
        Route::post('/requests/{request}/approve', [\App\Http\Controllers\Therapist\TherapistConnectionController::class, 'approveRequest']);
        Route::post('/requests/{request}/decline', [\App\Http\Controllers\Therapist\TherapistConnectionController::class, 'declineRequest']);
    });

    // Guardian connection management routes
    Route::middleware('role:guardian')->prefix('guardian')->group(function () {
        // Connection request routes
        Route::post('/connection-requests', [\App\Http\Controllers\Guardian\ClientConnectionController::class, 'createRequest']);
        Route::post('/child-assignments', [\App\Http\Controllers\Guardian\ClientConnectionController::class, 'assignChild']);
        Route::delete('/requests/{request}', [\App\Http\Controllers\Guardian\ClientConnectionController::class, 'cancelRequest']);
    });

    // Admin connection management routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::post('/connections', [\App\Http\Controllers\Admin\AdminConnectionController::class, 'store']);
        Route::get('/connections', [\App\Http\Controllers\Admin\AdminConnectionController::class, 'index']);
        Route::get('/connections/analytics', [\App\Http\Controllers\Admin\AdminConnectionController::class, 'analytics']);
        Route::get('/connections/available-clients', [\App\Http\Controllers\Admin\AdminConnectionController::class, 'availableClients']);
        Route::get('/connections/available-therapists', [\App\Http\Controllers\Admin\AdminConnectionController::class, 'availableTherapists']);
        Route::get('/connections/{connection}', [\App\Http\Controllers\Admin\AdminConnectionController::class, 'show']);
        Route::delete('/connections/{connection}', [\App\Http\Controllers\Admin\AdminConnectionController::class, 'destroy']);

        // Group Monitoring API routes
        Route::get('/groups/dashboard', [\App\Http\Controllers\Admin\GroupMonitoringController::class, 'dashboard']);
        Route::get('/groups', [\App\Http\Controllers\Admin\GroupMonitoringController::class, 'allGroups']);
        Route::get('/groups/{group}', [\App\Http\Controllers\Admin\GroupMonitoringController::class, 'groupDetails']);
        Route::delete('/groups/{group}/dissolve', [\App\Http\Controllers\Admin\GroupMonitoringController::class, 'dissolveGroup']);
        Route::get('/groups/flagged-messages', [\App\Http\Controllers\Admin\GroupMonitoringController::class, 'flaggedMessages']);
    });

    // Child connection routes
    Route::middleware('role:child')->prefix('child')->group(function () {
        Route::get('/therapist/{therapist}/features', [\App\Http\Controllers\Child\ChildConnectionController::class, 'communicationFeatures']);
    });

    // Public availability viewing (for booking)
    Route::get('/therapists/{therapist}/available-slots', [\App\Http\Controllers\Api\TherapistAvailabilityController::class, 'availableSlots']);
    Route::get('/therapists/{therapist}/schedule', [\App\Http\Controllers\Api\TherapistAvailabilityController::class, 'schedule']);

    // Article bookmarks
    Route::post('/user/bookmarks/{article}', function ($articleId) {
        $user = auth()->user();
        $bookmark = \App\Models\UserBookmark::where('user_id', $user->id)
            ->where('article_id', $articleId)
            ->first();

        if ($bookmark) {
            $bookmark->delete();

            return response()->json(['bookmarked' => false]);
        } else {
            \App\Models\UserBookmark::create([
                'user_id' => $user->id,
                'article_id' => $articleId,
            ]);

            return response()->json(['bookmarked' => true]);
        }
    });

    Route::get('/user/bookmarks', function () {
        $user = auth()->user();
        $bookmarks = $user->bookmarks()->with('article')->get();

        return response()->json(['bookmarks' => $bookmarks]);
    });

    // Multi-participant appointment routes
    Route::prefix('appointments')->group(function () {
        // Available slots API endpoint
        Route::get('/available-slots', [\App\Http\Controllers\AppointmentController::class, 'availableSlots'])->name('appointments.available-slots');

        // Create different types of multi-participant appointments
        Route::post('/group-session', [\App\Http\Controllers\Api\MultiParticipantAppointmentController::class, 'createGroupSession']);
        Route::post('/family-session', [\App\Http\Controllers\Api\MultiParticipantAppointmentController::class, 'createFamilySession']);
        Route::post('/consultation', [\App\Http\Controllers\Api\MultiParticipantAppointmentController::class, 'createConsultation']);

        // Manage participants
        Route::post('/{appointment}/participants', [\App\Http\Controllers\Api\MultiParticipantAppointmentController::class, 'addParticipant']);
        Route::delete('/{appointment}/participants/{userId}', [\App\Http\Controllers\Api\MultiParticipantAppointmentController::class, 'removeParticipant']);
        Route::post('/{appointment}/participants/{userId}/confirm', [\App\Http\Controllers\Api\MultiParticipantAppointmentController::class, 'confirmParticipant']);
        Route::post('/{appointment}/participants/{userId}/decline', [\App\Http\Controllers\Api\MultiParticipantAppointmentController::class, 'declineParticipant']);

        // Get participant information
        Route::get('/{appointment}/participants', [\App\Http\Controllers\Api\MultiParticipantAppointmentController::class, 'getParticipants']);
        Route::get('/{appointment}/stats', [\App\Http\Controllers\Api\MultiParticipantAppointmentController::class, 'getStats']);
    });

    // Content analytics routes
    Route::prefix('content/analytics')->group(function () {
        // Author analytics (own content)
        Route::get('/my-analytics', [\App\Http\Controllers\Api\ContentAnalyticsController::class, 'myAnalytics']);
        
        // Article analytics
        Route::get('/articles/{article}', [\App\Http\Controllers\Api\ContentAnalyticsController::class, 'articleAnalytics']);
        
        // Admin-only analytics
        Route::middleware('role:admin')->group(function () {
            Route::get('/platform', [\App\Http\Controllers\Api\ContentAnalyticsController::class, 'platformAnalytics']);
            Route::get('/authors/{author}', [\App\Http\Controllers\Api\ContentAnalyticsController::class, 'authorAnalytics']);
            Route::get('/articles-needing-attention', [\App\Http\Controllers\Api\ContentAnalyticsController::class, 'articlesNeedingAttention']);
            Route::post('/archive-old-articles', [\App\Http\Controllers\Api\ContentAnalyticsController::class, 'archiveOldArticles']);
        });
    });

    // Article interaction routes (comments, ratings, sharing, newsletters)
    Route::prefix('articles')->group(function () {
        // Comments
        Route::get('/{article}/comments', [\App\Http\Controllers\Api\ArticleInteractionController::class, 'getComments']);
        Route::post('/{article}/comments', [\App\Http\Controllers\Api\ArticleInteractionController::class, 'createComment']);
        Route::post('/comments/{comment}/flag', [\App\Http\Controllers\Api\ArticleInteractionController::class, 'flagComment']);

        // Ratings
        Route::post('/{article}/rate', [\App\Http\Controllers\Api\ArticleInteractionController::class, 'rateArticle']);
        Route::get('/{article}/rating-stats', [\App\Http\Controllers\Api\ArticleInteractionController::class, 'getRatingStats']);
        Route::get('/top-rated', [\App\Http\Controllers\Api\ArticleInteractionController::class, 'getTopRated']);

        // Sharing
        Route::get('/{article}/share', [\App\Http\Controllers\Api\ArticleInteractionController::class, 'shareArticle']);
    });

    // Newsletter routes
    Route::prefix('newsletters')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\ArticleInteractionController::class, 'getNewsletters']);
        Route::get('/my-subscriptions', [\App\Http\Controllers\Api\ArticleInteractionController::class, 'getMySubscriptions']);
        Route::post('/{newsletter}/subscribe', [\App\Http\Controllers\Api\ArticleInteractionController::class, 'subscribeNewsletter']);
        Route::post('/{newsletter}/unsubscribe', [\App\Http\Controllers\Api\ArticleInteractionController::class, 'unsubscribeNewsletter']);
    });

    // Theme preference routes
    Route::prefix('user/theme')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\ThemePreferenceController::class, 'show']);
        Route::patch('/', [\App\Http\Controllers\Api\ThemePreferenceController::class, 'update']);
        Route::post('/reset', [\App\Http\Controllers\Api\ThemePreferenceController::class, 'reset']);
    });

    // Notifications API routes
    Route::prefix('notifications')->group(function () {
        Route::get('/recent', [\App\Http\Controllers\NotificationController::class, 'recent']);
        Route::post('/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead']);
        Route::post('/{id}/unread', [\App\Http\Controllers\NotificationController::class, 'markAsUnread']);
        Route::post('/mark-all-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead']);
        Route::delete('/delete-all-read', [\App\Http\Controllers\NotificationController::class, 'deleteAllRead']);
        Route::delete('/{id}', [\App\Http\Controllers\NotificationController::class, 'destroy']);
    });

    // Admin theme management routes
    Route::middleware('role:admin')->prefix('admin/theme')->group(function () {
        Route::get('/analytics', [\App\Http\Controllers\Api\ThemePreferenceController::class, 'analytics']);
        Route::post('/bulk-update', [\App\Http\Controllers\Api\ThemePreferenceController::class, 'bulkUpdate']);
    });
    // Video Sessions API
    Route::prefix('video-sessions')->group(function () {
        Route::post('/rooms', [App\Http\Controllers\Api\VideoSessionController::class, 'createRoom']);
        Route::post('/rooms/{roomId}/join', [App\Http\Controllers\Api\VideoSessionController::class, 'joinRoom']);
        Route::post('/rooms/{roomId}/leave', [App\Http\Controllers\Api\VideoSessionController::class, 'leaveRoom']);
        Route::post('/rooms/{roomId}/end', [App\Http\Controllers\Api\VideoSessionController::class, 'endSession']);
        
        Route::patch('/rooms/{roomId}/participants/{participantId}', [App\Http\Controllers\Api\VideoSessionController::class, 'updateParticipant']);
        Route::post('/rooms/{roomId}/participants/{participantId}/mute', [App\Http\Controllers\Api\VideoSessionController::class, 'muteParticipant']);
        Route::post('/rooms/{roomId}/participants/{participantId}/kick', [App\Http\Controllers\Api\VideoSessionController::class, 'kickParticipant']);
        
        Route::post('/rooms/{roomId}/recording/start', [App\Http\Controllers\Api\VideoSessionController::class, 'startRecording']);
        Route::post('/rooms/{roomId}/recording/stop', [App\Http\Controllers\Api\VideoSessionController::class, 'stopRecording']);
        
        Route::get('/participants/{participantId}/rooms', [App\Http\Controllers\Api\VideoSessionController::class, 'getParticipantRooms']);
        Route::get('/rooms/active', [App\Http\Controllers\Api\VideoSessionController::class, 'getActiveRooms']);
        Route::get('/rooms/{roomId}/access/{participantId}', [App\Http\Controllers\Api\VideoSessionController::class, 'validateRoomAccess']);
    });

    // Session Recording API
    Route::prefix('session-recordings')->group(function () {
        Route::get('/', [App\Http\Controllers\Api\SessionRecordingController::class, 'index']);
        Route::post('/start', [App\Http\Controllers\Api\SessionRecordingController::class, 'start']);
        Route::post('/{recordingId}/stop', [App\Http\Controllers\Api\SessionRecordingController::class, 'stop']);
        Route::get('/{recordingId}', [App\Http\Controllers\Api\SessionRecordingController::class, 'show']);
        Route::get('/{recordingId}/download', [App\Http\Controllers\Api\SessionRecordingController::class, 'download']);
        Route::put('/{recordingId}/access', [App\Http\Controllers\Api\SessionRecordingController::class, 'updateAccess']);
        Route::delete('/{recordingId}', [App\Http\Controllers\Api\SessionRecordingController::class, 'destroy']);
        Route::get('/statistics/overview', [App\Http\Controllers\Api\SessionRecordingController::class, 'statistics']);
    });

    // Session Logs API
    Route::prefix('session-logs')->group(function () {
        Route::get('/', [App\Http\Controllers\Api\SessionLogController::class, 'index']);
        Route::post('/start', [App\Http\Controllers\Api\SessionLogController::class, 'start']);
        Route::post('/{sessionId}/end', [App\Http\Controllers\Api\SessionLogController::class, 'end']);
        Route::get('/{sessionId}', [App\Http\Controllers\Api\SessionLogController::class, 'show']);
        
        // Participant management
        Route::post('/{sessionId}/participants', [App\Http\Controllers\Api\SessionLogController::class, 'addParticipant']);
        Route::delete('/{sessionId}/participants/{participantId}', [App\Http\Controllers\Api\SessionLogController::class, 'removeParticipant']);
        
        // Notes management
        Route::post('/{sessionId}/notes', [App\Http\Controllers\Api\SessionLogController::class, 'addNote']);
        Route::get('/{sessionId}/notes', [App\Http\Controllers\Api\SessionLogController::class, 'getNotes']);
        
        // Session management
        Route::put('/{sessionId}/goals', [App\Http\Controllers\Api\SessionLogController::class, 'updateGoals']);
        Route::put('/{sessionId}/outcomes', [App\Http\Controllers\Api\SessionLogController::class, 'updateOutcomes']);
        
        Route::get('/statistics/overview', [App\Http\Controllers\Api\SessionLogController::class, 'statistics']);
    });
});

// Public theme routes (no authentication required)
Route::get('/theme/defaults', [\App\Http\Controllers\Api\ThemePreferenceController::class, 'defaults']);