<?php

namespace App\Services;

use App\Jobs\SendEmailNotificationJob;
use App\Mail\WelcomeEmail;
use App\Models\Appointment;
use App\Models\Article;
use App\Models\EmailDelivery;
use App\Models\EmailTemplate;
use App\Models\Message;
use App\Models\PanicAlert;
use App\Models\User;
use App\Services\SafeSpaceMailer;
use App\Services\SecurityService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

class EmailNotificationService
{
    private SecurityService $securityService;

    public function __construct(SecurityService $securityService)
    {
        $this->securityService = $securityService;
    }
    /**
     * Send welcome email to new user.
     */
    public function sendWelcomeEmail(User $user): void
    {
        // Generate verification URL if user hasn't verified email
        $verificationUrl = null;
        if (!$user->hasVerifiedEmail()) {
            $verificationUrl = URL::temporarySignedRoute(
                'verification.verify',
                now()->addMinutes(60),
                [
                    'id' => $user->getKey(),
                    'hash' => sha1($user->getEmailForVerification()),
                ]
            );
        }

        // Send welcome email with automatic fallback handling
        $success = SafeSpaceMailer::send(
            $user->email, 
            new WelcomeEmail($user, $verificationUrl), 
            'welcome email'
        );

        if ($success) {
            Log::info('Welcome email process completed', [
                'user_id' => $user->id,
                'original_email' => $user->email,
                'using_fallback' => SafeSpaceMailer::isUsingFallback()
            ]);
        }
    }

    /**
     * Send account verification email.
     */
    public function sendAccountVerification(User $user): void
    {
        $template = EmailTemplate::findByName('account_verification');
        if (! $template) {
            Log::warning('Account verification email template not found');

            return;
        }

        $variables = [
            'user_name' => $user->name,
            'verification_url' => $this->generateVerificationUrl($user),
            'platform_url' => config('app.url'),
        ];

        $this->sendTemplatedEmail($user, $template, $variables);
    }

    /**
     * Send password reset email.
     */
    public function sendPasswordReset(User $user, string $token): void
    {
        $template = EmailTemplate::findByName('password_reset');
        if (! $template) {
            Log::warning('Password reset email template not found');

            return;
        }

        $variables = [
            'user_name' => $user->name,
            'reset_url' => url('/password/reset/'.$token),
            'platform_url' => config('app.url'),
        ];

        $this->sendTemplatedEmail($user, $template, $variables);
    }

    /**
     * Send therapist account activation email.
     */
    public function sendTherapistActivation(User $therapist): void
    {
        $template = EmailTemplate::findByName('therapist_activation');
        if (! $template) {
            Log::warning('Therapist activation email template not found');

            return;
        }

        $variables = [
            'user_name' => $therapist->name,
            'platform_url' => config('app.url'),
            'login_url' => url('/login'),
        ];

        $this->sendTemplatedEmail($therapist, $template, $variables);
    }

    /**
     * Send child account creation notifications.
     */
    public function sendChildAccountCreated(User $child, User $guardian): void
    {
        // Send notification to guardian
        $guardianTemplate = EmailTemplate::findByName('child_account_created_guardian');
        if ($guardianTemplate) {
            $guardianVariables = [
                'user_name' => $guardian->name,
                'child_name' => $child->name,
                'platform_url' => config('app.url'),
                'child_profile_url' => url('/children/'.$child->id),
            ];

            $this->sendTemplatedEmail($guardian, $guardianTemplate, $guardianVariables);
        } else {
            Log::warning('Child account created guardian email template not found');
        }

        // Send welcome email to child
        $childTemplate = EmailTemplate::findByName('child_account_created_child');
        if ($childTemplate) {
            $childVariables = [
                'child_name' => $child->name,
                'guardian_name' => $guardian->name,
                'platform_url' => config('app.url'),
                'login_url' => url('/login'),
            ];

            $this->sendTemplatedEmail($child, $childTemplate, $childVariables);
        } else {
            Log::warning('Child account created child email template not found');
        }
    }

