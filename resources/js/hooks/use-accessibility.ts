import { useState, useEffect, useCallback } from 'react';
import { useUserPreferences } from '@/hooks/use-user-preferences';

export interface AccessibilitySettings {
  font_size: 'small' | 'medium' | 'large' | 'extra-large';
  contrast_level: 'normal' | 'high' | 'extra-high';
  reduced_motion: boolean;
  screen_reader_optimized: boolean;
  keyboard_navigation: boolean;
  high_contrast_focus: boolean;
  large_click_targets: boolean;
  simplified_interface: boolean;
  audio_descriptions: boolean;
  captions_enabled: boolean;
  zoom_level: number;
}

export interface UseAccessibilityReturn {
  settings: AccessibilitySettings;
  isLoading: boolean;
  updateSetting: (key: keyof AccessibilitySettings, value: any) => Promise<boolean>;
  applySettings: (settings: AccessibilitySettings) => void;
  getAccessibilityScore: () => number;
  checkCompliance: () => {
    wcag_aa: boolean;
    wcag_aaa: boolean;
    issues: string[];
    recommendations: string[];
  };
  announceToScreenReader: (message: string) => void;
}

const defaultSettings: AccessibilitySettings = {
  font_size: 'medium',
  contrast_level: 'normal',
  reduced_motion: false,
  screen_reader_optimized: false,
  keyboard_navigation: false,
  high_contrast_focus: false,
  large_click_targets: false,
  simplified_interface: false,
  audio_descriptions: false,
  captions_enabled: false,
  zoom_level: 100,
};

