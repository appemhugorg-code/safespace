import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWebRTC } from '@/hooks/use-webrtc';
import { VideoControls } from './video-controls';
import { ParticipantGrid } from './participant-grid';
import { ParticipantList } from './participant-list';
import { ChatPanel } from './chat-panel';
import { SessionInfo } from './session-info';
import { ConnectionStatus } from './connection-status';
import { QualityMonitor } from './quality-monitor';
import { SessionRecordingControls } from './session-recording-controls';
import { SessionNotesComponent } from './session-notes';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  MonitorOff,
  Users,
  MessageSquare,
  Settings,
  Phone,
  PhoneOff,
  Maximize2,
  Minimize2,
  FileText,
  PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoCallInterfaceProps {
  roomId: string;
  participantInfo: {
    name: string;
    role: 'therapist' | 'client' | 'guardian';
  };
  onLeave?: () => void;
  className?: string;
}

export function VideoCallInterface({ 
  roomId, 
  participantInfo, 
  onLeave,
  className = '' 
}: VideoCallInterfaceProps) {
  const {
    isConnected,
    isConnecting,
    connectionError,
    currentRoom,
    participants,
    localStream,
    remoteStreams,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    joinRoom,
    leaveRoom,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    signalingService,
  } = useWebRTC({
    autoJoin: true,
    roomId,
    participantInfo,
  });

  // UI State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQualityMonitor, setShowQualityMonitor] = useState(false);
  const [showRecording, setShowRecording] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'speaker' | 'sidebar'>('grid');

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle room joining
  useEffect(() => {
    if (!isConnected && !isConnecting && roomId && participantInfo) {
      joinRoom(roomId, participantInfo);
    }
  }, [isConnected, isConnecting, roomId, participantInfo, joinRoom]);

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle leaving the call
  const handleLeave = async () => {
    await leaveRoom();
    onLeave?.();
  };

  // Handle screen sharing
  const handleScreenShare = async () => {
    if (isScreenSharing) {
      await stopScreenShare();
    } else {
      try {
        await startScreenShare();
      } catch (error) {
        console.error('Failed to start screen sharing:', error);
      }
    }
  };

  if (connectionError) {
    return (
      <Card className="w-full h-96 flex items-center justify-center">
        <CardContent className="text-center">
          <div className="text-red-500 mb-4">
            <PhoneOff className="h-12 w-12 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Connection Error</h3>
          </div>
          <p className="text-gray-600 mb-4">{connectionError}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isConnecting) {
    return (
      <Card className="w-full h-96 flex items-center justify-center">
        <CardContent className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Connecting to session...</h3>
          <p className="text-gray-600">Please wait while we establish the connection</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-screen bg-gray-900 overflow-hidden ${className}`}
    >
      {/* Connection Status */}
      <ConnectionStatus 
        isConnected={isConnected}
        participants={participants}
        signalingService={signalingService}
        className="absolute top-4 left-4 z-20"
      />

      {/* Session Info */}
      <SessionInfo 
        room={currentRoom}
        className="absolute top-4 right-4 z-20"
      />

      {/* Main Video Area */}
      <div className="relative w-full h-full">
        <ParticipantGrid
          localStream={localStream}
          remoteStreams={remoteStreams}
          participants={participants}
          layoutMode={layoutMode}
          isScreenSharing={isScreenSharing}
          className="w-full h-full"
        />

        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <VideoControls
            isAudioEnabled={isAudioEnabled}
            isVideoEnabled={isVideoEnabled}
            isScreenSharing={isScreenSharing}
            onToggleAudio={toggleAudio}
            onToggleVideo={toggleVideo}
            onToggleScreenShare={handleScreenShare}
            onToggleFullscreen={toggleFullscreen}
            onLeave={handleLeave}
            onLayoutChange={setLayoutMode}
            currentLayout={layoutMode}
            participantRole={participantInfo.role}
          />
        </div>

        {/* Side Panels */}
        <AnimatePresence>
          {showParticipants && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 w-80 h-full bg-white shadow-lg z-30"
            >
              <ParticipantList
                participants={participants}
                currentUserRole={participantInfo.role}
                onClose={() => setShowParticipants(false)}
              />
            </motion.div>
          )}

          {showChat && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 w-80 h-full bg-white shadow-lg z-30"
            >
              <ChatPanel
                roomId={roomId}
                participants={participants}
                onClose={() => setShowChat(false)}
              />
            </motion.div>
          )}

          {showQualityMonitor && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 w-96 h-full bg-white shadow-lg z-30 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Call Quality</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQualityMonitor(false)}
                  >
                    ×
                  </Button>
                </div>
                <QualityMonitor
                  signalingService={signalingService}
                  participants={participants.map(p => ({
                    id: p.id,
                    name: p.name,
                    role: p.role,
                  }))}
                />
              </div>
            </motion.div>
          )}

          {showRecording && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 w-96 h-full bg-white shadow-lg z-30 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Session Recording</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRecording(false)}
                  >
                    ×
                  </Button>
                </div>
                <SessionRecordingControls
                  signalingService={signalingService}
                  sessionData={{
                    therapistId: currentRoom?.therapistId || '',
                    clientIds: currentRoom?.clientIds || [],
                    guardianIds: currentRoom?.guardianIds || [],
                    appointmentId: currentRoom?.appointmentId,
                  }}
                />
              </div>
            </motion.div>
          )}

          {showNotes && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 w-96 h-full bg-white shadow-lg z-30 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Session Notes</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotes(false)}
                  >
                    ×
                  </Button>
                </div>
                <SessionNotesComponent
                  signalingService={signalingService}
                  sessionData={{
                    therapistId: currentRoom?.therapistId || '',
                    clientIds: currentRoom?.clientIds || [],
                    guardianIds: currentRoom?.guardianIds || [],
                    appointmentId: currentRoom?.appointmentId,
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Buttons */}
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 space-y-2 z-20">
          <Button
            variant={showParticipants ? "default" : "secondary"}
            size="sm"
            onClick={() => {
              setShowParticipants(!showParticipants);
              setShowChat(false);
              setShowQualityMonitor(false);
              setShowRecording(false);
              setShowNotes(false);
            }}
            className="w-12 h-12 rounded-full shadow-lg"
          >
            <Users className="h-5 w-5" />
          </Button>

          <Button
            variant={showChat ? "default" : "secondary"}
            size="sm"
            onClick={() => {
              setShowChat(!showChat);
              setShowParticipants(false);
              setShowQualityMonitor(false);
              setShowRecording(false);
              setShowNotes(false);
            }}
            className="w-12 h-12 rounded-full shadow-lg"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          <Button
            variant={showQualityMonitor ? "default" : "secondary"}
            size="sm"
            onClick={() => {
              setShowQualityMonitor(!showQualityMonitor);
              setShowChat(false);
              setShowParticipants(false);
              setShowRecording(false);
              setShowNotes(false);
            }}
            className="w-12 h-12 rounded-full shadow-lg"
          >
            <Monitor className="h-5 w-5" />
          </Button>

          <Button
            variant={showRecording ? "default" : "secondary"}
            size="sm"
            onClick={() => {
              setShowRecording(!showRecording);
              setShowChat(false);
              setShowParticipants(false);
              setShowQualityMonitor(false);
              setShowNotes(false);
            }}
            className="w-12 h-12 rounded-full shadow-lg"
          >
            <PlayCircle className="h-5 w-5" />
          </Button>

          <Button
            variant={showNotes ? "default" : "secondary"}
            size="sm"
            onClick={() => {
              setShowNotes(!showNotes);
              setShowChat(false);
              setShowParticipants(false);
              setShowQualityMonitor(false);
              setShowRecording(false);
            }}
            className="w-12 h-12 rounded-full shadow-lg"
          >
            <FileText className="h-5 w-5" />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="w-12 h-12 rounded-full shadow-lg"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Local Video Preview (Picture-in-Picture) */}
        {localStream && (
          <div className="absolute bottom-20 left-4 w-48 h-36 bg-black rounded-lg overflow-hidden shadow-lg z-20">
            <video
              ref={(video) => {
                if (video && localStream) {
                  video.srcObject = localStream;
                }
              }}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
              You {!isVideoEnabled && '(Camera Off)'}
            </div>
            {!isAudioEnabled && (
              <div className="absolute top-2 right-2">
                <MicOff className="h-4 w-4 text-red-500" />
              </div>
            )}
          </div>
        )}

        {/* Therapeutic Environment Indicators */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 space-y-2 z-20">
          {/* Safe Space Indicator */}
          <div className="bg-green-500 bg-opacity-20 backdrop-blur-sm rounded-full p-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* Session Type Indicator */}
          <div className="bg-blue-500 bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2">
            <span className="text-white text-xs font-medium">
              {currentRoom?.type === 'therapy-session' ? 'Therapy' : 
               currentRoom?.type === 'group-session' ? 'Group' : 'Consultation'}
            </span>
          </div>
        </div>

        {/* Emergency/Crisis Button (Always Visible) */}
        <Button
          variant="destructive"
          size="sm"
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-red-600 hover:bg-red-700"
          onClick={() => {
            // Handle emergency/crisis situation
            console.log('Emergency button clicked');
          }}
        >
          🆘 Emergency
        </Button>
      </div>
    </div>
  );
}