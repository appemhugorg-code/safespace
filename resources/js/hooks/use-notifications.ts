import { useState, useEffect, useCallback } from 'react';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { playNotificationSound } from '@/utils/notification-sound';
import axios from 'axios';

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
    const { auth } = usePage().props as any;
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        if (!auth?.user) return;

        try {
            setIsLoading(true);
            const response = await axios.get('/api/notifications/recent');
            const data = response.data;
            setNotifications(data.notifications);
            setUnreadCount(data.unread_count);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, [auth?.user]);

    useEffect(() => {
        if (!auth?.user) return;

        // Fetch initial notifications
        fetchNotifications();

        // Listen for real-time notifications
        const userId = auth.user.id;

        const channel = window.Echo.private(`user.${userId}`);

        channel.listen('.notification.created', (event: any) => {
            // Add new notification to list
            setNotifications(prev => [event, ...prev.slice(0, 9)]);
            setUnreadCount(prev => prev + 1);

            // Show toast for high priority
            if (event.priority === 'high' || event.priority === 'urgent') {
                toast(event.title, {
                    description: event.message,
                    duration: 5000,
                });
            }

            // Play sound if enabled
            playNotificationSound();
        });

        return () => {
            window.Echo.leave(`user.${userId}`);
        };
    }, [auth?.user, fetchNotifications]);

    const markAsRead = async (notificationId: number) => {
        try {
            const response = await axios.post(`/api/notifications/${notificationId}/read`);
            const data = response.data;

            // Update local state
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n)
            );
            setUnreadCount(data.unread_count);
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAsUnread = async (notificationId: number) => {
        try {
            const response = await axios.post(`/api/notifications/${notificationId}/unread`);
            const data = response.data;

            // Update local state
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read_at: null } : n)
            );
            setUnreadCount(data.unread_count);
        } catch (error) {
            console.error('Failed to mark as unread:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post('/api/notifications/mark-all-read');

            // Update local state
            setNotifications(prev =>
                prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
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
            const notification = notifications.find(n => n.id === notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            if (notification && !notification.read_at) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    return {
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification,
        fetchNotifications,
    };
}
