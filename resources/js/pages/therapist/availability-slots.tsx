import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

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
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [view, setView] = useState<'month' | 'day'>('month');
    const [editingSlot, setEditingSlot] = useState<Slot | null>(null);

    const form = useForm({
        date: '',
        start_time: '',
        end_time: '',
    });

    const editForm = useForm({
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
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset('start_time', 'end_time');
                toast({
                    title: 'Success',
                    description: 'Availability slot created successfully',
                });
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
                preserveState: false,
                onSuccess: () => {
                    toast({
                        title: 'Success',
                        description: 'Slot deleted successfully',
                    });
                },
            });
        }
    };

    const handleEdit = (slot: Slot) => {
        setEditingSlot(slot);
        editForm.setData({
            start_time: slot.start_time.substring(0, 5),
            end_time: slot.end_time.substring(0, 5),
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSlot) return;

        const slotDate = new Date(editingSlot.date);

        editForm.put(`/therapist/availability-slots/${editingSlot.id}`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setSelectedDate(slotDate);
                setView('day');
                setEditingSlot(null);
                toast({
                    title: 'Success',
                    description: 'Slot updated successfully',
                });
            },
            onError: () => {
                toast({
                    title: 'Error',
                    description: 'Failed to update slot',
                    variant: 'destructive',
                });
            },
        });
    };

    const groupedSlots = slots.reduce((acc, slot) => {
        if (!acc[slot.date]) {
            acc[slot.date] = [];
        }
        acc[slot.date].push(slot);
        return acc;
    }, {} as Record<string, Slot[]>);

    const getMonthDays = () => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));
        return eachDayOfInterval({ start, end });
    };

    const getSlotsForDate = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return groupedSlots[dateStr] || [];
    };

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setView('day');
        form.setData('date', format(date, 'yyyy-MM-dd'));
    };

    const renderMonthView = () => {
        const days = getMonthDays();
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
                            Today
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-sm font-semibold p-2 text-muted-foreground">
                            {day}
                        </div>
                    ))}
                    {days.map((day, idx) => {
                        const daySlots = getSlotsForDate(day);
                        const hasBooked = daySlots.some(s => s.is_booked);
                        const hasAvailable = daySlots.some(s => !s.is_booked);
                        const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                        const isPast = day < new Date() && !isSameDay(day, new Date());

                        return (
                            <button
                                key={idx}
                                onClick={() => !isPast && handleDayClick(day)}
                                disabled={isPast}
                                className={`
                                    min-h-[80px] p-2 border rounded-lg text-left transition-colors
                                    ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                                    ${isPast ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 cursor-pointer'}
                                    ${isSameDay(day, selectedDate || new Date()) ? 'border-blue-500 border-2' : ''}
                                `}
                            >
                                <div className="text-sm font-medium mb-1">
                                    {format(day, 'd')}
                                </div>
                                <div className="space-y-1">
                                    {hasBooked && (
                                        <div className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                                            {daySlots.filter(s => s.is_booked).length} booked
                                        </div>
                                    )}
                                    {hasAvailable && (
                                        <div className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                                            {daySlots.filter(s => !s.is_booked).length} available
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderDayView = () => {
        if (!selectedDate) return null;

        const daySlots = getSlotsForDate(selectedDate);

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </h2>
                    <Button variant="outline" size="sm" onClick={() => setView('month')}>
                        Back to Month
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* Create Slot Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Slot</CardTitle>
                            <CardDescription>Add availability for this date</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
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
                            </form>
                        </CardContent>
                    </Card>

                    {/* Slots for this day */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Slots for This Day</CardTitle>
                            <CardDescription>{daySlots.length} slot(s)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {daySlots.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>No slots for this day</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                    {daySlots.map((slot) => (
                                        <div
                                            key={slot.id}
                                            className={`flex items-center justify-between p-3 border rounded-md ${
                                                slot.is_booked ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">
                                                    {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded ${
                                                    slot.is_booked 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {slot.is_booked ? 'Booked' : 'Available'}
                                                </span>
                                            </div>
                                            {!slot.is_booked && (
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(slot)}
                                                    >
                                                        <Edit2 className="h-4 w-4 text-blue-500" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(slot.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    };

    return (
        <AppLayout>
            <Head title="Manage Availability Slots" />

            <div className="container mx-auto px-4 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Manage Availability Slots</h1>
                        <p className="text-muted-foreground">
                            Create specific date and time slots for client appointments
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={view === 'month' ? 'default' : 'outline'}
                            onClick={() => setView('month')}
                        >
                            Month View
                        </Button>
                        <Button
                            variant={view === 'day' ? 'default' : 'outline'}
                            onClick={() => {
                                if (!selectedDate) setSelectedDate(new Date());
                                setView('day');
                            }}
                        >
                            Day View
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        {view === 'month' ? renderMonthView() : renderDayView()}
                    </CardContent>
                </Card>

                {/* Legend */}
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                        <span>Booked Slots</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                        <span>Available Slots</span>
                    </div>
                </div>

                {/* Edit Slot Dialog */}
                <Dialog open={!!editingSlot} onOpenChange={() => setEditingSlot(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Availability Slot</DialogTitle>
                            <DialogDescription>
                                Update the time for this slot
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdate}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Start Time</Label>
                                    <Input
                                        type="time"
                                        value={editForm.data.start_time}
                                        onChange={(e) => editForm.setData('start_time', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Time</Label>
                                    <Input
                                        type="time"
                                        value={editForm.data.end_time}
                                        onChange={(e) => editForm.setData('end_time', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingSlot(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editForm.processing}>
                                    Update Slot
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
