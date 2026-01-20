import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { motion, AnimatePresence } from 'framer-motion';

interface TherapeuticThemeTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Therapeutic Theme Transition Component
 * 
 * Provides smooth, calming transitions when switching between light and dark modes.
 * Uses therapeutic timing and easing curves designed for mental health applications.
 */
export function TherapeuticThemeTransition({ 
  children, 
  className = '' 
}: TherapeuticThemeTransitionProps) {
  const { effectiveMode, theme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousMode, setPreviousMode] = useState(effectiveMode);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle theme mode changes with therapeutic timing
  useEffect(() => {
    if (previousMode !== effectiveMode) {
      setIsTransitioning(true);
      
      // Clear any existing timeout
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      
      // Use therapeutic timing for the transition
      const transitionDuration = theme.animations.reducedMotion ? 100 : 600;
      
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setPreviousMode(effectiveMode);
      }, transitionDuration);
    }

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [effectiveMode, previousMode, theme.animations.reducedMotion]);

  // Therapeutic transition variants
  const transitionVariants = {
    initial: {
      opacity: 1,
    },
    transitioning: {
      opacity: theme.animations.reducedMotion ? 1 : 0.85,
      transition: {
        duration: theme.animations.reducedMotion ? 0.1 : 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const, // Gentle easing
      },
    },
    complete: {
      opacity: 1,
      transition: {
        duration: theme.animations.reducedMotion ? 0.1 : 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const, // Gentle easing
      },
    },
  };

  // Overlay animation for smooth color transitions
  const overlayVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: theme.animations.reducedMotion ? 0 : 0.1,
      transition: {
        duration: theme.animations.reducedMotion ? 0 : 0.2,
        ease: [0.25, 0.1, 0.25, 1] as const, // Soothing easing
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: theme.animations.reducedMotion ? 0 : 0.4,
        ease: [0.4, 0.0, 1, 1] as const, // Exit easing
      },
    },
  };

  return (
    <div className={`relative ${className}`}>
      {/* Transition overlay for smooth color changes */}
      <AnimatePresence>
        {isTransitioning && !theme.animations.reducedMotion && (
          <motion.div
            className="absolute inset-0 z-50 pointer-events-none"
            style={{
              background: effectiveMode === 'dark' 
                ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))'
                : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.6))',
            }}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
        )}
      </AnimatePresence>

      {/* Main content with therapeutic transition */}
      <motion.div
        variants={transitionVariants}
        initial="initial"
        animate={isTransitioning ? "transitioning" : "complete"}
        className="transition-colors duration-500"
        style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Theme Transition Status Indicator
 * 
 * Shows a subtle indicator during theme transitions for user feedback
 */
export function ThemeTransitionIndicator() {
  const { effectiveMode, theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [previousMode, setPreviousMode] = useState(effectiveMode);

  useEffect(() => {
    if (previousMode !== effectiveMode && !theme.animations.reducedMotion) {
      setIsVisible(true);
      
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setPreviousMode(effectiveMode);
      }, 800);

      return () => clearTimeout(timeout);
    } else if (theme.animations.reducedMotion) {
      setPreviousMode(effectiveMode);
    }
  }, [effectiveMode, previousMode, theme.animations.reducedMotion]);

  if (theme.animations.reducedMotion) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: {
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94]
            }
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.9, 
            y: -5,
            transition: {
              duration: 0.4,
              ease: [0.4, 0.0, 1, 1]
            }
          }}
        >
          <div className="bg-background/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <motion.div
                className="w-2 h-2 rounded-full bg-primary"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              />
              <span>Switching to {effectiveMode} mode</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Therapeutic Color Transition Hook
 * 
 * Provides smooth color transitions for individual components
 */
export function useTherapeuticColorTransition() {
  const { effectiveMode, theme } = useTheme();
  
  const getTransitionClasses = (baseClasses: string = '') => {
    const transitionClasses = theme.animations.reducedMotion 
      ? '' 
      : 'transition-all duration-500';
    
    const transitionStyle = theme.animations.reducedMotion 
      ? {} 
      : { transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' };
    
    return { 
      className: `${baseClasses} ${transitionClasses}`.trim(),
      style: transitionStyle
    };
  };

  const getColorTransitionStyle = (lightColor: string, darkColor: string) => {
    return {
      color: effectiveMode === 'dark' ? darkColor : lightColor,
      transition: theme.animations.reducedMotion 
        ? 'none' 
        : 'color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };
  };

  const getBackgroundTransitionStyle = (lightBg: string, darkBg: string) => {
    return {
      backgroundColor: effectiveMode === 'dark' ? darkBg : lightBg,
      transition: theme.animations.reducedMotion 
        ? 'none' 
        : 'background-color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };
  };

  return {
    effectiveMode,
    isReducedMotion: theme.animations.reducedMotion,
    getTransitionClasses,
    getColorTransitionStyle,
    getBackgroundTransitionStyle,
  };
}

/**
 * Therapeutic Theme Aware Component Wrapper
 * 
 * Automatically applies therapeutic transitions to child components
 */
interface ThemeAwareProps {
  children: React.ReactNode;
  className?: string;
  enableTransitions?: boolean;
}

export function ThemeAware({ 
  children, 
  className = '', 
  enableTransitions = true 
}: ThemeAwareProps) {
  const { getTransitionClasses } = useTherapeuticColorTransition();
  
  if (enableTransitions) {
    const { className: transitionClassName, style } = getTransitionClasses(className);
    return (
      <div className={transitionClassName} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
}