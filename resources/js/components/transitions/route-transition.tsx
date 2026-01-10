/**
 * Route Transition Component
 * 
 * Handles route-based page transitions with configuration per route
 */

import React from 'react';
import { usePage } from '@inertiajs/react';
import PageTransition, { TransitionType } from './page-transition';
import LoadingSpinner from './loading-spinner';

// Route-specific transition configurations
const routeTransitions: Record<string, {
  type: TransitionType;
  duration?: number;
  showLoading?: boolean;
}> = {
  // Dashboard routes - gentle fade
  'dashboard.*': {
    type: 'fade',
    duration: 300,
    showLoading: false,
  },
  
  // Authentication routes - slide from right
  'login': {
    type: 'slideLeft',
    duration: 400,
    showLoading: false,
  },
  'register': {
    type: 'slideLeft',
    duration: 400,
    showLoading: false,
  },
  
  // Settings routes - slide up
  'settings.*': {
    type: 'slideUp',
    duration: 350,
    showLoading: false,
  },
  
  // Therapy/session routes - calming fade
  'therapy.*': {
    type: 'fade',
    duration: 500,
    showLoading: true,
  },
  'sessions.*': {
    type: 'fade',
    duration: 500,
    showLoading: true,
  },
  
  // Messages/communication - slide
  'messages.*': {
    type: 'slide',
    duration: 300,
    showLoading: false,
  },
  'groups.*': {
    type: 'slide',
    duration: 300,
    showLoading: false,
  },
  
  // Emergency routes - immediate (no animation for urgency)
  'emergency.*': {
    type: 'none',
    duration: 0,
    showLoading: false,
  },
  'panic.*': {
    type: 'none',
    duration: 0,
    showLoading: false,
  },
  
  // Articles/resources - gentle slide up
  'articles.*': {
    type: 'slideUp',
    duration: 350,
    showLoading: false,
  },
  'resources.*': {
    type: 'slideUp',
    duration: 350,
    showLoading: false,
  },
  
  // Profile routes - scale
  'profile.*': {
    type: 'scale',
    duration: 300,
    showLoading: false,
  },
  
  // Default fallback
  '*': {
    type: 'fade',
    duration: 300,
    showLoading: false,
  },
};

interface RouteTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Get transition configuration for a route
 */
const getRouteTransition = (routeName: string) => {
  // Try exact match first
  if (routeTransitions[routeName]) {
    return routeTransitions[routeName];
  }
  
  // Try wildcard matches
  for (const [pattern, config] of Object.entries(routeTransitions)) {
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      if (routeName.startsWith(prefix)) {
        return config;
      }
    }
  }
  
  // Return default
  return routeTransitions['*'];
};

export const RouteTransition: React.FC<RouteTransitionProps> = ({
  children,
  className,
}) => {
  const page = usePage();
  const routeName = page.component || 'unknown';
  const pageKey = page.url || routeName;
  
  const transitionConfig = getRouteTransition(routeName);
  
  return (
    <PageTransition
      pageKey={pageKey}
      transitionType={transitionConfig.type}
      duration={transitionConfig.duration}
      showLoading={transitionConfig.showLoading}
      loadingComponent={<LoadingSpinner />}
      className={className}
    >
      {children}
    </PageTransition>
  );
};

/**
 * Hook to get current route transition configuration
 */
export const useRouteTransition = () => {
  const page = usePage();
  const routeName = page.component || 'unknown';
  
  return getRouteTransition(routeName);
};

/**
 * Update route transition configuration
 */
export const updateRouteTransition = (
  route: string, 
  config: {
    type: TransitionType;
    duration?: number;
    showLoading?: boolean;
  }
) => {
  routeTransitions[route] = config;
};

export default RouteTransition;