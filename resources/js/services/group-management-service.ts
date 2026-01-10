export interface GroupConversation {
  id: string;
  name: string;
  description?: string;
  type: 'therapy_group' | 'support_group' | 'family_group' | 'crisis_group' | 'general_group';
  avatar?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  settings: GroupSettings;
  participants: GroupParticipant[];
  moderators: string[];
  statistics: GroupStatistics;
  metadata: GroupMetadata;
}

export interface GroupSettings {
  isPrivate: boolean;
  requireApproval: boolean;
  allowInvites: boolean;
  allowFileSharing: boolean;
  allowVoiceCalls: boolean;
  allowVideoCalls: boolean;
  maxParticipants: number;
  messageRetention: number; // days
  moderationLevel: 'none' | 'basic' | 'strict' | 'therapeutic';
  autoModeration: boolean;
  profanityFilter: boolean;
  crisisDetection: boolean;
  hipaaCompliant: boolean;
  sessionRecording: boolean;
  anonymousMode: boolean;
  quietHours?: {
    enabled: boolean;
    start: string; // HH:MM
    end: string; // HH:MM
    timezone: string;
  };
}

export interface GroupParticipant {
  id: string;
  userId: string;
  name: string;
  role: 'therapist' | 'client' | 'guardian' | 'moderator' | 'observer';
  avatar?: string;
  joinedAt: Date;
  lastSeenAt?: Date;
  status: 'active' | 'inactive' | 'muted' | 'banned' | 'pending';
  permissions: GroupPermission[];
  metadata: ParticipantMetadata;
}

export interface GroupPermission {
  type: 'send_messages' | 'send_files' | 'start_calls' | 'moderate' | 'invite' | 'manage_settings' | 'view_history';
  granted: boolean;
  grantedBy?: string;
  grantedAt?: Date;
  expiresAt?: Date;
}

export interface ParticipantMetadata {
  messageCount: number;
  lastMessageAt?: Date;
  warningCount: number;
  muteCount: number;
  reportCount: number;
  engagementScore: number;
  therapeuticGoals?: string[];
  notes?: string;
}

export interface GroupStatistics {
  totalMessages: number;
  totalParticipants: number;
  activeParticipants: number;
  averageEngagement: number;
  lastActivity: Date;
  peakActivity: {
    hour: number;
    dayOfWeek: number;
    messageCount: number;
  };
  therapeuticMetrics?: {
    sessionCount: number;
    averageSessionDuration: number;
    progressIndicators: Record<string, number>;
  };
}

export interface GroupMetadata {
  tags: string[];
  category: string;
  therapeuticFocus?: string[];
  ageGroup?: 'child' | 'teen' | 'adult' | 'senior' | 'mixed';
  sessionSchedule?: {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    dayOfWeek?: number;
    time?: string;
    duration?: number; // minutes
  };
  crisisProtocol?: {
    enabled: boolean;
    escalationContacts: string[];
    emergencyProcedure: string;
  };
}

export interface GroupInvitation {
  id: string;
  groupId: string;
  invitedBy: string;
  invitedUser: string;
  invitedEmail?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
}

export interface ModerationAction {
  id: string;
  groupId: string;
  moderatorId: string;
  targetUserId: string;
  action: 'warn' | 'mute' | 'kick' | 'ban' | 'unban' | 'promote' | 'demote';
  reason: string;
  duration?: number; // minutes for temporary actions
  evidence?: string[]; // message IDs or file URLs
  createdAt: Date;
  expiresAt?: Date;
  reversedAt?: Date;
  reversedBy?: string;
}

export interface GroupReport {
  id: string;
  groupId: string;
  reportedBy: string;
  reportedUser?: string;
  reportedMessage?: string;
  type: 'inappropriate_content' | 'harassment' | 'spam' | 'crisis_concern' | 'privacy_violation' | 'other';
  description: string;
  evidence?: string[];
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  assignedTo?: string;
  resolution?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface GroupTemplate {
  id: string;
  name: string;
  description: string;
  type: GroupConversation['type'];
  settings: Partial<GroupSettings>;
  defaultRoles: Array<{
    role: GroupParticipant['role'];
    permissions: GroupPermission['type'][];
    maxCount?: number;
  }>;
  therapeuticFramework?: string;
  recommendedSize: {
    min: number;
    max: number;
    optimal: number;
  };
}

export class GroupManagementService {
  private baseUrl: string;
  private authToken: string;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config: { baseUrl: string; authToken: string }) {
    this.baseUrl = config.baseUrl;
    this.authToken = config.authToken;
  }

