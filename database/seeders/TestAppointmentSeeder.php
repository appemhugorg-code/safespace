<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestAppointmentSeeder extends Seeder
{
    public function run(): void
    {
        // Get test users
        $therapist = User::where('email', 'therapist@safespace.test')->first();
        $guardian = User::where('email', 'guardian@safespace.test')->first();
        $child = User::where('email', 'child@safespace.test')->first();

        if (!$therapist || !$guardian || !$child) {
            $this->command->error('Test users not found. Please run TestUserSeeder first.');
            return;
        }

        // Create some past appointments so therapist can see clients in dropdown
        $appointments = [
            [
                'therapist_id' => $therapist->id,
                'child_id' => $child->id,
                'guardian_id' => $guardian->id,
                'scheduled_at' => now()->subDays(7),
                'duration_minutes' => 60,
                'status' => 'completed',
                'appointment_type' => 'individual',
                'notes' => 'Initial consultation session',
                'meeting_link' => 'https://meet.google.com/test-link-1',
            ],
            [
                'therapist_id' => $therapist->id,
                'child_id' => $child->id,
                'guardian_id' => $guardian->id,
                'scheduled_at' => now()->subDays(3),
                'duration_minutes' => 60,
                'status' => 'completed',
                'appointment_type' => 'individual',
                'notes' => 'Follow-up session',
                'meeting_link' => 'https://meet.google.com/test-link-2',
            ],
            [
                'therapist_id' => $therapist->id,
                'guardian_id' => $guardian->id,
                'scheduled_at' => now()->subDays(5),
                'duration_minutes' => 30,
                'status' => 'completed',
                'appointment_type' => 'consultation',
                'notes' => 'Parent consultation',
                'meeting_link' => 'https://meet.google.com/test-link-3',
            ],
        ];

        foreach ($appointments as $appointmentData) {
            Appointment::firstOrCreate(
                [
                    'therapist_id' => $appointmentData['therapist_id'],
                    'scheduled_at' => $appointmentData['scheduled_at'],
                ],
                $appointmentData
            );
        }

        $this->command->info('✅ Test appointments seeded successfully');
        $this->command->info('   - 2 completed sessions with Child Charlie');
        $this->command->info('   - 1 completed consultation with Guardian Grace');
    }
}
