/**
 * Page Transition Hook
 * 
 * Provides utilities for managing page transitions and loading states
 */

import { useState, useEffect, useCallback } from 'react';
import { usePage } from '@inertiajs/react';
import { useTheme } from '@/contexts/theme-context';
import { TransitionType } from '@/components/transitions/page-transition';

interface PageTransitionState {
  isTransitioning: boolean;
  isLoading: boolean;
  currentRoute: string;
  previousRoute: string | null;
  transitionType: TransitionType;
}

interface UsePageTransitionOptions {
  /** Default transition type */
  defaultTransition?: TransitionType;
  /** Minimum loading time in ms */
  minLoadingTime?: number;
  /** Maximum loading time in ms */
  maxLoadingTime?: number;
  /** Whether to show loading for all transitions */
  alwaysShowLoading?: boolean;
}

export const usePageTransition = (options: UsePageTransitionOptions = {}) => {
  const {
    defaultTransition = 'fade',
    minLoadingTime = 300,
    maxLoadingTime = 5000,
    alwaysShowLoading = false,
  } = options;

  const page = usePage();
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  const [state, setState] = useState<PageTransitionState>({
    isTransitioning: false,
    isLoading: false,
    currentRoute: page.component || 'unknown',
    previousRoute: null,
    transitionType: reducedMotion ? 'none' : defaultTransition,
  });

  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);

  // Update route when page changes
  useEffect(() => {
    const newRoute = page.component || 'unknown';
    
    if (newRoute !== state.currentRoute) {
      setState(prev => ({
        ...prev,
        previousRoute: prev.currentRoute,
        currentRoute: newRoute,
        isTransitioning: true,
      }));
    }
  }, [page.component, state.currentRoute]);

  // Handle loading states
  const startLoading = useCallback((transitionType: TransitionType = defaultTransition) => {
    setLoadingStartTime(Date.now());
    setState(prev => ({
      ...prev,
      isLoading: true,
      isTransitioning: true,
      transitionType: reducedMotion ? 'none' : transitionType,
    }));
  }, [defaultTransition, reducedMotion]);

  const stopLoading = useCallback(() => {
    const now = Date.now();
    const elapsed = loadingStartTime ? now - loadingStartTime : 0;
    const remainingTime = Math.max(0, minLoadingTime - elapsed);

    // Ensure minimum loading time for better UX
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isTransitioning: false,
      }));
      setLoadingStartTime(null);
    }, remainingTime);
  }, [loadingStartTime, minLoadingTime]);

  // Auto-stop loading after max time
  useEffect(() => {
    if (state.isLoading && loadingStartTime) {
      const timeout = setTimeout(() => {
        console.warn('Page transition exceeded maximum loading time');
        stopLoading();
      }, maxLoadingTime);

      return () => clearTimeout(timeout);
    }
  }, [state.isLoading, loadingStartTime, maxLoadingTime, stopLoading]);

  // Transition configuration based on route
  const getTransitionForRoute = useCallback((route: string): TransitionType => {
    if (reducedMotion) return 'none';

    // Route-specific transition logic
    if (route.includes('emergency') || route.includes('panic')) {
      return 'none'; // No animation for emergency routes
    }
    
    if (route.includes('auth') || route.includes('login') || route.includes('register')) {
      return 'slideLeft';
    }
    
    if (route.includes('settings')) {
      return 'slideUp';
    }
    
    if (route.includes('therapy') || route.includes('session')) {
      return 'fade';
    }
    
    if (route.includes('messages') || route.includes('groups')) {
      return 'slide';
    }
    
    if (route.includes('profile')) {
      return 'scale';
    }

    return defaultTransition;
  }, [reducedMotion, defaultTransition]);

  // Navigation helpers
  const navigateWithTransition = useCallback((
    url: string, 
    transitionType?: TransitionType,
    options: { showLoading?: boolean } = {}
  ) => {
    const { showLoading = alwaysShowLoading } = options;
    const finalTransitionType = transitionType || getTransitionForRoute(url);

    if (showLoading) {
      startLoading(finalTransitionType);
    }

    // Use Inertia.js navigation
    window.location.href = url;
  }, [alwaysShowLoading, getTransitionForRoute, startLoading]);

  // Preload route for faster transitions
  const preloadRoute = useCallback(async (route: string) => {
    try {
      // Implement route preloading logic here
      // This could involve prefetching data or components
      console.log(`Preloading route: ${route}`);
    } catch (error) {
      console.warn(`Failed to preload route ${route}:`, error);
    }
  }, []);

  // Get transition duration based on type and theme
  const getTransitionDuration = useCallback((type: TransitionType): number => {
    if (reducedMotion || type === 'none') return 100;

    const durations = {
      fade: 300,
      slide: 300,
      slideUp: 350,
      slideDown: 350,
      slideLeft: 400,
      slideRight: 400,
      scale: 300,
      none: 0,
    };

    return durations[type] || 300;
  }, [reducedMotion]);

  return {
    // State
    ...state,
    
    // Actions
    startLoading,
    stopLoading,
    navigateWithTransition,
    preloadRoute,
    
    // Utilities
    getTransitionForRoute,
    getTransitionDuration,
    
    // Computed values
    shouldShowLoading: state.isLoading || alwaysShowLoading,
    transitionDuration: getTransitionDuration(state.transitionType),
    isReducedMotion: reducedMotion,
  };
};

export default usePageTransition;