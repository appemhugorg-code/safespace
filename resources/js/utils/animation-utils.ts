/**
 * Animation Utilities
 * 
 * Utility functions for handling animations with reduced motion support
 */

import { Variants, Transition } from 'framer-motion';

/**
 * Create reduced motion safe variants
 */
export const createSafeVariants = (
  normalVariants: Variants,
  reducedMotionVariants?: Variants
): { normal: Variants; reduced: Variants } => {
  const defaultReducedVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  };

  return {
    normal: normalVariants,
    reduced: reducedMotionVariants || defaultReducedVariants,
  };
};

/**
 * Create reduced motion safe transition
 */
export const createSafeTransition = (
  normalTransition: Transition,
  reducedTransition?: Transition
): { normal: Transition; reduced: Transition } => {
  const defaultReducedTransition: Transition = {
    duration: 0.1,
    ease: 'linear',
  };

  return {
    normal: normalTransition,
    reduced: reducedTransition || defaultReducedTransition,
  };
};

/**
 * Get animation duration based on reduced motion preference
 */
export const getSafeDuration = (
  normalDuration: number,
  reducedMotion: boolean,
  reducedDuration: number = 100
): number => {
  return reducedMotion ? reducedDuration : normalDuration;
};

/**
 * Get animation easing based on reduced motion preference
 */
export const getSafeEasing = (
  normalEasing: string | number[],
  reducedMotion: boolean,
  reducedEasing: string | number[] = 'linear'
): string | number[] => {
  return reducedMotion ? reducedEasing : normalEasing;
};

/**
 * Create animation props that respect reduced motion
 */
export const createSafeAnimationProps = (
  props: any,
  reducedMotion: boolean
) => {
  if (!reducedMotion) return props;

  const safeProps = { ...props };

  // Simplify or remove decorative animations
  if (safeProps.whileHover) {
    safeProps.whileHover = {};
  }

  if (safeProps.whileTap) {
    safeProps.whileTap = { scale: 0.99 }; // Minimal feedback
  }

  // Reduce transition durations
  if (safeProps.transition) {
    safeProps.transition = {
      ...safeProps.transition,
      duration: getSafeDuration(
        safeProps.transition.duration * 1000 || 300,
        true
      ) / 1000,
      ease: 'linear',
    };
  }

  // Simplify complex animations
  if (safeProps.animate && typeof safeProps.animate === 'object') {
    const { scale, rotate, x, y, ...otherProps } = safeProps.animate;
    safeProps.animate = {
      opacity: otherProps.opacity || 1,
      // Keep essential positioning but remove decorative transforms
      ...(x !== undefined && Math.abs(x) > 10 ? {} : { x }),
      ...(y !== undefined && Math.abs(y) > 10 ? {} : { y }),
    };
  }

  return safeProps;
};

/**
 * Animation categories for reduced motion handling
 */
export const AnimationCategory = {
  ESSENTIAL: 'essential' as const,
  FEEDBACK: 'feedback' as const,
  DECORATIVE: 'decorative' as const,
};

/**
 * Check if animation should be allowed based on category and reduced motion
 */
export const shouldAllowAnimation = (
  category: typeof AnimationCategory[keyof typeof AnimationCategory],
  reducedMotion: boolean
): boolean => {
  if (!reducedMotion) return true;

  switch (category) {
    case AnimationCategory.ESSENTIAL:
      return true; // Always allow essential animations
    case AnimationCategory.FEEDBACK:
      return true; // Allow feedback but may be simplified
    case AnimationCategory.DECORATIVE:
      return false; // Disable decorative animations
    default:
      return false;
  }
};

/**
 * Create CSS custom properties for reduced motion
 */
export const createReducedMotionCSS = (reducedMotion: boolean) => {
  return {
    '--animation-duration-fast': reducedMotion ? '0.1s' : '0.15s',
    '--animation-duration-normal': reducedMotion ? '0.1s' : '0.3s',
    '--animation-duration-slow': reducedMotion ? '0.15s' : '0.5s',
    '--animation-easing': reducedMotion ? 'linear' : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };
};

/**
 * Prefers reduced motion media query
 */
export const PREFERS_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Check if browser supports prefers-reduced-motion
 */
export const supportsReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia !== undefined;
};

/**
 * Get system reduced motion preference
 */
export const getSystemReducedMotionPreference = (): boolean => {
  if (!supportsReducedMotion()) return false;
  return window.matchMedia(PREFERS_REDUCED_MOTION_QUERY).matches;
};

/**
 * Listen for system reduced motion changes
 */
export const listenForReducedMotionChanges = (
  callback: (prefersReducedMotion: boolean) => void
): (() => void) => {
  if (!supportsReducedMotion()) {
    return () => {}; // No-op cleanup function
  }

  const mediaQuery = window.matchMedia(PREFERS_REDUCED_MOTION_QUERY);
  
  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };

  mediaQuery.addEventListener('change', handleChange);

  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
};

/**
 * Therapeutic animation presets with reduced motion alternatives
 */
export const therapeuticAnimations = {
  gentle: {
    normal: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -5 },
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    reduced: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.1 },
    },
  },
  
  calm: {
    normal: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 },
      transition: { duration: 0.4, ease: [0.4, 0.0, 0.2, 1] },
    },
    reduced: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.1 },
    },
  },
  
  soothing: {
    normal: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
    reduced: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.1 },
    },
  },
};