import { api } from '@/lib/api';
import { getMessageQueue, MessageQueue } from './MessageQueue';
import { getConnectionManager, ConnectionManager } from './ConnectionManager';

export interface SendMessageOptions {
    content: string;
    recipientId?: number;
    groupId?: number;
    queueIfOffline?: boolean;
    retryOnFailure?: boolean;
    maxRetries?: number;
}

export interface SendMessageResult {
    success: boolean;
    messageId?: number;
    queueId?: string;
    error?: string;
    wasQueued?: boolean;
}

export class MessageService {
    private messageQueue: MessageQueue;
    private connectionManager: ConnectionManager;

    constructor() {
        this.messageQueue = getMessageQueue();
        this.connectionManager = getConnectionManager();
    }

    /**
     * Send a message with automatic queuing and retry logic.
     */
    async sendMessage(options: SendMessageOptions): Promise<SendMessageResult> {
        const {
            content,
            recipientId,
            groupId,
            queueIfOffline = true,
            retryOnFailure = true,
            maxRetries = 3
        } = options;

        // Validate input
        if (!content.trim()) {
            return {
                success: false,
                error: 'Message content cannot be empty'
            };
        }

        if (!recipientId && !groupId) {
            return {
                success: false,
                error: 'Either recipientId or groupId must be provided'
            };
        }

        // Check connection status
        const isConnected = this.connectionManager.isConnected();

        // If offline and queuing is enabled, add to queue
        if (!isConnected && queueIfOffline) {
            const queueId = this.messageQueue.addMessage(content, recipientId, groupId);

            return {
                success: true,
                queueId,
                wasQueued: true
            };
        }

        // If offline and queuing is disabled, return error
        if (!isConnected) {
            return {
                success: false,
                error: 'Cannot send message while offline'
            };
        }

        // Try to send message immediately
        try {
            const result = await this.sendMessageImmediate(content, recipientId, groupId);
            return {
                success: true,
                messageId: result.id,
                wasQueued: false
            };
        } catch (error) {
            console.error('Failed to send message:', error);

            // If retry is enabled and we have a connection, queue for retry
            if (retryOnFailure && isConnected) {
                const queueId = this.messageQueue.addMessage(content, recipientId, groupId);

                return {
                    success: false,
                    queueId,
                    error: error instanceof Error ? error.message : 'Failed to send message',
                    wasQueued: true
                };
            }

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to send message'
            };
        }
    }

    /**
     * Send message immediately without queuing.
     */
    private async sendMessageImmediate(
        content: string,
        recipientId?: number,
        groupId?: number
    ): Promise<any> {
        const payload: any = { content };

        if (recipientId) {
            payload.recipient_id = recipientId;
        }

        if (groupId) {
            payload.group_id = groupId;
        }

        const response = await api.post('/messages', payload);

        if (!response.data) {
            throw new Error('Invalid response from server');
        }

        return response.data.message || response.data;
    }

    /**
     * Get queued messages count.
     */
    getQueuedMessagesCount(): number {
        return this.messageQueue.getQueueSize();
    }

    /**
     * Get pending messages count.
     */
    getPendingMessagesCount(): number {
        return this.messageQueue.getPendingMessages().length;
    }

    /**
     * Get failed messages count.
     */
    getFailedMessagesCount(): number {
        return this.messageQueue.getFailedMessages().length;
    }

    /**
     * Retry all failed messages.
     */
    retryFailedMessages(): void {
        this.messageQueue.retryFailedMessages();
    }

    /**
     * Clear all failed messages.
     */
    clearFailedMessages(): void {
        this.messageQueue.clearFailedMessages();
    }

    /**
     * Clear entire queue.
     */
    clearQueue(): void {
        this.messageQueue.clearQueue();
    }

    /**
     * Process queue manually.
     */
    async processQueue(): Promise<void> {
        if (!this.connectionManager.isConnected()) {
            throw new Error('Cannot process queue while offline');
        }

        await this.messageQueue.processQueue(async (message) => {
            await this.sendMessageImmediate(
                message.content,
                message.recipientId,
                message.groupId
            );
        });
    }

    /**
     * Subscribe to queue changes.
     */
    onQueueChange(callback: (messages: any[]) => void): () => void {
        return this.messageQueue.onQueueChange(callback);
    }

    /**
     * Subscribe to connection status changes.
     */
    onConnectionChange(callback: (status: string) => void): () => void {
        return this.connectionManager.onStatusChange(callback);
    }
}

// Global message service instance
let globalMessageService: MessageService | null = null;

export function getMessageService(): MessageService {
    if (!globalMessageService) {
        globalMessageService = new MessageService();
    }
    return globalMessageService;
}

export function createMessageService(): MessageService {
    return new MessageService();
}
