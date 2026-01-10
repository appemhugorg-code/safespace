import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCallQuality } from '@/hooks/use-call-quality';
import { WebRTCSignalingService } from '@/services/webrtc-signaling-service';
import { NetworkCondition, CallQualityMetrics } from '@/services/call-quality-service';
import { 
  Wifi, 
  WifiOff, 
  Signal, 
  SignalHigh, 
  SignalMedium, 
  SignalLow,
  Activity,
  Settings,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QualityMonitorProps {
  signalingService: WebRTCSignalingService | null;
  participants: Array<{ id: string; name: string; role: string }>;
  className?: string;
  compact?: boolean;
}

export function QualityMonitor({ 
  signalingService, 
  participants, 
  className = '',
  compact = false 
}: QualityMonitorProps) {
  const {
    isMonitoring,
    isAdapting,
    qualityMetrics,
    networkConditions,
    qualityPresets,
    startMonitoring,
    stopMonitoring,
    enableAutoAdaptation,
    setManualQuality,
    getParticipantQuality,
    onQualityChanged,
    onNetworkConditionChanged,
  } = useCallQuality(signalingService, {
    autoAdaptation: true,
    monitoringEnabled: true,
  });

  const [selectedParticipant, setSelectedParticipant] = useState<string>('');
  const [autoAdaptationEnabled, setAutoAdaptationEnabled] = useState(true);
  const [showDetails, setShowDetails] = useState(!compact);
  const [qualityHistory, setQualityHistory] = useState<Map<string, NetworkCondition[]>>(new Map());

  // Update selected participant when participants change
  useEffect(() => {
    if (participants.length > 0 && !selectedParticipant) {
      setSelectedParticipant(participants[0].id);
    }
  }, [participants, selectedParticipant]);

  // Track quality history for trends
  useEffect(() => {
    const cleanup = onNetworkConditionChanged(({ participantId, condition }: any) => {
      setQualityHistory(prev => {
        const newHistory = new Map(prev);
        const participantHistory = newHistory.get(participantId) || [];
        const updatedHistory = [...participantHistory, condition].slice(-20); // Keep last 20 measurements
        newHistory.set(participantId, updatedHistory);
        return newHistory;
      });
    });

    return cleanup;
  }, [onNetworkConditionChanged]);

  const getQualityIcon = (quality: NetworkCondition['quality']) => {
    switch (quality) {
      case 'excellent':
        return <SignalHigh className="h-4 w-4 text-green-500" />;
      case 'good':
        return <Signal className="h-4 w-4 text-blue-500" />;
      case 'fair':
        return <SignalMedium className="h-4 w-4 text-yellow-500" />;
      case 'poor':
        return <SignalLow className="h-4 w-4 text-orange-500" />;
      case 'critical':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-500" />;
    }
  };

  const getQualityColor = (quality: NetworkCondition['quality']) => {
    switch (quality) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getQualityTrend = (participantId: string): 'up' | 'down' | 'stable' => {
    const history = qualityHistory.get(participantId);
    if (!history || history.length < 3) return 'stable';

    const recent = history.slice(-3);
    const qualityValues = { excellent: 5, good: 4, fair: 3, poor: 2, critical: 1 };
    
    const trend = recent.map(h => qualityValues[h.quality]);
    const avgRecent = trend.slice(-2).reduce((a, b) => a + b, 0) / 2;
    const avgPrevious = trend.slice(0, -1).reduce((a, b) => a + b, 0) / (trend.length - 1);

    if (avgRecent > avgPrevious + 0.5) return 'up';
    if (avgRecent < avgPrevious - 0.5) return 'down';
    return 'stable';
  };

  const handleManualQualityChange = async (participantId: string, presetName: string) => {
    try {
      await setManualQuality(participantId, presetName);
    } catch (error) {
      console.error('Failed to change quality:', error);
    }
  };

  const handleAutoAdaptationToggle = async (participantId: string, enabled: boolean) => {
    if (enabled) {
      try {
        await enableAutoAdaptation(participantId);
      } catch (error) {
        console.error('Failed to enable auto-adaptation:', error);
      }
    }
    setAutoAdaptationEnabled(enabled);
  };

  const selectedMetrics = selectedParticipant ? getParticipantQuality(selectedParticipant) : null;
  const selectedCondition = selectedParticipant ? networkConditions.get(selectedParticipant) : null;
  const selectedParticipantData = participants.find(p => p.id === selectedParticipant);

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {participants.map(participant => {
          const condition = networkConditions.get(participant.id);
          if (!condition) return null;

          return (
            <motion.div
              key={participant.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-1"
            >
              {getQualityIcon(condition.quality)}
              <span className="text-xs text-gray-600">{participant.name}</span>
            </motion.div>
          );
        })}
        
        {isAdapting && (
          <div className="flex items-center space-x-1">
            <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
            <span className="text-xs text-blue-600">Adapting...</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Call Quality Monitor</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Badge variant={isMonitoring ? "default" : "secondary"}>
              {isMonitoring ? 'Monitoring' : 'Stopped'}
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
            >
              {isMonitoring ? 'Stop' : 'Start'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Participant Selection */}
        <div className="flex items-center space-x-4">
          <Label htmlFor="participant-select" className="text-sm font-medium">
            Participant:
          </Label>
          <Select value={selectedParticipant} onValueChange={setSelectedParticipant}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select participant" />
            </SelectTrigger>
            <SelectContent>
              {participants.map(participant => (
                <SelectItem key={participant.id} value={participant.id}>
                  <div className="flex items-center space-x-2">
                    {networkConditions.get(participant.id) && 
                      getQualityIcon(networkConditions.get(participant.id)!.quality)
                    }
                    <span>{participant.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Network Condition Display */}
        {selectedCondition && selectedParticipantData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Overall Quality */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getQualityIcon(selectedCondition.quality)}
                <div>
                  <h4 className="font-medium capitalize">{selectedCondition.quality} Connection</h4>
                  <p className="text-sm text-gray-600">{selectedParticipantData.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getQualityTrend(selectedParticipant) === 'up' && (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                )}
                {getQualityTrend(selectedParticipant) === 'down' && (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                
                <div className={`w-3 h-3 rounded-full ${getQualityColor(selectedCondition.quality)}`} />
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bandwidth</span>
                  <span className="font-medium">{Math.round(selectedCondition.bandwidth)} kbps</span>
                </div>
              </div>
              
              <div className="p-3 bg-white border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Latency</span>
                  <span className="font-medium">{Math.round(selectedCondition.latency)} ms</span>
                </div>
              </div>
              
              <div className="p-3 bg-white border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Packet Loss</span>
                  <span className="font-medium">{selectedCondition.packetLoss.toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="p-3 bg-white border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Jitter</span>
                  <span className="font-medium">{Math.round(selectedCondition.jitter)} ms</span>
                </div>
              </div>
            </div>

            {/* Quality Controls */}
            <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-adaptation" className="text-sm font-medium">
                  Auto Quality Adaptation
                </Label>
                <Switch
                  id="auto-adaptation"
                  checked={autoAdaptationEnabled}
                  onCheckedChange={(checked) => handleAutoAdaptationToggle(selectedParticipant, checked)}
                />
              </div>

              {!autoAdaptationEnabled && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Manual Quality Setting</Label>
                  <Select
                    value={selectedMetrics?.currentSettings ? 
                      qualityPresets.find(p => 
                        p.video.bitrate === selectedMetrics.currentSettings.video.bitrate
                      )?.name || 'custom' : 'medium'
                    }
                    onValueChange={(value) => handleManualQualityChange(selectedParticipant, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {qualityPresets.map(preset => (
                        <SelectItem key={preset.name} value={preset.name}>
                          <div className="flex flex-col">
                            <span>{preset.label}</span>
                            <span className="text-xs text-gray-500">
                              {preset.video.bitrate > 0 ? 
                                `${preset.video.width}x${preset.video.height} @ ${preset.video.bitrate}kbps` :
                                'Audio Only'
                              }
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Adaptation Status */}
            <AnimatePresence>
              {isAdapting && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
                  <span className="text-sm text-blue-700">Adapting video quality...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recommendations */}
            {selectedMetrics?.recommendedSettings && selectedMetrics.currentSettings && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Quality Recommendation</p>
                    <p className="text-yellow-700">
                      {selectedMetrics.recommendedSettings.video.bitrate !== selectedMetrics.currentSettings.video.bitrate &&
                        `Consider ${selectedMetrics.recommendedSettings.video.bitrate > selectedMetrics.currentSettings.video.bitrate ? 'increasing' : 'decreasing'} video quality based on current network conditions.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* No Data State */}
        {!selectedCondition && selectedParticipant && (
          <div className="text-center py-8 text-gray-500">
            <Wifi className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No quality data available for this participant</p>
            <p className="text-sm">Quality monitoring will begin automatically</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}