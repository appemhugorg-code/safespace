import React, { useState } from 'react';
import { useTheme, ThemeMode } from '@/contexts/theme-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ThemeSyncStatus } from '@/components/theme/theme-sync-status';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Accessibility, 
  Zap,
  Eye,
  Type,
  Focus,
  RotateCcw
} from 'lucide-react';

interface ThemeConfiguratorProps {
  className?: string;
}

export function ThemeConfigurator({ className }: ThemeConfiguratorProps) {
  const { theme, setTheme, toggleMode, resetTheme, effectiveMode } = useTheme();
  const [activeSection, setActiveSection] = useState<'appearance' | 'accessibility' | 'animations'>('appearance');

  const handleModeChange = (mode: ThemeMode) => {
    setTheme({ mode });
  };

  const handleFontSizeChange = (fontSize: 'small' | 'medium' | 'large' | 'extra-large') => {
    setTheme({
      accessibility: {
        ...theme.accessibility,
        fontSize,
      },
    });
  };

  const handleContrastChange = (contrast: 'normal' | 'high') => {
    setTheme({
      accessibility: {
        ...theme.accessibility,
        contrast,
      },
    });
  };

  const handleReducedMotionChange = (reducedMotion: boolean) => {
    setTheme({
      animations: {
        ...theme.animations,
        reducedMotion,
      },
    });
  };

  const handleFocusVisibleChange = (focusVisible: boolean) => {
    setTheme({
      accessibility: {
        ...theme.accessibility,
        focusVisible,
      },
    });
  };

  const getModeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'auto':
        return <Monitor className="h-4 w-4" />;
    }
  };

  const sections = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'animations', label: 'Animations', icon: Zap },
  ] as const;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Settings
        </CardTitle>
        <CardDescription>
          Customize your SafeSpace experience with personalized themes and accessibility options
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Section Navigation */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveSection(section.id)}
                className="flex-1"
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </Button>
            );
          })}
        </div>

        {/* Appearance Section */}
        {activeSection === 'appearance' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-body font-medium">Theme Mode</Label>
                <Badge variant="outline" className="capitalize">
                  {effectiveMode}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'auto'] as ThemeMode[]).map((mode) => (
                  <Button
                    key={mode}
                    variant={theme.mode === mode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleModeChange(mode)}
                    className="flex flex-col gap-2 h-auto py-3"
                  >
                    {getModeIcon(mode)}
                    <span className="capitalize text-xs">{mode}</span>
                  </Button>
                ))}
              </div>
              
              <p className="text-caption text-muted-foreground">
                Auto mode follows your system preference. Currently showing: {effectiveMode} mode.
              </p>
            </div>

            {/* Color Preview */}
            <div className="space-y-3">
              <Label className="text-body font-medium">Therapeutic Color Preview</Label>
              <div className="grid grid-cols-5 gap-2">
                <div className="space-y-1">
                  <div className="h-8 rounded bg-primary shadow-sm"></div>
                  <span className="text-xs text-center block">Primary</span>
                </div>
                <div className="space-y-1">
                  <div className="h-8 rounded bg-secondary shadow-sm"></div>
                  <span className="text-xs text-center block">Secondary</span>
                </div>
                <div className="space-y-1">
                  <div className="h-8 rounded bg-accent shadow-sm"></div>
                  <span className="text-xs text-center block">Accent</span>
                </div>
                <div className="space-y-1">
                  <div className="h-8 rounded bg-muted shadow-sm"></div>
                  <span className="text-xs text-center block">Muted</span>
                </div>
                <div className="space-y-1">
                  <div className="h-8 rounded bg-destructive shadow-sm"></div>
                  <span className="text-xs text-center block">Alert</span>
                </div>
              </div>
              
              {/* Mood Colors Preview */}
              <div className="mt-4">
                <Label className="text-body font-medium mb-2 block">Mood Expression Colors</Label>
                <div className="grid grid-cols-5 gap-2">
                  <div className="space-y-1">
                    <div className="h-6 rounded bg-mood-positive shadow-sm"></div>
                    <span className="text-xs text-center block">Happy</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-6 rounded bg-therapeutic-primary shadow-sm"></div>
                    <span className="text-xs text-center block">Good</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-6 rounded bg-mood-neutral shadow-sm"></div>
                    <span className="text-xs text-center block">Okay</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-6 rounded bg-therapeutic-accent shadow-sm"></div>
                    <span className="text-xs text-center block">Sad</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-6 rounded bg-mood-concern shadow-sm"></div>
                    <span className="text-xs text-center block">Upset</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Dark Mode Benefits */}
            {effectiveMode === 'dark' && (
              <div className="p-4 bg-muted/50 rounded-lg border">
                <h4 className="font-medium text-sm mb-2">Dark Mode Benefits</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Reduced eye strain during evening sessions</li>
                  <li>• Better sleep hygiene with less blue light</li>
                  <li>• Enhanced focus for therapeutic activities</li>
                  <li>• Calming atmosphere for emotional safety</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Accessibility Section */}
        {activeSection === 'accessibility' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <Label className="text-body font-medium">Font Size</Label>
              </div>
              
              <Select
                value={theme.accessibility.fontSize}
                onValueChange={handleFontSizeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (14px)</SelectItem>
                  <SelectItem value="medium">Medium (16px)</SelectItem>
                  <SelectItem value="large">Large (18px)</SelectItem>
                  <SelectItem value="extra-large">Extra Large (20px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <Label className="text-body font-medium">Contrast</Label>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={theme.accessibility.contrast === 'normal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleContrastChange('normal')}
                >
                  Normal
                </Button>
                <Button
                  variant={theme.accessibility.contrast === 'high' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleContrastChange('high')}
                >
                  High Contrast
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Focus className="h-4 w-4" />
                  <Label className="text-body font-medium">Enhanced Focus Indicators</Label>
                </div>
                <p className="text-caption text-muted-foreground">
                  Show prominent focus outlines for keyboard navigation
                </p>
              </div>
              <Switch
                checked={theme.accessibility.focusVisible}
                onCheckedChange={handleFocusVisibleChange}
              />
            </div>
          </div>
        )}

        {/* Animations Section */}
        {activeSection === 'animations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <Label className="text-body font-medium">Reduced Motion</Label>
                </div>
                <p className="text-caption text-muted-foreground">
                  Minimize animations for users sensitive to motion
                </p>
              </div>
              <Switch
                checked={theme.animations.reducedMotion}
                onCheckedChange={handleReducedMotionChange}
              />
            </div>

            {!theme.animations.reducedMotion && (
              <div className="space-y-4">
                <Label className="text-body font-medium">Animation Preview</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="h-12 bg-primary rounded animate-pulse"></div>
                    <span className="text-xs text-center block">Gentle Pulse</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 bg-secondary rounded animate-fade-in"></div>
                    <span className="text-xs text-center block">Fade In</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 bg-accent rounded animate-slide-up"></div>
                    <span className="text-xs text-center block">Slide Up</span>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-caption text-muted-foreground">
                {theme.animations.reducedMotion 
                  ? "Animations are disabled to respect your motion preferences."
                  : "Animations use therapeutic timing and easing for a calming experience."
                }
              </p>
            </div>
          </div>
        )}

        {/* Sync Status */}
        <div className="pt-4 border-t">
          <ThemeSyncStatus showDetails={true} />
        </div>

        {/* Reset Button */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={resetTheme}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default Theme
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Quick theme toggle component for headers/navigation
export function ThemeToggle() {
  const { theme, toggleMode, effectiveMode, syncStatus } = useTheme();

  const getIcon = () => {
    switch (theme.mode) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'auto':
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMode}
        className="relative"
        title={`Current: ${theme.mode} (${effectiveMode})`}
      >
        {getIcon()}
        <span className="sr-only">Toggle theme</span>
      </Button>
      
      {/* Sync indicator */}
      {(syncStatus.syncInProgress || syncStatus.queueLength > 0 || !syncStatus.isOnline) && (
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" 
             title={syncStatus.syncInProgress ? 'Syncing...' : 
                    syncStatus.queueLength > 0 ? `${syncStatus.queueLength} pending` : 
                    'Offline'} />
      )}
    </div>
  );
}