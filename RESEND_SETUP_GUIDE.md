# Resend Email Setup - Testing Guide

## Prerequisites
✅ Resend account created
✅ API key obtained
✅ .env file updated

## Setup Steps

### 1. Update .env with your actual Resend API key
```bash
# Open .env and replace:
RESEND_API_KEY=your_resend_api_key_here

# With your actual key from Resend dashboard:
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

### 2. Update the FROM email address
```bash
# If using Resend's test domain (default):
MAIL_FROM_ADDRESS="onboarding@resend.dev"

# If you've verified your own domain:
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
```

### 3. Clear config cache
```bash
php artisan config:clear
php artisan cache:clear
```

### 4. Test email sending

**Option A: Via Browser**
```
Visit: http://localhost:8000/test-email?email=your-email@example.com
```

**Option B: Via Artisan Tinker**
```bash
php artisan tinker

# Then run:
Mail::raw('Test from SafeSpace', function($m) {
    $m->to('your-email@example.com')->subject('Test');
});
```

**Option C: Via cURL**
```bash
curl "http://localhost:8000/test-email?email=your-email@example.com"
```

## Expected Results

### ✅ Success Response:
```json
{
  "success": true,
  "message": "Test email sent successfully to your-email@example.com"
}
```

### ❌ Error Response:
```json
{
  "success": false,
  "message": "Failed to send email",
  "error": "Error details here"
}
```

## Common Issues & Solutions

### Issue 1: "Invalid API key"
- Double-check your RESEND_API_KEY in .env
- Make sure there are no extra spaces
- Verify the key is active in Resend dashboard

### Issue 2: "Invalid from address"
- Use `onboarding@resend.dev` for testing
- Or verify your domain in Resend dashboard first

### Issue 3: "Config cached"
```bash
php artisan config:clear
php artisan config:cache
```

### Issue 4: Email not received
- Check spam folder
- Verify email address is correct
- Check Resend dashboard logs

## Verify in Resend Dashboard

1. Go to https://resend.com/emails
2. You should see your test email in the logs
3. Check delivery status

## Production Checklist

Before going to production:
- [ ] Verify your own domain in Resend
- [ ] Update MAIL_FROM_ADDRESS to your domain
- [ ] Set up SPF, DKIM, DMARC records
- [ ] Test all email templates
- [ ] Set up webhook for bounce handling (optional)
- [ ] Monitor sending limits

## Next Steps

Once testing is successful:
1. Remove or protect the test route in production
2. Test actual application emails (welcome, password reset, etc.)
3. Configure email templates in database
4. Set up email preferences for users

## Support

- Resend Docs: https://resend.com/docs
- SafeSpace Email Service: app/Services/EmailNotificationService.php
- Email Templates: database/seeders/EmailTemplateSeeder.php
