import { useState, useEffect, useCallback, useRef } from 'react';
import { SessionRecordingService, SessionRecording, SessionLog, SessionNotes } from '@/services/session-recording-service';
import { WebRTCSignalingService } from '@/services/webrtc-signaling-service';

export interface UseSessionRecordingOptions {
  autoStartSession?: boolean;
  sessionType?: 'therapy-session' | 'group-session' | 'consultation' | 'crisis-intervention';
  therapistId?: string;
  clientIds?: string[];
  guardianIds?: string[];
  appointmentId?: string;
}

export interface UseSessionRecordingReturn {
  // Session state
  currentSession: SessionLog | null;
  isSessionActive: boolean;
  sessionDuration: number;
  
  // Recording state
  currentRecording: SessionRecording | null;
  isRecording: boolean;
  recordingDuration: number;
  recordingSize: number;
  
  // Actions
  startSession: (sessionData?: Partial<UseSessionRecordingOptions>) => Promise<SessionLog>;
  endSession: () => Promise<SessionLog>;
  startRecording: (options?: {
    quality?: 'low' | 'medium' | 'high';
    includeAudio?: boolean;
    includeVideo?: boolean;
    encryption?: boolean;
  }) => Promise<SessionRecording>;
  stopRecording: () => Promise<SessionRecording>;
  addNote: (note: {
    content: string;
    type: SessionNotes['type'];
    tags?: string[];
    isPrivate?: boolean;
  }) => Promise<SessionNotes>;
  
  // Data
  sessionNotes: SessionNotes[];
  sessionParticipants: Array<{
    id: string;
    name: string;
    role: 'therapist' | 'client' | 'guardian';
    joinTime: Date;
    leaveTime?: Date;
    totalDuration: number;
  }>;
  
  // Events
  onSessionEvent: (callback: (event: any) => void) => () => void;
  onRecordingEvent: (callback: (event: any) => void) => () => void;
}

