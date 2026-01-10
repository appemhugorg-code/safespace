import { Head, Link, router } from '@inertiajs/react';
import { Plus, Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';

interface Child {
    id: number;
    name: string;
}

interface Appointment {
    id: number;
    scheduled_at: string;
    duration_minutes: number;
    status: string;
    status_display: string;
    status_color: string;
    notes?: string;
    meeting_link?: string;
    child: { id: number; name: string };
    therapist: { id: number; name: string };
}

interface Props {
    appointments: Appointment[];
    children: Child[];
}

export default function GuardianAppointments({ appointments, children }: Props) {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'requested':
                return <Clock className="h-4 w-4" />;
            case 'confirmed':
                return <CheckCircle className="h-4 w-4" />;
            case 'cancelled':
                return <XCircle className="h-4 w-4" />;
            case 'completed':
                return <CheckCircle className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    const upcomingAppointments = appointments.filter(apt =>
        ['requested', 'confirmed'].includes(apt.status) &&
        new Date(apt.scheduled_at) > new Date()
    );

    const pastAppointments = appointments.filter(apt =>
        apt.status === 'completed' ||
        (apt.status === 'cancelled') ||
        (new Date(apt.scheduled_at) < new Date())
    );

    const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
        <Card className="mb-4">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {appointment.child.name} with {appointment.therapist.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(appointment.scheduled_at).toLocaleDateString()} at{' '}
                            {new Date(appointment.scheduled_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                            <span className="mx-2">•</span>
                            <Clock className="h-4 w-4" />
                            {appointment.duration_minutes} minutes
                        </CardDescription>
                    </div>
                    <Badge className={appointment.status_color}>
                        {getStatusIcon(appointment.status)}
                        <span className="ml-1">{appointment.status_display}</span>
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                {appointment.notes && (
                    <div className="mb-3">
                        <p className="text-sm text-muted-foreground">
                            <strong>Notes:</strong> {appointment.notes}
                        </p>
                    </div>
                )}

                {appointment.meeting_link && appointment.status === 'confirmed' && (
                    <div className="mb-3">
                        <Button size="sm" asChild>
                            <a href={appointment.meeting_link} target="_blank" rel="noopener noreferrer">
                                Join Meeting
                            </a>
                        </Button>
                    </div>
                )}

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/appointments/${appointment.id}`}>
                            View Details
                        </Link>
                    </Button>

                    {appointment.status === 'requested' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                // Handle cancellation
                                const reason = prompt('Please provide a reason for cancellation:');
                                if (reason) {
                                    router.patch(`/appointments/${appointment.id}/cancel`, {
                                        cancellation_reason: reason
                                    });
                                }
                            }}
                        >
                            Cancel Request
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <AppLayout>
            <Head title="Appointments" />

            <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-full overflow-x-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Appointments</h1>
                        <p className="text-muted-foreground">
                            Manage therapy sessions for your children
                        </p>
                    </div>
                    {children.length > 0 && (
                        <Button asChild>
                            <Link href="/appointments/create">
                                <Plus className="h-4 w-4 mr-2" />
                                Request Appointment
                            </Link>
                        </Button>
                    )}
                </div>

                {children.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <User className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No children added yet</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                You need to add a child account before you can request appointments
                            </p>
                            <Button asChild>
                                <Link href="/guardian/children/create">
                                    Add Child Account
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Tabs defaultValue="upcoming" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="upcoming" className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Upcoming ({upcomingAppointments.length})
                            </TabsTrigger>
                            <TabsTrigger value="past" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Past ({pastAppointments.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="upcoming" className="space-y-4">
                            {upcomingAppointments.length === 0 ? (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center py-12">
                                        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
                                        <p className="text-muted-foreground text-center mb-4">
                                            Request an appointment to get started with therapy sessions
                                        </p>
                                        <Button asChild>
                                            <Link href="/appointments/create">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Request First Appointment
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                upcomingAppointments.map((appointment) => (
                                    <AppointmentCard key={appointment.id} appointment={appointment} />
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="past" className="space-y-4">
                            {pastAppointments.length === 0 ? (
                                <Card>
                                    <CardContent className="text-center py-12">
                                        <p className="text-muted-foreground">No past appointments</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                pastAppointments.map((appointment) => (
                                    <AppointmentCard key={appointment.id} appointment={appointment} />
                                ))
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </AppLayout>
    );
}
