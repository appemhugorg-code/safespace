<?php

use App\Http\Controllers\GameController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'active'])->group(function () { // Removed 'verified' until domain is set up
    // Game routes
    Route::get('games', [GameController::class, 'index'])->name('games.index');
    Route::get('games/{game:slug}', [GameController::class, 'show'])->name('games.show');
    Route::post('games/{game}/progress', [GameController::class, 'updateProgress'])->name('games.progress');
});
