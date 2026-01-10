import React, { useEffect, useState } from 'react';
import { ThemeProvider, useTheme } from '@/contexts/theme-context';
import { useThemeIntegration } from '@/hooks/use-theme-integration';
import { ThemeTransition } from '@/components/theme/theme-transition';

interface ThemeIntegrationProps {
  children: React.ReactNode;
  userId?: number;
  initialTheme?: any;
}

/**
 * Component that handles theme integration with the backend
 */
function ThemeIntegrationInner({ children, userId, initialTheme }: ThemeIntegrationProps) {
  const { theme, setTheme } = useTheme();
  const { syncThemeWithServer } = useThemeIntegration();
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user's theme preferences from server on mount
  useEffect(() => {
    const loadUserTheme = async () => {
      if (userId && !initialTheme) {
        try {
          const response = await fetch('/api/user/theme', {
            headers: {
              'Accept': 'application/json',
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setTheme(data.data);
            }
          }
        } catch (error) {
          console.warn('Failed to load user theme preferences:', error);
        }
      } else if (initialTheme) {
        // Use server-provided initial theme
        setTheme(initialTheme);
      }
      
      setIsLoaded(true);
    };

    loadUserTheme();
  }, [userId, initialTheme, setTheme]);

  // Show loading state while theme is being loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-gentle">
          <div className="w-8 h-8 bg-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <ThemeTransition>
      {children}
    </ThemeTransition>
  );
}

/**
 * Main theme integration wrapper
 */
export function ThemeIntegration({ children, userId, initialTheme }: ThemeIntegrationProps) {
  return (
    <ThemeProvider defaultTheme={initialTheme}>
      <ThemeIntegrationInner userId={userId} initialTheme={initialTheme}>
        {children}
      </ThemeIntegrationInner>
    </ThemeProvider>
  );
}

/**
 * Hook to get theme preferences from server
 */
export function useServerTheme() {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await fetch('/api/user/theme', {
          headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setTheme(data.data);
          } else {
            setError(data.error || 'Failed to load theme');
          }
        } else if (response.status === 401) {
          // User not authenticated, use defaults
          const defaultResponse = await fetch('/api/theme/defaults');
          if (defaultResponse.ok) {
            const defaultData = await defaultResponse.json();
            setTheme(defaultData.data);
          }
        } else {
          setError('Failed to load theme preferences');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTheme();
  }, []);

  return { theme, loading, error };
}

/**
 * Component for theme-aware page wrapper
 */
export function ThemeAwarePage({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { effectiveMode, theme } = useTheme();

  const pageClasses = [
    'min-h-screen',
    'bg-background',
    'text-foreground',
    'transition-colors',
    'duration-300',
    effectiveMode === 'dark' ? 'dark' : 'light',
    theme.accessibility.contrast === 'high' ? 'high-contrast' : '',
    theme.animations.reducedMotion ? 'reduce-motion' : '',
    theme.accessibility.focusVisible ? 'focus-enhanced' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={pageClasses}>
      {children}
    </div>
  );
}

/**
 * Server-side theme detection for initial page load
 */
export function getServerSideTheme(userThemePreferences?: any) {
  // This would be called from your Laravel blade templates or Inertia.js
  const defaultTheme = {
    mode: 'auto',
    accessibility: {
      fontSize: 'medium',
      contrast: 'normal',
      focusVisible: true,
    },
    animations: {
      reducedMotion: false,
    },
  };

  if (userThemePreferences) {
    return { ...defaultTheme, ...userThemePreferences };
  }

  return defaultTheme;
}