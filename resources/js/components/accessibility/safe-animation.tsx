/**
 * Safe Animation Component
 * 
 * Animation wrapper that automatically provides reduced motion fallbacks
 */

import React from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { useReducedMotionContext } from './reduced-motion-provider';

interface SafeAnimationProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  /** Animation variants */
  variants?: Variants;
  /** Fallback variants for reduced motion */
  fallbackVariants?: Variants;
  /** Animation type for reduced motion handling */
  animationType?: 'essential' | 'decorative' | 'feedback';
  /** Whether to render as motion.div or regular div */
  forceStatic?: boolean;
  /** Custom element type */
  as?: keyof HTMLElementTagNameMap;
  /** Children */
  children: React.ReactNode;
}

export const SafeAnimation: React.FC<SafeAnimationProps> = ({
  variants,
  fallbackVariants,
  animationType = 'decorative',
  forceStatic = false,
  as = 'div',
  children,
  initial,
  animate,
  exit,
  transition,
  whileHover,
  whileTap,
  whileFocus,
  ...props
}) => {
  const { 
    reducedMotion, 
    getSafeAnimationProps, 
    getSafeTransitionDuration,
    shouldAnimate 
  } = useReducedMotionContext();

  // Determine if we should animate
  const canAnimate = shouldAnimate(animationType) && !forceStatic;

  // Get safe variants
  const getSafeVariants = () => {
    if (!reducedMotion && variants) {
      return variants;
    }

    if (fallbackVariants) {
      return fallbackVariants;
    }

    // Default reduced motion variants
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.1 } },
      exit: { opacity: 0, transition: { duration: 0.1 } },
    };
  };

  // Get safe animation props
  const getSafeProps = () => {
    const baseProps = {
      initial,
      animate,
      exit,
      transition: transition ? {
        ...transition,
        duration: getSafeTransitionDuration(
          typeof transition === 'object' && 'duration' in transition 
            ? (transition.duration as number) * 1000 
            : 300
        ) / 1000,
      } : undefined,
      whileHover: reducedMotion ? {} : whileHover,
      whileTap: reducedMotion ? {} : whileTap,
      whileFocus: reducedMotion ? {} : whileFocus,
    };

    return getSafeAnimationProps(baseProps);
  };

  // If animations are completely disabled or forced static, render regular element
  if (!canAnimate || forceStatic) {
    const Element = as;
    return <Element {...(props as any)}>{children}</Element>;
  }

  // Render motion component with safe props
  const MotionComponent = motion[as] as any;
  const safeVariants = getSafeVariants();
  const safeProps = getSafeProps();

  return (
    <MotionComponent
      variants={safeVariants}
      {...safeProps}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

export default SafeAnimation;