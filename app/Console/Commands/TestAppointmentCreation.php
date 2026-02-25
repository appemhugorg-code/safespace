<?php

namespace App\Console\Commands;

use App\Models\Appointment;
use App\Models\TherapistClientConnection;
use App\Models\User;
use App\Services\EmailNotificationService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class TestAppointmentCreation extends Command
{
    protected $signature = 'test:appointment {email}';
    protected $description = 'Create a test appointment and send notification to specified email';

    public function handle(EmailNotificationService $emailService)
    {
        $email = $this->argument('email');
        
        $this->info("Creating test appointment for: {$email}");
        
        // Find or create user with the email
        $child = User::where('email', $email)->first();
        
        if (!$child) {
            $this->info("User not found. Creating new child user...");
            
            // Create guardian first
            $guardian = User::create([
                'name' => 'Test Guardian',
                'email' => 'guardian_' . $email,
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'is_approved' => true,
            ]);
            $guardian->assignRole('guardian');
            
            // Create child
            $child = User::create([
                'name' => 'Test Child',
                'email' => $email,
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'is_approved' => true,
                'guardian_id' => $guardian->id,
            ]);
            $child->assignRole('child');
            
            $this->info("Created child user: {$child->name} ({$child->email})");
        } else {
            $this->info("Found existing user: {$child->name}");
        }
        
        // Get or create therapist
        $therapist = User::role('therapist')->first();
        
        if (!$therapist) {
            $therapist = User::create([
                'name' => 'Test Therapist',
                'email' => 'therapist@safespace.test',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'is_approved' => true,
            ]);
            $therapist->assignRole('therapist');
            $this->info("Created therapist: {$therapist->name}");
        }
        
        // Create connection if doesn't exist
        $connection = TherapistClientConnection::where([
            'therapist_id' => $therapist->id,
            'client_id' => $child->id,
        ])->first();
        
        if (!$connection) {
            $connection = TherapistClientConnection::create([
                'client_id' => $child->id,
                'therapist_id' => $therapist->id,
                'client_type' => 'child',
                'connection_type' => 'admin_assigned',
                'status' => 'active',
                'assigned_by' => $therapist->id,
            ]);
            $this->info("Created therapist-child connection");
        }
        
        // Create appointment
        $scheduledAt = Carbon::now()->addDays(2)->setTime(14, 0);
        
        $appointment = Appointment::create([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'guardian_id' => $child->guardian_id,
            'scheduled_at' => $scheduledAt,
            'duration_minutes' => 60,
            'notes' => 'Test therapy session - created via command',
            'status' => 'requested',
            'appointment_type' => 'individual',
        ]);
        
        $this->info("Created appointment ID: {$appointment->id}");
        $this->info("Scheduled for: {$scheduledAt->format('Y-m-d H:i')}");
        
        // Generate Google Meet link
        try {
            // Check if therapist has Google OAuth configured
            if ($therapist->google_access_token) {
                $googleMeetService = app(\App\Services\GoogleMeetService::class);
                if ($googleMeetService->createTherapySession($appointment)) {
                    $appointment->refresh();
                    $this->info("✓ Google Meet link generated: {$appointment->google_meet_link}");
                }
            } else {
                // Generate a valid Google Meet-style link for testing
                // Format: xxx-yyyy-zzz (3-4-3 pattern with letters)
                $code = strtolower(substr(md5($appointment->id . time()), 0, 3) . '-' . 
                                   substr(md5($appointment->id . time() + 1), 0, 4) . '-' . 
                                   substr(md5($appointment->id . time() + 2), 0, 3));
                $meetLink = "https://meet.google.com/{$code}";
                $appointment->update(['meeting_link' => $meetLink]);
                $this->info("✓ Meeting link generated: {$meetLink}");
                $this->warn("⚠ Note: This is a test link format. Therapist needs to connect Google account for real working links.");
            }
        } catch (\Exception $e) {
            $this->warn("⚠ Could not generate meeting link: {$e->getMessage()}");
        }
        
        // Send email notification
        try {
            $emailService->sendAppointmentConfirmation($appointment);
            $this->info("✓ Email notification sent successfully to {$email}");
        } catch (\Exception $e) {
            $this->error("✗ Failed to send email: {$e->getMessage()}");
        }
        
        $this->newLine();
        $this->info("Test completed!");
        $this->info("Appointment details:");
        $this->table(
            ['Field', 'Value'],
            [
                ['ID', $appointment->id],
                ['Child', $child->name . ' (' . $child->email . ')'],
                ['Therapist', $therapist->name],
                ['Scheduled', $scheduledAt->format('M d, Y \a\t g:i A')],
                ['Duration', $appointment->duration_minutes . ' minutes'],
                ['Status', $appointment->status],
                ['Google Meet', $appointment->google_meet_link ?? $appointment->meeting_link ?? 'Not generated'],
            ]
        );
        
        return 0;
    }
}
