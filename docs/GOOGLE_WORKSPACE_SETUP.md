# Google Workspace Integration Setup

This guide explains how to set up Google Calendar and Google Meet integration for SafeSpace therapy sessions.

## Prerequisites

- Google Cloud Console account
- Google Workspace account (or regular Google account for testing)

## Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

### 2. Enable Required APIs

Enable the following APIs in your Google Cloud project:

- **Google Calendar API**
- **Google Meet API** (if available)

To enable:
1. Go to "APIs & Services" > "Library"
2. Search for each API
3. Click "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:8000/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)
5. Download the JSON credentials file

### 4. Configure Environment Variables

Add the following to your `.env` file:

```env
# Google Workspace Integration
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
GOOGLE_CREDENTIALS_PATH=storage/app/google-credentials.json
```

### 5. Store Credentials File

1. Place the downloaded JSON credentials file in `storage/app/google-credentials.json`
2. Ensure the file is not committed to version control (already in .gitignore)

## OAuth Flow

The application uses OAuth 2.0 for authentication:

1. User initiates Google Calendar connection
2. User is redirected to Google's consent screen
3. After approval, Google redirects back with authorization code
4. Application exchanges code for access token
5. Access token is stored securely for API calls

## Usage

### Creating a Therapy Session with Google Meet

```php
use App\Services\GoogleMeetService;
use App\Models\Appointment;

$appointment = Appointment::find($id);
$googleMeetService = app(GoogleMeetService::class);

// Create Google Meet session
$success = $googleMeetService->createTherapySession($appointment);

if ($success) {
    // Appointment now has google_meet_link and google_event_id
    echo "Meeting link: " . $appointment->google_meet_link;
}
```

### Updating a Session

```php
// Update appointment details
$appointment->update([
    'scheduled_at' => $newDateTime,
    'duration_minutes' => 90,
]);

// Sync with Google Calendar
$googleMeetService->updateTherapySession($appointment);
```

### Cancelling a Session

```php
// Cancel appointment
$appointment->update(['status' => 'cancelled']);

// Remove from Google Calendar
$googleMeetService->cancelTherapySession($appointment);
```

## Security Considerations

1. **Token Storage**: Access tokens should be encrypted in the database
2. **Scope Limitation**: Only request necessary Calendar scopes
3. **Token Refresh**: Implement automatic token refresh for expired tokens
4. **Meeting Privacy**: Ensure meeting links are only accessible to participants

## Testing

For development/testing without actual Google integration:

1. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to dummy values
2. The system will gracefully handle missing credentials
3. Appointments will still work without Google Meet links

## Troubleshooting

### "Invalid credentials" error
- Verify credentials file path is correct
- Check that credentials file is valid JSON
- Ensure OAuth client is properly configured

### "Insufficient permissions" error
- Verify Calendar API is enabled
- Check OAuth scopes in GoogleCalendarService
- Re-authenticate if scopes were changed

### Meeting link not generated
- Ensure conferenceDataVersion=1 is set in API call
- Check that Google Meet is enabled for your account
- Verify Calendar API quota hasn't been exceeded

## API Quotas

Google Calendar API has the following default quotas:
- 1,000,000 queries per day
- 10 queries per second per user

Monitor usage in Google Cloud Console under "APIs & Services" > "Dashboard"

## Production Deployment

1. Update redirect URI to production domain
2. Store credentials securely (use encrypted storage or secrets manager)
3. Implement token refresh mechanism
4. Set up monitoring for API errors
5. Configure proper error handling and fallbacks
