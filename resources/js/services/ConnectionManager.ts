import Echo from 'laravel-echo';

export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting' | 'error';

export interface ConnectionEvent {
    type: 'connected' | 'disconnected' | 'reconnecting' | 'error';
    timestamp: Date;
    error?: any;
}

export interface ConnectionManagerOptions {
    maxReconnectAttempts?: number;
    reconnectInterval?: number;
    heartbeatInterval?: number;
    onStatusChange?: (status: ConnectionStatus) => void;
    onEvent?: (event: ConnectionEvent) => void;
}

export class ConnectionManager {
    private echo: Echo | null = null;
    private status: ConnectionStatus = 'disconnected';
    private reconnectAttempts = 0;
    private maxReconnectAttempts: number;
    private reconnectInterval: number;
    private heartbeatInterval: number;
    private heartbeatTimer: NodeJS.Timeout | null = null;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private listeners: Set<(status: ConnectionStatus) => void> = new Set();
    private eventListeners: Set<(event: ConnectionEvent) => void> = new Set();
    private isManualDisconnect = false;

    constructor(options: ConnectionManagerOptions = {}) {
        this.maxReconnectAttempts = options.maxReconnectAttempts ?? 5;
        this.reconnectInterval = options.reconnectInterval ?? 1000;
        this.heartbeatInterval = options.heartbeatInterval ?? 30000;

        if (options.onStatusChange) {
            this.listeners.add(options.onStatusChange);
        }

        if (options.onEvent) {
            this.eventListeners.add(options.onEvent);
        }

        this.initialize();
    }

    private initialize(): void {
        if (typeof window !== 'undefined' && window.Echo) {
            this.echo = window.Echo;
            this.setupConnectionListeners();
            this.startHeartbeat();
        }
    }

    private setupConnectionListeners(): void {
        if (!this.echo?.connector?.pusher?.connection) {
            console.warn('Pusher connection not available');
            return;
        }

        const connection = this.echo.connector.pusher.connection;

        connection.bind('connected', () => {
            this.handleConnectionEstablished();
        });

        connection.bind('disconnected', () => {
            this.handleConnectionLost();
        });

        connection.bind('connecting', () => {
            this.handleReconnecting();
        });

        connection.bind('error', (error: any) => {
            this.handleConnectionError(error);
        });

        connection.bind('unavailable', () => {
            this.handleConnectionUnavailable();
        });

        // Check initial connection state
        if (connection.state === 'connected') {
            this.handleConnectionEstablished();
        } else if (connection.state === 'connecting') {
            this.handleReconnecting();
        } else {
            this.handleConnectionLost();
        }
    }

    private handleConnectionEstablished(): void {
        console.log('WebSocket connection established');
        this.status = 'connected';
        this.reconnectAttempts = 0;
        this.isManualDisconnect = false;

        this.clearReconnectTimer();
        this.emitStatusChange();
        this.emitEvent({ type: 'connected', timestamp: new Date() });
    }

    private handleConnectionLost(): void {
        console.log('WebSocket connection lost');

        if (this.status !== 'disconnected') {
            this.status = 'disconnected';
            this.emitStatusChange();
            this.emitEvent({ type: 'disconnected', timestamp: new Date() });
        }

        if (!this.isManualDisconnect) {
            this.attemptReconnection();
        }
    }

    private handleReconnecting(): void {
        console.log('WebSocket reconnecting...');
        this.status = 'reconnecting';
        this.emitStatusChange();
        this.emitEvent({ type: 'reconnecting', timestamp: new Date() });
    }

    private handleConnectionError(error: any): void {
        console.error('WebSocket connection error:', error);
        this.status = 'error';
        this.emitStatusChange();
        this.emitEvent({ type: 'error', timestamp: new Date(), error });

        if (!this.isManualDisconnect) {
            this.attemptReconnection();
        }
    }

    private handleConnectionUnavailable(): void {
        console.warn('WebSocket connection unavailable');
        this.status = 'error';
        this.emitStatusChange();
        this.emitEvent({ type: 'error', timestamp: new Date(), error: 'Connection unavailable' });
    }

    private attemptReconnection(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error(`Max reconnection attempts (${this.maxReconnectAttempts}) reached`);
            this.status = 'error';
            this.emitStatusChange();
            return;
        }

