/**
 * Animated Card Component
 * 
 * Card with therapeutic hover animations and entrance effects
 */

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import { cardHover, cardTap, fadeVariants, reducedMotionVariants } from '@/config/animations';
import { Card } from '@/components/ui/card';

interface CardProps extends React.ComponentProps<"div"> {
  variant?: 'default' | 'elevated' | 'outlined';
  spacing?: 'compact' | 'comfortable' | 'spacious';
  interactive?: boolean;
  loading?: boolean;
}

interface AnimatedCardProps extends CardProps {
  children: React.ReactNode;
  /** Whether to disable animations */
  disableAnimations?: boolean;
  /** Whether to enable hover animations */
  enableHover?: boolean;
  /** Whether to enable tap animations */
  enableTap?: boolean;
  /** Whether to animate entrance */
  animateEntrance?: boolean;
  /** Entrance animation delay (in ms) */
  entranceDelay?: number;
  /** Custom hover animation */
  customHover?: object;
  /** Custom tap animation */
  customTap?: object;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  disableAnimations = false,
  enableHover = true,
  enableTap = false,
  animateEntrance = true,
  entranceDelay = 0,
  customHover,
  customTap,
  className,
  ...props
}) => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  // Determine if animations should be disabled
  const shouldAnimate = !disableAnimations && !reducedMotion;

  // Create motion variants
  const hoverAnimation = React.useMemo(() => {
    if (!shouldAnimate || !enableHover) return {};
    return customHover || cardHover;
  }, [shouldAnimate, enableHover, customHover]);

  const tapAnimation = React.useMemo(() => {
    if (!shouldAnimate || !enableTap) return {};
    return customTap || cardTap;
  }, [shouldAnimate, enableTap, customTap]);

  // Entrance animation variants
  const entranceVariants = React.useMemo(() => {
    if (!shouldAnimate || !animateEntrance) return undefined;
    
    const variants = reducedMotion ? reducedMotionVariants.fade : fadeVariants;
    
    if (entranceDelay > 0 && variants.visible && typeof variants.visible === 'object') {
      return {
        ...variants,
        visible: {
          ...variants.visible,
          transition: {
            ...(variants.visible.transition as any),
            delay: entranceDelay / 1000,
          },
        },
      };
    }
    
    return variants;
  }, [shouldAnimate, animateEntrance, entranceDelay, reducedMotion]);

  // If animations are disabled, render regular card
  if (!shouldAnimate) {
    return (
      <Card className={className} {...props}>
        {children}
      </Card>
    );
  }

  // Render animated card
  return (
    <motion.div
      variants={entranceVariants}
      initial={animateEntrance ? 'hidden' : false}
      animate={animateEntrance ? 'visible' : undefined}
      whileHover={hoverAnimation as any}
      whileTap={tapAnimation as any}
      style={{ display: 'block' }}
    >
      <Card className={className} {...props}>
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;