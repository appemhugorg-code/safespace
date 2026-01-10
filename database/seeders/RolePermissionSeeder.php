<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // User management
            'manage users',
            'approve users',
            'view users',

            // Child management
            'create child accounts',
            'manage own children',
            'view child progress',

            // Mood tracking
            'create mood entries',
            'view mood history',
            'view mood analytics',

            // Appointments
            'create appointments',
            'manage appointments',
            'view appointments',

            // Communication
            'send messages',
            'moderate messages',

            // Content management
            'create articles',
            'manage articles',
            'view articles',

            // Emergency features
            'use panic button',
            'receive emergency alerts',

            // System administration
            'manage system settings',
            'view system reports',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions

        // Admin role - full access
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions(Permission::all());

        // Therapist role
        $therapistRole = Role::firstOrCreate(['name' => 'therapist']);
        $therapistRole->syncPermissions([
            'view users',
            'view child progress',
            'view mood history',
            'view mood analytics',
            'create appointments',
            'manage appointments',
            'view appointments',
            'send messages',
            'create articles',
            'manage articles',
            'view articles',
            'receive emergency alerts',
        ]);

        // Guardian role
        $guardianRole = Role::firstOrCreate(['name' => 'guardian']);
        $guardianRole->syncPermissions([
            'create child accounts',
            'manage own children',
            'view child progress',
            'view mood history',
            'view mood analytics',
            'view appointments',
            'send messages',
            'view articles',
            'receive emergency alerts',
        ]);

        // Child role
        $childRole = Role::firstOrCreate(['name' => 'child']);
        $childRole->syncPermissions([
            'create mood entries',
            'view mood history',
            'view appointments',
            'send messages',
            'view articles',
            'use panic button',
        ]);
    }
}
