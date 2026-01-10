import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  PanicModeService, 
  PanicResource, 
  PanicSession, 
  BreathingExercise, 
  LocationBasedService 
} from '@/services/panic-mode-service';

export interface UsePanicModeOptions {
  baseUrl?: string;
  authToken: string;
  userId: string;
  autoStartLocation?: boolean;
  enableNotifications?: boolean;
}

export interface BreathingPhase {
  phase: 'inhale' | 'hold' | 'exhale' | 'pause';
  phaseTime: number;
  phaseDuration: number;
  cycleCount: number;
  totalCycles: number;
  progress: number;
}

export interface UsePanicModeReturn {
  // State
  isActive: boolean;
  currentSession: PanicSession | null;
  panicResources: PanicResource[];
  nearbyServices: LocationBasedService[];
  breathingExercises: BreathingExercise[];
  currentExercise: BreathingExercise | null;
  breathingPhase: BreathingPhase | null;
  userLocation: { latitude: number; longitude: number } | null;
  isLoading: boolean;
  error: string | null;

  // Panic mode actions
  startPanicMode: (triggerSource?: PanicSession['triggerSource']) => Promise<void>;
  endPanicMode: (notes?: string) => Promise<void>;
  
  // Resource actions
  loadPanicResources: (filters?: any) => Promise<void>;
  accessResource: (resourceId: string) => Promise<void>;
  rateResource: (resourceId: string, helpful: boolean, feedback?: string) => Promise<void>;
  
  // Emergency actions
  contactEmergencyServices: () => Promise<void>;
  loadNearbyServices: () => Promise<void>;
  
  // Breathing exercises
  startBreathingExercise: (exerciseId: string) => Promise<void>;
  stopBreathingExercise: () => void;
  loadBreathingExercises: () => Promise<void>;
  
  // Location
  updateLocation: () => Promise<void>;
  
  // Utilities
  getResourcesByType: (type: PanicResource['type']) => PanicResource[];
  getEmergencyResources: () => PanicResource[];
  getImmediateHelpResources: () => PanicResource[];
  formatSessionDuration: (session: PanicSession) => string;
  
  // Events
  onPanicModeStarted: (callback: (session: PanicSession) => void) => () => void;
  onPanicModeEnded: (callback: (data: { sessionId: string; notes?: string }) => void) => () => void;
  onResourceAccessed: (callback: (data: { resourceId: string; sessionId: string }) => void) => () => void;
  onEmergencyContacted: (callback: (data: { sessionId: string; location?: any }) => void) => () => void;
  onBreathingPhaseUpdate: (callback: (phase: BreathingPhase) => void) => () => void;
}

