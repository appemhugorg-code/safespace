<?php

use App\Http\Controllers\Admin\ContentModerationController;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Message Routes
|--------------------------------------------------------------------------
|
| Routes for real-time messaging functionality.
|
*/

Route::middleware(['auth', 'active'])->group(function () { // Removed 'verified' until domain is set up
    Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');
    Route::get('/messages/conversation/{contact}', [MessageController::class, 'conversation'])->name('messages.conversation');
    Route::get('/messages/groups', [MessageController::class, 'groups'])->name('messages.groups');
    Route::get('/messages/groups/{group}', [MessageController::class, 'groupConversation'])->name('messages.group-conversation');
    // Removed groups.store - this should be handled by the API routes
    Route::post('/messages', [MessageController::class, 'store'])->name('messages.store');
    Route::post('/messages/{message}/flag', [ContentModerationController::class, 'flagMessage'])->name('messages.flag');
    Route::get('/api/messages/unread-count', [MessageController::class, 'unreadCount'])->name('messages.unread-count');
});
