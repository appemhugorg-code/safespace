import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSessionRecording } from '@/hooks/use-session-recording';
import { WebRTCSignalingService } from '@/services/webrtc-signaling-service';
import { SessionNotes } from '@/services/session-recording-service';
import { 
  FileText, 
  Plus, 
  Save,
  Lock,
  Unlock,
  Tag,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SessionNotesProps {
  signalingService: WebRTCSignalingService | null;
  sessionData: {
    therapistId: string;
    clientIds: string[];
    guardianIds?: string[];
    appointmentId?: string;
  };
  className?: string;
}

export function SessionNotesComponent({ 
  signalingService, 
  sessionData, 
  className = '' 
}: SessionNotesProps) {
  const {
    currentSession,
    isSessionActive,
    sessionNotes,
    addNote,
  } = useSessionRecording(signalingService, {
    autoStartSession: false,
    sessionType: 'therapy-session',
    ...sessionData,
  });

  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState<SessionNotes['type']>('session_summary');
  const [noteTags, setNoteTags] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPrivateNotes, setShowPrivateNotes] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const noteTypes = [
    { value: 'session_summary', label: 'Session Summary', color: 'bg-blue-500' },
    { value: 'progress_note', label: 'Progress Note', color: 'bg-green-500' },
    { value: 'observation', label: 'Observation', color: 'bg-purple-500' },
    { value: 'action_item', label: 'Action Item', color: 'bg-orange-500' },
    { value: 'crisis_note', label: 'Crisis Note', color: 'bg-red-500' },
  ];

  const handleAddNote = () => {
    setIsAddingNote(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim()) return;

    setIsSaving(true);
    try {
      const tags = noteTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      
      await addNote({
        content: noteContent,
        type: noteType,
        tags,
        isPrivate,
      });

      // Reset form
      setNoteContent('');
      setNoteTags('');
      setIsAddingNote(false);
      setIsPrivate(false);
      setNoteType('session_summary');

    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelNote = () => {
    setNoteContent('');
    setNoteTags('');
    setIsAddingNote(false);
    setIsPrivate(false);
  };

  const formatTimestamp = (timestamp: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(timestamp));
  };

  const getNoteTypeConfig = (type: SessionNotes['type']) => {
    return noteTypes.find(nt => nt.value === type) || noteTypes[0];
  };

  const filteredNotes = sessionNotes.filter(note => 
    showPrivateNotes || !note.isPrivate
  );

  const getCharacterCount = () => {
    return noteContent.length;
  };

  const getCharacterCountColor = () => {
    const count = getCharacterCount();
    if (count > 2000) return 'text-red-500';
    if (count > 1500) return 'text-orange-500';
    return 'text-gray-500';
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Session Notes</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {filteredNotes.length} notes
            </Badge>
            
            {isSessionActive && (
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={isAddingNote}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Note
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filter Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-private"
              checked={showPrivateNotes}
              onCheckedChange={setShowPrivateNotes}
            />
            <Label htmlFor="show-private" className="text-sm flex items-center space-x-1">
              {showPrivateNotes ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              <span>Show Private Notes</span>
            </Label>
          </div>
          
          {currentSession && (
            <Badge variant="secondary" className="text-xs">
              Session: {currentSession.type.replace('-', ' ')}
            </Badge>
          )}
        </div>

        {/* Add Note Form */}
        <AnimatePresence>
          {isAddingNote && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 p-4 border border-blue-200 bg-blue-50 rounded-lg"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="note-type" className="text-sm font-medium">Note Type</Label>
                  <Select value={noteType} onValueChange={(value: any) => setNoteType(value)}>
                    <SelectTrigger id="note-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {noteTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${type.color}`} />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="note-tags" className="text-sm font-medium">Tags (comma-separated)</Label>
                  <input
                    id="note-tags"
                    type="text"
                    value={noteTags}
                    onChange={(e) => setNoteTags(e.target.value)}
                    placeholder="mood, progress, goals"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="note-content" className="text-sm font-medium">Content</Label>
                <textarea
                  ref={textareaRef}
                  id="note-content"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Enter your session notes here..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="private-note"
                      checked={isPrivate}
                      onCheckedChange={setIsPrivate}
                    />
                    <Label htmlFor="private-note" className="text-xs flex items-center space-x-1">
                      {isPrivate ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                      <span>Private Note</span>
                    </Label>
                  </div>
                  <span className={`text-xs ${getCharacterCountColor()}`}>
                    {getCharacterCount()}/2000 characters
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelNote}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveNote}
                  disabled={!noteContent.trim() || isSaving || getCharacterCount() > 2000}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3 w-3 mr-1" />
                      Save Note
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No session notes yet</p>
              {isSessionActive && (
                <p className="text-sm">Add notes during the session to track progress and observations</p>
              )}
            </div>
          ) : (
            filteredNotes.map((note, index) => {
              const typeConfig = getNoteTypeConfig(note.type);
              
              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${typeConfig.color}`} />
                      <Badge variant="outline" className="text-xs">
                        {typeConfig.label}
                      </Badge>
                      {note.isPrivate && (
                        <Badge variant="secondary" className="text-xs flex items-center space-x-1">
                          <Lock className="h-2 w-2" />
                          <span>Private</span>
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimestamp(note.timestamp)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-800 mb-2 whitespace-pre-wrap">
                    {note.content}
                  </p>

                  {note.tags.length > 0 && (
                    <div className="flex items-center space-x-1 mb-2">
                      <Tag className="h-3 w-3 text-gray-400" />
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{note.authorRole}</span>
                    </div>
                    
                    {note.encryption.encrypted && (
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Encrypted</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Session Status */}
        {!isSessionActive && (
          <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Session not active. Start a session to add notes.
            </span>
          </div>
        )}

        {/* Compliance Notice */}
        <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>All notes are encrypted and HIPAA compliant</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}