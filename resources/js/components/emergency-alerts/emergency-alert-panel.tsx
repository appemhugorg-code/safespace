import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Phone, 
  MessageSquare, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowUp,
  MapPin,
  User,
  Shield,
  AlertCircle
} from 'lucide-react';
import { EmergencyAlert, EmergencyContact } from '@/services/emergency-alert-service';
import { useEmergencyAlerts } from '@/hooks/use-emergency-alerts';

interface EmergencyAlertPanelProps {
  userId: string;
  userRole: string;
  authToken: string;
  onAlertAction?: (alertId: string, action: string) => void;
}

export function EmergencyAlertPanel({ 
  userId, 
  userRole, 
  authToken, 
  onAlertAction 
}: EmergencyAlertPanelProps) {
  const {
    activeAlerts,
    emergencyContacts,
    isLoading,
    error,
    acknowledgeAlert,
    resolveAlert,
    escalateAlert,
    cancelAlert,
    formatAlertAge,
    getAlertStatusColor,
    getSeverityColor,
    getCriticalAlerts,
    getAlertsRequiringAction,
    refreshAlerts,
  } = useEmergencyAlerts({
    authToken,
    userId,
    userRole,
    autoLoadAlerts: true,
    enableRealTimeUpdates: true,
  });

  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showResolutionForm, setShowResolutionForm] = useState(false);
  const [resolutionText, setResolutionText] = useState('');

  const criticalAlerts = getCriticalAlerts();
  const alertsRequiringAction = getAlertsRequiringAction();

  const handleAcknowledge = async (alertId: string) => {
    setActionLoading(alertId);
    try {
      await acknowledgeAlert(alertId, 'Alert acknowledged by user');
      onAlertAction?.(alertId, 'acknowledged');
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResolve = async (alertId: string) => {
    if (!resolutionText.trim()) return;
    
    setActionLoading(alertId);
    try {
      await resolveAlert(alertId, resolutionText);
      setShowResolutionForm(false);
      setResolutionText('');
      setSelectedAlert(null);
      onAlertAction?.(alertId, 'resolved');
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEscalate = async (alertId: string, reason: string) => {
    setActionLoading(alertId);
    try {
      await escalateAlert(alertId, reason);
      onAlertAction?.(alertId, 'escalated');
    } catch (err) {
      console.error('Failed to escalate alert:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getSeverityIcon = (severity: EmergencyAlert['severity']) => {
    switch (severity) {
      case 'emergency':
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'high':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertTypeIcon = (type: EmergencyAlert['alertType']) => {
    switch (type) {
      case 'panic_button':
        return <AlertTriangle className="w-4 h-4" />;
      case 'crisis_detected':
        return <Shield className="w-4 h-4" />;
      case 'manual_escalation':
        return <ArrowUp className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Emergency Alerts</h2>
            <p className="text-sm text-gray-600 mt-1">
              Monitor and respond to crisis situations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {criticalAlerts.length > 0 && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">
                  {criticalAlerts.length} Critical
                </span>
              </div>
            )}
            <button
              onClick={refreshAlerts}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <div className="flex">
            <XCircle className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Alert List */}
      <div className="divide-y divide-gray-200">
        <AnimatePresence>
          {activeAlerts.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h3>
              <p className="text-gray-600">All emergency situations are currently resolved.</p>
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedAlert?.id === alert.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => setSelectedAlert(alert)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Severity Icon */}
                    <div className="flex-shrink-0">
                      {getSeverityIcon(alert.severity)}
                    </div>

                    {/* Alert Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {alert.title}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {getAlertTypeIcon(alert.alertType)}
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {alert.alertType.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{alert.description}</p>

                      {/* Alert Metadata */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatAlertAge(alert)}</span>
                        </div>
                        
                        {alert.context?.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{alert.context.location.address || 'Location available'}</span>
                          </div>
                        )}

                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>User ID: {alert.userId}</span>
                        </div>
                      </div>

                      {/* Escalation Status */}
                      {alert.escalationPath.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-500">Escalation:</span>
                            {alert.escalationPath.map((level, index) => (
                              <div
                                key={index}
                                className={`w-3 h-3 rounded-full ${
                                  level.completed 
                                    ? 'bg-green-500' 
                                    : level.startedAt 
                                    ? 'bg-yellow-500' 
                                    : 'bg-gray-300'
                                }`}
                                title={`Level ${level.level}: ${
                                  level.completed ? 'Completed' : level.startedAt ? 'In Progress' : 'Pending'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center space-x-3 ml-4">
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        alert.status === 'pending' ? 'bg-red-100 text-red-800' :
                        alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                        alert.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        alert.status === 'escalated' ? 'bg-purple-100 text-purple-800' :
                        alert.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {alert.status.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className={`text-xs font-medium mt-1 ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    {(userRole === 'therapist' || userRole === 'admin' || userRole === 'crisis_team') && (
                      <div className="flex flex-col space-y-2">
                        {alert.status === 'pending' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcknowledge(alert.id);
                            }}
                            disabled={actionLoading === alert.id}
                            className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {actionLoading === alert.id ? 'Loading...' : 'Acknowledge'}
                          </button>
                        )}
                        
                        {(alert.status === 'acknowledged' || alert.status === 'in_progress') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAlert(alert);
                              setShowResolutionForm(true);
                            }}
                            className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            Resolve
                          </button>
                        )}

                        {alert.status !== 'resolved' && alert.status !== 'cancelled' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEscalate(alert.id, 'Manual escalation requested');
                            }}
                            disabled={actionLoading === alert.id}
                            className="px-3 py-1 text-xs font-medium text-white bg-orange-600 rounded hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                          >
                            Escalate
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Resolution Form Modal */}
      <AnimatePresence>
        {showResolutionForm && selectedAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowResolutionForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Resolve Alert
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Please provide details about how this alert was resolved.
                </p>
                <textarea
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  placeholder="Describe the resolution actions taken..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setShowResolutionForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleResolve(selectedAlert.id)}
                    disabled={!resolutionText.trim() || actionLoading === selectedAlert.id}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {actionLoading === selectedAlert.id ? 'Resolving...' : 'Resolve Alert'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}