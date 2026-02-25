<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestResendEmail extends Command
{
    protected $signature = 'test:resend {email}';
    protected $description = 'Test sending email via Resend';

    public function handle()
    {
        $email = $this->argument('email');
        
        $this->info("Sending test email to: {$email}");
        
        try {
            Mail::raw('This is a test email from SafeSpace. Your appointment system is working!', function ($message) use ($email) {
                $message->to($email)
                    ->subject('Test Email from SafeSpace - Appointment System');
            });
            
            $this->info("✓ Email sent successfully!");
            $this->info("Check your inbox at: {$email}");
            
        } catch (\Exception $e) {
            $this->error("✗ Failed to send email:");
            $this->error($e->getMessage());
            return 1;
        }
        
        return 0;
    }
}
