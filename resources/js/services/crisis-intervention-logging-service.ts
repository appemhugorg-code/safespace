export interface CrisisEvent {
  id: string;
  userId: string;
  sessionId?: string;
  alertId?: string;
  panicSessionId?: string;
  eventType: 'crisis_detected' | 'alert_created' | 'panic_activated' | 'intervention_started' | 'resource_accessed' | 'emergency_contacted' | 'session_ended' | 'follow_up_scheduled' | 'outcome_recorded';
  severity: 'low' | 'medium' | 'high' | 'critical' | 'emergency';
  timestamp: Date;
  source: 'system' | 'user' | 'therapist' | 'guardian' | 'crisis_team' | 'emergency_services';
  context: {
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
      accuracy: number;
    };
    deviceInfo?: {
      type: 'web' | 'mobile' | 'desktop';
      userAgent: string;
      platform: string;
      ipAddress?: string; // Hashed for privacy
    };
    triggerData?: {
      confidence?: number;
      categories?: string[];
      triggers?: string[];
      messageId?: string;
      conversationId?: string;
    };
    interventionData?: {
      interventionType: string;
      duration?: number;
      resourcesUsed: string[];
      outcome?: string;
      effectiveness?: number; // 1-5 scale
    };
  };
  metadata: {
    encrypted: boolean;
    sanitized: boolean;
    retentionDate: Date;
    accessLevel: 'public' | 'internal' | 'restricted' | 'confidential';
    complianceFlags: string[];
  };
  relatedEvents: string[]; // IDs of related events
  tags: string[];
  notes?: string; // Encrypted if sensitive
}

export interface InterventionSession {
  id: string;
  userId: string;
  startedAt: Date;
  endedAt?: Date;
  triggerEventId: string;
  interventionType: 'automated' | 'therapist_led' | 'peer_support' | 'emergency_response' | 'self_help';
  status: 'active' | 'completed' | 'interrupted' | 'escalated' | 'failed';
  participants: Array<{
    userId: string;
    role: 'client' | 'therapist' | 'guardian' | 'crisis_counselor' | 'peer_supporter';
    joinedAt: Date;
    leftAt?: Date;
  }>;
  interventions: Array<{
    id: string;
    type: 'conversation' | 'breathing_exercise' | 'resource_sharing' | 'safety_planning' | 'referral' | 'medication_reminder';
    startedAt: Date;
    completedAt?: Date;
    effectiveness?: number; // 1-5 scale
    notes?: string;
  }>;
  outcome: {
    status: 'resolved' | 'ongoing' | 'escalated' | 'referred' | 'no_response';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    followUpRequired: boolean;
    followUpDate?: Date;
    safetyPlanUpdated: boolean;
    notes?: string;
  };
  metrics: {
    responseTime: number; // seconds from trigger to first intervention
    totalDuration: number; // seconds
    resourcesAccessed: number;
    participantSatisfaction?: number; // 1-5 scale
    clinicalEffectiveness?: number; // 1-5 scale
  };
}

export interface FollowUpPlan {
  id: string;
  userId: string;
  interventionSessionId: string;
  createdAt: Date;
  scheduledDate: Date;
  completedAt?: Date;
  type: 'check_in' | 'therapy_session' | 'safety_assessment' | 'medication_review' | 'resource_connection';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: {
    userId: string;
    role: string;
    name: string;
  };
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  tasks: Array<{
    id: string;
    description: string;
    completed: boolean;
    completedAt?: Date;
    notes?: string;
  }>;
  outcome?: {
    riskAssessment: 'improved' | 'stable' | 'declined' | 'critical';
    actionsTaken: string[];
    nextSteps: string[];
    followUpRequired: boolean;
    notes?: string;
  };
}

