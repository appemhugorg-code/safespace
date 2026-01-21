import { useState, useCallback } from 'react';

interface Toast {
    id: string;
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive' | 'success';
    duration?: number;
}

let toastCounter = 0;
const toastListeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

function addToast(toast: Omit<Toast, 'id'>) {
    const id = (++toastCounter).toString();
    const newToast = { ...toast, id };
    toasts = [...toasts, newToast];
    
    // Notify all listeners
    toastListeners.forEach(listener => listener(toasts));
    
    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
        removeToast(id);
    }, duration);
    
    return id;
}

function removeToast(id: string) {
    toasts = toasts.filter(toast => toast.id !== id);
    toastListeners.forEach(listener => listener(toasts));
}

// Standalone toast function for direct import
export const toast = ({ title, description, variant = 'default', duration }: Omit<Toast, 'id'>) => {
    return addToast({ title, description, variant, duration });
};

export function useToast() {
    const [toastList, setToastList] = useState<Toast[]>(toasts);
    
    // Subscribe to toast updates
    const subscribe = useCallback((listener: (toasts: Toast[]) => void) => {
        toastListeners.push(listener);
        return () => {
            const index = toastListeners.indexOf(listener);
            if (index > -1) {
                toastListeners.splice(index, 1);
            }
        };
    }, []);
    
    // Subscribe this component to updates
    useState(() => {
        const unsubscribe = subscribe(setToastList);
        return unsubscribe;
    });
    
    const toastFn = useCallback(({ title, description, variant = 'default', duration }: Omit<Toast, 'id'>) => {
        return addToast({ title, description, variant, duration });
    }, []);
    
    const dismiss = useCallback((id: string) => {
        removeToast(id);
    }, []);
    
    return {
        toast: toastFn,
        dismiss,
        toasts: toastList,
    };
}
