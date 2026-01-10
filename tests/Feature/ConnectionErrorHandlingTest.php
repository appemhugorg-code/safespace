<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\TherapistClientConnection;
use App\Models\ConnectionRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;

class ConnectionErrorHandlingTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create roles
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'therapist']);
        Role::create(['name' => 'guardian']);
        Role::create(['name' => 'child']);
    }

    /** @test */
    public function it_returns_validation_error_for_invalid_therapist_id()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/admin/connections', [
            'therapist_id' => 99999, // Non-existent ID
            'client_id' => 1,
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'error' => [
                    'code' => 'VALIDATION_FAILED',
                    'message' => 'The provided data is invalid.',
                ]
            ]);
    }

    /** @test */
    public function it_returns_error_for_invalid_user_role()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        
        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');
        
        $client = User::factory()->create();
        $client->assignRole('guardian');
        
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/admin/connections', [
            'therapist_id' => $guardian->id, // Guardian instead of therapist
            'client_id' => $client->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('error.code', 'VALIDATION_FAILED');
    }

    /** @test */
    public function it_returns_error_for_duplicate_connection()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');
        
        $client = User::factory()->create();
        $client->assignRole('guardian');

        // Create existing connection
        TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $client->id,
            'client_type' => 'guardian',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_by' => $admin->id,
            'assigned_at' => now(),
        ]);
        
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/admin/connections', [
            'therapist_id' => $therapist->id,
            'client_id' => $client->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('error.code', 'VALIDATION_FAILED');
    }

    /** @test */
    public function it_returns_unauthorized_for_missing_token()
    {
        $response = $this->postJson('/api/admin/connections', [
            'therapist_id' => 1,
            'client_id' => 2,
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'error' => [
                    'code' => 'UNAUTHORIZED',
                    'message' => 'Unauthenticated.',
                ]
            ]);
    }

    /** @test */
    public function it_returns_forbidden_for_insufficient_permissions()
    {
        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');
        Sanctum::actingAs($guardian);

        $response = $this->postJson('/api/admin/connections', [
            'therapist_id' => 1,
            'client_id' => 2,
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function it_returns_error_for_guardian_child_mismatch()
    {
        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');
        
        $otherGuardian = User::factory()->create();
        $otherGuardian->assignRole('guardian');
        
        $child = User::factory()->create(['guardian_id' => $otherGuardian->id]);
        $child->assignRole('child');
        
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');

        // Create connection between guardian and therapist
        TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $guardian->id,
            'client_type' => 'guardian',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_by' => 1,
            'assigned_at' => now(),
        ]);
        
        Sanctum::actingAs($guardian);

        $response = $this->postJson('/api/guardian/child-assignments', [
            'child_id' => $child->id, // Child belongs to different guardian
            'therapist_id' => $therapist->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('error.code', 'VALIDATION_FAILED');
    }

    /** @test */
    public function it_returns_error_for_guardian_not_connected_to_therapist()
    {
        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');
        
        $child = User::factory()->create(['guardian_id' => $guardian->id]);
        $child->assignRole('child');
        
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');
        
        Sanctum::actingAs($guardian);

        $response = $this->postJson('/api/guardian/child-assignments', [
            'child_id' => $child->id,
            'therapist_id' => $therapist->id, // No connection exists
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('error.code', 'VALIDATION_FAILED');
    }

    /** @test */
    public function it_returns_error_for_processing_non_existent_request()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');
        Sanctum::actingAs($therapist);

        $response = $this->postJson('/api/therapist/requests/99999/approve');

        $response->assertStatus(404)
            ->assertJsonPath('error.code', 'NOT_FOUND');
    }

    /** @test */
    public function it_returns_error_for_processing_request_not_owned_by_therapist()
    {
        $therapist1 = User::factory()->create();
        $therapist1->assignRole('therapist');
        
        $therapist2 = User::factory()->create();
        $therapist2->assignRole('therapist');
        
        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');

        $request = ConnectionRequest::create([
            'requester_id' => $guardian->id,
            'requester_type' => 'guardian',
            'target_therapist_id' => $therapist1->id,
            'request_type' => 'guardian_to_therapist',
            'status' => 'pending',
        ]);
        
        Sanctum::actingAs($therapist2); // Different therapist

        $response = $this->postJson("/api/therapist/requests/{$request->id}/approve");

        $response->assertStatus(403)
            ->assertJsonPath('error.code', 'INSUFFICIENT_PERMISSIONS');
    }

    /** @test */
    public function it_returns_error_for_processing_already_processed_request()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');
        
        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');

        $request = ConnectionRequest::create([
            'requester_id' => $guardian->id,
            'requester_type' => 'guardian',
            'target_therapist_id' => $therapist->id,
            'request_type' => 'guardian_to_therapist',
            'status' => 'approved', // Already processed
            'reviewed_by' => $therapist->id,
            'reviewed_at' => now(),
        ]);
        
        Sanctum::actingAs($therapist);

        $response = $this->postJson("/api/therapist/requests/{$request->id}/approve");

        $response->assertStatus(400)
            ->assertJsonPath('error.code', 'REQUEST_ALREADY_PROCESSED');
    }

    /** @test */
    public function it_returns_error_for_duplicate_pending_request()
    {
        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');
        
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');

        // Create existing pending request
        ConnectionRequest::create([
            'requester_id' => $guardian->id,
            'requester_type' => 'guardian',
            'target_therapist_id' => $therapist->id,
            'request_type' => 'guardian_to_therapist',
            'status' => 'pending',
        ]);
        
        Sanctum::actingAs($guardian);

        $response = $this->postJson('/api/guardian/connection-requests', [
            'therapist_id' => $therapist->id,
            'message' => 'Another request to the same therapist',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('error.code', 'VALIDATION_FAILED');
    }

    /** @test */
    public function it_includes_proper_error_details_in_responses()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/admin/connections', [
            'therapist_id' => '', // Invalid format
            'client_id' => 'not-a-number', // Invalid format
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'error' => [
                    'code',
                    'message',
                    'details' => [
                        'validation_errors' => [
                            'therapist_id',
                            'client_id',
                        ]
                    ]
                ]
            ]);
    }

    /** @test */
    public function it_returns_consistent_error_format_across_endpoints()
    {
        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');
        Sanctum::actingAs($guardian);

        // Test multiple endpoints for consistent error format
        $endpoints = [
            ['POST', '/api/guardian/connection-requests', ['therapist_id' => 99999]],
            ['POST', '/api/guardian/child-assignments', ['child_id' => 99999, 'therapist_id' => 99999]],
        ];

        foreach ($endpoints as [$method, $url, $data]) {
            $response = $this->json($method, $url, $data);
            
            $response->assertJsonStructure([
                'success',
                'error' => [
                    'code',
                    'message',
                ]
            ]);
            
            $this->assertFalse($response->json('success'));
            $this->assertIsString($response->json('error.code'));
            $this->assertIsString($response->json('error.message'));
        }
    }
}