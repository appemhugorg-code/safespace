import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Users, MessageSquare, Flag, UserPlus, TrendingUp, Activity, BarChart3, Shield, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import api from '@/lib/api';
import axios from 'axios';

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

interface Group {
    id: number;
    name: string;
    description: string;
    creator: {
        id: number;
        name: string;
    };
    members_count: number;
    messages_count: number;
    messages_today: number;
    messages_this_week: number;
    latest_message_at: string | null;
    created_at: string;
    is_active: boolean;
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

    // Groups tab state
    const [groups, setGroups] = useState<Group[]>([]);
    const [groupsLoading, setGroupsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('updated_at');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchDashboardData();
    }, [timeframe]);

    useEffect(() => {
        if (activeTab === 'groups') {
            fetchGroups();
        }
    }, [activeTab, searchTerm, sortBy, sortOrder]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Ensure CSRF cookie is set for Sanctum authentication
            await axios.get('/sanctum/csrf-cookie');

            const response = await api.get(`/admin/groups/dashboard?timeframe=${timeframe}`);
            setDashboardData(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGroups = async () => {
        try {
            setGroupsLoading(true);

            await axios.get('/sanctum/csrf-cookie');

            const params = new URLSearchParams({
                search: searchTerm,
                sort_by: sortBy,
                sort_order: sortOrder,
                per_page: '20'
            });

            const response = await api.get(`/admin/groups?${params}`);
            setGroups(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch groups:', error);
        } finally {
            setGroupsLoading(false);
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
                    <TabsList>
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="groups" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Groups ({dashboardData?.overview.total_groups || 0})
                        </TabsTrigger>
                        <TabsTrigger value="moderation" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Moderation ({dashboardData?.flagged_content.total_flagged || 0})
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Analytics
                        </TabsTrigger>
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
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>All Groups</CardTitle>
                                        <CardDescription>
                                            Manage and monitor all groups on the platform
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search groups..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-8 w-64"
                                            />
                                        </div>
                                        <Select value={sortBy} onValueChange={setSortBy}>
                                            <SelectTrigger className="w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="name">Name</SelectItem>
                                                <SelectItem value="created_at">Created Date</SelectItem>
                                                <SelectItem value="updated_at">Last Activity</SelectItem>
                                                <SelectItem value="members_count">Member Count</SelectItem>
                                                <SelectItem value="messages_count">Message Count</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select value={sortOrder} onValueChange={setSortOrder}>
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="desc">Descending</SelectItem>
                                                <SelectItem value="asc">Ascending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {groupsLoading ? (
                                    <div className="flex items-center justify-center h-32">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                            <p className="mt-2 text-muted-foreground">Loading groups...</p>
                                        </div>
                                    </div>
                                ) : groups.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        {searchTerm ? 'No groups found matching your search.' : 'No groups found.'}
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {groups.map((group) => (
                                            <Card key={group.id} className="border-l-4 border-l-blue-500">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <CardTitle className="text-lg">{group.name}</CardTitle>
                                                                {!group.is_active && (
                                                                    <Badge variant="destructive">Inactive</Badge>
                                                                )}
                                                            </div>
                                                            <CardDescription className="mt-1">
                                                                {group.description || 'No description provided'}
                                                            </CardDescription>
                                                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                                <span>Created by {group.creator.name}</span>
                                                                <span>•</span>
                                                                <span>{new Date(group.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button size="sm" variant="outline">
                                                                View Details
                                                            </Button>
                                                            {group.is_active ? (
                                                                <Button size="sm" variant="destructive">
                                                                    Dissolve
                                                                </Button>
                                                            ) : (
                                                                <Button size="sm" variant="default">
                                                                    Reactivate
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        <div className="text-center">
                                                            <div className="text-2xl font-bold text-blue-600">
                                                                {group.members_count}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">Members</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-2xl font-bold text-green-600">
                                                                {group.messages_count}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">Total Messages</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-2xl font-bold text-orange-600">
                                                                {group.messages_today}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">Today</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-2xl font-bold text-purple-600">
                                                                {group.messages_this_week}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">This Week</div>
                                                        </div>
                                                    </div>
                                                    {group.latest_message_at && (
                                                        <div className="mt-4 pt-4 border-t">
                                                            <div className="text-sm text-muted-foreground">
                                                                Last activity: {new Date(group.latest_message_at).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
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
