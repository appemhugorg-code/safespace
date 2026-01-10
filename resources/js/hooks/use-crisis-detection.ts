import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  CrisisDetectionService, 
  CrisisDetectionResult, 
  CrisisDetectionConfig,
  CrisisAlert,
  CrisisKeyword,
  CrisisPattern
} from '@/services/crisis-detection-service';

export interface UseCrisisDetectionOptions {
  baseUrl?: string;
  authToken: string;
  userId: string;
  userRole: string;
  conversationId?: string;
  enableRealTime?: boolean;
  autoAnalyze?: boolean;
  detectionConfig?: Partial<CrisisDetectionConfig>;
}

export interface UseCrisisDetectionReturn {
  // State
  detections: CrisisDetectionResult[];
  alerts: CrisisAlert[];
  config: CrisisDetectionConfig | null;
  isAnalyzing: boolean;
  isEngineReady: boolean;
  error: string | null;
  
  // Analysis functions
  analyzeMessage: (data: {
    messageId: string;
    content: string;
    userId: string;
    conversationId: string;
    language?: string;
    metadata?: Record<string, any>;
  }) => Promise<CrisisDetectionResult | null>;
  
  queueForAnalysis: (data: {
    messageId: string;
    content: string;
    userId: string;
    conversationId: string;
  }) => void;
  
  // Detection management
  getDetectionHistory: (filters?: {
    userId?: string;
    conversationId?: string;
    riskLevel?: CrisisDetectionResult['riskLevel'];
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
  }) => Promise<CrisisDetectionResult[]>;
  
  acknowledgeAlert: (alertId: string, notes?: string) => Promise<void>;
  resolveAlert: (alertId: string, resolution: string) => Promise<void>;
  markFalsePositive: (alertId: string, reason: string) => Promise<void>;
  
  // Configuration
  updateConfig: (newConfig: Partial<CrisisDetectionConfig>) => Promise<void>;
  refreshConfig: () => Promise<void>;
  
  // Statistics
  getDetectionStats: (period?: 'day' | 'week' | 'month') => {
    totalDetections: number;
    byRiskLevel: Record<CrisisDetectionResult['riskLevel'], number>;
    byCategory: Record<CrisisKeyword['category'], number>;
    averageConfidence: number;
    falsePositiveRate: number;
  };
  
  // Utilities
  getRiskLevelColor: (riskLevel: CrisisDetectionResult['riskLevel']) => string;
  getCategoryIcon: (category: CrisisKeyword['category']) => string;
  formatConfidence: (confidence: number) => string;
  isHighRisk: (detection: CrisisDetectionResult) => boolean;
  requiresImmediate: (detection: CrisisDetectionResult) => boolean;
  
  // Events
  onCrisisDetected: (callback: (detection: CrisisDetectionResult) => void) => () => void;
  onAlertCreated: (callback: (alert: CrisisAlert) => void) => () => void;
  onEngineReady: (callback: () => void) => () => void;
  onEngineError: (callback: (error: any) => void) => () => void;
}

