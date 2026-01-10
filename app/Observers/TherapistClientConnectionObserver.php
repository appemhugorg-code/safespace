<?php

namespace App\Observers;

use App\Models\TherapistClientConnection;
use App\Services\ConnectionPermissionService;

class TherapistClientConnectionObserver
{
    protected ConnectionPermissionService $permissionService;
    protected static array $oldStatuses = [];

    public function __construct(ConnectionPermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Handle the TherapistClientConnection "updating" event.
     */
    public function updating(TherapistClientConnection $connection): void
    {
        // Check if status is changing
        if ($connection->isDirty('status')) {
            $oldStatus = $connection->getOriginal('status');
            
            // Store the old status using connection ID as key
            static::$oldStatuses[$connection->id] = $oldStatus;
        }
    }

    /**
     * Handle the TherapistClientConnection "updated" event.
     */
    public function updated(TherapistClientConnection $connection): void
    {
        // Check if status was changed
        if (isset(static::$oldStatuses[$connection->id])) {
            $oldStatus = static::$oldStatuses[$connection->id];
            $newStatus = $connection->status;

            // Update permissions based on status change
            $this->permissionService->updatePermissionsOnStatusChange($connection, $oldStatus, $newStatus);

            // Clean up the stored old status
            unset(static::$oldStatuses[$connection->id]);
        }
    }
}