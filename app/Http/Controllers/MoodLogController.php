<?php

namespace App\Http\Controllers;

use App\Models\MoodLog;
use App\Services\ConnectionManagementService;
use App\Services\ConnectionPermissionService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MoodLogController extends Controller
{
    protected ConnectionManagementService $connectionService;
    protected ?ConnectionPermissionService $permissionService;

    public function __construct(
        ConnectionManagementService $connectionService,
        ?ConnectionPermissionService $permissionService = null
    ) {
        $this->connectionService = $connectionService;
        $this->permissionService = $permissionService ?? app(ConnectionPermissionService::class);
    }
    /**
     * Display mood tracking interface for children.
     */
    public function index()
    {
        $user = auth()->user();

        // Get today's mood log if it exists
        $todayMood = MoodLog::where('user_id', $user->id)
            ->where('mood_date', Carbon::today())
            ->first();

        // Get recent mood logs (last 7 days)
        $recentMoods = MoodLog::where('user_id', $user->id)
            ->where('mood_date', '>=', Carbon::today()->subDays(6))
            ->orderBy('mood_date', 'desc')
            ->get();

        return Inertia::render('mood/index', [
            'todayMood' => $todayMood,
            'recentMoods' => $recentMoods,
        ]);
    }

    /**
     * Store a new mood log entry.
     */
    public function store(Request $request)
    {
        $request->validate([
            'mood' => 'required|in:very_sad,sad,neutral,happy,very_happy',
            'notes' => 'nullable|string|max:500',
            'mood_date' => 'nullable|date',
        ]);

        $user = auth()->user();
        $moodDate = $request->mood_date ? Carbon::parse($request->mood_date) : Carbon::today();

        // Update or create mood log for the date
        $moodLog = MoodLog::updateOrCreate(
            [
                'user_id' => $user->id,
                'mood_date' => $moodDate,
            ],
            [
                'mood' => $request->mood,
                'notes' => $request->notes,
            ]
        );

        return back()->with('success', 'Mood logged successfully!');
    }

    /**
     * Display mood history for the user.
     */
    public function history(Request $request)
    {
        $user = auth()->user();

        // Get date range from request or default to last 30 days
        $startDate = $request->start_date ? Carbon::parse($request->start_date) : Carbon::today()->subDays(29);
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : Carbon::today();

        $moodLogs = MoodLog::where('user_id', $user->id)
            ->dateRange($startDate, $endDate)
            ->orderBy('mood_date', 'desc')
            ->get();

        // Calculate mood statistics
        $moodStats = [
            'total_entries' => $moodLogs->count(),
            'mood_distribution' => $moodLogs->groupBy('mood')->map->count(),
            'average_mood' => $this->calculateAverageMood($moodLogs),
            'streak' => $this->calculateMoodStreak($user->id),
        ];

        return Inertia::render('mood/history', [
            'moodLogs' => $moodLogs,
            'moodStats' => $moodStats,
            'startDate' => $startDate->format('Y-m-d'),
            'endDate' => $endDate->format('Y-m-d'),
        ]);
    }

    /**
     * Get mood data for guardians/therapists to view child's progress.
     */
    public function childMoodData(Request $request, $childId)
    {
        $user = auth()->user();
        $child = User::findOrFail($childId);

        // Use permission service to check access
        if (!$this->permissionService->canViewMoodData($user, $child)) {
            abort(403, 'You do not have permission to view this child\'s mood data');
        }

        $startDate = $request->start_date ? Carbon::parse($request->start_date) : Carbon::today()->subDays(29);
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : Carbon::today();

        // Use permission service to get accessible mood data
        $moodLogs = $this->permissionService->getAccessibleMoodData($user, $child, $startDate, $endDate);

        $moodStats = [
            'total_entries' => $moodLogs->count(),
            'mood_distribution' => $moodLogs->groupBy('mood')->map->count(),
            'average_mood' => $this->calculateAverageMood($moodLogs),
            'streak' => $this->calculateMoodStreak($child->id),
        ];

        return Inertia::render('mood/child-mood-data', [
            'child' => $child,
            'moodLogs' => $moodLogs,
            'moodStats' => $moodStats,
            'startDate' => $startDate->format('Y-m-d'),
            'endDate' => $endDate->format('Y-m-d'),
        ]);
    }

    /**
     * Get detailed mood data for a specific child (therapist access).
     */
    public function therapistChildMoodData(Request $request, $childId)
    {
        $user = auth()->user();

        // Ensure user is a therapist
        if (!$user->hasRole('therapist')) {
            abort(403, 'Access denied. Therapist role required.');
        }

        // Find the child and verify access using permission service
        $child = User::findOrFail($childId);
        
        if (!$this->permissionService->canViewMoodData($user, $child)) {
            abort(403, 'You do not have permission to view this child\'s mood data');
        }

        $startDate = $request->start_date ? Carbon::parse($request->start_date) : Carbon::today()->subDays(29);
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : Carbon::today();

        // Use permission service to get accessible mood data
        $moodLogs = $this->permissionService->getAccessibleMoodData($user, $child, $startDate, $endDate);

        $moodStats = [
            'total_entries' => $moodLogs->count(),
            'mood_distribution' => $moodLogs->groupBy('mood')->map->count(),
            'average_mood' => $this->calculateAverageMood($moodLogs),
            'streak' => $this->calculateMoodStreak($child->id),
        ];

        // Get connection details for context
        $connections = $this->connectionService->getClientConnections($child->id);
        $therapistConnection = $connections->where('therapist_id', $user->id)->first();

        return Inertia::render('mood/therapist-child-detail', [
            'child' => $child,
            'connection' => $therapistConnection,
            'moodLogs' => $moodLogs,
            'moodStats' => $moodStats,
            'startDate' => $startDate->format('Y-m-d'),
            'endDate' => $endDate->format('Y-m-d'),
        ]);
    }

    /**
     * Calculate average mood score.
     */
    private function calculateAverageMood($moodLogs)
    {
        if ($moodLogs->isEmpty()) {
            return null;
        }

        $moodValues = [
            'very_sad' => 1,
            'sad' => 2,
            'neutral' => 3,
            'happy' => 4,
            'very_happy' => 5,
        ];

        $totalScore = $moodLogs->sum(function ($log) use ($moodValues) {
            return $moodValues[$log->mood] ?? 3;
        });

        return round($totalScore / $moodLogs->count(), 2);
    }

    /**
     * Therapist overview of all connected children's mood data.
     */
    public function therapistOverview(Request $request)
    {
        $user = auth()->user();

        // Ensure user is a therapist
        if (!$user->hasRole('therapist')) {
            abort(403, 'Access denied. Therapist role required.');
        }

        // Get all children connected to this therapist
        $childConnections = $this->connectionService->getTherapistChildConnections($user->id);

        if ($childConnections->isEmpty()) {
            return Inertia::render('mood/therapist-overview', [
                'childrenMoodData' => [],
                'message' => 'No children are currently assigned to you. Contact an administrator to establish therapeutic relationships.',
            ]);
        }

        $startDate = $request->start_date ? Carbon::parse($request->start_date) : Carbon::today()->subDays(7);
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : Carbon::today();

        $childrenMoodData = $childConnections->map(function ($connection) use ($startDate, $endDate) {
            $child = $connection->client;
            
            $moodLogs = MoodLog::where('user_id', $child->id)
                ->dateRange($startDate, $endDate)
                ->orderBy('mood_date', 'desc')
                ->get();

            return [
                'child' => $child,
                'connection' => $connection,
                'mood_logs' => $moodLogs,
                'stats' => [
                    'total_entries' => $moodLogs->count(),
                    'mood_distribution' => $moodLogs->groupBy('mood')->map->count(),
                    'average_mood' => $this->calculateAverageMood($moodLogs),
                    'streak' => $this->calculateMoodStreak($child->id),
                    'latest_mood' => $moodLogs->first(),
                ],
            ];
        });

        return Inertia::render('mood/therapist-overview', [
            'childrenMoodData' => $childrenMoodData,
            'startDate' => $startDate->format('Y-m-d'),
            'endDate' => $endDate->format('Y-m-d'),
        ]);
    }

    /**
     * Guardian overview of all their children's mood data.
     */
    public function guardianOverview(Request $request)
    {
        $user = auth()->user();

        // Get all children for this guardian
        $children = $user->children()->get();

        if ($children->isEmpty()) {
            return Inertia::render('mood/guardian-overview', [
                'children' => [],
                'message' => 'No children found. Please add children to your account to view their mood data.',
            ]);
        }

        $startDate = $request->start_date ? Carbon::parse($request->start_date) : Carbon::today()->subDays(7);
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : Carbon::today();

        $childrenMoodData = $children->map(function ($child) use ($startDate, $endDate) {
            $moodLogs = MoodLog::where('user_id', $child->id)
                ->dateRange($startDate, $endDate)
                ->orderBy('mood_date', 'desc')
                ->get();

            return [
                'child' => $child,
                'mood_logs' => $moodLogs,
                'stats' => [
                    'total_entries' => $moodLogs->count(),
                    'mood_distribution' => $moodLogs->groupBy('mood')->map->count(),
                    'average_mood' => $this->calculateAverageMood($moodLogs),
                    'streak' => $this->calculateMoodStreak($child->id),
                    'latest_mood' => $moodLogs->first(),
                ],
            ];
        });

        return Inertia::render('mood/guardian-overview', [
            'childrenMoodData' => $childrenMoodData,
            'startDate' => $startDate->format('Y-m-d'),
            'endDate' => $endDate->format('Y-m-d'),
        ]);
    }

    /**
     * Calculate current mood logging streak.
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
