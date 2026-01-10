<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\EmailNotificationService;
use Illuminate\Console\Command;

class TestWelcomeEmailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:test-welcome {email : The email address to send the welcome email to}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test welcome email to verify the new Resend configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');

        $this->info("Sending test welcome email to: {$email}");
        $this->info("Current mail driver: " . config('mail.default'));

        try {
            // Create a temporary test user
            $testUser = new User([
                'name' => 'Test User',
                'email' => $email,
                'email_verified_at' => null, // Unverified to test verification URL
            ]);
            
            // Assign a test role
            $testUser->id = 999999; // Fake ID for URL generation

            $emailService = new EmailNotificationService();
            $emailService->sendWelcomeEmail($testUser);

            $this->info("✅ Welcome email sent successfully!");
            $this->info("Please check the recipient's inbox (and spam folder).");
            
            $this->info("\n📧 Email includes:");
            $this->info("• Welcome message with role-specific content");
            $this->info("• Email verification link (since test user is unverified)");
            $this->info("• SafeSpace branding and professional layout");
            $this->info("• Resend delivery via " . config('mail.from.address'));

        } catch (\Exception $e) {
            $this->error("❌ Failed to send welcome email!");
            $this->error("Error: " . $e->getMessage());
            
            $this->info("\n🔧 Troubleshooting tips:");
            $this->info("1. Check your Resend API key in .env");
            $this->info("2. Verify the sender domain is configured in Resend");
            $this->info("3. Check Resend dashboard for delivery status");
            $this->info("4. Ensure queue workers are running if using queues");
            
            return 1;
        }

        return 0;
    }
}
