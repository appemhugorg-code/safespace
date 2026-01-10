<?php

namespace App\Services;

use App\Events\PanicAlertStatusChanged;
use App\Events\PanicAlertTriggered;
use App\Models\PanicAlert;
use App\Models\PanicAlertNotification;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class PanicAlertService
{
    /**
     * Create a new panic alert and notify emergency contacts.
     */
    public function createPanicAlert(User $child, array $locationData = null): PanicAlert
    {
        // Create the panic alert
        $panicAlert = PanicAlert::create([
            'child_id' => $child->id,
            'triggered_at' => now(),
            'location_data' => $locationData,
            'status' => 'active',
        ]);

        // Log the emergency alert
        Log::emergency('PANIC BUTTON ACTIVATED', [
            'panic_alert_id' => $panicAlert->id,
            'child_id' => $child->id,
            'child_name' => $child->name,
            'child_email' => $child->email,
            'location_data' => $locationData,
            'timestamp' => now(),
        ]);

        // Get emergency contacts and create notifications
        $emergencyContacts = $this->getEmergencyContacts($child);
        $this->createNotifications($panicAlert, $emergencyContacts);

        // Broadcast real-time event
        broadcast(new PanicAlertTriggered($panicAlert));

        return $panicAlert;
    }

    /**
     * Get emergency contacts for a child.
     */
    public function getEmergencyContacts(User $child): array
    {
        $contacts = [];

        // Add guardian if child has one
        if ($child->guardian) {
            $contacts[] = [
                'user' => $child->guardian,
                'type' => 'guardian'
            ];
        }

        // Add assigned therapists
        // For now, get all active therapists - in real implementation,
        // you'd have a therapist-child assignment table
        $therapists = User::role('therapist')->where('status', 'active')->get();
        foreach ($therapists as $therapist) {
            $contacts[] = [
                'user' => $therapist,
                'type' => 'therapist'
            ];
        }

        // Add all active admins
        $admins = User::role('admin')->where('status', 'active')->get();
        foreach ($admins as $admin) {
            $contacts[] = [
                'user' => $admin,
                'type' => 'admin'
            ];
        }

        return $contacts;
    }

    /**
     * Create notifications for emergency contacts.
     */
    private function createNotifications(PanicAlert $panicAlert, array $emergencyContacts): void
    {
        $notificationService = app(NotificationService::class);
        $child = $panicAlert->child;

        foreach ($emergencyContacts as $contact) {
            PanicAlertNotification::create([
                'panic_alert_id' => $panicAlert->id,
                'notified_user_id' => $contact['user']->id,
                'notification_type' => $contact['type'],
            ]);

            // Create in-app notification
            $notificationService->create(
                $contact['user']->id,
                NotificationService::TYPE_PANIC_ALERT,
                'URGENT: Panic Alert Triggered',
                "{$child->name} has triggered a panic alert. Immediate attention required.",
                [
                    'panic_alert_id' => $panicAlert->id,
                    'child_id' => $child->id,
                    'triggered_at' => $panicAlert->triggered_at->toISOString(),
                ],
                route('panic-alerts.show', $panicAlert->id),
                'urgent'
            );
        }
    }

    /**
     * Acknowledge a panic alert.
     */
    public function acknowledgePanicAlert(PanicAlert $panicAlert, User $user): bool
    {
        if ($panicAlert->status === 'active') {
            $panicAlert->update(['status' => 'acknowledged']);

            // Mark user's notification as acknowledged
            $notification = $panicAlert->notifications()
                ->where('notified_user_id', $user->id)
                ->first();

            if ($notification) {
                $notification->markAsAcknowledged();
            }

            Log::info('Panic alert acknowledged', [
                'panic_alert_id' => $panicAlert->id,
                'acknowledged_by' => $user->id,
                'acknowledged_by_name' => $user->name,
            ]);

            // Broadcast status change
            broadcast(new PanicAlertStatusChanged($panicAlert, $user, 'acknowledged'));

            return true;
        }

        return false;
    }

    /**
     * Resolve a panic alert.
     */
    public function resolvePanicAlert(PanicAlert $panicAlert, User $user, string $notes = null): bool
    {
        if (in_array($panicAlert->status, ['active', 'acknowledged'])) {
            $panicAlert->update([
                'status' => 'resolved',
                'resolved_at' => now(),
                'resolved_by' => $user->id,
                'notes' => $notes,
            ]);

            Log::info('Panic alert resolved', [
                'panic_alert_id' => $panicAlert->id,
                'resolved_by' => $user->id,
                'resolved_by_name' => $user->name,
                'notes' => $notes,
            ]);

            // Broadcast status change
            broadcast(new PanicAlertStatusChanged($panicAlert, $user, 'resolved'));

            // Notify the child that their alert has been resolved
            $notificationService = app(NotificationService::class);
            $notificationService->create(
                $panicAlert->child_id,
                NotificationService::TYPE_PANIC_ALERT_RESOLVED,
                'Panic Alert Resolved',
                "Your panic alert has been resolved by {$user->name}.",
                [
                    'panic_alert_id' => $panicAlert->id,
                    'resolved_by' => $user->id,
                    'resolved_at' => $panicAlert->resolved_at->toISOString(),
                ],
                route('panic-alerts.show', $panicAlert->id),
                'normal'
            );

            return true;
        }

        return false;
    }

    /**
     * Mark notification as viewed.
     */
    public function markNotificationAsViewed(PanicAlert $panicAlert, User $user): void
    {
        $notification = $panicAlert->notifications()
            ->where('notified_user_id', $user->id)
            ->first();

        if ($notification && !$notification->isViewed()) {
            $notification->markAsViewed();
        }
    }

    /**
     * Get panic alerts for a specific user based on their role.
     */
    public function getPanicAlertsForUser(User $user): \Illuminate\Database\Eloquent\Collection
    {
        if ($user->hasRole('admin')) {
            // Admins see all recent alerts
            return PanicAlert::with(['child', 'resolvedBy', 'notifications'])
                ->recent()
                ->orderBy('triggered_at', 'desc')
                ->get();
        }

        if ($user->hasRole('therapist')) {
            // Therapists see alerts for their assigned children only
            $assignedChildrenIds = $user->assignedChildren->pluck('id');

            return PanicAlert::with(['child', 'resolvedBy', 'notifications'])
                ->whereIn('child_id', $assignedChildrenIds)
                ->recent()
                ->orderBy('triggered_at', 'desc')
                ->get();
        }

        if ($user->hasRole('guardian')) {
            // Guardians see alerts for their children
            $childrenIds = $user->children->pluck('id');

            return PanicAlert::with(['child', 'resolvedBy', 'notifications'])
                ->whereIn('child_id', $childrenIds)
                ->recent()
                ->orderBy('triggered_at', 'desc')
                ->get();
        }

        if ($user->hasRole('child')) {
            // Children see their own alerts
            return PanicAlert::with(['resolvedBy', 'notifications'])
                ->where('child_id', $user->id)
                ->recent()
                ->orderBy('triggered_at', 'desc')
                ->get();
        }

        return collect();
    }

    /**
     * Get unviewed panic alert count for a user.
     */
    public function getUnviewedAlertsCount(User $user): int
    {
        return PanicAlertNotification::where('notified_user_id', $user->id)
            ->unviewed()
            ->whereHas('panicAlert', function ($query) {
                $query->recent();
            })
            ->count();
    }
}
