import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useConnectionStatus } from '@/hooks/use-connection-status';
import { Wifi, WifiOff, RotateCcw, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionStatusIndicatorProps {
    className?: string;
    showText?: boolean;
    showReconnectButton?: boolean;
}

export default function ConnectionStatusIndicator({
    className,
    showText = false,
    showReconnectButton = true
}: ConnectionStatusIndicatorProps) {
    const {
        status,
        isConnected,
        reconnectAttempts,
        maxReconnectAttempts,
        forceReconnect
    } = useConnectionStatus();

    const [isReconnecting, setIsReconnecting] = useState(false);

    const handleReconnect = async () => {
        setIsReconnecting(true);
        forceReconnect();

        // Reset the reconnecting state after a delay
        setTimeout(() => {
            setIsReconnecting(false);
        }, 2000);
    };

    const getStatusConfig = () => {
        switch (status) {
            case 'connected':
                return {
                    icon: Wifi,
                    color: 'bg-green-500',
                    badgeVariant: 'default' as const,
                    text: 'Connected',
                    tooltip: 'Real-time messaging is active',
                };
            case 'reconnecting':
                return {
                    icon: RotateCcw,
                    color: 'bg-yellow-500',
                    badgeVariant: 'secondary' as const,
                    text: 'Reconnecting...',
                    tooltip: `Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})`,
                };
            case 'error':
                return {
                    icon: AlertTriangle,
                    color: 'bg-red-500',
                    badgeVariant: 'destructive' as const,
                    text: 'Connection Error',
                    tooltip: 'Unable to connect to real-time messaging',
                };
            case 'disconnected':
            default:
                return {
                    icon: WifiOff,
                    color: 'bg-gray-500',
                    badgeVariant: 'secondary' as const,
                    text: 'Disconnected',
                    tooltip: 'Real-time messaging is unavailable',
                };
        }
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    // Don't show indicator if connected and not showing text
    if (isConnected && !showText && !showReconnectButton) {
        return null;
    }

    return (
        <TooltipProvider>
            <div className={cn('flex items-center space-x-2', className)}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center space-x-1">
                            <div className="relative">
                                <Icon
                                    className={cn(
                                        'h-4 w-4',
                                        isConnected ? 'text-green-600' : 'text-gray-500',
                                        status === 'reconnecting' && 'animate-spin'
                                    )}
                                />
                                <div
                                    className={cn(
                                        'absolute -top-1 -right-1 h-2 w-2 rounded-full',
                                        config.color,
                                        status === 'reconnecting' && 'animate-pulse'
                                    )}
                                />
                            </div>

                            {showText && (
                                <Badge variant={config.badgeVariant} className="text-xs">
                                    {config.text}
                                </Badge>
                            )}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{config.tooltip}</p>
                        {!isConnected && reconnectAttempts > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Reconnect attempts: {reconnectAttempts}/{maxReconnectAttempts}
                            </p>
                        )}
                    </TooltipContent>
                </Tooltip>

                {showReconnectButton && !isConnected && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleReconnect}
                        disabled={isReconnecting || status === 'reconnecting'}
                        className="h-6 px-2 text-xs"
                    >
                        {isReconnecting || status === 'reconnecting' ? (
                            <>
                                <RotateCcw className="h-3 w-3 mr-1 animate-spin" />
                                Reconnecting...
                            </>
                        ) : (
                            <>
                                <RotateCcw className="h-3 w-3 mr-1" />
                                Retry
                            </>
                        )}
                    </Button>
                )}
            </div>
        </TooltipProvider>
    );
}

// Compact version for use in headers/toolbars
export function CompactConnectionIndicator({ className }: { className?: string }) {
    return (
        <ConnectionStatusIndicator
            className={className}
            showText={false}
            showReconnectButton={false}
        />
    );
}

// Full version for use in status bars or dedicated areas
export function FullConnectionIndicator({ className }: { className?: string }) {
    return (
        <ConnectionStatusIndicator
            className={className}
            showText={true}
            showReconnectButton={true}
        />
    );
}
