import { useState, useEffect, useCallback, useRef } from 'react';

export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';

interface UseWebSocketConnectionOptions {
    maxReconnectAttempts?: number;
    reconnectInterval?: number;
    onConnected?: () => void;
    onDisconnected?: () => void;
    onReconnecting?: (attempt: number) => void;
}

export function useWebSocketConnection(options: UseWebSocketConnectionOptions = {}) {
    const {
        maxReconnectAttempts = 10,
        reconnectInterval = 1000,
        onConnected,
        onDisconnected,
        onReconnecting,
    } = options;

    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const [reconnectAttempt, setReconnectAttempt] = useState(0);
    const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isManualDisconnectRef = useRef(false);
    const [isEchoReady, setIsEchoReady] = useState(false);

    // Wait for Echo to be initialized
    useEffect(() => {
        const checkEcho = setInterval(() => {
            if (window.Echo?.connector?.pusher?.connection) {
                setIsEchoReady(true);
                clearInterval(checkEcho);
            }
        }, 100);

        // Timeout after 10 seconds
        const timeout = setTimeout(() => {
            clearInterval(checkEcho);
            if (!window.Echo?.connector?.pusher?.connection) {
                console.warn('Echo not available after 10 seconds');
            }
        }, 10000);

        return () => {
            clearInterval(checkEcho);
            clearTimeout(timeout);
        };
    }, []);

    const clearReconnectTimer = useCallback(() => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
    }, []);

    const attemptReconnect = useCallback(() => {
        if (isManualDisconnectRef.current) return;
        if (reconnectAttempt >= maxReconnectAttempts) {
            console.error(`Max reconnection attempts (${maxReconnectAttempts}) reached`);
            return;
        }

        const attempt = reconnectAttempt + 1;
        setReconnectAttempt(attempt);
        setStatus('reconnecting');
        onReconnecting?.(attempt);

        const delay = Math.min(reconnectInterval * Math.pow(2, attempt - 1), 30000);
        console.log(`Reconnecting in ${delay}ms (attempt ${attempt}/${maxReconnectAttempts})`);

        reconnectTimerRef.current = setTimeout(() => {
            if (window.Echo?.connector?.pusher) {
                try {
                    window.Echo.connector.pusher.connect();
                } catch (error) {
                    console.error('Reconnection failed:', error);
                }
            }
        }, delay);
    }, [reconnectAttempt, maxReconnectAttempts, reconnectInterval, onReconnecting]);

    useEffect(() => {
        if (!isEchoReady || !window.Echo?.connector?.pusher?.connection) {
            return;
        }

        const connection = window.Echo.connector.pusher.connection;
        console.log('🔍 Initial connection state:', connection.state);

        const handleConnected = () => {
            console.log('✅ WebSocket connected');
            setStatus('connected');
            setReconnectAttempt(0);
            clearReconnectTimer();
            onConnected?.();
        };

        const handleDisconnected = () => {
            console.log('❌ WebSocket disconnected');
            setStatus('disconnected');
            onDisconnected?.();
            attemptReconnect();
        };

        const handleError = (error: any) => {
            console.error('❌ WebSocket error:', error);
            setStatus('disconnected');
            attemptReconnect();
        };

        connection.bind('connected', handleConnected);
        connection.bind('disconnected', handleDisconnected);
        connection.bind('error', handleError);
        connection.bind('unavailable', handleDisconnected);

        // Check initial state
        if (connection.state === 'connected') {
            handleConnected();
        } else if (connection.state === 'disconnected') {
            handleDisconnected();
        }

        return () => {
            connection.unbind('connected', handleConnected);
            connection.unbind('disconnected', handleDisconnected);
            connection.unbind('error', handleError);
            connection.unbind('unavailable', handleDisconnected);
            clearReconnectTimer();
        };
    }, [isEchoReady, attemptReconnect, clearReconnectTimer, onConnected, onDisconnected]);

    const forceReconnect = useCallback(() => {
        setReconnectAttempt(0);
        isManualDisconnectRef.current = false;
        clearReconnectTimer();
        
        if (window.Echo?.connector?.pusher) {
            window.Echo.connector.pusher.disconnect();
            setTimeout(() => window.Echo?.connector?.pusher?.connect(), 500);
        }
    }, [clearReconnectTimer]);

    return {
        status,
        reconnectAttempt,
        maxReconnectAttempts,
        forceReconnect,
        isConnected: status === 'connected',
    };
}
