import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useErrorHandler } from '@/hooks/use-error-handler';
import {
    AlertTriangle,
    X,
    ChevronDown,
    ChevronUp,
    Wifi,
    WifiOff,
    Shield,
    Clock,
    Bug,
    RefreshCw,
    Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ErrorInfo, ErrorType, ErrorSeverity } from '@/services/ErrorHandler';

interface ErrorDisplayProps {
    className?: string;
    maxErrors?: number;
    showDetails?: boolean;
    compact?: boolean;
}

export default function ErrorDisplay({
    className,
    maxErrors = 5,
    showDetails = false,
    compact = false
}: ErrorDisplayProps) {
    const {
        errors,
        hasErrors,
        clearError,
        clearAllErrors,
        clearErrorsByType
    } = useErrorHandler();

    const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set());

    if (!hasErrors) {
        return null;
    }

    const displayErrors = errors.slice(0, maxErrors);

    const toggleErrorExpansion = (errorId: string) => {
        const newExpanded = new Set(expandedErrors);
        if (newExpanded.has(errorId)) {
            newExpanded.delete(errorId);
        } else {
            newExpanded.add(errorId);
        }
        setExpandedErrors(newExpanded);
    };

    const getErrorIcon = (type: ErrorType) => {
        switch (type) {
            case 'network':
                return <WifiOff className="h-4 w-4" />;
            case 'websocket':
                return <Wifi className="h-4 w-4" />;
            case 'permission':
                return <Shield className="h-4 w-4" />;
            case 'timeout':
                return <Clock className="h-4 w-4" />;
            case 'validation':
                return <AlertTriangle className="h-4 w-4" />;
            default:
                return <Bug className="h-4 w-4" />;
        }
    };

    const getSeverityColor = (severity: ErrorSeverity) => {
        switch (severity) {
            case 'critical':
                return 'destructive';
            case 'high':
                return 'destructive';
            case 'medium':
                return 'default';
            case 'low':
                return 'secondary';
            default:
                return 'default';
        }
    };

    const getSeverityBadgeColor = (severity: ErrorSeverity) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-100 text-red-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (compact) {
        return (
            <div className={cn('space-y-2', className)}>
                {displayErrors.map((error) => (
                    <Alert key={error.id} variant={getSeverityColor(error.severity)}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {getErrorIcon(error.type)}
                                <AlertDescription className="flex-1">
                                    {error.message}
                                </AlertDescription>
                            </div>
                            <div className="flex items-center space-x-2">
                                {error.recoveryActions && error.recoveryActions.length > 0 && (
                                    <div className="flex space-x-1">
                                        {error.recoveryActions.slice(0, 1).map((action, index) => (
                                            <Button
                                                key={index}
                                                size="sm"
                                                variant={action.primary ? "default" : "outline"}
                                                onClick={action.action}
                                                className="h-6 px-2 text-xs"
                                            >
                                                {action.label}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => clearError(error.id)}
                                    className="h-6 w-6 p-0"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </Alert>
                ))}
            </div>
        );
    }

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <CardTitle className="text-sm">System Errors</CardTitle>
                        <Badge variant="destructive">{errors.length}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={clearAllErrors}
                            className="h-6 px-2 text-xs"
                        >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Clear All
                        </Button>
                    </div>
                </div>
                <CardDescription>
                    Recent errors and issues that need attention
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ScrollArea className="h-64">
                    <div className="space-y-3">
                        {displayErrors.map((error) => (
                            <div key={error.id} className="border rounded-lg p-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-2 flex-1">
                                        <div className="flex-shrink-0 mt-1">
                                            {getErrorIcon(error.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <Badge
                                                    className={cn('text-xs', getSeverityBadgeColor(error.severity))}
                                                >
                                                    {error.severity}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {error.type}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {error.timestamp.toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium mb-1">
                                                {error.message}
                                            </p>

                                            {/* Recovery Actions */}
                                            {error.recoveryActions && error.recoveryActions.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-2">
                                                    {error.recoveryActions.map((action, index) => (
                                                        <Button
                                                            key={index}
                                                            size="sm"
                                                            variant={action.primary ? "default" : "outline"}
                                                            onClick={action.action}
                                                            className="h-6 px-2 text-xs"
                                                        >
                                                            {action.label}
                                                        </Button>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Error Details */}
                                            {(showDetails || error.details) && (
                                                <Collapsible
                                                    open={expandedErrors.has(error.id)}
                                                    onOpenChange={() => toggleErrorExpansion(error.id)}
                                                >
                                                    <CollapsibleTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 px-2 text-xs"
                                                        >
                                                            {expandedErrors.has(error.id) ? (
                                                                <>
                                                                    <ChevronUp className="h-3 w-3 mr-1" />
                                                                    Hide Details
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ChevronDown className="h-3 w-3 mr-1" />
                                                                    Show Details
                                                                </>
                                                            )}
                                                        </Button>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="mt-2">
                                                        <div className="bg-muted p-2 rounded text-xs">
                                                            {error.details && (
                                                                <div className="mb-2">
                                                                    <strong>Details:</strong>
                                                                    <pre className="mt-1 whitespace-pre-wrap">
                                                                        {JSON.stringify(error.details, null, 2)}
                                                                    </pre>
                                                                </div>
                                                            )}
                                                            {error.context && (
                                                                <div>
                                                                    <strong>Context:</strong>
                                                                    <pre className="mt-1 whitespace-pre-wrap">
                                                                        {JSON.stringify(error.context, null, 2)}
                                                                    </pre>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => clearError(error.id)}
                                        className="h-6 w-6 p-0 flex-shrink-0"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {errors.length > maxErrors && (
                    <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-muted-foreground text-center">
                            Showing {maxErrors} of {errors.length} errors
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Specialized error display components
export function NetworkErrorDisplay({ className }: { className?: string }) {
    const { networkErrors, clearErrorsByType } = useErrorHandler();

    if (networkErrors.length === 0) return null;

    return (
        <Alert variant="destructive" className={className}>
            <WifiOff className="h-4 w-4" />
            <AlertTitle>Network Issues Detected</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
                <span>
                    {networkErrors.length} network error{networkErrors.length !== 1 ? 's' : ''} occurred
                </span>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => clearErrorsByType('network')}
                    className="ml-2"
                >
                    Clear
                </Button>
            </AlertDescription>
        </Alert>
    );
}

export function WebSocketErrorDisplay({ className }: { className?: string }) {
    const { websocketErrors, clearErrorsByType } = useErrorHandler();

    if (websocketErrors.length === 0) return null;

    return (
        <Alert variant="destructive" className={className}>
            <Wifi className="h-4 w-4" />
            <AlertTitle>Real-time Connection Issues</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
                <span>
                    Real-time messaging may be affected
                </span>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="ml-2"
                >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Reconnect
                </Button>
            </AlertDescription>
        </Alert>
    );
}
