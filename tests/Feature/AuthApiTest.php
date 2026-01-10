<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed the database with roles and test users
        $this->seed([
            \Database\Seeders\RolePermissionSeeder::class,
            \Database\Seeders\TestUserSeeder::class,
        ]);
    }

    public function test_guardian_can_register(): void
    {
        $response = $this->postJson('/api/register/guardian', [
            'name' => 'John Guardian',
            'email' => 'guardian@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Guardian registration successful. Please wait for admin approval.',
                'data' => [
                    'name' => 'John Guardian',
                    'email' => 'guardian@example.com',
                    'status' => 'pending',
                    'roles' => ['guardian'],
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'guardian@example.com',
            'status' => 'pending',
        ]);
    }

    public function test_therapist_can_register(): void
    {
        $response = $this->postJson('/api/register/therapist', [
            'name' => 'Dr. Therapist',
            'email' => 'therapist@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Therapist registration successful. Please wait for admin approval.',
                'data' => [
                    'name' => 'Dr. Therapist',
                    'email' => 'therapist@example.com',
                    'status' => 'pending',
                    'roles' => ['therapist'],
                ],
            ]);
    }

    public function test_active_user_can_login(): void
    {
        // Use the seeded guardian user
        $response = $this->postJson('/api/login', [
            'email' => 'guardian@safespace.test',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Login successful',
                'data' => [
                    'email' => 'guardian@safespace.test',
                    'status' => 'active',
                    'roles' => ['guardian'],
                ],
            ])
            ->assertJsonStructure([
                'token',
                'data',
                'message',
            ]);
    }

    public function test_pending_user_cannot_login(): void
    {
        $user = User::factory()->create([
            'email' => 'pending@example.com',
            'password' => Hash::make('password123'),
            'status' => 'pending',
        ]);
        $user->assignRole('guardian');

        $response = $this->postJson('/api/login', [
            'email' => 'pending@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Your account is pending approval. Please wait for admin approval.',
            ]);
    }
}
