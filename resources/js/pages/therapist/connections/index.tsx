import { Head, Link } from '@inertiajs/react';
import { Users, UserCheck, UserPlus, Clock, Calendar, MessageCircle, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';

interface Client {
    id: number;
    name: string;
    email: string;
    status: string;
    age?: number;
}

interface Guardian {
    id: number;
    name: string;
    email: string;
}

interface AssignedBy {
    id: number;
    name: string;
}

interface GuardianConnection {
    id: number;
    client: Client;
    connection_type: string;
    assigned_at: string;
    assigned_by: AssignedBy | null;
    children_count: number;
}

interface ChildConnection {
    id: number;
    client: Client;
    guardian: Guardian | null;
    connection_type: string;
    assigned_at: string;
    assigned_by: AssignedBy | null;
    recent_mood_entries: Array<{
        mood: string;
        mood_date: string;
        notes?: string;
    }>;
}

interface Requester {
    id: number;
    name: string;
    email: string;
}

interface TargetClient {
    id: number;
    name: string;
    age?: number;
}

interface PendingRequest {
    id: number;
    requester: Requester;
    target_client: TargetClient | null;
    request_type: string;
    message: string | null;
    created_at: string;
}

interface Stats {
    total_guardians: number;
    total_children: number;
    pending_requests: number;
    total_connections: number;
    admin_assigned: number;
    guardian_requested: number;
}

interface Props {
    guardians: GuardianConnection[];
    children: ChildConnection[];
    pending_requests: PendingRequest[];
    stats: Stats;
}

export default function TherapistConnections({ guardians, children, pending_requests, stats }: Props) {
    const getConnectionTypeBadge = (type: string) => {
        switch (type) {
            case 'admin_assigned':
                return <Badge className="bg-blue-100 text-blue-800">Admin Assigned</Badge>;
            case 'guardian_requested':
                return <Badge className="bg-green-100 text-green-800">Guardian Requested</Badge>;
            case 'guardian_child_assignment':
                return <Badge className="bg-purple-100 text-purple-800">Child Assignment</Badge>;
            default:
                return <Badge>{type}</Badge>;
        }
    };

    const getRequestTypeBadge = (type: string) => {
        switch (type) {
            case 'guardian_to_therapist':
                return <Badge className="bg-yellow-100 text-yellow-800">Guardian Request</Badge>;
            case 'guardian_child_assignment':
                return <Badge className="bg-orange-100 text-orange-800">Child Assignment</Badge>;
            default:
                return <Badge>{type}</Badge>;
        }
    };

    const getMoodEmoji = (mood: string) => {
        const moodEmojis = {
            'very_happy': '😄',
            'happy': '😊',
            'neutral': '😐',
            'sad': '😢',
            'very_sad': '😭',
        };
        return moodEmojis[mood as keyof typeof moodEmojis] || '😐';
    };

    return (
        <AppLayout>
            <Head title="My Connections" />

            <div className="container-mobile space-y-6 sm:space-y-8 py-4 sm:py-6 animate-fade-in">
                <div className="animate-slide-up">
                    <h1 className="text-2xl sm:text-3xl font-bold text-primary">My Connections</h1>
                    <p className="text-muted-foreground">
                        Manage your therapeutic relationships with guardians and children
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
                    <Card interactive>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Total Connections</CardTitle>
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold">{stats.total_connections}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.total_guardians} guardians, {stats.total_children} children
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Guardians</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_guardians}</div>
                            <p className="text-xs text-muted-foreground">
                                connected guardians
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Children</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_children}</div>
                            <p className="text-xs text-muted-foreground">
                                children in care
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_requests}</div>
                            <p className="text-xs text-muted-foreground">
                                requests awaiting
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs for different views */}
                <Tabs defaultValue="overview" className="animate-scale-in">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="guardians">Guardians ({stats.total_guardians})</TabsTrigger>
                        <TabsTrigger value="children">Children ({stats.total_children})</TabsTrigger>
                        <TabsTrigger value="requests">
                            Requests ({stats.pending_requests})
                            {stats.pending_requests > 0 && (
                                <Badge className="ml-2 bg-red-500 text-white">{stats.pending_requests}</Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>
                                    Manage your connections and requests
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Button asChild>
                                        <Link href="/therapist/connections/guardians">
                                            <UserCheck className="h-4 w-4 mr-2" />
                                            View Guardians
                                        </Link>
                                    </Button>

                                    <Button variant="outline" asChild>
                                        <Link href="/therapist/connections/children">
                                            <Users className="h-4 w-4 mr-2" />
                                            View Children
                                        </Link>
                                    </Button>

                                    <Button variant="outline" asChild>
                                        <Link href="/therapist/connections/requests">
                                            <Clock className="h-4 w-4 mr-2" />
                                            Pending Requests
                                        </Link>
                                    </Button>

                                    <Button variant="outline" asChild>
                                        <Link href="/appointments/create">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Schedule Session
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity Summary */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Recent Guardian Connections */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <UserCheck className="h-5 w-5" />
                                        Recent Guardian Connections
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {guardians.slice(0, 3).length === 0 ? (
                                        <p className="text-muted-foreground text-center py-4">
                                            No guardian connections yet
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {guardians.slice(0, 3).map((connection) => (
                                                <div key={connection.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{connection.client.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {connection.children_count} children
                                                        </p>
                                                    </div>
                                                    {getConnectionTypeBadge(connection.connection_type)}
                                                </div>
                                            ))}
                                            {guardians.length > 3 && (
                                                <Button variant="outline" size="sm" asChild className="w-full">
                                                    <Link href="/therapist/connections/guardians">
                                                        View All Guardians
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Recent Child Connections */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Recent Child Connections
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {children.slice(0, 3).length === 0 ? (
                                        <p className="text-muted-foreground text-center py-4">
                                            No child connections yet
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {children.slice(0, 3).map((connection) => (
                                                <div key={connection.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{connection.client.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Guardian: {connection.guardian?.name || 'None'}
                                                        </p>
                                                        {connection.recent_mood_entries.length > 0 && (
                                                            <div className="flex gap-1 mt-1">
                                                                {connection.recent_mood_entries.slice(0, 3).map((mood, index) => (
                                                                    <span key={index} className="text-sm">
                                                                        {getMoodEmoji(mood.mood)}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {getConnectionTypeBadge(connection.connection_type)}
                                                </div>
                                            ))}
                                            {children.length > 3 && (
                                                <Button variant="outline" size="sm" asChild className="w-full">
                                                    <Link href="/therapist/connections/children">
                                                        View All Children
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="guardians">
                        <Card>
                            <CardHeader>
                                <CardTitle>Guardian Connections</CardTitle>
                                <CardDescription>
                                    Parents and guardians you are connected with
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-4">
                                    <Button asChild>
                                        <Link href="/therapist/connections/guardians">
                                            View Detailed Guardian List
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="children">
                        <Card>
                            <CardHeader>
                                <CardTitle>Child Connections</CardTitle>
                                <CardDescription>
                                    Children under your therapeutic care
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-4">
                                    <Button asChild>
                                        <Link href="/therapist/connections/children">
                                            View Detailed Children List
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="requests">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pending Requests</CardTitle>
                                <CardDescription>
                                    Connection requests awaiting your response
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pending_requests.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                                        <p className="text-muted-foreground">
                                            You have no connection requests awaiting your response.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pending_requests.slice(0, 5).map((request) => (
                                            <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <span className="text-sm font-semibold text-blue-600">
                                                                {request.requester.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{request.requester.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {request.target_client
                                                                    ? `Requesting assignment for ${request.target_client.name}`
                                                                    : 'Requesting connection'
                                                                }
                                                            </p>
                                                        </div>
                                                        {getRequestTypeBadge(request.request_type)}
                                                    </div>
                                                    {request.message && (
                                                        <p className="text-sm text-muted-foreground italic">
                                                            "{request.message}"
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Requested {new Date(request.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        <Button asChild className="w-full">
                                            <Link href="/therapist/connections/requests">
                                                View All Pending Requests
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Professional Notice */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-sm">ℹ</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-blue-900 mb-1">Connection Management</h4>
                                <p className="text-sm text-blue-800">
                                    All therapeutic relationships are established through proper channels. Review connection requests carefully and maintain professional boundaries at all times.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}