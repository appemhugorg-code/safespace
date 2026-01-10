<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class EmailTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'name' => 'welcome_email',
                'subject' => 'Welcome to SafeSpace - Your Mental Health Journey Starts Here',
                'body_html' => $this->getWelcomeEmailHtml(),
                'body_text' => $this->getWelcomeEmailText(),
                'variables' => ['user_name', 'platform_url', 'verification_url'],
                'is_active' => true,
            ],
            [
                'name' => 'account_verification',
                'subject' => 'Please Verify Your SafeSpace Account',
                'body_html' => $this->getVerificationEmailHtml(),
                'body_text' => $this->getVerificationEmailText(),
                'variables' => ['user_name', 'verification_url', 'platform_url'],
                'is_active' => true,
            ],
            [
                'name' => 'password_reset',
                'subject' => 'Reset Your SafeSpace Password',
                'body_html' => $this->getPasswordResetEmailHtml(),
                'body_text' => $this->getPasswordResetEmailText(),
                'variables' => ['user_name', 'reset_url', 'platform_url'],
                'is_active' => true,
            ],
            [
                'name' => 'appointment_confirmation',
                'subject' => 'Therapy Session Confirmed - {appointment_date} at {appointment_time}',
                'body_html' => $this->getAppointmentConfirmationEmailHtml(),
                'body_text' => $this->getAppointmentConfirmationEmailText(),
                'variables' => ['user_name', 'appointment_date', 'appointment_time', 'therapist_name', 'client_name', 'duration', 'meet_link', 'platform_url'],
                'is_active' => true,
            ],
            [
                'name' => 'appointment_reminder_24h',
                'subject' => 'Reminder: Therapy Session Tomorrow at {appointment_time}',
                'body_html' => $this->getAppointmentReminder24hEmailHtml(),
                'body_text' => $this->getAppointmentReminder24hEmailText(),
                'variables' => ['user_name', 'appointment_date', 'appointment_time', 'therapist_name', 'client_name', 'meet_link', 'platform_url'],
                'is_active' => true,
            ],
            [
                'name' => 'appointment_reminder_1h',
                'subject' => 'Your Therapy Session Starts in 1 Hour',
                'body_html' => $this->getAppointmentReminder1hEmailHtml(),
                'body_text' => $this->getAppointmentReminder1hEmailText(),
                'variables' => ['user_name', 'appointment_date', 'appointment_time', 'therapist_name', 'client_name', 'meet_link', 'platform_url'],
                'is_active' => true,
            ],
            [
                'name' => 'panic_alert_notification',
                'subject' => 'URGENT: Panic Alert from {child_name}',
                'body_html' => $this->getPanicAlertEmailHtml(),
                'body_text' => $this->getPanicAlertEmailText(),
                'variables' => ['user_name', 'child_name', 'alert_time', 'alert_message', 'platform_url', 'alert_url'],
                'is_active' => true,
            ],
            [
                'name' => 'therapist_activation',
                'subject' => 'Your SafeSpace Therapist Account Has Been Approved',
                'body_html' => $this->getTherapistActivationEmailHtml(),
                'body_text' => $this->getTherapistActivationEmailText(),
                'variables' => ['user_name', 'platform_url', 'login_url'],
                'is_active' => true,
            ],
            [
                'name' => 'child_account_created_guardian',
                'subject' => 'Child Account Created Successfully - {child_name}',
                'body_html' => $this->getChildAccountCreatedGuardianEmailHtml(),
                'body_text' => $this->getChildAccountCreatedGuardianEmailText(),
                'variables' => ['user_name', 'child_name', 'platform_url', 'child_profile_url'],
                'is_active' => true,
            ],
            [
                'name' => 'child_account_created_child',
                'subject' => 'Welcome to SafeSpace, {child_name}!',
                'body_html' => $this->getChildAccountCreatedChildEmailHtml(),
                'body_text' => $this->getChildAccountCreatedChildEmailText(),
                'variables' => ['child_name', 'guardian_name', 'platform_url', 'login_url'],
                'is_active' => true,
            ],
            [
                'name' => 'appointment_cancellation',
                'subject' => 'Appointment Cancelled - {appointment_date}',
                'body_html' => $this->getAppointmentCancellationEmailHtml(),
                'body_text' => $this->getAppointmentCancellationEmailText(),
                'variables' => ['user_name', 'appointment_date', 'appointment_time', 'therapist_name', 'client_name', 'cancellation_reason', 'platform_url'],
                'is_active' => true,
            ],
            [
                'name' => 'new_message_notification',
                'subject' => 'New Message from {sender_name}',
                'body_html' => $this->getNewMessageEmailHtml(),
                'body_text' => $this->getNewMessageEmailText(),
                'variables' => ['user_name', 'sender_name', 'message_preview', 'conversation_url', 'platform_url'],
                'is_active' => true,
            ],
            [
                'name' => 'content_published_notification',
                'subject' => 'New Article: {article_title}',
                'body_html' => $this->getContentPublishedEmailHtml(),
                'body_text' => $this->getContentPublishedEmailText(),
                'variables' => ['user_name', 'article_title', 'author_name', 'article_excerpt', 'article_url', 'platform_url'],
                'is_active' => true,
            ],
            [
                'name' => 'connection_assigned',
                'subject' => 'New Therapeutic Connection - {connection_type}',
                'body_html' => $this->getConnectionAssignedEmailHtml(),
                'body_text' => $this->getConnectionAssignedEmailText(),
                'variables' => ['user_name', 'connection_type', 'other_user_name', 'other_user_role', 'assigned_by', 'connection_url', 'platform_url'],
                'is_active' => true,
            ],
            [
                'name' => 'connection_request_received',
                'subject' => 'New Connection Request from {requester_name}',
                'body_html' => $this->getConnectionRequestReceivedEmailHtml(),
                'body_text' => $this->getConnectionRequestReceivedEmailText(),
                'variables' => ['user_name', 'requester_name', 'request_type', 'request_message', 'child_name', 'request_url', 'platform_url'],
                'is_active' => true,
            ],
            [
                'name' => 'connection_request_approved',
                'subject' => 'Connection Request Approved - {therapist_name}',
                'body_html' => $this->getConnectionRequestApprovedEmailHtml(),
                'body_text' => $this->getConnectionRequestApprovedEmailText(),
                'variables' => ['user_name', 'therapist_name', 'request_type', 'child_name', 'approved_by', 'connection_url', 'platform_url'],
                'is_active' => true,
            ],
            [
                'name' => 'connection_request_declined',
                'subject' => 'Connection Request Update - {therapist_name}',
                'body_html' => $this->getConnectionRequestDeclinedEmailHtml(),
                'body_text' => $this->getConnectionRequestDeclinedEmailText(),
                'variables' => ['user_name', 'therapist_name', 'request_type', 'child_name', 'declined_by', 'search_url', 'platform_url'],
                'is_active' => true,
            ],
            [
                'name' => 'connection_terminated',
                'subject' => 'Therapeutic Connection Ended - {other_user_name}',
                'body_html' => $this->getConnectionTerminatedEmailHtml(),
                'body_text' => $this->getConnectionTerminatedEmailText(),
                'variables' => ['user_name', 'other_user_name', 'other_user_role', 'connection_type', 'terminated_by', 'platform_url'],
                'is_active' => true,
            ],
        ];

        foreach ($templates as $template) {
            \App\Models\EmailTemplate::updateOrCreate(
                ['name' => $template['name']],
                $template
            );
        }
    }

    private function getWelcomeEmailHtml(): string
    {
        return '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563eb; margin: 0;">Welcome to SafeSpace</h1>
                <p style="color: #6b7280; margin: 10px 0;">Your Mental Health Journey Starts Here</p>
            </div>

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1f2937; margin-top: 0;">Hello {user_name},</h2>
                <p style="color: #374151; line-height: 1.6;">
                    Welcome to SafeSpace! We\'re excited to have you join our community dedicated to mental health and well-being.
                </p>
                <p style="color: #374151; line-height: 1.6;">
                    To get started, please verify your account by clicking the button below:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{verification_url}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Verify My Account
                    </a>
                </div>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                <p style="color: #6b7280; font-size: 14px;">
                    If you have any questions, please visit <a href="{platform_url}" style="color: #2563eb;">SafeSpace</a>
                </p>
            </div>
        </div>';
    }

    private function getWelcomeEmailText(): string
    {
        return 'Hello {user_name},

Welcome to SafeSpace! We\'re excited to have you join our community dedicated to mental health and well-being.

To get started, please verify your account by visiting: {verification_url}

If you have any questions, please visit: {platform_url}

Best regards,
The SafeSpace Team';
    }

    private function getVerificationEmailHtml(): string
    {
        return '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb; text-align: center;">Verify Your Account</h1>

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                <p>Hello {user_name},</p>
                <p>Please click the button below to verify your SafeSpace account:</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{verification_url}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Verify Account
                    </a>
                </div>

                <p style="font-size: 14px; color: #6b7280;">
                    If you didn\'t create this account, you can safely ignore this email.
                </p>
            </div>
        </div>';
    }

    private function getVerificationEmailText(): string
    {
        return 'Hello {user_name},

Please verify your SafeSpace account by visiting: {verification_url}

If you didn\'t create this account, you can safely ignore this email.

Best regards,
The SafeSpace Team';
    }

    private function getPasswordResetEmailHtml(): string
    {
        return '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb; text-align: center;">Reset Your Password</h1>

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                <p>Hello {user_name},</p>
                <p>You requested to reset your SafeSpace password. Click the button below to set a new password:</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_url}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Reset Password
                    </a>
                </div>

                <p style="font-size: 14px; color: #6b7280;">
                    If you didn\'t request this reset, you can safely ignore this email.
                </p>
            </div>
        </div>';
    }

    private function getPasswordResetEmailText(): string
    {
        return 'Hello {user_name},

You requested to reset your SafeSpace password. Visit this link to set a new password: {reset_url}

If you didn\'t request this reset, you can safely ignore this email.

Best regards,
The SafeSpace Team';
    }

    private function getAppointmentConfirmationEmailHtml(): string
    {
        return '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb; text-align: center;">Therapy Session Confirmed</h1>

            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
                <h2 style="margin-top: 0; color: #1f2937;">Hello {user_name},</h2>
                <p>Your therapy session has been confirmed with the following details:</p>

                <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>Date:</strong> {appointment_date}</p>
                    <p><strong>Time:</strong> {appointment_time}</p>
                    <p><strong>Duration:</strong> {duration}</p>
                    <p><strong>Therapist:</strong> {therapist_name}</p>
                    <p><strong>Client:</strong> {client_name}</p>
                </div>

                <p><strong>Meeting Link:</strong> {meet_link}</p>

                <p style="font-size: 14px; color: #6b7280;">
                    You will receive reminder emails before your session. If you need to reschedule, please contact us as soon as possible.
                </p>
            </div>
        </div>';
    }

    private function getAppointmentConfirmationEmailText(): string
    {
        return 'Hello {user_name},

Your therapy session has been confirmed:

Date: {appointment_date}
Time: {appointment_time}
Duration: {duration}
Therapist: {therapist_name}
Client: {client_name}

Meeting Link: {meet_link}

You will receive reminder emails before your session.

Best regards,
The SafeSpace Team';
    }

    private function getAppointmentReminder24hEmailHtml(): string
    {
        return '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #f59e0b; text-align: center;">Session Reminder - Tomorrow</h1>

            <div style="background: #fffbeb; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <h2 style="margin-top: 0; color: #1f2937;">Hello {user_name},</h2>
                <p>This is a friendly reminder that you have a therapy session scheduled for tomorrow:</p>

                <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>Date:</strong> {appointment_date}</p>
                    <p><strong>Time:</strong> {appointment_time}</p>
                    <p><strong>Therapist:</strong> {therapist_name}</p>
                </div>

                <p>Please make sure you\'re available and have a stable internet connection for your video session.</p>
            </div>
        </div>';
    }

    private function getAppointmentReminder24hEmailText(): string
    {
        return 'Hello {user_name},

Reminder: You have a therapy session tomorrow.

Date: {appointment_date}
Time: {appointment_time}
Therapist: {therapist_name}

Please make sure you\'re available and have a stable internet connection.

Best regards,
The SafeSpace Team';
    }

    private function getAppointmentReminder1hEmailHtml(): string
    {
        return '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #dc2626; text-align: center;">Session Starting Soon!</h1>

            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
                <h2 style="margin-top: 0; color: #1f2937;">Hello {user_name},</h2>
                <p><strong>Your therapy session starts in 1 hour!</strong></p>

                <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>Time:</strong> {appointment_time}</p>
                    <p><strong>Therapist:</strong> {therapist_name}</p>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{meet_link}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Join Session Now
                    </a>
                </div>

                <p style="font-size: 14px; color: #6b7280;">
                    Please join a few minutes early to test your audio and video.
                </p>
            </div>
        </div>';
    }

    private function getAppointmentReminder1hEmailText(): string
    {
        return 'Hello {user_name},

Your therapy session starts in 1 hour!

Time: {appointment_time}
Therapist: {therapist_name}

Join the session: {meet_link}

Please join a few minutes early to test your audio and video.

Best regards,
The SafeSpace Team';
    }

    private function getPanicAlertEmailHtml(): string
    {
        return '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #dc2626; text-align: center;">🚨 URGENT: Panic Alert</h1>

            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border: 2px solid #dc2626;">
                <h2 style="margin-top: 0; color: #1f2937;">Hello {user_name},</h2>
                <p><strong>A panic alert has been triggered by {child_name}.</strong></p>

                <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>Time:</strong> {alert_time}</p>
                    <p><strong>Message:</strong> {alert_message}</p>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{alert_url}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        View Alert Details
                    </a>
                </div>

                <p style="font-size: 14px; color: #dc2626; font-weight: bold;">
                    Please respond to this alert as soon as possible.
                </p>
            </div>
        </div>';
    }

    private function getPanicAlertEmailText(): string
    {
        return 'URGENT: Panic Alert

Hello {user_name},

A panic alert has been triggered by {child_name}.

Time: {alert_time}
Message: {alert_message}

View alert details: {alert_url}

Please respond to this alert as soon as possible.

Best regards,
The SafeSpace Team';
    }

    private function getTherapistActivationEmailHtml(): string
    {
        return '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10b981; text-align: center;">🎉 Account Approved!</h1>

            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                <h2 style="margin-top: 0; color: #1f2937;">Congratulations {user_name},</h2>
                <p>Your SafeSpace therapist account has been approved and is now active!</p>

                <p>You can now:</p>
                <ul style="color: #374151; line-height: 1.6;">
                    <li>Access your therapist dashboard</li>
                    <li>Manage your availability and schedule appointments</li>
                    <li>Connect with clients and guardians</li>
                    <li>Create and publish educational content</li>
                    <li>Access all therapist tools and resources</li>
                </ul>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{login_url}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Access Your Dashboard
                    </a>
                </div>

                <p style="font-size: 14px; color: #6b7280;">
                    Welcome to the SafeSpace team! If you have any questions, please don\'t hesitate to reach out.
                </p>
            </div>
        </div>';
    }

    private function getTherapistActivationEmailText(): string
    {
        return 'Congratulations {user_name},

Your SafeSpace therapist account has been approved and is now active!

You can now:
- Access your therapist dashboard
- Manage your availability and schedule appointments
- Connect with clients and guardians
- Create and publish educational content
- Access all therapist tools and resources

Access your dashboard: {login_url}

Welcome to the SafeSpace team!

Best regards,
The SafeSpace Team';
    }

    private function getChildAccountCreatedGuardianEmailHtml(): string
    {
        return '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb; text-align: center;">Child Account Created</h1>

            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
                <h2 style="margin-top: 0; color: #1f2937;">Hello {user_name},</h2>
                <p>A SafeSpace account has been successfully created for <strong>{child_name}</strong>.</p>

                <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>Child\'s Name:</strong> {child_name}</p>
                    <p><strong>Account Status:</strong> Active</p>
                    <p><strong>Guardian:</strong> {user_name}</p>
                </div>

                <p>As the guardian, you can:</p>
                <ul style="color: #374151; line-height: 1.6;">
                    <li>Monitor your child\'s activities and progress</li>
                    <li>Schedule therapy sessions</li>
                    <li>Communicate with therapists</li>
                    <li>Access safety features and panic alerts</li>
                    <li>Manage account settings and privacy</li>
                </ul>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{child_profile_url}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        View Child\'s Profile
                    </a>
                </div>
            </div>
        </div>';
    }

    private function getChildAccountCreatedGuardianEmailText(): string
    {
        return 'Hello {user_name},

A SafeSpace account has been successfully created for {child_name}.

Child\'s Name: {child_name}
Account Status: Active
Guardian: {user_name}

As the guardian, you can:
- Monitor your child\'s activities and progress
- Schedule therapy sessions
- Communicate with therapists
- Access safety features and panic alerts
- Manage account settings and privacy

View child\'s profile: {child_profile_url}

Best regards,
The SafeSpace Team';
    }

    private function getChildAccountCreatedChildEmailHtml(): string
    {
        return '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #8b5cf6; text-align: center;">🌟 Welcome to SafeSpace!</h1>

            <div style="background: #faf5ff; padding: 20px; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                <h2 style="margin-top: 0; color: #1f2937;">Hi {child_name},</h2>
                <p>Welcome to SafeSpace! Your account has been set up by your guardian, <strong>{guardian_name}</strong>.</p>

                <p>SafeSpace is your safe place where you can:</p>
                <ul style="color: #374151; line-height: 1.6;">
                    <li>🗣️ Talk to caring therapists</li>
                    <li>📚 Learn about feelings and mental health</li>
                    <li>🆘 Get help when you need it</li>
                    <li>💬 Share your thoughts safely</li>
                    <li>🎯 Track your mood and progress</li>
                </ul>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{login_url}" style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Explore SafeSpace
                    </a>
                </div>

                <p style="font-size: 14px; color: #6b7280;">
                    Remember, SafeSpace is here to help you feel better and stay safe. You\'re not alone!
                </p>
            </div>
        </div>';
    }

    private function getChildAccountCreatedChildEmailText(): string
    {
        return 'Hi {child_name},

Welcome to SafeSpace! Your account has been set up by your guardian, {guardian_name}.

SafeSpace is your safe place where you can:
- Talk to caring therapists
- Learn about feelings and mental health
- Get help when you need it
- Share your thoughts safely
- Track your mood and progress

Explore SafeSpace: {login_url}

Remember, SafeSpace is here to help you feel better and stay safe. You\'re not alone!

Best regards,
The SafeSpace Team';
    }

    private function getAppointmentCancellationEmailHtml(): string
    {
        return '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #dc2626; text-align: center;">Appointment Cancelled</h1>
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
                <h2 style="margin-top: 0;">Hello {user_name},</h2>
                <p>Your therapy session has been cancelled:</p>
                <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>Date:</strong> {appointment_date}</p>
                    <p><strong>Time:</strong> {appointment_time}</p>
                    <p><strong>Therapist:</strong> {therapist_name}</p>
                    <p><strong>Reason:</strong> {cancellation_reason}</p>
                </div>
                <p>Please reschedule at your convenience.</p>
            </div>
        </div>';
    }

    private function getAppointmentCancellationEmailText(): string
    {
        return 'Hello {user_name},

Your therapy session has been cancelled:

Date: {appointment_date}
Time: {appointment_time}
Therapist: {therapist_name}
Reason: {cancellation_reason}

Please reschedule at your convenience.

Best regards,
The SafeSpace Team';
    }

    private function getNewMessageEmailHtml(): string
    {
        return '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb; text-align: center;">New Message</h1>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px;">
                <h2 style="margin-top: 0;">Hello {user_name},</h2>
                <p>You have a new message from <strong>{sender_name}</strong>:</p>
                <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0; font-style: italic;">
                    {message_preview}
                </div>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{conversation_url}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        View Message
                    </a>
                </div>
            </div>
        </div>';
    }

    private function getNewMessageEmailText(): string
    {
        return 'Hello {user_name},

You have a new message from {sender_name}:

{message_preview}

View message: {conversation_url}

Best regards,
The SafeSpace Team';
    }

    private function getContentPublishedEmailHtml(): string
    {
        return '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10b981; text-align: center;">New Article Published</h1>
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px;">
                <h2 style="margin-top: 0;">Hello {user_name},</h2>
                <p>A new article has been published on SafeSpace:</p>
                <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #1f2937;">{article_title}</h3>
                    <p style="color: #6b7280; font-size: 14px;">By {author_name}</p>
                    <p style="color: #374151; line-height: 1.6;">{article_excerpt}</p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{article_url}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Read Article
                    </a>
                </div>
            </div>
        </div>';
    }

    private function getContentPublishedEmailText(): string
    {
        return 'Hello {user_name},

A new article has been published on SafeSpace:

{article_title}
By {author_name}

{article_excerpt}

Read article: {article_url}

Best regards,
The SafeSpace Team';
    }

    private function getConnectionAssignedEmailHtml(): string
    {
        return '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10b981; text-align: center;">🤝 New Therapeutic Connection</h1>

            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                <h2 style="margin-top: 0; color: #1f2937;">Hello {user_name},</h2>
                <p>You have been connected with a new {other_user_role} on SafeSpace.</p>

                <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>Connection Type:</strong> {connection_type}</p>
                    <p><strong>{other_user_role}:</strong> {other_user_name}</p>
                    <p><strong>Assigned By:</strong> {assigned_by}</p>
                </div>

                <p>This therapeutic connection allows you to:</p>
                <ul style="color: #374151; line-height: 1.6;">
                    <li>Schedule and attend therapy sessions</li>
                    <li>Communicate securely through SafeSpace messaging</li>
                    <li>Share relevant mental health information</li>
                    <li>Access therapeutic tools and resources</li>
                </ul>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{connection_url}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        View Connection Details
                    </a>
                </div>

                <p style="font-size: 14px; color: #6b7280;">
                    Welcome to your therapeutic journey on SafeSpace. We\'re here to support you every step of the way.
                </p>
            </div>
        </div>';
    }

    private function getConnectionAssignedEmailText(): string
    {
        return 'Hello {user_name},

You have been connected with a new {other_user_role} on SafeSpace.

Connection Type: {connection_type}
{other_user_role}: {other_user_name}
Assigned By: {assigned_by}

This therapeutic connection allows you to:
- Schedule and attend therapy sessions
- Communicate securely through SafeSpace messaging
- Share relevant mental health information
- Access therapeutic tools and resources

View connection details: {connection_url}

Welcome to your therapeutic journey on SafeSpace.

Best regards,
The SafeSpace Team';
    }

    private function getConnectionRequestReceivedEmailHtml(): string
    {
        return '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb; text-align: center;">📋 New Connection Request</h1>

            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
                <h2 style="margin-top: 0; color: #1f2937;">Hello {user_name},</h2>
                <p>You have received a new connection request on SafeSpace.</p>

                <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>From:</strong> {requester_name}</p>
                    <p><strong>Request Type:</strong> {request_type}</p>
                    {child_name && <p><strong>Child:</strong> {child_name}</p>}
                    {request_message && <p><strong>Message:</strong> {request_message}</p>}
                </div>

                <p>Please review this request and decide whether to approve or decline the therapeutic connection.</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{request_url}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Review Request
                    </a>
                </div>

                <p style="font-size: 14px; color: #6b7280;">
                    Take your time to consider each request carefully. You can approve or decline based on your availability and expertise.
                </p>
            </div>
        </div>';
    }

    private function getConnectionRequestReceivedEmailText(): string
    {
        return 'Hello {user_name},

You have received a new connection request on SafeSpace.

From: {requester_name}
Request Type: {request_type}
{child_name && Child: {child_name}}
{request_message && Message: {request_message}}

Please review this request and decide whether to approve or decline the therapeutic connection.

Review request: {request_url}

Take your time to consider each request carefully.

Best regards,
The SafeSpace Team';
    }

    private function getConnectionRequestApprovedEmailHtml(): string
    {
        return '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10b981; text-align: center;">✅ Connection Request Approved</h1>

            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                <h2 style="margin-top: 0; color: #1f2937;">Great news, {user_name}!</h2>
                <p>Your connection request has been approved by <strong>{therapist_name}</strong>.</p>

                <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>Therapist:</strong> {therapist_name}</p>
                    <p><strong>Request Type:</strong> {request_type}</p>
                    {child_name && <p><strong>Child:</strong> {child_name}</p>}
                    <p><strong>Approved By:</strong> {approved_by}</p>
                </div>

                <p>You can now:</p>
                <ul style="color: #374151; line-height: 1.6;">
                    <li>Schedule therapy sessions</li>
                    <li>Send secure messages</li>
                    <li>Access therapeutic resources</li>
                    <li>Share relevant information safely</li>
                </ul>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{connection_url}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Start Your Journey
                    </a>
                </div>

                <p style="font-size: 14px; color: #6b7280;">
                    Welcome to your therapeutic journey. We\'re excited to support you on SafeSpace.
                </p>
            </div>
        </div>';
    }

    private function getConnectionRequestApprovedEmailText(): string
    {
        return 'Great news, {user_name}!

Your connection request has been approved by {therapist_name}.

Therapist: {therapist_name}
Request Type: {request_type}
{child_name && Child: {child_name}}
Approved By: {approved_by}

You can now:
- Schedule therapy sessions
- Send secure messages
- Access therapeutic resources
- Share relevant information safely

Start your journey: {connection_url}

Welcome to your therapeutic journey on SafeSpace.

Best regards,
The SafeSpace Team';
    }

    private function getConnectionRequestDeclinedEmailHtml(): string
    {
        return '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #f59e0b; text-align: center;">📋 Connection Request Update</h1>

            <div style="background: #fffbeb; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <h2 style="margin-top: 0; color: #1f2937;">Hello {user_name},</h2>
                <p>We wanted to update you on your recent connection request.</p>

                <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>Therapist:</strong> {therapist_name}</p>
                    <p><strong>Request Type:</strong> {request_type}</p>
                    {child_name && <p><strong>Child:</strong> {child_name}</p>}
                    <p><strong>Status:</strong> Not approved at this time</p>
                </div>

                <p>While this particular request wasn\'t approved, there are many other qualified therapists available on SafeSpace who may be a great fit for your needs.</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{search_url}" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Find Other Therapists
                    </a>
                </div>

                <p style="font-size: 14px; color: #6b7280;">
                    Don\'t be discouraged. Finding the right therapeutic match is important, and we\'re here to help you connect with the right professional.
                </p>
            </div>
        </div>';
    }

    private function getConnectionRequestDeclinedEmailText(): string
    {
        return 'Hello {user_name},

We wanted to update you on your recent connection request.

Therapist: {therapist_name}
Request Type: {request_type}
{child_name && Child: {child_name}}
Status: Not approved at this time

While this particular request wasn\'t approved, there are many other qualified therapists available on SafeSpace who may be a great fit for your needs.

Find other therapists: {search_url}

Don\'t be discouraged. Finding the right therapeutic match is important.

Best regards,
The SafeSpace Team';
    }

    private function getConnectionTerminatedEmailHtml(): string
    {
        return '
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #6b7280; text-align: center;">🔚 Connection Ended</h1>

            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #6b7280;">
                <h2 style="margin-top: 0; color: #1f2937;">Hello {user_name},</h2>
                <p>We\'re writing to inform you that a therapeutic connection has been ended.</p>

                <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>{other_user_role}:</strong> {other_user_name}</p>
                    <p><strong>Connection Type:</strong> {connection_type}</p>
                    <p><strong>Ended By:</strong> {terminated_by}</p>
                </div>

                <p>While this connection has ended, your historical data and session records have been preserved for your reference. However, future interactions through this connection are no longer available.</p>

                <p>If you need to establish new therapeutic connections, you can:</p>
                <ul style="color: #374151; line-height: 1.6;">
                    <li>Search for available therapists</li>
                    <li>Submit new connection requests</li>
                    <li>Contact our support team for assistance</li>
                </ul>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{platform_url}" style="background: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Visit SafeSpace
                    </a>
                </div>

                <p style="font-size: 14px; color: #6b7280;">
                    Thank you for being part of the SafeSpace community. We\'re here to support your mental health journey.
                </p>
            </div>
        </div>';
    }

    private function getConnectionTerminatedEmailText(): string
    {
        return 'Hello {user_name},

We\'re writing to inform you that a therapeutic connection has been ended.

{other_user_role}: {other_user_name}
Connection Type: {connection_type}
Ended By: {terminated_by}

While this connection has ended, your historical data and session records have been preserved for your reference. However, future interactions through this connection are no longer available.

If you need to establish new therapeutic connections, you can:
- Search for available therapists
- Submit new connection requests
- Contact our support team for assistance

Visit SafeSpace: {platform_url}

Thank you for being part of the SafeSpace community.

Best regards,
The SafeSpace Team';
    }
}
