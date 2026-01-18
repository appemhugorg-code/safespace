import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, User, LoaderCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';

interface Child {
    id: number;
    name: string;
    email: string;
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
}

interface Props {
    children: Child[];
    therapists: Therapist[];
}

export default function CreateAppointment({ children, therapists }: Props) {
    const [data, setData] = useState({
        child_id: '',
        therapist_id: '',
        date: '',
        time: '',
        duration_minutes: '60',
        notes: '',
    });
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    useEffect(() => {
        if (data.therapist_id && data.date) {
            fetchAvailableSlots();
        } else {
            setAvailableSlots([]);
        }
    }, [data.therapist_id, data.date]);

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        const dateString = date ? date.toISOString().split('T')[0] : '';
        setData({ ...data, date: dateString, time: '' });
    };

    const fetchAvailableSlots = async () => {
        setLoadingSlots(true);
        try {
            const response = await fetch(`/api/appointments/available-slots?therapist_id=${data.therapist_id}&date=${data.date}`);
            const slots = await response.json();
            setAvailableSlots(slots);
        } catch (error) {
            console.error('Failed to fetch available slots:', error);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        // Combine date and time
        const scheduledAt = `${data.date} ${data.time}`;

        router.post('/appointments', {
            ...data,
            scheduled_at: scheduledAt,
        }, {
            onSuccess: () => {
                // Redirect will be handled by the controller
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    return (
        <AppLayout>
            <Head title="Request Appointment" />

            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8 space-y-6 max-w-full overflow-x-hidden">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/appointments">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Appointments
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Request Appointment</h1>
                        <p className="text-muted-foreground">
                            Schedule a therapy session for your child
                        </p>
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
                                Fill out the form below to request an appointment. The therapist will review and confirm your request.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="child_id">Child</Label>
                                        <Select
                                            value={data.child_id}
                                            onValueChange={(value) => setData({ ...data, child_id: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your child" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {children.map((child) => (
                                                    <SelectItem key={child.id} value={child.id.toString()}>
                                                        {child.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.child_id} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="therapist_id">Therapist</Label>
                                        <Select
                                            value={data.therapist_id}
                                            onValueChange={(value) => setData({ ...data, therapist_id: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a therapist" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {therapists.map((therapist) => (
                                                    <SelectItem key={therapist.id} value={therapist.id.toString()}>
                                                        {therapist.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.therapist_id} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="date">Preferred Date</Label>
                                        <DatePicker
                                            date={selectedDate}
                                            onDateChange={handleDateChange}
                                            placeholder="Select preferred date"
                                            minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                                            className="w-full"
                                        />
                                        <InputError message={errors.date} />
                                    </div>

                                    {data.therapist_id && data.date && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="time">Available Times</Label>
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
                                                    <p className="text-sm text-yellow-800">
                                                        No available times for this date. Please select a different date.
                                                    </p>
                                                </div>
                                            )}
                                            <InputError message={errors.time} />
                                        </div>
                                    )}

                                    <div className="grid gap-2">
                                        <Label htmlFor="duration_minutes">Session Duration</Label>
                                        <Select
                                            value={data.duration_minutes}
                                            onValueChange={(value) => setData({ ...data, duration_minutes: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="30">30 minutes</SelectItem>
                                                <SelectItem value="60">1 hour</SelectItem>
                                                <SelectItem value="90">1.5 hours</SelectItem>
                                                <SelectItem value="120">2 hours</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.duration_minutes} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                                        <textarea
                                            id="notes"
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={data.notes}
                                            onChange={(e) => setData({ ...data, notes: e.target.value })}
                                            placeholder="Any specific topics or concerns you'd like to discuss..."
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
                                        <li>• Your appointment request will be sent to the therapist</li>
                                        <li>• The therapist will review and confirm the appointment</li>
                                        <li>• You'll receive a notification with the meeting link once confirmed</li>
                                        <li>• You can view and manage your appointments in your dashboard</li>
                                    </ul>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        type="submit"
                                        disabled={processing || !data.time || availableSlots.length === 0}
                                        className="flex-1"
                                    >
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                        Request Appointment
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
