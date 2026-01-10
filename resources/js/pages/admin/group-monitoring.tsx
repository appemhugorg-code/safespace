import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Users, MessageSquare, Flag, UserPlus, TrendingUp, Activity } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import api from '@/lib/api';

interface OverviewStats {
    total_groups: number;
    total_members: number;
    new_groups: number;
    total_messages: number;
    messages_period: number;
    pending_join_requests: number;
    flagged_messages: number;
    groups_dissolved: number;
}

interface RecentActivity {
    type: string;
    timestamp: string;
    data: {
        group_name?: string;
        creator?: string;
        user?: string;
        status?: string;
        reason?: string;
    };
}

interface GroupAnalytics {
    most_active_groups: Array<{
        id: number;
        name: string;
        messages_count: number;
    }>;
    largest_groups: Array<{
        id: number;
        name: string;
        members_count: number;
    }>;
    leave_reasons: Record<string, number>;
}

interface FlaggedContent {
    total_flagged: number;
    pending_review: number;
    recent_flags: Array<{
        id: number;
        content: string;
        sender: string;
        group: string;
        created_at: string;
    }>;
}

interface JoinRequest {
    id: number;
    user: string;
    user_role: string;
    group: string;
    message: string;
    created_at: string;
}

interface DashboardData {
    overview: OverviewStats;
    recent_activity: RecentActivity[];
    group_analytics: GroupAnalytics;
    flagged_content: FlaggedContent;
    join_requests: JoinRequest[];
}

export default function GroupMonitoring() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('30');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchDashboardData();
    }, [timeframe]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/groups/dashboard?timeframe=${timeframe}`);
            setDashboardData(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatActivityType = (type: string) => {
        switch (type) {
            case 'group_created':
                return 'Group Created';
            case 'join_request':
                return 'Join Request';
            case 'member_left':
                return 'Member Left';
            default:
                return type;
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'group_created':
                return <Users className="h-4 w-4" />;
            case 'join_request':
                return <UserPlus className="h-4 w-4" />;
            case 'member_left':
                return <Activity className="h-4 w-4" />;
            default:
                return <Activity className="h-4 w-4" />;
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <Head title="Group Monitoring" />
                <div className="container mx-auto p-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!dashboardData) {
        return (
            <AppLayout>
                <Head title="Group Monitoring" />
                <div className="container mx-auto p-6">
                    <div className="text-center">
                        <p className="text-muted-foreground">Failed to load dashboard data.</p>
                        <Button onClick={fetchDashboardData} className="mt-4">
                            Retry
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Group Monitoring" />
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Group Monitoring Dashboard</h1>
                        <p className="text-muted-foreground">
                            Monitor and manage all group activities across the platform
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Select value={timeframe} onValueChange={setTimeframe}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">Last 7 days</SelectItem>
                                <SelectItem value="30">Last 30 days</SelectItem>
                                <SelectItem value="90">Last 90 days</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={fetchDashboardData} variant="outline">
                            Refresh
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="groups">Groups</TabsTrigger>
                        <TabsTrigger value="moderation">Moderation</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {/* Overview Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{dashboardData.overview.total_groups}</div>
                                    <p className="text-xs text-muted-foreground">
                                        +{dashboardData.overview.new_groups} new this period
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{dashboardData.overview.total_members}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Across all active groups
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Messages</CardTitle>
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{dashboardData.overview.total_messages}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {dashboardData.overview.messages_period} this period
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{dashboardData.overview.pending_join_requests}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Join requests awaiting review
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>
                                    Latest group activities across the platform
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {dashboardData.recent_activity.slice(0, 10).map((activity, index) => (
                                        <div key={index} className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium">
                                                    {formatActivityType(activity.type)}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {activity.type === 'group_created' &&
                                                        `${activity.data.creator} created "${activity.data.group_name}"`}
                                                    {activity.type === 'join_request' &&
                                                        `${activity.data.user} requested to join "${activity.data.group_name}"`}
                                                    {activity.type === 'member_left' &&
                                                        `${activity.data.user} left "${activity.data.group_name}" (${activity.data.reason})`}
                                                </p>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(activity.timestamp).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pending Join Requests */}
                        {dashboardData.join_requests.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pending Join Requests</CardTitle>
                                    <CardDescription>
                                        Recent join requests requiring admin attention
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {dashboardData.join_requests.map((request) => (
                                            <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium">{request.user}</span>
                                                        <Badge variant="secondary">{request.user_role}</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Wants to join "{request.group}"
                                                    </p>
                                                    {request.message && (
                                                        <p className="text-sm mt-1 italic">"{request.message}"</p>
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(request.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="groups" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>All Groups</CardTitle>
                                <CardDescription>
                                    Manage and monitor all groups on the platform
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Detailed group management interface will be implemented here.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="moderation" className="space-y-6">
                        {/* Flagged Content */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Flagged</CardTitle>
                                    <Flag className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{dashboardData.flagged_content.total_flagged}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{dashboardData.flagged_content.pending_review}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Groups Dissolved</CardTitle>
                                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{dashboardData.overview.groups_dissolved}</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Flagged Messages */}
                        {dashboardData.flagged_content.recent_flags.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recently Flagged Messages</CardTitle>
                                    <CardDescription>
                                        Messages that have been flagged for review
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {dashboardData.flagged_content.recent_flags.map((flag) => (
                                            <div key={flag.id} className="p-4 border rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium">{flag.sender}</span>
                                                        <Badge variant="outline">{flag.group}</Badge>
                                                    </div>
                                                    <Badge variant="destructive">Flagged</Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {flag.content}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(flag.created_at).toLocaleDateString()}
                                                    </span>
                                                    <div className="space-x-2">
                                                        <Button size="sm" variant="outline">
                                                            Review
                                                        </Button>
                                                        <Button size="sm" variant="destructive">
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Most Active Groups */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Most Active Groups</CardTitle>
                                    <CardDescription>
                                        Groups with the most messages in the selected period
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {dashboardData.group_analytics.most_active_groups.map((group, index) => (
                                            <div key={group.id} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium">#{index + 1}</span>
                                                    <span className="text-sm">{group.name}</span>
                                                </div>
                                                <Badge variant="secondary">
                                                    {group.messages_count} messages
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Largest Groups */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Largest Groups</CardTitle>
                                    <CardDescription>
                                        Groups with the most members
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {dashboardData.group_analytics.largest_groups.map((group, index) => (
                                            <div key={group.id} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium">#{index + 1}</span>
                                                    <span className="text-sm">{group.name}</span>
                                                </div>
                                                <Badge variant="secondary">
                                                    {group.members_count} members
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Leave Reasons */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Leave Reasons Analysis</CardTitle>
                                <CardDescription>
                                    Why members are leaving groups
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Object.entries(dashboardData.group_analytics.leave_reasons).map(([reason, count]) => (
                                        <div key={reason} className="flex items-center justify-between">
                                            <span className="text-sm">{reason}</span>
                                            <Badge variant="outline">{count} times</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
