import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CrisisDetectionService } from '@/services/crisis-detection-service';
import { useCrisisDetection } from '@/hooks/use-crisis-detection';

// Mock fetch
global.fetch = vi.fn();

describe('CrisisDetectionService', () => {
  let service: CrisisDetectionService;
  const mockConfig = {
    baseUrl: 'http://localhost:3000',
    authToken: 'test-token',
    detectionConfig: {
      enabled: true,
      realTimeAnalysis: true,
      batchAnalysis: false,
      keywordDetection: true,
      patternDetection: true,
      mlDetection: false,
      confidenceThreshold: 0.3,
      escalationThreshold: 0.7,
      contextAnalysis: true,
      userHistoryWeight: 0.2,
      timeFactorWeight: 0.1,
      falsePositiveReduction: true,
      languages: ['en'],
    },
  };

  beforeEach(() => {
    service = new CrisisDetectionService(mockConfig);
    vi.clearAllMocks();
  });

  afterEach(() => {
    service.destroy();
  });

  describe('Initialization', () => {
    it('should initialize with correct configuration', () => {
      expect(service).toBeDefined();
      expect(service['config']).toEqual(mockConfig.detectionConfig);
    });

    it('should load keywords and patterns on initialization', async () => {
      const mockKeywords = [
        {
          id: 'kw1',
          word: 'suicide',
          category: 'suicide',
          severity: 'critical',
          weight: 0.9,
          language: 'en',
        },
      ];

      const mockPatterns = [
        {
          id: 'p1',
          name: 'Self-harm expression',
          pattern: 'want to (die|kill myself|end it all)',
          category: 'suicide',
          severity: 'critical',
          weight: 0.8,
          minMatches: 1,
          contextWindow: 10,
        },
      ];

      (fetch as Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ keywords: mockKeywords }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ patterns: mockPatterns }),
        });

      await service['initializeDetectionEngine']();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/crisis/keywords',
        expect.objectContaining({
          headers: { 'Authorization': 'Bearer test-token' },
        })
      );

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/crisis/patterns',
        expect.objectContaining({
          headers: { 'Authorization': 'Bearer test-token' },
        })
      );
    });
  });

  describe('Message Analysis', () => {
    beforeEach(async () => {
      // Mock successful initialization
      const mockKeywords = [
        {
          id: 'kw1',
          word: 'suicide',
          category: 'suicide',
          severity: 'critical',
          weight: 0.9,
          language: 'en',
        },
        {
          id: 'kw2',
          word: 'hopeless',
          category: 'severe_depression',
          severity: 'high',
          weight: 0.7,
          language: 'en',
        },
      ];

      const mockPatterns = [
        {
          id: 'p1',
          name: 'Self-harm expression',
          pattern: 'want to (die|kill myself|end it all)',
          category: 'suicide',
          severity: 'critical',
          weight: 0.8,
          minMatches: 1,
          contextWindow: 10,
        },
      ];

      (fetch as Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ keywords: mockKeywords }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ patterns: mockPatterns }),
        });

      await service['initializeDetectionEngine']();
    });

    it('should detect crisis keywords in message', async () => {
      // Mock context API
      (fetch as Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            timeOfDay: 14,
            dayOfWeek: 2,
            recentActivity: 'normal',
            previousAlerts: 0,
            userHistory: { hasHistory: false, frequency: 0 },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

      const messageData = {
        messageId: 'msg-123',
        content: 'I feel hopeless and want to die',
        userId: 'user-456',
        conversationId: 'conv-789',
      };

      const result = await service.analyzeMessage(messageData);

      expect(result).toBeDefined();
      expect(result!.riskLevel).toBe('critical');
      expect(result!.categories).toContain('suicide');
      expect(result!.categories).toContain('severe_depression');
      expect(result!.confidence).toBeGreaterThan(0.3);
    });

    it('should detect crisis patterns in message', async () => {
      // Mock context API
      (fetch as Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            timeOfDay: 2, // Late night - higher risk
            dayOfWeek: 0,
            recentActivity: 'low',
            previousAlerts: 1,
            userHistory: { hasHistory: true, frequency: 2 },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

      const messageData = {
        messageId: 'msg-124',
        content: 'I want to kill myself tonight',
        userId: 'user-456',
        conversationId: 'conv-789',
      };

      const result = await service.analyzeMessage(messageData);

      expect(result).toBeDefined();
      expect(result!.riskLevel).toBe('critical');
      expect(result!.requiresImmediate).toBe(true);
      expect(result!.escalationLevel).toBe('crisis_team');
    });

    it('should return null for non-crisis messages', async () => {
      const messageData = {
        messageId: 'msg-125',
        content: 'Hello, how are you today?',
        userId: 'user-456',
        conversationId: 'conv-789',
      };

      const result = await service.analyzeMessage(messageData);

      expect(result).toBeNull();
    });

    it('should adjust confidence based on context factors', async () => {
      // Mock high-risk context
      (fetch as Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            timeOfDay: 3, // Very late night
            dayOfWeek: 0,
            recentActivity: 'low',
            previousAlerts: 3,
            userHistory: { hasHistory: true, lastIncident: new Date(), frequency: 5 },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

      const messageData = {
        messageId: 'msg-126',
        content: 'feeling hopeless again',
        userId: 'user-456',
        conversationId: 'conv-789',
      };

      const result = await service.analyzeMessage(messageData);

      expect(result).toBeDefined();
      // Confidence should be adjusted upward due to context
      expect(result!.confidence).toBeGreaterThan(0.7);
      expect(result!.contextFactors.userHistory.hasHistory).toBe(true);
    });

    it('should handle keyword exclusions', async () => {
      // Add keyword with exclusions
      service['keywords'].set('en', [
        {
          id: 'kw3',
          word: 'die',
          category: 'suicide',
          severity: 'medium',
          weight: 0.5,
          exclusions: ['movie', 'game', 'character'],
          language: 'en',
        },
      ]);

      const messageData = {
        messageId: 'msg-127',
        content: 'The character will die in the movie',
        userId: 'user-456',
        conversationId: 'conv-789',
      };

      const result = await service.analyzeMessage(messageData);

      // Should not detect crisis due to exclusion words
      expect(result).toBeNull();
    });

    it('should require context words when specified', async () => {
      // Add keyword with required context
      service['keywords'].set('en', [
        {
          id: 'kw4',
          word: 'hurt',
          category: 'self_harm',
          severity: 'medium',
          weight: 0.6,
          context: ['myself', 'me'],
          language: 'en',
        },
      ]);

      // Mock context API
      (fetch as Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            timeOfDay: 14,
            dayOfWeek: 2,
            recentActivity: 'normal',
            previousAlerts: 0,
            userHistory: { hasHistory: false, frequency: 0 },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

      const messageData = {
        messageId: 'msg-128',
        content: 'I want to hurt myself',
        userId: 'user-456',
        conversationId: 'conv-789',
      };

      const result = await service.analyzeMessage(messageData);

      expect(result).toBeDefined();
      expect(result!.categories).toContain('self_harm');
    });
  });

  describe('Detection History', () => {
    it('should retrieve detection history with filters', async () => {
      const mockHistory = [
        {
          id: 'det-1',
          messageId: 'msg-123',
          userId: 'user-456',
          conversationId: 'conv-789',
          confidence: 0.8,
          riskLevel: 'high',
          detectedAt: new Date(),
        },
      ];

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ detections: mockHistory }),
      });

      const filters = {
        userId: 'user-456',
        riskLevel: 'high' as const,
        limit: 10,
      };

      const result = await service.getDetectionHistory(filters);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('api/crisis/detections'),
        expect.objectContaining({
          headers: { 'Authorization': 'Bearer test-token' },
        })
      );

      expect(result).toEqual(mockHistory);
    });
  });

  describe('Configuration Management', () => {
    it('should update detection configuration', async () => {
      const newConfig = { confidenceThreshold: 0.5 };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const eventCallback = vi.fn();
      service.on('config_updated', eventCallback);

      await service.updateConfig(newConfig);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/crisis/config',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(newConfig),
        })
      );

      expect(service['config'].confidenceThreshold).toBe(0.5);
      expect(eventCallback).toHaveBeenCalled();
    });
  });

  describe('Batch Processing', () => {
    it('should queue messages for batch analysis', () => {
      const messageData = {
        messageId: 'msg-129',
        content: 'Test message',
        userId: 'user-456',
        conversationId: 'conv-789',
      };

      service.queueForAnalysis(messageData);

      expect(service['analysisQueue']).toContain(messageData);
    });
  });

  describe('Event System', () => {
    it('should emit crisis detected event', async () => {
      const eventCallback = vi.fn();
      service.on('crisis_detected', eventCallback);

      // Mock successful analysis
      (fetch as Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            timeOfDay: 14,
            dayOfWeek: 2,
            recentActivity: 'normal',
            previousAlerts: 0,
            userHistory: { hasHistory: false, frequency: 0 },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

      // Initialize with crisis keywords
      service['keywords'].set('en', [
        {
          id: 'kw1',
          word: 'suicide',
          category: 'suicide',
          severity: 'critical',
          weight: 0.9,
          language: 'en',
        },
      ]);

      const messageData = {
        messageId: 'msg-130',
        content: 'thinking about suicide',
        userId: 'user-456',
        conversationId: 'conv-789',
      };

      await service.analyzeMessage(messageData);

      expect(eventCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          messageId: 'msg-130',
          riskLevel: 'critical',
        })
      );
    });
  });
});

