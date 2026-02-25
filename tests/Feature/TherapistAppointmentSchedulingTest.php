<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\TherapistClientConnection;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TherapistAppointmentSchedulingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_therapist_can_initiate_appointment_with_connected_child()
    {
        $therapist = User::role('therapist')->first();
        $child = User::role('child')->first();
        
        // Create an active connection between therapist and child
        TherapistClientConnection::create([
            'client_id' => $child->id,
            'therapist_id' => $therapist->id,
            'client_type' => 'child',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_by' => $therapist->id,
        ]);
        
        $scheduledAt = Carbon::tomorrow()->setTime(10, 0);
        
        $response = $this->actingAs($therapist)->post('/therapist/appointments', [
            'client_id' => $child->id,
            'client_type' => 'child',
            'scheduled_at' => $scheduledAt->format('Y-m-d H:i'),
            'duration_minutes' => 60,
            'notes' => 'Initial therapy session',
        ]);
        
        $response->assertRedirect('/appointments');
        $response->assertSessionHas('success');
        
        $this->assertDatabaseHas('appointments', [
            'child_id' => $child->id,
            'therapist_id' => $therapist->id,
            'status' => 'requested',
            'appointment_type' => 'individual',
        ]);
    }

    public function test_therapist_cannot_create_appointment_with_unconnected_child()
    {
        $therapist = User::role('therapist')->first();
        
        // Create a child without connection to the therapist
        $unconnectedChild = User::factory()->create(['guardian_id' => User::role('guardian')->first()->id]);
        $unconnectedChild->assignRole('child');
        
        $scheduledAt = Carbon::tomorrow()->setTime(10, 0);
        
        $response = $this->actingAs($therapist)->post('/therapist/appointments', [
            'client_id' => $unconnectedChild->id,
            'client_type' => 'child',
            'scheduled_at' => $scheduledAt->format('Y-m-d H:i'),
            'duration_minutes' => 60,
            'notes' => 'Test appointment',
        ]);
        
        $response->assertSessionHasErrors('client_id');
    }

    public function test_therapist_can_view_appointment_creation_form()
    {
        $therapist = User::role('therapist')->first();
        
        $response = $this->actingAs($therapist)->get('/therapist/appointments/create');
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('therapist/appointment-create')
                ->has('clients')
                ->has('therapist')
        );
    }

    public function test_appointment_requires_valid_scheduled_time()
    {
        $therapist = User::role('therapist')->first();
        $child = User::role('child')->first();
        
        TherapistClientConnection::create([
            'client_id' => $child->id,
            'therapist_id' => $therapist->id,
            'client_type' => 'child',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_by' => $therapist->id,
        ]);
        
        // Try to schedule in the past
        $pastTime = Carbon::yesterday()->setTime(10, 0);
        
        $response = $this->actingAs($therapist)->post('/therapist/appointments', [
            'client_id' => $child->id,
            'client_type' => 'child',
            'scheduled_at' => $pastTime->format('Y-m-d H:i'),
            'duration_minutes' => 60,
            'notes' => 'Test appointment',
        ]);
        
        $response->assertSessionHasErrors('scheduled_at');
    }

    public function test_appointment_detects_scheduling_conflicts()
    {
        $therapist = User::role('therapist')->first();
        $child = User::role('child')->first();
        
        TherapistClientConnection::create([
            'client_id' => $child->id,
            'therapist_id' => $therapist->id,
            'client_type' => 'child',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_by' => $therapist->id,
        ]);
        
        $scheduledAt = Carbon::tomorrow()->setTime(10, 0);
        
        // Create existing appointment
        Appointment::create([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'scheduled_at' => $scheduledAt,
            'duration_minutes' => 60,
            'status' => 'confirmed',
            'appointment_type' => 'individual',
        ]);
        
        // Try to create overlapping appointment
        $response = $this->actingAs($therapist)->post('/therapist/appointments', [
            'client_id' => $child->id,
            'client_type' => 'child',
            'scheduled_at' => $scheduledAt->format('Y-m-d H:i'),
            'duration_minutes' => 60,
            'notes' => 'Conflicting appointment',
        ]);
        
        $response->assertSessionHasErrors('scheduled_at');
    }
}
