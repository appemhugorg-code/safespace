# Google Workspace Integration Setup & Maintenance Guide

## Overview

SafeSpace integrates with Google Workspace to provide video therapy sessions through Google Meet and calendar management through Google Calendar. This guide covers setup, configuration, and ongoing maintenance.

## Prerequisites

### Google Cloud Console Setup

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project: "SafeSpace Integration"
   - Note the Project ID

2. **Enable Required APIs**:
   - Google Calendar API
   - Google Meet API (if available)
   - Google OAuth2 API

3. **Create OAuth 2.0 Credentials**:
   - Go to "Credentials" section
   - Create "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Authorized redirect URIs: `https://yourdomain.com/auth/google/callback`

## Environment Configuration

### Required Environment Variables

Add to your `.env` file:

```env
# Google Integration
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback

# Google Calendar Settings
GOOGLE_CALENDAR_ID=primary
GOOGLE_TIMEZONE=America/New_York

# Google Meet Settings
GOOGLE_MEET_DOMAIN=yourdomain.com
```

### Service Account Setup (Optional)

For server-to-server authentication:

1. **Create Service Account**:
   - Go to "Service Accounts" in Google Cloud Console
   - Create new service account: "safespace-integration"
   - Download JSON key file

2. **Store Credentials**:
   ```bash
   # Place JSON file in storage directory
   cp service-account-key.json storage/app/google-credentials.json
   ```

3. **Set Permissions**:
   ```env
   GOOGLE_SERVICE_ACCOUNT_PATH=storage/app/google-credentials.json
   ```

## Application Configuration

### Google Services Setup

The following services are configured in SafeSpace:

1. **GoogleCalendarService**: Manages calendar events
2. **GoogleMeetService**: Creates meeting links
3. **AppointmentScheduler**: Integrates appointments with Google services

### Database Configuration

Ensure these fields exist in your appointments table:
```sql
ALTER TABLE appointments ADD COLUMN google_event_id VARCHAR(255) NULL;
ALTER TABLE appointments ADD COLUMN google_meet_link VARCHAR(500) NULL;
ALTER TABLE appointments ADD COLUMN google_calendar_data TEXT NULL;
```

## OAuth Flow Configuration

### User Authentication Flow

1. **Therapist Authorization**:
   - Therapists must authorize Google access
   - Redirect to: `/auth/google`
   - Callback handles token storage

2. **Token Management**:
   - Access tokens stored securely
   - Refresh tokens for long-term access
   - Automatic token refresh before expiration

### Scopes Required

```php
$scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/meetings.space.created'
];
```

## Google Calendar Integration

### Event Creation

When appointments are scheduled:

1. **Calendar Event Created**:
   ```php
   $event = [
       'summary' => 'Therapy Session - ' . $appointment->title,
       'start' => [
           'dateTime' => $appointment->scheduled_at->toISOString(),
           'timeZone' => config('app.timezone'),
       ],
       'end' => [
           'dateTime' => $appointment->end_time->toISOString(),
           'timeZone' => config('app.timezone'),
       ],
       'attendees' => $participants,
       'conferenceData' => [
           'createRequest' => [
               'requestId' => uniqid(),
               'conferenceSolutionKey' => ['type' => 'hangoutsMeet']
           ]
       ]
   ];
   ```

2. **Event Updates**:
   - Appointment changes update calendar event
   - Cancellations remove calendar event
   - Participant changes update attendee list

### Calendar Permissions

1. **Therapist Calendars**:
   - Read/write access to therapist's calendar
   - Create events in primary calendar
   - Manage event attendees

2. **Participant Access**:
   - Read-only access to specific events
   - Receive calendar invitations
   - Access to meeting links

## Google Meet Integration

### Meeting Link Generation

1. **Automatic Creation**:
   - Meet links created with calendar events
   - Unique link per appointment
   - Links included in email notifications

2. **Meeting Configuration**:
   ```php
   $conferenceData = [
       'createRequest' => [
           'requestId' => $appointment->id . '_' . time(),
           'conferenceSolutionKey' => ['type' => 'hangoutsMeet'],
           'status' => ['statusCode' => 'success']
       ]
   ];
   ```

### Meeting Security

1. **Access Control**:
   - Only invited participants can join
   - Meeting links expire after session
   - No recording by default

2. **Privacy Settings**:
   - Waiting room enabled
   - Host controls enabled
   - External participants require approval

## Monitoring & Maintenance

### API Quota Management

1. **Monitor Usage**:
   - Check Google Cloud Console for API usage
   - Set up quota alerts
   - Monitor rate limiting

2. **Quota Limits**:
   - Calendar API: 1,000,000 requests/day
   - Meet API: Varies by plan
   - OAuth: 10,000 requests/day

### Error Handling

