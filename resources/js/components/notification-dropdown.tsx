import { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { 
    Calendar, 
    MessageSquare, 
    AlertTriangle, 
    CheckCircle, 
    FileText, 
    MessageCircle, 
    Megaphone, 
    Bell,
    X,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface NotificationDropdownProps {
    notifications: Notification[];
    onClose: () => void;
    onMarkAsRead: (id: number) => void;
    onMarkAsUnread: (id: number) => void;
    onMarkAllAsRead: () => void;
    onDelete: (id: number) => void;
}

const iconMap: Record<string, any> = {
    calendar: Calendar,
    message: MessageSquare,
    'alert-triangle': AlertTriangle,
    'check-circle': CheckCircle,
    'file-text': FileText,
    'message-square': MessageCircle,
    megaphone: Megaphone,
    bell: Bell,
};

export default function NotificationDropdown({
    notifications,
    onClose,
    onMarkAsRead,
    onMarkAsUnread,
    onMarkAllAsRead,
    onDelete,
}: NotificationDropdownProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read_at) {
            onMarkAsRead(notification.id);
        }
        
        if (notification.action_url) {
            onClose();
        }
    };

    const getIcon = (iconName: string) => {
        const IconComponent = iconMap[iconName] || Bell;
        return <IconComponent className="h-5 w-5" />;
    };

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold">Notifications</h3>
                {notifications.some(n => !n.read_at) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onMarkAllAsRead}
                        className="text-xs"
                    >
                        Mark All as Read
                    </Button>
                )}
            </div>

            {/* Notification List */}
            <ScrollArea className="h-96">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <Bell className="h-12 w-12 mb-2 opacity-50" />
                        <p>No notifications</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                    !notification.read_at ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                }`}
                            >
                                <div className="flex gap-3">
                                    {/* Icon */}
                                    <div className={`flex-shrink-0 ${
                                        !notification.read_at ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
                                    }`}>
                                        {getIcon(notification.icon)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        {notification.action_url ? (
                                            <Link
                                                href={notification.action_url}
                                                onClick={() => handleNotificationClick(notification)}
                                                className="block"
                                            >
                                                <h4 className={`text-sm font-medium ${
                                                    !notification.read_at ? 'font-semibold' : ''
                                                }`}>
                                                    {notification.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                </p>
                                            </Link>
                                        ) : (
                                            <>
                                                <h4 className={`text-sm font-medium ${
                                                    !notification.read_at ? 'font-semibold' : ''
                                                }`}>
                                                    {notification.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex-shrink-0 flex gap-1">
                                        {notification.read_at ? (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => onMarkAsUnread(notification.id)}
                                                title="Mark as unread"
                                            >
                                                <Bell className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => onMarkAsRead(notification.id)}
                                                title="Mark as read"
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-600 hover:text-red-700"
                                            onClick={() => onDelete(notification.id)}
                                            title="Delete"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                    <Link
                        href="/notifications"
                        onClick={onClose}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                        View All Notifications
                    </Link>
                </div>
            )}
        </div>
    );
}
