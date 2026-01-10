import { Bell } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NotificationDropdown from './notification-dropdown';
import { useNotifications } from '@/hooks/use-notifications';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const { unreadCount, notifications, markAsRead, markAsUnread, markAllAsRead, deleteNotification } = useNotifications();

    const displayCount = unreadCount > 99 ? '99+' : unreadCount;

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className={`relative ${unreadCount > 0 ? 'text-primary' : ''}`}
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge
                        className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 px-1 text-xs"
                        variant="destructive"
                    >
                        {displayCount}
                    </Badge>
                )}
            </Button>

            {isOpen && (
                <NotificationDropdown
                    notifications={notifications}
                    onClose={() => setIsOpen(false)}
                    onMarkAsRead={markAsRead}
                    onMarkAsUnread={markAsUnread}
                    onMarkAllAsRead={markAllAsRead}
                    onDelete={deleteNotification}
                />
            )}
        </div>
    );
}
