/**
 * Loading Spinner Component
 * 
 * Therapeutic loading animation for page transitions
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import { pulseVariants, spinVariants } from '@/config/animations';

export type LoadingType = 'spinner' | 'pulse' | 'dots' | 'wave';

interface LoadingSpinnerProps {
  /** Type of loading animation */
  type?: LoadingType;
  /** Size of the loading indicator */
  size?: 'sm' | 'md' | 'lg';
  /** Loading message */
  message?: string;
  /** Whether to show the message */
  showMessage?: boolean;
  /** Custom className */
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  type = 'pulse',
  size = 'md',
  message = 'Loading...',
  showMessage = true,
  className = '',
}) => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  // Size configurations
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const containerSizeClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  };

  // Render different loading types
  const renderLoader = () => {
    if (reducedMotion) {
      // Simple static indicator for reduced motion
      return (
        <div className={`${sizeClasses[size]} bg-primary/60 rounded-full`} />
      );
    }

    switch (type) {
      case 'spinner':
        return (
          <motion.div
            className={`${sizeClasses[size]} border-2 border-primary/20 border-t-primary rounded-full`}
            variants={spinVariants}
            animate="spin"
          />
        );

      case 'pulse':
        return (
          <motion.div
            className={`${sizeClasses[size]} bg-primary/60 rounded-full`}
            variants={pulseVariants}
            animate="pulse"
          />
        );

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary/60 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        );

      case 'wave':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-primary/60 rounded-full"
                animate={{
                  height: ['8px', '16px', '8px'],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        );

      default:
        return (
          <motion.div
            className={`${sizeClasses[size]} bg-primary/60 rounded-full`}
            variants={pulseVariants}
            animate="pulse"
          />
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerSizeClasses[size]} ${className}`}>
      {renderLoader()}
      {showMessage && (
        <motion.p
          className="text-sm text-muted-foreground font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;