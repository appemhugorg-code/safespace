import { Head, router } from '@inertiajs/react';
import { Calendar, TrendingUp, BarChart3, ArrowLeft, User, Heart } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';

interface Child {
    id: number;
    name: string;
    email: string;
    status: string;
}

interface MoodLog {
    id: number;
    mood: string;
    notes?: string;
    mood_date: string;
    mood_display: string;
    mood_emoji: string;
    mood_color: string;
}

interface MoodStats {
    total_entries: number;
    mood_distribution: Record<string, number>;
    average_mood: number;
    streak: number;
}

interface Props {
    child: Child;
    moodLogs: MoodLog[];
    moodStats: MoodStats;
    startDate: string;
    endDate: string;
}

export default function ChildMoodData({ child, moodLogs, moodStats, startDate, endDate }: Props) {
    const [dateRange, setDateRange] = useState({
        start_date: startDate,
        end_date: endDate,
    });

    const handleDateRangeChange = () => {
        router.get(`/child/${child.id}/mood`, dateRange);
    };

    const getMoodPercentage = (mood: string) => {
        const count = moodStats.mood_distribution[mood] || 0;
        return moodStats.total_entries > 0 ? Math.round((count / moodStats.total_entries) * 100) : 0;
    };

    const getAverageMoodDisplay = () => {
        if (!moodStats.average_mood) return 'No data';

        const score = moodStats.average_mood;
        if (score <= 1.5) return 'Very Sad 😢';
        if (score <= 2.5) return 'Sad 😔';
        if (score <= 3.5) return 'Neutral 😐';
        if (score <= 4.5) return 'Happy 😊';
        return 'Very Happy 😄';
    };

    const getRecentTrend = () => {
        if (moodLogs.length < 2) return null;

        const recent = moodLogs.slice(0, 3);
        const moodValues = { very_sad: 1, sad: 2, neutral: 3, happy: 4, very_happy: 5 };

        const recentAvg = recent.reduce((sum, log) => sum + (moodValues[log.mood as keyof typeof moodValues] || 3), 0) / recent.length;
        const older = moodLogs.slice(3, 6);

        if (older.length === 0) return null;

        const olderAvg = older.reduce((sum, log) => sum + (moodValues[log.mood as keyof typeof moodValues] || 3), 0) / older.length;

        if (recentAvg > olderAvg + 0.3) return 'improving';
        if (recentAvg < olderAvg - 0.3) return 'declining';
        return 'stable';
    };

    const trend = getRecentTrend();

    const moodColors = {
        very_sad: 'bg-red-500',
        sad: 'bg-orange-500',
        neutral: 'bg-gray-500',
        happy: 'bg-green-500',
        very_happy: 'bg-blue-500',
    };

    return (
        <AppLayout>
            <Head title={`${child.name}'s Mood Data`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div className="flex items-center gap-3">
                        <User className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold">{child.name}'s Mood Data</h1>
                            <p className="text-muted-foreground">
                                Monitor emotional well-being and patterns
                            </p>
                        </div>
                    </div>
                </div>

                {/* Alert for concerning patterns */}
                {trend === 'declining' && (
                    <Card className="border-orange-200 bg-orange-50">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 text-orange-800">
                                <Heart className="h-5 w-5" />
                                <p className="font-medium">
                                    Recent mood trend shows some decline. Consider reaching out to check in with {child.name}.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Date Range Filter */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Filter by Date Range
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 items-end">
                            <div className="grid gap-2">
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={dateRange.start_date}
                                    onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={dateRange.end_date}
                                    onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                                />
                            </div>
                            <Button onClick={handleDateRangeChange}>
                                Update
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Cards */}
                <div className="grid md:grid-cols-5 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{moodStats.total_entries}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{moodStats.streak}</div>
                            <p className="text-xs text-muted-foreground">days in a row</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold">{getAverageMoodDisplay()}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Recent Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {trend && (
                                <Badge className={
                                    trend === 'improving' ? 'bg-green-100 text-green-800' :
                                        trend === 'declining' ? 'bg-orange-100 text-orange-800' :
                                            'bg-blue-100 text-blue-800'
                                }>
                                    {trend === 'improving' ? '📈 Improving' :
                                        trend === 'declining' ? '📉 Declining' :
                                            '➡️ Stable'}
                                </Badge>
                            )}
                            {!trend && <span className="text-sm text-muted-foreground">Not enough data</span>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Most Common</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold">
                                {Object.entries(moodStats.mood_distribution).length > 0
                                    ? Object.entries(moodStats.mood_distribution)
                                        .sort(([, a], [, b]) => b - a)[0]?.[0]?.replace('_', ' ') || 'None'
                                    : 'None'
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Mood Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Mood Distribution
                        </CardTitle>
                        <CardDescription>
                            How often {child.name} felt each emotion during this period
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {['very_happy', 'happy', 'neutral', 'sad', 'very_sad'].map((mood) => {
                                const count = moodStats.mood_distribution[mood] || 0;
                                const percentage = getMoodPercentage(mood);
                                const emoji = mood === 'very_sad' ? '😢' : mood === 'sad' ? '😔' : mood === 'neutral' ? '😐' : mood === 'happy' ? '😊' : '😄';
                                const label = mood.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

                                return (
                                    <div key={mood} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{emoji}</span>
                                                <span className="font-medium">{label}</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {count} times ({percentage}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${moodColors[mood as keyof typeof moodColors]}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Mood Entries */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Recent Mood Entries
                        </CardTitle>
                        <CardDescription>
                            Latest mood entries from {child.name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {moodLogs.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No mood entries found for this date range.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {moodLogs.slice(0, 10).map((log) => (
                                    <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                                        <div className="text-3xl">{log.mood_emoji}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-semibold">{log.mood_display}</h4>
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(log.mood_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {log.notes && (
                                                <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                                                    "{log.notes}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {moodLogs.length > 10 && (
                                    <p className="text-center text-sm text-muted-foreground">
                                        Showing 10 most recent entries. Adjust date range to see more.
                                    </p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
