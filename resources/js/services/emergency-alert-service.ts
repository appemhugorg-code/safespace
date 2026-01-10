export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relationship: 'therapist' | 'guardian' | 'emergency_contact' | 'crisis_team' | 'family' | 'friend' | 'professional';
  contactMethods: Array<{
    type: 'phone' | 'sms' | 'email' | 'push' | 'in_app';
    value: string;
    priority: number; // 1-5, 1 being highest
    verified: boolean;
    active: boolean;
  }>;
  availability: {
    timezone: string;
    schedule: Array<{
      dayOfWeek: number; // 0-6
      startTime: string; // HH:MM
      endTime: string; // HH:MM
    }>;
    emergencyOnly: boolean;
    alwaysAvailable: boolean;
  };
  escalationLevel: 'primary' | 'secondary' | 'emergency' | 'crisis';
  permissions: {
    canReceiveAlerts: boolean;
    canAcknowledgeAlerts: boolean;
    canEscalateAlerts: boolean;
    canAccessUserData: boolean;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastContactedAt?: Date;
    responseRate: number; // 0-1
    averageResponseTime: number; // minutes
  };
}

export interface EmergencyAlert {
  id: string;
  userId: string;
  conversationId?: string;
  messageId?: string;
  detectionId?: string;
  alertType: 'crisis_detected' | 'panic_button' | 'manual_escalation' | 'system_alert' | 'follow_up_required';
  severity: 'low' | 'medium' | 'high' | 'critical' | 'emergency';
  status: 'pending' | 'acknowledged' | 'in_progress' | 'escalated' | 'resolved' | 'cancelled';
  title: string;
  description: string;
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
    };
    userState?: {
      lastSeen: Date;
      activityLevel: 'low' | 'normal' | 'high';
      recentBehavior: string[];
    };
    triggerData?: {
      confidence: number;
      categories: string[];
      triggers: string[];
    };
  };
  escalationPath: Array<{
    level: number;
    contactIds: string[];
    timeoutMinutes: number;
    methods: string[];
    completed: boolean;
    startedAt?: Date;
    completedAt?: Date;
  }>;
  notifications: EmergencyNotification[];
  actions: Array<{
    id: string;
    type: 'notification_sent' | 'acknowledgment' | 'escalation' | 'intervention' | 'resolution' | 'cancellation';
    performedBy: string;
    performedAt: Date;
    details: string;
    metadata?: Record<string, any>;
  }>;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
}

export interface EmergencyNotification {
  id: string;
  alertId: string;
  contactId: string;
  method: 'phone' | 'sms' | 'email' | 'push' | 'in_app';
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'acknowledged' | 'failed';
  content: {
    subject: string;
    message: string;
    urgencyLevel: 'normal' | 'high' | 'critical';
    callToAction?: string;
  };
  sentAt?: Date;
  deliveredAt?: Date;
  acknowledgedAt?: Date;
  failedAt?: Date;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
}

export interface EscalationProtocol {
  id: string;
  name: string;
  description: string;
  triggerConditions: {
    severity: EmergencyAlert['severity'][];
    alertTypes: EmergencyAlert['alertType'][];
    userRoles: string[];
    timeOfDay?: {
      start: string;
      end: string;
    };
    contextFactors?: {
      hasLocation: boolean;
      userHistory: boolean;
      repeatAlert: boolean;
    };
  };
  escalationLevels: Array<{
    level: number;
    name: string;
    description: string;
    timeoutMinutes: number;
    contactTypes: EmergencyContact['relationship'][];
    notificationMethods: string[];
    requiresAcknowledgment: boolean;
    autoEscalate: boolean;
  }>;
  emergencyServices: {
    enabled: boolean;
    threshold: EmergencyAlert['severity'];
    contactInfo: {
      phone: string;
      description: string;
    };
  };
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertMetrics {
  totalAlerts: number;
  alertsByType: Record<EmergencyAlert['alertType'], number>;
  alertsBySeverity: Record<EmergencyAlert['severity'], number>;
  averageResponseTime: number;
  acknowledgmentRate: number;
  escalationRate: number;
  resolutionRate: number;
  falseAlarmRate: number;
  contactEffectiveness: Record<string, {
    responseRate: number;
    averageResponseTime: number;
    successfulInterventions: number;
  }>;
}

export class EmergencyAlertService {
  private baseUrl: string;
  private authToken: string;
  private eventListeners: Map<string, Function[]> = new Map();
  private activeAlerts: Map<string, EmergencyAlert> = new Map();
  private escalationTimers: Map<string, NodeJS.Timeout> = new Map();
  private notificationQueue: EmergencyNotification[] = [];
  private processingNotifications = false;

