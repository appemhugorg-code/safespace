<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #6B7280; }
        .value { color: #111827; }
        .meet-link { display: inline-block; background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #6B7280; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 SafeSpace</h1>
            <p>Appointment Confirmed</p>
        </div>
        
        <div class="content">
            <p>Hello {{ $recipient->name }},</p>
            
            <p>Your appointment has been confirmed!</p>
            
            <div class="appointment-details">
                <h3 style="margin-top: 0;">Appointment Details</h3>
                
                <div class="detail-row">
                    <span class="label">Date:</span>
                    <span class="value">{{ $appointmentDate }}</span>
                </div>
                
                <div class="detail-row">
                    <span class="label">Time:</span>
                    <span class="value">{{ $appointmentTime }}</span>
                </div>
                
                <div class="detail-row">
                    <span class="label">Duration:</span>
                    <span class="value">{{ $duration }} minutes</span>
                </div>
                
                <div class="detail-row">
                    <span class="label">Therapist:</span>
                    <span class="value">{{ $therapistName }}</span>
                </div>
                
                <div class="detail-row">
                    <span class="label">Child:</span>
                    <span class="value">{{ $childName }}</span>
                </div>
                
                @if($appointment->title)
                <div class="detail-row">
                    <span class="label">Title:</span>
                    <span class="value">{{ $appointment->title }}</span>
                </div>
                @endif
                
                @if($meetLink)
                <div style="text-align: center; margin-top: 20px;">
                    <a href="{{ $meetLink }}" class="meet-link">Join Google Meet</a>
                </div>
                @endif
            </div>
            
            <p><strong>Important:</strong> Please join the meeting a few minutes early to ensure everything is set up properly.</p>
            
            <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
        </div>
        
        <div class="footer">
            <p>SafeSpace - Supporting Mental Health & Wellbeing</p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
