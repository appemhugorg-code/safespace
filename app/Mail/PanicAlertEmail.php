<?php

namespace App\Mail;

use App\Models\PanicAlert;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PanicAlertEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public PanicAlert $alert,
        public User $recipient
    ) {
        // Set high priority for panic alerts
        $this->priority = 1;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🚨 URGENT: Panic Alert - Immediate Response Required',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.panic-alert',
            with: [
                'user' => $this->recipient,
                'alert' => $this->alert,
                'childName' => $this->alert->child->name,
                'alertTime' => $this->alert->created_at->format('F j, Y g:i A T'),
                'alertMessage' => $this->alert->message,
                'location' => $this->alert->location ?? null,
                'alertUrl' => url('/emergency/alerts/' . $this->alert->id),
            ]
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
