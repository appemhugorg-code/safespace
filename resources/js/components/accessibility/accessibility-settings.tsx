import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { useToast } from '@/hooks/use-toast';
import { 
  Eye, 
  Type, 
  Keyboard, 
  Volume2, 
  MousePointer, 
  Contrast,
  ZoomIn,
  Settings,
  Check,
  RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AccessibilitySettingsProps {
  className?: string;
}

export function AccessibilitySettings({ className = '' }: AccessibilitySettingsProps) {
  const { preferences, updatePreferences, loading } = useUserPreferences();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState({
    font_size: 'medium' as 'small' | 'medium' | 'large' | 'extra-large',
    contrast_level: 'normal' as 'normal' | 'high' | 'extra-high',
    reduced_motion: false,
    screen_reader_optimized: false,
    keyboard_navigation: false,
    high_contrast_focus: false,
    large_click_targets: false,
    simplified_interface: false,
    audio_descriptions: false,
    captions_enabled: false,
    zoom_level: 100,
  });

  // Initialize local settings from preferences
  useEffect(() => {
    if (preferences?.accessibility) {
      setLocalSettings(prev => ({
        ...prev,
        ...preferences.accessibility,
        zoom_level: preferences.accessibility.zoom_level || 100,
        high_contrast_focus: preferences.accessibility.high_contrast_focus || false,
        large_click_targets: preferences.accessibility.large_click_targets || false,
        simplified_interface: preferences.accessibility.simplified_interface || false,
        audio_descriptions: preferences.accessibility.audio_descriptions || false,
        captions_enabled: preferences.accessibility.captions_enabled || false,
      }));
    }
  }, [preferences]);

  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    const success = await updatePreferences({
      accessibility: localSettings,
    });

    if (success) {
      toast({
        title: 'Settings Saved',
        description: 'Your accessibility preferences have been updated.',
      });
      
      // Apply settings to document
      applyAccessibilitySettings(localSettings);
    } else {
      toast({
        title: 'Save Failed',
        description: 'Failed to save accessibility settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const resetToDefaults = () => {
    const defaults = {
      font_size: 'medium' as const,
      contrast_level: 'normal' as const,
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
    
    setLocalSettings(defaults);
    applyAccessibilitySettings(defaults);
  };

  const applyAccessibilitySettings = (settings: typeof localSettings) => {
    const root = document.documentElement;
    
    // Font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '22px',
    };
    root.style.setProperty('--base-font-size', fontSizeMap[settings.font_size]);
    
    // Contrast level
    root.setAttribute('data-contrast', settings.contrast_level);
    
    // Reduced motion
    root.setAttribute('data-reduced-motion', settings.reduced_motion.toString());
    
    // High contrast focus
    root.setAttribute('data-high-contrast-focus', settings.high_contrast_focus.toString());
    
    // Large click targets
    root.setAttribute('data-large-targets', settings.large_click_targets.toString());
    
    // Simplified interface
    root.setAttribute('data-simplified', settings.simplified_interface.toString());
    
    // Zoom level
    root.style.setProperty('--zoom-level', `${settings.zoom_level}%`);
  };

  const getFontSizePreview = () => {
    const sizeMap = {
      small: 'Aa',
      medium: 'Aa',
      large: 'Aa',
      'extra-large': 'Aa',
    };
    return sizeMap[localSettings.font_size];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center space-x-2">
          <Eye className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900">Accessibility Settings</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Customize SafeSpace to work better for your specific needs. These settings help ensure 
          everyone can use the platform comfortably and effectively.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Type className="h-5 w-5 text-blue-500" />
                <span>Visual & Display</span>
              </CardTitle>
              <CardDescription>
                Adjust text size, contrast, and visual elements for better readability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Font Size */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Font Size</Label>
                <Select
                  value={localSettings.font_size}
                  onValueChange={(value) => handleSettingChange('font_size', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (14px)</SelectItem>
                    <SelectItem value="medium">Medium (16px)</SelectItem>
                    <SelectItem value="large">Large (18px)</SelectItem>
                    <SelectItem value="extra-large">Extra Large (22px)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div 
                    className="font-medium"
                    style={{ 
                      fontSize: {
                        small: '14px',
                        medium: '16px', 
                        large: '18px',
                        'extra-large': '22px'
                      }[localSettings.font_size]
                    }}
                  >
                    Sample text preview
                  </div>
                </div>
              </div>

              {/* Contrast Level */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Contrast Level</Label>
                <Select
                  value={localSettings.contrast_level}
                  onValueChange={(value) => handleSettingChange('contrast_level', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High Contrast</SelectItem>
                    <SelectItem value="extra-high">Extra High Contrast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Zoom Level */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Zoom Level: {localSettings.zoom_level}%
                </Label>
                <Slider
                  value={[localSettings.zoom_level]}
                  onValueChange={([value]) => handleSettingChange('zoom_level', value)}
                  min={75}
                  max={200}
                  step={25}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>75%</span>
                  <span>100%</span>
                  <span>200%</span>
                </div>
              </div>

              {/* Visual Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Reduced Motion</Label>
                    <p className="text-xs text-gray-500">
                      Minimize animations and transitions
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.reduced_motion}
                    onCheckedChange={(checked) => handleSettingChange('reduced_motion', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">High Contrast Focus</Label>
                    <p className="text-xs text-gray-500">
                      Enhanced focus indicators for better visibility
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.high_contrast_focus}
                    onCheckedChange={(checked) => handleSettingChange('high_contrast_focus', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Large Click Targets</Label>
                    <p className="text-xs text-gray-500">
                      Increase button and link sizes for easier clicking
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.large_click_targets}
                    onCheckedChange={(checked) => handleSettingChange('large_click_targets', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation & Interaction */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Keyboard className="h-5 w-5 text-green-500" />
                <span>Navigation & Interaction</span>
              </CardTitle>
              <CardDescription>
                Configure keyboard navigation and interaction preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Keyboard Navigation</Label>
                    <p className="text-xs text-gray-500">
                      Enhanced keyboard shortcuts and navigation
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.keyboard_navigation}
                    onCheckedChange={(checked) => handleSettingChange('keyboard_navigation', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Screen Reader Optimized</Label>
                    <p className="text-xs text-gray-500">
                      Enhanced compatibility with screen readers
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.screen_reader_optimized}
                    onCheckedChange={(checked) => handleSettingChange('screen_reader_optimized', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Simplified Interface</Label>
                    <p className="text-xs text-gray-500">
                      Reduce visual complexity and distractions
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.simplified_interface}
                    onCheckedChange={(checked) => handleSettingChange('simplified_interface', checked)}
                  />
                </div>
              </div>

              {/* Keyboard Shortcuts Info */}
              {localSettings.keyboard_navigation && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Keyboard Shortcuts</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div>• <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Tab</kbd> - Navigate forward</div>
                    <div>• <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Shift+Tab</kbd> - Navigate backward</div>
                    <div>• <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Enter</kbd> - Activate buttons/links</div>
                    <div>• <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Esc</kbd> - Close modals/menus</div>
                    <div>• <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Alt+M</kbd> - Open main menu</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Audio & Media */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Volume2 className="h-5 w-5 text-purple-500" />
                <span>Audio & Media</span>
              </CardTitle>
              <CardDescription>
                Configure audio descriptions and caption preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Audio Descriptions</Label>
                  <p className="text-xs text-gray-500">
                    Enable audio descriptions for visual content
                  </p>
                </div>
                <Switch
                  checked={localSettings.audio_descriptions}
                  onCheckedChange={(checked) => handleSettingChange('audio_descriptions', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Captions</Label>
                  <p className="text-xs text-gray-500">
                    Show captions for video and audio content
                  </p>
                </div>
                <Switch
                  checked={localSettings.captions_enabled}
                  onCheckedChange={(checked) => handleSettingChange('captions_enabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-orange-500" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>
                Save your settings or reset to defaults
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={saveSettings} 
                disabled={loading}
                className="w-full"
              >
                <Check className="h-4 w-4 mr-2" />
                Save Accessibility Settings
              </Button>
              
              <Button 
                onClick={resetToDefaults}
                variant="outline"
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>

              {/* Accessibility Score */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-900">Accessibility Score</span>
                  <span className="text-2xl font-bold text-green-900">
                    {Math.round((Object.values(localSettings).filter(Boolean).length / Object.keys(localSettings).length) * 100)}%
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Based on your current accessibility settings
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Accessibility Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">💡 Accessibility Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-2">For Better Visibility:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Increase font size if text appears too small</li>
                  <li>• Use high contrast for better text readability</li>
                  <li>• Enable large click targets for easier navigation</li>
                  <li>• Adjust zoom level for comfortable viewing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">For Better Navigation:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Enable keyboard navigation for hands-free use</li>
                  <li>• Turn on screen reader optimization if using assistive technology</li>
                  <li>• Use simplified interface to reduce distractions</li>
                  <li>• Enable reduced motion if animations cause discomfort</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}