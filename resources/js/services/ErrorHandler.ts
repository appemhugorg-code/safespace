export interface ErrorInfo {
    id: string;
    type: ErrorType;
    message: string;
    details?: any;
    timestamp: Date;
    context?: ErrorContext;
    severity: ErrorSeverity;
    recoverable: boolean;
    recoveryActions?: RecoveryAction[];
}

export type ErrorType =
    | 'network'
    | 'websocket'
    | 'api'
    | 'validation'
    | 'permission'
    | 'timeout'
    | 'unknown';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorContext {
    component?: string;
    action?: string;
    userId?: number;
    url?: string;
    userAgent?: string;
    additionalData?: Record<string, any>;
}

export interface RecoveryAction {
    label: string;
    action: () => void | Promise<void>;
    primary?: boolean;
}

export interface ErrorHandlerOptions {
    enableLogging?: boolean;
    enableReporting?: boolean;
    maxErrors?: number;
    onError?: (error: ErrorInfo) => void;
}

export class ErrorHandler {
    private errors: Map<string, ErrorInfo> = new Map();
    private listeners: Set<(errors: ErrorInfo[]) => void> = new Set();
    private options: ErrorHandlerOptions;

    constructor(options: ErrorHandlerOptions = {}) {
        this.options = {
            enableLogging: true,
            enableReporting: false,
            maxErrors: 100,
            ...options,
        };

        // Set up global error handlers
        this.setupGlobalHandlers();
    }

