export interface QueuedMessage {
    id: string;
    content: string;
    recipientId?: number;
    groupId?: number;
    timestamp: Date;
    attempts: number;
    maxAttempts: number;
    status: 'pending' | 'sending' | 'sent' | 'failed';
    error?: string;
}

export interface MessageQueueOptions {
    maxAttempts?: number;
    retryDelay?: number;
    maxQueueSize?: number;
    persistToStorage?: boolean;
}

export class MessageQueue {
    private queue: Map<string, QueuedMessage> = new Map();
    private maxAttempts: number;
    private retryDelay: number;
    private maxQueueSize: number;
    private persistToStorage: boolean;
    private storageKey = 'safespace_message_queue';
    private listeners: Set<(queue: QueuedMessage[]) => void> = new Set();

    constructor(options: MessageQueueOptions = {}) {
        this.maxAttempts = options.maxAttempts ?? 3;
        this.retryDelay = options.retryDelay ?? 2000;
        this.maxQueueSize = options.maxQueueSize ?? 50;
        this.persistToStorage = options.persistToStorage ?? true;

        if (this.persistToStorage) {
            this.loadFromStorage();
        }
    }

    public addMessage(
        content: string,
        recipientId?: number,
        groupId?: number
    ): string {
        // Generate unique ID
        const id = this.generateMessageId();

        const queuedMessage: QueuedMessage = {
            id,
            content,
            recipientId,
            groupId,
            timestamp: new Date(),
            attempts: 0,
            maxAttempts: this.maxAttempts,
            status: 'pending',
        };

        // Check queue size limit
        if (this.queue.size >= this.maxQueueSize) {
            // Remove oldest message
            const oldestId = Array.from(this.queue.keys())[0];
            this.queue.delete(oldestId);
        }

        this.queue.set(id, queuedMessage);
        this.saveToStorage();
        this.notifyListeners();

        return id;
    }

    public async processQueue(sendFunction: (message: QueuedMessage) => Promise<void>): Promise<void> {
        const pendingMessages = Array.from(this.queue.values())
            .filter(msg => msg.status === 'pending' || msg.status === 'failed')
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        for (const message of pendingMessages) {
            if (message.attempts >= message.maxAttempts) {
                message.status = 'failed';
                message.error = 'Max retry attempts exceeded';
                continue;
            }

            try {
                message.status = 'sending';
                message.attempts++;
                this.notifyListeners();

                await sendFunction(message);

                message.status = 'sent';
                this.queue.delete(message.id);
            } catch (error) {
                message.status = 'failed';
                message.error = error instanceof Error ? error.message : 'Unknown error';

                // Schedule retry if not at max attempts
                if (message.attempts < message.maxAttempts) {
                    setTimeout(() => {
                        if (this.queue.has(message.id)) {
                            message.status = 'pending';
                            this.notifyListeners();
                        }
                    }, this.retryDelay * message.attempts); // Exponential backoff
                }
            }
        }

        this.saveToStorage();
        this.notifyListeners();
    }

    public removeMessage(id: string): boolean {
        const removed = this.queue.delete(id);
        if (removed) {
            this.saveToStorage();
            this.notifyListeners();
        }
        return removed;
    }

    public getMessage(id: string): QueuedMessage | undefined {
        return this.queue.get(id);
    }

    public getAllMessages(): QueuedMessage[] {
        return Array.from(this.queue.values())
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }

    public getPendingMessages(): QueuedMessage[] {
        return this.getAllMessages().filter(msg =>
            msg.status === 'pending' || msg.status === 'sending'
        );
    }

    public getFailedMessages(): QueuedMessage[] {
        return this.getAllMessages().filter(msg => msg.status === 'failed');
    }

    public clearQueue(): void {
        this.queue.clear();
        this.saveToStorage();
        this.notifyListeners();
    }

    public clearFailedMessages(): void {
        const failedIds = this.getFailedMessages().map(msg => msg.id);
        failedIds.forEach(id => this.queue.delete(id));
        this.saveToStorage();
        this.notifyListeners();
    }

    public retryFailedMessages(): void {
        const failedMessages = this.getFailedMessages();
        failedMessages.forEach(msg => {
            msg.status = 'pending';
            msg.attempts = 0;
            msg.error = undefined;
        });
        this.notifyListeners();
    }

    public getQueueSize(): number {
        return this.queue.size;
    }

    public isEmpty(): boolean {
        return this.queue.size === 0;
    }

    public onQueueChange(listener: (queue: QueuedMessage[]) => void): () => void {
        this.listeners.add(listener);

        // Return unsubscribe function
        return () => {
            this.listeners.delete(listener);
        };
    }

    private generateMessageId(): string {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private notifyListeners(): void {
        const messages = this.getAllMessages();
        this.listeners.forEach(listener => {
            try {
                listener(messages);
            } catch (error) {
                console.error('Error in queue change listener:', error);
            }
        });
    }

    private saveToStorage(): void {
        if (!this.persistToStorage || typeof window === 'undefined') {
            return;
        }

        try {
            const data = Array.from(this.queue.entries()).map(([id, message]) => ({
                id,
                ...message,
                timestamp: message.timestamp.toISOString(),
            }));

            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save message queue to storage:', error);
        }
    }

    private loadFromStorage(): void {
        if (typeof window === 'undefined') {
            return;
        }

        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return;

            const data = JSON.parse(stored);
            if (!Array.isArray(data)) return;

            data.forEach((item: any) => {
                if (item.id && item.content) {
                    const message: QueuedMessage = {
                        ...item,
                        timestamp: new Date(item.timestamp),
                        status: 'pending', // Reset status on load
                        attempts: 0, // Reset attempts on load
                        error: undefined,
                    };
                    this.queue.set(item.id, message);
                }
            });

            console.log(`Loaded ${this.queue.size} messages from storage`);
        } catch (error) {
            console.warn('Failed to load message queue from storage:', error);
            // Clear corrupted data
            localStorage.removeItem(this.storageKey);
        }
    }
}

// Global message queue instance
let globalMessageQueue: MessageQueue | null = null;

export function getMessageQueue(): MessageQueue {
    if (!globalMessageQueue) {
        globalMessageQueue = new MessageQueue();
    }
    return globalMessageQueue;
}

export function createMessageQueue(options?: MessageQueueOptions): MessageQueue {
    return new MessageQueue(options);
}
