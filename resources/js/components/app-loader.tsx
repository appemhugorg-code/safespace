import { useEffect, useState } from 'react';

export function AppLoader() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Hide the server-side loading screen
        const serverLoader = document.getElementById('app-loading');
        if (serverLoader) {
            serverLoader.style.opacity = '0';
            serverLoader.style.transition = 'opacity 0.3s ease-out';
            setTimeout(() => {
                serverLoader.remove();
            }, 300);
        }

        // Hide this React loader after a short delay
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="text-center">
                <div className="w-10 h-10 border-3 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Loading SafeSpace...</p>
            </div>
        </div>
    );
}