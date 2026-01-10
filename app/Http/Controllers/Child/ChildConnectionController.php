<?php

namespace App\Http\Controllers\Child;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ConnectionManagementService;
use App\Http\Traits\ConnectionErrorHandler;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;
use Exception;

class ChildConnectionController extends Controller
{
    use ConnectionErrorHandler;

    protected ConnectionManagementService $connectionService;

    public function __construct(ConnectionManagementService $connectionService)
    {
        $this->connectionService = $connectionService;
    }

    /**
     * Display connected therapists for the child.
     * Requirements: 5.1, 5.2
     */
    public function index(Request $request): Response
    {
        $child = $request->user();

        // Get connected therapists for this child
        $connections = $this->connectionService->getClientConnections($child->id);

        // Format connections with child-friendly information
        $formattedConnections = $connections->map(function ($connection) use ($child) {
            return [
                'id' => $connection->id,
                'therapist' => [
                    'id' => $connection->therapist->id,
                    'name' => $connection->therapist->name,
                    'friendly_name' => $this->getChildFriendlyName($connection->therapist),
                    'description' => $this->getChildFriendlyDescription($connection->therapist),
                    'status' => $connection->therapist->status,
                ],
                'connection_type' => $connection->connection_type,
                'assigned_at' => $connection->assigned_at,
                'is_available' => $this->isTherapistAvailable($connection->therapist->id),
                'can_chat' => true, // Children can chat with connected therapists
                'can_schedule' => true, // Children can schedule appointments
                'last_interaction' => $this->getLastInteraction($child->id, $connection->therapist->id),
            ];
        });

        // Get guardian information for context
        $guardian = $child->guardian;
        $guardianInfo = $guardian ? [
            'id' => $guardian->id,
            'name' => $guardian->name,
            'has_same_therapists' => $this->hasSharedTherapists($child->id, $guardian->id),
        ] : null;

        // Calculate child-friendly statistics
        $stats = [
            'total_therapists' => $connections->count(),
            'available_now' => $connections->filter(function ($connection) {
                return $this->isTherapistAvailable($connection->therapist->id);
            })->count(),
            'recent_chats' => $this->getRecentChatCount($child->id),
            'upcoming_appointments' => $this->getUpcomingAppointmentCount($child->id),
        ];

        return Inertia::render('child/connections/index', [
            'therapists' => $formattedConnections,
            'guardian' => $guardianInfo,
            'stats' => $stats,
            'encouragement_message' => $this->getEncouragementMessage($connections->count()),
        ]);
    }

    /**
     * Display detailed information about a specific therapist connection.
     * Requirements: 5.2
     */
    public function show(Request $request, \App\Models\TherapistClientConnection $connection): Response
    {
        $child = $request->user();
        
        // Verify this child owns this connection
        if ($connection->client_id !== $child->id) {
            abort(403, 'You do not have access to this connection.');
        }

        $therapist = $connection->therapist;
        $formattedConnection = [
            'id' => $connection->id,
            'therapist' => [
                'id' => $therapist->id,
                'name' => $therapist->name,
                'friendly_name' => $this->getChildFriendlyName($therapist),
                'description' => $this->getChildFriendlyDescription($therapist),
                'status' => $therapist->status,
            ],
            'connection_type' => $connection->connection_type,
            'assigned_at' => $connection->assigned_at,
            'duration_days' => $connection->getDurationInDays(),
            'is_available' => $this->isTherapistAvailable($therapist->id),
            'availability_schedule' => $this->getChildFriendlySchedule($therapist->id),
            'recent_activities' => $this->getRecentActivities($child->id, $therapist->id),
            'mood_sharing_enabled' => true, // Children's mood data is shared with connected therapists
        ];

        // Get communication options
        $communicationOptions = [
            'can_send_message' => true,
            'can_schedule_appointment' => true,
            'can_view_mood_together' => true,
            'emergency_contact' => $this->isEmergencyContact($therapist->id),
        ];

        return Inertia::render('child/connections/show', [
            'connection' => $formattedConnection,
            'communication_options' => $communicationOptions,
            'helpful_tips' => $this->getHelpfulTips(),
        ]);
    }

