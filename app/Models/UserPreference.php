<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'dashboard_layout',
        'dashboard_widgets',
        'notification_settings',
        'notification_schedule',
        'email_notifications',
        'sms_notifications',
        'push_notifications',
        'font_size',
        'contrast_level',
        'reduced_motion',
        'screen_reader_optimized',
        'keyboard_navigation',
        'language',
        'timezone',
        'date_format',
        'time_format',
        'profile_visibility',
        'activity_tracking',
        'analytics_consent',
        'marketing_consent',
        'mood_tracking_settings',
        'goal_preferences',
        'resource_preferences',
        'cross_device_sync',
        'last_synced_at',
        'sync_conflicts',
    ];

    protected $casts = [
        'dashboard_layout' => 'array',
        'dashboard_widgets' => 'array',
        'notification_settings' => 'array',
        'notification_schedule' => 'array',
        'mood_tracking_settings' => 'array',
        'goal_preferences' => 'array',
        'resource_preferences' => 'array',
        'sync_conflicts' => 'array',
        'email_notifications' => 'boolean',
        'sms_notifications' => 'boolean',
        'push_notifications' => 'boolean',
        'reduced_motion' => 'boolean',
        'screen_reader_optimized' => 'boolean',
        'keyboard_navigation' => 'boolean',
        'profile_visibility' => 'boolean',
        'activity_tracking' => 'boolean',
        'analytics_consent' => 'boolean',
        'marketing_consent' => 'boolean',
        'cross_device_sync' => 'boolean',
        'last_synced_at' => 'datetime',
    ];

    /**
     * Get the user that owns the preferences.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get default preferences for a new user.
     */
    public static function getDefaults(): array
    {
        return [
            'dashboard_layout' => [
                'widgets' => [
                    ['id' => 'mood-tracker', 'position' => 1, 'visible' => true],
                    ['id' => 'recent-sessions', 'position' => 2, 'visible' => true],
                    ['id' => 'goals-progress', 'position' => 3, 'visible' => true],
                    ['id' => 'upcoming-appointments', 'position' => 4, 'visible' => true],
                    ['id' => 'resource-recommendations', 'position' => 5, 'visible' => true],
                ],
                'layout_type' => 'grid',
                'columns' => 2,
            ],
            'dashboard_widgets' => [
                'mood-tracker' => ['enabled' => true, 'size' => 'medium'],
                'recent-sessions' => ['enabled' => true, 'size' => 'large'],
                'goals-progress' => ['enabled' => true, 'size' => 'medium'],
                'upcoming-appointments' => ['enabled' => true, 'size' => 'medium'],
                'resource-recommendations' => ['enabled' => true, 'size' => 'small'],
            ],
            'notification_settings' => [
                'appointment_reminders' => ['enabled' => true, 'timing' => [24, 1]],
                'mood_check_ins' => ['enabled' => true, 'timing' => 'daily'],
                'goal_reminders' => ['enabled' => true, 'timing' => 'weekly'],
                'crisis_alerts' => ['enabled' => true, 'immediate' => true],
                'system_updates' => ['enabled' => false, 'timing' => 'weekly'],
            ],
            'notification_schedule' => [
                'quiet_hours' => ['enabled' => false, 'start' => '22:00', 'end' => '08:00'],
                'weekend_mode' => ['enabled' => false],
                'vacation_mode' => ['enabled' => false, 'start_date' => null, 'end_date' => null],
            ],
            'mood_tracking_settings' => [
                'frequency' => 'daily',
                'reminder_time' => '20:00',
                'include_notes' => true,
                'track_triggers' => true,
                'share_with_therapist' => true,
            ],
            'goal_preferences' => [
                'categories' => ['mental_health', 'physical_health', 'social', 'academic'],
                'visibility' => 'therapist_and_guardian',
                'reminder_frequency' => 'weekly',
                'celebration_style' => 'gentle',
            ],
            'resource_preferences' => [
                'content_types' => ['articles', 'videos', 'exercises', 'meditations'],
                'difficulty_level' => 'beginner',
                'topics_of_interest' => ['anxiety', 'depression', 'stress_management'],
                'age_appropriate_only' => true,
            ],
        ];
    }

    /**
     * Merge user preferences with defaults.
     */
    public function getMergedPreferences(): array
    {
        $defaults = self::getDefaults();
        
        return [
            'dashboard_layout' => $this->dashboard_layout ?? $defaults['dashboard_layout'],
            'dashboard_widgets' => $this->dashboard_widgets ?? $defaults['dashboard_widgets'],
            'notification_settings' => $this->notification_settings ?? $defaults['notification_settings'],
            'notification_schedule' => $this->notification_schedule ?? $defaults['notification_schedule'],
            'mood_tracking_settings' => $this->mood_tracking_settings ?? $defaults['mood_tracking_settings'],
            'goal_preferences' => $this->goal_preferences ?? $defaults['goal_preferences'],
            'resource_preferences' => $this->resource_preferences ?? $defaults['resource_preferences'],
            'accessibility' => [
                'font_size' => $this->font_size,
                'contrast_level' => $this->contrast_level,
                'reduced_motion' => $this->reduced_motion,
                'screen_reader_optimized' => $this->screen_reader_optimized,
                'keyboard_navigation' => $this->keyboard_navigation,
            ],
            'interface' => [
                'language' => $this->language,
                'timezone' => $this->timezone,
                'date_format' => $this->date_format,
                'time_format' => $this->time_format,
            ],
            'privacy' => [
                'profile_visibility' => $this->profile_visibility,
                'activity_tracking' => $this->activity_tracking,
                'analytics_consent' => $this->analytics_consent,
                'marketing_consent' => $this->marketing_consent,
            ],
            'notifications' => [
                'email_notifications' => $this->email_notifications,
                'sms_notifications' => $this->sms_notifications,
                'push_notifications' => $this->push_notifications,
            ],
            'sync' => [
                'cross_device_sync' => $this->cross_device_sync,
                'last_synced_at' => $this->last_synced_at,
            ],
        ];
    }

    /**
     * Update preferences with conflict resolution.
     */
    public function updateWithConflictResolution(array $newPreferences, ?string $deviceId = null): bool
    {
        $conflicts = [];
        $currentTime = now();
        
        // Check for conflicts if cross-device sync is enabled
        if ($this->cross_device_sync && $this->last_synced_at) {
            $timeSinceLastSync = $currentTime->diffInMinutes($this->last_synced_at);
            
            // If updated within last 5 minutes, check for conflicts
            if ($timeSinceLastSync < 5) {
                foreach ($newPreferences as $key => $value) {
                    if (isset($this->attributes[$key]) && $this->attributes[$key] !== $value) {
                        $conflicts[] = [
                            'field' => $key,
                            'current_value' => $this->attributes[$key],
                            'new_value' => $value,
                            'device_id' => $deviceId,
                            'timestamp' => $currentTime,
                        ];
                    }
                }
            }
        }
        
        // Store conflicts for resolution
        if (!empty($conflicts)) {
            $this->sync_conflicts = array_merge($this->sync_conflicts ?? [], $conflicts);
        }
        
        // Update preferences
        $this->fill($newPreferences);
        $this->last_synced_at = $currentTime;
        
        return $this->save();
    }
}