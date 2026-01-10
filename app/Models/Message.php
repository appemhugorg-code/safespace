<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_id',
        'recipient_id',
        'group_id',
        'content',
        'message_type',
        'is_read',
        'read_at',
        'is_flagged',
        'flag_reason',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'is_flagged' => 'boolean',
        'read_at' => 'datetime',
    ];

    /**
     * Get the sender of the message.
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the recipient of the message.
     */
    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }

    /**
     * Get the group this message belongs to.
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * Get all flags for this message.
     */
    public function flags(): HasMany
    {
        return $this->hasMany(MessageFlag::class);
    }

    /**
     * Mark message as read.
     */
    public function markAsRead(): void
    {
        if (! $this->is_read) {
            $this->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        }
    }

    /**
     * Flag message for moderation.
     */
    public function flag(?string $reason = null): void
    {
        $this->update([
            'is_flagged' => true,
            'flag_reason' => $reason,
        ]);
    }

    /**
     * Scope to get conversation between two users.
     */
    public function scopeConversation($query, $userId1, $userId2)
    {
        return $query->where(function ($q) use ($userId1, $userId2) {
            $q->where('sender_id', $userId1)->where('recipient_id', $userId2);
        })->orWhere(function ($q) use ($userId1, $userId2) {
            $q->where('sender_id', $userId2)->where('recipient_id', $userId1);
        });
    }

    /**
     * Scope to get unread messages for a user.
     */
    public function scopeUnreadFor($query, $userId)
    {
        return $query->where('recipient_id', $userId)->where('is_read', false);
    }

    /**
     * Scope to get flagged messages.
     */
    public function scopeFlagged($query)
    {
        return $query->where('is_flagged', true);
    }

    /**
     * Scope to get direct messages only.
     */
    public function scopeDirectMessages($query)
    {
        return $query->where('message_type', 'direct');
    }

    /**
     * Scope to get group messages only.
     */
    public function scopeGroupMessages($query)
    {
        return $query->where('message_type', 'group');
    }

    /**
     * Scope to get messages for a specific group.
     */
    public function scopeForGroup($query, $groupId)
    {
        return $query->where('group_id', $groupId)->where('message_type', 'group');
    }

    /**
     * Check if this is a direct message.
     */
    public function isDirectMessage(): bool
    {
        return $this->message_type === 'direct';
    }

    /**
     * Check if this is a group message.
     */
    public function isGroupMessage(): bool
    {
        return $this->message_type === 'group';
    }

    /**
     * Check if a conversation is allowed between two users based on therapeutic connections.
     */
    public static function isConversationAllowed(User $user1, User $user2): bool
    {
        $permissionService = app(\App\Services\ConnectionPermissionService::class);
        return $permissionService->canMessage($user1, $user2);
    }

    /**
     * Get conversations for a user (both direct and group) filtered by therapeutic connections.
     */
    public static function getConversationsFor($userId)
    {
        $user = User::findOrFail($userId);
        $connectionService = app(\App\Services\ConnectionManagementService::class);

        // Get direct message conversations
        $directConversations = static::directMessages()
            ->where(function ($query) use ($userId) {
                $query->where('sender_id', $userId)
                    ->orWhere('recipient_id', $userId);
            })
            ->with(['sender', 'recipient'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->filter(function ($message) use ($user, $connectionService) {
                // Filter conversations based on therapeutic connections
                $otherUserId = $message->sender_id === $user->id 
                    ? $message->recipient_id 
                    : $message->sender_id;
                
                $otherUser = $message->sender_id === $user->id 
                    ? $message->recipient 
                    : $message->sender;

                // Admin can see all conversations
                if ($user->hasRole('admin')) {
                    return true;
                }

                // Check family relationships (guardian-child)
                if ($user->hasRole('guardian') && $otherUser->hasRole('child')) {
                    return $otherUser->guardian_id === $user->id;
                }
                if ($user->hasRole('child') && $otherUser->hasRole('guardian')) {
                    return $user->guardian_id === $otherUser->id;
                }

                // Check therapeutic connections for therapist-client relationships
                if (($user->hasRole('therapist') && ($otherUser->hasRole('guardian') || $otherUser->hasRole('child'))) ||
                    (($user->hasRole('guardian') || $user->hasRole('child')) && $otherUser->hasRole('therapist'))) {
                    return $connectionService->hasActiveConnection($user->id, $otherUserId);
                }

                return false;
            })
            ->groupBy(function ($message) use ($userId) {
                // Group by the other participant in the conversation
                return $message->sender_id === $userId
                    ? $message->recipient_id
                    : $message->sender_id;
            })
            ->map(function ($messages) {
                $latestMessage = $messages->first();
                $latestMessage->conversation_type = 'direct';

                return $latestMessage;
            });

        // Get group conversations (existing logic - groups have their own permission system)
        $groupConversations = static::groupMessages()
            ->whereHas('group.members', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->with(['sender', 'group'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('group_id')
            ->map(function ($messages) {
                $latestMessage = $messages->first();
                $latestMessage->conversation_type = 'group';

                return $latestMessage;
            });

        // Combine and sort by latest message
        return $directConversations->merge($groupConversations)
            ->sortByDesc('created_at')
            ->values();
    }
}
