import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { themeSyncService } from '@/services/theme-sync-service';
import { enhancedThemePersistence } from '@/services/enhanced-theme-persistence';
import { getTherapeuticColors, lightTherapeuticColors, darkTherapeuticColors } from '@/config/therapeutic-colors';

// Theme configuration types
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface StatusColors {
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface AnimationDurations {
  fast: string;
  normal: string;
  slow: string;
  gentle: string;
  page: string;
  modal: string;
  loading: string;
}

export interface EasingFunctions {
  gentle: string;
  calm: string;
  soothing: string;
  bounce: string;
  crisp: string;
  enter: string;
  exit: string;
}

export interface ThemeConfig {
  mode: ThemeMode;
  colors: {
    primary: ColorPalette;
    secondary: ColorPalette;
    background: ColorPalette;
    surface: ColorPalette;
    text: ColorPalette;
    status: StatusColors;
    therapeutic: typeof lightTherapeuticColors; // Add therapeutic colors
  };
  animations: {
    duration: AnimationDurations;
    easing: EasingFunctions;
    reducedMotion: boolean;
    respectSystemPreference: boolean;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    contrast: 'normal' | 'high' | 'extra-high';
    focusVisible: boolean;
  };
}

// Default theme configuration
const defaultTheme: ThemeConfig = {
  mode: 'auto',
  colors: {
    primary: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#2563EB', // Primary blue
      600: '#1D4ED8',
      700: '#1E40AF',
      800: '#1E3A8A',
      900: '#1E3A8A',
    },
    secondary: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    background: {
      50: '#FFFFFF',
      100: '#F8FAFC',
      200: '#F1F5F9',
      300: '#E2E8F0',
      400: '#CBD5E1',
      500: '#94A3B8',
      600: '#64748B',
      700: '#475569',
      800: '#334155',
      900: '#1E293B',
    },
    surface: {
      50: '#FFFFFF',
      100: '#FEFEFE',
      200: '#FDFDFD',
      300: '#FCFCFC',
      400: '#FAFAFA',
      500: '#F8F8F8',
      600: '#F5F5F5',
      700: '#F0F0F0',
      800: '#EBEBEB',
      900: '#E5E5E5',
    },
    text: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    status: {
      success: '#16A34A',
      warning: '#F59E0B',
      error: '#DC2626',
      info: '#2563EB',
    },
    therapeutic: lightTherapeuticColors,
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      gentle: '800ms',
      page: '400ms',
      modal: '250ms',
      loading: '1200ms',
    },
    easing: {
      gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      calm: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      soothing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      crisp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
      enter: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      exit: 'cubic-bezier(0.4, 0.0, 1, 1)',
    },
    reducedMotion: false,
    respectSystemPreference: true,
  },
  accessibility: {
    fontSize: 'medium',
    contrast: 'normal',
    focusVisible: true,
  },
};

// Dark theme configuration
const darkTheme: ThemeConfig = {
  ...defaultTheme,
  mode: 'dark',
  colors: {
    ...defaultTheme.colors,
    background: {
      50: '#0F172A',
      100: '#1E293B',
      200: '#334155',
      300: '#475569',
      400: '#64748B',
      500: '#94A3B8',
      600: '#CBD5E1',
      700: '#E2E8F0',
      800: '#F1F5F9',
      900: '#F8FAFC',
    },
    surface: {
      50: '#0F172A',
      100: '#1E293B',
      200: '#334155',
      300: '#475569',
      400: '#64748B',
      500: '#94A3B8',
      600: '#CBD5E1',
      700: '#E2E8F0',
      800: '#F1F5F9',
      900: '#F8FAFC',
    },
    text: {
      50: '#0F172A',
      100: '#1E293B',
      200: '#334155',
      300: '#475569',
      400: '#64748B',
      500: '#94A3B8',
      600: '#CBD5E1',
      700: '#E2E8F0',
      800: '#F1F5F9',
      900: '#F8FAFC',
    },
    therapeutic: darkTherapeuticColors,
  },
};

// Theme context
interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: Partial<ThemeConfig>) => void;
  toggleMode: () => void;
  resetTheme: () => void;
  isSystemDark: boolean;
  effectiveMode: 'light' | 'dark';
  syncStatus: {
    isOnline: boolean;
    syncInProgress: boolean;
    queueLength: number;
    lastSyncTimestamp: Date | null;
    isLoading?: boolean;
  };
  forceSyncTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Partial<ThemeConfig>;
  storageKey?: string;
}

