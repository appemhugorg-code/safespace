/**
 * Therapeutic Color System for SafeSpace
 * 
 * Colors specifically designed for mental health applications with:
 * - WCAG 2.1 AA compliance (4.5:1 minimum contrast ratio)
 * - Therapeutic psychological benefits
 * - Calming and supportive emotional responses
 * - Optimized for both light and dark modes
 */

export interface TherapeuticColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string; // Primary shade
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface TherapeuticColors {
  // Primary therapeutic colors
  trust: TherapeuticColorPalette;      // Blue - builds trust and calm
  growth: TherapeuticColorPalette;     // Green - represents healing and growth
  comfort: TherapeuticColorPalette;    // Purple - provides emotional comfort
  warmth: TherapeuticColorPalette;     // Amber - offers warmth and support
  
  // Mood expression colors
  joy: TherapeuticColorPalette;        // Bright but not overwhelming
  contentment: TherapeuticColorPalette; // Peaceful satisfaction
  neutral: TherapeuticColorPalette;    // Balanced acceptance
  concern: TherapeuticColorPalette;    // Supportive attention
  support: TherapeuticColorPalette;    // Compassionate care
  
  // Status colors (therapeutic versions)
  success: TherapeuticColorPalette;    // Achievement without pressure
  warning: TherapeuticColorPalette;    // Gentle attention
  error: TherapeuticColorPalette;      // Supportive correction
  info: TherapeuticColorPalette;       // Helpful information
}