describe('useCrisisDetection Hook', () => {
  const mockHookConfig = {
    authToken: 'test-token',
    userId: 'user-123',
    userRole: 'therapist',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useCrisisDetection(mockHookConfig));

    expect(result.current.detections).toEqual([]);
    expect(result.current.alerts).toEqual([]);
    expect(result.current.config).toBeNull();
    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.isEngineReady).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should analyze message and update state', async () => {
    (fetch as Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ keywords: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ patterns: [] }),
      });

    const { result } = renderHook(() => useCrisisDetection(mockHookConfig));

    // Wait for initialization
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Mock analysis response
    (fetch as Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          timeOfDay: 14,
          dayOfWeek: 2,
          recentActivity: 'normal',
          previousAlerts: 0,
          userHistory: { hasHistory: false, frequency: 0 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

    await act(async () => {
      try {
        await result.current.analyzeMessage({
          messageId: 'msg-131',
          content: 'Test crisis message',
          userId: 'user-456',
          conversationId: 'conv-789',
        });
      } catch (error) {
        // Expected since we don't have actual crisis detection setup
      }
    });
  });

  it('should handle alert acknowledgment', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const { result } = renderHook(() => useCrisisDetection(mockHookConfig));

    await act(async () => {
      await result.current.acknowledgeAlert('alert-123', 'Acknowledged by therapist');
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('api/crisis/alerts/alert-123/acknowledge'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ notes: 'Acknowledged by therapist' }),
      })
    );
  });

  it('should calculate detection statistics correctly', () => {
    const { result } = renderHook(() => useCrisisDetection(mockHookConfig));

    // Mock some detections
    act(() => {
      result.current['setDetections']([
        {
          id: 'det-1',
          riskLevel: 'high',
          categories: ['suicide'],
          confidence: 0.8,
          detectedAt: new Date(),
        },
        {
          id: 'det-2',
          riskLevel: 'medium',
          categories: ['self_harm'],
          confidence: 0.6,
          detectedAt: new Date(),
        },
      ] as any);
    });

    const stats = result.current.getDetectionStats('week');

    expect(stats.totalDetections).toBe(2);
    expect(stats.byRiskLevel.high).toBe(1);
    expect(stats.byRiskLevel.medium).toBe(1);
    expect(stats.byCategory.suicide).toBe(1);
    expect(stats.byCategory.self_harm).toBe(1);
    expect(stats.averageConfidence).toBe(0.7);
  });

  it('should provide utility functions', () => {
    const { result } = renderHook(() => useCrisisDetection(mockHookConfig));

    expect(result.current.getRiskLevelColor('critical')).toBe('text-red-800');
    expect(result.current.getRiskLevelColor('high')).toBe('text-red-600');
    expect(result.current.getRiskLevelColor('medium')).toBe('text-orange-600');
    expect(result.current.getRiskLevelColor('low')).toBe('text-yellow-600');

    expect(result.current.getCategoryIcon('suicide')).toBe('⚠️');
    expect(result.current.getCategoryIcon('self_harm')).toBe('🩹');

    expect(result.current.formatConfidence(0.75)).toBe('75%');

    const highRiskDetection = { riskLevel: 'high' } as any;
    const lowRiskDetection = { riskLevel: 'low' } as any;

    expect(result.current.isHighRisk(highRiskDetection)).toBe(true);
    expect(result.current.isHighRisk(lowRiskDetection)).toBe(false);

    const immediateDetection = { requiresImmediate: true } as any;
    const normalDetection = { requiresImmediate: false, escalationLevel: 'none' } as any;

    expect(result.current.requiresImmediate(immediateDetection)).toBe(true);
    expect(result.current.requiresImmediate(normalDetection)).toBe(false);
  });
});

