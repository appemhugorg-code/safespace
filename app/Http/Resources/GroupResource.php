<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Creator information
            'creator' => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
                'role' => $this->creator->roles->first()?->name,
            ],

            // Member counts
            'member_count' => $this->members()->count(),
            'admin_count' => $this->admins()->count(),

            // Latest message info (if available)
            'latest_message' => $this->when($this->relationLoaded('messages'), function () {
                $latestMessage = $this->messages()->latest()->first();

                return $latestMessage ? [
                    'id' => $latestMessage->id,
                    'content' => $latestMessage->content,
                    'sender_name' => $latestMessage->sender->name,
                    'created_at' => $latestMessage->created_at,
                ] : null;
            }),

            // User's role in this group (if user is a member)
            'user_role' => $this->when($request->user(), function () use ($request) {
                $membership = $this->members()->where('user_id', $request->user()->id)->first();

                return $membership ? $membership->pivot->role : null;
            }),

            // Unread message count for current user
            'unread_count' => $this->when($request->user(), function () use ($request) {
                return $this->getUnreadCountFor($request->user());
            }),

            // Pending join requests count (for admins)
            'pending_requests_count' => $this->when(
                $request->user() && $request->user()->canManageGroup($this->resource),
                fn () => $this->pendingJoinRequests()->count()
            ),
        ];
    }
}
