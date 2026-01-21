<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class TestUserSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure roles exist (in case RoleSeeder hasn't run yet)
        $roles = ['admin', 'therapist', 'guardian', 'child'];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        // 🧑‍💼 Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@safespace.test'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'status' => 'active',
                'phone_number' => '782123456',
                'country_code' => '+256',
                'full_phone_number' => '+256782123456'
            ]
        );
        $admin->assignRole('admin');

        // 🧠 Therapist
        $therapist = User::firstOrCreate(
            ['email' => 'therapist@safespace.test'],
            [
                'name' => 'Therapist Talia',
                'password' => Hash::make('password'),
                'status' => 'active',
                'phone_number' => '702123456',
                'country_code' => '+256',
                'full_phone_number' => '+256702123456'
            ]
        );
        $therapist->assignRole('therapist');

        // 👩‍👧 Guardian
        $guardian = User::firstOrCreate(
            ['email' => 'guardian@safespace.test'],
            [
                'name' => 'Guardian Grace',
                'password' => Hash::make('password'),
                'status' => 'active',
                'phone_number' => '792123456',
                'country_code' => '+256',
                'full_phone_number' => '+256792123456'
            ]
        );
        $guardian->assignRole('guardian');

        // 🧒 Child (linked to guardian)
        $child = User::firstOrCreate(
            ['email' => 'child@safespace.test'],
            [
                'name' => 'Child Charlie',
                'password' => Hash::make('password'),
                'status' => 'active',
                'guardian_id' => $guardian->id,
            ]
        );
        $child->assignRole('child');

        $this->command->info('✅ Test users seeded successfully:');
        $this->command->info('Admin: admin@safespace.test / password');
        $this->command->info('Therapist: therapist@safespace.test / password');
        $this->command->info('Guardian: guardian@safespace.test / password');
        $this->command->info('Child: child@safespace.test / password');
    }
}