export function ThemeProvider({ 
  children, 
  defaultTheme: customDefaultTheme,
  storageKey = 'safespace-theme' 
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeConfig>(() => {
    return { ...defaultTheme, ...customDefaultTheme };
  });

  const [isSystemDark, setIsSystemDark] = useState(false);
  const [syncStatus, setSyncStatus] = useState(themeSyncService.getSyncStatus());
  const [isLoading, setIsLoading] = useState(true);

  // Initialize enhanced persistence on mount
  useEffect(() => {
    const initializePersistence = async () => {
      try {
        // Initialize the enhanced persistence service
        await enhancedThemePersistence.initialize();
        
        // Load theme from persistence layers
        const { theme: persistedTheme, source } = await enhancedThemePersistence.loadTheme();
        
        if (persistedTheme) {
          console.log(`Theme loaded from ${source}`);
          setThemeState(prev => ({ ...prev, ...persistedTheme }));
        } else {
          console.log('No persisted theme found, using defaults');
          // Save default theme to establish persistence
          await enhancedThemePersistence.saveTheme({ ...defaultTheme, ...customDefaultTheme });
        }
      } catch (error) {
        console.error('Failed to initialize theme persistence:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      initializePersistence();
    } else {
      setIsLoading(false);
    }
  }, [customDefaultTheme]);

  // Detect system theme preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsSystemDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsSystemDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Detect reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setThemeState(prev => ({
        ...prev,
        animations: {
          ...prev.animations,
          reducedMotion: e.matches,
        },
      }));
    };

    // Set initial value
    handleChange({ matches: mediaQuery.matches } as MediaQueryListEvent);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Calculate effective theme mode
  const effectiveMode: 'light' | 'dark' = 
    theme.mode === 'auto' ? (isSystemDark ? 'dark' : 'light') : theme.mode;

  // Apply theme to document
  useEffect(() => {
    if (typeof window === 'undefined' || isLoading) return;

    const root = document.documentElement;
    
    // Apply theme mode class
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveMode);

    // Apply custom CSS properties for the current theme
    const currentTheme = effectiveMode === 'dark' ? darkTheme : defaultTheme;
    const mergedTheme = { ...currentTheme, ...theme };

    // Apply color variables
    Object.entries(mergedTheme.colors.primary).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary-${key}`, value);
    });

    // Apply animation variables
    root.style.setProperty('--animation-duration-fast', mergedTheme.animations.duration.fast);
    root.style.setProperty('--animation-duration-normal', mergedTheme.animations.duration.normal);
    root.style.setProperty('--animation-duration-slow', mergedTheme.animations.duration.slow);

    // Apply accessibility settings
    if (mergedTheme.accessibility.fontSize !== 'medium') {
      const fontSizeMap = {
        small: '14px',
        medium: '16px',
        large: '18px',
        'extra-large': '20px',
      };
      root.style.setProperty('--base-font-size', fontSizeMap[mergedTheme.accessibility.fontSize]);
    }

    // Apply high contrast if needed
    if (mergedTheme.accessibility.contrast === 'high') {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply extra high contrast if needed
    if (mergedTheme.accessibility.contrast === 'extra-high') {
      root.classList.add('extra-high-contrast');
    } else {
      root.classList.remove('extra-high-contrast');
    }

    // Apply reduced motion
    if (mergedTheme.animations.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

  }, [theme, effectiveMode, isSystemDark, isLoading]);

  // Enhanced theme persistence - save theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || isLoading) return;
    
    const saveThemeChanges = async () => {
      try {
        // Save to all persistence layers
        const results = await enhancedThemePersistence.saveTheme(theme);
        
        // Sync across tabs
        enhancedThemePersistence.syncAcrossTabs(theme);
        
        // Update sync status
        setSyncStatus(enhancedThemePersistence.getSyncStatus());
        
        console.log('Theme saved to persistence layers:', results);
      } catch (error) {
        console.warn('Failed to save theme changes:', error);
      }
    };

    // Debounce theme saves
    const timeoutId = setTimeout(saveThemeChanges, 500);
    return () => clearTimeout(timeoutId);
  }, [theme, isLoading]);

  // Setup cross-device and cross-tab synchronization listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Handle system theme changes
    const handleSystemThemeChange = (event: CustomEvent) => {
      const { isDark } = event.detail;
      setIsSystemDark(isDark);
    };

    // Handle theme changes from other tabs
    const handleCrossTabSync = (event: CustomEvent) => {
      const { theme: newTheme } = event.detail;
      console.log('Received theme update from another tab');
      setThemeState(prev => ({ ...prev, ...newTheme }));
    };

    // Handle remote theme updates from other devices
    const handleRemoteThemeUpdate = (event: CustomEvent) => {
      const { theme: newTheme } = event.detail;
      console.log('Received theme update from server');
      setThemeState(prev => ({ ...prev, ...newTheme }));
    };

    // Handle periodic sync updates
    const handlePeriodicSync = (event: CustomEvent) => {
      const { theme: newTheme } = event.detail;
      console.log('Received periodic theme sync update');
      setThemeState(prev => ({ ...prev, ...newTheme }));
    };

    // Update sync status periodically
    const updateSyncStatus = () => {
      setSyncStatus(enhancedThemePersistence.getSyncStatus());
    };

    window.addEventListener('systemThemeChange', handleSystemThemeChange as EventListener);
    window.addEventListener('crossTabThemeSync', handleCrossTabSync as EventListener);
    window.addEventListener('remoteThemeUpdate', handleRemoteThemeUpdate as EventListener);
    window.addEventListener('periodicThemeSync', handlePeriodicSync as EventListener);
    
    // Update sync status every 10 seconds
    const statusInterval = setInterval(updateSyncStatus, 10000);

    return () => {
      window.removeEventListener('systemThemeChange', handleSystemThemeChange as EventListener);
      window.removeEventListener('crossTabThemeSync', handleCrossTabSync as EventListener);
      window.removeEventListener('remoteThemeUpdate', handleRemoteThemeUpdate as EventListener);
      window.removeEventListener('periodicThemeSync', handlePeriodicSync as EventListener);
      clearInterval(statusInterval);
    };
  }, []);

  const setTheme = useCallback((newTheme: Partial<ThemeConfig>) => {
    setThemeState(prev => ({ ...prev, ...newTheme }));
  }, []);

  const toggleMode = useCallback(() => {
    setThemeState(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : prev.mode === 'dark' ? 'auto' : 'light',
    }));
  }, []);

  const resetTheme = useCallback(async () => {
    const resetThemeConfig = { ...defaultTheme, ...customDefaultTheme };
    setThemeState(resetThemeConfig);
    
    try {
      // Clear all persisted data and save reset theme
      await enhancedThemePersistence.clearThemeData();
      await enhancedThemePersistence.saveTheme(resetThemeConfig);
      
      // Sync reset across tabs
      enhancedThemePersistence.syncAcrossTabs(resetThemeConfig);
      
      console.log('Theme reset and persisted');
    } catch (error) {
      console.error('Failed to reset theme persistence:', error);
    }
  }, [customDefaultTheme]);

  const forceSyncTheme = useCallback(async () => {
    try {
      // Force sync with server
      await themeSyncService.forceSyncAll();
      
      // Reload theme from server
      const { theme: serverTheme } = await themeSyncService.loadFromServer();
      if (serverTheme) {
        setThemeState(prev => ({ ...prev, ...serverTheme }));
      }
      
      setSyncStatus(enhancedThemePersistence.getSyncStatus());
    } catch (error) {
      console.warn('Failed to force sync theme:', error);
    }
  }, []);

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    toggleMode,
    resetTheme,
    isSystemDark,
    effectiveMode,
    syncStatus: {
      ...syncStatus,
      isLoading,
    },
    forceSyncTheme,
  };

  // Show loading state briefly while initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook for theme-aware styling
export function useThemeStyles() {
  const { theme, effectiveMode } = useTheme();
  
  return {
    mode: effectiveMode,
    colors: theme.colors,
    animations: theme.animations,
    accessibility: theme.accessibility,
    isDark: effectiveMode === 'dark',
    isLight: effectiveMode === 'light',
    reducedMotion: theme.animations.reducedMotion,
  };
}