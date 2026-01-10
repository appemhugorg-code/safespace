import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, Sparkles } from 'lucide-react';

interface EncouragementMessageProps {
    message: string;
    type?: 'default' | 'no-helpers' | 'celebration';
}

export default function EncouragementMessage({ message, type = 'default' }: EncouragementMessageProps) {
    const getConfig = () => {
        switch (type) {
            case 'no-helpers':
                return {
                    bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
                    border: 'border-yellow-200',
                    textColor: 'text-yellow-800',
                    icon: <Heart className="h-8 w-8 text-yellow-500" />,
                    emoji: '💛'
                };
            case 'celebration':
                return {
                    bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
                    border: 'border-green-200',
                    textColor: 'text-green-800',
                    icon: <Star className="h-8 w-8 text-green-500" />,
                    emoji: '🎉'
                };
            default:
                return {
                    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
                    border: 'border-blue-200',
                    textColor: 'text-blue-800',
                    icon: <Sparkles className="h-8 w-8 text-blue-500" />,
                    emoji: '✨'
                };
        }
    };

    const config = getConfig();

    return (
        <Card className={`${config.bg} ${config.border} shadow-sm`}>
            <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        {config.icon}
                    </div>
                    <div className="flex-1">
                        <p className={`text-lg font-medium ${config.textColor} leading-relaxed`}>
                            {message} {config.emoji}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}