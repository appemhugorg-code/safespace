/**
 * Animated Container Component
 * 
 * Reusable container with therapeutic animations for SafeSpace
 */

import React from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import { 
  fadeVariants, 
  slideUpVariants, 
  slideDownVariants, 
  slideLeftVariants, 
  slideRightVariants, 
  scaleVariants,
  reducedMotionVariants,
  ANIMATION_PRESETS 
} from '@/config/animations';

type AnimationType = 
  | 'fade' 
  | 'slideUp' 
  | 'slideDown' 
  | 'slideLeft' 
  | 'slideRight' 
  | 'scale'
  | 'none';

interface AnimatedContainerProps extends Omit<HTMLMotionProps<'div'>, 'variants' | 'initial' | 'animate' | 'exit'> {
  /** Animation type to use */
  animation?: AnimationType;
  /** Custom variants (overrides animation prop) */
  variants?: Variants;
  /** Delay before animation starts (in ms) */
  delay?: number;
  /** Whether to animate on mount */
  animateOnMount?: boolean;
  /** Whether to animate on exit */
  animateOnExit?: boolean;
  /** Custom initial state */
  initial?: string | boolean;
  /** Custom animate state */
  animate?: string;
  /** Custom exit state */
  exit?: string;
  /** Children to render */
  children: React.ReactNode;
}

const animationVariants: Record<AnimationType, Variants | undefined> = {
  fade: fadeVariants,
  slideUp: slideUpVariants,
  slideDown: slideDownVariants,
  slideLeft: slideLeftVariants,
  slideRight: slideRightVariants,
  scale: scaleVariants,
  none: undefined,
};

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  animation = 'fade',
  variants: customVariants,
  delay = 0,
  animateOnMount = true,
  animateOnExit = true,
  initial = 'hidden',
  animate = 'visible',
  exit = 'exit',
  children,
  ...props
}) => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  // Get the appropriate variants
  const getVariants = (): Variants | undefined => {
    if (customVariants) return customVariants;
    if (animation === 'none') return undefined;
    
    if (reducedMotion) {
      return reducedMotionVariants[animation as keyof typeof reducedMotionVariants] || reducedMotionVariants.fade;
    }
    
    return animationVariants[animation];
  };

  const variants = getVariants();

  // Apply delay to variants if specified
  const variantsWithDelay = React.useMemo(() => {
    if (!variants || delay === 0) return variants;
    
    const delayedVariants = { ...variants };
    if (delayedVariants.visible && typeof delayedVariants.visible === 'object') {
      delayedVariants.visible = {
        ...delayedVariants.visible,
        transition: {
          ...(delayedVariants.visible.transition || {}),
          delay: delay / 1000,
        },
      };
    }
    
    return delayedVariants;
  }, [variants, delay]);

  // If no animation or reduced motion with no variants, render as regular div
  if (!variants) {
    return <div {...(props as any)}>{children}</div>;
  }

  return (
    <motion.div
      variants={variantsWithDelay}
      initial={animateOnMount ? initial : false}
      animate={animateOnMount ? animate : undefined}
      exit={animateOnExit ? exit : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;