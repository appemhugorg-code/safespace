import { io, Socket } from 'socket.io-client';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'therapist' | 'client' | 'guardian' | 'admin';
  content: string;
  type: 'text' | 'rich_text' | 'file' | 'image' | 'emoji' | 'system';
  formatting?: MessageFormatting;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  replyTo?: string;
  editedAt?: Date;
  deletedAt?: Date;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  metadata?: {
    mentions?: string[];
    hashtags?: string[];
    links?: string[];
    isPrivate?: boolean;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
  };
}

export interface MessageFormatting {
  bold?: Array<{ start: number; end: number }>;
  italic?: Array<{ start: number; end: number }>;
  underline?: Array<{ start: number; end: number }>;
  strikethrough?: Array<{ start: number; end: number }>;
  code?: Array<{ start: number; end: number }>;
  links?: Array<{ start: number; end: number; url: string }>;
  mentions?: Array<{ start: number; end: number; userId: string }>;
  colors?: Array<{ start: number; end: number; color: string }>;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'audio' | 'video' | 'other';
  size: number;
  url: string;
  thumbnailUrl?: string;
  mimeType: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    pages?: number;
  };
}

export interface MessageReaction {
  id: string;
  emoji: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'therapy_session' | 'crisis_support';
  name?: string;
  description?: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  isArchived: boolean;
  isMuted: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    sessionId?: string;
    appointmentId?: string;
    isEmergency?: boolean;
    tags?: string[];
  };
}

export interface ConversationParticipant {
  id: string;
  name: string;
  role: 'therapist' | 'client' | 'guardian' | 'admin';
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  permissions: ('read' | 'write' | 'moderate' | 'admin')[];
  joinedAt: Date;
  lastSeenAt?: Date;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  conversationId: string;
  timestamp: Date;
}

export interface MessageDeliveryStatus {
  messageId: string;
  userId: string;
  status: 'sent' | 'delivered' | 'read';
  timestamp: Date;
}

