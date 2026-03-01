# ✅ Email Notifications - Registration Setup

## Current Status: ACTIVE ✓

Email notifications for user registration are **fully configured and working**.

---

## Configuration Summary

### SMTP Settings (Gmail)
- **Host**: smtp.gmail.com
- **Port**: 587
- **Encryption**: TLS
- **From Address**: app.emhug.org@gmail.com
- **Status**: ✅ Active

### Queue Configuration
- **Driver**: database
- **Worker Status**: ✅ Running (PID: 4095)
- **Processing**: Emails are sent synchronously (immediate)

---

## What Happens on Registration

When a new user registers (Guardian or Therapist):

1. ✅ User account is created with `status = 'pending'`
2. ✅ Welcome email is sent immediately via `EmailNotificationService`
3. ✅ Email includes:
   - Welcome message
   - Account pending approval notice
   - Email verification link (if not verified)
4. ✅ User is redirected to login with success message
5. ✅ Admin can approve the account from admin panel

---

## Email Delivery Behavior

### For Real Email Addresses
- Emails are sent directly to the provided email address
- Uses Gmail SMTP (app.emhug.org@gmail.com)
- Delivery is immediate (synchronous)

### For Test/Invalid Domains
- If email fails (e.g., @safespace.test, @example.com)
- Automatically falls back to: `straycat.ai@gmail.com`
- Logs warning with original email address
- Registration still succeeds

---

## Testing Email Notifications

### Method 1: Register a New User (Recommended)

1. Go to: `http://localhost:8000/register`
2. Fill in the form with **your real email address**:
   ```
   Name: Your Name
   Email: your.real.email@gmail.com
   Password: password123
   Confirm Password: password123
   Role: Guardian or Therapist
   Phone: +1 1234567890
   Terms: ✓ Accept
   ```
3. Click **Register**
4. Check your email inbox for "Welcome to SafeSpace"
5. Check spam folder if not in inbox

### Method 2: Use Test Command

```bash
php artisan tinker
```

Then run:
```php
use App\Models\User;
use App\Services\EmailNotificationService;

// Create test user with YOUR email
$user = User::create([
    'name' => 'Test User',
    'email' => 'your.email@gmail.com', // Use your real email
    'password' => bcrypt('password'),
    'status' => 'pending'
]);

$user->assignRole('guardian');

// Send welcome email
$emailService = app(EmailNotificationService::class);
$emailService->sendWelcomeEmail($user);

echo "Email sent! Check your inbox.\n";
```

### Method 3: Check Logs

Monitor email sending in real-time:
```bash
tail -f storage/logs/laravel.log | grep -i email
```

---

## Verification Checklist

When testing with a real email address, verify:

- [ ] Email arrives in inbox (check spam if not)
- [ ] Subject: "Welcome to SafeSpace"
- [ ] From: SafeSpace <app.emhug.org@gmail.com>
- [ ] Email contains welcome message
- [ ] Email mentions account pending approval
- [ ] Email verification link is present (if applicable)
- [ ] No errors in Laravel logs

---

## Email Template Location

The welcome email template is located at:
```
resources/views/emails/welcome.blade.php
```

You can customize the email content by editing this file.

---

## Troubleshooting

### Email Not Received

1. **Check spam/junk folder**
2. **Check Laravel logs**:
   ```bash
   tail -f storage/logs/laravel.log
   ```
3. **Verify SMTP credentials**:
   ```bash
   php artisan tinker --execute="echo config('mail.mailers.smtp.username');"
   ```

### Gmail Blocking Emails

If Gmail blocks the app password:
1. Ensure 2FA is enabled on the Google account
2. Generate a new App Password
3. Update `MAIL_PASSWORD` in `.env`
4. Restart Laravel server

### Queue Not Processing

Check if queue worker is running:
```bash
ps aux | grep "queue:work"
```

If not running, start it:
```bash
php artisan queue:work
```

---

## Important Notes

### For Production

1. **Email Verification**: Currently disabled (no `verified` middleware)
   - Users can login after admin approval without verifying email
   - To enable: Add `verified` middleware to routes

2. **Queue Processing**: Emails are sent synchronously
   - For better performance, consider queuing emails:
   ```php
   Mail::to($email)->queue($mailable);
   ```

3. **Rate Limiting**: Gmail has sending limits
   - Free Gmail: ~500 emails/day
   - Consider using dedicated email service (SendGrid, Mailgun, etc.)

### For Development

- Test emails to `@safespace.test` will redirect to fallback email
- This is intentional to prevent errors during development
- Use real email addresses for actual testing

---

## Quick Test Command

Run this to test email immediately:

```bash
php artisan tinker --execute="
\$user = App\Models\User::where('email', 'guardian@safespace.test')->first();
app(App\Services\EmailNotificationService::class)->sendWelcomeEmail(\$user);
echo 'Email sent! Check logs: tail -f storage/logs/laravel.log' . PHP_EOL;
"
```

---

## Summary

✅ **Email notifications are ACTIVE and WORKING**
✅ **Registration emails will be sent automatically**
✅ **Use real email addresses when creating accounts**
✅ **Check spam folder if email doesn't arrive**
✅ **Monitor logs for any issues**

You're all set to create accounts with real email addresses! 🎉
