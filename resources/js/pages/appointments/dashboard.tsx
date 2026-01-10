import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Clock, Plus, Video, X, CheckCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Appointment {
    id: number;
    scheduled_at: string;
    duration_minutes: number;
    status: 'requested' | 'confirmed' | 'completed' | 'cancelled';
    therapist: User;
    child: User;
    guardian?: User;
    notes?: string;
    google_meet_link?: string;
    meeting_link?: string;
}

interface Props {
    appointments: Appointment[];
    userRole: string;
}

export default function AppointmentsDashboard({ appointments, userRole }: Props) {
    const { toast } = useToast();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'requested': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const upcomingAppointments = appointments.filter(apt =>
        new Date(apt.scheduled_at) >= new Date() && apt.status !== 'cancelled' && apt.status !== 'completed'
    );

    const pastAppointments = appointments.filter(apt =>
        new Date(apt.scheduled_at) < new Date() || apt.status === 'completed'
    );

    const pendingAppointments = appointments.filter(apt =>
        apt.status === 'requested' && new Date(apt.scheduled_at) >= new Date()
    );

    const handleJoinMeeting = (appointment: Appointment) => {
        const meetLink = appointment.google_meet_link || appointment.meeting_link;
        if (meetLink) {
            window.open(meetLink, '_blank');
        } else {
            toast({
                title: 'Meeting link not available',
                description: 'The meeting link will be available closer to the appointment time',
                variant: 'destructive',
            });
        }
    };

    const handleConfirm = (appointmentId: number) => {
        router.patch(`/appointments/${appointmentId}/confirm`, {}, {
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'Appointment confirmed successfully',
                });
            },
        });
    };

    const handleCancel = (appointmentId: number) => {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            router.delete(`/appointments/${appointmentId}`, {
                onSuccess: () => {
                    toast({
                        title: 'Success',
                        description: 'Appointment cancelled successfully',
                    });
                },
            });
        }
    };

    const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
        const appointmentDate = new Date(appointment.scheduled_at);
        const isToday = appointmentDate.toDateString() === new Date().toDateString();
        const canJoin = isToday && appointment.status === 'confirmed';
        const meetLink = appointment.google_meet_link || appointment.meeting_link;

        return (
            <Card className={isToday ? 'border-primary' : ''}>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-lg">
                                {userRole === 'therapist' && `Session with ${appointment.child.name}`}
                                {userRole === 'guardian' && `${appointment.child.name}'s Session`}
                                {userRole === 'child' && `Session with ${appointment.therapist.name}`}
                            </CardTitle>
                            <CardDescription>
                                {appointmentDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </CardDescription>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                                {appointmentDate.toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                        <span className="text-muted-foreground">•</span>
                        <span>{appointment.duration_minutes} minutes</span>
                    </div>

                    {appointment.notes && (
                        <p className="text-sm text-muted-foreground">
                            {appointment.notes}
                        </p>
                    )}

                    <div className="flex items-center gap-2">
                        {canJoin && meetLink && (
                            <Button
                                onClick={() => handleJoinMeeting(appointment)}
                                className="flex-1"
                            >
                                <Video className="mr-2 h-4 w-4" />
                                Join Meeting
                            </Button>
                        )}

                        {userRole === 'therapist' && appointment.status === 'requested' && (
                            <Button
                                onClick={() => handleConfirm(appointment.id)}
                                variant="outline"
                                className="flex-1"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Confirm
                            </Button>
                        )}

                        {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                            <Button
                                onClick={() => handleCancel(appointment.id)}
                                variant="destructive"
                                size="sm"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <AppLayout>
            <Head title="Appointments" />

            <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-full overflow-x-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Appointments</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your therapy sessions
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/appointments/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Schedule Appointment
                        </Link>
                    </Button>
                </div>

                {/* Pending Requests (Therapist only) */}
                {userRole === 'therapist' && pendingAppointments.length > 0 && (
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardHeader>
                            <CardTitle className="text-yellow-800">Pending Requests</CardTitle>
                            <CardDescription>
                                {pendingAppointments.length} appointment request(s) need your confirmation
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {pendingAppointments.map(appointment => (
                                    <AppointmentCard key={appointment.id} appointment={appointment} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Tabs for different views */}
                <Tabs defaultValue="upcoming" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="upcoming">
                            Upcoming ({upcomingAppointments.length})
                        </TabsTrigger>
                        <TabsTrigger value="past">
                            Past ({pastAppointments.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="space-y-4">
                        {upcomingAppointments.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Schedule your first therapy session
                                    </p>
                                    <Button asChild>
                                        <Link href="/appointments/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Schedule Appointment
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {upcomingAppointments.map(appointment => (
                                    <AppointmentCard key={appointment.id} appointment={appointment} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="past" className="space-y-4">
                        {pastAppointments.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="text-muted-foreground">No past appointments</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {pastAppointments.map(appointment => (
                                    <AppointmentCard key={appointment.id} appointment={appointment} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
