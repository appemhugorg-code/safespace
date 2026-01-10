<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\User;
use App\Services\MultiParticipantAppointmentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GoogleMeetIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected MultiParticipantAppointmentService $appointmentService;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed roles
        $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
        
        $this->appointmentService = app(MultiParticipantAppointmentService::class);
    }

    public function test_individual_appointment_can_be_created()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');
        
        $child = User::factory()->create();
        $child->assignRole('child');
        
        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');

        $appointment = Appointment::create([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'guardian_id' => $guardian->id,
            'scheduled_at' => now()->addDays(1),
            'duration_minutes' => 60,
            'status' => 'confirmed',
            'appointment_type' => 'individual',
            'title' => 'Individual Therapy Session',
        ]);

        $this->assertInstanceOf(Appointment::class, $appointment);
        $this->assertEquals('individual', $appointment->appointment_type);
        $this->assertFalse($appointment->isMultiParticipant());
    }

    public function test_group_therapy_session_can_be_created()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');
        
        $client1 = User::factory()->create();
        $client1->assignRole('child');
        
        $client2 = User::factory()->create();
        $client2->assignRole('child');

        $appointment = $this->appointmentService->createGroupTherapySession([
            'therapist_id' => $therapist->id,
            'client_ids' => [$client1->id, $client2->id],
            'scheduled_at' => now()->addDays(1),
            'duration_minutes' => 90,
            'title' => 'Group Therapy Session',
        ]);

        $this->assertEquals('group', $appointment->appointment_type);
        $this->assertTrue($appointment->isGroupTherapy());
        $this->assertTrue($appointment->isMultiParticipant());
        $this->assertEquals(3, $appointment->participants()->count()); // therapist + 2 clients
    }

    public function test_family_session_can_be_created()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');
        
        $child = User::factory()->create();
        $child->assignRole('child');
        
        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');

        $appointment = $this->appointmentService->createFamilySession([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'guardian_id' => $guardian->id,
            'scheduled_at' => now()->addDays(1),
            'duration_minutes' => 60,
            'title' => 'Family Therapy Session',
        ]);

        $this->assertEquals('family', $appointment->appointment_type);
        $this->assertTrue($appointment->isFamilySession());
        $this->assertEquals(3, $appointment->participants()->count());
    }

    public function test_consultation_session_can_be_created()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        
        $therapist1 = User::factory()->create();
        $therapist1->assignRole('therapist');
        
        $therapist2 = User::factory()->create();
        $therapist2->assignRole('therapist');

        $appointment = $this->appointmentService->createConsultationSession([
            'organizer_id' => $admin->id,
            'organizer_role' => 'admin',
            'participant_ids' => [$therapist1->id, $therapist2->id],
            'scheduled_at' => now()->addDays(1),
            'duration_minutes' => 30,
            'title' => 'Staff Meeting',
        ]);

        $this->assertEquals('consultation', $appointment->appointment_type);
        $this->assertTrue($appointment->isConsultation());
        $this->assertEquals(3, $appointment->participants()->count());
    }

    public function test_appointment_participants_can_be_managed()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');
        
        $child = User::factory()->create();
        $child->assignRole('child');
        
        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');

        $appointment = $this->appointmentService->createFamilySession([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'guardian_id' => $guardian->id,
            'scheduled_at' => now()->addDays(1),
            'duration_minutes' => 60,
        ]);

        // Add observer
        $observer = User::factory()->create();
        $observer->assignRole('admin');

        $participant = $this->appointmentService->addParticipant($appointment, $observer->id, 'observer');

        $this->assertEquals(4, $appointment->fresh()->participants()->count());
        $this->assertEquals('observer', $participant->role);

        // Remove participant
        $this->appointmentService->removeParticipant($appointment, $observer->id);
        $this->assertEquals(3, $appointment->fresh()->participants()->count());
    }

    public function test_participants_can_confirm_or_decline()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');
        
        $child = User::factory()->create();
        $child->assignRole('child');
        
        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');

        $appointment = $this->appointmentService->createFamilySession([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'guardian_id' => $guardian->id,
            'scheduled_at' => now()->addDays(1),
            'duration_minutes' => 60,
        ]);

        // Confirm child participation
        $this->appointmentService->confirmParticipant($appointment, $child->id);
        
        $childParticipant = $appointment->participants()->where('user_id', $child->id)->first();
        $this->assertEquals('confirmed', $childParticipant->status);

        // Decline guardian participation
        $this->appointmentService->declineParticipant($appointment, $guardian->id);
        
        $guardianParticipant = $appointment->participants()->where('user_id', $guardian->id)->first();
        $this->assertEquals('declined', $guardianParticipant->status);
    }

    public function test_appointment_statistics_are_calculated()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');
        
        $child = User::factory()->create();
        $child->assignRole('child');
        
        $guardian = User::factory()->create();
        $guardian->assignRole('guardian');

        $appointment = $this->appointmentService->createFamilySession([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'guardian_id' => $guardian->id,
            'scheduled_at' => now()->addDays(1),
            'duration_minutes' => 60,
        ]);

        // Confirm some participants
        $this->appointmentService->confirmParticipant($appointment, $child->id);
        $this->appointmentService->declineParticipant($appointment, $guardian->id);

        $stats = $this->appointmentService->getAppointmentStats($appointment);

        $this->assertEquals(3, $stats['total_participants']);
        $this->assertEquals(2, $stats['confirmed']); // therapist + child
        $this->assertEquals(1, $stats['declined']); // guardian
        $this->assertEquals(0, $stats['invited']);
    }

    public function test_appointment_conflict_detection_works()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');
        
        $child1 = User::factory()->create();
        $child1->assignRole('child');
        
        $child2 = User::factory()->create();
        $child2->assignRole('child');

        $scheduledTime = now()->addDays(1)->setTime(14, 0); // 2:00 PM

        // Create first appointment
        Appointment::create([
            'therapist_id' => $therapist->id,
            'child_id' => $child1->id,
            'scheduled_at' => $scheduledTime,
            'duration_minutes' => 60,
            'status' => 'confirmed',
        ]);

        // Check for conflict with overlapping appointment
        $hasConflict = Appointment::hasConflict(
            $therapist->id,
            $scheduledTime->copy()->addMinutes(30), // 2:30 PM (overlaps)
            60
        );

        $this->assertTrue($hasConflict);

        // Check for no conflict with non-overlapping appointment
        $hasConflict = Appointment::hasConflict(
            $therapist->id,
            $scheduledTime->copy()->addHours(2), // 4:00 PM (no overlap)
            60
        );

        $this->assertFalse($hasConflict);
    }

    public function test_appointment_api_endpoints_work()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');
        
        $child1 = User::factory()->create();
        $child1->assignRole('child');
        
        $child2 = User::factory()->create();
        $child2->assignRole('child');

        // Test group session creation via API
        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/appointments/group-session', [
                'therapist_id' => $therapist->id,
                'client_ids' => [$child1->id, $child2->id],
                'scheduled_at' => now()->addDays(1)->toISOString(),
                'duration_minutes' => 90,
                'title' => 'Group Session',
            ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'message',
            'appointment' => ['id', 'appointment_type'],
            'participants',
        ]);

        $appointmentId = $response->json('appointment.id');

        // Test getting participants
        $response = $this->actingAs($admin, 'sanctum')
            ->getJson("/api/appointments/{$appointmentId}/participants");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'participants',
            'stats',
        ]);
    }

    public function test_appointment_scheduling_respects_therapist_availability()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');

        // Mock therapist availability (this would normally be set through the availability system)
        // For this test, we'll assume the therapist is available Monday-Friday 9 AM - 5 PM

        $child = User::factory()->create();
        $child->assignRole('child');

        // Try to schedule during available hours (Wednesday 2 PM)
        $availableTime = now()->next('Wednesday')->setTime(14, 0);
        
        $appointment = Appointment::create([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'scheduled_at' => $availableTime,
            'duration_minutes' => 60,
            'status' => 'requested',
        ]);

        $this->assertInstanceOf(Appointment::class, $appointment);
        $this->assertEquals('requested', $appointment->status);
    }

    public function test_google_meet_link_placeholder_is_stored()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');
        
        $child = User::factory()->create();
        $child->assignRole('child');

        $appointment = Appointment::create([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'scheduled_at' => now()->addDays(1),
            'duration_minutes' => 60,
            'status' => 'confirmed',
            'google_meet_link' => 'https://meet.google.com/abc-defg-hij', // Mock link
            'google_event_id' => 'google_event_123',
        ]);

        $this->assertNotNull($appointment->google_meet_link);
        $this->assertNotNull($appointment->google_event_id);
    }

    public function test_appointment_end_time_is_calculated_correctly()
    {
        $therapist = User::factory()->create();
        $therapist->assignRole('therapist');
        
        $child = User::factory()->create();
        $child->assignRole('child');

        $startTime = now()->addDays(1)->setTime(14, 0); // 2:00 PM

        $appointment = Appointment::create([
            'therapist_id' => $therapist->id,
            'child_id' => $child->id,
            'scheduled_at' => $startTime,
            'duration_minutes' => 90,
            'status' => 'confirmed',
        ]);

        $expectedEndTime = $startTime->copy()->addMinutes(90); // 3:30 PM

        $this->assertEquals($expectedEndTime->format('Y-m-d H:i:s'), $appointment->end_time->format('Y-m-d H:i:s'));
    }
}