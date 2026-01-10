/**
 * Animation Context for SafeSpace
 * 
 * Provides global animation configuration and reduced motion support
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from '@/contexts/theme-context';

interface AnimationContextType {
  /** Whether animations are globally enabled */
  animationsEnabled: boolean;
  /** Whether user prefers reduced motion */
  prefersReducedMotion: boolean;
  /** Whether to respect system reduced motion preference */
  respectSystemPreference: boolean;
  /** Toggle animations on/off */
  toggleAnimations: () => void;
  /** Set reduced motion preference */
  setReducedMotion: (enabled: boolean) => void;
  /** Set whether to respect system preference */
  setRespectSystemPreference: (respect: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

interface AnimationProviderProps {
  children: React.ReactNode;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const [systemPrefersReducedMotion, setSystemPrefersReducedMotion] = useState(false);

  // Check system preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersReducedMotion(e.matches);
    };

    // Set initial value
    setSystemPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Update theme when system preference changes (if respecting system preference)
  useEffect(() => {
    if (theme.animations?.respectSystemPreference) {
      setTheme({
        animations: {
          ...theme.animations,
          reducedMotion: systemPrefersReducedMotion,
        },
      });
    }
  }, [systemPrefersReducedMotion, theme.animations?.respectSystemPreference, setTheme, theme.animations]);

  const animationsEnabled = !theme.animations?.reducedMotion;
  const prefersReducedMotion = theme.animations?.reducedMotion ?? false;
  const respectSystemPreference = theme.animations?.respectSystemPreference ?? true;

  const toggleAnimations = () => {
    setTheme({
      animations: {
        ...theme.animations,
        reducedMotion: !prefersReducedMotion,
      },
    });
  };

  const setReducedMotion = (enabled: boolean) => {
    setTheme({
      animations: {
        ...theme.animations,
        reducedMotion: enabled,
      },
    });
  };

  const setRespectSystemPreference = (respect: boolean) => {
    setTheme({
      animations: {
        ...theme.animations,
        respectSystemPreference: respect,
        // If enabling system preference, apply current system setting
        ...(respect && { reducedMotion: systemPrefersReducedMotion }),
      },
    });
  };

  const value: AnimationContextType = {
    animationsEnabled,
    prefersReducedMotion,
    respectSystemPreference,
    toggleAnimations,
    setReducedMotion,
    setRespectSystemPreference,
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = (): AnimationContextType => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

export default AnimationProvider;