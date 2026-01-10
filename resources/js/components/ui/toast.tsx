import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToastProps {
    id: string;
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive' | 'success';
    onClose: (id: string) => void;
}

export function Toast({ id, title, description, variant = 'default', onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 5000);

        return () => clearTimeout(timer);
    }, [id, onClose]);

    const getIcon = () => {
        switch (variant) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'destructive':
                return <AlertCircle className="h-5 w-5 text-red-600" />;
            default:
                return <Info className="h-5 w-5 text-blue-600" />;
        }
    };

    const getStyles = () => {
        switch (variant) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'destructive':
                return 'bg-red-50 border-red-200 text-red-800';
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    return (
        <div className={`${getStyles()} border rounded-lg p-4 shadow-lg mb-2 animate-in slide-in-from-right duration-300`}>
            <div className="flex items-start gap-3">
                {getIcon()}
                <div className="flex-1">
                    {title && <div className="font-semibold">{title}</div>}
                    {description && <div className="text-sm opacity-90">{description}</div>}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onClose(id)}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export function ToastContainer() {
    const { toasts, dismiss } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 w-80">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    title={toast.title}
                    description={toast.description}
                    variant={toast.variant}
                    onClose={dismiss}
                />
            ))}
        </div>
    );
}

// Import the hook here to avoid circular dependency
import { useToast } from '@/hooks/use-toast';