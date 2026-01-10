import { useState, useCallback, useEffect } from 'react';
import { MessageService, SendMessageOptions, SendMessageResult, getMessageService } from '@/services/MessageService';

export interface UseMessageServiceOptions {
    autoRetry?: boolean;
    showNotifications?: boolean;
}

export function useMessageService(options: UseMessageServiceOptions = {}) {
    const { autoRetry = true, showNotifications = true } = options;

    const [messageService] = useState<MessageService>(() => getMessageService());
    const [isSending, setIsSending] = useState(false);
    const [lastError, setLastError] = useState<string | null>(null);
    const [queueStats, setQueueStats] = useState({
        total: 0,
        pending: 0,
        failed: 0,
    });

    // Update queue stats
    useEffect(() => {
        const updateStats = () => {
            setQueueStats({
                total: messageService.getQueuedMessagesCount(),
                pending: messageService.getPendingMessagesCount(),
                failed: messageService.getFailedMessagesCount(),
            });
        };

        // Initial update
        updateStats();

        // Subscribe to queue changes
        const unsubscribe = messageService.onQueueChange(() => {
            updateStats();
        });

        return unsubscribe;
    }, [messageService]);

    const sendMessage = useCallback(async (
        content: string,
        recipientId?: number,
        groupId?: number,
        customOptions?: Partial<SendMessageOptions>
    ): Promise<SendMessageResult> => {
        setIsSending(true);
        setLastError(null);

        try {
            const options: SendMessageOptions = {
                content,
                recipientId,
                groupId,
                queueIfOffline: true,
                retryOnFailure: autoRetry,
                ...customOptions,
            };

            const result = await messageService.sendMessage(options);

            if (!result.success && result.error) {
                setLastError(result.error);

                if (showNotifications) {
                    if (result.wasQueued) {
                        console.log('📤 Message queued for sending when connection is restored');
                    } else {
                        console.error('❌ Failed to send message:', result.error);
                    }
                }
            } else if (result.success) {
                if (showNotifications && result.wasQueued) {
                    console.log('📤 Message queued for sending');
                } else if (showNotifications) {
                    console.log('✅ Message sent successfully');
                }
            }

            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            setLastError(errorMessage);

            if (showNotifications) {
                console.error('❌ Failed to send message:', errorMessage);
            }

            return {
                success: false,
                error: errorMessage,
            };
        } finally {
            setIsSending(false);
        }
    }, [messageService, autoRetry, showNotifications]);

    const sendDirectMessage = useCallback(async (
        content: string,
        recipientId: number,
        options?: Partial<SendMessageOptions>
    ): Promise<SendMessageResult> => {
        return sendMessage(content, recipientId, undefined, options);
    }, [sendMessage]);

    const sendGroupMessage = useCallback(async (
        content: string,
        groupId: number,
        options?: Partial<SendMessageOptions>
    ): Promise<SendMessageResult> => {
        return sendMessage(content, undefined, groupId, options);
    }, [sendMessage]);

    const retryFailedMessages = useCallback(() => {
        messageService.retryFailedMessages();

        if (showNotifications) {
            console.log('🔄 Retrying failed messages...');
        }
    }, [messageService, showNotifications]);

    const clearFailedMessages = useCallback(() => {
        messageService.clearFailedMessages();

        if (showNotifications) {
            console.log('🗑️ Cleared failed messages');
        }
    }, [messageService, showNotifications]);

    const clearQueue = useCallback(() => {
        messageService.clearQueue();

        if (showNotifications) {
            console.log('🗑️ Cleared message queue');
        }
    }, [messageService, showNotifications]);

    const processQueue = useCallback(async () => {
        try {
            await messageService.processQueue();

            if (showNotifications) {
                console.log('✅ Queue processed successfully');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to process queue';
            setLastError(errorMessage);

            if (showNotifications) {
                console.error('❌ Failed to process queue:', errorMessage);
            }
        }
    }, [messageService, showNotifications]);

    return {
        // Core sending functions
        sendMessage,
        sendDirectMessage,
        sendGroupMessage,

        // Queue management
        retryFailedMessages,
        clearFailedMessages,
        clearQueue,
        processQueue,

        // State
        isSending,
        lastError,
        queueStats,

        // Computed state
        hasQueuedMessages: queueStats.total > 0,
        hasFailedMessages: queueStats.failed > 0,
        hasPendingMessages: queueStats.pending > 0,

        // Utilities
        clearError: () => setLastError(null),
    };
}

// Simplified hook for basic message sending
export function useSimpleMessageSender() {
    const { sendDirectMessage, sendGroupMessage, isSending, lastError } = useMessageService({
        autoRetry: true,
        showNotifications: true,
    });

    return {
        sendDirectMessage,
        sendGroupMessage,
        isSending,
        error: lastError,
    };
}
