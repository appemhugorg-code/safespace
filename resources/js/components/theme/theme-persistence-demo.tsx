import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { enhancedThemePersistence } from '@/services/enhanced-theme-persistence';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Cloud, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Wifi, 
  WifiOff,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  HardDrive,
  Globe,
  Users,
  Settings
} from 'lucide-react';

/**
 * Theme Persistence Demo Component
 * 
 * Demonstrates comprehensive theme persistence across:
 * - Page navigation
 * - Browser sessions  
 * - Device synchronization
 * - Offline scenarios
 */
export function ThemePersistenceDemo() {
  const { theme, setTheme, syncStatus, forceSyncTheme } = useTheme();
  const [persistenceStatus, setPersistenceStatus] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Get persistence status
  useEffect(() => {
    const updateStatus = () => {
      const status = enhancedThemePersistence.getSyncStatus();
      setPersistenceStatus(status);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  // Test theme persistence across different scenarios
  const runPersistenceTests = async () => {
    setIsRunningTests(true);
    const results: any[] = [];

    try {
      // Test 1: Save to all storage layers
      console.log('Testing save to all storage layers...');
      const testTheme = { 
        mode: 'dark' as const,
        accessibility: { ...theme.accessibility, fontSize: 'large' as const }
      };
      
      const saveResults = await enhancedThemePersistence.saveTheme(testTheme);
      results.push({
        test: 'Save to Storage Layers',
        results: saveResults,
        success: saveResults.every(r => r.success),
        timestamp: new Date()
      });

      // Test 2: Load from storage layers
      console.log('Testing load from storage layers...');
      const { theme: loadedTheme, source } = await enhancedThemePersistence.loadTheme();
      results.push({
        test: 'Load from Storage',
        source,
        theme: loadedTheme,
        success: !!loadedTheme,
        timestamp: new Date()
      });

      // Test 3: Cross-tab synchronization
      console.log('Testing cross-tab sync...');
      enhancedThemePersistence.syncAcrossTabs({ mode: 'light' });
      results.push({
        test: 'Cross-Tab Sync',
        success: true,
        message: 'Sync signal sent to other tabs',
        timestamp: new Date()
      });

      // Test 4: Server synchronization (if online)
      if (navigator.onLine) {
        console.log('Testing server sync...');
        try {
          await forceSyncTheme();
          results.push({
            test: 'Server Sync',
            success: true,
            message: 'Successfully synced with server',
            timestamp: new Date()
          });
        } catch (error) {
          results.push({
            test: 'Server Sync',
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date()
          });
        }
      } else {
        results.push({
          test: 'Server Sync',
          success: false,
          message: 'Offline - queued for later sync',
          timestamp: new Date()
        });
      }

      setTestResults(results);
    } catch (error) {
      console.error('Test failed:', error);
      results.push({
        test: 'Test Suite',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
      setTestResults(results);
    } finally {
      setIsRunningTests(false);
    }
  };

  // Clear all persistence data
  const clearAllData = async () => {
    try {
      await enhancedThemePersistence.clearThemeData();
      setTestResults([]);
      console.log('All theme persistence data cleared');
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  };

  const storageTypes = [
    {
      name: 'Session Storage',
      icon: Monitor,
      description: 'Persists during page navigation within the same tab',
      scope: 'Single tab session',
      color: 'bg-blue-500'
    },
    {
      name: 'Local Storage',
      icon: HardDrive,
      description: 'Persists across browser sessions on the same device',
      scope: 'Same browser, same device',
      color: 'bg-green-500'
    },
    {
      name: 'IndexedDB',
      icon: Database,
      description: 'Offline-capable storage for complex data',
      scope: 'Same browser, offline support',
      color: 'bg-purple-500'
    },
    {
      name: 'Server Storage',
      icon: Cloud,
      description: 'Cross-device synchronization via server API',
      scope: 'All devices, all browsers',
      color: 'bg-orange-500'
    }
  ];

  const deviceTypes = [
    { name: 'Desktop', icon: Monitor, active: persistenceStatus?.deviceInfo?.type === 'desktop' },
    { name: 'Mobile', icon: Smartphone, active: persistenceStatus?.deviceInfo?.type === 'mobile' },
    { name: 'Tablet', icon: Tablet, active: persistenceStatus?.deviceInfo?.type === 'tablet' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-therapeutic-trust/20 bg-therapeutic-trust/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-therapeutic-trust/10">
                <RotateCcw className="h-6 w-6 text-therapeutic-trust" />
              </div>
              <div>
                <CardTitle className="text-2xl">Theme Persistence & Synchronization</CardTitle>
                <CardDescription>
                  Comprehensive theme persistence across pages, sessions, and devices
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={syncStatus.isOnline ? 'default' : 'secondary'} className="flex items-center gap-1">
                {syncStatus.isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {syncStatus.isOnline ? 'Online' : 'Offline'}
              </Badge>
              {persistenceStatus?.deviceInfo && (
                <Badge variant="outline">
                  {persistenceStatus.deviceInfo.name}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="storage">Storage Layers</TabsTrigger>
          <TabsTrigger value="sync">Synchronization</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Current Persistence Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Device Information</h4>
                  {persistenceStatus?.deviceInfo ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Device ID:</span>
                        <code className="text-xs bg-muted px-1 rounded">
                          {persistenceStatus.deviceInfo.id.slice(0, 12)}...
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="capitalize">{persistenceStatus.deviceInfo.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Browser:</span>
                        <span>{persistenceStatus.deviceInfo.browser}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>OS:</span>
                        <span>{persistenceStatus.deviceInfo.os}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Loading device info...</p>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Sync Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Online Status:</span>
                      <Badge variant={syncStatus.isOnline ? 'default' : 'secondary'}>
                        {syncStatus.isOnline ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sync in Progress:</span>
                      <Badge variant={syncStatus.syncInProgress ? 'default' : 'outline'}>
                        {syncStatus.syncInProgress ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Queue Length:</span>
                      <span>{syncStatus.queueLength}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Sync:</span>
                      <span className="text-xs">
                        {syncStatus.lastSyncTimestamp 
                          ? new Date(syncStatus.lastSyncTimestamp).toLocaleTimeString()
                          : 'Never'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Device Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Cross-Device Support
              </CardTitle>
              <CardDescription>
                Theme preferences sync across all your devices automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {deviceTypes.map((device) => (
                  <div 
                    key={device.name}
                    className={`p-4 rounded-lg border text-center transition-all ${
                      device.active 
                        ? 'border-therapeutic-trust bg-therapeutic-trust/5' 
                        : 'border-border bg-muted/30'
                    }`}
                  >
                    <device.icon className={`h-8 w-8 mx-auto mb-2 ${
                      device.active ? 'text-therapeutic-trust' : 'text-muted-foreground'
                    }`} />
                    <p className="font-medium">{device.name}</p>
                    {device.active && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Storage Layers Tab */}
        <TabsContent value="storage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Storage Architecture
              </CardTitle>
              <CardDescription>
                Multiple storage layers ensure your theme preferences are never lost
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {storageTypes.map((storage, index) => (
                  <div key={storage.name} className="flex items-start gap-4 p-4 rounded-lg border border-border">
                    <div className={`p-2 rounded-lg ${storage.color} text-white`}>
                      <storage.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{storage.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          Priority {index + 1}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{storage.description}</p>
                      <p className="text-xs text-therapeutic-trust font-medium">
                        Scope: {storage.scope}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Synchronization Tab */}
        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Synchronization Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cross-Tab Sync */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Cross-Tab Synchronization
                </h4>
                <p className="text-sm text-muted-foreground">
                  Theme changes instantly sync across all open tabs in the same browser.
                </p>
                <Button 
                  onClick={() => {
                    const newMode: 'light' | 'dark' = theme.mode === 'light' ? 'dark' : 'light';
                    const testTheme = { mode: newMode };
                    setTheme(testTheme);
                    enhancedThemePersistence.syncAcrossTabs(testTheme);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Test Cross-Tab Sync
                </Button>
              </div>

              {/* Cross-Device Sync */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Cloud className="h-4 w-4" />
                  Cross-Device Synchronization
                </h4>
                <p className="text-sm text-muted-foreground">
                  Theme preferences automatically sync across all your devices when you log in.
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={forceSyncTheme}
                    variant="outline"
                    size="sm"
                    disabled={!syncStatus.isOnline}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Force Sync Now
                  </Button>
                  {!syncStatus.isOnline && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <WifiOff className="h-3 w-3" />
                      Offline - Will sync when online
                    </Badge>
                  )}
                </div>
              </div>

              {/* Offline Support */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Offline Support
                </h4>
                <p className="text-sm text-muted-foreground">
                  Theme changes are saved locally and will sync to the server when you come back online.
                </p>
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <div className="flex items-center justify-between text-sm">
                    <span>Queued Changes:</span>
                    <Badge variant="outline">{syncStatus.queueLength}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testing Tab */}
        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Persistence Testing
              </CardTitle>
              <CardDescription>
                Test theme persistence across different scenarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={runPersistenceTests}
                  disabled={isRunningTests}
                  className="bg-therapeutic-trust text-white hover:bg-therapeutic-trust/90 focus:ring-therapeutic-trust/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95"
                >
                  {isRunningTests ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Run Persistence Tests
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={clearAllData}
                  variant="outline"
                  disabled={isRunningTests}
                >
                  Clear All Data
                </Button>
              </div>

              {/* Test Results */}
              {testResults.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Test Results</h4>
                  <div className="space-y-2">
                    {testResults.map((result, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg border flex items-start gap-3 ${
                          result.success 
                            ? 'border-therapeutic-growth bg-therapeutic-growth/5' 
                            : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                        }`}
                      >
                        {result.success ? (
                          <CheckCircle className="h-5 w-5 text-therapeutic-growth flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-medium">{result.test}</h5>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {result.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          {result.message && (
                            <p className="text-sm text-muted-foreground">{result.message}</p>
                          )}
                          {result.error && (
                            <p className="text-sm text-red-600 dark:text-red-400">{result.error}</p>
                          )}
                          {result.source && (
                            <p className="text-sm text-therapeutic-trust">
                              Loaded from: {result.source}
                            </p>
                          )}
                          {result.results && (
                            <div className="mt-2 space-y-1">
                              {result.results.map((r: any, i: number) => (
                                <div key={i} className="text-xs flex items-center justify-between">
                                  <span>{r.source}:</span>
                                  <Badge variant={r.success ? 'default' : 'destructive'} className="text-xs">
                                    {r.success ? 'Success' : 'Failed'}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}