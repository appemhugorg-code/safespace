@extends('emails.layout')

@section('title', 'Appointment Reminder')

@section('content')
    <div class="content-text">
        This is a friendly reminder about your upcoming therapy appointment.
    </div>

    <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h3 style="margin: 0 0 16px 0; color: #0c4a6e; font-size: 18px;">📅 Appointment Details</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
                <strong style="color: #0c4a6e;">Date:</strong><br>
                {{ $appointmentDate }}
            </div>
            <div>
                <strong style="color: #0c4a6e;">Time:</strong><br>
                {{ $appointmentTime }}
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
                <strong style="color: #0c4a6e;">Therapist:</strong><br>
                {{ $therapistName }}
            </div>
            <div>
                <strong style="color: #0c4a6e;">Duration:</strong><br>
                {{ $duration }} minutes
            </div>
        </div>
    </div>

    @if($meetLink)
        <div class="alert alert-info">
            <strong>🎥 Video Session:</strong> This appointment will be conducted via video call. Click the button below to join when it's time.
        </div>

        <div style="text-align: center; margin: 24px 0;">
            <a href="{{ $meetLink }}" class="button">
                Join Video Session
            </a>
        </div>
    @endif

    <div class="content-text">
        <strong>Preparation Tips:</strong>
    </div>
    <ul>
        <li>Find a quiet, private space for your session</li>
        <li>Test your internet connection and audio/video</li>
        <li>Have any questions or topics you'd like to discuss ready</li>
        <li>Ensure you won't be interrupted during the session</li>
    </ul>

    @if($reminderType === '24h')
        <div class="alert alert-success">
            <strong>⏰ 24-Hour Reminder:</strong> Your appointment is tomorrow. You'll receive another reminder 1 hour before the session.
        </div>
    @elseif($reminderType === '1h')
        <div class="alert alert-warning">
            <strong>🔔 Final Reminder:</strong> Your appointment starts in 1 hour. Please prepare to join your session.
        </div>
    @endif

    <div class="content-text">
        If you need to reschedule or cancel this appointment, please do so at least 24 hours in advance through your SafeSpace dashboard or by contacting support.
    </div>

    <div class="content-text">
        We look forward to supporting you on your mental health journey.
    </div>

    <div class="content-text">
        <strong>The SafeSpace Team</strong>
    </div>
@endsection