<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ConnectionManagementService;
use App\Http\Requests\CreateAdminConnectionRequest;
use App\Http\Traits\ConnectionErrorHandler;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use InvalidArgumentException;
use Exception;

class AdminConnectionController extends Controller
{
    use ConnectionErrorHandler;

    protected ConnectionManagementService $connectionService;

    public function __construct(ConnectionManagementService $connectionService)
    {
        $this->connectionService = $connectionService;
    }

    /**
     * Display the admin connection management dashboard
     */
    public function index()
    {
        $connections = $this->connectionService->getAllConnections();
        $statistics = $this->connectionService->getConnectionStatistics();
        
        // Get available users for assignment
        // Admins can only create connections between therapists and guardians
        // Guardians are responsible for assigning their own children
        $therapists = User::role('therapist')
            ->where('status', 'active')
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();
            
        $guardians = User::role('guardian')
            ->where('status', 'active')
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        // Add helpful messages based on available users
        $flashMessage = null;
        $flashType = null;

        if ($therapists->isEmpty() && $guardians->isEmpty()) {
            $flashMessage = 'No active therapists or guardians available. Please ensure users are properly registered and activated.';
            $flashType = 'warning';
        } elseif ($therapists->isEmpty()) {
            $flashMessage = 'No active therapists available. New connections cannot be created until therapists are registered.';
            $flashType = 'warning';
        } elseif ($guardians->isEmpty()) {
            $flashMessage = 'No active guardians available. New connections cannot be created until guardians are registered.';
            $flashType = 'warning';
        } elseif ($connections->isEmpty()) {
            $flashMessage = 'No connections have been created yet. Use the "Create Connection" button to establish therapeutic relationships.';
            $flashType = 'info';
        }

        $response = Inertia::render('admin/connection-management', [
            'connections' => $connections,
            'statistics' => $statistics,
            'therapists' => $therapists,
            'guardians' => $guardians,
        ]);

        // Add flash message if needed
        if ($flashMessage && $flashType && !session()->has('success') && !session()->has('error')) {
            $response->with($flashType, $flashMessage);
        }

        return $response;
    }

    /**
     * Create a new admin assignment between therapist and guardian
     */
    public function store(CreateAdminConnectionRequest $request)
    {
        try {
            $connection = $this->connectionService->createAdminAssignment(
                $request->validated('therapist_id'),
                $request->validated('client_id'),
                auth()->id()
            );

            // Get the therapist and guardian names for the success message
            $therapist = User::find($request->validated('therapist_id'));
            $guardian = User::find($request->validated('client_id'));

            // Return redirect with success message for Inertia
            return redirect()->route('admin.connections.index')
                ->with('success', "Connection created successfully! {$therapist->name} is now connected to {$guardian->name}.");
                
        } catch (Exception $e) {
            // Handle errors with Inertia-compatible response
            $errorMessage = $this->getErrorMessage($e);
            return redirect()->back()
                ->with('error', $errorMessage)
                ->withInput();
        }
    }

    /**
     * Get connection analytics data
     */
    public function analytics(): JsonResponse
    {
        try {
            $statistics = $this->connectionService->getConnectionStatistics();
            
            // Additional analytics data
            $recentConnections = $this->connectionService->getAllConnections()
                ->where('assigned_at', '>=', now()->subDays(30))
                ->count();
                
            $connectionsByType = $this->connectionService->getAllConnections()
                ->groupBy('connection_type')
                ->map(function ($connections) {
                    return $connections->count();
                });

            return $this->successResponse(
                'Analytics data retrieved successfully.',
                [
                    'statistics' => $statistics,
                    'recent_connections' => $recentConnections,
                    'connections_by_type' => $connectionsByType,
                    'monthly_trends' => $this->getMonthlyTrends(),
                    'therapist_metrics' => $this->getTherapistMetrics(),
                ]
            );
        } catch (Exception $e) {
            return $this->handleConnectionError($e, 'Failed to retrieve analytics data.');
        }
    }

    /**
     * Show detailed view of a specific connection
     */
    public function show($id)
    {
        $connection = $this->connectionService->getConnectionHistory($id)->first();
        
        if (!$connection) {
            return back()->with('error', 'Connection not found.');
        }

        return Inertia::render('admin/connection-detail', [
            'connection' => $connection,
        ]);
    }

    /**
     * Terminate a connection
     */
    public function destroy(Request $request, int $id)
    {
        try {
            // Validate connection exists and get details
            $connection = $this->connectionService->getConnectionHistory($id)->first();
            
            if (!$connection) {
                return redirect()->back()
                    ->with('error', 'Connection not found.');
            }

            // Get names for the success message
            $therapistName = $connection->therapist->name;
            $clientName = $connection->client->name;

            $success = $this->connectionService->terminateConnection($id, auth()->id());
            
            if ($success) {
                return redirect()->route('admin.connections.index')
                    ->with('success', "Connection terminated successfully! {$therapistName} is no longer connected to {$clientName}.");
            } else {
                return redirect()->back()
                    ->with('error', 'Failed to terminate connection. Please try again.');
            }
        } catch (Exception $e) {
            $errorMessage = $this->getErrorMessage($e);
            return redirect()->back()
                ->with('error', $errorMessage);
        }
    }

