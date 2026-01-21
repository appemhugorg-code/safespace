import { ThemeConfig } from '@/contexts/theme-context';
import { themeSyncService } from './theme-sync-service';

interface DeviceInfo {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  lastSeen: Date;
}

interface ThemePersistenceOptions {
  enableCrossBrowser?: boolean;
  enableCrossDevice?: boolean;
  syncInterval?: number;
  retryAttempts?: number;
  fallbackToLocal?: boolean;
}

interface PersistenceResult {
  success: boolean;
  source: 'localStorage' | 'sessionStorage' | 'server' | 'indexedDB';
  error?: string;
  timestamp: Date;
}

/**
 * Enhanced Theme Persistence Service
 * 
 * Provides comprehensive theme persistence across:
 * - Page navigation (sessionStorage)
 * - Browser sessions (localStorage)
 * - Device synchronization (server API)
 * - Offline scenarios (IndexedDB)
 */
export class EnhancedThemePersistence {
  private static instance: EnhancedThemePersistence;
  private deviceInfo: DeviceInfo;
  private options: ThemePersistenceOptions;
  private syncTimer: NodeJS.Timeout | null = null;
  private isInitialized = false;

  private constructor(options: ThemePersistenceOptions = {}) {
    this.options = {
      enableCrossBrowser: true,
      enableCrossDevice: true,
      syncInterval: 30000, // 30 seconds
      retryAttempts: 3,
      fallbackToLocal: true,
      ...options
    };
    
    this.deviceInfo = this.generateDeviceInfo();
  }

  static getInstance(options?: ThemePersistenceOptions): EnhancedThemePersistence {
    if (!EnhancedThemePersistence.instance) {
      EnhancedThemePersistence.instance = new EnhancedThemePersistence(options);
    }
    return EnhancedThemePersistence.instance;
  }

  /**
   * Initialize the persistence service (non-blocking)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Setup storage event listeners (synchronous, fast)
      this.setupStorageListeners();
      
      // Setup page visibility change handler (synchronous, fast)
      this.setupVisibilityHandler();
      
      // Setup beforeunload handler (synchronous, fast)
      this.setupBeforeUnloadHandler();
      
      this.isInitialized = true;
      console.log('Enhanced Theme Persistence initialized');
      
      // Setup periodic sync in background (non-blocking)
      if (this.options.enableCrossDevice) {
        setTimeout(() => {
          this.startPeriodicSync();
        }, 5000); // Start periodic sync after 5 seconds
      }
      
    } catch (error) {
      console.error('Failed to initialize theme persistence:', error);
      // Don't throw - allow app to continue with basic functionality
      this.isInitialized = true; // Mark as initialized to prevent retries
    }
  }

  /**
   * Save theme preferences with multiple persistence layers
   */
  async saveTheme(theme: Partial<ThemeConfig>): Promise<PersistenceResult[]> {
    const results: PersistenceResult[] = [];
    const timestamp = new Date();

    // 1. Save to sessionStorage (for page navigation)
    try {
      const sessionData = {
        theme,
        deviceId: this.deviceInfo.id,
        timestamp: timestamp.toISOString()
      };
      sessionStorage.setItem('safespace-theme-session', JSON.stringify(sessionData));
      results.push({
        success: true,
        source: 'sessionStorage',
        timestamp
      });
    } catch (error) {
      results.push({
        success: false,
        source: 'sessionStorage',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp
      });
    }

    // 2. Save to localStorage (for browser sessions)
    try {
      const localData = {
        theme,
        deviceId: this.deviceInfo.id,
        deviceInfo: this.deviceInfo,
        timestamp: timestamp.toISOString()
      };
      localStorage.setItem('safespace-theme-local', JSON.stringify(localData));
      results.push({
        success: true,
        source: 'localStorage',
        timestamp
      });
    } catch (error) {
      results.push({
        success: false,
        source: 'localStorage',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp
      });
    }

    // 3. Save to IndexedDB (for offline scenarios)
    try {
      await this.saveToIndexedDB(theme, timestamp);
      results.push({
        success: true,
        source: 'indexedDB',
        timestamp
      });
    } catch (error) {
      results.push({
        success: false,
        source: 'indexedDB',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp
      });
    }

    // 4. Sync to server (for cross-device synchronization)
    if (this.options.enableCrossDevice && navigator.onLine && this.isUserAuthenticated()) {
      try {
        const syncResult = await themeSyncService.syncToServer(theme);
        results.push({
          success: syncResult.success,
          source: 'server',
          error: syncResult.error,
          timestamp
        });
      } catch (error) {
        results.push({
          success: false,
          source: 'server',
          error: error instanceof Error ? error.message : 'Network error',
          timestamp
        });
      }
    } else if (this.options.enableCrossDevice && !this.isUserAuthenticated()) {
      // Don't add a failed server result when not authenticated - this is expected
      console.log('User not authenticated - theme saved locally only');
    }

    return results;
  }