export function usePanicMode(options: UsePanicModeOptions): UsePanicModeReturn {
  const {
    baseUrl = '/api',
    authToken,
    userId,
    autoStartLocation = true,
    enableNotifications = true,
  } = options;

  // State
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<PanicSession | null>(null);
  const [panicResources, setPanicResources] = useState<PanicResource[]>([]);
  const [nearbyServices, setNearbyServices] = useState<LocationBasedService[]>([]);
  const [breathingExercises, setBreathingExercises] = useState<BreathingExercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<BreathingExercise | null>(null);
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const serviceRef = useRef<PanicModeService | null>(null);
  const eventUnsubscribersRef = useRef<(() => void)[]>([]);

  // Initialize service
  useEffect(() => {
    const service = new PanicModeService({
      baseUrl,
      authToken,
    });

    serviceRef.current = service;
    setupEventListeners(service);

    // Load initial data
    loadInitialData();

    // Get location if enabled
    if (autoStartLocation) {
      updateLocation();
    }

    return () => {
      cleanup();
    };
  }, [baseUrl, authToken, autoStartLocation]);

  // Setup event listeners
  const setupEventListeners = useCallback((service: PanicModeService) => {
    const unsubscribers: (() => void)[] = [];

    unsubscribers.push(
      service.on('panic_mode_started', (session: PanicSession) => {
        setCurrentSession(session);
        setIsActive(true);
        
        if (enableNotifications && 'Notification' in window) {
          new Notification('🆘 Panic Mode Activated', {
            body: 'Crisis resources are now available. You are not alone.',
            icon: '/panic-mode-icon.png',
            requireInteraction: true,
          });
        }
      })
    );

    unsubscribers.push(
      service.on('panic_mode_ended', (data: { sessionId: string; notes?: string }) => {
        setCurrentSession(null);
        setIsActive(false);
        setCurrentExercise(null);
        setBreathingPhase(null);
        
        if (enableNotifications && 'Notification' in window) {
          new Notification('✅ Panic Mode Ended', {
            body: 'Session completed. Remember that help is always available.',
            icon: '/success-icon.png',
          });
        }
      })
    );

    unsubscribers.push(
      service.on('resource_accessed', (data: { resourceId: string; sessionId: string }) => {
        // Update session with accessed resource
        setCurrentSession(prev => {
          if (!prev || prev.id !== data.sessionId) return prev;
          
          const existingAccess = prev.resourcesAccessed.find(r => r.resourceId === data.resourceId);
          if (existingAccess) return prev;
          
          return {
            ...prev,
            resourcesAccessed: [
              ...prev.resourcesAccessed,
              {
                resourceId: data.resourceId,
                accessedAt: new Date(),
                completed: false,
              },
            ],
          };
        });
      })
    );

    unsubscribers.push(
      service.on('emergency_contacted', (data: { sessionId: string; location?: any }) => {
        setCurrentSession(prev => {
          if (!prev || prev.id !== data.sessionId) return prev;
          return { ...prev, emergencyContacted: true };
        });
        
        if (enableNotifications && 'Notification' in window) {
          new Notification('🚨 Emergency Services Contacted', {
            body: 'Emergency services have been notified of your location.',
            icon: '/emergency-icon.png',
            requireInteraction: true,
          });
        }
      })
    );

    unsubscribers.push(
      service.on('breathing_exercise_started', (exercise: BreathingExercise) => {
        setCurrentExercise(exercise);
      })
    );

    unsubscribers.push(
      service.on('breathing_exercise_stopped', () => {
        setCurrentExercise(null);
        setBreathingPhase(null);
      })
    );

    unsubscribers.push(
      service.on('breathing_exercise_completed', (exercise: BreathingExercise) => {
        setCurrentExercise(null);
        setBreathingPhase(null);
        
        if (enableNotifications && 'Notification' in window) {
          new Notification('🌬️ Breathing Exercise Complete', {
            body: `Great job completing the ${exercise.name} exercise!`,
            icon: '/breathing-icon.png',
          });
        }
      })
    );

    unsubscribers.push(
      service.on('breathing_phase_update', (phase: BreathingPhase) => {
        setBreathingPhase(phase);
      })
    );

    unsubscribers.push(
      service.on('location_updated', (location: { latitude: number; longitude: number }) => {
        setUserLocation(location);
      })
    );

    eventUnsubscribersRef.current = unsubscribers;
  }, [enableNotifications]);

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

    setIsLoading(true);
    try {
      await Promise.all([
        loadPanicResources(),
        loadBreathingExercises(),
      ]);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start panic mode
  const startPanicMode = useCallback(async (triggerSource: PanicSession['triggerSource'] = 'manual') => {
    if (!serviceRef.current) return;

    setError(null);
    setIsLoading(true);

    try {
      await serviceRef.current.startPanicMode(triggerSource);
      
      // Load resources and nearby services
      await Promise.all([
        loadPanicResources(),
        loadNearbyServices(),
      ]);
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to start panic mode';
      setError(error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // End panic mode
  const endPanicMode = useCallback(async (notes?: string) => {
    if (!serviceRef.current) return;

    try {
      await serviceRef.current.endPanicMode(notes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end panic mode');
      throw err;
    }
  }, []);

  // Load panic resources
  const loadPanicResources = useCallback(async (filters?: any) => {
    if (!serviceRef.current) return;

    try {
      const resources = await serviceRef.current.getPanicResources({
        ...filters,
        location: userLocation || undefined,
      });
      setPanicResources(resources);
    } catch (err) {
      console.error('Failed to load panic resources:', err);
    }
  }, [userLocation]);

  // Access resource
  const accessResource = useCallback(async (resourceId: string) => {
    if (!serviceRef.current) return;

    try {
      await serviceRef.current.accessResource(resourceId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to access resource');
      throw err;
    }
  }, []);

  // Rate resource
  const rateResource = useCallback(async (resourceId: string, helpful: boolean, feedback?: string) => {
    if (!serviceRef.current) return;

    try {
      await serviceRef.current.rateResource(resourceId, helpful, feedback);
    } catch (err) {
      console.error('Failed to rate resource:', err);
    }
  }, []);

  // Contact emergency services
  const contactEmergencyServices = useCallback(async () => {
    if (!serviceRef.current) return;

    try {
      await serviceRef.current.contactEmergencyServices(userLocation || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to contact emergency services');
      throw err;
    }
  }, [userLocation]);

  // Load nearby services
  const loadNearbyServices = useCallback(async () => {
    if (!serviceRef.current || !userLocation) return;

    try {
      const services = await serviceRef.current.getNearbyServices(userLocation);
      setNearbyServices(services);
    } catch (err) {
      console.error('Failed to load nearby services:', err);
    }
  }, [userLocation]);

  // Start breathing exercise
  const startBreathingExercise = useCallback(async (exerciseId: string) => {
    if (!serviceRef.current) return;

    try {
      await serviceRef.current.startBreathingExercise(exerciseId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start breathing exercise');
      throw err;
    }
  }, []);

  // Stop breathing exercise
  const stopBreathingExercise = useCallback(() => {
    if (!serviceRef.current) return;
    serviceRef.current.stopBreathingExercise();
  }, []);

  // Load breathing exercises
  const loadBreathingExercises = useCallback(async () => {
    if (!serviceRef.current) return;

    try {
      const exercises = await serviceRef.current.getBreathingExercises();
      setBreathingExercises(exercises);
    } catch (err) {
      console.error('Failed to load breathing exercises:', err);
    }
  }, []);

  // Update location
  const updateLocation = useCallback(async () => {
    return new Promise<void>((resolve) => {
      if (!navigator.geolocation) {
        resolve();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          resolve();
        },
        (error) => {
          console.warn('Failed to get location:', error);
          resolve();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });
  }, []);

  // Utility functions
  const getResourcesByType = useCallback((type: PanicResource['type']) => {
    return panicResources.filter(resource => resource.type === type);
  }, [panicResources]);

  const getEmergencyResources = useCallback(() => {
    return panicResources.filter(resource => 
      resource.type === 'hotline' || 
      resource.type === 'emergency_service' ||
      resource.availability.alwaysAvailable
    ).sort((a, b) => a.priority - b.priority);
  }, [panicResources]);

  const getImmediateHelpResources = useCallback(() => {
    return panicResources.filter(resource => 
      resource.type === 'hotline' || 
      resource.type === 'chat' || 
      resource.type === 'breathing_exercise'
    ).sort((a, b) => a.priority - b.priority);
  }, [panicResources]);

  const formatSessionDuration = useCallback((session: PanicSession): string => {
    const start = new Date(session.startedAt);
    const end = session.endedAt ? new Date(session.endedAt) : new Date();
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, []);

  // Event handlers
  const onPanicModeStarted = useCallback((callback: (session: PanicSession) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('panic_mode_started', callback);
  }, []);

  const onPanicModeEnded = useCallback((callback: (data: { sessionId: string; notes?: string }) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('panic_mode_ended', callback);
  }, []);

  const onResourceAccessed = useCallback((callback: (data: { resourceId: string; sessionId: string }) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('resource_accessed', callback);
  }, []);

  const onEmergencyContacted = useCallback((callback: (data: { sessionId: string; location?: any }) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('emergency_contacted', callback);
  }, []);

  const onBreathingPhaseUpdate = useCallback((callback: (phase: BreathingPhase) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('breathing_phase_update', callback);
  }, []);

  return {
    // State
    isActive,
    currentSession,
    panicResources,
    nearbyServices,
    breathingExercises,
    currentExercise,
    breathingPhase,
    userLocation,
    isLoading,
    error,

    // Panic mode actions
    startPanicMode,
    endPanicMode,

    // Resource actions
    loadPanicResources,
    accessResource,
    rateResource,

    // Emergency actions
    contactEmergencyServices,
    loadNearbyServices,

    // Breathing exercises
    startBreathingExercise,
    stopBreathingExercise,
    loadBreathingExercises,

    // Location
    updateLocation,

    // Utilities
    getResourcesByType,
    getEmergencyResources,
    getImmediateHelpResources,
    formatSessionDuration,

    // Events
    onPanicModeStarted,
    onPanicModeEnded,
    onResourceAccessed,
    onEmergencyContacted,
    onBreathingPhaseUpdate,
  };
}