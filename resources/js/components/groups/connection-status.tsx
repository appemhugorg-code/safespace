import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface ConnectionStatusProps {
    status: 'connected' | 'disconnected' | 'reconnecting';
    isListening?: boolean;
    onRetry?: () => void;
    className?: string;
}

export default function ConnectionStatus({
    status,
    isListening = false,
    onRetry,
    className = ''
}: ConnectionStatusProps) {
    const getStatusConfig = () => {
        switch (status) {
            case 'connected':
                return {
                    icon: Wifi,
                    text: 'Connected',
                    color: 'text-green-600',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    description: 'Real-time messaging is active',
                };
            case 'disconnected':
                return {
                    icon: WifiOff,
                    text: 'Disconnected',
                    color: 'text-red-600',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    description: 'Real-time messaging is unavailable. Messages will be sent when connection is restored.',
                };
            case 'reconnecting':
                return {
                    icon: AlertCircle,
                    text: 'Reconnecting',
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    description: 'Attempting to restore real-time connection...',
                };
        }
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={`flex items-center gap-1 ${config.color} ${className}`}>
                        <Icon
                            className={`w-4 h-4 ${status === 'reconnecting' ? 'animate-pulse' : ''}`}
                        />
                        <span className="text-xs font-medium">{config.text}</span>
                        {!isListening && status === 'connected' && (
                            <span className="text-xs text-muted-foreground">(Not listening)</span>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="max-w-xs">
                        <p className="text-sm">{config.description}</p>
                        {status === 'disconnected' && onRetry && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onRetry}
                                className="mt-2"
                            >
                                Retry Connection
                            </Button>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

// Compact version for use in headers
export function ConnectionStatusBadge({
    status,
    isListening = false,
    className = ''
}: Omit<ConnectionStatusProps, 'onRetry'>) {
    const getStatusConfig = () => {
        switch (status) {
            case 'connected':
                return {
                    icon: Wifi,
                    text: 'Live',
                    variant: 'outline' as const,
                    className: 'bg-green-50 text-green-700 border-green-200',
                };
            case 'disconnected':
                return {
                    icon: WifiOff,
                    text: 'Offline',
                    variant: 'outline' as const,
                    className: 'bg-red-50 text-red-700 border-red-200',
                };
            case 'reconnecting':
                return {
                    icon: AlertCircle,
                    text: 'Connecting',
                    variant: 'outline' as const,
                    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                };
        }
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className={`${config.className} ${className}`}>
            <Icon
                className={`w-3 h-3 mr-1 ${status === 'reconnecting' ? 'animate-pulse' : ''}`}
            />
            {config.text}
        </Badge>
    );
}

// Warning banner for connection issues
export function ConnectionWarning({
    status,
    onRetry,
    onDismiss,
}: {
    status: 'disconnected' | 'reconnecting';
    onRetry?: () => void;
    onDismiss?: () => void;
}) {
    if (status === 'reconnecting') {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 animate-pulse" />
                    <p className="text-sm text-yellow-800">
                        Reconnecting to real-time messaging...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                    <WifiOff className="w-4 h-4 text-red-600 mt-0.5" />
                    <div>
                        <p className="text-sm text-red-800 font-medium">
                            Connection lost
                        </p>
                        <p className="text-xs text-red-700 mt-1">
                            Messages will be sent when connection is restored. You can continue typing.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {onRetry && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRetry}
                            className="text-red-700 border-red-300 hover:bg-red-100"
                        >
                            Retry
                        </Button>
                    )}
                    {onDismiss && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDismiss}
                            className="text-red-700 hover:bg-red-100"
                        >
                            ×
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
