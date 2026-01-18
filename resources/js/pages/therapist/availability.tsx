import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, Edit2, X } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Availability {
    id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
    day_name: string;
    time_range: string;
}

interface Override {
    id: number;
    date: string;
    type: 'unavailable' | 'custom_hours';
    start_time?: string;
    end_time?: string;
    reason?: string;
}

interface Props {
    availability: Availability[];
    overrides: Override[];
}

const DAYS_OF_WEEK = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 0, label: 'Sunday' },
];

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return [
        { value: `${hour}:00`, label: `${i === 0 ? 12 : i > 12 ? i - 12 : i}:00 ${i < 12 ? 'AM' : 'PM'}` },
        { value: `${hour}:30`, label: `${i === 0 ? 12 : i > 12 ? i - 12 : i}:30 ${i < 12 ? 'AM' : 'PM'}` },
    ];
}).flat();

export default function TherapistAvailability({ availability, overrides }: Props) {
    const { flash } = usePage().props as any;
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showOverrideDialog, setShowOverrideDialog] = useState(false);
    const [editingSlot, setEditingSlot] = useState<Availability | null>(null);

    const availabilityForm = useForm({
        day_of_week: 1,
        start_time: '09:00',
        end_time: '17:00',
    });

    const editForm = useForm({
        day_of_week: 1,
        start_time: '09:00',
        end_time: '17:00',
    });

    const overrideForm = useForm({
        date: '',
        type: 'unavailable' as 'unavailable' | 'custom_hours',
        start_time: '09:00',
        end_time: '17:00',
        reason: '',
    });

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleAddAvailability = () => {
        availabilityForm.post('/therapist/availability', {
            onSuccess: () => {
                setShowAddDialog(false);
                availabilityForm.reset();
                toast.success('Availability slot added successfully');
            },
            onError: () => {
                toast.error('Failed to add availability slot');
            },
        });
    };

    const handleDeleteAvailability = (id: number) => {
        if (confirm('Are you sure you want to delete this availability slot?')) {
            availabilityForm.delete(`/therapist/availability/${id}`, {
                onSuccess: () => {
                    toast.success('Availability slot deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete availability slot');
                },
            });
        }
    };

    const handleAddOverride = () => {
        overrideForm.post('/therapist/availability/overrides', {
            onSuccess: () => {
                setShowOverrideDialog(false);
                overrideForm.reset();
                toast.success('Override added successfully');
            },
            onError: () => {
                toast.error('Failed to add override');
            },
        });
    };

    const handleDeleteOverride = (id: number) => {
        if (confirm('Are you sure you want to delete this override?')) {
            overrideForm.delete(`/therapist/availability/overrides/${id}`, {
                onSuccess: () => {
                    toast.success('Override deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete override');
                },
            });
        }
    };

    const handleEditAvailability = (slot: Availability) => {
        setEditingSlot(slot);
        editForm.setData({
            day_of_week: slot.day_of_week,
            start_time: slot.start_time,
            end_time: slot.end_time,
        });
    };

    const handleUpdateAvailability = () => {
        if (!editingSlot) return;

        editForm.put(`/therapist/availability/${editingSlot.id}`, {
            onSuccess: () => {
                setEditingSlot(null);
                editForm.reset();
                toast.success('Availability slot updated successfully');
            },
            onError: () => {
                toast.error('Failed to update availability slot');
            },
        });
    };

    const handleCancelEdit = () => {
        setEditingSlot(null);
        editForm.reset();
    };

    const groupedAvailability = DAYS_OF_WEEK.map(day => ({
        ...day,
        slots: availability.filter(a => a.day_of_week === day.value),
    }));

    return (
        <AppLayout>
            <Head title="Availability Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Availability Management</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your weekly schedule and availability overrides
                        </p>
                    </div>
                    <Button onClick={() => setShowAddDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Time Slot
                    </Button>
                </div>

                {/* Weekly Schedule */}
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Schedule</CardTitle>
                        <CardDescription>
                            Your regular availability for each day of the week
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {groupedAvailability.map(day => (
                                <div key={day.value} className="flex items-start gap-4 p-4 border rounded-lg">
                                    <div className="w-32 font-medium">{day.label}</div>
                                    <div className="flex-1">
                                        {day.slots.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">No availability set</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {day.slots.map(slot => (
                                                    <div key={slot.id} className="flex items-center justify-between p-2 bg-muted rounded">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm">{slot.time_range}</span>
                                                            {!slot.is_active && (
                                                                <Badge variant="secondary">Inactive</Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEditAvailability(slot)}
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteAvailability(slot.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Availability Overrides */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Availability Overrides</CardTitle>
                                <CardDescription>
                                    Set custom hours or mark yourself unavailable for specific dates
                                </CardDescription>
                            </div>
                            <Button variant="outline" onClick={() => setShowOverrideDialog(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Override
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {overrides.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No overrides set. Add overrides for holidays or custom hours.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {overrides.map(override => (
                                    <div key={override.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">
                                                    {new Date(override.date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                                <Badge variant={override.type === 'unavailable' ? 'destructive' : 'secondary'}>
                                                    {override.type === 'unavailable' ? 'Unavailable' : 'Custom Hours'}
                                                </Badge>
                                            </div>
                                            {override.type === 'custom_hours' && override.start_time && override.end_time && (
                                                <p className="text-sm text-muted-foreground ml-6">
                                                    {override.start_time} - {override.end_time}
                                                </p>
                                            )}
                                            {override.reason && (
                                                <p className="text-sm text-muted-foreground ml-6">{override.reason}</p>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteOverride(override.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Add Availability Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Availability Slot</DialogTitle>
                        <DialogDescription>
                            Add a new time slot to your weekly schedule
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Day of Week</Label>
                            <Select
                                value={availabilityForm.data.day_of_week.toString()}
                                onValueChange={(value) => availabilityForm.setData('day_of_week', parseInt(value))}
                            >
                                <SelectTrigger className={availabilityForm.errors.day_of_week ? 'border-red-500' : ''}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {DAYS_OF_WEEK.map(day => (
                                        <SelectItem key={day.value} value={day.value.toString()}>
                                            {day.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {availabilityForm.errors.day_of_week && (
                                <p className="text-red-500 text-sm">{availabilityForm.errors.day_of_week}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Time</Label>
                                <Select
                                    value={availabilityForm.data.start_time}
                                    onValueChange={(value) => availabilityForm.setData('start_time', value)}
                                >
                                    <SelectTrigger className={availabilityForm.errors.start_time ? 'border-red-500' : ''}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px]" position="popper" sideOffset={4}>
                                        {TIME_SLOTS.map(slot => (
                                            <SelectItem key={slot.value} value={slot.value}>
                                                {slot.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {availabilityForm.errors.start_time && (
                                    <p className="text-red-500 text-sm">{availabilityForm.errors.start_time}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>End Time</Label>
                                <Select
                                    value={availabilityForm.data.end_time}
                                    onValueChange={(value) => availabilityForm.setData('end_time', value)}
                                >
                                    <SelectTrigger className={availabilityForm.errors.end_time ? 'border-red-500' : ''}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px]" position="popper" sideOffset={4}>
                                        {TIME_SLOTS.map(slot => (
                                            <SelectItem key={slot.value} value={slot.value}>
                                                {slot.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {availabilityForm.errors.end_time && (
                                    <p className="text-red-500 text-sm">{availabilityForm.errors.end_time}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddAvailability} disabled={availabilityForm.processing}>
                            Add Slot
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Override Dialog */}
            <Dialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Availability Override</DialogTitle>
                        <DialogDescription>
                            Set custom hours or mark yourself unavailable for a specific date
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={overrideForm.data.date}
                                onChange={(e) => overrideForm.setData('date', e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className={overrideForm.errors.date ? 'border-red-500' : ''}
                            />
                            {overrideForm.errors.date && (
                                <p className="text-red-500 text-sm">{overrideForm.errors.date}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                                value={overrideForm.data.type}
                                onValueChange={(value: 'unavailable' | 'custom_hours') => overrideForm.setData('type', value)}
                            >
                                <SelectTrigger className={overrideForm.errors.type ? 'border-red-500' : ''}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unavailable">Unavailable</SelectItem>
                                    <SelectItem value="custom_hours">Custom Hours</SelectItem>
                                </SelectContent>
                            </Select>
                            {overrideForm.errors.type && (
                                <p className="text-red-500 text-sm">{overrideForm.errors.type}</p>
                            )}
                        </div>
                        {overrideForm.data.type === 'custom_hours' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Time</Label>
                                    <Select
                                        value={overrideForm.data.start_time}
                                        onValueChange={(value) => overrideForm.setData('start_time', value)}
                                    >
                                        <SelectTrigger className={overrideForm.errors.start_time ? 'border-red-500' : ''}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[200px]" position="popper" sideOffset={4}>
                                            {TIME_SLOTS.map(slot => (
                                                <SelectItem key={slot.value} value={slot.value}>
                                                    {slot.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {overrideForm.errors.start_time && (
                                        <p className="text-red-500 text-sm">{overrideForm.errors.start_time}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>End Time</Label>
                                    <Select
                                        value={overrideForm.data.end_time}
                                        onValueChange={(value) => overrideForm.setData('end_time', value)}
                                    >
                                        <SelectTrigger className={overrideForm.errors.end_time ? 'border-red-500' : ''}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[200px]" position="popper" sideOffset={4}>
                                            {TIME_SLOTS.map(slot => (
                                                <SelectItem key={slot.value} value={slot.value}>
                                                    {slot.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {overrideForm.errors.end_time && (
                                        <p className="text-red-500 text-sm">{overrideForm.errors.end_time}</p>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>Reason (Optional)</Label>
                            <Textarea
                                value={overrideForm.data.reason}
                                onChange={(e) => overrideForm.setData('reason', e.target.value)}
                                placeholder="e.g., Holiday, Conference, Personal day"
                                className={overrideForm.errors.reason ? 'border-red-500' : ''}
                            />
                            {overrideForm.errors.reason && (
                                <p className="text-red-500 text-sm">{overrideForm.errors.reason}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowOverrideDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddOverride} disabled={overrideForm.processing}>
                            Add Override
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Availability Dialog */}
            <Dialog open={!!editingSlot} onOpenChange={() => setEditingSlot(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Availability Slot</DialogTitle>
                        <DialogDescription>
                            Update the time slot for your weekly schedule
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Day of Week</Label>
                            <Select
                                value={editForm.data.day_of_week.toString()}
                                onValueChange={(value) => editForm.setData('day_of_week', parseInt(value))}
                            >
                                <SelectTrigger className={editForm.errors.day_of_week ? 'border-red-500' : ''}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {DAYS_OF_WEEK.map(day => (
                                        <SelectItem key={day.value} value={day.value.toString()}>
                                            {day.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {editForm.errors.day_of_week && (
                                <p className="text-red-500 text-sm">{editForm.errors.day_of_week}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Time</Label>
                                <Select
                                    value={editForm.data.start_time}
                                    onValueChange={(value) => editForm.setData('start_time', value)}
                                >
                                    <SelectTrigger className={editForm.errors.start_time ? 'border-red-500' : ''}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px]" position="popper" sideOffset={4}>
                                        {TIME_SLOTS.map(slot => (
                                            <SelectItem key={slot.value} value={slot.value}>
                                                {slot.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editForm.errors.start_time && (
                                    <p className="text-red-500 text-sm">{editForm.errors.start_time}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>End Time</Label>
                                <Select
                                    value={editForm.data.end_time}
                                    onValueChange={(value) => editForm.setData('end_time', value)}
                                >
                                    <SelectTrigger className={editForm.errors.end_time ? 'border-red-500' : ''}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px]" position="popper" sideOffset={4}>
                                        {TIME_SLOTS.map(slot => (
                                            <SelectItem key={slot.value} value={slot.value}>
                                                {slot.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editForm.errors.end_time && (
                                    <p className="text-red-500 text-sm">{editForm.errors.end_time}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancelEdit}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateAvailability} disabled={editForm.processing}>
                            Update Slot
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
