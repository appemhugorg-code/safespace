<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\MessageFlag;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContentModerationController extends Controller
{
    /**
     * Get all flagged messages for admin review.
     */
    public function flaggedMessages(Request $request)
    {
        $user = $request->user();

        if (! $user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $status = $request->get('status', 'pending');
        $flagType = $request->get('flag_type');
        $perPage = $request->get('per_page', 15);

        $query = MessageFlag::with(['message.sender', 'message.group', 'flagger', 'reviewer'])
            ->orderBy('created_at', 'desc');

        if ($status && in_array($status, ['pending', 'reviewed', 'dismissed', 'action_taken'])) {
            $query->where('status', $status);
        }

        if ($flagType && in_array($flagType, ['inappropriate', 'spam', 'harassment', 'violence', 'self_harm', 'other'])) {
            $query->where('flag_type', $flagType);
        }

        $flags = $query->paginate($perPage);

        return response()->json($flags);
    }

    /**
     * Flag a message for moderation.
     */
    public function flagMessage(Request $request, Message $message)
    {
        $user = $request->user();

        $request->validate([
            'flag_type' => 'required|in:inappropriate,spam,harassment,violence,self_harm,other',
            'reason' => 'nullable|string|max:500',
        ]);

        // Check if user already flagged this message
        $existingFlag = MessageFlag::where('message_id', $message->id)
            ->where('flagged_by', $user->id)
            ->first();

        if ($existingFlag) {
            return response()->json(['message' => 'You have already flagged this message.'], 422);
        }

        // Create the flag
        $flag = MessageFlag::create([
            'message_id' => $message->id,
            'flagged_by' => $user->id,
            'flag_type' => $request->flag_type,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        // Mark message as flagged
        $message->update(['is_flagged' => true]);

        // Load relationships for response
        $flag->load(['message.sender', 'message.group', 'flagger']);

        // TODO: Send notification to admins about new flag
        // This would be implemented with the notification system

        return response()->json([
            'message' => 'Message has been flagged for review.',
            'flag' => $flag,
        ], 201);
    }

    /**
     * Review a flagged message.
     */
    public function reviewFlag(Request $request, MessageFlag $flag)
    {
        $user = $request->user();

        if (! $user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'action' => 'required|in:dismiss,warning,remove_message,suspend_user',
            'notes' => 'nullable|string|max:1000',
        ]);

        if (! $flag->isPending()) {
            return response()->json(['message' => 'This flag has already been reviewed.'], 422);
        }

        DB::transaction(function () use ($flag, $user, $request) {
            switch ($request->action) {
                case 'dismiss':
                    $flag->dismiss($user, $request->notes);
                    break;

                case 'warning':
                    $flag->markAsReviewed($user, 'warning', $request->notes);
                    $this->issueWarning($flag->message->sender, $flag, $request->notes);
                    break;

                case 'remove_message':
                    $flag->markAsReviewed($user, 'message_removed', $request->notes);
                    $this->removeMessage($flag->message, $user, $request->notes);
                    break;

                case 'suspend_user':
                    $flag->markAsReviewed($user, 'user_suspended', $request->notes);
                    $this->suspendUser($flag->message->sender, $user, $request->notes);
                    break;
            }
        });

        // Load relationships for response
        $flag->load(['message.sender', 'message.group', 'flagger', 'reviewer']);

        return response()->json([
            'message' => 'Flag has been reviewed successfully.',
            'flag' => $flag,
        ]);
    }

    /**
     * Get moderation statistics.
     */
    public function statistics(Request $request)
    {
        $user = $request->user();

        if (! $user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $timeframe = $request->get('timeframe', '30');
        $startDate = now()->subDays((int) $timeframe);

        $stats = [
            'total_flags' => MessageFlag::count(),
            'pending_flags' => MessageFlag::pending()->count(),
            'flags_period' => MessageFlag::where('created_at', '>=', $startDate)->count(),
            'flags_by_type' => MessageFlag::selectRaw('flag_type, COUNT(*) as count')
                ->where('created_at', '>=', $startDate)
                ->groupBy('flag_type')
                ->get()
                ->mapWithKeys(function ($item) {
                    return [$item->flag_type => $item->count];
                }),
            'actions_taken' => MessageFlag::whereNotNull('action_taken')
                ->where('reviewed_at', '>=', $startDate)
                ->selectRaw('action_taken, COUNT(*) as count')
                ->groupBy('action_taken')
                ->get()
                ->mapWithKeys(function ($item) {
                    return [$item->action_taken => $item->count];
                }),
            'most_flagged_users' => Message::whereHas('flags', function ($query) use ($startDate) {
                $query->where('created_at', '>=', $startDate);
            })
                ->selectRaw('sender_id, COUNT(*) as flag_count')
                ->with('sender:id,name')
                ->groupBy('sender_id')
                ->orderByDesc('flag_count')
                ->limit(10)
                ->get()
                ->map(function ($item) {
                    return [
                        'user' => $item->sender->name,
                        'flag_count' => $item->flag_count,
                    ];
                }),
            'recent_actions' => MessageFlag::whereNotNull('reviewed_at')
                ->where('reviewed_at', '>=', $startDate)
                ->with(['message.sender', 'reviewer'])
                ->orderByDesc('reviewed_at')
                ->limit(10)
                ->get()
                ->map(function ($flag) {
                    return [
                        'id' => $flag->id,
                        'action' => $flag->action_taken_display,
                        'user' => $flag->message->sender->name,
                        'reviewer' => $flag->reviewer->name,
                        'reviewed_at' => $flag->reviewed_at,
                    ];
                }),
        ];

        return response()->json($stats);
    }

    /**
     * Get automated content filtering results.
     */
    public function automatedFiltering(Request $request)
    {
        $user = $request->user();

        if (! $user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // This would integrate with automated content filtering
        // For now, return placeholder data
        return response()->json([
            'enabled' => true,
            'filters' => [
                'profanity' => ['enabled' => true, 'sensitivity' => 'medium'],
                'spam' => ['enabled' => true, 'sensitivity' => 'high'],
                'harassment' => ['enabled' => true, 'sensitivity' => 'high'],
                'self_harm' => ['enabled' => true, 'sensitivity' => 'high'],
            ],
            'recent_detections' => [],
        ]);
    }

    /**
     * Update automated filtering settings.
     */
    public function updateFilteringSettings(Request $request)
    {
        $user = $request->user();

        if (! $user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'filters' => 'required|array',
            'filters.*.enabled' => 'required|boolean',
            'filters.*.sensitivity' => 'required|in:low,medium,high',
        ]);

        // This would update automated filtering settings
        // For now, just return success
        return response()->json([
            'message' => 'Filtering settings updated successfully.',
            'settings' => $request->filters,
        ]);
    }

    /**
     * Issue a warning to a user.
     */
    private function issueWarning(User $user, MessageFlag $flag, ?string $notes = null)
    {
        // Create warning record
        DB::table('user_warnings')->insert([
            'user_id' => $user->id,
            'message_flag_id' => $flag->id,
            'reason' => $flag->flag_type_display,
            'notes' => $notes,
            'issued_by' => auth()->id(),
            'issued_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // TODO: Send warning notification to user
        // This would be implemented with the notification system
    }

    /**
     * Remove a message.
     */
    private function removeMessage(Message $message, User $admin, ?string $reason = null)
    {
        // Soft delete by updating content
        $message->update([
            'content' => '[Message removed by administrator]',
            'is_flagged' => true,
        ]);

        // Log the removal
        DB::table('message_removals')->insert([
            'message_id' => $message->id,
            'removed_by' => $admin->id,
            'reason' => $reason,
            'removed_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // TODO: Notify relevant users about message removal
        // This would be implemented with the notification system
    }

    /**
     * Suspend a user.
     */
    private function suspendUser(User $user, User $admin, ?string $reason = null)
    {
        // Update user status
        $user->update(['status' => 'suspended']);

        // Log the suspension
        DB::table('user_suspensions')->insert([
            'user_id' => $user->id,
            'suspended_by' => $admin->id,
            'reason' => $reason,
            'suspended_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // TODO: Send suspension notification to user
        // This would be implemented with the notification system
    }
}
