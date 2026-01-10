import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code, 
  Link, 
  AtSign,
  Smile,
  Paperclip,
  Send,
  Mic,
  MicOff,
  Type,
  Palette
} from 'lucide-react';
import { MessageFormatting, MessageAttachment } from '@/services/messaging-service';
import { motion, AnimatePresence } from 'framer-motion';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string, formatting?: MessageFormatting) => void;
  onSend: (content: string, formatting?: MessageFormatting, attachments?: MessageAttachment[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  showFormatting?: boolean;
  showAttachments?: boolean;
  showEmoji?: boolean;
  showVoiceMessage?: boolean;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  className?: string;
}

interface FormatRange {
  start: number;
  end: number;
  type: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'link' | 'mention' | 'color';
  value?: string; // For links, mentions, colors
}

const EMOJI_CATEGORIES = {
  'Smileys & People': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙'],
  'Animals & Nature': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔'],
  'Food & Drink': ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒'],
  'Activities': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳'],
  'Travel & Places': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🛼'],
  'Objects': ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥'],
};

const THERAPEUTIC_COLORS = [
  '#2563EB', // Therapeutic Blue
  '#93C5FD', // Soft Sky
  '#6366F1', // Therapeutic Indigo
  '#C4B5FD', // Gentle Lavender
  '#10B981', // Healing Green
  '#F59E0B', // Warm Amber
  '#EF4444', // Alert Red
  '#6B7280', // Neutral Gray
];

export function RichTextEditor({
  value,
  onChange,
  onSend,
  placeholder = 'Type your message...',
  disabled = false,
  maxLength = 2000,
  showFormatting = true,
  showAttachments = true,
  showEmoji = true,
  showVoiceMessage = true,
  onTypingStart,
  onTypingStop,
  className = '',
}: RichTextEditorProps) {
  const [formatting, setFormatting] = useState<MessageFormatting>({});
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  // Handle typing indicators
  const handleTyping = useCallback(() => {
    if (onTypingStart) {
      onTypingStart();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      if (onTypingStop) {
        onTypingStop();
      }
    }, 1000);
  }, [onTypingStart, onTypingStop]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    if (maxLength && newValue.length > maxLength) {
      return;
    }

    onChange(newValue, formatting);
    handleTyping();
  }, [onChange, formatting, maxLength, handleTyping]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      return;
    }

    // Format shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          toggleFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          toggleFormat('italic');
          break;
        case 'u':
          e.preventDefault();
          toggleFormat('underline');
          break;
        case 'k':
          e.preventDefault();
          toggleFormat('link');
          break;
      }
    }
  }, []);

  const getSelection = useCallback((): { start: number; end: number } | null => {
    if (!textareaRef.current) return null;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    
    if (start === end) return null;
    
    return { start, end };
  }, []);

  const toggleFormat = useCallback((formatType: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code') => {
    const selection = getSelection();
    if (!selection) return;

    const newFormatting = { ...formatting };
    
    if (!newFormatting[formatType]) {
      newFormatting[formatType] = [];
    }

    // Check if range already has this format
    const existingIndex = newFormatting[formatType]!.findIndex(
      range => range.start === selection.start && range.end === selection.end
    );

    if (existingIndex !== -1) {
      // Remove existing format
      newFormatting[formatType]!.splice(existingIndex, 1);
      setActiveFormats(prev => {
        const newSet = new Set(prev);
        newSet.delete(formatType);
        return newSet;
      });
    } else {
      // Add new format
      newFormatting[formatType]!.push(selection);
      setActiveFormats(prev => new Set(prev).add(formatType));
    }

    setFormatting(newFormatting);
    onChange(value, newFormatting);
  }, [formatting, value, onChange, getSelection]);

  const addLink = useCallback(() => {
    const selection = getSelection();
    if (!selection) return;

    const url = prompt('Enter URL:');
    if (!url) return;

    const newFormatting = { ...formatting };
    if (!newFormatting.links) {
      newFormatting.links = [];
    }

    newFormatting.links.push({
      start: selection.start,
      end: selection.end,
      url,
    });

    setFormatting(newFormatting);
    onChange(value, newFormatting);
  }, [formatting, value, onChange, getSelection]);

  const addColor = useCallback((color: string) => {
    const selection = getSelection();
    if (!selection) return;

    const newFormatting = { ...formatting };
    if (!newFormatting.colors) {
      newFormatting.colors = [];
    }

    newFormatting.colors.push({
      start: selection.start,
      end: selection.end,
      color,
    });

    setFormatting(newFormatting);
    onChange(value, newFormatting);
    setShowColorPicker(false);
  }, [formatting, value, onChange, getSelection]);

  const insertEmoji = useCallback((emoji: string) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newValue = value.slice(0, start) + emoji + value.slice(end);

    onChange(newValue, formatting);
    setShowEmojiPicker(false);

    // Focus back to textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + emoji.length, start + emoji.length);
      }
    }, 0);
  }, [value, formatting, onChange]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const attachment: MessageAttachment = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' :
              file.type.startsWith('audio/') ? 'audio' : 'document',
        size: file.size,
        url: URL.createObjectURL(file),
        mimeType: file.type,
      };

      setAttachments(prev => [...prev, attachment]);
    });

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const removeAttachment = useCallback((attachmentId: string) => {
    setAttachments(prev => prev.filter(a => a.id !== attachmentId));
  }, []);

  const handleSend = useCallback(() => {
    if (!value.trim() && attachments.length === 0) return;
    
    onSend(value, formatting, attachments);
    
    // Clear editor
    onChange('', {});
    setFormatting({});
    setAttachments([]);
    setActiveFormats(new Set());
    
    // Stop typing indicator
    if (onTypingStop) {
      onTypingStop();
    }
  }, [value, formatting, attachments, onSend, onChange, onTypingStop]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`border border-gray-200 rounded-lg bg-white ${className}`}>
      {/* Formatting Toolbar */}
      {showFormatting && (
        <div className="flex items-center space-x-1 p-2 border-b border-gray-100">
          <Button
            variant={activeFormats.has('bold') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => toggleFormat('bold')}
            disabled={disabled}
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            variant={activeFormats.has('italic') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => toggleFormat('italic')}
            disabled={disabled}
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Button
            variant={activeFormats.has('underline') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => toggleFormat('underline')}
            disabled={disabled}
          >
            <Underline className="h-4 w-4" />
          </Button>
          
          <Button
            variant={activeFormats.has('strikethrough') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => toggleFormat('strikethrough')}
            disabled={disabled}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          
          <Button
            variant={activeFormats.has('code') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => toggleFormat('code')}
            disabled={disabled}
          >
            <Code className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-gray-200" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={addLink}
            disabled={disabled}
          >
            <Link className="h-4 w-4" />
          </Button>
          
          <div className="relative">
            <Button
              variant={showColorPicker ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShowColorPicker(!showColorPicker)}
              disabled={disabled}
            >
              <Palette className="h-4 w-4" />
            </Button>
            
            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                >
                  <div className="grid grid-cols-4 gap-1">
                    {THERAPEUTIC_COLORS.map(color => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => addColor(color)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="p-2 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            {attachments.map(attachment => (
              <div
                key={attachment.id}
                className="flex items-center space-x-2 p-2 bg-gray-50 rounded border"
              >
                {attachment.type === 'image' && (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(attachment.id)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Text Input */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full p-3 pr-12 resize-none border-0 focus:outline-none focus:ring-0 min-h-[60px] max-h-[120px]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        />
        
        {/* Character count */}
        {maxLength && (
          <div className="absolute bottom-2 right-12 text-xs text-gray-400">
            {value.length}/{maxLength}
          </div>
        )}
      </div>

      {/* Bottom Toolbar */}
      <div className="flex items-center justify-between p-2 border-t border-gray-100">
        <div className="flex items-center space-x-1">
          {/* Emoji Picker */}
          {showEmoji && (
            <div className="relative">
              <Button
                variant={showEmojiPicker ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={disabled}
              >
                <Smile className="h-4 w-4" />
              </Button>
              
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute bottom-full left-0 mb-1 w-80 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  >
                    {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                      <div key={category} className="p-2">
                        <h4 className="text-xs font-medium text-gray-600 mb-1">{category}</h4>
                        <div className="grid grid-cols-10 gap-1">
                          {emojis.map(emoji => (
                            <button
                              key={emoji}
                              className="p-1 hover:bg-gray-100 rounded text-lg"
                              onClick={() => insertEmoji(emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* File Attachment */}
          {showAttachments && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              />
            </>
          )}

          {/* Voice Message */}
          {showVoiceMessage && (
            <Button
              variant={isRecording ? 'destructive' : 'ghost'}
              size="sm"
              onClick={() => setIsRecording(!isRecording)}
              disabled={disabled}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={disabled || (!value.trim() && attachments.length === 0)}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}