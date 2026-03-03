/**
 * Play notification sound - DISABLED
 */
export function playNotificationSound(): void {
    // Sound notifications disabled
    return;
}

/**
 * Play notification sound with custom volume - DISABLED
 */
export function playNotificationSoundWithVolume(volume: number): void {
    // Sound notifications disabled
    return;
}

/**
 * Check if user has enabled notification sounds
 */
export async function shouldPlaySound(): Promise<boolean> {
    try {
        const response = await fetch('/api/notification-preferences');
        const data = await response.json();
        return data.sound_enabled ?? true;
    } catch (error) {
        console.warn('Failed to check sound preferences:', error);
        return true; // Default to enabled
    }
}
