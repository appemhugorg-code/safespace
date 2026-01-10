@extends('emails.layout')

@section('title', 'Reset Your Password')

@section('content')
    <div class="content-text">
        You are receiving this email because we received a password reset request for your SafeSpace account.
    </div>

    <div class="alert alert-info">
        <strong>Account Security:</strong> If you didn't request a password reset, no further action is required. Your account remains secure.
    </div>

    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ $resetUrl }}" class="button">
            Reset Password
        </a>
    </div>

    <div class="content-text">
        If you're having trouble clicking the button above, copy and paste the following URL into your web browser:
    </div>

    <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 14px; word-break: break-all; margin: 16px 0;">
        {{ $resetUrl }}
    </div>

    <div class="alert alert-warning">
        <strong>Important:</strong> This password reset link will expire in 60 minutes for your security. If you don't reset your password within this time, you'll need to request a new reset link.
    </div>

    <div class="content-text">
        For your security, please:
    </div>
    <ul>
        <li>Choose a strong, unique password</li>
        <li>Don't share your password with anyone</li>
        <li>Consider enabling two-factor authentication</li>
        <li>Contact support if you notice any suspicious activity</li>
    </ul>

    <div class="content-text">
        If you have any questions or concerns about your account security, please contact our support team immediately.
    </div>

    <div class="content-text">
        <strong>The SafeSpace Team</strong>
    </div>
@endsection