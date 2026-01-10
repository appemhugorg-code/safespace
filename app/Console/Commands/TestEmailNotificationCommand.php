<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\EmailNotificationService;
use Illuminate\Console\Command;

class TestEmailNotificationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:test {user_id? : The ID of the user to send test email to}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the email notification system by sending a welcome email';

    /**
     * Execute the console command.
     */
    public function handle(EmailNotificationService $emailService)
    {
        $userId = $this->argument('user_id');

        if ($userId) {
            $user = User::find($userId);
            if (!$user) {
                $this->error("User with ID {$userId} not found.");
                return 1;
            }
        } else {
            // Get the first available user
            $user = User::first();
            if (!$user) {
                $this->error('No users found in the database.');
                return 1;
            }
        }

        $this->info("Sending test welcome email to: {$user->name} ({$user->email})");

        try {
            $emailService->sendWelcomeEmail($user);
            $this->info('✅ Welcome email queued successfully!');
            $this->info('Check the email logs and queue status to verify delivery.');

            // Show queue status
            $this->call('queue:work', ['--once' => true, '--queue' => 'emails']);

        } catch (\Exception $e) {
            $this->error("❌ Failed to send email: {$e->getMessage()}");
            return 1;
        }

        return 0;
    }
}
