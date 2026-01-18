<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\TherapistAvailability;
use App\Models\TherapistClientConnection;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChildAppointmentSchedulingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_child_can_view_connected_therapists_only()
    {
        $child = User::role('child')->first();
        
        $response = $this->actingAs($child)->get('/appointments/create');
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('appointments/create-universal')
                ->has('therapists')
                ->where('userRole', 'child')
        );
    }

    public function test_child_can_fetch_available_slots_for_connected_therapist()
    {
        $child = User::role('child')->first();
        $therapist = User::role('therapist')->first();
        
        // Create an active connection between child and therapist
        TherapistClientConnection::create([
            'client_id' => $child->id,
            'therapist_id' => $therapist->id,
            'client_type' => 'child',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_by' => $therapist->id,
        ]);
        
        // Ensure there's availability for the therapist
        TherapistAvailability::create([
            'therapist_id' => $therapist->id,
            'day_of_week' => Carbon::tomorrow()->dayOfWeek,
            'start_time' => '10:00',
            'end_time' => '11:00',
            'is_active' => true,
        ]);
        
        $url = '/api/appointments/available-slots?' . http_build_query([
            'therapist_id' => $therapist->id,
            'date' => Carbon::tomorrow()->format('Y-m-d'),
        ]);
        
        $response = $this->actingAs($child)->get($url);
        
        if ($response->status() !== 200) {
            dump('Response status: ' . $response->status());
            dump('Response content: ' . $response->content());
        }
        
        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                'time',
                'datetime',
                'display',
                'duration_minutes',
            ]
        ]);
    }

    public function test_child_can_schedule_appointment_with_connected_therapist()
    {
        $child = User::role('child')->first();
        $therapist = User::role('therapist')->first();
        
        // Create an active connection between child and therapist
        TherapistClientConnection::create([
            'client_id' => $child->id,
            'therapist_id' => $therapist->id,
            'client_type' => 'child',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_by' => $therapist->id,
        ]);
        
        // Ensure there's availability for the therapist
        TherapistAvailability::create([
            'therapist_id' => $therapist->id,
            'day_of_week' => Carbon::tomorrow()->dayOfWeek,
            'start_time' => '10:00',
            'end_time' => '11:00',
            'is_active' => true,
        ]);
        
        $scheduledAt = Carbon::tomorrow()->setTime(10, 0);
        
        $response = $this->actingAs($child)->post('/appointments', [
            'child_id' => $child->id,
            'therapist_id' => $therapist->id,
            'scheduled_at' => $scheduledAt->format('Y-m-d H:i'),
            'duration_minutes' => 60,
            'notes' => 'Test appointment',
        ]);
        
        $response->assertRedirect('/appointments');
        $response->assertSessionHas('success');
        
        $this->assertDatabaseHas('appointments', [
            'child_id' => $child->id,
            'therapist_id' => $therapist->id,
            'status' => 'requested',
        ]);
    }

    public function test_child_cannot_schedule_with_unconnected_therapist()
    {
        $child = User::role('child')->first();
        
        // Create a therapist without connection to the child
        $unconnectedTherapist = User::factory()->create();
        $unconnectedTherapist->assignRole('therapist');
        
        $scheduledAt = Carbon::tomorrow()->setTime(10, 0);
        
        $response = $this->actingAs($child)->post('/appointments', [
            'child_id' => $child->id,
            'therapist_id' => $unconnectedTherapist->id,
            'scheduled_at' => $scheduledAt->format('Y-m-d H:i'),
            'duration_minutes' => 60,
            'notes' => 'Test appointment',
        ]);
        
        $response->assertStatus(403);
    }

    public function test_api_returns_validation_error_for_invalid_date_format()
    {
        $child = User::role('child')->first();
        $therapist = User::role('therapist')->first();
        
        $url = '/api/appointments/available-slots?' . http_build_query([
            'therapist_id' => $therapist->id,
            'date' => 'invalid-date',
        ]);
        
        $response = $this->actingAs($child)->get($url);
        
        $response->assertStatus(400);
        $response->assertJsonStructure(['error', 'details']);
    }

    public function test_api_returns_empty_slots_for_unavailable_date()
    {
        $child = User::role('child')->first();
        $therapist = User::role('therapist')->first();
        
        // Create an active connection between child and therapist
        TherapistClientConnection::create([
            'client_id' => $child->id,
            'therapist_id' => $therapist->id,
            'client_type' => 'child',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_by' => $therapist->id,
        ]);
        
        // Don't create any availability for the therapist
        
        $url = '/api/appointments/available-slots?' . http_build_query([
            'therapist_id' => $therapist->id,
            'date' => Carbon::tomorrow()->format('Y-m-d'),
        ]);
        
        $response = $this->actingAs($child)->get($url);
        
        $response->assertStatus(200);
        $response->assertJson([]);
    }
}