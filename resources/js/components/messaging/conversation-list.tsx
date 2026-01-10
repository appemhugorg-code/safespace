import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  MessageCircle, 
  Users, 
  Video, 
  AlertTriangle,
  Archive,
  VolumeX,
  Pin,
  MoreHorizontal
} from 'lucide-react';
import { Conversation, ConversationParticipant } from '@/services/messaging-service';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation: () => void;
  onArchiveConversation?: (conversationId: string) => void;
  onMuteConversation?: (conversationId: string) => void;
  onPinConversation?: (conversationId: string) => void;
  className?: string;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onCreateConversation,
  onArchiveConversation,
  onMuteConversation,
  onPinConversation,
  className = '',
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');
  const [showActions, setShowActions] = useState<string | null>(null);

  // Filter and search conversations
  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Apply filter
    switch (filter) {
      case 'unread':
        filtered = filtered.filter(c => c.unreadCount > 0);
        break;
      case 'archived':
        filtered = filtered.filter(c => c.isArchived);
        break;
      default:
        filtered = filtered.filter(c => !c.isArchived);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name?.toLowerCase().includes(query) ||
        c.participants.some(p => p.name.toLowerCase().includes(query)) ||
        c.lastMessage?.content.toLowerCase().includes(query)
      );
    }

    // Sort by last message time (pinned first)
    return filtered.sort((a, b) => {
      // Pinned conversations first
      if (a.metadata?.isPinned && !b.metadata?.isPinned) return -1;
      if (!a.metadata?.isPinned && b.metadata?.isPinned) return 1;
      
      // Then by last message time
      const aTime = a.lastMessage?.timestamp || a.updatedAt;
      const bTime = b.lastMessage?.timestamp || b.updatedAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  }, [conversations, searchQuery, filter]);

  const getConversationIcon = (conversation: Conversation) => {
    switch (conversation.type) {
      case 'group':
        return <Users className="h-4 w-4" />;
      case 'therapy_session':
        return <Video className="h-4 w-4" />;
      case 'crisis_support':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) {
      return conversation.name;
    }

    // For direct conversations, show other participant's name
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants.find(p => p.id !== 'current-user'); // This would come from auth context
      return otherParticipant?.name || 'Unknown User';
    }

    // For group conversations, show participant names
    const participantNames = conversation.participants
      .slice(0, 3)
      .map(p => p.name)
      .join(', ');
    
    if (conversation.participants.length > 3) {
      return `${participantNames} +${conversation.participants.length - 3}`;
    }
    
    return participantNames || 'Group Chat';
  };

  const getLastMessagePreview = (conversation: Conversation) => {
    if (!conversation.lastMessage) {
      return 'No messages yet';
    }

    const message = conversation.lastMessage;
    let preview = message.content;

    // Handle different message types
    switch (message.type) {
      case 'file':
        preview = '📎 File attachment';
        break;
      case 'image':
        preview = '🖼️ Image';
        break;
      case 'emoji':
        preview = message.content;
        break;
      case 'system':
        preview = `System: ${message.content}`;
        break;
    }

    // Truncate long messages
    if (preview.length > 50) {
      preview = preview.substring(0, 50) + '...';
    }

    return preview;
  };

  const getParticipantStatus = (participants: ConversationParticipant[]) => {
    const onlineCount = participants.filter(p => p.status === 'online').length;
    const totalCount = participants.length;
    
    if (onlineCount === 0) {
      return 'Offline';
    } else if (onlineCount === totalCount) {
      return 'Online';
    } else {
      return `${onlineCount}/${totalCount} online`;
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white border-r border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCreateConversation}
            className="text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-1 mt-3">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread
          </Button>
          <Button
            variant={filter === 'archived' ? 'ghost' : 'ghost'}
            size="sm"
            onClick={() => setFilter('archived')}
          >
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`relative p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversationId === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => onSelectConversation(conversation.id)}
              onMouseEnter={() => setShowActions(conversation.id)}
              onMouseLeave={() => setShowActions(null)}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar/Icon */}
                <div className="flex-shrink-0 relative">
                  {conversation.type === 'direct' ? (
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {getConversationName(conversation).charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                      {getConversationIcon(conversation)}
                    </div>
                  )}
                  
                  {/* Online indicator for direct conversations */}
                  {conversation.type === 'direct' && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {getConversationName(conversation)}
                      </h3>
                      
                      {/* Conversation indicators */}
                      <div className="flex items-center space-x-1">
                        {conversation.metadata?.isPinned && (
                          <Pin className="h-3 w-3 text-gray-400" />
                        )}
                        {conversation.isMuted && (
                          <VolumeX className="h-3 w-3 text-gray-400" />
                        )}
                        {conversation.metadata?.isEmergency && (
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                    </div>

                    {/* Timestamp */}
                    <span className="text-xs text-gray-500">
                      {conversation.lastMessage 
                        ? formatDistanceToNow(conversation.lastMessage.timestamp, { addSuffix: false })
                        : formatDistanceToNow(conversation.updatedAt, { addSuffix: false })
                      }
                    </span>
                  </div>

                  {/* Last message preview */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {getLastMessagePreview(conversation)}
                    </p>

                    {/* Unread count */}
                    {conversation.unreadCount > 0 && (
                      <Badge variant="default" className="ml-2 bg-blue-600">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </Badge>
                    )}
                  </div>

                  {/* Participant status for group conversations */}
                  {conversation.type !== 'direct' && (
                    <p className="text-xs text-gray-500 mt-1">
                      {getParticipantStatus(conversation.participants)}
                    </p>
                  )}

                  {/* Conversation type badge */}
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {conversation.type.replace('_', ' ')}
                    </Badge>
                    
                    {conversation.metadata?.tags?.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Menu */}
              <AnimatePresence>
                {showActions === conversation.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute top-2 right-2"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {filteredConversations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageCircle className="h-12 w-12 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No conversations found</h3>
            <p className="text-sm text-center mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Start a new conversation to begin messaging'
              }
            </p>
            {!searchQuery && (
              <Button onClick={onCreateConversation} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{conversations.length} conversations</span>
          <span>
            {conversations.reduce((sum, c) => sum + c.unreadCount, 0)} unread
          </span>
        </div>
      </div>
    </div>
  );
}