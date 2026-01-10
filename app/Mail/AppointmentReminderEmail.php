<?php

namespace App\Mail;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentReminderEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Appointment $appointment,
        public User $user,
        public string $reminderType = '24h'
    ) {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->reminderType === '1h' 
            ? 'Appointment Starting Soon - SafeSpace Reminder'
            : 'Appointment Tomorrow - SafeSpace Reminder';

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-reminder',
            with: [
                'user' => $this->user,
                'appointment' => $this->appointment,
                'appointmentDate' => $this->appointment->scheduled_at->format('F j, Y'),
                'appointmentTime' => $this->appointment->scheduled_at->format('g:i A T'),
                'therapistName' => $this->appointment->therapist->name ?? 'Your Therapist',
                'duration' => $this->appointment->duration_minutes ?? 60,
                'meetLink' => $this->appointment->google_meet_link ?? $this->appointment->meeting_link,
                'reminderType' => $this->reminderType,
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
