<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserPreference;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class UserPreferenceService
{
    /**
     * Get user preferences with caching.
     */
    public function getUserPreferences(User $user): array
    {
        $cacheKey = "user_preferences_{$user->id}";
        
        return Cache::remember($cacheKey, 3600, function () use ($user) {
            $preferences = $user->getPreferences();
            return $preferences->getMergedPreferences();
        });
    }

    /**
     * Update user preferences.
     */
    public function updatePreferences(User $user, array $preferences, ?string $deviceId = null): bool
    {
        try {
            $userPreferences = $user->getPreferences();
            
            // Validate preferences before updating
            $validatedPreferences = $this->validatePreferences($preferences);
            
            // Update with conflict resolution
            $success = $userPreferences->updateWithConflictResolution($validatedPreferences, $deviceId);
            
            if ($success) {
                // Clear cache
                $this->clearUserPreferencesCache($user);
                
                // Log preference update
                Log::info('User preferences updated', [
                    'user_id' => $user->id,
                    'device_id' => $deviceId,
                    'updated_fields' => array_keys($validatedPreferences),
                ]);
            }
            
            return $success;
        } catch (\Exception $e) {
            Log::error('Failed to update user preferences', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            
            return false;
        }
    }
}
    /**
     * Sync preferences across devices.
     */
    public function syncPreferences(User $user, array $devicePreferences, string $deviceId): array
    {
        $serverPreferences = $this->getUserPreferences($user);
        $conflicts = [];
        
        // Check for conflicts
        foreach ($devicePreferences as $category => $settings) {
            if (isset($serverPreferences[$category])) {
                $serverSettings = $serverPreferences[$category];
                
                foreach ($settings as $key => $value) {
                    if (isset($serverSettings[$key]) && $serverSettings[$key] !== $value) {
                        $conflicts[] = [
                            'category' => $category,
                            'key' => $key,
                            'server_value' => $serverSettings[$key],
                            'device_value' => $value,
                            'device_id' => $deviceId,
                        ];
                    }
                }
            }
        }
        
        // If no conflicts, update preferences
        if (empty($conflicts)) {
            $this->updatePreferences($user, $this->flattenPreferences($devicePreferences), $deviceId);
            return ['success' => true, 'conflicts' => []];
        }
        
        return ['success' => false, 'conflicts' => $conflicts];
    }

    /**
     * Resolve preference conflicts.
     */
    public function resolveConflicts(User $user, array $resolutions): bool
    {
        $userPreferences = $user->getPreferences();
        $updates = [];
        
        foreach ($resolutions as $resolution) {
            $field = $resolution['field'];
            $chosenValue = $resolution['chosen_value'];
            $updates[$field] = $chosenValue;
        }
        
        if (!empty($updates)) {
            $success = $this->updatePreferences($user, $updates);
            
            if ($success) {
                // Clear sync conflicts
                $userPreferences->sync_conflicts = null;
                $userPreferences->save();
            }
            
            return $success;
        }
        
        return true;
    }

    /**
     * Get preference conflicts for a user.
     */
    public function getConflicts(User $user): array
    {
        $preferences = $user->getPreferences();
        return $preferences->sync_conflicts ?? [];
    }

    /**
     * Validate preferences data.
     */
    private function validatePreferences(array $preferences): array
    {
        $validated = [];
        
        // Validate accessibility preferences
        if (isset($preferences['font_size'])) {
            $validated['font_size'] = in_array($preferences['font_size'], 
                ['small', 'medium', 'large', 'extra-large']) 
                ? $preferences['font_size'] : 'medium';
        }
        
        if (isset($preferences['contrast_level'])) {
            $validated['contrast_level'] = in_array($preferences['contrast_level'], 
                ['normal', 'high', 'extra-high']) 
                ? $preferences['contrast_level'] : 'normal';
        }
        
        // Validate boolean preferences
        $booleanFields = [
            'reduced_motion', 'screen_reader_optimized', 'keyboard_navigation',
            'email_notifications', 'sms_notifications', 'push_notifications',
            'profile_visibility', 'activity_tracking', 'analytics_consent',
            'marketing_consent', 'cross_device_sync'
        ];
        
        foreach ($booleanFields as $field) {
            if (isset($preferences[$field])) {
                $validated[$field] = (bool) $preferences[$field];
            }
        }
        
        // Validate JSON fields
        $jsonFields = [
            'dashboard_layout', 'dashboard_widgets', 'notification_settings',
            'notification_schedule', 'mood_tracking_settings', 'goal_preferences',
            'resource_preferences'
        ];
        
        foreach ($jsonFields as $field) {
            if (isset($preferences[$field])) {
                $validated[$field] = is_array($preferences[$field]) 
                    ? $preferences[$field] 
                    : json_decode($preferences[$field], true);
            }
        }
        
        // Validate enum fields
        if (isset($preferences['language'])) {
            $validated['language'] = in_array($preferences['language'], 
                ['en', 'es', 'fr', 'de']) 
                ? $preferences['language'] : 'en';
        }
        
        if (isset($preferences['timezone'])) {
            $validTimezones = [
                'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
                'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo'
            ];
            $validated['timezone'] = in_array($preferences['timezone'], $validTimezones) 
                ? $preferences['timezone'] : 'America/New_York';
        }
        
        return $validated;
    }

    /**
     * Flatten nested preferences for database storage.
     */
    private function flattenPreferences(array $preferences): array
    {
        $flattened = [];
        
        foreach ($preferences as $category => $settings) {
            if ($category === 'accessibility') {
                foreach ($settings as $key => $value) {
                    $flattened[$key] = $value;
                }
            } elseif ($category === 'notifications') {
                foreach ($settings as $key => $value) {
                    $flattened[$key] = $value;
                }
            } elseif (in_array($category, ['dashboard_layout', 'dashboard_widgets', 'notification_settings'])) {
                $flattened[$category] = $settings;
            }
        }
        
        return $flattened;
    }

    /**
     * Clear user preferences cache.
     */
    private function clearUserPreferencesCache(User $user): void
    {
        Cache::forget("user_preferences_{$user->id}");
    }

    /**
     * Export user preferences for backup.
     */
    public function exportPreferences(User $user): array
    {
        $preferences = $this->getUserPreferences($user);
        
        return [
            'user_id' => $user->id,
            'exported_at' => now()->toISOString(),
            'preferences' => $preferences,
        ];
    }

    /**
     * Import user preferences from backup.
     */
    public function importPreferences(User $user, array $backupData): bool
    {
        if (!isset($backupData['preferences'])) {
            return false;
        }
        
        return $this->updatePreferences($user, $this->flattenPreferences($backupData['preferences']));
    }
}