<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ChatCrossBrowserTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed the database with roles and test users
        $this->seed([
            \Database\Seeders\RolePermissionSeeder::class,
            \Database\Seeders\TestUserSeeder::class,
        ]);
    }

    /**
     * Test WebSocket connection establishment across browsers.
     */
    public function test_websocket_connection_establishment()
    {
        $guardian = User::where('email', 'guardian@safespace.test')->first();
        $child = User::where('email', 'child@safespace.test')->first();

        $this->browse(function (Browser $browser) use ($guardian) {
            $browser->loginAs($guardian)
                ->visit('/messages')
                ->waitFor('[data-testid="chat-interface"]', 10)
                ->assertSee('Messages')
                // Check that WebSocket connection indicator shows connected
                ->waitFor('[data-testid="connection-status"]', 5)
                ->assertSeeIn('[data-testid="connection-status"]', 'Connected');
        });
    }

    /**
     * Test real-time message delivery across different browser sessions.
     */
    public function test_real_time_message_delivery()
    {
        $guardian = User::where('email', 'guardian@safesp