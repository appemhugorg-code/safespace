import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    color: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'yellow';
    emoji?: string;
}

const colorClasses = {
    blue: {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
        border: 'border-blue-200',
        titleColor: 'text-blue-700',
        valueColor: 'text-blue-800',
        iconColor: 'text-blue-600'
    },
    green: {
        bg: 'bg-gradient-to-br from-green-50 to-green-100',
        border: 'border-green-200',
        titleColor: 'text-green-700',
        valueColor: 'text-green-800',
        iconColor: 'text-green-600'
    },
    purple: {
        bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
        border: 'border-purple-200',
        titleColor: 'text-purple-700',
        valueColor: 'text-purple-800',
        iconColor: 'text-purple-600'
    },
    orange: {
        bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
        border: 'border-orange-200',
        titleColor: 'text-orange-700',
        valueColor: 'text-orange-800',
        iconColor: 'text-orange-600'
    },
    pink: {
        bg: 'bg-gradient-to-br from-pink-50 to-pink-100',
        border: 'border-pink-200',
        titleColor: 'text-pink-700',
        valueColor: 'text-pink-800',
        iconColor: 'text-pink-600'
    },
    yellow: {
        bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
        border: 'border-yellow-200',
        titleColor: 'text-yellow-700',
        valueColor: 'text-yellow-800',
        iconColor: 'text-yellow-600'
    }
};

export default function StatsCard({ title, value, icon: Icon, color, emoji }: StatsCardProps) {
    const classes = colorClasses[color];

    return (
        <Card className={`${classes.bg} ${classes.border} hover:shadow-md transition-shadow`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${classes.titleColor}`}>
                    {title} {emoji}
                </CardTitle>
                <Icon className={`h-6 w-6 ${classes.iconColor}`} />
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${classes.valueColor}`}>
                    {value}
                </div>
            </CardContent>
        </Card>
    );
}