    /**
     * Get available clients for a specific therapist
     */
    public function availableClients(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'therapist_id' => 'required|integer|exists:users,id',
            ]);

            $therapistId = $request->query('therapist_id');
            
            // Validate therapist role
            $therapist = User::findOrFail($therapistId);
            if (!$therapist->hasRole('therapist')) {
                return $this->errorResponse(
                    'INVALID_USER_ROLE',
                    'Selected user is not a therapist.',
                    ['user_id' => $therapistId]
                );
            }

            // Get all active guardians not already connected to this therapist
            // Admins can only create connections between therapists and guardians
            $existingConnections = $this->connectionService->getTherapistConnections($therapistId)
                ->where('client_type', 'guardian') // Only check guardian connections
                ->pluck('client_id')
                ->toArray();

            $availableGuardians = User::role('guardian')
                ->where('status', 'active')
                ->whereNotIn('id', $existingConnections)
                ->select('id', 'name', 'email')
                ->orderBy('name')
                ->get();

            return $this->successResponse(
                'Available clients retrieved successfully.',
                [
                    'guardians' => $availableGuardians,
                    'therapist' => [
                        'id' => $therapist->id,
                        'name' => $therapist->name,
                    ],
                ]
            );
        } catch (Exception $e) {
            return $this->handleConnectionError($e, 'Failed to retrieve available clients.');
        }
    }

    /**
     * Get available therapists for a specific client
     */
    public function availableTherapists(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'client_id' => 'required|integer|exists:users,id',
            ]);

            $clientId = $request->query('client_id');
            
            // Validate client role - admins can only assign guardians
            $client = User::findOrFail($clientId);
            if (!$client->hasRole('guardian')) {
                return $this->errorResponse(
                    'INVALID_USER_ROLE',
                    'Admins can only create connections with guardians. Guardians are responsible for assigning their children.',
                    ['user_id' => $clientId]
                );
            }

            // Get all active therapists not already connected to this client
            $existingConnections = $this->connectionService->getClientConnections($clientId)
                ->pluck('therapist_id')
                ->toArray();

            $availableTherapists = User::role('therapist')
                ->where('status', 'active')
                ->whereNotIn('id', $existingConnections)
                ->select('id', 'name', 'email')
                ->orderBy('name')
                ->get();

            return $this->successResponse(
                'Available therapists retrieved successfully.',
                [
                    'therapists' => $availableTherapists,
                    'client' => [
                        'id' => $client->id,
                        'name' => $client->name,
                        'type' => 'guardian',
                    ],
                ]
            );
        } catch (Exception $e) {
            return $this->handleConnectionError($e, 'Failed to retrieve available therapists.');
        }
    }

    /**
     * Get monthly connection trends for analytics
     */
    private function getMonthlyTrends(): array
    {
        $trends = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthStart = $month->startOfMonth()->copy();
            $monthEnd = $month->endOfMonth()->copy();

            $newConnections = $this->connectionService->getAllConnections()
                ->whereBetween('assigned_at', [$monthStart, $monthEnd])
                ->count();

            $terminatedConnections = $this->connectionService->getAllConnections()
                ->whereBetween('terminated_at', [$monthStart, $monthEnd])
                ->count();

            $trends[] = [
                'month' => $month->format('Y-m'),
                'month_name' => $month->format('F Y'),
                'new_connections' => $newConnections,
                'terminated_connections' => $terminatedConnections,
            ];
        }

        return $trends;
    }

    /**
     * Get therapist metrics for analytics
     */
    private function getTherapistMetrics(): array
    {
        $therapists = User::role('therapist')
            ->where('status', 'active')
            ->get();

        return $therapists->map(function ($therapist) {
            $connections = $this->connectionService->getTherapistConnections($therapist->id);
            $pendingRequests = \App\Models\ConnectionRequest::where('target_therapist_id', $therapist->id)
                ->where('status', 'pending')
                ->count();

            return [
                'therapist_id' => $therapist->id,
                'name' => $therapist->name,
                'email' => $therapist->email,
                'total_connections' => $connections->count(),
                'active_connections' => $connections->where('status', 'active')->count(),
                'guardian_connections' => $connections->where('client_type', 'guardian')->count(),
                'child_connections' => $connections->where('client_type', 'child')->count(),
                'pending_requests' => $pendingRequests,
            ];
        })->toArray();
    }

    /**
     * Extract user-friendly error message from exception
     */
    private function getErrorMessage(Exception $e): string
    {
        if ($e instanceof InvalidArgumentException) {
            // These are business logic errors that should be shown to users
            return $e->getMessage();
        }
        
        if ($e instanceof ValidationException) {
            return 'Validation failed. Please check your input and try again.';
        }
        
        if ($e instanceof \Illuminate\Database\QueryException) {
            // Database constraint violations
            if (str_contains($e->getMessage(), 'UNIQUE constraint failed')) {
                return 'A connection between these users already exists.';
            }
            return 'Database error occurred. Please try again.';
        }
        
        // Log the actual error for debugging
        \Log::error('Connection operation failed: ' . $e->getMessage(), [
            'exception' => $e,
            'user_id' => auth()->id(),
            'trace' => $e->getTraceAsString(),
        ]);
        
        return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
    }
}