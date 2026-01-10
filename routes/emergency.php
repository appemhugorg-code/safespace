<?php

use App\Http\Controllers\EmergencyController;
use App\Http\Controllers\PanicAlertController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Emergency Routes
|--------------------------------------------------------------------------
|
| Routes for emergency features and panic button functionality.
|
*/

Route::middleware(['auth', 'active'])->group(function () { // Removed 'verified' until domain is set up
    Route::get('/emergency', [EmergencyController::class, 'index'])->name('emergency.index');
    Route::post('/emergency/panic', [EmergencyController::class, 'panic'])->name('emergency.panic');

    // Panic Alert Management Routes
    Route::get('/panic-alerts', [PanicAlertController::class, 'index'])->name('panic-alerts.index');
    Route::get('/panic-alerts/{panicAlert}', [PanicAlertController::class, 'show'])->name('panic-alerts.show');
    Route::patch('/panic-alerts/{panicAlert}/acknowledge', [PanicAlertController::class, 'acknowledge'])->name('panic-alerts.acknowledge');
    Route::patch('/panic-alerts/{panicAlert}/resolve', [PanicAlertController::class, 'resolve'])->name('panic-alerts.resolve');
    Route::get('/api/panic-alerts/unviewed-count', [PanicAlertController::class, 'getUnviewedCount'])->name('panic-alerts.unviewed-count');
});
