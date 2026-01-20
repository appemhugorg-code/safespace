<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/health', [\App\Http\Controllers\HealthController::class, 'index'])->name('health');
Route::get('/ping', [\App\Http\Controllers\HealthController::class, 'ping'])->name('ping');

// Reverb testing routes
Route::get('/reverb-test', [\App\Http\Controllers\ReverbTestController::class, 'index'])->name('reverb.test');
Route::get('/reverb/status', [\App\Http\Controllers\ReverbTestController::class, 'status'])->name('reverb.status');

Route::get('/help', function () {
    return Inertia::render('help');
})->name('help');

// UAT Routes (only in UAT environment)
if (app()->environment('uat')) {
    require __DIR__.'/uat.php';
}

// Legal pages
Route::get('/terms-of-service', function () {
    return Inertia::render('legal/terms-of-service');
})->name('terms-of-service');

Route::get('/privacy-policy', function () {
    return Inertia::render('legal/privacy-policy');
})->name('privacy-policy');

// Theme test page (for development/testing)
Route::get('/theme-test', function () {
    return Inertia::render('theme-test');
})->name('theme-test');



// Public email unsubscribe route
Route::get('/unsubscribe/{userId}/{token}', [\App\Http\Controllers\UserEmailPreferencesController::class, 'unsubscribe'])->name('email.unsubscribe');

Route::middleware(['auth', 'active'])->group(function () { // Removed 'verified' until domain is set up
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Therapist routes
    Route::middleware('role:therapist')->prefix('therapist')->name('therapist.')->group(function () {
        Route::get('/availability', [\App\Http\Controllers\Therapist\AvailabilityController::class, 'index'])->name('availability');
        Route::post('/availability', [\App\Http\Controllers\Therapist\AvailabilityController::class, 'store'])->name('availability.store');
        Route::put('/availability/{availability}', [\App\Http\Controllers\Therapist\AvailabilityController::class, 'update'])->name('availability.update');
        Route::delete('/availability/{availability}', [\App\Http\Controllers\Therapist\AvailabilityController::class, 'destroy'])->name('availability.destroy');
        Route::post('/availability/overrides', [\App\Http\Controllers\Therapist\AvailabilityController::class, 'storeOverride'])->name('availability.overrides.store');
        Route::delete('/availability/overrides/{override}', [\App\Http\Controllers\Therapist\AvailabilityController::class, 'destroyOverride'])->name('availability.overrides.destroy');
        Route::get('/consultation/create', [\App\Http\Controllers\Therapist\ConsultationController::class, 'create'])->name('consultation.create');
        Route::get('/appointments/create', [\App\Http\Controllers\Therapist\AppointmentController::class, 'create'])->name('appointments.create');
        Route::post('/appointments', [\App\Http\Controllers\Therapist\AppointmentController::class, 'store'])->name('appointments.store');
        
        // Connection management routes
        Route::get('/connections', [\App\Http\Controllers\Therapist\TherapistConnectionController::class, 'index'])->name('connections');
        Route::get('/connections/guardians', [\App\Http\Controllers\Therapist\TherapistConnectionController::class, 'guardians'])->name('connections.guardians');
        Route::get('/connections/children', [\App\Http\Controllers\Therapist\TherapistConnectionController::class, 'children'])->name('connections.children');
        Route::get('/connections/requests', [\App\Http\Controllers\Therapist\TherapistConnectionController::class, 'pendingRequests'])->name('connections.requests');
        Route::get('/connections/{connection}', [\App\Http\Controllers\Therapist\TherapistConnectionController::class, 'show'])->name('connections.show');
    });

    // Therapist client management routes
    Route::middleware('role:therapist')->group(function () {
        Route::get('/clients', [\App\Http\Controllers\Therapist\TherapistController::class, 'clients'])->name('therapist.clients');
        Route::get('/clients/{client}', [\App\Http\Controllers\Therapist\TherapistController::class, 'clientDetail'])->name('therapist.client.detail');
    });

    // Email preferences
    Route::get('/settings/email-preferences', [\App\Http\Controllers\UserEmailPreferencesController::class, 'edit'])->name('settings.email-preferences');

    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

// Broadcasting authentication for private channels
Broadcast::routes(['middleware' => ['auth']]);
require __DIR__.'/admin.php';
require __DIR__.'/guardian.php';
require __DIR__.'/child.php';
require __DIR__.'/mood.php';
require __DIR__.'/appointments.php';
require __DIR__.'/messages.php';
require __DIR__.'/emergency.php';
require __DIR__.'/articles.php';
require __DIR__.'/games.php';
require __DIR__.'/analytics.php';
require __DIR__.'/games.php';
