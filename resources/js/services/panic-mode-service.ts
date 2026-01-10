export interface PanicResource {
  id: string;
  type: 'hotline' | 'chat' | 'text' | 'emergency_service' | 'self_help' | 'breathing_exercise';
  name: string;
  description: string;
  contactInfo: {
    phone?: string;
    url?: string;
    sms?: string;
    email?: string;
  };
  availability: {
    alwaysAvailable: boolean;
    hours?: {
      start: string;
      end: string;
      timezone: string;
    };
    languages: string[];
  };
  location?: {
    country: string;
    region?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
      radius: number; // km
    };
  };
  priority: number; // 1-5, 1 being highest
  ageGroups: ('child' | 'teen' | 'adult' | 'senior')[];
  categories: string[];
  verified: boolean;
  lastUpdated: Date;
}

export interface PanicSession {
  id: string;
  userId: string;
  startedAt: Date;
  endedAt?: Date;
  triggerSource: 'manual' | 'crisis_detection' | 'escalation' | 'scheduled_check';
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    address?: string;
  };
  resourcesAccessed: Array<{
    resourceId: string;
    accessedAt: Date;
    duration?: number; // seconds
    completed: boolean;
    helpful?: boolean;
  }>;
  emergencyContacted: boolean;
  followUpRequired: boolean;
  notes?: string;
  status: 'active' | 'completed' | 'interrupted' | 'escalated';
}

export interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  duration: number; // seconds
  pattern: {
    inhale: number;
    hold: number;
    exhale: number;
    pause: number;
  };
  instructions: string[];
  audioUrl?: string;
  visualCues: {
    type: 'circle' | 'square' | 'wave';
    colors: string[];
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
}

export interface LocationBasedService {
  id: string;
  name: string;
  type: 'hospital' | 'crisis_center' | 'police' | 'fire' | 'mental_health_clinic';
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: number; // km from user
  contactInfo: {
    phone: string;
    emergencyPhone?: string;
    website?: string;
  };
  availability: {
    hours: string;
    emergency24h: boolean;
  };
  services: string[];
  rating?: number;
  verified: boolean;
}

export class PanicModeService {
  private baseUrl: string;
  private authToken: string;
  private currentSession: PanicSession | null = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private locationWatcher: number | null = null;
  private breathingTimer: NodeJS.Timeout | null = null;

  constructor(config: {
    baseUrl: string;
    authToken: string;
  }) {
    this.baseUrl = config.baseUrl;
    this.authToken = config.authToken;
  }

