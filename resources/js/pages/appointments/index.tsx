import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, Clock, Plus, User, MapPin } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
    email: string;
    roles?: Array<{ name: string }>;
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
}

interface Props {
    appointments: Appointment[];
    currentUser: User;
}

export default function AppointmentsIndex({ appointments, currentUser }: Props) {
    const { flash } = usePage().props as any;

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Debug: Log appointments data
    console.log('Appointments received:', appointments);
    console.log('Current user:', currentUser);

    // Log each appointment details
    appointments.forEach((apt, index) => {
        console.log(`Appointment ${index + 1}:`, {
            id: apt.id,
            scheduled_at: apt.scheduled_at,
            status: apt.status,
            therapist: apt.therapist?.name,
            child: apt.child?.name,
            guardian: apt.guardian?.name
        });
    });


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
            case 'requested': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getUserRole = (user: User) => {
        if (!user.roles || user.roles.length === 0) return '';
        return user.roles[0].name;
    };

    const isTherapist = getUserRole(currentUser) === 'therapist';
    const isGuardian = getUserRole(currentUser) === 'guardian';
    const isChild = getUserRole(currentUser) === 'child';

    const getPageTitle = () => {
        if (isTherapist) return 'My Appointments';
        if (isGuardian) return 'Family Appointments';
        if (isChild) return 'My Sessions';
        return 'Appointments';
    };

    const getPageDescription = () => {
        if (isTherapist) return 'Manage your therapy sessions and client appointments';
        if (isGuardian) return 'View and manage your family\'s therapy appointments';
        if (isChild) return 'Your upcoming therapy sessions';
        return 'Manage appointments';
    };

    const upcomingAppointments = appointments.filter(apt => {
        const appointmentDate = new Date(apt.scheduled_at);
        const now = new Date();
        const isUpcoming = appointmentDate >= now && apt.status !== 'cancelled';

        console.log('Filtering appointment:', {
            id: apt.id,
            scheduled_at: apt.scheduled_at,
            appointmentDate: appointmentDate.toISOString(),
            now: now.toISOString(),
            status: apt.status,
            isUpcoming
        });

        return isUpcoming;
    });

    const pastAppointments = appointments.filter(apt => {
        const appointmentDate = new Date(apt.scheduled_at);
        const now = new Date();
        return appointmentDate < now || apt.status === 'completed';
    });

    console.log('Filtered results:', {
        total: appointments.length,
        upcoming: upcomingAppointments.length,
        past: pastAppointments.length,
        upcomingIds: upcomingAppointments.map(apt => apt.id),
        pastIds: pastAppointments.map(apt => apt.id)
    });

    return (
        <AppLayout>
            <Head title="Appointments" />

            <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-full overflow-x-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
                        <p className="text-muted-foreground">
                            {getPageDescription()}
                        </p>
                    </div>

                    {isTherapist && (
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <Link href="/therapist/availability">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Manage Availability
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href="/therapist/appointments/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Schedule Appointment
                                </Link>
                            </Button>
                        </div>
                    )}

                    {(isGuardian || isChild) && (
                        <Button asChild>
                            <Link href="/appointments/create">
                                <Plus className="h-4 w-4 mr-2" />
                                Request Appointment
                            </Link>
                        </Button>
                    )}
                </div>

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
                                    {isTherapist ? 'No sessions scheduled yet' : 'Schedule your first therapy session'}
                                </p>
                                {(isGuardian || isChild) && (
                                    <Button asChild>
                                        <Link href="/appointments/create">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Request Appointment
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingAppointments.map((appointment) => (
                                    <div key={appointment.id} className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <User className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">
                                                        {isTherapist ? (
                                                            // For therapist: show who they're meeting with
                                                            appointment.child?.name
                                                                ? `Session with ${appointment.child.name}`
                                                                : appointment.guardian?.name
                                                                    ? `Consultation with ${appointment.guardian.name}`
                                                                    : 'Appointment'
                                                        ) : isGuardian ? (
                                                            // For guardian: show child's session or their own consultation
                                                            appointment.child?.name
                                                                ? `${appointment.child.name}'s Session`
                                                                : 'Your Consultation'
                                                        ) : (
                                                            // For child: show therapist
                                                            `Session with ${appointment.therapist?.name || 'Unknown'}`
                                                        )}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {isTherapist ? (
                                                            // For therapist: show additional context
                                                            appointment.child?.name
                                                                ? (appointment.guardian?.name ? `Guardian: ${appointment.guardian.name}` : 'Child Session')
                                                                : appointment.guardian?.name
                                                                    ? 'Guardian Consultation'
                                                                    : 'Therapy Session'
                                                        ) : isChild ? (
                                                            `Therapist: ${appointment.therapist?.name || 'Unknown'}`
                                                        ) : (
                                                            `Therapist: ${appointment.therapist?.name || 'Unknown'}`
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={getStatusColor(appointment.status)}>
                                                    {appointment.status}
                                                </Badge>
                                                <Badge variant="outline">
                                                    {appointment.duration_minutes} min
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(appointment.scheduled_at).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {new Date(appointment.scheduled_at).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>

                                        {appointment.notes && (
                                            <div className="mt-3 p-3 bg-muted rounded-lg">
                                                <p className="text-sm">{appointment.notes}</p>
                                            </div>
                                        )}

                                        <div className="mt-3 flex gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/appointments/${appointment.id}`}>
                                                    View Details
                                                </Link>
                                            </Button>

                                            {appointment.status === 'confirmed' && (
                                                <Button size="sm">
                                                    <MapPin className="h-4 w-4 mr-2" />
                                                    Join Session
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Past Appointments */}
                {pastAppointments.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Past Appointments
                            </CardTitle>
                            <CardDescription>
                                Your appointment history
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {pastAppointments.slice(0, 5).map((appointment) => (
                                    <div key={appointment.id} className="p-3 border rounded-lg opacity-75">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">
                                                    {isTherapist ? (
                                                        // For therapist: show who they met with
                                                        appointment.child?.name
                                                            ? `Session with ${appointment.child.name}`
                                                            : appointment.guardian?.name
                                                                ? `Consultation with ${appointment.guardian.name}`
                                                                : 'Appointment'
                                                    ) : isGuardian ? (
                                                        // For guardian: show child's session or their own consultation
                                                        appointment.child?.name
                                                            ? `${appointment.child.name}'s Session`
                                                            : 'Your Consultation'
                                                    ) : (
                                                        // For child: show therapist
                                                        appointment.therapist?.name
                                                            ? `Session with ${appointment.therapist.name}`
                                                            : 'Session'
                                                    )}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(appointment.scheduled_at).toLocaleDateString()} at{' '}
                                                    {new Date(appointment.scheduled_at).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <Badge className={getStatusColor(appointment.status)}>
                                                {appointment.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
