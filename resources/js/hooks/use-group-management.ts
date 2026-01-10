import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  GroupManagementService, 
  GroupConversation, 
  GroupParticipant, 
  GroupInvitation, 
  ModerationAction, 
  GroupReport, 
  GroupTemplate 
} from '@/services/group-management-service';

export interface UseGroupManagementOptions {
  baseUrl?: string;
  authToken: string;
  userId: string;
  userRole: string;
  autoLoadGroups?: boolean;
}

export interface UseGroupManagementReturn {
  // State
  groups: GroupConversation[];
  currentGroup: GroupConversation | null;
  invitations: GroupInvitation[];
  templates: GroupTemplate[];
  isLoading: boolean;
  error: string | null;
  
  // Group management
  createGroup: (data: {
    name: string;
    description?: string;
    type: GroupConversation['type'];
    settings?: any;
    initialParticipants?: string[];
    templateId?: string;
  }) => Promise<GroupConversation>;
  updateGroup: (groupId: string, updates: any) => Promise<GroupConversation>;
  deleteGroup: (groupId: string) => Promise<void>;
  selectGroup: (groupId: string | null) => void;
  refreshGroups: () => Promise<void>;
  
  // Participant management
  addParticipant: (groupId: string, data: {
    userId: string;
    role: GroupParticipant['role'];
    permissions?: string[];
    message?: string;
  }) => Promise<GroupParticipant>;
  removeParticipant: (groupId: string, participantId: string, reason?: string) => Promise<void>;
  updateParticipant: (groupId: string, participantId: string, updates: any) => Promise<GroupParticipant>;
  
  // Invitations
  sendInvitation: (data: {
    groupId: string;
    userId?: string;
    email?: string;
    role: GroupParticipant['role'];
    message?: string;
  }) => Promise<GroupInvitation>;
  respondToInvitation: (invitationId: string, response: 'accept' | 'decline') => Promise<void>;
  refreshInvitations: () => Promise<void>;
  
  // Moderation
  moderateParticipant: (data: {
    groupId: string;
    targetUserId: string;
    action: ModerationAction['action'];
    reason: string;
    duration?: number;
    evidence?: string[];
  }) => Promise<ModerationAction>;
  reportUser: (data: {
    groupId: string;
    reportedUser?: string;
    reportedMessage?: string;
    type: GroupReport['type'];
    description: string;
    evidence?: string[];
  }) => Promise<GroupReport>;
  
  // Utilities
  hasPermission: (groupId: string, permission: string) => boolean;
  canModerate: (groupId: string, targetUserId: string) => boolean;
  getUserRole: (groupId: string) => GroupParticipant['role'] | null;
  getParticipant: (groupId: string, userId: string) => GroupParticipant | null;
  
  // Events
  onGroupCreated: (callback: (group: GroupConversation) => void) => () => void;
  onGroupUpdated: (callback: (group: GroupConversation) => void) => () => void;
  onParticipantAdded: (callback: (data: { groupId: string; participant: GroupParticipant }) => void) => () => void;
  onParticipantRemoved: (callback: (data: { groupId: string; participantId: string }) => void) => () => void;
  onModerationAction: (callback: (action: ModerationAction) => void) => () => void;
}

