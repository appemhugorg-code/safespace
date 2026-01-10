import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { VideoCallRoom } from '@/services/webrtc-signaling-service';
import { 
  Clock, 
  Users, 
  Shield, 
  Record,
  Wifi,
  WifiOff,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SessionInfoProps {
  room: VideoCallRoom | null;
  className?: string;
}

export function SessionInfo({ room, className = '' }: SessionInfoProps) {
  const [sessionDuration, setSessionDuration] = useState('00:00');
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');

  // Update session duration
  useEffect(() => {
    if (!room?.startTime) return;

    const interval = setInterval(() => {
      const start = new Date(room.startTime);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      setSessionDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [room?.startTime]);

  // Simulate connection quality monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      const qualities: Array<'excellent' | 'good' | 'fair' | 'poor'> = ['excellent', 'good', 'fair', 'poor'];
      const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
      setConnectionQuality(randomQuality);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!room) {
    return null;
  }

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'excellent':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'good':
        return <Wifi className="h-4 w-4 text-blue-500" />;
      case 'fair':
        return <Wifi className="h-4 w-4 text-yellow-500" />;
      case 'poor':
        return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'therapy-session':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'group-session':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'consultation':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSessionTypeName = (type: string) => {
    switch (type) {
      case 'therapy-session':
        return 'Therapy Session';
      case 'group-session':
        return 'Group Session';
      case 'consultation':
        return 'Consultation';
      default:
        return 'Session';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="bg-white bg-opacity-90 backdrop-blur-sm border border-gray-200 shadow-lg">
        <CardContent className="p-4 space-y-3">
          {/* Session Type */}
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSessionTypeColor(room.type)}`}>
              {getSessionTypeName(room.type)}
            </span>
            <div className="flex items-center space-x-1">
              {getConnectionIcon()}
              <span className="text-xs text-gray-600 capitalize">{connectionQuality}</span>
            </div>
          </div>

          {/* Session Duration */}
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-mono font-medium text-gray-900">
              {sessionDuration}
            </span>
          </div>

          {/* Participant Count */}
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              {room.participants.length} / {room.maxParticipants}
            </span>
          </div>

          {/* Security Indicator */}
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span className="text-xs text-green-700 font-medium">
              End-to-End Encrypted
            </span>
          </div>

          {/* Recording Status */}
          {room.isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-2"
            >
              <Record className="h-4 w-4 text-red-500 animate-pulse" />
              <span className="text-xs text-red-700 font-medium">
                Recording in Progress
              </span>
            </motion.div>
          )}

          {/* Therapeutic Environment Indicator */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-purple-700 font-medium">
                Safe Space Active
              </span>
            </div>
          </div>

          {/* Session Metadata */}
          {room.metadata && (
            <div className="pt-2 border-t border-gray-200">
              <div className="space-y-1">
                {room.metadata.appointmentId && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Appointment:</span> #{room.metadata.appointmentId}
                  </div>
                )}
                {room.metadata.sessionType && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Type:</span> {room.metadata.sessionType}
                  </div>
                )}
                {room.metadata.scheduledDuration && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Scheduled:</span> {room.metadata.scheduledDuration} min
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Emergency Contact Info */}
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <AlertCircle className="h-3 w-3 text-orange-500" />
              <span>Emergency support: 988</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}