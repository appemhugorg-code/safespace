<?php

namespace App\Http\Controllers\Therapist;

use App\Http\Controllers\Controller;
use App\Services\ConnectionManagementService;
use App\Services\ConnectionRequestService;
use App\Http\Traits\ConnectionErrorHandler;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;
use Exception;

class TherapistConnectionController extends Controller
{
    use ConnectionErrorHandler;

    protected ConnectionManagementService $connectionService;
    protected ConnectionRequestService $requestService;

    public function __construct(
        ConnectionManagementService $connectionService,
        ConnectionRequestService $requestService
    ) {
        $this->connectionService = $connectionService;
        $this->requestService = $requestService;
    }

    /**
     * Display the therapist's connections overview.
     */
    public function index(Request $request): Response
    {
        $therapist = $request->user();

        // Get all connections for the therapist
        $guardianConnections = $this->connectionService->getTherapistGuardianConnections($therapist->id);
        $childConnections = $this->connectionService->getTherapistChildConnections($therapist->id);
        $pendingRequests = $this->requestService->getPendingRequests($therapist->id);

        // Format guardian connections
        $formattedGuardians = $guardianConnections->map(function ($connection) {
            return [
                'id' => $connection->id,
                'client' => [
                    'id' => $connection->client->id,
                    'name' => $connection->client->name,
                    'email' => $connection->client->email,
                    'status' => $connection->client->status,
                ],
                'connection_type' => $connection->connection_type,
                'assigned_at' => $connection->assigned_at,
                'assigned_by' => $connection->assignedBy ? [
                    'id' => $connection->assignedBy->id,
                    'name' => $connection->assignedBy->name,
                ] : null,
                'children_count' => $this->getGuardianChildrenCount($connection->client->id),
            ];
        });

        // Format child connections
        $formattedChildren = $childConnections->map(function ($connection) {
            return [
                'id' => $connection->id,
                'client' => [
                    'id' => $connection->client->id,
                    'name' => $connection->client->name,
                    'email' => $connection->client->email,
                    'status' => $connection->client->status,
                    'age' => $connection->client->date_of_birth ? 
                        $connection->client->date_of_birth->age : null,
                ],
                'guardian' => $connection->client->guardian ? [
                    'id' => $connection->client->guardian->id,
                    'name' => $connection->client->guardian->name,
                    'email' => $connection->client->guardian->email,
                ] : null,
                'connection_type' => $connection->connection_type,
                'assigned_at' => $connection->assigned_at,
                'assigned_by' => $connection->assignedBy ? [
                    'id' => $connection->assignedBy->id,
                    'name' => $connection->assignedBy->name,
                ] : null,
                'recent_mood_entries' => $this->getRecentMoodEntries($connection->client->id),
            ];
        });

        // Format pending requests
        $formattedRequests = $pendingRequests->map(function ($request) {
            return [
                'id' => $request->id,
                'requester' => [
                    'id' => $request->requester->id,
                    'name' => $request->requester->name,
                    'email' => $request->requester->email,
                ],
                'target_client' => $request->targetClient ? [
                    'id' => $request->targetClient->id,
                    'name' => $request->targetClient->name,
                    'age' => $request->targetClient->date_of_birth ? 
                        $request->targetClient->date_of_birth->age : null,
                ] : null,
                'request_type' => $request->request_type,
                'message' => $request->message,
                'created_at' => $request->created_at,
            ];
        });

        // Calculate statistics
        $stats = [
            'total_guardians' => $guardianConnections->count(),
            'total_children' => $childConnections->count(),
            'pending_requests' => $pendingRequests->count(),
            'total_connections' => $guardianConnections->count() + $childConnections->count(),
            'admin_assigned' => $guardianConnections->where('connection_type', 'admin_assigned')->count() + 
                              $childConnections->where('connection_type', 'admin_assigned')->count(),
            'guardian_requested' => $guardianConnections->where('connection_type', 'guardian_requested')->count() + 
                                   $childConnections->where('connection_type', 'guardian_child_assignment')->count(),
        ];

        return Inertia::render('therapist/connections/index', [
            'guardians' => $formattedGuardians,
            'children' => $formattedChildren,
            'pending_requests' => $formattedRequests,
            'stats' => $stats,
        ]);
    }

