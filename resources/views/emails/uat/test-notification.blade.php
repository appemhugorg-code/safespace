@extends('emails.layout')

@section('content')
<div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563EB; font-size: 28px; margin-bottom: 10px;">🧪 UAT Email Test</h1>
    <p style="color: #6B7280; font-size: 16px; margin: 0;">SafeSpace User Acceptance Testing</p>
</div>

<div style="background: linear-gradient(135deg, #EBF4FF 0%, #F0F9FF 100%); padding: 25px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #2563EB;">
    <h2 style="color: #1E40AF; font-size: 20px; margin-bottom: 15px;">✅ Email System Validation</h2>
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
        This test email confirms that the SafeSpace email notification system is working correctly in the UAT environment. 
        If you received this email, the email delivery infrastructure is properly configured and operational.
    </p>
</div>

<div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
    <h3 style="color: #374151; font-size: 18px; margin-bottom: 15px;">📋 Test Information</h3>
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 8px 0; color: #6B7280; font-weight: 600; width: 140px;">Test ID:</td>
            <td style="padding: 8px 0; color: #374151; font-family: 'Courier New', monospace; background: #E5E7EB; padding: 4px 8px; border-radius: 4px;">{{ $testId }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #6B7280; font-weight: 600;">Environment:</td>
            <td style="padding: 8px 0; color: #374151;">
                <span style="background: #FEF3C7; color: #92400E; padding: 4px 8px; border-radius: 4px; font-weight: 600; text-transform: uppercase;">{{ $environment }}</span>
            </td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #6B7280; font-weight: 600;">User Role:</td>
            <td style="padding: 8px 0; color: #374151;">
                <span style="background: #DBEAFE; color: #1E40AF; padding: 4px 8px; border-radius: 4px; font-weight: 600; text-transform: capitalize;">{{ $userRole }}</span>
            </td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #6B7280; font-weight: 600;">Timestamp:</td>
            <td style="padding: 8px 0; color: #374151;">{{ $timestamp }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #6B7280; font-weight: 600;">Mail Driver:</td>
            <td style="padding: 8px 0; color: #374151;">
                <span style="background: #D1FAE5; color: #065F46; padding: 4px 8px; border-radius: 4px; font-weight: 600;">Resend</span>
            </td>
        </tr>
    </table>
</div>

<div style="background: #F0FDF4; border: 1px solid #BBF7D0; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
    <h3 style="color: #166534; font-size: 18px; margin-bottom: 15px;">✅ Validation Checklist</h3>
    <p style="color: #166534; font-size: 14px; margin-bottom: 15px;">Please verify the following items as part of your UAT email testing:</p>
    <ul style="color: #166534; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
        <li>Email was delivered to the correct recipient</li>
        <li>Subject line displays correctly</li>
        <li>Email formatting and styling appear professional</li>
        <li>All text is readable and properly formatted</li>
        <li>SafeSpace branding is consistent</li>
        <li>Test information is accurate and complete</li>
        <li>Email renders correctly in your email client</li>
    </ul>
</div>

<div style="text-align: center; margin: 30px 0;">
    <a href="{{ config('app.url') }}/health" 
       style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        🏥 Check UAT Environment Health
    </a>
</div>

<div style="background: #FEF2F2; border: 1px solid #FECACA; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
    <h3 style="color: #DC2626; font-size: 16px; margin-bottom: 10px;">⚠️ Important UAT Notes</h3>
    <ul style="color: #DC2626; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
        <li>This is a test environment - data may be reset periodically</li>
        <li>Do not use real personal or sensitive information</li>
        <li>Report any issues to the UAT coordination team</li>
        <li>All UAT activities are logged for quality assurance</li>
    </ul>
</div>

<div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
    <p style="color: #6B7280; font-size: 14px; margin-bottom: 10px;">
        <strong>SafeSpace UAT Environment</strong><br>
        Mental Health Management Platform
    </p>
    <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
        This email was sent as part of User Acceptance Testing.<br>
        Test ID: {{ $testId }} | Generated: {{ $timestamp }}
    </p>
</div>
@endsection