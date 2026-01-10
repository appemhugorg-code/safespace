<?php

use App\Http\Controllers\AppointmentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Appointment Routes
|--------------------------------------------------------------------------
|
| Routes for appointment scheduling functionality.
|
*/

Route::middleware(['auth', 'active'])->group(function () { // Removed 'verified' until domain is set up
    Route::get('/appointments', [AppointmentController::class, 'index'])->name('appointments.index');
    Route::get('/appointments/create', [AppointmentController::class, 'create'])->name('appointments.create');
    Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');
    Route::get('/appointments/{appointment}', [AppointmentController::class, 'show'])->name('appointments.show');

    // Confirm appointment (available to all participants)
    Route::patch('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm'])->name('appointments.confirm');

    // Therapist-only actions
    Route::middleware('role:therapist')->group(function () {
        Route::patch('/appointments/{appointment}/complete', [AppointmentController::class, 'complete'])->name('appointments.complete');
    });

    // Cancel appointment (available to all involved parties)
    Route::patch('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel'])->name('appointments.cancel');

    // API endpoint for available slots
    Route::get('/api/appointments/available-slots', [AppointmentController::class, 'availableSlots'])->name('appointments.available-slots');
});
