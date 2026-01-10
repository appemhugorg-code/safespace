import { useState, useEffect, useCallback, useRef } from 'react';
import { CallQualityService, NetworkCondition, QualitySettings, CallQualityMetrics, QualityPreset } from '@/services/call-quality-service';
import { WebRTCSignalingService } from '@/services/webrtc-signaling-service';

export interface UseCallQualityOptions {
  autoAdaptation?: boolean;
  monitoringEnabled?: boolean;
  adaptationThreshold?: {
    packetLoss: number;
    latency: number;
    bandwidth: number;
  };
}

export interface UseCallQualityReturn {
  // Service state
  isMonitoring: boolean;
  isAdapting: boolean;
  
  // Quality metrics
  qualityMetrics: Map<string, CallQualityMetrics>;
  networkConditions: Map<string, NetworkCondition>;
  
  // Available presets
  qualityPresets: QualityPreset[];
  
  // Actions
  startMonitoring: () => void;
  stopMonitoring: () => void;
  enableAutoAdaptation: (participantId: string) => Promise<void>;
  setManualQuality: (participantId: string, presetName: string) => Promise<void>;
  getParticipantQuality: (participantId: string) => CallQualityMetrics | null;
  
  // Events
  onQualityChanged: (callback: (data: any) => void) => void;
  onNetworkConditionChanged: (callback: (data: any) => void) => void;
}

const defaultOptions: UseCallQualityOptions = {
  autoAdaptation: true,
  monitoringEnabled: true,
  adaptationThreshold: {
    packetLoss: 5,
    latency: 200,
    bandwidth: 500,
  },
};

