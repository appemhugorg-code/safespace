<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TherapistActivationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $therapist
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your SafeSpace Therapist Account Has Been Activated',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.therapist-activation',
        );
    }
}