    /**
     * Get available communication features for a child with a therapist.
     * Requirements: 5.5
     */
    public function communicationFeatures(Request $request, int $therapistId): JsonResponse
    {
        try {
            $child = $request->user();

            // Validate therapist exists and has correct role
            $therapist = User::find($therapistId);
            if (!$therapist || !$therapist->hasRole('therapist')) {
                return $this->errorResponse(
                    'INVALID_USER_ROLE',
                    'Selected user is not a therapist.',
                    ['therapist_id' => $therapistId]
                );
            }

            // Verify active connection exists
            if (!$this->connectionService->hasActiveConnection($child->id, $therapistId)) {
                return $this->handleAuthorizationError('You are not connected to this therapist.');
            }

            $features = [
                'messaging' => [
                    'available' => true,
                    'description' => 'Send messages to your therapist',
                    'icon' => 'message-circle',
                    'action_url' => route('messages.conversation', $therapist),
                    'child_friendly_text' => 'Chat with ' . $this->getChildFriendlyName($therapist),
                ],
                'appointments' => [
                    'available' => true,
                    'description' => 'Schedule time to talk with your therapist',
                    'icon' => 'calendar',
                    'action_url' => route('appointments.create') . '?therapist=' . $therapistId,
                    'child_friendly_text' => 'Schedule time to talk',
                ],
                'mood_sharing' => [
                    'available' => true,
                    'description' => 'Your therapist can see your mood entries to help you',
                    'icon' => 'heart',
                    'action_url' => route('mood.index'),
                    'child_friendly_text' => 'Share how you feel',
                ],
                'games' => [
                    'available' => true,
                    'description' => 'Play therapeutic games together',
                    'icon' => 'gamepad-2',
                    'action_url' => route('games.index'),
                    'child_friendly_text' => 'Play helpful games',
                ],
            ];

            return $this->successResponse(
                'Communication features retrieved successfully.',
                [
                    'features' => $features,
                    'therapist' => [
                        'id' => $therapist->id,
                        'name' => $therapist->name,
                        'friendly_name' => $this->getChildFriendlyName($therapist),
                    ],
                ]
            );
        } catch (Exception $e) {
            return $this->handleConnectionError($e, 'Failed to retrieve communication features.');
        }
    }

    /**
     * Start a conversation with a connected therapist.
     * Requirements: 5.5
     */
    public function startConversation(Request $request, int $therapistId)
    {
        $child = $request->user();

        // Verify active connection exists
        if (!$this->connectionService->hasActiveConnection($child->id, $therapistId)) {
            abort(403, 'You are not connected to this therapist.');
        }

        $therapist = User::findOrFail($therapistId);

        // Redirect to the conversation page
        return redirect()->route('messages.conversation', $therapist);
    }

    /**
     * Create an appointment with a connected therapist.
     * Requirements: 5.5
     */
    public function createAppointment(Request $request, int $therapistId)
    {
        $child = $request->user();

        // Verify active connection exists
        if (!$this->connectionService->hasActiveConnection($child->id, $therapistId)) {
            abort(403, 'You are not connected to this therapist.');
        }

        // Redirect to appointment creation with pre-filled therapist
        return redirect()->route('appointments.create', [
            'therapist' => $therapistId,
            'child' => $child->id,
        ]);
    }

    /**
     * Get child-friendly name for therapist.
     */
    private function getChildFriendlyName($therapist): string
    {
        // Use first name or preferred name for children
        $nameParts = explode(' ', $therapist->name);
        return $nameParts[0] ?? $therapist->name;
    }

    /**
     * Get child-friendly description for therapist.
     */
    private function getChildFriendlyDescription($therapist): string
    {
        // This would come from therapist profile in the future
        // For now, return age-appropriate descriptions
        $descriptions = [
            'A caring helper who listens to you',
            'Someone who helps kids feel better',
            'A friend who helps you with your feelings',
            'Someone who cares about how you feel',
        ];

        // Use therapist ID to consistently assign same description
        return $descriptions[$therapist->id % count($descriptions)];
    }

    /**
     * Check if therapist is currently available.
     */
    private function isTherapistAvailable(int $therapistId): bool
    {
        $now = now();
        $dayOfWeek = $now->dayOfWeek;
        $currentTime = $now->format('H:i:s');

        return \App\Models\TherapistAvailability::where('therapist_id', $therapistId)
            ->where('day_of_week', $dayOfWeek)
            ->where('start_time', '<=', $currentTime)
            ->where('end_time', '>=', $currentTime)
            ->where('is_active', true)
            ->exists();
    }

    /**
     * Get last interaction between child and therapist.
     */
    private function getLastInteraction(int $childId, int $therapistId): ?array
    {
        // Check for recent messages
        $lastMessage = \App\Models\Message::where(function ($query) use ($childId, $therapistId) {
            $query->where('sender_id', $childId)->where('recipient_id', $therapistId);
        })->orWhere(function ($query) use ($childId, $therapistId) {
            $query->where('sender_id', $therapistId)->where('recipient_id', $childId);
        })->latest()->first();

        // Check for recent appointments
        $lastAppointment = \App\Models\Appointment::where('child_id', $childId)
            ->where('therapist_id', $therapistId)
            ->latest('scheduled_at')
            ->first();

        $interactions = collect([$lastMessage, $lastAppointment])->filter();

        if ($interactions->isEmpty()) {
            return null;
        }

        $latest = $interactions->sortByDesc('created_at')->first();

        if ($latest instanceof \App\Models\Message) {
            return [
                'type' => 'message',
                'date' => $latest->created_at,
                'description' => 'Last message',
            ];
        } else {
            return [
                'type' => 'appointment',
                'date' => $latest->scheduled_at,
                'description' => 'Last appointment',
            ];
        }
    }

