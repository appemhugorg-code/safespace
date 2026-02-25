# SafeSpace Email & Google Meet Setup Guide

## 1. Gmail SMTP Setup (for sending emails)

### Step 1: Create Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** in the left sidebar
3. Enable **2-Step Verification** if not already enabled
4. Search for **App passwords** or go to: https://myaccount.google.com/apppasswords
5. Create a new app password:
   - App: **Mail**
   - Device: **Other (Custom name)** - enter "SafeSpace"
6. Copy the 16-character password (no spaces)

### Step 2: Update .env File

Open `.env` and update these lines with your Gmail credentials:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="your-email@gmail.com"
```

### Step 3: Test Email

```bash
php artisan config:clear
php artisan test:resend app.emhug.org@gmail.com
```

---

## 2. Google OAuth Setup (for Google Meet links)

### Step 1: Configure Google Cloud Console

1. Go to: https://console.cloud.google.com/
2. Select your project or create a new one
3. Enable APIs:
   - Go to **APIs & Services** > **Library**
   - Search and enable: **Google Calendar API**
   - Search and enable: **Google Meet API** (if available)

4. Configure OAuth Consent Screen:
   - Go to **APIs & Services** > **OAuth consent screen**
   - Choose **External** (for testing) or **Internal** (for organization)
   - Fill in:
     - App name: **SafeSpace**
     - User support email: your email
     - Developer contact: your email
   - Add scopes:
     - `https://www.googleapis.com/auth/calendar`
     - `https://www.googleapis.com/auth/calendar.events`
   - Add test users (your email and any testers)

5. Create OAuth Credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth client ID**
   - Application type: **Web application**
   - Name: **SafeSpace Local**
   - Authorized redirect URIs:
     - `http://localhost:8000/auth/google/callback`
     - `http://127.0.0.1:8000/auth/google/callback`
   - Click **Create**
   - Copy the **Client ID** and **Client Secret**

### Step 2: Update .env File

Update these lines in `.env`:

```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

### Step 3: Connect Therapist Google Account

1. Start your Laravel server:
   ```bash
   php artisan serve
   ```

2. Log in as a therapist (therapist@safespace.test / password)

3. Go to: http://localhost:8000/auth/google

4. Authorize SafeSpace to access your Google Calendar

5. You'll be redirected back with a success message

### Step 4: Test Appointment with Real Meet Link

```bash
php artisan test:appointment app.emhug.org@gmail.com
```

This should now:
- ✓ Create an appointment
- ✓ Generate a REAL Google Meet link
- ✓ Send email to app.emhug.org@gmail.com with the Meet link

---

## 3. Verify Everything Works

### Test 1: Check Therapist Has Google Token

```bash
php artisan tinker --execute="
\$therapist = App\Models\User::role('therapist')->first();
echo 'Therapist: ' . \$therapist->name . PHP_EOL;
echo 'Has Google Token: ' . (\$therapist->google_access_token ? 'YES' : 'NO') . PHP_EOL;
"
```

### Test 2: Create Appointment with Meet Link

```bash
php artisan test:appointment app.emhug.org@gmail.com
```

Expected output:
```
✓ Meeting link generated: https://meet.google.com/xxx-yyyy-zzz
✓ Email notification sent successfully
```

### Test 3: View Email Content

```bash
php artisan show:appointment-email 1
```

---

## Troubleshooting

### Email Not Sending

1. **Check Gmail App Password**: Make sure it's 16 characters, no spaces
2. **Check 2FA**: Gmail requires 2-Step Verification for app passwords
3. **Check Firewall**: Port 587 must be open
4. **Test with log driver**: Set `MAIL_MAILER=log` and check `storage/logs/laravel.log`

### Google Meet Link Not Working

1. **Check OAuth**: Therapist must connect Google account first
2. **Check Scopes**: Calendar API must be enabled in Google Cloud Console
3. **Check Redirect URI**: Must match exactly in Google Cloud Console
4. **Check Token**: Run the verification command above

### "Invalid video call name" Error

This means the Meet link is a placeholder. The therapist needs to:
1. Connect their Google account via OAuth
2. Then create appointments - they'll get real Meet links

---

## Production Deployment

For production (app.emhug.org):

1. Update `.env`:
   ```env
   APP_URL=https://app.emhug.org
   GOOGLE_REDIRECT_URI=https://app.emhug.org/auth/google/callback
   ```

2. Add production redirect URI in Google Cloud Console:
   - `https://app.emhug.org/auth/google/callback`

3. Consider using a custom domain for emails (not Gmail SMTP)

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `php artisan test:resend EMAIL` | Test email sending |
| `php artisan test:appointment EMAIL` | Create test appointment |
| `php artisan show:appointment-email ID` | Preview email content |
| `php artisan config:clear` | Clear config cache |

---

**Need Help?** Check the logs:
- Laravel: `storage/logs/laravel.log`
- Email: Look for "mail" or "email" entries
- Google: Look for "Google" or "OAuth" entries
