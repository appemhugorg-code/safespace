<?php

use App\Models\User;
use App\Models\TherapistClientConnection;
use App\Services\ConnectionManagementService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->service = app(ConnectionManagementService::class);
    
    // Seed roles for testing
    $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
});

test('service can be instantiated', function () {
    expect($this->service)->toBeInstanceOf(ConnectionManagementService::class);
});

test('service returns empty statistics for empty database', function () {
    $stats = $this->service->getConnectionStatistics();
    
    expect($stats)->toBeArray()
        ->and($stats['total_active'])->toBe(0)
        ->and($stats['total_terminated'])->toBe(0)
        ->and($stats['guardian_connections'])->toBe(0)
        ->and($stats['child_connections'])->toBe(0)
        ->and($stats['admin_assigned'])->toBe(0)
        ->and($stats['guardian_requested'])->toBe(0);
});

test('service can check for active connections', function () {
    $therapist = User::factory()->create();
    $therapist->assignRole('therapist');
    
    $guardian = User::factory()->create();
    $guardian->assignRole('guardian');
    
    // No connection should exist initially
    expect($this->service->hasActiveConnection($therapist->id, $guardian->id))->toBeFalse();
    
    // Create a connection manually
    TherapistClientConnection::create([
        'therapist_id' => $therapist->id,
        'client_id' => $guardian->id,
        'client_type' => 'guardian',
        'connection_type' => 'admin_assigned',
        'status' => 'active',
        'assigned_at' => now(),
    ]);
    
    // Now connection should exist
    expect($this->service->hasActiveConnection($therapist->id, $guardian->id))->toBeTrue();
    expect($this->service->hasActiveConnection($guardian->id, $therapist->id))->toBeTrue();
});