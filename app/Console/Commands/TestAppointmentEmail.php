<?php

namespace App\Console\Commands;

use App\Mail\AppointmentConfirmationEmail;
use App\Models\Appointment;
use App\Models\User;
use App\Services\GoogleMeetService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestAppointmentEmail extends Command
{
    protected $signature = 'appointment:test-email';
    protected $description = 'Create test appointment and send confirmation emails';

    public function __construct(private GoogleMeetService $googleMeetService)
    {
        parent::__construct();
    }

    public function handle()
    {
        // Get users
        $therapist = User::where('email', 'therapist@safespace.test')->first();
        $guardian = User::where('email', 'guardian@safespace.test')->first();
        $child = User::where('email', 'child@safespace.test')->first();

        if (!$therapist || !$guardian || !$child) {
            $this->error('Required test users not found. Run php artisan db:seed');
            return 1;
        }

        // Create test appointment
        $appointment = Appointment::create([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'guardian_id' => $guardian->id,
            'scheduled_at' => now()->addDays(2)->setTime(14, 0),
            'duration_minutes' => 60,
            'status' => 'confirmed',
            'appointment_type' => 'therapy_session',
            'title' => 'Initial Therapy Session',
            'description' => 'First session to discuss goals and establish rapport',
        ]);

        $this->info("✅ Created appointment ID: {$appointment->id}");

        // Try to create real Google Meet link using platform account
        $this->info("🔄 Creating Google Meet link using platform account...");
        $created = $this->googleMeetService->createTherapySession($appointment);
        
        if ($created) {
            $appointment->refresh();
            $this->info("✅ Google Meet link created: {$appointment->google_meet_link}");
        } else {
            $this->error("❌ Failed to create Google Meet link.");
            $this->warn("   Platform Google account needs to be connected first.");
            $this->info("   Run: php artisan google:connect-platform");
            return 1;
        }

        // Send to therapist
        Mail::to($therapist->email)
            ->cc(['joshokello@gmail.com', 'jasongeorgetumusiime@gmail.com'])
            ->send(new AppointmentConfirmationEmail($appointment, $therapist));
        $this->info("📧 Sent to therapist: {$therapist->email}");

        // Send to guardian
        Mail::to($guardian->email)
            ->cc(['joshokello@gmail.com', 'jasongeorgetumusiime@gmail.com'])
            ->send(new AppointmentConfirmationEmail($appointment, $guardian));
        $this->info("📧 Sent to guardian: {$guardian->email}");

        $this->info("\n✅ Test appointment emails sent successfully!");
        $this->info("CC'd to: joshokello@gmail.com, jasongeorgetumusiime@gmail.com");
        
        return 0;
    }
}
