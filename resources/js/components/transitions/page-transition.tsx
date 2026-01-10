/**
 * Page Transition Component
 * 
 * Provides smooth page transitions with therapeutic timing for SafeSpace
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import { pageVariants, reducedMotionVariants, createTransition } from '@/config/animations';

export type TransitionType = 
  | 'fade' 
  | 'slide' 
  | 'slideUp' 
  | 'slideDown' 
  | 'scale' 
  | 'slideLeft' 
  | 'slideRight'
  | 'none';

interface PageTransitionProps {
  /** Unique key for the page (usually the route path) */
  pageKey: string;
  /** Type of transition animation */
  transitionType?: TransitionType;
  /** Custom transition duration in ms */
  duration?: number;
  /** Whether to show loading state during transition */
  showLoading?: boolean;
  /** Loading component to show */
  loadingComponent?: React.ReactNode;
  /** Children to animate */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

// Transition variants for different animation types
const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
};

export const PageTransition: React.FC<PageTransitionProps> = ({
  pageKey,
  transitionType = 'fade',
  duration,
  showLoading = false,
  loadingComponent,
  children,
  className = '',
}) => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  // Get transition configuration
  const getTransitionConfig = () => {
    if (reducedMotion || transitionType === 'none') {
      return {
        variants: reducedMotionVariants.fade,
        transition: { duration: 0.1 },
      };
    }

    const variants = transitionVariants[transitionType];
    const transitionConfig = createTransition(
      'page', 
      'enter', 
      0
    );

    // Override duration if specified
    if (duration) {
      transitionConfig.duration = duration / 1000;
    }

    return {
      variants,
      transition: transitionConfig,
    };
  };

  const { variants, transition } = getTransitionConfig();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pageKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={transition}
        className={`page-transition ${className}`}
        style={{
          width: '100%',
          minHeight: '100%',
        }}
      >
        {showLoading && loadingComponent ? (
          <div className="page-loading-wrapper">
            {loadingComponent}
            <div style={{ opacity: 0, pointerEvents: 'none' }}>
              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;