export class MessagingService {
  private socket: Socket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private conversations: Map<string, Conversation> = new Map();
  private messages: Map<string, Message[]> = new Map();
  private typingUsers: Map<string, TypingIndicator[]> = new Map();
  private connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error' = 'disconnected';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(private config: {
    serverUrl: string;
    userId: string;
    userRole: string;
    authToken: string;
  }) {
    this.connect();
  }

  // Connection Management
  private connect(): void {
    try {
      this.connectionStatus = 'connecting';
      
      this.socket = io(this.config.serverUrl, {
        auth: {
          token: this.config.authToken,
          userId: this.config.userId,
          userRole: this.config.userRole,
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true,
      });

      this.setupSocketEventListeners();
      this.emit('connection-status-changed', { status: 'connecting' });

    } catch (error) {
      console.error('Failed to connect to messaging service:', error);
      this.connectionStatus = 'error';
      this.emit('connection-error', error);
      this.scheduleReconnect();
    }
  }

  private setupSocketEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to messaging service');
      this.connectionStatus = 'connected';
      this.reconnectAttempts = 0;
      this.emit('connected');
      this.emit('connection-status-changed', { status: 'connected' });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from messaging service:', reason);
      this.connectionStatus = 'disconnected';
      this.emit('disconnected', { reason });
      this.emit('connection-status-changed', { status: 'disconnected' });
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't reconnect automatically
        return;
      }
      
      this.scheduleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.connectionStatus = 'error';
      this.emit('connection-error', error);
      this.scheduleReconnect();
    });

    // Message events
    this.socket.on('message', (message: Message) => {
      this.handleIncomingMessage(message);
    });

    this.socket.on('message-updated', (message: Message) => {
      this.handleMessageUpdate(message);
    });

    this.socket.on('message-deleted', (data: { messageId: string; conversationId: string }) => {
      this.handleMessageDeletion(data);
    });

    this.socket.on('message-reaction', (data: { messageId: string; reaction: MessageReaction }) => {
      this.handleMessageReaction(data);
    });

    // Conversation events
    this.socket.on('conversation-created', (conversation: Conversation) => {
      this.handleConversationCreated(conversation);
    });

    this.socket.on('conversation-updated', (conversation: Conversation) => {
      this.handleConversationUpdated(conversation);
    });

    this.socket.on('participant-joined', (data: { conversationId: string; participant: ConversationParticipant }) => {
      this.handleParticipantJoined(data);
    });

    this.socket.on('participant-left', (data: { conversationId: string; participantId: string }) => {
      this.handleParticipantLeft(data);
    });

    // Typing indicators
    this.socket.on('typing-start', (data: TypingIndicator) => {
      this.handleTypingStart(data);
    });

    this.socket.on('typing-stop', (data: { userId: string; conversationId: string }) => {
      this.handleTypingStop(data);
    });

    // Delivery status
    this.socket.on('message-status', (status: MessageDeliveryStatus) => {
      this.handleMessageStatus(status);
    });

    // Presence updates
    this.socket.on('user-status-changed', (data: { userId: string; status: string }) => {
      this.handleUserStatusChanged(data);
    });
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('max-reconnect-attempts-reached');
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      if (this.connectionStatus !== 'connected') {
        this.connect();
      }
    }, delay);
  }

  // Message Operations
  public async sendMessage(conversationId: string, content: string, options: {
    type?: Message['type'];
    formatting?: MessageFormatting;
    attachments?: MessageAttachment[];
    replyTo?: string;
    metadata?: Message['metadata'];
  } = {}): Promise<Message> {
    if (!this.socket || this.connectionStatus !== 'connected') {
      throw new Error('Not connected to messaging service');
    }

    const message: Omit<Message, 'id' | 'timestamp' | 'status'> = {
      conversationId,
      senderId: this.config.userId,
      senderName: 'Current User', // This would come from user context
      senderRole: this.config.userRole as any,
      content,
      type: options.type || 'text',
      formatting: options.formatting,
      attachments: options.attachments,
      reactions: [],
      replyTo: options.replyTo,
      metadata: options.metadata,
    };

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Message send timeout'));
      }, 10000);

      this.socket!.emit('send-message', message, (response: { success: boolean; message?: Message; error?: string }) => {
        clearTimeout(timeout);
        
        if (response.success && response.message) {
          resolve(response.message);
        } else {
          reject(new Error(response.error || 'Failed to send message'));
        }
      });
    });
  }

  public async editMessage(messageId: string, content: string, formatting?: MessageFormatting): Promise<Message> {
    if (!this.socket || this.connectionStatus !== 'connected') {
      throw new Error('Not connected to messaging service');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Message edit timeout'));
      }, 5000);

      this.socket!.emit('edit-message', { messageId, content, formatting }, (response: { success: boolean; message?: Message; error?: string }) => {
        clearTimeout(timeout);
        
        if (response.success && response.message) {
          resolve(response.message);
        } else {
          reject(new Error(response.error || 'Failed to edit message'));
        }
      });
    });
  }

  public async deleteMessage(messageId: string): Promise<void> {
    if (!this.socket || this.connectionStatus !== 'connected') {
      throw new Error('Not connected to messaging service');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Message delete timeout'));
      }, 5000);

      this.socket!.emit('delete-message', { messageId }, (response: { success: boolean; error?: string }) => {
        clearTimeout(timeout);
        
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to delete message'));
        }
      });
    });
  }

  public async addReaction(messageId: string, emoji: string): Promise<void> {
    if (!this.socket || this.connectionStatus !== 'connected') {
      throw new Error('Not connected to messaging service');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Add reaction timeout'));
      }, 5000);

      this.socket!.emit('add-reaction', { messageId, emoji }, (response: { success: boolean; error?: string }) => {
        clearTimeout(timeout);
        
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to add reaction'));
        }
      });
    });
  }

  public async removeReaction(messageId: string, emoji: string): Promise<void> {
    if (!this.socket || this.connectionStatus !== 'connected') {
      throw new Error('Not connected to messaging service');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Remove reaction timeout'));
      }, 5000);

      this.socket!.emit('remove-reaction', { messageId, emoji }, (response: { success: boolean; error?: string }) => {
        clearTimeout(timeout);
        
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to remove reaction'));
        }
      });
    });
  }

  // Conversation Operations
  public async createConversation(data: {
    type: Conversation['type'];
    name?: string;
    description?: string;
    participantIds: string[];
    metadata?: Conversation['metadata'];
  }): Promise<Conversation> {
    if (!this.socket || this.connectionStatus !== 'connected') {
      throw new Error('Not connected to messaging service');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Create conversation timeout'));
      }, 10000);

      this.socket!.emit('create-conversation', data, (response: { success: boolean; conversation?: Conversation; error?: string }) => {
        clearTimeout(timeout);
        
        if (response.success && response.conversation) {
          resolve(response.conversation);
        } else {
          reject(new Error(response.error || 'Failed to create conversation'));
        }
      });
    });
  }

  public async joinConversation(conversationId: string): Promise<void> {
    if (!this.socket || this.connectionStatus !== 'connected') {
      throw new Error('Not connected to messaging service');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Join conversation timeout'));
      }, 5000);

      this.socket!.emit('join-conversation', { conversationId }, (response: { success: boolean; error?: string }) => {
        clearTimeout(timeout);
        
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to join conversation'));
        }
      });
    });
  }

  public async leaveConversation(conversationId: string): Promise<void> {
    if (!this.socket || this.connectionStatus !== 'connected') {
      throw new Error('Not connected to messaging service');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Leave conversation timeout'));
      }, 5000);

      this.socket!.emit('leave-conversation', { conversationId }, (response: { success: boolean; error?: string }) => {
        clearTimeout(timeout);
        
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to leave conversation'));
        }
      });
    });
  }

  // Typing Indicators
  public startTyping(conversationId: string): void {
    if (!this.socket || this.connectionStatus !== 'connected') return;
    
    this.socket.emit('typing-start', { conversationId });
  }

  public stopTyping(conversationId: string): void {
    if (!this.socket || this.connectionStatus !== 'connected') return;
    
    this.socket.emit('typing-stop', { conversationId });
  }

  // Message Status
  public markAsRead(conversationId: string, messageIds: string[]): void {
    if (!this.socket || this.connectionStatus !== 'connected') return;
    
    this.socket.emit('mark-as-read', { conversationId, messageIds });
  }

  // Data Access
  public getConversations(): Conversation[] {
    return Array.from(this.conversations.values());
  }

  public getConversation(conversationId: string): Conversation | null {
    return this.conversations.get(conversationId) || null;
  }

  public getMessages(conversationId: string): Message[] {
    return this.messages.get(conversationId) || [];
  }

  public getTypingUsers(conversationId: string): TypingIndicator[] {
    return this.typingUsers.get(conversationId) || [];
  }

  public getConnectionStatus(): string {
    return this.connectionStatus;
  }

  // Event Handlers
  private handleIncomingMessage(message: Message): void {
    const conversationMessages = this.messages.get(message.conversationId) || [];
    conversationMessages.push(message);
    this.messages.set(message.conversationId, conversationMessages);

    // Update conversation last message
    const conversation = this.conversations.get(message.conversationId);
    if (conversation) {
      conversation.lastMessage = message;
      conversation.updatedAt = message.timestamp;
      
      // Increment unread count if not from current user
      if (message.senderId !== this.config.userId) {
        conversation.unreadCount++;
      }
      
      this.conversations.set(message.conversationId, conversation);
    }

    this.emit('message-received', message);
  }

  private handleMessageUpdate(message: Message): void {
    const conversationMessages = this.messages.get(message.conversationId) || [];
    const index = conversationMessages.findIndex(m => m.id === message.id);
    
    if (index !== -1) {
      conversationMessages[index] = message;
      this.messages.set(message.conversationId, conversationMessages);
      this.emit('message-updated', message);
    }
  }

  private handleMessageDeletion(data: { messageId: string; conversationId: string }): void {
    const conversationMessages = this.messages.get(data.conversationId) || [];
    const index = conversationMessages.findIndex(m => m.id === data.messageId);
    
    if (index !== -1) {
      conversationMessages.splice(index, 1);
      this.messages.set(data.conversationId, conversationMessages);
      this.emit('message-deleted', data);
    }
  }

  private handleMessageReaction(data: { messageId: string; reaction: MessageReaction }): void {
    // Find and update the message with the new reaction
    for (const [conversationId, messages] of this.messages.entries()) {
      const message = messages.find(m => m.id === data.messageId);
      if (message) {
        if (!message.reactions) {
          message.reactions = [];
        }
        
        // Remove existing reaction from same user with same emoji
        message.reactions = message.reactions.filter(
          r => !(r.userId === data.reaction.userId && r.emoji === data.reaction.emoji)
        );
        
        // Add new reaction
        message.reactions.push(data.reaction);
        
        this.emit('message-reaction-added', { messageId: data.messageId, reaction: data.reaction });
        break;
      }
    }
  }

  private handleConversationCreated(conversation: Conversation): void {
    this.conversations.set(conversation.id, conversation);
    this.messages.set(conversation.id, []);
    this.emit('conversation-created', conversation);
  }

  private handleConversationUpdated(conversation: Conversation): void {
    this.conversations.set(conversation.id, conversation);
    this.emit('conversation-updated', conversation);
  }

  private handleParticipantJoined(data: { conversationId: string; participant: ConversationParticipant }): void {
    const conversation = this.conversations.get(data.conversationId);
    if (conversation) {
      conversation.participants.push(data.participant);
      this.conversations.set(data.conversationId, conversation);
      this.emit('participant-joined', data);
    }
  }

  private handleParticipantLeft(data: { conversationId: string; participantId: string }): void {
    const conversation = this.conversations.get(data.conversationId);
    if (conversation) {
      conversation.participants = conversation.participants.filter(p => p.id !== data.participantId);
      this.conversations.set(data.conversationId, conversation);
      this.emit('participant-left', data);
    }
  }

  private handleTypingStart(data: TypingIndicator): void {
    if (data.userId === this.config.userId) return; // Ignore own typing
    
    const typingUsers = this.typingUsers.get(data.conversationId) || [];
    const existingIndex = typingUsers.findIndex(u => u.userId === data.userId);
    
    if (existingIndex !== -1) {
      typingUsers[existingIndex] = data;
    } else {
      typingUsers.push(data);
    }
    
    this.typingUsers.set(data.conversationId, typingUsers);
    this.emit('typing-start', data);
  }

  private handleTypingStop(data: { userId: string; conversationId: string }): void {
    const typingUsers = this.typingUsers.get(data.conversationId) || [];
    const filteredUsers = typingUsers.filter(u => u.userId !== data.userId);
    
    this.typingUsers.set(data.conversationId, filteredUsers);
    this.emit('typing-stop', data);
  }

  private handleMessageStatus(status: MessageDeliveryStatus): void {
    // Update message status in local storage
    for (const [conversationId, messages] of this.messages.entries()) {
      const message = messages.find(m => m.id === status.messageId);
      if (message) {
        message.status = status.status;
        this.emit('message-status-updated', status);
        break;
      }
    }
  }

  private handleUserStatusChanged(data: { userId: string; status: string }): void {
    // Update participant status in all conversations
    for (const [conversationId, conversation] of this.conversations.entries()) {
      const participant = conversation.participants.find(p => p.id === data.userId);
      if (participant) {
        participant.status = data.status as any;
        this.emit('user-status-changed', data);
      }
    }
  }

  // Event System
  public on(event: string, callback: Function): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
    
    // Return unsubscribe function
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

  public off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
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

  // Cleanup
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.connectionStatus = 'disconnected';
    this.conversations.clear();
    this.messages.clear();
    this.typingUsers.clear();
    this.eventListeners.clear();
  }

  public destroy(): void {
    this.disconnect();
  }
}