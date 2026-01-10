@extends('emails.layout')

@section('title', 'Welcome to SafeSpace')

@section('content')
    <div class="content-text">
        Welcome to SafeSpace! We're excited to have you join our community dedicated to mental health and wellbeing.
    </div>

    @if ($user->hasRole('guardian'))
        <div class="content-text">
            As a Guardian, you now have access to:
        </div>
        <ul>
            <li>Schedule therapy sessions for your children</li>
            <li>Monitor your children's mood tracking and progress</li>
            <li>Communicate securely with therapists</li>
            <li>Access educational resources and support materials</li>
            <li>Manage emergency contacts and panic alert settings</li>
        </ul>
    @elseif($user->hasRole('therapist'))
        <div class="content-text">
            As a Therapist, you now have access to:
        </div>
        <ul>
            <li>Manage your client appointments and availability</li>
            <li>Conduct secure video therapy sessions</li>
            <li>Monitor client progress and mood tracking</li>
            <li>Create and publish educational content</li>
            <li>Access comprehensive client management tools</li>
        </ul>
    @elseif($user->hasRole('child'))
        <div class="content-text">
            Welcome to your safe space! Here you can:
        </div>
        <ul>
            <li>Track your daily moods and feelings</li>
            <li>Chat securely with your therapist and guardian</li>
            <li>Join group conversations with other young people</li>
            <li>Access age-appropriate mental health resources</li>
            <li>Use the panic alert feature when you need immediate help</li>
        </ul>
    @endif

    <div class="alert alert-info">
        <strong>Getting Started:</strong>
        @if ($user->email_verified_at)
            Your account is ready to use! Click the button below to access your dashboard.
        @else
            Please verify your email address by clicking the verification link we sent to {{ $user->email }}.
        @endif
    </div>

    @if ($user->email_verified_at)
        <div style="text-align: center;">
            <a href="{{ config('app.url') }}/dashboard" class="button">
                Access Your Dashboard
            </a>
        </div>
    @else
        <div style="text-align: center;">
            <a href="{{ $verificationUrl }}" class="button">
                Verify Email Address
            </a>
        </div>
    @endif

    <div class="content-text">
        If you have any questions or need assistance, our support team is here to help. You can reach us through the
        platform or reply to this email.
    </div>

    <div class="content-text">
        Thank you for choosing SafeSpace for your mental health journey.
    </div>

    <div class="content-text">
        <strong>The SafeSpace Team</strong>
    </div>
@endsection
