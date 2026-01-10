/**
 * Micro-interactions Hook
 * 
 * Provides utilities for managing micro-interactions and feedback
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { createTransition } from '@/config/animations';

interface MicroInteractionState {
  isHovered: boolean;
  isPressed: boolean;
  isFocused: boolean;
  isLoading: boolean;
  hasError: boolean;
  hasSuccess: boolean;
}

interface UseMicroInteractionsOptions {
  /** Whether interactions are disabled */
  disabled?: boolean;
  /** Interaction type */
  type?: 'button' | 'input' | 'card' | 'custom';
  /** Haptic feedback (for supported devices) */
  hapticFeedback?: boolean;
  /** Sound feedback */
  soundFeedback?: boolean;
  /** Animation duration override */
  duration?: number;
}

export const useMicroInteractions = (options: UseMicroInteractionsOptions = {}) => {
  const {
    disabled = false,
    type = 'custom',
    hapticFeedback = false,
    soundFeedback = false,
    duration,
  } = options;

  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;
  const elementRef = useRef<HTMLElement>(null);

  const [state, setState] = useState<MicroInteractionState>({
    isHovered: false,
    isPressed: false,
    isFocused: false,
    isLoading: false,
    hasError: false,
    hasSuccess: false,
  });

  // Haptic feedback (if supported)
  const triggerHaptic = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!hapticFeedback || disabled) return;

    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
      };
      navigator.vibrate(patterns[intensity]);
    }
  }, [hapticFeedback, disabled]);

  // Sound feedback (if enabled)
  const triggerSound = useCallback((soundType: 'click' | 'hover' | 'success' | 'error') => {
    if (!soundFeedback || disabled) return;

    // Create audio context for sound feedback
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const frequencies = {
        click: 800,
        hover: 600,
        success: 1000,
        error: 400,
      };

      oscillator.frequency.setValueAtTime(frequencies[soundType], audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Silently fail if audio context is not supported
    }
  }, [soundFeedback, disabled]);

  // Event handlers
  const handleMouseEnter = useCallback(() => {
    if (disabled) return;
    setState(prev => ({ ...prev, isHovered: true }));
    triggerHaptic('light');
    triggerSound('hover');
  }, [disabled, triggerHaptic, triggerSound]);

  const handleMouseLeave = useCallback(() => {
    setState(prev => ({ ...prev, isHovered: false, isPressed: false }));
  }, []);

  const handleMouseDown = useCallback(() => {
    if (disabled) return;
    setState(prev => ({ ...prev, isPressed: true }));
    triggerHaptic('medium');
  }, [disabled, triggerHaptic]);

  const handleMouseUp = useCallback(() => {
    setState(prev => ({ ...prev, isPressed: false }));
  }, []);

  const handleClick = useCallback(() => {
    if (disabled) return;
    triggerHaptic('medium');
    triggerSound('click');
  }, [disabled, triggerHaptic, triggerSound]);

  const handleFocus = useCallback(() => {
    if (disabled) return;
    setState(prev => ({ ...prev, isFocused: true }));
  }, [disabled]);

  const handleBlur = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: false }));
  }, []);

  // State setters
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: boolean) => {
    setState(prev => ({ ...prev, hasError: error, hasSuccess: false }));
    if (error) {
      triggerHaptic('heavy');
      triggerSound('error');
    }
  }, [triggerHaptic, triggerSound]);

  const setSuccess = useCallback((success: boolean) => {
    setState(prev => ({ ...prev, hasSuccess: success, hasError: false }));
    if (success) {
      triggerHaptic('medium');
      triggerSound('success');
    }
  }, [triggerHaptic, triggerSound]);

  // Get animation styles based on state and type
  const getAnimationStyles = useCallback(() => {
    if (reducedMotion || disabled) {
      return {};
    }

    const baseTransition = createTransition('fast', 'gentle');
    if (duration) {
      baseTransition.duration = duration / 1000;
    }

    const styles: any = {
      transition: baseTransition,
    };

    // Apply hover effects
    if (state.isHovered) {
      switch (type) {
        case 'button':
          styles.scale = 1.02;
          styles.y = -1;
          break;
        case 'card':
          styles.y = -4;
          styles.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
          break;
        case 'input':
          styles.borderColor = 'rgb(37, 99, 235)';
          styles.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
          break;
      }
    }

    // Apply pressed effects
    if (state.isPressed) {
      styles.scale = 0.98;
      styles.y = 0;
    }

    // Apply focus effects
    if (state.isFocused && type === 'input') {
      styles.borderColor = 'rgb(37, 99, 235)';
      styles.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
    }

    // Apply loading effects
    if (state.isLoading) {
      styles.opacity = 0.7;
      styles.cursor = 'wait';
    }

    // Apply error effects
    if (state.hasError) {
      styles.borderColor = 'rgb(220, 38, 38)';
      styles.x = [-2, 2, -2, 2, 0]; // Shake animation
    }

    // Apply success effects
    if (state.hasSuccess) {
      styles.borderColor = 'rgb(34, 197, 94)';
      styles.scale = [1, 1.02, 1]; // Pulse animation
    }

    return styles;
  }, [reducedMotion, disabled, state, type, duration]);

  // Event listeners object
  const eventListeners = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onClick: handleClick,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  return {
    // State
    ...state,
    
    // Refs
    elementRef,
    
    // Actions
    setLoading,
    setError,
    setSuccess,
    triggerHaptic,
    triggerSound,
    
    // Event handlers
    eventListeners,
    
    // Styles
    animationStyles: getAnimationStyles(),
    
    // Utilities
    isInteractive: !disabled && !state.isLoading,
    shouldAnimate: !reducedMotion && !disabled,
  };
};

export default useMicroInteractions;