/**
 * Reduced Motion Demo Component
 * 
 * Demonstrates the reduced motion accessibility system
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import MotionPreferences from './motion-preferences';
import SafeAnimation from './safe-animation';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { therapeuticAnimations } from '@/utils/animation-utils';
import AnimatedContainer from '@/components/animations/animated-container';

export const ReducedMotionDemo: React.FC = () => {
  const [showPreferences, setShowPreferences] = useState(false);
  const [demoAnimation, setDemoAnimation] = useState('gentle');
  const {
    reducedMotion,
    systemPrefersReducedMotion,
    respectSystemPreference,
    shouldAnimate,
    getSafeAnimationStyles,
  } = useReducedMotion();

  const animationTypes = ['gentle', 'calm', 'soothing'] as const;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reduced Motion Accessibility Demo</CardTitle>
          <CardDescription>
            Demonstrates how SafeSpace handles motion preferences and accessibility
          </CardDescription>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={reducedMotion ? 'secondary' : 'default'}>
              {reducedMotion ? 'Reduced Motion Active' : 'Full Motion Active'}
            </Badge>
            <Badge variant={systemPrefersReducedMotion ? 'outline' : 'secondary'}>
              System: {systemPrefersReducedMotion ? 'Reduced' : 'Full'} Motion
            </Badge>
            <Badge variant={respectSystemPreference ? 'default' : 'outline'}>
              {respectSystemPreference ? 'Following System' : 'Manual Override'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Motion Preferences Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-preferences">Motion Preferences</Label>
              <p className="text-sm text-muted-foreground">
                Show detailed motion preference controls
              </p>
            </div>
            <Switch
              id="show-preferences"
              checked={showPreferences}
              onCheckedChange={setShowPreferences}
            />
          </div>

          {/* Motion Preferences Panel */}
          {showPreferences && (
            <MotionPreferences showAdvanced />
          )}

          {/* Animation Type Selector */}
          <div className="space-y-3">
            <Label>Demo Animation Type</Label>
            <div className="flex gap-2 flex-wrap">
              {animationTypes.map((type) => (
                <Button
                  key={type}
                  variant={demoAnimation === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDemoAnimation(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Animation Comparison */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Animation Comparison</h3>
            
            {/* Normal Animations */}
            <div className="space-y-2">
              <Label>Normal Animations (Full Motion)</Label>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <SafeAnimation
                    key={`normal-${i}`}
                    variants={therapeuticAnimations[demoAnimation as keyof typeof therapeuticAnimations].normal}
                    initial="initial"
                    animate="animate"
                    animationType="decorative"
                    forceStatic={false}
                    className="h-16 bg-primary/20 rounded flex items-center justify-center text-sm"
                  >
                    Normal {i}
                  </SafeAnimation>
                ))}
              </div>
            </div>

            {/* Reduced Motion Animations */}
            <div className="space-y-2">
              <Label>Reduced Motion Animations</Label>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <SafeAnimation
                    key={`reduced-${i}`}
                    variants={therapeuticAnimations[demoAnimation as keyof typeof therapeuticAnimations].normal}
                    fallbackVariants={therapeuticAnimations[demoAnimation as keyof typeof therapeuticAnimations].reduced}
                    initial="initial"
                    animate="animate"
                    animationType="decorative"
                    className="h-16 bg-orange-100 border border-orange-200 rounded flex items-center justify-center text-sm"
                  >
                    Reduced {i}
                  </SafeAnimation>
                ))}
              </div>
            </div>
          </div>

          {/* Animation Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Animation Categories</h3>
            
            {/* Essential Animations */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Essential Animations</Label>
                <Badge variant="default">Always Enabled</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Critical for functionality - preserved even in reduced motion
              </p>
              <div className="flex gap-4">
                <SafeAnimation
                  animationType="essential"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-4 py-2 bg-green-100 border border-green-200 rounded text-sm"
                >
                  Loading Indicator
                </SafeAnimation>
                <SafeAnimation
                  animationType="essential"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="px-4 py-2 bg-green-100 border border-green-200 rounded text-sm"
                >
                  Form Validation
                </SafeAnimation>
              </div>
            </div>

            {/* Feedback Animations */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Feedback Animations</Label>
                <Badge variant="secondary">Simplified in Reduced Motion</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                User interaction feedback - simplified but preserved
              </p>
              <div className="flex gap-4">
                <SafeAnimation
                  animationType="feedback"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-100 border border-blue-200 rounded text-sm cursor-pointer"
                >
                  Button Hover
                </SafeAnimation>
                <SafeAnimation
                  animationType="feedback"
                  whileFocus={{ boxShadow: '0 0 0 2px rgb(59 130 246)' }}
                  className="px-4 py-2 bg-blue-100 border border-blue-200 rounded text-sm"
                  tabIndex={0}
                >
                  Focus Ring
                </SafeAnimation>
              </div>
            </div>

            {/* Decorative Animations */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Decorative Animations</Label>
                <Badge variant={shouldAnimate('decorative') ? 'default' : 'outline'}>
                  {shouldAnimate('decorative') ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Visual enhancements - disabled in reduced motion
              </p>
              <div className="flex gap-4">
                <SafeAnimation
                  animationType="decorative"
                  animate={{ 
                    y: [0, -5, 0],
                    transition: { duration: 2, repeat: Infinity }
                  }}
                  className="px-4 py-2 bg-purple-100 border border-purple-200 rounded text-sm"
                >
                  Floating Effect
                </SafeAnimation>
                <SafeAnimation
                  animationType="decorative"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    transition: { duration: 3, repeat: Infinity }
                  }}
                  className="px-4 py-2 bg-purple-100 border border-purple-200 rounded text-sm"
                >
                  Subtle Rotation
                </SafeAnimation>
              </div>
            </div>
          </div>

          {/* Current Settings Summary */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <h4 className="font-medium">Current Motion Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reduced Motion:</span>
                <span className={reducedMotion ? 'text-orange-600' : 'text-green-600'}>
                  {reducedMotion ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">System Preference:</span>
                <span>{systemPrefersReducedMotion ? 'Reduce' : 'No Preference'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Essential Animations:</span>
                <span className="text-green-600">Always Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Decorative Animations:</span>
                <span className={shouldAnimate('decorative') ? 'text-green-600' : 'text-orange-600'}>
                  {shouldAnimate('decorative') ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default ReducedMotionDemo;