import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  MessageSquare,
  Phone,
  Users,
  FileText,
  AlertCircle,
  Zap,
  Heart,
  Brain
} from 'lucide-react';
import { CrisisDetectionResult, CrisisAlert } from '@/services/crisis-detection-service';
import { useCrisisDetection } from '@/hooks/use-crisis-detection';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface CrisisAlertPanelProps {
  authToken: string;
  userId: string;
  userRole: string;
  conversationId?: string;
  onAlertAction?: (alertId: string, action: string) => void;
  className?: string;
}

export function CrisisAlertPanel({
  authToken,
  userId,
  userRole,
  conversationId,
  onAlertAction,
  className = '',
}: CrisisAlertPanelProps) {
  const {
    alerts,
    detections,
    acknowledgeAlert,
    resolveAlert,
    markFalsePositive,
    getRiskLevelColor,
    getCategoryIcon,
    formatConfidence,
    isHighRisk,
    requiresImmediate,
  } = useCrisisDetection({
    authToken,
    userId,
    userRole,
    conversationId,
  });

  const [selectedAlert, setSelectedAlert] = useState<CrisisAlert | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter alerts by status and priority
  const activeAlerts = alerts.filter(alert => 
    alert.status === 'pending' || alert.status === 'acknowledged'
  );

  const criticalAlerts = activeAlerts.filter(alert => 
    alert.alertLevel === 'critical'
  );

  const highAlerts = activeAlerts.filter(alert => 
    alert.alertLevel === 'high'
  );

  // Handle alert actions
  const handleAcknowledge = useCallback(async (alertId: string) => {
    setIsProcessing(true);
    try {
      await acknowledgeAlert(alertId, actionNotes);
      setActionNotes('');
      onAlertAction?.(alertId, 'acknowledged');
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [acknowledgeAlert, actionNotes, onAlertAction]);

  const handleResolve = useCallback(async (alertId: string) => {
    setIsProcessing(true);
    try {
      await resolveAlert(alertId, actionNotes);
      setActionNotes('');
      onAlertAction?.(alertId, 'resolved');
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [resolveAlert, actionNotes, onAlertAction]);

  const handleFalsePositive = useCallback(async (alertId: string) => {
    setIsProcessing(true);
    try {
      await markFalsePositive(alertId, actionNotes);
      setActionNotes('');
      onAlertAction?.(alertId, 'false_positive');
    } catch (error) {
      console.error('Failed to mark false positive:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [markFalsePositive, actionNotes, onAlertAction]);

  // Get detection for alert
  const getDetectionForAlert = (alert: CrisisAlert): CrisisDetectionResult | null => {
    return detections.find(d => d.id === alert.detectionId) || null;
  };

  // Get alert level color
  const getAlertLevelColor = (level: CrisisAlert['alertLevel']) => {
    switch (level) {
      case 'low': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'medium': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'critical': return 'bg-red-100 border-red-300 text-red-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: CrisisAlert['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'acknowledged': return <Eye className="h-4 w-4 text-blue-600" />;
      case 'in_progress': return <Zap className="h-4 w-4 text-orange-600" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'false_positive': return <XCircle className="h-4 w-4 text-gray-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  if (activeAlerts.length === 0) {
    return (
      <div className={`p-6 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="font-medium text-green-900">All Clear</h3>
            <p className="text-sm text-green-700">No active crisis alerts at this time</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Critical Alerts ({criticalAlerts.length})</h3>
          </div>
          
          {criticalAlerts.map(alert => (
            <CrisisAlertCard
              key={alert.id}
              alert={alert}
              detection={getDetectionForAlert(alert)}
              onAcknowledge={() => handleAcknowledge(alert.id)}
              onResolve={() => handleResolve(alert.id)}
              onFalsePositive={() => handleFalsePositive(alert.id)}
              onSelect={() => setSelectedAlert(alert)}
              isProcessing={isProcessing}
              userRole={userRole}
              getRiskLevelColor={getRiskLevelColor}
              getCategoryIcon={getCategoryIcon}
              formatConfidence={formatConfidence}
              getAlertLevelColor={getAlertLevelColor}
              getStatusIcon={getStatusIcon}
            />
          ))}
        </div>
      )}

      {/* High Priority Alerts */}
      {highAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-orange-900">High Priority Alerts ({highAlerts.length})</h3>
          </div>
          
          {highAlerts.map(alert => (
            <CrisisAlertCard
              key={alert.id}
              alert={alert}
              detection={getDetectionForAlert(alert)}
              onAcknowledge={() => handleAcknowledge(alert.id)}
              onResolve={() => handleResolve(alert.id)}
              onFalsePositive={() => handleFalsePositive(alert.id)}
              onSelect={() => setSelectedAlert(alert)}
              isProcessing={isProcessing}
              userRole={userRole}
              getRiskLevelColor={getRiskLevelColor}
              getCategoryIcon={getCategoryIcon}
              formatConfidence={formatConfidence}
              getAlertLevelColor={getAlertLevelColor}
              getStatusIcon={getStatusIcon}
            />
          ))}
        </div>
      )}

      {/* Action Notes Input */}
      {selectedAlert && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
        >
          <Label htmlFor="actionNotes" className="text-sm font-medium">
            Action Notes for Alert #{selectedAlert.id.slice(-6)}
          </Label>
          <textarea
            id="actionNotes"
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
            placeholder="Add notes about your action..."
            rows={3}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="flex items-center justify-end space-x-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedAlert(null)}
            >
              Cancel
            </Button>
            
            {selectedAlert.status === 'pending' && (
              <Button
                size="sm"
                onClick={() => handleAcknowledge(selectedAlert.id)}
                disabled={isProcessing}
              >
                Acknowledge
              </Button>
            )}
            
            {(selectedAlert.status === 'acknowledged' || selectedAlert.status === 'in_progress') && (
              <Button
                size="sm"
                onClick={() => handleResolve(selectedAlert.id)}
                disabled={isProcessing}
              >
                Resolve
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFalsePositive(selectedAlert.id)}
              disabled={isProcessing}
            >
              Mark False Positive
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface CrisisAlertCardProps {
  alert: CrisisAlert;
  detection: CrisisDetectionResult | null;
  onAcknowledge: () => void;
  onResolve: () => void;
  onFalsePositive: () => void;
  onSelect: () => void;
  isProcessing: boolean;
  userRole: string;
  getRiskLevelColor: (level: string) => string;
  getCategoryIcon: (category: string) => string;
  formatConfidence: (confidence: number) => string;
  getAlertLevelColor: (level: CrisisAlert['alertLevel']) => string;
  getStatusIcon: (status: CrisisAlert['status']) => React.ReactNode;
}

function CrisisAlertCard({
  alert,
  detection,
  onAcknowledge,
  onResolve,
  onFalsePositive,
  onSelect,
  isProcessing,
  userRole,
  getRiskLevelColor,
  getCategoryIcon,
  formatConfidence,
  getAlertLevelColor,
  getStatusIcon,
}: CrisisAlertCardProps) {
  const canTakeAction = ['therapist', 'moderator', 'crisis_team'].includes(userRole);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${getAlertLevelColor(alert.alertLevel)}`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Alert Header */}
          <div className="flex items-center space-x-2 mb-2">
            {getStatusIcon(alert.status)}
            <Badge className={`text-xs ${getRiskLevelColor(alert.alertLevel)}`}>
              {alert.alertLevel.toUpperCase()}
            </Badge>
            <span className="text-xs text-gray-600">
              Alert #{alert.id.slice(-6)}
            </span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(alert.createdAt, { addSuffix: true })}
            </span>
          </div>

          {/* Detection Info */}
          {detection && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Confidence:</span>
                <Badge variant="outline" className="text-xs">
                  {formatConfidence(detection.confidence)}
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Categories:</span>
                <div className="flex space-x-1">
                  {detection.categories.map(category => (
                    <span key={category} className="text-sm" title={category}>
                      {getCategoryIcon(category)}
                    </span>
                  ))}
                </div>
              </div>

              {detection.recommendations.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Recommendations:</span>
                  <ul className="text-xs text-gray-700 mt-1 space-y-1">
                    {detection.recommendations.slice(0, 2).map((rec, index) => (
                      <li key={index} className="flex items-start space-x-1">
                        <span>•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Alert Actions History */}
          {alert.actions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <span className="text-xs font-medium text-gray-700">Recent Actions:</span>
              <div className="mt-1 space-y-1">
                {alert.actions.slice(-2).map((action, index) => (
                  <div key={index} className="text-xs text-gray-600">
                    <span className="font-medium">{action.type}</span> - {action.details}
                    <span className="text-gray-500 ml-2">
                      {formatDistanceToNow(action.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {canTakeAction && (
          <div className="flex flex-col space-y-2 ml-4">
            {alert.status === 'pending' && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onAcknowledge();
                }}
                disabled={isProcessing}
                className="text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                Acknowledge
              </Button>
            )}

            {(alert.status === 'acknowledged' || alert.status === 'in_progress') && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onResolve();
                }}
                disabled={isProcessing}
                className="text-xs"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Resolve
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onFalsePositive();
              }}
              disabled={isProcessing}
              className="text-xs"
            >
              <XCircle className="h-3 w-3 mr-1" />
              False Positive
            </Button>
          </div>
        )}
      </div>

      {/* Escalation Indicator */}
      {detection?.requiresImmediate && (
        <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded flex items-center space-x-2">
          <Zap className="h-4 w-4 text-red-600" />
          <span className="text-sm font-medium text-red-900">
            Immediate intervention required
          </span>
        </div>
      )}
    </motion.div>
  );
}