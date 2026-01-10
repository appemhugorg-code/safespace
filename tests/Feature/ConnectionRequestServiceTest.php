<?php

use App\Models\User;
use App\Models\ConnectionRequest;
use App\Models\TherapistClientConnection;
use App\Services\ConnectionRequestService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->service = app(ConnectionRequestService::class);
    
    // Seed roles for testing
    $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
});

test('service can be instantiated', function () {
    expect($this->service)->toBeInstanceOf(ConnectionRequestService::class);
});

test('service returns empty statistics for empty database', function () {
    $stats = $this->service->getRequestStatistics();
    
    expect($stats)->toBeArray()
        ->and($stats['total_pending'])->toBe(0)
        ->and($stats['total_approved'])->toBe(0)
        ->and($stats['total_declined'])->toBe(0)
        ->and($stats['total_cancelled'])->toBe(0)
        ->and($stats['guardian_to_therapist'])->toBe(0)
        ->and($stats['child_assignments'])->toBe(0);
});

test('guardian can create request to therapist', function () {
    $guardian = User::factory()->create();
    $guardian->assignRole('guardian');
    
    $therapist = User::factory()->create();
    $therapist->assignRole('therapist');
    
    $request = $this->service->createGuardianRequest(
        $guardian->id, 
        $therapist->id, 
        'I would like to connect with you for therapy sessions'
    );
    
    expect($request)->toBeInstanceOf(ConnectionRequest::class)
        ->and($request->requester_id)->toBe($guardian->id)
        ->and($request->target_therapist_id)->toBe($therapist->id)
        ->and($request->request_type)->toBe('guardian_to_therapist')
        ->and($request->status)->toBe('pending')
        ->and($request->message)->toBe('I would like to connect with you for therapy sessions');
});

test('guardian cannot create duplicate request to same therapist', function () {
    $guardian = User::factory()->create();
    $guardian->assignRole('guardian');
    
    $therapist = User::factory()->create();
    $therapist->assignRole('therapist');
    
    // Create first request
    $this->service->createGuardianRequest($guardian->id, $therapist->id);
    
    // Try to create duplicate request
    expect(fn() => $this->service->createGuardianRequest($guardian->id, $therapist->id))
        ->toThrow(InvalidArgumentException::class, 'A pending request already exists');
});

test('therapist can approve guardian request', function () {
    $guardian = User::factory()->create();
    $guardian->assignRole('guardian');
    
    $therapist = User::factory()->create();
    $therapist->assignRole('therapist');
    
    // Create request
    $request = $this->service->createGuardianRequest($guardian->id, $therapist->id);
    
    // Approve request
    $success = $this->service->processRequest($request->id, 'approve', $therapist->id);
    
    expect($success)->toBeTrue();
    
    // Check that connection was created
    $connection = TherapistClientConnection::where('therapist_id', $therapist->id)
        ->where('client_id', $guardian->id)
        ->where('status', 'active')
        ->first();
    
    expect($connection)->not->toBeNull()
        ->and($connection->client_type)->toBe('guardian')
        ->and($connection->connection_type)->toBe('guardian_requested');
    
    // Check that request status was updated
    $request->refresh();
    expect($request->status)->toBe('approved');
});

test('therapist can decline guardian request', function () {
    $guardian = User::factory()->create();
    $guardian->assignRole('guardian');
    
    $therapist = User::factory()->create();
    $therapist->assignRole('therapist');
    
    // Create request
    $request = $this->service->createGuardianRequest($guardian->id, $therapist->id);
    
    // Decline request
    $success = $this->service->processRequest($request->id, 'decline', $therapist->id);
    
    expect($success)->toBeTrue();
    
    // Check that no connection was created
    $connection = TherapistClientConnection::where('therapist_id', $therapist->id)
        ->where('client_id', $guardian->id)
        ->first();
    
    expect($connection)->toBeNull();
    
    // Check that request status was updated
    $request->refresh();
    expect($request->status)->toBe('declined');
});

test('guardian can create child assignment request', function () {
    $guardian = User::factory()->create();
    $guardian->assignRole('guardian');
    
    $child = User::factory()->create(['guardian_id' => $guardian->id]);
    $child->assignRole('child');
    
    $therapist = User::factory()->create();
    $therapist->assignRole('therapist');
    
    // First create guardian-therapist connection
    TherapistClientConnection::create([
        'therapist_id' => $therapist->id,
        'client_id' => $guardian->id,
        'client_type' => 'guardian',
        'connection_type' => 'admin_assigned',
        'status' => 'active',
        'assigned_at' => now(),
    ]);
    
    // Now create child assignment request
    $request = $this->service->createChildAssignmentRequest($guardian->id, $child->id, $therapist->id);
    
    expect($request)->toBeInstanceOf(ConnectionRequest::class)
        ->and($request->requester_id)->toBe($guardian->id)
        ->and($request->target_therapist_id)->toBe($therapist->id)
        ->and($request->target_client_id)->toBe($child->id)
        ->and($request->request_type)->toBe('guardian_child_assignment')
        ->and($request->status)->toBe('pending');
});

test('guardian cannot assign child without existing therapist connection', function () {
    $guardian = User::factory()->create();
    $guardian->assignRole('guardian');
    
    $child = User::factory()->create(['guardian_id' => $guardian->id]);
    $child->assignRole('child');
    
    $therapist = User::factory()->create();
    $therapist->assignRole('therapist');
    
    // Try to create child assignment without guardian-therapist connection
    expect(fn() => $this->service->createChildAssignmentRequest($guardian->id, $child->id, $therapist->id))
        ->toThrow(InvalidArgumentException::class, 'Guardian must have an active connection with therapist');
});

test('service can get pending requests for therapist', function () {
    $guardian = User::factory()->create();
    $guardian->assignRole('guardian');
    
    $therapist = User::factory()->create();
    $therapist->assignRole('therapist');
    
    // Create request
    $request = $this->service->createGuardianRequest($guardian->id, $therapist->id);
    
    // Get pending requests
    $pendingRequests = $this->service->getPendingRequests($therapist->id);
    
    expect($pendingRequests)->toHaveCount(1)
        ->and($pendingRequests->first()->id)->toBe($request->id);
});

test('service can get requests made by guardian', function () {
    $guardian = User::factory()->create();
    $guardian->assignRole('guardian');
    
    $therapist = User::factory()->create();
    $therapist->assignRole('therapist');
    
    // Create request
    $request = $this->service->createGuardianRequest($guardian->id, $therapist->id);
    
    // Get guardian requests
    $guardianRequests = $this->service->getGuardianRequests($guardian->id);
    
    expect($guardianRequests)->toHaveCount(1)
        ->and($guardianRequests->first()->id)->toBe($request->id);
});