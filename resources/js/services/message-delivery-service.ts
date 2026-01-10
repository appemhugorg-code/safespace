export interface MessageStatus {
  id: string;
  messageId: string;
  userId: string;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  deviceId?: string;
  errorReason?: string;
  retryCount?: number;
}

export interface DeliveryReceipt {
  id: string;
  messageId: string;
  recipientId: string;
  deliveredAt: Date;
  readAt?: Date;
  deviceInfo?: {
    type: 'web' | 'mobile' | 'desktop';
    userAgent?: string;
    platform?: string;
  };
}

export interface ReadReceiptSettings {
  enabled: boolean;
  showToSender: boolean;
  showToRecipient: boolean;
  groupReadReceipts: boolean;
  therapistOverride: boolean; // Therapists can always see read receipts
  anonymousMode: boolean; // Hide individual read receipts in groups
}

export interface MessageDeliveryConfig {
  maxRetries: number;
  retryDelayMs: number;
  deliveryTimeoutMs: number;
  batchSize: number;
  enablePushNotifications: boolean;
  enableEmailFallback: boolean;
  enableSMSFallback: boolean;
  priorityDelivery: boolean;
}

export interface DeliveryMetrics {
  totalMessages: number;
  deliveredMessages: number;
  readMessages: number;
  failedMessages: number;
  averageDeliveryTime: number;
  averageReadTime: number;
  deliveryRate: number;
  readRate: number;
}

export interface MessageDeliveryEvent {
  type: 'status_update' | 'delivery_receipt' | 'read_receipt' | 'delivery_failed';
  messageId: string;
  userId: string;
  status?: MessageStatus['status'];
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class MessageDeliveryService {
  private baseUrl: string;
  private authToken: string;
  private eventListeners: Map<string, Function[]> = new Map();
  private deliveryQueue: Map<string, MessageStatus> = new Map();
  private retryTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private config: MessageDeliveryConfig;
  private socket: any; // Socket.io instance

  constructor(config: {
    baseUrl: string;
    authToken: string;
    socket?: any;
    deliveryConfig?: Partial<MessageDeliveryConfig>;
  }) {
    this.baseUrl = config.baseUrl;
    this.authToken = config.authToken;
    this.socket = config.socket;
    
    this.config = {
      maxRetries: 3,
      retryDelayMs: 5000,
      deliveryTimeoutMs: 30000,
      batchSize: 50,
      enablePushNotifications: true,
      enableEmailFallback: false,
      enableSMSFallback: false,
      priorityDelivery: false,
      ...config.deliveryConfig,
    };

    this.initializeSocketListeners();
  }

  // Initialize Socket.io listeners for real-time delivery updates
  private initializeSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('message_delivered', (data: { messageId: string; userId: string; timestamp: string }) => {
      this.handleDeliveryUpdate(data.messageId, data.userId, 'delivered', new Date(data.timestamp));
    });

    this.socket.on('message_read', (data: { messageId: string; userId: string; timestamp: string }) => {
      this.handleDeliveryUpdate(data.messageId, data.userId, 'read', new Date(data.timestamp));
    });

    this.socket.on('message_failed', (data: { messageId: string; userId: string; error: string }) => {
      this.handleDeliveryFailure(data.messageId, data.userId, data.error);
    });
  }

