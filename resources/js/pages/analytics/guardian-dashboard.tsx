import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Heart,
    Calendar,
    BookOpen,
    Gamepad2,
    TrendingUp,
    TrendingDown,
    Users,
    Clock,
    Star,
    Activity,
    MessageCircle,
    Target
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Child {
    id: number;
    name: string;
    mood_streak: number;
    total_mood_entries: number;
    recent_mood_average: number;
    games_completed: number;
    articles_read: number;
    last_activity: string;
    progress_score: number;
}

interface MoodTrend {
    date: string;
    average_mood: number;
    entries_count: number;
}

interface EngagementData {
    total_sessions: number;
    average_session_duration: number;
    content_completion_rate: number;
    weekly_active_days: number;
}

interface Props {
    children: Child[];
    moodTrends: MoodTrend[];
    engagementData: EngagementData;
    weeklyInsights: string[];
    upcomingAppointments: any[];
}

export default function GuardianAnalyticsDashboard({ 
    children, 
    moodTrends, 
    engagementData, 
    weeklyInsights,
    upcomingAppointments 
}: Props) {
    const totalMoodEntries = children.reduce((sum, child) => sum + child.total_mood_entries, 0);
    const averageMoodScore = children.reduce((sum, child) => sum + child.recent_mood_average, 0) / children.length || 0;
    const totalGamesCompleted = children.reduce((sum, child) => sum + child.games_completed, 0);
    const totalArticlesRead = children.reduce((sum, child) => sum + child.articles_read, 0);

    const getMoodColor = (score: number) => {
        if (score >= 4) return 'text-green-600';
        if (score >= 3) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getMoodEmoji = (score: number) => {
        if (score >= 4.5) return '😄';
        if (score >= 4) return '😊';
        if (score >= 3) return '😐';
        if (score >= 2) return '😔';
        return '😢';
    };

    return (
        <AppLayout>
            <Head title="Family Analytics" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Family Analytics</h1>
                        <p className="text-gray-600">
                            Track your children's mental health journey and progress
                        </p>
                    </div>

                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Mood Entries</CardTitle>
                                <Heart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalMoodEntries}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total mood check-ins
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
                                <div className="text-lg">{getMoodEmoji(averageMoodScore)}</div>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${getMoodColor(averageMoodScore)}`}>
                                    {averageMoodScore.toFixed(1)}/5
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    This week's average
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Games Completed</CardTitle>
                                <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalGamesCompleted}</div>
                                <p className="text-xs text-muted-foreground">
                                    Learning activities
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Articles Read</CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalArticlesRead}</div>
                                <p className="text-xs text-muted-foreground">
                                    Educational content
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Children Progress */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Children's Progress
                            </CardTitle>
                            <CardDescription>
                                Individual progress tracking for each child
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {children.map((child) => (
                                    <div key={child.id} className="border rounded-lg p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">{child.name}</h3>
                                            <Badge variant="outline">
                                                {child.progress_score}% progress
                                            </Badge>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-2">
                                                    <Heart className="h-4 w-4 text-red-500" />
                                                    Mood Streak
                                                </span>
                                                <span className="font-medium">{child.mood_streak} days</span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-2">
                                                    <div className="text-lg">{getMoodEmoji(child.recent_mood_average)}</div>
                                                    Recent Mood
                                                </span>
                                                <span className={`font-medium ${getMoodColor(child.recent_mood_average)}`}>
                                                    {child.recent_mood_average.toFixed(1)}/5
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-2">
                                                    <Gamepad2 className="h-4 w-4 text-blue-500" />
                                                    Games
                                                </span>
                                                <span className="font-medium">{child.games_completed} completed</span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 text-green-500" />
                                                    Articles
                                                </span>
                                                <span className="font-medium">{child.articles_read} read</span>
                                            </div>

                                            <div className="pt-2">
                                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                    <span>Overall Progress</span>
                                                    <span>{child.progress_score}%</span>
                                                </div>
                                                <Progress value={child.progress_score} className="h-2" />
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                Last active: {new Date(child.last_activity).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Mood Trends */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Mood Trends
                                </CardTitle>
                                <CardDescription>
                                    Weekly mood patterns across all children
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {moodTrends.slice(-7).map((trend, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="text-xl">{getMoodEmoji(trend.average_mood)}</div>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {new Date(trend.date).toLocaleDateString('en-US', { weekday: 'long' })}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {trend.entries_count} mood entries
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-sm font-medium ${getMoodColor(trend.average_mood)}`}>
                                                    {trend.average_mood.toFixed(1)}/5
                                                </div>
                                                <Progress value={trend.average_mood * 20} className="w-16 h-1" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Engagement Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Engagement Summary
                                </CardTitle>
                                <CardDescription>
                                    Platform usage and activity metrics
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {engagementData.total_sessions}
                                            </div>
                                            <p className="text-sm text-gray-600">Total Sessions</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {engagementData.average_session_duration}m
                                            </div>
                                            <p className="text-sm text-gray-600">Avg Duration</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Content Completion Rate</span>
                                            <span>{engagementData.content_completion_rate}%</span>
                                        </div>
                                        <Progress value={engagementData.content_completion_rate} className="h-2" />
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Weekly Active Days</span>
                                            <span>{engagementData.weekly_active_days}/7 days</span>
                                        </div>
                                        <Progress value={(engagementData.weekly_active_days / 7) * 100} className="h-2" />
                                    </div>

                                    <div className="pt-4 border-t">
                                        <h4 className="font-medium mb-2">This Week's Highlights</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            {weeklyInsights.map((insight, index) => (
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

                    {/* Upcoming Appointments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Upcoming Appointments
                            </CardTitle>
                            <CardDescription>
                                Scheduled therapy sessions for your children
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {upcomingAppointments.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No upcoming appointments scheduled
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {upcomingAppointments.slice(0, 5).map((appointment, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-blue-600">
                                                        {new Date(appointment.scheduled_at).getDate()}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(appointment.scheduled_at).toLocaleDateString('en-US', { month: 'short' })}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{appointment.child_name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        with {appointment.therapist_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(appointment.scheduled_at).toLocaleTimeString('en-US', { 
                                                            hour: '2-digit', 
                                                            minute: '2-digit' 
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="outline">
                                                {appointment.duration_minutes} min
                                            </Badge>
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