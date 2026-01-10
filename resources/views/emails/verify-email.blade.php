@extends('emails.layout')

@section('title', 'Verify Your Email Address')

@section('content')
    <div class="content-text">
        Thank you for registering with SafeSpace! To complete your account setup and ensure the security of your account, please verify your email address.
    </div>

    <div class="alert alert-info">
        <strong>Why verify your email?</strong>
        <ul style="margin: 8px 0 0 0; padding-left: 20px;">
            <li>Secure your account and enable password recovery</li>
            <li>Receive important notifications about your mental health journey</li>
            <li>Get appointment reminders and system updates</li>
            <li>Access all SafeSpace features without restrictions</li>
        </ul>
    </div>

    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ $verificationUrl }}" class="button">
            Verify Email Address
        </a>
    </div>

    <div class="content-text">
        If you're having trouble clicking the button above, copy and paste the following URL into your web browser:
    </div>

    <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 14px; word-break: break-all; margin: 16px 0;">
        {{ $verificationUrl }}
    </div>

    <div class="alert alert-warning">
        <strong>Security Notice:</strong> This verification link will expire in 60 minutes for your security. If you didn't create an account with SafeSpace, please ignore this email.
    </div>

    <div class="content-text">
        If you have any questions or need assistance, our support team is here to help.
    </div>

    <div class="content-text">
        <strong>The SafeSpace Team</strong>
    </div>
@endsection