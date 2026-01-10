import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';

export interface UserPreferences {
  dashboard_layout: {
    widgets: Array<{
      id: string;
      position: number;
      visible: boolean;
    }>;
    layout_type: 'grid' | 'list';
    columns: number;
  };
  dashboard_widgets: Record<string, {
    enabled: boolean;
    size: 'small' | 'medium' | 'large';
  }>;
  notification_settings: {
    appointment_reminders: { enabled: boolean; timing: number[] };
    mood_check_ins: { enabled: boolean; timing: string };
    goal_reminders: { enabled: boolean; timing: string };
    crisis_alerts: { enabled: boolean; immediate: boolean };
    system_updates: { enabled: boolean; timing: string };
  };
  notification_schedule: {
    quiet_hours: { enabled: boolean; start: string; end: string };
    weekend_mode: { enabled: boolean };
    vacation_mode: { enabled: boolean; start_date?: string; end_date?: string };
  };
  accessibility: {
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
  };
  interface: {
    language: 'en' | 'es' | 'fr' | 'de';
    timezone: string;
    date_format: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    time_format: '12h' | '24h';
  };
  privacy: {
    profile_visibility: boolean;
    activity_tracking: boolean;
    analytics_consent: boolean;
    marketing_consent: boolean;
  };
  notifications: {
    email_notifications: boolean;
    sms_notifications: boolean;
    push_notifications: boolean;
  };
  mood_tracking_settings: {
    frequency: string;
    reminder_time: string;
    include_notes: boolean;
    track_triggers: boolean;
    share_with_therapist: boolean;
  };
  goal_preferences: {
    categories: string[];
    visibility: string;
    reminder_frequency: string;
    celebration_style: string;
  };
  resource_preferences: {
    content_types: string[];
    difficulty_level: string;
    topics_of_interest: string[];
    age_appropriate_only: boolean;
  };
  sync: {
    cross_device_sync: boolean;
    last_synced_at?: string;
  };
}

export interface PreferenceConflict {
  category: string;
  key: string;
  server_value: any;
  device_value: any;
  device_id: string;
}

export interface UseUserPreferencesReturn {
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
  conflicts: PreferenceConflict[];
  updatePreferences: (updates: Partial<UserPreferences>, deviceId?: string) => Promise<boolean>;
  syncPreferences: (devicePreferences: Partial<UserPreferences>, deviceId: string) => Promise<boolean>;
  resolveConflicts: (resolutions: Array<{ field: string; chosen_value: any }>) => Promise<boolean>;
  exportPreferences: () => Promise<any>;
  importPreferences: (backupData: any) => Promise<boolean>;
  refreshPreferences: () => Promise<void>;
}

export function useUserPreferences(): UseUserPreferencesReturn {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<PreferenceConflict[]>([]);

  // Get device ID for sync purposes
  const getDeviceId = useCallback(() => {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }, []);

  // Fetch preferences from API
  const fetchPreferences = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/preferences', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }

      const data = await response.json();
      
      if (data.success) {
        setPreferences(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch preferences');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch conflicts
  const fetchConflicts = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/preferences/conflicts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConflicts(data.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch conflicts:', err);
    }
  }, [user]);

  // Update preferences
  const updatePreferences = useCallback(async (
    updates: Partial<UserPreferences>, 
    deviceId?: string
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      const response = await fetch('/api/preferences', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: updates,
          device_id: deviceId || getDeviceId(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPreferences(data.data);
        return true;
      } else {
        setError(data.message || 'Failed to update preferences');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [user, getDeviceId]);

  // Sync preferences across devices
  const syncPreferences = useCallback(async (
    devicePreferences: Partial<UserPreferences>, 
    deviceId: string
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      const response = await fetch('/api/preferences/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: devicePreferences,
          device_id: deviceId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchPreferences();
        return true;
      } else {
        if (data.conflicts && data.conflicts.length > 0) {
          setConflicts(data.conflicts);
        }
        setError(data.message || 'Sync conflicts detected');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [user, fetchPreferences]);

  // Resolve conflicts
  const resolveConflicts = useCallback(async (
    resolutions: Array<{ field: string; chosen_value: any }>
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      const response = await fetch('/api/preferences/conflicts/resolve', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resolutions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPreferences(data.data);
        setConflicts([]);
        return true;
      } else {
        setError(data.message || 'Failed to resolve conflicts');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [user]);

  // Export preferences
  const exportPreferences = useCallback(async () => {
    if (!user) return null;

    try {
      const response = await fetch('/api/preferences/export', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to export preferences');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }, [user]);

  // Import preferences
  const importPreferences = useCallback(async (backupData: any): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      const response = await fetch('/api/preferences/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          backup_data: backupData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPreferences(data.data);
        return true;
      } else {
        setError(data.message || 'Failed to import preferences');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [user]);

  // Refresh preferences
  const refreshPreferences = useCallback(async () => {
    await fetchPreferences();
    await fetchConflicts();
  }, [fetchPreferences, fetchConflicts]);

  // Load preferences on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchPreferences();
      fetchConflicts();
    } else {
      setPreferences(null);
      setConflicts([]);
      setLoading(false);
    }
  }, [user, fetchPreferences, fetchConflicts]);

  return {
    preferences,
    loading,
    error,
    conflicts,
    updatePreferences,
    syncPreferences,
    resolveConflicts,
    exportPreferences,
    importPreferences,
    refreshPreferences,
  };
}