<?php

namespace App\Http\Controllers\Guardian;

use App\Http\Controllers\Controller;
use App\Services\ConnectionManagementService;
use App\Services\ConnectionRequestService;
use App\Services\ConnectionSearchService;
use App\Models\User;
use App\Models\ConnectionRequest;
use App\Http\Requests\CreateConnectionRequestRequest;
use App\Http\Requests\CreateChildAssignmentRequest;
use App\Http\Traits\ConnectionErrorHandler;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Exception;

class ClientConnectionController extends Controller
{
    use ConnectionErrorHandler;

    protected ConnectionManagementService $connectionService;
    protected ConnectionRequestService $requestService;
    protected ConnectionSearchService $searchService;

    public function __construct(
        ConnectionManagementService $connectionService,
        ConnectionRequestService $requestService,
        ConnectionSearchService $searchService
    ) {
        $this->connectionService = $connectionService;
        $this->requestService = $requestService;
        $this->searchService = $searchService;
    }

    /**
     * Display the guardian's connections overview.
     * Requirements: 2.1, 2.2
     */
    public function index(Request $request): Response
    {
        $guardian = $request->user();

        // Get connected therapists for this guardian
        $connections = $this->connectionService->getClientConnections($guardian->id);
        
        // Get pending requests made by this guardian
        $pendingRequests = $this->requestService->getGuardianRequests($guardian->id);

        // Format connections
        $formattedConnections = $connections->map(function ($connection) {
            return [
                'id' => $connection->id,
                'therapist' => [
                    'id' => $connection->therapist->id,
                    'name' => $connection->therapist->name,
                    'email' => $connection->therapist->email,
                    'status' => $connection->therapist->status,
                ],
                'connection_type' => $connection->connection_type,
                'assigned_at' => $connection->assigned_at,
                'assigned_by' => $connection->assignedBy ? [
                    'id' => $connection->assignedBy->id,
                    'name' => $connection->assignedBy->name,
                ] : null,
                'specialization' => $this->getTherapistSpecialization($connection->therapist),
                'availability_status' => $this->getTherapistAvailabilityStatus($connection->therapist->id),
            ];
        });

        // Format pending requests
        $formattedRequests = $pendingRequests->map(function ($request) {
            return [
                'id' => $request->id,
                'therapist' => [
                    'id' => $request->targetTherapist->id,
                    'name' => $request->targetTherapist->name,
                    'email' => $request->targetTherapist->email,
                ],
                'target_client' => $request->targetClient ? [
                    'id' => $request->targetClient->id,
                    'name' => $request->targetClient->name,
                ] : null,
                'request_type' => $request->request_type,
                'status' => $request->status,
                'message' => $request->message,
                'created_at' => $request->created_at,
                'reviewed_at' => $request->reviewed_at,
                'is_guardian_to_therapist' => $request->request_type === 'guardian_to_therapist',
                'is_child_assignment' => $request->request_type === 'guardian_child_assignment',
            ];
        });

        // Calculate statistics
        $stats = [
            'total_connections' => $connections->count(),
            'pending_requests' => $pendingRequests->where('status', 'pending')->count(),
            'approved_requests' => $pendingRequests->where('status', 'approved')->count(),
            'declined_requests' => $pendingRequests->where('status', 'declined')->count(),
            'admin_assigned' => $connections->where('connection_type', 'admin_assigned')->count(),
            'guardian_requested' => $connections->where('connection_type', 'guardian_requested')->count(),
        ];

        return Inertia::render('guardian/connections/index', [
            'connections' => $formattedConnections,
            'pending_requests' => $formattedRequests,
            'stats' => $stats,
        ]);
    }

