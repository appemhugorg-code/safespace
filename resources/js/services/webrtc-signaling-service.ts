import { io, Socket } from 'socket.io-client';

export interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'join-room' | 'leave-room' | 'user-joined' | 'user-left';
  data: any;
  roomId: string;
  userId: string;
  timestamp: number;
}

export interface RoomParticipant {
  id: string;
  name: string;
  role: 'therapist' | 'client' | 'guardian';
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'failed';
}

export interface VideoCallRoom {
  id: string;
  name: string;
  type: 'therapy-session' | 'group-session' | 'consultation';
  participants: RoomParticipant[];
  maxParticipants: number;
  isRecording: boolean;
  startTime: Date;
  endTime?: Date;
  metadata: {
    appointmentId?: string;
    therapistId?: string;
    clientId?: string;
    sessionNotes?: string;
  };
}

export interface WebRTCConfig {
  iceServers: RTCIceServer[];
  signalingServerUrl: string;
  stunServers: string[];
  turnServers: Array<{
    urls: string;
    username: string;
    credential: string;
  }>;
}

export class WebRTCSignalingService {
  private socket: Socket | null = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private currentRoom: VideoCallRoom | null = null;
  private config: WebRTCConfig;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config: WebRTCConfig) {
    this.config = config;
    this.initializeSocket();
  }

  private initializeSocket(): void {
    this.socket = io(this.config.signalingServerUrl, {
      transports: ['websocket'],
      secure: true,
      rejectUnauthorized: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
      this.emit('signaling-connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from signaling server');
      this.emit('signaling-disconnected');
    });

    this.socket.on('signaling-message', (message: SignalingMessage) => {
      this.handleSignalingMessage(message);
    });

    this.socket.on('room-updated', (room: VideoCallRoom) => {
      this.currentRoom = room;
      this.emit('room-updated', room);
    });

    this.socket.on('participant-joined', (participant: RoomParticipant) => {
      this.handleParticipantJoined(participant);
    });

    this.socket.on('participant-left', (participantId: string) => {
      this.handleParticipantLeft(participantId);
    });

    this.socket.on('error', (error: any) => {
      console.error('Signaling server error:', error);
      this.emit('signaling-error', error);
    });
  }

  public async createRoom(roomData: Partial<VideoCallRoom>): Promise<VideoCallRoom> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Signaling server not connected'));
        return;
      }

      this.socket.emit('create-room', roomData, (response: any) => {
        if (response.success) {
          this.currentRoom = response.room;
          resolve(response.room);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  public async joinRoom(roomId: string, participant: Partial<RoomParticipant>): Promise<VideoCallRoom> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Signaling server not connected'));
        return;
      }

      this.socket.emit('join-room', { roomId, participant }, (response: any) => {
        if (response.success) {
          this.currentRoom = response.room;
          this.emit('room-joined', response.room);
          resolve(response.room);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  public async leaveRoom(): Promise<void> {
    if (!this.socket || !this.currentRoom) {
      return;
    }

    // Close all peer connections
    this.peerConnections.forEach((pc, participantId) => {
      pc.close();
      this.peerConnections.delete(participantId);
    });

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Leave room on server
    this.socket.emit('leave-room', { roomId: this.currentRoom.id });
    this.currentRoom = null;
    this.emit('room-left');
  }

  public async initializeLocalStream(constraints: MediaStreamConstraints): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.emit('local-stream-ready', this.localStream);
      return this.localStream;
    } catch (error) {
      console.error('Failed to get local stream:', error);
      this.emit('local-stream-error', error);
      throw error;
    }
  }

  public async createPeerConnection(participantId: string): Promise<RTCPeerConnection> {
    const peerConnection = new RTCPeerConnection({
      iceServers: this.config.iceServers,
    });

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, this.localStream!);
      });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.socket && this.currentRoom) {
        this.sendSignalingMessage({
          type: 'ice-candidate',
          data: event.candidate,
          roomId: this.currentRoom.id,
          userId: participantId,
          timestamp: Date.now(),
        });
      }
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];
      this.emit('remote-stream-added', { participantId, stream: remoteStream });
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState;
      this.emit('connection-state-changed', { participantId, state });
      
      if (state === 'failed' || state === 'disconnected') {
        this.handlePeerConnectionFailure(participantId);
      }
    };

    this.peerConnections.set(participantId, peerConnection);
    return peerConnection;
  }

  public async createOffer(participantId: string): Promise<RTCSessionDescriptionInit> {
    const peerConnection = this.peerConnections.get(participantId);
    if (!peerConnection) {
      throw new Error(`No peer connection found for participant ${participantId}`);
    }

    const offer = await peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });

    await peerConnection.setLocalDescription(offer);

    if (this.socket && this.currentRoom) {
      this.sendSignalingMessage({
        type: 'offer',
        data: offer,
        roomId: this.currentRoom.id,
        userId: participantId,
        timestamp: Date.now(),
      });
    }

    return offer;
  }

  public async createAnswer(participantId: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    const peerConnection = this.peerConnections.get(participantId);
    if (!peerConnection) {
      throw new Error(`No peer connection found for participant ${participantId}`);
    }

    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    if (this.socket && this.currentRoom) {
      this.sendSignalingMessage({
        type: 'answer',
        data: answer,
        roomId: this.currentRoom.id,
        userId: participantId,
        timestamp: Date.now(),
      });
    }

    return answer;
  }

  public async handleAnswer(participantId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    const peerConnection = this.peerConnections.get(participantId);
    if (!peerConnection) {
      throw new Error(`No peer connection found for participant ${participantId}`);
    }

    await peerConnection.setRemoteDescription(answer);
  }

  public async handleIceCandidate(participantId: string, candidate: RTCIceCandidateInit): Promise<void> {
    const peerConnection = this.peerConnections.get(participantId);
    if (!peerConnection) {
      console.warn(`No peer connection found for participant ${participantId}`);
      return;
    }

    try {
      await peerConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error('Failed to add ICE candidate:', error);
    }
  }

  public toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
      this.emit('audio-toggled', enabled);
    }
  }

  public toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
      this.emit('video-toggled', enabled);
    }
  }

  public async startScreenShare(): Promise<MediaStream> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // Replace video track in all peer connections
      const videoTrack = screenStream.getVideoTracks()[0];
      this.peerConnections.forEach(async (pc) => {
        const sender = pc.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
      });

      // Handle screen share end
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      this.emit('screen-share-started', screenStream);
      return screenStream;
    } catch (error) {
      console.error('Failed to start screen share:', error);
      this.emit('screen-share-error', error);
      throw error;
    }
  }

  public async stopScreenShare(): Promise<void> {
    if (!this.localStream) return;

    // Replace screen share track with camera track
    const videoTrack = this.localStream.getVideoTracks()[0];
    this.peerConnections.forEach(async (pc) => {
      const sender = pc.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      if (sender && videoTrack) {
        await sender.replaceTrack(videoTrack);
      }
    });

    this.emit('screen-share-stopped');
  }

  public getConnectionStats(participantId: string): Promise<RTCStatsReport> {
    const peerConnection = this.peerConnections.get(participantId);
    if (!peerConnection) {
      throw new Error(`No peer connection found for participant ${participantId}`);
    }

    return peerConnection.getStats();
  }

  public getCurrentRoom(): VideoCallRoom | null {
    return this.currentRoom;
  }

  public getParticipants(): RoomParticipant[] {
    return this.currentRoom?.participants || [];
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  private sendSignalingMessage(message: SignalingMessage): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('signaling-message', message);
    }
  }

  private async handleSignalingMessage(message: SignalingMessage): Promise<void> {
    try {
      switch (message.type) {
        case 'offer':
          await this.createAnswer(message.userId, message.data);
          break;
        case 'answer':
          await this.handleAnswer(message.userId, message.data);
          break;
        case 'ice-candidate':
          await this.handleIceCandidate(message.userId, message.data);
          break;
        default:
          console.warn('Unknown signaling message type:', message.type);
      }
    } catch (error) {
      console.error('Failed to handle signaling message:', error);
      this.emit('signaling-error', error);
    }
  }

  private async handleParticipantJoined(participant: RoomParticipant): Promise<void> {
    // Create peer connection for new participant
    await this.createPeerConnection(participant.id);
    
    // Create offer if we're the initiator
    if (this.shouldInitiateConnection(participant)) {
      await this.createOffer(participant.id);
    }

    this.emit('participant-joined', participant);
  }

  private handleParticipantLeft(participantId: string): void {
    const peerConnection = this.peerConnections.get(participantId);
    if (peerConnection) {
      peerConnection.close();
      this.peerConnections.delete(participantId);
    }

    this.emit('participant-left', participantId);
  }

  private handlePeerConnectionFailure(participantId: string): void {
    console.warn(`Peer connection failed for participant ${participantId}`);
    
    // Attempt to reconnect
    setTimeout(async () => {
      try {
        const oldConnection = this.peerConnections.get(participantId);
        if (oldConnection) {
          oldConnection.close();
        }
        
        await this.createPeerConnection(participantId);
        await this.createOffer(participantId);
      } catch (error) {
        console.error('Failed to reconnect to participant:', error);
      }
    }, 2000);
  }

  private shouldInitiateConnection(participant: RoomParticipant): boolean {
    // Therapists typically initiate connections
    // Or the participant with the lower ID initiates
    if (!this.currentRoom) return false;
    
    const currentUser = this.currentRoom.participants.find(p => p.id === 'current-user');
    if (!currentUser) return false;
    
    return currentUser.role === 'therapist' || currentUser.id < participant.id;
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
    // Close all peer connections
    this.peerConnections.forEach(pc => pc.close());
    this.peerConnections.clear();

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Disconnect socket
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    // Clear event listeners
    this.eventListeners.clear();
  }
}