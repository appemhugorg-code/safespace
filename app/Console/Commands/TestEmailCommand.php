<?php

namespace App\Console\Commands;

use App\Mail\TestEmail;
use App\Services\SafeSpaceMailer;
use Illuminate\Console\Command;

class TestEmailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:send-test {email : The email address to send the test email to}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test email to verify email configuration is working';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');

        $this->info("Sending test email to: {$email}");
        $this->info("Current mail driver: " . config('mail.default'));

        // Send test email with automatic fallback handling
        $success = SafeSpaceMailer::send($email, new TestEmail(), 'test email');

        if ($success) {
            $this->info("✅ Test email sent successfully!");
            $this->info("Please check the recipient's inbox (and spam folder).");
            
            if (SafeSpaceMailer::isUsingFallback()) {
                $this->warn("📧 Note: Using Resend sandbox domain (onboarding@resend.dev)");
                $this->warn("Emails may be redirected to fallback address: " . SafeSpaceMailer::getFallbackEmail());
                $this->info("To send to any email, verify your own domain in Resend dashboard.");
            }
        } else {
            $this->error("❌ Failed to send test email even with fallback!");
            $this->info("\n🔧 Troubleshooting tips:");
            $this->info("1. Check your Resend API key in .env");
            $this->info("2. Verify Resend service is operational");
            $this->info("3. Check application logs for detailed error information");
            
            return 1;
        }

        return 0;
    }
}