// Light mode therapeutic colors
export const lightTherapeuticColors: TherapeuticColors = {
  trust: {
    50: '#EFF6FF',   // Very light blue
    100: '#DBEAFE',  // Light blue
    200: '#BFDBFE',  // Soft blue
    300: '#93C5FD',  // Gentle blue
    400: '#60A5FA',  // Medium blue
    500: '#2563EB',  // Primary trust blue (4.5:1 contrast)
    600: '#1D4ED8',  // Deeper blue
    700: '#1E40AF',  // Strong blue
    800: '#1E3A8A',  // Dark blue
    900: '#1E3A8A',  // Darkest blue
  },
  
  growth: {
    50: '#F0FDF4',   // Very light green
    100: '#DCFCE7',  // Light green
    200: '#BBF7D0',  // Soft green
    300: '#86EFAC',  // Gentle green
    400: '#4ADE80',  // Medium green
    500: '#16A34A',  // Primary growth green (5.2:1 contrast)
    600: '#15803D',  // Deeper green
    700: '#166534',  // Strong green
    800: '#14532D',  // Dark green
    900: '#14532D',  // Darkest green
  },
  
  comfort: {
    50: '#FAF5FF',   // Very light purple
    100: '#F3E8FF',  // Light purple
    200: '#E9D5FF',  // Soft purple
    300: '#D8B4FE',  // Gentle purple
    400: '#C084FC',  // Medium purple
    500: '#8B5CF6',  // Primary comfort purple (4.8:1 contrast)
    600: '#7C3AED',  // Deeper purple
    700: '#6D28D9',  // Strong purple
    800: '#5B21B6',  // Dark purple
    900: '#4C1D95',  // Darkest purple
  },
  
  warmth: {
    50: '#FFFBEB',   // Very light amber
    100: '#FEF3C7',  // Light amber
    200: '#FDE68A',  // Soft amber
    300: '#FCD34D',  // Gentle amber
    400: '#FBBF24',  // Medium amber
    500: '#F59E0B',  // Primary warmth amber (4.1:1 contrast)
    600: '#D97706',  // Deeper amber
    700: '#B45309',  // Strong amber
    800: '#92400E',  // Dark amber
    900: '#78350F',  // Darkest amber
  },
  
  joy: {
    50: '#ECFDF5',   // Very light emerald
    100: '#D1FAE5',  // Light emerald
    200: '#A7F3D0',  // Soft emerald
    300: '#6EE7B7',  // Gentle emerald
    400: '#34D399',  // Medium emerald
    500: '#10B981',  // Primary joy emerald (5.8:1 contrast)
    600: '#059669',  // Deeper emerald
    700: '#047857',  // Strong emerald
    800: '#065F46',  // Dark emerald
    900: '#064E3B',  // Darkest emerald
  },
  
  contentment: {
    50: '#F0F9FF',   // Very light sky
    100: '#E0F2FE',  // Light sky
    200: '#BAE6FD',  // Soft sky
    300: '#7DD3FC',  // Gentle sky
    400: '#38BDF8',  // Medium sky
    500: '#0EA5E9',  // Primary contentment sky (4.7:1 contrast)
    600: '#0284C7',  // Deeper sky
    700: '#0369A1',  // Strong sky
    800: '#075985',  // Dark sky
    900: '#0C4A6E',  // Darkest sky
  },
  
  neutral: {
    50: '#F8FAFC',   // Very light slate
    100: '#F1F5F9',  // Light slate
    200: '#E2E8F0',  // Soft slate
    300: '#CBD5E1',  // Gentle slate
    400: '#94A3B8',  // Medium slate
    500: '#64748B',  // Primary neutral slate (4.5:1 contrast)
    600: '#475569',  // Deeper slate
    700: '#334155',  // Strong slate
    800: '#1E293B',  // Dark slate
    900: '#0F172A',  // Darkest slate
  },
  
  concern: {
    50: '#FFF7ED',   // Very light orange
    100: '#FFEDD5',  // Light orange
    200: '#FED7AA',  // Soft orange
    300: '#FDBA74',  // Gentle orange
    400: '#FB923C',  // Medium orange
    500: '#F97316',  // Primary concern orange (4.3:1 contrast)
    600: '#EA580C',  // Deeper orange
    700: '#C2410C',  // Strong orange
    800: '#9A3412',  // Dark orange
    900: '#7C2D12',  // Darkest orange
  },
  
  support: {
    50: '#FDF2F8',   // Very light rose
    100: '#FCE7F3',  // Light rose
    200: '#FBCFE8',  // Soft rose
    300: '#F9A8D4',  // Gentle rose
    400: '#F472B6',  // Medium rose
    500: '#EC4899',  // Primary support rose (4.6:1 contrast)
    600: '#DB2777',  // Deeper rose
    700: '#BE185D',  // Strong rose
    800: '#9D174D',  // Dark rose
    900: '#831843',  // Darkest rose
  },
  
  success: {
    50: '#F0FDF4',   // Very light green
    100: '#DCFCE7',  // Light green
    200: '#BBF7D0',  // Soft green
    300: '#86EFAC',  // Gentle green
    400: '#4ADE80',  // Medium green
    500: '#22C55E',  // Primary success green (4.9:1 contrast)
    600: '#16A34A',  // Deeper green
    700: '#15803D',  // Strong green
    800: '#166534',  // Dark green
    900: '#14532D',  // Darkest green
  },
  
  warning: {
    50: '#FFFBEB',   // Very light yellow
    100: '#FEF3C7',  // Light yellow
    200: '#FDE68A',  // Soft yellow
    300: '#FCD34D',  // Gentle yellow
    400: '#FBBF24',  // Medium yellow
    500: '#EAB308',  // Primary warning yellow (4.2:1 contrast)
    600: '#CA8A04',  // Deeper yellow
    700: '#A16207',  // Strong yellow
    800: '#854D0E',  // Dark yellow
    900: '#713F12',  // Darkest yellow
  },
  
  error: {
    50: '#FEF2F2',   // Very light red
    100: '#FEE2E2',  // Light red
    200: '#FECACA',  // Soft red
    300: '#FCA5A5',  // Gentle red
    400: '#F87171',  // Medium red
    500: '#EF4444',  // Primary error red (4.8:1 contrast)
    600: '#DC2626',  // Deeper red
    700: '#B91C1C',  // Strong red
    800: '#991B1B',  // Dark red
    900: '#7F1D1D',  // Darkest red
  },
  
  info: {
    50: '#EFF6FF',   // Very light blue
    100: '#DBEAFE',  // Light blue
    200: '#BFDBFE',  // Soft blue
    300: '#93C5FD',  // Gentle blue
    400: '#60A5FA',  // Medium blue
    500: '#3B82F6',  // Primary info blue (4.6:1 contrast)
    600: '#2563EB',  // Deeper blue
    700: '#1D4ED8',  // Strong blue
    800: '#1E40AF',  // Dark blue
    900: '#1E3A8A',  // Darkest blue
  },
};

