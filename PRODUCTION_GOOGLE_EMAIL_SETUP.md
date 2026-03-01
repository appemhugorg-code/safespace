╔══════════════════════════════════════════════════════════════╗
║     PRODUCTION GOOGLE API & EMAIL CONFIGURATION GUIDE        ║
╚══════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 GOOGLE API REDIRECT URLs FOR PRODUCTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Replace YOUR_DOMAIN with your actual production domain.

🔗 Platform Google OAuth Callback (for appointments):
   https://YOUR_DOMAIN/platform/google/callback

🔗 User Google OAuth Callback (for individual users):
   https://YOUR_DOMAIN/auth/google/callback

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 STEP 1: UPDATE GOOGLE CLOUD CONSOLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Go to: https://console.cloud.google.com/apis/credentials

2. Select your project (or the one with Client ID: 688720535759...)

3. Click on your OAuth 2.0 Client ID

4. Under "Authorized redirect URIs", ADD these URLs:
   
   ✓ https://YOUR_DOMAIN/platform/google/callback
   ✓ https://YOUR_DOMAIN/auth/google/callback
   
   Example if your domain is safespace.app:
   ✓ https://safespace.app/platform/google/callback
   ✓ https://safespace.app/auth/google/callback

5. Click "SAVE"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 STEP 2: UPDATE PRODUCTION .env FILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

On your production server, update these variables:

# Application URL
APP_URL=https://YOUR_DOMAIN

# Google Meet Integration
GOOGLE_CLIENT_ID=688720535759-sknp0kekn3qg6rbdvj3e30induuflv8s.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://YOUR_DOMAIN/platform/google/callback
GOOGLE_PLATFORM_EMAIL=app.emhug.org@gmail.com

# Email Configuration (Gmail SMTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=app.emhug.org@gmail.com
MAIL_PASSWORD=mjakbyvbeeaijtvq
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="app.emhug.org@gmail.com"
MAIL_FROM_NAME="SafeSpace"

# Queue (for email processing)
QUEUE_CONNECTION=database

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 STEP 3: DEPLOY AND CONFIGURE PRODUCTION SERVER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After updating .env on production:

1. Clear configuration cache:
   $ php artisan config:clear
   $ php artisan cache:clear

2. Start queue worker (for emails):
   $ php artisan queue:work --daemon
   
   Or use supervisor/systemd to keep it running:
   $ sudo systemctl start laravel-worker

3. Verify configuration:
   $ php artisan tinker --execute="
   echo 'App URL: ' . config('app.url') . PHP_EOL;
   echo 'Google Redirect: ' . config('services.google.redirect') . PHP_EOL;
   echo 'Mail From: ' . config('mail.from.address') . PHP_EOL;
   "

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 STEP 4: TEST GOOGLE API INTEGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test 1: Connect Platform Google Account
----------------------------------------
1. Login as admin or therapist
2. Go to: https://YOUR_DOMAIN/platform/google/connect
3. Authorize with app.emhug.org@gmail.com
4. Should redirect back to your app successfully

Test 2: Create Appointment with Google Meet
--------------------------------------------
1. Login as therapist or guardian
2. Navigate to Appointments → Create
3. Fill in appointment details
4. Submit the form
5. Verify Google Meet link is generated
6. Check Google Calendar for the event

Test 3: Individual User Google Connection
------------------------------------------
1. Login as any user
2. Go to Settings/Profile
3. Click "Connect Google Account"
4. Authorize with your personal Google account
5. Should show "Connected" status

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 STEP 5: TEST EMAIL NOTIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test 1: Registration Email
---------------------------
1. Go to: https://YOUR_DOMAIN/register
2. Register with a REAL email address
3. Check inbox for "Welcome to SafeSpace"
4. Verify email arrives within 1-2 minutes

Test 2: Appointment Notification Email
---------------------------------------
1. Create an appointment (as therapist/guardian)
2. All participants should receive email notifications
3. Check inbox for appointment details

Test 3: Monitor Email Logs
---------------------------
On production server:
$ tail -f storage/logs/laravel.log | grep -i email

Look for:
✓ "Email sent successfully"
✓ "Welcome email process completed"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 VERIFICATION CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Google API:
□ Redirect URIs added to Google Cloud Console
□ .env updated with production domain
□ Platform Google account connected successfully
□ Appointments generate Google Meet links
□ Calendar events created in Google Calendar

Email:
□ SMTP credentials configured in .env
□ Queue worker running on production
□ Registration emails received
□ Appointment notification emails received
□ No errors in Laravel logs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  COMMON ISSUES & SOLUTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Issue: "redirect_uri_mismatch" error
Solution: 
→ Verify redirect URI in Google Console matches EXACTLY
→ Must include https:// (not http://)
→ No trailing slash
→ Wait 5 minutes after saving in Google Console

Issue: Google Meet links not generated
Solution:
→ Ensure platform Google account is connected
→ Check app.emhug.org@gmail.com has Calendar API access
→ Verify GOOGLE_PLATFORM_EMAIL in .env

Issue: Emails not sending
Solution:
→ Check queue worker is running: ps aux | grep queue
→ Verify Gmail app password is correct
→ Check storage/logs/laravel.log for errors
→ Test SMTP: php artisan tinker (see test command below)

Issue: SSL/TLS errors with Gmail
Solution:
→ Ensure MAIL_ENCRYPTION=tls (not ssl)
→ Port should be 587 (not 465)
→ Verify server can reach smtp.gmail.com:587

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 QUICK TEST COMMANDS (Run on Production)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test Email Configuration:
--------------------------
php artisan tinker --execute="
use App\Models\User;
use App\Services\EmailNotificationService;

\$user = User::first();
if (\$user) {
    app(EmailNotificationService::class)->sendWelcomeEmail(\$user);
    echo 'Test email sent to: ' . \$user->email . PHP_EOL;
} else {
    echo 'No users found. Create a user first.' . PHP_EOL;
}
"

Test Google API Configuration:
-------------------------------
php artisan tinker --execute="
echo 'Google Client ID: ' . config('services.google.client_id') . PHP_EOL;
echo 'Google Redirect: ' . config('services.google.redirect') . PHP_EOL;
echo 'Platform Email: ' . config('services.google.platform_email') . PHP_EOL;
"

Check Queue Status:
-------------------
php artisan queue:work --once --verbose

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PRODUCTION DEPLOYMENT CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before going live:
□ Update .env with production domain
□ Add redirect URIs to Google Cloud Console
□ Configure SSL certificate (https)
□ Start queue worker with supervisor/systemd
□ Test Google OAuth flow
□ Test appointment creation with Meet links
□ Test email delivery with real addresses
□ Set up log monitoring
□ Configure backup for database
□ Set APP_DEBUG=false in production .env
□ Run: php artisan config:cache
□ Run: php artisan route:cache
□ Run: php artisan view:cache

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 SUPPORT RESOURCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Google Cloud Console:
https://console.cloud.google.com/apis/credentials

Gmail App Passwords:
https://myaccount.google.com/apppasswords

Laravel Queue Documentation:
https://laravel.com/docs/queues

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 QUICK SUMMARY:

1. Add to Google Console: https://YOUR_DOMAIN/platform/google/callback
2. Update .env: GOOGLE_REDIRECT_URI=https://YOUR_DOMAIN/platform/google/callback
3. Update .env: APP_URL=https://YOUR_DOMAIN
4. Clear cache: php artisan config:clear
5. Start queue: php artisan queue:work --daemon
6. Test: Go to https://YOUR_DOMAIN/platform/google/connect

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
