import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, UserPlus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ConnectedTherapist {
    id: number;
    name: string;
    connection_id: number;
    assigned_at: string;
    specialization?: string;
}

interface PendingAssignment {
    id: number;
    therapist_name: string;
    created_at: string;
}

interface AvailableTherapist {
    id: number;
    name: string;
    email: string;
    specialization?: string;
    connection_id: number;
    assigned_at: string;
}

interface Child {
    id: number;
    name: string;
    status: string;
}

interface Props {
    child: Child;
    connectedTherapists: ConnectedTherapist[];
    pendingAssignments: PendingAssignment[];
    availableTherapists: AvailableTherapist[];
    onAssignmentUpdate?: () => void;
}

export default function TherapistAssignment({ 
    child, 
    connectedTherapists, 
    pendingAssignments, 
    availableTherapists,
    onAssignmentUpdate 
}: Props) {
    const [showAssignDialog, setShowAssignDialog] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        child_id: child.id.toString(),
        therapist_id: '',
    });

    const handleAssignTherapist = () => {
        setShowAssignDialog(true);
    };

    const submitAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        post('/guardian/child-assignments', {
            onSuccess: () => {
                setShowAssignDialog(false);
                reset('therapist_id');
                onAssignmentUpdate?.();
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

    const canAssignTherapists = child.status === 'active' && availableTherapists.length > 0;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Therapist Assignments
                        </CardTitle>
                        <CardDescription>
                            Manage therapist connections for {child.name}
                        </CardDescription>
                    </div>
                    {canAssignTherapists && (
                        <Button onClick={handleAssignTherapist} size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Assign Therapist
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Connected Therapists */}
                {connectedTherapists.length > 0 && (
                    <div>
                        <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Connected Therapists ({connectedTherapists.length})
                        </h4>
                        <div className="space-y-3">
                            {connectedTherapists.map((therapist) => (
                                <div key={therapist.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{therapist.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {therapist.specialization || 'General Therapy'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className="text-green-600 border-green-300">
                                            Active
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Since {formatDate(therapist.assigned_at)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pending Assignments */}
                {pendingAssignments.length > 0 && (
                    <div>
                        <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            Pending Assignments ({pendingAssignments.length})
                        </h4>
                        <div className="space-y-3">
                            {pendingAssignments.map((assignment) => (
                                <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <Clock className="h-4 w-4 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{assignment.therapist_name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Awaiting therapist approval
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                                            Pending
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Sent {formatDate(assignment.created_at)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Therapists State */}
                {connectedTherapists.length === 0 && pendingAssignments.length === 0 && (
                    <div className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium text-lg mb-2">No Therapists Assigned</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            {child.name} doesn't have any therapists assigned yet.
                        </p>
                        {canAssignTherapists ? (
                            <Button onClick={handleAssignTherapist}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Assign First Therapist
                            </Button>
                        ) : availableTherapists.length === 0 ? (
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    You need to connect with therapists first.
                                </p>
                                <Button variant="outline" asChild>
                                    <a href="/guardian/connections/search">Find Therapists</a>
                                </Button>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Child account must be active to assign therapists.
                            </p>
                        )}
                    </div>
                )}

                {/* Available Therapists Info */}
                {availableTherapists.length > 0 && (
                    <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            You have {availableTherapists.length} therapist{availableTherapists.length !== 1 ? 's' : ''} available for assignment.
                        </p>
                    </div>
                )}

                {/* No Available Therapists Warning */}
                {availableTherapists.length === 0 && child.status === 'active' && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-800 text-sm">No Available Therapists</h4>
                            <p className="text-blue-700 text-sm mt-1">
                                All your connected therapists are already assigned to {child.name}. 
                                Connect with more therapists to assign additional ones.
                            </p>
                            <Button variant="outline" size="sm" className="mt-2" asChild>
                                <a href="/guardian/connections/search">Find More Therapists</a>
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>

            {/* Assignment Dialog */}
            <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Therapist to {child.name}</DialogTitle>
                        <DialogDescription>
                            Select a therapist to send an assignment request for {child.name}
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
                                        {availableTherapists.map((therapist) => (
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
                                    <li>• If approved, {child.name} will be connected to the therapist</li>
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
        </Card>
    );
}