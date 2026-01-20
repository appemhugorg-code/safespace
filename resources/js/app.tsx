import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './contexts/theme-context';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { configureEcho } from '@laravel/echo-react';

configureEcho({
    broadcaster: 'reverb',
});

// Configure Echo for Reverb
window.Pusher = Pusher;

console.log('Initializing Echo with Reverb configuration:', {
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 8082,
});

// Initialize Reverb WebSocket connection
window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
    forceTLS: false,
    enabledTransports: ['ws'],
    disableStats: true,
    auth: {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
    },
});

// Add connection event listeners for debugging
window.Echo.connector.pusher.connection.bind('connected', () => {
    console.log('✅ Echo WebSocket connected successfully');
});

window.Echo.connector.pusher.connection.bind('disconnected', () => {
    console.log('❌ Echo WebSocket disconnected');
});

window.Echo.connector.pusher.connection.bind('error', (error: any) => {
    console.error('❌ Echo WebSocket error:', error);
});

window.Echo.connector.pusher.connection.bind('state_change', (states: any) => {
    console.log('🔄 Echo connection state changed:', states.previous, '→', states.current);
});

const appName = import.meta.env.VITE_APP_NAME || 'SafeSpace';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Wrap the app with the comprehensive theme provider
        root.render(
            <ThemeProvider>
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// Theme system is now handled by ThemeProvider context
// No need for manual initialization
