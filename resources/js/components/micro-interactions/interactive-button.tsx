/**
 * Interactive Button Component
 * 
 * Enhanced button with therapeutic micro-interactions
 */

import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import { Button } from '@/components/ui/button';
import { createTransition } from '@/config/animations';

interface InteractiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /** Button size */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Interaction type */
  interaction?: 'gentle' | 'bounce' | 'pulse' | 'glow' | 'lift' | 'none';
  /** Whether button is loading */
  loading?: boolean;
  /** Loading text */
  loadingText?: string;
  /** Success state */
  success?: boolean;
  /** Success text */
  successText?: string;
  /** Error state */
  error?: boolean;
  /** Error text */
  errorText?: string;
  /** Icon component */
  icon?: React.ReactNode;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Children */
  children: React.ReactNode;
}

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  variant = 'default',
  size = 'default',
  interaction = 'gentle',
  loading = false,
  loadingText = 'Loading...',
  success = false,
  successText = 'Success!',
  error = false,
  errorText = 'Error',
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  // Get interaction animations
  const getInteractionAnimations = () => {
    if (reducedMotion || interaction === 'none') {
      return {
        whileHover: {},
        whileTap: {},
        animate: {},
      };
    }

    const baseTransition = createTransition('fast', 'gentle');

    switch (interaction) {
      case 'gentle':
        return {
          whileHover: {
            scale: 1.02,
            y: -1,
            transition: baseTransition,
          },
          whileTap: {
            scale: 0.98,
            y: 0,
            transition: createTransition('instant', 'crisp'),
          },
        };

      case 'bounce':
        return {
          whileHover: {
            scale: 1.05,
            transition: { ...baseTransition, type: 'spring', stiffness: 400 },
          },
          whileTap: {
            scale: 0.95,
            transition: createTransition('instant', 'bounce'),
          },
        };

      case 'pulse':
        return {
          whileHover: {
            scale: [1, 1.02, 1],
            transition: {
              duration: 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          },
          whileTap: {
            scale: 0.98,
            transition: createTransition('instant', 'crisp'),
          },
        };

      case 'glow':
        return {
          whileHover: {
            boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)',
            transition: baseTransition,
          },
          whileTap: {
            boxShadow: '0 0 10px rgba(37, 99, 235, 0.2)',
            scale: 0.98,
            transition: createTransition('instant', 'crisp'),
          },
        };

      case 'lift':
        return {
          whileHover: {
            y: -3,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            transition: baseTransition,
          },
          whileTap: {
            y: -1,
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
            transition: createTransition('instant', 'crisp'),
          },
        };

      default:
        return {
          whileHover: {},
          whileTap: {},
        };
    }
  };

  // Get current state content
  const getCurrentContent = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-2">
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          {loadingText}
        </div>
      );
    }

    if (success) {
      return (
        <motion.div
          className="flex items-center gap-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={createTransition('normal', 'gentle')}
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
          >
            ✓
          </motion.span>
          {successText}
        </motion.div>
      );
    }

    if (error) {
      return (
        <motion.div
          className="flex items-center gap-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={createTransition('normal', 'gentle')}
        >
          <motion.span
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            ⚠
          </motion.span>
          {errorText}
        </motion.div>
      );
    }

    // Default content with icon
    if (icon) {
      const iconElement = (
        <motion.span
          className="inline-flex"
          whileHover={{ scale: 1.1 }}
          transition={createTransition('fast', 'gentle')}
        >
          {icon}
        </motion.span>
      );

      return (
        <div className="flex items-center gap-2">
          {iconPosition === 'left' && iconElement}
          {children}
          {iconPosition === 'right' && iconElement}
        </div>
      );
    }

    return children;
  };

  const animations = getInteractionAnimations();
  const isDisabled = disabled || loading;

  return (
    <motion.div
      className="inline-block"
      {...animations}
      style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
    >
      <Button
        variant={error ? 'destructive' : success ? 'default' : variant}
        size={size}
        disabled={isDisabled}
        className={`transition-colors duration-200 ${className}`}
        {...props}
      >
        {getCurrentContent()}
      </Button>
    </motion.div>
  );
};

export default InteractiveButton;