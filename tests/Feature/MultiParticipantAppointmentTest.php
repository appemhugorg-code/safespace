<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\User;
use App\Models\TherapistClientConnection;
use App\Services\MultiParticipantAppointmentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MultiParticipantAppointmentTest extends TestCase
{
    use RefreshDatabase;

    protected MultiParticipantAppointmentService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(MultiParticipantAppointmentService::class);
        
        // Seed roles
        $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
    }

    public function test_can_create_group_therapy_session()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');

        $client1 = User::factory()->create();
        $client1->assignRole('child');

        $client2 = User::factory()->create();
        $client2->assignRole('child');

        // Create therapeutic connections
        TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $client1->id,
            'client_type' => 'child',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $client2->id,
            'client_type' => 'child',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        $appointment = $this->service->createGroupTherapySession([
            'therapist_id' => $therapist->id,
            'client_ids' => [$client1->id, $client2->id],
            'scheduled_at' => now()->addDays(1),
            'duration_minutes' => 60,
            'title' => 'Group Therapy Session',
        ]);

        $this->assertInstanceOf(Appointment::class, $appointment);
        $this->assertEquals('group', $appointment->appointment_type);
        $this->assertEquals(3, $appointment->participants()->count()); // therapist + 2 clients
    }

    public function test_can_create_family_session()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');

        $child = User::factory()->create();
        $child->assignRole('child');

        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');

        // Create therapeutic connections
        TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $child->id,
            'client_type' => 'child',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $guardian->id,
            'client_type' => 'guardian',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        $appointment = $this->service->createFamilySession([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'guardian_id' => $guardian->id,
            'scheduled_at' => now()->addDays(1),
            'duration_minutes' => 60,
            'title' => 'Family Session',
        ]);

        $this->assertInstanceOf(Appointment::class, $appointment);
        $this->assertEquals('family', $appointment->appointment_type);
        $this->assertEquals(3, $appointment->participants()->count()); // therapist + child + guardian
    }

    public function test_can_create_consultation_session()
    {
        $therapist1 = User::factory()->create();
        $therapist1->assignRole('therapist');

        $therapist2 = User::factory()->create();
        $therapist2->assignRole('therapist');

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $appointment = $this->service->createConsultationSession([
            'organizer_id' => $admin->id,
            'organizer_role' => 'admin',
            'participant_ids' => [$therapist1->id, $therapist2->id],
            'scheduled_at' => now()->addDays(1),
            'duration_minutes' => 60,
            'title' => 'Staff Consultation',
        ]);

        $this->assertInstanceOf(Appointment::class, $appointment);
        $this->assertEquals('consultation', $appointment->appointment_type);
        $this->assertEquals(3, $appointment->participants()->count()); // admin + 2 therapists
    }

    public function test_can_add_participant_to_appointment()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');

        $child = User::factory()->create();
        $child->assignRole('child');

        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');

        // Create therapeutic connections
        TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $child->id,
            'client_type' => 'child',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $guardian->id,
            'client_type' => 'guardian',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        $appointment = $this->service->createFamilySession([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'guardian_id' => $guardian->id,
            'scheduled_at' => now()->addDays(1),
            'duration_minutes' => 60,
        ]);

        $observer = User::factory()->create();
        $observer->assignRole('admin');

        $participant = $this->service->addParticipant($appointment, $observer->id, 'observer');

        $this->assertEquals(4, $appointment->fresh()->participants()->count());
        $this->assertEquals('observer', $participant->role);
    }

    public function test_can_remove_participant_from_appointment()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');

        $child = User::factory()->create();
        $child->assignRole('child');

        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');

        // Create therapeutic connections
        TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $child->id,
            'client_type' => 'child',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $guardian->id,
            'client_type' => 'guardian',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        $appointment = $this->service->createFamilySession([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'guardian_id' => $guardian->id,
            'scheduled_at' => now()->addDays(1),
            'duration_minutes' => 60,
        ]);

        $this->assertEquals(3, $appointment->participants()->count());

        $this->service->removeParticipant($appointment, $guardian->id);

        $this->assertEquals(2, $appointment->fresh()->participants()->count());
    }

    public function test_can_confirm_participant()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');

        $child = User::factory()->create();
        $child->assignRole('child');

        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');

        // Create therapeutic connections
        TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $child->id,
            'client_type' => 'child',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $guardian->id,
            'client_type' => 'guardian',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        $appointment = $this->service->createFamilySession([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'guardian_id' => $guardian->id,
            'scheduled_at' => now()->addDays(1),
            'duration_minutes' => 60,
        ]);

        $this->service->confirmParticipant($appointment, $child->id);

        $participant = $appointment->participants()->where('user_id', $child->id)->first();
        $this->assertEquals('confirmed', $participant->status);
    }

    public function test_can_decline_participant()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');

        $child = User::factory()->create();
        $child->assignRole('child');

        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');

        // Create therapeutic connections
        TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $child->id,
            'client_type' => 'child',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $guardian->id,
            'client_type' => 'guardian',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        $appointment = $this->service->createFamilySession([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'guardian_id' => $guardian->id,
            'scheduled_at' => now()->addDays(1),
            'duration_minutes' => 60,
        ]);

        $this->service->declineParticipant($appointment, $guardian->id);

        $participant = $appointment->participants()->where('user_id', $guardian->id)->first();
        $this->assertEquals('declined', $participant->status);
    }

    public function test_can_get_appointment_stats()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');

        $child = User::factory()->create();
        $child->assignRole('child');

        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');

        // Create therapeutic connections
        TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $child->id,
            'client_type' => 'child',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        TherapistClientConnection::create([
            'therapist_id' => $therapist->id,
            'client_id' => $guardian->id,
            'client_type' => 'guardian',
            'connection_type' => 'admin_assigned',
            'status' => 'active',
            'assigned_at' => now(),
        ]);

        $appointment = $this->service->createFamilySession([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'guardian_id' => $guardian->id,
            'scheduled_at' => now()->addDays(1),
            'duration_minutes' => 60,
        ]);

        $this->service->confirmParticipant($appointment, $child->id);
        $this->service->declineParticipant($appointment, $guardian->id);

        $stats = $this->service->getAppointmentStats($appointment);

        $this->assertEquals(3, $stats['total_participants']);
        $this->assertEquals(2, $stats['confirmed']); // therapist + child
        $this->assertEquals(1, $stats['declined']); // guardian
    }
}
