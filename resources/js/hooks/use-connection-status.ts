import { useEffect, useState, useCallback } from 'react';
import { ConnectionManager, ConnectionStatus, ConnectionEvent, getConnectionManager } from '@/services/ConnectionManager';

export interface UseConnectionStatusOptions {
    autoReconnect?: boolean;
    showNotifications?: boolean;
}

export interface ConnectionInfo {
    status: ConnectionStatus;
    isConnected: boolean;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
    lastEvent?: ConnectionEvent;
}

export function useConnectionStatus(options: UseConnectionStatusOptions = {}) {
    const { autoReconnect = true, showNotifications = true } = options;

    const [connectionManager] = useState<ConnectionManager>(() => getConnectionManager());
    const [status, setStatus] = useState<ConnectionStatus>(() => connectionManager.getStatus());
    const [lastEvent, setLastEvent] = useState<ConnectionEvent | undefined>();
    const [reconnectAttempts, setReconnectAttempts] = useState(() => connectionManager.getReconnectAttempts());

    // Update status when connection manager status changes
    useEffect(() => {
        const unsubscribeStatus = connectionManager.onStatusChange((newStatus) => {
            setStatus(newStatus);
            setReconnectAttempts(connectionManager.getReconnectAttempts());
        });

        const unsubscribeEvents = connectionManager.onEvent((event) => {
            setLastEvent(event);

            if (showNotifications) {
                handleConnectionNotification(event);
            }
        });

        return () => {
            unsubscribeStatus();
            unsubscribeEvents();
        };
    }, [connectionManager, showNotifications]);

    const handleConnectionNotification = useCallback((event: ConnectionEvent) => {
        // Only show notifications for significant events
        switch (event.type) {
            case 'connected':
                if (reconnectAttempts > 0) {
                    // Only show notification if we were previously disconnected
                    console.log('✅ Connection restored');
                }
                break;
            case 'disconnected':
                console.warn('⚠️ Connection lost. Attempting to reconnect...');
                break;
            case 'error':
                console.error('❌ Connection error:', event.error);
                break;
        }
    }, [reconnectAttempts]);

    const forceReconnect = useCallback(() => {
        connectionManager.forceReconnect();
    }, [connectionManager]);

    const disconnect = useCallback(() => {
        connectionManager.disconnect();
    }, [connectionManager]);

    const connect = useCallback(() => {
        connectionManager.connect();
    }, [connectionManager]);

    const connectionInfo: ConnectionInfo = {
        status,
        isConnected: status === 'connected',
        reconnectAttempts,
        maxReconnectAttempts: connectionManager.getMaxReconnectAttempts(),
        lastEvent,
    };

    return {
        ...connectionInfo,
        forceReconnect,
        disconnect,
        connect,
    };
}

// Hook for components that need to know if they should show connection-dependent UI
export function useIsOnline() {
    const { isConnected } = useConnectionStatus({ showNotifications: false });
    return isConnected;
}

// Hook for getting just the connection status without all the extras
export function useConnectionStatusOnly() {
    const { status } = useConnectionStatus({ showNotifications: false });
    return status;
}
