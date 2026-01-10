import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Users,
    UserCheck,
    Calendar,
    MessageSquare,
    TrendingUp,
    TrendingDown,
    Activity,
    Shield,
    BookOpen,
    Gamepad2,
    Heart,
    AlertTriangle
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface SystemStats {
    total_users: number;
    active_users: number;
    new_users_this_week: number;
    total_appointments: number;
    completed_appointments: number;
    total_messages: number;
    panic_alerts: number;
    content_items: number;
}

interface UserGrowth {
    date: string;
    new_users: number;
    active_users: number;
}

interface EngagementMetrics {
    daily_active_users: number;
    weekly_active_users: number;
    monthly_active_users: number;
    average_session_duration: number;
    content_engagement_rate: number;
}

interface Props {
    systemStats: SystemStats;
    userGrowth: UserGrowth[];
    engagementMetrics: EngagementMetrics;
    topContent: any[];
    recentActivity: any[];
}

export default function AdminAnalyticsDashboard({ 
    systemStats, 
    userGrowth, 
    engagementMetrics, 
    topContent, 
    recentActivity 
}: Props) {
    const userGrowthRate = userGrowth.length > 1 
        ? ((userGrowth[userGrowth.length - 1]?.new_users || 0) - (userGrowth[userGrowth.length - 8]?.new_users || 0)) / 7
        : 0;

    return (
        <AppLayout>
            <Head title="System Analytics" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Analytics</h1>
                        <p className="text-gray-600">
                            Overview of platform performance and user engagement
                        </p>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{systemStats.total_users}</div>
                                <p className="text-xs text-muted-foreground flex items-center">
                                    {userGrowthRate > 0 ? (
                                        <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                                    )}
                                    {Math.abs(userGrowthRate).toFixed(1)} new/week
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{systemStats.active_users}</div>
                                <p className="text-xs text-muted-foreground">
                                    {((systemStats.active_users / systemStats.total_users) * 100).toFixed(1)}% of total
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{systemStats.total_appointments}</div>
                                <p className="text-xs text-muted-foreground">
                                    {((systemStats.completed_appointments / systemStats.total_appointments) * 100).toFixed(1)}% completion rate
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{systemStats.total_messages}</div>
                                <p className="text-xs text-muted-foreground">
                                    Platform communications
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Engagement Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    User Engagement Metrics
                                </CardTitle>
                                <CardDescription>
                                    Platform usage and engagement statistics
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-2xl font-bold text-blue-600">
                                            {engagementMetrics.daily_active_users}
                                        </div>
                                        <p className="text-sm text-gray-600">Daily Active Users</p>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-600">
                                            {engagementMetrics.weekly_active_users}
                                        </div>
                                        <p className="text-sm text-gray-600">Weekly Active Users</p>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-purple-600">
                                            {engagementMetrics.average_session_duration}m
                                        </div>
                                        <p className="text-sm text-gray-600">Avg Session Duration</p>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-orange-600">
                                            {engagementMetrics.content_engagement_rate}%
                                        </div>
                                        <p className="text-sm text-gray-600">Content Engagement</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Safety Metrics
                                </CardTitle>
                                <CardDescription>
                                    Platform safety and alerts
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Panic Alerts</span>
                                        <Badge variant={systemStats.panic_alerts > 0 ? "destructive" : "secondary"}>
                                            {systemStats.panic_alerts}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Response Time</span>
                                        <Badge variant="outline">
                                            &lt; 2 min
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Safety Score</span>
                                        <Badge variant="secondary">
                                            98.5%
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Content Performance */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Top Performing Content
                                </CardTitle>
                                <CardDescription>
                                    Most engaging articles and games
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { name: "Understanding Anxiety", type: "article", engagement: 92, icon: BookOpen },
                                        { name: "Mood Garden Game", type: "game", engagement: 88, icon: Gamepad2 },
                                        { name: "Breathing Exercises", type: "article", engagement: 85, icon: Heart },
                                        { name: "Emotion Explorer", type: "game", engagement: 82, icon: Gamepad2 }
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <item.icon className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="font-medium text-sm">{item.name}</p>
                                                    <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium">{item.engagement}%</div>
                                                <Progress value={item.engagement} className="w-16 h-1" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Growth Trends
                                </CardTitle>
                                <CardDescription>
                                    User growth over the last 30 days
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-lg font-bold text-blue-600">+{systemStats.new_users_this_week}</div>
                                            <p className="text-xs text-gray-600">New Users</p>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-green-600">+15%</div>
                                            <p className="text-xs text-gray-600">Engagement</p>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-purple-600">+8%</div>
                                            <p className="text-xs text-gray-600">Retention</p>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4">
                                        <h4 className="font-medium mb-2">Key Insights</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• User engagement increased significantly</li>
                                            <li>• Mobile usage up 23% this month</li>
                                            <li>• Content completion rates improving</li>
                                            <li>• Therapist satisfaction at all-time high</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Recent Platform Activity
                            </CardTitle>
                            <CardDescription>
                                Latest user interactions and system events
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    { action: "New user registration", user: "Emma Thompson", time: "2 minutes ago", type: "user" },
                                    { action: "Article published", user: "Dr. Sarah Wilson", time: "15 minutes ago", type: "content" },
                                    { action: "Appointment completed", user: "Lucas Chen", time: "1 hour ago", type: "appointment" },
                                    { action: "Game session completed", user: "Sophia Rodriguez", time: "2 hours ago", type: "game" },
                                    { action: "Mood entry logged", user: "Alex Johnson", time: "3 hours ago", type: "mood" }
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${
                                                activity.type === 'user' ? 'bg-blue-500' :
                                                activity.type === 'content' ? 'bg-green-500' :
                                                activity.type === 'appointment' ? 'bg-purple-500' :
                                                activity.type === 'game' ? 'bg-orange-500' : 'bg-pink-500'
                                            }`} />
                                            <div>
                                                <p className="font-medium text-sm">{activity.action}</p>
                                                <p className="text-xs text-gray-500">{activity.user}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}