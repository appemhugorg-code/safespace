import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    MessageSquare,
    AlertTriangle,
    CheckCircle,
    FileText,
    MessageCircle,
    Megaphone,
    Bell,
} from 'lucide-react';

interface ToastNotificationProps {
    id: number;
    title: string;
    message: string;
    icon: string;
    priority: string;
    onClose: (id: number) => void;
    duration?: number;
}

const iconMap: Record<string, any> = {
    calendar: Calendar,
    message: MessageSquare,
    'alert-triangle': AlertTriangle,
    'check-circle': CheckCircle,
    'file-text': FileText,
    'message-square': MessageCircle,
    megaphone: Megaphone,
    bell: Bell,
};

const priorityStyles = {
    low: 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600',
    normal: 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700',
    high: 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700',
    urgent: 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700',
};

const iconColors = {
    low: 'text-gray-600 dark:text-gray-400',
    normal: 'text-blue-600 dark:text-blue-400',
    high: 'text-orange-600 dark:text-orange-400',
    urgent: 'text-red-600 dark:text-red-400',
};

export default function ToastNotification({
    id,
    title,
    message,
    icon,
    priority,
    onClose,
    duration = 5000,
}: ToastNotificationProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Trigger slide-in animation
        setTimeout(() => setIsVisible(true), 10);

        // Auto-dismiss after duration
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose(id);
        }, 300); // Match animation duration
    };

    const getIcon = (iconName: string) => {
        const IconComponent = iconMap[iconName] || Bell;
        return <IconComponent className="h-5 w-5" />;
    };

    const priorityStyle = priorityStyles[priority as keyof typeof priorityStyles] || priorityStyles.normal;
    const iconColor = iconColors[priority as keyof typeof iconColors] || iconColors.normal;

    return (
        <div
            className={`
                ${priorityStyle}
                border-2 rounded-lg shadow-lg p-4 mb-3 w-80
                transition-all duration-300 ease-out
                ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
        >
            <div className="flex gap-3">
                {/* Icon */}
                <div className={`flex-shrink-0 ${iconColor}`}>
                    {getIcon(icon)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {message}
                    </p>
                </div>

                {/* Close Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0"
                    onClick={handleClose}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
