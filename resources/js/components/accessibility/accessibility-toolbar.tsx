import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAccessibility } from '@/hooks/use-accessibility';
import { 
  Eye, 
  Type, 
  Contrast, 
  ZoomIn, 
  ZoomOut, 
  Volume2, 
  VolumeX,
  Settings,
  X,
  Minus,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccessibilityToolbarProps {
  className?: string;
}

export function AccessibilityToolbar({ className = '' }: AccessibilityToolbarProps) {
  const { settings, updateSetting, announceToScreenReader } = useAccessibility();
  const [isExpanded, setIsExpanded] = useState(false);

  const increaseFontSize = async () => {
    const sizes = ['small', 'medium', 'large', 'extra-large'] as const;
    const currentIndex = sizes.indexOf(settings.font_size);
    if (currentIndex < sizes.length - 1) {
      await updateSetting('font_size', sizes[currentIndex + 1]);
      announceToScreenReader(`Font size increased to ${sizes[currentIndex + 1]}`);
    }
  };

  const decreaseFontSize = async () => {
    const sizes = ['small', 'medium', 'large', 'extra-large'] as const;
    const currentIndex = sizes.indexOf(settings.font_size);
    if (currentIndex > 0) {
      await updateSetting('font_size', sizes[currentIndex - 1]);
      announceToScreenReader(`Font size decreased to ${sizes[currentIndex - 1]}`);
    }
  };

  const toggleContrast = async () => {
    const levels = ['normal', 'high', 'extra-high'] as const;
    const currentIndex = levels.indexOf(settings.contrast_level);
    const nextLevel = levels[(currentIndex + 1) % levels.length];
    await updateSetting('contrast_level', nextLevel);
    announceToScreenReader(`Contrast level changed to ${nextLevel}`);
  };

  const increaseZoom = async () => {
    const newZoom = Math.min(200, settings.zoom_level + 25);
    await updateSetting('zoom_level', newZoom);
    announceToScreenReader(`Zoom level increased to ${newZoom}%`);
  };

  const decreaseZoom = async () => {
    const newZoom = Math.max(75, settings.zoom_level - 25);
    await updateSetting('zoom_level', newZoom);
    announceToScreenReader(`Zoom level decreased to ${newZoom}%`);
  };

  const toggleAudioDescriptions = async () => {
    const newValue = !settings.audio_descriptions;
    await updateSetting('audio_descriptions', newValue);
    announceToScreenReader(`Audio descriptions ${newValue ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className="w-80 shadow-lg border-2 border-blue-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-blue-500" />
                    Quick Accessibility
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    aria-label="Close accessibility toolbar"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Font Size Controls */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center">
                      <Type className="h-4 w-4 mr-2 text-gray-500" />
                      Font Size
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={decreaseFontSize}
                        disabled={settings.font_size === 'small'}
                        aria-label="Decrease font size"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded min-w-[60px] text-center">
                        {settings.font_size}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={increaseFontSize}
                        disabled={settings.font_size === 'extra-large'}
                        aria-label="Increase font size"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Contrast Controls */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center">
                      <Contrast className="h-4 w-4 mr-2 text-gray-500" />
                      Contrast
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleContrast}
                      className="min-w-[100px]"
                    >
                      {settings.contrast_level}
                    </Button>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center">
                      <ZoomIn className="h-4 w-4 mr-2 text-gray-500" />
                      Zoom
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={decreaseZoom}
                        disabled={settings.zoom_level <= 75}
                        aria-label="Decrease zoom"
                      >
                        <ZoomOut className="h-3 w-3" />
                      </Button>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded min-w-[50px] text-center">
                        {settings.zoom_level}%
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={increaseZoom}
                        disabled={settings.zoom_level >= 200}
                        aria-label="Increase zoom"
                      >
                        <ZoomIn className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Audio Descriptions */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center">
                      {settings.audio_descriptions ? (
                        <Volume2 className="h-4 w-4 mr-2 text-gray-500" />
                      ) : (
                        <VolumeX className="h-4 w-4 mr-2 text-gray-500" />
                      )}
                      Audio
                    </span>
                    <Button
                      variant={settings.audio_descriptions ? "default" : "outline"}
                      size="sm"
                      onClick={toggleAudioDescriptions}
                      className="min-w-[80px]"
                    >
                      {settings.audio_descriptions ? 'On' : 'Off'}
                    </Button>
                  </div>

                  {/* Quick Toggles */}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={settings.reduced_motion ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSetting('reduced_motion', !settings.reduced_motion)}
                        className="text-xs"
                      >
                        Reduce Motion
                      </Button>
                      <Button
                        variant={settings.keyboard_navigation ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSetting('keyboard_navigation', !settings.keyboard_navigation)}
                        className="text-xs"
                      >
                        Keyboard Nav
                      </Button>
                    </div>
                  </div>

                  {/* Link to Full Settings */}
                  <div className="pt-2 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-blue-600 hover:text-blue-700"
                      onClick={() => {
                        // Navigate to full accessibility settings
                        window.location.href = '/settings/accessibility';
                      }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      More Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 shadow-lg"
          aria-label={isExpanded ? "Close accessibility toolbar" : "Open accessibility toolbar"}
        >
          <Eye className="h-5 w-5 text-white" />
        </Button>
      </motion.div>
    </div>
  );
}