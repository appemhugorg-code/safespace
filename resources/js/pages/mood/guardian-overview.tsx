import { Head, router } from '@inertiajs/react';
import { Calendar, TrendingUp, BarChart3, User, Heart, Eye } from 'lucide-react';
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
    latest_mood?: MoodLog;
}

interface ChildMoodData {
    child: Child;
    mood_logs: MoodLog[];
    stats: MoodStats;
}

interface Props {
    childrenMoodData: ChildMoodData[];
    startDate: string;
    endDate: string;
    message?: string;
}

export default function GuardianOverview({ childrenMoodData, startDate, endDate, message }: Props) {
    const [dateRange, setDateRange] = useState({
        start_date: startDate,
        end_date: endDate,
    });

    const handleDateRangeChange = () => {
        router.get('/mood/overview', dateRange);
    };

    const getMoodEmoji = (mood: string) => {
        const moodEmojis = {
            very_sad: '😢',
            sad: '😔',
            neutral: '😐',
            happy: '😊',
            very_happy: '😄',
        };
        return moodEmojis[mood as keyof typeof moodEmojis] || '😐';
    };

    const getMoodColor = (mood: string) => {
        const moodColors = {
            very_sad: 'bg-red-100 text-red-800',
            sad: 'bg-orange-100 text-orange-800',
            neutral: 'bg-gray-100 text-gray-800',
            happy: 'bg-green-100 text-green-800',
            very_happy: 'bg-emerald-100 text-emerald-800',
        };
        return moodColors[mood as keyof typeof moodColors] || 'bg-gray-100 text-gray-800';
    };

    const getMoodLabel = (mood: string) => {
        const moodLabels = {
            very_sad: 'Very Sad',
            sad: 'Sad',
            neutral: 'Neutral',
            happy: 'Happy',
            very_happy: 'Very Happy',
        };
        return moodLabels[mood as keyof typeof moodLabels] || 'Unknown';
    };

    if (message) {
        return (
            <AppLayout>
                <Head title="Mood Tracking Overview" />
                <div className="container mx-auto p-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold">Children's Mood Tracking</h1>
                        <p className="text-muted-foreground">Monitor your children's emotional well-being</p>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center">
                                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-lg text-muted-foreground">{message}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Mood Tracking Overview" />
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Children's Mood Tracking</h1>
                        <p className="text-muted-foreground">Monitor your children's emotional well-being</p>
                    </div>
                </div>

                {/* Date Range Filter */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Date Range
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    type="date"
                                    id="start_date"
                                    value={dateRange.start_date}
                                    onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
                                />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    type="date"
                                    id="end_date"
                                    value={dateRange.end_date}
                                    onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                                />
                            </div>
                            <Button onClick={handleDateRangeChange} className="mt-6">
                                Update Range
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Children's Mood Data */}
                <div className="grid gap-6">
                    {childrenMoodData.map((childData) => (
                        <Card key={childData.child.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <User className="h-6 w-6" />
                                        <div>
                                            <CardTitle>{childData.child.name}</CardTitle>
                                            <CardDescription>
                                                {childData.stats.total_entries} mood entries in selected period
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(`/child/${childData.child.id}/mood`)}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Latest Mood */}
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm text-muted-foreground">Latest Mood</h4>
                                        {childData.stats.latest_mood ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">
                                                    {getMoodEmoji(childData.stats.latest_mood.mood)}
                                                </span>
                                                <Badge className={getMoodColor(childData.stats.latest_mood.mood)}>
                                                    {getMoodLabel(childData.stats.latest_mood.mood)}
                                                </Badge>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No recent entries</p>
                                        )}
                                    </div>

                                    {/* Average Mood */}
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm text-muted-foreground">Average Mood</h4>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4" />
                                            <span className="font-semibold">
                                                {childData.stats.average_mood ? childData.stats.average_mood.toFixed(1) : 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Streak */}
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm text-muted-foreground">Current Streak</h4>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span className="font-semibold">{childData.stats.streak} days</span>
                                        </div>
                                    </div>

                                    {/* Total Entries */}
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm text-muted-foreground">Total Entries</h4>
                                        <div className="flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4" />
                                            <span className="font-semibold">{childData.stats.total_entries}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Mood Logs */}
                                {childData.mood_logs.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="font-medium text-sm text-muted-foreground mb-3">Recent Entries</h4>
                                        <div className="space-y-2">
                                            {childData.mood_logs.slice(0, 3).map((log) => (
                                                <div key={log.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-lg">{getMoodEmoji(log.mood)}</span>
                                                        <div>
                                                            <Badge className={getMoodColor(log.mood)} variant="secondary">
                                                                {getMoodLabel(log.mood)}
                                                            </Badge>
                                                            {log.notes && (
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {log.notes}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(log.mood_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
