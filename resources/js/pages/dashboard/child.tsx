import { Head, Link } from '@inertiajs/react';
import { Heart, Calendar, MessageCircle, Star, Gamepad2, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveGrid } from '@/components/ui/responsive-grid';
import { EnhancedDashboard } from '@/components/dashboard';
import AppLayout from '@/layouts/app-layout';

interface Stats {
    mood_streak: number;
    total_mood_entries: number;
    upcoming_appointments: number;
    unread_messages: number;
}

interface MoodLog {
    id: number;
    mood: string;
    mood_emoji?: string;
    mood_display?: string;
    mood_date: string;
    notes?: string;
}

interface Appointment {
    id: number;
    scheduled_at: string;
    duration_minutes: number;
    therapist: { id: number; name: string };
}

interface Props {
    stats: Stats;
    todayMood?: MoodLog;
    recentMoods: MoodLog[];
    upcomingAppointments: Appointment[];
}

export default function ChildDashboard({ stats, todayMood, recentMoods, upcomingAppointments }: Props) {
    const encouragementMessages = [
        "You're doing great! Keep tracking your feelings! 🌟",
        "Every day is a new chance to feel better! 💙",
        "You're brave for sharing your feelings! 🦋",
        "Remember, all feelings are okay! 🌈",
        "You're stronger than you know! 💪",
    ];

    const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];

    return (
        <AppLayout>
            <Head title="My Dashboard" />

            <div className="container-mobile space-y-6 sm:space-y-8 py-4 sm:py-6 lg:py-8 animate-fade-in">
                <div className="text-center space-y-2 animate-slide-up">
                    <h1 className="text-2xl sm:text-display text-primary font-semibold">Welcome back! 👋</h1>
                    <p className="text-body text-muted-foreground px-4">
                        How are you feeling today?
                    </p>
                </div>

                {/* Today's Mood Check */}
                <Card variant="elevated" spacing="spacious" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 animate-scale-in" interactive>
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-md text-blue-900">
                            <Heart className="h-6 w-6 text-red-500" />
                            Today's Mood Check
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        {todayMood ? (
                            <div className="animate-fade-in">
                                <div className="text-5xl sm:text-6xl mb-4 animate-pulse-gentle">{todayMood.mood_emoji || '😊'}</div>
                                <p className="text-lg sm:text-subheading font-semibold text-blue-900 mb-4 px-2">
                                    You're feeling {todayMood.mood_display?.toLowerCase() || todayMood.mood || 'good'} today
                                </p>
                                {todayMood.notes && (
                                    <p className="text-body-sm text-blue-800 mb-6 px-4">
                                        "{todayMood.notes}"
                                    </p>
                                )}
                                <Button variant="outline" size="lg" asChild>
                                    <Link href="/mood">Update My Mood</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <div className="text-5xl sm:text-6xl mb-4 animate-pulse-gentle">😊</div>
                                <p className="text-lg sm:text-subheading font-semibold text-blue-900 mb-6 px-2">
                                    You haven't checked in today yet!
                                </p>
                                <Button size="lg" asChild>
                                    <Link href="/mood">
                                        <Heart className="h-4 w-4 mr-2" />
                                        Check My Mood
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                <ResponsiveGrid columns={{ mobile: 2, tablet: 2, desktop: 4 }} gap="md" className="animate-slide-up">
                    <Card spacing="comfortable" interactive>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs sm:text-body-sm font-medium flex items-center gap-1 sm:gap-sm">
                                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                                <span className="truncate">Mood Streak</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-heading font-bold">{stats.mood_streak}</div>
                            <p className="text-xs sm:text-caption text-muted-foreground">
                                {stats.mood_streak === 1 ? 'day' : 'days'} in a row!
                            </p>
                        </CardContent>
                    </Card>

                    <Card spacing="comfortable" interactive>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs sm:text-body-sm font-medium flex items-center gap-1 sm:gap-sm">
                                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                                <span className="truncate">Check-ins</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-heading font-bold">{stats.total_mood_entries}</div>
                            <p className="text-xs sm:text-caption text-muted-foreground">
                                mood entries
                            </p>
                        </CardContent>
                    </Card>

                    <Card spacing="comfortable" interactive>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs sm:text-body-sm font-medium flex items-center gap-1 sm:gap-sm">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                                <span className="truncate">Appointments</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-heading font-bold">{stats.upcoming_appointments}</div>
                            <p className="text-xs sm:text-caption text-muted-foreground">
                                coming up
                            </p>
                        </CardContent>
                    </Card>

                    <Card spacing="comfortable" interactive>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs sm:text-body-sm font-medium flex items-center gap-1 sm:gap-sm">
                                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                                <span className="truncate">Messages</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-heading font-bold">{stats.unread_messages}</div>
                            <p className="text-xs sm:text-caption text-muted-foreground">
                                new messages
                            </p>
                        </CardContent>
                    </Card>
                </ResponsiveGrid>

                <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 2 }} gap="lg">
                    {/* Recent Moods */}
                    <Card spacing="comfortable">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-sm">
                                <Heart className="h-5 w-5 text-red-500" />
                                My Recent Moods
                            </CardTitle>
                            <CardDescription>
                                How you've been feeling this week
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentMoods.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted-foreground">
                                        Start tracking your mood to see your progress!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentMoods.slice(0, 5).map((mood) => (
                                        <div key={mood.id} className="flex items-center justify-between p-4 border rounded-xl">
                                            <div className="flex items-center gap-md">
                                                <span className="text-2xl">{mood.mood_emoji || '😊'}</span>
                                                <div>
                                                    <p className="text-body font-medium">{mood.mood_display || mood.mood || 'Unknown'}</p>
                                                    <p className="text-body-sm text-muted-foreground">
                                                        {new Date(mood.mood_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/mood/history">
                                            View All My Moods
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Appointments */}
                    <Card spacing="comfortable">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-sm">
                                <Calendar className="h-5 w-5 text-blue-500" />
                                My Appointments
                            </CardTitle>
                            <CardDescription>
                                Upcoming therapy sessions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {upcomingAppointments.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted-foreground">
                                        No upcoming appointments
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {upcomingAppointments.map((appointment) => (
                                        <div key={appointment.id} className="p-4 border rounded-xl">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-body font-medium">
                                                    Session with {appointment.therapist.name}
                                                </p>
                                                <Badge variant="outline">
                                                    {appointment.duration_minutes} min
                                                </Badge>
                                            </div>
                                            <p className="text-body-sm text-muted-foreground">
                                                {new Date(appointment.scheduled_at).toLocaleDateString()} at{' '}
                                                {new Date(appointment.scheduled_at).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    ))}

                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/appointments">
                                            View All Appointments
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </ResponsiveGrid>

                {/* Quick Actions */}
                <Card spacing="comfortable">
                    <CardHeader>
                        <CardTitle>What would you like to do?</CardTitle>
                        <CardDescription>
                            Choose an activity to help you feel better
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveGrid columns={{ mobile: 2, tablet: 4, desktop: 4 }} gap="md">
                            <Button size="lg" asChild className="h-16 sm:h-20 flex-col text-sm sm:text-base">
                                <Link href="/mood">
                                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                                    <span className="text-center leading-tight">Check My Mood</span>
                                </Link>
                            </Button>

                            <Button size="lg" variant="outline" asChild className="h-16 sm:h-20 flex-col text-sm sm:text-base">
                                <Link href="/games">
                                    <Gamepad2 className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                                    <span className="text-center leading-tight">Play Games</span>
                                </Link>
                            </Button>

                            <Button size="lg" variant="outline" asChild className="h-16 sm:h-20 flex-col text-sm sm:text-base">
                                <Link href="/messages">
                                    <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                                    <span className="text-center leading-tight">Send Message</span>
                                </Link>
                            </Button>

                            <Button size="lg" variant="outline" asChild className="h-16 sm:h-20 flex-col bg-red-50 border-red-200 text-red-700 hover:bg-red-100 text-sm sm:text-base">
                                <Link href="/emergency">
                                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                                    <span className="text-center leading-tight">Need Help?</span>
                                </Link>
                            </Button>
                        </ResponsiveGrid>
                    </CardContent>
                </Card>

                {/* Enhanced Customizable Dashboard */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">My Personalized Dashboard</h2>
                    <EnhancedDashboard userRole="child" />
                </div>

                {/* Encouragement Message */}
                <Card variant="elevated" spacing="spacious" className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                    <CardContent className="text-center">
                        <div className="text-4xl mb-4">🌟</div>
                        <p className="text-subheading font-semibold text-green-900">
                            {randomMessage}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
