import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoomParticipant } from '@/services/webrtc-signaling-service';
import { NetworkIndicator } from './network-indicator';
import { useCallQuality } from '@/hooks/use-call-quality';
import { WebRTCSignalingService } from '@/services/webrtc-signaling-service';
import { 
  Wifi, 
  WifiOff, 
  Users, 
  Shield, 
  Lock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ConnectionStatusProps {
  isConnected: boolean;
  participants: RoomParticipant[];
  signalingService?: WebRTCSignalingService | null;
  className?: string;
  showQualityDetails?: boolean;
}

export function ConnectionStatus({ 
  isConnected, 
  participants, 
  signalingService,
  className = '',
  showQualityDetails = false
}: ConnectionStatusProps) {
  const {
    isMonitoring,
    networkConditions,
  } = useCallQuality(signalingService || null, {
    autoAdaptation: true,
    monitoringEnabled: true,
  });

  const connectedParticipants = participants.filter(p => p.connectionState === 'connected');
  const connectingParticipants = participants.filter(p => p.connectionState === 'connecting');
  const failedParticipants = participants.filter(p => p.connectionState === 'failed' || p.connectionState === 'disconnected');

  // Get overall network quality
  const getOverallQuality = () => {
    if (networkConditions.size === 0) return 'unknown';
    
    const qualities = Array.from(networkConditions.values()).map(c => c.quality);
    const qualityScores = { excellent: 5, good: 4, fair: 3, poor: 2, critical: 1 };
    const avgScore = qualities.reduce((sum, q) => sum + qualityScores[q], 0) / qualities.length;
    
    if (avgScore >= 4.5) return 'excellent';
    if (avgScore >= 3.5) return 'good';
    if (avgScore >= 2.5) return 'fair';
    if (avgScore >= 1.5) return 'poor';
    return 'critical';
  };

  const getStatusIcon = () => {
    if (!isConnected || failedParticipants.length > 0) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    if (connectingParticipants.length > 0) {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (!isConnected) return 'Disconnected';
    if (failedParticipants.length > 0) return 'Connection Issues';
    if (connectingParticipants.length > 0) return 'Connecting...';
    return 'Connected';
  };

  const getStatusVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    if (!isConnected || failedParticipants.length > 0) return 'destructive';
    if (connectingParticipants.length > 0) return 'secondary';
    return 'default';
  };

  const getQualityIcon = () => {
    const quality = getOverallQuality();
    switch (quality) {
      case 'excellent':
      case 'good':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'fair':
        return <Wifi className="h-4 w-4 text-yellow-500" />;
      case 'poor':
      case 'critical':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={className}
    >
      <Card className="bg-white bg-opacity-90 backdrop-blur-sm shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <Badge variant={getStatusVariant()}>
                {getStatusText()}
              </Badge>
            </div>

            {/* Participant Count */}
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{participants.length}</span>
            </div>

            {/* Network Quality Indicator */}
            <div className="flex items-center space-x-1">
              {getQualityIcon()}
              {isMonitoring && (
                <Activity className="h-3 w-3 text-blue-500 animate-pulse" />
              )}
            </div>

            {/* Security Indicators */}
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4 text-green-600" title="HIPAA Compliant" />
              <Lock className="h-4 w-4 text-blue-600" title="End-to-End Encrypted" />
            </div>
          </div>

          {/* Connection Details */}
          {participants.length > 0 && (
            <div className="mt-2 text-xs text-gray-600">
              {connectedParticipants.length} connected
              {connectingParticipants.length > 0 && `, ${connectingParticipants.length} connecting`}
              {failedParticipants.length > 0 && `, ${failedParticipants.length} failed`}
            </div>
          )}

          {/* Quality Details */}
          {showQualityDetails && networkConditions.size > 0 && (
            <div className="mt-3 space-y-2">
              {participants.map(participant => {
                const condition = networkConditions.get(participant.id);
                if (!condition) return null;

                return (
                  <NetworkIndicator
                    key={participant.id}
                    condition={condition}
                    participantName={participant.name}
                    size="sm"
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}