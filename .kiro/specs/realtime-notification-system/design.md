# Design Document: Real-Time Notification System

## Overview

This design document outlines the implementation of a comprehensive real-time notification and activity system for the SafeSpace platform. The system will provide Facebook/LinkedIn-style notifications with real-time delivery via WebSockets (Laravel Reverb), browser push notifications, and a rich user interface for managing notifications. The system is designed to be scalable, performant, and easily extensible for new notification types.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Controllers, Services, Events                           │  │
│  │  (Appointment, Message, PanicAlert, etc.)                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Notification Service Layer                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  NotificationService                                     │  │
│  │  - create()                                              │  │
│  │  - createBatch()                                         │  │
│  │  - markAsRead()                                          │  │
│  │  - delete()                                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Notification Storage                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  notifications table                                     │  │
│  │  - id, user_id, type, title, message                     │  │
│  │  - data (JSON), read_at, priority, action_url            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Real-Time Delivery Layer                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Laravel Reverb (WebSocket Server)                       │  │
│  │  - Private channels per user                             │  │
│  │  - Broadcast events                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend Layer                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Components                                        │  │
│  │  - NotificationBell                                      │  │
│  │  - NotificationDropdown                                  │  │
│  │  - NotificationList                                      │  │
│  │  - ToastNotification                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Laravel Echo (WebSocket Client)                         │  │
│  │  - Listen to private channels                            │  │
│  │  - Handle incoming notifications                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Notification Creation**:
   - Application code calls `NotificationService::create()`
   - Service creates notification record in database
   - Service dispatches `NotificationCreated` event
   - Event broadcasts to user's private channel via Reverb

2. **Real-Time Delivery**:
   - Frontend listens to user's private channel via Laravel Echo
   - Receives notification data via WebSocket
   - Updates UI (badge count, dropdown, toast)
   - Optionally triggers browser push notification

3. **User Interaction**:
   - User clicks notification bell → Fetch recent notifications
   - User clicks notification → Mark as read, navigate to content
   - User marks as read → Update database, broadcast update
   - User deletes → Remove from database, update UI

## Components and Interfaces

### Backend Components

#### 1. Database Schema

