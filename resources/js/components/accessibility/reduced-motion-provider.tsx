/**
 * Reduced Motion Provider
 * 
 * Global provider for reduced motion state and fallback animations
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from '@/contexts/theme-context';

interface ReducedMotionContextType {
  /** Whether reduced motion is active */
  reducedMotion: boolean;
  /** System preference for reduced motion */
  systemPrefersReducedMotion: boolean;
  /** Get safe animation props */
  getSafeAnimationProps: (props: any) => any;
  /** Get safe transition duration */
  getSafeTransitionDuration: (duration: number) => number;
  /** Check if animation type should be enabled */
  shouldAnimate: (type?: 'essential' | 'decorative' | 'feedback') => boolean;
}

const ReducedMotionContext = createContext<ReducedMotionContextType | undefined>(undefined);

interface ReducedMotionProviderProps {
  children: React.ReactNode;
  /** Fallback animations for reduced motion */
  fallbackAnimations?: Record<string, any>;
}

export const ReducedMotionProvider: React.FC<ReducedMotionProviderProps> = ({
  children,
  fallbackAnimations = {},
}) => {
  const { theme } = useTheme();
  const [systemPrefersReducedMotion, setSystemPrefersReducedMotion] = useState(false);

  const reducedMotion = theme.animations?.reducedMotion ?? false;

  // Detect system preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersReducedMotion(e.matches);
    };

    setSystemPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Apply reduced motion class to document
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    
    if (reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    return () => {
      root.classList.remove('reduce-motion');
    };
  }, [reducedMotion]);

  // Get safe animation props
  const getSafeAnimationProps = (props: any) => {
    if (!reducedMotion) return props;

    // Default fallback animations
    const defaultFallbacks = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.1 },
      whileHover: {},
      whileTap: {},
      whileFocus: {},
      ...fallbackAnimations,
    };

    // Merge with custom fallbacks
    const safeProps = { ...props };
    
    Object.keys(defaultFallbacks).forEach(key => {
      if (key in safeProps) {
        safeProps[key] = defaultFallbacks[key];
      }
    });

    return safeProps;
  };

  // Get safe transition duration
  const getSafeTransitionDuration = (duration: number) => {
    return reducedMotion ? Math.min(duration, 100) : duration;
  };

  // Check if animation should be enabled
  const shouldAnimate = (type: 'essential' | 'decorative' | 'feedback' = 'decorative') => {
    if (!reducedMotion) return true;

    switch (type) {
      case 'essential':
        // Essential animations for functionality (always allowed)
        return true;
      case 'feedback':
        // User feedback animations (simplified but allowed)
        return true;
      case 'decorative':
        // Decorative animations (disabled in reduced motion)
        return false;
      default:
        return false;
    }
  };

  const contextValue: ReducedMotionContextType = {
    reducedMotion,
    systemPrefersReducedMotion,
    getSafeAnimationProps,
    getSafeTransitionDuration,
    shouldAnimate,
  };

  return (
    <ReducedMotionContext.Provider value={contextValue}>
      {children}
    </ReducedMotionContext.Provider>
  );
};

/**
 * Hook to use reduced motion context
 */
export const useReducedMotionContext = (): ReducedMotionContextType => {
  const context = useContext(ReducedMotionContext);
  if (context === undefined) {
    throw new Error('useReducedMotionContext must be used within a ReducedMotionProvider');
  }
  return context;
};

export default ReducedMotionProvider;