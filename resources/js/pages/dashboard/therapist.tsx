import { Head, Link } from '@inertiajs/react';
import { Users, Calendar, MessageCircle, Clock, Heart, TrendingUp, Plus, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PanicAlertNotification from '@/components/panic-alert-notification';
import { usePanicAlerts } from '@/hooks/use-panic-alerts';
import AppLayout from '@/layouts/app-layout';

interface Stats {
    total_appointments: number;
    upcoming_appointments: number;
    pending_requests: number;
    unread_messages: number;
}

interface Appointment {
    id: number;
    scheduled_at: string;
    duration_minutes: number;
    status: string;
    appointment_type?: string | null;
    child?: { id: number; name: string } | null;
    guardian?: { id: number; name: string } | null;
    therapist?: { id: number; name: string } | null;
}

interface Message {
    id: number;
    content: string;
    created_at: string;
    sender?: { id: number; name: string } | null;
}

interface PanicAlert {
    id: number;
    child: {
        id: number;
        name: string;
    };
    triggered_at: string;
    status: 'active' | 'acknowledged' | 'resolved';
    resolved_at?: string;
    resolved_by?: {
        id: number;
        name: string;
    };
    location_data?: {
        latitude: number;
        longitude: number;
        accuracy: number;
    };
    notes?: string;
}

interface Props {
    stats: Stats;
    upcomingAppointments: Appointment[];
    recentMessages: Message[];
    panicAlerts?: PanicAlert[];
    unviewedPanicAlerts?: number;
}

export default function TherapistDashboard({ stats, upcomingAppointments, recentMessages, panicAlerts = [], unviewedPanicAlerts = 0 }: Props) {
    const { alerts: realtimeAlerts, unviewedCount: realtimeUnviewedCount } = usePanicAlerts();
    const [displayAlerts, setDisplayAlerts] = useState(panicAlerts);
    const [displayUnviewedCount, setDisplayUnviewedCount] = useState(unviewedPanicAlerts);

    // Update display alerts when real-time alerts change
    useEffect(() => {
        if (realtimeAlerts.length > 0) {
            // Merge real-time alerts with initial alerts, avoiding duplicates
            const mergedAlerts = [...realtimeAlerts];
            panicAlerts.forEach(alert => {
                if (!realtimeAlerts.some(rtAlert => rtAlert.id === alert.id)) {
                    mergedAlerts.push(alert);
                }
            });
            setDisplayAlerts(mergedAlerts.slice(0, 5)); // Show latest 5
        }
    }, [realtimeAlerts, panicAlerts]);

    // Update unviewed count
    useEffect(() => {
        setDisplayUnviewedCount(realtimeUnviewedCount || unviewedPanicAlerts);
    }, [realtimeUnviewedCount, unviewedPanicAlerts]);
    const getAppointmentStatusBadge = (status: string) => {
        switch (status) {
            case 'requested':
                return <Badge className="bg-yellow-100 text-yellow-800">Requested</Badge>;
            case 'confirmed':
                return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
            case 'completed':
                return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title="Therapist Dashboard" />

            <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-full overflow-x-hidden">
                <div>
                    <h1 className="text-3xl font-bold">Welcome back, Dr. 👋</h1>
                    <p className="text-muted-foreground">
                        Here's an overview of your appointments and client communications
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_appointments}</div>
                            <p className="text-xs text-muted-foreground">
                                all time sessions
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.upcoming_appointments}</div>
                            <p className="text-xs text-muted-foreground">
                                scheduled sessions
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_requests}</div>
                            <p className="text-xs text-muted-foreground">
                                awaiting approval
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Messages</CardTitle>
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.unread_messages}</div>
                            <p className="text-xs text-muted-foreground">
                                unread messages
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Emergency Alerts */}
                    <Card className="border-red-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-red-600" />
                                Emergency Alerts
                                {displayUnviewedCount > 0 && (
                                    <Badge className="bg-red-600 text-white">
                                        {displayUnviewedCount}
                                    </Badge>
                                )}
                            </CardTitle>
                            <CardDescription>
                                Alerts from assigned children
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {displayAlerts.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">
                                    No recent alerts
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {displayAlerts.map((alert) => (
                                        <PanicAlertNotification
                                            key={alert.id}
                                            alert={alert}
                                            compact={true}
                                            showActions={false}
                                        />
                                    ))}

                                    <Button asChild className="w-full">
                                        <Link href="/panic-alerts">
                                            View All Alerts
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Appointments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Upcoming Appointments
                            </CardTitle>
                            <CardDescription>
                                Your scheduled therapy sessions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {upcomingAppointments.length === 0 ? (
                                <div className="text-center py-8">
                                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Your schedule is clear for now
                                    </p>
                                    <Button asChild>
                                        <Link href="/appointments">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            View All Appointments
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {upcomingAppointments.slice(0, 3).map((appointment) => {
                                        // Determine if this is a consultation with guardian or session with child
                                        const hasChild = !!appointment.child?.name;
                                        const hasGuardian = !!appointment.guardian?.name;

                                        // Determine title and subtitle
                                        let title = 'Appointment';
                                        let subtitle = '';

                                        if (hasChild) {
                                            // Child session
                                            title = `Session with ${appointment.child.name}`;
                                            subtitle = hasGuardian ? `Guardian: ${appointment.guardian.name}` : 'Child Session';
                                        } else if (hasGuardian) {
                                            // Guardian consultation
                                            title = `Consultation with ${appointment.guardian.name}`;
                                            subtitle = 'Guardian Consultation';
                                        }

                                        return (
                                            <div key={appointment.id} className="p-3 border rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <p className="font-medium">
                                                            {title}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {subtitle}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {getAppointmentStatusBadge(appointment.status)}
                                                        <Badge variant="outline">
                                                            {appointment.duration_minutes} min
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(appointment.scheduled_at).toLocaleDateString()} at{' '}
                                                    {new Date(appointment.scheduled_at).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        );
                                    })}

                                    <Button asChild className="w-full">
                                        <Link href="/appointments">
                                            View All Appointments
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Messages */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageCircle className="h-5 w-5" />
                                Recent Messages
                            </CardTitle>
                            <CardDescription>
                                Latest communications from clients
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentMessages.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No recent messages</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Start a conversation with your clients
                                    </p>
                                    <Button asChild>
                                        <Link href="/messages">
                                            <MessageCircle className="h-4 w-4 mr-2" />
                                            View Messages
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentMessages.slice(0, 3).map((message) => (
                                        <div key={message.id} className="p-3 border rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-medium">{message.sender?.name || 'Unknown Sender'}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(message.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {message.content}
                                            </p>
                                        </div>
                                    ))}

                                    <Button asChild className="w-full">
                                        <Link href="/messages">
                                            View All Messages
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common tasks for managing your practice
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TooltipProvider>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button asChild className="h-auto py-3 px-3 flex-col gap-2 text-xs">
                                            <Link href="/therapist/appointments/create">
                                                <Plus className="h-4 w-4" />
                                                <span className="truncate w-full">Schedule Appointment</span>
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Schedule Appointment</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" asChild className="h-auto py-3 px-3 flex-col gap-2 text-xs">
                                            <Link href="/therapist/availability">
                                                <Clock className="h-4 w-4" />
                                                <span className="truncate w-full">Manage Availability</span>
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Manage Availability</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" asChild className="h-auto py-3 px-3 flex-col gap-2 text-xs">
                                            <Link href="/appointments">
                                                <Calendar className="h-4 w-4" />
                                                <span className="truncate w-full">Manage Schedule</span>
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Manage Schedule</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" asChild className="h-auto py-3 px-3 flex-col gap-2 text-xs">
                                            <Link href="/therapist/consultation/create">
                                                <Plus className="h-4 w-4" />
                                                <span className="truncate w-full">Schedule Consultation</span>
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Schedule Consultation</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" asChild className="h-auto py-3 px-3 flex-col gap-2 text-xs">
                                            <Link href="/appointments?status=requested">
                                                <TrendingUp className="h-4 w-4" />
                                                <span className="truncate w-full">Review Requests</span>
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Review Requests</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" asChild className="h-auto py-3 px-3 flex-col gap-2 text-xs">
                                            <Link href="/messages">
                                                <MessageCircle className="h-4 w-4" />
                                                <span className="truncate w-full">Messages</span>
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Messages</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" asChild className="h-auto py-3 px-3 flex-col gap-2 text-xs col-span-2 md:col-span-3 lg:col-span-1">
                                            <Link href="/clients">
                                                <Users className="h-4 w-4" />
                                                <span className="truncate w-full">View Clients</span>
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>View Clients</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    </CardContent>
                </Card>

                {/* Professional Notice */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Heart className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-blue-900 mb-1">Professional Responsibility</h4>
                                <p className="text-sm text-blue-800">
                                    All client interactions are monitored for safety and compliance. Please report any
                                    concerning patterns or emergency situations immediately through the appropriate channels.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
