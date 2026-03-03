# Production Issue Analysis & Fix Guide

## Issues Identified

### 1. **404 Error on `/appointments` (Primary Issue)**
- **Symptom**: Child users get "Not Found" Inertia error when accessing appointments
- **Likely Cause**: Route cache is stale or not properly built on production
- **Impact**: Child users cannot access their appointments page

### 2. **401 Unauthorized on `/api/user/theme` (Secondary)**
- **Symptom**: Multiple 401 errors in console
- **Likely Cause**: 
  - Session/authentication issue
  - CORS misconfiguration
  - Sanctum token not being sent properly
- **Impact**: Theme preferences not loading, but not critical

### 3. **500 Internal Server Error on `/broadcasting/auth` (Secondary)**
- **Symptom**: WebSocket authentication failing
- **Likely Cause**:
  - Database connection issue during broadcast auth
  - Missing or misconfigured session
  - Role/permission check failing
- **Impact**: Real-time features may not work properly

### 4. **500 Internal Server Error on `/api/notifications/recent` (Secondary)**
- **Symptom**: Notifications API failing
- **Likely Cause**:
  - Database query error
  - Missing notifications table or migration
  - Relationship loading issue
- **Impact**: Notification dropdown won't load

### 5. **IndexedDB Errors (Minor)**
- **Symptom**: Browser storage errors
- **Likely Cause**: Browser cache/storage schema mismatch
- **Impact**: Local storage features may not work, but not critical

## Root Cause Analysis

The combination of errors suggests:
1. **Stale route cache** causing 404 on appointments
2. **Database or authentication issue** causing 401/500 errors
3. **Possible migration not run** on production

## Fix Steps

### Quick Fix (Run on Production Server)

```bash
# Option 1: Use the automated script
./production-quick-fix.sh

# Option 2: Manual steps
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan migrate --force
php artisan config:cache
php artisan route:cache

# Restart services
sudo systemctl restart nginx  # or apache2
php artisan reverb:restart
```

### Diagnostics (If Quick Fix Doesn't Work)

```bash
# Run diagnostics
./diagnose-production.sh

# Check specific issues
php artisan route:list --name=appointments.index
php artisan migrate:status
tail -f storage/logs/laravel.log
```

### Verify Child User Status

```bash
php artisan tinker
```

Then in tinker:
```php
$child = User::role('child')->first();
echo "Status: " . $child->status;  // Should be 'active'
echo "ID: " . $child->id;

// Test appointments query
$appointments = App\Models\Appointment::where('child_id', $child->id)->get();
echo "Appointments: " . $appointments->count();
```

## Code Review

### Routes Are Correct
- ✅ `/appointments` route exists in `routes/appointments.php`
- ✅ Route has proper middleware: `auth`, `active`
- ✅ No role restriction on appointments index (all authenticated users can access)

### Controller Is Correct
- ✅ `AppointmentController@index` handles all user roles
- ✅ Child users are handled: `elseif ($user->hasRole('child'))`
- ✅ Uses `ConnectionPermissionService::getAccessibleAppointments()`

### Permission Service Is Correct
- ✅ `getAccessibleAppointments()` has child logic
- ✅ Query: `$query->where('child_id', $user->id)`

## Potential Production-Specific Issues

### 1. Environment Configuration
Check `.env` on production:
```bash
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=pgsql  # or mysql
SESSION_DRIVER=database  # or redis
BROADCAST_DRIVER=reverb
```

### 2. Database Migrations
Ensure all migrations are run:
```bash
php artisan migrate:status
```

### 3. Permissions
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 4. Web Server Configuration
Ensure nginx/apache is properly configured to route all requests through `public/index.php`

## Testing After Fix

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Log in as child user**
3. **Navigate to `/appointments`**
4. **Check browser console** for errors
5. **Check Laravel logs**: `tail -f storage/logs/laravel.log`

## If Issues Persist

### Check Laravel Logs
```bash
tail -f storage/logs/laravel.log
```

### Check Web Server Logs
```bash
# Nginx
tail -f /var/log/nginx/error.log

# Apache
tail -f /var/log/apache2/error.log
```

### Check Database Connection
```bash
php artisan tinker --execute="DB::connection()->getPdo();"
```

### Verify Sanctum Configuration
Check `config/sanctum.php`:
- Ensure `stateful` domains include your production domain
- Verify `middleware` is correct

### Check CORS Configuration
Check `config/cors.php`:
- Ensure `paths` includes `api/*`
- Verify `supports_credentials` is `true`

## Prevention

Add to deployment script:
```bash
php artisan migrate --force
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan reverb:restart
```

## Summary

**Primary Issue**: Route cache causing 404 on appointments page
**Secondary Issues**: Authentication/database errors on API endpoints
**Solution**: Clear and rebuild caches, verify migrations, restart services
**Scripts Provided**: 
- `production-quick-fix.sh` - Automated fix
- `diagnose-production.sh` - Diagnostic tool
- `deploy-fix.sh` - Simple cache rebuild
