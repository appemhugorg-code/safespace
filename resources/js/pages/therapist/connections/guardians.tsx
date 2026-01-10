import { Head, Link } from '@inertiajs/react';
import { UserCheck, MessageCircle, Calendar, Eye, Users, Phone, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';

interface Guardian {
    id: number;
    name: string;
    email: string;
    status: string;
    phone?: string;
}

interface Child {
    id: number;
    name: string;
    age?: number;
    connection_id: number;
    assigned_at: string;
}

interface AssignedBy {
    id: number;
    name: string;
}

interface GuardianConnection {
    id: number;
    guardian: Guardian;
    connection_type: string;
    assigned_at: string;
    assigned_by: AssignedBy | null;
    children: Child[];
    total_children: number;
    recent_activity: {
        last_login?: string;
        recent_messages: number;
        recent_appointments: number;
    };
}

interface Stats {
    total_guardians: number;
    total_connected_children: number;
}

interface Props {
    guardians: GuardianConnection[];
    stats: Stats;
}

export default function TherapistGuardians({ guardians, stats }: Props) {
    const getConnectionTypeBadge = (type: string) => {
        switch (type) {
            case 'admin_assigned':
                return <Badge className="bg-blue-100 text-blue-800">Admin Assigned</Badge>;
            case 'guardian_requested':
                return <Badge className="bg-green-100 text-green-800">Guardian Requested</Badge>;
            default:
                return <Badge>{type}</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800">Active</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            case 'suspended':
                return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title="Guardian Connections" />

            <div className="container-mobile space-y-6 sm:space-y-8 py-4 sm:py-6 animate-fade-in">
                <div className="animate-slide-up">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Guardian Connections</h1>
                            <p className="text-muted-foreground">
                                Parents and guardians you are connected with
                            </p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/therapist/connections">
                                ← Back to Connections
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Connected Guardians</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_guardians}</div>
                            <p className="text-xs text-muted-foreground">
                                active guardian relationships
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Connected Children</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_connected_children}</div>
                            <p className="text-xs text-muted-foreground">
                                through guardian connections
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Guardians List */}
                <Card className="animate-scale-in">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5" />
                            Guardian Relationships
                        </CardTitle>
                        <CardDescription>
                            Manage your therapeutic relationships with guardians and their families
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {guardians.length === 0 ? (
                            <div className="text-center py-12">
                                <UserCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No guardian connections</h3>
                                <p className="text-muted-foreground mb-6">
                                    You haven't been connected with any guardians yet. Connections are typically established through admin assignments or guardian requests.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button asChild>
                                        <Link href="/therapist/connections/requests">
                                            <UserCheck className="h-4 w-4 mr-2" />
                                            Check Pending Requests
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/therapist/connections">
                                            <Users className="h-4 w-4 mr-2" />
                                            View All Connections
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {guardians.map((connection) => (
                                    <Card key={connection.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <span className="text-xl font-semibold text-blue-600">
                                                                {connection.guardian.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h3 className="text-xl font-semibold">{connection.guardian.name}</h3>
                                                                {getStatusBadge(connection.guardian.status)}
                                                                {getConnectionTypeBadge(connection.connection_type)}
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                <div className="flex items-center gap-1">
                                                                    <Mail className="h-4 w-4" />
                                                                    {connection.guardian.email}
                                                                </div>
                                                                {connection.guardian.phone && (
                                                                    <div className="flex items-center gap-1">
                                                                        <Phone className="h-4 w-4" />
                                                                        {connection.guardian.phone}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid md:grid-cols-3 gap-6">
                                                        {/* Connection Details */}
                                                        <div className="space-y-2">
                                                            <h4 className="text-sm font-medium text-muted-foreground">Connection Details</h4>
                                                            <div className="space-y-1 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span>Connected:</span>
                                                                    <span className="font-medium">
                                                                        {new Date(connection.assigned_at).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                {connection.assigned_by && (
                                                                    <div className="flex justify-between">
                                                                        <span>Assigned by:</span>
                                                                        <span className="font-medium">{connection.assigned_by.name}</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-between">
                                                                    <span>Total children:</span>
                                                                    <span className="font-medium">{connection.total_children}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Connected Children */}
                                                        <div className="space-y-2">
                                                            <h4 className="text-sm font-medium text-muted-foreground">Connected Children</h4>
                                                            {connection.children.length === 0 ? (
                                                                <p className="text-sm text-muted-foreground">No children connected yet</p>
                                                            ) : (
                                                                <div className="space-y-2">
                                                                    {connection.children.map((child) => (
                                                                        <div key={child.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                                            <div>
                                                                                <p className="text-sm font-medium">{child.name}</p>
                                                                                {child.age && (
                                                                                    <p className="text-xs text-muted-foreground">Age: {child.age}</p>
                                                                                )}
                                                                            </div>
                                                                            <Button size="sm" variant="ghost" asChild>
                                                                                <Link href={`/therapist/connections/${child.connection_id}`}>
                                                                                    <Eye className="h-3 w-3" />
                                                                                </Link>
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Recent Activity */}
                                                        <div className="space-y-2">
                                                            <h4 className="text-sm font-medium text-muted-foreground">Recent Activity</h4>
                                                            <div className="space-y-1 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span>Messages:</span>
                                                                    <span className="font-medium">{connection.recent_activity.recent_messages}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Appointments:</span>
                                                                    <span className="font-medium">{connection.recent_activity.recent_appointments}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-col gap-2 ml-6">
                                                    <Button size="sm" asChild>
                                                        <Link href={`/therapist/connections/${connection.id}`}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </Link>
                                                    </Button>
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={`/messages/conversation/${connection.guardian.id}`}>
                                                            <MessageCircle className="h-4 w-4 mr-2" />
                                                            Message
                                                        </Link>
                                                    </Button>
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={`/appointments/create?guardian=${connection.guardian.id}`}>
                                                            <Calendar className="h-4 w-4 mr-2" />
                                                            Schedule
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common tasks for managing guardian relationships
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button asChild>
                                <Link href="/therapist/connections/children">
                                    <Users className="h-4 w-4 mr-2" />
                                    View Children
                                </Link>
                            </Button>

                            <Button variant="outline" asChild>
                                <Link href="/therapist/connections/requests">
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Pending Requests
                                </Link>
                            </Button>

                            <Button variant="outline" asChild>
                                <Link href="/appointments/create">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule Session
                                </Link>
                            </Button>

                            <Button variant="outline" asChild>
                                <Link href="/messages">
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Messages
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}