  /**
   * Load theme preferences with fallback hierarchy (non-blocking)
   */
  async loadTheme(): Promise<{ theme: ThemeConfig | null; source: string; timestamp?: Date }> {
    // Priority order: localStorage -> sessionStorage -> IndexedDB -> Server (async) -> defaults
    
    // 1. Try localStorage first (fastest, synchronous)
    try {
      const localData = localStorage.getItem('safespace-theme-local');
      if (localData) {
        const parsed = JSON.parse(localData);
        if (parsed.theme && this.isValidTheme(parsed.theme)) {
          // Start server sync in background (non-blocking)
          this.backgroundServerSync(parsed.theme);
          
          return {
            theme: parsed.theme,
            source: 'localStorage',
            timestamp: new Date(parsed.timestamp)
          };
        }
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }

    // 2. Try sessionStorage (for page navigation)
    try {
      const sessionData = sessionStorage.getItem('safespace-theme-session');
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed.theme && this.isValidTheme(parsed.theme)) {
          // Start server sync in background (non-blocking)
          this.backgroundServerSync(parsed.theme);
          
          return {
            theme: parsed.theme,
            source: 'sessionStorage',
            timestamp: new Date(parsed.timestamp)
          };
        }
      }
    } catch (error) {
      console.warn('Failed to load theme from sessionStorage:', error);
    }

    // 3. Try IndexedDB (for offline scenarios) - but don't block on it
    try {
      const indexedDBTheme = await Promise.race([
        this.loadFromIndexedDB(),
        new Promise<{ theme: null; source: string }>((resolve) => 
          setTimeout(() => resolve({ theme: null, source: 'indexedDB-timeout' }), 1000)
        )
      ]);
      
      if (indexedDBTheme.theme) {
        // Start server sync in background (non-blocking)
        this.backgroundServerSync(indexedDBTheme.theme);
        
        return indexedDBTheme;
      }
    } catch (error) {
      console.warn('Failed to load theme from IndexedDB:', error);
    }

    // 4. Try server (only if authenticated and online) - but don't block on it
    if (this.options.enableCrossDevice && navigator.onLine && this.isUserAuthenticated()) {
      try {
        const serverResult = await Promise.race([
          themeSyncService.loadFromServer(),
          new Promise<{ theme: null; result: any }>((resolve) => 
            setTimeout(() => resolve({ theme: null, result: { success: false, error: 'timeout' } }), 2000)
          )
        ]);
        
        if (serverResult.result.success && serverResult.theme) {
          // Update local storage with server data (async, non-blocking)
          this.updateLocalStorages(serverResult.theme).catch(console.warn);
          
          return { 
            theme: serverResult.theme, 
            source: 'server', 
            timestamp: serverResult.result.timestamp 
          };
        }
      } catch (error) {
        console.warn('Failed to load theme from server:', error);
      }
    }

