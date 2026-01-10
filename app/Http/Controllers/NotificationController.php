<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    /**
     * Display notifications page
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Notification::forUser($user->id)
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->has('type') && $request->type !== 'all') {
            $query->ofType($request->type);
        }

        if ($request->has('status')) {
            if ($request->status === 'unread') {
                $query->unread();
            } elseif ($request->status === 'read') {
                $query->read();
            }
        }

        $notifications = $query->paginate(20);

        return Inertia::render('notifications/index', [
            'notifications' => $notifications,
            'unreadCount' => $this->notificationService->getUnreadCount($user->id),
            'filters' => [
                'type' => $request->type ?? 'all',
                'status' => $request->status ?? 'all',
            ],
        ]);
    }

    /**
     * Get recent notifications (for dropdown)
     */
    public function recent(Request $request)
    {
        $user = $request->user();
        
        $notifications = $this->notificationService->getRecent($user->id, 10);
        $unreadCount = $this->notificationService->getUnreadCount($user->id);

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request, int $id)
    {
        $notification = Notification::findOrFail($id);
        
        // Ensure user owns this notification
        if ($notification->user_id !== $request->user()->id) {
            abort(403);
        }

        $notification->markAsRead();

        return back()->with('success', 'Notification marked as read');
    }

    /**
     * Mark notification as unread
     */
    public function markAsUnread(Request $request, int $id)
    {
        $notification = Notification::findOrFail($id);
        
        // Ensure user owns this notification
        if ($notification->user_id !== $request->user()->id) {
            abort(403);
        }

        $notification->markAsUnread();

        return response()->json([
            'success' => true,
            'unread_count' => $this->notificationService->getUnreadCount($request->user()->id),
        ]);
    }

    /**
     * Mark all as read
     */
    public function markAllAsRead(Request $request)
    {
        $count = $this->notificationService->markAllAsRead($request->user()->id);

        return back()->with('success', "Marked {$count} notifications as read");
    }

    /**
     * Delete notification
     */
    public function destroy(Request $request, int $id)
    {
        $notification = Notification::findOrFail($id);
        
        // Ensure user owns this notification
        if ($notification->user_id !== $request->user()->id) {
            abort(403);
        }

        $notification->delete();

        return back()->with('success', 'Notification deleted');
    }

    /**
     * Delete all read notifications
     */
    public function deleteAllRead(Request $request)
    {
        $count = $this->notificationService->deleteAllRead($request->user()->id);

        return response()->json([
            'success' => true,
            'deleted_count' => $count,
        ]);
    }
}