    /**
     * Display therapist search interface with filtering.
     * Requirements: 6.1, 6.2
     */
    public function searchTherapists(Request $request): Response
    {
        $guardian = $request->user();
        
        // Get search filters from request
        $filters = $this->searchService->validateFilters($request->all());
        
        // Get available therapists (not already connected)
        $availableTherapists = $this->searchService->getAvailableTherapists($guardian->id);
        
        // Apply additional filters if provided
        if (!empty($filters)) {
            $availableTherapists = $this->searchService->searchTherapists($filters);
            
            // Remove already connected therapists
            $connectedTherapistIds = $this->connectionService->getClientConnections($guardian->id)
                ->pluck('therapist_id')
                ->toArray();
                
            $availableTherapists = $availableTherapists->reject(function ($therapist) use ($connectedTherapistIds) {
                return in_array($therapist->id, $connectedTherapistIds);
            });
        }

        // Format therapist data
        $formattedTherapists = $availableTherapists->map(function ($therapist) {
            return [
                'id' => $therapist->id,
                'name' => $therapist->name,
                'email' => $therapist->email,
                'status' => $therapist->status,
                'specialization' => $this->getTherapistSpecialization($therapist),
                'availability' => $this->getTherapistAvailability($therapist->id),
                'active_connections' => $this->getTherapistActiveConnectionsCount($therapist->id),
                'rating' => $this->getTherapistRating($therapist->id),
                'years_experience' => $this->getTherapistExperience($therapist),
            ];
        });

        // Get recommended therapists
        $recommendedTherapists = $this->searchService->getRecommendedTherapists($guardian->id, 3);
        $formattedRecommended = $recommendedTherapists->map(function ($therapist) {
            return [
                'id' => $therapist->id,
                'name' => $therapist->name,
                'specialization' => $this->getTherapistSpecialization($therapist),
                'availability_slots' => $therapist->availability->where('is_active', true)->count(),
                'recommendation_score' => $therapist->recommendation_score ?? 0,
            ];
        });

        return Inertia::render('guardian/connections/search', [
            'therapists' => $formattedTherapists,
            'recommended_therapists' => $formattedRecommended,
            'filters' => $filters,
            'search_stats' => $this->searchService->getSearchStatistics(),
        ]);
    }

    /**
     * Create a connection request to a therapist.
     * Requirements: 6.3
     */
    public function createRequest(CreateConnectionRequestRequest $request)
    {
        try {
            $guardian = $request->user();
            
            $connectionRequest = $this->requestService->createGuardianRequest(
                $guardian->id,
                $request->validated('therapist_id'),
                $request->validated('message')
            );

            $therapist = User::findOrFail($request->validated('therapist_id'));

            // Check if this is an Inertia request
            if ($request->header('X-Inertia')) {
                return redirect()->back()->with('success', 'Connection request sent successfully to ' . $therapist->name . '.');
            }

            // Return JSON for API requests
            return $this->successResponse(
                'Connection request sent successfully.',
                [
                    'request' => [
                        'id' => $connectionRequest->id,
                        'therapist' => [
                            'id' => $therapist->id,
                            'name' => $therapist->name,
                        ],
                        'status' => $connectionRequest->status,
                        'message' => $connectionRequest->message,
                        'created_at' => $connectionRequest->created_at,
                    ],
                ],
                201
            );
        } catch (Exception $e) {
            // Check if this is an Inertia request for error handling too
            if ($request->header('X-Inertia')) {
                return redirect()->back()->withErrors(['message' => 'Failed to send connection request. Please try again.']);
            }
            
            return $this->handleConnectionError($e, 'Failed to create connection request.');
        }
    }

    /**
     * Display child assignment interface.
     * Requirements: 8.1, 8.2
     */
    public function childAssignment(Request $request): Response
    {
        $guardian = $request->user();
        
        // Get guardian's children
        $children = User::where('guardian_id', $guardian->id)
            ->where('status', 'active')
            ->get();

        // Get connected therapists
        $connectedTherapists = $this->connectionService->getClientConnections($guardian->id);

        // Format children with their current therapist connections
        $formattedChildren = $children->map(function ($child) {
            $childConnections = $this->connectionService->getClientConnections($child->id);
            
            return [
                'id' => $child->id,
                'name' => $child->name,
                'email' => $child->email,
                'age' => $child->date_of_birth ? $child->date_of_birth->age : null,
                'status' => $child->status,
                'connected_therapists' => $childConnections->map(function ($connection) {
                    return [
                        'id' => $connection->therapist->id,
                        'name' => $connection->therapist->name,
                        'connection_id' => $connection->id,
                        'assigned_at' => $connection->assigned_at,
                    ];
                }),
                'pending_assignments' => $this->getPendingChildAssignments($child->id),
            ];
        });

        // Format connected therapists
        $formattedTherapists = $connectedTherapists->map(function ($connection) {
            return [
                'id' => $connection->therapist->id,
                'name' => $connection->therapist->name,
                'email' => $connection->therapist->email,
                'specialization' => $this->getTherapistSpecialization($connection->therapist),
                'connection_id' => $connection->id,
                'assigned_at' => $connection->assigned_at,
            ];
        });

        return Inertia::render('guardian/connections/child-assignment', [
            'children' => $formattedChildren,
            'connected_therapists' => $formattedTherapists,
            'stats' => [
                'total_children' => $children->count(),
                'children_with_therapists' => $children->filter(function ($child) {
                    return $this->connectionService->getClientConnections($child->id)->isNotEmpty();
                })->count(),
                'available_therapists' => $connectedTherapists->count(),
            ],
        ]);
    }

