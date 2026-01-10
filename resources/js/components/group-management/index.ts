// Group Management Components
export { GroupCreationForm } from './group-creation-form';
export { GroupManagementDashboard } from './group-management-dashboard';
export { ParticipantManagement } from './participant-management';
export { ModerationTools } from './moderation-tools';
export { GroupSettingsComponent as GroupSettings } from './group-settings';
export { InvitationManagement } from './invitation-management';

// Re-export types for convenience
export type {
  GroupConversation,
  GroupParticipant,
  GroupSettings,
  GroupInvitation,
  ModerationAction,
  GroupReport,
  GroupTemplate,
} from '@/services/group-management-service';