    private setupGlobalHandlers(): void {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'unknown',
                message: 'Unhandled promise rejection',
                details: event.reason,
                severity: 'high',
                recoverable: false,
                context: {
                    component: 'global',
                    action: 'unhandledrejection',
                },
            });
        });

        // Handle JavaScript errors
        window.addEventListener('error', (event) => {
            this.handleError({
                type: 'unknown',
                message: event.message || 'JavaScript error',
                details: {
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    error: event.error,
                },
                severity: 'medium',
                recoverable: false,
                context: {
                    component: 'global',
                    action: 'javascript-error',
                },
            });
        });
    }

    public handleError(errorData: Partial<ErrorInfo> & { message: string }): string {
        const errorId = this.generateErrorId();

        const error: ErrorInfo = {
            id: errorId,
            type: errorData.type || 'unknown',
            message: errorData.message,
            details: errorData.details,
            timestamp: new Date(),
            context: {
                url: window.location.href,
                userAgent: navigator.userAgent,
                ...errorData.context,
            },
            severity: errorData.severity || 'medium',
            recoverable: errorData.recoverable ?? true,
            recoveryActions: errorData.recoveryActions || this.getDefaultRecoveryActions(errorData.type || 'unknown'),
        };

        // Store error
        this.errors.set(errorId, error);

        // Limit stored errors
        if (this.errors.size > (this.options.maxErrors || 100)) {
            const oldestId = Array.from(this.errors.keys())[0];
            this.errors.delete(oldestId);
        }

        // Log error
        if (this.options.enableLogging) {
            this.logError(error);
        }

        // Report error
        if (this.options.enableReporting) {
            this.reportError(error);
        }

        // Notify listeners
        this.notifyListeners();

        // Call custom error handler
        if (this.options.onError) {
            try {
                this.options.onError(error);
            } catch (e) {
                console.error('Error in custom error handler:', e);
            }
        }

        return errorId;
    }

    public handleNetworkError(error: any, context?: Partial<ErrorContext>): string {
        let message = 'Network error occurred';
        let recoveryActions: RecoveryAction[] = [];

        if (error?.response) {
            // Server responded with error status
            const status = error.response.status;
            message = `Server error (${status}): ${error.response.data?.message || error.message}`;

            if (status >= 500) {
                recoveryActions = [
                    {
                        label: 'Retry',
                        action: () => window.location.reload(),
                        primary: true,
                    },
                    {
                        label: 'Report Issue',
                        action: () => this.reportError(this.errors.get(this.generateErrorId())!),
                    },
                ];
            } else if (status === 401) {
                message = 'Authentication required. Please log in again.';
                recoveryActions = [
                    {
                        label: 'Log In',
                        action: () => window.location.href = '/login',
                        primary: true,
                    },
                ];
            } else if (status === 403) {
                message = 'You do not have permission to perform this action.';
                recoveryActions = [];
            }
        } else if (error?.request) {
            // Network error (no response)
            message = 'Unable to connect to server. Please check your internet connection.';
            recoveryActions = [
                {
                    label: 'Retry',
                    action: () => window.location.reload(),
                    primary: true,
                },
                {
                    label: 'Check Connection',
                    action: () => window.open('https://www.google.com', '_blank'),
                },
            ];
        }

        return this.handleError({
            type: 'network',
            message,
            details: {
                status: error?.response?.status,
                statusText: error?.response?.statusText,
                data: error?.response?.data,
                url: error?.config?.url,
                method: error?.config?.method,
            },
            severity: error?.response?.status >= 500 ? 'high' : 'medium',
            recoverable: true,
            recoveryActions,
            context,
        });
    }

    public handleWebSocketError(error: any, context?: Partial<ErrorContext>): string {
        return this.handleError({
            type: 'websocket',
            message: 'WebSocket connection error',
            details: error,
            severity: 'high',
            recoverable: true,
            recoveryActions: [
                {
                    label: 'Reconnect',
                    action: () => {
                        // This would trigger reconnection logic
                        window.location.reload();
                    },
                    primary: true,
                },
            ],
            context,
        });
    }

    public handleValidationError(errors: Record<string, string[]>, context?: Partial<ErrorContext>): string {
        const firstError = Object.values(errors)[0]?.[0] || 'Validation failed';

        return this.handleError({
            type: 'validation',
            message: firstError,
            details: errors,
            severity: 'low',
            recoverable: true,
            context,
        });
    }

    public handlePermissionError(action: string, context?: Partial<ErrorContext>): string {
        return this.handleError({
            type: 'permission',
            message: `You do not have permission to ${action}`,
            severity: 'medium',
            recoverable: false,
            context,
        });
    }

    public handleTimeoutError(operation: string, context?: Partial<ErrorContext>): string {
        return this.handleError({
            type: 'timeout',
            message: `Operation timed out: ${operation}`,
            severity: 'medium',
            recoverable: true,
            recoveryActions: [
                {
                    label: 'Retry',
                    action: () => window.location.reload(),
                    primary: true,
                },
            ],
            context,
        });
    }

    public getError(id: string): ErrorInfo | undefined {
        return this.errors.get(id);
    }

    public getAllErrors(): ErrorInfo[] {
        return Array.from(this.errors.values())
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    public getErrorsByType(type: ErrorType): ErrorInfo[] {
        return this.getAllErrors().filter(error => error.type === type);
    }

    public getErrorsBySeverity(severity: ErrorSeverity): ErrorInfo[] {
        return this.getAllErrors().filter(error => error.severity === severity);
    }

    public clearError(id: string): boolean {
        const deleted = this.errors.delete(id);
        if (deleted) {
            this.notifyListeners();
        }
        return deleted;
    }

    public clearAllErrors(): void {
        this.errors.clear();
        this.notifyListeners();
    }

    public clearErrorsByType(type: ErrorType): void {
        const toDelete = Array.from(this.errors.entries())
            .filter(([_, error]) => error.type === type)
            .map(([id]) => id);

        toDelete.forEach(id => this.errors.delete(id));

        if (toDelete.length > 0) {
            this.notifyListeners();
        }
    }

    public onErrorsChange(listener: (errors: ErrorInfo[]) => void): () => void {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    }

    private generateErrorId(): string {
        return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private getDefaultRecoveryActions(type: ErrorType): RecoveryAction[] {
        switch (type) {
            case 'network':
                return [
                    {
                        label: 'Retry',
                        action: () => window.location.reload(),
                        primary: true,
                    },
                ];
            case 'websocket':
                return [
                    {
                        label: 'Reconnect',
                        action: () => window.location.reload(),
                        primary: true,
                    },
                ];
            default:
                return [
                    {
                        label: 'Refresh Page',
                        action: () => window.location.reload(),
                    },
                ];
        }
    }

    private logError(error: ErrorInfo): void {
        const logLevel = this.getLogLevel(error.severity);
        const logMessage = `[${error.type.toUpperCase()}] ${error.message}`;

        console[logLevel](logMessage, {
            id: error.id,
            details: error.details,
            context: error.context,
            timestamp: error.timestamp,
        });
    }

    private getLogLevel(severity: ErrorSeverity): 'log' | 'warn' | 'error' {
        switch (severity) {
            case 'low':
                return 'log';
            case 'medium':
                return 'warn';
            case 'high':
            case 'critical':
                return 'error';
            default:
                return 'warn';
        }
    }

    private async reportError(error: ErrorInfo): Promise<void> {
        try {
            // In a real application, this would send to an error reporting service
            console.log('Reporting error:', error);

            // Example: Send to error reporting service
            // await fetch('/api/errors', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(error),
            // });
        } catch (e) {
            console.error('Failed to report error:', e);
        }
    }

    private notifyListeners(): void {
        const errors = this.getAllErrors();
        this.listeners.forEach(listener => {
            try {
                listener(errors);
            } catch (e) {
                console.error('Error in error listener:', e);
            }
        });
    }
}

// Global error handler instance
let globalErrorHandler: ErrorHandler | null = null;

export function getErrorHandler(): ErrorHandler {
    if (!globalErrorHandler) {
        globalErrorHandler = new ErrorHandler();
    }
    return globalErrorHandler;
}

export function createErrorHandler(options?: ErrorHandlerOptions): ErrorHandler {
    return new ErrorHandler(options);
}
