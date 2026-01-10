<?php

use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;
use App\Models\TherapistClientConnection;
use App\Services\ConnectionManagementService;
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

    // Set up the child-guardian relationship
    $this->child->update(['guardian_id' => $this->guardian->id]);

    // Create therapeutic connections for testing
    $this->connectionService = app(ConnectionManagementService::class);
    
    // Create therapist-guardian connection
    $this->therapistGuardianConnection = $this->connectionService->createAdminAssignment(
        $this->therapist->id,
        $this->guardian->id,
        $this->admin->id
    );
    
    // Create therapist-child connection
    $this->therapistChildConnection = $this->connectionService->createAdminAssignment(
        $this->therapist->id,
        $this->child->id,
        $this->admin->id
    );
});

describe('Direct Messaging Integration Tests', function () {

    test('Guardian Grace can send message to Child Charlie', function () {
        Event::fake();

        $response = $this->actingAs($this->guardian)
            ->postJson('/api/messages', [
                'recipient_id' => $this->child->id,
                'content' => 'Hello Charlie, how was your day?',
            ]);

        $response->assertStatus(201);

        // Verify message was created in database
        $this->assertDatabaseHas('messages', [
            'sender_id' => $this->guardian->id,
            'recipient_id' => $this->child->id,
            'content' => 'Hello Charlie, how was your day?',
            'message_type' => 'direct',
        ]);

        // Verify event was dispatched
        Event::assertDispatched(MessageSent::class);
    });

    test('Child Charlie can send message to Guardian Grace', function () {
        Event::fake();

        $response = $this->actingAs($this->child)
            ->postJson('/api/messages', [
                'recipient_id' => $this->guardian->id,
                'content' => 'Hi Mom, my day was great!',
            ]);

        $response->assertStatus(201);

        // Verify message was created in database
        $this->assertDatabaseHas('messages', [
            'sender_id' => $this->child->id,
            'recipient_id' => $this->guardian->id,
            'content' => 'Hi Mom, my day was great!',
            'message_type' => 'direct',
        ]);

        // Verify event was dispatched
        Event::assertDispatched(MessageSent::class);
    });

    test('message history is loaded correctly for conversation', function () {
        // Create some test messages
        $message1 = Message::create([
            'sender_id' => $this->guardian->id,
            'recipient_id' => $this->child->id,
            'content' => 'First message',
            'message_type' => 'direct',
        ]);

        $message2 = Message::create([
            'sender_id' => $this->child->id,
            'recipient_id' => $this->guardian->id,
            'content' => 'Reply message',
            'message_type' => 'direct',
        ]);

        $response = $this->actingAs($this->guardian)
            ->get("/messages/conversation/{$this->child->id}");

        $response->assertStatus(200);

        // Check that messages are passed to the view
        $response->assertInertia(fn ($page) => $page->has('messages', 2)
            ->where('messages.0.content', 'First message')
            ->where('messages.1.content', 'Reply message')
        );
    });

    test('messages are marked as read when conversation is viewed', function () {
        // Create unread message from child to guardian
        $message = Message::create([
            'sender_id' => $this->child->id,
            'recipient_id' => $this->guardian->id,
            'content' => 'Unread message',
            'message_type' => 'direct',
            'is_read' => false,
        ]);

        // Guardian views the conversation
        $response = $this->actingAs($this->guardian)
            ->get("/messages/conversation/{$this->child->id}");

        $response->assertStatus(200);

        // Verify message is now marked as read
        $message->refresh();
        expect($message->is_read)->toBeTrue();
        expect($message->read_at)->not->toBeNull();
    });

    test('message persistence after sending', function () {
        $messageContent = 'This message should persist in database';

        $response = $this->actingAs($this->guardian)
            ->postJson('/api/messages', [
                'recipient_id' => $this->child->id,
                'content' => $messageContent,
            ]);

        $response->assertStatus(201);

        // Verify message persists in database
        $message = Message::where('content', $messageContent)->first();
        expect($message)->not->toBeNull();
        expect($message->sender_id)->toBe($this->guardian->id);
        expect($message->recipient_id)->toBe($this->child->id);
        expect($message->message_type)->toBe('direct');
    });

    test('error handling for invalid recipient', function () {
        $response = $this->actingAs($this->guardian)
            ->postJson('/api/messages', [
                'recipient_id' => 99999, // Non-existent user
                'content' => 'This should fail',
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['recipient_id']);
    });

    test('error handling for empty message content', function () {
        $response = $this->actingAs($this->guardian)
            ->postJson('/api/messages', [
                'recipient_id' => $this->child->id,
                'content' => '',
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['content']);
    });

    test('error handling for message too long', function () {
        $longMessage = str_repeat('a', 1001); // Exceeds 1000 character limit

        $response = $this->actingAs($this->guardian)
            ->postJson('/api/messages', [
                'recipient_id' => $this->child->id,
                'content' => $longMessage,
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['content']);
    });

    test('unauthorized users cannot message each other without therapeutic connections', function () {
        // Create two users who shouldn't be able to message each other (no connection)
        $user1 = User::factory()->create();
        $user1->assignRole('guardian');

        $user2 = User::factory()->create();
        $user2->assignRole('therapist');

        // No therapeutic connection exists between them
        $response = $this->actingAs($user1)
            ->postJson('/api/messages', [
                'recipient_id' => $user2->id,
                'content' => 'This should be forbidden',
            ]);

        $response->assertStatus(403);
    });

    test('therapist can message both guardian and child with active connections', function () {
        Event::fake();

        // Therapist to Guardian (connection already exists from beforeEach)
        $response1 = $this->actingAs($this->therapist)
            ->postJson('/api/messages', [
                'recipient_id' => $this->guardian->id,
                'content' => 'Hello Guardian',
            ]);

        $response1->assertStatus(201);

        // Therapist to Child (connection already exists from beforeEach)
        $response2 = $this->actingAs($this->therapist)
            ->postJson('/api/messages', [
                'recipient_id' => $this->child->id,
                'content' => 'Hello Child',
            ]);

        $response2->assertStatus(201);

        // Verify both messages were created
        $this->assertDatabaseHas('messages', [
            'sender_id' => $this->therapist->id,
            'recipient_id' => $this->guardian->id,
            'content' => 'Hello Guardian',
        ]);

        $this->assertDatabaseHas('messages', [
            'sender_id' => $this->therapist->id,
            'recipient_id' => $this->child->id,
            'content' => 'Hello Child',
        ]);
    });

    test('conversation list shows latest messages correctly', function () {
        // Create messages between guardian and child
        Message::create([
            'sender_id' => $this->guardian->id,
            'recipient_id' => $this->child->id,
            'content' => 'First message',
            'message_type' => 'direct',
            'created_at' => now()->subHours(2),
        ]);

        Message::create([
            'sender_id' => $this->child->id,
            'recipient_id' => $this->guardian->id,
            'content' => 'Latest message',
            'message_type' => 'direct',
            'created_at' => now()->subHour(),
        ]);

        $response = $this->actingAs($this->guardian)
            ->get('/messages');

        $response->assertStatus(200);

        // Check that conversations are loaded
        $response->assertInertia(fn ($page) => $page->has('conversations')
            ->where('conversations.0.content', 'Latest message')
        );
    });

    test('unread message count is accurate', function () {
        // Create unread messages from child to guardian
        Message::create([
            'sender_id' => $this->child->id,
            'recipient_id' => $this->guardian->id,
            'content' => 'Unread message 1',
            'message_type' => 'direct',
            'is_read' => false,
        ]);

        Message::create([
            'sender_id' => $this->child->id,
            'recipient_id' => $this->guardian->id,
            'content' => 'Unread message 2',
            'message_type' => 'direct',
            'is_read' => false,
        ]);

        $response = $this->actingAs($this->guardian)
            ->getJson('/api/messages/unread-count');

        $response->assertStatus(200);
        $response->assertJson(['count' => 2]);
    });

    test('message flagging works correctly', function () {
        $message = Message::create([
            'sender_id' => $this->child->id,
            'recipient_id' => $this->guardian->id,
            'content' => 'Inappropriate message',
            'message_type' => 'direct',
        ]);

        $response = $this->actingAs($this->guardian)
            ->postJson("/api/messages/{$message->id}/flag", [
                'reason' => 'Inappropriate content',
            ]);

        $response->assertStatus(200);

        // Verify message is flagged
        $message->refresh();
        expect($message->is_flagged)->toBeTrue();
        expect($message->flag_reason)->toBe('Inappropriate content');
    });

    test('real-time message broadcasting event structure', function () {
        Event::fake();

        $response = $this->actingAs($this->guardian)
            ->postJson('/api/messages', [
                'recipient_id' => $this->child->id,
                'content' => 'Test broadcast message',
            ]);

        $response->assertStatus(201);

        Event::assertDispatched(MessageSent::class, function ($event) {
            return $event->message->content === 'Test broadcast message' &&
                   $event->message->sender_id === $this->guardian->id &&
                   $event->message->recipient_id === $this->child->id;
        });
    });

    test('message recovery after connection failure simulation', function () {
        // Simulate a message being sent when connection might be down
        $response = $this->actingAs($this->guardian)
            ->postJson('/api/messages', [
                'recipient_id' => $this->child->id,
                'content' => 'Message during connection issue',
            ]);

        // Even if broadcast fails, message should still be saved
        $response->assertStatus(201);

        $this->assertDatabaseHas('messages', [
            'sender_id' => $this->guardian->id,
            'recipient_id' => $this->child->id,
            'content' => 'Message during connection issue',
        ]);
    });
});
