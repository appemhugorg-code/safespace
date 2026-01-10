import { Head, router } from '@inertiajs/react';
import { ArrowLeft, User, Calendar, UserCheck, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Connection {
    id: number;
    therapist_id: number;
    client_id: number;
    client_type: 'guardian' | 'child';
    connection_type: 'admin_assigned' | 'guardian_requested' | 'guardian_child_assignment';
    status: 'active' | 'inactive' | 'terminated';
    assigned_at: string;
    terminated_at?: string;
    therapist: User;
    client: User;
    assigned_by?: User;
}

interface Props {
    connection: Connection;
}

export default function ConnectionDetail({ connection }: Props) {
    const [terminateDialogOpen, setTerminateDialogOpen] = useState(false);
    const [terminating, setTerminating] = useState(false);

    const handleTerminateConnection = () => {
        setTerminating(true);

        router.delete(`/admin/connections/${connection.id}`, {
            onSuccess: () => {
                toast.success('Connection terminated successfully');
                router.get('/admin/connections');
            },
            onError: (errors) => {
                toast.error('Failed to terminate connection');
                setTerminating(false);
                setTerminateDialogOpen(false);
            }
        });
    };

    const getConnectionTypeBadge = (type: string) => {
        switch (type) {
            case 'admin_assigned':
                return <Badge className="bg-blue-100 text-blue-800">Admin Assigned</Badge>;
            case 'guardian_requested':
                return <Badge className="bg-green-100 text-green-800">Guardian Requested</Badge>;
            case 'guardian_child_assignment':
                return <Badge className="bg-purple-100 text-purple-800">Child Assignment</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800">{type}</Badge>;
        }
    };

    const getClientTypeBadge = (type: string) => {
        switch (type) {
            case 'guardian':
                return <Badge variant="outline" className="text-green-700 border-green-300">Guardian</Badge>;
            case 'child':
                return <Badge variant="outline" className="text-purple-700 border-purple-300">Child</Badge>;
            default:
                return <Badge variant="outline">{type}</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800">Active</Badge>;
            case 'terminated':
                return <Badge className="bg-red-100 text-red-800">Terminated</Badge>;
            case 'inactive':
                return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title={`Connection: ${connection.therapist.name} ↔ ${connection.client.name}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.get('/admin/connections')}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Connections
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">
                                {connection.therapist.name} ↔ {connection.client.name}
                            </h1>
                            <p className="text-muted-foreground">
                                Connection Details
                            </p>
                        </div>
                    </div>
                    {connection.status === 'active' && (
                        <Button
                            variant="destructive"
                            onClick={() => setTerminateDialogOpen(true)}
                            disabled={terminating}
                        >
                            {terminating ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Terminate Connection
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Connection Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5" />
                                Connection Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Status:</span>
                                {getStatusBadge(connection.status)}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Connection Type:</span>
                                {getConnectionTypeBadge(connection.connection_type)}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Client Type:</span>
                                {getClientTypeBadge(connection.client_type)}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Created:</span>
                                <span className="text-sm">{new Date(connection.assigned_at).toLocaleDateString()}</span>
                            </div>
                            {connection.assigned_by && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Assigned By:</span>
                                    <span className="text-sm">{connection.assigned_by.name}</span>
                                </div>
                            )}
                            {connection.terminated_at && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Terminated:</span>
                                    <span className="text-sm text-red-600">
                                        {new Date(connection.terminated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Therapist Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Therapist Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Name</div>
                                <div className="text-lg font-semibold">{connection.therapist.name}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Email</div>
                                <div>{connection.therapist.email}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">User ID</div>
                                <div className="font-mono text-sm">{connection.therapist.id}</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Client Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Client Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Name</div>
                                <div className="text-lg font-semibold">{connection.client.name}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Email</div>
                                <div>{connection.client.email}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Type</div>
                                <div className="capitalize">{connection.client_type}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">User ID</div>
                                <div className="font-mono text-sm">{connection.client.id}</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Connection History */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Connection History
                            </CardTitle>
                            <CardDescription>
                                Timeline of connection events
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <div>
                                        <div className="font-medium">Connection Created</div>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(connection.assigned_at).toLocaleString()}
                                            {connection.assigned_by && (
                                                <span> by {connection.assigned_by.name}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {connection.terminated_at && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                        <div>
                                            <div className="font-medium">Connection Terminated</div>
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(connection.terminated_at).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Terminate Connection Dialog */}
            <Dialog open={terminateDialogOpen} onOpenChange={setTerminateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Terminate Connection</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to terminate the connection between{' '}
                            {connection.therapist.name} and {connection.client.name}?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setTerminateDialogOpen(false)}
                            disabled={terminating}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleTerminateConnection}
                            disabled={terminating}
                        >
                            {terminating && (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            Terminate Connection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}