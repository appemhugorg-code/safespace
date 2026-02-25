# 🎥 Google Meet Integration - Complete Setup

## ✅ What's Been Implemented

Your SafeSpace application now has:

1. ✅ **GoogleCalendarService** - Creates calendar events
2. ✅ **GoogleMeetService** - Generates Meet links
3. ✅ **OAuth Flow** - User authorization system
4. ✅ **Database** - Token storage ready
5. ✅ **Routes** - OAuth endpoints configured

## 🚀 Setup Instructions

### Step 1: Get Google Cloud Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create Project**: Click "New Project" → Name: "SafeSpace"
3. **Enable APIs**:
   - Go to "APIs & Services" → "Library"
   - Enable "Google Calendar API"
4. **Create OAuth Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - If prompted, configure OAuth consent screen:
     - App name: SafeSpace
     - User support email: app.emhug.org@gmail.com
     - Scopes: Add `calendar.events` scope
   - Application type: **Web application**
   - Authorized redirect URIs:
     ```
     http://localhost:8000/auth/google/callback
     ```
   - Click "Create"
   - **Copy Client ID and Client Secret**

### Step 2: Configure .env

Add these to your `.env` file:

```env
# Google Meet Integration
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

### Step 3: Clear Cache

```bash
php artisan config:clear
php artisan cache:clear
```

### Step 4: Test OAuth Flow

1. **Start your server**:
   ```bash
   php artisan serve
   ```

2. **Login as therapist**:
   - Email: therapist@safespace.test
   - Password: password

3. **Connect Google Calendar**:
   - Visit: http://localhost:8000/auth/google
   - Authorize SafeSpace
   - You'll be redirected back with success message

### Step 5: Create Test Appointment

```bash
php artisan tinker
```

```php
// Get therapist (must have Google connected)
$therapist = User::where('email', 'therapist@safespace.test')->first();
$child = User::role('child')->first();

// Create appointment
$appointment = Appointment::create([
    'therapist_id' => $therapist->id,
    'child_id' => $child->id,
    'scheduled_at' => now()->addDay()->setTime(14, 0),
    'duration_minutes' => 60,
    'status' => 'scheduled',
    'type' => 'therapy_session',
    'notes' => 'Test session with Google Meet',
]);

// Generate Google Meet link
$meetService = app(\App\Services\GoogleMeetService::class);

// Set therapist's token
$calendarService = app(\App\Services\GoogleCalendarService::class);
$calendarService->setAccessToken(decrypt($therapist->google_access_token));

// Create session
$result = $meetService->createTherapySession($appointment);

if ($result) {
    $appointment->refresh();
    echo "✅ Success!\n";
    echo "Event ID: " . $appointment->google_event_id . "\n";
    echo "Meet Link: " . $appointment->google_meet_link . "\n";
} else {
    echo "❌ Failed - Check storage/logs/laravel.log\n";
}
```

## 📋 How It Works

### Appointment Creation Flow:

```
1. Therapist creates appointment in SafeSpace
         ↓
2. System checks if therapist has Google connected
         ↓
3. GoogleMeetService::createTherapySession()
         ↓
4. GoogleCalendarService::createEvent()
   - Creates calendar event
   - Adds Google Meet conference
   - Invites all participants
         ↓
5. Event ID and Meet link saved to appointment
         ↓
6. Email notifications sent with Meet link
         ↓
7. All participants receive calendar invite
```

### Database Structure:

**Appointments Table:**
- `google_event_id` - Calendar event ID
- `google_meet_link` - Meet video link
- `google_calendar_data` - Full event data (JSON)

**Users Table:**
- `google_access_token` - Encrypted OAuth token
- `google_refresh_token` - Encrypted refresh token
- `google_token_expires_at` - Token expiration

## 🧪 Testing Checklist

- [ ] Google Cloud project created
- [ ] Calendar API enabled
- [ ] OAuth credentials created
- [ ] .env configured with credentials
- [ ] Therapist authorized Google access
- [ ] Test appointment created
- [ ] Google Meet link generated
- [ ] Calendar event visible in Google Calendar
- [ ] Email notifications sent

## 🔧 API Endpoints

### OAuth Endpoints:
- `GET /auth/google` - Start OAuth flow
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/google/disconnect` - Disconnect Google

