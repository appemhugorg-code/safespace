<?php

namespace App\Events;

use App\Models\Group;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GroupMemberAdded implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The name of the queue connection to use when broadcasting the event.
     */
    public $connection = 'sync';

    public $group;

    public $user;

    public $addedBy;

    public $role;

    /**
     * Create a new event instance.
     */
    public function __construct(Group $group, User $user, User $addedBy, string $role = 'member')
    {
        $this->group = $group;
        $this->user = $user;
        $this->addedBy = $addedBy;
        $this->role = $role;
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
            new PrivateChannel('user.'.$this->user->id), // Notify the added user
            new PrivateChannel('admin-monitoring'), // For admin oversight
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'group-member.added';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'group' => [
                'id' => $this->group->id,
                'name' => $this->group->name,
            ],
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'roles' => $this->user->roles->pluck('name'),
            ],
            'added_by' => [
                'id' => $this->addedBy->id,
                'name' => $this->addedBy->name,
            ],
            'role' => $this->role,
            'timestamp' => now()->toISOString(),
        ];
    }
}
