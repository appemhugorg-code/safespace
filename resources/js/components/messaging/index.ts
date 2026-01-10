export { MessagingService } from '@/services/messaging-service';
export { useMessaging } from '@/hooks/use-messaging';
export { MessagingInterface } from './messaging-interface';
export { ConversationList } from './conversation-list';
export { MessageItem } from './message-item';
export { RichTextEditor } from './rich-text-editor';

export type {
  Message,
  Conversation,
  ConversationParticipant,
  MessageFormatting,
  MessageAttachment,
  MessageReaction,
  TypingIndicator,
  MessageDeliveryStatus,
} from '@/services/messaging-service';

export type {
  UseMessagingOptions,
  UseMessagingReturn,
} from '@/hooks/use-messaging';