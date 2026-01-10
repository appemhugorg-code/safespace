import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  AlertTriangle, 
  Ban, 
  UserX, 
  MessageSquare,
  Clock,
  Eye,
  FileText,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Flag,
  Volume2,
  VolumeX,
  Crown,
  Trash2
} from 'lucide-react';
import { 
  GroupConversation, 
  GroupParticipant, 
  ModerationAction, 
  GroupReport 
} from '@/services/group-management-service';
import { useGroupManagement } from '@/hooks/use-group-management';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';

interface ModerationToolsProps {
  group: GroupConversation;
  authToken: string;
  userId: string;
  userRole: string;
  onModerationAction?: (action: ModerationAction) => void;
  className?: string;
}

interface ModerationFilters {
  action?: ModerationAction['action'];
  targetUserId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search: string;
}

interface ReportFilters {
  type?: GroupReport['type'];
  status?: GroupReport['status'];
  search: string;
}

type TabType = 'actions' | 'reports' | 'quick-actions';

export function ModerationTools({
  group,
  authToken,
  userId,
  userRole,
  onModerationAction,
  className = '',
}: ModerationToolsProps) {
  const {
    moderateParticipant,
    reportUser,
    getModerationHistory,
    hasPermission,
    canModerate,
  } = useGroupManagement({
    authToken,
    userId,
    userRole,
  });

  const [activeTab, setActiveTab] = useState<TabType>('quick-actions');
  const [moderationHistory, setModerationHistory] = useState<ModerationAction[]>([]);
  const [reports, setReports] = useState<GroupReport[]>([]);
  const [moderationFilters, setModerationFilters] = useState<ModerationFilters>({ search: '' });
  const [reportFilters, setReportFilters] = useState<ReportFilters>({ search: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick action form state
  const [quickAction, setQuickAction] = useState({
    targetUserId: '',
    action: 'warn' as ModerationAction['action'],
    reason: '',
    duration: 60, // minutes
  });

  // Report form state
  const [reportForm, setReportForm] = useState({
    reportedUser: '',
    reportedMessage: '',
    type: 'inappropriate_content' as GroupReport['type'],
    description: '',
  });

  const canModerateGroup = hasPermission(group.id, 'moderate');

  // Load moderation history
  const loadModerationHistory = useCallback(async () => {
    if (!canModerateGroup) return;

    setIsLoading(true);
    try {
      const history = await getModerationHistory(group.id, moderationFilters);
      setModerationHistory(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load moderation history');
    } finally {
      setIsLoading(false);
    }
  }, [canModerateGroup, getModerationHistory, group.id, moderationFilters]);

  // Load on mount and filter changes
  useEffect(() => {
    if (activeTab === 'actions') {
      loadModerationHistory();
    }
  }, [activeTab, loadModerationHistory]);

  // Handle quick moderation action
  const handleQuickAction = useCallback(async () => {
    if (!canModerate(group.id, quickAction.targetUserId) || !quickAction.reason.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const action = await moderateParticipant({
        groupId: group.id,
        targetUserId: quickAction.targetUserId,
        action: quickAction.action,
        reason: quickAction.reason,
        duration: ['mute', 'ban'].includes(quickAction.action) ? quickAction.duration : undefined,
      });

      onModerationAction?.(action);
      
      // Reset form
      setQuickAction({
        targetUserId: '',
        action: 'warn',
        reason: '',
        duration: 60,
      });

      // Refresh history if on actions tab
      if (activeTab === 'actions') {
        loadModerationHistory();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform moderation action');
    } finally {
      setIsLoading(false);
    }
  }, [canModerate, group.id, quickAction, moderateParticipant, onModerationAction, activeTab, loadModerationHistory]);

  // Handle report submission
  const handleSubmitReport = useCallback(async () => {
    if (!reportForm.description.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const report = await reportUser({
        groupId: group.id,
        reportedUser: reportForm.reportedUser || undefined,
        reportedMessage: reportForm.reportedMessage || undefined,
        type: reportForm.type,
        description: reportForm.description,
      });

      // Reset form
      setReportForm({
        reportedUser: '',
        reportedMessage: '',
        type: 'inappropriate_content',
        description: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report');
    } finally {
      setIsLoading(false);
    }
  }, [reportForm, reportUser, group.id]);

  // Get action icon
  const getActionIcon = (action: ModerationAction['action']) => {
    switch (action) {
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'mute':
        return <VolumeX className="h-4 w-4 text-orange-600" />;
      case 'kick':
        return <UserX className="h-4 w-4 text-red-600" />;
      case 'ban':
        return <Ban className="h-4 w-4 text-red-700" />;
      case 'unban':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'promote':
        return <Crown className="h-4 w-4 text-blue-600" />;
      case 'demote':
        return <UserX className="h-4 w-4 text-gray-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  // Get report type icon
  const getReportTypeIcon = (type: GroupReport['type']) => {
    switch (type) {
      case 'inappropriate_content':
        return <Flag className="h-4 w-4 text-red-600" />;
      case 'harassment':
        return <AlertTriangle className="h-4 w-4 text-red-700" />;
      case 'spam':
        return <MessageSquare className="h-4 w-4 text-orange-600" />;
      case 'crisis_concern':
        return <AlertTriangle className="h-4 w-4 text-red-800" />;
      case 'privacy_violation':
        return <Eye className="h-4 w-4 text-purple-600" />;
      default:
        return <Flag className="h-4 w-4 text-gray-600" />;
    }
  };

  // Filter moderation history
  const filteredModerationHistory = moderationHistory.filter(action => {
    const matchesSearch = !moderationFilters.search || 
      action.reason.toLowerCase().includes(moderationFilters.search.toLowerCase());
    const matchesAction = !moderationFilters.action || action.action === moderationFilters.action;
    const matchesTarget = !moderationFilters.targetUserId || action.targetUserId === moderationFilters.targetUserId;
    
    return matchesSearch && matchesAction && matchesTarget;
  });

  // Render quick actions tab
  const renderQuickActionsTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Quick Moderation Actions</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Action Form */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-sm">Moderate Participant</h5>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="targetUser" className="text-sm">Target User</Label>
                <Select
                  value={quickAction.targetUserId}
                  onValueChange={(value) => setQuickAction(prev => ({ ...prev, targetUserId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user to moderate" />
                  </SelectTrigger>
                  <SelectContent>
                    {group.participants
                      .filter(p => p.userId !== userId && canModerate(group.id, p.userId))
                      .map(participant => (
                        <SelectItem key={participant.id} value={participant.userId}>
                          {participant.name} ({participant.role})
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="action" className="text-sm">Action</Label>
                <Select
                  value={quickAction.action}
                  onValueChange={(value) => setQuickAction(prev => ({ ...prev, action: value as ModerationAction['action'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warn">Warn</SelectItem>
                    <SelectItem value="mute">Mute</SelectItem>
                    <SelectItem value="kick">Kick</SelectItem>
                    <SelectItem value="ban">Ban</SelectItem>
                    <SelectItem value="promote">Promote</SelectItem>
                    <SelectItem value="demote">Demote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {['mute', 'ban'].includes(quickAction.action) && (
                <div>
                  <Label htmlFor="duration" className="text-sm">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={quickAction.duration}
                    onChange={(e) => setQuickAction(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="reason" className="text-sm">Reason *</Label>
                <textarea
                  id="reason"
                  value={quickAction.reason}
                  onChange={(e) => setQuickAction(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Explain the reason for this action"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button
                onClick={handleQuickAction}
                disabled={isLoading || !quickAction.targetUserId || !quickAction.reason.trim()}
                className="w-full"
              >
                {isLoading ? 'Processing...' : 'Execute Action'}
              </Button>
            </div>
          </div>

          {/* Report Form */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-sm">Submit Report</h5>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="reportType" className="text-sm">Report Type</Label>
                <Select
                  value={reportForm.type}
                  onValueChange={(value) => setReportForm(prev => ({ ...prev, type: value as GroupReport['type'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inappropriate_content">Inappropriate Content</SelectItem>
                    <SelectItem value="harassment">Harassment</SelectItem>
                    <SelectItem value="spam">Spam</SelectItem>
                    <SelectItem value="crisis_concern">Crisis Concern</SelectItem>
                    <SelectItem value="privacy_violation">Privacy Violation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reportedUser" className="text-sm">Reported User (Optional)</Label>
                <Select
                  value={reportForm.reportedUser}
                  onValueChange={(value) => setReportForm(prev => ({ ...prev, reportedUser: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No specific user</SelectItem>
                    {group.participants
                      .filter(p => p.userId !== userId)
                      .map(participant => (
                        <SelectItem key={participant.id} value={participant.userId}>
                          {participant.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reportDescription" className="text-sm">Description *</Label>
                <textarea
                  id="reportDescription"
                  value={reportForm.description}
                  onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the issue in detail"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button
                onClick={handleSubmitReport}
                disabled={isLoading || !reportForm.description.trim()}
                className="w-full"
                variant="outline"
              >
                {isLoading ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <div className="text-lg font-semibold text-yellow-800">
            {group.participants.reduce((sum, p) => sum + p.metadata.warningCount, 0)}
          </div>
          <div className="text-xs text-yellow-700">Total Warnings</div>
        </div>
        
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
          <div className="text-lg font-semibold text-orange-800">
            {group.participants.filter(p => p.status === 'muted').length}
          </div>
          <div className="text-xs text-orange-700">Muted Users</div>
        </div>
        
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
          <div className="text-lg font-semibold text-red-800">
            {group.participants.filter(p => p.status === 'banned').length}
          </div>
          <div className="text-xs text-red-700">Banned Users</div>
        </div>
        
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <div className="text-lg font-semibold text-blue-800">
            {group.participants.reduce((sum, p) => sum + p.metadata.reportCount, 0)}
          </div>
          <div className="text-xs text-blue-700">Total Reports</div>
        </div>
      </div>
    </div>
  );

  // Render actions history tab
  const renderActionsTab = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h4 className="font-medium text-gray-900">Moderation History</h4>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadModerationHistory}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search actions..."
            value={moderationFilters.search}
            onChange={(e) => setModerationFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-10"
          />
        </div>

        <Select
          value={moderationFilters.action || 'all'}
          onValueChange={(value) => setModerationFilters(prev => ({ 
            ...prev, 
            action: value === 'all' ? undefined : value as ModerationAction['action']
          }))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="warn">Warn</SelectItem>
            <SelectItem value="mute">Mute</SelectItem>
            <SelectItem value="kick">Kick</SelectItem>
            <SelectItem value="ban">Ban</SelectItem>
            <SelectItem value="unban">Unban</SelectItem>
            <SelectItem value="promote">Promote</SelectItem>
            <SelectItem value="demote">Demote</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredModerationHistory.length > 0 ? (
          filteredModerationHistory.map((action) => {
            const targetParticipant = group.participants.find(p => p.userId === action.targetUserId);
            
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getActionIcon(action.action)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {action.action}
                        </Badge>
                        <span className="text-sm font-medium">
                          {targetParticipant?.name || 'Unknown User'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{action.reason}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{format(action.createdAt, 'MMM d, yyyy HH:mm')}</span>
                        {action.duration && (
                          <span>Duration: {action.duration} minutes</span>
                        )}
                        {action.expiresAt && (
                          <span>Expires: {formatDistanceToNow(action.expiresAt, { addSuffix: true })}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {action.reversedAt ? (
                    <Badge variant="outline" className="text-xs text-gray-500">
                      Reversed
                    </Badge>
                  ) : action.expiresAt && new Date() > action.expiresAt ? (
                    <Badge variant="outline" className="text-xs text-green-600">
                      Expired
                    </Badge>
                  ) : (
                    <Badge className="text-xs">
                      Active
                    </Badge>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Shield className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No moderation actions found</p>
          </div>
        )}
      </div>
    </div>
  );

  if (!canModerateGroup) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Shield className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-600">You don't have permission to access moderation tools</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Moderation Tools</h3>
        <p className="text-sm text-gray-600">Manage group behavior and maintain community standards</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'quick-actions', label: 'Quick Actions', icon: Shield },
            { id: 'actions', label: 'History', icon: FileText },
            { id: 'reports', label: 'Reports', icon: Flag },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'quick-actions' && renderQuickActionsTab()}
          {activeTab === 'actions' && renderActionsTab()}
          {activeTab === 'reports' && (
            <div className="text-center py-8">
              <Flag className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Reports management coming soon</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}