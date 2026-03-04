<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmail extends Command
{
    protected $signature = 'email:test {recipient}';
    protected $description = 'Test email configuration by sending a test email';

    public function handle()
    {
        $recipient = $this->argument('recipient');
        
        $this->info("Attempting to send test email to: {$recipient}");
        
        try {
            Mail::raw('This is a test email from SafeSpace. If you received this, email is working correctly.', function ($message) use ($recipient) {
                $message->to($recipient)
                    ->subject('SafeSpace Email Test - ' . now()->format('Y-m-d H:i:s'));
            });
            
            $this->info('✓ Email sent successfully!');
            $this->info('Check your inbox (and spam folder) at: ' . $recipient);
            
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('✗ Failed to send email');
            $this->error('Error: ' . $e->getMessage());
            
            return Command::FAILURE;
        }
    }
}
