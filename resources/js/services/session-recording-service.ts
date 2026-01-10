import { WebRTCSignalingService } from './webrtc-signaling-service';

export interface SessionRecording {
  id: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  fileSize: number; // in bytes
  status: 'recording' | 'stopped' | 'processing' | 'completed' | 'failed';
  encryption: EncryptionInfo;
  retention: RetentionPolicy;
  access: AccessControl[];
  metadata: RecordingMetadata;
}

export interface EncryptionInfo {
  algorithm: 'AES-256-GCM';
  keyId: string;
  encrypted: boolean;
  checksum: string;
}

export interface RetentionPolicy {
  retentionPeriod: number; // in days
  autoDelete: boolean;
  complianceLevel: 'HIPAA' | 'GDPR' | 'BOTH';
  archiveAfter: number; // in days
}

export interface AccessControl {
  userId: string;
  role: 'therapist' | 'client' | 'guardian' | 'admin';
  permissions: ('view' | 'download' | 'delete' | 'share')[];
  expiresAt?: Date;
}

export interface RecordingMetadata {
  participants: Array<{
    id: string;
    name: string;
    role: 'therapist' | 'client' | 'guardian';
    joinTime: Date;
    leaveTime?: Date;
    duration: number;
  }>;
  quality: {
    video: { width: number; height: number; bitrate: number; frameRate: number };
    audio: { bitrate: number; sampleRate: number };
  };
  networkStats: {
    averageBandwidth: number;
    averageLatency: number;
    packetLoss: number;
    qualityChanges: number;
  };
  events: SessionEvent[];
}

export interface SessionEvent {
  id: string;
  timestamp: Date;
  type: 'participant_joined' | 'participant_left' | 'recording_started' | 'recording_stopped' | 
        'screen_share_started' | 'screen_share_stopped' | 'quality_changed' | 'connection_issue' |
        'mute_toggled' | 'video_toggled' | 'note_added' | 'crisis_alert';
  participantId?: string;
  data: any;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface SessionNotes {
  id: string;
  sessionId: string;
  authorId: string;
  authorRole: 'therapist' | 'client' | 'guardian';
  content: string;
  timestamp: Date;
  type: 'session_summary' | 'progress_note' | 'observation' | 'action_item' | 'crisis_note';
  tags: string[];
  isPrivate: boolean;
  encryption: EncryptionInfo;
}

export interface SessionLog {
  id: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  participants: Array<{
    id: string;
    name: string;
    role: 'therapist' | 'client' | 'guardian';
    joinTime: Date;
    leaveTime?: Date;
    totalDuration: number;
  }>;
  status: 'active' | 'completed' | 'terminated' | 'failed';
  type: 'therapy-session' | 'group-session' | 'consultation' | 'crisis-intervention';
  notes: SessionNotes[];
  recording?: SessionRecording;
  metadata: {
    appointmentId?: string;
    therapistId: string;
    clientIds: string[];
    guardianIds: string[];
    sessionGoals?: string[];
    outcomes?: string[];
    nextSteps?: string[];
  };
  compliance: {
    hipaaCompliant: boolean;
    consentObtained: boolean;
    dataRetentionApplied: boolean;
    auditTrail: AuditEntry[];
  };
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  action: string;
  userId: string;
  userRole: string;
  details: any;
  ipAddress: string;
  userAgent: string;
}

export class SessionRecordingService {
  private signalingService: WebRTCSignalingService;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private currentRecording: SessionRecording | null = null;
  private currentSession: SessionLog | null = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private encryptionKey: CryptoKey | null = null;

  constructor(signalingService: WebRTCSignalingService) {
    this.signalingService = signalingService;
    this.setupEventListeners();
  }

  public async startRecording(sessionId: string, options: {
    quality?: 'low' | 'medium' | 'high';
    includeAudio?: boolean;
    includeVideo?: boolean;
    encryption?: boolean;
  } = {}): Promise<SessionRecording> {
    if (this.currentRecording) {
      throw new Error('Recording already in progress');
    }

    const {
      quality = 'medium',
      includeAudio = true,
      includeVideo = true,
      encryption = true,
    } = options;

    try {
      // Get media stream for recording
      const stream = await this.getRecordingStream(includeAudio, includeVideo);
      
      // Configure MediaRecorder
      const mimeType = this.getSupportedMimeType();
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: this.getVideoBitrate(quality),
        audioBitsPerSecond: this.getAudioBitrate(quality),
      });

      // Set up recording event handlers
      this.setupRecordingEventHandlers();

      // Generate encryption key if needed
      if (encryption) {
        this.encryptionKey = await this.generateEncryptionKey();
      }

