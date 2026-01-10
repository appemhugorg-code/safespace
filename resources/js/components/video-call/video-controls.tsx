import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MonitorOff,
  Phone,
  PhoneOff,
  Maximize2,
  Minimize2,
  Grid3X3,
  Users,
  Settings,
  Record,
  StopCircle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isRecording?: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleFullscreen: () => void;
  onToggleRecording?: () => void;
  onLeave: () => void;
  onLayoutChange: (layout: 'grid' | 'speaker' | 'sidebar') => void;
  currentLayout: 'grid' | 'speaker' | 'sidebar';
  participantRole: 'therapist' | 'client' | 'guardian';
  className?: string;
}

export function VideoControls({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  isRecording = false,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleFullscreen,
  onToggleRecording,
  onLeave,
  onLayoutChange,
  currentLayout,
  participantRole,
  className = ''
}: VideoControlsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const canRecord = participantRole === 'therapist';
  const canShareScreen = participantRole === 'therapist' || participantRole === 'guardian';

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`bg-gray-800 bg-opacity-90 backdrop-blur-sm p-4 ${className}`}
    >
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Left Controls - Basic Media */}
        <div className="flex items-center space-x-3">
          {/* Microphone */}
          <Button
            variant={isAudioEnabled ? "secondary" : "destructive"}
            size="lg"
            onClick={onToggleAudio}
            className="w-12 h-12 rounded-full"
            title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
          >
            {isAudioEnabled ? (
              <Mic className="h-5 w-5" />
            ) : (
              <MicOff className="h-5 w-5" />
            )}
          </Button>

          {/* Camera */}
          <Button
            variant={isVideoEnabled ? "secondary" : "destructive"}
            size="lg"
            onClick={onToggleVideo}
            className="w-12 h-12 rounded-full"
            title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
          >
            {isVideoEnabled ? (
              <Video className="h-5 w-5" />
            ) : (
              <VideoOff className="h-5 w-5" />
            )}
          </Button>

          {/* Screen Share (if permitted) */}
          {canShareScreen && (
            <Button
              variant={isScreenSharing ? "default" : "secondary"}
              size="lg"
              onClick={onToggleScreenShare}
              className="w-12 h-12 rounded-full"
              title={isScreenSharing ? "Stop sharing screen" : "Share screen"}
            >
              {isScreenSharing ? (
                <MonitorOff className="h-5 w-5" />
              ) : (
                <Monitor className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>

        {/* Center Controls - Layout and Advanced */}
        <div className="flex items-center space-x-3">
          {/* Layout Selector */}
          <div className="flex items-center bg-gray-700 rounded-lg p-1">
            <Button
              variant={currentLayout === 'grid' ? "default" : "ghost"}
              size="sm"
              onClick={() => onLayoutChange('grid')}
              className="px-3"
              title="Grid layout"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={currentLayout === 'speaker' ? "default" : "ghost"}
              size="sm"
              onClick={() => onLayoutChange('speaker')}
              className="px-3"
              title="Speaker view"
            >
              <Users className="h-4 w-4" />
            </Button>
            <Button
              variant={currentLayout === 'sidebar' ? "default" : "ghost"}
              size="sm"
              onClick={() => onLayoutChange('sidebar')}
              className="px-3"
              title="Sidebar layout"
            >
              <div className="w-4 h-4 border border-current rounded-sm">
                <div className="w-1 h-full bg-current ml-auto"></div>
              </div>
            </Button>
          </div>

          {/* Recording (Therapist only) */}
          {canRecord && onToggleRecording && (
            <Button
              variant={isRecording ? "destructive" : "secondary"}
              size="lg"
              onClick={onToggleRecording}
              className="w-12 h-12 rounded-full"
              title={isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? (
                <StopCircle className="h-5 w-5" />
              ) : (
                <Record className="h-5 w-5" />
              )}
            </Button>
          )}

          {/* Advanced Settings */}
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-12 h-12 rounded-full"
            title="Advanced settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Right Controls - Session Management */}
        <div className="flex items-center space-x-3">
          {/* Fullscreen */}
          <Button
            variant="secondary"
            size="lg"
            onClick={onToggleFullscreen}
            className="w-12 h-12 rounded-full"
            title="Toggle fullscreen"
          >
            <Maximize2 className="h-5 w-5" />
          </Button>

          {/* Leave Call */}
          <Button
            variant="destructive"
            size="lg"
            onClick={onLeave}
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700"
            title="Leave session"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Advanced Controls Panel */}
      {showAdvanced && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mt-4 pt-4 border-t border-gray-600"
        >
          <div className="flex items-center justify-center space-x-6">
            {/* Audio Settings */}
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-gray-300" />
              <span className="text-sm text-gray-300">Audio</span>
              <select className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600">
                <option>Default Microphone</option>
                <option>External Microphone</option>
              </select>
            </div>

            {/* Video Settings */}
            <div className="flex items-center space-x-2">
              <Video className="h-4 w-4 text-gray-300" />
              <span className="text-sm text-gray-300">Camera</span>
              <select className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600">
                <option>Default Camera</option>
                <option>External Camera</option>
              </select>
            </div>

            {/* Quality Settings */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">Quality</span>
              <select className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600">
                <option>Auto</option>
                <option>High (720p)</option>
                <option>Medium (480p)</option>
                <option>Low (360p)</option>
              </select>
            </div>

            {/* Therapeutic Features */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">Therapeutic Mode</span>
              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-green-600 hover:bg-green-700 border-green-500"
              >
                Calming Background
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Session Status Indicators */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-4 bg-black bg-opacity-50 rounded-lg px-4 py-2">
          {/* Connection Quality */}
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-white text-xs">Good Connection</span>
          </div>

          {/* Recording Status */}
          {isRecording && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-xs">Recording</span>
            </div>
          )}

          {/* Screen Share Status */}
          {isScreenSharing && (
            <div className="flex items-center space-x-1">
              <Monitor className="h-3 w-3 text-blue-400" />
              <span className="text-white text-xs">Sharing Screen</span>
            </div>
          )}

          {/* Therapeutic Session Indicator */}
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-white text-xs">Safe Space Active</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}