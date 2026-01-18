import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, User, Users, LoaderCircle, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';

interface Guardian {
    id: number;
    name: string;
    email: string;
}

interface Client {
    id: number;
    name: string;
    email: string;
    type: 'child' | 'guardian';
    guardian?: Guardian;
}

interface Therapist {
    id: number;
    name: string;
    email: string;
}

interface AvailableSlot {
    time: string;
    datetime: string;
    display: string;
    duration: number;
}

interface Props {
    clients: Client[];
    therapist: Therapist;
}

export default function TherapistAppointmentCreate({ clients, therapist }: Props) {
    const { flash } = usePage().props as any;
    const [data, setData] = useState({
        client_id: '',
        client_type: '',
        date: '',
        time: '',
        notes: '',
    });
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    useEffect(() => {
        if (data.date) {
            fetchAvailableSlots();
        } else {
            setAvailableSlots([]);
        }
    }, [data.date]);

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        const dateString = date ? date.toISOString().split('T')[0] : '';
        setData({ ...data, date: dateString, time: '' });
    };

    const fetchAvailableSlots = async () => {
        setLoadingSlots(true);
        try {
            const response = await fetch(`/api/therapists/${therapist.id}/available-slots?date=${data.date}`);
            if (response.ok) {
                const result = await response.json();
                // The API now returns actual availability slots with their natural durations
                setAvailableSlots(result.slots || []);
            } else {
                console.error('Failed to fetch available slots:', response.statusText);
                setAvailableSlots([]);
            }
        } catch (error) {
            console.error('Failed to fetch available slots:', error);
            setAvailableSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleClientChange = (clientId: string) => {
        const client = clients.find(c => c.id.toString() === clientId);
        setSelectedClient(client || null);
        setData({
            ...data,
            client_id: clientId,
            client_type: client?.type || '',
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        // Find the selected slot to get its duration
        const selectedSlot = availableSlots.find(slot => slot.time === data.time);
        const duration = selectedSlot?.duration || 60; // fallback to 60 minutes

        // Combine date and time
        const scheduledAt = `${data.date} ${data.time}`;

        const formData = {
            ...data,
            scheduled_at: scheduledAt,
            duration_minutes: duration,
        };

        console.log('Submitting appointment data:', formData);
        console.log('Selected slot:', selectedSlot);
        console.log('Date:', data.date, 'Time:', data.time, 'Combined:', scheduledAt);

        router.post('/therapist/appointments', formData, {
            onSuccess: (page) => {
                console.log('Appointment created successfully', page);
                // Flash message will be handled by the redirect to appointments.index
            },
            onError: (errors) => {
                console.error('Appointment creation failed:', errors);
                console.error('Full error object:', JSON.stringify(errors, null, 2));
                setErrors(errors);
                setProcessing(false);

                // Show error toast
                if (errors.general) {
                    toast.error(errors.general);
                } else if (errors.scheduled_at) {
                    toast.error(errors.scheduled_at);
                } else if (errors.client_id) {
                    toast.error(errors.client_id);
                } else {
                    const errorKeys = Object.keys(errors);
                    if (errorKeys.length > 0) {
                        toast.error(`Validation error: ${errors[errorKeys[0]]}`);
                    } else {
                        toast.error('Failed to create appointment. Please check the form and try again.');
                    }
                }
            },
            onFinish: () => {
                console.log('Request finished');
                setProcessing(false);
            }
        });
    };

    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    };

    return (
        <AppLayout>
            <Head title="Schedule Appointment" />

            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8 space-y-6 max-w-full overflow-x-hidden">
                <div className="flex justify-center">
                    <div className="w-full max-w-2xl">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/appointments">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Appointments
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold">Schedule Appointment</h1>
                                <p className="text-muted-foreground">
                                    Create a new therapy session with your client
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Appointment Details
                            </CardTitle>
                            <CardDescription>
                                Fill out the form below to schedule an appointment. The appointment will be automatically confirmed.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {errors.general && (
                                    <div className="p-3 border rounded-md bg-red-50 border-red-200">
                                        <p className="text-sm text-red-800">{errors.general}</p>
                                    </div>
                                )}

                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="client_id">Client *</Label>
                                        <Select
                                            value={data.client_id}
                                            onValueChange={handleClientChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a client" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {clients.map((client) => (
                                                    <SelectItem key={client.id} value={client.id.toString()}>
                                                        <div className="flex items-center gap-2">
                                                            {client.type === 'child' ? (
                                                                <User className="h-4 w-4" />
                                                            ) : (
                                                                <Users className="h-4 w-4" />
                                                            )}
                                                            <div>
                                                                <div>{client.name}</div>
                                                                {client.type === 'child' && client.guardian && (
                                                                    <div className="text-xs text-muted-foreground">
                                                                        Guardian: {client.guardian.name}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.client_id} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="date">Date *</Label>
                                        <DatePicker
                                            date={selectedDate}
                                            onDateChange={handleDateChange}
                                            placeholder="Select appointment date"
                                            minDate={getMinDate()}
                                            className="w-full"
                                        />
                                        <InputError message={errors.date} />
                                    </div>

                                    {data.date && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="time">Available Times *</Label>
                                            {loadingSlots ? (
                                                <div className="flex items-center gap-2 p-3 border rounded-md">
                                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                                    <span className="text-sm text-muted-foreground">Loading available times...</span>
                                                </div>
                                            ) : availableSlots.length > 0 ? (
                                                <Select
                                                    value={data.time}
                                                    onValueChange={(value) => setData({ ...data, time: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a time" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableSlots.map((slot) => (
                                                            <SelectItem key={slot.time} value={slot.time}>
                                                                {slot.display}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <div className="p-3 border rounded-md bg-yellow-50 border-yellow-200">
                                                    <p className="text-sm text-yellow-800 mb-2">
                                                        No available times for this date.
                                                    </p>
                                                    <p className="text-xs text-yellow-700 mb-3">
                                                        You may need to set up your availability schedule first.
                                                    </p>
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href="/therapist/availability">
                                                            Set Up Availability
                                                        </Link>
                                                    </Button>
                                                </div>
                                            )}
                                            <InputError message={errors.time} />
                                        </div>
                                    )}

                                    <div className="grid gap-2">
                                        <Label htmlFor="notes">Session Notes (Optional)</Label>
                                        <textarea
                                            id="notes"
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={data.notes}
                                            onChange={(e) => setData({ ...data, notes: e.target.value })}
                                            placeholder="Any specific topics or session objectives..."
                                            maxLength={500}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {data.notes.length}/500 characters
                                        </p>
                                        <InputError message={errors.notes} />
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                    <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Appointment will be automatically confirmed</li>
                                        <li>• Google Meet link will be generated</li>
                                        <li>• Client will receive email and in-app notification</li>
                                        <li>• Appointment will appear in your schedule</li>
                                    </ul>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        type="submit"
                                        disabled={processing || !data.time || !data.client_id || availableSlots.length === 0}
                                        className="flex-1"
                                    >
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                        {processing ? 'Creating Appointment...' : 'Schedule Appointment'}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/appointments">Cancel</Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
