import { Head, Link } from '@inertiajs/react';
import { Bell, Check, Trash2, Calendar, MessageCircle, AlertTriangle, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    data?: any;
    action_url?: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    read_at?: string;
    created_at: string;
}

interface PaginatedNotifications {
    data: Notification[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    notifications: PaginatedNotifications;
    unreadCount: number;
}

export default function NotificationsIndex({ notifications, unreadCount }: Props) {
    const notificationList = notifications.data || [];
    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'appointment_scheduled':
            case 'appointment_confirmed':
            case 'appointment_cancelled':
            case 'appointment_reminder':
                return <Calendar className="h-5 w-5" />;
            case 'message_received':
            case 'group_message':
                return <MessageCircle className="h-5 w-5" />;
            case 'panic_alert':
            case 'emergency':
                return <AlertTriangle className="h-5 w-5 text-red-600" />;
            case 'group_invitation':
            case 'group_join_request':
                return <Users className="h-5 w-5" />;
            default:
                return <Bell className="h-5 w-5" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'normal':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'low':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <AppLayout>
            <Head title="Notifications" />

            <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-full overflow-x-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Notifications</h1>
                        <p className="text-muted-foreground">
                            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <Button variant="outline" asChild>
                            <Link href="/api/notifications/mark-all-read" method="post" as="button">
                                <Check className="h-4 w-4 mr-2" />
                                Mark All as Read
                            </Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            All Notifications
                        </CardTitle>
                        <CardDescription>
                            Stay updated with your latest activities
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {notificationList.length === 0 ? (
                            <div className="text-center py-12">
                                <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                                <p className="text-muted-foreground">
                                    You're all caught up! Check back later for updates.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {notificationList.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 border rounded-lg transition-colors ${!notification.read_at ? 'bg-blue-50 border-blue-200' : 'bg-white'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.priority === 'urgent' ? 'bg-red-100' :
                                                notification.priority === 'high' ? 'bg-orange-100' :
                                                    'bg-blue-100'
                                                }`}>
                                                {getNotificationIcon(notification.type)}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h4 className="font-semibold text-sm">
                                                        {notification.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        {notification.priority !== 'normal' && (
                                                            <Badge className={getPriorityColor(notification.priority)} variant="outline">
                                                                {notification.priority}
                                                            </Badge>
                                                        )}
                                                        {!notification.read_at && (
                                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {notification.message}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                    </p>

                                                    <div className="flex items-center gap-2">
                                                        {notification.action_url && (
                                                            <Button size="sm" variant="outline" asChild>
                                                                <Link href={notification.action_url}>
                                                                    View
                                                                </Link>
                                                            </Button>
                                                        )}

                                                        {!notification.read_at && (
                                                            <Button size="sm" variant="ghost" asChild>
                                                                <Link href={`/api/notifications/${notification.id}/read`} method="post" as="button">
                                                                    <Check className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        )}

                                                        <Button size="sm" variant="ghost" asChild>
                                                            <Link href={`/api/notifications/${notification.id}`} method="delete" as="button">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
