import React from 'react';
import { Badge } from '@/components/ui/badge';
import { NetworkCondition } from '@/services/call-quality-service';
import { 
  Wifi, 
  WifiOff, 
  Signal, 
  SignalHigh, 
  SignalMedium, 
  SignalLow,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NetworkIndicatorProps {
  condition: NetworkCondition;
  participantName?: string;
  showDetails?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function NetworkIndicator({ 
  condition, 
  participantName,
  showDetails = false,
  className = '',
  size = 'md'
}: NetworkIndicatorProps) {
  const getQualityConfig = (quality: NetworkCondition['quality']) => {
    switch (quality) {
      case 'excellent':
        return {
          icon: SignalHigh,
          color: 'text-green-500',
          bgColor: 'bg-green-500',
          badgeVariant: 'default' as const,
          label: 'Excellent',
          description: 'Perfect connection quality',
        };
      case 'good':
        return {
          icon: Signal,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500',
          badgeVariant: 'default' as const,
          label: 'Good',
          description: 'Good connection quality',
        };
      case 'fair':
        return {
          icon: SignalMedium,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500',
          badgeVariant: 'secondary' as const,
          label: 'Fair',
          description: 'Acceptable connection quality',
        };
      case 'poor':
        return {
          icon: SignalLow,
          color: 'text-orange-500',
          bgColor: 'bg-orange-500',
          badgeVariant: 'destructive' as const,
          label: 'Poor',
          description: 'Poor connection quality',
        };
      case 'critical':
        return {
          icon: WifiOff,
          color: 'text-red-500',
          bgColor: 'bg-red-500',
          badgeVariant: 'destructive' as const,
          label: 'Critical',
          description: 'Critical connection issues',
        };
      default:
        return {
          icon: Wifi,
          color: 'text-gray-500',
          bgColor: 'bg-gray-500',
          badgeVariant: 'secondary' as const,
          label: 'Unknown',
          description: 'Connection status unknown',
        };
    }
  };

  const getSizeConfig = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return {
          iconSize: 'h-3 w-3',
          dotSize: 'w-2 h-2',
          textSize: 'text-xs',
          spacing: 'space-x-1',
          padding: 'p-1',
        };
      case 'lg':
        return {
          iconSize: 'h-6 w-6',
          dotSize: 'w-4 h-4',
          textSize: 'text-base',
          spacing: 'space-x-3',
          padding: 'p-3',
        };
      default: // md
        return {
          iconSize: 'h-4 w-4',
          dotSize: 'w-3 h-3',
          textSize: 'text-sm',
          spacing: 'space-x-2',
          padding: 'p-2',
        };
    }
  };

  const qualityConfig = getQualityConfig(condition.quality);
  const sizeConfig = getSizeConfig(size);
  const IconComponent = qualityConfig.icon;

  const getMetricStatus = (value: number, thresholds: { good: number; fair: number }) => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.fair) return 'fair';
    return 'poor';
  };

  const latencyStatus = getMetricStatus(condition.latency, { good: 100, fair: 200 });
  const packetLossStatus = getMetricStatus(condition.packetLoss, { good: 1, fair: 5 });
  const jitterStatus = getMetricStatus(condition.jitter, { good: 20, fair: 50 });

  if (!showDetails) {
    return (
      <div className={`flex items-center ${sizeConfig.spacing} ${className}`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative"
        >
          <IconComponent className={`${sizeConfig.iconSize} ${qualityConfig.color}`} />
          {condition.quality === 'critical' && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute -top-1 -right-1"
            >
              <AlertTriangle className="h-2 w-2 text-red-500" />
            </motion.div>
          )}
        </motion.div>
        
        {participantName && (
          <span className={`${sizeConfig.textSize} text-gray-600 truncate`}>
            {participantName}
          </span>
        )}
        
        <Badge variant={qualityConfig.badgeVariant} className={sizeConfig.textSize}>
          {qualityConfig.label}
        </Badge>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border rounded-lg shadow-sm ${sizeConfig.padding} ${className}`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between mb-3`}>
        <div className={`flex items-center ${sizeConfig.spacing}`}>
          <IconComponent className={`${sizeConfig.iconSize} ${qualityConfig.color}`} />
          <div>
            <h4 className={`font-medium ${sizeConfig.textSize}`}>
              {participantName || 'Network Status'}
            </h4>
            <p className={`text-gray-500 ${sizeConfig.textSize === 'text-xs' ? 'text-xs' : 'text-xs'}`}>
              {qualityConfig.description}
            </p>
          </div>
        </div>
        
        <Badge variant={qualityConfig.badgeVariant}>
          {qualityConfig.label}
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Bandwidth */}
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex items-center space-x-1">
            <Activity className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">Bandwidth</span>
          </div>
          <span className="text-xs font-medium">
            {Math.round(condition.bandwidth)} kbps
          </span>
        </div>

        {/* Latency */}
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">Latency</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs font-medium">
              {Math.round(condition.latency)} ms
            </span>
            <div className={`w-2 h-2 rounded-full ${
              latencyStatus === 'good' ? 'bg-green-500' :
              latencyStatus === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
          </div>
        </div>

        {/* Packet Loss */}
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex items-center space-x-1">
            <AlertTriangle className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">Loss</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs font-medium">
              {condition.packetLoss.toFixed(1)}%
            </span>
            <div className={`w-2 h-2 rounded-full ${
              packetLossStatus === 'good' ? 'bg-green-500' :
              packetLossStatus === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
          </div>
        </div>

        {/* Jitter */}
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex items-center space-x-1">
            <Signal className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">Jitter</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs font-medium">
              {Math.round(condition.jitter)} ms
            </span>
            <div className={`w-2 h-2 rounded-full ${
              jitterStatus === 'good' ? 'bg-green-500' :
              jitterStatus === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
          </div>
        </div>
      </div>

      {/* Quality Indicator Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600">Connection Quality</span>
          <span className="text-xs font-medium">{qualityConfig.label}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: condition.quality === 'excellent' ? '100%' :
                     condition.quality === 'good' ? '80%' :
                     condition.quality === 'fair' ? '60%' :
                     condition.quality === 'poor' ? '40%' : '20%'
            }}
            transition={{ duration: 0.5 }}
            className={`h-2 rounded-full ${qualityConfig.bgColor}`}
          />
        </div>
      </div>

      {/* Timestamp */}
      <div className="mt-2 text-xs text-gray-400 text-center">
        Last updated: {new Date(condition.timestamp).toLocaleTimeString()}
      </div>
    </motion.div>
  );
}