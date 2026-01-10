<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\TherapistClientConnection;
use App\Models\Appointment;
use App\Models\MoodLog;
use App\Services\ConnectionPermissionService;
use App\Services\ConnectionManagementService;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConnectionPermissionServiceTest extends TestCase
{
    use RefreshDatabase;

    protected ConnectionPermissionService $permissionService;
    protected ConnectionManagementService $connectionService;
    protected User $admin;
    protected User $therapist;
    protected User $guardian;
    protected User $child;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles
        \Spatie\Permission\Models\Role::create(['name' => 'admin']);
        \Spatie\Permission\Models\Role::create(['name' => 'therapist']);
        \Spatie\Permission\Models\Role::create(['name' => 'guardian']);
        \Spatie\Permission\Models\Role::create(['name' => 'child']);

        $this->permissionService = app(ConnectionPermissionService::class);
        $this->connectionService = app(ConnectionManagementService::class);

        // Create test users
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        $this->therapist = User::factory()->create();
        $this->therapist->assignRole('therapist');

        $this->guardian = User::factory()->create();
        $this->guardian->assignRole('guardian');

        $this->child = User::factory()->create([
            'guardian_id' => $this->guardian->id,
        ]);
        $this->child->assignRole('child');
    }

    public function test_connection_termination_cancels_future_appointments()
    {
        // Create an active connection
        $connection = $this->connectionService->createAdminAssignment(
            $this->therapist->id,
            $this->child->id,
            $this->admin->id
        );

        // Create a future appointment
        $futureAppointment = Appointment::create([
            'therapist_id' => $this->therapist->id,
            'child_id' => $this->child->id,
            'guardian_id' => $this->guardian->id,
            'scheduled_at' => now()->addDays(7),
            'duration_minutes' => 60,
            'status' => 'confirmed',
        ]);

        // Create a past appointment
        $pastAppointment = Appointment::create([
            'therapist_id' => $this->therapist->id,
            'child_id' => $this->child->id,
            'guardian_id' => $this->guardian->id,
            'scheduled_at' => now()->subDays(7),
            'duration_minutes' => 60,
            'status' => 'completed',
        ]);

        // Terminate the connection
        $this->connectionService->terminateConnection($connection->id, $this->admin->id, 'Test termination');

        // Check that future appointment was cancelled
        $futureAppointment->refresh();
        expect($futureAppointment->status)->toBe('cancelled');
        expect($futureAppointment->cancellation_reason)->toBe('Therapeutic relationship terminated');

        // Check that past appointment remains unchanged
        $pastAppointment->refresh();
        expect($pastAppointment->status)->toBe('completed');
    }

    public function test_mood_data_access_respects_connection_status()
    {
        // Create mood logs
        $moodLog1 = MoodLog::create([
            'user_id' => $this->child->id,
            'mood' => 'happy',
            'mood_date' => now()->subDays(10)->format('Y-m-d'),
        ]);

        $moodLog2 = MoodLog::create([
            'user_id' => $this->child->id,
            'mood' => 'sad',
            'mood_date' => now()->subDays(5)->format('Y-m-d'),
        ]);

        // Create and then terminate connection
        $connection = $this->connectionService->createAdminAssignment(
            $this->therapist->id,
            $this->child->id,
            $this->admin->id
        );

        // Terminate connection 7 days ago (before the second mood log)
        $terminationDate = now()->subDays(7);
        $connection->update([
            'status' => 'terminated',
            'terminated_at' => $terminationDate,
        ]);

        // Therapist should only see mood data up to termination date
        $accessibleMoodData = $this->permissionService->getAccessibleMoodData(
            $this->therapist,
            $this->child,
            now()->subDays(15),
            now()
        );

        // Should only see the first mood log (before termination)
        expect($accessibleMoodData)->toHaveCount(1);
        expect($accessibleMoodData->first()->id)->toBe($moodLog1->id);
    }

    public function test_permission_updates_on_status_change()
    {
        // Create an active connection
        $connection = $this->connectionService->createAdminAssignment(
            $this->therapist->id,
            $this->child->id,
            $this->admin->id
        );

        // Verify messaging is allowed
        expect($this->permissionService->canMessage($this->therapist, $this->child))->toBeTrue();

        // Terminate the connection
        $connection->update(['status' => 'terminated', 'terminated_at' => now()]);

        // Verify messaging is no longer allowed for new conversations
        expect($this->permissionService->canMessage($this->therapist, $this->child))->toBeFalse();
    }

    public function test_family_relationships_always_allow_messaging()
    {
        // Guardian and child should always be able to message each other
        expect($this->permissionService->canMessage($this->guardian, $this->child))->toBeTrue();
        expect($this->permissionService->canMessage($this->child, $this->guardian))->toBeTrue();
    }

    public function test_admin_can_access_all_features()
    {
        // Admin should be able to access all features regardless of connections
        expect($this->permissionService->canMessage($this->admin, $this->therapist))->toBeTrue();
        expect($this->permissionService->canMessage($this->admin, $this->child))->toBeTrue();
        expect($this->permissionService->canViewMoodData($this->admin, $this->child))->toBeTrue();
        expect($this->permissionService->canScheduleAppointment($this->admin, $this->therapist))->toBeTrue();
    }

    public function test_accessible_appointments_filter_by_connection_status()
    {
        // Create connection
        $connection = $this->connectionService->createAdminAssignment(
            $this->therapist->id,
            $this->child->id,
            $this->admin->id
        );

        // Create appointments
        $pastAppointment = Appointment::create([
            'therapist_id' => $this->therapist->id,
            'child_id' => $this->child->id,
            'guardian_id' => $this->guardian->id,
            'scheduled_at' => now()->subDays(7),
            'duration_minutes' => 60,
            'status' => 'completed',
        ]);

        $futureAppointment = Appointment::create([
            'therapist_id' => $this->therapist->id,
            'child_id' => $this->child->id,
            'guardian_id' => $this->guardian->id,
            'scheduled_at' => now()->addDays(7),
            'duration_minutes' => 60,
            'status' => 'confirmed',
        ]);

        // Get accessible appointments while connection is active
        $appointments = $this->permissionService->getAccessibleAppointments($this->therapist);
        expect($appointments)->toHaveCount(2);

        // Terminate connection
        $connection->update(['status' => 'terminated', 'terminated_at' => now()]);

        // Get accessible appointments after termination
        $appointments = $this->permissionService->getAccessibleAppointments($this->therapist);
        
        // Should still see past appointment but future appointment should be cancelled
        $futureAppointment->refresh();
        expect($futureAppointment->status)->toBe('cancelled');
    }
}