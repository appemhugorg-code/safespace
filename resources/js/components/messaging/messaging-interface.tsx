import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Video, 
  Info, 
  Settings, 
  UserPlus,
  Search,
  MoreVertical,
  ArrowLeft,
  Users,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { useMessaging } from '@/hooks/use-messaging';
import { ConversationList } from './conversation-list';
import { MessageItem } from './message-item';
import { RichTextEditor } from './rich-text-editor';
import { Message, Conversation, TypingIndicator } from '@/services/messaging-service';
import { motion, AnimatePresence } from 'framer-motion';

interface MessagingInterfaceProps {
  userId: string;
  userRole: string;
  authToken: string;
  serverUrl?: string;
  onVideoCall?: (conversationId: string) => void;
  onVoiceCall?: (conversationId: string) => void;
  className?: string;
}

export function MessagingInterface({
  userId,
  userRole,
  authToken,
  serverUrl,
  onVideoCall,
  onVoiceCall,
  className = '',
}: MessagingInterfaceProps) {
  const {
    isConnected,
    connectionStatus,
    conversations,
    currentConversation,
    messages,
    typingUsers,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    createConversation,
    selectConversation,
    startTyping,
    stopTyping,
  } = useMessaging({
    userId,
    userRole,
    authToken,
    serverUrl,
    autoConnect: true,
  });

  const [messageInput, setMessageInput] = useState('');
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowConversationList(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Hide conversation list on mobile when conversation is selected
  useEffect(() => {
    if (isMobile && currentConversation) {
      setShowConversationList(false);
    }
  }, [isMobile, currentConversation]);

  const handleSendMessage = useCallback(async (content: string, formatting?: any, attachments?: any[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;

    try {
      const options: any = {};
      
      if (formatting) {
        options.formatting = formatting;
      }
      
      if (attachments && attachments.length > 0) {
        options.attachments = attachments;
      }
      
      if (replyingTo) {
        options.replyTo = replyingTo.id;
      }

      await sendMessage(content, options);
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [sendMessage, replyingTo]);

  const handleEditMessage = useCallback(async (messageId: string, content: string, formatting?: any) => {
    try {
      await editMessage(messageId, content, formatting);
      setEditingMessage(null);
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  }, [editMessage]);

  const handleDeleteMessage = useCallback(async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  }, [deleteMessage]);

  const handleReaction = useCallback(async (messageId: string, emoji: string) => {
    try {
      await addReaction(messageId, emoji);
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  }, [addReaction]);

  const handleRemoveReaction = useCallback(async (messageId: string, emoji: string) => {
    try {
      await removeReaction(messageId, emoji);
    } catch (error) {
      console.error('Failed to remove reaction:', error);
    }
  }, [removeReaction]);

  const handleCreateConversation = useCallback(() => {
    // This would open a modal or dialog to create a new conversation
    console.log('Create conversation');
  }, []);

  const handleSelectConversation = useCallback((conversationId: string) => {
    selectConversation(conversationId);
    
    if (isMobile) {
      setShowConversationList(false);
    }
  }, [selectConversation, isMobile]);

  const handleBackToList = useCallback(() => {
    if (isMobile) {
      setShowConversationList(true);
      selectConversation(null);
    }
  }, [isMobile, selectConversation]);

  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) {
      return conversation.name;
    }

    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants.find(p => p.id !== userId);
      return otherParticipant?.name || 'Unknown User';
    }

    const participantNames = conversation.participants
      .slice(0, 3)
      .map(p => p.name)
      .join(', ');
    
    if (conversation.participants.length > 3) {
      return `${participantNames} +${conversation.participants.length - 3}`;
    }
    
    return participantNames || 'Group Chat';
  };

  const renderTypingIndicator = () => {
    if (typingUsers.length === 0) return null;

    const names = typingUsers.map(u => u.userName).join(', ');
    const text = typingUsers.length === 1 
      ? `${names} is typing...`
      : `${names} are typing...`;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-500"
      >
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span>{text}</span>
      </motion.div>
    );
  };

  return (
    <div className={`flex h-full bg-white ${className}`}>
      {/* Conversation List */}
      <AnimatePresence>
        {(showConversationList || !isMobile) && (
          <motion.div
            initial={isMobile ? { x: -300 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -300 } : false}
            className={`${isMobile ? 'absolute inset-y-0 left-0 z-50 w-80' : 'w-80'} flex-shrink-0`}
          >
            <ConversationList
              conversations={conversations}
              selectedConversationId={currentConversation?.id || null}
              onSelectConversation={handleSelectConversation}
              onCreateConversation={handleCreateConversation}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                {/* Back button for mobile */}
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToList}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}

                {/* Conversation info */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {getConversationName(currentConversation).charAt(0).toUpperCase()}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {getConversationName(currentConversation)}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {currentConversation.type.replace('_', ' ')}
                      </Badge>
                      
                      {currentConversation.metadata?.isEmergency && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Emergency
                        </Badge>
                      )}
                      
                      {currentConversation.type === 'therapy_session' && (
                        <Badge variant="outline" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          HIPAA Compliant
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                {/* Call buttons */}
                {(currentConversation.type === 'direct' || currentConversation.type === 'therapy_session') && (
                  <>
                    {onVoiceCall && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onVoiceCall(currentConversation.id)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {onVideoCall && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onVideoCall(currentConversation.id)}
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                )}

                {/* Participants */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowParticipants(!showParticipants)}
                >
                  <Users className="h-4 w-4" />
                  <span className="ml-1 text-sm">{currentConversation.participants.length}</span>
                </Button>

                {/* More options */}
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Connection Status */}
            {!isConnected && (
              <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200">
                <div className="flex items-center space-x-2 text-sm text-yellow-800">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  <span>Reconnecting... ({connectionStatus})</span>
                </div>
              </div>
            )}

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((message, index) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === userId}
                  showAvatar={
                    index === 0 || 
                    messages[index - 1].senderId !== message.senderId ||
                    (new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime()) > 300000 // 5 minutes
                  }
                  onReply={setReplyingTo}
                  onEdit={setEditingMessage}
                  onDelete={handleDeleteMessage}
                  onReaction={handleReaction}
                  onRemoveReaction={handleRemoveReaction}
                />
              ))}
              
              {/* Typing indicator */}
              <AnimatePresence>
                {renderTypingIndicator()}
              </AnimatePresence>
              
              <div ref={messagesEndRef} />
            </div>

            {/* Reply context */}
            <AnimatePresence>
              {replyingTo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-2 bg-gray-50 border-t border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Replying to</span>
                      <span className="text-sm font-medium">{replyingTo.senderName}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(null)}
                    >
                      ×
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700 truncate mt-1">
                    {replyingTo.content}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <RichTextEditor
                value={messageInput}
                onChange={(value) => setMessageInput(value)}
                onSend={handleSendMessage}
                onTypingStart={startTyping}
                onTypingStop={stopTyping}
                disabled={!isConnected}
                placeholder={
                  currentConversation.type === 'therapy_session'
                    ? 'Share your thoughts in this secure, HIPAA-compliant space...'
                    : 'Type your message...'
                }
              />
            </div>
          </>
        ) : (
          /* No conversation selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-600 mb-4">
                Choose a conversation from the list to start messaging
              </p>
              <Button onClick={handleCreateConversation}>
                Start New Conversation
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Participants Panel */}
      <AnimatePresence>
        {showParticipants && currentConversation && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="w-80 border-l border-gray-200 bg-white p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Participants</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowParticipants(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-3">
              {currentConversation.participants.map(participant => (
                <div key={participant.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{participant.name}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {participant.role}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${
                        participant.status === 'online' ? 'bg-green-500' :
                        participant.status === 'away' ? 'bg-yellow-500' :
                        participant.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                      }`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}