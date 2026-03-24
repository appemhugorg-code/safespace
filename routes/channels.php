<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
}, ['guards' => ['sanctum', 'web']]);

// User-specific channels for panic alerts
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
}, ['guards' => ['sanctum', 'web']]);

// Group message channels
Broadcast::channel('group.{groupId}', function ($user, $groupId) {
    $group = \App\Models\Group::find($groupId);
    return $group && $group->hasMember($user);
}, ['guards' => ['sanctum', 'web']]);

// Emergency alerts channel for admins and emergency responders
Broadcast::channel('emergency-alerts', function ($user) {
    return $user->hasAnyRole(['admin', 'therapist', 'guardian']);
}, ['guards' => ['sanctum', 'web']]);

// Admin monitoring channel for oversight
Broadcast::channel('admin-monitoring', function ($user) {
    return $user->hasRole('admin');
}, ['guards' => ['sanctum', 'web']]);
