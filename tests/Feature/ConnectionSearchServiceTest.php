<?php

use App\Models\User;
use App\Models\TherapistAvailability;
use App\Models\TherapistClientConnection;
use App\Services\ConnectionSearchService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->service = new ConnectionSearchService();
    
    // Seed roles for testing
    $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
});

test('service can be instantiated', function () {
    expect($this->service)->toBeInstanceOf(ConnectionSearchService::class);
});

test('service returns empty statistics for empty database', function () {
    $stats = $this->service->getSearchStatistics();
    
    expect($stats)->toBeArray()
        ->and($stats['total_therapists'])->toBe(0)
        ->and($stats['therapists_with_availability'])->toBe(0)
        ->and($stats['therapists_without_availability'])->toBe(0)
        ->and($stats['average_connections_per_therapist'])->toBe(0.0);
});

test('service can search therapists by name', function () {
    // Create therapists
    $therapist1 = User::factory()->create(['name' => 'Dr. John Smith']);
    $therapist1->assignRole('therapist');
    
    $therapist2 = User::factory()->create(['name' => 'Dr. Jane Doe']);
    $therapist2->assignRole('therapist');
    
    $therapist3 = User::factory()->create(['name' => 'Dr. Bob Wilson']);
    $therapist3->assignRole('therapist');
    
    // Search by name
    $results = $this->service->searchTherapists(['name' => 'John']);
    
    expect($results)->toHaveCount(1)
        ->and($results->first()->name)->toBe('Dr. John Smith');
});

test('service can search therapists by email', function () {
    $therapist = User::factory()->create(['email' => 'john.smith@example.com']);
    $therapist->assignRole('therapist');
    
    $results = $this->service->searchTherapists(['email' => 'john.smith']);
    
    expect($results)->toHaveCount(1)
        ->and($results->first()->email)->toBe('john.smith@example.com');
});

test('service can filter therapists by availability day', function () {
    // Create therapists
    $therapist1 = User::factory()->create();
    $therapist1->assignRole('therapist');
    
    $therapist2 = User::factory()->create();
    $therapist2->assignRole('therapist');
    
    // Add availability for therapist1 on Monday (day 1)
    TherapistAvailability::create([
        'therapist_id' => $therapist1->id,
        'day_of_week' => 1,
        'start_time' => '09:00',
        'end_time' => '17:00',
        'is_active' => true,
    ]);
    
    // Add availability for therapist2 on Tuesday (day 2)
    TherapistAvailability::create([
        'therapist_id' => $therapist2->id,
        'day_of_week' => 2,
        'start_time' => '10:00',
        'end_time' => '18:00',
        'is_active' => true,
    ]);
    
    // Search for therapists available on Monday
    $results = $this->service->searchTherapists(['available_day' => 1]);
    
    expect($results)->toHaveCount(1)
        ->and($results->first()->id)->toBe($therapist1->id);
});

test('service can filter therapists by availability time', function () {
    $therapist = User::factory()->create();
    $therapist->assignRole('therapist');
    
    // Add availability from 9 AM to 5 PM
    TherapistAvailability::create([
        'therapist_id' => $therapist->id,
        'day_of_week' => 1,
        'start_time' => '09:00',
        'end_time' => '17:00',
        'is_active' => true,
    ]);
    
    // Search for therapists available at 2 PM
    $results = $this->service->searchTherapists(['available_time' => '14:00']);
    
    expect($results)->toHaveCount(1)
        ->and($results->first()->id)->toBe($therapist->id);
    
    // Search for therapists available at 8 PM (should be empty)
    $results = $this->service->searchTherapists(['available_time' => '20:00']);
    
    expect($results)->toHaveCount(0);
});

test('service can get available therapists for guardian', function () {
    $guardian = User::factory()->create();
    $guardian->assignRole('guardian');
    
    $therapist1 = User::factory()->create();
    $therapist1->assignRole('therapist');
    
    $therapist2 = User::factory()->create();
    $therapist2->assignRole('therapist');
    
    // Create connection between guardian and therapist1
    TherapistClientConnection::create([
        'therapist_id' => $therapist1->id,
        'client_id' => $guardian->id,
        'client_type' => 'guardian',
        'connection_type' => 'admin_assigned',
        'status' => 'active',
        'assigned_at' => now(),
    ]);
    
    // Get available therapists (should exclude therapist1)
    $available = $this->service->getAvailableTherapists($guardian->id);
    
    expect($available)->toHaveCount(1)
        ->and($available->first()->id)->toBe($therapist2->id);
});

test('service can filter therapists by availability', function () {
    $therapist1 = User::factory()->create();
    $therapist1->assignRole('therapist');
    
    $therapist2 = User::factory()->create();
    $therapist2->assignRole('therapist');
    
    // Add availability for therapist1 only
    TherapistAvailability::create([
        'therapist_id' => $therapist1->id,
        'day_of_week' => 1,
        'start_time' => '09:00',
        'end_time' => '17:00',
        'is_active' => true,
    ]);
    
    $therapists = collect([$therapist1, $therapist2]);
    $filtered = $this->service->filterByAvailability($therapists);
    
    expect($filtered)->toHaveCount(1)
        ->and($filtered->first()->id)->toBe($therapist1->id);
});

test('service can search by name or email', function () {
    $therapist1 = User::factory()->create(['name' => 'Dr. John Smith', 'email' => 'john@example.com']);
    $therapist1->assignRole('therapist');
    
    $therapist2 = User::factory()->create(['name' => 'Dr. Jane Doe', 'email' => 'jane@example.com']);
    $therapist2->assignRole('therapist');
    
    // Search by name
    $results = $this->service->searchByNameOrEmail('John');
    expect($results)->toHaveCount(1)
        ->and($results->first()->name)->toBe('Dr. John Smith');
    
    // Search by email
    $results = $this->service->searchByNameOrEmail('jane@example.com');
    expect($results)->toHaveCount(1)
        ->and($results->first()->email)->toBe('jane@example.com');
});

test('service can get therapists by workload', function () {
    $therapist1 = User::factory()->create();
    $therapist1->assignRole('therapist');
    
    $therapist2 = User::factory()->create();
    $therapist2->assignRole('therapist');
    
    $guardian = User::factory()->create();
    $guardian->assignRole('guardian');
    
    // Give therapist1 more connections than therapist2
    TherapistClientConnection::create([
        'therapist_id' => $therapist1->id,
        'client_id' => $guardian->id,
        'client_type' => 'guardian',
        'connection_type' => 'admin_assigned',
        'status' => 'active',
        'assigned_at' => now(),
    ]);
    
    $results = $this->service->getTherapistsByWorkload();
    
    // therapist2 should come first (fewer connections)
    expect($results->first()->id)->toBe($therapist2->id);
});

test('service validates filters correctly', function () {
    $filters = [
        'available_day' => '1',
        'available_time' => '14:00',
        'name' => '  John Smith  ',
        'invalid_day' => '8',
        'invalid_time' => '25:00',
        'exclude_full' => 'true',
    ];
    
    $validated = $this->service->validateFilters($filters);
    
    expect($validated)->toHaveKeys(['available_day', 'available_time', 'name', 'exclude_full'])
        ->and($validated['available_day'])->toBe(1)
        ->and($validated['available_time'])->toBe('14:00')
        ->and($validated['name'])->toBe('John Smith')
        ->and($validated['exclude_full'])->toBeTrue()
        ->and($validated)->not->toHaveKey('invalid_day')
        ->and($validated)->not->toHaveKey('invalid_time');
});