import { Head, router } from '@inertiajs/react';
import { Calendar, TrendingUp, BarChart3, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

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
    moodLogs: MoodLog[];
    moodStats: MoodStats;
    startDate: string;
    endDate: string;
}

export default function MoodHistory({ moodLogs, moodStats, startDate, endDate }: Props) {
    const [dateRange, setDateRange] = useState({
        start_date: startDate,
        end_date: endDate,
    });

    const handleDateRangeChange = () => {
        router.get('/mood/history', dateRange);
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

    const moodColors = {
        very_sad: 'bg-red-500',
        sad: 'bg-orange-500',
        neutral: 'bg-gray-500',
        happy: 'bg-green-500',
        very_happy: 'bg-blue-500',
    };

    return (
        <AppLayout>
            <Head title="Mood History" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <a href="/mood">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Mood Tracker
                        </a>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Mood History</h1>
                        <p className="text-muted-foreground">
                            Track your emotional journey over time
                        </p>
                    </div>
                </div>

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
                <div className="grid md:grid-cols-4 gap-4">
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
                            How often you felt each emotion during this period
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

                {/* Mood Timeline */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Mood Timeline
                        </CardTitle>
                        <CardDescription>
                            Your mood entries over time
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {moodLogs.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No mood entries found for this date range.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {moodLogs.map((log) => (
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
                                                <p className="text-sm text-muted-foreground">{log.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
