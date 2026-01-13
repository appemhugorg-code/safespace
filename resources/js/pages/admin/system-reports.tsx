import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, MessageCircle, BookOpen, Activity, Database, HardDrive, Clock } from 'lucide-react';

interface SystemStats {
    users: {
        total: number;
        active: number;
        pending: number;
        suspended: number;
        by_role: {
            admin: number;
            therapist: number;
            guardian: number;
            child: number;
        };
    };
    appointments: {
        total: number;
        scheduled: number;
        completed: number;
        cancelled: number;
        this_month: number;
    };
    messages: {
        total: number;
        today: number;
        this_week: number;
        this_month: number;
    };
    groups: {
        total: number;
        active: number;
        archived: number;
    };
    articles: {
        total: number;
        published: number;
        draft: number;
        archived: number;
    };
}

interface RecentActivity {
    new_users_today: number;
    appointments_today: number;
    messages_today: number;
}

interface SystemHealth {
    database_status: string;
    storage_usage: string;
    active_sessions: number;
}

interface Props {
    stats: SystemStats;
    recentActivity: RecentActivity;
    systemHealth: SystemHealth;
}

export default function SystemReports({ stats, recentActivity, systemHealth }: Props) {
    return (
        <AppLayout>
            <Head title="System Reports" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Reports</h1>
                    <p className="text-muted-foreground">
                        Overview of system statistics and health metrics
                    </p>
                </div>

                {/* System Health */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            System Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Database className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Database</span>
                                </div>
                                <Badge variant={systemHealth.database_status === 'healthy' ? 'default' : 'destructive'}>
                                    {systemHealth.database_status}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-2">
                                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Storage</span>
                                </div>
                                <Badge variant="outline">{systemHealth.storage_usage}</Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Active Sessions</span>
                                </div>
                                <Badge variant="outline">{systemHealth.active_sessions}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Today's Activity</CardTitle>
                        <CardDescription>Key metrics for today</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{recentActivity.new_users_today}</div>
                                <div className="text-sm text-muted-foreground">New Users</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{recentActivity.appointments_today}</div>
                                <div className="text-sm text-muted-foreground">Appointments</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">{recentActivity.messages_today}</div>
                                <div className="text-sm text-muted-foreground">Messages</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Users Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Users
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Total Users</span>
                                <span className="font-semibold">{stats.users.total}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Active</span>
                                <Badge variant="default">{stats.users.active}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Pending</span>
                                <Badge variant="secondary">{stats.users.pending}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Suspended</span>
                                <Badge variant="destructive">{stats.users.suspended}</Badge>
                            </div>
                            <div className="pt-2 border-t">
                                <div className="text-sm font-medium mb-2">By Role</div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span>Admins</span>
                                        <span>{stats.users.by_role.admin}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Therapists</span>
                                        <span>{stats.users.by_role.therapist}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Guardians</span>
                                        <span>{stats.users.by_role.guardian}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Children</span>
                                        <span>{stats.users.by_role.child}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appointments Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Appointments
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Total</span>
                                <span className="font-semibold">{stats.appointments.total}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Scheduled</span>
                                <Badge variant="default">{stats.appointments.scheduled}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Completed</span>
                                <Badge variant="outline">{stats.appointments.completed}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Cancelled</span>
                                <Badge variant="destructive">{stats.appointments.cancelled}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">This Month</span>
                                <Badge variant="secondary">{stats.appointments.this_month}</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Messages Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageCircle className="h-5 w-5" />
                                Messages
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Total</span>
                                <span className="font-semibold">{stats.messages.total}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Today</span>
                                <Badge variant="default">{stats.messages.today}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">This Week</span>
                                <Badge variant="outline">{stats.messages.this_week}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">This Month</span>
                                <Badge variant="secondary">{stats.messages.this_month}</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Groups Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Groups
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Total</span>
                                <span className="font-semibold">{stats.groups.total}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Active</span>
                                <Badge variant="default">{stats.groups.active}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Archived</span>
                                <Badge variant="outline">{stats.groups.archived}</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Articles Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Articles
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Total</span>
                                <span className="font-semibold">{stats.articles.total}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Published</span>
                                <Badge variant="default">{stats.articles.published}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Draft</span>
                                <Badge variant="secondary">{stats.articles.draft}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Archived</span>
                                <Badge variant="outline">{stats.articles.archived}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}