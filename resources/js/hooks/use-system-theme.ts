import { useState, useEffect, useCallback } from 'react';

interface SystemThemeInfo {
  isDark: boolean;
  isSupported: boolean;
  lastChanged: Date | null;
}

interface SystemThemePreferences {
  colorScheme: 'light' | 'dark' | 'no-preference';
  reducedMotion: boolean;
  highContrast: boolean;
  forcedColors: boolean;
}

/**
 * Hook for detecting and monitoring system theme preferences
 */
export function useSystemTheme() {
  const [themeInfo, setThemeInfo] = useState<SystemThemeInfo>(() => {
    if (typeof window === 'undefined') {
      return { isDark: false, isSupported: false, lastChanged: null };
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return {
      isDark: mediaQuery.matches,
      isSupported: true,
      lastChanged: new Date(),
    };
  });

  const [preferences, setPreferences] = useState<SystemThemePreferences>(() => {
    if (typeof window === 'undefined') {
      return {
        colorScheme: 'no-preference',
        reducedMotion: false,
        highContrast: false,
        forcedColors: false,
      };
    }

    return {
      colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : window.matchMedia('(prefers-color-scheme: light)').matches 
        ? 'light' 
        : 'no-preference',
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      forcedColors: window.matchMedia('(forced-colors: active)').matches,
    };
  });

  // Update theme info when system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const lightModeQuery = window.matchMedia('(prefers-color-scheme: light)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const forcedColorsQuery = window.matchMedia('(forced-colors: active)');

    const updateThemeInfo = () => {
      setThemeInfo({
        isDark: darkModeQuery.matches,
        isSupported: true,
        lastChanged: new Date(),
      });

      setPreferences({
        colorScheme: darkModeQuery.matches 
          ? 'dark' 
          : lightModeQuery.matches 
          ? 'light' 
          : 'no-preference',
        reducedMotion: reducedMotionQuery.matches,
        highContrast: highContrastQuery.matches,
        forcedColors: forcedColorsQuery.matches,
      });
    };

    // Set up listeners
    darkModeQuery.addEventListener('change', updateThemeInfo);
    lightModeQuery.addEventListener('change', updateThemeInfo);
    reducedMotionQuery.addEventListener('change', updateThemeInfo);
    highContrastQuery.addEventListener('change', updateThemeInfo);
    forcedColorsQuery.addEventListener('change', updateThemeInfo);

    return () => {
      darkModeQuery.removeEventListener('change', updateThemeInfo);
      lightModeQuery.removeEventListener('change', updateThemeInfo);
      reducedMotionQuery.removeEventListener('change', updateThemeInfo);
      highContrastQuery.removeEventListener('change', updateThemeInfo);
      forcedColorsQuery.removeEventListener('change', updateThemeInfo);
    };
  }, []);

  // Force check system preferences
  const checkSystemPreferences = useCallback(() => {
    if (typeof window === 'undefined') return;

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const lightModeQuery = window.matchMedia('(prefers-color-scheme: light)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const forcedColorsQuery = window.matchMedia('(forced-colors: active)');

    setThemeInfo({
      isDark: darkModeQuery.matches,
      isSupported: true,
      lastChanged: new Date(),
    });

    setPreferences({
      colorScheme: darkModeQuery.matches 
        ? 'dark' 
        : lightModeQuery.matches 
        ? 'light' 
        : 'no-preference',
      reducedMotion: reducedMotionQuery.matches,
      highContrast: highContrastQuery.matches,
      forcedColors: forcedColorsQuery.matches,
    });
  }, []);

  return {
    ...themeInfo,
    preferences,
    checkSystemPreferences,
  };
}

/**
 * Hook for system theme change notifications
 */
export function useSystemThemeNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'theme-change' | 'accessibility-change';
    message: string;
    timestamp: Date;
  }>>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleSystemThemeChange = (event: CustomEvent) => {
      const { isDark, timestamp } = event.detail;
      
      setNotifications(prev => [...prev, {
        id: `theme-${timestamp.getTime()}`,
        type: 'theme-change',
        message: `System theme changed to ${isDark ? 'dark' : 'light'} mode`,
        timestamp,
      }]);
    };

    window.addEventListener('systemThemeChange', handleSystemThemeChange as EventListener);

    return () => {
      window.removeEventListener('systemThemeChange', handleSystemThemeChange as EventListener);
    };
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    notifications,
    clearNotifications,
    removeNotification,
  };
}

/**
 * Hook for adaptive theme suggestions based on time and system preferences
 */
export function useAdaptiveThemeSupport() {
  const { isDark, preferences } = useSystemTheme();
  const [suggestions, setSuggestions] = useState<Array<{
    type: 'time-based' | 'accessibility' | 'battery';
    message: string;
    action?: () => void;
  }>>([]);

  useEffect(() => {
    const newSuggestions = [];

    // Time-based suggestions
    const hour = new Date().getHours();
    if (hour >= 20 || hour <= 6) {
      if (!isDark) {
        newSuggestions.push({
          type: 'time-based',
          message: 'Consider switching to dark mode for better evening viewing',
        });
      }
    } else if (hour >= 7 && hour <= 19) {
      if (isDark) {
        newSuggestions.push({
          type: 'time-based',
          message: 'Light mode might be more comfortable during daytime',
        });
      }
    }

    // Accessibility suggestions
    if (preferences.reducedMotion) {
      newSuggestions.push({
        type: 'accessibility',
        message: 'Reduced motion preference detected - animations are minimized',
      });
    }

    if (preferences.highContrast) {
      newSuggestions.push({
        type: 'accessibility',
        message: 'High contrast mode available for better visibility',
      });
    }

    // Battery-based suggestions (if supported)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        if (battery.level < 0.2 && !isDark) {
          newSuggestions.push({
            type: 'battery',
            message: 'Dark mode can help conserve battery on OLED displays',
          });
        }
      }).catch(() => {
        // Battery API not supported or failed
      });
    }

    setSuggestions(newSuggestions);
  }, [isDark, preferences]);

  return { suggestions };
}