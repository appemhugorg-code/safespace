import { useState } from 'react';
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
    Check,
    Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: number) => void;
    onMarkAsUnread: (id: number) => void;
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

export default function NotificationItem({
    notification,
    onMarkAsRead,
    onMarkAsUnread,
    onDelete,
}: NotificationItemProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleClick = () => {
        if (!notification.read_at) {
            onMarkAsRead(notification.id);
        }
    };

    const handleDelete = () => {
        onDelete(notification.id);
        setShowDeleteDialog(false);
    };

    const getIcon = (iconName: string) => {
        const IconComponent = iconMap[iconName] || Bell;
        return <IconComponent className="h-6 w-6" />;
    };

    const isUnread = !notification.read_at;

    return (
        <>
            <div
                className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors ${isUnread ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-gray-800'
                    } hover:shadow-md`}
            >
                <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 ${isUnread ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                        {getIcon(notification.icon)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {notification.action_url ? (
                            <Link
                                href={notification.action_url}
                                onClick={handleClick}
                                className="block group"
                            >
                                <h4 className={`text-base ${isUnread ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'
                                    } group-hover:text-blue-600 dark:group-hover:text-blue-400`}>
                                    {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                </p>
                            </Link>
                        ) : (
                            <>
                                <h4 className={`text-base ${isUnread ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'
                                    }`}>
                                    {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex gap-2">
                        {isUnread ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onMarkAsRead(notification.id)}
                                title="Mark as read"
                            >
                                <Check className="h-4 w-4 mr-1" />
                                Mark Read
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onMarkAsUnread(notification.id)}
                                title="Mark as unread"
                            >
                                <Bell className="h-4 w-4 mr-1" />
                                Mark Unread
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDeleteDialog(true)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Delete notification"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Notification</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this notification? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
