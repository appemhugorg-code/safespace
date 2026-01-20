import React from 'react';
import { useTheme } from '@/contexts/theme-context';
import { TherapeuticThemeTransition } from '@/components/theme/therapeutic-theme-transition';

interface ThemeIntegrationProps {
  children: React.ReactNode;
  userId?: number;
  initialTheme?: any;
}

/**
 * Component that handles theme integration using enhanced theme persistence
 * This component is now a simple wrapper that relies on the ThemeProvider's
 * built-in enhanced persistence system
 */
function ThemeIntegrationInner({ children }: { children: React.ReactNode }) {
  const { syncStatus } = useTheme();

  // Show loading state while theme is being initialized
  if (syncStatus.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <TherapeuticThemeTransition>
      {children}
    </TherapeuticThemeTransition>
  );
}

/**
 * Main theme integration wrapper
 * Now uses the enhanced theme persistence system built into ThemeProvider
 */
export function ThemeIntegration({ children, userId, initialTheme }: ThemeIntegrationProps) {
  // The ThemeProvider now handles all persistence automatically
  // No need for separate theme loading or syncing logic
  return (
    <ThemeIntegrationInner>
      {children}
    </ThemeIntegrationInner>
  );
}

/**
 * Component for theme-aware page wrapper
 */
export function ThemeAwarePage({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { effectiveMode, theme } = useTheme();

  const pageClasses = [
    'min-h-screen',
    'bg-background',
    'text-foreground',
    'transition-colors',
    'duration-300',
    effectiveMode === 'dark' ? 'dark' : 'light',
    theme.accessibility.contrast === 'high' ? 'high-contrast' : '',
    theme.animations.reducedMotion ? 'reduce-motion' : '',
    theme.accessibility.focusVisible ? 'focus-enhanced' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={pageClasses}>
      {children}
    </div>
  );
}