export interface AuditTrail {
  id: string;
  eventId: string;
  action: 'created' | 'viewed' | 'modified' | 'deleted' | 'exported' | 'shared';
  performedBy: {
    userId: string;
    role: string;
    name?: string;
  };
  timestamp: Date;
  details: {
    ipAddress?: string; // Hashed
    userAgent?: string;
    location?: string;
    reason?: string;
    changes?: Record<string, any>;
  };
  complianceInfo: {
    hipaaCompliant: boolean;
    dataMinimization: boolean;
    purposeLimitation: boolean;
    consentBasis: string;
  };
}

export interface CrisisMetrics {
  period: {
    start: Date;
    end: Date;
  };
  totalEvents: number;
  eventsByType: Record<CrisisEvent['eventType'], number>;
  eventsBySeverity: Record<CrisisEvent['severity'], number>;
  interventionMetrics: {
    totalSessions: number;
    averageResponseTime: number;
    averageDuration: number;
    successRate: number;
    escalationRate: number;
    followUpCompletionRate: number;
  };
  outcomeMetrics: {
    resolved: number;
    ongoing: number;
    escalated: number;
    referred: number;
    noResponse: number;
  };
  resourceUtilization: Record<string, number>;
  complianceMetrics: {
    encryptionRate: number;
    retentionCompliance: number;
    accessControlCompliance: number;
    auditTrailCompleteness: number;
  };
}

export class CrisisInterventionLoggingService {
  private baseUrl: string;
  private authToken: string;
  private encryptionKey: string;
  private eventQueue: CrisisEvent[] = [];
  private processingQueue = false;
  private retentionPolicies: Map<string, number> = new Map(); // days
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config: {
    baseUrl: string;
    authToken: string;
    encryptionKey: string;
  }) {
    this.baseUrl = config.baseUrl;
    this.authToken = config.authToken;
    this.encryptionKey = config.encryptionKey;

    // Set default retention policies (in days)
    this.retentionPolicies.set('crisis_detected', 2555); // 7 years
    this.retentionPolicies.set('alert_created', 2555);
    this.retentionPolicies.set('panic_activated', 2555);
    this.retentionPolicies.set('intervention_started', 2555);
    this.retentionPolicies.set('resource_accessed', 1095); // 3 years
    this.retentionPolicies.set('emergency_contacted', 2555);
    this.retentionPolicies.set('session_ended', 1095);
    this.retentionPolicies.set('follow_up_scheduled', 1095);
    this.retentionPolicies.set('outcome_recorded', 2555);

    this.startQueueProcessor();
  }

  // Log crisis event
  public async logCrisisEvent(eventData: Omit<CrisisEvent, 'id' | 'timestamp' | 'metadata' | 'relatedEvents'>): Promise<CrisisEvent> {
    try {
      const event: CrisisEvent = {
        ...eventData,
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        metadata: {
          encrypted: this.shouldEncrypt(eventData),
          sanitized: this.shouldSanitize(eventData),
          retentionDate: this.calculateRetentionDate(eventData.eventType),
          accessLevel: this.determineAccessLevel(eventData),
          complianceFlags: this.getComplianceFlags(eventData),
        },
        relatedEvents: [],
      };

      // Encrypt sensitive data
      if (event.metadata.encrypted) {
        event.notes = event.notes ? await this.encryptData(event.notes) : undefined;
        if (event.context.triggerData) {
          event.context.triggerData = await this.encryptObject(event.context.triggerData);
        }
      }

      // Sanitize data
      if (event.metadata.sanitized) {
        event.context = this.sanitizeContext(event.context);
      }

      // Add to queue for processing
      this.eventQueue.push(event);

      // Emit event
      this.emit('event_logged', event);

      return event;
    } catch (error) {
      console.error('Failed to log crisis event:', error);
      throw error;
    }
  }

  // Start intervention session
  public async startInterventionSession(data: {
    userId: string;
    triggerEventId: string;
    interventionType: InterventionSession['interventionType'];
    participants: InterventionSession['participants'];
  }): Promise<InterventionSession> {
    try {
      const session: InterventionSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: data.userId,
        startedAt: new Date(),
        triggerEventId: data.triggerEventId,
        interventionType: data.interventionType,
        status: 'active',
        participants: data.participants,
        interventions: [],
        outcome: {
          status: 'ongoing',
          riskLevel: 'medium',
          followUpRequired: true,
          safetyPlanUpdated: false,
        },
        metrics: {
          responseTime: 0,
          totalDuration: 0,
          resourcesAccessed: 0,
        },
      };

      const response = await fetch(`${this.baseUrl}/api/crisis/interventions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(session),
      });

      if (!response.ok) {
        throw new Error(`Failed to start intervention session: ${response.status}`);
      }

      const result = await response.json();

      // Log intervention started event
      await this.logCrisisEvent({
        userId: data.userId,
        sessionId: session.id,
        eventType: 'intervention_started',
        severity: 'medium',
        source: 'system',
        context: {
          interventionData: {
            interventionType: data.interventionType,
            resourcesUsed: [],
          },
        },
        tags: ['intervention', 'session_start'],
      });

      this.emit('intervention_started', session);
      return result.session;
    } catch (error) {
      console.error('Failed to start intervention session:', error);
      throw error;
    }
  }

  // End intervention session
  public async endInterventionSession(
    sessionId: string, 
    outcome: InterventionSession['outcome'],
    metrics?: Partial<InterventionSession['metrics']>
  ): Promise<void> {
    try {
      const updateData = {
        endedAt: new Date().toISOString(),
        status: 'completed',
        outcome,
        metrics,
      };

      const response = await fetch(`${this.baseUrl}/api/crisis/interventions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to end intervention session: ${response.status}`);
      }

      const result = await response.json();
      const session: InterventionSession = result.session;

      // Log session ended event
      await this.logCrisisEvent({
        userId: session.userId,
        sessionId: sessionId,
        eventType: 'session_ended',
        severity: outcome.riskLevel === 'critical' ? 'critical' : 'medium',
        source: 'system',
        context: {
          interventionData: {
            interventionType: session.interventionType,
            duration: session.metrics.totalDuration,
            resourcesUsed: [],
            outcome: outcome.status,
            effectiveness: metrics?.clinicalEffectiveness,
          },
        },
        tags: ['intervention', 'session_end', outcome.status],
      });

      // Schedule follow-up if required
      if (outcome.followUpRequired && outcome.followUpDate) {
        await this.scheduleFollowUp({
          userId: session.userId,
          interventionSessionId: sessionId,
          scheduledDate: outcome.followUpDate,
          type: 'check_in',
          priority: outcome.riskLevel === 'critical' ? 'urgent' : 'medium',
        });
      }

      this.emit('intervention_ended', session);
    } catch (error) {
      console.error('Failed to end intervention session:', error);
      throw error;
    }
  }

  // Schedule follow-up
  public async scheduleFollowUp(data: {
    userId: string;
    interventionSessionId: string;
    scheduledDate: Date;
    type: FollowUpPlan['type'];
    priority: FollowUpPlan['priority'];
    assignedTo?: FollowUpPlan['assignedTo'];
    tasks?: FollowUpPlan['tasks'];
  }): Promise<FollowUpPlan> {
    try {
      const followUp: FollowUpPlan = {
        id: `followup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: data.userId,
        interventionSessionId: data.interventionSessionId,
        createdAt: new Date(),
        scheduledDate: data.scheduledDate,
        type: data.type,
        priority: data.priority,
        assignedTo: data.assignedTo || {
          userId: 'system',
          role: 'system',
          name: 'Automated System',
        },
        status: 'scheduled',
        tasks: data.tasks || [],
      };

      const response = await fetch(`${this.baseUrl}/api/crisis/follow-ups`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(followUp),
      });

      if (!response.ok) {
        throw new Error(`Failed to schedule follow-up: ${response.status}`);
      }

      const result = await response.json();

      // Log follow-up scheduled event
      await this.logCrisisEvent({
        userId: data.userId,
        sessionId: data.interventionSessionId,
        eventType: 'follow_up_scheduled',
        severity: data.priority === 'urgent' ? 'high' : 'medium',
        source: 'system',
        context: {},
        tags: ['follow_up', 'scheduled', data.type],
      });

      this.emit('follow_up_scheduled', followUp);
      return result.followUp;
    } catch (error) {
      console.error('Failed to schedule follow-up:', error);
      throw error;
    }
  }

  // Complete follow-up
  public async completeFollowUp(
    followUpId: string, 
    outcome: FollowUpPlan['outcome']
  ): Promise<void> {
    try {
      const updateData = {
        completedAt: new Date().toISOString(),
        status: 'completed',
        outcome,
      };

      const response = await fetch(`${this.baseUrl}/api/crisis/follow-ups/${followUpId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to complete follow-up: ${response.status}`);
      }

      const result = await response.json();
      const followUp: FollowUpPlan = result.followUp;

      // Log outcome recorded event
      await this.logCrisisEvent({
        userId: followUp.userId,
        sessionId: followUp.interventionSessionId,
        eventType: 'outcome_recorded',
        severity: outcome.riskAssessment === 'critical' ? 'critical' : 'medium',
        source: 'therapist',
        context: {},
        tags: ['follow_up', 'completed', outcome.riskAssessment],
      });

      this.emit('follow_up_completed', followUp);
    } catch (error) {
      console.error('Failed to complete follow-up:', error);
      throw error;
    }
  }

  // Get crisis events with filtering
  public async getCrisisEvents(filters: {
    userId?: string;
    eventType?: CrisisEvent['eventType'];
    severity?: CrisisEvent['severity'];
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ events: CrisisEvent[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.eventType) params.append('eventType', filters.eventType);
      if (filters.severity) params.append('severity', filters.severity);
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());

      const response = await fetch(`${this.baseUrl}/api/crisis/events?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get crisis events: ${response.status}`);
      }

      const result = await response.json();

      // Decrypt sensitive data for authorized users
      const events = await Promise.all(
        result.events.map(async (event: CrisisEvent) => {
          if (event.metadata.encrypted) {
            return await this.decryptEvent(event);
          }
          return event;
        })
      );

      return { events, total: result.total };
    } catch (error) {
      console.error('Failed to get crisis events:', error);
      throw error;
    }
  }

  // Get intervention sessions
  public async getInterventionSessions(filters: {
    userId?: string;
    status?: InterventionSession['status'];
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<InterventionSession[]> {
    try {
      const params = new URLSearchParams();
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`${this.baseUrl}/api/crisis/interventions?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get intervention sessions: ${response.status}`);
      }

      const result = await response.json();
      return result.sessions;
    } catch (error) {
      console.error('Failed to get intervention sessions:', error);
      throw error;
    }
  }

  // Get crisis metrics
  public async getCrisisMetrics(period: { start: Date; end: Date }): Promise<CrisisMetrics> {
    try {
      const response = await fetch(`${this.baseUrl}/api/crisis/metrics`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(period),
      });

      if (!response.ok) {
        throw new Error(`Failed to get crisis metrics: ${response.status}`);
      }

      const result = await response.json();
      return result.metrics;
    } catch (error) {
      console.error('Failed to get crisis metrics:', error);
      throw error;
    }
  }

  // Create audit trail entry
  public async createAuditTrail(data: Omit<AuditTrail, 'id' | 'timestamp'>): Promise<void> {
    try {
      const auditEntry: AuditTrail = {
        ...data,
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      };

      const response = await fetch(`${this.baseUrl}/api/crisis/audit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auditEntry),
      });

      if (!response.ok) {
        throw new Error(`Failed to create audit trail: ${response.status}`);
      }

      this.emit('audit_created', auditEntry);
    } catch (error) {
      console.error('Failed to create audit trail:', error);
      throw error;
    }
  }

  // Process event queue
  private startQueueProcessor(): void {
    setInterval(async () => {
      if (this.eventQueue.length > 0 && !this.processingQueue) {
        await this.processEventQueue();
      }
    }, 5000); // Process every 5 seconds
  }

  private async processEventQueue(): Promise<void> {
    if (this.processingQueue) return;

    this.processingQueue = true;

    try {
      const batch = this.eventQueue.splice(0, 50); // Process 50 events at a time

      if (batch.length > 0) {
        const response = await fetch(`${this.baseUrl}/api/crisis/events/batch`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ events: batch }),
        });

        if (!response.ok) {
          // Re-add failed events to queue
          this.eventQueue.unshift(...batch);
          throw new Error(`Failed to process event batch: ${response.status}`);
        }

        this.emit('events_processed', { count: batch.length });
      }
    } catch (error) {
      console.error('Failed to process event queue:', error);
    } finally {
      this.processingQueue = false;
    }
  }

  // Utility methods
  private shouldEncrypt(eventData: any): boolean {
    return eventData.severity === 'critical' || 
           eventData.severity === 'emergency' ||
           eventData.eventType === 'crisis_detected' ||
           eventData.eventType === 'panic_activated';
  }

  private shouldSanitize(eventData: any): boolean {
    return eventData.context?.triggerData?.triggers?.length > 0 ||
           eventData.notes?.length > 0;
  }

  private calculateRetentionDate(eventType: CrisisEvent['eventType']): Date {
    const days = this.retentionPolicies.get(eventType) || 1095; // Default 3 years
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() + days);
    return retentionDate;
  }

  private determineAccessLevel(eventData: any): CrisisEvent['metadata']['accessLevel'] {
    if (eventData.severity === 'emergency' || eventData.eventType === 'emergency_contacted') {
      return 'confidential';
    }
    if (eventData.severity === 'critical' || eventData.eventType === 'crisis_detected') {
      return 'restricted';
    }
    return 'internal';
  }

  private getComplianceFlags(eventData: any): string[] {
    const flags: string[] = ['HIPAA'];
    
    if (eventData.context?.location) {
      flags.push('LOCATION_DATA');
    }
    if (eventData.context?.deviceInfo) {
      flags.push('DEVICE_DATA');
    }
    if (eventData.severity === 'emergency') {
      flags.push('EMERGENCY_OVERRIDE');
    }
    
    return flags;
  }

  private sanitizeContext(context: any): any {
    const sanitized = { ...context };
    
    // Remove or hash sensitive data
    if (sanitized.deviceInfo?.ipAddress) {
      sanitized.deviceInfo.ipAddress = this.hashData(sanitized.deviceInfo.ipAddress);
    }
    
    if (sanitized.triggerData?.triggers) {
      sanitized.triggerData.triggers = sanitized.triggerData.triggers.map((trigger: string) => 
        this.sanitizeText(trigger)
      );
    }
    
    return sanitized;
  }

  private sanitizeText(text: string): string {
    // Remove or replace sensitive patterns
    return text
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]') // SSN
      .replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD]') // Credit card
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]') // Email
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]'); // Phone
  }

  private async encryptData(data: string): Promise<string> {
    // Implement encryption logic here
    // This is a placeholder - use proper encryption in production
    return Buffer.from(data).toString('base64');
  }

  private async encryptObject(obj: any): Promise<any> {
    // Implement object encryption logic here
    return obj;
  }

  private async decryptEvent(event: CrisisEvent): Promise<CrisisEvent> {
    // Implement decryption logic here
    return event;
  }

  private hashData(data: string): string {
    // Implement proper hashing here
    return Buffer.from(data).toString('base64').substring(0, 8);
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
    // Process remaining events
    if (this.eventQueue.length > 0) {
      this.processEventQueue();
    }
    
    // Clear listeners
    this.eventListeners.clear();
  }
}