# Google OAuth Setup for app.emhug.org

## 🔧 Configuration Updated

Your redirect URI is now set to: `https://app.emhug.org/auth/google/callback`

## 📋 Google Cloud Console Setup

### Step 1: Go to Google Cloud Console
https://console.cloud.google.com/

### Step 2: Create/Select Project
- Create new project: "SafeSpace" (or select existing)

### Step 3: Enable Google Calendar API
1. Go to "APIs & Services" → "Library"
2. Search "Google Calendar API"
3. Click "Enable"

### Step 4: Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. User Type: **External**
3. Fill in:
   - App name: **SafeSpace**
   - User support email: **app.emhug.org@gmail.com**
   - App domain: **app.emhug.org**
   - Authorized domains: **emhug.org**
   - Developer contact: **app.emhug.org@gmail.com**
4. Scopes: Add `calendar.events` scope
5. Test users: Add **app.emhug.org@gmail.com**
6. Save

### Step 5: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Application type: **Web application**
4. Name: **SafeSpace Production**
5. Authorized JavaScript origins:
   ```
   https://app.emhug.org
   ```
6. Authorized redirect URIs:
   ```
   https://app.emhug.org/auth/google/callback
   ```
7. Click "Create"
8. **Copy Client ID and Client Secret**

### Step 6: Update .env
Replace the empty values in your `.env`:

```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_client_secret_here
GOOGLE_REDIRECT_URI=https://app.emhug.org/auth/google/callback
```

### Step 7: Clear Cache
```bash
php artisan config:clear
php artisan cache:clear
```

## 🧪 Testing

1. Deploy to app.emhug.org
2. Login as therapist
3. Visit: `https://app.emhug.org/auth/google`
4. Authorize SafeSpace
5. Create appointment with Google Meet link

## ⚠️ Important Notes

- **HTTPS Required**: Google OAuth requires HTTPS in production
- **Domain Verification**: Add `emhug.org` to authorized domains
- **Test Users**: Add test emails in OAuth consent screen (if in testing mode)
- **Publishing**: Submit for verification if you need public access

## 🔐 Security Checklist

- [x] Redirect URI uses HTTPS
- [x] Domain matches production URL
- [ ] SSL certificate valid on app.emhug.org
- [ ] OAuth consent screen configured
- [ ] Test users added (if in testing mode)

## 📝 Quick Reference

**OAuth Endpoints:**
- Start: `https://app.emhug.org/auth/google`
- Callback: `https://app.emhug.org/auth/google/callback`
- Disconnect: `POST https://app.emhug.org/auth/google/disconnect`

**Required Scopes:**
- `https://www.googleapis.com/auth/calendar.events`

**Authorized Domain:**
- `emhug.org`

---

**Next**: Get your credentials from Google Cloud Console and add to `.env`