export function useCrisisDetection(options: UseCrisisDetectionOptions): UseCrisisDetectionReturn {
  const {
    baseUrl = '/api',
    authToken,
    userId,
    userRole,
    conversationId,
    enableRealTime = true,
    autoAnalyze = true,
    detectionConfig = {},
  } = options;

  // State
  const [detections, setDetections] = useState<CrisisDetectionResult[]>([]);
  const [alerts, setAlerts] = useState<CrisisAlert[]>([]);
  const [config, setConfig] = useState<CrisisDetectionConfig | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const serviceRef = useRef<CrisisDetectionService | null>(null);
  const eventUnsubscribersRef = useRef<(() => void)[]>([]);

  // Default configuration
  const defaultConfig: CrisisDetectionConfig = {
    enabled: true,
    realTimeAnalysis: enableRealTime,
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
    ...detectionConfig,
  };

  // Initialize service
  useEffect(() => {
    const service = new CrisisDetectionService({
      baseUrl,
      authToken,
      detectionConfig: defaultConfig,
    });

    serviceRef.current = service;
    setupEventListeners(service);
    loadInitialData();

    return () => {
      cleanup();
    };
  }, [baseUrl, authToken]);

  // Setup event listeners
  const setupEventListeners = useCallback((service: CrisisDetectionService) => {
    const unsubscribers: (() => void)[] = [];

    unsubscribers.push(
      service.on('engine_initialized', (data: { config: CrisisDetectionConfig }) => {
        setConfig(data.config);
        setIsEngineReady(true);
        setError(null);
      })
    );

    unsubscribers.push(
      service.on('engine_error', (data: { error: any }) => {
        setError(data.error.message || 'Crisis detection engine error');
        setIsEngineReady(false);
      })
    );

    unsubscribers.push(
      service.on('crisis_detected', (detection: CrisisDetectionResult) => {
        setDetections(prev => [detection, ...prev]);
        
        // Create alert if high risk
        if (detection.riskLevel === 'high' || detection.riskLevel === 'critical') {
          createAlert(detection);
        }
      })
    );

    unsubscribers.push(
      service.on('analysis_error', (data: { messageId: string; error: any }) => {
        console.error(`Analysis error for message ${data.messageId}:`, data.error);
      })
    );

    unsubscribers.push(
      service.on('config_updated', (newConfig: CrisisDetectionConfig) => {
        setConfig(newConfig);
      })
    );

    eventUnsubscribersRef.current = unsubscribers;
  }, []);

  // Cleanup
  const cleanup = useCallback(() => {
    eventUnsubscribersRef.current.forEach(unsubscribe => unsubscribe());
    eventUnsubscribersRef.current = [];

    if (serviceRef.current) {
      serviceRef.current.destroy();
      serviceRef.current = null;
    }
  }, []);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    if (!serviceRef.current) return;

    try {
      // Load recent detections
      const recentDetections = await serviceRef.current.getDetectionHistory({
        conversationId,
        limit: 50,
      });
      setDetections(recentDetections);

      // Load active alerts
      await loadAlerts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load initial data');
    }
  }, [conversationId]);

  // Load alerts
  const loadAlerts = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/crisis/alerts`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setAlerts(result.alerts);
      }
    } catch (err) {
      console.error('Failed to load alerts:', err);
    }
  }, [baseUrl, authToken]);

  // Create alert from detection
  const createAlert = useCallback(async (detection: CrisisDetectionResult) => {
    try {
      const response = await fetch(`${baseUrl}/api/crisis/alerts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          detectionId: detection.id,
          userId: detection.userId,
          conversationId: detection.conversationId,
          alertLevel: detection.riskLevel,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setAlerts(prev => [result.alert, ...prev]);
      }
    } catch (err) {
      console.error('Failed to create alert:', err);
    }
  }, [baseUrl, authToken]);

  // Analyze message
  const analyzeMessage = useCallback(async (data: {
    messageId: string;
    content: string;
    userId: string;
    conversationId: string;
    language?: string;
    metadata?: Record<string, any>;
  }): Promise<CrisisDetectionResult | null> => {
    if (!serviceRef.current || !isEngineReady) {
      throw new Error('Crisis detection engine not ready');
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await serviceRef.current.analyzeMessage(data);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to analyze message';
      setError(error);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [isEngineReady]);

  // Queue for analysis
  const queueForAnalysis = useCallback((data: {
    messageId: string;
    content: string;
    userId: string;
    conversationId: string;
  }) => {
    if (serviceRef.current && isEngineReady) {
      serviceRef.current.queueForAnalysis(data);
    }
  }, [isEngineReady]);

  // Get detection history
  const getDetectionHistory = useCallback(async (filters?: {
    userId?: string;
    conversationId?: string;
    riskLevel?: CrisisDetectionResult['riskLevel'];
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
  }): Promise<CrisisDetectionResult[]> => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    try {
      const history = await serviceRef.current.getDetectionHistory(filters);
      return history;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get detection history');
      throw err;
    }
  }, []);

  // Acknowledge alert
  const acknowledgeAlert = useCallback(async (alertId: string, notes?: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/crisis/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: 'acknowledged', acknowledgedAt: new Date(), acknowledgedBy: userId }
            : alert
        ));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to acknowledge alert');
      throw err;
    }
  }, [baseUrl, authToken, userId]);

  // Resolve alert
  const resolveAlert = useCallback(async (alertId: string, resolution: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/crisis/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resolution }),
      });

      if (response.ok) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: 'resolved', resolvedAt: new Date(), resolvedBy: userId }
            : alert
        ));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve alert');
      throw err;
    }
  }, [baseUrl, authToken, userId]);

  // Mark false positive
  const markFalsePositive = useCallback(async (alertId: string, reason: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/crisis/alerts/${alertId}/false-positive`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: 'false_positive' }
            : alert
        ));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark false positive');
      throw err;
    }
  }, [baseUrl, authToken]);

  // Update configuration
  const updateConfig = useCallback(async (newConfig: Partial<CrisisDetectionConfig>) => {
    if (!serviceRef.current) return;

    try {
      await serviceRef.current.updateConfig(newConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update configuration');
      throw err;
    }
  }, []);

  // Refresh configuration
  const refreshConfig = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/crisis/config`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setConfig(result.config);
      }
    } catch (err) {
      console.error('Failed to refresh config:', err);
    }
  }, [baseUrl, authToken]);

  // Get detection statistics
  const getDetectionStats = useCallback((period: 'day' | 'week' | 'month' = 'week') => {
    const now = new Date();
    const periodStart = new Date();
    
    switch (period) {
      case 'day':
        periodStart.setDate(now.getDate() - 1);
        break;
      case 'week':
        periodStart.setDate(now.getDate() - 7);
        break;
      case 'month':
        periodStart.setMonth(now.getMonth() - 1);
        break;
    }

    const periodDetections = detections.filter(d => d.detectedAt >= periodStart);
    
    const byRiskLevel = periodDetections.reduce((acc, d) => {
      acc[d.riskLevel] = (acc[d.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<CrisisDetectionResult['riskLevel'], number>);

    const byCategory = periodDetections.reduce((acc, d) => {
      d.categories.forEach(cat => {
        acc[cat] = (acc[cat] || 0) + 1;
      });
      return acc;
    }, {} as Record<CrisisKeyword['category'], number>);

    const averageConfidence = periodDetections.length > 0 
      ? periodDetections.reduce((sum, d) => sum + d.confidence, 0) / periodDetections.length
      : 0;

    const falsePositives = alerts.filter(a => 
      a.status === 'false_positive' && 
      a.createdAt >= periodStart
    ).length;

    const falsePositiveRate = periodDetections.length > 0 
      ? falsePositives / periodDetections.length 
      : 0;

    return {
      totalDetections: periodDetections.length,
      byRiskLevel,
      byCategory,
      averageConfidence,
      falsePositiveRate,
    };
  }, [detections, alerts]);

  // Utility functions
  const getRiskLevelColor = useCallback((riskLevel: CrisisDetectionResult['riskLevel']): string => {
    switch (riskLevel) {
      case 'low': return 'text-yellow-600';
      case 'medium': return 'text-orange-600';
      case 'high': return 'text-red-600';
      case 'critical': return 'text-red-800';
      default: return 'text-gray-600';
    }
  }, []);

  const getCategoryIcon = useCallback((category: CrisisKeyword['category']): string => {
    switch (category) {
      case 'suicide': return '⚠️';
      case 'self_harm': return '🩹';
      case 'violence': return '⚡';
      case 'substance_abuse': return '💊';
      case 'severe_depression': return '😔';
      case 'panic': return '😰';
      case 'eating_disorder': return '🍽️';
      case 'trauma': return '💔';
      default: return '❗';
    }
  }, []);

  const formatConfidence = useCallback((confidence: number): string => {
    return `${Math.round(confidence * 100)}%`;
  }, []);

  const isHighRisk = useCallback((detection: CrisisDetectionResult): boolean => {
    return detection.riskLevel === 'high' || detection.riskLevel === 'critical';
  }, []);

  const requiresImmediate = useCallback((detection: CrisisDetectionResult): boolean => {
    return detection.requiresImmediate || detection.escalationLevel === 'emergency';
  }, []);

  // Event handlers
  const onCrisisDetected = useCallback((callback: (detection: CrisisDetectionResult) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('crisis_detected', callback);
  }, []);

  const onAlertCreated = useCallback((callback: (alert: CrisisAlert) => void) => {
    // This would be implemented with a real-time system
    return () => {};
  }, []);

  const onEngineReady = useCallback((callback: () => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('engine_initialized', callback);
  }, []);

  const onEngineError = useCallback((callback: (error: any) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('engine_error', callback);
  }, []);

  return {
    // State
    detections,
    alerts,
    config,
    isAnalyzing,
    isEngineReady,
    error,
    
    // Analysis functions
    analyzeMessage,
    queueForAnalysis,
    
    // Detection management
    getDetectionHistory,
    acknowledgeAlert,
    resolveAlert,
    markFalsePositive,
    
    // Configuration
    updateConfig,
    refreshConfig,
    
    // Statistics
    getDetectionStats,
    
    // Utilities
    getRiskLevelColor,
    getCategoryIcon,
    formatConfidence,
    isHighRisk,
    requiresImmediate,
    
    // Events
    onCrisisDetected,
    onAlertCreated,
    onEngineReady,
    onEngineError,
  };
}