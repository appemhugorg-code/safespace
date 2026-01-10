<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Message;
use App\Models\MoodLog;
use App\Models\User;
use App\Services\PanicAlertService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected PanicAlertService $panicAlertService;

    public function __construct(PanicAlertService $panicAlertService)
    {
        $this->panicAlertService = $panicAlertService;
    }

    /**
     * Display the dashboard based on user role.
     */
    public function index()
    {
        $user = auth()->user();

        if ($user->hasRole('admin')) {
            return $this->adminDashboard();
        }

        if ($user->hasRole('therapist')) {
            return $this->therapistDashboard();
        }

        if ($user->hasRole('guardian')) {
            return $this->guardianDashboard();
        }

        if ($user->hasRole('child')) {
            return $this->childDashboard();
        }

        // Fallback for users without roles
        return Inertia::render('dashboard/default');
    }

    /**
     * Admin dashboard with system overview.
     */
    private function adminDashboard()
    {
        $user = auth()->user();

        $stats = [
            'total_users' => User::count(),
            'pending_users' => User::where('status', 'pending')->count(),
            'active_users' => User::where('status', 'active')->count(),
            'total_appointments' => Appointment::count(),
            'pending_appointments' => Appointment::where('status', 'requested')->count(),
            'total_messages' => Message::count(),
            'flagged_messages' => Message::where('is_flagged', true)->count(),
        ];

        $recentUsers = User::where('status', 'pending')
            ->with('roles')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $flaggedMessages = Message::where('is_flagged', true)
            ->with(['sender', 'recipient'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Get panic alerts for admin
        $panicAlerts = $this->panicAlertService->getPanicAlertsForUser($user);
        $unviewedPanicAlerts = $this->panicAlertService->getUnviewedAlertsCount($user);

        return Inertia::render('dashboard/admin', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'flaggedMessages' => $flaggedMessages,
            'panicAlerts' => $panicAlerts->take(5), // Show latest 5 alerts
            'unviewedPanicAlerts' => $unviewedPanicAlerts,
        ]);
    }

    /**
     * Therapist dashboard with client overview.
     */
    private function therapistDashboard()
    {
        $user = auth()->user();

        $stats = [
            'total_appointments' => Appointment::forTherapist($user->id)->count(),
            'upcoming_appointments' => Appointment::forTherapist($user->id)->upcoming()->count(),
            'pending_requests' => Appointment::forTherapist($user->id)->where('status', 'requested')->count(),
            'unread_messages' => Message::unreadFor($user->id)->count(),
        ];

        $upcomingAppointments = Appointment::forTherapist($user->id)
            ->upcoming()
            ->with(['child', 'guardian', 'therapist'])
            ->orderBy('scheduled_at', 'asc')
            ->limit(5)
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'scheduled_at' => $appointment->scheduled_at,
                    'duration_minutes' => $appointment->duration_minutes,
                    'status' => $appointment->status,
                    'appointment_type' => $appointment->appointment_type,
                    'child' => $appointment->child ? [
                        'id' => $appointment->child->id,
                        'name' => $appointment->child->name,
                    ] : null,
                    'guardian' => $appointment->guardian ? [
                        'id' => $appointment->guardian->id,
                        'name' => $appointment->guardian->name,
                    ] : null,
                    'therapist' => $appointment->therapist ? [
                        'id' => $appointment->therapist->id,
                        'name' => $appointment->therapist->name,
                    ] : null,
                ];
            });

        $recentMessages = Message::where('recipient_id', $user->id)
            ->with('sender')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'content' => $message->content,
                    'created_at' => $message->created_at,
                    'sender' => $message->sender ? [
                        'id' => $message->sender->id,
                        'name' => $message->sender->name,
                    ] : null,
                ];
            });

        // Get panic alerts for assigned children only
        $panicAlerts = $this->panicAlertService->getPanicAlertsForUser($user);
        $unviewedPanicAlerts = $this->panicAlertService->getUnviewedAlertsCount($user);

        return Inertia::render('dashboard/therapist', [
            'stats' => $stats,
            'upcomingAppointments' => $upcomingAppointments,
            'recentMessages' => $recentMessages,
            'panicAlerts' => $panicAlerts->take(5), // Show latest 5 alerts
            'unviewedPanicAlerts' => $unviewedPanicAlerts,
        ]);
    }

    /**
     * Guardian dashboard with children overview.
     */
    private function guardianDashboard()
    {
        $user = auth()->user();

        $children = $user->children()->where('status', 'active')->get();

        $stats = [
            'total_children' => $user->children()->count(),
            'active_children' => $children->count(),
            'pending_children' => $user->children()->where('status', 'pending')->count(),
            'upcoming_appointments' => Appointment::forGuardian($user->id)->upcoming()->count(),
            'unread_messages' => Message::unreadFor($user->id)->count(),
        ];

        $upcomingAppointments = Appointment::forGuardian($user->id)
            ->upcoming()
            ->with(['child', 'therapist'])
            ->orderBy('scheduled_at', 'asc')
            ->limit(3)
            ->get();

        // Get recent mood data for children
        $childrenMoodData = [];
        foreach ($children as $child) {
            $recentMoods = MoodLog::where('user_id', $child->id)
                ->where('mood_date', '>=', Carbon::today()->subDays(7))
                ->orderBy('mood_date', 'desc')
                ->get();

            $childrenMoodData[] = [
                'child' => $child,
                'recent_moods' => $recentMoods,
                'mood_streak' => $this->calculateMoodStreak($child->id),
            ];
        }

        // Get panic alerts for guardian's children
        $panicAlerts = $this->panicAlertService->getPanicAlertsForUser($user);
        $unviewedPanicAlerts = $this->panicAlertService->getUnviewedAlertsCount($user);

        return Inertia::render('dashboard/guardian', [
            'stats' => $stats,
            'children' => $children,
            'upcomingAppointments' => $upcomingAppointments,
            'childrenMoodData' => $childrenMoodData,
            'panicAlerts' => $panicAlerts->take(5), // Show latest 5 alerts
            'unviewedPanicAlerts' => $unviewedPanicAlerts,
        ]);
    }

    /**
     * Child dashboard with mood tracking and activities.
     */
    private function childDashboard()
    {
        $user = auth()->user();

        $todayMood = MoodLog::where('user_id', $user->id)
            ->where('mood_date', Carbon::today())
            ->first();

        $recentMoods = MoodLog::where('user_id', $user->id)
            ->where('mood_date', '>=', Carbon::today()->subDays(6))
            ->orderBy('mood_date', 'desc')
            ->get();

        $stats = [
            'mood_streak' => $this->calculateMoodStreak($user->id),
            'total_mood_entries' => MoodLog::where('user_id', $user->id)->count(),
            'upcoming_appointments' => Appointment::forChild($user->id)->upcoming()->count(),
            'unread_messages' => Message::unreadFor($user->id)->count(),
        ];

        $upcomingAppointments = Appointment::forChild($user->id)
            ->upcoming()
            ->with(['therapist'])
            ->orderBy('scheduled_at', 'asc')
            ->limit(3)
            ->get();

        // Get child's own panic alerts to show status (with error handling)
        try {
            $panicAlerts = $this->panicAlertService->getPanicAlertsForUser($user);
        } catch (\Exception $e) {
            Log::error('Error getting panic alerts for child dashboard', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
            $panicAlerts = collect(); // Empty collection as fallback
        }

        return Inertia::render('dashboard/child', [
            'stats' => $stats,
            'todayMood' => $todayMood,
            'recentMoods' => $recentMoods,
            'upcomingAppointments' => $upcomingAppointments,
            'panicAlerts' => $panicAlerts->take(3), // Show latest 3 alerts for status
        ]);
    }

    /**
     * Calculate mood logging streak for a user.
     */
    private function calculateMoodStreak($userId)
    {
        $streak = 0;
        $currentDate = Carbon::today();

        while (true) {
            $moodLog = MoodLog::where('user_id', $userId)
                ->where('mood_date', $currentDate)
                ->first();

            if ($moodLog) {
                $streak++;
                $currentDate->subDay();
            } else {
                break;
            }
        }

        return $streak;
    }
}