**notifications table**:
```sql
CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON NULL,
    action_url VARCHAR(500) NULL,
    icon VARCHAR(50) NULL,
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_created (user_id, created_at DESC),
    INDEX idx_user_read (user_id, read_at),
    INDEX idx_type (type),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**notification_preferences table**:
```sql
CREATE TABLE notification_preferences (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    sound_enabled BOOLEAN DEFAULT TRUE,
    appointment_notifications BOOLEAN DEFAULT TRUE,
    message_notifications BOOLEAN DEFAULT TRUE,
    panic_alert_notifications BOOLEAN DEFAULT TRUE,
    content_notifications BOOLEAN DEFAULT TRUE,
    system_notifications BOOLEAN DEFAULT TRUE,
    quiet_hours_start TIME NULL,
    quiet_hours_end TIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 2. Notification Model

**Location**: `app/Models/Notification.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'data',
        'action_url',
        'icon',
        'priority',
        'read_at',
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function markAsRead(): void
    {
        if (!$this->read_at) {
            $this->update(['read_at' => now()]);
        }
    }

    public function markAsUnread(): void
    {
        $this->update(['read_at' => null]);
    }

    public function isRead(): bool
    {
        return $this->read_at !== null;
    }

    public function isUnread(): bool
    {
        return $this->read_at === null;
    }

    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeRead($query)
    {
        return $query->whereNotNull('read_at');
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeRecent($query, $limit = 10)
    {
        return $query->orderBy('created_at', 'desc')->limit($limit);
    }
}
```

#### 3. NotificationService

**Location**: `app/Services/NotificationService.php`

```php
<?php

namespace App\Services;

use App\Events\NotificationCreated;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Collection;

class NotificationService
{
    /**
     * Notification type constants
     */
    const TYPE_APPOINTMENT_SCHEDULED = 'appointment_scheduled';
    const TYPE_APPOINTMENT_CANCELLED = 'appointment_cancelled';
    const TYPE_APPOINTMENT_REMINDER = 'appointment_reminder';
    const TYPE_MESSAGE_RECEIVED = 'message_received';
    const TYPE_PANIC_ALERT = 'panic_alert';
    const TYPE_PANIC_ALERT_RESOLVED = 'panic_alert_resolved';
    const TYPE_ARTICLE_PUBLISHED = 'article_published';
    const TYPE_COMMENT_RECEIVED = 'comment_received';
    const TYPE_SYSTEM_ANNOUNCEMENT = 'system_announcement';

    /**
     * Create a notification for a user
     */
    public function create(
        int $userId,
        string $type,
        string $title,
        string $message,
        ?array $data = null,
        ?string $actionUrl = null,
        string $priority = 'normal'
    ): Notification {
        $notification = Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data,
            'action_url' => $actionUrl,
            'icon' => $this->getIconForType($type),
            'priority' => $priority,
        ]);

        // Broadcast to user's private channel
        broadcast(new NotificationCreated($notification))->toOthers();

        // Send push notification if enabled
        if ($this->shouldSendPushNotification($userId, $type, $priority)) {
            $this->sendPushNotification($notification);
        }

        return $notification;
    }

    /**
     * Create notifications for multiple users
     */
    public function createBatch(
        array $userIds,
        string $type,
        string $title,
        string $message,
        ?array $data = null,
        ?string $actionUrl = null,
        string $priority = 'normal'
    ): Collection {
        $notifications = collect();

        foreach ($userIds as $userId) {
            $notifications->push(
                $this->create($userId, $type, $title, $message, $data, $actionUrl, $priority)
            );
        }

        return $notifications;
    }

    /**
     * Get unread count for user
     */
    public function getUnreadCount(int $userId): int
    {
        return Notification::forUser($userId)->unread()->count();
    }

    /**
     * Get recent notifications for user
     */
    public function getRecent(int $userId, int $limit = 10): Collection
    {
        return Notification::forUser($userId)
            ->recent($limit)
            ->get();
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(int $notificationId): bool
    {
        $notification = Notification::find($notificationId);
        
        if ($notification) {
            $notification->markAsRead();
            return true;
        }

        return false;
    }

    /**
     * Mark all notifications as read for user
     */
    public function markAllAsRead(int $userId): int
    {
        return Notification::forUser($userId)
            ->unread()
            ->update(['read_at' => now()]);
    }

    /**
     * Delete notification
     */
    public function delete(int $notificationId): bool
    {
        $notification = Notification::find($notificationId);
        
        if ($notification) {
            return $notification->delete();
        }

        return false;
    }

    /**
     * Delete all read notifications for user
     */
    public function deleteAllRead(int $userId): int
    {
        return Notification::forUser($userId)
            ->read()
            ->delete();
    }

    /**
     * Get icon for notification type
     */
    private function getIconForType(string $type): string
    {
        return match ($type) {
            self::TYPE_APPOINTMENT_SCHEDULED,
            self::TYPE_APPOINTMENT_CANCELLED,
            self::TYPE_APPOINTMENT_REMINDER => 'calendar',
            self::TYPE_MESSAGE_RECEIVED => 'message',
            self::TYPE_PANIC_ALERT => 'alert-triangle',
            self::TYPE_PANIC_ALERT_RESOLVED => 'check-circle',
            self::TYPE_ARTICLE_PUBLISHED => 'file-text',
            self::TYPE_COMMENT_RECEIVED => 'message-square',
            self::TYPE_SYSTEM_ANNOUNCEMENT => 'megaphone',
            default => 'bell',
        };
    }

    /**
     * Check if push notification should be sent
     */
    private function shouldSendPushNotification(int $userId, string $type, string $priority): bool
    {
        // Check user preferences
        $preferences = NotificationPreference::forUser($userId)->first();
        
        if (!$preferences || !$preferences->push_notifications) {
            return false;
        }

        // Check quiet hours
        if ($preferences->isInQuietHours()) {
            return false;
        }

        // Only send push for high/urgent priority
        return in_array($priority, ['high', 'urgent']);
    }

    /**
     * Send browser push notification
     */
    private function sendPushNotification(Notification $notification): void
    {
        // Implementation for browser push notifications
        // This would use a service like Laravel WebPush or Firebase Cloud Messaging
    }
}
```

#### 4. NotificationCreated Event

**Location**: `app/Events/NotificationCreated.php`

```php
<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Notification $notification
    ) {}

    public function broadcastOn(): Channel
    {
        return new PrivateChannel('user.' . $this->notification->user_id);
    }

    public function broadcastAs(): string
    {
        return 'notification.created';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->notification->id,
            'type' => $this->notification->type,
            'title' => $this->notification->title,
            'message' => $this->notification->message,
            'icon' => $this->notification->icon,
            'priority' => $this->notification->priority,
            'action_url' => $this->notification->action_url,
            'created_at' => $this->notification->created_at->toISOString(),
        ];
    }
}
```

#### 5. NotificationController

**Location**: `app/Http/Controllers/NotificationController.php`

```php
<?php

namespace App\Http\Controllers;

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
        
        $notifications = Notification::forUser($user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('notifications/index', [
            'notifications' => $notifications,
            'unreadCount' => $this->notificationService->getUnreadCount($user->id),
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

        return response()->json([
            'success' => true,
            'marked_count' => $count,
        ]);
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

        return response()->json([
            'success' => true,
            'unread_count' => $this->notificationService->getUnreadCount($request->user()->id),
        ]);
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
```

### Frontend Components

#### 1. NotificationBell Component

**Location**: `resources/js/components/notification-bell.tsx`

```typescript
import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NotificationDropdown from './notification-dropdown';
import { useNotifications } from '@/hooks/use-notifications';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const { unreadCount, notifications, markAsRead, deleteNotification } = useNotifications();

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="relative"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        variant="destructive"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                )}
            </Button>

            {isOpen && (
                <NotificationDropdown
                    notifications={notifications}
                    onClose={() => setIsOpen(false)}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                />
            )}
        </div>
    );
}
```

#### 2. useNotifications Hook

**Location**: `resources/js/hooks/use-notifications.ts`

```typescript
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Echo from 'laravel-echo';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    icon: string;
    priority: string;
    action_url: string | null;
    read_at: string | null;
    created_at: string;
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Fetch initial notifications
        fetchNotifications();

        // Listen for real-time notifications
        const userId = (window as any).userId; // Set this in your layout
        
        window.Echo.private(`user.${userId}`)
            .listen('.notification.created', (event: any) => {
                // Add new notification to list
                setNotifications(prev => [event, ...prev]);
                setUnreadCount(prev => prev + 1);
                
                // Show toast for high priority
                if (event.priority === 'high' || event.priority === 'urgent') {
                    showToast(event);
                }
                
                // Play sound if enabled
                playNotificationSound();
            });

        return () => {
            window.Echo.leave(`user.${userId}`);
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/notifications/recent');
            const data = await response.json();
            setNotifications(data.notifications);
            setUnreadCount(data.unread_count);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const markAsRead = async (notificationId: number) => {
        try {
            const response = await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            
            const data = await response.json();
            
            // Update local state
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n)
            );
            setUnreadCount(data.unread_count);
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const deleteNotification = async (notificationId: number) => {
        try {
            await fetch(`/api/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            
            // Update local state
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            setUnreadCount(prev => {
                const notification = notifications.find(n => n.id === notificationId);
                return notification && !notification.read_at ? prev - 1 : prev;
            });
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const showToast = (notification: Notification) => {
        // Implementation for toast notification
    };

    const playNotificationSound = () => {
        // Implementation for notification sound
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(() => {});
    };

    return {
        notifications,
        unreadCount,
        markAsRead,
        deleteNotification,
        fetchNotifications,
    };
}
```

## Data Models

### Notification Types

```typescript
enum NotificationType {
    APPOINTMENT_SCHEDULED = 'appointment_scheduled',
    APPOINTMENT_CANCELLED = 'appointment_cancelled',
    APPOINTMENT_REMINDER = 'appointment_reminder',
    MESSAGE_RECEIVED = 'message_received',
    PANIC_ALERT = 'panic_alert',
    PANIC_ALERT_RESOLVED = 'panic_alert_resolved',
    ARTICLE_PUBLISHED = 'article_published',
    COMMENT_RECEIVED = 'comment_received',
    SYSTEM_ANNOUNCEMENT = 'system_announcement',
}

