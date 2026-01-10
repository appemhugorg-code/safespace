import { Head, Link } from '@inertiajs/react';
import { Users, MessageCircle, Calendar, Eye, TrendingUp, TrendingDown, Minus, Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';

interface Child {
    id: number;
    name: string;
    email: string;
    status: string;
    age?: number;
    date_of_birth?: string;
}

interface Guardian {
    id: number;
    name: string;
    email: string;
    phone?: string;
}

interface AssignedBy {
    id: number;
    name: string;
}

interface MoodEntry {
    mood: string;
    mood_date: string;
    notes?: string;
}

interface Appointment {
    id: number;
    scheduled_at: string;
    duration_minutes: number;
    status: string;
    notes?: string;
}

interface ChildConnection {
    id: number;
    child: Child;
    guardian: Guardian | null;
    connection_type: string;
    assigned_at: string;
    assigned_by: AssignedBy | null;
    mood_data: {
        recent_entries: MoodEntry[];
        total_entries: number;
        streak: number;
        trend: 'improving' | 'declining' | 'stable';
    };
    recent_appointments: Appointment[];
}

interface Stats {
    total_children: number;
    active_children: number;
}

interface Props {
    children: ChildConnection[];
    stats: Stats;
}

export default function TherapistChildren({ children, stats }: Props) {
    const getConnectionTypeBadge = (type: string) => {
        switch (type) {
            case 'admin_assigned':
                return <Badge className="bg-blue-100 text-blue-800">Admin Assigned</Badge>;
            case 'guardian_child_assignment':
                return <Badge className="bg-purple-100 text-purple-800">Guardian Assignment</Badge>;
            default:
                return <Badge>{type}</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800">Active</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            case 'suspended':
                return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
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

    const getAppointmentStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>;
            case 'completed':
                return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title="Child Connections" />

            <div className="container-mobile space-y-6 sm:space-y-8 py-4 sm:py-6 animate-fade-in">
                <div className="animate-slide-up">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Child Connections</h1>
                            <p className="text-muted-foreground">
                                Children under your therapeutic care
                            </p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/therapist/connections">
                                ← Back to Connections
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Children</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_children}</div>
                            <p className="text-xs text-muted-foreground">
                                children in your care
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Children</CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_children}</div>
                            <p className="text-xs text-muted-foreground">
                                actively engaged
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Children List */}
                <Card className="animate-scale-in">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Child Relationships
                        </CardTitle>
                        <CardDescription>
                            Monitor and support the children in your therapeutic care
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {children.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No child connections</h3>
                                <p className="text-muted-foreground mb-6">
                                    You haven't been assigned any children yet. Child connections are typically established through guardian requests or admin assignments.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button asChild>
                                        <Link href="/therapist/connections/requests">
                                            <Users className="h-4 w-4 mr-2" />
                                            Check Pending Requests
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/therapist/connections/guardians">
                                            <Users className="h-4 w-4 mr-2" />
                                            View Guardians
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {children.map((connection) => (
                                    <Card key={connection.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                                                            <span className="text-xl font-semibold text-purple-600">
                                                                {connection.child.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h3 className="text-xl font-semibold">{connection.child.name}</h3>
                                                                {connection.child.age && (
                                                                    <Badge variant="outline">Age {connection.child.age}</Badge>
                                                                )}
                                                                {getStatusBadge(connection.child.status)}
                                                                {getConnectionTypeBadge(connection.connection_type)}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {connection.guardian ? (
                                                                    <p>Guardian: {connection.guardian.name} ({connection.guardian.email})</p>
                                                                ) : (
                                                                    <p>No guardian assigned</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid md:grid-cols-3 gap-6">
                                                        {/* Connection Details */}
                                                        <div className="space-y-2">
                                                            <h4 className="text-sm font-medium text-muted-foreground">Connection Details</h4>
                                                            <div className="space-y-1 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span>Connected:</span>
                                                                    <span className="font-medium">
                                                                        {new Date(connection.assigned_at).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                {connection.assigned_by && (
                                                                    <div className="flex justify-between">
                                                                        <span>Assigned by:</span>
                                                                        <span className="font-medium">{connection.assigned_by.name}</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-between">
                                                                    <span>Email:</span>
                                                                    <span className="font-medium text-xs">{connection.child.email}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Mood Data */}
                                                        <div className="space-y-2">
                                                            <h4 className="text-sm font-medium text-muted-foreground">Mood Tracking</h4>
                                                            <div className="space-y-2">
                                                                {connection.mood_data.recent_entries.length > 0 ? (
                                                                    <>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="flex gap-1">
                                                                                {connection.mood_data.recent_entries.slice(0, 5).map((mood, index) => (
                                                                                    <span key={index} className="text-lg" title={mood.mood_date}>
                                                                                        {getMoodEmoji(mood.mood)}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                            <Badge className={`${getTrendColor(connection.mood_data.trend)} flex items-center gap-1`}>
                                                                                {getTrendIcon(connection.mood_data.trend)}
                                                                                {connection.mood_data.trend}
                                                                            </Badge>
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground">
                                                                            <p>{connection.mood_data.total_entries} total entries</p>
                                                                            {connection.mood_data.streak > 0 && (
                                                                                <p>🔥 {connection.mood_data.streak} day streak</p>
                                                                            )}
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <p className="text-sm text-muted-foreground">No mood entries yet</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Recent Appointments */}
                                                        <div className="space-y-2">
                                                            <h4 className="text-sm font-medium text-muted-foreground">Recent Sessions</h4>
                                                            {connection.recent_appointments.length === 0 ? (
                                                                <p className="text-sm text-muted-foreground">No recent appointments</p>
                                                            ) : (
                                                                <div className="space-y-2">
                                                                    {connection.recent_appointments.slice(0, 3).map((appointment) => (
                                                                        <div key={appointment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                                            <div>
                                                                                <p className="text-sm font-medium">
                                                                                    {new Date(appointment.scheduled_at).toLocaleDateString()}
                                                                                </p>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    {appointment.duration_minutes} minutes
                                                                                </p>
                                                                            </div>
                                                                            {getAppointmentStatusBadge(appointment.status)}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-col gap-2 ml-6">
                                                    <Button size="sm" asChild>
                                                        <Link href={`/therapist/connections/${connection.id}`}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </Link>
                                                    </Button>
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={`/messages/conversation/${connection.child.id}`}>
                                                            <MessageCircle className="h-4 w-4 mr-2" />
                                                            Message
                                                        </Link>
                                                    </Button>
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={`/appointments/create?child=${connection.child.id}`}>
                                                            <Calendar className="h-4 w-4 mr-2" />
                                                            Schedule
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common tasks for managing child therapeutic relationships
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button asChild>
                                <Link href="/therapist/connections/guardians">
                                    <Users className="h-4 w-4 mr-2" />
                                    View Guardians
                                </Link>
                            </Button>

                            <Button variant="outline" asChild>
                                <Link href="/therapist/connections/requests">
                                    <Users className="h-4 w-4 mr-2" />
                                    Pending Requests
                                </Link>
                            </Button>

                            <Button variant="outline" asChild>
                                <Link href="/appointments/create">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule Session
                                </Link>
                            </Button>

                            <Button variant="outline" asChild>
                                <Link href="/mood">
                                    <Heart className="h-4 w-4 mr-2" />
                                    Mood Insights
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Child Safety Notice */}
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Heart className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-green-900 mb-1">Child Safety & Wellbeing</h4>
                                <p className="text-sm text-green-800">
                                    All interactions with children are monitored for safety. Please report any concerning patterns, signs of distress, or emergency situations immediately through the appropriate channels. The wellbeing of children is our top priority.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}