/**
 * Animated List Component
 * 
 * Staggered list animations for SafeSpace
 */

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import { staggerContainer, staggerItem, reducedMotionVariants } from '@/config/animations';

interface AnimatedListProps extends Omit<HTMLMotionProps<'div'>, 'variants' | 'initial' | 'animate' | 'exit'> {
  /** Items to render */
  children: React.ReactNode;
  /** Stagger delay between items (in ms) */
  staggerDelay?: number;
  /** Delay before first item animates (in ms) */
  initialDelay?: number;
  /** Whether to animate on mount */
  animateOnMount?: boolean;
  /** Custom container class */
  containerClassName?: string;
  /** Custom item class */
  itemClassName?: string;
}

interface AnimatedListItemProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: React.ReactNode;
}

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({ 
  children, 
  className,
  ...props 
}) => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  const variants = reducedMotion ? reducedMotionVariants.fade : staggerItem;

  return (
    <motion.div
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  staggerDelay = 100,
  initialDelay = 100,
  animateOnMount = true,
  containerClassName,
  itemClassName,
  ...props
}) => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  // Create custom stagger variants with user-defined delays
  const containerVariants = React.useMemo(() => {
    if (reducedMotion) {
      return reducedMotionVariants.fade;
    }

    return {
      ...staggerContainer,
      visible: {
        ...staggerContainer.visible,
        transition: {
          staggerChildren: staggerDelay / 1000,
          delayChildren: initialDelay / 1000,
        },
      },
    };
  }, [staggerDelay, initialDelay, reducedMotion]);

  return (
    <motion.div
      variants={containerVariants}
      initial={animateOnMount ? 'hidden' : false}
      animate={animateOnMount ? 'visible' : undefined}
      exit="exit"
      className={containerClassName}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        // If child is already an AnimatedListItem, return as-is
        if (React.isValidElement(child) && child.type === AnimatedListItem) {
          return child;
        }

        // Wrap other children in AnimatedListItem
        return (
          <AnimatedListItem key={index} className={itemClassName}>
            {child}
          </AnimatedListItem>
        );
      })}
    </motion.div>
  );
};

export default AnimatedList;