enum NotificationPriority {
    LOW = 'low',
    NORMAL = 'normal',
    HIGH = 'high',
    URGENT = 'urgent',
}
```

## Error Handling

1. **WebSocket Connection Failures**:
   - Implement automatic reconnection with exponential backoff
   - Fall back to polling if WebSocket unavailable
   - Display connection status indicator

2. **API Failures**:
   - Retry failed requests with exponential backoff
   - Show user-friendly error messages
   - Log errors for debugging

3. **Database Errors**:
   - Wrap database operations in try-catch
   - Log errors with context
   - Return graceful error responses

## Testing Strategy

### Unit Tests
- NotificationService methods
- Notification model methods
- Event broadcasting

### Feature Tests
- Notification creation and delivery
- Mark as read/unread
- Delete notifications
- Real-time broadcasting

### Integration Tests
- End-to-end notification flow
- WebSocket connection and delivery
- Browser push notifications

## Performance Considerations

1. **Database Optimization**:
   - Index on user_id and created_at
   - Archive old notifications (>90 days)
   - Use pagination for large lists

2. **Real-Time Delivery**:
   - Use private channels to reduce broadcast overhead
   - Implement message queuing for batch notifications
   - Cache unread counts

3. **Frontend Optimization**:
   - Lazy load notification list
   - Debounce API calls
   - Use React.memo for components

## Security Considerations

1. **Authorization**:
   - Verify user owns notification before actions
   - Use private WebSocket channels
   - Validate CSRF tokens

2. **Data Privacy**:
   - Don't expose sensitive data in notifications
   - Encrypt notification data if needed
   - Respect user privacy preferences

3. **Rate Limiting**:
   - Limit notification creation per user
   - Throttle API endpoints
   - Prevent notification spam

## Future Enhancements

1. **Notification Grouping**: Combine similar notifications
2. **Rich Notifications**: Support images, buttons, actions
3. **Notification Templates**: Reusable notification formats
4. **Analytics**: Track notification engagement
5. **A/B Testing**: Test notification effectiveness
6. **Multi-language**: Support internationalization
