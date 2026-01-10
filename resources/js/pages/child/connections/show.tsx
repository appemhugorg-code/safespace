import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Heart,
    MessageCircle,
    Calendar,
    Gamepad2,
    Clock,
    Star,
    ArrowLeft,
    Shield,
    Smile
} from 'lucide-react';
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
    duration_days: number;
    is_available: boolean;
    availability_schedule: Array<{
        day: string;
        time: string;
        is_today: boolean;
    }>;
    recent_activities: Array<{
        type: string;
        description: string;
        date: string;
        icon: string;
    }>;
    mood_sharing_enabled: boolean;
}

interface CommunicationOptions {
    can_send_message: boolean;
    can_schedule_appointment: boolean;
    can_view_mood_together: boolean;
    emergency_contact: boolean;
}

interface Props {
    connection: Connection;
    communication_options: CommunicationOptions;
    helpful_tips: string[];
}

export default function ChildConnectionShow({ connection, communication_options, helpful_tips }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatRecentDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getActivityIcon = (type: string) => {
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
        <>
            <Head title={`About ${connection.therapist.friendly_name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/child/connections">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to My Helpers
                        </Link>
                    </Button>
                </div>

                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">
                        About {connection.therapist.friendly_name} ✨
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2">
                        {connection.therapist.description}
                    </p>
                </div>

                {/* Main Info Card */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl text-blue-800">
                                    {connection.therapist.friendly_name}
                                </CardTitle>
                                <CardDescription className="text-blue-600 text-lg mt-1">
                                    Your Helper Since {formatDate(connection.assigned_at)}
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                {connection.is_available && (
                                    <Badge className="bg-green-100 text-green-800 border-green-300">
                                        Available Now! 🟢
                                    </Badge>
                                )}
                                {communication_options.emergency_contact && (
                                    <Badge className="bg-red-100 text-red-800 border-red-300">
                                        <Shield className="w-3 h-3 mr-1" />
                                        Emergency Helper
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    When {connection.therapist.friendly_name} is Available
                                </h3>
                                <div className="space-y-2">
                                    {connection.availability_schedule.length === 0 ? (
                                        <p className="text-blue-600">Ask your guardian about scheduling!</p>
                                    ) : (
                                        connection.availability_schedule.map((schedule, index) => (
                                            <div
                                                key={index}
                                                className={`flex justify-between p-2 rounded ${schedule.is_today ? 'bg-blue-100 border border-blue-300' : 'bg-white/50'
                                                    }`}
                                            >
                                                <span className="font-medium">
                                                    {schedule.day} {schedule.is_today && '(Today!)'}
                                                </span>
                                                <span>{schedule.time}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <Heart className="w-4 h-4" />
                                    What You Can Do Together
                                </h3>
                                <div className="space-y-2">
                                    {communication_options.can_send_message && (
                                        <div className="flex items-center gap-2 text-blue-700">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>Send messages anytime</span>
                                        </div>
                                    )}
                                    {communication_options.can_schedule_appointment && (
                                        <div className="flex items-center gap-2 text-blue-700">
                                            <Calendar className="w-4 h-4" />
                                            <span>Schedule time to talk</span>
                                        </div>
                                    )}
                                    {communication_options.can_view_mood_together && (
                                        <div className="flex items-center gap-2 text-blue-700">
                                            <Smile className="w-4 h-4" />
                                            <span>Share how you're feeling</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-blue-700">
                                        <Gamepad2 className="w-4 h-4" />
                                        <span>Play helpful games together</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="grid md:grid-cols-4 gap-4">
                    {communication_options.can_send_message && (
                        <Button
                            className="h-20 bg-blue-500 hover:bg-blue-600 flex-col gap-2"
                            onClick={() => {
                                window.location.href = `/child/therapist/${connection.therapist.id}/message`;
                            }}
                        >
                            <MessageCircle className="w-6 h-6" />
                            <span>Send Message</span>
                        </Button>
                    )}
                    {communication_options.can_schedule_appointment && (
                        <Button
                            variant="outline"
                            className="h-20 border-green-300 text-green-700 hover:bg-green-50 flex-col gap-2"
                            onClick={() => {
                                window.location.href = `/child/therapist/${connection.therapist.id}/appointment`;
                            }}
                        >
                            <Calendar className="w-6 h-6" />
                            <span>Schedule Time</span>
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        className="h-20 border-purple-300 text-purple-700 hover:bg-purple-50 flex-col gap-2"
                        onClick={() => {
                            window.location.href = '/games';
                        }}
                    >
                        <Gamepad2 className="w-6 h-6" />
                        <span>Play Games</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-20 border-pink-300 text-pink-700 hover:bg-pink-50 flex-col gap-2"
                        onClick={() => {
                            window.location.href = '/mood';
                        }}
                    >
                        <Smile className="w-6 h-6" />
                        <span>Share Mood</span>
                    </Button>
                </div>

                {/* Recent Activities */}
                {connection.recent_activities.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500" />
                                Recent Times Together
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {connection.recent_activities.map((activity, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="text-primary">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{activity.description}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatRecentDate(activity.date)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Mood Sharing Info */}
                {connection.mood_sharing_enabled && (
                    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <Smile className="h-6 w-6 text-yellow-600 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-yellow-800 mb-2">
                                        {connection.therapist.friendly_name} Can See Your Mood Entries
                                    </h3>
                                    <p className="text-yellow-700">
                                        When you track how you're feeling, {connection.therapist.friendly_name} can see it too!
                                        This helps them understand how to best help you. Your feelings are important! 💛
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Helpful Tips */}
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <CardHeader>
                        <CardTitle className="text-green-800 flex items-center gap-2">
                            <Heart className="h-5 w-5" />
                            Remember These Important Things
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3 text-green-700">
                            {helpful_tips.map((tip, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1 text-lg">•</span>
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Connection Stats */}
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <h3 className="font-semibold text-purple-800 mb-2">
                                You've been connected for {connection.duration_days} days! 🎉
                            </h3>
                            <p className="text-purple-700">
                                That's {Math.floor(connection.duration_days / 7)} weeks of having {connection.therapist.friendly_name} as your helper!
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}