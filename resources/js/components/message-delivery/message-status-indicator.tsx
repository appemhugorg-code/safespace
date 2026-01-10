import React from 'react';
import { 
  Clock, 
  Send, 
  Check, 
  CheckCheck, 
  Eye, 
  AlertCircle, 
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { MessageStatus } from '@/services/message-delivery-service';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageStatusIndicatorProps {
  status: MessageStatus['status'];
  timestamp?: Date;
  showText?: boolean;
  showTimestamp?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export function MessageStatusIndicator({
  status,
  timestamp,
  showText = false,
  showTimestamp = false,
  size = 'md',
  animated = true,
  className = '',
}: MessageStatusIndicatorProps) {
  const getStatusConfig = (status: MessageStatus['status']) => {
    switch (status) {
      case 'sending':
        return {
          icon: Clock,
          color: 'text-gray-400',
          bgColor: 'bg-gray-100',
          text: 'Sending...',
          description: 'Message is being sent',
        };
      case 'sent':
        return {
          icon: Send,
          color: 'text-blue-500',
          bgColor: 'bg-blue-100',
          text: 'Sent',
          description: 'Message sent successfully',
        };
      case 'delivered':
        return {
          icon: Check,
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          text: 'Delivered',
          description: 'Message delivered to recipient',
        };
      case 'read':
        return {
          icon: CheckCheck,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          text: 'Read',
          description: 'Message read by recipient',
        };
      case 'failed':
        return {
          icon: AlertCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-100',
          text: 'Failed',
          description: 'Message delivery failed',
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-400',
          bgColor: 'bg-gray-100',
          text: 'Unknown',
          description: 'Unknown status',
        };
    }
  };

  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return {
          icon: 'h-3 w-3',
          container: 'p-1',
          text: 'text-xs',
        };
      case 'md':
        return {
          icon: 'h-4 w-4',
          container: 'p-1.5',
          text: 'text-sm',
        };
      case 'lg':
        return {
          icon: 'h-5 w-5',
          container: 'p-2',
          text: 'text-base',
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);
  const IconComponent = config.icon;

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) { // Less than 1 minute
      return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    } else if (diff < 86400000) { // Less than 1 day
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Status Icon */}
      <div className={`
        rounded-full flex items-center justify-center
        ${config.bgColor} ${sizeClasses.container}
      `}>
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={animated ? { scale: 0, rotate: -180 } : false}
            animate={{ scale: 1, rotate: 0 }}
            exit={animated ? { scale: 0, rotate: 180 } : false}
            transition={{ duration: 0.2 }}
          >
            {status === 'sending' && animated ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <RefreshCw className={`${sizeClasses.icon} ${config.color}`} />
              </motion.div>
            ) : (
              <IconComponent className={`${sizeClasses.icon} ${config.color}`} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Status Text */}
      {showText && (
        <span className={`${config.color} ${sizeClasses.text} font-medium`}>
          {config.text}
        </span>
      )}

      {/* Timestamp */}
      {showTimestamp && timestamp && (
        <span className={`text-gray-500 ${sizeClasses.text}`}>
          {formatTimestamp(timestamp)}
        </span>
      )}
    </div>
  );
}

interface MessageStatusTooltipProps {
  status: MessageStatus['status'];
  timestamp?: Date;
  retryCount?: number;
  errorReason?: string;
  children: React.ReactNode;
}

export function MessageStatusTooltip({
  status,
  timestamp,
  retryCount,
  errorReason,
  children,
}: MessageStatusTooltipProps) {
  const config = getStatusConfig(status);
  
  const getTooltipContent = () => {
    let content = config.description;
    
    if (timestamp) {
      content += `\n${timestamp.toLocaleString()}`;
    }
    
    if (retryCount && retryCount > 0) {
      content += `\nRetries: ${retryCount}`;
    }
    
    if (errorReason) {
      content += `\nError: ${errorReason}`;
    }
    
    return content;
  };

  return (
    <div 
      title={getTooltipContent()}
      className="cursor-help"
    >
      {children}
    </div>
  );
}

interface MessageStatusListProps {
  statuses: MessageStatus[];
  showDetails?: boolean;
  className?: string;
}

export function MessageStatusList({
  statuses,
  showDetails = false,
  className = '',
}: MessageStatusListProps) {
  if (statuses.length === 0) {
    return null;
  }

  // Group statuses by status type
  const statusGroups = statuses.reduce((groups, status) => {
    if (!groups[status.status]) {
      groups[status.status] = [];
    }
    groups[status.status].push(status);
    return groups;
  }, {} as Record<MessageStatus['status'], MessageStatus[]>);

  return (
    <div className={`space-y-2 ${className}`}>
      {Object.entries(statusGroups).map(([statusType, statusList]) => (
        <div key={statusType} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageStatusIndicator
              status={statusType as MessageStatus['status']}
              showText={true}
              size="sm"
            />
            <span className="text-xs text-gray-500">
              ({statusList.length})
            </span>
          </div>
          
          {showDetails && (
            <div className="text-xs text-gray-500">
              {statusList[0].timestamp.toLocaleTimeString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Helper function used in tooltip
function getStatusConfig(status: MessageStatus['status']) {
  switch (status) {
    case 'sending':
      return {
        icon: Clock,
        color: 'text-gray-400',
        bgColor: 'bg-gray-100',
        text: 'Sending...',
        description: 'Message is being sent',
      };
    case 'sent':
      return {
        icon: Send,
        color: 'text-blue-500',
        bgColor: 'bg-blue-100',
        text: 'Sent',
        description: 'Message sent successfully',
      };
    case 'delivered':
      return {
        icon: Check,
        color: 'text-green-500',
        bgColor: 'bg-green-100',
        text: 'Delivered',
        description: 'Message delivered to recipient',
      };
    case 'read':
      return {
        icon: CheckCheck,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        text: 'Read',
        description: 'Message read by recipient',
      };
    case 'failed':
      return {
        icon: AlertCircle,
        color: 'text-red-500',
        bgColor: 'bg-red-100',
        text: 'Failed',
        description: 'Message delivery failed',
      };
    default:
      return {
        icon: Clock,
        color: 'text-gray-400',
        bgColor: 'bg-gray-100',
        text: 'Unknown',
        description: 'Unknown status',
      };
  }
}