  constructor(config: {
    baseUrl: string;
    authToken: string;
  }) {
    this.baseUrl = config.baseUrl;
    this.authToken = config.authToken;

    this.startNotificationProcessor();
  }

  // Create emergency alert
  public async createAlert(data: {
    userId: string;
    conversationId?: string;
    messageId?: string;
    detectionId?: string;
    alertType: EmergencyAlert['alertType'];
    severity: EmergencyAlert['severity'];
    title: string;
    description: string;
    context?: EmergencyAlert['context'];
    immediateEscalation?: boolean;
  }): Promise<EmergencyAlert> {
    try {
      const response = await fetch(`${this.baseUrl}/api/emergency/alerts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create alert: ${response.status}`);
      }

      const result = await response.json();
      const alert: EmergencyAlert = result.alert;

      // Store alert locally
      this.activeAlerts.set(alert.id, alert);

      // Start escalation process
      if (data.immediateEscalation || alert.severity === 'critical' || alert.severity === 'emergency') {
        await this.startEscalationProcess(alert);
      }

      this.emit('alert_created', alert);
      return alert;
    } catch (error) {
      console.error('Failed to create emergency alert:', error);
      throw error;
    }
  }

  // Start escalation process
  private async startEscalationProcess(alert: EmergencyAlert): Promise<void> {
    try {
      // Get escalation protocol
      const protocol = await this.getEscalationProtocol(alert);
      
      if (!protocol) {
        console.warn(`No escalation protocol found for alert ${alert.id}`);
        return;
      }

      // Update alert with escalation path
      alert.escalationPath = protocol.escalationLevels.map((level, index) => ({
        level: index + 1,
        contactIds: [], // Will be populated when contacts are resolved
        timeoutMinutes: level.timeoutMinutes,
        methods: level.notificationMethods,
        completed: false,
      }));

      // Start first escalation level
      await this.executeEscalationLevel(alert, 0);

    } catch (error) {
      console.error('Failed to start escalation process:', error);
      this.emit('escalation_error', { alertId: alert.id, error });
    }
  }

  // Execute specific escalation level
  private async executeEscalationLevel(alert: EmergencyAlert, levelIndex: number): Promise<void> {
    if (levelIndex >= alert.escalationPath.length) {
      // All escalation levels exhausted
      await this.handleEscalationExhausted(alert);
      return;
    }

    const escalationLevel = alert.escalationPath[levelIndex];
    escalationLevel.startedAt = new Date();

    try {
      // Get contacts for this escalation level
      const contacts = await this.getContactsForEscalation(alert, levelIndex);
      escalationLevel.contactIds = contacts.map(c => c.id);

      // Send notifications to all contacts
      const notifications = await this.sendEscalationNotifications(alert, contacts, escalationLevel);

      // Set timeout for next escalation level
      const timeoutMs = escalationLevel.timeoutMinutes * 60 * 1000;
      const timer = setTimeout(async () => {
        if (!escalationLevel.completed && alert.status !== 'resolved') {
          await this.executeEscalationLevel(alert, levelIndex + 1);
        }
      }, timeoutMs);

      this.escalationTimers.set(`${alert.id}_${levelIndex}`, timer);

      this.emit('escalation_level_started', {
        alertId: alert.id,
        level: levelIndex + 1,
        contacts: contacts.length,
        notifications: notifications.length,
      });

    } catch (error) {
      console.error(`Failed to execute escalation level ${levelIndex}:`, error);
      // Continue to next level on error
      setTimeout(() => this.executeEscalationLevel(alert, levelIndex + 1), 5000);
    }
  }

