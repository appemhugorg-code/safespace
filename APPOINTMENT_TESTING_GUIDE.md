# 📅 Appointment Creation Testing Guide with Google Meet Integration

This guide walks you through testing the appointment scheduling feature with Google Meet link generation as a human user.

## Prerequisites ✅

- All services are running (Laravel server, Reverb, Vite)
- Database is seeded with test users
- Google OAuth is configured

---

## 🎯 Testing Scenarios

### Scenario 1: Guardian Creates Appointment for Child

#### Step 1: Login as Guardian
1. Navigate to `http://localhost:8000`
2. Click **Login**
3. Use credentials:
   - **Email**: `guardian@safespace.test`
   - **Password**: `password`
4. You should land on the Guardian Dashboard

#### Step 2: Connect Google Account (First Time Only)
1. Go to **Settings** or **Profile**
2. Look for **Google Calendar Integration** or **Connect Google Account**
3. Click **Connect to Google**
4. Authorize SafeSpace to access your Google Calendar
5. You should see confirmation that Google is connected

#### Step 3: Navigate to Appointment Creation
1. From the dashboard, click **Appointments** in the navigation menu
2. Click **Create New Appointment** or **Schedule Appointment** button
3. You should see the appointment creation form

#### Step 4: Fill Out Appointment Details
1. **Select Child**: Choose a child from the dropdown (should show children linked to your guardian account)
2. **Select Therapist**: Choose a therapist from the dropdown
3. **Select Date**: Click the date picker and choose a future date
4. **Select Time**: After selecting therapist and date, available time slots will load
   - Wait for slots to appear (you'll see a loading indicator)
   - Choose an available time slot from the dropdown
5. **Duration**: Select duration (default is 60 minutes)
6. **Notes** (optional): Add any notes about the appointment

#### Step 5: Submit the Appointment
1. Click **Create Appointment** or **Schedule** button
2. Wait for processing (button will show loading state)
3. On success, you should be redirected to:
   - Appointment details page, OR
   - Appointments list page

#### Step 6: Verify Google Meet Link
1. On the appointment details page, look for:
   - **Google Meet Link** section
   - A clickable link like `https://meet.google.com/xxx-xxxx-xxx`
2. Click the link to verify it opens Google Meet
3. Check your Google Calendar:
   - Open Google Calendar in a new tab
   - Find the appointment on the scheduled date/time
   - Verify the event has the Google Meet link attached

---

### Scenario 2: Therapist Creates Appointment

#### Step 1: Login as Therapist
1. Navigate to `http://localhost:8000`
2. Click **Login**
3. Use credentials:
   - **Email**: `therapist@safespace.test`
   - **Password**: `password`
4. You should land on the Therapist Dashboard

#### Step 2: Connect Google Account (First Time Only)
1. Go to **Settings** or **Profile**
2. Click **Connect to Google**
3. Authorize SafeSpace
4. Confirm connection

#### Step 3: Create Appointment via Connections
1. Navigate to **Connections** or **Clients**
2. Click on a child's profile
3. Click **Schedule Appointment** button
4. Fill out the form:
   - Child should be pre-selected
   - Select date
   - Select available time slot
   - Select duration
   - Add notes (optional)
5. Click **Create Appointment**

#### Step 4: Verify Appointment
1. Check appointment details page for Google Meet link
2. Verify in your Google Calendar
3. Check that all participants (child, guardian, therapist) can see the appointment

---

### Scenario 3: Create Appointment via Therapist Route

#### Step 1: Login as Therapist
1. Login with `therapist@safespace.test` / `password`

#### Step 2: Use Therapist-Specific Route
1. Navigate to **Therapist** → **Appointments** → **Create**
   - Or go directly to: `http://localhost:8000/therapist/appointments/create`
2. Fill out the form:
   - Select a child from your client list
   - Select date and time
   - Add duration and notes
3. Submit the form

#### Step 3: Verify Creation
1. Check for Google Meet link in appointment details
2. Verify calendar event was created

---

## 🔍 What to Verify

### On Appointment Details Page
- [ ] Appointment date and time are correct
- [ ] Child name is displayed
- [ ] Therapist name is displayed
- [ ] Guardian name is displayed (if applicable)
- [ ] Duration is correct
- [ ] Status shows "Pending" or "Scheduled"
- [ ] **Google Meet link is visible and clickable**
- [ ] Notes are displayed (if added)

### In Google Calendar
- [ ] Event appears on the correct date/time
- [ ] Event title includes "SafeSpace Appointment" or similar
- [ ] Event description includes participant details
- [ ] **Google Meet link is attached to the event**
- [ ] Event duration matches selected duration

### In SafeSpace Database
You can verify in the database (optional):
```bash
php artisan tinker
```
```php
$appointment = App\Models\Appointment::latest()->first();
$appointment->google_meet_link; // Should show the Meet link
$appointment->google_event_id; // Should show the Calendar event ID
```

---

## 🐛 Troubleshooting

### No Google Meet Link Generated
**Possible causes:**
1. Google account not connected
   - **Solution**: Go to Settings and connect Google account
2. Google OAuth credentials not configured
   - **Solution**: Check `.env` for `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
3. Insufficient Google API permissions
   - **Solution**: Re-authorize with full Calendar permissions

### Available Time Slots Not Loading
**Possible causes:**
1. Therapist hasn't set availability
   - **Solution**: Login as therapist and set availability first
2. API endpoint not responding
   - **Solution**: Check browser console for errors
3. Selected date is in the past
   - **Solution**: Choose a future date

### Appointment Creation Fails
**Check for:**
1. Validation errors displayed on the form
2. Browser console errors
3. Laravel logs: `tail -f storage/logs/laravel.log`
4. Network tab in browser DevTools

### Google Calendar Event Not Created
**Possible causes:**
1. Google API quota exceeded
   - **Solution**: Wait and try again later
2. Invalid OAuth token
   - **Solution**: Disconnect and reconnect Google account
3. Calendar API not enabled in Google Cloud Console
   - **Solution**: Enable Google Calendar API in GCP

---

## 📊 Test Data Reference

### Default Test Users
| Role | Email | Password |
|------|-------|----------|
| Guardian | guardian@safespace.test | password |
| Therapist | therapist@safespace.test | password |
| Child | child@safespace.test | password |
| Admin | admin@safespace.test | password |

### Test Appointment Data
- **Duration options**: 30, 45, 60, 90 minutes
- **Time slots**: Based on therapist availability (typically 9 AM - 5 PM)
- **Minimum advance booking**: Usually same day or next day

---

## ✅ Success Criteria

An appointment is successfully created with Google Meet when:

1. ✅ Appointment appears in SafeSpace appointments list
2. ✅ Google Meet link is generated and visible
3. ✅ Event appears in Google Calendar with Meet link
4. ✅ All participants can access the appointment details
5. ✅ Clicking the Meet link opens Google Meet
6. ✅ No errors in browser console or Laravel logs

---

## 🎉 Next Steps After Successful Test

Once you've verified appointments work correctly:

1. **Test as different roles**: Try creating appointments as guardian, therapist, and admin
2. **Test edge cases**: 
   - Create back-to-back appointments
   - Create appointments at boundary times (start/end of availability)
   - Try creating conflicting appointments
3. **Test appointment actions**:
   - Confirm appointment
   - Cancel appointment
   - Complete appointment (therapist only)
4. **Test notifications**: Verify all participants receive notifications
5. **Test calendar sync**: Make changes in Google Calendar and verify they reflect in SafeSpace

---

## 📝 Notes

- Google Meet links are generated automatically when an appointment is created
- The link is stored in the `google_meet_link` field of the appointments table
- The Google Calendar event ID is stored in `google_event_id` field
- Only users with connected Google accounts can generate Meet links
- If a user doesn't have Google connected, appointments are still created but without Meet links

---

**Happy Testing! 🚀**

If you encounter any issues, check the Laravel logs and browser console for detailed error messages.
