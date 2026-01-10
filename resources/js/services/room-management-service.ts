import { VideoCallRoom, RoomParticipant } from './webrtc-signaling-service';

export interface RoomPermissions {
  canMute: boolean;
  canKick: boolean;
  canRecord: boolean;
  canShareScreen: boolean;
  canInvite: boolean;
  canEndSession: boolean;
}

export interface SessionMetadata {
  appointmentId?: string;
  therapistId: string;
  clientId?: string;
  guardianId?: string;
  sessionType: 'individual' | 'group' | 'family' | 'consultation';
  scheduledDuration: number; // minutes
  actualStartTime?: Date;
  actualEndTime?: Date;
  sessionNotes?: string;
  recordingConsent: boolean;
  emergencyContacts?: string[];
}

export class RoomManagementService {
  private apiBaseUrl: string;
  private authToken: string | null = null;

  constructor(apiBaseUrl: string = '/api/video-sessions') {
    this.apiBaseUrl = apiBaseUrl;
    this.authToken = localStorage.getItem('auth_token');
  }

  public async createTherapyRoom(metadata: SessionMetadata): Promise<VideoCallRoom> {
    const roomData = {
      name: `Therapy Session - ${new Date().toLocaleString()}`,
      type: 'therapy-session' as const,
      maxParticipants: this.getMaxParticipants(metadata.sessionType),
      isRecording: false,
      metadata,
    };

    const response = await this.makeRequest('POST', '/rooms', roomData);
    return response.room;
  }

  public async joinTherapyRoom(roomId: string, participantInfo: Partial<RoomParticipant>): Promise<{
    room: VideoCallRoom;
    permissions: RoomPermissions;
  }> {
    const response = await this.makeRequest('POST', `/rooms/${roomId}/join`, {
      participant: participantInfo,
    });

    return {
      room: response.room,
      permissions: this.calculatePermissions(participantInfo.role || 'client', response.room),
    };
  }

  public async leaveRoom(roomId: string, participantId: string): Promise<void> {
    await this.makeRequest('POST', `/rooms/${roomId}/leave`, {
      participantId,
    });
  }

  public async endSession(roomId: string, sessionNotes?: string): Promise<void> {
    await this.makeRequest('POST', `/rooms/${roomId}/end`, {
      sessionNotes,
      endTime: new Date().toISOString(),
    });
  }

  public async updateParticipant(
    roomId: string, 
    participantId: string, 
    updates: Partial<RoomParticipant>
  ): Promise<RoomParticipant> {
    const response = await this.makeRequest('PATCH', `/rooms/${roomId}/participants/${participantId}`, updates);
    return response.participant;
  }

  public async muteParticipant(roomId: string, participantId: string, muted: boolean): Promise<void> {
    await this.makeRequest('POST', `/rooms/${roomId}/participants/${participantId}/mute`, {
      muted,
    });
  }

  public async kickParticipant(roomId: string, participantId: string, reason?: string): Promise<void> {
    await this.makeRequest('POST', `/rooms/${roomId}/participants/${participantId}/kick`, {
      reason,
    });
  }

  public async startRecording(roomId: string): Promise<{ recordingId: string }> {
    const response = await this.makeRequest('POST', `/rooms/${roomId}/recording/start`);
    return response;
  }

  public async stopRecording(roomId: string): Promise<{ recordingUrl: string; duration: number }> {
    const response = await this.makeRequest('POST', `/rooms/${roomId}/recording/stop`);
    return response;
  }

  public async getRoomHistory(participantId: string, limit: number = 10): Promise<VideoCallRoom[]> {
    const response = await this.makeRequest('GET', `/participants/${participantId}/rooms?limit=${limit}`);
    return response.rooms;
  }

  public async getActiveRooms(): Promise<VideoCallRoom[]> {
    const response = await this.makeRequest('GET', '/rooms/active');
    return response.rooms;
  }

  public async validateRoomAccess(roomId: string, participantId: string): Promise<boolean> {
    try {
      await this.makeRequest('GET', `/rooms/${roomId}/access/${participantId}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  private getMaxParticipants(sessionType: string): number {
    switch (sessionType) {
      case 'individual': return 2; // therapist + client
      case 'family': return 6; // therapist + family members
      case 'group': return 12; // therapist + group members
      case 'consultation': return 4; // multiple professionals
      default: return 2;
    }
  }

  private calculatePermissions(role: string, room: VideoCallRoom): RoomPermissions {
    const isTherapist = role === 'therapist';
    const isGuardian = role === 'guardian';
    
    return {
      canMute: isTherapist,
      canKick: isTherapist,
      canRecord: isTherapist,
      canShareScreen: isTherapist || isGuardian,
      canInvite: isTherapist,
      canEndSession: isTherapist,
    };
  }

  private async makeRequest(method: string, endpoint: string, data?: any): Promise<any> {
    const url = `${this.apiBaseUrl}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` }),
      },
    };

    if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  }
}