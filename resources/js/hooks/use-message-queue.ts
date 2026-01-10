import { useEffect, useState, useCallback } from 'react';
import { MessageQueue, QueuedMessage, getMessageQueue } from '@/services/MessageQueue';
import { useConnectionStatus } from '@/hooks/use-connection-status';
import { api } from '@/lib/api';

export interface UseMessageQueueOptions {
    autoProcess?: boolean;
    processInterval?: number;
}

export function useMessageQueue(options: UseMessageQueueOptions = {}) {
    const { autoProcess = true, processInterval = 5000 } = options;

    const [messageQueue] = useState<MessageQueue>(() => getMessageQueue());
    const [queuedMessages, setQueuedMessages] = useState<QueuedMessage[]>(() =>
        messageQueue.getAllMessages()
    );
    const { isConnected } = useConnectionStatus();

    // Update queued messages when queue changes
    useEffect(() => {
        const unsubscribe = messageQueue.onQueueChange((messages) => {
            setQueuedMessages(messages);
        });

        return unsubscribe;
    }, [messageQueue]);

    // Auto-process queue when connected
    useEffect(() => {
        if (!autoProcess || !isConnected) {
            return;
        }

        const processMessages = async () => {
            const pendingCount = messageQueue.getPendingMessages().length;
            if (pendingCount === 0) return;

            console.log(`Processing ${pendingCount} queued messages...`);

            await messageQueue.processQueue(async (message) => {
                const payload: any = {
                    content: message.content,
                };

                if (message.recipientId) {
                    payload.recipient_id = message.recipientId;
                }

                if (message.groupId) {
                    payload.group_id = message.groupId;
                }

                const response = await api.post('/messages', payload);

                if (!response.data) {
                    throw new Error('Failed to send message');
                }
            });
        };

        // Process immediately when connected
        processMessages();

        // Set up interval for periodic processing
        const interval = setInterval(processMessages, processInterval);

        return () => {
            clearInterval(interval);
        };
    }, [isConnected, autoProcess, processInterval, messageQueue]);

    const queueMessage = useCallback((
        content: string,
        recipientId?: number,
        groupId?: number
    ): string => {
        return messageQueue.addMessage(content, recipientId, groupId);
    }, [messageQueue]);

    const removeMessage = useCallback((id: string): boolean => {
        return messageQueue.removeMessage(id);
    }, [messageQueue]);

    const retryFailedMessages = useCallback(() => {
        messageQueue.retryFailedMessages();
    }, [messageQueue]);

    const clearFailedMessages = useCallback(() => {
        messageQueue.clearFailedMessages();
    }, [messageQueue]);

    const clearQueue = useCallback(() => {
        messageQueue.clearQueue();
    }, [messageQueue]);

    const processQueue = useCallback(async () => {
        if (!isConnected) {
            throw new Error('Cannot process queue while disconnected');
        }

        await messageQueue.processQueue(async (message) => {
            const payload: any = {
                content: message.content,
            };

            if (message.recipientId) {
                payload.recipient_id = message.recipientId;
            }

            if (message.groupId) {
                payload.group_id = message.groupId;
            }

            const response = await api.post('/messages', payload);

            if (!response.data) {
                throw new Error('Failed to send message');
            }
        });
    }, [isConnected, messageQueue]);

    const stats = {
        total: queuedMessages.length,
        pending: queuedMessages.filter(msg => msg.status === 'pending').length,
        sending: queuedMessages.filter(msg => msg.status === 'sending').length,
        failed: queuedMessages.filter(msg => msg.status === 'failed').length,
    };

    return {
        queuedMessages,
        stats,
        queueMessage,
        removeMessage,
        retryFailedMessages,
        clearFailedMessages,
        clearQueue,
        processQueue,
        isProcessing: stats.sending > 0,
        hasFailedMessages: stats.failed > 0,
        hasPendingMessages: stats.pending > 0,
    };
}