  // Start panic mode session
  public async startPanicMode(triggerSource: PanicSession['triggerSource'] = 'manual'): Promise<PanicSession> {
    try {
      // Get user location if available
      const location = await this.getCurrentLocation();

      const sessionData = {
        userId: this.getCurrentUserId(),
        startedAt: new Date().toISOString(),
        triggerSource,
        location,
        resourcesAccessed: [],
        emergencyContacted: false,
        followUpRequired: true,
        status: 'active',
      };

      const response = await fetch(`${this.baseUrl}/api/panic/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error(`Failed to start panic session: ${response.status}`);
      }

      const result = await response.json();
      this.currentSession = result.session;

      // Start location tracking if permission granted
      this.startLocationTracking();

      // Emit event
      this.emit('panic_mode_started', this.currentSession);

      return this.currentSession;
    } catch (error) {
      console.error('Failed to start panic mode:', error);
      throw error;
    }
  }

  // End panic mode session
  public async endPanicMode(notes?: string): Promise<void> {
    if (!this.currentSession) return;

    try {
      const response = await fetch(`${this.baseUrl}/api/panic/sessions/${this.currentSession.id}/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endedAt: new Date().toISOString(),
          notes,
          status: 'completed',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to end panic session: ${response.status}`);
      }

      // Stop location tracking
      this.stopLocationTracking();

      // Stop any active breathing exercises
      this.stopBreathingExercise();

      const sessionId = this.currentSession.id;
      this.currentSession = null;

      this.emit('panic_mode_ended', { sessionId, notes });
    } catch (error) {
      console.error('Failed to end panic mode:', error);
      throw error;
    }
  }

  // Get panic resources based on location and user profile
  public async getPanicResources(filters?: {
    type?: PanicResource['type'];
    location?: { latitude: number; longitude: number };
    ageGroup?: string;
    language?: string;
    emergency?: boolean;
  }): Promise<PanicResource[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.ageGroup) params.append('ageGroup', filters.ageGroup);
      if (filters?.language) params.append('language', filters.language);
      if (filters?.emergency) params.append('emergency', 'true');
      if (filters?.location) {
        params.append('lat', filters.location.latitude.toString());
        params.append('lng', filters.location.longitude.toString());
      }

      const response = await fetch(`${this.baseUrl}/api/panic/resources?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get panic resources: ${response.status}`);
      }

      const result = await response.json();
      return result.resources;
    } catch (error) {
      console.error('Failed to get panic resources:', error);
      throw error;
    }
  }

  // Access a panic resource
  public async accessResource(resourceId: string): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active panic session');
    }

    try {
      const accessData = {
        resourceId,
        accessedAt: new Date().toISOString(),
      };

      const response = await fetch(`${this.baseUrl}/api/panic/sessions/${this.currentSession.id}/resources`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accessData),
      });

      if (!response.ok) {
        throw new Error(`Failed to access resource: ${response.status}`);
      }

      // Update local session
      this.currentSession.resourcesAccessed.push({
        resourceId,
        accessedAt: new Date(),
        completed: false,
      });

      this.emit('resource_accessed', { resourceId, sessionId: this.currentSession.id });
    } catch (error) {
      console.error('Failed to access resource:', error);
      throw error;
    }
  }

  // Contact emergency services
  public async contactEmergencyServices(location?: { latitude: number; longitude: number }): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active panic session');
    }

    try {
      const emergencyData = {
        sessionId: this.currentSession.id,
        location: location || this.currentSession.location,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(`${this.baseUrl}/api/panic/emergency`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emergencyData),
      });

      if (!response.ok) {
        throw new Error(`Failed to contact emergency services: ${response.status}`);
      }

      // Update session
      this.currentSession.emergencyContacted = true;

      this.emit('emergency_contacted', { sessionId: this.currentSession.id, location });
    } catch (error) {
      console.error('Failed to contact emergency services:', error);
      throw error;
    }
  }

  // Get nearby emergency services
  public async getNearbyServices(location: { latitude: number; longitude: number }): Promise<LocationBasedService[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/panic/services/nearby`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          radius: 25, // 25km radius
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get nearby services: ${response.status}`);
      }

      const result = await response.json();
      return result.services;
    } catch (error) {
      console.error('Failed to get nearby services:', error);
      throw error;
    }
  }

  // Start breathing exercise
  public async startBreathingExercise(exerciseId: string): Promise<BreathingExercise> {
    try {
      const response = await fetch(`${this.baseUrl}/api/panic/breathing/${exerciseId}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get breathing exercise: ${response.status}`);
      }

      const result = await response.json();
      const exercise: BreathingExercise = result.exercise;

      // Start breathing timer
      this.startBreathingTimer(exercise);

      // Track resource access
      if (this.currentSession) {
        await this.accessResource(exerciseId);
      }

      this.emit('breathing_exercise_started', exercise);
      return exercise;
    } catch (error) {
      console.error('Failed to start breathing exercise:', error);
      throw error;
    }
  }

  // Stop breathing exercise
  public stopBreathingExercise(): void {
    if (this.breathingTimer) {
      clearInterval(this.breathingTimer);
      this.breathingTimer = null;
      this.emit('breathing_exercise_stopped');
    }
  }

  // Start breathing timer for guided exercise
  private startBreathingTimer(exercise: BreathingExercise): void {
    let phase: 'inhale' | 'hold' | 'exhale' | 'pause' = 'inhale';
    let phaseTime = 0;
    let cycleCount = 0;
    const totalCycles = Math.ceil(exercise.duration / (
      exercise.pattern.inhale + 
      exercise.pattern.hold + 
      exercise.pattern.exhale + 
      exercise.pattern.pause
    ));

    this.breathingTimer = setInterval(() => {
      phaseTime++;

      let phaseDuration: number;
      switch (phase) {
        case 'inhale':
          phaseDuration = exercise.pattern.inhale;
          break;
        case 'hold':
          phaseDuration = exercise.pattern.hold;
          break;
        case 'exhale':
          phaseDuration = exercise.pattern.exhale;
          break;
        case 'pause':
          phaseDuration = exercise.pattern.pause;
          break;
      }

      if (phaseTime >= phaseDuration) {
        phaseTime = 0;
        
        // Move to next phase
        switch (phase) {
          case 'inhale':
            phase = 'hold';
            break;
          case 'hold':
            phase = 'exhale';
            break;
          case 'exhale':
            phase = 'pause';
            break;
          case 'pause':
            phase = 'inhale';
            cycleCount++;
            break;
        }

        // Check if exercise is complete
        if (cycleCount >= totalCycles) {
          this.stopBreathingExercise();
          this.emit('breathing_exercise_completed', exercise);
          return;
        }
      }

      this.emit('breathing_phase_update', {
        phase,
        phaseTime,
        phaseDuration,
        cycleCount,
        totalCycles,
        progress: (cycleCount / totalCycles) * 100,
      });
    }, 1000);
  }

  // Get current location
  private async getCurrentLocation(): Promise<{ latitude: number; longitude: number; accuracy: number } | undefined> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(undefined);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          console.warn('Failed to get location:', error);
          resolve(undefined);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  // Start location tracking
  private startLocationTracking(): void {
    if (!navigator.geolocation || this.locationWatcher) return;

    this.locationWatcher = navigator.geolocation.watchPosition(
      (position) => {
        if (this.currentSession) {
          this.currentSession.location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };

          this.emit('location_updated', this.currentSession.location);
        }
      },
      (error) => {
        console.warn('Location tracking error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 60000, // 1 minute
      }
    );
  }

  // Stop location tracking
  private stopLocationTracking(): void {
    if (this.locationWatcher) {
      navigator.geolocation.clearWatch(this.locationWatcher);
      this.locationWatcher = null;
    }
  }

  // Get current user ID (would be implemented based on auth system)
  private getCurrentUserId(): string {
    // This would typically come from authentication context
    return 'current_user_id';
  }

  // Get available breathing exercises
  public async getBreathingExercises(): Promise<BreathingExercise[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/panic/breathing`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get breathing exercises: ${response.status}`);
      }

      const result = await response.json();
      return result.exercises;
    } catch (error) {
      console.error('Failed to get breathing exercises:', error);
      throw error;
    }
  }

  // Get panic session history
  public async getSessionHistory(limit: number = 10): Promise<PanicSession[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/panic/sessions/history?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get session history: ${response.status}`);
      }

      const result = await response.json();
      return result.sessions;
    } catch (error) {
      console.error('Failed to get session history:', error);
      throw error;
    }
  }

  // Rate resource helpfulness
  public async rateResource(resourceId: string, helpful: boolean, feedback?: string): Promise<void> {
    if (!this.currentSession) return;

    try {
      const response = await fetch(`${this.baseUrl}/api/panic/resources/${resourceId}/rate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.currentSession.id,
          helpful,
          feedback,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to rate resource: ${response.status}`);
      }

      // Update local session
      const resourceAccess = this.currentSession.resourcesAccessed.find(r => r.resourceId === resourceId);
      if (resourceAccess) {
        resourceAccess.helpful = helpful;
        resourceAccess.completed = true;
      }

      this.emit('resource_rated', { resourceId, helpful, feedback });
    } catch (error) {
      console.error('Failed to rate resource:', error);
      throw error;
    }
  }

  // Get current session
  public getCurrentSession(): PanicSession | null {
    return this.currentSession;
  }

  // Check if panic mode is active
  public isPanicModeActive(): boolean {
    return this.currentSession !== null && this.currentSession.status === 'active';
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
    // Stop all timers and watchers
    this.stopLocationTracking();
    this.stopBreathingExercise();
    
    // End current session if active
    if (this.currentSession) {
      this.endPanicMode('Session terminated');
    }
    
    // Clear event listeners
    this.eventListeners.clear();
  }
}