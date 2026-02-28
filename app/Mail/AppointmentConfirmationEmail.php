<?php

namespace App\Mail;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentConfirmationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Appointment $appointment,
        public User $recipient
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Appointment Confirmed - SafeSpace',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-confirmation',
            with: [
                'recipient' => $this->recipient,
                'appointment' => $this->appointment,
                'appointmentDate' => $this->appointment->scheduled_at->format('F j, Y'),
                'appointmentTime' => $this->appointment->scheduled_at->format('g:i A T'),
                'therapistName' => $this->appointment->therapist->name ?? 'Therapist',
                'childName' => $this->appointment->child->name ?? 'Child',
                'duration' => $this->appointment->duration_minutes ?? 60,
                'meetLink' => $this->appointment->google_meet_link ?? $this->appointment->meeting_link,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
