/**
 * Interactive Card Component
 * 
 * Enhanced card with therapeutic hover effects and state transitions
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import { Card } from '@/components/ui/card';
import { createTransition } from '@/config/animations';

interface InteractiveCardProps extends React.ComponentProps<typeof Card> {
  /** Hover interaction type */
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'tilt' | 'border' | 'none';
  /** Click interaction type */
  clickEffect?: 'press' | 'ripple' | 'bounce' | 'none';
  /** Whether card is selectable */
  selectable?: boolean;
  /** Whether card is selected */
  selected?: boolean;
  /** Selection callback */
  onSelect?: (selected: boolean) => void;
  /** Whether card is loading */
  loading?: boolean;
  /** Loading overlay content */
  loadingContent?: React.ReactNode;
  /** Whether card is disabled */
  disabled?: boolean;
  /** Badge content */
  badge?: React.ReactNode;
  /** Badge position */
  badgePosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Action buttons */
  actions?: React.ReactNode;
  /** Whether to show actions on hover */
  showActionsOnHover?: boolean;
  /** Children */
  children: React.ReactNode;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  hoverEffect = 'lift',
  clickEffect = 'press',
  selectable = false,
  selected = false,
  onSelect,
  loading = false,
  loadingContent,
  disabled = false,
  badge,
  badgePosition = 'top-right',
  actions,
  showActionsOnHover = false,
  children,
  className = '',
  onClick,
  ...props
}) => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Get hover animations
  const getHoverAnimations = () => {
    if (reducedMotion || hoverEffect === 'none' || disabled) {
      return {};
    }

    const baseTransition = createTransition('fast', 'gentle');

    switch (hoverEffect) {
      case 'lift':
        return {
          y: -4,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          transition: baseTransition,
        };

      case 'glow':
        return {
          boxShadow: '0 0 20px rgba(37, 99, 235, 0.2)',
          borderColor: 'rgba(37, 99, 235, 0.3)',
          transition: baseTransition,
        };

      case 'scale':
        return {
          scale: 1.02,
          transition: baseTransition,
        };

      case 'tilt':
        return {
          rotateY: 5,
          rotateX: 2,
          transition: baseTransition,
        };

      case 'border':
        return {
          borderColor: 'rgb(37, 99, 235)',
          borderWidth: '2px',
          transition: baseTransition,
        };

      default:
        return {};
    }
  };

  // Get click animations
  const getClickAnimations = () => {
    if (reducedMotion || clickEffect === 'none' || disabled) {
      return {};
    }

    switch (clickEffect) {
      case 'press':
        return {
          scale: 0.98,
          transition: createTransition('instant', 'crisp'),
        };

      case 'bounce':
        return {
          scale: 0.95,
          transition: { type: 'spring', stiffness: 400, damping: 10 },
        };

      default:
        return {};
    }
  };

  // Handle click with ripple effect
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || loading) return;

    // Handle selection
    if (selectable) {
      onSelect?.(!selected);
    }

    // Create ripple effect
    if (clickEffect === 'ripple' && !reducedMotion) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }

    onClick?.(e);
  };

  // Badge position classes
  const badgePositionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };

  const hoverAnimations = getHoverAnimations();
  const clickAnimations = getClickAnimations();

  return (
    <motion.div
      className={`relative ${disabled ? 'cursor-not-allowed opacity-50' : selectable || onClick ? 'cursor-pointer' : ''}`}
      whileHover={hoverAnimations}
      whileTap={clickAnimations}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <Card
        className={`
          relative overflow-hidden transition-colors duration-200
          ${selected ? 'ring-2 ring-primary ring-offset-2' : ''}
          ${disabled ? 'bg-muted' : ''}
          ${className}
        `}
        {...props}
      >
        {/* Main Content */}
        <div className={loading ? 'opacity-50' : ''}>
          {children}
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={createTransition('fast', 'gentle')}
            >
              {loadingContent || (
                <motion.div
                  className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge */}
        {badge && (
          <motion.div
            className={`absolute ${badgePositionClasses[badgePosition]} z-10`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={createTransition('normal', 'bounce')}
          >
            {badge}
          </motion.div>
        )}

        {/* Actions */}
        {actions && (
          <AnimatePresence>
            {(!showActionsOnHover || isHovered) && (
              <motion.div
                className="absolute top-2 right-2 z-10"
                initial={showActionsOnHover ? { opacity: 0, scale: 0.8 } : {}}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={createTransition('fast', 'gentle')}
              >
                {actions}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Ripple Effects */}
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.div
              key={ripple.id}
              className="absolute pointer-events-none"
              style={{
                left: ripple.x - 20,
                top: ripple.y - 20,
              }}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="w-10 h-10 bg-primary/20 rounded-full" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Selection Indicator */}
        {selectable && (
          <AnimatePresence>
            {selected && (
              <motion.div
                className="absolute top-2 left-2 z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={createTransition('normal', 'bounce')}
              >
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                  ✓
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Hover Overlay */}
        {!reducedMotion && hoverEffect === 'glow' && (
          <AnimatePresence>
            {isHovered && !disabled && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={createTransition('fast', 'gentle')}
              />
            )}
          </AnimatePresence>
        )}
      </Card>
    </motion.div>
  );
};

export default InteractiveCard;