<?php

namespace App\Services;

use App\Models\TherapistClientConnection;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use InvalidArgumentException;

class ConnectionManagementService
{
    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }
    /**
     * Connection type constants
     */
    const TYPE_ADMIN_ASSIGNED = 'admin_assigned';
    const TYPE_GUARDIAN_REQUESTED = 'guardian_requested';
    const TYPE_GUARDIAN_CHILD_ASSIGNMENT = 'guardian_child_assignment';

    /**
     * Client type constants
     */
    const CLIENT_TYPE_GUARDIAN = 'guardian';
    const CLIENT_TYPE_CHILD = 'child';

    /**
     * Status constants
     */
    const STATUS_ACTIVE = 'active';
    const STATUS_INACTIVE = 'inactive';
    const STATUS_TERMINATED = 'terminated';

    /**
     * Create an admin assignment between a therapist and guardian
     * Admins can only create connections with guardians, not children
     */
    public function createAdminAssignment(int $therapistId, int $clientId, int $adminId): TherapistClientConnection
    {
        // Validate users exist and have correct roles
        $therapist = $this->validateTherapist($therapistId);
        $client = $this->validateClient($clientId);
        $admin = $this->validateAdmin($adminId);

        // Enforce that admins can only assign guardians
        if (!$client->hasRole('guardian')) {
            throw new InvalidArgumentException('Admins can only create connections with guardians. Guardians are responsible for assigning their children.');
        }

        $clientType = self::CLIENT_TYPE_GUARDIAN;

        // Check for existing active connection
        $existingConnection = TherapistClientConnection::where('therapist_id', $therapistId)
            ->where('client_id', $clientId)
            ->where('status', self::STATUS_ACTIVE)
            ->first();

        if ($existingConnection) {
            throw new InvalidArgumentException('An active connection already exists between this therapist and guardian');
        }

        // Create the connection
        $connection = TherapistClientConnection::create([
            'therapist_id' => $therapistId,
            'client_id' => $clientId,
            'client_type' => $clientType,
            'connection_type' => self::TYPE_ADMIN_ASSIGNED,
            'status' => self::STATUS_ACTIVE,
            'assigned_by' => $adminId,
            'assigned_at' => now(),
        ]);

        // Send notifications (will be handled by notification service integration)
        $this->notifyConnectionCreated($connection, $admin);

        return $connection;
    }

    /**
     * Get connections for a therapist
     */
    public function getTherapistConnections(int $therapistId, ?string $clientType = null): Collection
    {
        $this->validateTherapist($therapistId);

        $query = TherapistClientConnection::with(['client', 'assignedBy'])
            ->forTherapist($therapistId)
            ->active();

        if ($clientType) {
            $query->byClientType($clientType);
        }

        return $query->orderBy('assigned_at', 'desc')->get();
    }

    /**
     * Get guardian connections for a therapist
     */
    public function getTherapistGuardianConnections(int $therapistId): Collection
    {
        return $this->getTherapistConnections($therapistId, self::CLIENT_TYPE_GUARDIAN);
    }

    /**
     * Get child connections for a therapist
     */
    public function getTherapistChildConnections(int $therapistId): Collection
    {
        return $this->getTherapistConnections($therapistId, self::CLIENT_TYPE_CHILD);
    }

    /**
     * Get connections for a client (guardian or child)
     */
    public function getClientConnections(int $clientId): Collection
    {
        $this->validateClient($clientId);

        return TherapistClientConnection::with(['therapist', 'assignedBy'])
            ->forClient($clientId)
            ->active()
            ->orderBy('assigned_at', 'desc')
            ->get();
    }

    /**
     * Get all connections (admin view)
     */
    public function getAllConnections(?string $status = null): Collection
    {
        $query = TherapistClientConnection::with(['therapist', 'client', 'assignedBy']);

        if ($status) {
            $query->where('status', $status);
        }

        return $query->orderBy('assigned_at', 'desc')->get();
    }

    /**
     * Terminate a connection with comprehensive data preservation
     */
    public function terminateConnection(int $connectionId, int $terminatedBy, ?string $reason = null): bool
    {
        $connection = TherapistClientConnection::findOrFail($connectionId);

        if ($connection->status === self::STATUS_TERMINATED) {
            throw new InvalidArgumentException('Connection is already terminated');
        }

        // Validate the user terminating has permission (admin or therapist)
        $terminator = User::findOrFail($terminatedBy);
        if (!$terminator->hasAnyRole(['admin', 'therapist'])) {
            throw new InvalidArgumentException('User does not have permission to terminate connections');
        }

        // If therapist is terminating, ensure it's their own connection
        if ($terminator->hasRole('therapist') && !$terminator->hasRole('admin')) {
            if ($connection->therapist_id !== $terminatedBy) {
                throw new InvalidArgumentException('Therapist can only terminate their own connections');
            }
        }

        // Use the permission service for comprehensive termination
        $permissionService = app(ConnectionPermissionService::class);
        $success = $permissionService->terminateConnectionWithDataPreservation(
            $connection,
            $terminator,
            $reason
        );

        if ($success) {
            // Send notifications about termination
            $this->notifyConnectionTerminated($connection, $terminator);
        }

        return $success;
    }

    /**
     * Get connection history for a specific connection
     */
    public function getConnectionHistory(int $connectionId): Collection
    {
        $connection = TherapistClientConnection::with(['therapist', 'client', 'assignedBy'])
            ->findOrFail($connectionId);

        // For now, return the connection details
        // This could be expanded to include audit logs, appointment history, etc.
        return collect([$connection]);
    }

    /**
     * Check if two users have an active connection
     */
    public function hasActiveConnection(int $userId1, int $userId2): bool
    {
        return TherapistClientConnection::where(function ($query) use ($userId1, $userId2) {
            $query->where('therapist_id', $userId1)->where('client_id', $userId2);
        })->orWhere(function ($query) use ($userId1, $userId2) {
            $query->where('therapist_id', $userId2)->where('client_id', $userId1);
        })->active()->exists();
    }

    /**
     * Get connection statistics for admin dashboard
     */
    public function getConnectionStatistics(): array
    {
        return [
            'total_active' => TherapistClientConnection::active()->count(),
            'total_terminated' => TherapistClientConnection::where('status', self::STATUS_TERMINATED)->count(),
            'guardian_connections' => TherapistClientConnection::active()->byClientType(self::CLIENT_TYPE_GUARDIAN)->count(),
            'child_connections' => TherapistClientConnection::active()->byClientType(self::CLIENT_TYPE_CHILD)->count(),
            'admin_assigned' => TherapistClientConnection::active()->where('connection_type', self::TYPE_ADMIN_ASSIGNED)->count(),
            'guardian_requested' => TherapistClientConnection::active()->where('connection_type', self::TYPE_GUARDIAN_REQUESTED)->count(),
        ];
    }

    /**
     * Validate that a user is a therapist
     */
    private function validateTherapist(int $userId): User
    {
        $user = User::findOrFail($userId);
        
        if (!$user->hasRole('therapist')) {
            throw new InvalidArgumentException('User must have therapist role');
        }

        return $user;
    }

    /**
     * Validate that a user is a client (guardian or child)
     */
    private function validateClient(int $userId): User
    {
        $user = User::findOrFail($userId);
        
        if (!$user->hasAnyRole(['guardian', 'child'])) {
            throw new InvalidArgumentException('User must have guardian or child role');
        }

        return $user;
    }

    /**
     * Validate that a user is an admin
     */
    private function validateAdmin(int $userId): User
    {
        $user = User::findOrFail($userId);
        
        if (!$user->hasRole('admin')) {
            throw new InvalidArgumentException('User must have admin role');
        }

        return $user;
    }

    /**
     * Send notifications when a connection is created
     */
    private function notifyConnectionCreated(TherapistClientConnection $connection, User $assignedBy): void
    {
        $this->notificationService->notifyConnectionAssigned($connection, $assignedBy);
    }

    /**
     * Send notifications when a connection is terminated
     */
    private function notifyConnectionTerminated(TherapistClientConnection $connection, User $terminatedBy): void
    {
        $this->notificationService->notifyConnectionTerminated($connection, $terminatedBy);
    }
}