    /**
     * Display connected guardians.
     */
    public function guardians(Request $request): Response
    {
        $therapist = $request->user();
        $guardianConnections = $this->connectionService->getTherapistGuardianConnections($therapist->id);

        $formattedGuardians = $guardianConnections->map(function ($connection) {
            $guardian = $connection->client;
            
            // Get children connected to this therapist through this guardian
            $connectedChildren = $this->connectionService->getTherapistChildConnections($therapist->id)
                ->filter(function ($childConnection) use ($guardian) {
                    return $childConnection->client->guardian_id === $guardian->id;
                });

            return [
                'id' => $connection->id,
                'guardian' => [
                    'id' => $guardian->id,
                    'name' => $guardian->name,
                    'email' => $guardian->email,
                    'status' => $guardian->status,
                    'phone' => $guardian->phone ?? null,
                ],
                'connection_type' => $connection->connection_type,
                'assigned_at' => $connection->assigned_at,
                'assigned_by' => $connection->assignedBy ? [
                    'id' => $connection->assignedBy->id,
                    'name' => $connection->assignedBy->name,
                ] : null,
                'children' => $connectedChildren->map(function ($childConnection) {
                    return [
                        'id' => $childConnection->client->id,
                        'name' => $childConnection->client->name,
                        'age' => $childConnection->client->date_of_birth ? 
                            $childConnection->client->date_of_birth->age : null,
                        'connection_id' => $childConnection->id,
                        'assigned_at' => $childConnection->assigned_at,
                    ];
                }),
                'total_children' => $this->getGuardianChildrenCount($guardian->id),
                'recent_activity' => $this->getGuardianRecentActivity($guardian->id),
            ];
        });

        return Inertia::render('therapist/connections/guardians', [
            'guardians' => $formattedGuardians,
            'stats' => [
                'total_guardians' => $guardianConnections->count(),
                'total_connected_children' => $this->connectionService->getTherapistChildConnections($therapist->id)->count(),
            ],
        ]);
    }

    /**
     * Display connected children.
     */
    public function children(Request $request): Response
    {
        $therapist = $request->user();
        $childConnections = $this->connectionService->getTherapistChildConnections($therapist->id);

        $formattedChildren = $childConnections->map(function ($connection) {
            $child = $connection->client;
            
            return [
                'id' => $connection->id,
                'child' => [
                    'id' => $child->id,
                    'name' => $child->name,
                    'email' => $child->email,
                    'status' => $child->status,
                    'age' => $child->date_of_birth ? $child->date_of_birth->age : null,
                    'date_of_birth' => $child->date_of_birth,
                ],
                'guardian' => $child->guardian ? [
                    'id' => $child->guardian->id,
                    'name' => $child->guardian->name,
                    'email' => $child->guardian->email,
                    'phone' => $child->guardian->phone ?? null,
                ] : null,
                'connection_type' => $connection->connection_type,
                'assigned_at' => $connection->assigned_at,
                'assigned_by' => $connection->assignedBy ? [
                    'id' => $connection->assignedBy->id,
                    'name' => $connection->assignedBy->name,
                ] : null,
                'mood_data' => $this->getChildMoodData($child->id),
                'recent_appointments' => $this->getRecentAppointments($child->id, $therapist->id),
            ];
        });

        return Inertia::render('therapist/connections/children', [
            'children' => $formattedChildren,
            'stats' => [
                'total_children' => $childConnections->count(),
                'active_children' => $childConnections->filter(function ($connection) {
                    return $connection->client->status === 'active';
                })->count(),
            ],
        ]);
    }

    /**
     * Display pending connection requests.
     */
    public function pendingRequests(Request $request): Response
    {
        $therapist = $request->user();
        $pendingRequests = $this->requestService->getPendingRequests($therapist->id);

        $formattedRequests = $pendingRequests->map(function ($request) {
            return [
                'id' => $request->id,
                'requester' => [
                    'id' => $request->requester->id,
                    'name' => $request->requester->name,
                    'email' => $request->requester->email,
                    'phone' => $request->requester->phone ?? null,
                ],
                'target_client' => $request->targetClient ? [
                    'id' => $request->targetClient->id,
                    'name' => $request->targetClient->name,
                    'age' => $request->targetClient->date_of_birth ? 
                        $request->targetClient->date_of_birth->age : null,
                ] : null,
                'request_type' => $request->request_type,
                'message' => $request->message,
                'created_at' => $request->created_at,
                'is_guardian_to_therapist' => $request->isGuardianToTherapistRequest(),
                'is_child_assignment' => $request->isGuardianChildAssignmentRequest(),
            ];
        });

        return Inertia::render('therapist/connections/pending-requests', [
            'requests' => $formattedRequests,
            'stats' => [
                'total_pending' => $pendingRequests->count(),
                'guardian_requests' => $pendingRequests->where('request_type', 'guardian_to_therapist')->count(),
                'child_assignments' => $pendingRequests->where('request_type', 'guardian_child_assignment')->count(),
            ],
        ]);
    }

