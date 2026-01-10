import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Reply, 
  Edit, 
  Trash2, 
  Copy, 
  Download,
  Eye,
  EyeOff,
  Clock,
  Check,
  CheckCheck,
  Smile
} from 'lucide-react';
import { Message, MessageReaction, MessageAttachment } from '@/services/messaging-service';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  onReply?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
  onReaction?: (messageId: string, emoji: string) => void;
  onRemoveReaction?: (messageId: string, emoji: string) => void;
  className?: string;
}

const QUICK_REACTIONS = ['👍', '❤️', '😊', '😢', '😮', '😡'];

export function MessageItem({
  message,
  isOwn,
  showAvatar = true,
  showTimestamp = true,
  onReply,
  onEdit,
  onDelete,
  onReaction,
  onRemoveReaction,
  className = '',
}: MessageItemProps) {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showFullReactions, setShowFullReactions] = useState(false);

  const formatMessageContent = useCallback((content: string, formatting?: Message['formatting']): JSX.Element => {
    if (!formatting) {
      return <span>{content}</span>;
    }

    // Create an array of text segments with their formatting
    const segments: Array<{
      text: string;
      start: number;
      end: number;
      formats: Array<{ type: string; value?: string }>;
    }> = [];

    // Split content into characters for processing
    const chars = Array.from(content);
    
    for (let i = 0; i < chars.length; i++) {
      const formats: Array<{ type: string; value?: string }> = [];
      
      // Check each formatting type
      if (formatting.bold) {
        formatting.bold.forEach(range => {
          if (i >= range.start && i < range.end) {
            formats.push({ type: 'bold' });
          }
        });
      }
      
      if (formatting.italic) {
        formatting.italic.forEach(range => {
          if (i >= range.start && i < range.end) {
            formats.push({ type: 'italic' });
          }
        });
      }
      
      if (formatting.underline) {
        formatting.underline.forEach(range => {
          if (i >= range.start && i < range.end) {
            formats.push({ type: 'underline' });
          }
        });
      }
      
      if (formatting.strikethrough) {
        formatting.strikethrough.forEach(range => {
          if (i >= range.start && i < range.end) {
            formats.push({ type: 'strikethrough' });
          }
        });
      }
      
      if (formatting.code) {
        formatting.code.forEach(range => {
          if (i >= range.start && i < range.end) {
            formats.push({ type: 'code' });
          }
        });
      }
      
      if (formatting.links) {
        formatting.links.forEach(range => {
          if (i >= range.start && i < range.end) {
            formats.push({ type: 'link', value: range.url });
          }
        });
      }
      
      if (formatting.colors) {
        formatting.colors.forEach(range => {
          if (i >= range.start && i < range.end) {
            formats.push({ type: 'color', value: range.color });
          }
        });
      }

      // Find or create segment
      const lastSegment = segments[segments.length - 1];
      const formatsKey = JSON.stringify(formats);
      
      if (lastSegment && JSON.stringify(lastSegment.formats) === formatsKey) {
        // Extend existing segment
        lastSegment.text += chars[i];
        lastSegment.end = i + 1;
      } else {
        // Create new segment
        segments.push({
          text: chars[i],
          start: i,
          end: i + 1,
          formats,
        });
      }
    }

    // Render segments with formatting
    return (
      <>
        {segments.map((segment, index) => {
          let element: JSX.Element = <span key={index}>{segment.text}</span>;
          
          segment.formats.forEach(format => {
            switch (format.type) {
              case 'bold':
                element = <strong key={`${index}-bold`}>{element}</strong>;
                break;
              case 'italic':
                element = <em key={`${index}-italic`}>{element}</em>;
                break;
              case 'underline':
                element = <u key={`${index}-underline`}>{element}</u>;
                break;
              case 'strikethrough':
                element = <s key={`${index}-strikethrough`}>{element}</s>;
                break;
              case 'code':
                element = (
                  <code key={`${index}-code`} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                    {element}
                  </code>
                );
                break;
              case 'link':
                element = (
                  <a
                    key={`${index}-link`}
                    href={format.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {element}
                  </a>
                );
                break;
              case 'color':
                element = (
                  <span key={`${index}-color`} style={{ color: format.value }}>
                    {element}
                  </span>
                );
                break;
            }
          });
          
          return element;
        })}
      </>
    );
  }, []);

  const renderAttachment = useCallback((attachment: MessageAttachment) => {
    switch (attachment.type) {
      case 'image':
        return (
          <div key={attachment.id} className="mt-2">
            <img
              src={attachment.url}
              alt={attachment.name}
              className="max-w-xs max-h-60 rounded-lg border border-gray-200"
              loading="lazy"
            />
          </div>
        );
      
      case 'video':
        return (
          <div key={attachment.id} className="mt-2">
            <video
              src={attachment.url}
              controls
              className="max-w-xs max-h-60 rounded-lg border border-gray-200"
            >
              Your browser does not support video playback.
            </video>
          </div>
        );
      
      case 'audio':
        return (
          <div key={attachment.id} className="mt-2">
            <audio src={attachment.url} controls className="w-full max-w-xs">
              Your browser does not support audio playback.
            </audio>
          </div>
        );
      
      default:
        return (
          <div key={attachment.id} className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 max-w-xs">
            <div className="flex items-center space-x-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{attachment.name}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(attachment.size)} • {attachment.mimeType}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
    }
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'failed':
        return <span className="text-xs text-red-500">Failed</span>;
      default:
        return null;
    }
  };

  const handleReaction = (emoji: string) => {
    const existingReaction = message.reactions?.find(
      r => r.emoji === emoji && r.userId === 'current-user' // This would come from auth context
    );

    if (existingReaction) {
      onRemoveReaction?.(message.id, emoji);
    } else {
      onReaction?.(message.id, emoji);
    }
    
    setShowReactions(false);
  };

  const groupedReactions = message.reactions?.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {} as Record<string, MessageReaction[]>) || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative ${isOwn ? 'ml-auto' : 'mr-auto'} ${className}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} space-x-2`}>
        {/* Avatar */}
        {showAvatar && !isOwn && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {message.senderName.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {/* Message Content */}
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-md`}>
          {/* Sender Name & Role */}
          {!isOwn && (
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-900">{message.senderName}</span>
              <Badge variant="secondary" className="text-xs">
                {message.senderRole}
              </Badge>
            </div>
          )}

          {/* Reply Context */}
          {message.replyTo && (
            <div className="mb-2 p-2 bg-gray-100 rounded border-l-2 border-gray-300 text-sm text-gray-600">
              <p className="truncate">Replying to previous message...</p>
            </div>
          )}

          {/* Message Bubble */}
          <div
            className={`relative px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-blue-600 text-white'
                : message.type === 'system'
                ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {/* Message Content */}
            <div className="text-sm leading-relaxed">
              {formatMessageContent(message.content, message.formatting)}
            </div>

            {/* Attachments */}
            {message.attachments?.map(renderAttachment)}

            {/* Edited Indicator */}
            {message.editedAt && (
              <div className="mt-1 text-xs opacity-70">
                (edited)
              </div>
            )}
          </div>

          {/* Reactions */}
          {Object.keys(groupedReactions).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(groupedReactions).map(([emoji, reactions]) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="flex items-center space-x-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
                >
                  <span>{emoji}</span>
                  <span className="text-gray-600">{reactions.length}</span>
                </button>
              ))}
              
              {Object.keys(groupedReactions).length > 3 && !showFullReactions && (
                <button
                  onClick={() => setShowFullReactions(true)}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-600"
                >
                  +{Object.keys(groupedReactions).length - 3}
                </button>
              )}
            </div>
          )}

          {/* Timestamp & Status */}
          {showTimestamp && (
            <div className={`flex items-center space-x-1 mt-1 text-xs text-gray-500 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <span>{formatDistanceToNow(message.timestamp, { addSuffix: true })}</span>
              {isOwn && getStatusIcon()}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`absolute top-0 ${isOwn ? 'left-0' : 'right-0'} flex items-center space-x-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1`}
          >
            {/* Quick Reactions */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReactions(!showReactions)}
              >
                <Smile className="h-4 w-4" />
              </Button>
              
              <AnimatePresence>
                {showReactions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute bottom-full left-0 mb-1 flex space-x-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2"
                  >
                    {QUICK_REACTIONS.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(emoji)}
                        className="p-1 hover:bg-gray-100 rounded text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reply */}
            {onReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply(message)}
              >
                <Reply className="h-4 w-4" />
              </Button>
            )}

            {/* Edit (own messages only) */}
            {isOwn && onEdit && message.type === 'text' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(message)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}

            {/* Delete */}
            {(isOwn || message.senderRole === 'admin') && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(message.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            {/* Copy */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(message.content)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}