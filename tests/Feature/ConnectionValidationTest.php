<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;

class ConnectionValidationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create roles
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'therapist']);
        Role::create(['name' => 'guardian']);
        Role::create(['name' => 'child']);
    }

    public function test_validation_error_response_format()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/admin/connections', [
            'therapist_id' => '', // Invalid
            'client_id' => '', // Invalid
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'error' => [
                    'code',
                    'message',
                    'details' => [
                        'validation_errors'
                    ]
                ]
            ])
            ->assertJson([
                'success' => false,
                'error' => [
                    'code' => 'VALIDATION_FAILED',
                ]
            ]);
    }

    public function test_unauthorized_response_format()
    {
        // Test without authentication
        $response = $this->postJson('/api/admin/connections', [
            'therapist_id' => 1,
            'client_id' => 2,
        ]);

        $response->assertStatus(401);
    }

    public function test_successful_response_format()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');
        
        $client = User::factory()->create();
        $client->assignRole('guardian');
        
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/admin/connections', [
            'therapist_id' => $therapist->id,
            'client_id' => $client->id,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'connection' => [
                        'id',
                        'therapist_id',
                        'client_id',
                        'status',
                    ]
                ]
            ])
            ->assertJson([
                'success' => true,
            ]);
    }
}