    /**
     * Approve a connection request.
     */
    public function approveRequest(Request $request, int $requestId): JsonResponse
    {
        try {
            $therapist = $request->user();
            
            // Validate request exists and belongs to this therapist
            $connectionRequest = \App\Models\ConnectionRequest::find($requestId);
            $permissionCheck = $this->validateRequestPermission($connectionRequest, $therapist->id, 'approve');
            
            if ($permissionCheck !== true) {
                return $permissionCheck;
            }

            $success = $this->requestService->processRequest($requestId, 'approve', $therapist->id);

            if ($success) {
                // Get the newly created connection
                $connection = \App\Models\TherapistClientConnection::where('therapist_id', $therapist->id)
                    ->where('client_id', $connectionRequest->requester_id)
                    ->latest()
                    ->first();

                return $this->successResponse(
                    'Connection request approved successfully.',
                    [
                        'connection' => [
                            'id' => $connection->id,
                            'therapist_id' => $connection->therapist_id,
                            'client_id' => $connection->client_id,
                            'status' => $connection->status,
                            'connection_type' => $connection->connection_type,
                            'assigned_at' => $connection->assigned_at,
                        ]
                    ]
                );
            }

            return $this->errorResponse(
                'APPROVAL_FAILED',
                'Failed to approve connection request.',
                [],
                500
            );
        } catch (Exception $e) {
            return $this->handleConnectionError($e, 'Failed to approve connection request.');
        }
    }

    /**
     * Decline a connection request.
     */
    public function declineRequest(Request $request, int $requestId): JsonResponse
    {
        try {
            $therapist = $request->user();
            
            // Validate request exists and belongs to this therapist
            $connectionRequest = \App\Models\ConnectionRequest::find($requestId);
            $permissionCheck = $this->validateRequestPermission($connectionRequest, $therapist->id, 'decline');
            
            if ($permissionCheck !== true) {
                return $permissionCheck;
            }

            $success = $this->requestService->processRequest($requestId, 'decline', $therapist->id);

            if ($success) {
                return $this->successResponse('Connection request declined successfully.');
            }

            return $this->errorResponse(
                'DECLINE_FAILED',
                'Failed to decline connection request.',
                [],
                500
            );
        } catch (Exception $e) {
            return $this->handleConnectionError($e, 'Failed to decline connection request.');
        }
    }

    /**
     * Get detailed information about a specific connection.
     */
    public function show(Request $request, int $connectionId): Response
    {
        $therapist = $request->user();
        
        try {
            $connectionHistory = $this->connectionService->getConnectionHistory($connectionId);
            $connection = $connectionHistory->first();

            // Verify this therapist owns this connection
            if ($connection->therapist_id !== $therapist->id) {
                abort(403, 'You do not have access to this connection.');
            }

            $client = $connection->client;
            $formattedConnection = [
                'id' => $connection->id,
                'client' => [
                    'id' => $client->id,
                    'name' => $client->name,
                    'email' => $client->email,
                    'status' => $client->status,
                    'client_type' => $connection->client_type,
                ],
                'connection_type' => $connection->connection_type,
                'status' => $connection->status,
                'assigned_at' => $connection->assigned_at,
                'terminated_at' => $connection->terminated_at,
                'assigned_by' => $connection->assignedBy ? [
                    'id' => $connection->assignedBy->id,
                    'name' => $connection->assignedBy->name,
                ] : null,
                'duration_days' => $connection->getDurationInDays(),
            ];

            // Add client-specific data
            if ($connection->isChildConnection()) {
                $formattedConnection['child_data'] = [
                    'age' => $client->date_of_birth ? $client->date_of_birth->age : null,
                    'guardian' => $client->guardian ? [
                        'id' => $client->guardian->id,
                        'name' => $client->guardian->name,
                        'email' => $client->guardian->email,
                    ] : null,
                    'mood_data' => $this->getChildMoodData($client->id),
                    'appointments' => $this->getRecentAppointments($client->id, $therapist->id),
                ];
            } else {
                $formattedConnection['guardian_data'] = [
                    'phone' => $client->phone ?? null,
                    'children_count' => $this->getGuardianChildrenCount($client->id),
                    'recent_activity' => $this->getGuardianRecentActivity($client->id),
                ];
            }

            return Inertia::render('therapist/connections/show', [
                'connection' => $formattedConnection,
            ]);

        } catch (\Exception $e) {
            abort(404, 'Connection not found.');
        }
    }

