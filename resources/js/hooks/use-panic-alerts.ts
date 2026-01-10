import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Echo from 'laravel-echo';

interface PanicAlert {
    id: number;
    child: {
        id: number;
        name: string;
    };
    triggered_at: string;
    status: 'active' | 'acknowledged' | 'resolved';
    resolved_at?: string;
    resolved_by?: {
        id: number;
        name: string;
    };
    location_data?: {
        latitude: number;
        longitude: number;
        accuracy: number;
    };
    notes?: string;
}

interface PanicAlertEvent {
    alert: PanicAlert;
    message: string;
    timestamp: string;
    updated_by?: {
        id: number;
        name: string;
    };
    action?: string;
}

export function usePanicAlerts() {
    const { auth } = usePage().props as any;
    const [alerts, setAlerts] = useState<PanicAlert[]>([]);
    const [unviewedCount, setUnviewedCount] = useState(0);
    const [latestAlert, setLatestAlert] = useState<PanicAlert | null>(null);

    useEffect(() => {
        if (!auth?.user || !window.Echo) return;

        const user = auth.user;

        // Listen to user-specific channel
        const userChannel = window.Echo.private(`user.${user.id}`);

        // Listen for new panic alerts
        userChannel.listen('.panic-alert.triggered', (event: PanicAlertEvent) => {
            console.log('New panic alert received:', event);

            setAlerts(prev => [event.alert, ...prev]);
            setUnviewedCount(prev => prev + 1);
            setLatestAlert(event.alert);

            // Show browser notification if supported
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Emergency Alert', {
                    body: event.message,
                    icon: '/favicon.ico',
                    tag: `panic-alert-${event.alert.id}`,
                });
            }

            // Play alert sound (optional)
            try {
                const audio = new Audio('/sounds/alert.mp3');
                audio.play().catch(() => {
                    // Ignore if audio fails to play
                });
            } catch (error) {
                // Ignore audio errors
            }
        });

        // Listen for status changes
        userChannel.listen('.panic-alert.status-changed', (event: PanicAlertEvent) => {
            console.log('Panic alert status changed:', event);

            setAlerts(prev =>
                prev.map(alert =>
                    alert.id === event.alert.id ? event.alert : alert
                )
            );
            setLatestAlert(event.alert);

            // Show notification for status changes
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Alert Update', {
                    body: event.message,
                    icon: '/favicon.ico',
                    tag: `panic-alert-update-${event.alert.id}`,
                });
            }
        });

        // Also listen to emergency alerts channel if user has appropriate role
        if (user.roles?.some((role: any) => ['admin', 'therapist', 'guardian'].includes(role.name))) {
            const emergencyChannel = window.Echo.private('emergency-alerts');

            emergencyChannel.listen('.panic-alert.triggered', (event: PanicAlertEvent) => {
                console.log('Emergency alert received on emergency channel:', event);

                // Only add if not already in alerts (to avoid duplicates)
                setAlerts(prev => {
                    const exists = prev.some(alert => alert.id === event.alert.id);
                    return exists ? prev : [event.alert, ...prev];
                });

                setUnviewedCount(prev => prev + 1);
            });

            emergencyChannel.listen('.panic-alert.status-changed', (event: PanicAlertEvent) => {
                setAlerts(prev =>
                    prev.map(alert =>
                        alert.id === event.alert.id ? event.alert : alert
                    )
                );
            });
        }

        // Request notification permission if not already granted
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Cleanup function
        return () => {
            userChannel.stopListening('.panic-alert.triggered');
            userChannel.stopListening('.panic-alert.status-changed');

            if (user.roles?.some((role: any) => ['admin', 'therapist', 'guardian'].includes(role.name))) {
                const emergencyChannel = window.Echo.private('emergency-alerts');
                emergencyChannel.stopListening('.panic-alert.triggered');
                emergencyChannel.stopListening('.panic-alert.status-changed');
            }
        };
    }, [auth?.user]);

    const markAsViewed = (alertId: number) => {
        setUnviewedCount(prev => Math.max(0, prev - 1));
    };

    const updateAlert = (updatedAlert: PanicAlert) => {
        setAlerts(prev =>
            prev.map(alert =>
                alert.id === updatedAlert.id ? updatedAlert : alert
            )
        );
    };

    return {
        alerts,
        unviewedCount,
        latestAlert,
        markAsViewed,
        updateAlert,
        setUnviewedCount,
    };
}
