/**
 * Animated Button Component
 * 
 * Button with therapeutic hover and tap animations
 */

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import { buttonHover, buttonTap } from '@/config/animations';
import { Button } from '@/components/ui/button';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

interface AnimatedButtonProps extends Omit<ButtonProps, 'asChild'> {
  /** Whether to disable animations */
  disableAnimations?: boolean;
  /** Custom hover animation */
  customHover?: object;
  /** Custom tap animation */
  customTap?: object;
  /** Animation duration override */
  animationDuration?: number;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  disableAnimations = false,
  customHover,
  customTap,
  animationDuration,
  className,
  ...props
}) => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  // Determine if animations should be disabled
  const shouldAnimate = !disableAnimations && !reducedMotion;

  // Create motion variants
  const hoverAnimation = React.useMemo(() => {
    if (!shouldAnimate) return {};
    
    const baseHover = customHover || buttonHover;
    
    if (animationDuration && typeof baseHover === 'object' && 'transition' in baseHover) {
      return {
        ...baseHover,
        transition: {
          ...(baseHover.transition as any),
          duration: animationDuration / 1000,
        },
      };
    }
    
    return baseHover;
  }, [shouldAnimate, customHover, animationDuration]);

  const tapAnimation = React.useMemo(() => {
    if (!shouldAnimate) return {};
    
    const baseTap = customTap || buttonTap;
    
    if (animationDuration && typeof baseTap === 'object' && 'transition' in baseTap) {
      return {
        ...baseTap,
        transition: {
          ...(baseTap.transition as any),
          duration: animationDuration / 1000,
        },
      };
    }
    
    return baseTap;
  }, [shouldAnimate, customTap, animationDuration]);

  // If animations are disabled, render regular button
  if (!shouldAnimate) {
    return (
      <Button className={className} {...props}>
        {children}
      </Button>
    );
  }

  // Render animated button
  return (
    <motion.div
      whileHover={hoverAnimation as any}
      whileTap={tapAnimation as any}
      style={{ display: 'inline-block' }}
    >
      <Button className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;