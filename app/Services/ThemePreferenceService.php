<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ThemePreferenceService
{
    /**
     * Get user's theme preferences
     */
    public function getUserThemePreferences(User $user): array
    {
        $cacheKey = "user_theme_preferences_{$user->id}";
        
        return Cache::remember($cacheKey, 3600, function () use ($user) {
            $preferences = $user->theme_preferences ?? [];
            
            // Return default preferences if none exist
            if (empty($preferences)) {
                return $this->getDefaultThemePreferences();
            }
            
            // Merge with defaults to ensure all keys exist
            return array_merge($this->getDefaultThemePreferences(), $preferences);
        });
    }

    /**
     * Update user's theme preferences
     */
    public function updateUserThemePreferences(User $user, array $preferences): bool
    {
        try {
            // Validate preferences structure
            $validatedPreferences = $this->validateThemePreferences($preferences);
            
            // Update user preferences
            $user->update([
                'theme_preferences' => $validatedPreferences
            ]);
            
            // Clear cache
            $cacheKey = "user_theme_preferences_{$user->id}";
            Cache::forget($cacheKey);
            
            Log::info('Theme preferences updated', [
                'user_id' => $user->id,
                'preferences' => $validatedPreferences
            ]);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to update theme preferences', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'preferences' => $preferences
            ]);
            
            return false;
        }
    }

    /**
     * Get default theme preferences
     */
    public function getDefaultThemePreferences(): array
    {
        return [
            'mode' => 'auto',
            'accessibility' => [
                'fontSize' => 'medium',
                'contrast' => 'normal',
                'focusVisible' => true,
            ],
            'animations' => [
                'reducedMotion' => false,
                'duration' => [
                    'fast' => '150ms',
                    'normal' => '300ms',
                    'slow' => '500ms',
                ],
                'easing' => [
                    'gentle' => 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    'calm' => 'cubic-bezier(0.4, 0.0, 0.2, 1)',
                    'soothing' => 'cubic-bezier(0.25, 0.1, 0.25, 1)',
                ],
            ],
        ];
    }

    /**
     * Validate theme preferences structure
     */
    private function validateThemePreferences(array $preferences): array
    {
        $defaults = $this->getDefaultThemePreferences();
        $validated = [];

        // Validate mode
        $validated['mode'] = in_array($preferences['mode'] ?? null, ['light', 'dark', 'auto']) 
            ? $preferences['mode'] 
            : $defaults['mode'];

        // Validate accessibility settings
        $validated['accessibility'] = [];
        
        $validated['accessibility']['fontSize'] = in_array(
            $preferences['accessibility']['fontSize'] ?? null, 
            ['small', 'medium', 'large', 'extra-large']
        ) ? $preferences['accessibility']['fontSize'] : $defaults['accessibility']['fontSize'];
        
        $validated['accessibility']['contrast'] = in_array(
            $preferences['accessibility']['contrast'] ?? null, 
            ['normal', 'high']
        ) ? $preferences['accessibility']['contrast'] : $defaults['accessibility']['contrast'];
        
        $validated['accessibility']['focusVisible'] = is_bool($preferences['accessibility']['focusVisible'] ?? null)
            ? $preferences['accessibility']['focusVisible']
            : $defaults['accessibility']['focusVisible'];

        // Validate animation settings
        $validated['animations'] = [];
        
        $validated['animations']['reducedMotion'] = is_bool($preferences['animations']['reducedMotion'] ?? null)
            ? $preferences['animations']['reducedMotion']
            : $defaults['animations']['reducedMotion'];

        // Keep duration and easing from defaults (these are rarely customized)
        $validated['animations']['duration'] = $defaults['animations']['duration'];
        $validated['animations']['easing'] = $defaults['animations']['easing'];

        return $validated;
    }

    /**
     * Get theme preferences for multiple users (for admin/analytics)
     */
    public function getBulkThemePreferences(array $userIds): array
    {
        $preferences = [];
        
        foreach ($userIds as $userId) {
            $user = User::find($userId);
            if ($user) {
                $preferences[$userId] = $this->getUserThemePreferences($user);
            }
        }
        
        return $preferences;
    }

    /**
     * Get theme usage analytics
     */
    public function getThemeAnalytics(): array
    {
        $users = User::whereNotNull('theme_preferences')->get();
        
        $analytics = [
            'total_users_with_preferences' => $users->count(),
            'mode_distribution' => [
                'light' => 0,
                'dark' => 0,
                'auto' => 0,
            ],
            'accessibility_usage' => [
                'high_contrast' => 0,
                'large_font' => 0,
                'reduced_motion' => 0,
                'enhanced_focus' => 0,
            ],
        ];

        foreach ($users as $user) {
            $preferences = $user->theme_preferences;
            
            // Count mode distribution
            $mode = $preferences['mode'] ?? 'auto';
            if (isset($analytics['mode_distribution'][$mode])) {
                $analytics['mode_distribution'][$mode]++;
            }
            
            // Count accessibility features
            if (($preferences['accessibility']['contrast'] ?? 'normal') === 'high') {
                $analytics['accessibility_usage']['high_contrast']++;
            }
            
            if (in_array($preferences['accessibility']['fontSize'] ?? 'medium', ['large', 'extra-large'])) {
                $analytics['accessibility_usage']['large_font']++;
            }
            
            if ($preferences['animations']['reducedMotion'] ?? false) {
                $analytics['accessibility_usage']['reduced_motion']++;
            }
            
            if ($preferences['accessibility']['focusVisible'] ?? true) {
                $analytics['accessibility_usage']['enhanced_focus']++;
            }
        }

        return $analytics;
    }

    /**
     * Reset user theme preferences to default
     */
    public function resetUserThemePreferences(User $user): bool
    {
        try {
            $user->update([
                'theme_preferences' => $this->getDefaultThemePreferences()
            ]);
            
            // Clear cache
            $cacheKey = "user_theme_preferences_{$user->id}";
            Cache::forget($cacheKey);
            
            Log::info('Theme preferences reset to default', [
                'user_id' => $user->id
            ]);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to reset theme preferences', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
            
            return false;
        }
    }

    /**
     * Migrate old theme preferences to new format
     */
    public function migrateThemePreferences(): int
    {
        $migratedCount = 0;
        
        // Find users with old theme preference format
        $users = User::whereNotNull('theme_preferences')
            ->whereRaw("JSON_TYPE(theme_preferences) = 'OBJECT'")
            ->get();

        foreach ($users as $user) {
            $oldPreferences = $user->theme_preferences;
            
            // Check if migration is needed
            if (!isset($oldPreferences['accessibility']) || !isset($oldPreferences['animations'])) {
                $newPreferences = $this->getDefaultThemePreferences();
                
                // Preserve existing mode if valid
                if (isset($oldPreferences['mode']) && in_array($oldPreferences['mode'], ['light', 'dark', 'auto'])) {
                    $newPreferences['mode'] = $oldPreferences['mode'];
                }
                
                $user->update(['theme_preferences' => $newPreferences]);
                $migratedCount++;
                
                Log::info('Migrated theme preferences', [
                    'user_id' => $user->id,
                    'old_preferences' => $oldPreferences,
                    'new_preferences' => $newPreferences
                ]);
            }
        }
        
        return $migratedCount;
    }
}