  // Get escalation protocol for alert
  private async getEscalationProtocol(alert: EmergencyAlert): Promise<EscalationProtocol | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/emergency/protocols/match`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          severity: alert.severity,
          alertType: alert.alertType,
          context: alert.context,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get escalation protocol: ${response.status}`);
      }

      const result = await response.json();
      return result.protocol;
    } catch (error) {
      console.error('Failed to get escalation protocol:', error);
      return null;
    }
  }

  // Get contacts for escalation level
  private async getContactsForEscalation(alert: EmergencyAlert, levelIndex: number): Promise<EmergencyContact[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/emergency/contacts/escalation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: alert.userId,
          escalationLevel: levelIndex + 1,
          severity: alert.severity,
          alertType: alert.alertType,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get escalation contacts: ${response.status}`);
      }

      const result = await response.json();
      return result.contacts;
    } catch (error) {
      console.error('Failed to get escalation contacts:', error);
      return [];
    }
  }

  // Send escalation notifications
  private async sendEscalationNotifications(
    alert: EmergencyAlert,
    contacts: EmergencyContact[],
    escalationLevel: any
  ): Promise<EmergencyNotification[]> {
    const notifications: EmergencyNotification[] = [];

    for (const contact of contacts) {
      for (const contactMethod of contact.contactMethods) {
        if (!contactMethod.active || !escalationLevel.methods.includes(contactMethod.type)) {
          continue;
        }

        const notification: EmergencyNotification = {
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          alertId: alert.id,
          contactId: contact.id,
          method: contactMethod.type,
          status: 'pending',
          content: this.generateNotificationContent(alert, contact, contactMethod.type),
          retryCount: 0,
          maxRetries: 3,
        };

        notifications.push(notification);
        this.notificationQueue.push(notification);
      }
    }

    // Update alert with notifications
    alert.notifications.push(...notifications);

    return notifications;
  }

  // Generate notification content
  private generateNotificationContent(
    alert: EmergencyAlert,
    contact: EmergencyContact,
    method: string
  ): EmergencyNotification['content'] {
    const urgencyLevel = alert.severity === 'critical' || alert.severity === 'emergency' ? 'critical' : 'high';
    
    let subject: string;
    let message: string;
    let callToAction: string;

    switch (alert.alertType) {
      case 'crisis_detected':
        subject = `🚨 CRISIS ALERT - Immediate Attention Required`;
        message = `Crisis detected for user. ${alert.description}. Location: ${
          alert.context?.location?.address || 'Unknown'
        }. Please respond immediately.`;
        callToAction = 'Acknowledge and take immediate action';
        break;

      case 'panic_button':
        subject = `🆘 PANIC BUTTON ACTIVATED`;
        message = `User has activated panic button. ${alert.description}. Immediate intervention required.`;
        callToAction = 'Contact user immediately';
        break;

      case 'manual_escalation':
        subject = `⚠️ Manual Escalation Required`;
        message = `Manual escalation requested. ${alert.description}. Please review and take appropriate action.`;
        callToAction = 'Review and respond';
        break;

      default:
        subject = `🔔 Emergency Alert`;
        message = alert.description;
        callToAction = 'Please respond';
    }

    // Customize for method
    if (method === 'sms') {
      message = `${subject}\n${message}\n${callToAction}`;
      subject = 'Emergency Alert';
    } else if (method === 'phone') {
      message = `This is an automated emergency alert. ${message}`;
    }

    return {
      subject,
      message,
      urgencyLevel,
      callToAction,
    };
  }

  // Process notification queue
  private startNotificationProcessor(): void {
    setInterval(async () => {
      if (this.notificationQueue.length > 0 && !this.processingNotifications) {
        await this.processNotificationQueue();
      }
    }, 1000); // Process every second
  }

  private async processNotificationQueue(): Promise<void> {
    if (this.processingNotifications) return;

    this.processingNotifications = true;

    try {
      const batch = this.notificationQueue.splice(0, 10); // Process 10 at a time

      await Promise.all(
        batch.map(notification => this.sendNotification(notification))
      );
    } catch (error) {
      console.error('Failed to process notification queue:', error);
    } finally {
      this.processingNotifications = false;
    }
  }

  // Send individual notification
  private async sendNotification(notification: EmergencyNotification): Promise<void> {
    try {
      notification.status = 'sent';
      notification.sentAt = new Date();

      const response = await fetch(`${this.baseUrl}/api/emergency/notifications/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      if (response.ok) {
        notification.status = 'delivered';
        notification.deliveredAt = new Date();
        this.emit('notification_sent', notification);
      } else {
        throw new Error(`Notification failed: ${response.status}`);
      }
    } catch (error) {
      notification.status = 'failed';
      notification.failedAt = new Date();
      notification.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Retry if under max retries
      if (notification.retryCount < notification.maxRetries) {
        notification.retryCount++;
        notification.status = 'pending';
        
        // Add back to queue with delay
        setTimeout(() => {
          this.notificationQueue.push(notification);
        }, Math.pow(2, notification.retryCount) * 1000); // Exponential backoff
      }

      this.emit('notification_failed', notification);
    }
  }

  // Acknowledge alert
  public async acknowledgeAlert(alertId: string, acknowledgedBy: string, notes?: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/emergency/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acknowledgedBy,
          notes,
          acknowledgedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to acknowledge alert: ${response.status}`);
      }

      const alert = this.activeAlerts.get(alertId);
      if (alert) {
        alert.status = 'acknowledged';
        
        // Stop current escalation level
        this.stopEscalationLevel(alertId, alert.escalationPath.findIndex(level => !level.completed));
        
        // Add action
        alert.actions.push({
          id: `action_${Date.now()}`,
          type: 'acknowledgment',
          performedBy: acknowledgedBy,
          performedAt: new Date(),
          details: notes || 'Alert acknowledged',
        });
      }

      this.emit('alert_acknowledged', { alertId, acknowledgedBy, notes });
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
      throw error;
    }
  }

  // Resolve alert
  public async resolveAlert(alertId: string, resolvedBy: string, resolution: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/emergency/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resolvedBy,
          resolution,
          resolvedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to resolve alert: ${response.status}`);
      }

      const alert = this.activeAlerts.get(alertId);
      if (alert) {
        alert.status = 'resolved';
        alert.resolvedAt = new Date();
        alert.resolvedBy = resolvedBy;
        alert.resolution = resolution;

        // Stop all escalation timers
        this.stopAllEscalationTimers(alertId);

        // Add action
        alert.actions.push({
          id: `action_${Date.now()}`,
          type: 'resolution',
          performedBy: resolvedBy,
          performedAt: new Date(),
          details: resolution,
        });

        // Remove from active alerts
        this.activeAlerts.delete(alertId);
      }

      this.emit('alert_resolved', { alertId, resolvedBy, resolution });
    } catch (error) {
      console.error('Failed to resolve alert:', error);
      throw error;
    }
  }

  // Escalate alert manually
  public async escalateAlert(alertId: string, escalatedBy: string, reason: string): Promise<void> {
    try {
      const alert = this.activeAlerts.get(alertId);
      if (!alert) {
        throw new Error('Alert not found');
      }

      // Move to next escalation level immediately
      const currentLevelIndex = alert.escalationPath.findIndex(level => !level.completed);
      if (currentLevelIndex >= 0) {
        // Mark current level as completed
        alert.escalationPath[currentLevelIndex].completed = true;
        alert.escalationPath[currentLevelIndex].completedAt = new Date();

        // Stop current timer
        this.stopEscalationLevel(alertId, currentLevelIndex);

        // Start next level
        await this.executeEscalationLevel(alert, currentLevelIndex + 1);
      }

      // Add action
      alert.actions.push({
        id: `action_${Date.now()}`,
        type: 'escalation',
        performedBy: escalatedBy,
        performedAt: new Date(),
        details: reason,
      });

      this.emit('alert_escalated', { alertId, escalatedBy, reason });
    } catch (error) {
      console.error('Failed to escalate alert:', error);
      throw error;
    }
  }

  // Stop escalation level
  private stopEscalationLevel(alertId: string, levelIndex: number): void {
    const timerKey = `${alertId}_${levelIndex}`;
    const timer = this.escalationTimers.get(timerKey);
    if (timer) {
      clearTimeout(timer);
      this.escalationTimers.delete(timerKey);
    }
  }

  // Stop all escalation timers for alert
  private stopAllEscalationTimers(alertId: string): void {
    for (const [key, timer] of this.escalationTimers.entries()) {
      if (key.startsWith(alertId)) {
        clearTimeout(timer);
        this.escalationTimers.delete(key);
      }
    }
  }

  // Handle escalation exhausted
  private async handleEscalationExhausted(alert: EmergencyAlert): Promise<void> {
    try {
      // Log escalation exhaustion
      console.warn(`Escalation exhausted for alert ${alert.id}`);

      // Notify emergency services if configured
      await this.notifyEmergencyServices(alert);

      // Update alert status
      alert.status = 'escalated';
      alert.actions.push({
        id: `action_${Date.now()}`,
        type: 'escalation',
        performedBy: 'system',
        performedAt: new Date(),
        details: 'All escalation levels exhausted - emergency services notified',
      });

      this.emit('escalation_exhausted', alert);
    } catch (error) {
      console.error('Failed to handle escalation exhaustion:', error);
    }
  }

  // Notify emergency services
  private async notifyEmergencyServices(alert: EmergencyAlert): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/emergency/services/notify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alertId: alert.id,
          severity: alert.severity,
          location: alert.context?.location,
          description: alert.description,
        }),
      });

      if (response.ok) {
        this.emit('emergency_services_notified', alert);
      }
    } catch (error) {
      console.error('Failed to notify emergency services:', error);
    }
  }

  // Get active alerts
  public async getActiveAlerts(filters?: {
    userId?: string;
    severity?: EmergencyAlert['severity'];
    status?: EmergencyAlert['status'];
  }): Promise<EmergencyAlert[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.userId) params.append('userId', filters.userId);
      if (filters?.severity) params.append('severity', filters.severity);
      if (filters?.status) params.append('status', filters.status);

      const response = await fetch(`${this.baseUrl}/api/emergency/alerts?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get active alerts: ${response.status}`);
      }

      const result = await response.json();
      return result.alerts;
    } catch (error) {
      console.error('Failed to get active alerts:', error);
      throw error;
    }
  }

  // Get alert metrics
  public async getAlertMetrics(period?: 'day' | 'week' | 'month'): Promise<AlertMetrics> {
    try {
      const params = new URLSearchParams();
      if (period) params.append('period', period);

      const response = await fetch(`${this.baseUrl}/api/emergency/metrics?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get alert metrics: ${response.status}`);
      }

      const result = await response.json();
      return result.metrics;
    } catch (error) {
      console.error('Failed to get alert metrics:', error);
      throw error;
    }
  }

  // Manage emergency contacts
  public async addEmergencyContact(contact: Omit<EmergencyContact, 'id' | 'metadata'>): Promise<EmergencyContact> {
    try {
      const response = await fetch(`${this.baseUrl}/api/emergency/contacts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });

      if (!response.ok) {
        throw new Error(`Failed to add emergency contact: ${response.status}`);
      }

      const result = await response.json();
      return result.contact;
    } catch (error) {
      console.error('Failed to add emergency contact:', error);
      throw error;
    }
  }

  public async updateEmergencyContact(contactId: string, updates: Partial<EmergencyContact>): Promise<EmergencyContact> {
    try {
      const response = await fetch(`${this.baseUrl}/api/emergency/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update emergency contact: ${response.status}`);
      }

      const result = await response.json();
      return result.contact;
    } catch (error) {
      console.error('Failed to update emergency contact:', error);
      throw error;
    }
  }

  public async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/emergency/contacts?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get emergency contacts: ${response.status}`);
      }

      const result = await response.json();
      return result.contacts;
    } catch (error) {
      console.error('Failed to get emergency contacts:', error);
      throw error;
    }
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
    // Stop all timers
    this.escalationTimers.forEach(timer => clearTimeout(timer));
    this.escalationTimers.clear();
    
    // Clear queues and listeners
    this.notificationQueue = [];
    this.activeAlerts.clear();
    this.eventListeners.clear();
    this.processingNotifications = false;
  }
}