        this.reconnectAttempts++;
        const delay = this.calculateReconnectDelay();

        console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);

        this.reconnectTimer = setTimeout(() => {
            if (this.echo?.connector?.pusher) {
                try {
                    this.echo.connector.pusher.connect();
                } catch (error) {
                    console.error('Failed to reconnect:', error);
                    this.attemptReconnection();
                }
            }
        }, delay);
    }

    private calculateReconnectDelay(): number {
        // Exponential backoff with jitter
        const baseDelay = this.reconnectInterval;
        const exponentialDelay = baseDelay * Math.pow(2, this.reconnectAttempts - 1);
        const maxDelay = 30000; // 30 seconds max
        const jitter = Math.random() * 1000; // Add up to 1 second of jitter

        return Math.min(exponentialDelay + jitter, maxDelay);
    }

    private startHeartbeat(): void {
        this.heartbeatTimer = setInterval(() => {
            this.performHeartbeat();
        }, this.heartbeatInterval);
    }

    private performHeartbeat(): void {
        if (this.status === 'connected' && this.echo?.connector?.pusher?.connection) {
            try {
                // Send a ping to check connection health
                this.echo.connector.pusher.connection.send_event('pusher:ping', {});
            } catch (error) {
                console.warn('Heartbeat failed:', error);
                this.handleConnectionError(error);
            }
        }
    }

    private clearReconnectTimer(): void {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
    }

    private emitStatusChange(): void {
        this.listeners.forEach(listener => {
            try {
                listener(this.status);
            } catch (error) {
                console.error('Error in status change listener:', error);
            }
        });
    }

    private emitEvent(event: ConnectionEvent): void {
        this.eventListeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('Error in event listener:', error);
            }
        });
    }

    // Public API
    public getStatus(): ConnectionStatus {
        return this.status;
    }

    public isConnected(): boolean {
        return this.status === 'connected';
    }

    public getReconnectAttempts(): number {
        return this.reconnectAttempts;
    }

    public getMaxReconnectAttempts(): number {
        return this.maxReconnectAttempts;
    }

    public onStatusChange(listener: (status: ConnectionStatus) => void): () => void {
        this.listeners.add(listener);

        // Return unsubscribe function
        return () => {
            this.listeners.delete(listener);
        };
    }

    public onEvent(listener: (event: ConnectionEvent) => void): () => void {
        this.eventListeners.add(listener);

        // Return unsubscribe function
        return () => {
            this.eventListeners.delete(listener);
        };
    }

    public forceReconnect(): void {
        console.log('Forcing reconnection...');
        this.reconnectAttempts = 0;
        this.isManualDisconnect = false;

        if (this.echo?.connector?.pusher) {
            try {
                this.echo.connector.pusher.disconnect();
                setTimeout(() => {
                    this.echo?.connector?.pusher?.connect();
                }, 1000);
            } catch (error) {
                console.error('Failed to force reconnect:', error);
            }
        }
    }

    public disconnect(): void {
        console.log('Manually disconnecting...');
        this.isManualDisconnect = true;
        this.clearReconnectTimer();

        if (this.echo?.connector?.pusher) {
            try {
                this.echo.connector.pusher.disconnect();
            } catch (error) {
                console.error('Failed to disconnect:', error);
            }
        }
    }

    public connect(): void {
        console.log('Manually connecting...');
        this.isManualDisconnect = false;
        this.reconnectAttempts = 0;

        if (this.echo?.connector?.pusher) {
            try {
                this.echo.connector.pusher.connect();
            } catch (error) {
                console.error('Failed to connect:', error);
            }
        }
    }

    public destroy(): void {
        console.log('Destroying connection manager...');
        this.isManualDisconnect = true;
        this.clearReconnectTimer();

        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }

        this.listeners.clear();
        this.eventListeners.clear();
    }
}

// Global connection manager instance
let globalConnectionManager: ConnectionManager | null = null;

export function getConnectionManager(): ConnectionManager {
    if (!globalConnectionManager) {
        globalConnectionManager = new ConnectionManager();
    }
    return globalConnectionManager;
}

export function createConnectionManager(options?: ConnectionManagerOptions): ConnectionManager {
    return new ConnectionManager(options);
}
