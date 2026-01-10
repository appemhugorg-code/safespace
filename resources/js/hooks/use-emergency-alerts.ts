import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  EmergencyAlertService, 
  EmergencyAlert, 
  EmergencyContact, 
  EmergencyNotification,
  EscalationProtocol,
  AlertMetrics
} from '@/services/emergency-alert-service';

export interface UseEmergencyAlertsOptions {
  baseUrl?: string;
  authToken: string;
  userId: string;
  userRole: string;
  autoLoadAlerts?: boolean;
  enableRealTimeUpdates?: boolean;
}

export interface UseEmergencyAlertsReturn {
  // State
  activeAlerts: EmergencyAlert[];
  emergencyContacts: EmergencyContact[];
  alertMetrics: AlertMetrics | null;
  isLoading: boolean;
  error: string | null;

  // Alert management
  createAlert: (data: {
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
  }) => Promise<EmergencyAlert>;

  acknowledgeAlert: (alertId: string, notes?: string) => Promise<void>;
  resolveAlert: (alertId: string, resolution: string) => Promise<void>;
  escalateAlert: (alertId: string, reason: string) => Promise<void>;
  cancelAlert: (alertId: string, reason: string) => Promise<void>;

  // Contact management
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id' | 'metadata'>) => Promise<EmergencyContact>;
  updateEmergencyContact: (contactId: string, updates: Partial<EmergencyContact>) => Promise<EmergencyContact>;
  removeEmergencyContact: (contactId: string) => Promise<void>;
  testEmergencyContact: (contactId: string, method: string) => Promise<boolean>;

  // Data loading
  refreshAlerts: () => Promise<void>;
  refreshContacts: () => Promise<void>;
  refreshMetrics: () => Promise<void>;

  // Utilities
  getAlertsByStatus: (status: EmergencyAlert['status']) => EmergencyAlert[];
  getAlertsBySeverity: (severity: EmergencyAlert['severity']) => EmergencyAlert[];
  getCriticalAlerts: () => EmergencyAlert[];
  getAlertsRequiringAction: () => EmergencyAlert[];
  
  formatAlertAge: (alert: EmergencyAlert) => string;
  getAlertStatusColor: (status: EmergencyAlert['status']) => string;
  getSeverityColor: (severity: EmergencyAlert['severity']) => string;
  getContactAvailability: (contact: EmergencyContact) => 'available' | 'unavailable' | 'emergency_only';

  // Events
  onAlertCreated: (callback: (alert: EmergencyAlert) => void) => () => void;
  onAlertAcknowledged: (callback: (data: { alertId: string; acknowledgedBy: string }) => void) => () => void;
  onAlertResolved: (callback: (data: { alertId: string; resolvedBy: string }) => void) => () => void;
  onAlertEscalated: (callback: (data: { alertId: string; escalatedBy: string }) => void) => () => void;
  onNotificationSent: (callback: (notification: EmergencyNotification) => void) => () => void;
  onEscalationExhausted: (callback: (alert: EmergencyAlert) => void) => () => void;
}

