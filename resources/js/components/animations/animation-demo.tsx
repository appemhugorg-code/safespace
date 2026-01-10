/**
 * Animation Demo Component
 * 
 * Demonstrates the therapeutic animation system capabilities
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AnimatedContainer from './animated-container';
import AnimatedList, { AnimatedListItem } from './animated-list';
import AnimatedButton from './animated-button';
import AnimatedCard from './animated-card';
import { useAnimationsEnabled, useTherapeuticTiming } from '@/hooks/use-animations';

export const AnimationDemo: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [currentDemo, setCurrentDemo] = useState<string>('containers');
  const animationsEnabled = useAnimationsEnabled();
  const timing = useTherapeuticTiming();

  const demoItems = [
    { id: 1, title: 'Gentle Fade Animation', description: 'Calming entrance effect' },
    { id: 2, title: 'Therapeutic Slide', description: 'Smooth upward movement' },
    { id: 3, title: 'Soothing Scale', description: 'Gentle scaling transition' },
    { id: 4, title: 'Mindful Motion', description: 'Reduced motion friendly' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SafeSpace Animation System Demo</CardTitle>
          <CardDescription>
            Therapeutic animations designed for mental health applications
          </CardDescription>
          <div className="flex items-center gap-2">
            <Badge variant={animationsEnabled ? 'default' : 'secondary'}>
              {animationsEnabled ? 'Animations Enabled' : 'Reduced Motion'}
            </Badge>
            <Badge variant="outline">
              Timing: {timing.normal}ms
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setCurrentDemo('containers')}
              variant={currentDemo === 'containers' ? 'default' : 'outline'}
              size="sm"
            >
              Containers
            </Button>
            <Button
              onClick={() => setCurrentDemo('lists')}
              variant={currentDemo === 'lists' ? 'default' : 'outline'}
              size="sm"
            >
              Lists
            </Button>
            <Button
              onClick={() => setCurrentDemo('interactions')}
              variant={currentDemo === 'interactions' ? 'default' : 'outline'}
              size="sm"
            >
              Interactions
            </Button>
            <Button
              onClick={() => setCurrentDemo('cards')}
              variant={currentDemo === 'cards' ? 'default' : 'outline'}
              size="sm"
            >
              Cards
            </Button>
          </div>

          <AnimatedButton
            onClick={() => setShowDemo(!showDemo)}
            variant="default"
          >
            {showDemo ? 'Hide Demo' : 'Show Demo'}
          </AnimatedButton>

          {showDemo && (
            <AnimatedContainer animation="slideUp" delay={200}>
              <div className="border rounded-lg p-4 bg-muted/50">
                {currentDemo === 'containers' && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Container Animations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <AnimatedContainer animation="fade" delay={0}>
                        <div className="p-4 bg-primary/10 rounded text-center">
                          Fade In
                        </div>
                      </AnimatedContainer>
                      <AnimatedContainer animation="slideUp" delay={100}>
                        <div className="p-4 bg-primary/10 rounded text-center">
                          Slide Up
                        </div>
                      </AnimatedContainer>
                      <AnimatedContainer animation="scale" delay={200}>
                        <div className="p-4 bg-primary/10 rounded text-center">
                          Scale
                        </div>
                      </AnimatedContainer>
                    </div>
                  </div>
                )}

                {currentDemo === 'lists' && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Staggered List Animations</h3>
                    <AnimatedList staggerDelay={100} initialDelay={200}>
                      {demoItems.map((item) => (
                        <AnimatedListItem key={item.id}>
                          <div className="p-3 bg-primary/10 rounded mb-2">
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.description}
                            </div>
                          </div>
                        </AnimatedListItem>
                      ))}
                    </AnimatedList>
                  </div>
                )}

                {currentDemo === 'interactions' && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Interactive Animations</h3>
                    <div className="flex gap-4 flex-wrap">
                      <AnimatedButton variant="default">
                        Hover Me
                      </AnimatedButton>
                      <AnimatedButton variant="outline">
                        Gentle Hover
                      </AnimatedButton>
                      <AnimatedButton variant="secondary">
                        Therapeutic Click
                      </AnimatedButton>
                    </div>
                  </div>
                )}

                {currentDemo === 'cards' && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Card Animations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AnimatedCard 
                        enableHover 
                        animateEntrance 
                        entranceDelay={0}
                      >
                        <CardHeader>
                          <CardTitle className="text-lg">Animated Card</CardTitle>
                          <CardDescription>
                            Hover for gentle animation
                          </CardDescription>
                        </CardHeader>
                      </AnimatedCard>
                      
                      <AnimatedCard 
                        enableHover 
                        enableTap
                        animateEntrance 
                        entranceDelay={200}
                      >
                        <CardHeader>
                          <CardTitle className="text-lg">Interactive Card</CardTitle>
                          <CardDescription>
                            Hover and click for animations
                          </CardDescription>
                        </CardHeader>
                      </AnimatedCard>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimationDemo;