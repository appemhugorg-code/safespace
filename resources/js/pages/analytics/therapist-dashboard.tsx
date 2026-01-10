import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    BookOpen,
    GamepadIcon,
    Users,
    TrendingUp,
    Eye,
    CheckCircle,
    Clock,
    BarChart3,
    Heart,
    Calendar,
    MessageCircle,
    Target,
    Activity,
    Star
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Article {
    id: number;
    title: string;
    views: number;
    completions: number;
    completion_rate: number;
}

interface Game {
    id: number;
    name: string;
    plays: number;
    completions: number;
    completion_rate: number;
}

interface Client {
    user: {
        id: number;
        name: string;
    };
    games_completed: number;
    articles_read: number;
    last_activity: string | null;
}

interface EngagementTrend {
    date: string;
    total_engagements: number;
    completions: number;
}

interface MoodAnalytics {
    mood_distribution: Record<string, number>;
    mood_trends: Record<string, number>;
    average_mood_score: number;
    mood_consistency: number;
    weekly_mood_data: Array<{
        date: string;
        average_mood: number;
        entries_count: number;
    }>;
}

interface AppointmentAnalytics {
    total_appointments: number;
    completed_appointments: number;
    cancelled_appointments: number;
    no_shows: number;
    attendance_rate: number;
    average_session_rating: number;
    upcoming_appointments: number;
}

interface WeeklySummary {
    total_interactions: number;
    new_clients: number;
    active_clients: number;
    content_published: number;
    average_engagement_time: number;
    top_performing_content: string;
    insights: string[];
}

interface Analytics {
    article_analytics: Article[];
    game_analytics: Game[];
    client_progress: Client[];
    engagement_trends: EngagementTrend[];
    mood_analytics: MoodAnalytics;
    appointment_analytics: AppointmentAnalytics;
    weekly_summary: WeeklySummary;
}

interface Props {
    analytics: Analytics;
}