export function useEmergencyAlerts(options: UseEmergencyAlertsOptions): UseEmergencyAlertsReturn {
  const {
    baseUrl = '/api',
    authToken,
    userId,
    userRole,
    autoLoadAlerts = true,
    enableRealTimeUpdates = true,
  } = options;

  // State
  const [activeAlerts, setActiveAlerts] = useState<EmergencyAlert[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [alertMetrics, setAlertMetrics] = useState<AlertMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const serviceRef = useRef<EmergencyAlertService | null>(null);
  const eventUnsubscribersRef = useRef<(() => void)[]>([]);

  // Initialize service
  useEffect(() => {
    const service = new EmergencyAlertService({
      baseUrl,
      authToken,
    });

    serviceRef.current = service;
    setupEventListeners(service);

    if (autoLoadAlerts) {
      loadInitialData();
    }

    return () => {
      cleanup();
    };
  }, [baseUrl, authToken, autoLoadAlerts]);

  // Setup event listeners
  const setupEventListeners = useCallback((service: EmergencyAlertService) => {
    const unsubscribers: (() => void)[] = [];

    unsubscribers.push(
      service.on('alert_created', (alert: EmergencyAlert) => {
        setActiveAlerts(prev => [alert, ...prev]);
      })
    );

    unsubscribers.push(
      service.on('alert_acknowledged', (data: { alertId: string; acknowledgedBy: string }) => {
        setActiveAlerts(prev => prev.map(alert => 
          alert.id === data.alertId 
            ? { ...alert, status: 'acknowledged' }
            : alert
        ));
      })
    );

    unsubscribers.push(
      service.on('alert_resolved', (data: { alertId: string; resolvedBy: string }) => {
        setActiveAlerts(prev => prev.filter(alert => alert.id !== data.alertId));
      })
    );

    unsubscribers.push(
      service.on('alert_escalated', (data: { alertId: string; escalatedBy: string }) => {
        setActiveAlerts(prev => prev.map(alert => 
          alert.id === data.alertId 
            ? { ...alert, status: 'escalated' }
            : alert
        ));
      })
    );

    unsubscribers.push(
      service.on('notification_sent', (notification: EmergencyNotification) => {
        // Update alert with notification status
        setActiveAlerts(prev => prev.map(alert => {
          if (alert.id === notification.alertId) {
            const updatedNotifications = alert.notifications.map(n => 
              n.id === notification.id ? notification : n
            );
            return { ...alert, notifications: updatedNotifications };
          }
          return alert;
        }));
      })
    );

    unsubscribers.push(
      service.on('escalation_exhausted', (alert: EmergencyAlert) => {
        setActiveAlerts(prev => prev.map(a => 
          a.id === alert.id ? alert : a
        ));
        
        // Show critical notification to user
        if (typeof window !== 'undefined' && 'Notification' in window) {
          new Notification('🚨 Emergency Escalation Exhausted', {
            body: `Alert ${alert.id} has exhausted all escalation levels. Emergency services have been notified.`,
            icon: '/emergency-icon.png',
            requireInteraction: true,
          });
        }
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

    setIsLoading(true);
    setError(null);

    try {
      const [alerts, contacts, metrics] = await Promise.all([
        serviceRef.current.getActiveAlerts(),
        serviceRef.current.getEmergencyContacts(userId),
        serviceRef.current.getAlertMetrics('week'),
      ]);

      setActiveAlerts(alerts);
      setEmergencyContacts(contacts);
      setAlertMetrics(metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load emergency data');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Create alert
  const createAlert = useCallback(async (data: {
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
  }): Promise<EmergencyAlert> => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    setError(null);

    try {
      const alert = await serviceRef.current.createAlert(data);
      return alert;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create alert';
      setError(error);
      throw err;
    }
  }, []);

  // Acknowledge alert
  const acknowledgeAlert = useCallback(async (alertId: string, notes?: string) => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    try {
      await serviceRef.current.acknowledgeAlert(alertId, userId, notes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to acknowledge alert');
      throw err;
    }
  }, [userId]);

  // Resolve alert
  const resolveAlert = useCallback(async (alertId: string, resolution: string) => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    try {
      await serviceRef.current.resolveAlert(alertId, userId, resolution);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve alert');
      throw err;
    }
  }, [userId]);

  // Escalate alert
  const escalateAlert = useCallback(async (alertId: string, reason: string) => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    try {
      await serviceRef.current.escalateAlert(alertId, userId, reason);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to escalate alert');
      throw err;
    }
  }, [userId]);

  // Cancel alert
  const cancelAlert = useCallback(async (alertId: string, reason: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/emergency/alerts/${alertId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason, cancelledBy: userId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel alert: ${response.status}`);
      }

      setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel alert');
      throw err;
    }
  }, [baseUrl, authToken, userId]);

  // Add emergency contact
  const addEmergencyContact = useCallback(async (contact: Omit<EmergencyContact, 'id' | 'metadata'>): Promise<EmergencyContact> => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    try {
      const newContact = await serviceRef.current.addEmergencyContact(contact);
      setEmergencyContacts(prev => [...prev, newContact]);
      return newContact;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add emergency contact');
      throw err;
    }
  }, []);

  // Update emergency contact
  const updateEmergencyContact = useCallback(async (contactId: string, updates: Partial<EmergencyContact>): Promise<EmergencyContact> => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    try {
      const updatedContact = await serviceRef.current.updateEmergencyContact(contactId, updates);
      setEmergencyContacts(prev => prev.map(contact => 
        contact.id === contactId ? updatedContact : contact
      ));
      return updatedContact;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update emergency contact');
      throw err;
    }
  }, []);

  // Remove emergency contact
  const removeEmergencyContact = useCallback(async (contactId: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/emergency/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to remove contact: ${response.status}`);
      }

      setEmergencyContacts(prev => prev.filter(contact => contact.id !== contactId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove emergency contact');
      throw err;
    }
  }, [baseUrl, authToken]);

  // Test emergency contact
  const testEmergencyContact = useCallback(async (contactId: string, method: string): Promise<boolean> => {
    try {
      const response = await fetch(`${baseUrl}/api/emergency/contacts/${contactId}/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method }),
      });

      return response.ok;
    } catch (err) {
      console.error('Failed to test emergency contact:', err);
      return false;
    }
  }, [baseUrl, authToken]);

  // Refresh data
  const refreshAlerts = useCallback(async () => {
    if (!serviceRef.current) return;

    try {
      const alerts = await serviceRef.current.getActiveAlerts();
      setActiveAlerts(alerts);
    } catch (err) {
      console.error('Failed to refresh alerts:', err);
    }
  }, []);

  const refreshContacts = useCallback(async () => {
    if (!serviceRef.current) return;

    try {
      const contacts = await serviceRef.current.getEmergencyContacts(userId);
      setEmergencyContacts(contacts);
    } catch (err) {
      console.error('Failed to refresh contacts:', err);
    }
  }, [userId]);

  const refreshMetrics = useCallback(async () => {
    if (!serviceRef.current) return;

    try {
      const metrics = await serviceRef.current.getAlertMetrics('week');
      setAlertMetrics(metrics);
    } catch (err) {
      console.error('Failed to refresh metrics:', err);
    }
  }, []);

  // Utility functions
  const getAlertsByStatus = useCallback((status: EmergencyAlert['status']) => {
    return activeAlerts.filter(alert => alert.status === status);
  }, [activeAlerts]);

  const getAlertsBySeverity = useCallback((severity: EmergencyAlert['severity']) => {
    return activeAlerts.filter(alert => alert.severity === severity);
  }, [activeAlerts]);

  const getCriticalAlerts = useCallback(() => {
    return activeAlerts.filter(alert => 
      alert.severity === 'critical' || alert.severity === 'emergency'
    );
  }, [activeAlerts]);

  const getAlertsRequiringAction = useCallback(() => {
    return activeAlerts.filter(alert => 
      alert.status === 'pending' || alert.status === 'acknowledged'
    );
  }, [activeAlerts]);

  const formatAlertAge = useCallback((alert: EmergencyAlert): string => {
    const now = new Date();
    const created = new Date(alert.createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }, []);

  const getAlertStatusColor = useCallback((status: EmergencyAlert['status']): string => {
    switch (status) {
      case 'pending': return 'text-red-600';
      case 'acknowledged': return 'text-yellow-600';
      case 'in_progress': return 'text-blue-600';
      case 'escalated': return 'text-purple-600';
      case 'resolved': return 'text-green-600';
      case 'cancelled': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  }, []);

  const getSeverityColor = useCallback((severity: EmergencyAlert['severity']): string => {
    switch (severity) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      case 'emergency': return 'text-red-800';
      default: return 'text-gray-600';
    }
  }, []);

  const getContactAvailability = useCallback((contact: EmergencyContact): 'available' | 'unavailable' | 'emergency_only' => {
    if (contact.availability.alwaysAvailable) return 'available';
    if (contact.availability.emergencyOnly) return 'emergency_only';

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const todaySchedule = contact.availability.schedule.find(s => s.dayOfWeek === currentDay);
    if (!todaySchedule) return 'unavailable';

    if (currentTime >= todaySchedule.startTime && currentTime <= todaySchedule.endTime) {
      return 'available';
    }

    return 'unavailable';
  }, []);

  // Event handlers
  const onAlertCreated = useCallback((callback: (alert: EmergencyAlert) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('alert_created', callback);
  }, []);

  const onAlertAcknowledged = useCallback((callback: (data: { alertId: string; acknowledgedBy: string }) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('alert_acknowledged', callback);
  }, []);

  const onAlertResolved = useCallback((callback: (data: { alertId: string; resolvedBy: string }) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('alert_resolved', callback);
  }, []);

  const onAlertEscalated = useCallback((callback: (data: { alertId: string; escalatedBy: string }) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('alert_escalated', callback);
  }, []);

  const onNotificationSent = useCallback((callback: (notification: EmergencyNotification) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('notification_sent', callback);
  }, []);

  const onEscalationExhausted = useCallback((callback: (alert: EmergencyAlert) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('escalation_exhausted', callback);
  }, []);

  return {
    // State
    activeAlerts,
    emergencyContacts,
    alertMetrics,
    isLoading,
    error,

    // Alert management
    createAlert,
    acknowledgeAlert,
    resolveAlert,
    escalateAlert,
    cancelAlert,

    // Contact management
    addEmergencyContact,
    updateEmergencyContact,
    removeEmergencyContact,
    testEmergencyContact,

    // Data loading
    refreshAlerts,
    refreshContacts,
    refreshMetrics,

    // Utilities
    getAlertsByStatus,
    getAlertsBySeverity,
    getCriticalAlerts,
    getAlertsRequiringAction,
    formatAlertAge,
    getAlertStatusColor,
    getSeverityColor,
    getContactAvailability,

    // Events
    onAlertCreated,
    onAlertAcknowledged,
    onAlertResolved,
    onAlertEscalated,
    onNotificationSent,
    onEscalationExhausted,
  };
}