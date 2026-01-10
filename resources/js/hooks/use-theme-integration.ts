import { useEffect, useCallback } from 'react';
import { useTheme } from '@/contexts/theme-context';

/**
 * Hook for integrating theme with external services and APIs
 */
export function useThemeIntegration() {
  const { theme, effectiveMode } = useTheme();

  // Sync theme with server/API
  const syncThemeWithServer = useCallback(async () => {
    try {
      // Only sync if user is authenticated
      const response = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          theme_preferences: {
            mode: theme.mode,
            accessibility: theme.accessibility,
            animations: theme.animations,
          },
        }),
      });

      if (!response.ok) {
        console.warn('Failed to sync theme preferences with server');
      }
    } catch (error) {
      console.warn('Error syncing theme preferences:', error);
    }
  }, [theme]);

  // Debounced sync to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(syncThemeWithServer, 1000);
    return () => clearTimeout(timeoutId);
  }, [syncThemeWithServer]);

  return {
    syncThemeWithServer,
    effectiveMode,
    theme,
  };
}

/**
 * Hook for theme-aware component styling
 */
export function useThemeAwareStyles() {
  const { effectiveMode, theme } = useTheme();

  const getThemeClasses = useCallback((baseClasses: string = '') => {
    const classes = [baseClasses];

    // Add theme mode class
    classes.push(effectiveMode === 'dark' ? 'dark-mode' : 'light-mode');

    // Add accessibility classes
    if (theme.accessibility.contrast === 'high') {
      classes.push('high-contrast');
    }

    if (theme.accessibility.focusVisible) {
      classes.push('focus-enhanced');
    }

    // Add animation classes
    if (theme.animations.reducedMotion) {
      classes.push('reduce-motion');
    }

    // Add font size class
    if (theme.accessibility.fontSize !== 'medium') {
      classes.push(`font-size-${theme.accessibility.fontSize}`);
    }

    return classes.filter(Boolean).join(' ');
  }, [effectiveMode, theme]);

  const getThemeStyles = useCallback(() => {
    return {
      '--theme-mode': effectiveMode,
      '--animation-duration': theme.animations.reducedMotion ? '0ms' : theme.animations.duration.normal,
      '--base-font-size': theme.accessibility.fontSize === 'small' ? '14px' :
                          theme.accessibility.fontSize === 'large' ? '18px' :
                          theme.accessibility.fontSize === 'extra-large' ? '20px' : '16px',
    } as React.CSSProperties;
  }, [effectiveMode, theme]);

  return {
    getThemeClasses,
    getThemeStyles,
    isDark: effectiveMode === 'dark',
    isLight: effectiveMode === 'light',
    reducedMotion: theme.animations.reducedMotion,
    highContrast: theme.accessibility.contrast === 'high',
  };
}

/**
 * Hook for managing theme persistence across sessions
 */
export function useThemePersistence() {
  const { theme, setTheme } = useTheme();

  const exportTheme = useCallback(() => {
    return JSON.stringify(theme, null, 2);
  }, [theme]);

  const importTheme = useCallback((themeJson: string) => {
    try {
      const importedTheme = JSON.parse(themeJson);
      setTheme(importedTheme);
      return true;
    } catch (error) {
      console.error('Failed to import theme:', error);
      return false;
    }
  }, [setTheme]);

  const shareTheme = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SafeSpace Theme Configuration',
          text: 'Check out my SafeSpace theme configuration!',
          url: `data:application/json,${encodeURIComponent(exportTheme())}`,
        });
      } catch (error) {
        console.log('Error sharing theme:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(exportTheme());
        return true;
      } catch (error) {
        console.error('Failed to copy theme to clipboard:', error);
        return false;
      }
    }
  }, [exportTheme]);

  return {
    exportTheme,
    importTheme,
    shareTheme,
  };
}

/**
 * Hook for theme-based conditional rendering
 */
export function useThemeConditionals() {
  const { effectiveMode, theme } = useTheme();

  return {
    // Mode conditionals
    ifLight: (content: React.ReactNode) => effectiveMode === 'light' ? content : null,
    ifDark: (content: React.ReactNode) => effectiveMode === 'dark' ? content : null,
    
    // Accessibility conditionals
    ifHighContrast: (content: React.ReactNode) => theme.accessibility.contrast === 'high' ? content : null,
    ifReducedMotion: (content: React.ReactNode) => theme.animations.reducedMotion ? content : null,
    ifEnhancedFocus: (content: React.ReactNode) => theme.accessibility.focusVisible ? content : null,
    
    // Font size conditionals
    ifLargeFont: (content: React.ReactNode) => 
      ['large', 'extra-large'].includes(theme.accessibility.fontSize) ? content : null,
    ifSmallFont: (content: React.ReactNode) => theme.accessibility.fontSize === 'small' ? content : null,
  };
}