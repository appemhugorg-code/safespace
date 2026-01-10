<?php

namespace App\Http\Controllers;

use App\Events\GroupMessageSent;
use App\Events\MessageSent;
use App\Models\Group;
use App\Models\Message;
use App\Models\User;
use App\Services\ContentModerationService;
use App\Services\GroupPermissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function __construct(
        private GroupPermissionService $groupPermissionService,
        private ContentModerationService $contentModerationService,
        private \App\Services\ConnectionPermissionService $connectionPermissionService
    ) {}

    /**
     * Display the messaging interface.
     */
    public function index()
    {
        $user = auth()->user();

        // Get conversations
        $conversations = Message::getConversationsFor($user->id);

        // Get available contacts based on user role
        $contacts = $this->getAvailableContacts($user);

        return Inertia::render('messages/index', [
            'conversations' => $conversations,
            'contacts' => $contacts,
        ]);
    }

    /**
     * Display a specific conversation.
     */
    public function conversation(User $contact)
    {
        $user = auth()->user();

        \Log::info('Loading conversation', [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'contact_id' => $contact->id,
            'contact_name' => $contact->name,
        ]);

        // Use permission service to check if conversation is allowed
        if (!$this->connectionPermissionService->canMessage($user, $contact)) {
            \Log::warning('Conversation not allowed based on therapeutic connections', [
                'user_id' => $user->id,
                'contact_id' => $contact->id,
            ]);
            abort(403, 'You cannot message this user. A therapeutic connection is required.');
        }

        // Get conversation messages
        $messages = Message::conversation($user->id, $contact->id)
            ->with(['sender', 'recipient'])
            ->orderBy('created_at', 'asc')
            ->get();

        \Log::info('Loaded conversation messages', [
            'user_id' => $user->id,
            'contact_id' => $contact->id,
            'message_count' => $messages->count(),
        ]);

        // Mark messages as read
        $unreadCount = Message::where('sender_id', $contact->id)
            ->where('recipient_id', $user->id)
            ->where('is_read', false)
            ->count();

        if ($unreadCount > 0) {
            Message::where('sender_id', $contact->id)
                ->where('recipient_id', $user->id)
                ->where('is_read', false)
                ->update(['is_read' => true, 'read_at' => now()]);

            \Log::info('Marked messages as read', [
                'user_id' => $user->id,
                'contact_id' => $contact->id,
                'unread_count' => $unreadCount,
            ]);
        }

        // Get all conversations for sidebar
        $conversations = Message::getConversationsFor($user->id);

        // Get available contacts
        $contacts = $this->getAvailableContacts($user);

        return Inertia::render('messages/conversation', [
            'contact' => $contact->load('roles'),
            'messages' => $messages,
            'conversations' => $conversations,
            'contacts' => $contacts,
            'currentUser' => $user->load('roles'),
        ]);
    }

    /**
     * Display the groups interface.
     */
    public function groups()
    {
        $user = auth()->user();

        // Get user's groups
        $userGroups = $user->groups()
            ->active()
            ->with(['members', 'creator'])
            ->withCount('members')
            ->get()
            ->map(function ($group) {
                // Get latest message for each group
                $latestMessage = $group->messages()
                    ->with('sender')
                    ->latest()
                    ->first();

                $group->latest_message = $latestMessage;

                return $group;
            });

        // Get available users for group creation
        $availableUsers = collect();
        if ($user->hasAnyRole(['therapist', 'admin', 'guardian'])) {
            $availableUsers = User::whereHas('roles', function ($query) {
                $query->whereIn('name', ['guardian', 'child', 'therapist']);
            })->where('status', 'active')
                ->where('id', '!=', $user->id)
                ->get();
        }

        // Check if user can create groups
        $canCreateGroups = $user->hasAnyRole(['therapist', 'admin', 'guardian']);

        return Inertia::render('messages/groups', [
            'userGroups' => $userGroups,
            'availableUsers' => $availableUsers,
            'currentUser' => $user->load('roles'),
            'canCreateGroups' => $canCreateGroups,
        ]);
    }

    /**
     * Display a group conversation.
     */
    public function groupConversation(\App\Models\Group $group)
    {
        $user = auth()->user();

        \Log::info('Loading group conversation', [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'group_id' => $group->id,
            'group_name' => $group->name,
        ]);

        // Check if user is a member of the group
        if (! $group->hasMember($user)) {
            \Log::warning('User is not a member of the group', [
                'user_id' => $user->id,
                'group_id' => $group->id,
            ]);
            abort(403, 'You are not a member of this group');
        }

        // Get group messages
        $messages = Message::forGroup($group->id)
            ->with(['sender'])
            ->orderBy('created_at', 'asc')
            ->get();

        \Log::info('Loaded group messages', [
            'user_id' => $user->id,
            'group_id' => $group->id,
            'message_count' => $messages->count(),
        ]);

        // Mark group messages as read for this user
        // Note: For group messages, we might want a different read tracking system
        // For now, we'll mark them as read when the user views the conversation

        // Get all conversations for sidebar
        $conversations = Message::getConversationsFor($user->id);

        // Get user's groups
        $userGroups = $user->groups()->active()->get();

        return Inertia::render('messages/group-conversation', [
            'group' => $group->load(['members', 'creator']),
            'messages' => $messages,
            'conversations' => $conversations,
            'userGroups' => $userGroups,
            'currentUser' => $user->load('roles'),
        ]);
    }

    /**
     * Get group conversation history (API endpoint).
     */
    public function getGroupMessages(Request $request, \App\Models\Group $group)
    {
        $user = $request->user();

        // Check if user is a member of the group
        if (! $group->hasMember($user)) {
            return response()->json(['message' => 'You are not a member of this group.'], 403);
        }

        $perPage = $request->get('per_page', 50);
        $page = $request->get('page', 1);

        $messages = Message::forGroup($group->id)
            ->with(['sender'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        // Reverse the order for display (oldest first)
        $messages->getCollection()->transform(function ($message) {
            return $message;
        });

        return response()->json([
            'messages' => $messages->items(),
            'pagination' => [
                'current_page' => $messages->currentPage(),
                'last_page' => $messages->lastPage(),
                'per_page' => $messages->perPage(),
                'total' => $messages->total(),
                'has_more' => $messages->hasMorePages(),
            ],
        ]);
    }

    /**
     * Send a new message (direct or group).
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        \Log::info('Message store request received', [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'request_data' => $request->all(),
        ]);

        $request->validate([
            'recipient_id' => 'required_without:group_id|exists:users,id',
            'group_id' => 'required_without:recipient_id|exists:groups,id',
            'content' => 'required|string|max:1000',
        ]);

        // Handle direct message
        if ($request->recipient_id) {
            return $this->sendDirectMessage($request, $user);
        }

        // Handle group message
        if ($request->group_id) {
            return $this->sendGroupMessage($request, $user);
        }

        return response()->json(['message' => 'Invalid message type'], 400);
    }

    /**
     * Send a direct message.
     */
    private function sendDirectMessage(Request $request, User $user)
    {
        $recipient = User::findOrFail($request->recipient_id);

        // Use permission service to check if messaging is allowed
        if (!$this->connectionPermissionService->canMessage($user, $recipient)) {
            \Log::warning('Direct message not allowed based on therapeutic connections', [
                'sender_id' => $user->id,
                'recipient_id' => $recipient->id,
            ]);
            abort(403, 'You cannot message this user. A therapeutic connection is required.');
        }

        // Create direct message
        $message = Message::create([
            'sender_id' => $user->id,
            'recipient_id' => $request->recipient_id,
            'content' => $request->content,
            'message_type' => 'direct',
        ]);

        \Log::info('Direct message created successfully', [
            'message_id' => $message->id,
            'sender_id' => $user->id,
            'recipient_id' => $recipient->id,
        ]);

        // Broadcast the message
        $broadcastSuccess = $this->broadcastMessage($message);

        // Create notification for recipient
        $notificationService = app(\App\Services\NotificationService::class);
        $notificationService->create(
            $recipient->id,
            \App\Services\NotificationService::TYPE_MESSAGE_RECEIVED,
            'New Message from '.$user->name,
            substr($request->content, 0, 100).(strlen($request->content) > 100 ? '...' : ''),
            [
                'message_id' => $message->id,
                'sender_id' => $user->id,
            ],
            route('messages.conversation', $user->id),
            'normal'
        );

        // Return appropriate response
        if ($request->expectsJson()) {
            return response()->json([
                'message' => $message->load(['sender', 'recipient']),
                'broadcast_success' => $broadcastSuccess,
            ], 201);
        }

        // Load the message with relationships for Inertia response
        $messageWithRelations = $message->load(['sender', 'recipient']);

        if ($broadcastSuccess) {
            return back()->with([
                'success' => 'Message sent successfully!',
                'message' => $messageWithRelations
            ]);
        } else {
            return back()->with([
                'warning' => 'Message saved but real-time delivery failed. The recipient will see it when they refresh.',
                'message' => $messageWithRelations
            ])->withErrors(['broadcast' => 'Real-time messaging is currently unavailable.']);
        }
    }

    /**
     * Send a group message.
     */
    private function sendGroupMessage(Request $request, User $user)
    {
        $group = Group::findOrFail($request->group_id);

        // Check if user can send messages to this group
        if (! $this->groupPermissionService->canSendMessage($user, $group)) {
            \Log::warning('User cannot send messages to this group', [
                'sender_id' => $user->id,
                'group_id' => $group->id,
            ]);
            abort(403, 'You are not authorized to send messages to this group');
        }

        // Check for content violations
        if ($this->contentModerationService->violatesGroupRules($request->content, $group)) {
            \Log::warning('Message content violates group rules', [
                'sender_id' => $user->id,
                'group_id' => $group->id,
                'content_preview' => substr($request->content, 0, 50).'...',
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Your message contains inappropriate content and cannot be sent.',
                ], 422);
            }

            return back()->withErrors(['content' => 'Your message contains inappropriate content and cannot be sent.']);
        }

        // Create group message
        $message = Message::create([
            'sender_id' => $user->id,
            'group_id' => $request->group_id,
            'content' => $request->content,
            'message_type' => 'group',
        ]);

        \Log::info('Group message created successfully', [
            'message_id' => $message->id,
            'sender_id' => $user->id,
            'group_id' => $group->id,
        ]);

        // Perform automatic content moderation
        $wasModerated = $this->contentModerationService->moderateMessage($message);

        // Broadcast the message (even if flagged, but admins will be notified)
        $broadcastSuccess = $this->broadcastMessage($message);

        // Return appropriate response
        if ($request->expectsJson()) {
            $response = [
                'message' => $message->load(['sender', 'group']),
                'broadcast_success' => $broadcastSuccess,
            ];

            if ($wasModerated) {
                $response['moderation_notice'] = 'Your message has been flagged for review by administrators.';
            }

            return response()->json($response, 201);
        }

        // Load the message with relationships for Inertia response
        $messageWithRelations = $message->load(['sender', 'group']);

        if ($broadcastSuccess) {
            $successMessage = 'Message sent successfully!';
            if ($wasModerated) {
                $successMessage .= ' Note: Your message has been flagged for review by administrators.';
            }

            return back()->with([
                'success' => $successMessage,
                'message' => $messageWithRelations
            ]);
        } else {
            return back()->with([
                'warning' => 'Message saved but real-time delivery failed. Members will see it when they refresh.',
                'message' => $messageWithRelations
            ])->withErrors(['broadcast' => 'Real-time messaging is currently unavailable.']);
        }
    }

    /**
     * Broadcast a message.
     */
    private function broadcastMessage(Message $message): bool
    {
        try {
            if ($message->isGroupMessage()) {
                broadcast(new GroupMessageSent($message));
            } else {
                broadcast(new MessageSent($message));
            }
            \Log::info('Message broadcast successful', ['message_id' => $message->id]);

            return true;
        } catch (\Exception $e) {
            \Log::error('Message broadcast failed', [
                'message_id' => $message->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Flag a message for moderation.
     */
    public function flag(Request $request, Message $message)
    {
        $user = $request->user();

        // Check if user can flag this message
        if (! $this->contentModerationService->canFlagMessage($user, $message)) {
            abort(403, 'You are not authorized to flag this message');
        }

        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $message->flag($request->reason);

        \Log::info('Message flagged by user', [
            'message_id' => $message->id,
            'flagged_by' => $user->id,
            'reason' => $request->reason,
        ]);

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Message has been flagged for review.']);
        }

        return back()->with('success', 'Message has been flagged for review.');
    }

    /**
     * Get flagged messages for admin review.
     */
    public function getFlaggedMessages(Request $request)
    {
        $user = $request->user();

        // Only admins can view flagged messages
        if (! $user->hasRole('admin')) {
            abort(403, 'Unauthorized to view flagged messages');
        }

        $perPage = $request->get('per_page', 15);
        $flaggedMessages = $this->contentModerationService->getFlaggedMessages($perPage);

        return response()->json($flaggedMessages);
    }

    /**
     * Get flagged messages for a specific group.
     */
    public function getFlaggedGroupMessages(Request $request, Group $group)
    {
        $user = $request->user();

        // Check if user can moderate this group
        if (! $this->contentModerationService->canModerateGroup($user, $group)) {
            abort(403, 'Unauthorized to moderate this group');
        }

        $perPage = $request->get('per_page', 15);
        $flaggedMessages = $this->contentModerationService->getFlaggedMessagesForGroup($group, $perPage);

        return response()->json($flaggedMessages);
    }

    /**
     * Resolve a flagged message.
     */
    public function resolveFlaggedMessage(Request $request, Message $message)
    {
        $user = $request->user();

        // Check if user can moderate messages
        $canModerate = $user->hasRole('admin');
        if ($message->isGroupMessage()) {
            $canModerate = $canModerate || $this->contentModerationService->canModerateGroup($user, $message->group);
        }

        if (! $canModerate) {
            abort(403, 'Unauthorized to resolve flagged messages');
        }

        $request->validate([
            'action' => 'required|in:approve,remove,warn',
            'notes' => 'nullable|string|max:1000',
        ]);

        $resolved = $this->contentModerationService->resolveFlaggedMessage(
            $message,
            $user,
            $request->action,
            $request->notes
        );

        if (! $resolved) {
            return response()->json(['message' => 'Message is not flagged or already resolved.'], 422);
        }

        return response()->json(['message' => 'Flagged message has been resolved.']);
    }

    /**
     * Get content moderation statistics.
     */
    public function getModerationStats(Request $request)
    {
        $user = $request->user();

        // Only admins can view moderation stats
        if (! $user->hasRole('admin')) {
            abort(403, 'Unauthorized to view moderation statistics');
        }

        $stats = $this->contentModerationService->getModerationStats();

        return response()->json($stats);
    }

    /**
     * Get unread message count.
     */
    public function unreadCount()
    {
        $user = auth()->user();

        $count = Message::unreadFor($user->id)->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Get available contacts based on user role and therapeutic connections.
     */
    private function getAvailableContacts($user)
    {
        $connectionService = app(\App\Services\ConnectionManagementService::class);

        if ($user->hasRole('therapist')) {
            // Therapists can only message clients they have active connections with
            $connections = $connectionService->getTherapistConnections($user->id);
            return $connections->map(function ($connection) {
                return $connection->client;
            });
        }

        if ($user->hasRole('guardian')) {
            // Guardians can message connected therapists and their own children
            $connections = $connectionService->getClientConnections($user->id);
            $connectedTherapists = $connections->map(function ($connection) {
                return $connection->therapist;
            });
            
            $children = $user->children()->where('status', 'active')->get();

            return $connectedTherapists->concat($children);
        }

        if ($user->hasRole('child')) {
            // Children can message connected therapists and their guardian
            $connections = $connectionService->getClientConnections($user->id);
            $connectedTherapists = $connections->map(function ($connection) {
                return $connection->therapist;
            });
            
            $guardian = $user->guardian ? collect([$user->guardian]) : collect();

            return $connectedTherapists->concat($guardian);
        }

        // Admins can message anyone (unchanged)
        if ($user->hasRole('admin')) {
            return User::whereHas('roles', function ($query) {
                $query->whereIn('name', ['guardian', 'child', 'therapist']);
            })->where('status', 'active')->where('id', '!=', $user->id)->get();
        }

        return collect();
    }

    /**
     * Check if user can message another user based on therapeutic connections.
     */
    private function canMessageUser($user, $contact)
    {
        // Admin can message anyone
        if ($user->hasRole('admin')) {
            return true;
        }

        $connectionService = app(\App\Services\ConnectionManagementService::class);

        // Check if users have an active therapeutic connection
        $hasConnection = $connectionService->hasActiveConnection($user->id, $contact->id);

        // Therapists can only message clients they have active connections with
        if ($user->hasRole('therapist')) {
            return $hasConnection && ($contact->hasRole('guardian') || $contact->hasRole('child'));
        }

        // Guardians can message connected therapists and their own children
        if ($user->hasRole('guardian')) {
            // Can message connected therapists
            if ($contact->hasRole('therapist') && $hasConnection) {
                return true;
            }
            // Can message their own children (existing family relationship)
            if ($contact->hasRole('child') && $contact->guardian_id === $user->id) {
                return true;
            }
            return false;
        }

        // Children can message connected therapists and their guardian
        if ($user->hasRole('child')) {
            // Can message connected therapists
            if ($contact->hasRole('therapist') && $hasConnection) {
                return true;
            }
            // Can message their guardian (existing family relationship)
            if ($contact->hasRole('guardian') && $user->guardian_id === $contact->id) {
                return true;
            }
            return false;
        }

        return false;
    }
}