    /**
     * Create a child assignment request.
     * Requirements: 8.2
     */
    public function assignChild(CreateChildAssignmentRequest $request)
    {
        try {
            $guardian = $request->user();
            
            $assignmentRequest = $this->requestService->createChildAssignmentRequest(
                $guardian->id,
                $request->validated('child_id'),
                $request->validated('therapist_id')
            );

            $child = User::findOrFail($request->validated('child_id'));
            $therapist = User::findOrFail($request->validated('therapist_id'));

            // Check if this is an Inertia request
            if ($request->header('X-Inertia')) {
                return redirect()->back()->with('success', 'Child assignment request sent successfully.');
            }

            // Return JSON for API requests
            return $this->successResponse(
                'Child assignment request sent successfully.',
                [
                    'request' => [
                        'id' => $assignmentRequest->id,
                        'child' => [
                            'id' => $child->id,
                            'name' => $child->name,
                        ],
                        'therapist' => [
                            'id' => $therapist->id,
                            'name' => $therapist->name,
                        ],
                        'status' => $assignmentRequest->status,
                        'created_at' => $assignmentRequest->created_at,
                    ],
                ],
                201
            );
        } catch (Exception $e) {
            // Check if this is an Inertia request for error handling too
            if ($request->header('X-Inertia')) {
                return redirect()->back()->withErrors(['message' => 'Failed to create child assignment request.']);
            }
            
            return $this->handleConnectionError($e, 'Failed to create child assignment request.');
        }
    }

    /**
     * Cancel a pending connection request.
     */
    public function cancelRequest(Request $request, int $requestId)
    {
        try {
            $guardian = $request->user();
            
            // Validate request ownership
            $connectionRequest = \App\Models\ConnectionRequest::find($requestId);
            $permissionCheck = $this->validateRequestPermission($connectionRequest, $guardian->id, 'cancel');
            
            if ($permissionCheck !== true) {
                // Check if this is an Inertia request for error handling
                if ($request->header('X-Inertia')) {
                    return redirect()->back()->withErrors(['message' => 'You do not have permission to cancel this request.']);
                }
                return $permissionCheck;
            }

            $success = $this->requestService->cancelRequest($requestId, $guardian->id);

            if ($success) {
                // Check if this is an Inertia request
                if ($request->header('X-Inertia')) {
                    return redirect()->back()->with('success', 'Connection request cancelled successfully.');
                }
                
                return $this->successResponse('Request cancelled successfully.');
            }

            // Check if this is an Inertia request for error handling
            if ($request->header('X-Inertia')) {
                return redirect()->back()->withErrors(['message' => 'Failed to cancel request. Please try again.']);
            }

            return $this->errorResponse(
                'CANCELLATION_FAILED',
                'Failed to cancel request.',
                [],
                500
            );
        } catch (Exception $e) {
            // Check if this is an Inertia request for error handling
            if ($request->header('X-Inertia')) {
                return redirect()->back()->withErrors(['message' => 'Failed to cancel request. Please try again.']);
            }
            
            return $this->handleConnectionError($e, 'Failed to cancel request.');
        }
    }

