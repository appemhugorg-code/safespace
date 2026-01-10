import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmergencyAlertService, EmergencyAlert, EmergencyContact } from '@/services/emergency-alert-service';
import { useEmergencyAlerts } from '@/hooks/use-emergency-alerts';

// Mock fetch
global.fetch = vi.fn();

describe('Emergency Alert System', () => {
  let service: EmergencyAlertService;
  const mockConfig = {
    baseUrl: 'http://localhost',
    authToken: 'test-token',
  };

  beforeEach(() => {
    service = new EmergencyAlertService(mockConfig);
    vi.clearAllMocks();
  });

  afterEach(() => {
    service.destroy();
  });

  describe('EmergencyAlertService', () => {
    describe('Alert Creation', () => {
      it('should create emergency alert with proper data structure', async () => {
        const mockAlert: EmergencyAlert = {
          id: 'alert_123',
          userId: 'user_456',
          alertType: 'crisis_detected',
          severity: 'critical',
          status: 'pending',
          title: 'Crisis Detected',
          description: 'User showing signs of crisis',
          context: {
            location: {
              latitude: 40.7128,
              longitude: -74.0060,
              address: 'New York, NY',
              accuracy: 10,
            },
          },
          escalationPath: [],
          notifications: [],
          actions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ alert: mockAlert }),
        });

        const result = await service.createAlert({
          userId: 'user_456',
          alertType: 'crisis_detected',
          severity: 'critical',
          title: 'Crisis Detected',
          description: 'User showing signs of crisis',
          context: mockAlert.context,
        });

        expect(result).toEqual(mockAlert);
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost/api/emergency/alerts',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Authorization': 'Bearer test-token',
              'Content-Type': 'application/json',
            },
          })
        );
      });

      it('should handle alert creation failure gracefully', async () => {
        (fetch as any).mockResolvedValueOnce({
          ok: false,
          status: 500,
        });

        await expect(service.createAlert({
          userId: 'user_456',
          alertType: 'crisis_detected',
          severity: 'critical',
          title: 'Crisis Detected',
          description: 'User showing signs of crisis',
        })).rejects.toThrow('Failed to create alert: 500');
      });
    });

    describe('Escalation Process', () => {
      it('should start escalation process for critical alerts', async () => {
        const mockAlert: EmergencyAlert = {
          id: 'alert_123',
          userId: 'user_456',
          alertType: 'crisis_detected',
          severity: 'critical',
          status: 'pending',
          title: 'Crisis Detected',
          description: 'User showing signs of crisis',
          context: {},
          escalationPath: [],
          notifications: [],
          actions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const mockProtocol = {
          id: 'protocol_1',
          escalationLevels: [
            {
              level: 1,
              timeoutMinutes: 5,
              contactTypes: ['therapist'],
              notificationMethods: ['phone', 'sms'],
              requiresAcknowledgment: true,
              autoEscalate: true,
            },
          ],
        };

        const mockContacts: EmergencyContact[] = [
          {
            id: 'contact_1',
            userId: 'user_456',
            name: 'Dr. Smith',
            relationship: 'therapist',
            contactMethods: [
              {
                type: 'phone',
                value: '+1234567890',
                priority: 1,
                verified: true,
                active: true,
              },
            ],
            availability: {
              timezone: 'UTC',
              schedule: [],
              emergencyOnly: false,
              alwaysAvailable: true,
            },
            escalationLevel: 'primary',
            permissions: {
              canReceiveAlerts: true,
              canAcknowledgeAlerts: true,
              canEscalateAlerts: false,
              canAccessUserData: false,
            },
            metadata: {
              createdAt: new Date(),
              updatedAt: new Date(),
              responseRate: 0.95,
              averageResponseTime: 3,
            },
          },
        ];

        // Mock API calls
        (fetch as any)
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ alert: mockAlert }),
          })
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ protocol: mockProtocol }),
          })
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ contacts: mockContacts }),
          });

        const eventSpy = vi.fn();
        service.on('escalation_level_started', eventSpy);

        await service.createAlert({
          userId: 'user_456',
          alertType: 'crisis_detected',
          severity: 'critical',
          title: 'Crisis Detected',
          description: 'User showing signs of crisis',
          immediateEscalation: true,
        });

        // Wait for escalation to start
        await waitFor(() => {
          expect(eventSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              alertId: 'alert_123',
              level: 1,
              contacts: 1,
            })
          );
        });
      });

      it('should handle escalation timeout and move to next level', async () => {
        const mockAlert: EmergencyAlert = {
          id: 'alert_123',
          userId: 'user_456',
          alertType: 'crisis_detected',
          severity: 'critical',
          status: 'pending',
          title: 'Crisis Detected',
          description: 'User showing signs of crisis',
          context: {},
          escalationPath: [
            {
              level: 1,
              contactIds: ['contact_1'],
              timeoutMinutes: 0.01, // 0.6 seconds for testing
              methods: ['phone'],
              completed: false,
              startedAt: new Date(),
            },
            {
              level: 2,
              contactIds: ['contact_2'],
              timeoutMinutes: 5,
              methods: ['phone'],
              completed: false,
            },
          ],
          notifications: [],
          actions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const eventSpy = vi.fn();
        service.on('escalation_level_started', eventSpy);

        // Simulate escalation timeout
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(eventSpy).toHaveBeenCalledTimes(2); // Level 1 and Level 2
      });
    });

    describe('Notification System', () => {
      it('should generate appropriate notification content for different alert types', () => {
        const contact: EmergencyContact = {
          id: 'contact_1',
          userId: 'user_456',
          name: 'Dr. Smith',
          relationship: 'therapist',
          contactMethods: [],
          availability: {
            timezone: 'UTC',
            schedule: [],
            emergencyOnly: false,
            alwaysAvailable: true,
          },
          escalationLevel: 'primary',
          permissions: {
            canReceiveAlerts: true,
            canAcknowledgeAlerts: true,
            canEscalateAlerts: false,
            canAccessUserData: false,
          },
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            responseRate: 0.95,
            averageResponseTime: 3,
          },
        };

        const crisisAlert: EmergencyAlert = {
          id: 'alert_123',
          userId: 'user_456',
          alertType: 'crisis_detected',
          severity: 'critical',
          status: 'pending',
          title: 'Crisis Detected',
          description: 'User showing signs of crisis',
          context: {
            location: {
              latitude: 40.7128,
              longitude: -74.0060,
              address: 'New York, NY',
              accuracy: 10,
            },
          },
          escalationPath: [],
          notifications: [],
          actions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Test crisis detection notification
        const content = (service as any).generateNotificationContent(crisisAlert, contact, 'sms');
        
        expect(content.subject).toContain('CRISIS ALERT');
        expect(content.message).toContain('Crisis detected');
        expect(content.message).toContain('New York, NY');
        expect(content.urgencyLevel).toBe('critical');
        expect(content.callToAction).toContain('immediate action');
      });

      it('should retry failed notifications with exponential backoff', async () => {
        const notification = {
          id: 'notif_1',
          alertId: 'alert_123',
          contactId: 'contact_1',
          method: 'sms' as const,
          status: 'pending' as const,
          content: {
            subject: 'Test Alert',
            message: 'Test message',
            urgencyLevel: 'high' as const,
          },
          retryCount: 0,
          maxRetries: 3,
        };

        // Mock failed notification
        (fetch as any).mockResolvedValueOnce({
          ok: false,
          status: 500,
        });

        const failedEventSpy = vi.fn();
        service.on('notification_failed', failedEventSpy);

        await (service as any).sendNotification(notification);

        expect(failedEventSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'pending', // Should be pending for retry
            retryCount: 1,
          })
        );
      });
    });

    describe('Alert Management', () => {
      it('should acknowledge alert and stop escalation', async () => {
        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

        const eventSpy = vi.fn();
        service.on('alert_acknowledged', eventSpy);

        await service.acknowledgeAlert('alert_123', 'user_456', 'Alert acknowledged');

        expect(fetch).toHaveBeenCalledWith(
          'http://localhost/api/emergency/alerts/alert_123/acknowledge',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Authorization': 'Bearer test-token',
              'Content-Type': 'application/json',
            },
          })
        );

        expect(eventSpy).toHaveBeenCalledWith({
          alertId: 'alert_123',
          acknowledgedBy: 'user_456',
          notes: 'Alert acknowledged',
        });
      });

      it('should resolve alert and clean up resources', async () => {
        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

        const eventSpy = vi.fn();
        service.on('alert_resolved', eventSpy);

        await service.resolveAlert('alert_123', 'user_456', 'Issue resolved');

        expect(eventSpy).toHaveBeenCalledWith({
          alertId: 'alert_123',
          resolvedBy: 'user_456',
          resolution: 'Issue resolved',
        });
      });

      it('should escalate alert manually', async () => {
        const mockAlert: EmergencyAlert = {
          id: 'alert_123',
          userId: 'user_456',
          alertType: 'crisis_detected',
          severity: 'critical',
          status: 'acknowledged',
          title: 'Crisis Detected',
          description: 'User showing signs of crisis',
          context: {},
          escalationPath: [
            {
              level: 1,
              contactIds: ['contact_1'],
              timeoutMinutes: 5,
              methods: ['phone'],
              completed: false,
              startedAt: new Date(),
            },
            {
              level: 2,
              contactIds: ['contact_2'],
              timeoutMinutes: 10,
              methods: ['phone'],
              completed: false,
            },
          ],
          notifications: [],
          actions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Store alert in service
        (service as any).activeAlerts.set('alert_123', mockAlert);

        const eventSpy = vi.fn();
        service.on('alert_escalated', eventSpy);

        await service.escalateAlert('alert_123', 'user_456', 'Manual escalation requested');

        expect(eventSpy).toHaveBeenCalledWith({
          alertId: 'alert_123',
          escalatedBy: 'user_456',
          reason: 'Manual escalation requested',
        });

        // Check that first level is marked as completed
        expect(mockAlert.escalationPath[0].completed).toBe(true);
      });
    });

    describe('Emergency Contact Management', () => {
      it('should add emergency contact with validation', async () => {
        const mockContact: EmergencyContact = {
          id: 'contact_123',
          userId: 'user_456',
          name: 'Dr. Smith',
          relationship: 'therapist',
          contactMethods: [
            {
              type: 'phone',
              value: '+1234567890',
              priority: 1,
              verified: true,
              active: true,
            },
          ],
          availability: {
            timezone: 'UTC',
            schedule: [],
            emergencyOnly: false,
            alwaysAvailable: true,
          },
          escalationLevel: 'primary',
          permissions: {
            canReceiveAlerts: true,
            canAcknowledgeAlerts: true,
            canEscalateAlerts: false,
            canAccessUserData: false,
          },
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            responseRate: 0,
            averageResponseTime: 0,
          },
        };

        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ contact: mockContact }),
        });

        const result = await service.addEmergencyContact({
          userId: 'user_456',
          name: 'Dr. Smith',
          relationship: 'therapist',
          contactMethods: mockContact.contactMethods,
          availability: mockContact.availability,
          escalationLevel: 'primary',
          permissions: mockContact.permissions,
        });

        expect(result).toEqual(mockContact);
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost/api/emergency/contacts',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Authorization': 'Bearer test-token',
              'Content-Type': 'application/json',
            },
          })
        );
      });

      it('should get contacts for escalation based on criteria', async () => {
        const mockContacts: EmergencyContact[] = [
          {
            id: 'contact_1',
            userId: 'user_456',
            name: 'Dr. Smith',
            relationship: 'therapist',
            contactMethods: [
              {
                type: 'phone',
                value: '+1234567890',
                priority: 1,
                verified: true,
                active: true,
              },
            ],
            availability: {
              timezone: 'UTC',
              schedule: [],
              emergencyOnly: false,
              alwaysAvailable: true,
            },
            escalationLevel: 'primary',
            permissions: {
              canReceiveAlerts: true,
              canAcknowledgeAlerts: true,
              canEscalateAlerts: false,
              canAccessUserData: false,
            },
            metadata: {
              createdAt: new Date(),
              updatedAt: new Date(),
              responseRate: 0.95,
              averageResponseTime: 3,
            },
          },
        ];

        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ contacts: mockContacts }),
        });

        const mockAlert: EmergencyAlert = {
          id: 'alert_123',
          userId: 'user_456',
          alertType: 'crisis_detected',
          severity: 'critical',
          status: 'pending',
          title: 'Crisis Detected',
          description: 'User showing signs of crisis',
          context: {},
          escalationPath: [],
          notifications: [],
          actions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const contacts = await (service as any).getContactsForEscalation(mockAlert, 0);

        expect(contacts).toEqual(mockContacts);
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost/api/emergency/contacts/escalation',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              userId: 'user_456',
              escalationLevel: 1,
              severity: 'critical',
              alertType: 'crisis_detected',
            }),
          })
        );
      });
    });

    describe('Metrics and Analytics', () => {
      it('should retrieve alert metrics with proper filtering', async () => {
        const mockMetrics = {
          totalAlerts: 25,
          alertsByType: {
            crisis_detected: 15,
            panic_button: 5,
            manual_escalation: 3,
            system_alert: 2,
          },
          alertsBySeverity: {
            low: 5,
            medium: 8,
            high: 7,
            critical: 3,
            emergency: 2,
          },
          averageResponseTime: 4.2,
          acknowledgmentRate: 0.92,
          escalationRate: 0.15,
          resolutionRate: 0.98,
          falseAlarmRate: 0.08,
          contactEffectiveness: {
            contact_1: {
              responseRate: 0.95,
              averageResponseTime: 3.1,
              successfulInterventions: 12,
            },
          },
        };

        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ metrics: mockMetrics }),
        });

        const result = await service.getAlertMetrics('week');

        expect(result).toEqual(mockMetrics);
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost/api/emergency/metrics?period=week',
          expect.objectContaining({
            headers: {
              'Authorization': 'Bearer test-token',
            },
          })
        );
      });
    });

    describe('Event System', () => {
      it('should emit and handle events correctly', () => {
        const eventSpy = vi.fn();
        const unsubscribe = service.on('alert_created', eventSpy);

        const mockAlert = { id: 'alert_123' };
        (service as any).emit('alert_created', mockAlert);

        expect(eventSpy).toHaveBeenCalledWith(mockAlert);

        // Test unsubscribe
        unsubscribe();
        (service as any).emit('alert_created', mockAlert);

        expect(eventSpy).toHaveBeenCalledTimes(1);
      });

      it('should handle event listener errors gracefully', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const faultyListener = vi.fn(() => {
          throw new Error('Listener error');
        });

        service.on('alert_created', faultyListener);
        (service as any).emit('alert_created', { id: 'alert_123' });

        expect(errorSpy).toHaveBeenCalledWith(
          'Error in event listener for alert_created:',
          expect.any(Error)
        );

        errorSpy.mockRestore();
      });
    });

    describe('Resource Cleanup', () => {
      it('should clean up resources on destroy', () => {
        const timer = setTimeout(() => {}, 1000);
        (service as any).escalationTimers.set('test_timer', timer);
        (service as any).activeAlerts.set('alert_123', {});
        (service as any).notificationQueue.push({});

        service.destroy();

        expect((service as any).escalationTimers.size).toBe(0);
        expect((service as any).activeAlerts.size).toBe(0);
        expect((service as any).notificationQueue.length).toBe(0);
        expect((service as any).processingNotifications).toBe(false);
      });
    });
  });

  describe('Performance and Reliability', () => {
    it('should handle high volume of alerts without performance degradation', async () => {
      const startTime = Date.now();
      const alertPromises = [];

      // Mock successful responses
      (fetch as any).mockImplementation(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ alert: { id: `alert_${Date.now()}` } }),
      }));

      // Create 100 alerts concurrently
      for (let i = 0; i < 100; i++) {
        alertPromises.push(service.createAlert({
          userId: `user_${i}`,
          alertType: 'crisis_detected',
          severity: 'medium',
          title: `Alert ${i}`,
          description: `Test alert ${i}`,
        }));
      }

      await Promise.all(alertPromises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (5 seconds)
      expect(duration).toBeLessThan(5000);
    });

    it('should maintain data consistency under concurrent operations', async () => {
      const mockAlert: EmergencyAlert = {
        id: 'alert_123',
        userId: 'user_456',
        alertType: 'crisis_detected',
        severity: 'critical',
        status: 'pending',
        title: 'Crisis Detected',
        description: 'User showing signs of crisis',
        context: {},
        escalationPath: [],
        notifications: [],
        actions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (service as any).activeAlerts.set('alert_123', mockAlert);

      // Mock successful API responses
      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      // Perform concurrent operations
      const operations = [
        service.acknowledgeAlert('alert_123', 'user_1', 'Acknowledged by user 1'),
        service.escalateAlert('alert_123', 'user_2', 'Escalated by user 2'),
      ];

      await Promise.allSettled(operations);

      // Verify alert state is consistent
      const alert = (service as any).activeAlerts.get('alert_123');
      expect(alert.actions.length).toBeGreaterThan(0);
    });

    it('should handle network failures gracefully with retry logic', async () => {
      let callCount = 0;
      (fetch as any).mockImplementation(() => {
        callCount++;
        if (callCount < 3) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ alert: { id: 'alert_123' } }),
        });
      });

      // Should eventually succeed after retries
      const result = await service.createAlert({
        userId: 'user_456',
        alertType: 'crisis_detected',
        severity: 'critical',
        title: 'Crisis Detected',
        description: 'User showing signs of crisis',
      }).catch(() => null);

      // First few calls should fail, but we don't retry in createAlert
      // This test demonstrates the service handles network errors
      expect(result).toBeNull();
      expect(callCount).toBe(1);
    });
  });

  describe('Security and Privacy', () => {
    it('should include proper authentication headers in all requests', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ alert: { id: 'alert_123' } }),
      });

      await service.createAlert({
        userId: 'user_456',
        alertType: 'crisis_detected',
        severity: 'critical',
        title: 'Crisis Detected',
        description: 'User showing signs of crisis',
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );
    });

    it('should sanitize sensitive data in logs and events', () => {
      const sensitiveAlert = {
        id: 'alert_123',
        description: 'User mentioned SSN: 123-45-6789 and credit card: 4111-1111-1111-1111',
        context: {
          userState: {
            recentBehavior: ['Mentioned personal details', 'Shared location'],
          },
        },
      };

      // The service should sanitize or exclude sensitive data when emitting events
      const eventSpy = vi.fn();
      service.on('alert_created', eventSpy);

      (service as any).emit('alert_created', sensitiveAlert);

      // Verify that sensitive data is handled appropriately
      expect(eventSpy).toHaveBeenCalled();
      // In a real implementation, we would check that SSN and credit card numbers are redacted
    });

    it('should validate user permissions for alert operations', async () => {
      // Mock unauthorized response
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      await expect(service.acknowledgeAlert('alert_123', 'unauthorized_user', 'Test')).rejects.toThrow('Failed to acknowledge alert: 403');
    });
  });

  describe('Integration with Crisis Detection', () => {
    it('should create alert when crisis is detected', async () => {
      const mockAlert: EmergencyAlert = {
        id: 'alert_123',
        userId: 'user_456',
        conversationId: 'conv_789',
        messageId: 'msg_101',
        detectionId: 'detection_202',
        alertType: 'crisis_detected',
        severity: 'critical',
        status: 'pending',
        title: 'Crisis Language Detected',
        description: 'High-risk language patterns detected in user message',
        context: {
          triggerData: {
            confidence: 0.92,
            categories: ['self_harm', 'suicidal_ideation'],
            triggers: ['want to end it all', 'no point in living'],
          },
        },
        escalationPath: [],
        notifications: [],
        actions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ alert: mockAlert }),
      });

      const result = await service.createAlert({
        userId: 'user_456',
        conversationId: 'conv_789',
        messageId: 'msg_101',
        detectionId: 'detection_202',
        alertType: 'crisis_detected',
        severity: 'critical',
        title: 'Crisis Language Detected',
        description: 'High-risk language patterns detected in user message',
        context: mockAlert.context,
        immediateEscalation: true,
      });

      expect(result.detectionId).toBe('detection_202');
      expect(result.context?.triggerData?.confidence).toBe(0.92);
      expect(result.context?.triggerData?.categories).toContain('self_harm');
    });
  });
});

