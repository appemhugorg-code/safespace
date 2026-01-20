import React from 'react';
import { useTheme, useThemeStyles } from '@/contexts/theme-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeConfiguration } from '@/components/theme/theme-configuration';

/**
 * Test component to verify theme system integration
 */
export function ThemeTest() {
  const { theme, setTheme, toggleMode, effectiveMode, syncStatus } = useTheme();
  const styles = useThemeStyles();

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme System Test</CardTitle>
          <CardDescription>
            Testing the comprehensive theme system integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Current Mode:</strong> {theme.mode}
            </div>
            <div>
              <strong>Effective Mode:</strong> {effectiveMode}
            </div>
            <div>
              <strong>Font Size:</strong> {theme.accessibility.fontSize}
            </div>
            <div>
              <strong>Contrast:</strong> {theme.accessibility.contrast}
            </div>
            <div>
              <strong>Reduced Motion:</strong> {theme.animations.reducedMotion ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Focus Visible:</strong> {theme.accessibility.focusVisible ? 'Yes' : 'No'}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={toggleMode} variant="outline">
              Toggle Mode
            </Button>
            <Button 
              onClick={() => setTheme({ 
                accessibility: { 
                  ...theme.accessibility, 
                  fontSize: theme.accessibility.fontSize === 'medium' ? 'large' : 'medium' 
                } 
              })}
              variant="outline"
            >
              Toggle Font Size
            </Button>
            <Button 
              onClick={() => setTheme({ 
                animations: { 
                  ...theme.animations, 
                  reducedMotion: !theme.animations.reducedMotion 
                } 
              })}
              variant="outline"
            >
              Toggle Motion
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={syncStatus.isOnline ? 'default' : 'destructive'}>
              {syncStatus.isOnline ? 'Online' : 'Offline'}
            </Badge>
            {syncStatus.syncInProgress && (
              <Badge variant="secondary">Syncing...</Badge>
            )}
            {syncStatus.queueLength > 0 && (
              <Badge variant="outline">{syncStatus.queueLength} queued</Badge>
            )}
          </div>

          <div className="p-4 border rounded-lg bg-card">
            <h4 className="font-semibold mb-2">Style Values Test</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Mode: {styles.mode}</div>
              <div>Is Dark: {styles.isDark ? 'Yes' : 'No'}</div>
              <div>Is Light: {styles.isLight ? 'Yes' : 'No'}</div>
              <div>Reduced Motion: {styles.reducedMotion ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ThemeConfiguration />
    </div>
  );
}