import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, User, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

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

interface Props {
    guardians: Guardian[];
}

export default function CreateConsultation({ guardians }: Props) {
    const [data, setData] = useState({
        guardian_id: '',
        date: '',
        time: '',
        duration_minutes: '60',
        title: 'Parent Consultation',
        description: '',
    });
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        const dateString = date ? date.toISOString().split('T')[0] : '';
        setData({ ...data, date: dateString });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        try {
            // Combine date and time
            const scheduledAt = `${data.date}T${data.time}:00`;

            const response = await fetch('/api/appointments/consultation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    organizer_role: 'therapist',
                    participant_ids: [parseInt(data.guardian_id)],
                    scheduled_at: scheduledAt,
                    duration_minutes: parseInt(data.duration_minutes),
                    title: data.title,
                    description: data.description,
                }),
            });

            if (response.ok) {
                router.visit('/appointments', {
                    onSuccess: () => {
                        // Success handled by redirect
                    }
                });
            } else {
                const errorData = await response.json();
                setErrors(errorData.errors || { general: 'Failed to create consultation' });
            }
        } catch (error) {
            console.error('Failed to create consultation:', error);
            setErrors({ general: 'Failed to create consultation' });
        } finally {
            setProcessing(false);
        }
    };

    const getMinDateTime = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour <= 17; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                slots.push({ value: timeString, display: displayTime });
            }
        }
        return slots;
    };

    return (
        <AppLayout>
            <Head title="Schedule Consultation" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/appointments">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Appointments
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Schedule Parent Consultation</h1>
                        <p className="text-muted-foreground">
                            Schedule a consultation meeting with a guardian
                        </p>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Consultation Details
                        </CardTitle>
                        <CardDescription>
                            Schedule a consultation meeting with a parent/guardian to discuss their child's progress.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="guardian_id">Parent/Guardian</Label>
                                    <Select
                                        value={data.guardian_id}
                                        onValueChange={(value) => setData({ ...data, guardian_id: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a parent/guardian" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {guardians.map((guardian) => (
                                                <SelectItem key={guardian.id} value={guardian.id.toString()}>
                                                    {guardian.name} ({guardian.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.guardian_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="title">Meeting Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData({ ...data, title: e.target.value })}
                                        placeholder="e.g., Progress Review - Child's Name"
                                        required
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="date">Date</Label>
                                    <DatePicker
                                        date={selectedDate}
                                        onDateChange={handleDateChange}
                                        placeholder="Select consultation date"
                                        minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                                        className="w-full"
                                    />
                                    <InputError message={errors.date} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="time">Time</Label>
                                    <Select
                                        value={data.time}
                                        onValueChange={(value) => setData({ ...data, time: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {generateTimeSlots().map((slot) => (
                                                <SelectItem key={slot.value} value={slot.value}>
                                                    {slot.display}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.time} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="duration_minutes">Duration</Label>
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
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.duration_minutes} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Meeting Description</Label>
                                    <textarea
                                        id="description"
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={data.description}
                                        onChange={(e) => setData({ ...data, description: e.target.value })}
                                        placeholder="What would you like to discuss in this consultation? (e.g., child's progress, home strategies, concerns, etc.)"
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {data.description.length}/500 characters
                                    </p>
                                    <InputError message={errors.description} />
                                </div>
                            </div>

                            {errors.general && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                    <p className="text-sm text-red-800">{errors.general}</p>
                                </div>
                            )}

                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• The guardian will receive an email invitation</li>
                                    <li>• A Google Meet link will be automatically generated</li>
                                    <li>• Calendar invitations will be sent to both participants</li>
                                    <li>• Reminder emails will be sent 24 hours and 1 hour before the meeting</li>
                                </ul>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={processing || !data.guardian_id || !data.date || !data.time}
                                    className="flex-1"
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    Schedule Consultation
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/appointments">Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}