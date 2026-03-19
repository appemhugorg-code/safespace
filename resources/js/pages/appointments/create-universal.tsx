import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Calendar, Clock, User, AlertCircle, LoaderCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from '@/hooks/use-toast';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AvailableSlot {
    id?: number;
    time: string;
    datetime: string;
    display: string;
    duration_minutes: number;
}

interface Props {
    userRole: 'guardian' | 'therapist' | 'child';
    children?: User[];
    therapists?: User[];
    patients?: User[];
    child?: User;
    therapist?: User;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function CreateAppointment({ userRole, children, therapists, patients, child, therapist, flash }: Props) {
    const { toast } = useToast();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [loadingDates, setLoadingDates] = useState(false);

    const form = useForm({
        child_id: child?.id.toString() || '',
        therapist_id: therapist?.id.toString() || '',
        scheduled_at: '',
        duration_minutes: 60, // Will be set from selected slot
        notes: '',
        slot_id: '', // Add slot_id to track which slot is being booked
    });

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            toast({
                title: 'Success',
                description: flash.success,
            });
        }
        if (flash?.error) {
            toast({
                title: 'Error',
                description: flash.error,
                variant: 'destructive',
            });
        }
    }, [flash, toast]);

    // Fetch available dates when therapist is selected
    useEffect(() => {
        if (form.data.therapist_id) {
            fetchAvailableDates();
        } else {
            setAvailableDates([]);
            setSelectedDate(undefined);
        }
    }, [form.data.therapist_id]);

    useEffect(() => {
        if (form.data.therapist_id && selectedDate) {
            fetchAvailableSlots();
        } else {
            setAvailableSlots([]);
        }
    }, [form.data.therapist_id, selectedDate]);

    const fetchAvailableDates = async () => {
        if (!form.data.therapist_id) return;

        console.log('Fetching available dates for therapist:', form.data.therapist_id);
        setLoadingDates(true);
        try {
            const url = `/api/appointments/available-dates?therapist_id=${form.data.therapist_id}`;
            console.log('API URL:', url);
            const response = await fetch(url);

            console.log('Response status:', response.status);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('Failed to fetch available dates');
            }

            const dates = await response.json();
            console.log('Available dates received:', dates);
            console.log('Number of dates:', dates.length);
            setAvailableDates(dates);
        } catch (error) {
            console.error('Error fetching available dates:', error);
            toast({
                title: 'Error',
                description: 'Failed to load available dates',
                variant: 'destructive',
            });
            setAvailableDates([]);
        } finally {
            setLoadingDates(false);
        }
    };

    const fetchAvailableSlots = async () => {
        if (!selectedDate || !form.data.therapist_id) return;

        // Format date in local timezone to avoid UTC conversion issues
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        
        console.log('Fetching slots for:', {
            date: dateString,
            therapistId: form.data.therapist_id,
            selectedDate: selectedDate
        });

        setLoadingSlots(true);
        try {
            const url = `/api/appointments/available-slots?therapist_id=${form.data.therapist_id}&date=${dateString}`;
            console.log('API URL:', url);

            const response = await fetch(url);

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', errorText);
                throw new Error(`Failed to fetch available slots: ${response.status}`);
            }

            const slots = await response.json();
            console.log('Received slots:', slots);
            console.log('Slots count:', slots.length);
            setAvailableSlots(slots);
        } catch (error) {
            console.error('Error fetching available slots:', error);
            toast({
                title: 'Error',
                description: 'Failed to load available time slots',
                variant: 'destructive',
            });
            setAvailableSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        // Clear selected time when date changes
        form.setData('scheduled_at', '');
    };

    const handleTimeSlotSelect = (slot: AvailableSlot) => {
        // Combine the selected date with the time slot and set duration from slot
        if (selectedDate) {
            // Format date in local timezone to avoid UTC conversion issues
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;
            const scheduledAt = `${dateString} ${slot.time}`;
            form.setData({
                ...form.data,
                scheduled_at: scheduledAt,
                duration_minutes: slot.duration_minutes,
                slot_id: slot.id?.toString() || '',
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.data.scheduled_at) {
            toast({
                title: 'Validation Error',
                description: 'Please select a time slot',
                variant: 'destructive',
            });
            return;
        }

        form.post('/appointments', {
            onSuccess: () => {
                // Show success toast using the same system as error toasts
                toast({
                    title: 'Success',
                    description: userRole === 'therapist'
                        ? 'Appointment scheduled successfully!'
                        : 'Appointment request submitted successfully!',
                });
            },
            onError: (errors) => {
                const errorMessage = errors.scheduled_at || errors.therapist_id || errors.child_id || 'Failed to create appointment';
                toast({
                    title: 'Error',
                    description: errorMessage,
                    variant: 'destructive',
                });
            },
        });
    };

    const getMinDate = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        return today;
    };

    return (
        <AppLayout>
            <Head title="Schedule Appointment" />

            <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-full overflow-x-hidden">
                <div>
                    <h1 className="text-2xl sm:text-display font-semibold text-primary">Schedule Appointment</h1>
                    <p className="text-muted-foreground mt-1">
                        {userRole === 'therapist' && 'Schedule a therapy session with your patients'}
                        {userRole === 'guardian' && 'Schedule a therapy session for your child'}
                        {userRole === 'child' && 'Schedule a therapy session for yourself'}
                    </p>
                </div>

                {userRole === 'child' && (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            You can schedule an appointment anytime you need to talk to someone. Your guardian will be notified.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex justify-center">
                    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
                        {/* No availability warning */}
                        {form.data.therapist_id && !loadingDates && availableDates.length === 0 && (
                            <Alert className="border-orange-200 bg-orange-50">
                                <AlertCircle className="h-4 w-4 text-orange-600" />
                                <AlertDescription className="text-orange-800">
                                    This therapist has no available slots in the next 60 days. Please select a different therapist or check back later.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Selection Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {userRole === 'therapist' && 'Select Patient'}
                                    {userRole === 'guardian' && 'Select Child & Therapist'}
                                    {userRole === 'child' && 'Select Therapist'}
                                </CardTitle>
                                <CardDescription>
                                    Choose who this appointment is for
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Guardian selects child */}
                                {userRole === 'guardian' && children && (
                                    <div className="space-y-2">
                                        <Label>Child</Label>
                                        <Select
                                            value={form.data.child_id}
                                            onValueChange={(value) => form.setData('child_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a child" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {children.map(child => (
                                                    <SelectItem key={child.id} value={child.id.toString()}>
                                                        {child.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Therapist selects patient */}
                                {userRole === 'therapist' && patients && (
                                    <div className="space-y-2">
                                        <Label>Patient</Label>
                                        <Select
                                            value={form.data.child_id}
                                            onValueChange={(value) => form.setData('child_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a patient" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {patients.map(patient => (
                                                    <SelectItem key={patient.id} value={patient.id.toString()}>
                                                        {patient.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Guardian or Child selects therapist */}
                                {(userRole === 'guardian' || userRole === 'child') && therapists && (
                                    <div className="space-y-2">
                                        <Label>Therapist</Label>
                                        <Select
                                            value={form.data.therapist_id}
                                            onValueChange={(value) => form.setData('therapist_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a therapist" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {therapists.map(therapist => (
                                                    <SelectItem key={therapist.id} value={therapist.id.toString()}>
                                                        {therapist.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Date & Time Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Select Date & Time</CardTitle>
                                <CardDescription>
                                    Choose when you want to schedule the session
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    {loadingDates ? (
                                        <div className="flex items-center gap-2 p-3 border rounded-md text-muted-foreground">
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            <span className="text-sm">Loading available dates...</span>
                                        </div>
                                    ) : availableDates.length === 0 && form.data.therapist_id ? (
                                        <div className="p-3 border rounded-md bg-yellow-50 border-yellow-200">
                                            <p className="text-sm text-yellow-800">
                                                No available dates found for this therapist in the next 60 days.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            {console.log('Rendering DatePicker with availableDates:', availableDates)}
                                            <DatePicker
                                                key={availableDates.join(',')} // Force re-render when dates change
                                                date={selectedDate}
                                                onDateChange={handleDateChange}
                                                placeholder="Select an available date"
                                                minDate={getMinDate()}
                                                availableDates={availableDates}
                                                className="w-full"
                                            />
                                        </>
                                    )}
                                </div>

                                {selectedDate && form.data.therapist_id && (
                                    <div className="space-y-2">
                                        <Label>Available Time Slots</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Select a time slot. Duration is determined by the therapist's availability.
                                        </p>
                                        {loadingSlots ? (
                                            <div className="flex items-center gap-2 p-8 justify-center text-muted-foreground">
                                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                                <span>Loading available slots...</span>
                                            </div>
                                        ) : availableSlots.length === 0 ? (
                                            <div className="p-4 border rounded-md bg-yellow-50 border-yellow-200">
                                                <p className="text-sm text-yellow-800">
                                                    No available times for this date. Please select a different date.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-sm text-green-600">
                                                    Found {availableSlots.length} available slot(s)
                                                </p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {availableSlots.map((slot) => (
                                                        <Button
                                                            key={slot.time}
                                                            type="button"
                                                            variant={form.data.scheduled_at.includes(slot.time) ? 'default' : 'outline'}
                                                            className="w-full text-sm"
                                                            onClick={() => handleTimeSlotSelect(slot)}
                                                        >
                                                            <Clock className="mr-2 h-4 w-4" />
                                                            {slot.display}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Notes Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Information</CardTitle>
                                <CardDescription>
                                    Add any notes about this session (optional)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="What would you like to discuss in this session?"
                                    value={form.data.notes}
                                    onChange={(e) => form.setData('notes', e.target.value)}
                                    rows={4}
                                />
                            </CardContent>
                        </Card>

                        {/* Submit */}
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    !form.data.therapist_id ||
                                    !form.data.scheduled_at ||
                                    form.processing ||
                                    (userRole !== 'child' && !form.data.child_id)
                                }
                            >
                                {form.processing ? 'Scheduling...' : 'Schedule Appointment'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
