import { useState, useEffect, useCallback, useRef } from 'react';
import { WebRTCSignalingService, VideoCallRoom, RoomParticipant, WebRTCConfig } from '@/services/webrtc-signaling-service';

export interface UseWebRTCOptions {
  autoJoin?: boolean;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  roomId?: string;
  participantInfo?: Partial<RoomParticipant>;
}

export interface UseWebRTCReturn {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  
  // Room state
  currentRoom: VideoCallRoom | null;
  participants: RoomParticipant[];
  
  // Media state
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  
  // Actions
  createRoom: (roomData: Partial<VideoCallRoom>) => Promise<VideoCallRoom>;
  joinRoom: (roomId: string, participant?: Partial<RoomParticipant>) => Promise<VideoCallRoom>;
  leaveRoom: () => Promise<void>;
  toggleAudio: () => void;
  toggleVideo: () => void;
  startScreenShare: () => Promise<MediaStream>;
  stopScreenShare: () => Promise<void>;
  
  // Utility
  getConnectionStats: (participantId: string) => Promise<RTCStatsReport>;
  reconnect: () => Promise<void>;
  signalingService: WebRTCSignalingService | null;
}

const defaultConfig: WebRTCConfig = {
  signalingServerUrl: process.env.VITE_SIGNALING_SERVER_URL || 'wss://localhost:3001',
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
  stunServers: [
    'stun:stun.l.google.com:19302',
    'stun:stun1.l.google.com:19302',
  ],
  turnServers: [
    {
      urls: 'turn:turn.safespace.com:3478',
      username: process.env.VITE_TURN_USERNAME || 'safespace',
      credential: process.env.VITE_TURN_CREDENTIAL || 'secure-credential',
    },
  ],
};