export function useSessionRecording(
  signalingService: WebRTCSignalingService | null,
  options: UseSessionRecordingOptions = {}
): UseSessionRecordingReturn {
  const {
    autoStartSession = false,
    sessionType = 'therapy-session',
    therapistId,
    clientIds = [],
    guardianIds = [],
    appointmentId,
  } = options;

  // State
  const [currentSession, setCurrentSession] = useState<SessionLog | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [currentRecording, setCurrentRecording] = useState<SessionRecording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingSize, setRecordingSize] = useState(0);
  const [sessionNotes, setSessionNotes] = useState<SessionNotes[]>([]);
  const [sessionParticipants, setSessionParticipants] = useState<Array<{
    id: string;
    name: string;
    role: 'therapist' | 'client' | 'guardian';
    joinTime: Date;
    leaveTime?: Date;
    totalDuration: number;
  }>>([]);

  // Refs
  const recordingServiceRef = useRef<SessionRecordingService | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const eventCallbacksRef = useRef<{
    onSessionEvent: Function[];
    onRecordingEvent: Function[];
  }>({
    onSessionEvent: [],
    onRecordingEvent: [],
  });

  // Initialize recording service
  useEffect(() => {
    if (!signalingService) return;

    const recordingService = new SessionRecordingService(signalingService);
    recordingServiceRef.current = recordingService;

    // Set up event listeners
    setupEventListeners(recordingService);

    // Auto-start session if enabled
    if (autoStartSession && therapistId && clientIds.length > 0) {
      startSession({
        sessionType,
        therapistId,
        clientIds,
        guardianIds,
        appointmentId,
      });
    }

    // Cleanup on unmount
    return () => {
      recordingService.destroy();
      recordingServiceRef.current = null;
      
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [signalingService, autoStartSession, therapistId, clientIds, guardianIds, appointmentId, sessionType]);

  const setupEventListeners = useCallback((service: SessionRecordingService) => {
    service.on('session-started', (session: SessionLog) => {
      setCurrentSession(session);
      setIsSessionActive(true);
      setSessionNotes(session.notes);
      setSessionParticipants(session.participants);
      
      // Start session timer
      sessionTimerRef.current = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
      
      // Notify listeners
      eventCallbacksRef.current.onSessionEvent.forEach(callback => 
        callback({ type: 'session-started', data: session })
      );
    });

    service.on('session-ended', (session: SessionLog) => {
      setCurrentSession(session);
      setIsSessionActive(false);
      setSessionNotes(session.notes);
      setSessionParticipants(session.participants);
      
      // Stop session timer
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }
      
      // Notify listeners
      eventCallbacksRef.current.onSessionEvent.forEach(callback => 
        callback({ type: 'session-ended', data: session })
      );
    });

    service.on('recording-started', (recording: SessionRecording) => {
      setCurrentRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);
      setRecordingSize(0);
      
      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
        if (recording) {
          setRecordingSize(recording.fileSize);
        }
      }, 1000);
      
      // Notify listeners
      eventCallbacksRef.current.onRecordingEvent.forEach(callback => 
        callback({ type: 'recording-started', data: recording })
      );
    });

    service.on('recording-stopped', (recording: SessionRecording) => {
      setCurrentRecording(recording);
      setIsRecording(false);
      setRecordingDuration(recording.duration);
      setRecordingSize(recording.fileSize);
      
      // Stop recording timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      
      // Notify listeners
      eventCallbacksRef.current.onRecordingEvent.forEach(callback => 
        callback({ type: 'recording-stopped', data: recording })
      );
    });

    service.on('note-added', (note: SessionNotes) => {
      setSessionNotes(prev => [...prev, note]);
      
      // Notify listeners
      eventCallbacksRef.current.onSessionEvent.forEach(callback => 
        callback({ type: 'note-added', data: note })
      );
    });

    service.on('recording-error', (error: any) => {
      setIsRecording(false);
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      
      // Notify listeners
      eventCallbacksRef.current.onRecordingEvent.forEach(callback => 
        callback({ type: 'recording-error', data: error })
      );
    });
  }, []);

  // Actions
  const startSession = useCallback(async (sessionData?: Partial<UseSessionRecordingOptions>): Promise<SessionLog> => {
    if (!recordingServiceRef.current) {
      throw new Error('Recording service not initialized');
    }

    const data = {
      id: crypto.randomUUID(),
      type: sessionData?.sessionType || sessionType,
      therapistId: sessionData?.therapistId || therapistId || 'current-user',
      clientIds: sessionData?.clientIds || clientIds,
      guardianIds: sessionData?.guardianIds || guardianIds,
      appointmentId: sessionData?.appointmentId || appointmentId,
    };

    return await recordingServiceRef.current.startSession(data);
  }, [sessionType, therapistId, clientIds, guardianIds, appointmentId]);

  const endSession = useCallback(async (): Promise<SessionLog> => {
    if (!recordingServiceRef.current) {
      throw new Error('Recording service not initialized');
    }

    return await recordingServiceRef.current.endSession();
  }, []);

  const startRecording = useCallback(async (options: {
    quality?: 'low' | 'medium' | 'high';
    includeAudio?: boolean;
    includeVideo?: boolean;
    encryption?: boolean;
  } = {}): Promise<SessionRecording> => {
    if (!recordingServiceRef.current || !currentSession) {
      throw new Error('No active session or recording service not initialized');
    }

    return await recordingServiceRef.current.startRecording(currentSession.id, options);
  }, [currentSession]);

  const stopRecording = useCallback(async (): Promise<SessionRecording> => {
    if (!recordingServiceRef.current) {
      throw new Error('Recording service not initialized');
    }

    return await recordingServiceRef.current.stopRecording();
  }, []);

  const addNote = useCallback(async (note: {
    content: string;
    type: SessionNotes['type'];
    tags?: string[];
    isPrivate?: boolean;
  }): Promise<SessionNotes> => {
    if (!recordingServiceRef.current) {
      throw new Error('Recording service not initialized');
    }

    return await recordingServiceRef.current.addSessionNote(note);
  }, []);

  // Event subscription methods
  const onSessionEvent = useCallback((callback: (event: any) => void) => {
    eventCallbacksRef.current.onSessionEvent.push(callback);
    
    // Return cleanup function
    return () => {
      const callbacks = eventCallbacksRef.current.onSessionEvent;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }, []);

  const onRecordingEvent = useCallback((callback: (event: any) => void) => {
    eventCallbacksRef.current.onRecordingEvent.push(callback);
    
    // Return cleanup function
    return () => {
      const callbacks = eventCallbacksRef.current.onRecordingEvent;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }, []);

  return {
    // Session state
    currentSession,
    isSessionActive,
    sessionDuration,
    
    // Recording state
    currentRecording,
    isRecording,
    recordingDuration,
    recordingSize,
    
    // Actions
    startSession,
    endSession,
    startRecording,
    stopRecording,
    addNote,
    
    // Data
    sessionNotes,
    sessionParticipants,
    
    // Events
    onSessionEvent,
    onRecordingEvent,
  };
}