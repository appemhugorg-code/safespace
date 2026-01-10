/**
 * Transition Provider Component
 * 
 * Global provider for managing page transitions throughout the app
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { useTheme } from '@/contexts/theme-context';
import { TransitionType } from './page-transition';
import LoadingSpinner from './loading-spinner';

interface TransitionContextType {
  /** Current transition state */
  isTransitioning: boolean;
  /** Current loading state */
  isLoading: boolean;
  /** Current route name */
  currentRoute: string;
  /** Previous route name */
  previousRoute: string | null;
  /** Current transition type */
  transitionType: TransitionType;
  /** Start a transition */
  startTransition: (type?: TransitionType) => void;
  /** End a transition */
  endTransition: () => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Get transition config for route */
  getRouteTransition: (route: string) => TransitionType;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

interface TransitionProviderProps {
  children: React.ReactNode;
  /** Global loading component */
  loadingComponent?: React.ReactNode;
  /** Whether to show global loading overlay */
  showGlobalLoading?: boolean;
}

export const TransitionProvider: React.FC<TransitionProviderProps> = ({
  children,
  loadingComponent,
  showGlobalLoading = false,
}) => {
  const page = usePage();
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(page.component || 'unknown');
  const [previousRoute, setPreviousRoute] = useState<string | null>(null);
  const [transitionType, setTransitionType] = useState<TransitionType>('fade');

  // Update route when page changes
  useEffect(() => {
    const newRoute = page.component || 'unknown';
    
    if (newRoute !== currentRoute) {
      setPreviousRoute(currentRoute);
      setCurrentRoute(newRoute);
      setIsTransitioning(true);
      
      // Auto-end transition after a delay
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [page.component, currentRoute]);

  // Get transition type for route
  const getRouteTransition = (route: string): TransitionType => {
    if (reducedMotion) return 'none';

    // Emergency routes - no animation for urgency
    if (route.includes('emergency') || route.includes('panic')) {
      return 'none';
    }
    
    // Authentication routes
    if (route.includes('auth') || route.includes('login') || route.includes('register')) {
      return 'slideLeft';
    }
    
    // Settings routes
    if (route.includes('settings')) {
      return 'slideUp';
    }
    
    // Therapy/session routes - calming
    if (route.includes('therapy') || route.includes('session')) {
      return 'fade';
    }
    
    // Communication routes
    if (route.includes('messages') || route.includes('groups')) {
      return 'slide';
    }
    
    // Profile routes
    if (route.includes('profile')) {
      return 'scale';
    }
    
    // Articles/resources
    if (route.includes('articles') || route.includes('resources')) {
      return 'slideUp';
    }

    // Default
    return 'fade';
  };

  const startTransition = (type?: TransitionType) => {
    const finalType = type || getRouteTransition(currentRoute);
    setTransitionType(finalType);
    setIsTransitioning(true);
  };

  const endTransition = () => {
    setIsTransitioning(false);
  };

  const setLoadingState = (loading: boolean) => {
    setIsLoading(loading);
  };

  const contextValue: TransitionContextType = {
    isTransitioning,
    isLoading,
    currentRoute,
    previousRoute,
    transitionType,
    startTransition,
    endTransition,
    setLoading: setLoadingState,
    getRouteTransition,
  };

  return (
    <TransitionContext.Provider value={contextValue}>
      {children}
      
      {/* Global loading overlay */}
      {showGlobalLoading && isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          {loadingComponent || (
            <LoadingSpinner 
              type="pulse" 
              size="lg" 
              message="Loading..." 
            />
          )}
        </div>
      )}
    </TransitionContext.Provider>
  );
};

/**
 * Hook to use transition context
 */
export const useTransition = (): TransitionContextType => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};

export default TransitionProvider;