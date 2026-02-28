<?php

namespace App\Console\Commands;

use App\Mail\AppointmentConfirmationEmail;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendTestAppointmentEmail extends Command
{
    protected $signature = 'appointment:send-test';
    protected $description = 'Send test appointment email with placeholder Meet link';

    public function handle()
    {
        $therapist = User::where('email', 'therapist@safespace.test')->first();
        $guardian = User::where('email', 'guardian@safespace.test')->first();
        $child = User::where('email', 'child@safespace.test')->first();

        if (!$therapist || !$guardian || !$child) {
            $this->error('Required test users not found. Run php artisan db:seed');
            return 1;
        }

        // Create test appointment with placeholder Meet link
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
            'google_meet_link' => 'https://meet.google.com/placeholder-link',
        ]);

        $this->info("✅ Created appointment ID: {$appointment->id}");

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
        $this->info("📋 Recipients:");
        $this->info("   - {$therapist->email}");
        $this->info("   - {$guardian->email}");
        $this->info("   - joshokello@gmail.com (CC)");
        $this->info("   - jasongeorgetumusiime@gmail.com (CC)");
        
        return 0;
    }
}
