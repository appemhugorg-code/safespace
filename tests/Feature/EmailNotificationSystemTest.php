<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Appointment;
use App\Models\Article;
use App\Services\EmailNotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class EmailNotificationSystemTest extends TestCase
{
    use RefreshDatabase;

    protected EmailNotificationService $emailService;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed roles
        $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
        
        $this->emailService = app(EmailNotificationService::class);
        
        // Fake mail and queue for testing
        Mail::fake();
        Queue::fake();
    }

    public function test_welcome_email_is_sent_to_new_guardian()
    {
        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');

        $this->emailService->sendWelcomeEmail($guardian);

        // Assert email was queued
        Mail::assertQueued(\App\Mail\WelcomeEmail::class, function ($mail) use ($guardian) {
            return $mail->hasTo($guardian->email);
        });
    }

    public function test_therapist_activation_email_is_sent()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');

        $this->emailService->sendTherapistActivationEmail($therapist);

        // Assert email was queued
        Mail::assertQueued(\App\Mail\TherapistActivationEmail::class, function ($mail) use ($therapist) {
            return $mail->hasTo($therapist->email);
        });
    }

    public function test_child_account_creation_emails_are_sent()
    {
        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');
        
        $child = User::factory()->create(['guardian_id' => $guardian->id]);
        $child->assignRole('child');

        $this->emailService->sendChildAccountCreatedEmails($child, $guardian);

        // Assert both emails were queued
        Mail::assertQueued(\App\Mail\ChildAccountCreatedGuardianEmail::class);
        Mail::assertQueued(\App\Mail\ChildAccountCreatedChildEmail::class);
    }

    public function test_appointment_confirmation_email_is_sent()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');
        
        $child = User::factory()->create();
        $child->assignRole('child');

        $appointment = Appointment::factory()->create([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'scheduled_at' => now()->addDays(1),
        ]);

        $this->emailService->sendAppointmentConfirmation($appointment);

        Mail::assertQueued(\App\Mail\AppointmentConfirmationEmail::class);
    }

    public function test_appointment_reminder_emails_are_sent()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');
        
        $child = User::factory()->create();
        $child->assignRole('child');

        $appointment = Appointment::factory()->create([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'scheduled_at' => now()->addHours(1),
        ]);

        // Test 24-hour reminder
        $this->emailService->sendAppointmentReminder($appointment, '24h');
        Mail::assertQueued(\App\Mail\AppointmentReminderEmail::class);

        // Test 1-hour reminder
        Mail::fake(); // Reset
        $this->emailService->sendAppointmentReminder($appointment, '1h');
        Mail::assertQueued(\App\Mail\AppointmentReminderEmail::class);
    }

    public function test_panic_alert_notification_is_sent()
    {
        $child = User::factory()->create();
        $child->assignRole('child');
        
        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');
        
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');

        // Mock panic alert
        $alertData = [
            'child' => $child,
            'guardian' => $guardian,
            'therapist' => $therapist,
            'message' => 'Emergency alert triggered',
        ];

        $this->emailService->sendPanicAlertNotification($alertData);

        Mail::assertQueued(\App\Mail\PanicAlertEmail::class);
    }

    public function test_content_publication_notification_is_sent()
    {
        $author = User::factory()->create();
        $author->assignRole('therapist');

        $article = Article::factory()->create([
            'author_id' => $author->id,
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->emailService->sendContentPublishedNotification($article);

        Mail::assertQueued(\App\Mail\ContentPublishedEmail::class);
    }

    public function test_email_preferences_are_respected()
    {
        $user = User::factory()->create();
        $user->assignRole('guardian');

        // Disable appointment reminders
        $user->emailPreferences()->create([
            'appointment_reminders' => false,
            'message_notifications' => true,
            'content_updates' => true,
            'emergency_alerts' => true,
        ]);

        $appointment = Appointment::factory()->create([
            'therapist_id' => User::factory()->create()->id,
            'child_id' => $user->id,
            'scheduled_at' => now()->addHours(1),
        ]);

        // Should not send reminder due to preferences
        $this->emailService->sendAppointmentReminder($appointment, '1h');

        Mail::assertNotQueued(\App\Mail\AppointmentReminderEmail::class);
    }

    public function test_email_delivery_tracking_works()
    {
        $user = User::factory()->create();
        $user->assignRole('guardian');

        // Send email and check tracking
        $this->emailService->sendWelcomeEmail($user);

        // Check that delivery record was created
        $this->assertDatabaseHas('email_deliveries', [
            'user_id' => $user->id,
            'status' => 'pending',
        ]);
    }

    public function test_email_queue_processing_works()
    {
        Queue::fake();

        $user = User::factory()->create();
        $user->assignRole('guardian');

        $this->emailService->sendWelcomeEmail($user);

        // Assert job was pushed to queue
        Queue::assertPushed(\App\Jobs\SendEmailJob::class);
    }

    public function test_bulk_email_sending_works()
    {
        $users = User::factory()->count(5)->create();
        foreach ($users as $user) {
            $user->assignRole('guardian');
        }

        $this->emailService->sendSystemMaintenanceNotification($users->toArray());

        // Should queue 5 emails
        Mail::assertQueued(\App\Mail\SystemMaintenanceEmail::class, 5);
    }

    public function test_email_template_variables_are_replaced()
    {
        $user = User::factory()->create(['name' => 'John Doe']);
        $user->assignRole('guardian');

        $this->emailService->sendWelcomeEmail($user);

        Mail::assertQueued(\App\Mail\WelcomeEmail::class, function ($mail) {
            // Check that template variables are properly set
            return str_contains($mail->build()->render(), 'John Doe');
        });
    }
}