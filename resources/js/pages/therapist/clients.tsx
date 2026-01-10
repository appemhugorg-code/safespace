import { Head, Link } from '@inertiajs/react';
import { Users, Calendar, TrendingUp, TrendingDown, Minus, MessageCircle, Eye, Phone } from 'lucide-react';

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
    mood: string;
    mood_date: string;
    created_at: string;
}

interface AppointmentSummary {
    id: number;
    scheduled_at: string;
    status: string;
}

interface Client {
    id: number;
    name: string;
    email: string;
    status: string;
    guardian: Guardian | null;
    statistics: {
        total_appointments: number;
        completed_appointments: number;
        upcoming_appointments: number;
        latest_appointment: AppointmentSummary | null;
    };
    mood_data: {
        recent_moods: MoodLog[];
        trend: 'improving' | 'declining' | 'stable';
        streak: number;
    };
}

interface Stats {
    total_clients: number;
    active_clients: number;
    total_appointments_this_month: number;
    completed_appointments_this_month: number;
}

interface Props {
    clients: Client[];
    stats: Stats;
}

export default function TherapistClients({ clients, stats }: Props) {
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

    return (
        <AppLayout>
            <Head title="My Clients" />

            <div className="container-mobile space-y-6 sm:space-y-8 py-4 sm:py-6 animate-fade-in">
                <div className="animate-slide-up">
                    <h1 className="text-2xl sm:text-3xl font-bold text-primary">My Clients</h1>
                    <p className="text-muted-foreground">
                        Manage and monitor your assigned clients' progress
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
                    <Card interactive>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Total Clients</CardTitle>
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold">{stats.total_clients}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.active_clients} active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Month</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_appointments_this_month}</div>
                            <p className="text-xs text-muted-foreground">
                                appointments scheduled
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completed_appointments_this_month}</div>
                            <p className="text-xs text-muted-foreground">
                                sessions this month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_appointments_this_month > 0 
                                    ? Math.round((stats.completed_appointments_this_month / stats.total_appointments_this_month) * 100)
                                    : 0}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                completion rate
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Clients List */}
                <Card spacing="comfortable" className="animate-scale-in">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Client Overview
                        </CardTitle>
                        <CardDescription>
                            Monitor your clients' progress and recent activity
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {clients.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    You haven't been assigned any clients or completed any appointments yet.
                                </p>
                                <Button asChild>
                                    <Link href="/appointments/create">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Schedule First Appointment
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {clients.map((client) => (
                                    <Card key={client.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <span className="text-sm font-semibold text-blue-600">
                                                                {client.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-lg">{client.name}</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                Guardian: {client.guardian?.name || 'No guardian assigned'}
                                                            </p>
                                                        </div>
                                                        {getStatusBadge(client.status)}
                                                    </div>

                                                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                                                        {/* Appointment Statistics */}
                                                        <div className="space-y-2">
                                                            <h4 className="text-sm font-medium text-muted-foreground">Appointments</h4>
                                                            <div className="space-y-1">
                                                                <div className="flex justify-between text-sm">
                                                                    <span>Total:</span>
                                                                    <span className="font-medium">{client.statistics.total_appointments}</span>
                                                                </div>
                                                                <div className="flex justify-between text-sm">
                                                                    <span>Completed:</span>
                                                                    <span className="font-medium">{client.statistics.completed_appointments}</span>
                                                                </div>
                                                                <div className="flex justify-between text-sm">
                                                                    <span>Upcoming:</span>
                                                                    <span className="font-medium">{client.statistics.upcoming_appointments}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Mood Data */}
                                                        <div className="space-y-2">
                                                            <h4 className="text-sm font-medium text-muted-foreground">Recent Mood</h4>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex gap-1">
                                                                    {client.mood_data.recent_moods.slice(0, 5).map((mood, index) => (
                                                                        <span key={index} className="text-lg" title={mood.mood_date}>
                                                                            {getMoodEmoji(mood.mood)}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                                <Badge className={`${getTrendColor(client.mood_data.trend)} flex items-center gap-1`}>
                                                                    {getTrendIcon(client.mood_data.trend)}
                                                                    {client.mood_data.trend}
                                                                </Badge>
                                                            </div>
                                                            {client.mood_data.streak > 0 && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    🔥 {client.mood_data.streak} day streak
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Latest Activity */}
                                                        <div className="space-y-2">
                                                            <h4 className="text-sm font-medium text-muted-foreground">Latest Activity</h4>
                                                            {client.statistics.latest_appointment ? (
                                                                <div className="text-sm">
                                                                    <p className="font-medium">
                                                                        {new Date(client.statistics.latest_appointment.scheduled_at).toLocaleDateString()}
                                                                    </p>
                                                                    <p className="text-muted-foreground capitalize">
                                                                        {client.statistics.latest_appointment.status}
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-muted-foreground">No recent appointments</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-col gap-2 ml-4">
                                                    <Button size="sm" asChild>
                                                        <Link href={`/clients/${client.id}`}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </Link>
                                                    </Button>
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={`/messages/conversation/${client.id}`}>
                                                            <MessageCircle className="h-4 w-4 mr-2" />
                                                            Message
                                                        </Link>
                                                    </Button>
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={`/appointments/create?child=${client.id}`}>
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
                            Common tasks for managing your practice
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button asChild>
                                <Link href="/appointments/create">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule Appointment
                                </Link>
                            </Button>

                            <Button variant="outline" asChild>
                                <Link href="/appointments">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    View All Appointments
                                </Link>
                            </Button>

                            <Button variant="outline" asChild>
                                <Link href="/messages">
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Messages
                                </Link>
                            </Button>

                            <Button variant="outline" asChild>
                                <Link href="/therapist/availability">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Manage Availability
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Professional Notice */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-sm">ℹ</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-blue-900 mb-1">Professional Responsibility</h4>
                                <p className="text-sm text-blue-800">
                                    All client interactions are monitored for safety and compliance. Please report any concerning patterns or emergency situations immediately through the appropriate channels.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}