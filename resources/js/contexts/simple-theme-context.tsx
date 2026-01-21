import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Simple theme configuration types
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface SimpleThemeConfig {
  mode: ThemeMode;
}

interface SimpleThemeContextType {
  theme: SimpleThemeConfig;
  setTheme: (theme: Partial<SimpleThemeConfig>) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const SimpleThemeContext = createContext<SimpleThemeContextType | undefined>(undefined);

interface SimpleThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Partial<SimpleThemeConfig>;
  storageKey?: string;
}

const defaultTheme: SimpleThemeConfig = {
  mode: 'light',
};

export function SimpleThemeProvider({ 
  children, 
  defaultTheme: customDefaultTheme,
  storageKey = 'safespace-theme' 
}: SimpleThemeProviderProps) {
  const [theme, setThemeState] = useState<SimpleThemeConfig>(() => {
    // Try to load from localStorage immediately (synchronous)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsedTheme = JSON.parse(stored);
          return { ...defaultTheme, ...customDefaultTheme, ...parsedTheme };
        }
      } catch (error) {
        console.warn('Failed to load theme from localStorage:', error);
      }
    }
    return { ...defaultTheme, ...customDefaultTheme };
  });

  const [isSystemDark, setIsSystemDark] = useState(false);

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

  // Calculate if dark mode should be active
  const isDark = theme.mode === 'dark' || (theme.mode === 'auto' && isSystemDark);

  // Apply theme to document
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Save theme to localStorage when it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(theme));
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [theme, storageKey]);

  const setTheme = (newTheme: Partial<SimpleThemeConfig>) => {
    setThemeState(prev => ({ ...prev, ...newTheme }));
  };

  const toggleTheme = () => {
    setTheme({ mode: isDark ? 'light' : 'dark' });
  };

  const contextValue: SimpleThemeContextType = {
    theme,
    setTheme,
    isDark,
    toggleTheme,
  };

  return (
    <SimpleThemeContext.Provider value={contextValue}>
      {children}
    </SimpleThemeContext.Provider>
  );
}

export function useSimpleTheme() {
  const context = useContext(SimpleThemeContext);
  if (context === undefined) {
    throw new Error('useSimpleTheme must be used within a SimpleThemeProvider');
  }
  return context;
}