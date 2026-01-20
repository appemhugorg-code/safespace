import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Clock, MessageCircle, User, Star, MapPin } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Therapist {
    id: number;
    name: string;
    email: string;
    status: string;
    specialization?: string;
    years_experience?: number;
}

interface Availability {
    day_of_week: number;
    start_time: string;
    end_time: string;
    day_name: string;
}

interface Appointment {
    id: number;
    scheduled_at: string;
    duration_minutes: number;
    status: string;
    notes?: string;
}

interface CommunicationHistory {
    total_messages: number;
    last_message_at?: string;
    recent_messages: any[];
}

interface Connection {
    id: number;
    therapist: Therapist;
    connection_type: string;
    status: string;
    assigned_at: string;
    terminated_at?: string;
    assigned_by?: {
        id: number;
        name: string;
    };
    duration_days: number;
    availability: Availability[];
    recent_appointments: Appointment[];
    communication_history: CommunicationHistory;
}

interface Props {
    connection: Connection;
}

export default function GuardianConnectionShow({ connection }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getConnectionTypeLabel = (type: string) => {
        switch (type) {
            case 'admin_assigned':
                return 'Admin Assigned';
            case 'guardian_requested':
                return 'Self Requested';
            case 'guardian_child_assignment':
                return 'Child Assignment';
            default:
                return type;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800">Active</Badge>;
            case 'terminated':
                return <Badge variant="destructive">Terminated</Badge>;
            case 'inactive':
                return <Badge variant="secondary">Inactive</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getAppointmentStatusBadge = (status: string) => {
        switch (status) {
            case 'scheduled':
                return <Badge variant="outline" className="text-blue-600">Scheduled</Badge>;
            case 'completed':
                return <Badge variant="outline" className="text-green-600">Completed</Badge>;
            case 'cancelled':
                return <Badge variant="outline" className="text-red-600">Cancelled</Badge>;
            case 'no_show':
                return <Badge variant="outline" className="text-orange-600">No Show</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatAvailability = (availability: Availability[]) => {
        if (availability.length === 0) {
            return 'No availability set';
        }

        return availability.map(slot =>
            `${slot.day_name}: ${slot.start_time} - ${slot.end_time}`
        ).join(', ');
    };

    return (
        <AppLayout>
            <Head title={`Connection with ${connection.therapist.name}`} />

            <div className="container-mobile space-y-6 sm:space-y-8 py-4 sm:py-6 lg:py-8 animate-fade-in">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/guardian/connections">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Connections
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Connection Details</h1>
                        <p className="text-muted-foreground">
                            Your therapeutic relationship with {connection.therapist.name}
                        </p>
                    </div>
                </div>

                {/* Connection Overview */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">{connection.therapist.name}</CardTitle>
                                    <CardDescription>{connection.therapist.email}</CardDescription>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {getStatusBadge(connection.status)}
                                <Badge variant="outline">
                                    {getConnectionTypeLabel(connection.connection_type)}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h4 className="font-medium mb-2">Connection Details</h4>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Connected Since:</span>
                                        <p className="font-medium">{formatDate(connection.assigned_at)}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Duration:</span>
                                        <p className="font-medium">{connection.duration_days} days</p>
                                    </div>
                                    {connection.assigned_by && (
                                        <div>
                                            <span className="text-muted-foreground">Assigned By:</span>
                                            <p className="font-medium">{connection.assigned_by.name}</p>
                                        </div>
                                    )}
                                    {connection.terminated_at && (
                                        <div>
                                            <span className="text-muted-foreground">Terminated:</span>
                                            <p className="font-medium">{formatDate(connection.terminated_at)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">Therapist Information</h4>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Specialization:</span>
                                        <p className="font-medium">{connection.therapist.specialization || 'General Therapy'}</p>
                                    </div>
                                    {connection.therapist.years_experience && (
                                        <div>
                                            <span className="text-muted-foreground">Experience:</span>
                                            <p className="font-medium">{connection.therapist.years_experience} years</p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-muted-foreground">Status:</span>
                                        <Badge variant={connection.therapist.status === 'active' ? 'default' : 'secondary'}>
                                            {connection.therapist.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">Quick Actions</h4>
                                <div className="space-y-2">
                                    <Button className="w-full" size="sm">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Send Message
                                    </Button>
                                    <Button variant="outline" className="w-full" size="sm">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Schedule Appointment
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Information Tabs */}
                <Tabs defaultValue="availability" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="availability">Availability</TabsTrigger>
                        <TabsTrigger value="appointments">Appointments ({connection.recent_appointments.length})</TabsTrigger>
                        <TabsTrigger value="communication">Communication</TabsTrigger>
                    </TabsList>

                    <TabsContent value="availability" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Therapist Availability</CardTitle>
                                <CardDescription>
                                    When {connection.therapist.name} is available for appointments
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {connection.availability.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No Availability Set</h3>
                                        <p className="text-muted-foreground">
                                            The therapist hasn't set their availability schedule yet.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {connection.availability.map((slot, index) => (
                                            <Card key={index} className="border-blue-200">
                                                <CardContent className="pt-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Clock className="w-4 h-4 text-blue-600" />
                                                        <h4 className="font-semibold">{slot.day_name}</h4>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {slot.start_time} - {slot.end_time}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="appointments" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Appointments</CardTitle>
                                <CardDescription>
                                    Your appointment history with {connection.therapist.name}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {connection.recent_appointments.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No Appointments Yet</h3>
                                        <p className="text-muted-foreground mb-4">
                                            You haven't scheduled any appointments with this therapist yet.
                                        </p>
                                        <Button>
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Schedule First Appointment
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {connection.recent_appointments.map((appointment) => (
                                            <Card key={appointment.id} className="border-l-4 border-l-blue-500">
                                                <CardContent className="pt-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-semibold">
                                                                {formatDateTime(appointment.scheduled_at)}
                                                            </h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                Duration: {appointment.duration_minutes} minutes
                                                            </p>
                                                        </div>
                                                        {getAppointmentStatusBadge(appointment.status)}
                                                    </div>
                                                    {appointment.notes && (
                                                        <div className="mt-2">
                                                            <span className="text-sm font-medium">Notes:</span>
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {appointment.notes}
                                                            </p>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="communication" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Communication History</CardTitle>
                                <CardDescription>
                                    Your message history with {connection.therapist.name}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {connection.communication_history.total_messages}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Total Messages</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {connection.communication_history.last_message_at
                                                ? formatDate(connection.communication_history.last_message_at)
                                                : 'Never'
                                            }
                                        </div>
                                        <p className="text-sm text-muted-foreground">Last Message</p>
                                    </div>
                                    <div className="text-center">
                                        <Button className="w-full">
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Start Conversation
                                        </Button>
                                    </div>
                                </div>

                                {connection.communication_history.total_messages === 0 ? (
                                    <div className="text-center py-8">
                                        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No Messages Yet</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Start a conversation with your therapist to begin your therapeutic journey.
                                        </p>
                                        <Button>
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Send First Message
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-muted-foreground">
                                            Recent message history will be displayed here once the messaging system is integrated.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}