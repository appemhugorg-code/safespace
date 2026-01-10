import { Head, router, usePage } from '@inertiajs/react';
import { Users, UserPlus, BarChart3, Trash2, Eye, Plus, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    guardian?: {
        id: number;
        name: string;
    };
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

interface Statistics {
    total_active: number;
    total_terminated: number;
    guardian_connections: number;
    child_connections: number;
    admin_assigned: number;
    guardian_requested: number;
}

interface Props {
    connections: Connection[];
    statistics: Statistics;
    therapists: User[];
    guardians: User[];
}

export default function ConnectionManagement({ connections, statistics, therapists, guardians }: Props) {
    const { props } = usePage<PageProps>();
    const [selectedTherapist, setSelectedTherapist] = useState<string>('');
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [terminateDialogOpen, setTerminateDialogOpen] = useState(false);
    const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);

    // Loading states
    const [loadingStates, setLoadingStates] = useState<{
        creating: boolean;
        terminating: number | null;
    }>({
        creating: false,
        terminating: null,
    });

    // Handle flash messages with proper colors
    useEffect(() => {
        if (props.success) {
            toast.success(props.success as string);
        }
        if (props.error) {
            toast.error(props.error as string);
        }
        if (props.warning) {
            toast.warning(props.warning as string);
        }
        if (props.info) {
            toast.info(props.info as string);
        }
        if (props.errors?.general) {
            toast.error(props.errors.general as string);
        }
    }, [props.success, props.error, props.warning, props.info, props.errors]);

    const activeConnections = connections.filter(conn => conn.status === 'active');
    const terminatedConnections = connections.filter(conn => conn.status === 'terminated');

    const handleCreateConnection = () => {
        if (!selectedTherapist || !selectedClient) {
            toast.error('Please select both therapist and guardian');
            return;
        }

        setLoadingStates(prev => ({ ...prev, creating: true }));

        router.post('/admin/connections', {
            therapist_id: selectedTherapist,
            client_id: selectedClient,
        }, {
            onSuccess: () => {
                // Success message will be handled by flash message
                setSelectedTherapist('');
                setSelectedClient('');
                setCreateDialogOpen(false);
                setLoadingStates(prev => ({ ...prev, creating: false }));
            },
            onError: (errors) => {
                // Error message will be handled by flash message
                setLoadingStates(prev => ({ ...prev, creating: false }));

                // Show specific validation errors if available
                if (errors.therapist_id) {
                    toast.error(`Therapist: ${Array.isArray(errors.therapist_id) ? errors.therapist_id[0] : errors.therapist_id}`);
                }
                if (errors.client_id) {
                    toast.error(`Guardian: ${Array.isArray(errors.client_id) ? errors.client_id[0] : errors.client_id}`);
                }
            }
        });
    };

    const handleTerminateConnection = () => {
        if (!selectedConnection) return;

        setLoadingStates(prev => ({ ...prev, terminating: selectedConnection.id }));

        router.delete(`/admin/connections/${selectedConnection.id}`, {
            onSuccess: () => {
                // Success message will be handled by flash message
                setSelectedConnection(null);
                setTerminateDialogOpen(false);
                setLoadingStates(prev => ({ ...prev, terminating: null }));
            },
            onError: (errors) => {
                // Error message will be handled by flash message
                setLoadingStates(prev => ({ ...prev, terminating: null }));
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

    const ConnectionCard = ({ connection }: { connection: Connection }) => (
        <Card className="mb-4">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">
                            {connection.therapist.name} ↔ {connection.client.name}
                        </CardTitle>
                        <CardDescription>
                            {connection.therapist.email} • {connection.client.email}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        {getClientTypeBadge(connection.client_type)}
                        {getConnectionTypeBadge(connection.connection_type)}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Created: {new Date(connection.assigned_at).toLocaleDateString()}
                            {connection.assigned_by && (
                                <span> by {connection.assigned_by.name}</span>
                            )}
                            {connection.terminated_at && (
                                <span className="text-red-600">
                                    • Terminated: {new Date(connection.terminated_at).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.get(`/admin/connections/${connection.id}`)}
                            >
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                            </Button>
                            {connection.status === 'active' && (
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                        setSelectedConnection(connection);
                                        setTerminateDialogOpen(true);
                                    }}
                                    disabled={loadingStates.terminating === connection.id}
                                >
                                    {loadingStates.terminating === connection.id ? (
                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-4 w-4 mr-1" />
                                    )}
                                    Terminate
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <AppLayout>
            <Head title="Connection Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Connection Management</h1>
                        <p className="text-muted-foreground">
                            Manage therapeutic relationships between therapists and clients
                        </p>
                    </div>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Connection
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total_active}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Guardian Connections</CardTitle>
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.guardian_connections}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Child Connections</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.child_connections}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Admin Assigned</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.admin_assigned}</div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="active" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="active" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Active ({activeConnections.length})
                        </TabsTrigger>
                        <TabsTrigger value="terminated" className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Terminated ({terminatedConnections.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="active" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Connections</CardTitle>
                                <CardDescription>
                                    Currently active therapeutic relationships
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {activeConnections.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No active connections
                                    </p>
                                ) : (
                                    activeConnections.map((connection) => (
                                        <ConnectionCard key={connection.id} connection={connection} />
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="terminated" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Terminated Connections</CardTitle>
                                <CardDescription>
                                    Previously active therapeutic relationships that have been terminated
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {terminatedConnections.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No terminated connections
                                    </p>
                                ) : (
                                    terminatedConnections.map((connection) => (
                                        <ConnectionCard key={connection.id} connection={connection} />
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Create Connection Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Connection</DialogTitle>
                        <DialogDescription>
                            Assign a guardian to a therapist to establish a therapeutic relationship.
                            Guardians can then assign their children to connected therapists.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="therapist">Therapist</Label>
                            <Select value={selectedTherapist} onValueChange={setSelectedTherapist}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a therapist" />
                                </SelectTrigger>
                                <SelectContent>
                                    {therapists.map((therapist) => (
                                        <SelectItem key={therapist.id} value={therapist.id.toString()}>
                                            {therapist.name} ({therapist.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="client">Guardian</Label>
                            <Select value={selectedClient} onValueChange={setSelectedClient}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a guardian" />
                                </SelectTrigger>
                                <SelectContent>
                                    {guardians.map((guardian) => (
                                        <SelectItem key={guardian.id} value={guardian.id.toString()}>
                                            {guardian.name} ({guardian.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setCreateDialogOpen(false)}
                            disabled={loadingStates.creating}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateConnection}
                            disabled={loadingStates.creating || !selectedTherapist || !selectedClient}
                        >
                            {loadingStates.creating && (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            Create Connection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Terminate Connection Dialog */}
            <Dialog open={terminateDialogOpen} onOpenChange={setTerminateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Terminate Connection</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to terminate the connection between{' '}
                            {selectedConnection?.therapist.name} and {selectedConnection?.client.name}?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setTerminateDialogOpen(false)}
                            disabled={loadingStates.terminating !== null}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleTerminateConnection}
                            disabled={loadingStates.terminating !== null}
                        >
                            {loadingStates.terminating !== null && (
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