<?php

namespace App\Jobs;

use App\Models\EmailLog;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\TemplatedEmail;

class SendEmailJob implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public $tries = 3;
    public $backoff = [60, 300, 900]; // 1 minute, 5 minutes, 15 minutes

    /**
     * Create a new job instance.
     */
    public function __construct(
        public EmailLog $emailLog,
        public array $compiledTemplate,
        public array $options = []
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Create the mailable
            $mailable = new TemplatedEmail(
                $this->compiledTemplate['subject'],
                $this->compiledTemplate['body_html'],
                $this->compiledTemplate['body_text']
            );

            // Add any additional options
            if (isset($this->options['reply_to'])) {
                $mailable->replyTo($this->options['reply_to']);
            }

            if (isset($this->options['cc'])) {
                $mailable->cc($this->options['cc']);
            }

            if (isset($this->options['bcc'])) {
                $mailable->bcc($this->options['bcc']);
            }

            // Send the email
            Mail::to($this->emailLog->recipient_email)->send($mailable);

            // Mark as sent
            $this->emailLog->markAsSent();

            Log::info("Email sent successfully", [
                'email_log_id' => $this->emailLog->id,
                'recipient' => $this->emailLog->recipient_email,
                'template' => $this->emailLog->template_name,
            ]);

        } catch (\Exception $e) {
            // Mark as failed
            $this->emailLog->markAsFailed($e->getMessage());

            Log::error("Failed to send email", [
                'email_log_id' => $this->emailLog->id,
                'recipient' => $this->emailLog->recipient_email,
                'template' => $this->emailLog->template_name,
                'error' => $e->getMessage(),
                'attempt' => $this->attempts(),
            ]);

            // Re-throw the exception to trigger retry mechanism
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        // Mark email as permanently failed after all retries
        $this->emailLog->markAsFailed("Failed after {$this->tries} attempts: " . $exception->getMessage());

        Log::error("Email job permanently failed", [
            'email_log_id' => $this->emailLog->id,
            'recipient' => $this->emailLog->recipient_email,
            'template' => $this->emailLog->template_name,
            'final_error' => $exception->getMessage(),
        ]);
    }
}
