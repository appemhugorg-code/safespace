import { Head, Link } from '@inertiajs/react';
import { Users, Calendar, MessageCircle, Heart, Plus, TrendingUp, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ResponsiveGrid } from '@/components/ui/responsive-grid';
import AppLayout from '@/layouts/app-layout';

interface Stats {
    total_children: number;
    active_children: number;
    pending_children: number;
    upcoming_appointments: number;
    unread_messages: number;
}

interface Child {
    id: number;
    name: string;
    email: string;
    status: string;
}

interface Appointment {
    id: number;
    scheduled_at: string;
    duration_minutes: number;
    child?: { id: number; name: string } | null;
    therapist?: { id: number; name: string } | null;
}

interface ChildMoodData {
    child: Child;
    recent_moods: Array<{
        id: number;
        mood: string;
        mood_emoji: string;
        mood_display: string;
        mood_date: string;
    }>;
    mood_streak: number;
}

interface Props {
    stats: Stats;
    children: Child[];
    upcomingAppointments: Appointment[];
    childrenMoodData: ChildMoodData[];
}

export default function GuardianDashboard({ stats, children, upcomingAppointments, childrenMoodData }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            case 'active':
                return <Badge className="bg-green-100 text-green-800">Active</Badge>;
            case 'suspended':
                return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title="Guardian Dashboard" />

            <div className="container-mobile space-y-6 sm:space-y-8 py-4 sm:py-6 lg:py-8 animate-fade-in">
                <div className="space-y-2 animate-slide-up">
                    <h1 className="text-2xl sm:text-display font-bold">Welcome back! 👋</h1>
                    <p className="text-body text-muted-foreground px-2 sm:px-0">
                        Here's an overview of your children's progress and upcoming activities
                    </p>
                </div>

                {/* Stats Cards */}
                <ResponsiveGrid columns={{ mobile: 2, tablet: 3, desktop: 5 }} gap="md" className="animate-slide-up">
                    <Card spacing="comfortable" interactive>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-body-sm font-medium">My Children</CardTitle>
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-heading font-bold">{stats.total_children}</div>
                            <p className="text-xs sm:text-caption text-muted-foreground">
                                {stats.active_children} active, {stats.pending_children} pending
                            </p>
                        </CardContent>
                    </Card>

                    <Card spacing="comfortable" interactive>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-body-sm font-medium">Appointments</CardTitle>
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-heading font-bold">{stats.upcoming_appointments}</div>
                            <p className="text-xs sm:text-caption text-muted-foreground">
                                upcoming sessions
                            </p>
                        </CardContent>
                    </Card>

                    <Card spacing="comfortable" interactive>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-body-sm font-medium">Messages</CardTitle>
                            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-heading font-bold">{stats.unread_messages}</div>
                            <p className="text-xs sm:text-caption text-muted-foreground">
                                new messages
                            </p>
                        </CardContent>
                    </Card>

                    <Card spacing="comfortable">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-body-sm font-medium">Active Children</CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-heading font-bold">{stats.active_children}</div>
                            <p className="text-caption text-muted-foreground">
                                using SafeSpace
                            </p>
                        </CardContent>
                    </Card>

                    <Card spacing="comfortable">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-body-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-heading font-bold">{stats.pending_children}</div>
                            <p className="text-caption text-muted-foreground">
                                awaiting approval
                            </p>
                        </CardContent>
                    </Card>
                </ResponsiveGrid>

                <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 2 }} gap="lg">
                    {/* Children Overview */}
                    <Card spacing="comfortable">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-sm">
                                <Users className="h-5 w-5" />
                                My Children
                            </CardTitle>
                            <CardDescription>
                                Overview of your children's accounts and recent activity
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {children.length === 0 ? (
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-subheading font-semibold mb-2">No children added yet</h3>
                                    <p className="text-body text-muted-foreground mb-4">
                                        Create your first child account to get started
                                    </p>
                                    <Button asChild>
                                        <Link href="/guardian/children/create">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Child Account
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {children.slice(0, 3).map((child) => (
                                        <div key={child.id} className="flex items-center justify-between p-4 border rounded-xl">
                                            <div>
                                                <p className="text-body font-medium">{child.name}</p>
                                                <p className="text-body-sm text-muted-foreground">{child.email}</p>
                                            </div>
                                            <div className="flex items-center gap-sm">
                                                {getStatusBadge(child.status)}
                                            </div>
                                        </div>
                                    ))}

                                    <Button asChild className="w-full">
                                        <Link href="/guardian/children">
                                            View All Children
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
                                <Calendar className="h-5 w-5" />
                                Upcoming Appointments
                            </CardTitle>
                            <CardDescription>
                                Scheduled therapy sessions for your children
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {upcomingAppointments.length === 0 ? (
                                <div className="text-center py-8">
                                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-subheading font-semibold mb-2">No upcoming appointments</h3>
                                    <p className="text-body text-muted-foreground mb-4">
                                        Schedule an appointment with a therapist
                                    </p>
                                    <Button asChild>
                                        <Link href="/appointments/create">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Request Appointment
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {upcomingAppointments.slice(0, 3).map((appointment) => (
                                        <div key={appointment.id} className="p-4 border rounded-xl">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-body font-medium">
                                                    {appointment.child?.name
                                                        ? `${appointment.child.name} with ${appointment.therapist?.name || 'Therapist TBD'}`
                                                        : `Consultation with ${appointment.therapist?.name || 'Therapist TBD'}`
                                                    }
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

                                    <Button asChild className="w-full">
                                        <Link href="/appointments">
                                            View All Appointments
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </ResponsiveGrid>

                {/* Children Mood Overview */}
                {childrenMoodData.length > 0 && (
                    <Card spacing="comfortable">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-sm">
                                <Heart className="h-5 w-5 text-red-500" />
                                Children's Mood Overview
                            </CardTitle>
                            <CardDescription>
                                Recent emotional well-being data for your children
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 2 }} gap="lg">
                                {childrenMoodData.map((childData) => (
                                    <div key={childData.child.id} className="border rounded-xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-subheading font-semibold">{childData.child.name}</h4>
                                            <div className="flex items-center gap-sm">
                                                <span className="text-body-sm text-muted-foreground">
                                                    {childData.mood_streak} day streak
                                                </span>
                                                {childData.mood_streak > 0 && <span>🔥</span>}
                                            </div>
                                        </div>

                                        {childData.recent_moods.length === 0 ? (
                                            <p className="text-body-sm text-muted-foreground text-center py-4">
                                                No mood entries yet
                                            </p>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="flex gap-1 justify-center">
                                                    {childData.recent_moods.slice(0, 7).map((mood) => (
                                                        <div
                                                            key={mood.id}
                                                            className="text-2xl"
                                                            title={`${mood.mood_display} - ${new Date(mood.mood_date).toLocaleDateString()}`}
                                                        >
                                                            {mood.mood_emoji}
                                                        </div>
                                                    ))}
                                                </div>

                                                <Button variant="outline" size="sm" className="w-full" asChild>
                                                    <Link href={`/child/${childData.child.id}/mood`}>
                                                        <TrendingUp className="h-4 w-4 mr-2" />
                                                        View Detailed Mood Data
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </ResponsiveGrid>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Actions */}
                <Card spacing="comfortable">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common tasks for managing your children's care
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveGrid columns={{ mobile: 2, tablet: 4, desktop: 4 }} gap="md">
                            <Button size="lg" asChild>
                                <Link href="/guardian/children">
                                    <Users className="h-4 w-4 mr-2" />
                                    Manage Children
                                </Link>
                            </Button>

                            <Button size="lg" variant="outline" asChild>
                                <Link href="/appointments">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    View Appointments
                                </Link>
                            </Button>

                            <Button size="lg" variant="outline" asChild>
                                <Link href="/messages">
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Messages
                                </Link>
                            </Button>

                            <Button size="lg" variant="outline" asChild>
                                <Link href="/appointments/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Request Appointment
                                </Link>
                            </Button>
                        </ResponsiveGrid>
                    </CardContent>
                </Card>

                {/* Safety Notice */}
                <Card variant="elevated" spacing="spacious" className="bg-blue-50 border-blue-200">
                    <CardContent>
                        <div className="flex items-start gap-md">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Heart className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h4 className="text-subheading font-semibold text-blue-900 mb-2">Your Child's Safety</h4>
                                <p className="text-body text-blue-800">
                                    All interactions are monitored for safety. If you notice any concerning patterns
                                    in your child's mood or behavior, please reach out to their therapist immediately.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