    /**
     * Get detailed information about a specific connection.
     */
    public function show(Request $request, int $connectionId): Response
    {
        $guardian = $request->user();
        
        try {
            $connectionHistory = $this->connectionService->getConnectionHistory($connectionId);
            $connection = $connectionHistory->first();

            // Verify this guardian owns this connection
            if ($connection->client_id !== $guardian->id) {
                abort(403, 'You do not have access to this connection.');
            }

            $therapist = $connection->therapist;
            $formattedConnection = [
                'id' => $connection->id,
                'therapist' => [
                    'id' => $therapist->id,
                    'name' => $therapist->name,
                    'email' => $therapist->email,
                    'status' => $therapist->status,
                    'specialization' => $this->getTherapistSpecialization($therapist),
                    'years_experience' => $this->getTherapistExperience($therapist),
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
                'availability' => $this->getTherapistAvailability($therapist->id),
                'recent_appointments' => $this->getRecentAppointments($guardian->id, $therapist->id),
                'communication_history' => $this->getCommunicationHistory($guardian->id, $therapist->id),
            ];

            return Inertia::render('guardian/connections/show', [
                'connection' => $formattedConnection,
            ]);

        } catch (\Exception $e) {
            abort(404, 'Connection not found.');
        }
    }

    /**
     * Get therapist specialization (placeholder for future profile fields).
     */
    private function getTherapistSpecialization(User $therapist): ?string
    {
        // This would come from therapist profile in the future
        // For now, return a placeholder based on name or other available data
        return 'General Therapy'; // Placeholder
    }

    /**
     * Get therapist availability status.
     */
    private function getTherapistAvailabilityStatus(int $therapistId): string
    {
        $availability = \App\Models\TherapistAvailability::where('therapist_id', $therapistId)
            ->where('is_active', true)
            ->exists();
            
        return $availability ? 'available' : 'limited';
    }

    /**
     * Get therapist availability details.
     */
    private function getTherapistAvailability(int $therapistId): array
    {
        $availability = \App\Models\TherapistAvailability::where('therapist_id', $therapistId)
            ->where('is_active', true)
            ->get();

        return $availability->map(function ($slot) {
            return [
                'day_of_week' => $slot->day_of_week,
                'start_time' => $slot->start_time,
                'end_time' => $slot->end_time,
                'day_name' => $this->getDayName($slot->day_of_week),
            ];
        })->toArray();
    }

    /**
     * Get therapist active connections count.
     */
    private function getTherapistActiveConnectionsCount(int $therapistId): int
    {
        return $this->connectionService->getTherapistConnections($therapistId)->count();
    }

    /**
     * Get therapist rating (placeholder for future rating system).
     */
    private function getTherapistRating(int $therapistId): ?float
    {
        // Placeholder for future rating system
        return null;
    }

    /**
     * Get therapist experience (placeholder for future profile fields).
     */
    private function getTherapistExperience(User $therapist): ?int
    {
        // Placeholder for future profile fields
        return null;
    }

    /**
     * Get pending child assignments for a specific child.
     */
    private function getPendingChildAssignments(int $childId): array
    {
        $requests = ConnectionRequest::where('target_client_id', $childId)
            ->where('status', 'pending')
            ->with(['targetTherapist'])
            ->get();

        return $requests->map(function ($request) {
            return [
                'id' => $request->id,
                'therapist_name' => $request->targetTherapist->name,
                'created_at' => $request->created_at,
            ];
        })->toArray();
    }

    /**
     * Get recent appointments between guardian and therapist.
     */
    private function getRecentAppointments(int $guardianId, int $therapistId): array
    {
        $appointments = \App\Models\Appointment::where('guardian_id', $guardianId)
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
     * Get communication history between guardian and therapist.
     */
    private function getCommunicationHistory(int $guardianId, int $therapistId): array
    {
        // This would query the message system
        // For now, return placeholder data
        return [
            'total_messages' => 0,
            'last_message_at' => null,
            'recent_messages' => [],
        ];
    }

    /**
     * Get day name from day of week number.
     */
    private function getDayName(int $dayOfWeek): string
    {
        $days = [
            0 => 'Sunday',
            1 => 'Monday',
            2 => 'Tuesday',
            3 => 'Wednesday',
            4 => 'Thursday',
            5 => 'Friday',
            6 => 'Saturday',
        ];

        return $days[$dayOfWeek] ?? 'Unknown';
    }
}