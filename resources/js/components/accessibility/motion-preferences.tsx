/**
 * Motion Preferences Component
 * 
 * Allows users to configure motion and animation preferences
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import AnimatedContainer from '@/components/animations/animated-container';

interface MotionPreferencesProps {
  /** Whether to show advanced options */
  showAdvanced?: boolean;
  /** Custom className */
  className?: string;
}

export const MotionPreferences: React.FC<MotionPreferencesProps> = ({
  showAdvanced = false,
  className = '',
}) => {
  const {
    systemPrefersReducedMotion,
    userPrefersReducedMotion,
    reducedMotion,
    respectSystemPreference,
    hasUserPreference,
    isUsingSystemPreference,
    setUserPreference,
    toggleReducedMotion,
    setRespectSystemPreference,
    resetToSystemPreference,
  } = useReducedMotion();

  return (
    <AnimatedContainer animation="slideUp" delay={200} className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Motion & Animation Preferences
            <Badge variant={reducedMotion ? 'secondary' : 'default'}>
              {reducedMotion ? 'Reduced Motion' : 'Full Motion'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Configure animation and motion settings for a comfortable experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* System Detection Status */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <h4 className="font-medium text-sm">System Detection</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                System prefers reduced motion:
              </span>
              <Badge variant={systemPrefersReducedMotion ? 'default' : 'outline'}>
                {systemPrefersReducedMotion ? 'Yes' : 'No'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Detected from your device's accessibility settings
            </p>
          </div>

          {/* Respect System Preference */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="respect-system">Respect System Preference</Label>
              <p className="text-sm text-muted-foreground">
                Follow your device's motion settings automatically
              </p>
            </div>
            <Switch
              id="respect-system"
              checked={respectSystemPreference}
              onCheckedChange={setRespectSystemPreference}
            />
          </div>

          {/* Manual Override */}
          {!respectSystemPreference && (
            <AnimatedContainer animation="slideDown" delay={100}>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduced-motion">Reduce Motion</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations and transitions
                  </p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={reducedMotion}
                  onCheckedChange={toggleReducedMotion}
                />
              </div>
            </AnimatedContainer>
          )}

          {/* Current Status */}
          <div className="p-4 border rounded-lg space-y-3">
            <h4 className="font-medium text-sm">Current Settings</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Motion Status:</span>
                <span className={reducedMotion ? 'text-orange-600' : 'text-green-600'}>
                  {reducedMotion ? 'Reduced Motion Active' : 'Full Motion Active'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source:</span>
                <span>
                  {isUsingSystemPreference 
                    ? 'System Preference' 
                    : hasUserPreference 
                    ? 'Manual Override' 
                    : 'Default Setting'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <AnimatedContainer animation="slideUp" delay={300}>
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium text-sm">Advanced Options</h4>
                
                {/* Reset Button */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reset to System Default</Label>
                    <p className="text-sm text-muted-foreground">
                      Clear manual overrides and use system settings
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetToSystemPreference}
                    disabled={!hasUserPreference}
                  >
                    Reset
                  </Button>
                </div>

                {/* Motion Categories */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">What gets reduced:</Label>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span>Page transitions and navigation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span>Decorative animations and effects</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span>Auto-playing content and carousels</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Essential feedback animations (preserved)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Loading indicators (simplified)</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          )}

          {/* Motion Preview */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Motion Preview</Label>
            <div className="grid grid-cols-3 gap-2">
              <AnimatedContainer 
                animation="fade" 
                className="h-12 bg-primary/20 rounded flex items-center justify-center text-xs"
              >
                Fade
              </AnimatedContainer>
              <AnimatedContainer 
                animation="slideUp" 
                delay={100}
                className="h-12 bg-primary/20 rounded flex items-center justify-center text-xs"
              >
                Slide
              </AnimatedContainer>
              <AnimatedContainer 
                animation="scale" 
                delay={200}
                className="h-12 bg-primary/20 rounded flex items-center justify-center text-xs"
              >
                Scale
              </AnimatedContainer>
            </div>
            <p className="text-xs text-muted-foreground">
              {reducedMotion 
                ? 'Animations are reduced or disabled based on your settings'
                : 'Full animations are active'
              }
            </p>
          </div>

        </CardContent>
      </Card>
    </AnimatedContainer>
  );
};

export default MotionPreferences;