export default function TherapistAnalyticsDashboard({ analytics }: Props) {
    const totalArticleViews = analytics.article_analytics.reduce((sum, article) => sum + article.views, 0);
    const totalGamePlays = analytics.game_analytics.reduce((sum, game) => sum + game.plays, 0);
    const activeClients = analytics.client_progress.filter(client =>
        client.last_activity && new Date(client.last_activity) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    const getMoodEmoji = (mood: string) => {
        const moodEmojis: Record<string, string> = {
            'very_happy': '😄',
            'happy': '😊',
            'neutral': '😐',
            'sad': '😔',
            'very_sad': '😢'
        };
        return moodEmojis[mood] || '😐';
    };

    return (
        <AppLayout>
            <Head title="Content Analytics" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Analytics</h1>
                        <p className="text-gray-600">
                            Track how your clients engage with articles and games
                        </p>
                    </div>

                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Article Views</CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalArticleViews}</div>
                                <p className="text-xs text-muted-foreground">
                                    across {analytics.article_analytics.length} articles
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Game Plays</CardTitle>
                                <GamepadIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalGamePlays}</div>
                                <p className="text-xs text-muted-foreground">
                                    total game sessions
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{activeClients}</div>
                                <p className="text-xs text-muted-foreground">
                                    active this week
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {analytics.appointment_analytics.attendance_rate}%
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    attendance rate
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Article Analytics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Article Performance
                                </CardTitle>
                                <CardDescription>
                                    How your articles are being read
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.article_analytics.length === 0 ? (
                                        <p className="text-gray-500 text-center py-4">
                                            No articles published yet
                                        </p>
                                    ) : (
                                        analytics.article_analytics.map((article) => (
                                            <div key={article.id} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-medium text-sm line-clamp-2">
                                                        {article.title}
                                                    </h4>
                                                    <Badge variant="outline">
                                                        {article.completion_rate}% completion
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-4 h-4" />
                                                        {article.views} views
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <CheckCircle className="w-4 h-4" />
                                                        {article.completions} completed
                                                    </span>
                                                </div>

                                                <Progress value={article.completion_rate} className="h-2" />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Game Analytics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GamepadIcon className="h-5 w-5" />
                                    Game Engagement
                                </CardTitle>
                                <CardDescription>
                                    How clients interact with games
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.game_analytics.length === 0 ? (
                                        <p className="text-gray-500 text-center py-4">
                                            No game activity yet
                                        </p>
                                    ) : (
                                        analytics.game_analytics.map((game) => (
                                            <div key={game.id} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-medium text-sm">
                                                        {game.name}
                                                    </h4>
                                                    <Badge variant="outline">
                                                        {game.completion_rate}% completion
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                    <span className="flex items-center gap-1">
                                                        <GamepadIcon className="w-4 h-4" />
                                                        {game.plays} plays
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <CheckCircle className="w-4 h-4" />
                                                        {game.completions} completed
                                                    </span>
                                                </div>

                                                <Progress value={game.completion_rate} className="h-2" />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        {/* Mood Analytics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="h-5 w-5" />
                                    Client Mood Analytics
                                </CardTitle>
                                <CardDescription>
                                    Mood patterns and emotional wellbeing trends
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {analytics.mood_analytics.average_mood_score.toFixed(1)}/5
                                            </div>
                                            <p className="text-sm text-gray-600">Average Mood</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {analytics.mood_analytics.mood_consistency}%
                                            </div>
                                            <p className="text-sm text-gray-600">Consistency</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-3">Mood Distribution</h4>
                                        <div className="space-y-2">
                                            {Object.entries(analytics.mood_analytics.mood_distribution).map(([mood, count]) => (
                                                <div key={mood} className="flex items-center justify-between">
                                                    <span className="flex items-center gap-2 text-sm">
                                                        <span className="text-lg">{getMoodEmoji(mood)}</span>
                                                        {mood.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <Progress 
                                                            value={(count / Object.values(analytics.mood_analytics.mood_distribution).reduce((a, b) => a + b, 0)) * 100} 
                                                            className="w-16 h-2" 
                                                        />
                                                        <span className="text-sm font-medium w-8">{count}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Weekly Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Weekly Summary
                                </CardTitle>
                                <CardDescription>
                                    Key metrics and insights from this week
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {analytics.weekly_summary.total_interactions}
                                            </div>
                                            <p className="text-sm text-gray-600">Total Interactions</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-600">
                                                {analytics.weekly_summary.average_engagement_time}m
                                            </div>
                                            <p className="text-sm text-gray-600">Avg Engagement</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>New Clients:</span>
                                            <span className="font-medium">{analytics.weekly_summary.new_clients}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Active Clients:</span>
                                            <span className="font-medium">{analytics.weekly_summary.active_clients}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Content Published:</span>
                                            <span className="font-medium">{analytics.weekly_summary.content_published}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <h4 className="font-medium mb-2">Key Insights</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            {analytics.weekly_summary.insights.map((insight, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <Star className="h-3 w-3 mt-0.5 text-yellow-500 flex-shrink-0" />
                                                    {insight}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Appointment Analytics */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Appointment Analytics
                            </CardTitle>
                            <CardDescription>
                                Session attendance and performance metrics
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {analytics.appointment_analytics.total_appointments}
                                    </div>
                                    <p className="text-sm text-gray-600">Total Sessions</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {analytics.appointment_analytics.attendance_rate}%
                                    </div>
                                    <p className="text-sm text-gray-600">Attendance Rate</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {analytics.appointment_analytics.average_session_rating}
                                    </div>
                                    <p className="text-sm text-gray-600">Avg Rating</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {analytics.appointment_analytics.upcoming_appointments}
                                    </div>
                                    <p className="text-sm text-gray-600">Upcoming</p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-lg font-bold text-green-600">
                                        {analytics.appointment_analytics.completed_appointments}
                                    </div>
                                    <p className="text-sm text-gray-600">Completed</p>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-lg font-bold text-yellow-600">
                                        {analytics.appointment_analytics.cancelled_appointments}
                                    </div>
                                    <p className="text-sm text-gray-600">Cancelled</p>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-lg font-bold text-red-600">
                                        {analytics.appointment_analytics.no_shows}
                                    </div>
                                    <p className="text-sm text-gray-600">No Shows</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Client Progress */}
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Client Progress
                            </CardTitle>
                            <CardDescription>
                                Overview of your clients' engagement
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {analytics.client_progress.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">
                                    No client activity data available
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {analytics.client_progress.map((client) => (
                                        <div key={client.user?.id || Math.random()} className="border rounded-lg p-4">
                                            <h4 className="font-medium mb-2">{client.user?.name || 'Unknown Client'}</h4>

                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Games completed:</span>
                                                    <span className="font-medium">{client.games_completed}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Articles read:</span>
                                                    <span className="font-medium">{client.articles_read}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Last active:</span>
                                                    <span className="font-medium">
                                                        {client.last_activity
                                                            ? new Date(client.last_activity).toLocaleDateString()
                                                            : 'Never'
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
