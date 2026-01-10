import React from 'react';
import { useTheme } from '@/contexts/theme-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Check, 
  Clock, 
  AlertCircle,
  Cloud,
  CloudOff,
  Smartphone,
  Monitor
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ThemeSyncStatusProps {
  showDetails?: boolean;
  compact?: boolean;
}

export function ThemeSyncStatus({ showDetails = false, compact = false }: ThemeSyncStatusProps) {
  const { syncStatus, forceSyncTheme, effectiveMode } = useTheme();
  const { isOnline, syncInProgress, queueLength, lastSyncTimestamp } = syncStatus;

  const getSyncStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        label: 'Offline',
        description: 'Theme changes will sync when online',
        variant: 'secondary' as const,
        color: 'text-muted-foreground'
      };
    }

    if (syncInProgress) {
      return {
        icon: RefreshCw,
        label: 'Syncing',
        description: 'Synchronizing theme preferences...',
        variant: 'default' as const,
        color: 'text-primary',
        animate: true
      };
    }

    if (queueLength > 0) {
      return {
        icon: Clock,
        label: `${queueLength} Pending`,
        description: `${queueLength} theme changes waiting to sync`,
        variant: 'outline' as const,
        color: 'text-warning-gentle'
      };
    }

    if (lastSyncTimestamp) {
      return {
        icon: Check,
        label: 'Synced',
        description: `Last synced ${formatDistanceToNow(lastSyncTimestamp, { addSuffix: true })}`,
        variant: 'outline' as const,
        color: 'text-success-calm'
      };
    }

    return {
      icon: AlertCircle,
      label: 'Not Synced',
      description: 'Theme preferences not synchronized',
      variant: 'outline' as const,
      color: 'text-muted-foreground'
    };
  };

  const statusInfo = getSyncStatusInfo();
  const StatusIcon = statusInfo.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <StatusIcon 
          className={`h-4 w-4 ${statusInfo.color} ${statusInfo.animate ? 'animate-spin' : ''}`} 
        />
        <Badge variant={statusInfo.variant} className="text-xs">
          {statusInfo.label}
        </Badge>
        {queueLength > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={forceSyncTheme}
            disabled={!isOnline || syncInProgress}
            className="h-6 px-2"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={showDetails ? '' : 'border-0 shadow-none bg-transparent'}>
      {showDetails && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Cloud className="h-4 w-4" />
            Theme Synchronization
          </CardTitle>
          <CardDescription>
            Your theme preferences are automatically synchronized across all your devices
          </CardDescription>
        </CardHeader>
      )}
      
      <CardContent className={showDetails ? '' : 'p-0'}>
        <div className="space-y-4">
          {/* Current Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon 
                className={`h-5 w-5 ${statusInfo.color} ${statusInfo.animate ? 'animate-spin' : ''}`} 
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{statusInfo.label}</span>
                  <Badge variant={statusInfo.variant} className="text-xs">
                    {isOnline ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
              </div>
            </div>
            
            {(queueLength > 0 || !lastSyncTimestamp) && (
              <Button
                size="sm"
                variant="outline"
                onClick={forceSyncTheme}
                disabled={!isOnline || syncInProgress}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncInProgress ? 'animate-spin' : ''}`} />
                Sync Now
              </Button>
            )}
          </div>

          {showDetails && (
            <>
              {/* Device Status */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">This Device</p>
                    <p className="text-xs text-muted-foreground">
                      {effectiveMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Other Devices</p>
                    <p className="text-xs text-muted-foreground">
                      {isOnline ? 'Synchronized' : 'Will sync when online'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sync Queue Info */}
              {queueLength > 0 && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-warning-gentle" />
                    <span className="text-sm font-medium">Pending Changes</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {queueLength} theme preference{queueLength > 1 ? 's' : ''} waiting to synchronize. 
                    {!isOnline && ' Will sync automatically when you come back online.'}
                  </p>
                </div>
              )}

              {/* Last Sync Info */}
              {lastSyncTimestamp && (
                <div className="text-xs text-muted-foreground">
                  Last synchronized: {lastSyncTimestamp.toLocaleString()}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Simple sync indicator for headers/toolbars
 */
export function ThemeSyncIndicator() {
  const { syncStatus } = useTheme();
  const { isOnline, syncInProgress, queueLength } = syncStatus;

  if (!isOnline) {
    return (
      <div className="flex items-center gap-1" title="Offline - changes will sync when online">
        <CloudOff className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  if (syncInProgress) {
    return (
      <div className="flex items-center gap-1" title="Syncing theme preferences">
        <RefreshCw className="h-4 w-4 text-primary animate-spin" />
      </div>
    );
  }

  if (queueLength > 0) {
    return (
      <div className="flex items-center gap-1" title={`${queueLength} changes pending sync`}>
        <Clock className="h-4 w-4 text-warning-gentle" />
        <span className="text-xs text-warning-gentle">{queueLength}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1" title="Theme preferences synchronized">
      <Cloud className="h-4 w-4 text-success-calm" />
    </div>
  );
}