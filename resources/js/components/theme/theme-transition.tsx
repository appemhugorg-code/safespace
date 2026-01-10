import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/theme-context';

interface ThemeTransitionProps {
  children: React.ReactNode;
}

/**
 * Component that provides smooth theme transitions with therapeutic timing
 */
export function ThemeTransition({ children }: ThemeTransitionProps) {
  const { effectiveMode } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousMode, setPreviousMode] = useState(effectiveMode);

  useEffect(() => {
    if (previousMode !== effectiveMode) {
      setIsTransitioning(true);
      
      // Add theme switching class to body for global transition
      document.body.classList.add('theme-switching');
      
      // Remove transition class after animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        document.body.classList.remove('theme-switching');
        setPreviousMode(effectiveMode);
      }, 600); // Match the CSS animation duration

      return () => {
        clearTimeout(timer);
        document.body.classList.remove('theme-switching');
      };
    }
  }, [effectiveMode, previousMode]);

  return (
    <div 
      className={`theme-transition ${isTransitioning ? 'theme-switching' : ''}`}
      style={{
        '--transition-duration': isTransitioning ? '0.6s' : '0.4s'
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * Hook for theme-aware animations
 */
export function useThemeTransition() {
  const { effectiveMode } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  return {
    isTransitioning,
    triggerTransition,
    effectiveMode,
  };
}

/**
 * Component for theme-aware loading states
 */
export function ThemeAwareLoader({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const { effectiveMode } = useTheme();
  
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`${sizeClasses[size]} rounded-full border-2 border-primary/20 border-t-primary animate-spin`}
        style={{
          animationDuration: effectiveMode === 'dark' ? '1.2s' : '1s'
        }}
      />
    </div>
  );
}

/**
 * Component for therapeutic fade-in animations
 */
export function TherapeuticFadeIn({ 
  children, 
  delay = 0, 
  duration = 0.6 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  duration?: number; 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{
        transitionDuration: `${duration}s`,
        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      {children}
    </div>
  );
}

/**
 * Component for theme-aware hover effects
 */
export function TherapeuticHover({ 
  children, 
  className = '',
  intensity = 'medium' 
}: { 
  children: React.ReactNode; 
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
}) {
  const intensityClasses = {
    subtle: 'hover:scale-[1.02] hover:shadow-sm',
    medium: 'hover:scale-105 hover:shadow-md',
    strong: 'hover:scale-110 hover:shadow-lg'
  };

  return (
    <div 
      className={`
        transition-all duration-300 ease-out cursor-pointer
        ${intensityClasses[intensity]}
        hover:bg-hover-overlay
        active:scale-95
        ${className}
      `}
    >
      {children}
    </div>
  );
}