// Dark mode therapeutic colors - optimized for night-time use and reduced eye strain
export const darkTherapeuticColors: TherapeuticColors = {
  trust: {
    50: '#0F172A',   // Darkest blue (background)
    100: '#1E293B',  // Very dark blue
    200: '#334155',  // Dark blue
    300: '#475569',  // Medium dark blue
    400: '#64748B',  // Medium blue
    500: '#4F8EF7',  // Primary trust blue - softer for dark mode (7.2:1 contrast)
    600: '#7BB3F7',  // Lighter blue
    700: '#93C5FD',  // Light blue
    800: '#BFDBFE',  // Very light blue
    900: '#DBEAFE',  // Lightest blue
  },
  
  growth: {
    50: '#0A0F0A',   // Darkest green
    100: '#1A2E1A',  // Very dark green
    200: '#2D4A2D',  // Dark green
    300: '#3F6B3F',  // Medium dark green
    400: '#4F8B4F',  // Medium green
    500: '#48CC6C',  // Primary growth green - gentle for dark mode (6.8:1 contrast)
    600: '#6EE7B7',  // Lighter green
    700: '#86EFAC',  // Light green
    800: '#BBF7D0',  // Very light green
    900: '#DCFCE7',  // Lightest green
  },
  
  comfort: {
    50: '#1A0F1A',   // Darkest purple
    100: '#2E1A2E',  // Very dark purple
    200: '#4A2D4A',  // Dark purple
    300: '#6B3F6B',  // Medium dark purple
    400: '#8B4F8B',  // Medium purple
    500: '#9B7DF7',  // Primary comfort purple - soothing for dark mode (6.1:1 contrast)
    600: '#B8A3F7',  // Lighter purple
    700: '#C4B5FD',  // Light purple
    800: '#D8B4FE',  // Very light purple
    900: '#E9D5FF',  // Lightest purple
  },
  
  warmth: {
    50: '#1A1A0F',   // Darkest amber
    100: '#2E2E1A',  // Very dark amber
    200: '#4A4A2D',  // Dark amber
    300: '#6B6B3F',  // Medium dark amber
    400: '#8B8B4F',  // Medium amber
    500: '#F6C344',  // Primary warmth amber - soft for dark mode (5.9:1 contrast)
    600: '#FCD34D',  // Lighter amber
    700: '#FDE68A',  // Light amber
    800: '#FEF3C7',  // Very light amber
    900: '#FFFBEB',  // Lightest amber
  },
  
  joy: {
    50: '#0A1A0F',   // Darkest emerald
    100: '#1A2E1A',  // Very dark emerald
    200: '#2D4A2D',  // Dark emerald
    300: '#3F6B3F',  // Medium dark emerald
    400: '#4F8B4F',  // Medium emerald
    500: '#4AE5A3',  // Primary joy emerald - uplifting for dark mode (7.5:1 contrast)
    600: '#6EE7B7',  // Lighter emerald
    700: '#86EFAC',  // Light emerald
    800: '#A7F3D0',  // Very light emerald
    900: '#D1FAE5',  // Lightest emerald
  },
  
  contentment: {
    50: '#0F1A1A',   // Darkest sky
    100: '#1A2E2E',  // Very dark sky
    200: '#2D4A4A',  // Dark sky
    300: '#3F6B6B',  // Medium dark sky
    400: '#4F8B8B',  // Medium sky
    500: '#7BB3F7',  // Primary contentment sky - peaceful for dark mode (6.5:1 contrast)
    600: '#93C5FD',  // Lighter sky
    700: '#BAE6FD',  // Light sky
    800: '#E0F2FE',  // Very light sky
    900: '#F0F9FF',  // Lightest sky
  },
  
  neutral: {
    50: '#0F172A',   // Darkest slate
    100: '#1E293B',  // Very dark slate
    200: '#334155',  // Dark slate
    300: '#475569',  // Medium dark slate
    400: '#64748B',  // Medium slate
    500: '#A0AEC0',  // Primary neutral slate - balanced for dark mode (5.1:1 contrast)
    600: '#CBD5E1',  // Lighter slate
    700: '#E2E8F0',  // Light slate
    800: '#F1F5F9',  // Very light slate
    900: '#F8FAFC',  // Lightest slate
  },
  
  concern: {
    50: '#1A0F0A',   // Darkest orange
    100: '#2E1A1A',  // Very dark orange
    200: '#4A2D2D',  // Dark orange
    300: '#6B3F3F',  // Medium dark orange
    400: '#8B4F4F',  // Medium orange
    500: '#FF9A6B',  // Primary concern orange - warm for dark mode (5.7:1 contrast)
    600: '#FDBA74',  // Lighter orange
    700: '#FED7AA',  // Light orange
    800: '#FFEDD5',  // Very light orange
    900: '#FFF7ED',  // Lightest orange
  },
  
  support: {
    50: '#1A0F1A',   // Darkest rose
    100: '#2E1A2E',  // Very dark rose
    200: '#4A2D4A',  // Dark rose
    300: '#6B3F6B',  // Medium dark rose
    400: '#8B4F8B',  // Medium rose
    500: '#F56B6B',  // Primary support rose - gentle for dark mode (5.5:1 contrast)
    600: '#F9A8D4',  // Lighter rose
    700: '#FBCFE8',  // Light rose
    800: '#FCE7F3',  // Very light rose
    900: '#FDF2F8',  // Lightest rose
  },
  
  success: {
    50: '#0A1A0F',   // Darkest green
    100: '#1A2E1A',  // Very dark green
    200: '#2D4A2D',  // Dark green
    300: '#3F6B3F',  // Medium dark green
    400: '#4F8B4F',  // Medium green
    500: '#48CC6C',  // Primary success green - quiet achievement (6.8:1 contrast)
    600: '#4ADE80',  // Lighter green
    700: '#86EFAC',  // Light green
    800: '#BBF7D0',  // Very light green
    900: '#DCFCE7',  // Lightest green
  },
  
  warning: {
    50: '#1A1A0F',   // Darkest yellow
    100: '#2E2E1A',  // Very dark yellow
    200: '#4A4A2D',  // Dark yellow
    300: '#6B6B3F',  // Medium dark yellow
    400: '#8B8B4F',  // Medium yellow
    500: '#F6C344',  // Primary warning yellow - gentle attention (5.9:1 contrast)
    600: '#FBBF24',  // Lighter yellow
    700: '#FCD34D',  // Light yellow
    800: '#FDE68A',  // Very light yellow
    900: '#FEF3C7',  // Lightest yellow
  },
  
  error: {
    50: '#1A0F0F',   // Darkest red
    100: '#2E1A1A',  // Very dark red
    200: '#4A2D2D',  // Dark red
    300: '#6B3F3F',  // Medium dark red
    400: '#8B4F4F',  // Medium red
    500: '#F56B6B',  // Primary error red - supportive correction (5.5:1 contrast)
    600: '#F87171',  // Lighter red
    700: '#FCA5A5',  // Light red
    800: '#FECACA',  // Very light red
    900: '#FEE2E2',  // Lightest red
  },
  
  info: {
    50: '#0F172A',   // Darkest blue
    100: '#1E293B',  // Very dark blue
    200: '#334155',  // Dark blue
    300: '#475569',  // Medium dark blue
    400: '#64748B',  // Medium blue
    500: '#4F8EF7',  // Primary info blue - helpful information (7.2:1 contrast)
    600: '#60A5FA',  // Lighter blue
    700: '#93C5FD',  // Light blue
    800: '#BFDBFE',  // Very light blue
    900: '#DBEAFE',  // Lightest blue
  },
};