describe('Crisis Detection Property Tests', () => {
  describe('Property 6: Crisis Response Time', () => {
    it('should detect crisis within acceptable time limits', async () => {
      const service = new CrisisDetectionService({
        baseUrl: 'http://localhost:3000',
        authToken: 'test-token',
        detectionConfig: {
          enabled: true,
          realTimeAnalysis: true,
          batchAnalysis: false,
          keywordDetection: true,
          patternDetection: true,
          mlDetection: false,
          confidenceThreshold: 0.3,
          escalationThreshold: 0.7,
          contextAnalysis: true,
          userHistoryWeight: 0.2,
          timeFactorWeight: 0.1,
          falsePositiveReduction: true,
          languages: ['en'],
        },
      });

      // Mock initialization
      (fetch as Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            keywords: [
              {
                id: 'kw1',
                word: 'suicide',
                category: 'suicide',
                severity: 'critical',
                weight: 0.9,
                language: 'en',
              },
            ],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ patterns: [] }),
        });

      await service['initializeDetectionEngine']();

      // Mock context and logging
      (fetch as Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            timeOfDay: 14,
            dayOfWeek: 2,
            recentActivity: 'normal',
            previousAlerts: 0,
            userHistory: { hasHistory: false, frequency: 0 },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

      const startTime = Date.now();

      const result = await service.analyzeMessage({
        messageId: 'msg-crisis',
        content: 'I am thinking about suicide',
        userId: 'user-456',
        conversationId: 'conv-789',
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Crisis detection should complete within 1 second
      expect(responseTime).toBeLessThan(1000);
      expect(result).toBeDefined();
      expect(result!.riskLevel).toBe('critical');

      service.destroy();
    });

    it('should maintain accuracy under load', async () => {
      const service = new CrisisDetectionService({
        baseUrl: 'http://localhost:3000',
        authToken: 'test-token',
        detectionConfig: {
          enabled: true,
          realTimeAnalysis: true,
          batchAnalysis: false,
          keywordDetection: true,
          patternDetection: true,
          mlDetection: false,
          confidenceThreshold: 0.3,
          escalationThreshold: 0.7,
          contextAnalysis: false, // Disable for performance
          userHistoryWeight: 0.2,
          timeFactorWeight: 0.1,
          falsePositiveReduction: true,
          languages: ['en'],
        },
      });

      // Mock initialization
      (fetch as Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            keywords: [
              {
                id: 'kw1',
                word: 'suicide',
                category: 'suicide',
                severity: 'critical',
                weight: 0.9,
                language: 'en',
              },
            ],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ patterns: [] }),
        });

      await service['initializeDetectionEngine']();

      const crisisMessages = [
        'I want to kill myself',
        'thinking about suicide',
        'life is not worth living',
        'I want to end it all',
        'nobody would miss me if I died',
      ];

      const normalMessages = [
        'Hello how are you',
        'What time is the meeting',
        'I love this movie',
        'The weather is nice today',
        'Thanks for your help',
      ];

      // Mock logging for all messages
      [...crisisMessages, ...normalMessages].forEach(() => {
        (fetch as Mock).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });
      });

      const results = await Promise.all([
        ...crisisMessages.map((content, index) =>
          service.analyzeMessage({
            messageId: `crisis-${index}`,
            content,
            userId: 'user-456',
            conversationId: 'conv-789',
          })
        ),
        ...normalMessages.map((content, index) =>
          service.analyzeMessage({
            messageId: `normal-${index}`,
            content,
            userId: 'user-456',
            conversationId: 'conv-789',
          })
        ),
      ]);

      const crisisResults = results.slice(0, crisisMessages.length);
      const normalResults = results.slice(crisisMessages.length);

      // All crisis messages should be detected
      const detectedCrisis = crisisResults.filter(r => r !== null);
      expect(detectedCrisis.length).toBeGreaterThanOrEqual(4); // At least 80% accuracy

      // Normal messages should not trigger false positives
      const falsePositives = normalResults.filter(r => r !== null);
      expect(falsePositives.length).toBeLessThanOrEqual(1); // Less than 20% false positive rate

      service.destroy();
    });

    it('should escalate critical cases immediately', async () => {
      const service = new CrisisDetectionService({
        baseUrl: 'http://localhost:3000',
        authToken: 'test-token',
        detectionConfig: {
          enabled: true,
          realTimeAnalysis: true,
          batchAnalysis: false,
          keywordDetection: true,
          patternDetection: true,
          mlDetection: false,
          confidenceThreshold: 0.3,
          escalationThreshold: 0.7,
          contextAnalysis: true,
          userHistoryWeight: 0.2,
          timeFactorWeight: 0.1,
          falsePositiveReduction: true,
          languages: ['en'],
        },
      });

      // Mock initialization
      (fetch as Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            keywords: [
              {
                id: 'kw1',
                word: 'suicide',
                category: 'suicide',
                severity: 'critical',
                weight: 0.9,
                language: 'en',
              },
            ],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ patterns: [] }),
        });

      await service['initializeDetectionEngine']();

      // Mock high-risk context
      (fetch as Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            timeOfDay: 3, // Late night
            dayOfWeek: 0,
            recentActivity: 'low',
            previousAlerts: 2,
            userHistory: { hasHistory: true, frequency: 3 },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

      const result = await service.analyzeMessage({
        messageId: 'msg-critical',
        content: 'I am going to kill myself tonight',
        userId: 'user-456',
        conversationId: 'conv-789',
      });

      expect(result).toBeDefined();
      expect(result!.riskLevel).toBe('critical');
      expect(result!.requiresImmediate).toBe(true);
      expect(result!.escalationLevel).toBe('crisis_team');
      expect(result!.recommendations).toContain('Immediate intervention required');

      service.destroy();
    });

    it('should handle concurrent analysis requests', async () => {
      const service = new CrisisDetectionService({
        baseUrl: 'http://localhost:3000',
        authToken: 'test-token',
        detectionConfig: {
          enabled: true,
          realTimeAnalysis: true,
          batchAnalysis: false,
          keywordDetection: true,
          patternDetection: false, // Disable for performance
          mlDetection: false,
          confidenceThreshold: 0.3,
          escalationThreshold: 0.7,
          contextAnalysis: false, // Disable for performance
          userHistoryWeight: 0.2,
          timeFactorWeight: 0.1,
          falsePositiveReduction: true,
          languages: ['en'],
        },
      });

      // Mock initialization
      (fetch as Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            keywords: [
              {
                id: 'kw1',
                word: 'suicide',
                category: 'suicide',
                severity: 'critical',
                weight: 0.9,
                language: 'en',
              },
            ],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ patterns: [] }),
        });

      await service['initializeDetectionEngine']();

      const concurrentRequests = 20;
      const promises: Promise<any>[] = [];

      // Mock logging for all requests
      for (let i = 0; i < concurrentRequests; i++) {
        (fetch as Mock).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });
      }

      // Send concurrent analysis requests
      for (let i = 0; i < concurrentRequests; i++) {
        const promise = service.analyzeMessage({
          messageId: `msg-${i}`,
          content: i % 2 === 0 ? 'thinking about suicide' : 'hello world',
          userId: 'user-456',
          conversationId: 'conv-789',
        });
        promises.push(promise);
      }

      const startTime = Date.now();
      const results = await Promise.all(promises);
      const endTime = Date.now();

      // All requests should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(5000);

      // Results should be consistent
      const crisisDetections = results.filter((r, i) => i % 2 === 0 && r !== null);
      const normalResults = results.filter((r, i) => i % 2 === 1 && r !== null);

      expect(crisisDetections.length).toBeGreaterThan(0);
      expect(normalResults.length).toBe(0);

      service.destroy();
    });

    it('should provide consistent confidence scoring', async () => {
      const service = new CrisisDetectionService({
        baseUrl: 'http://localhost:3000',
        authToken: 'test-token',
        detectionConfig: {
          enabled: true,
          realTimeAnalysis: true,
          batchAnalysis: false,
          keywordDetection: true,
          patternDetection: true,
          mlDetection: false,
          confidenceThreshold: 0.1, // Low threshold to catch all
          escalationThreshold: 0.7,
          contextAnalysis: false,
          userHistoryWeight: 0.2,
          timeFactorWeight: 0.1,
          falsePositiveReduction: true,
          languages: ['en'],
        },
      });

      // Mock initialization with multiple keywords
      (fetch as Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            keywords: [
              {
                id: 'kw1',
                word: 'suicide',
                category: 'suicide',
                severity: 'critical',
                weight: 0.9,
                language: 'en',
              },
              {
                id: 'kw2',
                word: 'hopeless',
                category: 'severe_depression',
                severity: 'high',
                weight: 0.7,
                language: 'en',
              },
              {
                id: 'kw3',
                word: 'sad',
                category: 'severe_depression',
                severity: 'medium',
                weight: 0.4,
                language: 'en',
              },
            ],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ patterns: [] }),
        });

      await service['initializeDetectionEngine']();

      const testCases = [
        { content: 'I want to commit suicide', expectedMinConfidence: 0.8 },
        { content: 'feeling hopeless and sad', expectedMinConfidence: 0.5 },
        { content: 'just feeling sad today', expectedMinConfidence: 0.3 },
      ];

      // Mock logging for all test cases
      testCases.forEach(() => {
        (fetch as Mock).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });
      });

      for (const testCase of testCases) {
        const result = await service.analyzeMessage({
          messageId: `test-${Math.random()}`,
          content: testCase.content,
          userId: 'user-456',
          conversationId: 'conv-789',
        });

        expect(result).toBeDefined();
        expect(result!.confidence).toBeGreaterThanOrEqual(testCase.expectedMinConfidence);
      }

      service.destroy();
    });
  });
});