  // Send message with delivery tracking
  public async sendMessage(data: {
    conversationId: string;
    content: string;
    type: 'text' | 'file' | 'image' | 'video' | 'audio';
    recipients: string[];
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    requireDeliveryReceipt?: boolean;
    requireReadReceipt?: boolean;
    metadata?: Record<string, any>;
  }): Promise<{
    messageId: string;
    status: MessageStatus;
    estimatedDelivery?: Date;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          deliveryConfig: this.config,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      const result = await response.json();
      
      // Initialize delivery tracking
      const messageStatus: MessageStatus = {
        id: `${result.messageId}_${Date.now()}`,
        messageId: result.messageId,
        userId: result.senderId,
        status: 'sending',
        timestamp: new Date(),
        retryCount: 0,
      };

      this.deliveryQueue.set(result.messageId, messageStatus);
      this.startDeliveryTracking(result.messageId);

      this.emit('message_sent', {
        messageId: result.messageId,
        status: messageStatus,
        recipients: data.recipients,
      });

      return {
        messageId: result.messageId,
        status: messageStatus,
        estimatedDelivery: result.estimatedDelivery ? new Date(result.estimatedDelivery) : undefined,
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  // Start delivery tracking for a message
  private startDeliveryTracking(messageId: string): void {
    const timeout = setTimeout(() => {
      this.handleDeliveryTimeout(messageId);
    }, this.config.deliveryTimeoutMs);

    this.retryTimeouts.set(messageId, timeout);
  }

  // Handle delivery timeout
  private handleDeliveryTimeout(messageId: string): void {
    const status = this.deliveryQueue.get(messageId);
    if (!status) return;

    if (status.retryCount! < this.config.maxRetries) {
      this.retryDelivery(messageId);
    } else {
      this.handleDeliveryFailure(messageId, status.userId, 'Delivery timeout exceeded');
    }
  }

  // Retry message delivery
  private async retryDelivery(messageId: string): Promise<void> {
    const status = this.deliveryQueue.get(messageId);
    if (!status) return;

    status.retryCount = (status.retryCount || 0) + 1;
    status.timestamp = new Date();

    try {
      const response = await fetch(`${this.baseUrl}/api/messages/${messageId}/retry`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (response.ok) {
        this.startDeliveryTracking(messageId);
        this.emit('message_retry', { messageId, retryCount: status.retryCount });
      } else {
        throw new Error(`Retry failed: ${response.status}`);
      }
    } catch (error) {
      console.error(`Failed to retry message ${messageId}:`, error);
      this.handleDeliveryFailure(messageId, status.userId, `Retry failed: ${error}`);
    }
  }

  // Handle delivery update
  private handleDeliveryUpdate(
    messageId: string, 
    userId: string, 
    status: MessageStatus['status'], 
    timestamp: Date
  ): void {
    const messageStatus = this.deliveryQueue.get(messageId);
    if (messageStatus) {
      messageStatus.status = status;
      messageStatus.timestamp = timestamp;
    }

    // Clear retry timeout if message is delivered or read
    if (['delivered', 'read'].includes(status)) {
      const timeout = this.retryTimeouts.get(messageId);
      if (timeout) {
        clearTimeout(timeout);
        this.retryTimeouts.delete(messageId);
      }
    }

    this.emit('status_update', {
      type: 'status_update',
      messageId,
      userId,
      status,
      timestamp,
    });
  }

  // Handle delivery failure
  private handleDeliveryFailure(messageId: string, userId: string, error: string): void {
    const status = this.deliveryQueue.get(messageId);
    if (status) {
      status.status = 'failed';
      status.errorReason = error;
      status.timestamp = new Date();
    }

    // Clear retry timeout
    const timeout = this.retryTimeouts.get(messageId);
    if (timeout) {
      clearTimeout(timeout);
      this.retryTimeouts.delete(messageId);
    }

    this.emit('delivery_failed', {
      type: 'delivery_failed',
      messageId,
      userId,
      timestamp: new Date(),
      metadata: { error },
    });

    // Attempt fallback delivery methods
    this.attemptFallbackDelivery(messageId, userId, error);
  }

  // Attempt fallback delivery methods
  private async attemptFallbackDelivery(messageId: string, userId: string, originalError: string): Promise<void> {
    try {
      const fallbackMethods = [];
      
      if (this.config.enableEmailFallback) {
        fallbackMethods.push('email');
      }
      
      if (this.config.enableSMSFallback) {
        fallbackMethods.push('sms');
      }

      if (fallbackMethods.length === 0) return;

      const response = await fetch(`${this.baseUrl}/api/messages/${messageId}/fallback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          methods: fallbackMethods,
          originalError,
        }),
      });

      if (response.ok) {
        this.emit('fallback_attempted', { messageId, userId, methods: fallbackMethods });
      }
    } catch (error) {
      console.error('Fallback delivery failed:', error);
    }
  }

  // Mark message as read
  public async markAsRead(messageId: string, conversationId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/messages/${messageId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          readAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to mark message as read: ${response.status}`);
      }

      // Emit read receipt via socket
      if (this.socket) {
        this.socket.emit('message_read', {
          messageId,
          conversationId,
          timestamp: new Date().toISOString(),
        });
      }

      this.emit('message_read', { messageId, conversationId, timestamp: new Date() });
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      throw error;
    }
  }

  // Mark multiple messages as read (batch operation)
  public async markMultipleAsRead(messageIds: string[], conversationId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/messages/batch-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageIds,
          conversationId,
          readAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to mark messages as read: ${response.status}`);
      }

      // Emit batch read receipt via socket
      if (this.socket) {
        this.socket.emit('messages_read', {
          messageIds,
          conversationId,
          timestamp: new Date().toISOString(),
        });
      }

      this.emit('messages_read', { messageIds, conversationId, timestamp: new Date() });
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
      throw error;
    }
  }

  // Get message delivery status
  public async getMessageStatus(messageId: string): Promise<MessageStatus[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/messages/${messageId}/status`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get message status: ${response.status}`);
      }

      const result = await response.json();
      return result.statuses;
    } catch (error) {
      console.error('Failed to get message status:', error);
      throw error;
    }
  }

  // Get delivery receipts for a message
  public async getDeliveryReceipts(messageId: string): Promise<DeliveryReceipt[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/messages/${messageId}/receipts`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get delivery receipts: ${response.status}`);
      }

      const result = await response.json();
      return result.receipts;
    } catch (error) {
      console.error('Failed to get delivery receipts:', error);
      throw error;
    }
  }

  // Get read receipt settings
  public async getReadReceiptSettings(conversationId?: string): Promise<ReadReceiptSettings> {
    try {
      const params = conversationId ? `?conversationId=${conversationId}` : '';
      const response = await fetch(`${this.baseUrl}/api/settings/read-receipts${params}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get read receipt settings: ${response.status}`);
      }

      const result = await response.json();
      return result.settings;
    } catch (error) {
      console.error('Failed to get read receipt settings:', error);
      throw error;
    }
  }

  // Update read receipt settings
  public async updateReadReceiptSettings(
    settings: Partial<ReadReceiptSettings>,
    conversationId?: string
  ): Promise<ReadReceiptSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/api/settings/read-receipts`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update read receipt settings: ${response.status}`);
      }

      const result = await response.json();
      this.emit('settings_updated', result.settings);
      return result.settings;
    } catch (error) {
      console.error('Failed to update read receipt settings:', error);
      throw error;
    }
  }

  // Get delivery metrics for a conversation or user
  public async getDeliveryMetrics(filters?: {
    conversationId?: string;
    userId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<DeliveryMetrics> {
    try {
      const params = new URLSearchParams();
      if (filters?.conversationId) params.append('conversationId', filters.conversationId);
      if (filters?.userId) params.append('userId', filters.userId);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString());
      if (filters?.dateTo) params.append('dateTo', filters.dateTo.toISOString());

      const response = await fetch(`${this.baseUrl}/api/messages/metrics?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get delivery metrics: ${response.status}`);
      }

      const result = await response.json();
      return result.metrics;
    } catch (error) {
      console.error('Failed to get delivery metrics:', error);
      throw error;
    }
  }

  // Get unread message count
  public async getUnreadCount(conversationId?: string): Promise<number> {
    try {
      const params = conversationId ? `?conversationId=${conversationId}` : '';
      const response = await fetch(`${this.baseUrl}/api/messages/unread-count${params}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get unread count: ${response.status}`);
      }

      const result = await response.json();
      return result.count;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      throw error;
    }
  }

  // Bulk mark conversations as read
  public async markConversationAsRead(conversationId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/conversations/${conversationId}/mark-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to mark conversation as read: ${response.status}`);
      }

      this.emit('conversation_read', { conversationId, timestamp: new Date() });
    } catch (error) {
      console.error('Failed to mark conversation as read:', error);
      throw error;
    }
  }

  // Get message status for local queue
  public getLocalMessageStatus(messageId: string): MessageStatus | null {
    return this.deliveryQueue.get(messageId) || null;
  }

  // Clear delivery queue (cleanup)
  public clearDeliveryQueue(): void {
    // Clear all timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    this.retryTimeouts.clear();
    
    // Clear delivery queue
    this.deliveryQueue.clear();
  }

  // Event system
  public on(event: string, callback: Function): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
    
    return () => {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  public destroy(): void {
    this.clearDeliveryQueue();
    this.eventListeners.clear();
    
    if (this.socket) {
      this.socket.off('message_delivered');
      this.socket.off('message_read');
      this.socket.off('message_failed');
    }
  }
}