    /**
     * Get the count of children for a guardian.
     */
    private function getGuardianChildrenCount(int $guardianId): int
    {
        return \App\Models\User::where('guardian_id', $guardianId)
            ->where('status', 'active')
            ->count();
    }

    /**
     * Get recent mood entries for a child.
     */
    private function getRecentMoodEntries(int $childId): array
    {
        $moods = \App\Models\MoodLog::where('user_id', $childId)
            ->latest('mood_date')
            ->limit(5)
            ->get();

        return $moods->map(function ($mood) {
            return [
                'mood' => $mood->mood,
                'mood_date' => $mood->mood_date,
                'notes' => $mood->notes,
            ];
        })->toArray();
    }

    /**
     * Get comprehensive mood data for a child.
     */
    private function getChildMoodData(int $childId): array
    {
        $moods = \App\Models\MoodLog::where('user_id', $childId)
            ->latest('mood_date')
            ->limit(30)
            ->get();

        return [
            'recent_entries' => $moods->take(7)->map(function ($mood) {
                return [
                    'mood' => $mood->mood,
                    'mood_date' => $mood->mood_date,
                    'notes' => $mood->notes,
                ];
            }),
            'total_entries' => $moods->count(),
            'streak' => $this->calculateMoodStreak($childId),
            'trend' => $this->calculateMoodTrend($moods),
        ];
    }

    /**
     * Get recent appointments for a child with this therapist.
     */
    private function getRecentAppointments(int $childId, int $therapistId): array
    {
        $appointments = \App\Models\Appointment::where('child_id', $childId)
            ->where('therapist_id', $therapistId)
            ->latest('scheduled_at')
            ->limit(5)
            ->get();

        return $appointments->map(function ($appointment) {
            return [
                'id' => $appointment->id,
                'scheduled_at' => $appointment->scheduled_at,
                'duration_minutes' => $appointment->duration_minutes,
                'status' => $appointment->status,
                'notes' => $appointment->notes,
            ];
        })->toArray();
    }

    /**
     * Get recent activity for a guardian.
     */
    private function getGuardianRecentActivity(int $guardianId): array
    {
        // This could include recent messages, appointments, etc.
        // For now, return basic activity data
        return [
            'last_login' => null, // Would need to track this
            'recent_messages' => 0, // Would query message system
            'recent_appointments' => 0, // Would query appointment system
        ];
    }

    /**
     * Calculate mood streak for a child.
     */
    private function calculateMoodStreak(int $childId): int
    {
        $moods = \App\Models\MoodLog::where('user_id', $childId)
            ->orderBy('mood_date', 'desc')
            ->get();

        if ($moods->isEmpty()) {
            return 0;
        }

        $streak = 0;
        $currentDate = now()->startOfDay();

        foreach ($moods as $mood) {
            $moodDate = $mood->mood_date->startOfDay();
            
            if ($moodDate->eq($currentDate)) {
                $streak++;
                $currentDate = $currentDate->subDay();
            } else {
                break;
            }
        }

        return $streak;
    }

    /**
     * Calculate mood trend from recent moods.
     */
    private function calculateMoodTrend($moods): string
    {
        if ($moods->count() < 2) {
            return 'stable';
        }

        $moodValues = [
            'very_sad' => 1,
            'sad' => 2,
            'neutral' => 3,
            'happy' => 4,
            'very_happy' => 5,
        ];

        $recent = $moods->take(3)->avg(function ($mood) use ($moodValues) {
            return $moodValues[$mood->mood] ?? 3;
        });

        $older = $moods->skip(3)->take(3)->avg(function ($mood) use ($moodValues) {
            return $moodValues[$mood->mood] ?? 3;
        });

        if ($recent > $older + 0.5) {
            return 'improving';
        } elseif ($recent < $older - 0.5) {
            return 'declining';
        }

        return 'stable';
    }
}