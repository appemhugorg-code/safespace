import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, User, Calendar, MessageCircle, Eye, Heart, TrendingUp, TrendingDown, Minus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';

interface Client {
    id: number;
    name: string;
    email: string;
    status: string;
    client_type: string;
}

interface AssignedBy {
    id: number;
    name: string;
}

interface Guardian {
    id: number;
    name: string;
    email: string;
}

interface MoodEntry {
    mood: string;
    mood_date: string;
    created_at: string;
}

interface Appointment {
    id: number;
    scheduled_at: string;
    status: string;
    notes?: string;
}

interface Connection {
    id: number;
    client: Client;
    connection_type: string;
    status: string;
    assigned_at: string;
    terminated_at?: string;
    assigned_by: AssignedBy | null;
    duration_days: number;
    child_data?: {
        age?: number;
        guardian: Guardian | null;
        mood_data: {
            recent_moods: MoodEntry[];
            trend: 'improving' | 'declining' | 'stable';
            streak: number;
        };
        appointments: Appointment[];
    };
    guardian_data?: {
        phone?: string;
        children_count: number;
        recent_activity: {
            last_login?: string;
            recent_messages: number;
            recent_appointments: number;
        };
    };
}

interface Props {
    connection: Connection;
}

export default function TherapistConnectionShow({ connection }: Props) {
    const getConnectionTypeBadge = (type: string) => {
        switch (type) {
            case 'admin_assigned':
                return <Badge className="bg-blue-100 text-blue-800">Admin Assigned</Badge>;
            case 'guardian_requested':
                return <Badge className="bg-green-100 text-green-800">Guardian Requested</Badge>;
            case 'guardian_child_assignment':
                return <Badge className="bg-purple-100 text-purple-800">Child Assignment</Badge>;
            default:
                return <Badge>{type}</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800">Active</Badge>;
            case 'terminated':
                return <Badge className="bg-red-100 text-red-800">Terminated</Badge>;
            case 'inactive':
                return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

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

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'improving':
                return <TrendingUp className="h-4 w-4 text-green-600" />;
            case 'declining':
                return <TrendingDown className="h-4 w-4 text-red-600" />;
            default:
                return <Minus className="h-4 w-4 text-gray-600" />;
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'improving':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'declining':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const isChildConnection = connection.client.client_type === 'child';

    return (
        <AppLayout>
            <Head title={`Connection: ${connection.client.name}`} />

            <div className="container-mobile space-y-6 sm:space-y-8 py-4 sm:py-6 animate-fade-in">
                <div className="animate-slide-up">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/therapist/connections">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                                    Connection Details
                                </h1>
                                <p className="text-muted-foreground">
                                    {connection.client.name} - {isChildConnection ? 'Child' : 'Guardian'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {getStatusBadge(connection.status)}
                            {getConnectionTypeBadge(connection.connection_type)}
                        </div>
                    </div>
                </div>

                {/* Client Overview */}
                <Card className="animate-scale-in">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {isChildConnection ? 'Child' : 'Guardian'} Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start gap-6">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl font-semibold text-blue-600">
                                    {connection.client.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">{connection.client.name}</h3>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p><strong>Email:</strong> {connection.client.email}</p>
                                        <p><strong>Status:</strong> {connection.client.status}</p>
                                        {isChildConnection && connection.child_data?.age && (
                                            <p><strong>Age:</strong> {connection.child_data.age}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p><strong>Connected:</strong> {new Date(connection.assigned_at).toLocaleDateString()}</p>
                                        <p><strong>Duration:</strong> {connection.duration_days} days</p>
                                        {connection.assigned_by && (
                                            <p><strong>Assigned by:</strong> {connection.assigned_by.name}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Guardian Information for Child Connections */}
                {isChildConnection && connection.child_data?.guardian && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Guardian Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-semibold">{connection.child_data.guardian.name}</p>
                                    <p className="text-sm text-muted-foreground">{connection.child_data.guardian.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href={`/messages/conversation/${connection.child_data.guardian.id}`}>
                                            <MessageCircle className="h-4 w-4 mr-2" />
                                            Message Guardian
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Tabs for detailed information */}
                <Tabs defaultValue="overview" className="animate-scale-in">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        {isChildConnection && <TabsTrigger value="mood">Mood Data</TabsTrigger>}
                        <TabsTrigger value="appointments">Sessions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Connection Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isChildConnection && connection.child_data ? (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold mb-2">Therapeutic Progress</h4>
                                            <div className="space-y-2 text-sm">
                                                <p>Total mood entries: {connection.child_data.mood_data.recent_moods.length}</p>
                                                <p>Current streak: {connection.child_data.mood_data.streak} days</p>
                                                <div className="flex items-center gap-2">
                                                    <span>Mood trend:</span>
                                                    <Badge className={`${getTrendColor(connection.child_data.mood_data.trend)} flex items-center gap-1`}>
                                                        {getTrendIcon(connection.child_data.mood_data.trend)}
                                                        {connection.child_data.mood_data.trend}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2">Session History</h4>
                                            <div className="space-y-2 text-sm">
                                                <p>Total appointments: {connection.child_data.appointments.length}</p>
                                                <p>Completed sessions: {connection.child_data.appointments.filter(a => a.status === 'completed').length}</p>
                                                <p>Upcoming sessions: {connection.child_data.appointments.filter(a => a.status === 'confirmed').length}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : connection.guardian_data ? (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold mb-2">Family Information</h4>
                                            <div className="space-y-2 text-sm">
                                                <p>Total children: {connection.guardian_data.children_count}</p>
                                                {connection.guardian_data.phone && (
                                                    <p>Phone: {connection.guardian_data.phone}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2">Recent Activity</h4>
                                            <div className="space-y-2 text-sm">
                                                <p>Recent messages: {connection.guardian_data.recent_activity.recent_messages}</p>
                                                <p>Recent appointments: {connection.guardian_data.recent_activity.recent_appointments}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No additional data available.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {isChildConnection && (
                        <TabsContent value="mood" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Heart className="h-5 w-5" />
                                        Mood Tracking
                                    </CardTitle>
                                    <CardDescription>
                                        Recent mood entries and emotional wellbeing trends
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {connection.child_data?.mood_data.recent_moods.length ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex gap-2">
                                                    {connection.child_data.mood_data.recent_moods.slice(0, 7).map((mood, index) => (
                                                        <div key={index} className="text-center">
                                                            <div className="text-2xl mb-1">{getMoodEmoji(mood.mood)}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {new Date(mood.mood_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Badge className={`${getTrendColor(connection.child_data.mood_data.trend)} flex items-center gap-1`}>
                                                    {getTrendIcon(connection.child_data.mood_data.trend)}
                                                    {connection.child_data.mood_data.trend}
                                                </Badge>
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="font-medium">Current Streak</p>
                                                    <p className="text-2xl font-bold text-orange-600">
                                                        {connection.child_data.mood_data.streak} 🔥
                                                    </p>
                                                    <p className="text-muted-foreground">consecutive days</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Total Entries</p>
                                                    <p className="text-2xl font-bold text-blue-600">
                                                        {connection.child_data.mood_data.recent_moods.length}
                                                    </p>
                                                    <p className="text-muted-foreground">mood logs</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Trend</p>
                                                    <p className="text-2xl font-bold">
                                                        {getTrendIcon(connection.child_data.mood_data.trend)}
                                                    </p>
                                                    <p className="text-muted-foreground capitalize">
                                                        {connection.child_data.mood_data.trend}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">
                                            No mood entries recorded yet.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )}

                    <TabsContent value="appointments" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Session History
                                </CardTitle>
                                <CardDescription>
                                    Therapeutic sessions and appointments
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {(isChildConnection ? connection.child_data?.appointments : [])?.length ? (
                                    <div className="space-y-4">
                                        {(isChildConnection ? connection.child_data!.appointments : []).map((appointment) => (
                                            <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">
                                                        {new Date(appointment.scheduled_at).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                    {appointment.notes && (
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {appointment.notes}
                                                        </p>
                                                    )}
                                                </div>
                                                <Badge className={
                                                    appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-red-100 text-red-800'
                                                }>
                                                    {appointment.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">
                                        No appointments scheduled yet.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <Button asChild>
                                <Link href={`/messages/conversation/${connection.client.id}`}>
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Send Message
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={`/appointments/create?${isChildConnection ? 'child' : 'guardian'}=${connection.client.id}`}>
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule Session
                                </Link>
                            </Button>
                            {isChildConnection && (
                                <Button variant="outline" asChild>
                                    <Link href={`/mood?child=${connection.client.id}`}>
                                        <Heart className="h-4 w-4 mr-2" />
                                        View Mood History
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}