    /**
     * Send appointment confirmation email.
     */
    public function sendAppointmentConfirmation(Appointment $appointment): void
    {
        $template = EmailTemplate::findByName('appointment_confirmation');
        if (! $template) {
            Log::warning('Appointment confirmation email template not found');

            return;
        }

        // Determine client name (child or guardian)
        $clientName = $appointment->child ? $appointment->child->name : ($appointment->guardian ? $appointment->guardian->name : 'Client');
        
        $variables = [
            'appointment_date' => $appointment->scheduled_at->format('F j, Y'),
            'appointment_time' => $appointment->scheduled_at->format('g:i A'),
            'therapist_name' => $appointment->therapist->name ?? 'Therapist',
            'client_name' => $clientName,
            'duration' => $appointment->duration_minutes.' minutes',
            'meet_link' => $appointment->google_meet_link ?? $appointment->meeting_link ?? 'Will be provided closer to appointment time',
            'platform_url' => config('app.url'),
        ];

        // Send to child if exists
        if ($appointment->child && $this->shouldSendNotification($appointment->child, 'appointment_reminder')) {
            $this->sendTemplatedEmail($appointment->child, $template, array_merge($variables, [
                'user_name' => $appointment->child->name,
            ]));
        }

        // Send to therapist
        if ($appointment->therapist && $this->shouldSendNotification($appointment->therapist, 'appointment_reminder')) {
            $this->sendTemplatedEmail($appointment->therapist, $template, array_merge($variables, [
                'user_name' => $appointment->therapist->name,
            ]));
        }

        // Send to guardian
        if ($appointment->guardian && $this->shouldSendNotification($appointment->guardian, 'appointment_reminder')) {
            $this->sendTemplatedEmail($appointment->guardian, $template, array_merge($variables, [
                'user_name' => $appointment->guardian->name,
            ]));
        }
    }

    /**
     * Send appointment reminder email.
     */
    public function sendAppointmentReminder(Appointment $appointment, string $reminderType): void
    {
        $templateName = $reminderType === '24h' ? 'appointment_reminder_24h' : 'appointment_reminder_1h';
        $template = EmailTemplate::findByName($templateName);

        if (! $template) {
            Log::warning("Appointment reminder email template not found: {$templateName}");

            return;
        }

        $variables = [
            'appointment_date' => $appointment->scheduled_at->format('F j, Y'),
            'appointment_time' => $appointment->scheduled_at->format('g:i A'),
            'therapist_name' => $appointment->therapist->name,
            'client_name' => $appointment->client->name,
            'meet_link' => $appointment->google_meet_link ?? $appointment->meeting_link ?? 'Will be provided shortly',
            'platform_url' => config('app.url'),
        ];

        // Send reminders to all participants
        $participants = [$appointment->client, $appointment->therapist];
        if ($appointment->guardian) {
            $participants[] = $appointment->guardian;
        }

        foreach ($participants as $participant) {
            if ($this->shouldSendNotification($participant, 'appointment_reminder')) {
                $this->sendTemplatedEmail($participant, $template, array_merge($variables, [
                    'user_name' => $participant->name,
                ]));
            }
        }

        // Track that reminder was sent
        \App\Models\AppointmentReminder::create([
            'appointment_id' => $appointment->id,
            'type' => $reminderType,
            'sent_at' => now(),
        ]);

        Log::info('Appointment reminder sent', [
            'appointment_id' => $appointment->id,
            'type' => $reminderType,
        ]);
    }

    /**
     * Send appointment cancellation email.
     */
    public function sendAppointmentCancellation(Appointment $appointment): void
    {
        $template = EmailTemplate::findByName('appointment_cancellation');
        if (! $template) {
            Log::warning('Appointment cancellation email template not found');

            return;
        }

        $variables = [
            'appointment_date' => $appointment->scheduled_at->format('F j, Y'),
            'appointment_time' => $appointment->scheduled_at->format('g:i A'),
            'therapist_name' => $appointment->therapist->name,
            'client_name' => $appointment->client->name,
            'cancellation_reason' => $appointment->cancellation_reason ?? 'No reason provided',
            'platform_url' => config('app.url'),
        ];

        // Send to all participants
        $participants = [$appointment->client, $appointment->therapist];
        if ($appointment->guardian) {
            $participants[] = $appointment->guardian;
        }

        foreach ($participants as $participant) {
            $this->sendTemplatedEmail($participant, $template, array_merge($variables, [
                'user_name' => $participant->name,
            ]));
        }
    }

