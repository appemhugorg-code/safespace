import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Brain,
  Eye,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';
import { CrisisDetectionResult, CrisisDetectionConfig } from '@/services/crisis-detection-service';
import { useCrisisDetection } from '@/hooks/use-crisis-detection';
import { CrisisAlertPanel } from './crisis-alert-panel';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subDays, subWeeks, subMonths } from 'date-fns';

interface CrisisDetectionDashboardProps {
  authToken: string;
  userId: string;
  userRole: string;
  conversationId?: string;
  className?: string;
}

type DashboardView = 'overview' | 'alerts' | 'history' | 'settings' | 'analytics';
type TimePeriod = 'day' | 'week' | 'month';

export function CrisisDetectionDashboard({
  authToken,
  userId,
  userRole,
  conversationId,
  className = '',
}: CrisisDetectionDashboardProps) {
  const {
    detections,
    alerts,
    config,
    isEngineReady,
    error,
    getDetectionHistory,
    updateConfig,
    getDetectionStats,
    getRiskLevelColor,
    getCategoryIcon,
    formatConfidence,
  } = useCrisisDetection({
    authToken,
    userId,
    userRole,
    conversationId,
  });

  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState<CrisisDetectionResult[]>([]);

  const canManageSettings = ['therapist', 'moderator', 'admin'].includes(userRole);
  const stats = getDetectionStats(timePeriod);

  // Load history data
  const loadHistoryData = useCallback(async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      let dateFrom: Date;
      
      switch (timePeriod) {
        case 'day':
          dateFrom = subDays(now, 1);
          break;
        case 'week':
          dateFrom = subWeeks(now, 1);
          break;
        case 'month':
          dateFrom = subMonths(now, 1);
          break;
      }

      const history = await getDetectionHistory({
        conversationId,
        dateFrom,
        dateTo: now,
        limit: 100,
      });

      setHistoryData(history);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getDetectionHistory, conversationId, timePeriod]);

  useEffect(() => {
    if (activeView === 'history' || activeView === 'analytics') {
      loadHistoryData();
    }
  }, [activeView, loadHistoryData]);

  // Render overview
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Engine Status"
          value={isEngineReady ? 'Active' : 'Inactive'}
          icon={Shield}
          color={isEngineReady ? 'green' : 'red'}
          subtitle={error || 'Crisis detection engine running'}
        />

        <StatusCard
          title="Active Alerts"
          value={alerts.filter(a => a.status === 'pending' || a.status === 'acknowledged').length}
          icon={AlertTriangle}
          color="orange"
          subtitle={`${alerts.filter(a => a.alertLevel === 'critical').length} critical`}
        />

        <StatusCard
          title="Detections Today"
          value={stats.totalDetections}
          icon={Eye}
          color="blue"
          subtitle={`${Math.round(stats.averageConfidence * 100)}% avg confidence`}
        />

        <StatusCard
          title="False Positive Rate"
          value={`${Math.round(stats.falsePositiveRate * 100)}%`}
          icon={BarChart3}
          color={stats.falsePositiveRate > 0.2 ? 'red' : 'green'}
          subtitle="Last 7 days"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Detections */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Detections</h3>
          
          {detections.slice(0, 5).length > 0 ? (
            <div className="space-y-3">
              {detections.slice(0, 5).map(detection => (
                <div key={detection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <Badge className={`text-xs ${getRiskLevelColor(detection.riskLevel)}`}>
                      {detection.riskLevel}
                    </Badge>
                    <div className="flex space-x-1">
                      {detection.categories.map(cat => (
                        <span key={cat} title={cat}>{getCategoryIcon(cat)}</span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatConfidence(detection.confidence)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(detection.detectedAt, 'MMM d, HH:mm')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Eye className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No recent detections</p>
            </div>
          )}
        </div>

        {/* Risk Level Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Risk Level Distribution</h3>
          
          <div className="space-y-3">
            {Object.entries(stats.byRiskLevel).map(([level, count]) => (
              <div key={level} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    level === 'critical' ? 'bg-red-600' :
                    level === 'high' ? 'bg-red-400' :
                    level === 'medium' ? 'bg-orange-400' :
                    'bg-yellow-400'
                  }`} />
                  <span className="text-sm capitalize">{level}</span>
                </div>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Alerts Preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Active Alerts</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveView('alerts')}
          >
            View All
          </Button>
        </div>
        
        <CrisisAlertPanel
          authToken={authToken}
          userId={userId}
          userRole={userRole}
          conversationId={conversationId}
        />
      </div>
    </div>
  );

  // Render settings
  const renderSettings = () => {
    if (!canManageSettings) {
      return (
        <div className="text-center py-8">
          <Settings className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-600">You don't have permission to manage settings</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Detection Configuration</h3>
          
          {config && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Crisis Detection</Label>
                  <p className="text-xs text-gray-600">Enable automatic crisis detection</p>
                </div>
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(checked) => updateConfig({ enabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Real-time Analysis</Label>
                  <p className="text-xs text-gray-600">Analyze messages as they are sent</p>
                </div>
                <Switch
                  checked={config.realTimeAnalysis}
                  onCheckedChange={(checked) => updateConfig({ realTimeAnalysis: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Keyword Detection</Label>
                  <p className="text-xs text-gray-600">Use keyword-based detection</p>
                </div>
                <Switch
                  checked={config.keywordDetection}
                  onCheckedChange={(checked) => updateConfig({ keywordDetection: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Pattern Detection</Label>
                  <p className="text-xs text-gray-600">Use pattern-based detection</p>
                </div>
                <Switch
                  checked={config.patternDetection}
                  onCheckedChange={(checked) => updateConfig({ patternDetection: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">ML Detection</Label>
                  <p className="text-xs text-gray-600">Use machine learning models</p>
                </div>
                <Switch
                  checked={config.mlDetection}
                  onCheckedChange={(checked) => updateConfig({ mlDetection: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Context Analysis</Label>
                  <p className="text-xs text-gray-600">Consider user history and context</p>
                </div>
                <Switch
                  checked={config.contextAnalysis}
                  onCheckedChange={(checked) => updateConfig({ contextAnalysis: checked })}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Confidence Threshold</Label>
                <p className="text-xs text-gray-600 mb-2">
                  Minimum confidence required for detection ({Math.round(config.confidenceThreshold * 100)}%)
                </p>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={config.confidenceThreshold}
                  onChange={(e) => updateConfig({ confidenceThreshold: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Escalation Threshold</Label>
                <p className="text-xs text-gray-600 mb-2">
                  Confidence level for automatic escalation ({Math.round(config.escalationThreshold * 100)}%)
                </p>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={config.escalationThreshold}
                  onChange={(e) => updateConfig({ escalationThreshold: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render history
  const renderHistory = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Detection History</h3>
        <div className="flex items-center space-x-2">
          <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last Day</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={loadHistoryData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : historyData.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Risk Level
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Confidence
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Categories
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Escalation
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {historyData.map(detection => (
                  <tr key={detection.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {format(detection.detectedAt, 'MMM d, HH:mm')}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs ${getRiskLevelColor(detection.riskLevel)}`}>
                        {detection.riskLevel}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatConfidence(detection.confidence)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-1">
                        {detection.categories.map(cat => (
                          <span key={cat} title={cat}>{getCategoryIcon(cat)}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">
                        {detection.escalationLevel}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p>No detection history for this period</p>
        </div>
      )}
    </div>
  );

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`max-w-7xl mx-auto ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Crisis Detection Dashboard</h1>
        <p className="text-gray-600">Monitor and manage crisis detection system</p>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {navigationItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as DashboardView)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeView === item.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeView === 'overview' && renderOverview()}
          {activeView === 'alerts' && (
            <CrisisAlertPanel
              authToken={authToken}
              userId={userId}
              userRole={userRole}
              conversationId={conversationId}
            />
          )}
          {activeView === 'history' && renderHistory()}
          {activeView === 'settings' && renderSettings()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'green' | 'red' | 'blue' | 'orange' | 'purple';
  subtitle?: string;
}

function StatusCard({ title, value, icon: Icon, color, subtitle }: StatusCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200' };
      case 'red':
        return { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-200' };
      case 'blue':
        return { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200' };
      case 'orange':
        return { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-200' };
      case 'purple':
        return { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200' };
      default:
        return { bg: 'bg-gray-50', icon: 'text-gray-600', border: 'border-gray-200' };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border ${colorClasses.border} rounded-lg p-4`}
    >
      <div className="flex items-center justify-between">
        <div className={`p-2 ${colorClasses.bg} rounded-lg`}>
          <Icon className={`h-5 w-5 ${colorClasses.icon}`} />
        </div>
      </div>
      
      <div className="mt-3">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600">{title}</div>
        {subtitle && (
          <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
        )}
      </div>
    </motion.div>
  );
}