export function useWebRTC(options: UseWebRTCOptions = {}): UseWebRTCReturn {
  const {
    autoJoin = false,
    audioEnabled = true,
    videoEnabled = true,
    roomId,
    participantInfo,
  } = options;

  // State
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [currentRoom, setCurrentRoom] = useState<VideoCallRoom | null>(null);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isAudioEnabled, setIsAudioEnabled] = useState(audioEnabled);
  const [isVideoEnabled, setIsVideoEnabled] = useState(videoEnabled);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Refs
  const signalingServiceRef = useRef<WebRTCSignalingService | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebRTC service
  useEffect(() => {
    const initializeService = async () => {
      try {
        setIsConnecting(true);
        setConnectionError(null);

        // Create signaling service
        signalingServiceRef.current = new WebRTCSignalingService(defaultConfig);

        // Set up event listeners
        setupEventListeners();

        // Initialize local stream
        await initializeLocalStream();

        // Auto-join room if specified
        if (autoJoin && roomId && participantInfo) {
          await joinRoom(roomId, participantInfo);
        }

        setIsConnected(true);
      } catch (error) {
        console.error('Failed to initialize WebRTC service:', error);
        setConnectionError(error instanceof Error ? error.message : 'Failed to initialize WebRTC');
      } finally {
        setIsConnecting(false);
      }
    };

    initializeService();

    // Cleanup on unmount
    return () => {
      if (signalingServiceRef.current) {
        signalingServiceRef.current.destroy();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const setupEventListeners = useCallback(() => {
    const service = signalingServiceRef.current;
    if (!service) return;

    service.on('signaling-connected', () => {
      setIsConnected(true);
      setConnectionError(null);
    });

    service.on('signaling-disconnected', () => {
      setIsConnected(false);
      handleReconnection();
    });

    service.on('signaling-error', (error: any) => {
      setConnectionError(error.message || 'Signaling error');
    });

    service.on('room-updated', (room: VideoCallRoom) => {
      setCurrentRoom(room);
      setParticipants(room.participants);
    });

    service.on('room-joined', (room: VideoCallRoom) => {
      setCurrentRoom(room);
      setParticipants(room.participants);
    });

    service.on('room-left', () => {
      setCurrentRoom(null);
      setParticipants([]);
      setRemoteStreams(new Map());
    });

    service.on('participant-joined', (participant: RoomParticipant) => {
      setParticipants(prev => [...prev.filter(p => p.id !== participant.id), participant]);
    });

    service.on('participant-left', (participantId: string) => {
      setParticipants(prev => prev.filter(p => p.id !== participantId));
      setRemoteStreams(prev => {
        const newMap = new Map(prev);
        newMap.delete(participantId);
        return newMap;
      });
    });

    service.on('local-stream-ready', (stream: MediaStream) => {
      setLocalStream(stream);
    });

    service.on('local-stream-error', (error: any) => {
      console.error('Local stream error:', error);
      setConnectionError('Failed to access camera/microphone');
    });

    service.on('remote-stream-added', ({ participantId, stream }: { participantId: string; stream: MediaStream }) => {
      setRemoteStreams(prev => new Map(prev).set(participantId, stream));
    });

    service.on('audio-toggled', (enabled: boolean) => {
      setIsAudioEnabled(enabled);
    });

    service.on('video-toggled', (enabled: boolean) => {
      setIsVideoEnabled(enabled);
    });

    service.on('screen-share-started', () => {
      setIsScreenSharing(true);
    });

    service.on('screen-share-stopped', () => {
      setIsScreenSharing(false);
    });

    service.on('connection-state-changed', ({ participantId, state }: { participantId: string; state: string }) => {
      setParticipants(prev => 
        prev.map(p => 
          p.id === participantId 
            ? { ...p, connectionState: state as any }
            : p
        )
      );
    });
  }, []);

  const initializeLocalStream = useCallback(async () => {
    const service = signalingServiceRef.current;
    if (!service) return;

    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
      };

      await service.initializeLocalStream(constraints);
    } catch (error) {
      console.error('Failed to initialize local stream:', error);
      // Try audio-only fallback
      try {
        await service.initializeLocalStream({ audio: true, video: false });
      } catch (audioError) {
        console.error('Failed to initialize audio-only stream:', audioError);
        throw audioError;
      }
    }
  }, []);

  const handleReconnection = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    reconnectTimeoutRef.current = setTimeout(async () => {
      try {
        await reconnect();
      } catch (error) {
        console.error('Reconnection failed:', error);
        // Retry after longer delay
        reconnectTimeoutRef.current = setTimeout(() => {
          handleReconnection();
        }, 10000);
      }
    }, 3000);
  }, []);

  // Actions
  const createRoom = useCallback(async (roomData: Partial<VideoCallRoom>): Promise<VideoCallRoom> => {
    const service = signalingServiceRef.current;
    if (!service) {
      throw new Error('WebRTC service not initialized');
    }

    return await service.createRoom(roomData);
  }, []);

  const joinRoom = useCallback(async (roomId: string, participant?: Partial<RoomParticipant>): Promise<VideoCallRoom> => {
    const service = signalingServiceRef.current;
    if (!service) {
      throw new Error('WebRTC service not initialized');
    }

    const participantData = {
      name: 'User',
      role: 'client' as const,
      isAudioEnabled: true,
      isVideoEnabled: true,
      isScreenSharing: false,
      connectionState: 'connecting' as const,
      ...participant,
    };

    return await service.joinRoom(roomId, participantData);
  }, []);

  const leaveRoom = useCallback(async (): Promise<void> => {
    const service = signalingServiceRef.current;
    if (!service) return;

    await service.leaveRoom();
  }, []);

  const toggleAudio = useCallback(() => {
    const service = signalingServiceRef.current;
    if (!service) return;

    const newState = !isAudioEnabled;
    service.toggleAudio(newState);
  }, [isAudioEnabled]);

  const toggleVideo = useCallback(() => {
    const service = signalingServiceRef.current;
    if (!service) return;

    const newState = !isVideoEnabled;
    service.toggleVideo(newState);
  }, [isVideoEnabled]);

  const startScreenShare = useCallback(async (): Promise<MediaStream> => {
    const service = signalingServiceRef.current;
    if (!service) {
      throw new Error('WebRTC service not initialized');
    }

    return await service.startScreenShare();
  }, []);

  const stopScreenShare = useCallback(async (): Promise<void> => {
    const service = signalingServiceRef.current;
    if (!service) return;

    await service.stopScreenShare();
  }, []);

  const getConnectionStats = useCallback(async (participantId: string): Promise<RTCStatsReport> => {
    const service = signalingServiceRef.current;
    if (!service) {
      throw new Error('WebRTC service not initialized');
    }

    return await service.getConnectionStats(participantId);
  }, []);

  const reconnect = useCallback(async (): Promise<void> => {
    const service = signalingServiceRef.current;
    if (service) {
      service.destroy();
    }

    // Reinitialize service
    signalingServiceRef.current = new WebRTCSignalingService(defaultConfig);
    setupEventListeners();
    await initializeLocalStream();

    // Rejoin room if we were in one
    if (currentRoom && participantInfo) {
      await joinRoom(currentRoom.id, participantInfo);
    }
  }, [currentRoom, participantInfo, setupEventListeners, initializeLocalStream, joinRoom]);

  return {
    // Connection state
    isConnected,
    isConnecting,
    connectionError,
    
    // Room state
    currentRoom,
    participants,
    
    // Media state
    localStream,
    remoteStreams,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    
    // Actions
    createRoom,
    joinRoom,
    leaveRoom,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    
    // Utility
    getConnectionStats,
    reconnect,
    signalingService: signalingServiceRef.current,
  };
}