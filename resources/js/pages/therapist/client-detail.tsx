import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, MessageCircle, TrendingUp, User, Phone, Mail, Clock, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';

interface Guardian {
    id: number;
    name: string;
    email: string;
}

interface MoodLog {
    id: number;
    mood: string;
    mood_date: string;
    note: string | null;
    created_at: string;
}

interface Appointment {
    id: number;
    scheduled_at: string;
    duration_minutes: number;
    status: string;
    notes: string | null;
    therapist_notes: string | null;
}

interface Client {
    id: number;
    name: string;
    email: string;
    status: string;
    guardian: Guardian | null;
    mood_logs: MoodLog[];
}

interface Stats {
    total_appointments: number;
    completed_appointments: number;
    upcoming_appointments: number;
    cancelled_appointments: number;
    mood_entries_count: number;
    mood_streak: number;
}

interface Props {
    client: Client;
    appointments: Appointment[];
    stats: Stats;
}

export default function ClientDetail({ client, appointments, stats }: Props) {
    const getMoodEmoji = (mood: string) => {
        const moodEmojis = {
            'very_happy': '😄',
            'happy': '😊',
            'neutral': '😐',
            'sad': '😢',
            'very_sad': '😭',
        };
        return moodEmojis[mood as keyof typeof moodEmojis] || '😐';
    };

    const getMoodColor = (mood: string) => {
        const moodColors = {
            'very_happy': 'bg-green-100 text-green-800',
            'happy': 'bg-green-50 text-green-700',
            'neutral': 'bg-gray-100 text-gray-800',
            'sad': 'bg-orange-100 text-orange-800',
            'very_sad': 'bg-red-100 text-red-800',
        };
        return moodColors[mood as keyof typeof moodColors] || 'bg-gray-100 text-gray-800';
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            'confirmed': { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
            'completed': { color: 'bg-green-100 text-green-800', label: 'Completed' },
            'cancelled': { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
            'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
        };
        
        const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-100 text-gray-800', label: status };
        return <Badge className={config.color}>{config.label}</Badge>;
    };

    return (
        <AppLayout>
            <Head title={`${client.name} - Client Details`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/clients">
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Clients
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">{client.name}</h1>
                            <p className="text-muted-foreground">
                                Client Details and Progress Overview
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href={`/messages/conversation/${client.id}`}>
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Message Client
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/appointments/create?child=${client.id}`}>
                                <Calendar className="w-4 h-4 mr-2" />
                                Schedule Appointment
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Client Overview */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Client Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Client Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-lg font-semibold text-blue-600">
                                        {client.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold">{client.name}</h3>
                                    <p className="text-sm text-muted-foreground">{client.email}</p>
                                </div>
                            </div>

                            {client.guardian && (
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">Guardian Information</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{client.guardian.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{client.guardian.email}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Progress Statistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{stats.total_appointments}</div>
                                    <div className="text-xs text-muted-foreground">Total Sessions</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{stats.completed_appointments}</div>
                                    <div className="text-xs text-muted-foreground">Completed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">{stats.upcoming_appointments}</div>
                                    <div className="text-xs text-muted-foreground">Upcoming</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{stats.mood_entries_count}</div>
                                    <div className="text-xs text-muted-foreground">Mood Entries</div>
                                </div>
                            </div>

                            {stats.mood_streak > 0 && (
                                <div className="border-t pt-4">
                                    <div className="text-center">
                                        <div className="text-lg font-semibold">🔥 {stats.mood_streak} Days</div>
                                        <div className="text-sm text-muted-foreground">Mood tracking streak</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Mood */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Mood Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {client.mood_logs.slice(0, 7).map((mood) => (
                                    <div key={mood.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{getMoodEmoji(mood.mood)}</span>
                                            <div>
                                                <div className="text-sm font-medium">
                                                    {new Date(mood.mood_date).toLocaleDateString()}
                                                </div>
                                                {mood.note && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {mood.note}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Badge className={getMoodColor(mood.mood)}>
                                            {mood.mood.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Tabs */}
                <Tabs defaultValue="appointments" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="appointments">Appointments</TabsTrigger>
                        <TabsTrigger value="mood-history">Mood History</TabsTrigger>
                        <TabsTrigger value="notes">Session Notes</TabsTrigger>
                    </TabsList>

                    {/* Appointments Tab */}
                    <TabsContent value="appointments">
                        <Card>
                            <CardHeader>
                                <CardTitle>Appointment History</CardTitle>
                                <CardDescription>
                                    Complete history of appointments with this client
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {appointments.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No appointments yet</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Schedule your first appointment with this client
                                        </p>
                                        <Button asChild>
                                            <Link href={`/appointments/create?child=${client.id}`}>
                                                <Calendar className="h-4 w-4 mr-2" />
                                                Schedule Appointment
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {appointments.map((appointment) => (
                                            <Card key={appointment.id} className="border-l-4 border-l-blue-500">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                                <div>
                                                                    <div className="font-medium">
                                                                        {new Date(appointment.scheduled_at).toLocaleDateString()} at{' '}
                                                                        {new Date(appointment.scheduled_at).toLocaleTimeString([], {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </div>
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {appointment.duration_minutes} minutes
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {appointment.notes && (
                                                                <div className="mt-2">
                                                                    <h5 className="text-sm font-medium mb-1">Session Notes:</h5>
                                                                    <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                                                                </div>
                                                            )}

                                                            {appointment.therapist_notes && (
                                                                <div className="mt-2">
                                                                    <h5 className="text-sm font-medium mb-1">Therapist Notes:</h5>
                                                                    <p className="text-sm text-muted-foreground">{appointment.therapist_notes}</p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="ml-4">
                                                            {getStatusBadge(appointment.status)}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Mood History Tab */}
                    <TabsContent value="mood-history">
                        <Card>
                            <CardHeader>
                                <CardTitle>Complete Mood History</CardTitle>
                                <CardDescription>
                                    Detailed mood tracking history for this client
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {client.mood_logs.length === 0 ? (
                                    <div className="text-center py-8">
                                        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No mood data yet</h3>
                                        <p className="text-muted-foreground">
                                            Encourage your client to start tracking their daily mood
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {client.mood_logs.map((mood) => (
                                            <Card key={mood.id} className="border-l-4 border-l-purple-500">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl">{getMoodEmoji(mood.mood)}</span>
                                                            <div>
                                                                <div className="font-medium">
                                                                    {new Date(mood.mood_date).toLocaleDateString()}
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {new Date(mood.created_at).toLocaleTimeString([], {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </div>
                                                                {mood.note && (
                                                                    <div className="text-sm mt-1">
                                                                        <span className="font-medium">Note:</span> {mood.note}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Badge className={getMoodColor(mood.mood)}>
                                                            {mood.mood.replace('_', ' ')}
                                                        </Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Session Notes Tab */}
                    <TabsContent value="notes">
                        <Card>
                            <CardHeader>
                                <CardTitle>Session Notes & Observations</CardTitle>
                                <CardDescription>
                                    Private notes and observations from therapy sessions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {appointments.filter(apt => apt.therapist_notes).length === 0 ? (
                                        <div className="text-center py-8">
                                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">No session notes yet</h3>
                                            <p className="text-muted-foreground">
                                                Session notes will appear here after appointments are completed
                                            </p>
                                        </div>
                                    ) : (
                                        appointments
                                            .filter(apt => apt.therapist_notes)
                                            .map((appointment) => (
                                                <Card key={appointment.id} className="border-l-4 border-l-green-500">
                                                    <CardContent className="p-4">
                                                        <div className="mb-2">
                                                            <div className="font-medium">
                                                                Session: {new Date(appointment.scheduled_at).toLocaleDateString()}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {appointment.duration_minutes} minutes • {appointment.status}
                                                            </div>
                                                        </div>
                                                        <div className="text-sm">
                                                            {appointment.therapist_notes}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}