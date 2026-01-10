import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Calendar, Gamepad2, Star } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Therapist {
    id: number;
    name: string;
    friendly_name: string;
    description: string;
    status: string;
}

interface Connection {
    id: number;
    therapist: Therapist;
    connection_type: string;
    assigned_at: string;
    is_available: boolean;
    can_chat: boolean;
    can_schedule: boolean;
    last_interaction?: {
        type: string;
        date: string;
        description: string;
    };
}

interface HelperCardProps {
    connection: Connection;
    onSendMessage?: () => void;
    onScheduleTime?: () => void;
    onPlayGames?: () => void;
}

export default function HelperCard({
    connection,
    onSendMessage,
    onScheduleTime,
    onPlayGames
}: HelperCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const getLastInteractionIcon = (type: string) => {
        switch (type) {
            case 'message':
                return <MessageCircle className="w-4 h-4" />;
            case 'appointment':
                return <Calendar className="w-4 h-4" />;
            default:
                return <Heart className="w-4 h-4" />;
        }
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-gradient-to-br from-white to-blue-50/30 border-blue-200">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl text-primary flex items-center gap-2">
                            {connection.therapist.friendly_name}
                            <Star className="w-5 h-5 text-yellow-500" />
                        </CardTitle>
                        <CardDescription className="text-base mt-1 text-blue-700">
                            {connection.therapist.description}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        {connection.is_available && (
                            <Badge className="bg-green-100 text-green-800 border-green-300 animate-pulse">
                                Available Now! 🟢
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Last Interaction */}
                    {connection.last_interaction && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 p-2 rounded-lg">
                            {getLastInteractionIcon(connection.last_interaction.type)}
                            <span>
                                {connection.last_interaction.description} on {formatDate(connection.last_interaction.date)}
                            </span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                        {connection.can_chat && (
                            <Button
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg transition-all"
                                onClick={() => {
                                    window.location.href = `/child/therapist/${connection.therapist.id}/message`;
                                }}
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Send Message 💬
                            </Button>
                        )}
                        {connection.can_schedule && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-green-300 text-green-700 hover:bg-green-50 shadow-sm hover:shadow-md transition-all"
                                onClick={() => {
                                    window.location.href = `/child/therapist/${connection.therapist.id}/appointment`;
                                }}
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Schedule Time 📅
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-purple-300 text-purple-700 hover:bg-purple-50 shadow-sm hover:shadow-md transition-all"
                            onClick={() => {
                                window.location.href = '/games';
                            }}
                        >
                            <Gamepad2 className="w-4 h-4 mr-2" />
                            Play Games 🎮
                        </Button>
                    </div>

                    {/* View Details Button */}
                    <div className="flex justify-end">
                        <Button
                            variant="ghost"
                            asChild
                            className="text-primary hover:text-primary/80 hover:bg-blue-50 transition-all"
                        >
                            <Link href={`/child/connections/${connection.id}`}>
                                Learn More About {connection.therapist.friendly_name} →
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}