export function useGroupManagement(options: UseGroupManagementOptions): UseGroupManagementReturn {
  const {
    baseUrl = '/api',
    authToken,
    userId,
    userRole,
    autoLoadGroups = true,
  } = options;

  // State
  const [groups, setGroups] = useState<GroupConversation[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
  const [templates, setTemplates] = useState<GroupTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const serviceRef = useRef<GroupManagementService | null>(null);
  const eventUnsubscribersRef = useRef<(() => void)[]>([]);

  // Computed values
  const currentGroup = currentGroupId ? groups.find(g => g.id === currentGroupId) || null : null;

  // Initialize service
  useEffect(() => {
    const service = new GroupManagementService({
      baseUrl,
      authToken,
    });

    serviceRef.current = service;
    setupEventListeners(service);

    if (autoLoadGroups) {
      loadInitialData();
    }

    return () => {
      cleanup();
    };
  }, [baseUrl, authToken, autoLoadGroups]);

  const setupEventListeners = useCallback((service: GroupManagementService) => {
    const unsubscribers: (() => void)[] = [];

    unsubscribers.push(
      service.on('group-created', (group: GroupConversation) => {
        setGroups(prev => [...prev, group]);
      })
    );

    unsubscribers.push(
      service.on('group-updated', (group: GroupConversation) => {
        setGroups(prev => prev.map(g => g.id === group.id ? group : g));
      })
    );

    unsubscribers.push(
      service.on('group-deleted', (data: { groupId: string }) => {
        setGroups(prev => prev.filter(g => g.id !== data.groupId));
        if (currentGroupId === data.groupId) {
          setCurrentGroupId(null);
        }
      })
    );

    unsubscribers.push(
      service.on('participant-added', (data: { groupId: string; participant: GroupParticipant }) => {
        setGroups(prev => prev.map(g => 
          g.id === data.groupId 
            ? { ...g, participants: [...g.participants, data.participant] }
            : g
        ));
      })
    );

    unsubscribers.push(
      service.on('participant-removed', (data: { groupId: string; participantId: string }) => {
        setGroups(prev => prev.map(g => 
          g.id === data.groupId 
            ? { ...g, participants: g.participants.filter(p => p.id !== data.participantId) }
            : g
        ));
      })
    );

    unsubscribers.push(
      service.on('participant-updated', (data: { groupId: string; participant: GroupParticipant }) => {
        setGroups(prev => prev.map(g => 
          g.id === data.groupId 
            ? { 
                ...g, 
                participants: g.participants.map(p => 
                  p.id === data.participant.id ? data.participant : p
                )
              }
            : g
        ));
      })
    );

    unsubscribers.push(
      service.on('invitation-sent', (invitation: GroupInvitation) => {
        setInvitations(prev => [...prev, invitation]);
      })
    );

    eventUnsubscribersRef.current = unsubscribers;
  }, [currentGroupId]);

  const cleanup = useCallback(() => {
    eventUnsubscribersRef.current.forEach(unsubscribe => unsubscribe());
    eventUnsubscribersRef.current = [];

    if (serviceRef.current) {
      serviceRef.current.destroy();
      serviceRef.current = null;
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    if (!serviceRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const [userGroups, userInvitations, groupTemplates] = await Promise.all([
        serviceRef.current.getUserGroups(),
        serviceRef.current.getInvitations({ received: true, status: 'pending' }),
        serviceRef.current.getGroupTemplates(),
      ]);

      setGroups(userGroups);
      setInvitations(userInvitations);
      setTemplates(groupTemplates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Group management
  const createGroup = useCallback(async (data: {
    name: string;
    description?: string;
    type: GroupConversation['type'];
    settings?: any;
    initialParticipants?: string[];
    templateId?: string;
  }): Promise<GroupConversation> => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const group = await serviceRef.current.createGroup(data);
      return group;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create group';
      setError(error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateGroup = useCallback(async (groupId: string, updates: any): Promise<GroupConversation> => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    try {
      const group = await serviceRef.current.updateGroup(groupId, updates);
      return group;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update group');
      throw err;
    }
  }, []);

  const deleteGroup = useCallback(async (groupId: string): Promise<void> => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    try {
      await serviceRef.current.deleteGroup(groupId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete group');
      throw err;
    }
  }, []);

  const selectGroup = useCallback((groupId: string | null) => {
    setCurrentGroupId(groupId);
  }, []);

  const refreshGroups = useCallback(async () => {
    if (!serviceRef.current) return;

    try {
      const userGroups = await serviceRef.current.getUserGroups();
      setGroups(userGroups);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh groups');
    }
  }, []);

  // Participant management
  const addParticipant = useCallback(async (groupId: string, data: {
    userId: string;
    role: GroupParticipant['role'];
    permissions?: string[];
    message?: string;
  }): Promise<GroupParticipant> => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    try {
      const participant = await serviceRef.current.addParticipant(groupId, data);
      return participant;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add participant');
      throw err;
    }
  }, []);

  const removeParticipant = useCallback(async (groupId: string, participantId: string, reason?: string): Promise<void> => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    try {
      await serviceRef.current.removeParticipant(groupId, participantId, reason);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove participant');
      throw err;
    }
  }, []);

  const updateParticipant = useCallback(async (groupId: string, participantId: string, updates: any): Promise<GroupParticipant> => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    try {
      const participant = await serviceRef.current.updateParticipant(groupId, participantId, updates);
      return participant;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update participant');
      throw err;
    }
  }, []);

  // Invitations
  const sendInvitation = useCallback(async (data: {
    groupId: string;
    userId?: string;
    email?: string;
    role: GroupParticipant['role'];
    message?: string;
  }): Promise<GroupInvitation> => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    try {
      const invitation = await serviceRef.current.sendInvitation(data);
      return invitation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
      throw err;
    }
  }, []);

  const respondToInvitation = useCallback(async (invitationId: string, response: 'accept' | 'decline'): Promise<void> => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    try {
      await serviceRef.current.respondToInvitation(invitationId, response);
      
      // Update local invitations
      setInvitations(prev => prev.map(inv => 
        inv.id === invitationId 
          ? { ...inv, status: response === 'accept' ? 'accepted' : 'declined' }
          : inv
      ));

      // Refresh groups if accepted
      if (response === 'accept') {
        await refreshGroups();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to respond to invitation');
      throw err;
    }
  }, [refreshGroups]);

  const refreshInvitations = useCallback(async () => {
    if (!serviceRef.current) return;

    try {
      const userInvitations = await serviceRef.current.getInvitations({ received: true });
      setInvitations(userInvitations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh invitations');
    }
  }, []);

  // Moderation
  const moderateParticipant = useCallback(async (data: {
    groupId: string;
    targetUserId: string;
    action: ModerationAction['action'];
    reason: string;
    duration?: number;
    evidence?: string[];
  }): Promise<ModerationAction> => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    try {
      const action = await serviceRef.current.moderateParticipant(data);
      return action;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to moderate participant');
      throw err;
    }
  }, []);

  const reportUser = useCallback(async (data: {
    groupId: string;
    reportedUser?: string;
    reportedMessage?: string;
    type: GroupReport['type'];
    description: string;
    evidence?: string[];
  }): Promise<GroupReport> => {
    if (!serviceRef.current) {
      throw new Error('Service not initialized');
    }

    try {
      const report = await serviceRef.current.reportUser(data);
      return report;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report');
      throw err;
    }
  }, []);

  // Utilities
  const hasPermission = useCallback((groupId: string, permission: string): boolean => {
    if (!serviceRef.current) return false;

    const group = groups.find(g => g.id === groupId);
    if (!group) return false;

    const participant = group.participants.find(p => p.userId === userId);
    if (!participant) return false;

    return serviceRef.current.hasPermission(participant, permission as any);
  }, [groups, userId]);

  const canModerate = useCallback((groupId: string, targetUserId: string): boolean => {
    if (!serviceRef.current) return false;

    const group = groups.find(g => g.id === groupId);
    if (!group) return false;

    const currentParticipant = group.participants.find(p => p.userId === userId);
    const targetParticipant = group.participants.find(p => p.userId === targetUserId);
    
    if (!currentParticipant || !targetParticipant) return false;

    return serviceRef.current.canModerate(currentParticipant, targetParticipant);
  }, [groups, userId]);

  const getUserRole = useCallback((groupId: string): GroupParticipant['role'] | null => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return null;

    const participant = group.participants.find(p => p.userId === userId);
    return participant?.role || null;
  }, [groups, userId]);

  const getParticipant = useCallback((groupId: string, participantUserId: string): GroupParticipant | null => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return null;

    return group.participants.find(p => p.userId === participantUserId) || null;
  }, [groups]);

  // Event handlers
  const onGroupCreated = useCallback((callback: (group: GroupConversation) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('group-created', callback);
  }, []);

  const onGroupUpdated = useCallback((callback: (group: GroupConversation) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('group-updated', callback);
  }, []);

  const onParticipantAdded = useCallback((callback: (data: { groupId: string; participant: GroupParticipant }) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('participant-added', callback);
  }, []);

  const onParticipantRemoved = useCallback((callback: (data: { groupId: string; participantId: string }) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('participant-removed', callback);
  }, []);

  const onModerationAction = useCallback((callback: (action: ModerationAction) => void) => {
    if (!serviceRef.current) return () => {};
    return serviceRef.current.on('moderation-action', callback);
  }, []);

  return {
    // State
    groups,
    currentGroup,
    invitations,
    templates,
    isLoading,
    error,
    
    // Group management
    createGroup,
    updateGroup,
    deleteGroup,
    selectGroup,
    refreshGroups,
    
    // Participant management
    addParticipant,
    removeParticipant,
    updateParticipant,
    
    // Invitations
    sendInvitation,
    respondToInvitation,
    refreshInvitations,
    
    // Moderation
    moderateParticipant,
    reportUser,
    
    // Utilities
    hasPermission,
    canModerate,
    getUserRole,
    getParticipant,
    
    // Events
    onGroupCreated,
    onGroupUpdated,
    onParticipantAdded,
    onParticipantRemoved,
    onModerationAction,
  };
}