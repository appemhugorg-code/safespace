<?php

namespace App\Events;

use App\Models\PanicAlert;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PanicAlertStatusChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public PanicAlert $panicAlert;
    public User $updatedBy;
    public string $action;

    /**
     * Create a new event instance.
     */
    public function __construct(PanicAlert $panicAlert, User $updatedBy, string $action)
    {
        $this->panicAlert = $panicAlert->load(['child', 'resolvedBy', 'notifications']);
        $this->updatedBy = $updatedBy;
        $this->action = $action; // 'acknowledged' or 'resolved'
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

        // Also broadcast to the child who triggered the alert
        $channels[] = new PrivateChannel('user.' . $this->panicAlert->child_id);

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
                'resolved_at' => $this->panicAlert->resolved_at?->toISOString(),
                'resolved_by' => $this->panicAlert->resolvedBy ? [
                    'id' => $this->panicAlert->resolvedBy->id,
                    'name' => $this->panicAlert->resolvedBy->name,
                ] : null,
                'notes' => $this->panicAlert->notes,
                'location_data' => $this->panicAlert->location_data,
            ],
            'updated_by' => [
                'id' => $this->updatedBy->id,
                'name' => $this->updatedBy->name,
            ],
            'action' => $this->action,
            'message' => $this->action === 'resolved'
                ? "{$this->updatedBy->name} resolved the emergency alert"
                : "{$this->updatedBy->name} acknowledged the emergency alert",
            'timestamp' => now()->toISOString(),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'panic-alert.status-changed';
    }
}
