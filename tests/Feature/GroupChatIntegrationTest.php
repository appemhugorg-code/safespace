<?php

use App\Events\GroupMessageSent;
use App\Models\Group;
use App\Models\GroupJoinRequest;
use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Seed the database with roles and test users
    $this->seed([
        \Database\Seeders\RolePermissionSeeder::class,
        \Database\Seeders\TestUserSeeder::class,
    ]);

    // Get test users
    $this->guardian = User::where('email', 'guardian@safespace.test')->first();
    $this->child = User::where('email', 'child@safespace.test')->first();
    $this->therapist = User::where('email', 'therapist@safespace.test')->first();
    $this->admin = User::where('email', 'admin@safespace.test')->first();
});

describe('Group Chat Integration Tests', function () {

    test('therapist can create a group', function () {
        $response = $this->actingAs($this->therapist)
            ->postJson('/api/groups', [
                'name' => 'Teen Support Group',
                'description' => 'A support group for teenagers dealing with anxiety',
            ]);

        $response->assertStatus(201);

        // Verify group was created in database
        $this->assertDatabaseHas('groups', [
            'name' => 'Teen Support Group',
            'description' => 'A support group for teenagers dealing with anxiety',
            'created_by' => $this->therapist->id,
            'is_active' => true,
        ]);

        // Verify creator is automatically added as admin
        $group = Group::where('name', 'Teen Support Group')->first();
        expect($group->hasMember($this->therapist))->toBeTrue();
        expect($group->isAdmin($this->therapist))->toBeTrue();
    });

    test('admin can create a group', function () {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/groups', [
                'name' => 'Admin Support Group',
                'description' => 'A group for administrative discussions',
            ]);

        $response->assertStatus(201);

        // Verify group was created
        $this->assertDatabaseHas('groups', [
            'name' => 'Admin Support Group',
            'created_by' => $this->admin->id,
        ]);
    });

    test('guardian cannot create a group', function () {
        $response = $this->actingAs($this->guardian)
            ->postJson('/api/groups', [
                'name' => 'Parent Group',
                'description' => 'A group for parents',
            ]);

        $response->assertStatus(403);
    });

    test('child cannot create a group', function () {
        $response = $this->actingAs($this->child)
            ->postJson('/api/groups', [
                'name' => 'Kids Group',
                'description' => 'A group for children',
            ]);

        $response->assertStatus(403);
    });

    test('group admin can add members to group', function () {
        Event::fake();

        // Create a group
        $group = Group::create([
            'name' => 'Test Group',
            'description' => 'Test group for member management',
            'created_by' => $this->therapist->id,
        ]);

        // Add therapist as admin
        $group->addMember($this->therapist, 'admin');

        // Admin adds a guardian to the group
        $response = $this->actingAs($this->therapist)
            ->postJson("/api/groups/{$group->id}/members", [
                'user_id' => $this->guardian->id,
            ]);

        $response->assertStatus(201);

        // Verify member was added
        expect($group->fresh()->hasMember($this->guardian))->toBeTrue();
        expect($group->fresh()->isAdmin($this->guardian))->toBeFalse();
    });

    test('non-admin cannot add members to group', function () {
        // Create a group
        $group = Group::create([
            'name' => 'Test Group',
            'description' => 'Test group',
            'created_by' => $this->therapist->id,
        ]);

        // Add guardian as regular member
        $group->addMember($this->guardian, 'member');

        // Guardian tries to add child to the group
        $response = $this->actingAs($this->guardian)
            ->postJson("/api/groups/{$group->id}/members", [
                'user_id' => $this->child->id,
            ]);

        $response->assertStatus(403);
    });

    test('user can request to join a group', function () {
        // Create a group
        $group = Group::create([
            'name' => 'Support Group',
            'description' => 'A support group',
            'created_by' => $this->therapist->id,
        ]);

        // Guardian requests to join
        $response = $this->actingAs($this->guardian)
            ->postJson("/api/groups/{$group->id}/join-request", [
                'message' => 'I would like to join this support group',
            ]);

        $response->assertStatus(201);

        // Verify join request was created
        $this->assertDatabaseHas('group_join_requests', [
            'group_id' => $group->id,
            'user_id' => $this->guardian->id,
            'status' => 'pending',
            'message' => 'I would like to join this support group',
        ]);
    });

    test('group admin can approve join request', function () {
        Event::fake();

        // Create a group and join request
        $group = Group::create([
            'name' => 'Support Group',
            'description' => 'A support group',
            'created_by' => $this->therapist->id,
        ]);

        $group->addMember($this->therapist, 'admin');

        $joinRequest = GroupJoinRequest::create([
            'group_id' => $group->id,
            'user_id' => $this->guardian->id,
            'status' => 'pending',
            'message' => 'Please let me join',
        ]);

        // Admin approves the request
        $response = $this->actingAs($this->therapist)
            ->putJson("/api/groups/{$group->id}/join-requests/{$joinRequest->id}", [
                'action' => 'approve',
            ]);

        $response->assertStatus(200);

        // Verify request was approved and user was added to group
        $joinRequest->refresh();
        expect($joinRequest->status)->toBe('approved');
        expect($group->fresh()->hasMember($this->guardian))->toBeTrue();
    });

    test('group admin can reject join request', function () {
        // Create a group and join request
        $group = Group::create([
            'name' => 'Support Group',
            'description' => 'A support group',
            'created_by' => $this->therapist->id,
        ]);

        $group->addMember($this->therapist, 'admin');

        $joinRequest = GroupJoinRequest::create([
            'group_id' => $group->id,
            'user_id' => $this->guardian->id,
            'status' => 'pending',
        ]);

        // Admin rejects the request
        $response = $this->actingAs($this->therapist)
            ->putJson("/api/groups/{$group->id}/join-requests/{$joinRequest->id}", [
                'action' => 'reject',
                'reason' => 'Not suitable for this group',
            ]);

        $response->assertStatus(200);

        // Verify request was rejected and user was not added to group
        $joinRequest->refresh();
        expect($joinRequest->status)->toBe('rejected');
        expect($group->fresh()->hasMember($this->guardian))->toBeFalse();
    });

    test('group member can send message to group', function () {
        Event::fake();

        // Create a group with members
        $group = Group::create([
            'name' => 'Chat Group',
            'description' => 'A group for chatting',
            'created_by' => $this->therapist->id,
        ]);

        $group->addMember($this->therapist, 'admin');
        $group->addMember($this->guardian, 'member');

        // Guardian sends message to group
        $response = $this->actingAs($this->guardian)
            ->postJson('/api/messages', [
                'group_id' => $group->id,
                'content' => 'Hello everyone in the group!',
            ]);

        $response->assertStatus(201);

        // Verify message was created
        $this->assertDatabaseHas('messages', [
            'sender_id' => $this->guardian->id,
            'group_id' => $group->id,
            'content' => 'Hello everyone in the group!',
            'message_type' => 'group',
        ]);

        // Verify event was dispatched
        Event::assertDispatched(GroupMessageSent::class);
    });

    test('non-member cannot send message to group', function () {
        // Create a group
        $group = Group::create([
            'name' => 'Private Group',
            'description' => 'A private group',
            'created_by' => $this->therapist->id,
        ]);

        $group->addMember($this->therapist, 'admin');

        // Guardian (not a member) tries to send message
        $response = $this->actingAs($this->guardian)
            ->postJson('/api/messages', [
                'group_id' => $group->id,
                'content' => 'This should fail',
            ]);

        $response->assertStatus(403);
    });

    test('group messages are broadcasted to all members', function () {
        Event::fake();

        // Create a group with multiple members
        $group = Group::create([
            'name' => 'Broadcast Test Group',
            'description' => 'Testing message broadcasting',
            'created_by' => $this->therapist->id,
        ]);

        $group->addMember($this->therapist, 'admin');
        $group->addMember($this->guardian, 'member');
        $group->addMember($this->child, 'member');

        // Send a group message
        $response = $this->actingAs($this->therapist)
            ->postJson('/api/messages', [
                'group_id' => $group->id,
                'content' => 'Message to all group members',
            ]);

        $response->assertStatus(201);

        // Verify GroupMessageSent event was dispatched
        Event::assertDispatched(GroupMessageSent::class, function ($event) use ($group) {
            return $event->message->group_id === $group->id &&
                   $event->message->content === 'Message to all group members';
        });
    });

    test('group message history can be retrieved', function () {
        // Create a group with members
        $group = Group::create([
            'name' => 'History Test Group',
            'description' => 'Testing message history',
            'created_by' => $this->therapist->id,
        ]);

        $group->addMember($this->therapist, 'admin');
        $group->addMember($this->guardian, 'member');

        // Create some test messages
        $message1 = Message::create([
            'sender_id' => $this->therapist->id,
            'group_id' => $group->id,
            'content' => 'First group message',
            'message_type' => 'group',
            'created_at' => now()->subHours(2),
        ]);

        $message2 = Message::create([
            'sender_id' => $this->guardian->id,
            'group_id' => $group->id,
            'content' => 'Second group message',
            'message_type' => 'group',
            'created_at' => now()->subHour(),
        ]);

        // Get group message history
        $response = $this->actingAs($this->guardian)
            ->getJson("/api/groups/{$group->id}/messages");

        $response->assertStatus(200);

        $messages = $response->json('messages');
        expect(count($messages))->toBe(2);
        expect($messages[0]['content'])->toBe('Second group message'); // Most recent first
        expect($messages[1]['content'])->toBe('First group message');
    });

    test('non-member cannot access group message history', function () {
        // Create a group
        $group = Group::create([
            'name' => 'Private History Group',
            'description' => 'Private group',
            'created_by' => $this->therapist->id,
        ]);

        $group->addMember($this->therapist, 'admin');

        // Guardian (not a member) tries to access message history
        $response = $this->actingAs($this->guardian)
            ->getJson("/api/groups/{$group->id}/messages");

        $response->assertStatus(403);
    });

    test('group member can leave group with reason', function () {
        Event::fake();

        // Create a group with member
        $group = Group::create([
            'name' => 'Leave Test Group',
            'description' => 'Testing group leave functionality',
            'created_by' => $this->therapist->id,
        ]);

        $group->addMember($this->therapist, 'admin');
        $group->addMember($this->guardian, 'member');

        // Guardian leaves the group
        $response = $this->actingAs($this->guardian)
            ->postJson("/api/groups/{$group->id}/leave", [
                'reason' => 'too_busy',
                'custom_reason' => null,
            ]);

        $response->assertStatus(200);

        // Verify member was removed from group
        expect($group->fresh()->hasMember($this->guardian))->toBeFalse();

        // Verify leave reason was logged
        $this->assertDatabaseHas('group_leave_logs', [
            'group_id' => $group->id,
            'user_id' => $this->guardian->id,
            'reason' => 'too_busy',
        ]);
    });

    test('group member can leave with custom reason', function () {
        Event::fake();

        // Create a group with member
        $group = Group::create([
            'name' => 'Custom Leave Test Group',
            'description' => 'Testing custom leave reasons',
            'created_by' => $this->therapist->id,
        ]);

        $group->addMember($this->therapist, 'admin');
        $group->addMember($this->guardian, 'member');

        // Guardian leaves with custom reason
        $response = $this->actingAs($this->guardian)
            ->postJson("/api/groups/{$group->id}/leave", [
                'reason' => 'other',
                'custom_reason' => 'Moving to a different city',
            ]);

        $response->assertStatus(200);

        // Verify leave reason was logged with custom reason
        $this->assertDatabaseHas('group_leave_logs', [
            'group_id' => $group->id,
            'user_id' => $this->guardian->id,
            'reason' => 'other',
            'custom_reason' => 'Moving to a different city',
        ]);
    });

    test('admin monitoring - all groups have admin members', function () {
        Event::fake();

        // Create a group by therapist using the API (which calls setupGroupPermissions)
        $response = $this->actingAs($this->therapist)
            ->postJson('/api/groups', [
                'name' => 'Monitored Group',
                'description' => 'This group should have admin monitoring',
            ]);

        $response->assertStatus(201);
        $group = Group::where('name', 'Monitored Group')->first();

        // Verify admin is automatically added to the group
        expect($group->hasMember($this->admin))->toBeTrue();
        expect($group->isAdmin($this->admin))->toBeTrue();
    });

    test('admin can view all groups for monitoring', function () {
        // Create multiple groups
        $group1 = Group::create([
            'name' => 'Group 1',
            'description' => 'First group',
            'created_by' => $this->therapist->id,
        ]);

        $group2 = Group::create([
            'name' => 'Group 2',
            'description' => 'Second group',
            'created_by' => $this->therapist->id,
        ]);

        // Admin can view all groups
        $response = $this->actingAs($this->admin)
            ->getJson('/api/groups');

        $response->assertStatus(200);

        $groups = $response->json('data');
        expect(count($groups))->toBeGreaterThanOrEqual(2);
    });

    test('group admin can remove member from group', function () {
        Event::fake();

        // Create a group using API (which sets up permissions properly)
        $response = $this->actingAs($this->therapist)
            ->postJson('/api/groups', [
                'name' => 'Removal Test Group',
                'description' => 'Testing member removal',
            ]);

        $response->assertStatus(201);
        $group = Group::where('name', 'Removal Test Group')->first();

        // Add members to the group
        $group->addMember($this->guardian, 'member');
        $group->addMember($this->child, 'member');

        // Admin removes guardian from group
        $response = $this->actingAs($this->therapist)
            ->deleteJson("/api/groups/{$group->id}/members/{$this->guardian->id}");

        $response->assertStatus(200);

        // Verify member was removed
        expect($group->fresh()->hasMember($this->guardian))->toBeFalse();
        expect($group->fresh()->hasMember($this->child))->toBeTrue(); // Other member still there
    });

    test('regular member cannot remove other members', function () {
        Event::fake();

        // Create a group with members
        $group = Group::create([
            'name' => 'Permission Test Group',
            'description' => 'Testing removal permissions',
            'created_by' => $this->therapist->id,
        ]);

        $group->addMember($this->therapist, 'admin');
        $group->addMember($this->guardian, 'member');
        $group->addMember($this->child, 'member');

        // Guardian (regular member) tries to remove child
        $response = $this->actingAs($this->guardian)
            ->deleteJson("/api/groups/{$group->id}/members/{$this->child->id}");

        $response->assertStatus(403);

        // Verify child is still in the group
        expect($group->fresh()->hasMember($this->child))->toBeTrue();
    });

    test('group search functionality works', function () {
        // Create groups with different names
        Group::create([
            'name' => 'Anxiety Support Group',
            'description' => 'Support for anxiety',
            'created_by' => $this->therapist->id,
        ]);

        Group::create([
            'name' => 'Depression Help Group',
            'description' => 'Help with depression',
            'created_by' => $this->therapist->id,
        ]);

        Group::create([
            'name' => 'Teen Chat Room',
            'description' => 'Chat for teenagers',
            'created_by' => $this->therapist->id,
        ]);

        // Search for groups containing "Anxiety"
        $response = $this->actingAs($this->guardian)
            ->getJson('/api/groups/search/available?search=Anxiety');

        $response->assertStatus(200);

        $groups = $response->json('data');
        expect(count($groups))->toBe(1);
        expect($groups[0]['name'])->toBe('Anxiety Support Group');
    });

    test('group statistics are available to admins', function () {
        // Create a group with activity
        $group = Group::create([
            'name' => 'Stats Test Group',
            'description' => 'Testing statistics',
            'created_by' => $this->therapist->id,
        ]);

        $group->addMember($this->therapist, 'admin');
        $group->addMember($this->guardian, 'member');

        // Add some messages
        Message::create([
            'sender_id' => $this->therapist->id,
            'group_id' => $group->id,
            'content' => 'Test message 1',
            'message_type' => 'group',
        ]);

        Message::create([
            'sender_id' => $this->guardian->id,
            'group_id' => $group->id,
            'content' => 'Test message 2',
            'message_type' => 'group',
        ]);

        // Get group statistics
        $response = $this->actingAs($this->admin)
            ->getJson("/api/groups/{$group->id}/statistics");

        $response->assertStatus(200);

        $stats = $response->json();
        expect($stats['total_members'])->toBe(2);
        expect($stats['total_messages'])->toBe(2);
    });
});
