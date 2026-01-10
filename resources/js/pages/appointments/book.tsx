import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface Therapist {
    id: number;
    name: string;
    email: string;
}

interface Child {
    id: number;
    name: string;
}

interface TimeSlot {
    start: string;
    end: string;
    formatted_time: string;
    available: boolean;
}

interface Props {
    therapists: Therapist[];
    children?: Child[];
}

export default function BookAppointment({ therapists, children }: Props) {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        therapist_id: '',
        child_id: '',
        scheduled_at: '',
        duration_minutes: 60,
        notes: '',
    });

    const loadAvailableSlots = async (therapistId: string, date: Date) => {
        setLoadingSlots(true);
        try {
            const response = await fetch(
                `/api/therapists/${therapistId}/available-slots?date=${format(date, 'yyyy-MM-dd')}&duration=${data.duration_minutes}`
            );
            const result = await response.json();
            setAvailableSlots(result.slots || []);
        } catch (error) {
            console.error('Failed to load slots:', error);
            setAvailableSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleTherapistChange = (therapistId: string) => {
        setData('therapist_id', therapistId);
        if (selectedDate) {
            loadAvailableSlots(therapistId, selectedDate);
        }
    };

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date && data.therapist_id) {
            loadAvailableSlots(data.therapist_id, date);
        }
    };

    const handleSlotSelect = (slot: TimeSlot) => {
        setData('scheduled_at', slot.start);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('appointments.store'));
    };

    return (
        <AppLayout>
            <Head title="Book Appointment" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Book a Therapy Session</CardTitle>
                            <CardDescription>
                                Schedule a therapy session with one of our qualified therapists
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                {/* Therapist Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="therapist">Select Therapist</Label>
                                    <Select value={data.therapist_id} onValueChange={handleTherapistChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a therapist" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {therapists.map((therapist) => (
                                                <SelectItem key={therapist.id} value={therapist.id.toString()}>
                                                    {therapist.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.therapist_id && (
                                        <p className="text-sm text-red-600">{errors.therapist_id}</p>
                                    )}
                                </div>

                                {/* Child Selection (for guardians) */}
                                {children && children.length > 0 && (
                                    <div className="space-y-2">
                                        <Label htmlFor="child">Select Child</Label>
                                        <Select value={data.child_id} onValueChange={(value) => setData('child_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a child" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {children.map((child) => (
                                                    <SelectItem key={child.id} value={child.id.toString()}>
                                                        {child.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.child_id && (
                                            <p className="text-sm text-red-600">{errors.child_id}</p>
                                        )}
                                    </div>
                                )}

                                {/* Duration Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Session Duration</Label>
                                    <Select
                                        value={data.duration_minutes.toString()}
                                        onValueChange={(value) => {
                                            setData('duration_minutes', parseInt(value));
                                            if (selectedDate && data.therapist_id) {
                                                loadAvailableSlots(data.therapist_id, selectedDate);
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="30">30 minutes</SelectItem>
                                            <SelectItem value="60">60 minutes</SelectItem>
                                            <SelectItem value="90">90 minutes</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Date Selection */}
                                {data.therapist_id && (
                                    <div className="space-y-2">
                                        <Label>Select Date</Label>
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={handleDateChange}
                                            disabled={(date) => date < new Date()}
                                            className="rounded-md border"
                                        />
                                    </div>
                                )}

                                {/* Time Slot Selection */}
                                {selectedDate && data.therapist_id && (
                                    <div className="space-y-2">
                                        <Label>Available Time Slots</Label>
                                        {loadingSlots ? (
                                            <p className="text-sm text-muted-foreground">Loading available slots...</p>
                                        ) : availableSlots.length > 0 ? (
                                            <div className="grid grid-cols-3 gap-2">
                                                {availableSlots.map((slot, index) => (
                                                    <Button
                                                        key={index}
                                                        type="button"
                                                        variant={data.scheduled_at === slot.start ? 'default' : 'outline'}
                                                        onClick={() => handleSlotSelect(slot)}
                                                        className="w-full"
                                                    >
                                                        {slot.formatted_time}
                                                    </Button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                No available slots for this date. Please select another date.
                                            </p>
                                        )}
                                        {errors.scheduled_at && (
                                            <p className="text-sm text-red-600">{errors.scheduled_at}</p>
                                        )}
                                    </div>
                                )}

                                {/* Notes */}
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Any specific topics or concerns you'd like to discuss..."
                                        rows={4}
                                    />
                                </div>

                                <Button type="submit" disabled={processing || !data.scheduled_at}>
                                    Book Appointment
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
