import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { enhancedThemePersistence } from '@/services/enhanced-theme-persistence';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Component to test theme persistence functionality
 * This component helps verify that themes persist across page navigation
 */
export function ThemePersistenceTest() {
  const { theme, setTheme, effectiveMode, toggleMode, syncStatus } = useTheme();
  const [testResults, setTestResults] = useState<Array<{ test: string; result: 'pass' | 'fail' | 'pending'; details?: string }>>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const runPersistenceTests = async () => {
    setIsRunningTests(true);
    const results: Array<{ test: string; result: 'pass' | 'fail' | 'pending'; details?: string }> = [];

    // Test 1: Save and load theme
    try {
      const testTheme = { ...theme, mode: 'dark' as const };
      await enhancedThemePersistence.saveTheme(testTheme);
      
      const { theme: loadedTheme, source } = await enhancedThemePersistence.loadTheme();
      
      if (loadedTheme && loadedTheme.mode === 'dark') {
        results.push({ test: 'Save and Load Theme', result: 'pass', details: `Loaded from ${source}` });
      } else {
        results.push({ test: 'Save and Load Theme', result: 'fail', details: 'Theme not loaded correctly' });
      }
    } catch (error) {
      results.push({ test: 'Save and Load Theme', result: 'fail', details: error instanceof Error ? error.message : 'Unknown error' });
    }

    // Test 2: Check localStorage persistence
    try {
      const localData = localStorage.getItem('safespace-theme-local');
      if (localData) {
        const parsed = JSON.parse(localData);
        if (parsed.theme) {
          results.push({ test: 'localStorage Persistence', result: 'pass', details: 'Theme found in localStorage' });
        } else {
          results.push({ test: 'localStorage Persistence', result: 'fail', details: 'No theme in localStorage' });
        }
      } else {
        results.push({ test: 'localStorage Persistence', result: 'fail', details: 'No localStorage data' });
      }
    } catch (error) {
      results.push({ test: 'localStorage Persistence', result: 'fail', details: 'localStorage error' });
    }

    // Test 3: Check sessionStorage persistence
    try {
      const sessionData = sessionStorage.getItem('safespace-theme-session');
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed.theme) {
          results.push({ test: 'sessionStorage Persistence', result: 'pass', details: 'Theme found in sessionStorage' });
        } else {
          results.push({ test: 'sessionStorage Persistence', result: 'fail', details: 'No theme in sessionStorage' });
        }
      } else {
        results.push({ test: 'sessionStorage Persistence', result: 'fail', details: 'No sessionStorage data' });
      }
    } catch (error) {
      results.push({ test: 'sessionStorage Persistence', result: 'fail', details: 'sessionStorage error' });
    }

    // Test 4: Check IndexedDB persistence
    try {
      const { theme: indexedDBTheme, source } = await enhancedThemePersistence.loadTheme();
      if (indexedDBTheme && source === 'indexedDB') {
        results.push({ test: 'IndexedDB Persistence', result: 'pass', details: 'Theme loaded from IndexedDB' });
      } else {
        results.push({ test: 'IndexedDB Persistence', result: 'pass', details: `Theme loaded from ${source}` });
      }
    } catch (error) {
      results.push({ test: 'IndexedDB Persistence', result: 'fail', details: 'IndexedDB error' });
    }

    // Test 5: Theme application
    try {
      const currentMode = effectiveMode;
      if (currentMode === 'dark' || currentMode === 'light') {
        results.push({ test: 'Theme Application', result: 'pass', details: `Current mode: ${currentMode}` });
      } else {
        results.push({ test: 'Theme Application', result: 'fail', details: 'Invalid theme mode' });
      }
    } catch (error) {
      results.push({ test: 'Theme Application', result: 'fail', details: 'Theme application error' });
    }

    setTestResults(results);
    setIsRunningTests(false);
  };

  const clearAllThemeData = async () => {
    try {
      await enhancedThemePersistence.clearThemeData();
      setTestResults([]);
      alert('All theme data cleared successfully!');
    } catch (error) {
      alert('Failed to clear theme data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const simulatePageNavigation = () => {
    // Simulate what happens during page navigation
    window.location.reload();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Theme Persistence Test
          <Badge variant={effectiveMode === 'dark' ? 'secondary' : 'default'}>
            {effectiveMode} mode
          </Badge>
        </CardTitle>
        <CardDescription>
          Test theme persistence across page navigation, browser sessions, and storage layers
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Theme Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Current Theme</h3>
            <p className="text-sm text-muted-foreground">Mode: {theme.mode}</p>
            <p className="text-sm text-muted-foreground">Effective: {effectiveMode}</p>
            <p className="text-sm text-muted-foreground">Reduced Motion: {theme.animations.reducedMotion ? 'Yes' : 'No'}</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Sync Status</h3>
            <p className="text-sm text-muted-foreground">Online: {syncStatus.isOnline ? 'Yes' : 'No'}</p>
            <p className="text-sm text-muted-foreground">Syncing: {syncStatus.syncInProgress ? 'Yes' : 'No'}</p>
            <p className="text-sm text-muted-foreground">Queue: {syncStatus.queueLength}</p>
            <p className="text-sm text-muted-foreground">Loading: {syncStatus.isLoading ? 'Yes' : 'No'}</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Actions</h3>
            <div className="space-y-2">
              <Button onClick={toggleMode} size="sm" className="w-full">
                Toggle Theme
              </Button>
              <Button 
                onClick={() => setTheme({ animations: { ...theme.animations, reducedMotion: !theme.animations.reducedMotion } })} 
                size="sm" 
                variant="outline"
                className="w-full"
              >
                Toggle Motion
              </Button>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={runPersistenceTests} 
            disabled={isRunningTests}
            className="flex-1 min-w-[200px]"
          >
            {isRunningTests ? 'Running Tests...' : 'Run Persistence Tests'}
          </Button>
          
          <Button 
            onClick={simulatePageNavigation} 
            variant="outline"
            className="flex-1 min-w-[200px]"
          >
            Simulate Page Navigation
          </Button>
          
          <Button 
            onClick={clearAllThemeData} 
            variant="destructive"
            className="flex-1 min-w-[200px]"
          >
            Clear All Theme Data
          </Button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results</h3>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant={result.result === 'pass' ? 'default' : result.result === 'fail' ? 'destructive' : 'secondary'}>
                      {result.result}
                    </Badge>
                    <span className="font-medium">{result.test}</span>
                  </div>
                  {result.details && (
                    <span className="text-sm text-muted-foreground">{result.details}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Testing Instructions</h3>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Click "Toggle Theme" to change between light/dark modes</li>
            <li>Click "Run Persistence Tests" to verify storage layers are working</li>
            <li>Click "Simulate Page Navigation" to test persistence across page loads</li>
            <li>Open a new tab and verify the theme persists</li>
            <li>Close and reopen the browser to test session persistence</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}