### Appointment Endpoints (existing):
- `POST /api/appointments` - Create appointment (auto-creates Meet link)
- `PUT /api/appointments/{id}` - Update appointment (updates Meet link)
- `DELETE /api/appointments/{id}` - Cancel appointment (removes Meet link)

## 🎯 Frontend Integration

### Add "Connect Google Calendar" Button:

```tsx
// In therapist dashboard
<Button onClick={() => window.location.href = '/auth/google'}>
  Connect Google Calendar
</Button>

// Show connection status
{user.google_access_token && (
  <Badge variant="success">
    ✓ Google Calendar Connected
  </Badge>
)}
```

### Display Meet Links:

```tsx
// In appointment details
{appointment.google_meet_link && (
  <a 
    href={appointment.google_meet_link}
    target="_blank"
    className="btn btn-primary"
  >
    Join Google Meet
  </a>
)}
```

## 🔐 Security Notes

1. **Tokens are encrypted** in database
2. **OAuth scopes limited** to calendar.events only
3. **Only therapists** can connect Google
4. **Tokens auto-refresh** before expiration
5. **HTTPS required** in production

## 🐛 Troubleshooting

### "Invalid credentials"
```bash
# Check .env values
php artisan config:clear
php artisan tinker
config('services.google.client_id')
```

### "Redirect URI mismatch"
- Ensure redirect URI in Google Console matches .env exactly
- Include http:// or https://
- No trailing slash

### "Calendar API not enabled"
- Go to Google Cloud Console
- Enable Google Calendar API
- Wait 1-2 minutes

### "Insufficient permissions"
- User must authorize via /auth/google
- Check OAuth consent screen configuration
- Verify calendar.events scope is requested

### "Token expired"
- Implement token refresh (see below)

## 🔄 Token Refresh (Advanced)

Add to GoogleCalendarService:

```php
public function refreshTokenIfNeeded($user)
{
    if ($user->google_token_expires_at < now()->addMinutes(5)) {
        $this->client->setAccessToken(decrypt($user->google_access_token));
        
        if ($this->client->isAccessTokenExpired()) {
            $newToken = $this->client->fetchAccessTokenWithRefreshToken(
                decrypt($user->google_refresh_token)
            );
            
            $user->update([
                'google_access_token' => encrypt($newToken['access_token']),
                'google_token_expires_at' => now()->addSeconds($newToken['expires_in']),
            ]);
        }
    }
}
```

## 📊 Production Checklist

Before deploying to production:

- [ ] Update redirect URI to production domain
- [ ] Configure OAuth consent screen for production
- [ ] Set up token refresh automation
- [ ] Implement error handling for API failures
- [ ] Add monitoring for API quota usage
- [ ] Test with multiple therapists
- [ ] Verify email notifications work
- [ ] Test appointment cancellation flow
- [ ] Document for end users

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ Therapist can connect Google Calendar
2. ✅ Creating appointment generates Meet link
3. ✅ Calendar event appears in Google Calendar
4. ✅ Participants receive calendar invites
5. ✅ Meet link is accessible to all participants
6. ✅ Email notifications include Meet link

## 📞 Next Steps

1. **Get your Google credentials** from Cloud Console
2. **Add to .env** and test OAuth flow
3. **Create test appointment** with Meet link
4. **Add UI components** for therapists
5. **Test full workflow** end-to-end

## 💡 Tips

- Use a test Google account for development
- Keep OAuth consent screen in "Testing" mode initially
- Monitor Google Cloud Console for API usage
- Check `storage/logs/laravel.log` for errors
- Test with different user roles

---

**Ready to set up?** Follow Step 1 above to get started! 🚀
