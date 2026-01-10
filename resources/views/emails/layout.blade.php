<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>@yield('title', 'SafeSpace Notification')</title>
    <style>
        /* Reset styles */
        body,
        table,
        td,
        p,
        a,
        li,
        blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        /* Base styles */
        body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            min-width: 100%;
            background-color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #374151;
        }

        /* Container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }

        /* Header */
        .email-header {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            padding: 32px 24px;
            text-align: center;
        }

        .logo {
            color: #ffffff;
            font-size: 28px;
            font-weight: bold;
            text-decoration: none;
            display: inline-block;
        }

        .tagline {
            color: #dbeafe;
            font-size: 14px;
            margin-top: 8px;
        }

        /* Content */
        .email-content {
            padding: 32px 24px;
        }

        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
        }

        .content-text {
            margin-bottom: 24px;
            line-height: 1.7;
        }

        /* Buttons */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #3b82f6;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            margin: 16px 0;
        }

        .button:hover {
            background-color: #2563eb;
        }

        .button-secondary {
            background-color: #6b7280;
        }

        .button-secondary:hover {
            background-color: #4b5563;
        }

        /* Alert boxes */
        .alert {
            padding: 16px;
            border-radius: 8px;
            margin: 16px 0;
        }

        .alert-info {
            background-color: #dbeafe;
            border-left: 4px solid #3b82f6;
            color: #1e40af;
        }

        .alert-warning {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            color: #92400e;
        }

        .alert-success {
            background-color: #d1fae5;
            border-left: 4px solid #10b981;
            color: #065f46;
        }

        .alert-danger {
            background-color: #fee2e2;
            border-left: 4px solid #ef4444;
            color: #991b1b;
        }

        /* Footer */
        .email-footer {
            background-color: #f9fafb;
            padding: 24px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }

        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
        }

        .footer-links {
            margin: 16px 0;
        }

        .footer-links a {
            color: #3b82f6;
            text-decoration: none;
            margin: 0 8px;
            font-size: 14px;
        }

        .unsubscribe {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 16px;
        }

        .unsubscribe a {
            color: #6b7280;
        }

        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
            }

            .email-header,
            .email-content,
            .email-footer {
                padding-left: 16px !important;
                padding-right: 16px !important;
            }

            .button {
                display: block !important;
                width: 100% !important;
                box-sizing: border-box;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <a href="{{ config('app.url') }}" class="logo">
                SafeSpace
            </a>
            <div class="tagline">Your Mental Health Support Platform</div>
        </div>

        <!-- Content -->
        <div class="email-content">
            @if (isset($greeting))
                <div class="greeting">{{ $greeting }}</div>
            @endif

            @yield('content')
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <div class="footer-text">
                <strong>SafeSpace</strong> - Supporting Mental Health & Wellbeing
            </div>

            <div class="footer-links">
                <a href="{{ config('app.url') }}">Visit Platform</a>
                <a href="{{ config('app.url') }}/help">Help Center</a>
                <a href="{{ config('app.url') }}/contact">Contact Support</a>
            </div>

            <div class="footer-text">
                This email was sent to {{ $user->email ?? 'you' }} because you have an account with SafeSpace.
            </div>

            @if (isset($unsubscribeUrl))
                <div class="unsubscribe">
                    <a href="{{ $unsubscribeUrl }}">Unsubscribe from these emails</a>
                </div>
            @endif
        </div>
    </div>
</body>

</html>