export function useCallQuality(
  signalingService: WebRTCSignalingService | null,
  options: UseCallQualityOptions = {}
): UseCallQualityReturn {
  const {
    autoAdaptation,
    monitoringEnabled,
    adaptationThreshold,
  } = { ...defaultOptions, ...options };

  // State
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isAdapting, setIsAdapting] = useState(false);
  const [qualityMetrics, setQualityMetrics] = useState<Map<string, CallQualityMetrics>>(new Map());
  const [networkConditions, setNetworkConditions] = useState<Map<string, NetworkCondition>>(new Map());
  const [qualityPresets, setQualityPresets] = useState<QualityPreset[]>([]);

  // Refs
  const qualityServiceRef = useRef<CallQualityService | null>(null);
  const eventCallbacksRef = useRef<{
    onQualityChanged: Function[];
    onNetworkConditionChanged: Function[];
  }>({
    onQualityChanged: [],
    onNetworkConditionChanged: [],
  });

  // Initialize quality service
  useEffect(() => {
    if (!signalingService) return;

    const qualityService = new CallQualityService(signalingService);
    qualityServiceRef.current = qualityService;

    // Set up event listeners
    setupEventListeners(qualityService);

    // Get available presets
    setQualityPresets(qualityService.getAvailablePresets());

    // Start monitoring if enabled
    if (monitoringEnabled) {
      qualityService.startMonitoring();
      setIsMonitoring(true);
    }

    // Cleanup on unmount
    return () => {
      qualityService.destroy();
      qualityServiceRef.current = null;
    };
  }, [signalingService, monitoringEnabled]);

  // Auto-adaptation effect
  useEffect(() => {
    if (!autoAdaptation || !qualityServiceRef.current) return;

    const checkAndAdapt = async () => {
      const service = qualityServiceRef.current!;
      const metrics = service.getAllQualityMetrics();

      for (const [participantId, metric] of metrics) {
        const condition = metric.networkCondition;
        
        // Check if adaptation is needed based on thresholds
        const needsAdaptation = 
          condition.packetLoss > adaptationThreshold!.packetLoss ||
          condition.latency > adaptationThreshold!.latency ||
          condition.bandwidth < adaptationThreshold!.bandwidth;

        if (needsAdaptation) {
          try {
            setIsAdapting(true);
            await service.enableAutoAdaptation(participantId);
          } catch (error) {
            console.error('Auto-adaptation failed:', error);
          } finally {
            setIsAdapting(false);
          }
        }
      }
    };

    // Check every 10 seconds
    const interval = setInterval(checkAndAdapt, 10000);
    return () => clearInterval(interval);
  }, [autoAdaptation, adaptationThreshold]);

  const setupEventListeners = useCallback((service: CallQualityService) => {
    service.on('monitoring-started', () => {
      setIsMonitoring(true);
    });

    service.on('monitoring-stopped', () => {
      setIsMonitoring(false);
    });

    service.on('participant-monitored', (metrics: CallQualityMetrics) => {
      setQualityMetrics(prev => new Map(prev).set(metrics.participantId, metrics));
      setNetworkConditions(prev => new Map(prev).set(metrics.participantId, metrics.networkCondition));
      
      // Notify listeners
      eventCallbacksRef.current.onNetworkConditionChanged.forEach(callback => 
        callback({ participantId: metrics.participantId, condition: metrics.networkCondition })
      );
    });

    service.on('quality-adapted', (data: any) => {
      setIsAdapting(false);
      
      // Update metrics
      const updatedMetrics = service.getQualityMetrics(data.participantId);
      if (updatedMetrics) {
        setQualityMetrics(prev => new Map(prev).set(data.participantId, updatedMetrics));
      }
      
      // Notify listeners
      eventCallbacksRef.current.onQualityChanged.forEach(callback => callback(data));
    });

    service.on('quality-adaptation-failed', (data: any) => {
      setIsAdapting(false);
      console.error('Quality adaptation failed:', data);
    });
  }, []);

  // Actions
  const startMonitoring = useCallback(() => {
    if (qualityServiceRef.current) {
      qualityServiceRef.current.startMonitoring();
    }
  }, []);

  const stopMonitoring = useCallback(() => {
    if (qualityServiceRef.current) {
      qualityServiceRef.current.stopMonitoring();
    }
  }, []);

  const enableAutoAdaptation = useCallback(async (participantId: string) => {
    if (!qualityServiceRef.current) return;

    try {
      setIsAdapting(true);
      await qualityServiceRef.current.enableAutoAdaptation(participantId);
    } catch (error) {
      console.error('Failed to enable auto-adaptation:', error);
      throw error;
    } finally {
      setIsAdapting(false);
    }
  }, []);

  const setManualQuality = useCallback(async (participantId: string, presetName: string) => {
    if (!qualityServiceRef.current) return;

    try {
      setIsAdapting(true);
      await qualityServiceRef.current.setManualQuality(participantId, presetName);
    } catch (error) {
      console.error('Failed to set manual quality:', error);
      throw error;
    } finally {
      setIsAdapting(false);
    }
  }, []);

  const getParticipantQuality = useCallback((participantId: string): CallQualityMetrics | null => {
    return qualityServiceRef.current?.getQualityMetrics(participantId) || null;
  }, []);

  // Event subscription methods
  const onQualityChanged = useCallback((callback: (data: any) => void) => {
    eventCallbacksRef.current.onQualityChanged.push(callback);
    
    // Return cleanup function
    return () => {
      const callbacks = eventCallbacksRef.current.onQualityChanged;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }, []);

  const onNetworkConditionChanged = useCallback((callback: (data: any) => void) => {
    eventCallbacksRef.current.onNetworkConditionChanged.push(callback);
    
    // Return cleanup function
    return () => {
      const callbacks = eventCallbacksRef.current.onNetworkConditionChanged;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }, []);

  return {
    // Service state
    isMonitoring,
    isAdapting,
    
    // Quality metrics
    qualityMetrics,
    networkConditions,
    
    // Available presets
    qualityPresets,
    
    // Actions
    startMonitoring,
    stopMonitoring,
    enableAutoAdaptation,
    setManualQuality,
    getParticipantQuality,
    
    // Events
    onQualityChanged,
    onNetworkConditionChanged,
  };
}