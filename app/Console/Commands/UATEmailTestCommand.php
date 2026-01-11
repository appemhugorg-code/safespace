<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Mail\UATTestNotification;

class UATEmailTestCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'uat:test-email {email} {--role=admin} {--test-id=}';

    /**
     * The console command description.
     */
    protected $description = 'Send a test email for UAT validation';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $role = $this->option('role');
        $testId = $this->option('test-id') ?: 'UAT-' . now()->format('YmdHis') . '-' . rand(1000, 9999);
        
        $this->info("🧪 Sending UAT test email...");
        $this->info("📧 Recipient: {$email}");
        $this->info("👤 Role: {$role}");
        $this->info("🆔 Test ID: {$testId}");
        
        try {
            // Create test notification mail
            $mail = new UATTestNotification($testId, $role);
            
            // Send the email
            Mail::to($email)->send($mail);
            
            $this->newLine();
            $this->info("✅ UAT test email sent successfully!");
            $this->info("🕐 Timestamp: " . now()->format('Y-m-d H:i:s T'));
            
            // Log the test email for UAT tracking
            $this->logUATEmailTest($email, $role, $testId, 'success');
            
            $this->newLine();
            $this->comment("📋 Next steps:");
            $this->comment("1. Check the recipient's inbox for the test email");
            $this->comment("2. Verify the email formatting and content");
            $this->comment("3. Confirm all links and buttons work correctly");
            $this->comment("4. Test email preferences and unsubscribe functionality");
            
        } catch (\Exception $e) {
            $this->newLine();
            $this->error("❌ Failed to send UAT test email!");
            $this->error("🔍 Error: " . $e->getMessage());
            
            // Log the failed test
            $this->logUATEmailTest($email, $role, $testId, 'failed', $e->getMessage());
            
            $this->newLine();
            $this->comment("🛠️ Troubleshooting steps:");
            $this->comment("1. Check RESEND_API_KEY in .env.uat");
            $this->comment("2. Verify MAIL_FROM_ADDRESS is configured");
            $this->comment("3. Check network connectivity");
            $this->comment("4. Review application logs for detailed errors");
            
            return Command::FAILURE;
        }
        
        return Command::SUCCESS;
    }

    /**
     * Log the UAT email test for tracking purposes
     */
    private function logUATEmailTest(string $email, string $role, string $testId, string $status, string $error = null)
    {
        try {
            \Log::channel('uat-file')->info('UAT Email Test', [
                'test_id' => $testId,
                'recipient' => $email,
                'role' => $role,
                'status' => $status,
                'error' => $error,
                'timestamp' => now()->toISOString(),
                'environment' => app()->environment(),
            ]);
        } catch (\Exception $e) {
            // Silently fail logging to not interrupt the main command
        }
    }
}