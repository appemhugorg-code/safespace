/**
 * Interactive Input Component
 * 
 * Enhanced input with therapeutic focus and validation animations
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import { createTransition } from '@/config/animations';

interface InteractiveInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input label */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Input size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether input is loading */
  loading?: boolean;
  /** Icon component */
  icon?: React.ReactNode;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Whether to show character count */
  showCharCount?: boolean;
  /** Maximum character count */
  maxLength?: number;
  /** Focus animation type */
  focusAnimation?: 'glow' | 'lift' | 'scale' | 'border' | 'none';
  /** Validation animation type */
  validationAnimation?: 'shake' | 'bounce' | 'pulse' | 'none';
}

export const InteractiveInput: React.FC<InteractiveInputProps> = ({
  label,
  helperText,
  error,
  success,
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  showCharCount = false,
  maxLength,
  focusAnimation = 'glow',
  validationAnimation = 'shake',
  className = '',
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}) => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const charCount = typeof value === 'string' ? value.length : 0;
  const isOverLimit = maxLength ? charCount > maxLength : false;

  // Size configurations
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  // Focus animations
  const getFocusAnimations = () => {
    if (reducedMotion || focusAnimation === 'none') {
      return {};
    }

    const baseTransition = createTransition('fast', 'gentle');

    switch (focusAnimation) {
      case 'glow':
        return isFocused ? {
          boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
          borderColor: 'rgb(37, 99, 235)',
          transition: baseTransition,
        } : {};

      case 'lift':
        return isFocused ? {
          y: -2,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: baseTransition,
        } : {};

      case 'scale':
        return isFocused ? {
          scale: 1.02,
          transition: baseTransition,
        } : {};

      case 'border':
        return isFocused ? {
          borderWidth: '2px',
          borderColor: 'rgb(37, 99, 235)',
          transition: baseTransition,
        } : {};

      default:
        return {};
    }
  };

  // Validation animations
  const getValidationAnimations = () => {
    if (reducedMotion || validationAnimation === 'none' || !error || !hasInteracted) {
      return {};
    }

    switch (validationAnimation) {
      case 'shake':
        return {
          x: [-5, 5, -5, 5, 0],
          transition: { duration: 0.4 },
        };

      case 'bounce':
        return {
          y: [-2, 2, -2, 2, 0],
          transition: { duration: 0.4, type: 'spring' },
        };

      case 'pulse':
        return {
          scale: [1, 1.02, 1],
          transition: { duration: 0.3 },
        };

      default:
        return {};
    }
  };

  // Handle focus events
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setHasInteracted(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Trigger validation animation when error changes
  useEffect(() => {
    if (error && hasInteracted && inputRef.current) {
      // Trigger animation by updating key
      const input = inputRef.current;
      input.style.animation = 'none';
      input.offsetHeight; // Trigger reflow
      input.style.animation = '';
    }
  }, [error, hasInteracted]);

  const focusAnimations = getFocusAnimations();
  const validationAnimations = getValidationAnimations();

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <motion.label
          className="block text-sm font-medium text-foreground"
          animate={isFocused ? { color: 'rgb(37, 99, 235)' } : {}}
          transition={createTransition('fast', 'gentle')}
        >
          {label}
        </motion.label>
      )}

      {/* Input Container */}
      <motion.div
        className="relative"
        animate={validationAnimations}
      >
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <motion.div
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${iconSizes[size]} text-muted-foreground`}
            animate={isFocused ? { color: 'rgb(37, 99, 235)', scale: 1.1 } : {}}
            transition={createTransition('fast', 'gentle')}
          >
            {icon}
          </motion.div>
        )}

        {/* Input Field */}
        <motion.input
          ref={inputRef}
          className={`
            w-full border border-input bg-background rounded-md
            focus:outline-none focus:ring-0
            disabled:cursor-not-allowed disabled:opacity-50
            transition-colors duration-200
            ${sizeClasses[size]}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${error ? 'border-destructive' : success ? 'border-green-500' : ''}
            ${className}
          `}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          animate={focusAnimations}
          maxLength={maxLength}
          {...props}
        />

        {/* Right Icon or Loading */}
        {((icon && iconPosition === 'right') || loading) && (
          <motion.div
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${iconSizes[size]} text-muted-foreground`}
            animate={isFocused ? { color: 'rgb(37, 99, 235)', scale: 1.1 } : {}}
            transition={createTransition('fast', 'gentle')}
          >
            {loading ? (
              <motion.div
                className="border-2 border-current border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              icon
            )}
          </motion.div>
        )}

        {/* Focus Ring */}
        {!reducedMotion && focusAnimation === 'glow' && (
          <AnimatePresence>
            {isFocused && (
              <motion.div
                className="absolute inset-0 rounded-md border-2 border-primary pointer-events-none"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={createTransition('fast', 'gentle')}
              />
            )}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Helper Text, Error, Success, or Character Count */}
      <div className="flex justify-between items-start">
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              className="text-sm text-destructive flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={createTransition('fast', 'gentle')}
            >
              <motion.span
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                ⚠
              </motion.span>
              {error}
            </motion.p>
          )}
          {success && !error && (
            <motion.p
              key="success"
              className="text-sm text-green-600 flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={createTransition('fast', 'gentle')}
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                ✓
              </motion.span>
              {success}
            </motion.p>
          )}
          {helperText && !error && !success && (
            <motion.p
              key="helper"
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={createTransition('fast', 'gentle')}
            >
              {helperText}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Character Count */}
        {showCharCount && maxLength && (
          <motion.span
            className={`text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}
            animate={isOverLimit ? { color: 'rgb(220, 38, 38)' } : {}}
            transition={createTransition('fast', 'gentle')}
          >
            {charCount}/{maxLength}
          </motion.span>
        )}
      </div>
    </div>
  );
};

export default InteractiveInput;