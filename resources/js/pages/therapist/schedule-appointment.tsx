import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar, Clock, User, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Patient {
    id: number;
    name: string;
    email: string;
    guardian?: {
        id: number;
        name: string;
    };
}

interface TimeSlot {
    start: string;
    end: string;
    formatted_time: string;
    available: boolean;
}

interface Props {
    patients: Patient[];
}

export default function TherapistScheduleAppointment({ patients }: Props) {
    const { toast } = useToast();
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const form = useForm({
        child_id: '',
        guardian_id: '',
        scheduled_at: '',
        duration_minutes: 60,
        notes: '',
        status: 'confirmed',
    });

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePatientSelect = (patientId: string) => {
        const patient = patients.find(p => p.id === parseInt(patientId));
        if (patient) {
            setSelectedPatient(patient);
            form.setData({
                ...form.data,
                child_id: patient.id.toString(),
                guardian_id: patient.guardian?.id.toString() || '',
            });
        }
    };

    const handleDateChange = async (date: string) => {
        setSelectedDate(date);
        if (!date) {
            setAvailableSlots([]);
            return;
        }

        setLoadingSlots(true);
        try {
            // Get therapist's own available slots
            const response = await fetch(`/api/therapists/${form.data.therapist_id || 'me'}/available-slots?date=${date}&duration=${form.data.duration_minutes}`);
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

    const handleTimeSlotSelect = (slot: TimeSlot) => {
        form.setData('scheduled_at', slot.start);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.data.child_id || !form.data.scheduled_at) {
            toast({
                title: 'Validation Error',
                description: 'Please select a patient and time slot',
                variant: 'destructive',
            });
            return;
        }

        form.post('/appointments', {
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'Appointment scheduled successfully',
                });
                // Reset form
                setSelectedPatient(null);
                setSelectedDate('');
                setAvailableSlots([]);
                form.reset();
            },
            onError: (errors) => {
                toast({
                    title: 'Error',
                    description: errors.message || 'Failed to schedule appointment',
                    variant: 'destructive',
                });
            },
        });
    };

    const minDate = new Date().toISOString().split('T')[0];

    return (
        <AppLayout>
            <Head title="Schedule Appointment" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Schedule Appointment</h1>
                    <p className="text-muted-foreground mt-1">
                        Schedule a therapy session with your patients
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Patient Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Patient</CardTitle>
                            <CardDescription>
                                Choose the patient for this appointment
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Search Patients</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Patient</Label>
                                <Select
                                    value={form.data.child_id}
                                    onValueChange={handlePatientSelect}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a patient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredPatients.length === 0 ? (
                                            <div className="p-2 text-sm text-muted-foreground">
                                                No patients found
                                            </div>
                                        ) : (
                                            filteredPatients.map(patient => (
                                                <SelectItem key={patient.id} value={patient.id.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4" />
                                                        <div>
                                                            <div>{patient.name}</div>
                                                            {patient.guardian && (
                                                                <div className="text-xs text-muted-foreground">
                                                                    Guardian: {patient.guardian.name}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedPatient && (
                                <div className="p-4 bg-muted rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{selectedPatient.name}</p>
                                            <p className="text-sm text-muted-foreground">{selectedPatient.email}</p>
                                            {selectedPatient.guardian && (
                                                <p className="text-sm text-muted-foreground">
                                                    Guardian: {selectedPatient.guardian.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Date and Time Selection */}
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
                                        onChange={(e) => handleDateChange(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Duration</Label>
                                    <Select
                                        value={form.data.duration_minutes.toString()}
                                        onValueChange={(value) => {
                                            form.setData('duration_minutes', parseInt(value));
                                            if (selectedDate) {
                                                handleDateChange(selectedDate);
                                            }
                                        }}
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

                            {selectedDate && (
                                <div className="space-y-2">
                                    <Label>Available Time Slots</Label>
                                    {loadingSlots ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            Loading available slots...
                                        </div>
                                    ) : availableSlots.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No available slots for this date. Try another date or check your availability settings.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-4 gap-2">
                                            {availableSlots.map((slot, index) => (
                                                <Button
                                                    key={index}
                                                    type="button"
                                                    variant={form.data.scheduled_at === slot.start ? 'default' : 'outline'}
                                                    className="w-full"
                                                    onClick={() => handleTimeSlotSelect(slot)}
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

                    {/* Additional Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Details</CardTitle>
                            <CardDescription>
                                Add notes or special instructions for this session
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Session Notes (Optional)</Label>
                                <Textarea
                                    placeholder="Add any notes about this session..."
                                    value={form.data.notes}
                                    onChange={(e) => form.setData('notes', e.target.value)}
                                    rows={4}
                                />
                            </div>
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
                            disabled={!form.data.child_id || !form.data.scheduled_at || form.processing}
                        >
                            {form.processing ? 'Scheduling...' : 'Schedule Appointment'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
