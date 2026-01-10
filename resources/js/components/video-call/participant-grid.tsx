import React, { useRef, useEffect } from 'react';
import { RoomParticipant } from '@/services/webrtc-signaling-service';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor,
  Crown,
  Shield,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ParticipantGridProps {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  participants: RoomParticipant[];
  layoutMode: 'grid' | 'speaker' | 'sidebar';
  isScreenSharing: boolean;
  className?: string;
}

interface VideoTileProps {
  stream: MediaStream | null;
  participant: RoomParticipant | null;
  isLocal?: boolean;
  isMainSpeaker?: boolean;
  className?: string;
}

function VideoTile({ 
  stream, 
  participant, 
  isLocal = false, 
  isMainSpeaker = false,
  className = '' 
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'therapist':
        return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'guardian':
        return <Shield className="h-4 w-4 text-blue-400" />;
      default:
        return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'therapist':
        return 'border-yellow-400';
      case 'guardian':
        return 'border-blue-400';
      case 'client':
        return 'border-green-400';
      default:
        return 'border-gray-400';
    }
  };

  const isVideoEnabled = participant?.isVideoEnabled ?? true;
  const isAudioEnabled = participant?.isAudioEnabled ?? true;
  const connectionState = participant?.connectionState ?? 'connected';

  return (
    <motion.div
      layout
      className={`
        relative bg-gray-900 rounded-lg overflow-hidden border-2 
        ${getRoleColor(participant?.role)}
        ${isMainSpeaker ? 'ring-2 ring-blue-400' : ''}
        ${connectionState === 'connecting' ? 'opacity-50' : ''}
        ${className}
      `}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Video Stream */}
      {stream && isVideoEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          muted={isLocal}
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        /* Avatar/Placeholder */
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2 mx-auto">
              <User className="h-8 w-8 text-gray-300" />
            </div>
            <p className="text-white text-sm font-medium">
              {participant?.name || (isLocal ? 'You' : 'Participant')}
            </p>
            {!isVideoEnabled && (
              <p className="text-gray-400 text-xs mt-1">Camera off</p>
            )}
          </div>
        </div>
      )}

      {/* Participant Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getRoleIcon(participant?.role)}
            <span className="text-white text-sm font-medium">
              {participant?.name || (isLocal ? 'You' : 'Participant')}
              {isLocal && ' (You)'}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {/* Audio Status */}
            {!isAudioEnabled && (
              <div className="bg-red-500 rounded-full p-1">
                <MicOff className="h-3 w-3 text-white" />
              </div>
            )}

            {/* Video Status */}
            {!isVideoEnabled && (
              <div className="bg-red-500 rounded-full p-1">
                <VideoOff className="h-3 w-3 text-white" />
              </div>
            )}

            {/* Screen Sharing Indicator */}
            {participant?.isScreenSharing && (
              <div className="bg-blue-500 rounded-full p-1">
                <Monitor className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Connection Status */}
      {connectionState !== 'connected' && (
        <div className="absolute top-2 right-2">
          <div className={`
            px-2 py-1 rounded text-xs font-medium
            ${connectionState === 'connecting' ? 'bg-yellow-500 text-yellow-900' : ''}
            ${connectionState === 'disconnected' ? 'bg-red-500 text-white' : ''}
            ${connectionState === 'failed' ? 'bg-red-600 text-white' : ''}
          `}>
            {connectionState === 'connecting' && 'Connecting...'}
            {connectionState === 'disconnected' && 'Disconnected'}
            {connectionState === 'failed' && 'Connection Failed'}
          </div>
        </div>
      )}

      {/* Speaking Indicator */}
      {isAudioEnabled && connectionState === 'connected' && (
        <div className="absolute top-2 left-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}

      {/* Therapeutic Environment Indicator */}
      {participant?.role === 'therapist' && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
          <div className="bg-purple-500 bg-opacity-80 rounded-full px-2 py-1">
            <span className="text-white text-xs font-medium">Therapist</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function ParticipantGrid({
  localStream,
  remoteStreams,
  participants,
  layoutMode,
  isScreenSharing,
  className = ''
}: ParticipantGridProps) {
  const allParticipants = [
    { id: 'local', name: 'You', role: 'client', isLocal: true },
    ...participants
  ];

  const getGridLayout = () => {
    const count = allParticipants.length;
    
    if (layoutMode === 'speaker') {
      return 'grid-cols-1 grid-rows-1';
    }
    
    if (layoutMode === 'sidebar') {
      return 'grid-cols-4 grid-rows-1';
    }
    
    // Grid layout
    if (count <= 2) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 6) return 'grid-cols-2 md:grid-cols-3';
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  };

  const getSpeakerView = () => {
    // Find the main speaker (therapist or most recent speaker)
    const mainSpeaker = participants.find(p => p.role === 'therapist') || participants[0];
    const otherParticipants = allParticipants.filter(p => 
      p.id !== mainSpeaker?.id && p.id !== 'local'
    );

    return (
      <div className="w-full h-full flex flex-col">
        {/* Main Speaker */}
        <div className="flex-1 p-2">
          <VideoTile
            stream={mainSpeaker ? remoteStreams.get(mainSpeaker.id) || null : localStream}
            participant={mainSpeaker || null}
            isMainSpeaker={true}
            className="w-full h-full"
          />
        </div>

        {/* Other Participants */}
        {otherParticipants.length > 0 && (
          <div className="h-32 flex space-x-2 p-2">
            {/* Local Stream */}
            <VideoTile
              stream={localStream}
              participant={null}
              isLocal={true}
              className="w-32 h-full flex-shrink-0"
            />
            
            {/* Remote Participants */}
            {otherParticipants.slice(0, 5).map((participant) => (
              <VideoTile
                key={participant.id}
                stream={participant.id === 'local' ? localStream : remoteStreams.get(participant.id) || null}
                participant={participant.id === 'local' ? null : participant as RoomParticipant}
                isLocal={participant.id === 'local'}
                className="w-32 h-full flex-shrink-0"
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const getSidebarView = () => {
    const mainParticipant = participants.find(p => p.role === 'therapist') || participants[0];
    const sidebarParticipants = allParticipants.filter(p => p.id !== mainParticipant?.id);

    return (
      <div className="w-full h-full flex">
        {/* Main Area */}
        <div className="flex-1 p-2">
          <VideoTile
            stream={mainParticipant ? remoteStreams.get(mainParticipant.id) || null : localStream}
            participant={mainParticipant || null}
            isMainSpeaker={true}
            className="w-full h-full"
          />
        </div>

        {/* Sidebar */}
        <div className="w-80 p-2 space-y-2">
          {sidebarParticipants.map((participant) => (
            <VideoTile
              key={participant.id}
              stream={participant.id === 'local' ? localStream : remoteStreams.get(participant.id) || null}
              participant={participant.id === 'local' ? null : participant as RoomParticipant}
              isLocal={participant.id === 'local'}
              className="w-full h-48"
            />
          ))}
        </div>
      </div>
    );
  };

  if (layoutMode === 'speaker') {
    return (
      <div className={`w-full h-full ${className}`}>
        {getSpeakerView()}
      </div>
    );
  }

  if (layoutMode === 'sidebar') {
    return (
      <div className={`w-full h-full ${className}`}>
        {getSidebarView()}
      </div>
    );
  }

  // Grid Layout
  return (
    <div className={`w-full h-full p-4 ${className}`}>
      <div className={`grid ${getGridLayout()} gap-4 h-full`}>
        {/* Local Stream */}
        <VideoTile
          stream={localStream}
          participant={null}
          isLocal={true}
        />

        {/* Remote Participants */}
        {participants.map((participant) => (
          <VideoTile
            key={participant.id}
            stream={remoteStreams.get(participant.id) || null}
            participant={participant}
          />
        ))}
      </div>
    </div>
  );
}