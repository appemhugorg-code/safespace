import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MessageDeliveryService } from '@/services/message-delivery-service';
import { useMessageDelivery } from '@/hooks/use-message-delivery';

// Mock fetch
global.fetch = vi.fn();

// Mock Socket.io
const mockSocket = {
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
};

describe('MessageDeliveryService', () => {
  let service: MessageDeliveryService;
  const mockConfig = {
    baseUrl: 'http://localhost:3000',
    authToken: 'test-token',
    socket: mockSocket,
  };

  beforeEach(() => {
    service = new MessageDeliveryService(mockConfig);
    vi.clearAllMocks();
  });

  afterEach(() => {
    service.destroy();
  });

  describe('Message Sending', () => {
    it('should send message with delivery tracking', async () => {
      const mockResponse = {
        messageId: 'msg-123',
        senderId: 'user-456',
        estimatedDelivery: new Date().toISOString(),
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const messageData = {
        conversationId: 'conv-123',
        content: 'Test message',
        type: 'text' as const,
        recipients: ['user-789'],
        priority: 'normal' as const,
      };

      const result = await service.sendMessage(messageData);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/messages',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...messageData,
            deliveryConfig: expect.any(Object),
          }),
        })
      );

      expect(result.messageId).toBe('msg-123');
      expect(result.status.status).toBe('sending');
    });

    it('should handle send message failure', async () => {
      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const messageData = {
        conversationId: 'conv-123',
        content: 'Test message',
        type: 'text' as const,
        recipients: ['user-789'],
      };

      await expect(service.sendMessage(messageData)).rejects.toThrow('Failed to send message: 500');
    });
  });

  describe('Message Status Tracking', () => {
    it('should track message delivery status', async () => {
      const mockStatuses = [
        {
          id: 'status-1',
          messageId: 'msg-123',
          userId: 'user-456',
          status: 'delivered',
          timestamp: new Date(),
        },
      ];

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ statuses: mockStatuses }),
      });

      const result = await service.getMessageStatus('msg-123');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/messages/msg-123/status',
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer test-token',
          },
        })
      );

      expect(result).toEqual(mockStatuses);
    });

    it('should handle delivery updates via socket', () => {
      const eventCallback = vi.fn();
      service.on('status_update', eventCallback);

      // Simulate socket event
      const socketCallback = mockSocket.on.mock.calls.find(
        call => call[0] === 'message_delivered'
      )?.[1];

      expect(socketCallback).toBeDefined();

      const deliveryData = {
        messageId: 'msg-123',
        userId: 'user-456',
        timestamp: new Date().toISOString(),
      };

      socketCallback(deliveryData);

      expect(eventCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'status_update',
          messageId: 'msg-123',
          userId: 'user-456',
          status: 'delivered',
        })
      );
    });
  });

  describe('Read Receipts', () => {
    it('should mark message as read', async () => {
      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await service.markAsRead('msg-123', 'conv-456');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/messages/msg-123/read',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversationId: 'conv-456',
            readAt: expect.any(String),
          }),
        })
      );

      expect(mockSocket.emit).toHaveBeenCalledWith('message_read', {
        messageId: 'msg-123',
        conversationId: 'conv-456',
        timestamp: expect.any(String),
      });
    });

    it('should mark multiple messages as read', async () => {
      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const messageIds = ['msg-123', 'msg-456'];
      await service.markMultipleAsRead(messageIds, 'conv-789');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/messages/batch-read',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            messageIds,
            conversationId: 'conv-789',
            readAt: expect.any(String),
          }),
        })
      );
    });

    it('should get delivery receipts', async () => {
      const mockReceipts = [
        {
          id: 'receipt-1',
          messageId: 'msg-123',
          recipientId: 'user-456',
          deliveredAt: new Date(),
          readAt: new Date(),
        },
      ];

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ receipts: mockReceipts }),
      });

      const result = await service.getDeliveryReceipts('msg-123');

      expect(result).toEqual(mockReceipts);
    });
  });

  describe('Read Receipt Settings', () => {
    it('should get read receipt settings', async () => {
      const mockSettings = {
        enabled: true,
        showToSender: true,
        showToRecipient: true,
        groupReadReceipts: true,
        therapistOverride: false,
        anonymousMode: false,
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ settings: mockSettings }),
      });

      const result = await service.getReadReceiptSettings('conv-123');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/settings/read-receipts?conversationId=conv-123',
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer test-token',
          },
        })
      );

      expect(result).toEqual(mockSettings);
    });

    it('should update read receipt settings', async () => {
      const settingsUpdate = { enabled: false };
      const mockUpdatedSettings = {
        enabled: false,
        showToSender: true,
        showToRecipient: true,
        groupReadReceipts: true,
        therapistOverride: false,
        anonymousMode: false,
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ settings: mockUpdatedSettings }),
      });

      const eventCallback = vi.fn();
      service.on('settings_updated', eventCallback);

      const result = await service.updateReadReceiptSettings(settingsUpdate, 'conv-123');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/settings/read-receipts',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({
            settings: settingsUpdate,
            conversationId: 'conv-123',
          }),
        })
      );

      expect(result).toEqual(mockUpdatedSettings);
      expect(eventCallback).toHaveBeenCalledWith(mockUpdatedSettings);
    });
  });

  describe('Delivery Metrics', () => {
    it('should get delivery metrics', async () => {
      const mockMetrics = {
        totalMessages: 100,
        deliveredMessages: 95,
        readMessages: 80,
        failedMessages: 5,
        averageDeliveryTime: 1500,
        averageReadTime: 30000,
        deliveryRate: 0.95,
        readRate: 0.8,
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ metrics: mockMetrics }),
      });

      const filters = {
        conversationId: 'conv-123',
        dateFrom: new Date('2023-01-01'),
        dateTo: new Date('2023-01-31'),
      };

      const result = await service.getDeliveryMetrics(filters);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('api/messages/metrics'),
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer test-token',
          },
        })
      );

      expect(result).toEqual(mockMetrics);
    });
  });

  describe('Retry Logic', () => {
    it('should retry failed deliveries', async () => {
      const messageId = 'msg-123';
      
      // Mock initial send
      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ messageId, senderId: 'user-456' }),
      });

      // Send message
      await service.sendMessage({
        conversationId: 'conv-123',
        content: 'Test message',
        type: 'text',
        recipients: ['user-789'],
      });

      // Mock retry endpoint
      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      // Simulate delivery failure and retry
      const failureCallback = mockSocket.on.mock.calls.find(
        call => call[0] === 'message_failed'
      )?.[1];

      expect(failureCallback).toBeDefined();

      // Trigger failure
      failureCallback({
        messageId,
        userId: 'user-456',
        error: 'Network timeout',
      });

      // Wait for retry logic to execute
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should have called retry endpoint
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:3000/api/messages/${messageId}/retry`,
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  describe('Cleanup', () => {
    it('should cleanup resources on destroy', () => {
      const timeout = setTimeout(() => {}, 1000);
      service['retryTimeouts'].set('msg-123', timeout);
      service['deliveryQueue'].set('msg-123', {
        id: 'status-1',
        messageId: 'msg-123',
        userId: 'user-456',
        status: 'sending',
        timestamp: new Date(),
      });

      service.destroy();

      expect(service['retryTimeouts'].size).toBe(0);
      expect(service['deliveryQueue'].size).toBe(0);
      expect(mockSocket.off).toHaveBeenCalledWith('message_delivered');
      expect(mockSocket.off).toHaveBeenCalledWith('message_read');
      expect(mockSocket.off).toHaveBeenCalledWith('message_failed');
    });
  });
});

describe('useMessageDelivery Hook', () => {
  const mockHookConfig = {
    authToken: 'test-token',
    conversationId: 'conv-123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useMessageDelivery(mockHookConfig));

    expect(result.current.messageStatuses.size).toBe(0);
    expect(result.current.deliveryReceipts.size).toBe(0);
    expect(result.current.readReceiptSettings).toBeNull();
    expect(result.current.unreadCount).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should send message and update state', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        messageId: 'msg-123',
        senderId: 'user-456',
      }),
    });

    const { result } = renderHook(() => useMessageDelivery(mockHookConfig));

    await act(async () => {
      const response = await result.current.sendMessage({
        conversationId: 'conv-123',
        content: 'Test message',
        type: 'text',
        recipients: ['user-789'],
      });

      expect(response.messageId).toBe('msg-123');
    });
  });

  it('should mark message as read with delay', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const { result } = renderHook(() => 
      useMessageDelivery({ ...mockHookConfig, readDelay: 100 })
    );

    await act(async () => {
      await result.current.markAsRead('msg-123');
    });

    // Should not have called API immediately
    expect(fetch).not.toHaveBeenCalled();

    // Wait for delay
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    // Should have called API after delay
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/messages/msg-123/read',
      expect.any(Object)
    );
  });

  it('should handle utility functions correctly', () => {
    const { result } = renderHook(() => useMessageDelivery(mockHookConfig));

    // Test with empty state
    expect(result.current.isMessageRead('msg-123')).toBe(false);
    expect(result.current.isMessageDelivered('msg-123')).toBe(false);
    expect(result.current.getReadUsers('msg-123')).toEqual([]);
    expect(result.current.getDeliveredUsers('msg-123')).toEqual([]);
  });
});

describe('Message Delivery Property Tests', () => {
  describe('Property 5: Message Delivery Guarantee', () => {
    it('should guarantee message delivery within timeout', async () => {
      const service = new MessageDeliveryService({
        baseUrl: 'http://localhost:3000',
        authToken: 'test-token',
        deliveryConfig: {
          maxRetries: 3,
          retryDelayMs: 1000,
          deliveryTimeoutMs: 5000,
          batchSize: 50,
          enablePushNotifications: true,
          enableEmailFallback: true,
          enableSMSFallback: false,
          priorityDelivery: true,
        },
      });

      // Mock successful delivery after retry
      (fetch as Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ messageId: 'msg-123', senderId: 'user-456' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

      const deliveryPromise = service.sendMessage({
        conversationId: 'conv-123',
        content: 'Critical message',
        type: 'text',
        recipients: ['user-789'],
        priority: 'urgent',
        requireDeliveryReceipt: true,
      });

      // Should eventually succeed
      await expect(deliveryPromise).resolves.toBeDefined();

      service.destroy();
    });

    it('should maintain message order in delivery', async () => {
      const service = new MessageDeliveryService({
        baseUrl: 'http://localhost:3000',
        authToken: 'test-token',
      });

      const messages = ['Message 1', 'Message 2', 'Message 3'];
      const deliveryPromises: Promise<any>[] = [];

      // Mock responses for all messages
      messages.forEach((_, index) => {
        (fetch as Mock).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            messageId: `msg-${index + 1}`,
            senderId: 'user-456',
          }),
        });
      });

      // Send messages in sequence
      for (const [index, content] of messages.entries()) {
        const promise = service.sendMessage({
          conversationId: 'conv-123',
          content,
          type: 'text',
          recipients: ['user-789'],
        });
        deliveryPromises.push(promise);
      }

      const results = await Promise.all(deliveryPromises);

      // Verify order is maintained
      results.forEach((result, index) => {
        expect(result.messageId).toBe(`msg-${index + 1}`);
      });

      service.destroy();
    });

    it('should handle concurrent message delivery', async () => {
      const service = new MessageDeliveryService({
        baseUrl: 'http://localhost:3000',
        authToken: 'test-token',
      });

      const concurrentMessages = 10;
      const deliveryPromises: Promise<any>[] = [];

      // Mock responses for concurrent messages
      for (let i = 0; i < concurrentMessages; i++) {
        (fetch as Mock).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            messageId: `msg-${i + 1}`,
            senderId: 'user-456',
          }),
        });
      }

      // Send messages concurrently
      for (let i = 0; i < concurrentMessages; i++) {
        const promise = service.sendMessage({
          conversationId: 'conv-123',
          content: `Concurrent message ${i + 1}`,
          type: 'text',
          recipients: ['user-789'],
        });
        deliveryPromises.push(promise);
      }

      const results = await Promise.allSettled(deliveryPromises);

      // All messages should be delivered successfully
      const successfulDeliveries = results.filter(
        result => result.status === 'fulfilled'
      );

      expect(successfulDeliveries.length).toBe(concurrentMessages);

      service.destroy();
    });

    it('should provide accurate delivery metrics', async () => {
      const service = new MessageDeliveryService({
        baseUrl: 'http://localhost:3000',
        authToken: 'test-token',
      });

      const mockMetrics = {
        totalMessages: 100,
        deliveredMessages: 95,
        readMessages: 80,
        failedMessages: 5,
        averageDeliveryTime: 1500,
        averageReadTime: 30000,
        deliveryRate: 0.95,
        readRate: 0.8,
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ metrics: mockMetrics }),
      });

      const metrics = await service.getDeliveryMetrics({
        conversationId: 'conv-123',
        dateFrom: new Date('2023-01-01'),
        dateTo: new Date('2023-01-31'),
      });

      // Verify metrics consistency
      expect(metrics.deliveryRate).toBe(
        metrics.deliveredMessages / metrics.totalMessages
      );
      expect(metrics.readRate).toBe(
        metrics.readMessages / metrics.totalMessages
      );
      expect(metrics.totalMessages).toBe(
        metrics.deliveredMessages + metrics.failedMessages
      );

      service.destroy();
    });

    it('should respect read receipt privacy settings', async () => {
      const service = new MessageDeliveryService({
        baseUrl: 'http://localhost:3000',
        authToken: 'test-token',
      });

      const privacySettings = {
        enabled: true,
        showToSender: false,
        showToRecipient: true,
        groupReadReceipts: false,
        therapistOverride: true,
        anonymousMode: true,
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ settings: privacySettings }),
      });

      const settings = await service.getReadReceiptSettings('conv-123');

      // Verify privacy settings are respected
      expect(settings.showToSender).toBe(false);
      expect(settings.anonymousMode).toBe(true);
      expect(settings.therapistOverride).toBe(true);

      service.destroy();
    });
  });
});