<?php

namespace App\Services;

use App\Models\ConnectionRequest;
use App\Models\TherapistClientConnection;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use InvalidArgumentException;

class ConnectionRequestService
{
    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }
    /**
     * Request type constants
     */
    const TYPE_GUARDIAN_TO_THERAPIST = 'guardian_to_therapist';
    const TYPE_GUARDIAN_CHILD_ASSIGNMENT = 'guardian_child_assignment';

    /**
     * Status constants
     */
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_DECLINED = 'declined';
    const STATUS_CANCELLED = 'cancelled';

    /**
     * Create a guardian-to-therapist connection request
     */
    public function createGuardianRequest(int $guardianId, int $therapistId, ?string $message = null): ConnectionRequest
    {
        // Validate users exist and have correct roles
        $guardian = $this->validateGuardian($guardianId);
        $therapist = $this->validateTherapist($therapistId);

        // Check if there's already an active connection
        if ($this->hasActiveConnection($guardianId, $therapistId)) {
            throw new InvalidArgumentException('An active connection already exists between this guardian and therapist');
        }

        // Check if there's already a pending request
        $existingRequest = ConnectionRequest::where('requester_id', $guardianId)
            ->where('target_therapist_id', $therapistId)
            ->whereNull('target_client_id')
            ->where('status', self::STATUS_PENDING)
            ->first();

        if ($existingRequest) {
            throw new InvalidArgumentException('A pending request already exists between this guardian and therapist');
        }

        // Create the request
        $request = ConnectionRequest::create([
            'requester_id' => $guardianId,
            'requester_type' => 'guardian',
            'target_therapist_id' => $therapistId,
            'target_client_id' => null,
            'request_type' => self::TYPE_GUARDIAN_TO_THERAPIST,
            'status' => self::STATUS_PENDING,
            'message' => $message,
        ]);

        // Send notification to therapist
        $this->notifyRequestCreated($request);

        return $request;
    }

    /**
     * Create a guardian child assignment request
     */
    public function createChildAssignmentRequest(int $guardianId, int $childId, int $therapistId): ConnectionRequest
    {
        // Validate users exist and have correct roles
        $guardian = $this->validateGuardian($guardianId);
        $child = $this->validateChild($childId);
        $therapist = $this->validateTherapist($therapistId);

        // Validate that the child belongs to the guardian
        if ($child->guardian_id !== $guardianId) {
            throw new InvalidArgumentException('Child does not belong to the requesting guardian');
        }

        // Check if guardian has an active connection with the therapist
        if (!$this->hasActiveConnection($guardianId, $therapistId)) {
            throw new InvalidArgumentException('Guardian must have an active connection with therapist before assigning children');
        }

        // Check if there's already an active connection between child and therapist
        if ($this->hasActiveConnection($childId, $therapistId)) {
            throw new InvalidArgumentException('An active connection already exists between this child and therapist');
        }

        // Check if there's already a pending request for this child
        $existingRequest = ConnectionRequest::where('requester_id', $guardianId)
            ->where('target_therapist_id', $therapistId)
            ->where('target_client_id', $childId)
            ->where('status', self::STATUS_PENDING)
            ->first();

        if ($existingRequest) {
            throw new InvalidArgumentException('A pending child assignment request already exists');
        }

        // Create the request
        $request = ConnectionRequest::create([
            'requester_id' => $guardianId,
            'requester_type' => 'guardian',
            'target_therapist_id' => $therapistId,
            'target_client_id' => $childId,
            'request_type' => self::TYPE_GUARDIAN_CHILD_ASSIGNMENT,
            'status' => self::STATUS_PENDING,
            'message' => "Guardian requesting to assign child {$child->name} to therapeutic care",
        ]);

        // Send notification to therapist
        $this->notifyRequestCreated($request);

        return $request;
    }

    /**
     * Process a connection request (approve or decline)
     */
    public function processRequest(int $requestId, string $action, int $reviewerId): bool
    {
        $request = ConnectionRequest::findOrFail($requestId);
        $reviewer = $this->validateTherapist($reviewerId);

        // Validate that the reviewer is the target therapist
        if ($request->target_therapist_id !== $reviewerId) {
            throw new InvalidArgumentException('Only the target therapist can process this request');
        }

        // Validate that the request is still pending
        if ($request->status !== self::STATUS_PENDING) {
            throw new InvalidArgumentException('Request has already been processed');
        }

        // Validate action
        if (!in_array($action, ['approve', 'decline'])) {
            throw new InvalidArgumentException('Action must be either "approve" or "decline"');
        }

        if ($action === 'approve') {
            return $this->approveRequest($request, $reviewer);
        } else {
            return $this->declineRequest($request, $reviewer);
        }
    }

    /**
     * Approve a connection request
     */
    private function approveRequest(ConnectionRequest $request, User $reviewer): bool
    {
        try {
            // Use the model's approve method which handles the connection creation
            $connection = $request->approve($reviewer);

            // Try to send notifications about approval, but don't fail if notifications fail
            try {
                $this->notifyRequestApproved($request, $connection, $reviewer);
            } catch (\Exception $e) {
                // Log notification failure but don't fail the approval
                \Log::warning('Failed to send approval notification', [
                    'request_id' => $request->id,
                    'connection_id' => $connection->id,
                    'error' => $e->getMessage()
                ]);
            }

            return true;
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Connection request approval failed', [
                'request_id' => $request->id,
                'reviewer_id' => $reviewer->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Re-throw the exception so the controller can handle it
            throw $e;
        }
    }

    /**
     * Decline a connection request
     */
    private function declineRequest(ConnectionRequest $request, User $reviewer): bool
    {
        try {
            // Use the model's decline method
            $success = $request->decline($reviewer);

            if ($success) {
                // Try to send notifications about decline, but don't fail if notifications fail
                try {
                    $this->notifyRequestDeclined($request, $reviewer);
                } catch (\Exception $e) {
                    // Log notification failure but don't fail the decline
                    \Log::warning('Failed to send decline notification', [
                        'request_id' => $request->id,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            return $success;
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Connection request decline failed', [
                'request_id' => $request->id,
                'reviewer_id' => $reviewer->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Re-throw the exception so the controller can handle it
            throw $e;
        }
    }

    /**
     * Cancel a connection request (by the requester)
     */
    public function cancelRequest(int $requestId, int $requesterId): bool
    {
        $request = ConnectionRequest::findOrFail($requestId);

        // Validate that the requester is cancelling their own request
        if ($request->requester_id !== $requesterId) {
            throw new InvalidArgumentException('Only the requester can cancel this request');
        }

        // Validate that the request is still pending
        if ($request->status !== self::STATUS_PENDING) {
            throw new InvalidArgumentException('Only pending requests can be cancelled');
        }

        try {
            $success = $request->cancel();

            if ($success) {
                // Send notification about cancellation
                $this->notifyRequestCancelled($request);
            }

            return $success;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get pending requests for a therapist
     */
    public function getPendingRequests(int $therapistId): Collection
    {
        $this->validateTherapist($therapistId);

        return ConnectionRequest::with(['requester', 'targetClient'])
            ->forTherapist($therapistId)
            ->pending()
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get requests made by a guardian
     */
    public function getGuardianRequests(int $guardianId): Collection
    {
        $this->validateGuardian($guardianId);

        return ConnectionRequest::with(['targetTherapist', 'targetClient', 'reviewedBy'])
            ->byRequester($guardianId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get all requests (admin view)
     */
    public function getAllRequests(?string $status = null): Collection
    {
        $query = ConnectionRequest::with(['requester', 'targetTherapist', 'targetClient', 'reviewedBy']);

        if ($status) {
            $query->where('status', $status);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Get request statistics for admin dashboard
     */
    public function getRequestStatistics(): array
    {
        return [
            'total_pending' => ConnectionRequest::where('status', self::STATUS_PENDING)->count(),
            'total_approved' => ConnectionRequest::where('status', self::STATUS_APPROVED)->count(),
            'total_declined' => ConnectionRequest::where('status', self::STATUS_DECLINED)->count(),
            'total_cancelled' => ConnectionRequest::where('status', self::STATUS_CANCELLED)->count(),
            'guardian_to_therapist' => ConnectionRequest::where('request_type', self::TYPE_GUARDIAN_TO_THERAPIST)->count(),
            'child_assignments' => ConnectionRequest::where('request_type', self::TYPE_GUARDIAN_CHILD_ASSIGNMENT)->count(),
        ];
    }

    /**
     * Check if two users have an active connection
     */
    private function hasActiveConnection(int $userId1, int $userId2): bool
    {
        return TherapistClientConnection::where(function ($query) use ($userId1, $userId2) {
            $query->where('therapist_id', $userId1)->where('client_id', $userId2);
        })->orWhere(function ($query) use ($userId1, $userId2) {
            $query->where('therapist_id', $userId2)->where('client_id', $userId1);
        })->where('status', 'active')->exists();
    }

    /**
     * Check if there's a pending request between guardian and therapist
     */
    public function hasPendingRequest(int $guardianId, int $therapistId): bool
    {
        return ConnectionRequest::where('requester_id', $guardianId)
            ->where('target_therapist_id', $therapistId)
            ->whereNull('target_client_id')
            ->where('status', self::STATUS_PENDING)
            ->exists();
    }

    /**
     * Check if there's a pending child assignment request
     */
    public function hasPendingChildAssignment(int $guardianId, int $childId, int $therapistId): bool
    {
        return ConnectionRequest::where('requester_id', $guardianId)
            ->where('target_therapist_id', $therapistId)
            ->where('target_client_id', $childId)
            ->where('status', self::STATUS_PENDING)
            ->exists();
    }

    /**
     * Validate that a user is a guardian
     */
    private function validateGuardian(int $userId): User
    {
        $user = User::findOrFail($userId);
        
        if (!$user->hasRole('guardian')) {
            throw new InvalidArgumentException('User must have guardian role');
        }

        return $user;
    }

    /**
     * Validate that a user is a child
     */
    private function validateChild(int $userId): User
    {
        $user = User::findOrFail($userId);
        
        if (!$user->hasRole('child')) {
            throw new InvalidArgumentException('User must have child role');
        }

        return $user;
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
     * Send notifications when a request is created
     */
    private function notifyRequestCreated(ConnectionRequest $request): void
    {
        $this->notificationService->notifyConnectionRequestReceived($request);
    }

    /**
     * Send notifications when a request is approved
     */
    private function notifyRequestApproved(ConnectionRequest $request, TherapistClientConnection $connection, User $approvedBy): void
    {
        $this->notificationService->notifyConnectionRequestApproved($request, $connection, $approvedBy);
    }

    /**
     * Send notifications when a request is declined
     */
    private function notifyRequestDeclined(ConnectionRequest $request, User $declinedBy): void
    {
        $this->notificationService->notifyConnectionRequestDeclined($request, $declinedBy);
    }

    /**
     * Send notifications when a request is cancelled
     */
    private function notifyRequestCancelled(ConnectionRequest $request): void
    {
        // For now, we don't send notifications for cancellations
        // This could be added in the future if needed
    }
}