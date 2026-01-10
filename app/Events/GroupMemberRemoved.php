<?php

namespace App\Events;

use App\Models\Group;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GroupMemberRemoved implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The name of the queue connection to use when broadcasting the event.
     */
    public $connection = 'sync';

    public $group;

    public $user;

    public $removedBy;

    public $reason;

    /**
     * Create a new event instance.
     */
    public function __construct(Group $group, User $user, ?User $removedBy = null, ?string $reason = null)
    {
        $this->group = $group;
        $this->user = $user;
        $this->removedBy = $removedBy;
        $this->reason = $reason;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('group.'.$this->group->id),
            new PrivateChannel('user.'.$this->user->id), // Notify the removed user
            new PrivateChannel('admin-monitoring'), // For admin oversight
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'group-member.removed';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        $data = [
            'group' => [
                'id' => $this->group->id,
                'name' => $this->group->name,
            ],
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'reason' => $this->reason,
            'timestamp' => now()->toISOString(),
        ];

        if ($this->removedBy) {
            $data['removed_by'] = [
                'id' => $this->removedBy->id,
                'name' => $this->removedBy->name,
            ];
        }

        return $data;
    }
}