export function useAccessibility(): UseAccessibilityReturn {
  const { preferences, updatePreferences, loading } = useUserPreferences();
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Initialize settings from preferences
  useEffect(() => {
    if (preferences?.accessibility) {
      const accessibilitySettings = {
        ...defaultSettings,
        ...preferences.accessibility,
      };
      setSettings(accessibilitySettings);
      applySettings(accessibilitySettings);
    }
  }, [preferences]);

  // Apply settings to DOM
  const applySettings = useCallback((accessibilitySettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '22px',
    };
    root.style.setProperty('--base-font-size', fontSizeMap[accessibilitySettings.font_size]);
    
    // Contrast level
    root.setAttribute('data-contrast', accessibilitySettings.contrast_level);
    
    // Reduced motion
    root.setAttribute('data-reduced-motion', accessibilitySettings.reduced_motion.toString());
    
    // High contrast focus
    root.setAttribute('data-high-contrast-focus', accessibilitySettings.high_contrast_focus.toString());
    
    // Large click targets
    root.setAttribute('data-large-targets', accessibilitySettings.large_click_targets.toString());
    
    // Simplified interface
    root.setAttribute('data-simplified', accessibilitySettings.simplified_interface.toString());
    
    // Screen reader optimized
    root.setAttribute('data-screen-reader', accessibilitySettings.screen_reader_optimized.toString());
    
    // Keyboard navigation
    root.setAttribute('data-keyboard-nav', accessibilitySettings.keyboard_navigation.toString());
    
    // Zoom level
    root.style.setProperty('--zoom-level', `${accessibilitySettings.zoom_level}%`);
    
    // Audio descriptions
    root.setAttribute('data-audio-descriptions', accessibilitySettings.audio_descriptions.toString());
    
    // Captions
    root.setAttribute('data-captions', accessibilitySettings.captions_enabled.toString());

    // Apply CSS classes for better styling control
    const classes = [
      `font-size-${accessibilitySettings.font_size}`,
      `contrast-${accessibilitySettings.contrast_level}`,
      accessibilitySettings.reduced_motion && 'reduced-motion',
      accessibilitySettings.high_contrast_focus && 'high-contrast-focus',
      accessibilitySettings.large_click_targets && 'large-targets',
      accessibilitySettings.simplified_interface && 'simplified',
      accessibilitySettings.screen_reader_optimized && 'screen-reader-optimized',
      accessibilitySettings.keyboard_navigation && 'keyboard-navigation',
    ].filter(Boolean);

    // Remove existing accessibility classes
    root.className = root.className.replace(/\b(font-size-\w+|contrast-\w+|reduced-motion|high-contrast-focus|large-targets|simplified|screen-reader-optimized|keyboard-navigation)\b/g, '');
    
    // Add new classes
    root.classList.add(...classes);
  }, []);

  // Update individual setting
  const updateSetting = useCallback(async (
    key: keyof AccessibilitySettings, 
    value: any
  ): Promise<boolean> => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Apply immediately for better UX
    applySettings(newSettings);
    
    // Save to preferences
    const success = await updatePreferences({
      accessibility: newSettings,
    });
    
    return success;
  }, [settings, updatePreferences, applySettings]);

  // Calculate accessibility score
  const getAccessibilityScore = useCallback((): number => {
    const weights = {
      font_size: settings.font_size !== 'small' ? 15 : 0,
      contrast_level: settings.contrast_level !== 'normal' ? 20 : 0,
      reduced_motion: settings.reduced_motion ? 10 : 0,
      screen_reader_optimized: settings.screen_reader_optimized ? 20 : 0,
      keyboard_navigation: settings.keyboard_navigation ? 15 : 0,
      high_contrast_focus: settings.high_contrast_focus ? 10 : 0,
      large_click_targets: settings.large_click_targets ? 5 : 0,
      simplified_interface: settings.simplified_interface ? 5 : 0,
      audio_descriptions: settings.audio_descriptions ? 5 : 0,
      captions_enabled: settings.captions_enabled ? 5 : 0,
    };
    
    const totalScore = Object.values(weights).reduce((sum, score) => sum + score, 0);
    return Math.min(100, totalScore);
  }, [settings]);

  // Check WCAG compliance
  const checkCompliance = useCallback(() => {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // WCAG AA requirements
    let wcagAA = true;
    
    if (settings.contrast_level === 'normal') {
      issues.push('Consider using higher contrast for better readability');
      recommendations.push('Enable high or extra-high contrast mode');
      wcagAA = false;
    }
    
    if (!settings.keyboard_navigation) {
      issues.push('Keyboard navigation is not enabled');
      recommendations.push('Enable keyboard navigation for better accessibility');
      wcagAA = false;
    }
    
    if (settings.font_size === 'small') {
      issues.push('Font size may be too small for some users');
      recommendations.push('Consider using medium or larger font size');
    }
    
    // WCAG AAA requirements (stricter)
    let wcagAAA = wcagAA;
    
    if (!settings.screen_reader_optimized) {
      recommendations.push('Enable screen reader optimization for better assistive technology support');
      wcagAAA = false;
    }
    
    if (!settings.reduced_motion) {
      recommendations.push('Consider enabling reduced motion if animations cause discomfort');
    }
    
    if (!settings.high_contrast_focus) {
      recommendations.push('Enable high contrast focus indicators for better visibility');
      wcagAAA = false;
    }
    
    return {
      wcag_aa: wcagAA,
      wcag_aaa: wcagAAA,
      issues,
      recommendations,
    };
  }, [settings]);

  // Announce to screen reader
  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  // Set up keyboard event listeners
  useEffect(() => {
    if (!settings.keyboard_navigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + M: Open main menu
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        const menuButton = document.querySelector('[data-menu-trigger]') as HTMLElement;
        if (menuButton) {
          menuButton.click();
          announceToScreenReader('Main menu opened');
        }
      }
      
      // Alt + S: Skip to main content
      if (event.altKey && event.key === 's') {
        event.preventDefault();
        const mainContent = document.querySelector('main') as HTMLElement;
        if (mainContent) {
          mainContent.focus();
          announceToScreenReader('Skipped to main content');
        }
      }
      
      // Escape: Close modals/dropdowns
      if (event.key === 'Escape') {
        const openModal = document.querySelector('[data-modal][data-state="open"]') as HTMLElement;
        const openDropdown = document.querySelector('[data-dropdown][data-state="open"]') as HTMLElement;
        
        if (openModal) {
          const closeButton = openModal.querySelector('[data-close]') as HTMLElement;
          if (closeButton) {
            closeButton.click();
            announceToScreenReader('Modal closed');
          }
        } else if (openDropdown) {
          const trigger = document.querySelector(`[data-dropdown-trigger="${openDropdown.id}"]`) as HTMLElement;
          if (trigger) {
            trigger.click();
            announceToScreenReader('Dropdown closed');
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboard_navigation, announceToScreenReader]);

  // Set up focus management
  useEffect(() => {
    if (!settings.high_contrast_focus) return;

    const style = document.createElement('style');
    style.textContent = `
      [data-high-contrast-focus="true"] *:focus {
        outline: 3px solid #0066cc !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 5px rgba(0, 102, 204, 0.3) !important;
      }
    `;
    
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [settings.high_contrast_focus]);

  return {
    settings,
    isLoading: loading,
    updateSetting,
    applySettings,
    getAccessibilityScore,
    checkCompliance,
    announceToScreenReader,
  };
}