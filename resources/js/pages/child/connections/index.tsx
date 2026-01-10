import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageCircle, Calendar, Gamepad2, Users, Star } from 'lucide-react';
import HelperCard from '@/components/child/helper-card';
import StatsCard from '@/components/child/stats-card';
import EncouragementMessage from '@/components/child/encouragement-message';

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

interface Guardian {
    id: number;
    name: string;
    has_same_therapists: boolean;
}

interface Stats {
    total_therapists: number;
    available_now: number;
    recent_chats: number;
    upcoming_appointments: number;
}

interface Props {
    therapists: Connection[];
    guardian?: Guardian;
    stats: Stats;
    encouragement_message: string;
}

export default function ChildConnectionsIndex({ therapists, guardian, stats, encouragement_message }: Props) {

    return (
        <>
            <Head title="My Helpers" />

            <div className="space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">My Helpers 🌟</h1>
                    <EncouragementMessage
                        message={encouragement_message}
                        type={therapists.length === 0 ? 'no-helpers' : 'default'}
                    />
                </div>

                {/* Fun Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatsCard
                        title="My Helpers"
                        value={stats.total_therapists}
                        icon={Users}
                        color="blue"
                    />
                    <StatsCard
                        title="Available Now"
                        value={stats.available_now}
                        icon={Star}
                        color="green"
                        emoji="🟢"
                    />
                    <StatsCard
                        title="Messages This Week"
                        value={stats.recent_chats}
                        icon={MessageCircle}
                        color="purple"
                        emoji="💬"
                    />
                    <StatsCard
                        title="Coming Up"
                        value={stats.upcoming_appointments}
                        icon={Calendar}
                        color="orange"
                        emoji="📅"
                    />
                </div>

                {/* Guardian Information */}
                {guardian && (
                    <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <Heart className="h-6 w-6 text-pink-600" />
                                <div>
                                    <p className="font-medium text-pink-800">
                                        {guardian.name} is taking care of you
                                    </p>
                                    {guardian.has_same_therapists && (
                                        <p className="text-sm text-pink-600">
                                            You share some helpers with {guardian.name}! 💕
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
                }

                {/* Therapist Connections */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Your Helpers</h2>

                    {therapists.length === 0 ? (
                        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Heart className="h-16 w-16 text-yellow-500 mb-4" />
                                <h3 className="text-lg font-semibold mb-2 text-yellow-800">No Helpers Yet</h3>
                                <p className="text-yellow-700 text-center mb-4">
                                    {guardian?.name || 'Your guardian'} is working on finding someone special to help you!
                                    They care about you very much. 💛
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {therapists.map((connection) => (
                                <HelperCard
                                    key={connection.id}
                                    connection={connection}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Helpful Tips */}
                <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
                    <CardHeader>
                        <CardTitle className="text-indigo-800 flex items-center gap-2">
                            <Star className="h-5 w-5" />
                            Remember
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-indigo-700">
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-500 mt-1">•</span>
                                Your helpers are here because they care about you
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-500 mt-1">•</span>
                                You can talk to them about anything that makes you happy or worried
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-500 mt-1">•</span>
                                It's okay to ask questions - they want to help you understand
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-500 mt-1">•</span>
                                You are important and your feelings matter
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div >
        </>
    );
}