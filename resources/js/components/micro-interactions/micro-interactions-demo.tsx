/**
 * Micro-interactions Demo Component
 * 
 * Demonstrates the micro-interaction system capabilities
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import InteractiveButton from './interactive-button';
import InteractiveInput from './interactive-input';
import InteractiveCard from './interactive-card';
import InteractiveForm from './interactive-form';
import { useAnimationsEnabled } from '@/hooks/use-animations';

export const MicroInteractionsDemo: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [formData, setFormData] = useState({});
  const animationsEnabled = useAnimationsEnabled();

  const demoCards = [
    { id: '1', title: 'Gentle Interactions', description: 'Calming hover and click effects' },
    { id: '2', title: 'Therapeutic Feedback', description: 'Soothing visual responses' },
    { id: '3', title: 'Accessible Design', description: 'Reduced motion friendly' },
  ];

  const formFields = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter your name',
      icon: '👤',
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email' as const,
      required: true,
      placeholder: 'Enter your email',
      icon: '📧',
      validation: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : 'Please enter a valid email';
      },
    },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Micro-interactions System Demo</CardTitle>
          <CardDescription>
            Therapeutic micro-interactions designed for mental health applications
          </CardDescription>
          <div className="flex items-center gap-2">
            <Badge variant={animationsEnabled ? 'default' : 'secondary'}>
              {animationsEnabled ? 'Animations Enabled' : 'Reduced Motion'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Interactive Buttons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Interactive Buttons</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <InteractiveButton interaction="gentle">Gentle</InteractiveButton>
              <InteractiveButton interaction="bounce">Bounce</InteractiveButton>
              <InteractiveButton interaction="pulse">Pulse</InteractiveButton>
              <InteractiveButton interaction="glow">Glow</InteractiveButton>
              <InteractiveButton interaction="lift">Lift</InteractiveButton>
            </div>
          </div>

          {/* Interactive Inputs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Interactive Inputs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InteractiveInput
                label="Glow Focus"
                placeholder="Focus to see glow effect"
                focusAnimation="glow"
                icon="🔍"
              />
              <InteractiveInput
                label="Lift Focus"
                placeholder="Focus to see lift effect"
                focusAnimation="lift"
                icon="⬆️"
              />
            </div>
          </div>

          {/* Interactive Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Interactive Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {demoCards.map((card) => (
                <InteractiveCard
                  key={card.id}
                  hoverEffect="lift"
                  clickEffect="ripple"
                  selectable
                  selected={selectedCard === card.id}
                  onSelect={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-base">{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                </InteractiveCard>
              ))}
            </div>
          </div>

          {/* Interactive Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Interactive Form</h3>
            <InteractiveForm
              fields={formFields}
              title="Contact Form"
              description="Experience therapeutic form interactions"
              onSubmit={async (data) => {
                console.log('Form submitted:', data);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
              }}
              validationAnimation="shake"
              successAnimation="checkmark"
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default MicroInteractionsDemo;