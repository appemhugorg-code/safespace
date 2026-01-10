import { useState, useEffect, useCallback, useRef } from 'react';
import { MessagingService, Message, Conversation, ConversationParticipant, TypingIndicator, MessageFormatting, MessageAttachment } from '@/services/messaging-service';

export interface UseMessagingOptions {
  serverUrl?: string;
  userId: string;
  userRole: string;
  authToken: string;
  autoConnect?: boolean;
}

export interface UseMessagingReturn {
  // Connection state
  isConnected: boolean;
  connectionStatus: string;
  
  // Data
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  typingUsers: TypingIndicator[];
  
  // Actions
  sendMessage: (content: string, options?: {
    type?: Message['type'];
    formatting?: MessageFormatting;
    attachments?: MessageAttachment[];
    replyTo?: string;
  }) => Promise<Message>;
  editMessage: (messageId: string, content: string, formatting?: MessageFormatting) => Promise<Message>;
  deleteMessage: (messageId: string) => Promise<void>;
  addReaction: (messageId: string, emoji: string) => Promise<void>;
  removeReaction: (messageId: string, emoji: string) => Promise<void>;
  
  // Conversation management
  createConversation: (data: {
    type: Conversation['type'];
    name?: string;
    description?: string;
    participantIds: string[];
  }) => Promise<Conversation>;
  selectConversation: (conversationId: string | null) => void;
  joinConversation: (conversationId: string) => Promise<void>;
  leaveConversation: (conversationId: string) => Promise<void>;
  
  // Typing indicators
  startTyping: () => void;
  stopTyping: () => void;
  
  // Message status
  markAsRead: (messageIds: string[]) => void;
  
  // Utility
  connect: () => void;
  disconnect: () => void;
  
  // Event handlers
  onMessageReceived: (callback: (message: Message) => void) => () => void;
  onConversationUpdated: (callback: (conversation: Conversation) => void) => () => void;
  onTypingChanged: (callback: (users: TypingIndicator[]) => void) => () => void;
}

export function useMessaging(options: UseMessagingOptions): UseMessagingReturn {
  const {
    serverUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001',
    userId,
    userRole,
    authToken,
    autoConnect = true,
  } = options;

  // State
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);

  // Refs
  const messagingServiceRef = useRef<MessagingService | null>(null);
  const eventUnsubscribersRef = useRef<(() => void)[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Computed values
  const currentConversation = currentConversationId 
    ? conversations.find(c => c.id === currentConversationId) || null
    : null;

  // Initialize messaging service
  useEffect(() => {
    if (!userId || !authToken) return;

    const service = new MessagingService({
      serverUrl,
      userId,
      userRole,
      authToken,
    });

    messagingServiceRef.current = service;

    // Set up event listeners
    setupEventListeners(service);

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [serverUrl, userId, userRole, authToken]);

  // Auto-connect
  useEffect(() => {
    if (autoConnect && messagingServiceRef.current) {
      // Service auto-connects on creation
    }
  }, [autoConnect]);

  // Update messages when conversation changes
  useEffect(() => {
    if (currentConversationId && messagingServiceRef.current) {
      const conversationMessages = messagingServiceRef.current.getMessages(currentConversationId);
      setMessages(conversationMessages);
      
      const conversationTypingUsers = messagingServiceRef.current.getTypingUsers(currentConversationId);
      setTypingUsers(conversationTypingUsers);
    } else {
      setMessages([]);
      setTypingUsers([]);
    }
  }, [currentConversationId]);

  const setupEventListeners = useCallback((service: MessagingService) => {
    const unsubscribers: (() => void)[] = [];

    // Connection events
    unsubscribers.push(
      service.on('connected', () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        
        // Load conversations when connected
        const allConversations = service.getConversations();
        setConversations(allConversations);
      })
    );

    unsubscribers.push(
      service.on('disconnected', () => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
      })
    );

    unsubscribers.push(
      service.on('connection-status-changed', (data: { status: string }) => {
        setConnectionStatus(data.status);
        setIsConnected(data.status === 'connected');
      })
    );

    // Message events
    unsubscribers.push(
      service.on('message-received', (message: Message) => {
        // Update conversations list
        const allConversations = service.getConversations();
        setConversations(allConversations);
        
        // Update messages if it's for current conversation
        if (message.conversationId === currentConversationId) {
          const conversationMessages = service.getMessages(message.conversationId);
          setMessages(conversationMessages);
        }
      })
    );

    unsubscribers.push(
      service.on('message-updated', (message: Message) => {
        if (message.conversationId === currentConversationId) {
          const conversationMessages = service.getMessages(message.conversationId);
          setMessages(conversationMessages);
        }
      })
    );

    unsubscribers.push(
      service.on('message-deleted', (data: { messageId: string; conversationId: string }) => {
        if (data.conversationId === currentConversationId) {
          const conversationMessages = service.getMessages(data.conversationId);
          setMessages(conversationMessages);
        }
      })
    );

    unsubscribers.push(
      service.on('message-reaction-added', () => {
        if (currentConversationId) {
          const conversationMessages = service.getMessages(currentConversationId);
          setMessages(conversationMessages);
        }
      })
    );

    // Conversation events
    unsubscribers.push(
      service.on('conversation-created', (conversation: Conversation) => {
        const allConversations = service.getConversations();
        setConversations(allConversations);
      })
    );

    unsubscribers.push(
      service.on('conversation-updated', (conversation: Conversation) => {
        const allConversations = service.getConversations();
        setConversations(allConversations);
      })
    );

    unsubscribers.push(
      service.on('participant-joined', () => {
        const allConversations = service.getConversations();
        setConversations(allConversations);
      })
    );

    unsubscribers.push(
      service.on('participant-left', () => {
        const allConversations = service.getConversations();
        setConversations(allConversations);
      })
    );

    // Typing events
    unsubscribers.push(
      service.on('typing-start', (data: TypingIndicator) => {
        if (data.conversationId === currentConversationId) {
          const conversationTypingUsers = service.getTypingUsers(data.conversationId);
          setTypingUsers(conversationTypingUsers);
        }
      })
    );

    unsubscribers.push(
      service.on('typing-stop', (data: { userId: string; conversationId: string }) => {
        if (data.conversationId === currentConversationId) {
          const conversationTypingUsers = service.getTypingUsers(data.conversationId);
          setTypingUsers(conversationTypingUsers);
        }
      })
    );

    eventUnsubscribersRef.current = unsubscribers;
  }, [currentConversationId]);

  const cleanup = useCallback(() => {
    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Unsubscribe from events
    eventUnsubscribersRef.current.forEach(unsubscribe => unsubscribe());
    eventUnsubscribersRef.current = [];

    // Disconnect service
    if (messagingServiceRef.current) {
      messagingServiceRef.current.destroy();
      messagingServiceRef.current = null;
    }
  }, []);

  // Actions
  const sendMessage = useCallback(async (content: string, options: {
    type?: Message['type'];
    formatting?: MessageFormatting;
    attachments?: MessageAttachment[];
    replyTo?: string;
  } = {}): Promise<Message> => {
    if (!messagingServiceRef.current || !currentConversationId) {
      throw new Error('No active conversation or messaging service not available');
    }

    const message = await messagingServiceRef.current.sendMessage(currentConversationId, content, options);
    
    // Update local messages
    const conversationMessages = messagingServiceRef.current.getMessages(currentConversationId);
    setMessages(conversationMessages);
    
    return message;
  }, [currentConversationId]);

  const editMessage = useCallback(async (messageId: string, content: string, formatting?: MessageFormatting): Promise<Message> => {
    if (!messagingServiceRef.current) {
      throw new Error('Messaging service not available');
    }

    const message = await messagingServiceRef.current.editMessage(messageId, content, formatting);
    
    // Update local messages
    if (currentConversationId) {
      const conversationMessages = messagingServiceRef.current.getMessages(currentConversationId);
      setMessages(conversationMessages);
    }
    
    return message;
  }, [currentConversationId]);

  const deleteMessage = useCallback(async (messageId: string): Promise<void> => {
    if (!messagingServiceRef.current) {
      throw new Error('Messaging service not available');
    }

    await messagingServiceRef.current.deleteMessage(messageId);
    
    // Update local messages
    if (currentConversationId) {
      const conversationMessages = messagingServiceRef.current.getMessages(currentConversationId);
      setMessages(conversationMessages);
    }
  }, [currentConversationId]);

  const addReaction = useCallback(async (messageId: string, emoji: string): Promise<void> => {
    if (!messagingServiceRef.current) {
      throw new Error('Messaging service not available');
    }

    await messagingServiceRef.current.addReaction(messageId, emoji);
  }, []);

  const removeReaction = useCallback(async (messageId: string, emoji: string): Promise<void> => {
    if (!messagingServiceRef.current) {
      throw new Error('Messaging service not available');
    }

    await messagingServiceRef.current.removeReaction(messageId, emoji);
  }, []);

  const createConversation = useCallback(async (data: {
    type: Conversation['type'];
    name?: string;
    description?: string;
    participantIds: string[];
  }): Promise<Conversation> => {
    if (!messagingServiceRef.current) {
      throw new Error('Messaging service not available');
    }

    const conversation = await messagingServiceRef.current.createConversation(data);
    
    // Update local conversations
    const allConversations = messagingServiceRef.current.getConversations();
    setConversations(allConversations);
    
    return conversation;
  }, []);

  const selectConversation = useCallback((conversationId: string | null) => {
    setCurrentConversationId(conversationId);
    
    // Mark messages as read when selecting conversation
    if (conversationId && messagingServiceRef.current) {
      const conversationMessages = messagingServiceRef.current.getMessages(conversationId);
      const unreadMessageIds = conversationMessages
        .filter(m => m.senderId !== userId && m.status !== 'read')
        .map(m => m.id);
      
      if (unreadMessageIds.length > 0) {
        markAsRead(unreadMessageIds);
      }
    }
  }, [userId]);

  const joinConversation = useCallback(async (conversationId: string): Promise<void> => {
    if (!messagingServiceRef.current) {
      throw new Error('Messaging service not available');
    }

    await messagingServiceRef.current.joinConversation(conversationId);
    
    // Update local conversations
    const allConversations = messagingServiceRef.current.getConversations();
    setConversations(allConversations);
  }, []);

  const leaveConversation = useCallback(async (conversationId: string): Promise<void> => {
    if (!messagingServiceRef.current) {
      throw new Error('Messaging service not available');
    }

    await messagingServiceRef.current.leaveConversation(conversationId);
    
    // Update local conversations
    const allConversations = messagingServiceRef.current.getConversations();
    setConversations(allConversations);
    
    // Clear current conversation if leaving it
    if (conversationId === currentConversationId) {
      setCurrentConversationId(null);
    }
  }, [currentConversationId]);

  const startTyping = useCallback(() => {
    if (!messagingServiceRef.current || !currentConversationId) return;
    
    messagingServiceRef.current.startTyping(currentConversationId);
    
    // Auto-stop typing after 3 seconds
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [currentConversationId]);

  const stopTyping = useCallback(() => {
    if (!messagingServiceRef.current || !currentConversationId) return;
    
    messagingServiceRef.current.stopTyping(currentConversationId);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [currentConversationId]);

  const markAsRead = useCallback((messageIds: string[]) => {
    if (!messagingServiceRef.current || !currentConversationId) return;
    
    messagingServiceRef.current.markAsRead(currentConversationId, messageIds);
  }, [currentConversationId]);

  const connect = useCallback(() => {
    if (messagingServiceRef.current) {
      // Service handles reconnection automatically
      messagingServiceRef.current.connect?.();
    }
  }, []);

  const disconnect = useCallback(() => {
    if (messagingServiceRef.current) {
      messagingServiceRef.current.disconnect();
    }
  }, []);

  // Event handlers for external use
  const onMessageReceived = useCallback((callback: (message: Message) => void) => {
    if (!messagingServiceRef.current) {
      return () => {};
    }
    
    return messagingServiceRef.current.on('message-received', callback);
  }, []);

  const onConversationUpdated = useCallback((callback: (conversation: Conversation) => void) => {
    if (!messagingServiceRef.current) {
      return () => {};
    }
    
    return messagingServiceRef.current.on('conversation-updated', callback);
  }, []);

  const onTypingChanged = useCallback((callback: (users: TypingIndicator[]) => void) => {
    if (!messagingServiceRef.current) {
      return () => {};
    }
    
    const unsubscribeStart = messagingServiceRef.current.on('typing-start', () => {
      if (currentConversationId) {
        const users = messagingServiceRef.current!.getTypingUsers(currentConversationId);
        callback(users);
      }
    });
    
    const unsubscribeStop = messagingServiceRef.current.on('typing-stop', () => {
      if (currentConversationId) {
        const users = messagingServiceRef.current!.getTypingUsers(currentConversationId);
        callback(users);
      }
    });
    
    return () => {
      unsubscribeStart();
      unsubscribeStop();
    };
  }, [currentConversationId]);

  return {
    // Connection state
    isConnected,
    connectionStatus,
    
    // Data
    conversations,
    currentConversation,
    messages,
    typingUsers,
    
    // Actions
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    
    // Conversation management
    createConversation,
    selectConversation,
    joinConversation,
    leaveConversation,
    
    // Typing indicators
    startTyping,
    stopTyping,
    
    // Message status
    markAsRead,
    
    // Utility
    connect,
    disconnect,
    
    // Event handlers
    onMessageReceived,
    onConversationUpdated,
    onTypingChanged,
  };
}