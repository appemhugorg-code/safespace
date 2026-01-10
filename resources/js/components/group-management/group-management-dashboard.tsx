import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Users, 
  Settings, 
  Shield, 
  MessageCircle,
  Video,
  AlertTriangle,
  Crown,
  UserCheck,
  UserX,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserPlus
} from 'lucide-react';
import { GroupConversation, GroupParticipant, GroupInvitation } from '@/services/group-management-service';
import { useGroupManagement } from '@/hooks/use-group-management';
import { GroupCreationForm } from './group-creation-form';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface GroupManagementDashboardProps {
  authToken: string;
  userId: string;
  userRole: string;
  onGroupSelect?: (group: GroupConversation) => void;
  className?: string;
}

type ViewMode = 'groups' | 'create' | 'invitations' | 'moderation';

export function GroupManagementDashboard({
  authToken,
  userId,
  userRole,
  onGroupSelect,
  className = '',
}: GroupManagementDashboardProps) {
  const {
    groups,
    invitations,
    templates,
    isLoading,
    error,
    createGroup,
    updateGroup,
    deleteGroup,
    respondToInvitation,
    sendInvitation,
    moderateParticipant,
    hasPermission,
    canModerate,
    getUserRole,
  } = useGroupManagement({
    authToken,
    userId,
    userRole,
    autoLoadGroups: true,
  });

  const [viewMode, setViewMode] = useState<ViewMode>('groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<GroupConversation | null>(null);
  const [showGroupActions, setShowGroupActions] = useState<string | null>(null);

  // Filter groups based on search
  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle group creation
  const handleGroupCreated = useCallback((group: GroupConversation) => {
    setViewMode('groups');
    onGroupSelect?.(group);
  }, [onGroupSelect]);

  // Handle invitation response
  const handleInvitationResponse = useCallback(async (invitationId: string, response: 'accept' | 'decline') => {
    try {
      await respondToInvitation(invitationId, response);
    } catch (error) {
      console.error('Failed to respond to invitation:', error);
    }
  }, [respondToInvitation]);

  // Get group type icon
  const getGroupTypeIcon = (type: GroupConversation['type']) => {
    switch (type) {
      case 'therapy_group':
        return <Shield className="h-4 w-4 text-green-600" />;
      case 'support_group':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'family_group':
        return <Users className="h-4 w-4 text-purple-600" />;
      case 'crisis_group':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: GroupParticipant['role']) => {
    switch (role) {
      case 'therapist':
        return 'bg-green-100 text-green-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      case 'guardian':
        return 'bg-purple-100 text-purple-800';
      case 'client':
        return 'bg-gray-100 text-gray-800';
      case 'observer':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render groups view
  const renderGroupsView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Groups</h2>
          <p className="text-gray-600">Manage your group conversations and settings</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setViewMode('invitations')}
            className="relative"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Invitations
            {invitations.filter(inv => inv.status === 'pending').length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {invitations.filter(inv => inv.status === 'pending').length}
              </Badge>
            )}
          </Button>
          
          <Button onClick={() => setViewMode('create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Groups Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => {
            const userRole = getUserRole(group.id);
            const canManage = hasPermission(group.id, 'manage_settings');
            
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer relative"
                onClick={() => onGroupSelect?.(group)}
                onMouseEnter={() => setShowGroupActions(group.id)}
                onMouseLeave={() => setShowGroupActions(null)}
              >
                {/* Group Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getGroupTypeIcon(group.type)}
                    <h3 className="font-semibold text-gray-900 truncate">{group.name}</h3>
                  </div>
                  
                  {/* Actions Menu */}
                  <AnimatePresence>
                    {showGroupActions === group.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute top-4 right-4 z-10"
                      >
                        <div className="flex items-center space-x-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onGroupSelect?.(group);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          
                          {canManage && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedGroup(group);
                              }}
                            >
                              <Settings className="h-3 w-3" />
                            </Button>
                          )}
                          
                          {hasPermission(group.id, 'invite') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Open invite modal
                              }}
                            >
                              <UserPlus className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Group Info */}
                <div className="space-y-3">
                  {group.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">
                          {group.participants.length}/{group.settings.maxParticipants}
                        </span>
                      </div>
                      
                      {group.settings.allowVideoCalls && (
                        <Video className="h-3 w-3 text-gray-400" />
                      )}
                      
                      {group.settings.hipaaCompliant && (
                        <Shield className="h-3 w-3 text-green-500" />
                      )}
                    </div>

                    <Badge className={getRoleBadgeColor(userRole || 'client')}>
                      {userRole}
                    </Badge>
                  </div>

                  {/* Type and Privacy */}
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {group.type.replace('_', ' ')}
                    </Badge>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      {group.settings.isPrivate && (
                        <span className="flex items-center space-x-1">
                          <Shield className="h-3 w-3" />
                          <span>Private</span>
                        </span>
                      )}
                      <span>
                        Updated {formatDistanceToNow(group.updatedAt, { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  {group.statistics.lastActivity && (
                    <div className="text-xs text-gray-500">
                      Last activity: {formatDistanceToNow(group.statistics.lastActivity, { addSuffix: true })}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No groups found' : 'No groups yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? 'Try adjusting your search terms'
              : 'Create your first group to start collaborating'
            }
          </p>
          {!searchQuery && (
            <Button onClick={() => setViewMode('create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          )}
        </div>
      )}
    </div>
  );

  // Render invitations view
  const renderInvitationsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Group Invitations</h2>
          <p className="text-gray-600">Manage your group invitations</p>
        </div>
        <Button variant="outline" onClick={() => setViewMode('groups')}>
          Back to Groups
        </Button>
      </div>

      {invitations.length > 0 ? (
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <motion.div
              key={invitation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">Group Invitation</h3>
                    <Badge 
                      variant={
                        invitation.status === 'pending' ? 'default' :
                        invitation.status === 'accepted' ? 'secondary' :
                        'outline'
                      }
                    >
                      {invitation.status}
                    </Badge>
                  </div>
                  
                  {invitation.message && (
                    <p className="text-sm text-gray-600 mb-2">{invitation.message}</p>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Invited {formatDistanceToNow(invitation.createdAt, { addSuffix: true })}
                    {invitation.expiresAt && (
                      <span> • Expires {formatDistanceToNow(invitation.expiresAt, { addSuffix: true })}</span>
                    )}
                  </div>
                </div>

                {invitation.status === 'pending' && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleInvitationResponse(invitation.id, 'decline')}
                    >
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleInvitationResponse(invitation.id, 'accept')}
                    >
                      Accept
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <UserCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No invitations</h3>
          <p className="text-gray-600">You don't have any group invitations at the moment</p>
        </div>
      )}
    </div>
  );

  // Render create group view
  const renderCreateView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create New Group</h2>
          <p className="text-gray-600">Set up a new group conversation</p>
        </div>
      </div>

      <GroupCreationForm
        authToken={authToken}
        userId={userId}
        userRole={userRole}
        templates={templates}
        onGroupCreated={handleGroupCreated}
        onCancel={() => setViewMode('groups')}
      />
    </div>
  );

  return (
    <div className={`max-w-7xl mx-auto p-6 ${className}`}>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'groups' && renderGroupsView()}
          {viewMode === 'invitations' && renderInvitationsView()}
          {viewMode === 'create' && renderCreateView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}