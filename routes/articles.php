<?php

use App\Http\Controllers\ArticleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'active'])->group(function () { // Removed 'verified' until domain is set up
    // Article routes
    Route::resource('articles', ArticleController::class);

    // Additional article actions
    Route::post('articles/{article}/publish', [ArticleController::class, 'publish'])
        ->name('articles.publish')
        ->middleware('role:admin');
    Route::post('articles/{article}/reject', [ArticleController::class, 'reject'])
        ->name('articles.reject')
        ->middleware('role:admin');
    Route::post('articles/{article}/archive', [ArticleController::class, 'archive'])
        ->name('articles.archive');
});
