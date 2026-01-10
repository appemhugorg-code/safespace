import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';

interface Props {
    initialCount?: number;
    className?: string;
}

export default function PanicAlertBadge({ initialCount = 0, className = '' }: Props) {
    const [unviewedCount, setUnviewedCount] = useState(initialCount);

    useEffect(() => {
        // Poll for updates every 30 seconds
        const interval = setInterval(async () => {
            try {
                const response = await fetch('/api/panic-alerts/unviewed-count');
                const data = await response.json();
                setUnviewedCount(data.count);
            } catch (error) {
                console.error('Failed to fetch unviewed panic alerts count:', error);
            }
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    if (unviewedCount === 0) {
        return null;
    }

    return (
        <Link href="/panic-alerts" className={`relative inline-flex ${className}`}>
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <Badge
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-600 text-white text-xs"
            >
                {unviewedCount > 99 ? '99+' : unviewedCount}
            </Badge>
        </Link>
    );
}
