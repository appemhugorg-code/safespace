<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'SafeSpace') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        {{-- Loading fallback to prevent black screen --}}
        <div id="app-loading" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: oklch(1 0 0);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: 'Instrument Sans', sans-serif;
        ">
            <div style="text-align: center;">
                <div style="
                    width: 40px;
                    height: 40px;
                    border: 3px solid #e5e7eb;
                    border-top: 3px solid #3b82f6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 16px;
                "></div>
                <p style="color: #6b7280; margin: 0;">Loading SafeSpace...</p>
            </div>
        </div>

        {{-- Dark mode styles for loading screen --}}
        <style>
            html.dark #app-loading {
                background-color: oklch(0.145 0 0) !important;
            }
            html.dark #app-loading p {
                color: #9ca3af !important;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>

        @inertia

        {{-- Hide loading screen once React app is ready --}}
        <script>
            // Hide loading screen once the React app has rendered
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(function() {
                    const loadingElement = document.getElementById('app-loading');
                    if (loadingElement) {
                        loadingElement.style.opacity = '0';
                        loadingElement.style.transition = 'opacity 0.3s ease-out';
                        setTimeout(function() {
                            loadingElement.remove();
                        }, 300);
                    }
                }, 500); // Give React time to render
            });
        </script>
    </body>
</html>
