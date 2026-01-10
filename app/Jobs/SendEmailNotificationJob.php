<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\EmailTemplate;
use App\Models\EmailDelivery;
use App\Mail\TemplatedNotificationMail;
use App\Services\SecurityService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Exception;

class SendEmailNotificationJob implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public $tries = 3;
    public $backoff = [60, 300, 900]; // 1 min, 5 min, 15 min

    /**
     * Create a new job instance.
     */
    public function __construct(
        public User $user,
        public EmailTemplate $template,
        public array $variables,
        public int $deliveryId
    ) {
        $this->onQueue('emails');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $delivery = EmailDelivery::find($this->deliveryId);
            if (!$delivery) {
                Log::error('Email delivery record not found', ['delivery_id' => $this->deliveryId]);
                return;
            }

            // Get security service
            $securityService = app(SecurityService::class);

            // Compile template with variables
            $compiledTemplate = $this->template->compile($this->variables);

            // Sanitize email content
            $sanitizedSubject = $securityService->sanitizeEmailContent($compiledTemplate['subject']);
            $sanitizedBodyHtml = $securityService->sanitizeEmailContent($compiledTemplate['body_html']);
            $sanitizedBodyText = $securityService->sanitizeInput($compiledTemplate['body_text']);

            // Create and send mail
            $mail = new TemplatedNotificationMail(
                $sanitizedSubject,
                $sanitizedBodyHtml,
                $sanitizedBodyText
            );

            Mail::to($this->user->email)->send($mail);

            // Mark as sent
            $delivery->markAsSent();

            Log::info('Email sent successfully', [
                'user_id' => $this->user->id,
                'template' => $this->template->name,
                'delivery_id' => $this->deliveryId,
            ]);

        } catch (Exception $e) {
            $delivery = EmailDelivery::find($this->deliveryId);
            if ($delivery) {
                $delivery->markAsFailed($e->getMessage());
            }

            Log::error('Failed to send email', [
                'user_id' => $this->user->id,
                'template' => $this->template->name,
                'delivery_id' => $this->deliveryId,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(Exception $exception): void
    {
        $delivery = EmailDelivery::find($this->deliveryId);
        if ($delivery) {
            $delivery->markAsFailed($exception->getMessage());
        }

        Log::error('Email job failed permanently', [
            'user_id' => $this->user->id,
            'template' => $this->template->name,
            'delivery_id' => $this->deliveryId,
            'error' => $exception->getMessage(),
        ]);
    }
}
