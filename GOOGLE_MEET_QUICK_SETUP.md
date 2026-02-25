# Google Meet Integration - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "New Project" → Name it "SafeSpace"
3. Note your Project ID

### Step 2: Enable APIs

1. In your project, go to "APIs & Services" → "Library"
2. Search and enable:
   - ✅ Google Calendar API
   - ✅ Google People API (for user info)

### Step 3: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Configure OAuth consent screen (if prompted):
   - User Type: External
   - App name: SafeSpace
   - User support email: your-email@gmail.com
   - Developer contact: your-email@gmail.com
4. Create OAuth Client:
   - Application type: **Web application**
   - Name: SafeSpace Web Client
   - Authorized redirect URIs:
     ```
     http://localhost:8000/auth/google/callback
     http://localhost:8000/google/callback
     ```
5. Copy your **Client ID** and **Client Secret**

### Step 4: Configure SafeSpace

Add to your `.env` file:

```env
# Google Meet Integration
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

### Step 5: Test Integration

```bash
# Clear config cache
php artisan config:clear

# Test the setup
php artisan tinker
```

Then in tinker:
```php
$service = app(\App\Services\GoogleCalendarService::class);
echo "Google Calendar Service loaded successfully!\n";
```

## 📋 How It Works

### When an Appointment is Created:

1. **Therapist schedules appointment** → SafeSpace creates it
2. **Google Calendar event created** automatically
3. **Google Meet link generated** and attached
4. **Email notifications sent** with meeting link
5. **All participants receive** calendar invite

### Appointment Flow:

```
Therapist creates appointment
         ↓
GoogleMeetService::createTherapySession()
         ↓
GoogleCalendarService::createEvent()
         ↓
Google Calendar Event + Meet Link
         ↓
Saved to appointment record
         ↓
Email notifications sent
```

## 🧪 Testing

### Test 1: Create Test Appointment

```bash
php artisan tinker
```

```php
// Get test users
$therapist = User::role('therapist')->first();
$child = User::role('child')->first();

// Create appointment
$appointment = Appointment::create([
    'therapist_id' => $therapist->id,
    'child_id' => $child->id,
    'scheduled_at' => now()->addDay(),
    'duration_minutes' => 60,
    'status' => 'scheduled',
    'type' => 'therapy_session',
]);

// Create Google Meet session
$meetService = app(\App\Services\GoogleMeetService::class);
$result = $meetService->createTherapySession($appointment);

if ($result) {
    echo "✅ Success!\n";
    echo "Meet Link: " . $appointment->fresh()->google_meet_link . "\n";
} else {
    echo "❌ Failed - Check logs\n";
}
```

### Test 2: Check Appointment API

```bash
# Start server
php artisan serve

# In another terminal, test API
curl http://localhost:8000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Troubleshooting

### Issue: "Invalid credentials"
**Solution**: 
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
- Run `php artisan config:clear`

### Issue: "Redirect URI mismatch"
**Solution**:
- Add exact redirect URI to Google Cloud Console
- Must match GOOGLE_REDIRECT_URI in .env

### Issue: "Calendar API not enabled"
**Solution**:
- Go to Google Cloud Console
- Enable Google Calendar API
- Wait 1-2 minutes for propagation

### Issue: "Insufficient permissions"
**Solution**:
- User needs to authorize Google access
- Implement OAuth flow (see below)

## 🔐 OAuth Flow (User Authorization)

Users need to authorize SafeSpace to access their Google Calendar:

### Implementation Needed:

1. **Authorization Route** (add to routes/web.php):
```php
Route::get('/auth/google', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);
```

2. **Controller** (create if needed):
```php
// Will create this in next step if you need it
```

## 📊 Current Status

✅ GoogleMeetService - Implemented
✅ GoogleCalendarService - Implemented  
✅ Appointment Integration - Ready
⚠️ OAuth Flow - Needs user authorization
⚠️ Token Storage - Needs implementation

## 🎯 Next Steps

1. **Add Google credentials to .env**
2. **Test with your Google account**
3. **Implement OAuth flow for therapists**
4. **Test full appointment creation**

## 📞 Support

- Google Cloud Console: https://console.cloud.google.com/
- Calendar API Docs: https://developers.google.com/calendar
- SafeSpace Docs: /docs/admin/GOOGLE_INTEGRATION_SETUP.md
