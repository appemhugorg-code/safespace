import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RoomParticipant } from '@/services/webrtc-signaling-service';
import { 
  X, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor,
  Crown,
  Shield,
  User,
  MoreVertical,
  UserX,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ParticipantListProps {
  participants: RoomParticipant[];
  currentUserRole: 'therapist' | 'client' | 'guardian';
  onClose: () => void;
  onMuteParticipant?: (participantId: string, muted: boolean) => void;
  onKickParticipant?: (participantId: string) => void;
  className?: string;
}

interface ParticipantItemProps {
  participant: RoomParticipant;
  currentUserRole: 'therapist' | 'client' | 'guardian';
  onMute?: (muted: boolean) => void;
  onKick?: () => void;
}

function ParticipantItem({ 
  participant, 
  currentUserRole, 
  onMute, 
  onKick 
}: ParticipantItemProps) {
  const [showActions, setShowActions] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'therapist':
        return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'guardian':
        return <Shield className="h-4 w-4 text-blue-400" />;
      default:
        return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      therapist: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      guardian: 'bg-blue-100 text-blue-800 border-blue-200',
      client: 'bg-green-100 text-green-800 border-green-200',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[role as keyof typeof colors] || colors.client}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getConnectionStatus = (state: string) => {
    const colors = {
      connected: 'bg-green-500',
      connecting: 'bg-yellow-500',
      disconnected: 'bg-red-500',
      failed: 'bg-red-600',
    };

    return (
      <div className={`w-2 h-2 rounded-full ${colors[state as keyof typeof colors] || colors.disconnected}`}></div>
    );
  };

  const canManageParticipant = currentUserRole === 'therapist' && participant.role !== 'therapist';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div className="flex items-center space-x-3 flex-1">
        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            {getRoleIcon(participant.role)}
          </div>
          <div className="absolute -bottom-1 -right-1">
            {getConnectionStatus(participant.connectionState)}
          </div>
        </div>

        {/* Participant Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {participant.name}
            </h4>
            {getRoleBadge(participant.role)}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Audio Status */}
            <div className={`flex items-center space-x-1 ${participant.isAudioEnabled ? 'text-green-600' : 'text-red-600'}`}>
              {participant.isAudioEnabled ? (
                <Mic className="h-3 w-3" />
              ) : (
                <MicOff className="h-3 w-3" />
              )}
              <span className="text-xs">
                {participant.isAudioEnabled ? 'Mic on' : 'Muted'}
              </span>
            </div>

            {/* Video Status */}
            <div className={`flex items-center space-x-1 ${participant.isVideoEnabled ? 'text-green-600' : 'text-gray-600'}`}>
              {participant.isVideoEnabled ? (
                <Video className="h-3 w-3" />
              ) : (
                <VideoOff className="h-3 w-3" />
              )}
              <span className="text-xs">
                {participant.isVideoEnabled ? 'Camera on' : 'Camera off'}
              </span>
            </div>

            {/* Screen Share Status */}
            {participant.isScreenSharing && (
              <div className="flex items-center space-x-1 text-blue-600">
                <Monitor className="h-3 w-3" />
                <span className="text-xs">Sharing</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      {canManageParticipant && (
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowActions(!showActions)}
            className="w-8 h-8 p-0"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>

          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]"
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    onMute?.(!participant.isAudioEnabled);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                >
                  {participant.isAudioEnabled ? (
                    <>
                      <VolumeX className="h-4 w-4 text-red-500" />
                      <span>Mute participant</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4 text-green-500" />
                      <span>Unmute participant</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    onKick?.();
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                >
                  <UserX className="h-4 w-4" />
                  <span>Remove from session</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export function ParticipantList({
  participants,
  currentUserRole,
  onClose,
  onMuteParticipant,
  onKickParticipant,
  className = ''
}: ParticipantListProps) {
  const connectedParticipants = participants.filter(p => p.connectionState === 'connected');
  const connectingParticipants = participants.filter(p => p.connectionState === 'connecting');
  const disconnectedParticipants = participants.filter(p => 
    p.connectionState === 'disconnected' || p.connectionState === 'failed'
  );

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Participants ({participants.length})
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {/* Connected Participants */}
        {connectedParticipants.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Connected ({connectedParticipants.length})
            </h5>
            <div className="space-y-1">
              {connectedParticipants.map((participant) => (
                <ParticipantItem
                  key={participant.id}
                  participant={participant}
                  currentUserRole={currentUserRole}
                  onMute={(muted) => onMuteParticipant?.(participant.id, muted)}
                  onKick={() => onKickParticipant?.(participant.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Connecting Participants */}
        {connectingParticipants.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              Connecting ({connectingParticipants.length})
            </h5>
            <div className="space-y-1">
              {connectingParticipants.map((participant) => (
                <ParticipantItem
                  key={participant.id}
                  participant={participant}
                  currentUserRole={currentUserRole}
                />
              ))}
            </div>
          </div>
        )}

        {/* Disconnected Participants */}
        {disconnectedParticipants.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Disconnected ({disconnectedParticipants.length})
            </h5>
            <div className="space-y-1 opacity-60">
              {disconnectedParticipants.map((participant) => (
                <ParticipantItem
                  key={participant.id}
                  participant={participant}
                  currentUserRole={currentUserRole}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {participants.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No other participants in this session</p>
          </div>
        )}

        {/* Therapeutic Session Info */}
        <div className="mt-6 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <h6 className="text-sm font-medium text-purple-900 mb-2">
            🛡️ Safe Space Guidelines
          </h6>
          <ul className="text-xs text-purple-700 space-y-1">
            <li>• This is a confidential therapeutic environment</li>
            <li>• All participants should respect privacy and boundaries</li>
            <li>• Recording requires explicit consent from all parties</li>
            <li>• Emergency support is available 24/7</li>
          </ul>
        </div>

        {/* Session Statistics */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h6 className="text-sm font-medium text-gray-900 mb-2">Session Stats</h6>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <span className="font-medium">Connected:</span> {connectedParticipants.length}
            </div>
            <div>
              <span className="font-medium">Total:</span> {participants.length}
            </div>
            <div>
              <span className="font-medium">Audio Active:</span> {participants.filter(p => p.isAudioEnabled).length}
            </div>
            <div>
              <span className="font-medium">Video Active:</span> {participants.filter(p => p.isVideoEnabled).length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}