import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './contexts/theme-context';
import { AppLoader } from './components/app-loader';
import { Suspense } from 'react';

const appName = import.meta.env.VITE_APP_NAME || 'SafeSpace';

// Initialize Inertia app first (non-blocking)
createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Use enhanced theme provider with full features
        root.render(
            <ThemeProvider>
                <Suspense fallback={<AppLoader />}>
                    <App {...props} />
                </Suspense>
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
        showSpinner: true,
    },
});

// Initialize Echo WebSocket connection AFTER app is rendered (non-blocking)
setTimeout(() => {
    try {
        // Only initialize Echo if Reverb configuration is available
        const reverbKey = import.meta.env.VITE_REVERB_APP_KEY;
        const reverbHost = import.meta.env.VITE_REVERB_HOST;
        const reverbPort = import.meta.env.VITE_REVERB_PORT;
        const reverbScheme = import.meta.env.VITE_REVERB_SCHEME;

        if (!reverbKey || !reverbHost) {
            console.warn('⚠️ Reverb configuration missing, skipping Echo initialization');
            return;
        }

        // Dynamic imports to avoid blocking app startup
        Promise.all([
            import('laravel-echo'),
            import('pusher-js'),
            import('@laravel/echo-react')
        ]).then(([EchoModule, PusherModule, EchoReactModule]) => {
            const Echo = EchoModule.default;
            const Pusher = PusherModule.default;
            const { configureEcho } = EchoReactModule;

            // Configure Echo for Reverb
            window.Pusher = Pusher;

            configureEcho({
                broadcaster: 'reverb',
            });

            console.log('Initializing Echo with Reverb configuration:', {
                key: reverbKey,
                wsHost: reverbHost,
                wsPort: reverbPort ?? 8080,
            });

            // Initialize Reverb WebSocket connection
            window.Echo = new Echo({
                broadcaster: 'reverb',
                key: reverbKey,
                wsHost: reverbHost,
                wsPort: reverbPort ?? 8080,
                wssPort: reverbPort ?? 443,
                forceTLS: reverbScheme === 'https',
                enabledTransports: ['ws', 'wss'],
                disableStats: true,
                authEndpoint: '/broadcasting/auth',
                auth: {
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        'Accept': 'application/json',
                    },
                },
                activityTimeout: 120000,
                pongTimeout: 30000,
                unavailableTimeout: 10000,
            });

            // Add connection event listeners for debugging
            if (window.Echo?.connector?.pusher?.connection) {
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
            }

        }).catch((error) => {
            console.error('❌ Failed to initialize Echo:', error);
            console.warn('⚠️ Real-time features will not be available');
        });

    } catch (error) {
        console.error('❌ Echo initialization error:', error);
        console.warn('⚠️ Real-time features will not be available');
    }
}, 1000); // Increased delay to ensure app is fully rendered
