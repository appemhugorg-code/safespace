import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Calendar, Clock, User, AlertCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface User {
    id: number;
    name: string;
    email: string;
}

interface TimeSlot {
    start: string;
    formatted_time: string;
}

interface Props {
    userRole: 'guardian' | 'therapist' | 'child';
    children?: User[];
    therapists?: User[];
    patients?: User[];
    child?: User;
    therapist?: User;
}

export default function CreateAppointment({ userRole, children, therapists, patients, child, therapist }: Props) {
    const { toast } = useToast();
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const form = useForm({
        child_id: child?.id.toString() || '',
        therapist_id: therapist?.id.toString() || '',
        scheduled_at: '',
        duration_minutes: 60,
        notes: '',
    });

    useEffect(() => {
        if (form.data.therapist_id && selectedDate) {
            fetchAvailableSlots();
        } else {
            setAvailableSlots([]);
        }
    }, [form.data.therapist_id, selectedDate, form.data.duration_minutes]);

    const fetchAvailableSlots = async () => {
        setLoadingSlots(true);
        try {
            const response = await fetch(
                `/api/therapists/${form.data.therapist_id}/available-slots?date=${selectedDate}&duration=${form.data.duration_minutes}`
            );
            const data = await response.json();
            setAvailableSlots(data.slots || []);
        } catch (error) {
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
                toast({
                    title: 'Success',
                    description: userRole === 'therapist'
                        ? 'Appointment scheduled successfully!'
                        : 'Appointment request submitted successfully!',
                });
            },
            onError: (errors) => {
                toast({
                    title: 'Error',
                    description: errors.scheduled_at || 'Failed to create appointment',
                    variant: 'destructive',
                });
            },
        });
    };

    const minDate = new Date().toISOString().split('T')[0];

    return (
        <AppLayout>
            <Head title="Schedule Appointment" />

            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8 space-y-6 max-w-full overflow-x-hidden">
                <div>
                    <h1 className="text-3xl font-bold">Schedule Appointment</h1>
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input
                                        type="date"
                                        min={minDate}
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Duration</Label>
                                    <Select
                                        value={form.data.duration_minutes.toString()}
                                        onValueChange={(value) => form.setData('duration_minutes', parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="30">30 minutes</SelectItem>
                                            <SelectItem value="45">45 minutes</SelectItem>
                                            <SelectItem value="60">60 minutes</SelectItem>
                                            <SelectItem value="90">90 minutes</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {selectedDate && form.data.therapist_id && (
                                <div className="space-y-2">
                                    <Label>Available Time Slots</Label>
                                    {loadingSlots ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            Loading available slots...
                                        </div>
                                    ) : availableSlots.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No available slots for this date. Please try another date.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-4 gap-2">
                                            {availableSlots.map((slot, index) => (
                                                <Button
                                                    key={index}
                                                    type="button"
                                                    variant={form.data.scheduled_at === slot.start ? 'default' : 'outline'}
                                                    className="w-full"
                                                    onClick={() => form.setData('scheduled_at', slot.start)}
                                                >
                                                    <Clock className="mr-2 h-4 w-4" />
                                                    {slot.formatted_time}
                                                </Button>
                                            ))}
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
                            disabled={!form.data.child_id || !form.data.therapist_id || !form.data.scheduled_at || form.processing}
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
