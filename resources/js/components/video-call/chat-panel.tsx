import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RoomParticipant } from '@/services/webrtc-signaling-service';
import { 
  X, 
  Send, 
  Smile, 
  Paperclip,
  Crown,
  Shield,
  User,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'therapeutic';
}

interface ChatPanelProps {
  roomId: string;
  participants: RoomParticipant[];
  onClose: () => void;
  className?: string;
}

export function ChatPanel({ 
  roomId, 
  participants, 
  onClose, 
  className = '' 
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: 'system',
      senderName: 'SafeSpace',
      senderRole: 'system',
      message: 'Welcome to your secure therapy session. All messages are confidential.',
      timestamp: new Date(),
      type: 'system'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'therapist':
        return <Crown className="h-3 w-3 text-yellow-400" />;
      case 'guardian':
        return <Shield className="h-3 w-3 text-blue-400" />;
      case 'system':
        return <AlertTriangle className="h-3 w-3 text-purple-400" />;
      default:
        return <User className="h-3 w-3 text-gray-400" />;
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'You',
      senderRole: 'client', // This would come from user context
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Here you would send the message through WebRTC data channel or socket
    console.log('Sending message:', message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageBubbleStyle = (message: ChatMessage) => {
    if (message.type === 'system') {
      return 'bg-purple-100 text-purple-800 border border-purple-200';
    }
    if (message.type === 'therapeutic') {
      return 'bg-green-100 text-green-800 border border-green-200';
    }
    if (message.senderId === 'current-user') {
      return 'bg-blue-500 text-white ml-auto';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const therapeuticPrompts = [
    "How are you feeling right now?",
    "What would you like to focus on today?",
    "Can you tell me more about that?",
    "That sounds challenging. How did you handle it?",
    "What support do you need right now?"
  ];

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="flex-shrink-0 pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Session Chat</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Secure, confidential messaging during your session
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${getMessageBubbleStyle(message)}`}>
                {message.senderId !== 'current-user' && message.type !== 'system' && (
                  <div className="flex items-center space-x-1 mb-1">
                    {getRoleIcon(message.senderRole)}
                    <span className="text-xs font-medium">{message.senderName}</span>
                  </div>
                )}
                <p className="text-sm">{message.message}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === 'current-user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-3 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Therapeutic Quick Responses */}
        <div className="px-4 py-2 border-t bg-green-50">
          <p className="text-xs font-medium text-green-800 mb-2">💚 Therapeutic Prompts</p>
          <div className="flex flex-wrap gap-1">
            {therapeuticPrompts.slice(0, 3).map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setNewMessage(prompt)}
                className="text-xs h-6 px-2 bg-white border-green-200 text-green-700 hover:bg-green-100"
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0"
                    title="Add emoji"
                  >
                    <Smile className="h-4 w-4 text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0"
                    title="Attach file"
                  >
                    <Paperclip className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
                <span className="text-xs text-gray-400">
                  {newMessage.length}/500
                </span>
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="w-10 h-10 p-0 rounded-lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="px-4 py-2 bg-gray-50 border-t">
          <p className="text-xs text-gray-600 text-center">
            🔒 All messages are encrypted and confidential
          </p>
        </div>
      </CardContent>
    </Card>
  );
}