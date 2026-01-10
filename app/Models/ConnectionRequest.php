<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class ConnectionRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'requester_id',
        'requester_type',
        'target_therapist_id',
        'target_client_id',
        'request_type',
        'status',
        'message',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    /**
     * Get the user who made the request.
     */
    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    /**
     * Get the target therapist.
     */
    public function targetTherapist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'target_therapist_id');
    }

    /**
     * Get the target client (for child assignments).
     */
    public function targetClient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'target_client_id');
    }

    /**
     * Get the user who reviewed the request.
     */
    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Scope to get only pending requests.
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope to get requests for a specific therapist.
     */
    public function scopeForTherapist(Builder $query, int $therapistId): Builder
    {
        return $query->where('target_therapist_id', $therapistId);
    }

    /**
     * Scope to get requests by a specific requester.
     */
    public function scopeByRequester(Builder $query, int $requesterId): Builder
    {
        return $query->where('requester_id', $requesterId);
    }

    /**
     * Scope to get requests by type.
     */
    public function scopeByType(Builder $query, string $requestType): Builder
    {
        return $query->where('request_type', $requestType);
    }

    /**
     * Check if the request is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the request is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if the request is declined.
     */
    public function isDeclined(): bool
    {
        return $this->status === 'declined';
    }

    /**
     * Check if the request is cancelled.
     */
    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    /**
     * Approve the connection request and create the therapeutic relationship.
     */
    public function approve(User $reviewer): TherapistClientConnection
    {
        if (!$this->isPending()) {
            throw new \Exception('Request has already been processed');
        }

        // Update request status
        $this->update([
            'status' => 'approved',
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
        ]);

        // Determine client type and connection type
        $clientId = $this->target_client_id ?? $this->requester_id;
        $clientType = $this->request_type === 'guardian_child_assignment' ? 'child' : 'guardian';
        $connectionType = $this->request_type === 'guardian_child_assignment' 
            ? 'guardian_child_assignment' 
            : 'guardian_requested';

        // Create the therapeutic relationship
        $connection = TherapistClientConnection::create([
            'therapist_id' => $this->target_therapist_id,
            'client_id' => $clientId,
            'client_type' => $clientType,
            'connection_type' => $connectionType,
            'status' => 'active',
            'assigned_by' => $reviewer->id,
            'assigned_at' => now(),
        ]);

        return $connection;
    }

    /**
     * Decline the connection request.
     */
    public function decline(User $reviewer): bool
    {
        if (!$this->isPending()) {
            throw new \Exception('Request has already been processed');
        }

        $this->update([
            'status' => 'declined',
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
        ]);

        return true;
    }

    /**
     * Cancel the connection request.
     */
    public function cancel(): bool
    {
        if (!$this->isPending()) {
            throw new \Exception('Request has already been processed');
        }

        $this->update([
            'status' => 'cancelled',
        ]);

        return true;
    }

    /**
     * Check if this is a guardian-to-therapist request.
     */
    public function isGuardianToTherapistRequest(): bool
    {
        return $this->request_type === 'guardian_to_therapist';
    }

    /**
     * Check if this is a guardian child assignment request.
     */
    public function isGuardianChildAssignmentRequest(): bool
    {
        return $this->request_type === 'guardian_child_assignment';
    }

    /**
     * Get the client user for this request.
     */
    public function getClientUser(): User
    {
        return $this->target_client_id 
            ? $this->targetClient 
            : $this->requester;
    }
}