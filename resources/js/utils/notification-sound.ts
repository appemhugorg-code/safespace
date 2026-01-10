/**
 * Play notification sound
 */
export function playNotificationSound(): void {
    try {
        // Create audio element
        const audio = new Audio('/sounds/notification.mp3');
        audio.volume = 0.5; // Set volume to 50%

        // Play the sound
        audio.play().catch((error) => {
            console.warn('Failed to play notification sound:', error);
        });
    } catch (error) {
        console.warn('Error creating notification sound:', error);
    }
}

/**
 * Play notification sound with custom volume
 */
export function playNotificationSoundWithVolume(volume: number): void {
    try {
        // Ensure volume is between 0 and 1
        const normalizedVolume = Math.max(0, Math.min(1, volume));

        const audio = new Audio('/sounds/notification.mp3');
        audio.volume = normalizedVolume;

        audio.play().catch((error) => {
            console.warn('Failed to play notification sound:', error);
        });
    } catch (error) {
        console.warn('Error creating notification sound:', error);
    }
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
