/**
 * Animation Configuration for SafeSpace
 * 
 * Therapeutic animation system with calming timing and easing curves
 * designed specifically for mental health applications.
 */

import { Variants, Transition } from 'framer-motion';

// Therapeutic timing constants
export const THERAPEUTIC_TIMING = {
  // Ultra-fast for immediate feedback
  instant: 0,
  
  // Fast for micro-interactions
  fast: 150,
  
  // Normal for standard transitions
  normal: 300,
  
  // Slow for calming, deliberate movements
  slow: 500,
  
  // Extra slow for meditation-like transitions
  gentle: 800,
  
  // Page transitions
  page: 400,
  
  // Modal and overlay transitions
  modal: 250,
  
  // Loading states
  loading: 1200,
} as const;

// Therapeutic easing curves
export const THERAPEUTIC_EASING = {
  // Gentle, natural movement
  gentle: [0.25, 0.46, 0.45, 0.94],
  
  // Calm, reassuring movement
  calm: [0.4, 0.0, 0.2, 1],
  
  // Soothing, meditative movement
  soothing: [0.25, 0.1, 0.25, 1],
  
  // Bouncy but controlled
  bounce: [0.68, -0.55, 0.265, 1.55],
  
  // Sharp but not jarring
  crisp: [0.4, 0.0, 0.6, 1],
  
  // Smooth entrance
  enter: [0.0, 0.0, 0.2, 1],
  
  // Smooth exit
  exit: [0.4, 0.0, 1, 1],
} as const;

// Base transition configurations
export const createTransition = (
  duration: keyof typeof THERAPEUTIC_TIMING,
  easing: keyof typeof THERAPEUTIC_EASING = 'gentle',
  delay = 0
): Transition => ({
  duration: THERAPEUTIC_TIMING[duration] / 1000,
  ease: THERAPEUTIC_EASING[easing],
  delay: delay / 1000,
});

// Common animation variants
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: createTransition('normal', 'gentle'),
  },
  exit: {
    opacity: 0,
    transition: createTransition('fast', 'exit'),
  },
};

export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: createTransition('normal', 'gentle'),
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: createTransition('fast', 'exit'),
  },
};

export const slideDownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: createTransition('normal', 'gentle'),
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: createTransition('fast', 'exit'),
  },
};

export const slideLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: createTransition('normal', 'gentle'),
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: createTransition('fast', 'exit'),
  },
};

export const slideRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: createTransition('normal', 'gentle'),
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: createTransition('fast', 'exit'),
  },
};

export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: createTransition('normal', 'gentle'),
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: createTransition('fast', 'exit'),
  },
};

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: createTransition('modal', 'gentle'),
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 5,
    transition: createTransition('fast', 'exit'),
  },
};

export const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: createTransition('modal', 'gentle'),
  },
  exit: {
    opacity: 0,
    transition: createTransition('fast', 'exit'),
  },
};

// Stagger animations for lists
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: createTransition('normal', 'gentle'),
  },
  exit: {
    opacity: 0,
    y: -5,
    transition: createTransition('fast', 'exit'),
  },
};

// Hover and tap animations
export const buttonHover = {
  scale: 1.02,
  transition: createTransition('fast', 'gentle'),
};

export const buttonTap = {
  scale: 0.98,
  transition: createTransition('instant', 'crisp'),
};

export const cardHover = {
  y: -2,
  scale: 1.01,
  transition: createTransition('fast', 'gentle'),
};

export const cardTap = {
  scale: 0.99,
  transition: createTransition('instant', 'crisp'),
};

// Loading animations
export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: THERAPEUTIC_TIMING.loading / 1000,
      repeat: Infinity,
      ease: THERAPEUTIC_EASING.soothing,
    },
  },
};

export const spinVariants: Variants = {
  spin: {
    rotate: 360,
    transition: {
      duration: THERAPEUTIC_TIMING.loading / 1000,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: 10,
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: createTransition('page', 'enter'),
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: createTransition('fast', 'exit'),
  },
};

// Reduced motion variants (fallbacks)
export const reducedMotionVariants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  },
  scale: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  },
  slide: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  },
};

// Animation presets for common use cases
export const ANIMATION_PRESETS = {
  // Gentle fade for content
  contentFade: fadeVariants,
  
  // Slide up for cards and modals
  cardSlideUp: slideUpVariants,
  
  // Scale for buttons and interactive elements
  buttonScale: scaleVariants,
  
  // Modal with backdrop
  modal: {
    backdrop: overlayVariants,
    content: modalVariants,
  },
  
  // Page transitions
  page: pageVariants,
  
  // List animations
  list: {
    container: staggerContainer,
    item: staggerItem,
  },
  
  // Loading states
  loading: {
    pulse: pulseVariants,
    spin: spinVariants,
  },
} as const;

// Animation configuration based on user preferences
export const getAnimationConfig = (reducedMotion: boolean) => {
  if (reducedMotion) {
    return {
      variants: reducedMotionVariants,
      timing: { ...THERAPEUTIC_TIMING, normal: 100, fast: 50, slow: 150 },
      easing: { ...THERAPEUTIC_EASING, gentle: [0, 0, 1, 1] },
    };
  }
  
  return {
    variants: ANIMATION_PRESETS,
    timing: THERAPEUTIC_TIMING,
    easing: THERAPEUTIC_EASING,
  };
};