      // Create recording metadata
      const recording: SessionRecording = {
        id: this.generateId(),
        sessionId,
        startTime: new Date(),
        duration: 0,
        fileSize: 0,
        status: 'recording',
        encryption: {
          algorithm: 'AES-256-GCM',
          keyId: encryption ? this.generateId() : '',
          encrypted: encryption,
          checksum: '',
        },
        retention: this.getDefaultRetentionPolicy(),
        access: this.getDefaultAccessControl(sessionId),
        metadata: {
          participants: [],
          quality: this.getQualitySettings(quality),
          networkStats: {
            averageBandwidth: 0,
            averageLatency: 0,
            packetLoss: 0,
            qualityChanges: 0,
          },
          events: [],
        },
      };

      this.currentRecording = recording;

      // Start recording
      this.mediaRecorder.start(1000); // Collect data every second

      // Log recording start event
      await this.logSessionEvent({
        type: 'recording_started',
        data: { quality, includeAudio, includeVideo, encryption },
        severity: 'info',
      });

      this.emit('recording-started', recording);
      return recording;

    } catch (error) {
      console.error('Failed to start recording:', error);
      await this.logSessionEvent({
        type: 'recording_started',
        data: { error: error.message },
        severity: 'error',
      });
      throw error;
    }
  }

  public async stopRecording(): Promise<SessionRecording> {
    if (!this.currentRecording || !this.mediaRecorder) {
      throw new Error('No recording in progress');
    }

    return new Promise((resolve, reject) => {
      const recording = this.currentRecording!;

      this.mediaRecorder!.onstop = async () => {
        try {
          // Process recorded data
          const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
          
          // Encrypt if needed
          let finalBlob = blob;
          if (recording.encryption.encrypted && this.encryptionKey) {
            finalBlob = await this.encryptRecording(blob);
          }

          // Update recording metadata
          recording.endTime = new Date();
          recording.duration = Math.floor((recording.endTime.getTime() - recording.startTime.getTime()) / 1000);
          recording.fileSize = finalBlob.size;
          recording.status = 'processing';
          recording.encryption.checksum = await this.calculateChecksum(finalBlob);

          // Save recording
          await this.saveRecording(recording, finalBlob);

          recording.status = 'completed';
          this.currentRecording = null;
          this.recordedChunks = [];

          // Log recording stop event
          await this.logSessionEvent({
            type: 'recording_stopped',
            data: { 
              duration: recording.duration,
              fileSize: recording.fileSize,
              encrypted: recording.encryption.encrypted,
            },
            severity: 'info',
          });

          this.emit('recording-stopped', recording);
          resolve(recording);

        } catch (error) {
          recording.status = 'failed';
          await this.logSessionEvent({
            type: 'recording_stopped',
            data: { error: error.message },
            severity: 'error',
          });
          reject(error);
        }
      };

      this.mediaRecorder!.stop();
      
      // Stop all tracks
      this.mediaRecorder!.stream.getTracks().forEach(track => track.stop());
    });
  }

  public async startSession(sessionData: {
    id: string;
    type: 'therapy-session' | 'group-session' | 'consultation' | 'crisis-intervention';
    therapistId: string;
    clientIds: string[];
    guardianIds?: string[];
    appointmentId?: string;
  }): Promise<SessionLog> {
    const session: SessionLog = {
      id: sessionData.id,
      sessionId: sessionData.id,
      startTime: new Date(),
      duration: 0,
      participants: [],
      status: 'active',
      type: sessionData.type,
      notes: [],
      metadata: {
        appointmentId: sessionData.appointmentId,
        therapistId: sessionData.therapistId,
        clientIds: sessionData.clientIds,
        guardianIds: sessionData.guardianIds || [],
      },
      compliance: {
        hipaaCompliant: true,
        consentObtained: true,
        dataRetentionApplied: true,
        auditTrail: [],
      },
    };

    this.currentSession = session;

    // Log session start
    await this.logAuditEntry({
      action: 'session_started',
      details: { sessionType: sessionData.type, participantCount: sessionData.clientIds.length + 1 },
    });

    this.emit('session-started', session);
    return session;
  }

  public async endSession(): Promise<SessionLog> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const session = this.currentSession;
    session.endTime = new Date();
    session.duration = Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000);
    session.status = 'completed';

    // Stop recording if active
    if (this.currentRecording) {
      await this.stopRecording();
    }

    // Save session log
    await this.saveSessionLog(session);

    // Log session end
    await this.logAuditEntry({
      action: 'session_ended',
      details: { 
        duration: session.duration,
        participantCount: session.participants.length,
        notesCount: session.notes.length,
      },
    });

    this.currentSession = null;
    this.emit('session-ended', session);
    return session;
  }

  public async addSessionNote(note: {
    content: string;
    type: SessionNotes['type'];
    tags?: string[];
    isPrivate?: boolean;
  }): Promise<SessionNotes> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const sessionNote: SessionNotes = {
      id: this.generateId(),
      sessionId: this.currentSession.id,
      authorId: 'current-user', // This would come from auth context
      authorRole: 'therapist', // This would come from auth context
      content: note.content,
      timestamp: new Date(),
      type: note.type,
      tags: note.tags || [],
      isPrivate: note.isPrivate || false,
      encryption: {
        algorithm: 'AES-256-GCM',
        keyId: this.generateId(),
        encrypted: true,
        checksum: '',
      },
    };

    // Encrypt note content
    if (sessionNote.encryption.encrypted) {
      sessionNote.content = await this.encryptText(sessionNote.content);
      sessionNote.encryption.checksum = await this.calculateTextChecksum(sessionNote.content);
    }

    this.currentSession.notes.push(sessionNote);

    // Log note addition
    await this.logSessionEvent({
      type: 'note_added',
      data: { 
        noteType: note.type,
        contentLength: note.content.length,
        isPrivate: note.isPrivate,
      },
      severity: 'info',
    });

    this.emit('note-added', sessionNote);
    return sessionNote;
  }

  public async logParticipantJoin(participant: {
    id: string;
    name: string;
    role: 'therapist' | 'client' | 'guardian';
  }): Promise<void> {
    if (!this.currentSession) return;

    const participantLog = {
      id: participant.id,
      name: participant.name,
      role: participant.role,
      joinTime: new Date(),
      totalDuration: 0,
    };

    this.currentSession.participants.push(participantLog);

    // Update recording metadata if recording
    if (this.currentRecording) {
      this.currentRecording.metadata.participants.push({
        ...participantLog,
        duration: 0,
      });
    }

    await this.logSessionEvent({
      type: 'participant_joined',
      participantId: participant.id,
      data: { name: participant.name, role: participant.role },
      severity: 'info',
    });
  }

  public async logParticipantLeave(participantId: string): Promise<void> {
    if (!this.currentSession) return;

    const participant = this.currentSession.participants.find(p => p.id === participantId);
    if (participant) {
      participant.leaveTime = new Date();
      participant.totalDuration = Math.floor(
        (participant.leaveTime.getTime() - participant.joinTime.getTime()) / 1000
      );
    }

    // Update recording metadata if recording
    if (this.currentRecording) {
      const recordingParticipant = this.currentRecording.metadata.participants.find(p => p.id === participantId);
      if (recordingParticipant) {
        recordingParticipant.leaveTime = new Date();
        recordingParticipant.duration = Math.floor(
          (recordingParticipant.leaveTime.getTime() - recordingParticipant.joinTime.getTime()) / 1000
        );
      }
    }

    await this.logSessionEvent({
      type: 'participant_left',
      participantId,
      data: { duration: participant?.totalDuration },
      severity: 'info',
    });
  }

  public getCurrentSession(): SessionLog | null {
    return this.currentSession;
  }

  public getCurrentRecording(): SessionRecording | null {
    return this.currentRecording;
  }

  public getSessionHistory(): Promise<SessionLog[]> {
    // This would typically fetch from a database
    return Promise.resolve([]);
  }

  public async getRecording(recordingId: string): Promise<SessionRecording | null> {
    // This would typically fetch from a database
    return null;
  }

  private setupEventListeners(): void {
    this.signalingService.on('participant-joined', (participant: any) => {
      this.logParticipantJoin(participant);
    });

    this.signalingService.on('participant-left', (participantId: string) => {
      this.logParticipantLeave(participantId);
    });

    this.signalingService.on('quality-adapted', (data: any) => {
      this.logSessionEvent({
        type: 'quality_changed',
        data,
        severity: 'info',
      });
    });
  }

  private setupRecordingEventHandlers(): void {
    if (!this.mediaRecorder) return;

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
        
        // Update file size
        if (this.currentRecording) {
          this.currentRecording.fileSize += event.data.size;
        }
      }
    };

    this.mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event);
      if (this.currentRecording) {
        this.currentRecording.status = 'failed';
      }
      this.emit('recording-error', event);
    };
  }

  private async getRecordingStream(includeAudio: boolean, includeVideo: boolean): Promise<MediaStream> {
    const constraints: MediaStreamConstraints = {};
    
    if (includeAudio) {
      constraints.audio = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      };
    }

    if (includeVideo) {
      constraints.video = {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 },
      };
    }

    return await navigator.mediaDevices.getUserMedia(constraints);
  }

  private getSupportedMimeType(): string {
    const types = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    throw new Error('No supported MIME type for recording');
  }

  private getVideoBitrate(quality: 'low' | 'medium' | 'high'): number {
    switch (quality) {
      case 'low': return 500000; // 500 kbps
      case 'medium': return 1500000; // 1.5 Mbps
      case 'high': return 3000000; // 3 Mbps
      default: return 1500000;
    }
  }

  private getAudioBitrate(quality: 'low' | 'medium' | 'high'): number {
    switch (quality) {
      case 'low': return 64000; // 64 kbps
      case 'medium': return 128000; // 128 kbps
      case 'high': return 192000; // 192 kbps
      default: return 128000;
    }
  }

  private getQualitySettings(quality: 'low' | 'medium' | 'high') {
    const settings = {
      low: { video: { width: 640, height: 360, bitrate: 500, frameRate: 24 }, audio: { bitrate: 64, sampleRate: 44100 } },
      medium: { video: { width: 1280, height: 720, bitrate: 1500, frameRate: 30 }, audio: { bitrate: 128, sampleRate: 44100 } },
      high: { video: { width: 1920, height: 1080, bitrate: 3000, frameRate: 30 }, audio: { bitrate: 192, sampleRate: 48000 } },
    };
    return settings[quality];
  }

  private async generateEncryptionKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private async encryptRecording(blob: Blob): Promise<Blob> {
    if (!this.encryptionKey) {
      throw new Error('No encryption key available');
    }

    const arrayBuffer = await blob.arrayBuffer();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      arrayBuffer
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return new Blob([combined], { type: 'application/octet-stream' });
  }

  private async encryptText(text: string): Promise<string> {
    if (!this.encryptionKey) {
      return text; // Return unencrypted if no key
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      data
    );

    // Combine IV and encrypted data, then base64 encode
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  private async calculateChecksum(blob: Blob): Promise<string> {
    const arrayBuffer = await blob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async calculateTextChecksum(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private getDefaultRetentionPolicy(): RetentionPolicy {
    return {
      retentionPeriod: 2555, // 7 years for HIPAA compliance
      autoDelete: true,
      complianceLevel: 'HIPAA',
      archiveAfter: 365, // Archive after 1 year
    };
  }

  private getDefaultAccessControl(sessionId: string): AccessControl[] {
    return [
      {
        userId: 'therapist-id', // This would come from session context
        role: 'therapist',
        permissions: ['view', 'download', 'delete', 'share'],
      },
      {
        userId: 'client-id', // This would come from session context
        role: 'client',
        permissions: ['view'],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    ];
  }

  private async saveRecording(recording: SessionRecording, blob: Blob): Promise<void> {
    // This would typically save to a secure cloud storage service
    console.log('Saving recording:', recording.id, 'Size:', blob.size);
    
    // In a real implementation, this would:
    // 1. Upload to encrypted cloud storage (AWS S3 with KMS, Azure Blob, etc.)
    // 2. Save metadata to database
    // 3. Update audit trail
    // 4. Apply retention policies
  }

  private async saveSessionLog(session: SessionLog): Promise<void> {
    // This would typically save to a database
    console.log('Saving session log:', session.id);
    
    // In a real implementation, this would:
    // 1. Save to database with proper encryption
    // 2. Update audit trail
    // 3. Trigger any post-session workflows
    // 4. Send notifications if needed
  }

  private async logSessionEvent(event: Omit<SessionEvent, 'id' | 'timestamp'>): Promise<void> {
    const sessionEvent: SessionEvent = {
      id: this.generateId(),
      timestamp: new Date(),
      ...event,
    };

    if (this.currentRecording) {
      this.currentRecording.metadata.events.push(sessionEvent);
    }

    if (this.currentSession) {
      // Add to session audit trail
      await this.logAuditEntry({
        action: `session_event_${event.type}`,
        details: event.data,
      });
    }
  }

  private async logAuditEntry(entry: Omit<AuditEntry, 'id' | 'timestamp' | 'userId' | 'userRole' | 'ipAddress' | 'userAgent'>): Promise<void> {
    const auditEntry: AuditEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      userId: 'current-user', // This would come from auth context
      userRole: 'therapist', // This would come from auth context
      ipAddress: '127.0.0.1', // This would come from request context
      userAgent: navigator.userAgent,
      ...entry,
    };

    if (this.currentSession) {
      this.currentSession.compliance.auditTrail.push(auditEntry);
    }
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  // Event system
  public on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
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
      listeners.forEach(callback => callback(data));
    }
  }

  public destroy(): void {
    if (this.currentRecording) {
      this.stopRecording().catch(console.error);
    }
    
    if (this.currentSession) {
      this.endSession().catch(console.error);
    }

    this.eventListeners.clear();
  }
}