  // Group Creation and Management
  public async createGroup(data: {
    name: string;
    description?: string;
    type: GroupConversation['type'];
    settings?: Partial<GroupSettings>;
    initialParticipants?: string[];
    templateId?: string;
  }): Promise<GroupConversation> {
    try {
      const response = await fetch(`${this.baseUrl}/api/groups`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to create group: ${response.status}`);
      }

      const result = await response.json();
      this.emit('group-created', result.group);
      return result.group;
    } catch (error) {
      console.error('Failed to create group:', error);
      throw error;
    }
  }

  public async updateGroup(groupId: string, updates: {
    name?: string;
    description?: string;
    settings?: Partial<GroupSettings>;
    avatar?: string;
  }): Promise<GroupConversation> {
    try {
      const response = await fetch(`${this.baseUrl}/api/groups/${groupId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update group: ${response.status}`);
      }

      const result = await response.json();
      this.emit('group-updated', result.group);
      return result.group;
    } catch (error) {
      console.error('Failed to update group:', error);
      throw error;
    }
  }

  public async deleteGroup(groupId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete group: ${response.status}`);
      }

      this.emit('group-deleted', { groupId });
    } catch (error) {
      console.error('Failed to delete group:', error);
      throw error;
    }
  }

  public async getGroup(groupId: string): Promise<GroupConversation> {
    try {
      const response = await fetch(`${this.baseUrl}/api/groups/${groupId}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get group: ${response.status}`);
      }

      const result = await response.json();
      return result.group;
    } catch (error) {
      console.error('Failed to get group:', error);
      throw error;
    }
  }

  public async getUserGroups(filters?: {
    type?: GroupConversation['type'];
    role?: GroupParticipant['role'];
    status?: GroupParticipant['status'];
  }): Promise<GroupConversation[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.role) params.append('role', filters.role);
      if (filters?.status) params.append('status', filters.status);

      const response = await fetch(`${this.baseUrl}/api/groups?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get user groups: ${response.status}`);
      }

      const result = await response.json();
      return result.groups;
    } catch (error) {
      console.error('Failed to get user groups:', error);
      throw error;
    }
  }

  // Participant Management
  public async addParticipant(groupId: string, data: {
    userId: string;
    role: GroupParticipant['role'];
    permissions?: GroupPermission['type'][];
    message?: string;
  }): Promise<GroupParticipant> {
    try {
      const response = await fetch(`${this.baseUrl}/api/groups/${groupId}/participants`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to add participant: ${response.status}`);
      }

      const result = await response.json();
      this.emit('participant-added', { groupId, participant: result.participant });
      return result.participant;
    } catch (error) {
      console.error('Failed to add participant:', error);
      throw error;
    }
  }

  public async removeParticipant(groupId: string, participantId: string, reason?: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/groups/${groupId}/participants/${participantId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error(`Failed to remove participant: ${response.status}`);
      }

      this.emit('participant-removed', { groupId, participantId, reason });
    } catch (error) {
      console.error('Failed to remove participant:', error);
      throw error;
    }
  }

  public async updateParticipant(groupId: string, participantId: string, updates: {
    role?: GroupParticipant['role'];
    permissions?: GroupPermission[];
    status?: GroupParticipant['status'];
    notes?: string;
  }): Promise<GroupParticipant> {
    try {
      const response = await fetch(`${this.baseUrl}/api/groups/${groupId}/participants/${participantId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update participant: ${response.status}`);
      }

      const result = await response.json();
      this.emit('participant-updated', { groupId, participant: result.participant });
      return result.participant;
    } catch (error) {
      console.error('Failed to update participant:', error);
      throw error;
    }
  }

  // Invitations
  public async sendInvitation(data: {
    groupId: string;
    userId?: string;
    email?: string;
    role: GroupParticipant['role'];
    message?: string;
    expiresIn?: number; // hours
  }): Promise<GroupInvitation> {
    try {
      const response = await fetch(`${this.baseUrl}/api/groups/invitations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to send invitation: ${response.status}`);
      }

      const result = await response.json();
      this.emit('invitation-sent', result.invitation);
      return result.invitation;
    } catch (error) {
      console.error('Failed to send invitation:', error);
      throw error;
    }
  }

  public async respondToInvitation(invitationId: string, response: 'accept' | 'decline'): Promise<void> {
    try {
      const apiResponse = await fetch(`${this.baseUrl}/api/groups/invitations/${invitationId}/respond`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response }),
      });

      if (!apiResponse.ok) {
        throw new Error(`Failed to respond to invitation: ${apiResponse.status}`);
      }

      const result = await apiResponse.json();
      this.emit('invitation-responded', { invitationId, response, result });
    } catch (error) {
      console.error('Failed to respond to invitation:', error);
      throw error;
    }
  }

  public async getInvitations(filters?: {
    groupId?: string;
    status?: GroupInvitation['status'];
    sent?: boolean;
    received?: boolean;
  }): Promise<GroupInvitation[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.groupId) params.append('groupId', filters.groupId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.sent) params.append('sent', 'true');
      if (filters?.received) params.append('received', 'true');

      const response = await fetch(`${this.baseUrl}/api/groups/invitations?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get invitations: ${response.status}`);
      }

      const result = await response.json();
      return result.invitations;
    } catch (error) {
      console.error('Failed to get invitations:', error);
      throw error;
    }
  }

  // Moderation
  public async moderateParticipant(data: {
    groupId: string;
    targetUserId: string;
    action: ModerationAction['action'];
    reason: string;
    duration?: number;
    evidence?: string[];
  }): Promise<ModerationAction> {
    try {
      const response = await fetch(`${this.baseUrl}/api/groups/${data.groupId}/moderate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if !response.ok) {
        throw new Error(`Failed to moderate participant: ${response.status}`);
      }

      const result = await response.json();
      this.emit('moderation-action', result.action);
      return result.action;
    } catch (error) {
      console.error('Failed to moderate participant:', error);
      throw error;
    }
  }

  public async reportUser(data: {
    groupId: string;
    reportedUser?: string;
    reportedMessage?: string;
    type: GroupReport['type'];
    description: string;
    evidence?: string[];
  }): Promise<GroupReport> {
    try {
      const response = await fetch(`${this.baseUrl}/api/groups/${data.groupId}/reports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit report: ${response.status}`);
      }

      const result = await response.json();
      this.emit('report-submitted', result.report);
      return result.report;
    } catch (error) {
      console.error('Failed to submit report:', error);
      throw error;
    }
  }

  public async getModerationHistory(groupId: string, filters?: {
    targetUserId?: string;
    moderatorId?: string;
    action?: ModerationAction['action'];
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<ModerationAction[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.targetUserId) params.append('targetUserId', filters.targetUserId);
      if (filters?.moderatorId) params.append('moderatorId', filters.moderatorId);
      if (filters?.action) params.append('action', filters.action);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString());
      if (filters?.dateTo) params.append('dateTo', filters.dateTo.toISOString());

      const response = await fetch(`${this.baseUrl}/api/groups/${groupId}/moderation?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get moderation history: ${response.status}`);
      }

      const result = await response.json();
      return result.actions;
    } catch (error) {
      console.error('Failed to get moderation history:', error);
      throw error;
    }
  }

  // Templates
  public async getGroupTemplates(type?: GroupConversation['type']): Promise<GroupTemplate[]> {
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);

      const response = await fetch(`${this.baseUrl}/api/groups/templates?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get group templates: ${response.status}`);
      }

      const result = await response.json();
      return result.templates;
    } catch (error) {
      console.error('Failed to get group templates:', error);
      throw error;
    }
  }

  // Analytics
  public async getGroupAnalytics(groupId: string, period?: 'day' | 'week' | 'month' | 'year'): Promise<{
    engagement: Record<string, number>;
    participation: Record<string, number>;
    therapeutic: Record<string, number>;
    moderation: Record<string, number>;
  }> {
    try {
      const params = new URLSearchParams();
      if (period) params.append('period', period);

      const response = await fetch(`${this.baseUrl}/api/groups/${groupId}/analytics?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get group analytics: ${response.status}`);
      }

      const result = await response.json();
      return result.analytics;
    } catch (error) {
      console.error('Failed to get group analytics:', error);
      throw error;
    }
  }

  // Utility Methods
  public hasPermission(participant: GroupParticipant, permission: GroupPermission['type']): boolean {
    const perm = participant.permissions.find(p => p.type === permission);
    if (!perm) return false;

    if (!perm.granted) return false;
    if (perm.expiresAt && new Date() > perm.expiresAt) return false;

    return true;
  }

  public canModerate(participant: GroupParticipant, target: GroupParticipant): boolean {
    // Therapists can moderate everyone except other therapists
    if (participant.role === 'therapist') {
      return target.role !== 'therapist';
    }

    // Moderators can moderate clients and observers
    if (participant.role === 'moderator') {
      return ['client', 'observer'].includes(target.role);
    }

    // Guardians can moderate their own children (would need additional logic)
    if (participant.role === 'guardian') {
      return false; // Simplified for now
    }

    return false;
  }

  public getDefaultPermissions(role: GroupParticipant['role']): GroupPermission['type'][] {
    switch (role) {
      case 'therapist':
        return ['send_messages', 'send_files', 'start_calls', 'moderate', 'invite', 'manage_settings', 'view_history'];
      case 'moderator':
        return ['send_messages', 'send_files', 'start_calls', 'moderate', 'invite', 'view_history'];
      case 'guardian':
        return ['send_messages', 'send_files', 'view_history'];
      case 'client':
        return ['send_messages', 'send_files'];
      case 'observer':
        return ['view_history'];
      default:
        return ['send_messages'];
    }
  }

  // Event System
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
    this.eventListeners.clear();
  }
}