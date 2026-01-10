import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useMessageQueue } from '@/hooks/use-message-queue';
import { useConnectionStatus } from '@/hooks/use-connection-status';
import {
    Clock,
    Send,
    AlertTriangle,
    CheckCircle,
    RotateCcw,
    Trash2,
    ChevronDown,
    ChevronUp,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageQueueStatusProps {
    className?: string;
    compact?: boolean;
}

export default function MessageQueueStatus({ className, compact = false }: MessageQueueStatusProps) {
    const {
        queuedMessages,
        stats,
        retryFailedMessages,
        clearFailedMessages,
        processQueue,
        isProcessing,
        hasFailedMessages,
        hasPendingMessages
    } = useMessageQueue();

    const { isConnected } = useConnectionStatus();
    const [isExpanded, setIsExpanded] = useState(false);

    // Don't show if no messages and compact mode
    if (compact && stats.total === 0) {
        return null;
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-3 w-3 text-yellow-500" />;
            case 'sending':
                return <Loader2 className="h-3 w-3 text-blue-500 animate-spin" />;
            case 'sent':
                return <CheckCircle className="h-3 w-3 text-green-500" />;
            case 'failed':
                return <AlertTriangle className="h-3 w-3 text-red-500" />;
            default:
                return <Clock className="h-3 w-3 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'sending':
                return 'bg-blue-100 text-blue-800';
            case 'sent':
                return 'bg-green-100 text-green-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (compact) {
        return (
            <TooltipProvider>
                <div className={cn('flex items-center space-x-2', className)}>
                    {stats.total > 0 && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center space-x-1">
                                    <Send className="h-4 w-4 text-muted-foreground" />
                                    <Badge variant="secondary" className="text-xs">
                                        {stats.total}
                                    </Badge>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="text-sm">
                                    <p>Queued Messages: {stats.total}</p>
                                    {stats.pending > 0 && <p>Pending: {stats.pending}</p>}
                                    {stats.sending > 0 && <p>Sending: {stats.sending}</p>}
                                    {stats.failed > 0 && <p>Failed: {stats.failed}</p>}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    )}

                    {hasFailedMessages && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={retryFailedMessages}
                            className="h-6 px-2 text-xs"
                        >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Retry
                        </Button>
                    )}
                </div>
            </TooltipProvider>
        );
    }

    return (
        <Card className={className}>
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Send className="h-4 w-4" />
                                <CardTitle className="text-sm">Message Queue</CardTitle>
                                {stats.total > 0 && (
                                    <Badge variant="secondary">{stats.total}</Badge>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                {isProcessing && (
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                )}
                                {hasFailedMessages && (
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                )}
                                {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </div>
                        </div>
                        <CardDescription>
                            {stats.total === 0
                                ? 'No queued messages'
                                : `${stats.pending} pending, ${stats.failed} failed`
                            }
                        </CardDescription>
                    </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <CardContent className="pt-0">
                        {stats.total === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No messages in queue
                            </p>
                        ) : (
                            <>
                                {/* Action buttons */}
                                <div className="flex items-center space-x-2 mb-4">
                                    {hasFailedMessages && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={retryFailedMessages}
                                                disabled={!isConnected}
                                            >
                                                <RotateCcw className="h-3 w-3 mr-1" />
                                                Retry Failed
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={clearFailedMessages}
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" />
                                                Clear Failed
                                            </Button>
                                        </>
                                    )}

                                    {hasPendingMessages && isConnected && (
                                        <Button
                                            size="sm"
                                            onClick={processQueue}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                            ) : (
                                                <Send className="h-3 w-3 mr-1" />
                                            )}
                                            Process Queue
                                        </Button>
                                    )}
                                </div>

                                {/* Message list */}
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {queuedMessages.map((message) => (
                                        <div
                                            key={message.id}
                                            className="flex items-start space-x-2 p-2 border rounded-lg"
                                        >
                                            <div className="flex-shrink-0 mt-1">
                                                {getStatusIcon(message.status)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <Badge
                                                        className={cn('text-xs', getStatusColor(message.status))}
                                                    >
                                                        {message.status}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {message.timestamp.toLocaleTimeString()}
                                                    </span>
                                                    {message.attempts > 0 && (
                                                        <span className="text-xs text-muted-foreground">
                                                            Attempt {message.attempts}/{message.maxAttempts}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm truncate">
                                                    {message.content}
                                                </p>
                                                {message.error && (
                                                    <p className="text-xs text-red-600 mt-1">
                                                        Error: {message.error}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}

// Compact version for headers/toolbars
export function CompactMessageQueueStatus({ className }: { className?: string }) {
    return <MessageQueueStatus className={className} compact={true} />;
}
