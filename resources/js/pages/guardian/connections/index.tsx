import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Clock, CheckCircle, XCircle, Plus, Search } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Therapist {
    id: number;
    name: string;
    email: string;
    status: string;
}

interface Connection {
    id: number;
    therapist: Therapist;
    connection_type: string;
    assigned_at: string;
    assigned_by?: {
        id: number;
        name: string;
    };
    specialization?: string;
    availability_status: string;
}

interface PendingRequest {
    id: number;
    therapist: Therapist;
    target_client?: {
        id: number;
        name: string;
    };
    request_type: string;
    status: string;
    message?: string;
    created_at: string;
    reviewed_at?: string;
    is_guardian_to_therapist: boolean;
    is_child_assignment: boolean;
}

interface Stats {
    total_connections: number;
    pending_requests: number;
    approved_requests: number;
    declined_requests: number;
    admin_assigned: number;
    guardian_requested: number;
}

interface Props {
    connections: Connection[];
    pending_requests: PendingRequest[];
    stats: Stats;
}

export default function GuardianConnectionsIndex({ connections, pending_requests, stats }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getConnectionTypeLabel = (type: string) => {
        switch (type) {
            case 'admin_assigned':
                return 'Admin Assigned';
            case 'guardian_requested':
                return 'Requested';
            case 'guardian_child_assignment':
                return 'Child Assignment';
            default:
                return type;
        }
    };

    const getRequestTypeLabel = (type: string) => {
        switch (type) {
            case 'guardian_to_therapist':
                return 'Connection Request';
            case 'guardian_child_assignment':
                return 'Child Assignment';
            default:
                return type;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="text-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
            case 'approved':
                return <Badge variant="outline" className="text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
            case 'declined':
                return <Badge variant="outline" className="text-red-600"><XCircle className="w-3 h-3 mr-1" />Declined</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title="My Therapist Connections" />

            <div className="container-mobile space-y-6 sm:space-y-8 py-4 sm:py-6 lg:py-8 animate-fade-in">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Therapist Connections</h1>
                        <p className="text-muted-foreground">
                            Manage your connections with therapists and view pending requests
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href="/guardian/connections/search">
                                <Search className="w-4 h-4 mr-2" />
                                Find Therapists
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/guardian/connections/child-assignment">
                                <Users className="w-4 h-4 mr-2" />
                                Assign Children
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Connections</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_connections}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_requests}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Admin Assigned</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.admin_assigned}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Self Requested</CardTitle>
                            <Plus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.guardian_requested}</div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="connections" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="connections">Active Connections ({connections.length})</TabsTrigger>
                        <TabsTrigger value="requests">Pending Requests ({pending_requests.filter(r => r.status === 'pending').length})</TabsTrigger>
                        <TabsTrigger value="history">Request History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="connections" className="space-y-4">
                        {connections.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No Active Connections</h3>
                                    <p className="text-muted-foreground text-center mb-4">
                                        You don't have any active therapist connections yet. Start by searching for available therapists.
                                    </p>
                                    <Button asChild>
                                        <Link href="/guardian/connections/search">
                                            <Search className="w-4 h-4 mr-2" />
                                            Find Therapists
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {connections.map((connection) => (
                                    <Card key={connection.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg">{connection.therapist.name}</CardTitle>
                                                    <CardDescription>{connection.therapist.email}</CardDescription>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Badge variant="outline">
                                                        {getConnectionTypeLabel(connection.connection_type)}
                                                    </Badge>
                                                    <Badge variant={connection.availability_status === 'available' ? 'default' : 'secondary'}>
                                                        {connection.availability_status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium">Specialization:</span>
                                                    <p className="text-muted-foreground">{connection.specialization || 'General Therapy'}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Connected Since:</span>
                                                    <p className="text-muted-foreground">{formatDate(connection.assigned_at)}</p>
                                                </div>
                                                {connection.assigned_by && (
                                                    <div className="col-span-2">
                                                        <span className="font-medium">Assigned By:</span>
                                                        <p className="text-muted-foreground">{connection.assigned_by.name}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex justify-end mt-4">
                                                <Button variant="outline" asChild>
                                                    <Link href={`/guardian/connections/${connection.id}`}>
                                                        View Details
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="requests" className="space-y-4">
                        {pending_requests.filter(r => r.status === 'pending').length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
                                    <p className="text-muted-foreground text-center">
                                        You don't have any pending connection requests at the moment.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {pending_requests.filter(r => r.status === 'pending').map((request) => (
                                    <Card key={request.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg">{request.therapist.name}</CardTitle>
                                                    <CardDescription>
                                                        {getRequestTypeLabel(request.request_type)}
                                                        {request.target_client && ` for ${request.target_client.name}`}
                                                    </CardDescription>
                                                </div>
                                                {getStatusBadge(request.status)}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="font-medium">Requested:</span>
                                                    <p className="text-muted-foreground">{formatDate(request.created_at)}</p>
                                                </div>
                                                {request.message && (
                                                    <div>
                                                        <span className="font-medium">Message:</span>
                                                        <p className="text-muted-foreground">{request.message}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="history" className="space-y-4">
                        {pending_requests.filter(r => r.status !== 'pending').length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No Request History</h3>
                                    <p className="text-muted-foreground text-center">
                                        Your processed connection requests will appear here.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {pending_requests.filter(r => r.status !== 'pending').map((request) => (
                                    <Card key={request.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg">{request.therapist.name}</CardTitle>
                                                    <CardDescription>
                                                        {getRequestTypeLabel(request.request_type)}
                                                        {request.target_client && ` for ${request.target_client.name}`}
                                                    </CardDescription>
                                                </div>
                                                {getStatusBadge(request.status)}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium">Requested:</span>
                                                    <p className="text-muted-foreground">{formatDate(request.created_at)}</p>
                                                </div>
                                                {request.reviewed_at && (
                                                    <div>
                                                        <span className="font-medium">Reviewed:</span>
                                                        <p className="text-muted-foreground">{formatDate(request.reviewed_at)}</p>
                                                    </div>
                                                )}
                                                {request.message && (
                                                    <div className="col-span-2">
                                                        <span className="font-medium">Message:</span>
                                                        <p className="text-muted-foreground">{request.message}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}