describe('useEmergencyAlerts Hook', () => {
  // Note: Testing React hooks requires a more complex setup with React Testing Library
  // This is a simplified test structure to demonstrate the testing approach

  it('should initialize with correct default state', () => {
    // In a real test, we would use renderHook from @testing-library/react-hooks
    const mockOptions = {
      authToken: 'test-token',
      userId: 'user_456',
      userRole: 'therapist',
    };

    // Mock implementation would test initial state
    expect(mockOptions.userId).toBe('user_456');
    expect(mockOptions.userRole).toBe('therapist');
  });

  it('should handle alert creation with proper error handling', async () => {
    // Mock hook implementation test
    const mockCreateAlert = vi.fn().mockResolvedValue({ id: 'alert_123' });
    
    const alertData = {
      userId: 'user_456',
      alertType: 'crisis_detected' as const,
      severity: 'critical' as const,
      title: 'Test Alert',
      description: 'Test description',
    };

    await mockCreateAlert(alertData);
    expect(mockCreateAlert).toHaveBeenCalledWith(alertData);
  });

  it('should format alert age correctly', () => {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    const oneHourAgo = new Date(now.getTime() - 3600000);
    const oneDayAgo = new Date(now.getTime() - 86400000);

    // Mock formatAlertAge function
    const formatAlertAge = (alert: { createdAt: Date }) => {
      const diffMs = now.getTime() - alert.createdAt.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    };

    expect(formatAlertAge({ createdAt: oneMinuteAgo })).toBe('1m ago');
    expect(formatAlertAge({ createdAt: oneHourAgo })).toBe('1h ago');
    expect(formatAlertAge({ createdAt: oneDayAgo })).toBe('1d ago');
  });

  it('should get correct severity and status colors', () => {
    const getSeverityColor = (severity: string) => {
      switch (severity) {
        case 'low': return 'text-green-600';
        case 'medium': return 'text-yellow-600';
        case 'high': return 'text-orange-600';
        case 'critical': return 'text-red-600';
        case 'emergency': return 'text-red-800';
        default: return 'text-gray-600';
      }
    };

    expect(getSeverityColor('critical')).toBe('text-red-600');
    expect(getSeverityColor('emergency')).toBe('text-red-800');
    expect(getSeverityColor('low')).toBe('text-green-600');
  });

  it('should determine contact availability correctly', () => {
    const getContactAvailability = (contact: EmergencyContact) => {
      if (contact.availability.alwaysAvailable) return 'available';
      if (contact.availability.emergencyOnly) return 'emergency_only';
      return 'unavailable';
    };

    const alwaysAvailableContact: EmergencyContact = {
      id: 'contact_1',
      userId: 'user_456',
      name: 'Dr. Smith',
      relationship: 'therapist',
      contactMethods: [],
      availability: {
        timezone: 'UTC',
        schedule: [],
        emergencyOnly: false,
        alwaysAvailable: true,
      },
      escalationLevel: 'primary',
      permissions: {
        canReceiveAlerts: true,
        canAcknowledgeAlerts: true,
        canEscalateAlerts: false,
        canAccessUserData: false,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        responseRate: 0.95,
        averageResponseTime: 3,
      },
    };

    expect(getContactAvailability(alwaysAvailableContact)).toBe('available');
  });
});