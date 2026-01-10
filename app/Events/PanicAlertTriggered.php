<?php

namespace App\Events;

use App\Models\PanicAlert;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PanicAlertTriggered implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public PanicAlert $panicAlert;

    /**
     * Create a new event instance.
     */
    public function __construct(PanicAlert $panicAlert)
    {
        $this->panicAlert = $panicAlert->load(['child', 'notifications']);
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        $channels = [];

        // Broadcast to all emergency responders
        $channels[] = new PrivateChannel('emergency-alerts');

        // Broadcast to specific users who should be notified
        foreach ($this->panicAlert->notifications as $notification) {
            $channels[] = new PrivateChannel('user.' . $notification->notified_user_id);
        }

        return $channels;
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
 'alert' => [
                'id' => $this->panicAlert->id,
                'child' => [
                    'id' => $this->panicAlert->child->id,
                    'name' => $this->panicAlert->child->name,
                ],
                'triggered_at' => $this->panicAlert->triggered_at->toISOString(),
                'status' => $this->panicAlert->status,
                'location_data' => $this->panicAlert->location_data,
            ],
            'message' => "Emergency alert from {$this->panicAlert->child->name}",
            'timestamp' => now()->toISOString(),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'panic-alert.triggered';
    }
}
