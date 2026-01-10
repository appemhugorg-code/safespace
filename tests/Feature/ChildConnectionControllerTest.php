<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\TherapistClientConnection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Spatie\Permission\Models\Role;

class ChildConnectionControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create roles
        Role::create(['name' => 'child']);
        Role::create(['name' => 'therapist']);
        Role::create(['name' => 'guardian']);
        Role::create(['name' => 'admin']);
    }

    /** @test */
    public function child_can_view_their_connections_index()
    {
        // Create a child user
        $child = User::factory()->create([
            'status' => 'active',
        ]);
        $child->assignRole('child');

        // Create a therapist
        $therapist = User::factory()->create([
            'status' => 'active',
        ]);
        $therapist->assignRole('therapist');

        // Create a connection
        TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $child->id,
            'client_type' => 'child',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        // Act as the child and visit the connections page
        $response = $this->actingAs($child)
            ->get('/child/connections');

        // Assert the response is successful
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('child/connections/index')
                ->has('therapists', 1)
                ->has('stats')
                ->has('encouragement_message')
        );
    }

    /** @test */
    public function child_can_view_specific_connection_details()
    {
        // Create a child user
        $child = User::factory()->create([
            'status' => 'active',
        ]);
        $child->assignRole('child');

        // Create a therapist
        $therapist = User::factory()->create([
            'status' => 'active',
        ]);
        $therapist->assignRole('therapist');

        // Create a connection
        $connection = TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $child->id,
            'client_type' => 'child',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        // Act as the child and visit the specific connection page
        $response = $this->actingAs($child)
            ->get("/child/connections/{$connection->id}");

        // Assert the response is successful
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('child/connections/show')
                ->has('connection')
                ->has('communication_options')
                ->has('helpful_tips')
        );
    }

    /** @test */
    public function child_cannot_view_other_childs_connections()
    {
        // Create two child users
        $child1 = User::factory()->create(['status' => 'active']);
        $child1->assignRole('child');
        
        $child2 = User::factory()->create(['status' => 'active']);
        $child2->assignRole('child');

        // Create a therapist
        $therapist = User::factory()->create(['status' => 'active']);
        $therapist->assignRole('therapist');

        // Create a connection for child2
        $connection = TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $child2->id,
            'client_type' => 'child',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        // Act as child1 and try to view child2's connection
        $response = $this->actingAs($child1)
            ->get("/child/connections/{$connection->id}");

        // Assert access is forbidden
        $response->assertStatus(403);
    }

    /** @test */
    public function child_can_get_communication_features_for_connected_therapist()
    {
        // Create a child user
        $child = User::factory()->create(['status' => 'active']);
        $child->assignRole('child');

        // Create a therapist
        $therapist = User::factory()->create(['status' => 'active']);
        $therapist->assignRole('therapist');

        // Create a connection
        TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $child->id,
            'client_type' => 'child',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        // Act as the child and get communication features
        $response = $this->actingAs($child)
            ->get("/child/therapist/{$therapist->id}/features");

        // Assert the response is successful and contains features
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'features' => [
                'messaging' => [
                    'available' => true,
                ],
                'appointments' => [
                    'available' => true,
                ],
                'mood_sharing' => [
                    'available' => true,
                ],
                'games' => [
                    'available' => true,
                ],
            ],
        ]);
    }

    /** @test */
    public function child_cannot_get_features_for_unconnected_therapist()
    {
        // Create a child user
        $child = User::factory()->create(['status' => 'active']);
        $child->assignRole('child');

        // Create a therapist (no connection)
        $therapist = User::factory()->create(['status' => 'active']);
        $therapist->assignRole('therapist');

        // Act as the child and try to get communication features
        $response = $this->actingAs($child)
            ->get("/child/therapist/{$therapist->id}/features");

        // Assert access is forbidden
        $response->assertStatus(403);
        $response->assertJson([
            'success' => false,
            'message' => 'You are not connected to this therapist.',
        ]);
    }

    /** @test */
    public function non_child_users_cannot_access_child_routes()
    {
        // Create a guardian user
        $guardian = User::factory()->create(['status' => 'active']);
        $guardian->assignRole('guardian');

        // Try to access child connections page
        $response = $this->actingAs($guardian)
            ->get('/child/connections');

        // Assert access is forbidden (role middleware should block this)
        $response->assertStatus(403);
    }
}