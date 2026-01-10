<?php

use App\Http\Controllers\Guardian\ChildManagementController;
use App\Http\Controllers\Guardian\ClientConnectionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Guardian Routes
|--------------------------------------------------------------------------
|
| Here are the routes for guardian functionality. These routes require
| guardian role and active status.
|
*/

Route::middleware(['auth', 'active', 'role:guardian'])->prefix('guardian')->name('guardian.')->group(function () { // Removed 'verified' until domain is set up
    Route::resource('children', ChildManagementController::class);
    
    // Connection management routes
    Route::prefix('connections')->name('connections.')->group(function () {
        Route::get('/', [ClientConnectionController::class, 'index'])->name('index');
        Route::get('/search', [ClientConnectionController::class, 'searchTherapists'])->name('search');
        Route::get('/child-assignment', [ClientConnectionController::class, 'childAssignment'])->name('child-assignment');
        Route::get('/{connection}', [ClientConnectionController::class, 'show'])->name('show');
    });
});
