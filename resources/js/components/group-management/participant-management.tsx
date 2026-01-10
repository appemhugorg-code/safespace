import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Crown, 
  Shield, 
  UserCheck, 
  UserX, 
  UserPlus,
  Search,
  MoreHorizontal,
  MessageCircle,
  AlertTriangle,
  Clock,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Ban,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { GroupConversation, GroupParticipant, ModerationAction } from '@/services/group-management-service';
import { useGroupManagement } from '@/hooks/use-group-management';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface ParticipantManagementProps {
  group: GroupConversation;
  authToken: string;
  userId: string;
  userRole: string;
  onParticipantUpdate?: (participant: GroupParticipant) => void;
  onModerationAction?: (action: ModerationAction) => void;
  className?: string;
}

interface ParticipantFilters {
  role?: GroupParticipant['role'];
  status?: GroupParticipant['status'];
  search: string;
}

export function ParticipantManagement({
  group,
  authToken,
  userId,
  userRole,
  onParticipantUpdate,
  onModerationAction,
  className = '',
}: ParticipantManagementProps) {
  const {
    updateParticipant,
    removeParticipant,
    moderateParticipant,
    hasPermission,
    canModerate,
    getUserRole,
  } = useGroupManagement({
    authToken,
    userId,
    userRole,
  });

  const [filters, setFilters] = useState<ParticipantFilters>({
    search: '',
  });
  const [selectedParticipant, setSelectedParticipant] = useState<GroupParticipant | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUserRole = getUserRole(group.id);
  const canManageParticipants = hasPermission(group.id, 'moderate');

  // Filter participants
  const filteredParticipants = group.participants.filter(participant => {
    const matchesSearch = !filters.search || 
      participant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      participant.userId.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesRole = !filters.role || participant.role === filters.role;
    const matchesStatus = !filters.status || participant.status === filters.status;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle participant role update
  const handleRoleUpdate = useCallback(async (participantId: string, newRole: GroupParticipant['role']) => {
    if (!canManageParticipants) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedParticipant = await updateParticipant(group.id, participantId, { role: newRole });
      onParticipantUpdate?.(updatedParticipant);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update participant role');
    } finally {
      setIsLoading(false);
    }
  }, [canManageParticipants, updateParticipant, group.id, onParticipantUpdate]);

  // Handle participant status update
  const handleStatusUpdate = useCallback(async (participantId: string, newStatus: GroupParticipant['status']) => {
    if (!canManageParticipants) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedParticipant = await updateParticipant(group.id, participantId, { status: newStatus });
      onParticipantUpdate?.(updatedParticipant);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update participant status');
    } finally {
      setIsLoading(false);
    }
  }, [canManageParticipants, updateParticipant, group.id, onParticipantUpdate]);

  // Handle participant removal
  const handleRemoveParticipant = useCallback(async (participantId: string, reason?: string) => {
    if (!canManageParticipants) return;

    setIsLoading(true);
    setError(null);

    try {
      await removeParticipant(group.id, participantId, reason);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove participant');
    } finally {
      setIsLoading(false);
    }
  }, [canManageParticipants, removeParticipant, group.id]);

  // Handle moderation action
  const handleModerationAction = useCallback(async (
    targetUserId: string,
    action: ModerationAction['action'],
    reason: string,
    duration?: number
  ) => {
    if (!canModerate(group.id, targetUserId)) return;

    setIsLoading(true);
    setError(null);

    try {
      const moderationAction = await moderateParticipant({
        groupId: group.id,
        targetUserId,
        action,
        reason,
        duration,
      });
      onModerationAction?.(moderationAction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform moderation action');
    } finally {
      setIsLoading(false);
    }
  }, [canModerate, group.id, moderateParticipant, onModerationAction]);

  // Get role icon
  const getRoleIcon = (role: GroupParticipant['role']) => {
    switch (role) {
      case 'therapist':
        return <Shield className="h-4 w-4 text-green-600" />;
      case 'moderator':
        return <Crown className="h-4 w-4 text-blue-600" />;
      case 'guardian':
        return <Shield className="h-4 w-4 text-purple-600" />;
      case 'client':
        return <Users className="h-4 w-4 text-gray-600" />;
      case 'observer':
        return <Eye className="h-4 w-4 text-yellow-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: GroupParticipant['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'muted':
        return 'bg-yellow-100 text-yellow-800';
      case 'banned':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: GroupParticipant['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-3 w-3" />;
      case 'inactive':
        return <Clock className="h-3 w-3" />;
      case 'muted':
        return <VolumeX className="h-3 w-3" />;
      case 'banned':
        return <Ban className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      default:
        return <XCircle className="h-3 w-3" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Participants</h3>
          <p className="text-sm text-gray-600">
            {group.participants.length} of {group.settings.maxParticipants} members
          </p>
        </div>

        {hasPermission(group.id, 'invite') && (
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Members
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search participants..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-10"
          />
        </div>

        <Select
          value={filters.role || 'all'}
          onValueChange={(value) => setFilters(prev => ({ 
            ...prev, 
            role: value === 'all' ? undefined : value as GroupParticipant['role']
          }))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="therapist">Therapist</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
            <SelectItem value="guardian">Guardian</SelectItem>
            <SelectItem value="client">Client</SelectItem>
            <SelectItem value="observer">Observer</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status || 'all'}
          onValueChange={(value) => setFilters(prev => ({ 
            ...prev, 
            status: value === 'all' ? undefined : value as GroupParticipant['status']
          }))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="muted">Muted</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Participants List */}
      <div className="space-y-2">
        {filteredParticipants.length > 0 ? (
          filteredParticipants.map((participant) => {
            const canModerateParticipant = canModerate(group.id, participant.userId);
            const isCurrentUser = participant.userId === userId;

            return (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                onMouseEnter={() => setShowActions(participant.id)}
                onMouseLeave={() => setShowActions(null)}
              >
                <div className="flex items-center justify-between">
                  {/* Participant Info */}
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {participant.avatar ? (
                        <img
                          src={participant.avatar}
                          alt={participant.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="h-5 w-5 text-gray-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 truncate">
                          {participant.name}
                          {isCurrentUser && <span className="text-sm text-gray-500 ml-1">(You)</span>}
                        </h4>
                        {getRoleIcon(participant.role)}
                      </div>

                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={`text-xs ${getStatusBadgeColor(participant.status)}`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(participant.status)}
                            <span>{participant.status}</span>
                          </div>
                        </Badge>

                        <Badge variant="outline" className="text-xs">
                          {participant.role}
                        </Badge>

                        {participant.lastSeenAt && (
                          <span className="text-xs text-gray-500">
                            Last seen {formatDistanceToNow(participant.lastSeenAt, { addSuffix: true })}
                          </span>
                        )}
                      </div>

                      {/* Participant Stats */}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{participant.metadata.messageCount} messages</span>
                        </div>

                        {participant.metadata.warningCount > 0 && (
                          <div className="flex items-center space-x-1 text-yellow-600">
                            <AlertTriangle className="h-3 w-3" />
                            <span>{participant.metadata.warningCount} warnings</span>
                          </div>
                        )}

                        <div className="flex items-center space-x-1">
                          <span>Engagement: {Math.round(participant.metadata.engagementScore * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <AnimatePresence>
                    {showActions === participant.id && canManageParticipants && !isCurrentUser && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center space-x-2"
                      >
                        {/* Role Change */}
                        <Select
                          value={participant.role}
                          onValueChange={(value) => handleRoleUpdate(participant.id, value as GroupParticipant['role'])}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="w-24 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="client">Client</SelectItem>
                            <SelectItem value="guardian">Guardian</SelectItem>
                            <SelectItem value="observer">Observer</SelectItem>
                            {(currentUserRole === 'therapist' || currentUserRole === 'moderator') && (
                              <SelectItem value="moderator">Moderator</SelectItem>
                            )}
                            {currentUserRole === 'therapist' && (
                              <SelectItem value="therapist">Therapist</SelectItem>
                            )}
                          </SelectContent>
                        </Select>

                        {/* Quick Actions */}
                        {canModerateParticipant && (
                          <>
                            {participant.status === 'active' ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleModerationAction(participant.userId, 'mute', 'Temporary mute', 60)}
                                disabled={isLoading}
                                title="Mute for 1 hour"
                              >
                                <VolumeX className="h-3 w-3" />
                              </Button>
                            ) : participant.status === 'muted' ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusUpdate(participant.id, 'active')}
                                disabled={isLoading}
                                title="Unmute"
                              >
                                <Volume2 className="h-3 w-3" />
                              </Button>
                            ) : null}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleModerationAction(participant.userId, 'warn', 'Behavioral warning')}
                              disabled={isLoading}
                              title="Issue warning"
                            >
                              <AlertTriangle className="h-3 w-3" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveParticipant(participant.id, 'Removed by moderator')}
                              disabled={isLoading}
                              title="Remove from group"
                              className="text-red-600 hover:text-red-700"
                            >
                              <UserX className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Permissions */}
                {selectedParticipant?.id === participant.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Permissions</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {participant.permissions.map((permission) => (
                        <div
                          key={permission.type}
                          className={`flex items-center space-x-2 text-xs p-2 rounded ${
                            permission.granted ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {permission.granted ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          <span>{permission.type.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {filters.search || filters.role || filters.status
                ? 'No participants match your filters'
                : 'No participants in this group'
              }
            </p>
          </div>
        )}
      </div>

      {/* Group Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{group.statistics.totalParticipants}</div>
          <div className="text-xs text-gray-600">Total Members</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">{group.statistics.activeParticipants}</div>
          <div className="text-xs text-gray-600">Active Members</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">
            {Math.round(group.statistics.averageEngagement * 100)}%
          </div>
          <div className="text-xs text-gray-600">Avg Engagement</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600">{group.statistics.totalMessages}</div>
          <div className="text-xs text-gray-600">Total Messages</div>
        </div>
      </div>
    </div>
  );
}