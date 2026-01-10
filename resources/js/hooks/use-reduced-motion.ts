/**
 * Reduced Motion Hook
 * 
 * Provides comprehensive reduced motion detection and management
 */

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/theme-context';

interface ReducedMotionState {
  /** System preference for reduced motion */
  systemPrefersReducedMotion: boolean;
  /** User override preference */
  userPrefersReducedMotion: boolean | null;
  /** Final effective reduced motion state */
  reducedMotion: boolean;
  /** Whether to respect system preference */
  respectSystemPreference: boolean;
}

interface UseReducedMotionOptions {
  /** Default respect system preference */
  defaultRespectSystem?: boolean;
  /** Callback when reduced motion state changes */
  onReducedMotionChange?: (reducedMotion: boolean) => void;
}

export const useReducedMotion = (options: UseReducedMotionOptions = {}) => {
  const { 
    defaultRespectSystem = true,
    onReducedMotionChange 
  } = options;

  const { theme, setTheme } = useTheme();
  
  const [state, setState] = useState<ReducedMotionState>({
    systemPrefersReducedMotion: false,
    userPrefersReducedMotion: theme.animations?.reducedMotion ?? null,
    reducedMotion: theme.animations?.reducedMotion ?? false,
    respectSystemPreference: theme.animations?.respectSystemPreference ?? defaultRespectSystem,
  });

  // Detect system preference for reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setState(prev => ({
        ...prev,
        systemPrefersReducedMotion: e.matches,
      }));
    };

    // Set initial value
    setState(prev => ({
      ...prev,
      systemPrefersReducedMotion: mediaQuery.matches,
    }));

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Calculate effective reduced motion state
  useEffect(() => {
    let effectiveReducedMotion: boolean;

    if (state.userPrefersReducedMotion !== null) {
      // User has explicitly set a preference
      effectiveReducedMotion = state.userPrefersReducedMotion;
    } else if (state.respectSystemPreference) {
      // Respect system preference
      effectiveReducedMotion = state.systemPrefersReducedMotion;
    } else {
      // Default to false if not respecting system and no user preference
      effectiveReducedMotion = false;
    }

    if (effectiveReducedMotion !== state.reducedMotion) {
      setState(prev => ({
        ...prev,
        reducedMotion: effectiveReducedMotion,
      }));

      // Update theme
      setTheme({
        animations: {
          ...theme.animations,
          reducedMotion: effectiveReducedMotion,
        },
      });

      // Notify callback
      onReducedMotionChange?.(effectiveReducedMotion);
    }
  }, [
    state.systemPrefersReducedMotion,
    state.userPrefersReducedMotion,
    state.respectSystemPreference,
    state.reducedMotion,
    setTheme,
    theme.animations,
    onReducedMotionChange,
  ]);

  // Set user preference for reduced motion
  const setUserPreference = useCallback((preference: boolean | null) => {
    setState(prev => ({
      ...prev,
      userPrefersReducedMotion: preference,
    }));

    setTheme({
      animations: {
        ...theme.animations,
        reducedMotion: preference ?? state.systemPrefersReducedMotion,
      },
    });
  }, [setTheme, theme.animations, state.systemPrefersReducedMotion]);

  // Toggle reduced motion
  const toggleReducedMotion = useCallback(() => {
    const newValue = !state.reducedMotion;
    setUserPreference(newValue);
  }, [state.reducedMotion, setUserPreference]);

  // Set whether to respect system preference
  const setRespectSystemPreference = useCallback((respect: boolean) => {
    setState(prev => ({
      ...prev,
      respectSystemPreference: respect,
    }));

    setTheme({
      animations: {
        ...theme.animations,
        respectSystemPreference: respect,
        // If enabling system preference, apply current system setting
        ...(respect && { reducedMotion: state.systemPrefersReducedMotion }),
      },
    });
  }, [setTheme, theme.animations, state.systemPrefersReducedMotion]);

  // Reset to system preference
  const resetToSystemPreference = useCallback(() => {
    setUserPreference(null);
    setRespectSystemPreference(true);
  }, [setUserPreference, setRespectSystemPreference]);

  // Get animation-safe styles
  const getSafeAnimationStyles = useCallback((
    animatedStyles: Record<string, any>,
    fallbackStyles: Record<string, any> = {}
  ) => {
    return state.reducedMotion ? fallbackStyles : animatedStyles;
  }, [state.reducedMotion]);

  // Get safe transition duration
  const getSafeTransitionDuration = useCallback((
    normalDuration: number,
    reducedDuration: number = 0
  ) => {
    return state.reducedMotion ? reducedDuration : normalDuration;
  }, [state.reducedMotion]);

  // Check if animation should be enabled
  const shouldAnimate = useCallback((
    animationType?: 'essential' | 'decorative' | 'feedback'
  ) => {
    if (!state.reducedMotion) return true;
    
    // Allow essential animations even in reduced motion
    if (animationType === 'essential') return true;
    
    // Allow feedback animations with reduced intensity
    if (animationType === 'feedback') return true;
    
    // Disable decorative animations
    return false;
  }, [state.reducedMotion]);

  return {
    // State
    ...state,
    
    // Actions
    setUserPreference,
    toggleReducedMotion,
    setRespectSystemPreference,
    resetToSystemPreference,
    
    // Utilities
    getSafeAnimationStyles,
    getSafeTransitionDuration,
    shouldAnimate,
    
    // Computed values
    hasUserPreference: state.userPrefersReducedMotion !== null,
    isUsingSystemPreference: state.respectSystemPreference && state.userPrefersReducedMotion === null,
  };
};

export default useReducedMotion;