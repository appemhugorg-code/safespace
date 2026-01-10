import { ThemeConfig } from '@/contexts/theme-context';

interface SyncOptions {
  immediate?: boolean;
  retryCount?: number;
  timeout?: number;
}

interface SyncResult {
  success: boolean;
  error?: string;
  timestamp?: Date;
  source?: 'local' | 'server' | 'system';
}

/**
 * Service for synchronizing theme preferences across devices and sessions
 */
export class ThemeSyncService {
  private static instance: ThemeSyncService;
  private syncQueue: Array<{ theme: Partial<ThemeConfig>; options: SyncOptions }> = [];
  private isOnline = navigator.onLine;
  private lastSyncTimestamp: Date | null = null;
  private syncInProgress = false;

  private constructor() {
    this.setupEventListeners();
  }

  static getInstance(): ThemeSyncService {
    if (!ThemeSyncService.instance) {
      ThemeSyncService.instance = new ThemeSyncService();
    }
    return ThemeSyncService.instance;
  }

  /**
   * Setup event listeners for online/offline detection and system theme changes
   */
  private setupEventListeners() {
    // Online/offline detection
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // System theme change detection
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      this.handleSystemThemeChange(e.matches);
    });

    // Visibility change (tab focus/blur)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.checkForRemoteUpdates();
      }
    });

    // Storage events for cross-tab synchronization
    window.addEventListener('storage', (e) => {
      if (e.key === 'safespace-theme') {
        this.handleStorageChange(e);
      }
    });
  }

  /**
   * Sync theme preferences to server
   */
  async syncToServer(theme: Partial<ThemeConfig>, options: SyncOptions = {}): Promise<SyncResult> {
    const { immediate = false, retryCount = 3, timeout = 5000 } = options;

    if (!this.isOnline && !immediate) {
      // Queue for later sync
      this.syncQueue.push({ theme, options });
      return { success: false, error: 'Offline - queued for sync' };
    }

    if (this.syncInProgress && !immediate) {
      this.syncQueue.push({ theme, options });
      return { success: false, error: 'Sync in progress - queued' };
    }

    this.syncInProgress = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch('/api/user/theme', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(theme),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        this.lastSyncTimestamp = new Date();
        
        // Store sync timestamp in localStorage
        localStorage.setItem('safespace-theme-sync', this.lastSyncTimestamp.toISOString());
        
        return { 
          success: true, 
          timestamp: this.lastSyncTimestamp,
          source: 'server'
        };
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      if (retryCount > 0) {
        // Exponential backoff retry
        const delay = Math.pow(2, 3 - retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.syncToServer(theme, { ...options, retryCount: retryCount - 1 });
      }
      
      // Queue for later if not immediate
      if (!immediate) {
        this.syncQueue.push({ theme, options });
      }
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Load theme preferences from server
   */
  async loadFromServer(): Promise<{ theme: ThemeConfig | null; result: SyncResult }> {
    try {
      const response = await fetch('/api/user/theme', {
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          return {
            theme: data.data,
            result: { success: true, source: 'server', timestamp: new Date() }
          };
        }
      } else if (response.status === 401) {
        // User not authenticated, try defaults
        const defaultResponse = await fetch('/api/theme/defaults');
        if (defaultResponse.ok) {
          const defaultData = await defaultResponse.json();
          return {
            theme: defaultData.data,
            result: { success: true, source: 'server', timestamp: new Date() }
          };
        }
      }

      return {
        theme: null,
        result: { success: false, error: 'Failed to load from server' }
      };
    } catch (error) {
      return {
        theme: null,
        result: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Network error' 
        }
      };
    }
  }

  /**
   * Process queued sync operations
   */
  private async processSyncQueue() {
    if (!this.isOnline || this.syncInProgress || this.syncQueue.length === 0) {
      return;
    }

    const queue = [...this.syncQueue];
    this.syncQueue = [];

    for (const { theme, options } of queue) {
      await this.syncToServer(theme, { ...options, immediate: true });
    }
  }

  /**
   * Handle system theme changes
   */
  private handleSystemThemeChange(isDark: boolean) {
    // Dispatch custom event for theme context to handle
    const event = new CustomEvent('systemThemeChange', {
      detail: { isDark, timestamp: new Date() }
    });
    window.dispatchEvent(event);
  }

  /**
   * Handle storage changes from other tabs
   */
  private handleStorageChange(event: StorageEvent) {
    if (event.key === 'safespace-theme' && event.newValue) {
      try {
        const theme = JSON.parse(event.newValue);
        const customEvent = new CustomEvent('themeStorageChange', {
          detail: { theme, timestamp: new Date() }
        });
        window.dispatchEvent(customEvent);
      } catch (error) {
        console.warn('Failed to parse theme from storage:', error);
      }
    }
  }

  /**
   * Check for remote theme updates
   */
  private async checkForRemoteUpdates() {
    const lastSync = localStorage.getItem('safespace-theme-sync');
    if (!lastSync) return;

    try {
      const response = await fetch('/api/user/theme', {
        headers: {
          'Accept': 'application/json',
          'If-Modified-Since': lastSync,
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (response.status === 200) {
        // Theme was updated on server
        const data = await response.json();
        if (data.success && data.data) {
          const event = new CustomEvent('remoteThemeUpdate', {
            detail: { theme: data.data, timestamp: new Date() }
          });
          window.dispatchEvent(event);
        }
      }
    } catch (error) {
      console.warn('Failed to check for remote theme updates:', error);
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress,
      queueLength: this.syncQueue.length,
      lastSyncTimestamp: this.lastSyncTimestamp,
    };
  }

  /**
   * Force sync all queued items
   */
  async forceSyncAll(): Promise<SyncResult[]> {
    if (!this.isOnline) {
      return [{ success: false, error: 'Device is offline' }];
    }

    const results: SyncResult[] = [];
    const queue = [...this.syncQueue];
    this.syncQueue = [];

    for (const { theme, options } of queue) {
      const result = await this.syncToServer(theme, { ...options, immediate: true });
      results.push(result);
    }

    return results;
  }

  /**
   * Clear sync queue
   */
  clearSyncQueue() {
    this.syncQueue = [];
  }
}

// Export singleton instance
export const themeSyncService = ThemeSyncService.getInstance();