1. **Common Errors**:
   ```php
   // Rate limit exceeded
   if ($exception->getCode() === 429) {
       // Implement exponential backoff
       sleep(pow(2, $retryCount));
   }
   
   // Invalid credentials
   if ($exception->getCode() === 401) {
       // Refresh access token
       $this->refreshToken($user);
   }
   
   // Calendar not found
   if ($exception->getCode() === 404) {
       // Use primary calendar
       $calendarId = 'primary';
   }
   ```

2. **Logging**:
   ```php
   Log::error('Google API Error', [
       'error' => $exception->getMessage(),
       'code' => $exception->getCode(),
       'user_id' => $user->id,
       'appointment_id' => $appointment->id
   ]);
   ```

### Token Refresh Management

1. **Automatic Refresh**:
   ```php
   public function refreshTokenIfNeeded($user)
   {
       if ($user->google_token_expires_at < now()->addMinutes(5)) {
           $this->refreshAccessToken($user);
       }
   }
   ```

2. **Manual Refresh**:
   ```bash
   php artisan google:refresh-tokens
   ```

## Security Best Practices

### Data Protection

1. **Token Storage**:
   - Encrypt access tokens in database
   - Store refresh tokens securely
   - Regular token rotation

2. **API Security**:
   - Use HTTPS for all requests
   - Validate all API responses
   - Implement request signing

### Access Control

1. **Scope Limitation**:
   - Request minimal required scopes
   - Regular scope auditing
   - User consent for scope changes

2. **User Permissions**:
   - Only therapists can create meetings
   - Participants have read-only access
   - Admin oversight of all integrations

## Troubleshooting

### Common Issues

1. **Authentication Failures**:
   ```bash
   # Check credentials
   php artisan config:clear
   php artisan cache:clear
   
   # Verify environment variables
   echo $GOOGLE_CLIENT_ID
   ```

2. **Calendar Sync Issues**:
   - Verify calendar permissions
   - Check timezone settings
   - Validate event data format

3. **Meeting Link Problems**:
   - Confirm Meet API access
   - Check conference data structure
   - Verify participant permissions

### Debugging Tools

1. **API Testing**:
   ```bash
   # Test calendar access
   php artisan google:test-calendar
   
   # Test meeting creation
   php artisan google:test-meet
   ```

2. **Log Analysis**:
   ```bash
   # View Google API logs
   tail -f storage/logs/google-api.log
   
   # Check appointment logs
   grep "google" storage/logs/laravel.log
   ```

## Maintenance Tasks

### Daily Tasks

1. **Monitor API Usage**: Check quota consumption
2. **Review Error Logs**: Address any API failures
3. **Verify Meeting Links**: Ensure links are being created

### Weekly Tasks

1. **Token Health Check**: Verify token refresh is working
2. **Calendar Sync Audit**: Check for sync discrepancies
3. **Performance Review**: Monitor API response times

### Monthly Tasks

1. **Security Audit**: Review access permissions
2. **Quota Analysis**: Analyze usage patterns
3. **Integration Testing**: Test full appointment flow

### Quarterly Tasks

1. **Credential Rotation**: Update OAuth credentials
2. **Scope Review**: Audit required permissions
3. **Backup Verification**: Test integration recovery

## Performance Optimization

### Caching Strategy

1. **Calendar Data**:
   ```php
   Cache::remember("calendar_events_{$userId}", 3600, function() {
       return $this->getCalendarEvents($userId);
   });
   ```

2. **Meeting Links**:
   - Cache meeting links after creation
   - Invalidate cache on appointment changes

### Rate Limiting

1. **Request Throttling**:
   ```php
   // Implement exponential backoff
   $delay = min(300, pow(2, $attempt));
   sleep($delay);
   ```

2. **Batch Operations**:
   - Group calendar operations
   - Batch participant updates
   - Minimize API calls

## Backup & Recovery

### Data Backup

1. **Token Backup**:
   - Regular backup of encrypted tokens
   - Secure storage of refresh tokens
   - Recovery procedures documented

2. **Integration State**:
   - Backup calendar event mappings
   - Store meeting link associations
   - Document configuration settings

### Disaster Recovery

1. **Service Outage**:
   - Fallback to manual meeting links
   - Email-based calendar invitations
   - Alternative video conferencing

2. **Data Loss Recovery**:
   - Restore from backups
   - Re-authenticate users if needed
   - Rebuild calendar associations

## Support & Resources

### Documentation Links

- [Google Calendar API](https://developers.google.com/calendar)
- [Google Meet API](https://developers.google.com/meet)
- [OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)

### Support Contacts

- **Technical Issues**: tech-support@safespace.app
- **Google Support**: Google Cloud Support (if applicable)
- **Emergency Contact**: emergency@safespace.app

---

**Last Updated**: November 2025  
**Version**: 1.0  
**Maintained By**: SafeSpace Technical Team