<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Http\Resources\GroupCollection;
use App\Http\Resources\GroupResource;
use App\Models\Group;
use App\Models\GroupLeaveLog;
use App\Models\User;
use App\Services\GroupPermissionService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class GroupController extends Controller
{
    public function __construct(
        private GroupPermissionService $groupPermissionService
    ) {}

    /**
     * Display a listing of groups.
     * Shows groups based on user permissions and search criteria.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $search = $request->get('search');
        $perPage = $request->get('per_page', 15);

        // Get groups based on user permissions
        $query = $this->groupPermissionService->getViewableGroups($user)->toQuery();

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Load relationships for efficient querying
        $query->with(['creator', 'members']);

        // Order by latest activity (latest message or creation date)
        $query->orderBy('updated_at', 'desc');

        $groups = $query->paginate($perPage);

        return new GroupCollection($groups);
    }

    /**
     * Store a newly created group.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:groups,name',
            'description' => 'nullable|string|max:1000',
            'initial_members' => 'nullable|array',
            'initial_members.*' => 'exists:users,id',
        ]);

        // Check authorization
        if (!$user || !$user->hasAnyRole(['admin', 'therapist', 'guardian'])) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized to create groups.'], 403);
            }
            abort(403, 'Unauthorized to create groups.');
        }

        // Create the group
        $group = Group::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'created_by' => $user->id,
        ]);

        // Set up group permissions (adds creator as admin and all system admins)
        $this->groupPermissionService->setupGroupPermissions($group);

        // Add initial members if provided
        if (!empty($validated['initial_members'])) {
            foreach ($validated['initial_members'] as $userId) {
                $memberUser = User::find($userId);
                if ($memberUser && $this->groupPermissionService->canAddUserToGroup($user, $memberUser, $group)) {
                    $group->addMember($memberUser);
                }
            }
        }

        // Load relationships for response
        $group->load(['creator', 'members']);

        // Handle both API and web requests
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Group created successfully!',
                'group' => new GroupResource($group)
            ], 201);
        }

        // For web requests (Inertia), redirect to groups page with success message
        return redirect()->route('messages.groups')->with('success', 'Group created successfully!');
    }

    /**
     * Display the specified group.
     */
    public function show(Request $request, Group $group)
    {
        $user = $request->user();

        // Check if user can view this group
        if (! $this->groupPermissionService->canViewGroup($user, $group)) {
            return response()->json(['message' => 'Unauthorized to view this group.'], 403);
        }

        // Load relationships
        $group->load(['creator', 'members', 'messages' => function ($query) {
            $query->latest()->limit(1);
        }]);

        return new GroupResource($group);
    }

    /**
     * Update the specified group.
     */
    public function update(UpdateGroupRequest $request, Group $group)
    {
        $group->update($request->validated());

        // Load relationships for response
        $group->load(['creator', 'members']);

        return new GroupResource($group);
    }

    /**
     * Remove the specified group.
     * Only admins can delete groups.
     */
    public function destroy(Request $request, Group $group)
    {
        $user = $request->user();

        // Only admins can delete groups
        if (! $user->hasRole('admin')) {
            return response()->json(['message' => 'Only administrators can delete groups.'], 403);
        }

        // Soft delete by marking as inactive
        $group->update(['is_active' => false]);

        return response()->json(['message' => 'Group has been deactivated successfully.']);
    }

    /**
     * Search for groups that a user can potentially join.
     */
    public function search(Request $request)
    {
        $user = $request->user();
        $search = $request->get('q', '');
        $perPage = $request->get('per_page', 10);

        $query = Group::active()
            ->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            // Exclude groups user is already a member of
            ->whereDoesntHave('members', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->with(['creator', 'members'])
            ->orderBy('name');

        $groups = $query->paginate($perPage);

        return new GroupCollection($groups);
    }

    /**
     * Get groups that the current user can manage.
     */
    public function manageable(Request $request)
    {
        $user = $request->user();
        $groups = $this->groupPermissionService->getManageableGroups($user);

        return new GroupCollection($groups);
    }

    /**
     * Get detailed statistics for a group (admin only).
     */
    public function statistics(Request $request, Group $group)
    {
        $user = $request->user();

        if (! $this->groupPermissionService->canManageGroup($user, $group)) {
            return response()->json(['message' => 'Unauthorized to view group statistics.'], 403);
        }

        $stats = [
            'total_members' => $group->members()->count(),
            'total_admins' => $group->admins()->count(),
            'total_messages' => $group->messages()->count(),
            'messages_today' => $group->messages()->whereDate('created_at', today())->count(),
            'messages_this_week' => $group->messages()->where('created_at', '>=', now()->startOfWeek())->count(),
            'pending_join_requests' => $group->pendingJoinRequests()->count(),
            'recent_leaves' => $group->leaveLogs()->where('left_at', '>=', now()->subDays(30))->count(),
            'most_active_members' => $group->messages()
                ->selectRaw('sender_id, COUNT(*) as message_count')
                ->with('sender:id,name')
                ->groupBy('sender_id')
                ->orderByDesc('message_count')
                ->limit(5)
                ->get()
                ->map(function ($item) {
                    return [
                        'user' => $item->sender->name,
                        'message_count' => $item->message_count,
                    ];
                }),
        ];

        return response()->json($stats);
    }

    /**
     * Submit a join request for a group.
     */
    public function requestJoin(Request $request, Group $group)
    {
        $user = $request->user();

        // Validate request
        $request->validate([
            'message' => 'nullable|string|max:500',
        ]);

        // Check if user is already a member
        if ($group->hasMember($user)) {
            return response()->json(['message' => 'You are already a member of this group.'], 422);
        }

        // Check if user already has a pending request
        $existingRequest = $group->joinRequests()
            ->where('user_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if ($existingRequest) {
            return response()->json(['message' => 'You already have a pending join request for this group.'], 422);
        }

        // Create join request
        $joinRequest = $group->joinRequests()->create([
            'user_id' => $user->id,
            'status' => 'pending',
            'message' => $request->message,
        ]);

        // Load relationships for response
        $joinRequest->load(['user', 'group']);

        // TODO: Send notification to group admins
        // This will be implemented when notification system is added

        return response()->json([
            'message' => 'Join request submitted successfully.',
            'join_request' => $joinRequest,
        ], 201);
    }

    /**
     * Get join requests for a group (admin only).
     */
    public function joinRequests(Request $request, Group $group)
    {
        $user = $request->user();

        // Check if user can manage this group
        if (! $this->groupPermissionService->canManageGroup($user, $group)) {
            return response()->json(['message' => 'Unauthorized to view join requests.'], 403);
        }

        $status = $request->get('status', 'pending');
        $perPage = $request->get('per_page', 15);

        $query = $group->joinRequests()
            ->with(['user', 'reviewer'])
            ->orderBy('created_at', 'desc');

        if ($status && in_array($status, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $status);
        }

        $joinRequests = $query->paginate($perPage);

        return response()->json($joinRequests);
    }

    /**
     * Approve or reject a join request.
     */
    public function reviewJoinRequest(Request $request, Group $group, $requestId)
    {
        $user = $request->user();

        // Check if user can manage this group
        if (! $this->groupPermissionService->canManageGroup($user, $group)) {
            return response()->json(['message' => 'Unauthorized to review join requests.'], 403);
        }

        // Validate request
        $request->validate([
            'action' => 'required|in:approve,reject',
            'reason' => 'nullable|string|max:500',
        ]);

        // Find the join request
        $joinRequest = $group->joinRequests()->findOrFail($requestId);

        // Check if request is still pending
        if (! $joinRequest->isPending()) {
            return response()->json(['message' => 'This join request has already been reviewed.'], 422);
        }

        // Process the action
        if ($request->action === 'approve') {
            $joinRequest->approve($user);
            $message = 'Join request approved successfully.';
        } else {
            $joinRequest->reject($user);
            $message = 'Join request rejected successfully.';
        }

        // Load relationships for response
        $joinRequest->load(['user', 'group', 'reviewer']);

        // TODO: Send notification to the requesting user
        // This will be implemented when notification system is added

        return response()->json([
            'message' => $message,
            'join_request' => $joinRequest,
        ]);
    }

    /**
     * Get user's own join requests.
     */
    public function myJoinRequests(Request $request)
    {
        $user = $request->user();
        $perPage = $request->get('per_page', 15);

        $joinRequests = $user->groupJoinRequests()
            ->with(['group', 'reviewer'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json($joinRequests);
    }

    /**
     * Leave a group with reason.
     */
    public function leaveGroup(Request $request, Group $group)
    {
        $user = $request->user();

        // Validate request
        $request->validate([
            'reason' => 'required|in:no_longer_relevant,too_busy,found_better_support,privacy_concerns,other',
            'custom_reason' => 'required_if:reason,other|nullable|string|max:500',
        ]);

        // Check if user is a member of the group
        if (! $group->hasMember($user)) {
            return response()->json(['message' => 'You are not a member of this group.'], 422);
        }

        // Check if user is the only admin (prevent leaving if so)
        $adminCount = $group->admins()->count();
        $isAdmin = $group->hasAdmin($user);

        if ($isAdmin && $adminCount === 1) {
            return response()->json([
                'message' => 'You cannot leave the group as you are the only admin. Please promote another member to admin first or contact an administrator.',
            ], 422);
        }

        // Create leave log
        $leaveLog = GroupLeaveLog::createLog(
            $group,
            $user,
            $request->reason,
            $request->custom_reason
        );

        // Remove user from group
        $group->removeMember($user, $user, $request->reason);

        // Load relationships for response
        $leaveLog->load(['group', 'user']);

        // TODO: Send notification to group admins about member leaving
        // This will be implemented when notification system is added

        return response()->json([
            'message' => 'You have successfully left the group.',
            'leave_log' => $leaveLog,
        ]);
    }

    /**
     * Get leave logs for a group (admin only).
     */
    public function leaveLogs(Request $request, Group $group)
    {
        $user = $request->user();

        // Check if user can manage this group
        if (! $this->groupPermissionService->canManageGroup($user, $group)) {
            return response()->json(['message' => 'Unauthorized to view leave logs.'], 403);
        }

        $perPage = $request->get('per_page', 15);
        $reason = $request->get('reason');
        $days = $request->get('days', 30);

        $query = $group->leaveLogs()
            ->with(['user'])
            ->recent($days)
            ->orderBy('left_at', 'desc');

        if ($reason && in_array($reason, ['no_longer_relevant', 'too_busy', 'found_better_support', 'privacy_concerns', 'other'])) {
            $query->byReason($reason);
        }

        $leaveLogs = $query->paginate($perPage);

        return response()->json($leaveLogs);
    }

    /**
     * Get leave reasons summary for a group (admin only).
     */
    public function leaveReasonsSummary(Request $request, Group $group)
    {
        $user = $request->user();

        // Check if user can manage this group
        if (! $this->groupPermissionService->canManageGroup($user, $group)) {
            return response()->json(['message' => 'Unauthorized to view leave reasons summary.'], 403);
        }

        $days = $request->get('days', 30);

        $summary = $group->leaveLogs()
            ->recent($days)
            ->selectRaw('reason, COUNT(*) as count')
            ->groupBy('reason')
            ->get()
            ->mapWithKeys(function ($item) {
                $readableReason = match ($item->reason) {
                    'no_longer_relevant' => 'No longer relevant',
                    'too_busy' => 'Too busy',
                    'found_better_support' => 'Found better support',
                    'privacy_concerns' => 'Privacy concerns',
                    'other' => 'Other',
                    default => 'Unknown',
                };

                return [$readableReason => $item->count];
            });

        return response()->json([
            'period_days' => $days,
            'total_leaves' => $summary->sum(),
            'reasons' => $summary,
        ]);
    }

    /**
     * Add a member to the group.
     */
    public function addMember(Request $request, Group $group)
    {
        $user = $request->user();

        // Check if user can add members to this group
        if (! $this->groupPermissionService->canManageMembers($user, $group)) {
            abort(403, 'You are not authorized to add members to this group');
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $memberUser = User::findOrFail($request->user_id);

        // Check if user can be added to this group
        if (! $this->groupPermissionService->canAddUserToGroup($user, $memberUser, $group)) {
            abort(403, 'This user cannot be added to the group');
        }

        // Check if user is already a member
        if ($group->hasMember($memberUser)) {
            return response()->json(['message' => 'User is already a member of this group'], 422);
        }

        // Add member to group
        $group->addMember($memberUser, 'member', $user);

        return response()->json([
            'message' => 'Member added successfully',
            'member' => $memberUser->load('roles'),
        ], 201);
    }

    /**
     * Remove a member from the group.
     */
    public function removeMember(Request $request, Group $group, User $memberUser)
    {
        $user = $request->user();

        // Check if user can remove members from this group
        if (! $this->groupPermissionService->canManageMembers($user, $group)) {
            abort(403, 'You are not authorized to remove members from this group');
        }

        // Check if the user is actually a member
        if (! $group->hasMember($memberUser)) {
            return response()->json(['message' => 'User is not a member of this group'], 422);
        }

        // Remove member from group
        $group->removeMember($memberUser, $user, 'Removed by admin');

        return response()->json([
            'message' => 'Member removed successfully',
        ]);
    }
}
