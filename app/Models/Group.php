<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'created_by',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the user who created the group.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all members of the group.
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_members')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    /**
     * Get only admin members of the group.
     */
    public function admins(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_members')
            ->wherePivot('role', 'admin')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    /**
     * Get only regular members of the group.
     */
    public function regularMembers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_members')
            ->wherePivot('role', 'member')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    /**
     * Get all messages in the group.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Get all join requests for the group.
     */
    public function joinRequests(): HasMany
    {
        return $this->hasMany(GroupJoinRequest::class);
    }

    /**
     * Get pending join requests for the group.
     */
    public function pendingJoinRequests(): HasMany
    {
        return $this->hasMany(GroupJoinRequest::class)->where('status', 'pending');
    }

    /**
     * Get leave logs for the group.
     */
    public function leaveLogs(): HasMany
    {
        return $this->hasMany(GroupLeaveLog::class);
    }

    /**
     * Check if a user is a member of the group.
     */
    public function hasMember(User $user): bool
    {
        return $this->members()->where('user_id', $user->id)->exists();
    }

    /**
     * Check if a user is an admin of the group.
     */
    public function hasAdmin(User $user): bool
    {
        return $this->members()
            ->where('user_id', $user->id)
            ->wherePivot('role', 'admin')
            ->exists();
    }

    /**
     * Check if a user is an admin of the group (alias for hasAdmin).
     */
    public function isAdmin(User $user): bool
    {
        return $this->hasAdmin($user);
    }

    /**
     * Add a member to the group.
     */
    public function addMember(User $user, string $role = 'member', ?User $addedBy = null): void
    {
        if (! $this->hasMember($user)) {
            $this->members()->attach($user->id, [
                'role' => $role,
                'joined_at' => now(),
            ]);

            // Broadcast member addition event
            if ($addedBy) {
                broadcast(new \App\Events\GroupMemberAdded($this, $user, $addedBy, $role));
            }
        }
    }

    /**
     * Remove a member from the group.
     */
    public function removeMember(User $user, ?User $removedBy = null, ?string $reason = null): void
    {
        if ($this->hasMember($user)) {
            $this->members()->detach($user->id);

            // Broadcast member removal event
            broadcast(new \App\Events\GroupMemberRemoved($this, $user, $removedBy, $reason));
        }
    }

    /**
     * Promote a member to admin.
     */
    public function promoteToAdmin(User $user): void
    {
        if ($this->hasMember($user)) {
            $this->members()->updateExistingPivot($user->id, ['role' => 'admin']);
        }
    }

    /**
     * Demote an admin to regular member.
     */
    public function demoteToMember(User $user): void
    {
        if ($this->hasMember($user)) {
            $this->members()->updateExistingPivot($user->id, ['role' => 'member']);
        }
    }

    /**
     * Scope to get active groups.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get groups that a user can see (either member or can join).
     */
    public function scopeVisibleTo($query, User $user)
    {
        return $query->active()
            ->where(function ($q) use ($user) {
                // User is a member
                $q->whereHas('members', function ($memberQuery) use ($user) {
                    $memberQuery->where('user_id', $user->id);
                })
                // Or user can see all groups if they're therapist/admin
                    ->orWhere(function ($visibilityQuery) use ($user) {
                        if ($user->hasAnyRole(['admin', 'therapist'])) {
                            $visibilityQuery->whereRaw('1 = 1'); // Show all groups
                        }
                    });
            });
    }

    /**
     * Get the latest message in the group.
     */
    public function getLatestMessageAttribute()
    {
        return $this->messages()->latest()->first();
    }

    /**
     * Get unread message count for a user.
     */
    public function getUnreadCountFor(User $user): int
    {
        return $this->messages()
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->count();
    }
}
