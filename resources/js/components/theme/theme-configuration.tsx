import React, { useState } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { 
  Monitor, 
  Moon, 
  Sun, 
  Eye, 
  Type, 
  Zap, 
  Accessibility, 
  Palette,
  Settings,
  RefreshCw,
  Check,
  AlertCircle
} from 'lucide-react';

interface ThemeConfigurationProps {
  className?: string;
}

/**
 * Comprehensive theme configuration interface component
 */
export function ThemeConfiguration({ className = '' }: ThemeConfigurationProps) {
  const { 
    theme, 
    setTheme, 
    toggleMode, 
    resetTheme, 
    effectiveMode, 
    syncStatus,
    forceSyncTheme 
  } = useTheme();

  const [isResetting, setIsResetting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      resetTheme();
      // Add a small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setIsResetting(false);
    }
  };

  const handleForceSync = async () => {
    setIsSyncing(true);
    try {
      await forceSyncTheme();
      // Add a small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setIsSyncing(false);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'light': return <Sun className="w-4 h-4" />;
      case 'dark': return <Moon className="w-4 h-4" />;
      case 'auto': return <Monitor className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getSyncStatusColor = () => {
    if (!syncStatus.isOnline) return 'destructive';
    if (syncStatus.syncInProgress) return 'secondary';
    if (syncStatus.queueLength > 0) return 'warning';
    return 'success';
  };

  const getSyncStatusText = () => {
    if (!syncStatus.isOnline) return 'Offline';
    if (syncStatus.syncInProgress) return 'Syncing...';
    if (syncStatus.queueLength > 0) return `${syncStatus.queueLength} pending`;
    return 'Synced';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Theme Configuration</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getSyncStatusColor() as any} className="text-xs">
            {getSyncStatusText()}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleForceSync}
            disabled={isSyncing || !syncStatus.isOnline}
            className="text-xs"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync
          </Button>
        </div>
      </div>

      {/* Theme Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getModeIcon(theme.mode)}
            Theme Mode
          </CardTitle>
          <CardDescription>
            Choose your preferred color scheme. Auto mode follows your system preference.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'light', label: 'Light', icon: Sun, description: 'Clean and bright' },
              { value: 'dark', label: 'Dark', description: 'Easy on the eyes' },
              { value: 'auto', label: 'Auto', icon: Monitor, description: 'Follows system' }
            ].map((mode) => (
              <Button
                key={mode.value}
                variant={theme.mode === mode.value ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => setTheme({ mode: mode.value as any })}
              >
                {mode.icon && <mode.icon className="w-5 h-5" />}
                <div className="text-center">
                  <div className="font-medium">{mode.label}</div>
                  <div className="text-xs text-muted-foreground">{mode.description}</div>
                </div>
                {theme.mode === mode.value && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${effectiveMode === 'dark' ? 'bg-slate-800' : 'bg-white'} border-2`} />
              <span className="text-sm font-medium">Currently using: {effectiveMode} mode</span>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleMode}>
              Toggle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="w-5 h-5" />
            Accessibility
          </CardTitle>
          <CardDescription>
            Customize the interface to meet your accessibility needs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Font Size */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Font Size
            </Label>
            <Select
              value={theme.accessibility.fontSize}
              onValueChange={(value) => setTheme({
                accessibility: { ...theme.accessibility, fontSize: value as any }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (14px)</SelectItem>
                <SelectItem value="medium">Medium (16px)</SelectItem>
                <SelectItem value="large">Large (18px)</SelectItem>
                <SelectItem value="extra-large">Extra Large (22px)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contrast */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Contrast Level
            </Label>
            <Select
              value={theme.accessibility.contrast}
              onValueChange={(value) => setTheme({
                accessibility: { ...theme.accessibility, contrast: value as any }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal Contrast</SelectItem>
                <SelectItem value="high">High Contrast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Focus Indicators */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                Enhanced Focus Indicators
              </Label>
              <p className="text-sm text-muted-foreground">
                Show enhanced focus outlines for better keyboard navigation
              </p>
            </div>
            <Switch
              checked={theme.accessibility.focusVisible}
              onCheckedChange={(checked) => setTheme({
                accessibility: { ...theme.accessibility, focusVisible: checked }
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Animation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Animations
          </CardTitle>
          <CardDescription>
            Control motion and animation preferences for a comfortable experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions for better focus
              </p>
            </div>
            <Switch
              checked={theme.animations.reducedMotion}
              onCheckedChange={(checked) => setTheme({
                animations: { ...theme.animations, reducedMotion: checked }
              })}
            />
          </div>

          {theme.animations.reducedMotion && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Reduced motion is enabled</span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Animations and transitions are minimized for better accessibility.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Theme Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            See how your theme settings look in practice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4 border rounded-lg bg-card">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Sample Content</h3>
              <Badge variant="secondary">Preview</Badge>
            </div>
            <p className="text-muted-foreground">
              This is how text will appear with your current theme settings. 
              The colors and typography adjust based on your preferences.
            </p>
            <div className="flex gap-2">
              <Button size="sm">Primary Button</Button>
              <Button variant="outline" size="sm">Secondary Button</Button>
              <Button variant="ghost" size="sm">Ghost Button</Button>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Mode:</strong> {effectiveMode}
              </div>
              <div>
                <strong>Font Size:</strong> {theme.accessibility.fontSize}
              </div>
              <div>
                <strong>Contrast:</strong> {theme.accessibility.contrast}
              </div>
              <div>
                <strong>Animations:</strong> {theme.animations.reducedMotion ? 'Reduced' : 'Normal'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Actions
          </CardTitle>
          <CardDescription>
            Reset your theme to defaults or manage your preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isResetting}
              className="flex-1"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isResetting ? 'animate-spin' : ''}`} />
              {isResetting ? 'Resetting...' : 'Reset to Defaults'}
            </Button>
            <Button
              variant="outline"
              onClick={handleForceSync}
              disabled={isSyncing || !syncStatus.isOnline}
              className="flex-1"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Settings'}
            </Button>
          </div>
          
          {syncStatus.lastSyncTimestamp && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Last synced: {syncStatus.lastSyncTimestamp.toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Compact theme toggle component for headers/toolbars
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleMode, effectiveMode } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleMode}
      className={`w-9 h-9 p-0 ${className}`}
      title={`Current: ${effectiveMode} mode. Click to cycle through light/dark/auto.`}
    >
      {getModeIcon(theme.mode)}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

/**
 * Theme mode selector component
 */
export function ThemeModeSelector({ className = '' }: { className?: string }) {
  const { theme, setTheme, effectiveMode } = useTheme();

  return (
    <div className={`flex items-center gap-1 p-1 bg-muted rounded-lg ${className}`}>
      {[
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'auto', icon: Monitor, label: 'Auto' }
      ].map((mode) => (
        <Button
          key={mode.value}
          variant={theme.mode === mode.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTheme({ mode: mode.value as any })}
          className="h-8 px-3"
          title={`Switch to ${mode.label} mode`}
        >
          <mode.icon className="w-4 h-4 mr-1" />
          {mode.label}
        </Button>
      ))}
    </div>
  );
}

function getModeIcon(mode: string) {
  switch (mode) {
    case 'light': return <Sun className="w-4 h-4" />;
    case 'dark': return <Moon className="w-4 h-4" />;
    case 'auto': return <Monitor className="w-4 h-4" />;
    default: return <Monitor className="w-4 h-4" />;
  }
}