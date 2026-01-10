import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSessionRecording } from '@/hooks/use-session-recording';
import { WebRTCSignalingService } from '@/services/webrtc-signaling-service';
import { 
  Play, 
  Square, 
  Pause,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Shield,
  Clock,
  HardDrive,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SessionRecordingControlsProps {
  signalingService: WebRTCSignalingService | null;
  sessionData: {
    therapistId: string;
    clientIds: string[];
    guardianIds?: string[];
    appointmentId?: string;
  };
  className?: string;
}

export function SessionRecordingControls({ 
  signalingService, 
  sessionData, 
  className = '' 
}: SessionRecordingControlsProps) {
  const {
    currentSession,
    isSessionActive,
    sessionDuration,
    currentRecording,
    isRecording,
    recordingDuration,
    recordingSize,
    startSession,
    endSession,
    startRecording,
    stopRecording,
    sessionParticipants,
  } = useSessionRecording(signalingService, {
    autoStartSession: false,
    sessionType: 'therapy-session',
    ...sessionData,
  });

  const [recordingQuality, setRecordingQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [includeVideo, setIncludeVideo] = useState(true);
  const [includeAudio, setIncludeAudio] = useState(true);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleStartSession = async () => {
    try {
      await startSession();
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const handleEndSession = async () => {
    try {
      await endSession();
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  const handleStartRecording = async () => {
    try {
      await startRecording({
        quality: recordingQuality,
        includeAudio,
        includeVideo,
        encryption: encryptionEnabled,
      });
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      await stopRecording();
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const getRecordingStatusColor = () => {
    if (!currentRecording) return 'bg-gray-500';
    
    switch (currentRecording.status) {
      case 'recording': return 'bg-red-500';
      case 'processing': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getSessionStatusColor = () => {
    if (!currentSession) return 'bg-gray-500';
    
    switch (currentSession.status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'terminated': return 'bg-orange-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Video className="h-5 w-5" />
            <span>Session Recording</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            {/* Session Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getSessionStatusColor()}`} />
              <Badge variant={isSessionActive ? "default" : "secondary"}>
                {isSessionActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            {/* Recording Status */}
            {currentRecording && (
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getRecordingStatusColor()} ${isRecording ? 'animate-pulse' : ''}`} />
                <Badge variant={isRecording ? "destructive" : "secondary"}>
                  {currentRecording.status}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Session Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Session Management</h4>
            <Button
              variant={isSessionActive ? "destructive" : "default"}
              size="sm"
              onClick={isSessionActive ? handleEndSession : handleStartSession}
              disabled={!signalingService}
            >
              {isSessionActive ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  End Session
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Session
                </>
              )}
            </Button>
          </div>

          {/* Session Info */}
          {currentSession && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-600">Duration</p>
                  <p className="font-medium">{formatDuration(sessionDuration)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <Users className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-600">Participants</p>
                  <p className="font-medium">{sessionParticipants.length}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recording Controls */}
        <AnimatePresence>
          {isSessionActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 border-t pt-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Recording Controls</h4>
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  size="sm"
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                >
                  {isRecording ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
              </div>

              {/* Recording Settings */}
              {!isRecording && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="quality-select" className="text-sm">Quality</Label>
                      <Select value={recordingQuality} onValueChange={(value: any) => setRecordingQuality(value)}>
                        <SelectTrigger id="quality-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (500kbps)</SelectItem>
                          <SelectItem value="medium">Medium (1.5Mbps)</SelectItem>
                          <SelectItem value="high">High (3Mbps)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">Options</Label>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="include-video"
                            checked={includeVideo}
                            onCheckedChange={setIncludeVideo}
                          />
                          <Label htmlFor="include-video" className="text-xs flex items-center space-x-1">
                            {includeVideo ? <Video className="h-3 w-3" /> : <VideoOff className="h-3 w-3" />}
                            <span>Video</span>
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="include-audio"
                            checked={includeAudio}
                            onCheckedChange={setIncludeAudio}
                          />
                          <Label htmlFor="include-audio" className="text-xs flex items-center space-x-1">
                            {includeAudio ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
                            <span>Audio</span>
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <Label className="text-sm font-medium text-blue-800">HIPAA Compliance</Label>
                      </div>
                      <Switch
                        id="encryption"
                        checked={encryptionEnabled}
                        onCheckedChange={setEncryptionEnabled}
                      />
                    </div>
                    <p className="text-xs text-blue-700">
                      End-to-end encryption ensures therapeutic session recordings meet HIPAA requirements
                    </p>
                  </div>
                </div>
              )}

              {/* Recording Info */}
              {currentRecording && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-600">Recording Time</p>
                      <p className="font-medium">{formatDuration(recordingDuration)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <HardDrive className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-600">File Size</p>
                      <p className="font-medium">{formatFileSize(recordingSize)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Compliance Indicators */}
              <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">HIPAA Compliant Recording</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-700">Encrypted</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Advanced Settings */}
        <div className="border-t pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full justify-between"
          >
            <span>Advanced Settings</span>
            <motion.div
              animate={{ rotate: showAdvanced ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.div>
          </Button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-3"
              >
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="font-medium mb-1">Retention Policy</p>
                    <p className="text-xs text-gray-600">7 years (HIPAA compliant)</p>
                  </div>
                  
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="font-medium mb-1">Access Control</p>
                    <p className="text-xs text-gray-600">Therapist: Full access, Client: View only</p>
                  </div>
                  
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="font-medium mb-1">Audit Trail</p>
                    <p className="text-xs text-gray-600">All actions logged for compliance</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status Messages */}
        {!signalingService && (
          <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">WebRTC service not available</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}