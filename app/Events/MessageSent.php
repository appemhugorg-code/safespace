<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The name of the queue connection to use when broadcasting the event.
     * Set to 'sync' for immediate broadcasting without queuing
     */
    public $connection = 'sync';

    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct(Message $message)
    {
        // Load appropriate relationships based on message type
        if ($message->isGroupMessage()) {
            $this->message = $message->load(['sender', 'group']);
        } else {
            $this->message = $message->load(['sender', 'recipient']);
        }
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $channels = [];

        if ($this->message->isDirectMessage()) {
            // Direct message: broadcast to sender and recipient
            $channels = [
                new PrivateChannel('user.'.$this->message->recipient_id),
                new PrivateChannel('user.'.$this->message->sender_id),
            ];
            
            \Log::info('Broadcasting direct message to channels', [
                'message_id' => $this->message->id,
                'sender_id' => $this->message->sender_id,
                'recipient_id' => $this->message->recipient_id,
                'channels' => [
                    'user.'.$this->message->recipient_id,
                    'user.'.$this->message->sender_id,
                ],
                'content' => substr($this->message->content, 0, 50)
            ]);
        } elseif ($this->message->isGroupMessage()) {
            // Group message: broadcast to group channel and admin monitoring
            $channels = [
                new PrivateChannel('group.'.$this->message->group_id),
                new PrivateChannel('admin-monitoring'), // For admin oversight
            ];
            
            \Log::info('Broadcasting group message to channels', [
                'message_id' => $this->message->id,
                'sender_id' => $this->message->sender_id,
                'group_id' => $this->message->group_id,
                'channels' => [
                    'group.'.$this->message->group_id,
                    'admin-monitoring',
                ],
                'content' => substr($this->message->content, 0, 50)
            ]);
        }

        return $channels;
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        if ($this->message->isGroupMessage()) {
            return 'group-message.sent';
        }

        return 'message.sent';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        $data = [
            'message' => [
                'id' => $this->message->id,
                'content' => $this->message->content,
                'message_type' => $this->message->message_type,
                'sender' => [
                    'id' => $this->message->sender->id,
                    'name' => $this->message->sender->name,
                ],
                'created_at' => $this->message->created_at->toISOString(),
                'is_read' => $this->message->is_read,
                'is_flagged' => $this->message->is_flagged,
            ],
        ];

        // Add recipient or group information based on message type
        if ($this->message->isDirectMessage()) {
            $data['message']['recipient'] = [
                'id' => $this->message->recipient->id,
                'name' => $this->message->recipient->name,
            ];
        } elseif ($this->message->isGroupMessage()) {
            $data['message']['group'] = [
                'id' => $this->message->group->id,
                'name' => $this->message->group->name,
            ];
        }

        return $data;
    }
}
