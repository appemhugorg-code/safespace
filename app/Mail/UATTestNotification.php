<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UATTestNotification extends Mailable
{
    use Queueable, SerializesModels;

    public string $testId;
    public string $userRole;
    public string $timestamp;
    public string $environment;

    /**
     * Create a new message instance.
     */
    public function __construct(string $testId, string $userRole)
    {
        $this->testId = $testId;
        $this->userRole = $userRole;
        $this->timestamp = now()->format('Y-m-d H:i:s T');
        $this->environment = app()->environment();
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'SafeSpace UAT - Email System Test',
            tags: ['uat', 'test', 'email-validation'],
            metadata: [
                'test_id' => $this->testId,
                'user_role' => $this->userRole,
                'environment' => $this->environment,
            ],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.uat.test-notification',
            with: [
                'testId' => $this->testId,
                'userRole' => $this->userRole,
                'timestamp' => $this->timestamp,
                'environment' => $this->environment,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}