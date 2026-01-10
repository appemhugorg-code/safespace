import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  MessageDeliveryService, 
  MessageStatus, 
  DeliveryReceipt, 
  ReadReceiptSettings, 
  DeliveryMetrics,
  MessageDeliveryEvent
} from '@/services/message-delivery-service';

export interface UseMessageDeliveryOptions {
  baseUrl?: string;
  authToken: string;
  socket?: any;
  conversationId?: string;
  enableAutoRead?: boolean;
  readDelay?: number; // ms to wait before marking as read
}

export interface UseMessageDeliveryReturn {
  // State
  messageStatuses: Map<string, MessageStatus>;
  deliveryReceipts: Map<string, DeliveryReceipt[]>;
  readReceiptSettings: ReadReceiptSettings | null;
  unreadCount: number;
  deliveryMetrics: DeliveryMetrics | null;
  isLoading: boolean;
  error: string | null;

  // Message operations
  sendMessage: (data: {
    conversationId: string;
    content: string;
    type: 'text' | 'file' | 'image' | 'video' | 'audio';
    recipients: string[];
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    requireDeliveryReceipt?: boolean;
    requireReadReceipt?: boolean;
    metadata?: Record<string, any>;
  }) => Promise<{ messageId: string; status: MessageStatus }>;
  
  markAsRead: (messageId: string, conversationId?: string) => Promise<void>;
  markMultipleAsRead: (messageIds: string[], conversationId?: string) => Promise<void>;
  markConversationAsRead: (conversationId: string) => Promise<void>;
  
  // Status and receipts
  getMessageStatus: (messageId: string) => Promise<MessageStatus[]>;
  getDeliveryReceipts: (messageId: string) => Promise<DeliveryReceipt[]>;
  refreshUnreadCount: (conversationId?: string) => Promise<void>;
  
  // Settings
  updateReadReceiptSettings: (settings: Partial<ReadReceiptSettings>, conversationId?: string) => Promise<void>;
  refreshSettings: (conversationId?: string) => Promise<void>;
  
