import { createContext, useContext, useState, ReactNode } from 'react';
import ToastNotification from './toast-notification';

interface Toast {
    id: number;
    title: string;
    message: string;
    icon: string;
    priority: string;
}

interface ToastContextType {
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [nextId, setNextId] = useState(1);

    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = nextId;
        setNextId(prev => prev + 1);
        setToasts(prev => [...prev, { ...toast, id }]);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
                {toasts.map(toast => (
                    <ToastNotification
                        key={toast.id}
                        id={toast.id}
                        title={toast.title}
                        message={toast.message}
                        icon={toast.icon}
                        priority={toast.priority}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}
