import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Clock, CheckCircle, UserPlus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';

interface Therapist {
    id: number;
    name: string;
    email: string;
    specialization?: string;
    connection_id: number;
    assigned_at: string;
}

interface ConnectedTherapist {
    id: number;
    name: string;
    connection_id: number;
    assigned_at: string;
}

interface PendingAssignment {
    id: number;
    therapist_name: string;
    created_at: string;
}

interface Child {
    id: number;
    name: string;
    email: string;
    age?: number;
    status: string;
    connected_therapists: ConnectedTherapist[];
    pending_assignments: PendingAssignment[];
}

interface Stats {
    total_children: number;
    children_with_therapists: number;
    available_therapists: number;
}

interface Props {
    children: Child[];
    connected_therapists: Therapist[];
    stats: Stats;
}

export default function GuardianChildAssignment({ children, connected_therapists, stats }: Props) {
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [showAssignDialog, setShowAssignDialog] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        child_id: '',
        therapist_id: '',
    });

    const handleAssignChild = (child: Child) => {
        setSelectedChild(child);
        setData('child_id', child.id.toString());
        setShowAssignDialog(true);
    };

    const submitAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        post('/api/guardian/child-assignments', {
            onSuccess: () => {
                toast.success('Child assignment request sent successfully!');
                setShowAssignDialog(false);
                reset();
                setSelectedChild(null);
            },
            onError: (errors) => {
                if (errors.message) {
                    toast.error(errors.message);
                } else {
                    toast.error('Failed to send assignment request. Please try again.');
                }
            },
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getAvailableTherapistsForChild = (child: Child) => {
        const connectedTherapistIds = child.connected_therapists.map(t => t.id);
        return connected_therapists.filter(t => !connectedTherapistIds.includes(t.id));
    };

    return (
        <AppLayout>
            <Head title="Assign Children to Therapists" />

            <div className="container-mobile space-y-6 sm:space-y-8 py-4 sm:py-6 lg:py-8 animate-fade-in">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Assign Children to Therapists</h1>
                        <p className="text-muted-foreground">
                            Assign your children to therapists you're already connected with
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Children</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_children}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">With Therapists</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.children_with_therapists}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Available Therapists</CardTitle>
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.available_therapists}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Connected Therapists Overview */}
                {connected_therapists.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Connected Therapists</CardTitle>
                            <CardDescription>
                                You can assign your children to any of these therapists
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {connected_therapists.map((therapist) => (
                                    <Card key={therapist.id} className="border-green-200">
                                        <CardContent className="pt-4">
                                            <h4 className="font-semibold">{therapist.name}</h4>
                                            <p className="text-sm text-muted-foreground">{therapist.specialization || 'General Therapy'}</p>
                                            <div className="mt-2">
                                                <Badge variant="outline" className="text-green-600">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Connected
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Children List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Your Children</h2>

                    {children.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Children Found</h3>
                                <p className="text-muted-foreground text-center">
                                    You don't have any children registered in the system yet.
                                </p>
                            </CardContent>
                        </Card>
                    ) : connected_therapists.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Connected Therapists</h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    You need to connect with therapists first before you can assign your children.
                                </p>
                                <Button asChild>
                                    <a href="/guardian/connections/search">Find Therapists</a>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {children.map((child) => {
                                const availableTherapists = getAvailableTherapistsForChild(child);

                                return (
                                    <Card key={child.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg">{child.name}</CardTitle>
                                                    <CardDescription>
                                                        {child.age && `Age: ${child.age} • `}
                                                        {child.email}
                                                    </CardDescription>
                                                </div>
                                                <Badge variant={child.status === 'active' ? 'default' : 'secondary'}>
                                                    {child.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {/* Connected Therapists */}
                                                {child.connected_therapists.length > 0 && (
                                                    <div>
                                                        <h4 className="font-medium text-sm mb-2">Connected Therapists:</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {child.connected_therapists.map((therapist) => (
                                                                <Badge key={therapist.id} variant="outline" className="text-green-600">
                                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                                    {therapist.name}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Pending Assignments */}
                                                {child.pending_assignments.length > 0 && (
                                                    <div>
                                                        <h4 className="font-medium text-sm mb-2">Pending Assignments:</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {child.pending_assignments.map((assignment) => (
                                                                <Badge key={assignment.id} variant="outline" className="text-yellow-600">
                                                                    <Clock className="w-3 h-3 mr-1" />
                                                                    {assignment.therapist_name}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Assignment Actions */}
                                                <div className="flex justify-between items-center pt-2 border-t">
                                                    <div className="text-sm text-muted-foreground">
                                                        {availableTherapists.length > 0
                                                            ? `${availableTherapists.length} therapist(s) available for assignment`
                                                            : 'All your therapists are already connected to this child'
                                                        }
                                                    </div>
                                                    <Button
                                                        onClick={() => handleAssignChild(child)}
                                                        disabled={availableTherapists.length === 0}
                                                    >
                                                        <UserPlus className="w-4 h-4 mr-2" />
                                                        Assign Therapist
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Assignment Dialog */}
                <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Assign Therapist to {selectedChild?.name}</DialogTitle>
                            <DialogDescription>
                                Select a therapist to send an assignment request for {selectedChild?.name}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitAssignment}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="therapist_id" className="text-sm font-medium">
                                        Select Therapist
                                    </label>
                                    <Select value={data.therapist_id} onValueChange={(value) => setData('therapist_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a therapist..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectedChild && getAvailableTherapistsForChild(selectedChild).map((therapist) => (
                                                <SelectItem key={therapist.id} value={therapist.id.toString()}>
                                                    <div className="flex flex-col">
                                                        <span>{therapist.name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {therapist.specialization || 'General Therapy'}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.therapist_id && (
                                        <p className="text-sm text-red-600 mt-1">{errors.therapist_id}</p>
                                    )}
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-sm mb-2">What happens next?</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• The therapist will receive your assignment request</li>
                                        <li>• They can approve or decline the request</li>
                                        <li>• You'll be notified of their decision</li>
                                        <li>• If approved, your child will be connected to the therapist</li>
                                    </ul>
                                </div>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={() => setShowAssignDialog(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing || !data.therapist_id}>
                                    {processing ? 'Sending...' : 'Send Assignment Request'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}