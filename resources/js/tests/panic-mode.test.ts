import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PanicModeService, PanicResource, PanicSession, BreathingExercise } from '@/services/panic-mode-service';

// Mock fetch and geolocation
global.fetch = vi.fn();
global.navigator = {
  ...global.navigator,
  geolocation: {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
};

describe('Panic Mode System', () => {
  let service: PanicModeService;
  const mockConfig = {
    baseUrl: 'http://localhost',
    authToken: 'test-token',
  };

  beforeEach(() => {
    service = new PanicModeService(mockConfig);
    vi.clearAllMocks();
  });

  afterEach(() => {
    service.destroy();
  });

  describe('PanicModeService', () => {
    describe('Panic Mode Activation', () => {
      it('should start panic mode session with location tracking', async () => {
        const mockLocation = {
          latitude: 40.7128,
          longitude: -74.0060,
          accuracy: 10,
        };

        const mockSession: PanicSession = {
          id: 'session_123',
          userId: 'user_456',
          startedAt: new Date(),
          triggerSource: 'manual',
          location: mockLocation,
          resourcesAccessed: [],
          emergencyContacted: false,
          followUpRequired: true,
          status: 'active',
        };

        // Mock geolocation
        (navigator.geolocation.getCurrentPosition as any).mockImplementation((success: any) => {
          success({
            coords: mockLocation,
          });
        });

        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ session: mockSession }),
        });

        const eventSpy = vi.fn();
        service.on('panic_mode_started', eventSpy);

        const result = await service.startPanicMode('manual');

        expect(result).toEqual(mockSession);
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost/api/panic/sessions',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Authorization': 'Bearer test-token',
              'Content-Type': 'application/json',
            },
          })
        );
        expect(eventSpy).toHaveBeenCalledWith(mockSession);
      });

      it('should handle panic mode activation without location', async () => {
        const mockSession: PanicSession = {
          id: 'session_123',
          userId: 'user_456',
          startedAt: new Date(),
          triggerSource: 'crisis_detection',
          resourcesAccessed: [],
          emergencyContacted: false,
          followUpRequired: true,
          status: 'active',
        };

        // Mock geolocation failure
        (navigator.geolocation.getCurrentPosition as any).mockImplementation((success: any, error: any) => {
          error(new Error('Location not available'));
        });

        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ session: mockSession }),
        });

        const result = await service.startPanicMode('crisis_detection');

        expect(result.location).toBeUndefined();
        expect(result.triggerSource).toBe('crisis_detection');
      });

      it('should end panic mode session and clean up resources', async () => {
        const mockSession: PanicSession = {
          id: 'session_123',
          userId: 'user_456',
          startedAt: new Date(),
          triggerSource: 'manual',
          resourcesAccessed: [],
          emergencyContacted: false,
          followUpRequired: true,
          status: 'active',
        };

        // Set current session
        (service as any).currentSession = mockSession;

        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

        const eventSpy = vi.fn();
        service.on('panic_mode_ended', eventSpy);

        await service.endPanicMode('Session completed successfully');

        expect(fetch).toHaveBeenCalledWith(
          'http://localhost/api/panic/sessions/session_123/end',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              endedAt: expect.any(String),
              notes: 'Session completed successfully',
              status: 'completed',
            }),
          })
        );
        expect(eventSpy).toHaveBeenCalledWith({
          sessionId: 'session_123',
          notes: 'Session completed successfully',
        });
        expect(service.getCurrentSession()).toBeNull();
      });
    });

    describe('Resource Management', () => {
      it('should get panic resources with location filtering', async () => {
        const mockResources: PanicResource[] = [
          {
            id: 'resource_1',
            type: 'hotline',
            name: 'Crisis Hotline',
            description: '24/7 crisis support',
            contactInfo: { phone: '988' },
            availability: {
              alwaysAvailable: true,
              languages: ['en'],
            },
            priority: 1,
            ageGroups: ['teen', 'adult'],
            categories: ['crisis', 'suicide_prevention'],
            verified: true,
            lastUpdated: new Date(),
          },
        ];

        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ resources: mockResources }),
        });

        const result = await service.getPanicResources({
          type: 'hotline',
          location: { latitude: 40.7128, longitude: -74.0060 },
          emergency: true,
        });

        expect(result).toEqual(mockResources);
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('type=hotline'),
          expect.objectContaining({
            headers: {
              'Authorization': 'Bearer test-token',
            },
          })
        );
      });

      it('should access resource and track usage', async () => {
        const mockSession: PanicSession = {
          id: 'session_123',
          userId: 'user_456',
          startedAt: new Date(),
          triggerSource: 'manual',
          resourcesAccessed: [],
          emergencyContacted: false,
          followUpRequired: true,
          status: 'active',
        };

        (service as any).currentSession = mockSession;

        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

        const eventSpy = vi.fn();
        service.on('resource_accessed', eventSpy);

        await service.accessResource('resource_1');

        expect(fetch).toHaveBeenCalledWith(
          'http://localhost/api/panic/sessions/session_123/resources',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              resourceId: 'resource_1',
              accessedAt: expect.any(String),
            }),
          })
        );
        expect(mockSession.resourcesAccessed).toHaveLength(1);
        expect(mockSession.resourcesAccessed[0].resourceId).toBe('resource_1');
        expect(eventSpy).toHaveBeenCalledWith({
          resourceId: 'resource_1',
          sessionId: 'session_123',
        });
      });

      it('should rate resource helpfulness', async () => {
        const mockSession: PanicSession = {
          id: 'session_123',
          userId: 'user_456',
          startedAt: new Date(),
          triggerSource: 'manual',
          resourcesAccessed: [
            {
              resourceId: 'resource_1',
              accessedAt: new Date(),
              completed: false,
            },
          ],
          emergencyContacted: false,
          followUpRequired: true,
          status: 'active',
        };

        (service as any).currentSession = mockSession;

        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

        const eventSpy = vi.fn();
        service.on('resource_rated', eventSpy);

        await service.rateResource('resource_1', true, 'Very helpful');

        expect(fetch).toHaveBeenCalledWith(
          'http://localhost/api/panic/resources/resource_1/rate',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              sessionId: 'session_123',
              helpful: true,
              feedback: 'Very helpful',
            }),
          })
        );
        expect(mockSession.resourcesAccessed[0].helpful).toBe(true);
        expect(mockSession.resourcesAccessed[0].completed).toBe(true);
        expect(eventSpy).toHaveBeenCalledWith({
          resourceId: 'resource_1',
          helpful: true,
          feedback: 'Very helpful',
        });
      });
    });

    describe('Emergency Services', () => {
      it('should contact emergency services with location', async () => {
        const mockSession: PanicSession = {
          id: 'session_123',
          userId: 'user_456',
          startedAt: new Date(),
          triggerSource: 'manual',
          location: {
            latitude: 40.7128,
            longitude: -74.0060,
            accuracy: 10,
          },
          resourcesAccessed: [],
          emergencyContacted: false,
          followUpRequired: true,
          status: 'active',
        };

        (service as any).currentSession = mockSession;

        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

        const eventSpy = vi.fn();
        service.on('emergency_contacted', eventSpy);

        await service.contactEmergencyServices();

        expect(fetch).toHaveBeenCalledWith(
          'http://localhost/api/panic/emergency',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              sessionId: 'session_123',
              location: mockSession.location,
              timestamp: expect.any(String),
            }),
          })
        );
        expect(mockSession.emergencyContacted).toBe(true);
        expect(eventSpy).toHaveBeenCalledWith({
          sessionId: 'session_123',
          location: mockSession.location,
        });
      });

      it('should get nearby emergency services', async () => {
        const mockServices = [
          {
            id: 'service_1',
            name: 'City Hospital',
            type: 'hospital',
            address: '123 Main St',
            coordinates: { latitude: 40.7128, longitude: -74.0060 },
            distance: 2.5,
            contactInfo: { phone: '555-0123' },
            availability: { hours: '24/7', emergency24h: true },
            services: ['emergency', 'mental_health'],
            verified: true,
          },
        ];

        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ services: mockServices }),
        });

        const result = await service.getNearbyServices({
          latitude: 40.7128,
          longitude: -74.0060,
        });

        expect(result).toEqual(mockServices);
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost/api/panic/services/nearby',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              latitude: 40.7128,
              longitude: -74.0060,
              radius: 25,
            }),
          })
        );
      });
    });

    describe('Breathing Exercises', () => {
      it('should start breathing exercise with timer', async () => {
        const mockExercise: BreathingExercise = {
          id: 'exercise_1',
          name: '4-7-8 Breathing',
          description: 'Calming breathing technique',
          duration: 60,
          pattern: { inhale: 4, hold: 7, exhale: 8, pause: 2 },
          instructions: ['Inhale for 4 seconds', 'Hold for 7 seconds', 'Exhale for 8 seconds'],
          visualCues: { type: 'circle', colors: ['#3B82F6', '#10B981'] },
          difficulty: 'beginner',
          benefits: ['Reduces anxiety', 'Promotes relaxation'],
        };

        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ exercise: mockExercise }),
        });

        const startEventSpy = vi.fn();
        const phaseEventSpy = vi.fn();
        service.on('breathing_exercise_started', startEventSpy);
        service.on('breathing_phase_update', phaseEventSpy);

        const result = await service.startBreathingExercise('exercise_1');

        expect(result).toEqual(mockExercise);
        expect(startEventSpy).toHaveBeenCalledWith(mockExercise);

        // Wait for first phase update
        await new Promise(resolve => setTimeout(resolve, 1100));
        expect(phaseEventSpy).toHaveBeenCalled();
      });

      it('should stop breathing exercise and clear timer', () => {
        const mockExercise: BreathingExercise = {
          id: 'exercise_1',
          name: '4-7-8 Breathing',
          description: 'Calming breathing technique',
          duration: 60,
          pattern: { inhale: 4, hold: 7, exhale: 8, pause: 2 },
          instructions: [],
          visualCues: { type: 'circle', colors: [] },
          difficulty: 'beginner',
          benefits: [],
        };

        // Start exercise first
        (service as any).startBreathingTimer(mockExercise);

        const eventSpy = vi.fn();
        service.on('breathing_exercise_stopped', eventSpy);

        service.stopBreathingExercise();

        expect(eventSpy).toHaveBeenCalled();
        expect((service as any).breathingTimer).toBeNull();
      });

      it('should complete breathing exercise after duration', async () => {
        const mockExercise: BreathingExercise = {
          id: 'exercise_1',
          name: 'Quick Breathing',
          description: 'Short breathing exercise',
          duration: 2, // 2 seconds for quick test
          pattern: { inhale: 1, hold: 0, exhale: 1, pause: 0 },
          instructions: [],
          visualCues: { type: 'circle', colors: [] },
          difficulty: 'beginner',
          benefits: [],
        };

        const completedEventSpy = vi.fn();
        service.on('breathing_exercise_completed', completedEventSpy);

        (service as any).startBreathingTimer(mockExercise);

        // Wait for exercise to complete
        await new Promise(resolve => setTimeout(resolve, 2500));

        expect(completedEventSpy).toHaveBeenCalledWith(mockExercise);
      });

      it('should get available breathing exercises', async () => {
        const mockExercises: BreathingExercise[] = [
          {
            id: 'exercise_1',
            name: '4-7-8 Breathing',
            description: 'Calming technique',
            duration: 300,
            pattern: { inhale: 4, hold: 7, exhale: 8, pause: 2 },
            instructions: [],
            visualCues: { type: 'circle', colors: [] },
            difficulty: 'beginner',
            benefits: [],
          },
        ];

        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ exercises: mockExercises }),
        });

        const result = await service.getBreathingExercises();

        expect(result).toEqual(mockExercises);
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost/api/panic/breathing',
          expect.objectContaining({
            headers: {
              'Authorization': 'Bearer test-token',
            },
          })
        );
      });
    });

    describe('Location Tracking', () => {
      it('should start location tracking when panic mode is active', async () => {
        const mockSession: PanicSession = {
          id: 'session_123',
          userId: 'user_456',
          startedAt: new Date(),
          triggerSource: 'manual',
          resourcesAccessed: [],
          emergencyContacted: false,
          followUpRequired: true,
          status: 'active',
        };

        let watchId = 1;
        (navigator.geolocation.watchPosition as any).mockImplementation((success: any) => {
          // Simulate location update
          setTimeout(() => {
            success({
              coords: {
                latitude: 40.7128,
                longitude: -74.0060,
                accuracy: 10,
              },
            });
          }, 100);
          return watchId++;
        });

        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ session: mockSession }),
        });

        const locationEventSpy = vi.fn();
        service.on('location_updated', locationEventSpy);

        await service.startPanicMode('manual');

        // Wait for location update
        await new Promise(resolve => setTimeout(resolve, 150));

        expect(navigator.geolocation.watchPosition).toHaveBeenCalled();
        expect(locationEventSpy).toHaveBeenCalledWith({
          latitude: 40.7128,
          longitude: -74.0060,
          accuracy: 10,
        });
      });

      it('should stop location tracking when panic mode ends', async () => {
        const mockSession: PanicSession = {
          id: 'session_123',
          userId: 'user_456',
          startedAt: new Date(),
          triggerSource: 'manual',
          resourcesAccessed: [],
          emergencyContacted: false,
          followUpRequired: true,
          status: 'active',
        };

        (service as any).currentSession = mockSession;
        (service as any).locationWatcher = 123;

        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

        await service.endPanicMode();

        expect(navigator.geolocation.clearWatch).toHaveBeenCalledWith(123);
        expect((service as any).locationWatcher).toBeNull();
      });
    });

    describe('Session History', () => {
      it('should get panic session history', async () => {
        const mockSessions: PanicSession[] = [
          {
            id: 'session_1',
            userId: 'user_456',
            startedAt: new Date('2023-01-01'),
            endedAt: new Date('2023-01-01'),
            triggerSource: 'manual',
            resourcesAccessed: [],
            emergencyContacted: false,
            followUpRequired: false,
            status: 'completed',
          },
        ];

        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ sessions: mockSessions }),
        });

        const result = await service.getSessionHistory(5);

        expect(result).toEqual(mockSessions);
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost/api/panic/sessions/history?limit=5',
          expect.objectContaining({
            headers: {
              'Authorization': 'Bearer test-token',
            },
          })
        );
      });
    });

    describe('Error Handling', () => {
      it('should handle API errors gracefully', async () => {
        (fetch as any).mockResolvedValueOnce({
          ok: false,
          status: 500,
        });

        await expect(service.startPanicMode('manual')).rejects.toThrow('Failed to start panic session: 500');
      });

      it('should handle network errors', async () => {
        (fetch as any).mockRejectedValueOnce(new Error('Network error'));

        await expect(service.getPanicResources()).rejects.toThrow('Network error');
      });

      it('should handle missing session errors', async () => {
        await expect(service.accessResource('resource_1')).rejects.toThrow('No active panic session');
      });
    });

    describe('Event System', () => {
      it('should emit and handle events correctly', () => {
        const eventSpy = vi.fn();
        const unsubscribe = service.on('test_event', eventSpy);

        (service as any).emit('test_event', { data: 'test' });

        expect(eventSpy).toHaveBeenCalledWith({ data: 'test' });

        // Test unsubscribe
        unsubscribe();
        (service as any).emit('test_event', { data: 'test2' });

        expect(eventSpy).toHaveBeenCalledTimes(1);
      });

      it('should handle event listener errors gracefully', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const faultyListener = vi.fn(() => {
          throw new Error('Listener error');
        });

        service.on('test_event', faultyListener);
        (service as any).emit('test_event', { data: 'test' });

        expect(errorSpy).toHaveBeenCalledWith(
          'Error in event listener for test_event:',
          expect.any(Error)
        );

        errorSpy.mockRestore();
      });
    });

    describe('Resource Cleanup', () => {
      it('should clean up resources on destroy', () => {
        const mockSession: PanicSession = {
          id: 'session_123',
          userId: 'user_456',
          startedAt: new Date(),
          triggerSource: 'manual',
          resourcesAccessed: [],
          emergencyContacted: false,
          followUpRequired: true,
          status: 'active',
        };

        (service as any).currentSession = mockSession;
        (service as any).locationWatcher = 123;
        (service as any).breathingTimer = setTimeout(() => {}, 1000);

        (fetch as any).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

        service.destroy();

        expect(navigator.geolocation.clearWatch).toHaveBeenCalledWith(123);
        expect((service as any).currentSession).toBeNull();
        expect((service as any).eventListeners.size).toBe(0);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete panic mode workflow', async () => {
      const mockSession: PanicSession = {
        id: 'session_123',
        userId: 'user_456',
        startedAt: new Date(),
        triggerSource: 'crisis_detection',
        resourcesAccessed: [],
        emergencyContacted: false,
        followUpRequired: true,
        status: 'active',
      };

      const mockResources: PanicResource[] = [
        {
          id: 'resource_1',
          type: 'hotline',
          name: 'Crisis Hotline',
          description: '24/7 support',
          contactInfo: { phone: '988' },
          availability: { alwaysAvailable: true, languages: ['en'] },
          priority: 1,
          ageGroups: ['adult'],
          categories: ['crisis'],
          verified: true,
          lastUpdated: new Date(),
        },
      ];

      // Mock API responses
      (fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ session: mockSession }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ resources: mockResources }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

      // Start panic mode
      const session = await service.startPanicMode('crisis_detection');
      expect(session.triggerSource).toBe('crisis_detection');

      // Get resources
      const resources = await service.getPanicResources({ emergency: true });
      expect(resources).toHaveLength(1);

      // Access resource
      await service.accessResource('resource_1');
      expect(session.resourcesAccessed).toHaveLength(1);

      // Rate resource
      await service.rateResource('resource_1', true, 'Very helpful');

      // End session
      await service.endPanicMode('Crisis resolved');
      expect(service.getCurrentSession()).toBeNull();
    });

    it('should handle emergency escalation workflow', async () => {
      const mockSession: PanicSession = {
        id: 'session_123',
        userId: 'user_456',
        startedAt: new Date(),
        triggerSource: 'manual',
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          accuracy: 10,
        },
        resourcesAccessed: [],
        emergencyContacted: false,
        followUpRequired: true,
        status: 'active',
      };

      (service as any).currentSession = mockSession;

      (fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            services: [
              {
                id: 'hospital_1',
                name: 'Emergency Hospital',
                type: 'hospital',
                distance: 1.2,
                contactInfo: { phone: '911' },
                availability: { emergency24h: true },
              },
            ],
          }),
        });

      // Contact emergency services
      await service.contactEmergencyServices();
      expect(mockSession.emergencyContacted).toBe(true);

      // Get nearby services
      const services = await service.getNearbyServices(mockSession.location!);
      expect(services).toHaveLength(1);
      expect(services[0].name).toBe('Emergency Hospital');
    });
  });
});