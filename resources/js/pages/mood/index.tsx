import { Head, router } from '@inertiajs/react';
import { Heart, Calendar, TrendingUp, Star } from 'lucide-react';
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

interface Props {
    todayMood?: MoodLog;
    recentMoods: MoodLog[];
}

const moodOptions = [
    { value: 'very_sad', emoji: '😢', label: 'Very Sad', color: 'bg-red-500 hover:bg-red-600' },
    { value: 'sad', emoji: '😔', label: 'Sad', color: 'bg-orange-500 hover:bg-orange-600' },
    { value: 'neutral', emoji: '😐', label: 'Okay', color: 'bg-gray-500 hover:bg-gray-600' },
    { value: 'happy', emoji: '😊', label: 'Happy', color: 'bg-green-500 hover:bg-green-600' },
    { value: 'very_happy', emoji: '😄', label: 'Very Happy', color: 'bg-blue-500 hover:bg-blue-600' },
];

export default function MoodTracking({ todayMood, recentMoods }: Props) {
    const [selectedMood, setSelectedMood] = useState(todayMood?.mood || '');
    const [notes, setNotes] = useState(todayMood?.notes || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleMoodSubmit = () => {
        if (!selectedMood) return;

        setIsSubmitting(true);
        router.post('/mood', {
            mood: selectedMood,
            notes: notes,
        }, {
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    const getStreakCount = () => {
        let streak = 0;
        const today = new Date();

        for (let i = 0; i < recentMoods.length; i++) {
            const moodDate = new Date(recentMoods[i].mood_date);
            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);

            if (moodDate.toDateString() === expectedDate.toDateString()) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    };

    return (
        <AppLayout>
            <Head title="My Mood" />

            <div className="space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary">How are you feeling today?</h1>
                    <p className="text-muted-foreground mt-2">
                        Take a moment to check in with yourself
                    </p>
                </div>

                {/* Mood Selector */}
                <Card className="max-w-2xl mx-auto">
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-2">
                            <Heart className="h-6 w-6 text-red-500" />
                            Today's Mood
                        </CardTitle>
                        <CardDescription>
                            {todayMood ? 'You can update your mood anytime today' : 'Choose how you\'re feeling right now'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Mood Options */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {moodOptions.map((mood) => (
                                <button
                                    key={mood.value}
                                    onClick={() => setSelectedMood(mood.value)}
                                    className={`
                                        p-4 rounded-lg border-2 transition-all duration-200 text-white font-semibold
                                        ${selectedMood === mood.value
                                            ? `${mood.color} border-white scale-105 shadow-lg`
                                            : `${mood.color} border-transparent hover:scale-105 hover:shadow-md`
                                        }
                                    `}
                                >
                                    <div className="text-3xl mb-2">{mood.emoji}</div>
                                    <div className="text-sm">{mood.label}</div>
                                </button>
                            ))}
                        </div>

                        {/* Notes Section */}
                        {selectedMood && (
                            <div className="space-y-2">
                                <Label htmlFor="notes">How was your day? (Optional)</Label>
                                <Input
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Tell us about your day..."
                                    maxLength={500}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {notes.length}/500 characters
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        {selectedMood && (
                            <Button
                                onClick={handleMoodSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-primary hover:bg-primary/90"
                                size="lg"
                            >
                                {todayMood ? 'Update My Mood' : 'Save My Mood'}
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Stats and Recent Moods */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {/* Streak Card */}
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                Mood Streak
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2">
                                {getStreakCount()}
                            </div>
                            <p className="text-muted-foreground">
                                {getStreakCount() === 1 ? 'day' : 'days'} in a row!
                            </p>
                            {getStreakCount() > 0 && (
                                <p className="text-sm text-green-600 mt-2">
                                    Great job tracking your mood! 🌟
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Moods */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Recent Moods
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentMoods.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">
                                    Start tracking your mood to see your history here!
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {recentMoods.slice(0, 5).map((mood) => (
                                        <div key={mood.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{mood.mood_emoji}</span>
                                                <div>
                                                    <p className="font-medium">{mood.mood_display}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(mood.mood_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {recentMoods.length > 0 && (
                                <Button variant="outline" className="w-full mt-4" asChild>
                                    <a href="/mood/history">
                                        <TrendingUp className="h-4 w-4 mr-2" />
                                        View Full History
                                    </a>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Encouragement Message */}
                {todayMood && (
                    <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                        <CardContent className="text-center py-6">
                            <h3 className="font-semibold text-blue-900 mb-2">
                                Thank you for sharing! 💙
                            </h3>
                            <p className="text-blue-800">
                                Remember, all feelings are valid. You're doing great by checking in with yourself.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
