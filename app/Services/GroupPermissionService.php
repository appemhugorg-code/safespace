<?php

namespace App\Services;

use App\Models\Group;
use App\Models\User;

class GroupPermissionService
{
    /**
     * Add all admins to a group automatically.
     * This ensures admins can monitor all group activities.
     */
    public function addAllAdminsToGroup(Group $group): void
    {
        $admins = User::role('admin')->get();

        foreach ($admins as $admin) {
            if (! $group->hasMember($admin)) {
                $group->addMember($admin, 'admin');
            }
        }
    }

    /**
     * Set up initial group permissions when a group is created.
     */
    public function setupGroupPermissions(Group $group): void
    {
        // Add the creator as an admin if they're not already
        if (! $group->hasAdmin($group->creator)) {
            $group->addMember($group->creator, 'admin');
        }

        // Add all system admins to the group for monitoring
        $this->addAllAdminsToGroup($group);
    }

    /**
     * Check if a user can create groups.
     */
    public function canCreateGroups(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'therapist', 'guardian']);
    }

    /**
     * Check if a user can manage a specific group.
     */
    public function canManageGroup(User $user, Group $group): bool
    {
        return $user->hasRole('admin') || $group->hasAdmin($user);
    }

    /**
     * Check if a user can add members to a group.
     */
    public function canAddMembers(User $user, Group $group): bool
    {
        return $this->canManageGroup($user, $group);
    }

    /**
     * Check if a user can remove members from a group.
     */
    public function canRemoveMembers(User $user, Group $group): bool
    {
        return $this->canManageGroup($user, $group);
    }

    /**
     * Check if a user can manage members (add/remove) in a group.
     */
    public function canManageMembers(User $user, Group $group): bool
    {
        return $this->canManageGroup($user, $group);
    }

    /**
     * Check if a user can join a group.
     * Therapists can only add Children, Guardians, or other Therapists.
     */
    public function canAddUserToGroup(User $adder, User $userToAdd, Group $group): bool
    {
        // Admins can add anyone
        if ($adder->hasRole('admin')) {
            return true;
        }

        // Group admins can add members
        if (! $group->hasAdmin($adder)) {
            return false;
        }

        // Therapists can only add Children, Guardians, or other Therapists
        if ($adder->hasRole('therapist')) {
            return $userToAdd->hasAnyRole(['child', 'guardian', 'therapist']);
        }

        // Guardians can add their own children, other guardians, and therapists
        if ($adder->hasRole('guardian')) {
            // Can add their own children
            if ($userToAdd->hasRole('child') && $userToAdd->guardian_id === $adder->id) {
                return true;
            }
            // Can add other guardians and therapists
            return $userToAdd->hasAnyRole(['guardian', 'therapist']);
        }

        return false;
    }

    /**
     * Check if a user can view a group.
     */
    public function canViewGroup(User $user, Group $group): bool
    {
        // Admins and therapists can view all groups
        if ($user->hasAnyRole(['admin', 'therapist'])) {
            return true;
        }

        // Members can view their groups
        return $group->hasMember($user);
    }

    /**
     * Check if a user can send messages to a group.
     */
    public function canSendMessage(User $user, Group $group): bool
    {
        return $group->hasMember($user);
    }

    /**
     * Check if a user can approve join requests for a group.
     */
    public function canApproveJoinRequests(User $user, Group $group): bool
    {
        return $this->canManageGroup($user, $group);
    }

    /**
     * Get groups that a user can manage.
     */
    public function getManageableGroups(User $user)
    {
        if ($user->hasRole('admin')) {
            return Group::active()->get();
        }

        return $user->adminGroups()->active()->get();
    }

    /**
     * Get groups that a user can view.
     */
    public function getViewableGroups(User $user)
    {
        if ($user->hasAnyRole(['admin', 'therapist'])) {
            return Group::active()->get();
        }

        return $user->groups()->active()->get();
    }
}
