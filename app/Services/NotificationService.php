<?php

namespace App\Services;

use App\Events\NotificationCreated;
use App\Models\Notification;
use App\Models\NotificationPreference;
use App\Models\TherapistClientConnection;
use App\Models\ConnectionRequest;
use App\Models\User;
use Illuminate\Support\Collection;

class NotificationService
{
    protected EmailNotificationService $emailService;

    public function __construct(EmailNotificationService $emailService)
    {
        $this->emailService = $emailService;
    }

    /**
     * Generate role-specific connection URL
     */
    protected function getConnectionUrl(User $user, int $connectionId): string
    {
        if ($user->hasRole('therapist')) {
            return "/therapist/connections/{$connectionId}";
        } elseif ($user->hasRole('guardian')) {
            return "/guardian/connections/{$connectionId}";
        } elseif ($user->hasRole('child')) {
            return "/child/connections/{$connectionId}";
        }
        
        return "/connections/{$connectionId}";
    }

    /**
     * Notification type constants
     */
    const TYPE_APPOINTMENT_SCHEDULED = 'appointment_scheduled';
    const TYPE_APPOINTMENT_CANCELLED = 'appointment_cancelled';
    const TYPE_APPOINTMENT_REMINDER = 'appointment_reminder';
    const TYPE_MESSAGE_RECEIVED = 'message_received';
    const TYPE_PANIC_ALERT = 'panic_alert';
    const TYPE_PANIC_ALERT_RESOLVED = 'panic_alert_resolved';
    const TYPE_ARTICLE_PUBLISHED = 'article_published';
    const TYPE_COMMENT_RECEIVED = 'comment_received';
    const TYPE_SYSTEM_ANNOUNCEMENT = 'system_announcement';
    
    // Connection-related notification types
    const TYPE_CONNECTION_ASSIGNED = 'connection_assigned';
    const TYPE_CONNECTION_REQUEST_RECEIVED = 'connection_request_received';
    const TYPE_CONNECTION_REQUEST_APPROVED = 'connection_request_approved';
    const TYPE_CONNECTION_REQUEST_DECLINED = 'connection_request_declined';
    const TYPE_CONNECTION_TERMINATED = 'connection_terminated';
    const TYPE_CHILD_ASSIGNED_TO_THERAPIST = 'child_assigned_to_therapist';