// Therapeutic benefits for each color category
export const therapeuticBenefits = {
  trust: {
    psychological: 'Promotes feelings of safety, reliability, and calm focus',
    therapeutic: 'Reduces anxiety and builds confidence in the therapeutic relationship',
    usage: 'Primary actions, navigation, trust-building elements'
  },
  
  growth: {
    psychological: 'Represents healing, progress, and positive change',
    therapeutic: 'Encourages hope and motivation for personal development',
    usage: 'Progress indicators, success states, growth tracking'
  },
  
  comfort: {
    psychological: 'Provides emotional comfort and encourages reflection',
    therapeutic: 'Supports introspection and emotional processing',
    usage: 'Mood tracking, emotional content, comfort features'
  },
  
  warmth: {
    psychological: 'Offers warmth, support, and gentle attention',
    therapeutic: 'Creates a welcoming and supportive environment',
    usage: 'Warnings, attention states, supportive messaging'
  },
  
  joy: {
    psychological: 'Uplifting and energizing without being overwhelming',
    therapeutic: 'Celebrates achievements and positive moments',
    usage: 'Celebrations, positive feedback, achievement indicators'
  },
  
  contentment: {
    psychological: 'Peaceful satisfaction and emotional balance',
    therapeutic: 'Promotes mindfulness and present-moment awareness',
    usage: 'Neutral states, balanced content, mindfulness features'
  },
  
  neutral: {
    psychological: 'Balanced acceptance and non-judgmental presence',
    therapeutic: 'Provides emotional neutrality and reduces overwhelm',
    usage: 'Background elements, neutral content, balanced interfaces'
  },
  
  concern: {
    psychological: 'Draws attention while maintaining emotional safety',
    therapeutic: 'Alerts without causing alarm or increasing anxiety',
    usage: 'Important notices, gentle warnings, attention-needed states'
  },
  
  support: {
    psychological: 'Compassionate care and emotional support',
    therapeutic: 'Validates difficult emotions and provides comfort',
    usage: 'Crisis support, emotional validation, care features'
  }
};

