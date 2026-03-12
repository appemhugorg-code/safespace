<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\TherapistClientConnection;
use Illuminate\Database\Seeder;

class TestConnectionSeeder extends Seeder
{
    public function run(): void
    {
        $therapist = User::where('email', 'therapist@safespace.test')->first();
        $child = User::where('email', 'child@safespace.test')->first();
        $guardian = User::where('email', 'guardian@safespace.test')->first();

        if (!$therapist || !$child) {
            $this->command->warn('⚠️  Test users not found. Run TestUserSeeder first.');
            return;
        }

        // Create active therapist-child connection
        TherapistClientConnection::firstOrCreate(
            [
                'therapist_id' => $therapist->id,
                'client_id' => $child->id,
            ],
            [
                'client_type' => 'child',
                'connection_type' => 'therapy',
                'status' => 'active',
                'started_at' => now()->subMonths(2),
            ]
        );

        $this->command->info('✅ Test therapeutic connections created');
        $this->command->info("   Therapist ({$therapist->name}) ↔ Child ({$child->name})");
    }
}