    /**
     * Check if child and guardian share therapists.
     */
    private function hasSharedTherapists(int $childId, int $guardianId): bool
    {
        $childTherapists = $this->connectionService->getClientConnections($childId)
            ->pluck('therapist_id');
        $guardianTherapists = $this->connectionService->getClientConnections($guardianId)
            ->pluck('therapist_id');

        return $childTherapists->intersect($guardianTherapists)->isNotEmpty();
    }

    /**
     * Get recent chat count for child.
     */
    private function getRecentChatCount(int $childId): int
    {
        return \App\Models\Message::where('sender_id', $childId)
            ->where('created_at', '>=', now()->subDays(7))
            ->count();
    }

    /**
     * Get upcoming appointment count for child.
     */
    private function getUpcomingAppointmentCount(int $childId): int
    {
        return \App\Models\Appointment::where('child_id', $childId)
            ->where('scheduled_at', '>', now())
            ->where('status', 'scheduled')
            ->count();
    }

    /**
     * Get encouragement message based on connection count.
     */
    private function getEncouragementMessage(int $connectionCount): string
    {
        if ($connectionCount === 0) {
            return "Your guardian is working on finding a therapist to help you. They care about you!";
        } elseif ($connectionCount === 1) {
            return "You have a therapist who cares about you and wants to help!";
        } else {
            return "You have therapists who care about you and are here to help!";
        }
    }

    /**
     * Get child-friendly schedule information.
     */
    private function getChildFriendlySchedule(int $therapistId): array
    {
        $availability = \App\Models\TherapistAvailability::where('therapist_id', $therapistId)
            ->where('is_active', true)
            ->orderBy('day_of_week')
            ->get();

        $friendlyDays = [
            0 => 'Sunday',
            1 => 'Monday', 
            2 => 'Tuesday',
            3 => 'Wednesday',
            4 => 'Thursday',
            5 => 'Friday',
            6 => 'Saturday',
        ];

        return $availability->map(function ($slot) use ($friendlyDays) {
            return [
                'day' => $friendlyDays[$slot->day_of_week],
                'time' => $this->formatChildFriendlyTime($slot->start_time, $slot->end_time),
                'is_today' => $slot->day_of_week === now()->dayOfWeek,
            ];
        })->toArray();
    }

    /**
     * Format time in child-friendly way.
     */
    private function formatChildFriendlyTime(string $startTime, string $endTime): string
    {
        $start = \Carbon\Carbon::createFromFormat('H:i:s', $startTime);
        $end = \Carbon\Carbon::createFromFormat('H:i:s', $endTime);

        return $start->format('g:i A') . ' - ' . $end->format('g:i A');
    }

    /**
     * Get recent activities between child and therapist.
     */
    private function getRecentActivities(int $childId, int $therapistId): array
    {
        $activities = [];

        // Recent messages
        $messages = \App\Models\Message::where(function ($query) use ($childId, $therapistId) {
            $query->where('sender_id', $childId)->where('recipient_id', $therapistId);
        })->orWhere(function ($query) use ($childId, $therapistId) {
            $query->where('sender_id', $therapistId)->where('recipient_id', $childId);
        })->latest()->limit(3)->get();

        foreach ($messages as $message) {
            $activities[] = [
                'type' => 'message',
                'description' => $message->sender_id === $childId ? 'You sent a message' : 'Your therapist sent a message',
                'date' => $message->created_at,
                'icon' => 'message-circle',
            ];
        }

        // Recent appointments
        $appointments = \App\Models\Appointment::where('child_id', $childId)
            ->where('therapist_id', $therapistId)
            ->latest('scheduled_at')
            ->limit(3)
            ->get();

        foreach ($appointments as $appointment) {
            $activities[] = [
                'type' => 'appointment',
                'description' => $appointment->scheduled_at > now() ? 'Upcoming appointment' : 'Past appointment',
                'date' => $appointment->scheduled_at,
                'icon' => 'calendar',
            ];
        }

        // Sort by date and return most recent
        return collect($activities)
            ->sortByDesc('date')
            ->take(5)
            ->values()
            ->toArray();
    }

    /**
     * Check if therapist is emergency contact.
     */
    private function isEmergencyContact(int $therapistId): bool
    {
        // This would be configurable in the future
        // For now, all connected therapists can be emergency contacts
        return true;
    }

    /**
     * Get helpful tips for children.
     */
    private function getHelpfulTips(): array
    {
        return [
            'You can talk to your therapist about anything that worries you',
            'Your therapist is here to help you feel better',
            'It\'s okay to share your feelings - your therapist wants to understand',
            'You can ask your therapist questions anytime',
            'Your therapist cares about you and wants to help you grow',
        ];
    }
}