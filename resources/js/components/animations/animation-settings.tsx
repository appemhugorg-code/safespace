/**
 * Animation Settings Component
 * 
 * Allows users to configure animation preferences
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAnimation } from '@/contexts/animation-context';
import { useTheme } from '@/contexts/theme-context';
import { THERAPEUTIC_TIMING, THERAPEUTIC_EASING } from '@/config/animations';
import AnimatedContainer from './animated-container';

export const AnimationSettings: React.FC = () => {
  const { 
    animationsEnabled, 
    prefersReducedMotion, 
    respectSystemPreference,
    toggleAnimations,
    setReducedMotion,
    setRespectSystemPreference 
  } = useAnimation();
  
  const { theme, setTheme } = useTheme();

  const handleDurationChange = (key: keyof typeof THERAPEUTIC_TIMING, value: number[]) => {
    setTheme({
      animations: {
        ...theme.animations,
        duration: {
          ...theme.animations?.duration,
          [key]: `${value[0]}ms`,
        },
      },
    });
  };

  const handleEasingChange = (key: keyof typeof THERAPEUTIC_EASING, value: string) => {
    const easingMap: Record<string, number[]> = {
      gentle: [0.25, 0.46, 0.45, 0.94],
      calm: [0.4, 0.0, 0.2, 1],
      soothing: [0.25, 0.1, 0.25, 1],
      bounce: [0.68, -0.55, 0.265, 1.55],
      crisp: [0.4, 0.0, 0.6, 1],
      enter: [0.0, 0.0, 0.2, 1],
      exit: [0.4, 0.0, 1, 1],
    };

    setTheme({
      animations: {
        ...theme.animations,
        easing: {
          ...theme.animations?.easing,
          [key]: easingMap[value] || THERAPEUTIC_EASING[key],
        },
      },
    });
  };

  return (
    <AnimatedContainer animation="slideUp" delay={200}>
      <Card>
        <CardHeader>
          <CardTitle>Animation Settings</CardTitle>
          <CardDescription>
            Configure animations and motion preferences for a comfortable experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Global Animation Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="animations-enabled">Enable Animations</Label>
              <p className="text-sm text-muted-foreground">
                Turn animations on or off globally
              </p>
            </div>
            <Switch
              id="animations-enabled"
              checked={animationsEnabled}
              onCheckedChange={toggleAnimations}
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduced-motion">Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations for better accessibility
              </p>
            </div>
            <Switch
              id="reduced-motion"
              checked={prefersReducedMotion}
              onCheckedChange={setReducedMotion}
            />
          </div>

          {/* System Preference */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="system-preference">Respect System Preference</Label>
              <p className="text-sm text-muted-foreground">
                Follow your device's motion settings
              </p>
            </div>
            <Switch
              id="system-preference"
              checked={respectSystemPreference}
              onCheckedChange={setRespectSystemPreference}
            />
          </div>

          {/* Animation Timing Controls */}
          {animationsEnabled && !prefersReducedMotion && (
            <AnimatedContainer animation="fade" delay={300}>
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium">Animation Timing</h4>
                
                {/* Fast Duration */}
                <div className="space-y-2">
                  <Label>Fast Animations ({theme.animations?.duration?.fast || '150ms'})</Label>
                  <Slider
                    value={[parseInt(theme.animations?.duration?.fast?.replace('ms', '') || '150')]}
                    onValueChange={(value: number[]) => handleDurationChange('fast', value)}
                    max={500}
                    min={50}
                    step={25}
                    className="w-full"
                  />
                </div>

                {/* Normal Duration */}
                <div className="space-y-2">
                  <Label>Normal Animations ({theme.animations?.duration?.normal || '300ms'})</Label>
                  <Slider
                    value={[parseInt(theme.animations?.duration?.normal?.replace('ms', '') || '300')]}
                    onValueChange={(value: number[]) => handleDurationChange('normal', value)}
                    max={1000}
                    min={100}
                    step={50}
                    className="w-full"
                  />
                </div>

                {/* Slow Duration */}
                <div className="space-y-2">
                  <Label>Slow Animations ({theme.animations?.duration?.slow || '500ms'})</Label>
                  <Slider
                    value={[parseInt(theme.animations?.duration?.slow?.replace('ms', '') || '500')]}
                    onValueChange={(value: number[]) => handleDurationChange('slow', value)}
                    max={2000}
                    min={200}
                    step={100}
                    className="w-full"
                  />
                </div>

                {/* Easing Presets */}
                <div className="space-y-2">
                  <Label>Primary Easing</Label>
                  <Select
                    value="gentle"
                    onValueChange={(value) => handleEasingChange('gentle', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select easing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gentle">Gentle (Recommended)</SelectItem>
                      <SelectItem value="calm">Calm</SelectItem>
                      <SelectItem value="soothing">Soothing</SelectItem>
                      <SelectItem value="bounce">Bounce</SelectItem>
                      <SelectItem value="crisp">Crisp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AnimatedContainer>
          )}

          {/* Animation Preview */}
          {animationsEnabled && !prefersReducedMotion && (
            <AnimatedContainer animation="slideUp" delay={400}>
              <div className="space-y-2 pt-4 border-t">
                <Label>Animation Preview</Label>
                <div className="grid grid-cols-3 gap-2">
                  <AnimatedContainer 
                    animation="fade" 
                    className="h-8 bg-primary/20 rounded flex items-center justify-center text-xs"
                  >
                    Fade
                  </AnimatedContainer>
                  <AnimatedContainer 
                    animation="slideUp" 
                    delay={100}
                    className="h-8 bg-primary/20 rounded flex items-center justify-center text-xs"
                  >
                    Slide
                  </AnimatedContainer>
                  <AnimatedContainer 
                    animation="scale" 
                    delay={200}
                    className="h-8 bg-primary/20 rounded flex items-center justify-center text-xs"
                  >
                    Scale
                  </AnimatedContainer>
                </div>
              </div>
            </AnimatedContainer>
          )}
        </CardContent>
      </Card>
    </AnimatedContainer>
  );
};

export default AnimationSettings;