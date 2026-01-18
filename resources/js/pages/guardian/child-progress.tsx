import { Head } from '@inertiajs/react';
import { ArrowLeft, User, TrendingUp, Calendar, MessageSquare, Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';

interface Child {
    id: number;
    name: string;
    email: string;
    status: string;
}

interface MoodLog {
    id: number;
    mood: string;
    mood_date: string;
    mood_display: string;
    mood_emoji: string;
}

interface Appointment {
    id: number;
    scheduled_at: string;
    status: string;
    therapist: {
        name: string;
    };
}

interface ProgressData {
    mood_logs_count: number;
    recent_mood_logs: MoodLog[];
    appointments_count: number;
    recent_appointments: Appointment[];
    messages_count: number;
}

interface Props {
    child: Child;
    progressData: ProgressData;
}

export default function ChildProgress({ child, progressData }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
            case 'requested':
                return <Badge className="bg-yellow-100 text-yellow-800">Requested</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
            case 'completed':
                return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title={`${child.name}'s Progress`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div className="flex items-center gap-3">
                        <User className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold">{child.name}'s Progress</h1>
                            <p className="text-muted-foreground">
                                Overview of your child's activity and engagement
                            </p>
                        </div>
                    </div>
                </div>

                {/* Progress Overview Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="h-5 w-5 text-red-500" />
                                Mood Tracking
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-2">{progressData.mood_logs_count}</div>
                            <p className="text-sm text-muted-foreground mb-4">Total mood entries</p>

                            {progressData.recent_mood_logs.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Recent moods:</p>
                                    <div className="flex gap-1">
                                        {progressData.recent_mood_logs.slice(0, 7).map((mood) => (
                                            <div key={mood.id} className="text-lg" title={`${mood.mood_display} - ${new Date(mood.mood_date).toLocaleDateString()}`}>
                                                {mood.mood_emoji}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-blue-500" />
                                Appointments
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-2">{progressData.appointments_count}</div>
                            <p className="text-sm text-muted-foreground mb-4">Total appointments</p>

                            {progressData.recent_appointments.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Recent appointments:</p>
                                    <div className="space-y-1">
                                        {progressData.recent_appointments.slice(0, 3).map((appointment) => (
                                            <div key={appointment.id} className="text-xs">
                                                <div className="flex items-center justify-between">
                                                    <span>{appointment.therapist.name}</span>
                                                    {getStatusBadge(appointment.status)}
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {new Date(appointment.scheduled_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-green-500" />
                                Communication
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-2">{progressData.messages_count}</div>
                            <p className="text-sm text-muted-foreground">Total messages</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Sections */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Recent Mood Trends */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Recent Mood Trends
                            </CardTitle>
                            <CardDescription>
                                Last 7 mood entries from {child.name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {progressData.recent_mood_logs.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    No mood entries yet. Encourage {child.name} to start tracking their mood daily.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {progressData.recent_mood_logs.map((mood) => (
                                        <div key={mood.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{mood.mood_emoji}</span>
                                                <div>
                                                    <div className="font-medium">{mood.mood_display}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {new Date(mood.mood_date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Appointments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Recent Appointments
                            </CardTitle>
                            <CardDescription>
                                Latest therapeutic sessions and consultations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {progressData.recent_appointments.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    No appointments scheduled yet.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {progressData.recent_appointments.map((appointment) => (
                                        <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <div className="font-medium">{appointment.therapist.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(appointment.scheduled_at).toLocaleString()}
                                                </div>
                                            </div>
                                            {getStatusBadge(appointment.status)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Action Buttons */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Access detailed views and manage {child.name}'s account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <Button asChild>
                                <a href={`/child/${child.id}/mood`}>
                                    View Detailed Mood History
                                </a>
                            </Button>
                            <Button variant="outline" asChild>
                                <a href={`/guardian/children/${child.id}`}>
                                    View Full Profile
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}