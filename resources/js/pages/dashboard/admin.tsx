import { Head, Link } from '@inertiajs/react';
import { Users, Calendar, MessageCircle, AlertTriangle, TrendingUp, Clock, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PanicAlertNotification from '@/components/panic-alert-notification';
import { usePanicAlerts } from '@/hooks/use-panic-alerts';
import AppLayout from '@/layouts/app-layout';

interface Stats {
    total_users: number;
    pending_users: number;
    active_users: number;
    total_appointments: number;
    pending_appointments: number;
    total_messages: number;
    flagged_messages: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    roles: Array<{ name: string }>;
}

interface Message {
    id: number;
    content: string;
    flag_reason: string;
    created_at: string;
    sender: { id: number; name: string };
    recipient: { id: number; name: string };
}

interface PanicAlert {
    id: number;
    child: {
        id: number;
        name: string;
    };
    triggered_at: string;
    status: 'active' | 'acknowledged' | 'resolved';
    resolved_at?: string;
    resolved_by?: {
        id: number;
        name: string;
    };
    location_data?: {
        latitude: number;
        longitude: number;
        accuracy: number;
    };
    notes?: string;
}

interface Props {
    stats: Stats;
    recentUsers: User[];
    flaggedMessages: Message[];
    panicAlerts?: PanicAlert[];
    unviewedPanicAlerts?: number;
}

export default function AdminDashboard({ stats, recentUsers, flaggedMessages, panicAlerts = [], unviewedPanicAlerts = 0 }: Props) {
    const { alerts: realtimeAlerts, unviewedCount: realtimeUnviewedCount } = usePanicAlerts();
    const [displayAlerts, setDisplayAlerts] = useState(panicAlerts);
    const [displayUnviewedCount, setDisplayUnviewedCount] = useState(unviewedPanicAlerts);

    // Update display alerts when real-time alerts change
    useEffect(() => {
        if (realtimeAlerts.length > 0) {
            // Merge real-time alerts with initial alerts, avoiding duplicates
            const mergedAlerts = [...realtimeAlerts];
            panicAlerts.forEach(alert => {
                if (!realtimeAlerts.some(rtAlert => rtAlert.id === alert.id)) {
                    mergedAlerts.push(alert);
                }
            });
            setDisplayAlerts(mergedAlerts.slice(0, 5)); // Show latest 5
        }
    }, [realtimeAlerts, panicAlerts]);

    // Update unviewed count
    useEffect(() => {
        setDisplayUnviewedCount(realtimeUnviewedCount || unviewedPanicAlerts);
    }, [realtimeUnviewedCount, unviewedPanicAlerts]);
    return (
        <AppLayout>
            <Head title="Admin Dashboard" />

            <div className="container-mobile space-y-6 sm:space-y-8 py-4 sm:py-6 lg:py-8 animate-fade-in">
                <div className="animate-slide-up">
                    <h1 className="text-2xl sm:text-3xl font-bold text-primary">Admin Dashboard</h1>
                    <p className="text-muted-foreground">
                        System overview and management tools
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
                    <Card interactive>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.active_users} active, {stats.pending_users} pending
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_appointments}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.pending_appointments} pending approval
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Messages</CardTitle>
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_messages}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.flagged_messages} flagged for review
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Health</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">Good</div>
                            <p className="text-xs text-muted-foreground">
                                All systems operational
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Panic Alerts */}
                    <Card className="border-red-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-red-600" />
                                Emergency Alerts
                                {displayUnviewedCount > 0 && (
                                    <Badge className="bg-red-600 text-white">
                                        {displayUnviewedCount}
                                    </Badge>
                                )}
                            </CardTitle>
                            <CardDescription>
                                Recent panic button activations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {displayAlerts.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">
                                    No recent alerts
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {displayAlerts.map((alert) => (
                                        <PanicAlertNotification
                                            key={alert.id}
                                            alert={alert}
                                            compact={true}
                                            showActions={false}
                                        />
                                    ))}

                                    <Button asChild className="w-full">
                                        <Link href="/panic-alerts">
                                            View All Alerts
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pending Users */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Pending User Approvals
                            </CardTitle>
                            <CardDescription>
                                Users waiting for admin approval
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentUsers.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">
                                    No pending users
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {recentUsers.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                                <div className="flex gap-1 mt-1">
                                                    {user.roles.map((role) => (
                                                        <Badge key={role.name} variant="outline" className="text-xs">
                                                            {role.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}

                                    <Button asChild className="w-full">
                                        <Link href="/admin/users">
                                            View All Pending Users
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Flagged Messages */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                                Flagged Messages
                            </CardTitle>
                            <CardDescription>
                                Messages flagged for moderation review
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {flaggedMessages.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">
                                    No flagged messages
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {flaggedMessages.map((message) => (
                                        <div key={message.id} className="p-3 border rounded-lg bg-orange-50 border-orange-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-medium">
                                                    {message.sender.name} → {message.recipient.name}
                                                </p>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(message.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-2">"{message.content}"</p>
                                            <p className="text-xs text-orange-700">
                                                <strong>Reason:</strong> {message.flag_reason}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common administrative tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button asChild>
                                <Link href="/admin/users">
                                    <Users className="h-4 w-4 mr-2" />
                                    Manage Users
                                </Link>
                            </Button>

                            <Button variant="outline" asChild>
                                <Link href="/appointments">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    View Appointments
                                </Link>
                            </Button>

                            <Button variant="outline" asChild>
                                <Link href="/messages">
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Monitor Messages
                                </Link>
                            </Button>

                            <Button variant="outline">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                System Reports
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
