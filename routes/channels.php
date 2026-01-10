<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// User-specific channels for panic alerts
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// Group message channels - CRITICAL: This was missing!
Broadcast::channel('group.{groupId}', function ($user, $groupId) {
    $group = \App\Models\Group::find($groupId);
    return $group && $group->hasMember($user);
});

// Emergency alerts channel for admins and emergency responders
Broadcast::channel('emergency-alerts', function ($user) {
    // Allow admins, therapists, and guardians to listen to emergency alerts
    return $user->hasAnyRole(['admin', 'therapist', 'guardian']);
});

// Admin monitoring channel for oversight
Broadcast::channel('admin-monitoring', function ($user) {
    return $user->hasRole('admin');
});
