<?php

namespace App\Services;

use App\Models\TherapistClientConnection;
use App\Models\User;
use App\Models\Appointment;
use App\Models\Message;
use App\Models\MoodLog;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ConnectionPermissionService
{
    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Update permissions when connection status changes
     */
    public function updatePermissionsOnStatusChange(TherapistClientConnection $connection, string $oldStatus, string $newStatus): void
    {
        Log::info('Updating permissions for connection status change', [
            'connection_id' => $connection->id,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'therapist_id' => $connection->therapist_id,
            'client_id' => $connection->client_id,
        ]);

        // Handle status transitions
        switch ($newStatus) {
            case 'active':
                $this->enableConnectionPermissions($connection);
                break;
            case 'terminated':
                $this->disableConnectionPermissions($connection);
                break;
            case 'inactive':
                $this->suspendConnectionPermissions($connection);
                break;
        }

        // Log the permission update
        Log::info('Permissions updated for connection', [
            'connection_id' => $connection->id,
            'status' => $newStatus,
        ]);
    }

    /**
     * Enable permissions for an active connection
     */
    protected function enableConnectionPermissions(TherapistClientConnection $connection): void
    {
        // Permissions are enabled by default when checking hasActiveConnection
        // This method can be extended to handle specific permission grants
        
        Log::info('Enabled permissions for active connection', [
            'connection_id' => $connection->id,
        ]);
    }

    /**
     * Disable permissions for a terminated connection while preserving data
     */
    protected function disableConnectionPermissions(TherapistClientConnection $connection): void
    {
        // Cancel any future appointments but preserve historical ones
        $this->cancelFutureAppointments($connection);
        
        // Preserve historical data but restrict future interactions
        $this->preserveHistoricalData($connection);
        
        Log::info('Disabled permissions for terminated connection', [
            'connection_id' => $connection->id,
        ]);
    }

    /**
     * Suspend permissions for an inactive connection
     */
    protected function suspendConnectionPermissions(TherapistClientConnection $connection): void
    {
        // Similar to termination but may be reversible
        $this->cancelFutureAppointments($connection);
        
        Log::info('Suspended permissions for inactive connection', [
            'connection_id' => $connection->id,
        ]);
    }

    /**
     * Cancel future appointments when connection is terminated
     */
    protected function cancelFutureAppointments(TherapistClientConnection $connection): void
    {
        $futureAppointments = Appointment::where('therapist_id', $connection->therapist_id)
            ->where('child_id', $connection->client_id)
            ->where('scheduled_at', '>', now())
            ->whereIn('status', ['requested', 'confirmed'])
            ->get();

        foreach ($futureAppointments as $appointment) {
            $appointment->update([
                'status' => 'cancelled',
                'cancellation_reason' => 'Therapeutic relationship terminated',
                'cancelled_at' => now(),
            ]);

            Log::info('Cancelled future appointment due to connection termination', [
                'appointment_id' => $appointment->id,
                'connection_id' => $connection->id,
            ]);
        }

        if ($futureAppointments->count() > 0) {
            // Notify affected parties about cancelled appointments
            $this->notifyAppointmentCancellations($connection, $futureAppointments);
        }
    }

    /**
     * Preserve historical data while restricting future access
     */
    protected function preserveHistoricalData(TherapistClientConnection $connection): void
    {
        // Historical data preservation is handled by not deleting records
        // Access restrictions are enforced in controllers and services
        
        // Mark the connection as terminated with timestamp
        if (!$connection->terminated_at) {
            $connection->update(['terminated_at' => now()]);
        }

        Log::info('Preserved historical data for terminated connection', [
            'connection_id' => $connection->id,
            'terminated_at' => $connection->terminated_at,
        ]);
    }

    /**
     * Check if user can access feature based on connection status
     */
    public function canAccessFeature(User $user, User $otherUser, string $feature): bool
    {
        // Admin users have access to all features
        if ($user->hasRole('admin')) {
            return true;
        }

        // Check for active connection
        $connection = $this->getActiveConnection($user->id, $otherUser->id);
        
        if (!$connection) {
            // Special cases for family relationships
            if ($this->isFamilyRelationship($user, $otherUser)) {
                return $this->canAccessFamilyFeature($feature);
            }
            return false;
        }

        // Check feature-specific permissions
        return $this->canAccessConnectionFeature($connection, $feature);
    }

    /**
     * Get active connection between two users
     */
    protected function getActiveConnection(int $userId1, int $userId2): ?TherapistClientConnection
    {
        return TherapistClientConnection::where(function ($query) use ($userId1, $userId2) {
            $query->where('therapist_id', $userId1)->where('client_id', $userId2);
        })->orWhere(function ($query) use ($userId1, $userId2) {
            $query->where('therapist_id', $userId2)->where('client_id', $userId1);
        })->where('status', 'active')->first();
    }

    /**
     * Check if users have a family relationship
     */
    protected function isFamilyRelationship(User $user, User $otherUser): bool
    {
        // Guardian-child relationship
        if ($user->hasRole('guardian') && $otherUser->hasRole('child')) {
            return $otherUser->guardian_id === $user->id;
        }
        
        if ($user->hasRole('child') && $otherUser->hasRole('guardian')) {
            return $user->guardian_id === $otherUser->id;
        }

        return false;
    }

    /**
     * Check if feature is accessible for family relationships
     */
    protected function canAccessFamilyFeature(string $feature): bool
    {
        $familyFeatures = [
            'messaging',
            'mood_data_view',
            'appointment_scheduling',
        ];

        return in_array($feature, $familyFeatures);
    }

    /**
     * Check if feature is accessible for therapeutic connections
     */
    protected function canAccessConnectionFeature(TherapistClientConnection $connection, string $feature): bool
    {
        if ($connection->status !== 'active') {
            // Only allow viewing historical data for terminated connections
            $historicalFeatures = [
                'appointment_history',
                'mood_data_history',
                'message_history',
            ];
            
            return in_array($feature, $historicalFeatures);
        }

        // All features available for active connections
        return true;
    }

    /**
     * Get accessible mood data based on connection status
     */
    public function getAccessibleMoodData(User $viewer, User $child, ?\DateTime $startDate = null, ?\DateTime $endDate = null): Collection
    {
        // Check if viewer can access child's mood data
        if (!$this->canAccessMoodData($viewer, $child)) {
            return collect();
        }

        $query = MoodLog::where('user_id', $child->id);

        if ($startDate) {
            $query->where('mood_date', '>=', $startDate->format('Y-m-d'));
        }

        if ($endDate) {
            $query->where('mood_date', '<=', $endDate->format('Y-m-d'));
        }

        // For terminated connections, only show historical data up to termination
        $connection = $this->getConnectionBetweenUsers($viewer->id, $child->id);
        if ($connection && $connection->status === 'terminated' && $connection->terminated_at) {
            $query->where('mood_date', '<=', $connection->terminated_at->format('Y-m-d'));
        }

        return $query->orderBy('mood_date', 'desc')->get();
    }

    /**
     * Check if viewer can access child's mood data
     */
    protected function canAccessMoodData(User $viewer, User $child): bool
    {
        // Admin can access all data
        if ($viewer->hasRole('admin')) {
            return true;
        }

        // Guardian can access their own child's data
        if ($viewer->hasRole('guardian') && $child->guardian_id === $viewer->id) {
            return true;
        }

        // Therapist can access connected child's data
        if ($viewer->hasRole('therapist')) {
            $connection = $this->getConnectionBetweenUsers($viewer->id, $child->id);
            return $connection && ($connection->status === 'active' || $connection->status === 'terminated');
        }

        return false;
    }

    /**
     * Get connection between two users (any status)
     */
    protected function getConnectionBetweenUsers(int $userId1, int $userId2): ?TherapistClientConnection
    {
        return TherapistClientConnection::where(function ($query) use ($userId1, $userId2) {
            $query->where('therapist_id', $userId1)->where('client_id', $userId2);
        })->orWhere(function ($query) use ($userId1, $userId2) {
            $query->where('therapist_id', $userId2)->where('client_id', $userId1);
        })->first();
    }

    /**
     * Get accessible appointments based on connection status
     */
    public function getAccessibleAppointments(User $user, ?User $otherUser = null): Collection
    {
        $query = Appointment::query();

        if ($user->hasRole('therapist')) {
            $query->where('therapist_id', $user->id);
            
            // Filter by active connections only for future appointments
            $activeConnections = TherapistClientConnection::where('therapist_id', $user->id)
                ->where('status', 'active')
                ->pluck('client_id');
            
            $query->where(function ($q) use ($activeConnections) {
                // Show all historical appointments
                $q->where('scheduled_at', '<=', now())
                  // Show future appointments only for active connections
                  ->orWhere(function ($subQ) use ($activeConnections) {
                      $subQ->where('scheduled_at', '>', now())
                           ->where(function ($connQ) use ($activeConnections) {
                               // Child appointments: child_id in active connections
                               $connQ->whereIn('child_id', $activeConnections)
                                     // Guardian consultations: guardian_id in active connections and child_id is null
                                     ->orWhere(function ($guardianQ) use ($activeConnections) {
                                         $guardianQ->whereIn('guardian_id', $activeConnections)
                                                   ->whereNull('child_id');
                                     });
                           });
                  });
            });
        } elseif ($user->hasRole('guardian')) {
            $query->where('guardian_id', $user->id);
        } elseif ($user->hasRole('child')) {
            $query->where('child_id', $user->id);
        }

        if ($otherUser) {
            if ($user->hasRole('therapist')) {
                $query->where('child_id', $otherUser->id);
            } else {
                $query->where('therapist_id', $otherUser->id);
            }
        }

        return $query->with(['therapist', 'child', 'guardian'])
                    ->orderBy('scheduled_at', 'desc')
                    ->get();
    }

    /**
     * Notify about appointment cancellations due to connection termination
     */
    protected function notifyAppointmentCancellations(TherapistClientConnection $connection, Collection $appointments): void
    {
        $therapist = $connection->therapist;
        $client = $connection->client;

        foreach ($appointments as $appointment) {
            // Notify therapist
            $this->notificationService->create(
                $therapist->id,
                NotificationService::TYPE_APPOINTMENT_CANCELLED,
                'Appointment Cancelled - Connection Terminated',
                "Appointment with {$client->name} on {$appointment->scheduled_at->format('M j, Y g:i A')} has been cancelled due to connection termination",
                [
                    'appointment_id' => $appointment->id,
                    'connection_id' => $connection->id,
                    'reason' => 'connection_terminated',
                ],
                null,
                'high'
            );

            // Notify client
            $this->notificationService->create(
                $client->id,
                NotificationService::TYPE_APPOINTMENT_CANCELLED,
                'Appointment Cancelled - Connection Terminated',
                "Appointment with {$therapist->name} on {$appointment->scheduled_at->format('M j, Y g:i A')} has been cancelled due to connection termination",
                [
                    'appointment_id' => $appointment->id,
                    'connection_id' => $connection->id,
                    'reason' => 'connection_terminated',
                ],
                null,
                'high'
            );

            // If it's a child appointment, also notify the guardian
            if ($connection->client_type === 'child' && $client->guardian) {
                $this->notificationService->create(
                    $client->guardian->id,
                    NotificationService::TYPE_APPOINTMENT_CANCELLED,
                    'Child Appointment Cancelled',
                    "Your child {$client->name}'s appointment with {$therapist->name} on {$appointment->scheduled_at->format('M j, Y g:i A')} has been cancelled due to connection termination",
                    [
                        'appointment_id' => $appointment->id,
                        'connection_id' => $connection->id,
                        'child_id' => $client->id,
                        'reason' => 'connection_terminated',
                    ],
                    null,
                    'high'
                );
            }
        }
    }

    /**
     * Terminate connection with comprehensive data preservation
     */
    public function terminateConnectionWithDataPreservation(
        TherapistClientConnection $connection,
        User $terminatedBy,
        ?string $reason = null
    ): bool {
        return DB::transaction(function () use ($connection, $terminatedBy, $reason) {
            $oldStatus = $connection->status;

            // Update connection status
            $connection->update([
                'status' => 'terminated',
                'terminated_at' => now(),
            ]);

            // Update permissions based on status change
            $this->updatePermissionsOnStatusChange($connection, $oldStatus, 'terminated');

            // Create audit log entry for termination
            $this->logConnectionTermination($connection, $terminatedBy, $reason);

            Log::info('Connection terminated with data preservation', [
                'connection_id' => $connection->id,
                'terminated_by' => $terminatedBy->id,
                'reason' => $reason,
            ]);

            return true;
        });
    }

    /**
     * Log connection termination for audit purposes
     */
    protected function logConnectionTermination(
        TherapistClientConnection $connection,
        User $terminatedBy,
        ?string $reason
    ): void {
        // This could integrate with an audit logging system
        Log::info('Connection termination audit log', [
            'connection_id' => $connection->id,
            'therapist_id' => $connection->therapist_id,
            'client_id' => $connection->client_id,
            'client_type' => $connection->client_type,
            'connection_type' => $connection->connection_type,
            'terminated_by' => $terminatedBy->id,
            'terminated_by_role' => $terminatedBy->roles->pluck('name')->toArray(),
            'termination_reason' => $reason,
            'terminated_at' => $connection->terminated_at,
            'connection_duration_days' => $connection->getDurationInDays(),
        ]);
    }

    /**
     * Check if messaging is allowed between users based on connection status
     */
    public function canMessage(User $sender, User $recipient): bool
    {
        return $this->canAccessFeature($sender, $recipient, 'messaging');
    }

    /**
     * Check if appointment scheduling is allowed between users
     */
    public function canScheduleAppointment(User $user, User $otherUser): bool
    {
        return $this->canAccessFeature($user, $otherUser, 'appointment_scheduling');
    }

    /**
     * Check if mood data viewing is allowed
     */
    public function canViewMoodData(User $viewer, User $child): bool
    {
        return $this->canAccessFeature($viewer, $child, 'mood_data_view');
    }
}