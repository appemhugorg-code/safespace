import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Slot {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    is_booked: boolean;
}

interface Props {
    slots: Slot[];
}

export default function AvailabilitySlots({ slots }: Props) {
    const { toast } = useToast();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const form = useForm({
        date: '',
        start_time: '',
        end_time: '',
    });

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            form.setData('date', format(date, 'yyyy-MM-dd'));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post('/therapist/availability-slots', {
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'Availability slot created successfully',
                });
                form.reset();
                setSelectedDate(undefined);
            },
            onError: (errors) => {
                toast({
                    title: 'Error',
                    description: errors.time || 'Failed to create slot',
                    variant: 'destructive',
                });
            },
        });
    };

    const handleDelete = (slotId: number) => {
        if (confirm('Are you sure you want to delete this slot?')) {
            router.delete(`/therapist/availability-slots/${slotId}`, {
                onSuccess: () => {
                    toast({
                        title: 'Success',
                        description: 'Slot deleted successfully',
                    });
                },
            });
        }
    };

    const groupedSlots = slots.reduce((acc, slot) => {
        if (!acc[slot.date]) {
            acc[slot.date] = [];
        }
        acc[slot.date].push(slot);
        return acc;
    }, {} as Record<string, Slot[]>);

    return (
        <AppLayout>
            <Head title="Manage Availability Slots" />

            <div className="container mx-auto px-4 py-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Manage Availability Slots</h1>
                    <p className="text-muted-foreground">
                        Create specific date and time slots for client appointments
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Create Slot Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Slot</CardTitle>
                            <CardDescription>
                                Select a date and time range for availability
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Select Date</Label>
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={handleDateSelect}
                                        disabled={(date) => date < new Date()}
                                        className="rounded-md border"
                                    />
                                </div>

                                {selectedDate && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Start Time</Label>
                                            <Input
                                                type="time"
                                                value={form.data.start_time}
                                                onChange={(e) => form.setData('start_time', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>End Time</Label>
                                            <Input
                                                type="time"
                                                value={form.data.end_time}
                                                onChange={(e) => form.setData('end_time', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <Button type="submit" disabled={form.processing} className="w-full">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Slot
                                        </Button>
                                    </>
                                )}
                            </form>
                        </CardContent>
                    </Card>

                    {/* Existing Slots */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Availability Slots</CardTitle>
                            <CardDescription>
                                Manage your upcoming availability
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {slots.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>No availability slots created yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                                    {Object.entries(groupedSlots).map(([date, dateSlots]) => (
                                        <div key={date} className="space-y-2">
                                            <h3 className="font-semibold text-sm">
                                                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                                            </h3>
                                            {dateSlots.map((slot) => (
                                                <div
                                                    key={slot.id}
                                                    className={`flex items-center justify-between p-3 border rounded-md ${
                                                        slot.is_booked ? 'bg-gray-50' : 'bg-white'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">
                                                            {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                                                        </span>
                                                        {slot.is_booked && (
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                Booked
                                                            </span>
                                                        )}
                                                    </div>
                                                    {!slot.is_booked && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(slot.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
