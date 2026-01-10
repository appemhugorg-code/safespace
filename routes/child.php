<?php

use App\Http\Controllers\Child\ChildConnectionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Child Routes
|--------------------------------------------------------------------------
|
| Routes for child users to access their therapeutic connections and
| age-appropriate interfaces for communication and appointments.
|
*/

Route::middleware(['auth', 'active', 'role:child'])->prefix('child')->name('child.')->group(function () {
    
    // Connection management routes for children
    Route::prefix('connections')->name('connections.')->group(function () {
        Route::get('/', [ChildConnectionController::class, 'index'])->name('index');
        Route::get('/{connection}', [ChildConnectionController::class, 'show'])->name('show');
    });

    // Communication features for children with therapists
    Route::get('/therapist/{therapist}/features', [ChildConnectionController::class, 'communicationFeatures'])->name('therapist.features');
    Route::get('/therapist/{therapist}/message', [ChildConnectionController::class, 'startConversation'])->name('therapist.message');
    Route::get('/therapist/{therapist}/appointment', [ChildConnectionController::class, 'createAppointment'])->name('therapist.appointment');
});