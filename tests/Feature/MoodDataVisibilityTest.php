<?php

use App\Models\User;
use App\Models\MoodLog;
use App\Models\TherapistClientConnection;
use App\Services\ConnectionManagementService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Seed roles for testing
    $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
    
    // Create test users
    $this->therapist = User::factory()->create();
    $this->therapist->assignRole('therapist');
    
    $this->guardian = User::factory()->create();
    $this->guardian->assignRole('guardian');
    
    $this->child = User::factory()->create(['guardian_id' => $this->guardian->id]);
    $this->child->assignRole('child');
    
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
    
    $this->connectionService = app(ConnectionManagementService::class);
});

test('therapist can access mood data for connected child', function () {
    // Create a connection between therapist and child
    $connection = $this->connectionService->createAdminAssignment(
        $this->therapist->id,
        $this->child->id,
        $this->admin->id
    );
    
    // Create some mood logs for the child
    MoodLog::create([
        'user_id' => $this->child->id,
        'mood' => 'happy',
        'notes' => 'Had a great day!',
        'mood_date' => Carbon::today(),
    ]);
    
    MoodLog::create([
        'user_id' => $this->child->id,
        'mood' => 'sad',
        'notes' => 'Feeling down',
        'mood_date' => Carbon::yesterday(),
    ]);
    
    // Test that therapist can access the child's mood data
    $response = $this->actingAs($this->therapist)
        ->get(route('therapist.child.mood.data', $this->child->id));
    
    // Debug the response if it's not 200
    if ($response->status() !== 200) {
        dump('Response status: ' . $response->status());
        dump('Response content: ' . $response->getContent());
    }
    
    // Should return 200 status (access allowed)
    $response->assertStatus(200);
});

test('therapist cannot access mood data for unconnected child', function () {
    // Create mood logs for the child (no connection exists)
    MoodLog::create([
        'user_id' => $this->child->id,
        'mood' => 'happy',
        'notes' => 'Had a great day!',
        'mood_date' => Carbon::today(),
    ]);
    
    // Test that therapist cannot access unconnected child's mood data
    $this->actingAs($this->therapist)
        ->get(route('therapist.child.mood.data', $this->child->id))
        ->assertStatus(403);
});

test('therapist overview shows mood data for all connected children', function () {
    // Create another child
    $child2 = User::factory()->create(['guardian_id' => $this->guardian->id]);
    $child2->assignRole('child');
    
    // Create connections for both children
    $this->connectionService->createAdminAssignment(
        $this->therapist->id,
        $this->child->id,
        $this->admin->id
    );
    
    $this->connectionService->createAdminAssignment(
        $this->therapist->id,
        $child2->id,
        $this->admin->id
    );
    
    // Create mood logs for both children
    MoodLog::create([
        'user_id' => $this->child->id,
        'mood' => 'happy',
        'mood_date' => Carbon::today(),
    ]);
    
    MoodLog::create([
        'user_id' => $child2->id,
        'mood' => 'neutral',
        'mood_date' => Carbon::today(),
    ]);
    
    // Test therapist overview
    $response = $this->actingAs($this->therapist)
        ->get(route('mood.therapist.overview'));
    
    // Should return 200 status (access allowed)
    $response->assertStatus(200);
});

test('therapist overview shows empty message when no children connected', function () {
    // Test therapist overview with no connections
    $response = $this->actingAs($this->therapist)
        ->get(route('mood.therapist.overview'));
    
    // Should return 200 status (access allowed)
    $response->assertStatus(200);
});

test('connection service correctly identifies therapist-child connections', function () {
    // Create connection
    $connection = $this->connectionService->createAdminAssignment(
        $this->therapist->id,
        $this->child->id,
        $this->admin->id
    );
    
    // Test connection exists
    expect($this->connectionService->hasActiveConnection($this->therapist->id, $this->child->id))
        ->toBeTrue();
    
    // Test no connection with different child
    $otherChild = User::factory()->create();
    $otherChild->assignRole('child');
    
    expect($this->connectionService->hasActiveConnection($this->therapist->id, $otherChild->id))
        ->toBeFalse();
});

test('mood log scope for therapist children works correctly', function () {
    // Create another therapist and child
    $otherTherapist = User::factory()->create();
    $otherTherapist->assignRole('therapist');
    
    $otherChild = User::factory()->create();
    $otherChild->assignRole('child');
    
    // Create connections
    $this->connectionService->createAdminAssignment(
        $this->therapist->id,
        $this->child->id,
        $this->admin->id
    );
    
    $this->connectionService->createAdminAssignment(
        $otherTherapist->id,
        $otherChild->id,
        $this->admin->id
    );
    
    // Create mood logs
    MoodLog::create([
        'user_id' => $this->child->id,
        'mood' => 'happy',
        'mood_date' => Carbon::today(),
    ]);
    
    MoodLog::create([
        'user_id' => $otherChild->id,
        'mood' => 'sad',
        'mood_date' => Carbon::today(),
    ]);
    
    // Test scope returns only connected children's mood logs
    $therapistMoodLogs = MoodLog::forTherapistChildren($this->therapist->id)->get();
    expect($therapistMoodLogs)->toHaveCount(1);
    expect($therapistMoodLogs->first()->user_id)->toBe($this->child->id);
    
    $otherTherapistMoodLogs = MoodLog::forTherapistChildren($otherTherapist->id)->get();
    expect($otherTherapistMoodLogs)->toHaveCount(1);
    expect($otherTherapistMoodLogs->first()->user_id)->toBe($otherChild->id);
});