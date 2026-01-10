/**
 * Animation Hooks for SafeSpace
 * 
 * Provides easy access to therapeutic animations with reduced motion support
 */

import { useCallback, useMemo } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { 
  THERAPEUTIC_TIMING, 
  THERAPEUTIC_EASING, 
  ANIMATION_PRESETS,
  reducedMotionVariants,
  createTransition,
  getAnimationConfig
} from '@/config/animations';
import { Variants, Transition } from 'framer-motion';

/**
 * Hook for accessing animation configuration
 */
export const useAnimationConfig = () => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  return useMemo(() => getAnimationConfig(reducedMotion), [reducedMotion]);
};

/**
 * Hook for creating custom transitions with therapeutic timing
 */
export const useTransition = () => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  return useCallback((
    duration: keyof typeof THERAPEUTIC_TIMING,
    easing: keyof typeof THERAPEUTIC_EASING = 'gentle',
    delay = 0
  ): Transition => {
    if (reducedMotion) {
      return {
        duration: 0.1,
        ease: 'linear',
        delay: 0,
      };
    }
    
    return createTransition(duration, easing, delay);
  }, [reducedMotion]);
};

/**
 * Hook for getting animation variants with reduced motion support
 */
export const useAnimationVariants = () => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  return useMemo(() => {
    if (reducedMotion) {
      return reducedMotionVariants;
    }
    
    return ANIMATION_PRESETS;
  }, [reducedMotion]);
};

/**
 * Hook for conditional animations based on user preferences
 */
export const useConditionalAnimation = () => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  return useCallback(<T extends object>(
    animation: T,
    fallback: T | null = null
  ): T | null => {
    if (reducedMotion) {
      return fallback;
    }
    
    return animation;
  }, [reducedMotion]);
};

/**
 * Hook for stagger animations with therapeutic timing
 */
export const useStaggerAnimation = () => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  return useCallback((
    itemCount: number,
    staggerDelay = 100,
    initialDelay = 100
  ) => {
    if (reducedMotion) {
      return {
        container: reducedMotionVariants.fade,
        item: reducedMotionVariants.fade,
      };
    }

    const containerVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay / 1000,
          delayChildren: initialDelay / 1000,
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

    const itemVariants: Variants = {
      hidden: { opacity: 0, y: 10 },
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

    return {
      container: containerVariants,
      item: itemVariants,
    };
  }, [reducedMotion]);
};

/**
 * Hook for page transition animations
 */
export const usePageTransition = () => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  return useMemo(() => {
    if (reducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.1 } },
        exit: { opacity: 0, transition: { duration: 0.1 } },
      };
    }

    return ANIMATION_PRESETS.page;
  }, [reducedMotion]);
};

/**
 * Hook for modal animations
 */
export const useModalAnimation = () => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  return useMemo(() => {
    if (reducedMotion) {
      return {
        backdrop: reducedMotionVariants.fade,
        content: reducedMotionVariants.fade,
      };
    }

    return ANIMATION_PRESETS.modal;
  }, [reducedMotion]);
};

/**
 * Hook for loading animations
 */
export const useLoadingAnimation = () => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  return useMemo(() => {
    if (reducedMotion) {
      return {
        pulse: { opacity: [0.5, 1, 0.5], transition: { duration: 0.5, repeat: Infinity } },
        spin: { opacity: 1 }, // No spinning in reduced motion
      };
    }

    return ANIMATION_PRESETS.loading;
  }, [reducedMotion]);
};

/**
 * Hook for hover and tap animations
 */
export const useInteractionAnimations = () => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  return useMemo(() => {
    if (reducedMotion) {
      return {
        buttonHover: {},
        buttonTap: {},
        cardHover: {},
        cardTap: {},
      };
    }

    return {
      buttonHover: {
        scale: 1.02,
        transition: createTransition('fast', 'gentle'),
      },
      buttonTap: {
        scale: 0.98,
        transition: createTransition('instant', 'crisp'),
      },
      cardHover: {
        y: -2,
        scale: 1.01,
        transition: createTransition('fast', 'gentle'),
      },
      cardTap: {
        scale: 0.99,
        transition: createTransition('instant', 'crisp'),
      },
    };
  }, [reducedMotion]);
};

/**
 * Hook for checking if animations should be enabled
 */
export const useAnimationsEnabled = () => {
  const { theme } = useTheme();
  return !theme.animations?.reducedMotion;
};

/**
 * Hook for getting therapeutic timing values
 */
export const useTherapeuticTiming = () => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  return useMemo(() => {
    if (reducedMotion) {
      return {
        instant: 0,
        fast: 50,
        normal: 100,
        slow: 150,
        gentle: 200,
        page: 100,
        modal: 100,
        loading: 500,
      };
    }

    return THERAPEUTIC_TIMING;
  }, [reducedMotion]);
};

/**
 * Hook for creating custom animation variants
 */
export const useCustomVariants = () => {
  const createTransitionFn = useTransition();

  return useCallback((
    hiddenState: object,
    visibleState: object,
    exitState?: object,
    duration: keyof typeof THERAPEUTIC_TIMING = 'normal',
    easing: keyof typeof THERAPEUTIC_EASING = 'gentle'
  ): Variants => {
    const transition = createTransitionFn(duration, easing);

    const variants: Variants = {
      hidden: hiddenState as any,
      visible: {
        ...visibleState,
        transition,
      } as any,
    };

    if (exitState) {
      variants.exit = {
        ...exitState,
        transition: createTransitionFn('fast', 'exit'),
      } as any;
    }

    return variants;
  }, [createTransitionFn]);
};