  // Metrics
  refreshMetrics: (filters?: {
    conversationId?: string;
    userId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) => Promise<void>;
  
  // Utilities
  getLocalMessageStatus: (messageId: string) => MessageStatus | null;
  isMessageRead: (messageId: string, userId?: string) => boolean;
  isMessageDelivered: (messageId: string, userId?: string) => boolean;
  getReadUsers: (messageId: string) => string[];
  getDeliveredUsers: (messageId: string) => string[];
  
  // Events
  onStatusUpdate: (callback: (event: MessageDeliveryEvent) => void) => () => void;
  onDeliveryReceipt: (callback: (receipt: DeliveryReceipt) => void) => () => void;
  onReadReceipt: (callback: (receipt: DeliveryReceipt) => void) => () => void;
}

export function useMessageDelivery(options: UseMessageDeliveryOptions): UseMessageDeliveryReturn {
  const {
    baseUrl = '/api',
    authToken,
    socket,
    conversationId,
    enableAutoRead = true,
    readDelay = 1000,
  } = options;

  // State
  const [messageStatuses, setMessageStatuses] = useState<Map<string, MessageStatus>>(new Map());
  const [deliveryReceipts, setDeliveryReceipts] = useState<Map<string, DeliveryReceipt[]>>(new Map());
  const [readReceiptSettings, setReadReceiptSettings] = useState<ReadReceiptSettings | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [deliveryMetrics, setDeliveryMetrics] = useState<DeliveryMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const serviceRef = useRef<MessageDeliveryService | null>(null);
  const eventUnsubscribersRef = useRef<(() => void)[]>([]);
  const readTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const visibilityObserverRef = useRef<IntersectionObserver | null>(null);

  // Initialize service
  useEffect(() => {
    const service = new MessageDeliveryService({
      baseUrl,
      authToken,
      socket,
    });

    serviceRef.current = service;
    setupEventListeners(service);
    loadInitialData();

    return () => {
      cleanup();
    };
  }, [baseUrl, authToken, socket]);

  // Setup event listeners
  const setupEventListeners = useCallback((service: MessageDeliveryService) => {
    const unsubscribers: (() => void)[] = [];

    unsubscribers.push(
      service.on('status_update', (event: MessageDeliveryEvent) => {
        if (event.messageId && event.status) {
          setMessageStatuses(prev => {
            const newMap = new Map(prev);
            const existing = newMap.get(event.messageId);
            if (existing) {
              existing.status = event.status!;
              existing.timestamp = event.timestamp;
            }
            return newMap;
          });
        }
      })
    );

    unsubscribers.push(
      service.on('message_sent', (data: { messageId: string; status: MessageStatus }) => {
        setMessageStatuses(prev => {
          const newMap = new Map(prev);
          newMap.set(data.messageId, data.status);
          return newMap;
        });
      })
    );

    unsubscribers.push(
      service.on('delivery_failed', (event: MessageDeliveryEvent) => {
        setError(`Message delivery failed: ${event.metadata?.error || 'Unknown error'}`);
      })
    );

    unsubscribers.push(
      service.on('message_read', () => {
        refreshUnreadCount(conversationId);
      })
    );

    unsubscribers.push(
      service.on('messages_read', () => {
        refreshUnreadCount(conversationId);
      })
    );

    eventUnsubscribersRef.current = unsubscribers;
  }, [conversationId]);

  // Cleanup
  const cleanup = useCallback(() => {
    eventUnsubscribersRef.current.forEach(unsubscribe => unsubscribe());
    eventUnsubscribersRef.current = [];

    // Clear read timeouts
    readTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    readTimeoutsRef.current.clear();

    // Disconnect visibility observer
    if (visibilityObserverRef.current) {
      visibilityObserverRef.current.disconnect();
    }

    if (serviceRef.current) {
      serviceRef.current.destroy();
      serviceRef.current = null;
    }
  }, []);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    if (!serviceRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const [settings, count] = await Promise.all([
        serviceRef.current.getReadReceiptSettings(conversationId),
        serviceRef.current.getUnreadCount(conversationId),
      ]);

      setReadReceiptSettings(settings);
      setUnreadCount(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load initial data');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  // Send message
  const sendMessage = useCallback(async (data: {
    conversationId: string;
    content: string;
    type: 'text' | 'file' | 'image' | 'video' | 'audio';
    recipients: string[];
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    requireDeliveryReceipt?: boolean;
    requireReadReceipt?: boolean;
    metadata?: Record<string, any>;
  }) => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    setError(null);

    try {
      const result = await serviceRef.current.sendMessage(data);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to send message';
      setError(error);
      throw err;
    }
  }, []);

  // Mark message as read with optional delay
  const markAsRead = useCallback(async (messageId: string, targetConversationId?: string) => {
    if (!serviceRef.current) return;

    const conversationToUse = targetConversationId || conversationId;
    if (!conversationToUse) return;

    // Clear existing timeout for this message
    const existingTimeout = readTimeoutsRef.current.get(messageId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout for delayed read
    const timeout = setTimeout(async () => {
      try {
        await serviceRef.current!.markAsRead(messageId, conversationToUse);
        readTimeoutsRef.current.delete(messageId);
      } catch (err) {
        console.error('Failed to mark message as read:', err);
      }
    }, readDelay);

    readTimeoutsRef.current.set(messageId, timeout);
  }, [conversationId, readDelay]);

  // Mark multiple messages as read
  const markMultipleAsRead = useCallback(async (messageIds: string[], targetConversationId?: string) => {
    if (!serviceRef.current) return;

    const conversationToUse = targetConversationId || conversationId;
    if (!conversationToUse) return;

    try {
      await serviceRef.current.markMultipleAsRead(messageIds, conversationToUse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark messages as read');
      throw err;
    }
  }, [conversationId]);

  // Mark entire conversation as read
  const markConversationAsRead = useCallback(async (targetConversationId: string) => {
    if (!serviceRef.current) return;

    try {
      await serviceRef.current.markConversationAsRead(targetConversationId);
      if (targetConversationId === conversationId) {
        setUnreadCount(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark conversation as read');
      throw err;
    }
  }, [conversationId]);

  // Get message status
  const getMessageStatus = useCallback(async (messageId: string): Promise<MessageStatus[]> => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    try {
      const statuses = await serviceRef.current.getMessageStatus(messageId);
      
      // Update local state
      statuses.forEach(status => {
        setMessageStatuses(prev => {
          const newMap = new Map(prev);
          newMap.set(messageId, status);
          return newMap;
        });
      });

      return statuses;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get message status');
      throw err;
    }
  }, []);

  // Get delivery receipts
  const getDeliveryReceipts = useCallback(async (messageId: string): Promise<DeliveryReceipt[]> => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    try {
      const receipts = await serviceRef.current.getDeliveryReceipts(messageId);
      
      // Update local state
      setDeliveryReceipts(prev => {
        const newMap = new Map(prev);
        newMap.set(messageId, receipts);
        return newMap;
      });

      return receipts;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get delivery receipts');
      throw err;
    }
  }, []);

  // Refresh unread count
  const refreshUnreadCount = useCallback(async (targetConversationId?: string) => {
    if (!serviceRef.current) return;

    try {
      const count = await serviceRef.current.getUnreadCount(targetConversationId);
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to refresh unread count:', err);
    }
  }, []);

  // Update read receipt settings
  const updateReadReceiptSettings = useCallback(async (
    settings: Partial<ReadReceiptSettings>,
    targetConversationId?: string
  ) => {
    if (!serviceRef.current) return;

    try {
      const updatedSettings = await serviceRef.current.updateReadReceiptSettings(settings, targetConversationId);
      setReadReceiptSettings(updatedSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      throw err;
    }
  }, []);

  // Refresh settings
  const refreshSettings = useCallback(async (targetConversationId?: string) => {
    if (!serviceRef.current) return;

    try {
      const settings = await serviceRef.current.getReadReceiptSettings(targetConversationId);
      setReadReceiptSettings(settings);
    } catch (err) {
      console.error('Failed to refresh settings:', err);
    }
  }, []);

  // Refresh metrics
  const refreshMetrics = useCallback(async (filters?: {
    conversationId?: string;
    userId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) => {
    if (!serviceRef.current) return;

    try {
      const metrics = await serviceRef.current.getDeliveryMetrics(filters);
      setDeliveryMetrics(metrics);
    } catch (err) {
      console.error('Failed to refresh metrics:', err);
    }
  }, []);

  // Get local message status
  const getLocalMessageStatus = useCallback((messageId: string): MessageStatus | null => {
    return messageStatuses.get(messageId) || null;
  }, [messageStatuses]);

  // Check if message is read
  const isMessageRead = useCallback((messageId: string, userId?: string): boolean => {
    const receipts = deliveryReceipts.get(messageId);
    if (!receipts) return false;

    if (userId) {
      return receipts.some(receipt => receipt.recipientId === userId && receipt.readAt);
    }

    return receipts.every(receipt => receipt.readAt);
  }, [deliveryReceipts]);

  // Check if message is delivered
  const isMessageDelivered = useCallback((messageId: string, userId?: string): boolean => {
    const receipts = deliveryReceipts.get(messageId);
    if (!receipts) return false;

    if (userId) {
      return receipts.some(receipt => receipt.recipientId === userId);
    }

    return receipts.length > 0;
  }, [deliveryReceipts]);

  // Get users who read the message
  const getReadUsers = useCallback((messageId: string): string[] => {
    const receipts = deliveryReceipts.get(messageId);
    if (!receipts) return [];

    return receipts
      .filter(receipt => receipt.readAt)
      .map(receipt => receipt.recipientId);
  }, [deliveryReceipts]);

  // Get users who received the message
  const getDeliveredUsers = useCallback((messageId: string): string[] => {
    const receipts = deliveryReceipts.get(messageId);
    if (!receipts) return [];

    return receipts.map(receipt => receipt.recipientId);
  }, [deliveryReceipts]);

  // Event handlers
  const onStatusUpdate = useCallback((callback: (event: MessageDeliveryEvent) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('status_update', callback);
  }, []);

  const onDeliveryReceipt = useCallback((callback: (receipt: DeliveryReceipt) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('delivery_receipt', callback);
  }, []);

  const onReadReceipt = useCallback((callback: (receipt: DeliveryReceipt) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('read_receipt', callback);
  }, []);

  // Auto-mark messages as read when they become visible
  useEffect(() => {
    if (!enableAutoRead) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute('data-message-id');
            if (messageId) {
              markAsRead(messageId);
            }
          }
        });
      },
      { threshold: 0.5, rootMargin: '0px 0px -50px 0px' }
    );

    visibilityObserverRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [enableAutoRead, markAsRead]);

  return {
    // State
    messageStatuses,
    deliveryReceipts,
    readReceiptSettings,
    unreadCount,
    deliveryMetrics,
    isLoading,
    error,

    // Message operations
    sendMessage,
    markAsRead,
    markMultipleAsRead,
    markConversationAsRead,

    // Status and receipts
    getMessageStatus,
    getDeliveryReceipts,
    refreshUnreadCount,

    // Settings
    updateReadReceiptSettings,
    refreshSettings,

    // Metrics
    refreshMetrics,

    // Utilities
    getLocalMessageStatus,
    isMessageRead,
    isMessageDelivered,
    getReadUsers,
    getDeliveredUsers,

    // Events
    onStatusUpdate,
    onDeliveryReceipt,
    onReadReceipt,
  };
}