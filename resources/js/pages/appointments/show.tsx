import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock, User, MapPin, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';

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
    appointment_type?: string | null;
    notes?: string;
    therapist_notes?: string;
    meeting_link?: string;
    google_meet_link?: string;
    cancellation_reason?: string;
    therapist?: User | null;
    child?: User | null;
    guardian?: User | null;
}

interface Props {
    appointment: Appointment;
    currentUser?: User & { roles?: Array<{ name: string }> };
}

export default function AppointmentShow({ appointment, currentUser }: Props) {
    const getUserRole = (user?: User & { roles?: Array<{ name: string }> }) => {
        if (!user?.roles || user.roles.length === 0) return '';
        return user.roles[0].name;
    };

    const isTherapist = getUserRole(currentUser) === 'therapist';
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
            case 'requested': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
            case 'completed':
                return <CheckCircle className="h-5 w-5" />;
            case 'cancelled':
                return <XCircle className="h-5 w-5" />;
            default:
                return <Clock className="h-5 w-5" />;
        }
    };

    const hasChild = !!appointment.child?.name;
    const hasGuardian = !!appointment.guardian?.name;

    const appointmentTitle = hasChild
        ? `Session with ${appointment.child.name}`
        : hasGuardian
            ? `Consultation with ${appointment.guardian.name}`
            : 'Appointment';

    return (
        <AppLayout>
            <Head title="Appointment Details" />

            <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-full overflow-x-hidden">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/appointments">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Appointments
                        </Link>
                    </Button>
                </div>

                <div>
                    <h1 className="text-3xl font-bold">{appointmentTitle}</h1>
                    <p className="text-muted-foreground">
                        Appointment details and information
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Appointment Information</CardTitle>
                                <Badge className={getStatusColor(appointment.status)}>
                                    <span className="flex items-center gap-1">
                                        {getStatusIcon(appointment.status)}
                                        {appointment.status}
                                    </span>
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Date and Time */}
                            <div>
                                <h3 className="font-semibold mb-3">Schedule</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">
                                                {new Date(appointment.scheduled_at).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">
                                                {new Date(appointment.scheduled_at).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Duration: {appointment.duration_minutes} minutes
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Participants */}
                            <div>
                                <h3 className="font-semibold mb-3">Participants</h3>
                                <div className="space-y-3">
                                    {appointment.therapist && (
                                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                <User className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{appointment.therapist.name}</p>
                                                <p className="text-sm text-muted-foreground">Therapist</p>
                                            </div>
                                        </div>
                                    )}
                                    {appointment.child && (
                                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <User className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{appointment.child.name}</p>
                                                <p className="text-sm text-muted-foreground">Child</p>
                                            </div>
                                        </div>
                                    )}
                                    {appointment.guardian && (
                                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <User className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{appointment.guardian.name}</p>
                                                <p className="text-sm text-muted-foreground">Guardian</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <h3 className="font-semibold mb-2">Notes</h3>
                                <div className="p-3 bg-muted rounded-lg">
                                    {appointment.notes ? (
                                        <p className="text-sm">{appointment.notes}</p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No notes added</p>
                                    )}
                                </div>
                            </div>

                            {/* Therapist Notes */}
                            {appointment.status === 'completed' && (
                                <div>
                                    <h3 className="font-semibold mb-2">Therapist Notes</h3>
                                    <div className="p-3 bg-muted rounded-lg">
                                        {appointment.therapist_notes ? (
                                            <p className="text-sm">{appointment.therapist_notes}</p>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">No therapist notes added</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Cancellation Reason */}
                            {appointment.status === 'cancelled' && appointment.cancellation_reason && (
                                <div>
                                    <h3 className="font-semibold mb-2 text-red-600">Cancellation Reason</h3>
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-800">{appointment.cancellation_reason}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                            <CardDescription>
                                Manage this appointment
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {appointment.status === 'confirmed' && (
                                <>
                                    {(appointment.meeting_link || appointment.google_meet_link) ? (
                                        <Button className="w-full" asChild>
                                            <a href={appointment.google_meet_link || appointment.meeting_link} target="_blank" rel="noopener noreferrer">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                Join Session
                                            </a>
                                        </Button>
                                    ) : (
                                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-sm text-yellow-800">
                                                Meeting link will be available closer to the appointment time.
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                            {appointment.status === 'requested' && !isTherapist && (
                                <Button className="w-full" variant="outline" asChild>
                                    <Link href={`/appointments/${appointment.id}/confirm`} method="patch" as="button">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Confirm Appointment
                                    </Link>
                                </Button>
                            )}

                            {appointment.status === 'requested' && isTherapist && (
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        Waiting for client confirmation
                                    </p>
                                </div>
                            )}

                            {(appointment.status === 'requested' || appointment.status === 'confirmed') && (
                                <Button className="w-full" variant="destructive">
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel Appointment
                                </Button>
                            )}

                            <Button className="w-full" variant="outline" asChild>
                                <Link href="/appointments">
                                    View All Appointments
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
