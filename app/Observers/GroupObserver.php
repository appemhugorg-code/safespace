<?php

namespace App\Observers;

use App\Models\Group;
use App\Services\GroupPermissionService;

class GroupObserver
{
    public function __construct(
        private GroupPermissionService $groupPermissionService
    ) {}

    /**
     * Handle the Group "created" event.
     * Automatically add the creator and all admins to the group.
     */
    public function created(Group $group): void
    {
        $this->groupPermissionService->setupGroupPermissions($group);
    }

    /**
     * Handle the Group "updated" event.
     */
    public function updated(Group $group): void
    {
        //
    }

    /**
     * Handle the Group "deleted" event.
     */
    public function deleted(Group $group): void
    {
        //
    }

    /**
     * Handle the Group "restored" event.
     */
    public function restored(Group $group): void
    {
        //
    }

    /**
     * Handle the Group "force deleted" event.
     */
    public function forceDeleted(Group $group): void
    {
        //
    }
}
