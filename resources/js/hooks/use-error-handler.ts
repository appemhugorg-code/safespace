import { useState, useEffect, useCallback } from 'react';
import { ErrorHandler, ErrorInfo, ErrorType, ErrorSeverity, getErrorHandler } from '@/services/ErrorHandler';

export interface UseErrorHandlerOptions {
    autoReport?: boolean;
    showNotifications?: boolean;
    filterTypes?: ErrorType[];
    filterSeverity?: ErrorSeverity[];
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
    const {
        autoReport = false,
        showNotifications = true,
        filterTypes,
        filterSeverity
    } = options;

    const [errorHandler] = useState<ErrorHandler>(() => getErrorHandler());
    const [errors, setErrors] = useState<ErrorInfo[]>(() => errorHandler.getAllErrors());

    // Update errors when error handler changes
    useEffect(() => {
        const unsubscribe = errorHandler.onErrorsChange((newErrors) => {
            let filteredErrors = newErrors;

            if (filterTypes) {
                filteredErrors = filteredErrors.filter(error => filterTypes.includes(error.type));
            }

            if (filterSeverity) {
                filteredErrors = filteredErrors.filter(error => filterSeverity.includes(error.severity));
            }

            setErrors(filteredErrors);
        });

        return unsubscribe;
    }, [errorHandler, filterTypes, filterSeverity]);

    const handleError = useCallback((
        message: string,
        type?: ErrorType,
        details?: any,
        context?: any
    ): string => {
        return errorHandler.handleError({
            message,
            type: type || 'unknown',
            details,
            context,
        });
    }, [errorHandler]);

    const handleNetworkError = useCallback((error: any, context?: any): string => {
        return errorHandler.handleNetworkError(error, context);
    }, [errorHandler]);

    const handleWebSocketError = useCallback((error: any, context?: any): string => {
        return errorHandler.handleWebSocketError(error, context);
    }, [errorHandler]);

    const handleValidationError = useCallback((errors: Record<string, string[]>, context?: any): string => {
        return errorHandler.handleValidationError(errors, context);
    }, [errorHandler]);

    const handlePermissionError = useCallback((action: string, context?: any): string => {
        return errorHandler.handlePermissionError(action, context);
    }, [errorHandler]);

    const handleTimeoutError = useCallback((operation: string, context?: any): string => {
        return errorHandler.handleTimeoutError(operation, context);
    }, [errorHandler]);

    const clearError = useCallback((id: string): boolean => {
        return errorHandler.clearError(id);
    }, [errorHandler]);

    const clearAllErrors = useCallback((): void => {
        errorHandler.clearAllErrors();
    }, [errorHandler]);

    const clearErrorsByType = useCallback((type: ErrorType): void => {
        errorHandler.clearErrorsByType(type);
    }, [errorHandler]);

    const getErrorsByType = useCallback((type: ErrorType): ErrorInfo[] => {
        return errorHandler.getErrorsByType(type);
    }, [errorHandler]);

    const getErrorsBySeverity = useCallback((severity: ErrorSeverity): ErrorInfo[] => {
        return errorHandler.getErrorsBySeverity(severity);
    }, [errorHandler]);

    // Computed values
    const hasErrors = errors.length > 0;
    const criticalErrors = errors.filter(error => error.severity === 'critical');
    const highSeverityErrors = errors.filter(error => error.severity === 'high');
    const networkErrors = errors.filter(error => error.type === 'network');
    const websocketErrors = errors.filter(error => error.type === 'websocket');
    const hasCriticalErrors = criticalErrors.length > 0;
    const hasNetworkErrors = networkErrors.length > 0;
    const hasWebSocketErrors = websocketErrors.length > 0;

    return {
        // Error handling functions
        handleError,
        handleNetworkError,
        handleWebSocketError,
        handleValidationError,
        handlePermissionError,
        handleTimeoutError,

        // Error management
        clearError,
        clearAllErrors,
        clearErrorsByType,
        getErrorsByType,
        getErrorsBySeverity,

        // State
        errors,
        hasErrors,
        hasCriticalErrors,
        hasNetworkErrors,
        hasWebSocketErrors,

        // Filtered errors
        criticalErrors,
        highSeverityErrors,
        networkErrors,
        websocketErrors,

        // Stats
        errorCount: errors.length,
        criticalErrorCount: criticalErrors.length,
        networkErrorCount: networkErrors.length,
        websocketErrorCount: websocketErrors.length,
    };
}

// Specialized hooks for specific error types
export function useNetworkErrorHandler() {
    return useErrorHandler({
        filterTypes: ['network', 'api', 'timeout'],
        showNotifications: true,
    });
}

export function useWebSocketErrorHandler() {
    return useErrorHandler({
        filterTypes: ['websocket'],
        showNotifications: true,
    });
}

export function useCriticalErrorHandler() {
    return useErrorHandler({
        filterSeverity: ['critical', 'high'],
        showNotifications: true,
        autoReport: true,
    });
}