    // 5. Return null if no valid theme found
    return { theme: null, source: 'none' };
  }

  /**
   * Clear all theme data (for logout scenarios)
   */
  async clearThemeData(): Promise<void> {
    try {
      // Clear session storage
      sessionStorage.removeItem('safespace-theme-session');
      
      // Clear local storage
      localStorage.removeItem('safespace-theme-local');
      
      // Clear IndexedDB
      await this.clearIndexedDB();
      
      console.log('Theme data cleared from all storage layers');
    } catch (error) {
      console.error('Failed to clear theme data:', error);
    }
  }

  /**
   * Sync theme across all open tabs/windows
   */
  syncAcrossTabs(theme: Partial<ThemeConfig>): void {
    try {
      const syncData = {
        theme,
        deviceId: this.deviceInfo.id,
        timestamp: new Date().toISOString(),
        action: 'theme_sync'
      };
      
      // Use localStorage to trigger storage events in other tabs
      localStorage.setItem('safespace-theme-sync-broadcast', JSON.stringify(syncData));
      
      // Remove immediately to allow repeated syncing
      setTimeout(() => {
        localStorage.removeItem('safespace-theme-sync-broadcast');
      }, 100);
    } catch (error) {
      console.error('Failed to sync theme across tabs:', error);
    }
  }

  /**
   * Get synchronization status
   */
  getSyncStatus() {
    return {
      ...themeSyncService.getSyncStatus(),
      deviceInfo: this.deviceInfo,
      isInitialized: this.isInitialized,
      options: this.options
    };
  }

  // Private methods

  /**
   * Background server sync (non-blocking)
   */
  private backgroundServerSync(theme: Partial<ThemeConfig>): void {
    if (!this.options.enableCrossDevice || !navigator.onLine || !this.isUserAuthenticated()) {
      return;
    }

    // Run server sync in background without blocking
    setTimeout(async () => {
      try {
        const { theme: serverTheme } = await themeSyncService.loadFromServer();
        if (serverTheme) {
          // Check if server theme is different from local
          const localData = localStorage.getItem('safespace-theme-local');
          if (localData) {
            const parsed = JSON.parse(localData);
            const localTimestamp = new Date(parsed.timestamp);
            const now = new Date();
            
            // If server theme is newer (or significantly different), dispatch update
            if (now.getTime() - localTimestamp.getTime() > 60000) { // 1 minute threshold
              const customEvent = new CustomEvent('backgroundThemeSync', {
                detail: { theme: serverTheme, timestamp: now }
              });
              window.dispatchEvent(customEvent);
            }
          }
        }
      } catch (error) {
        // Silently fail background sync
        console.debug('Background theme sync failed:', error);
      }
    }, 2000); // 2 second delay to not interfere with app startup
  }

  private generateDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent;
    const deviceId = this.getOrCreateDeviceId();
    
    return {
      id: deviceId,
      name: this.getDeviceName(),
      type: this.getDeviceType(),
      browser: this.getBrowserName(userAgent),
      os: this.getOperatingSystem(userAgent),
      lastSeen: new Date()
    };
  }

  private getOrCreateDeviceId(): string {
    let deviceId = localStorage.getItem('safespace-device-id');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('safespace-device-id', deviceId);
    }
    return deviceId;
  }

  private getDeviceName(): string {
    const platform = navigator.platform;
    const userAgent = navigator.userAgent;
    
    if (/iPhone|iPad|iPod/.test(userAgent)) {
      return 'iOS Device';
    } else if (/Android/.test(userAgent)) {
      return 'Android Device';
    } else if (/Mac/.test(platform)) {
      return 'Mac';
    } else if (/Win/.test(platform)) {
      return 'Windows PC';
    } else if (/Linux/.test(platform)) {
      return 'Linux PC';
    }
    return 'Unknown Device';
  }

  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const userAgent = navigator.userAgent;
    
    if (/Mobi|Android/i.test(userAgent)) {
      return /iPad|Tablet/i.test(userAgent) ? 'tablet' : 'mobile';
    }
    return 'desktop';
  }

  private getBrowserName(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getOperatingSystem(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private async saveToIndexedDB(theme: Partial<ThemeConfig>, timestamp: Date): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('SafeSpaceTheme', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('themes')) {
          db.createObjectStore('themes', { keyPath: 'id' });
        }
      };
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['themes'], 'readwrite');
        const store = transaction.objectStore('themes');
        
        const data = {
          id: 'current',
          theme,
          deviceId: this.deviceInfo.id,
          timestamp: timestamp.toISOString()
        };
        
        const putRequest = store.put(data);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };
    });
  }

  private async loadFromIndexedDB(): Promise<{ theme: ThemeConfig | null; source: string; timestamp?: Date }> {
    return new Promise((resolve) => {
      const request = indexedDB.open('SafeSpaceTheme', 1);
      
      request.onerror = () => resolve({ theme: null, source: 'indexedDB' });
      
      request.onsuccess = () => {
        const db = request.result;
        
        if (!db.objectStoreNames.contains('themes')) {
          resolve({ theme: null, source: 'indexedDB' });
          return;
        }
        
        const transaction = db.transaction(['themes'], 'readonly');
        const store = transaction.objectStore('themes');
        const getRequest = store.get('current');
        
        getRequest.onsuccess = () => {
          const result = getRequest.result;
          if (result && result.theme) {
            resolve({
              theme: result.theme,
              source: 'indexedDB',
              timestamp: new Date(result.timestamp)
            });
          } else {
            resolve({ theme: null, source: 'indexedDB' });
          }
        };
        
        getRequest.onerror = () => resolve({ theme: null, source: 'indexedDB' });
      };
    });
  }

  private async clearIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('SafeSpaceTheme', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        
        if (!db.objectStoreNames.contains('themes')) {
          resolve();
          return;
        }
        
        const transaction = db.transaction(['themes'], 'readwrite');
        const store = transaction.objectStore('themes');
        const clearRequest = store.clear();
        
        clearRequest.onsuccess = () => resolve();
        clearRequest.onerror = () => reject(clearRequest.error);
      };
    });
  }

  private async updateLocalStorages(theme: ThemeConfig): Promise<void> {
    const timestamp = new Date().toISOString();
    
    // Update localStorage
    const localData = {
      theme,
      deviceId: this.deviceInfo.id,
      deviceInfo: this.deviceInfo,
      timestamp
    };
    localStorage.setItem('safespace-theme-local', JSON.stringify(localData));
    
    // Update sessionStorage
    const sessionData = {
      theme,
      deviceId: this.deviceInfo.id,
      timestamp
    };
    sessionStorage.setItem('safespace-theme-session', JSON.stringify(sessionData));
    
    // Update IndexedDB
    await this.saveToIndexedDB(theme, new Date());
  }

  private isValidTheme(theme: any): boolean {
    return theme && 
           typeof theme === 'object' && 
           (theme.mode || theme.colors || theme.animations || theme.accessibility);
  }

  private setupStorageListeners(): void {
    // Listen for storage events from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === 'safespace-theme-sync-broadcast' && event.newValue) {
        try {
          const syncData = JSON.parse(event.newValue);
          if (syncData.deviceId !== this.deviceInfo.id) {
            // Theme changed in another tab
            const customEvent = new CustomEvent('crossTabThemeSync', {
              detail: syncData
            });
            window.dispatchEvent(customEvent);
          }
        } catch (error) {
          console.warn('Failed to parse cross-tab sync data:', error);
        }
      }
    });
  }

  private setupVisibilityHandler(): void {
    document.addEventListener('visibilitychange', async () => {
      if (!document.hidden && this.options.enableCrossDevice && this.isUserAuthenticated()) {
        // Tab became visible, check for remote updates
        try {
          const { theme } = await themeSyncService.loadFromServer();
          if (theme) {
            const customEvent = new CustomEvent('remoteThemeUpdate', {
              detail: { theme, timestamp: new Date() }
            });
            window.dispatchEvent(customEvent);
          }
        } catch (error) {
          // Only log warnings for non-authentication errors
          if (!error.message?.includes('Not authenticated')) {
            console.warn('Failed to check for remote theme updates:', error);
          }
        }
      }
    });
  }

  private setupBeforeUnloadHandler(): void {
    window.addEventListener('beforeunload', () => {
      // Update device last seen timestamp
      this.deviceInfo.lastSeen = new Date();
      try {
        const localData = localStorage.getItem('safespace-theme-local');
        if (localData) {
          const parsed = JSON.parse(localData);
          parsed.deviceInfo = this.deviceInfo;
          localStorage.setItem('safespace-theme-local', JSON.stringify(parsed));
        }
      } catch (error) {
        console.warn('Failed to update device info on unload:', error);
      }
    });
  }

  private startPeriodicSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    
    this.syncTimer = setInterval(async () => {
      if (navigator.onLine && this.options.enableCrossDevice && this.isUserAuthenticated()) {
        try {
          // Check for remote updates periodically
          const { theme } = await themeSyncService.loadFromServer();
          if (theme) {
            // Compare with local theme to see if update is needed
            const localData = localStorage.getItem('safespace-theme-local');
            if (localData) {
              const parsed = JSON.parse(localData);
              const localTimestamp = new Date(parsed.timestamp);
              const serverTimestamp = new Date();
              
              // If server theme is newer, dispatch update event
              if (serverTimestamp > localTimestamp) {
                const customEvent = new CustomEvent('periodicThemeSync', {
                  detail: { theme, timestamp: serverTimestamp }
                });
                window.dispatchEvent(customEvent);
              }
            }
          }
        } catch (error) {
          // Only log warnings for non-authentication errors
          if (!error.message?.includes('Not authenticated')) {
            console.warn('Periodic sync failed:', error);
          }
        }
      }
    }, this.options.syncInterval);
  }

  /**
   * Check if user is likely authenticated (simplified, non-blocking)
   */
  private isUserAuthenticated(): boolean {
    try {
      // Simple check - just look for CSRF token (most reliable indicator)
      const hasAuthToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      // Quick check if we're on auth pages
      const isAuthPage = window.location.pathname.includes('/login') || 
                        window.location.pathname.includes('/register');
      
      // Return true if we have auth token and we're not on auth pages
      return !!hasAuthToken && !isAuthPage;
    } catch (error) {
      // If any error occurs, assume not authenticated to avoid blocking
      console.warn('Auth check failed, assuming not authenticated:', error);
      return false;
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    this.isInitialized = false;
  }
}

// Export singleton instance
export const enhancedThemePersistence = EnhancedThemePersistence.getInstance();