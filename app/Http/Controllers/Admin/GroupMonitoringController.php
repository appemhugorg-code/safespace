<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\GroupJoinRequest;
use App\Models\GroupLeaveLog;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GroupMonitoringController extends Controller
{
    /**
     * Get overview dashboard data for admin group monitoring.
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();

        // Ensure user is admin
        if (! $user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $timeframe = $request->get('timeframe', '30'); // days
        $startDate = now()->subDays((int) $timeframe);

        $data = [
            'overview' => $this->getOverviewStats($startDate),
            'recent_activity' => $this->getRecentActivity($startDate),
            'group_analytics' => $this->getGroupAnalytics($startDate),
            'flagged_content' => $this->getFlaggedContent(),
            'join_requests' => $this->getPendingJoinRequests(),
        ];

        return response()->json($data);
    }

    /**
     * Get detailed group information for admin review.
     */
    public function groupDetails(Request $request, Group $group)
    {
        $user = $request->user();

        if (! $user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $timeframe = $request->get('timeframe', '30');
        $startDate = now()->subDays((int) $timeframe);

        $group->load(['creator', 'members', 'admins']);

        $data = [
            'group' => $group,
            'statistics' => $this->getGroupStatistics($group, $startDate),
            'recent_messages' => $this->getRecentMessages($group, 20),
            'member_activity' => $this->getMemberActivity($group, $startDate),
            'join_requests' => $group->joinRequests()->with('user')->latest()->limit(10)->get(),
            'leave_logs' => $group->leaveLogs()->with('user')->latest()->limit(10)->get(),
        ];

        return response()->json($data);
    }

    /**
     * Get all groups with monitoring data.
     */
    public function allGroups(Request $request)
    {
        $user = $request->user();

        if (! $user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $search = $request->get('search');
        $perPage = $request->get('per_page', 15);
        $sortBy = $request->get('sort_by', 'updated_at');
        $sortOrder = $request->get('sort_order', 'desc');

        $query = Group::with(['creator', 'members'])
            ->withCount(['members', 'messages', 'pendingJoinRequests']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('creator', function ($creatorQuery) use ($search) {
                        $creatorQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Add recent activity data
        $query->addSelect([
            'latest_message_at' => Message::select('created_at')
                ->whereColumn('group_id', 'groups.id')
                ->latest()
                ->limit(1),
            'messages_today' => Message::selectRaw('COUNT(*)')
                ->whereColumn('group_id', 'groups.id')
                ->whereDate('created_at', today()),
            'messages_this_week' => Message::selectRaw('COUNT(*)')
                ->whereColumn('group_id', 'groups.id')
                ->where('created_at', '>=', now()->startOfWeek()),
        ]);

        $validSortColumns = ['name', 'created_at', 'updated_at', 'members_count', 'messages_count'];
        if (in_array($sortBy, $validSortColumns)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $groups = $query->paginate($perPage);

        return response()->json($groups);
    }

    /**
     * Get flagged messages for admin review.
     */
    public function flaggedMessages(Request $request)
    {
        $user = $request->user();

        if (! $user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $perPage = $request->get('per_page', 15);
        $status = $request->get('status', 'pending'); // pending, reviewed, dismissed

        $query = Message::where('is_flagged', true)
            ->with(['sender', 'recipient', 'group'])
            ->latest();

        // For now, we'll use is_flagged as the main filter
        // In a real implementation, you'd have a separate flags table with status

        $messages = $query->paginate($perPage);

        return response()->json($messages);
    }

    /**
     * Dissolve a group (admin action).
     */
    public function dissolveGroup(Request $request, Group $group)
    {
        $user = $request->user();

        if (! $user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        // Mark group as inactive
        $group->update(['is_active' => false]);

        // Log the dissolution
        DB::table('group_dissolution_logs')->insert([
            'group_id' => $group->id,
            'dissolved_by' => $user->id,
            'reason' => $request->reason,
            'dissolved_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // TODO: Notify all group members about dissolution
        // This would be implemented with the notification system

        return response()->json([
            'message' => 'Group has been dissolved successfully.',
            'group' => $group,
        ]);
    }

    /**
     * Get overview statistics.
     */
    private function getOverviewStats($startDate)
    {
        return [
            'total_groups' => Group::active()->count(),
            'total_members' => DB::table('group_members')->count(),
            'new_groups' => Group::where('created_at', '>=', $startDate)->count(),
            'total_messages' => Message::where('message_type', 'group')->count(),
            'messages_period' => Message::where('message_type', 'group')
                ->where('created_at', '>=', $startDate)
                ->count(),
            'pending_join_requests' => GroupJoinRequest::where('status', 'pending')->count(),
            'flagged_messages' => Message::where('is_flagged', true)->count(),
            'groups_dissolved' => Group::where('is_active', false)->count(),
        ];
    }

    /**
     * Get recent activity across all groups.
     */
    private function getRecentActivity($startDate)
    {
        $activities = collect();

        // Recent group creations
        $newGroups = Group::with('creator')
            ->where('created_at', '>=', $startDate)
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($group) {
                return [
                    'type' => 'group_created',
                    'timestamp' => $group->created_at,
                    'data' => [
                        'group_name' => $group->name,
                        'creator' => $group->creator->name,
                    ],
                ];
            });

        // Recent join requests
        $joinRequests = GroupJoinRequest::with(['user', 'group'])
            ->where('created_at', '>=', $startDate)
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($request) {
                return [
                    'type' => 'join_request',
                    'timestamp' => $request->created_at,
                    'data' => [
                        'user' => $request->user->name,
                        'group_name' => $request->group->name,
                        'status' => $request->status,
                    ],
                ];
            });

        // Recent leaves
        $leaves = GroupLeaveLog::with(['user', 'group'])
            ->where('left_at', '>=', $startDate)
            ->latest('left_at')
            ->limit(5)
            ->get()
            ->map(function ($leave) {
                return [
                    'type' => 'member_left',
                    'timestamp' => $leave->left_at,
                    'data' => [
                        'user' => $leave->user->name,
                        'group_name' => $leave->group->name,
                        'reason' => $leave->reason,
                    ],
                ];
            });

        return $activities
            ->merge($newGroups)
            ->merge($joinRequests)
            ->merge($leaves)
            ->sortByDesc('timestamp')
            ->take(15)
            ->values();
    }

    /**
     * Get group analytics data.
     */
    private function getGroupAnalytics($startDate)
    {
        return [
            'most_active_groups' => Group::withCount(['messages' => function ($query) use ($startDate) {
                $query->where('created_at', '>=', $startDate);
            }])
                ->get(['id', 'name', 'messages_count'])
                ->where('messages_count', '>', 0)
                ->sortByDesc('messages_count')
                ->take(10)
                ->values(),

            'largest_groups' => Group::withCount('members')
                ->orderByDesc('members_count')
                ->limit(10)
                ->get(['id', 'name', 'members_count']),

            'leave_reasons' => GroupLeaveLog::where('left_at', '>=', $startDate)
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
                }),
        ];
    }

    /**
     * Get flagged content summary.
     */
    private function getFlaggedContent()
    {
        return [
            'total_flagged' => Message::where('is_flagged', true)->count(),
            'pending_review' => Message::where('is_flagged', true)->count(), // Simplified for now
            'recent_flags' => Message::where('is_flagged', true)
                ->with(['sender', 'group'])
                ->latest()
                ->limit(5)
                ->get()
                ->map(function ($message) {
                    return [
                        'id' => $message->id,
                        'content' => substr($message->content, 0, 100).'...',
                        'sender' => $message->sender->name,
                        'group' => $message->group ? $message->group->name : 'Direct Message',
                        'created_at' => $message->created_at,
                    ];
                }),
        ];
    }

    /**
     * Get pending join requests summary.
     */
    private function getPendingJoinRequests()
    {
        return GroupJoinRequest::where('status', 'pending')
            ->with(['user', 'group'])
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'user' => $request->user->name,
                    'user_role' => $request->user->roles->first()?->name ?? 'Unknown',
                    'group' => $request->group->name,
                    'message' => $request->message,
                    'created_at' => $request->created_at,
                ];
            });
    }

    /**
     * Get detailed statistics for a specific group.
     */
    private function getGroupStatistics(Group $group, $startDate)
    {
        return [
            'total_members' => $group->members()->count(),
            'total_admins' => $group->admins()->count(),
            'total_messages' => $group->messages()->count(),
            'messages_period' => $group->messages()->where('created_at', '>=', $startDate)->count(),
            'messages_today' => $group->messages()->whereDate('created_at', today())->count(),
            'pending_requests' => $group->pendingJoinRequests()->count(),
            'recent_leaves' => $group->leaveLogs()->where('left_at', '>=', $startDate)->count(),
            'average_messages_per_day' => $group->messages()
                ->where('created_at', '>=', $startDate)
                ->count() / max(1, $startDate->diffInDays(now())),
        ];
    }

    /**
     * Get recent messages for a group.
     */
    private function getRecentMessages(Group $group, int $limit = 20)
    {
        return $group->messages()
            ->with('sender')
            ->latest()
            ->limit($limit)
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'content' => $message->content,
                    'sender' => $message->sender->name,
                    'sender_role' => $message->sender->roles->first()?->name ?? 'Unknown',
                    'created_at' => $message->created_at,
                    'is_flagged' => $message->is_flagged,
                ];
            });
    }

    /**
     * Get member activity for a group.
     */
    private function getMemberActivity(Group $group, $startDate)
    {
        return $group->messages()
            ->where('created_at', '>=', $startDate)
            ->selectRaw('sender_id, COUNT(*) as message_count')
            ->with('sender:id,name')
            ->groupBy('sender_id')
            ->orderByDesc('message_count')
            ->get()
            ->map(function ($item) {
                return [
                    'user' => $item->sender->name,
                    'user_role' => $item->sender->roles->first()?->name ?? 'Unknown',
                    'message_count' => $item->message_count,
                ];
            });
    }
}