    /**
     * Create a notification for a user
     */
    public function create(
        int $userId,
        string $type,
        string $title,
        string $message,
        ?array $data = null,
        ?string $actionUrl = null,
        string $priority = 'normal'
    ): Notification {
        // Check user preferences
        $preferences = NotificationPreference::forUser($userId)->first();
        
        if ($preferences && !$preferences->wantsNotification($type)) {
            // User has disabled this notification type, skip creation
            return new Notification();
        }

        $notification = Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data,
            'action_url' => $actionUrl,
            'icon' => $this->getIconForType($type),
            'priority' => $priority,
        ]);

        // Broadcast to user's private channel
        broadcast(new NotificationCreated($notification))->toOthers();

        return $notification;
    }

    /**
     * Create notifications for multiple users
     */
    public function createBatch(
        array $userIds,
        string $type,
        string $title,
        string $message,
        ?array $data = null,
        ?string $actionUrl = null,
        string $priority = 'normal'
    ): Collection {
        $notifications = collect();

        foreach ($userIds as $userId) {
            $notification = $this->create($userId, $type, $title, $message, $data, $actionUrl, $priority);
            if ($notification->exists) {
                $notifications->push($notification);
            }
        }

        return $notifications;
    }

    /**
     * Get unread count for user
     */
    public function getUnreadCount(int $userId): int
    {
        return Notification::forUser($userId)->unread()->count();
    }

    /**
     * Get recent notifications for user
     */
    public function getRecent(int $userId, int $limit = 10): Collection
    {
        return Notification::forUser($userId)
            ->recent($limit)
            ->get();
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(int $notificationId): bool
    {
        $notification = Notification::find($notificationId);
        
        if ($notification) {
            $notification->markAsRead();
            return true;
        }

        return false;
    }

    /**
     * Mark all notifications as read for user
     */
    public function markAllAsRead(int $userId): int
    {
        return Notification::forUser($userId)
            ->unread()
            ->update(['read_at' => now()]);
    }

    /**
     * Delete notification
     */
    public function delete(int $notificationId): bool
    {
        $notification = Notification::find($notificationId);
        
        if ($notification) {
            return $notification->delete();
        }

        return false;
    }

    /**
     * Delete all read notifications for user
     */
    public function deleteAllRead(int $userId): int
    {
        return Notification::forUser($userId)
            ->read()
            ->delete();
    }

    /**
     * Create notification for connection assignment
     */
    public function notifyConnectionAssigned(
        TherapistClientConnection $connection,
        User $assignedBy
    ): Collection {
        $notifications = collect();
        
        $therapist = $connection->therapist;
        $client = $connection->client;
        $clientType = $connection->client_type;
        
        // Notify therapist
        $therapistNotification = $this->create(
            $therapist->id,
            self::TYPE_CONNECTION_ASSIGNED,
            'New Client Assignment',
            "You have been assigned a new {$clientType}: {$client->name}",
            [
                'connection_id' => $connection->id,
                'client_id' => $client->id,
                'client_type' => $clientType,
                'assigned_by' => $assignedBy->name,
            ],
            $this->getConnectionUrl($therapist, $connection->id),
            'high'
        );
        
        if ($therapistNotification->exists) {
            $notifications->push($therapistNotification);
            
            // Send email notification to therapist
            $this->emailService->sendConnectionAssignedNotification(
                $therapist,
                $client,
                $clientType,
                ucfirst(str_replace('_', ' ', $connection->connection_type)),
                $assignedBy->name
            );
        }
        
        // Notify client
        $clientNotification = $this->create(
            $client->id,
            self::TYPE_CONNECTION_ASSIGNED,
            'Therapist Assignment',
            "You have been assigned to therapist: {$therapist->name}",
            [
                'connection_id' => $connection->id,
                'therapist_id' => $therapist->id,
                'assigned_by' => $assignedBy->name,
            ],
            $this->getConnectionUrl($client, $connection->id),
            'high'
        );
        
        if ($clientNotification->exists) {
            $notifications->push($clientNotification);
            
            // Send email notification to client
            $this->emailService->sendConnectionAssignedNotification(
                $client,
                $therapist,
                'therapist',
                ucfirst(str_replace('_', ' ', $connection->connection_type)),
                $assignedBy->name
            );
        }
        
        // If it's a child assignment, also notify the guardian
        if ($clientType === 'child') {
            $guardian = $client->guardian;
            if ($guardian) {
                $guardianNotification = $this->create(
                    $guardian->id,
                    self::TYPE_CHILD_ASSIGNED_TO_THERAPIST,
                    'Child Assigned to Therapist',
                    "Your child {$client->name} has been assigned to therapist: {$therapist->name}",
                    [
                        'connection_id' => $connection->id,
                        'child_id' => $client->id,
                        'therapist_id' => $therapist->id,
                        'assigned_by' => $assignedBy->name,
                    ],
                    $this->getConnectionUrl($guardian, $connection->id),
                    'high'
                );
                
                if ($guardianNotification->exists) {
                    $notifications->push($guardianNotification);
                    
                    // Send email notification to guardian
                    $this->emailService->sendConnectionAssignedNotification(
                        $guardian,
                        $therapist,
                        'therapist',
                        "Child Assignment ({$client->name})",
                        $assignedBy->name
                    );
                }
            }
        }
        
        return $notifications;
    }

    /**
     * Create notification for connection request
     */
    public function notifyConnectionRequestReceived(ConnectionRequest $request): ?Notification
    {
        $requester = $request->requester;
        $therapist = $request->targetTherapist;
        $requestType = $request->request_type;
        
        $title = $requestType === 'guardian_child_assignment' 
            ? 'Child Assignment Request'
            : 'Connection Request';
            
        $message = $requestType === 'guardian_child_assignment'
            ? "Guardian {$requester->name} wants to assign their child to you"
            : "Guardian {$requester->name} wants to connect with you";
            
        if ($request->message) {
            $message .= ". Message: {$request->message}";
        }
        
        $notification = $this->create(
            $therapist->id,
            self::TYPE_CONNECTION_REQUEST_RECEIVED,
            $title,
            $message,
            [
                'request_id' => $request->id,
                'requester_id' => $requester->id,
                'request_type' => $requestType,
                'target_client_id' => $request->target_client_id,
            ],
            "/therapist/connections/requests",
            'high'
        );
        
        if ($notification->exists) {
            // Send email notification
            $childName = null;
            if ($request->target_client_id) {
                $child = $request->targetClient;
                $childName = $child ? $child->name : null;
            }
            
            $this->emailService->sendConnectionRequestReceivedNotification(
                $therapist,
                $requester,
                ucfirst(str_replace('_', ' ', $requestType)),
                $request->message,
                $childName
            );
        }
        
        return $notification->exists ? $notification : null;
    }

    /**
     * Create notification for connection request approval
     */
    public function notifyConnectionRequestApproved(
        ConnectionRequest $request,
        TherapistClientConnection $connection,
        User $approvedBy
    ): Collection {
        $notifications = collect();
        
        $requester = $request->requester;
        $therapist = $request->targetTherapist;
        $client = $connection->client;
        
        // Notify the requester (guardian)
        $title = $request->isGuardianChildAssignmentRequest() 
            ? 'Child Assignment Approved'
            : 'Connection Request Approved';
            
        $message = $request->isGuardianChildAssignmentRequest()
            ? "Your request to assign {$client->name} to therapist {$therapist->name} has been approved"
            : "Your connection request to therapist {$therapist->name} has been approved";
        
        $requesterNotification = $this->create(
            $requester->id,
            self::TYPE_CONNECTION_REQUEST_APPROVED,
            $title,
            $message,
            [
                'connection_id' => $connection->id,
                'request_id' => $request->id,
                'therapist_id' => $therapist->id,
                'approved_by' => $approvedBy->name,
            ],
            $this->getConnectionUrl($requester, $connection->id),
            'high'
        );
        
        if ($requesterNotification->exists) {
            $notifications->push($requesterNotification);
            
            // Send email notification to requester
            $childName = $request->isGuardianChildAssignmentRequest() ? $client->name : null;
            $this->emailService->sendConnectionRequestApprovedNotification(
                $requester,
                $therapist->name,
                ucfirst(str_replace('_', ' ', $request->request_type)),
                $approvedBy->name,
                $childName
            );
        }
        
        // If it's a child assignment, also notify the child
        if ($request->isGuardianChildAssignmentRequest() && $client->id !== $requester->id) {
            $childNotification = $this->create(
                $client->id,
                self::TYPE_CONNECTION_ASSIGNED,
                'Therapist Assignment',
                "You have been assigned to therapist: {$therapist->name}",
                [
                    'connection_id' => $connection->id,
                    'therapist_id' => $therapist->id,
                    'assigned_by' => $approvedBy->name,
                ],
                $this->getConnectionUrl($client, $connection->id),
                'high'
            );
            
            if ($childNotification->exists) {
                $notifications->push($childNotification);
                
                // Send email notification to child
                $this->emailService->sendConnectionAssignedNotification(
                    $client,
                    $therapist,
                    'therapist',
                    'Child Assignment',
                    $approvedBy->name
                );
            }
        }
        
        return $notifications;
    }

    /**
     * Create notification for connection request decline
     */
    public function notifyConnectionRequestDeclined(
        ConnectionRequest $request,
        User $declinedBy
    ): ?Notification {
        $requester = $request->requester;
        $therapist = $request->targetTherapist;
        
        $title = $request->isGuardianChildAssignmentRequest() 
            ? 'Child Assignment Declined'
            : 'Connection Request Declined';
            
        $message = $request->isGuardianChildAssignmentRequest()
            ? "Your request to assign your child to therapist {$therapist->name} has been declined"
            : "Your connection request to therapist {$therapist->name} has been declined";
        
        $notification = $this->create(
            $requester->id,
            self::TYPE_CONNECTION_REQUEST_DECLINED,
            $title,
            $message,
            [
                'request_id' => $request->id,
                'therapist_id' => $therapist->id,
                'declined_by' => $declinedBy->name,
            ],
            "/therapists/search",
            'normal'
        );
        
        if ($notification->exists) {
            // Send email notification
            $childName = null;
            if ($request->isGuardianChildAssignmentRequest() && $request->target_client_id) {
                $child = $request->targetClient;
                $childName = $child ? $child->name : null;
            }
            
            $this->emailService->sendConnectionRequestDeclinedNotification(
                $requester,
                $therapist->name,
                ucfirst(str_replace('_', ' ', $request->request_type)),
                $declinedBy->name,
                $childName
            );
        }
        
        return $notification->exists ? $notification : null;
    }

    /**
     * Create notification for connection termination
     */
    public function notifyConnectionTerminated(
        TherapistClientConnection $connection,
        User $terminatedBy
    ): Collection {
        $notifications = collect();
        
        $therapist = $connection->therapist;
        $client = $connection->client;
        $clientType = $connection->client_type;
        
        // Notify therapist (if not the one who terminated)
        if ($therapist->id !== $terminatedBy->id) {
            $therapistNotification = $this->create(
                $therapist->id,
                self::TYPE_CONNECTION_TERMINATED,
                'Connection Terminated',
                "Your therapeutic relationship with {$clientType} {$client->name} has been terminated",
                [
                    'connection_id' => $connection->id,
                    'client_id' => $client->id,
                    'client_type' => $clientType,
                    'terminated_by' => $terminatedBy->name,
                ],
                "/connections",
                'normal'
            );
            
            if ($therapistNotification->exists) {
                $notifications->push($therapistNotification);
                
                // Send email notification to therapist
                $this->emailService->sendConnectionTerminatedNotification(
                    $therapist,
                    $client->name,
                    $clientType,
                    ucfirst(str_replace('_', ' ', $connection->connection_type)),
                    $terminatedBy->name
                );
            }
        }
        
        // Notify client (if not the one who terminated)
        if ($client->id !== $terminatedBy->id) {
            $clientNotification = $this->create(
                $client->id,
                self::TYPE_CONNECTION_TERMINATED,
                'Connection Terminated',
                "Your therapeutic relationship with {$therapist->name} has been terminated",
                [
                    'connection_id' => $connection->id,
                    'therapist_id' => $therapist->id,
                    'terminated_by' => $terminatedBy->name,
                ],
                "/connections",
                'normal'
            );
            
            if ($clientNotification->exists) {
                $notifications->push($clientNotification);
                
                // Send email notification to client
                $this->emailService->sendConnectionTerminatedNotification(
                    $client,
                    $therapist->name,
                    'therapist',
                    ucfirst(str_replace('_', ' ', $connection->connection_type)),
                    $terminatedBy->name
                );
            }
        }
        
        // If it's a child connection, also notify the guardian
        if ($clientType === 'child') {
            $guardian = $client->guardian;
            if ($guardian && $guardian->id !== $terminatedBy->id) {
                $guardianNotification = $this->create(
                    $guardian->id,
                    self::TYPE_CONNECTION_TERMINATED,
                    'Child Connection Terminated',
                    "The therapeutic relationship between your child {$client->name} and therapist {$therapist->name} has been terminated",
                    [
                        'connection_id' => $connection->id,
                        'child_id' => $client->id,
                        'therapist_id' => $therapist->id,
                        'terminated_by' => $terminatedBy->name,
                    ],
                    "/connections",
                    'normal'
                );
                
                if ($guardianNotification->exists) {
                    $notifications->push($guardianNotification);
                    
                    // Send email notification to guardian
                    $this->emailService->sendConnectionTerminatedNotification(
                        $guardian,
                        $therapist->name,
                        'therapist',
                        "Child Connection ({$client->name})",
                        $terminatedBy->name
                    );
                }
            }
        }
        
        return $notifications;
    }

    /**
     * Get icon for notification type
     */
    private function getIconForType(string $type): string
    {
        return match ($type) {
            self::TYPE_APPOINTMENT_SCHEDULED,
            self::TYPE_APPOINTMENT_CANCELLED,
            self::TYPE_APPOINTMENT_REMINDER => 'calendar',
            self::TYPE_MESSAGE_RECEIVED => 'message',
            self::TYPE_PANIC_ALERT => 'alert-triangle',
            self::TYPE_PANIC_ALERT_RESOLVED => 'check-circle',
            self::TYPE_ARTICLE_PUBLISHED => 'file-text',
            self::TYPE_COMMENT_RECEIVED => 'message-square',
            self::TYPE_SYSTEM_ANNOUNCEMENT => 'megaphone',
            self::TYPE_CONNECTION_ASSIGNED,
            self::TYPE_CONNECTION_REQUEST_APPROVED,
            self::TYPE_CHILD_ASSIGNED_TO_THERAPIST => 'user-check',
            self::TYPE_CONNECTION_REQUEST_RECEIVED => 'user-plus',
            self::TYPE_CONNECTION_REQUEST_DECLINED => 'user-x',
            self::TYPE_CONNECTION_TERMINATED => 'user-minus',
            default => 'bell',
        };
    }
}