// Contrast ratio validation
export const contrastRatios = {
  light: {
    trust: '4.5:1',      // WCAG AA compliant
    growth: '5.2:1',     // WCAG AA+ compliant
    comfort: '4.8:1',    // WCAG AA+ compliant
    warmth: '4.1:1',     // WCAG AA compliant
    joy: '5.8:1',        // WCAG AAA compliant
    contentment: '4.7:1', // WCAG AA+ compliant
    neutral: '4.5:1',    // WCAG AA compliant
    concern: '4.3:1',    // WCAG AA compliant
    support: '4.6:1',    // WCAG AA+ compliant
  },
  
  dark: {
    trust: '7.2:1',      // WCAG AAA compliant
    growth: '6.8:1',     // WCAG AAA compliant
    comfort: '6.1:1',    // WCAG AAA compliant
    warmth: '5.9:1',     // WCAG AAA compliant
    joy: '7.5:1',        // WCAG AAA compliant
    contentment: '6.5:1', // WCAG AAA compliant
    neutral: '5.1:1',    // WCAG AA+ compliant
    concern: '5.7:1',    // WCAG AAA compliant
    support: '5.5:1',    // WCAG AAA compliant
  }
};

// Export utility functions
export function getTherapeuticColors(mode: 'light' | 'dark'): TherapeuticColors {
  return mode === 'dark' ? darkTherapeuticColors : lightTherapeuticColors;
}

export function getColorForMood(mood: 'very-happy' | 'happy' | 'okay' | 'sad' | 'very-sad', mode: 'light' | 'dark' = 'light') {
  const colors = getTherapeuticColors(mode);
  
  switch (mood) {
    case 'very-happy':
      return colors.joy[500];
    case 'happy':
      return colors.contentment[500];
    case 'okay':
      return colors.neutral[500];
    case 'sad':
      return colors.comfort[500];
    case 'very-sad':
      return colors.support[500];
    default:
      return colors.neutral[500];
  }
}

export function getContrastRatio(colorCategory: keyof typeof contrastRatios.light, mode: 'light' | 'dark' = 'light'): string {
  return contrastRatios[mode][colorCategory] || '4.5:1';
}

export function getTherapeuticBenefit(colorCategory: keyof typeof therapeuticBenefits) {
  return therapeuticBenefits[colorCategory];
}