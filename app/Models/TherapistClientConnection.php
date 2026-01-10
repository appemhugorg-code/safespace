<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class TherapistClientConnection extends Model
{
    use HasFactory;

    protected $fillable = [
        'therapist_id',
        'client_id',
        'client_type',
        'connection_type',
        'status',
        'assigned_by',
        'assigned_at',
        'terminated_at',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'terminated_at' => 'datetime',
    ];

    /**
     * Get the therapist user.
     */
    public function therapist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'therapist_id');
    }

    /**
     * Get the client user.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    /**
     * Get the user who assigned this connection.
     */
    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    /**
     * Scope to get only active connections.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to get connections for a specific therapist.
     */
    public function scopeForTherapist(Builder $query, int $therapistId): Builder
    {
        return $query->where('therapist_id', $therapistId);
    }

    /**
     * Scope to get connections for a specific client.
     */
    public function scopeForClient(Builder $query, int $clientId): Builder
    {
        return $query->where('client_id', $clientId);
    }

    /**
     * Scope to get connections by client type.
     */
    public function scopeByClientType(Builder $query, string $clientType): Builder
    {
        return $query->where('client_type', $clientType);
    }

    /**
     * Check if the connection is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if the connection is terminated.
     */
    public function isTerminated(): bool
    {
        return $this->status === 'terminated';
    }

    /**
     * Terminate the connection.
     */
    public function terminate(User $terminatedBy): bool
    {
        $oldStatus = $this->status;
        
        $this->update([
            'status' => 'terminated',
            'terminated_at' => now(),
        ]);

        // Trigger permission updates through the service
        $permissionService = app(\App\Services\ConnectionPermissionService::class);
        $permissionService->updatePermissionsOnStatusChange($this, $oldStatus, 'terminated');

        // Log the termination (could be expanded to include reason)
        // This could integrate with an audit log system
        
        return true;
    }

    /**
     * Get the connection duration in days.
     */
    public function getDurationInDays(): int
    {
        $endDate = $this->terminated_at ?? now();
        return $this->assigned_at->diffInDays($endDate);
    }

    /**
     * Check if this is a guardian connection.
     */
    public function isGuardianConnection(): bool
    {
        return $this->client_type === 'guardian';
    }

    /**
     * Check if this is a child connection.
     */
    public function isChildConnection(): bool
    {
        return $this->client_type === 'child';
    }

    /**
     * Check if this connection was admin assigned.
     */
    public function isAdminAssigned(): bool
    {
        return $this->connection_type === 'admin_assigned';
    }

    /**
     * Check if this connection was guardian requested.
     */
    public function isGuardianRequested(): bool
    {
        return $this->connection_type === 'guardian_requested';
    }

    /**
     * Check if this is a guardian child assignment.
     */
    public function isGuardianChildAssignment(): bool
    {
        return $this->connection_type === 'guardian_child_assignment';
    }
}