    /**
     * Send panic alert notification email.
     */
    public function sendPanicAlertNotification(PanicAlert $alert): void
    {
        $template = EmailTemplate::findByName('panic_alert_notification');
        if (! $template) {
            Log::warning('Panic alert notification email template not found');

            return;
        }

        $variables = [
            'child_name' => $alert->child->name,
            'alert_time' => $alert->created_at->format('F j, Y g:i A'),
            'alert_message' => $alert->message ?? 'Emergency assistance requested',
            'platform_url' => config('app.url'),
            'alert_url' => url('/panic-alerts/'.$alert->id),
        ];

        // Send to guardians
        if ($alert->child->guardian && $this->shouldSendNotification($alert->child->guardian, 'emergency_alert')) {
            $this->sendTemplatedEmail($alert->child->guardian, $template, array_merge($variables, [
                'user_name' => $alert->child->guardian->name,
            ]));
        }

        // Send to assigned therapists
        foreach ($alert->child->assignedTherapists as $therapist) {
            if ($this->shouldSendNotification($therapist, 'emergency_alert')) {
                $this->sendTemplatedEmail($therapist, $template, array_merge($variables, [
                    'user_name' => $therapist->name,
                ]));
            }
        }

        // Send to all admins
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            if ($this->shouldSendNotification($admin, 'emergency_alert')) {
                $this->sendTemplatedEmail($admin, $template, array_merge($variables, [
                    'user_name' => $admin->name,
                ]));
            }
        }
    }

    /**
     * Send new message notification email.
     */
    public function sendNewMessageNotification(Message $message): void
    {
        $template = EmailTemplate::findByName('new_message_notification');
        if (! $template) {
            Log::warning('New message notification email template not found');

            return;
        }

        $recipient = $message->isGroupMessage() ? null : $message->recipient;

        if (! $recipient || ! $this->shouldSendNotification($recipient, 'message_notification')) {
            return;
        }

        $variables = [
            'user_name' => $recipient->name,
            'sender_name' => $message->sender->name,
            'message_preview' => substr($message->content, 0, 100).(strlen($message->content) > 100 ? '...' : ''),
            'conversation_url' => $message->isGroupMessage()
                ? url('/messages/groups/'.$message->group_id)
                : url('/messages/conversation/'.$message->sender_id),
            'platform_url' => config('app.url'),
        ];

        $this->sendTemplatedEmail($recipient, $template, $variables);
    }

    /**
     * Send content published notification email.
     */
    public function sendContentPublishedNotification(Article $article): void
    {
        $template = EmailTemplate::findByName('content_published_notification');
        if (! $template) {
            Log::warning('Content published notification email template not found');

            return;
        }

        $variables = [
            'article_title' => $article->title,
            'author_name' => $article->author->name,
            'article_excerpt' => $article->excerpt ?? substr(strip_tags($article->content), 0, 200).'...',
            'article_url' => url('/articles/'.$article->slug),
            'platform_url' => config('app.url'),
        ];

        // Send to users who want content updates
        $users = User::whereHas('emailPreferences', function ($query) {
            $query->where('content_updates', true);
        })->get();

        foreach ($users as $user) {
            // Check if content is appropriate for user's role
            if ($this->isContentAppropriateForUser($article, $user)) {
                $this->sendTemplatedEmail($user, $template, array_merge($variables, [
                    'user_name' => $user->name,
                ]));
            }
        }
    }

    /**
     * Send templated email to user.
     */
    private function sendTemplatedEmail(User $user, EmailTemplate $template, array $variables): void
    {
        // Validate email address
        if (!$this->securityService->validateEmail($user->email)) {
            Log::warning('Invalid email address detected', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);
            return;
        }

        // Sanitize all variables
        $sanitizedVariables = [];
        foreach ($variables as $key => $value) {
            if (is_string($value)) {
                $sanitizedVariables[$key] = $this->securityService->sanitizeInput($value);
            } else {
                $sanitizedVariables[$key] = $value;
            }
        }

        // Create email delivery record
        $delivery = EmailDelivery::create([
            'user_id' => $user->id,
            'template_name' => $template->name,
            'subject' => $template->subject,
            'recipient_email' => $user->email,
            'status' => 'queued',
        ]);

        // Dispatch email job
        SendEmailNotificationJob::dispatch($user, $template, $sanitizedVariables, $delivery->id);
    }

    /**
     * Check if user should receive notification type.
     */
    private function shouldSendNotification(User $user, string $notificationType): bool
    {
        $preferences = $user->getEmailPreferences();

        return $preferences->wantsNotification($notificationType);
    }

    /**
     * Check if content is appropriate for user.
     */
    private function isContentAppropriateForUser(Article $article, User $user): bool
    {
        if ($article->target_audience === 'all') {
            return true;
        }

        return match ($article->target_audience) {
            'children' => $user->hasRole('child'),
            'guardians' => $user->hasRole('guardian'),
            'therapists' => $user->hasRole('therapist'),
            default => false,
        };
    }

    /**
     * Generate verification URL for user.
     */
    private function generateVerificationUrl(User $user): string
    {
        // This would integrate with Laravel's email verification system
        return url('/email/verify/'.$user->id.'/'.sha1($user->email));
    }

    /**
     * Send therapist activation email.
     */
    public function sendTherapistActivationEmail(User $therapist): void
    {
        $template = EmailTemplate::findByName('therapist_activation');
        if (! $template) {
            Log::warning('Therapist activation email template not found');
            return;
        }

        $variables = [
            'therapist_name' => $therapist->name,
            'platform_url' => config('app.url'),
            'login_url' => config('app.url') . '/login',
        ];

        $this->sendTemplatedEmail($therapist, $template, $variables);
    }

    /**
     * Send child account creation emails.
     */
    public function sendChildAccountCreatedEmails(User $child, User $guardian): void
    {
        // Send email to guardian
        $guardianTemplate = EmailTemplate::findByName('child_account_created_guardian');
        if ($guardianTemplate) {
            $variables = [
                'guardian_name' => $guardian->name,
                'child_name' => $child->name,
                'platform_url' => config('app.url'),
            ];
            $this->sendTemplatedEmail($guardian, $guardianTemplate, $variables);
        }

        // Send email to child
        $childTemplate = EmailTemplate::findByName('child_account_created_child');
        if ($childTemplate) {
            $variables = [
                'child_name' => $child->name,
                'guardian_name' => $guardian->name,
                'platform_url' => config('app.url'),
            ];
            $this->sendTemplatedEmail($child, $childTemplate, $variables);
        }
    }

    /**
     * Send system maintenance notification.
     */
    public function sendSystemMaintenanceNotification(array $users): void
    {
        $template = EmailTemplate::findByName('system_maintenance');
        if (! $template) {
            Log::warning('System maintenance email template not found');
            return;
        }

        foreach ($users as $user) {
            $variables = [
                'user_name' => $user['name'] ?? $user->name,
                'platform_url' => config('app.url'),
                'maintenance_date' => now()->addDays(1)->format('Y-m-d H:i:s'),
            ];

            if (is_array($user)) {
                $userModel = User::find($user['id']);
                if ($userModel) {
                    $this->sendTemplatedEmail($userModel, $template, $variables);
                }
            } else {
                $this->sendTemplatedEmail($user, $template, $variables);
            }
        }
    }

    /**
     * Check if the exception is a Resend domain restriction error.
     */
    private function isResendDomainError(\Exception $e): bool
    {
        $message = $e->getMessage();
        return str_contains($message, 'domain is not verified') || 
               str_contains($message, 'can only send testing emails to your own email address') ||
               str_contains($message, 'verify a domain at resend.com/domains');
    }

    /**
     * Send email with fallback to admin email when domain restrictions occur.
     */
    private function sendEmailWithFallback(string $originalEmail, $mailable, string $emailType): void
    {
        $fallbackEmail = 'straycat.ai@gmail.com';
        
        try {
            // Send to fallback email with note about original recipient
            Mail::to($fallbackEmail)->send($mailable);
            
            Log::warning("Email redirected due to domain restrictions", [
                'original_email' => $originalEmail,
                'fallback_email' => $fallbackEmail,
                'email_type' => $emailType,
                'reason' => 'Resend domain not verified - using fallback email'
            ]);
            
        } catch (\Exception $fallbackException) {
            Log::error("Failed to send email even with fallback", [
                'original_email' => $originalEmail,
                'fallback_email' => $fallbackEmail,
                'email_type' => $emailType,
                'error' => $fallbackException->getMessage()
            ]);
        }
    }

    /**
     * Send connection assignment notification email.
     */
    public function sendConnectionAssignedNotification(
        User $user, 
        User $otherUser, 
        string $otherUserRole, 
        string $connectionType, 
        string $assignedBy
    ): void {
        $template = EmailTemplate::findByName('connection_assigned');
        if (!$template) {
            Log::warning('Connection assigned email template not found');
            return;
        }

        $variables = [
            'user_name' => $user->name,
            'connection_type' => $connectionType,
            'other_user_name' => $otherUser->name,
            'other_user_role' => $otherUserRole,
            'assigned_by' => $assignedBy,
            'connection_url' => url('/connections'),
            'platform_url' => config('app.url'),
        ];

        $this->sendTemplatedEmail($user, $template, $variables);
    }

    /**
     * Send connection request received notification email.
     */
    public function sendConnectionRequestReceivedNotification(
        User $therapist,
        User $requester,
        string $requestType,
        ?string $requestMessage = null,
        ?string $childName = null
    ): void {
        $template = EmailTemplate::findByName('connection_request_received');
        if (!$template) {
            Log::warning('Connection request received email template not found');
            return;
        }

        $variables = [
            'user_name' => $therapist->name,
            'requester_name' => $requester->name,
            'request_type' => $requestType,
            'request_message' => $requestMessage,
            'child_name' => $childName,
            'request_url' => url('/requests/pending'),
            'platform_url' => config('app.url'),
        ];

        $this->sendTemplatedEmail($therapist, $template, $variables);
    }

    /**
     * Send connection request approved notification email.
     */
    public function sendConnectionRequestApprovedNotification(
        User $requester,
        string $therapistName,
        string $requestType,
        string $approvedBy,
        ?string $childName = null
    ): void {
        $template = EmailTemplate::findByName('connection_request_approved');
        if (!$template) {
            Log::warning('Connection request approved email template not found');
            return;
        }

        $variables = [
            'user_name' => $requester->name,
            'therapist_name' => $therapistName,
            'request_type' => $requestType,
            'child_name' => $childName,
            'approved_by' => $approvedBy,
            'connection_url' => url('/connections'),
            'platform_url' => config('app.url'),
        ];

        $this->sendTemplatedEmail($requester, $template, $variables);
    }

    /**
     * Send connection request declined notification email.
     */
    public function sendConnectionRequestDeclinedNotification(
        User $requester,
        string $therapistName,
        string $requestType,
        string $declinedBy,
        ?string $childName = null
    ): void {
        $template = EmailTemplate::findByName('connection_request_declined');
        if (!$template) {
            Log::warning('Connection request declined email template not found');
            return;
        }

        $variables = [
            'user_name' => $requester->name,
            'therapist_name' => $therapistName,
            'request_type' => $requestType,
            'child_name' => $childName,
            'declined_by' => $declinedBy,
            'search_url' => url('/therapists/search'),
            'platform_url' => config('app.url'),
        ];

        $this->sendTemplatedEmail($requester, $template, $variables);
    }

    /**
     * Send connection terminated notification email.
     */
    public function sendConnectionTerminatedNotification(
        User $user,
        string $otherUserName,
        string $otherUserRole,
        string $connectionType,
        string $terminatedBy
    ): void {
        $template = EmailTemplate::findByName('connection_terminated');
        if (!$template) {
            Log::warning('Connection terminated email template not found');
            return;
        }

        $variables = [
            'user_name' => $user->name,
            'other_user_name' => $otherUserName,
            'other_user_role' => $otherUserRole,
            'connection_type' => $connectionType,
            'terminated_by' => $terminatedBy,
            'platform_url' => config('app.url'),
        ];

        $this->sendTemplatedEmail($user, $template, $variables);
    }

    /**
     * Safe email sending with automatic fallback handling.
     */
    private function sendEmailSafely(string $email, $mailable, string $emailType): void
    {
        try {
            Mail::to($email)->send($mailable);
            
            Log::info("Email sent successfully", [
                'email' => $email,
                'email_type' => $emailType,
                'mail_driver' => config('mail.default')
            ]);
            
        } catch (\Exception $e) {
            if ($this->isResendDomainError($e)) {
                $this->sendEmailWithFallback($email, $mailable, $emailType);
            } else {
                Log::error("Failed to send email", [
                    'email' => $email,
                    'email_type' => $emailType,
                    'error' => $e->getMessage()
                ]);
                
                // Try fallback anyway to ensure user flow continues
                $this->sendEmailWithFallback($email, $mailable, $emailType);
            }
        }
    }
}
