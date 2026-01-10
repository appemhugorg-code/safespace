<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SafeSpace Email Test</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e2e8f0;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 10px;
        }
        .success-badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin: 20px 0;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
        }
        .info-item {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #3b82f6;
        }
        .info-label {
            font-weight: 600;
            color: #475569;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        .info-value {
            color: #1e293b;
            font-size: 14px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 12px;
        }
        .test-details {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
        }
        .test-details h3 {
            margin: 0 0 10px 0;
            color: #92400e;
        }
        @media (max-width: 600px) {
            .info-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🧠 {{ $app_name }}</div>
            <h1>Email System Test</h1>
            <div class="success-badge">✅ Email Delivery Successful</div>
        </div>

        <div class="test-details">
            <h3>🧪 Test Information</h3>
            <p>This is a test email to verify that the SafeSpace email system is working correctly. If you received this email, it means:</p>
            <ul>
                <li>✅ Email configuration is properly set up</li>
                <li>✅ SMTP connection is working</li>
                <li>✅ Email templates are rendering correctly</li>
                <li>✅ Mail delivery is functional</li>
            </ul>
        </div>

        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Sent At</div>
                <div class="info-value">{{ $timestamp }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Application</div>
                <div class="info-value">{{ $app_name }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Environment</div>
                <div class="info-value">{{ app()->environment() }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Mail Driver</div>
                <div class="info-value">{{ $mail_driver }}</div>
            </div>
        </div>

        <div style="margin: 30px 0; padding: 20px; background: #f0f9ff; border-radius: 6px; border-left: 4px solid #0ea5e9;">
            <h3 style="margin: 0 0 10px 0; color: #0c4a6e;">🎯 Next Steps</h3>
            <p style="margin: 0; color: #0c4a6e;">
                Now that email delivery is confirmed, you can:
            </p>
            <ul style="color: #0c4a6e; margin: 10px 0 0 0;">
                <li>Configure user registration emails</li>
                <li>Set up appointment reminder notifications</li>
                <li>Enable panic alert email notifications</li>
                <li>Test other email templates in the system</li>
            </ul>
        </div>

        <div class="footer">
            <p>
                <strong>SafeSpace Mental Health Platform</strong><br>
                This email was sent from: <a href="{{ $app_url }}">{{ $app_url }}</a>
            </p>
            <p style="margin-top: 15px; font-size: 11px; color: #94a3b8;">
                This is an automated test email. If you received this unexpectedly, please contact your system administrator.
            </p>
        </div>
    </div>
</body>
</html>