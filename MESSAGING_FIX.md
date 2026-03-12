# Real-Time Messaging Fix - SafeSpace

## Problem
After sending 3 back-to-back messages, the real-time chat breaks. The UI shows messages as sent, but the recipient doesn't receive them. This happens in both local and production environments.

## Root Cause
The issue was in the broadcast event configuration. Both `MessageSent` and `GroupMessageSent` events had:

```php
public $connection = 'sync';
```

This setting causes broadcasts to be processed **synchronously** (blocking), which means:
1. Each broadcast blocks until complete
2. After 3 rapid messages, connections timeout or hit rate limits
3. The Reverb WebSocket server's `activity_timeout` (30 seconds) combined with blocking broadcasts causes failures
4. No queuing means no retry mechanism for failed broadcasts

## Solution Applied

### 1. Removed Sync Connection from Events
**Files Modified:**
- `app/Events/MessageSent.php`
- `app/Events/GroupMessageSent.php`

**Change:**
```php
// BEFORE (causes blocking)
public $connection = 'sync';

// AFTER (uses queue - non-blocking)
// public $connection = 'sync'; // Removed - causes issues with rapid successive messages
```

By removing the `$connection` property, Laravel will use the default queue connection (`database` as configured in `.env`).

### 2. Benefits of Queue-Based Broadcasting
- **Non-blocking**: Messages are queued and processed asynchronously
- **Retry mechanism**: Failed broadcasts can be retried automatically
- **Better performance**: No blocking on rapid successive messages
- **Scalability**: Can handle high message volumes

## How to Apply the Fix

### Step 1: Ensure Queue Worker is Running
The queue worker processes broadcast jobs. You need to keep it running:

```bash
# Start queue worker
php artisan queue:work

# Or run in background (production)
php artisan queue:work --daemon &

# Or use supervisor (recommended for production)
```

### Step 2: Ensure Reverb Server is Running
```bash
php artisan reverb:start
```

### Step 3: Test the Fix
```bash
# Run the test script
./test-messaging.sh

# Or manually test:
# 1. Open two browser windows
# 2. Login as different users
# 3. Send 5+ messages rapidly
# 4. All messages should be delivered in real-time
```

## Monitoring

### Check Queue Status
```bash
# Monitor queue jobs
php artisan queue:monitor database

# Check failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all
```

### Check Logs
```bash
# Watch Laravel logs
tail -f storage/logs/laravel.log

# Check for broadcast errors
grep "broadcast" storage/logs/laravel.log
```

### Check Database
```bash
# Check pending jobs
php artisan tinker
>>> DB::table('jobs')->count()

# Check recent messages
>>> \App\Models\Message::latest()->take(5)->get(['id', 'sender_id', 'created_at'])
```

## Production Deployment

### 1. Update Code
Deploy the updated event files to production.

### 2. Restart Services
```bash
# Restart queue workers
php artisan queue:restart

# Restart Reverb (if needed)
# Kill existing process and restart
pkill -f "artisan reverb:start"
php artisan reverb:start &
```

### 3. Use Supervisor (Recommended)
Create supervisor configuration for queue worker:

```ini
[program:safespace-queue-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/safespace/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/path/to/safespace/storage/logs/queue-worker.log
stopwaitsecs=3600
```

### 4. Monitor in Production
- Set up queue monitoring (Laravel Horizon or custom dashboard)
- Monitor Reverb connections and message throughput
- Set up alerts for failed jobs

## Configuration Reference

### Queue Configuration (.env)
```env
QUEUE_CONNECTION=database
```

### Reverb Configuration (.env)
```env
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=780585
REVERB_APP_KEY=qlvszkner36ovfjsszyy
REVERB_APP_SECRET=t1kfulueex7qyiwbj8x2
REVERB_HOST=0.0.0.0
REVERB_PORT=8080
REVERB_SCHEME=http
REVERB_APP_ACTIVITY_TIMEOUT=30
REVERB_APP_MAX_CONNECTIONS=1000
```

## Troubleshooting

### Messages Still Not Delivering After 3 Messages
1. Check if queue worker is running: `pgrep -f "artisan queue:work"`
2. Check if Reverb is running: `pgrep -f "artisan reverb:start"`
3. Check for failed jobs: `php artisan queue:failed`
4. Check logs: `tail -f storage/logs/laravel.log`

### Queue Worker Not Processing Jobs
1. Restart queue worker: `php artisan queue:restart`
2. Check database connection
3. Check jobs table exists: `php artisan migrate`

### Reverb Connection Issues
1. Check Reverb is listening: `netstat -tulpn | grep 8080`
2. Check firewall rules
3. Verify REVERB_HOST and REVERB_PORT in .env
4. Check browser console for WebSocket errors

### High Latency
1. Consider using Redis instead of database for queue
2. Increase number of queue workers
3. Optimize Reverb configuration (increase max_connections)

## Alternative Solutions (If Issues Persist)

### Option 1: Use Redis for Queue
```env
QUEUE_CONNECTION=redis
```

Benefits:
- Faster than database queue
- Better for high-volume messaging
- Built-in pub/sub for real-time features

### Option 2: Implement Rate Limiting
Add rate limiting to prevent rapid message spam:

```php
// In MessageController
use Illuminate\Support\Facades\RateLimiter;

public function store(Request $request)
{
    $key = 'send-message:' . $request->user()->id;
    
    if (RateLimiter::tooManyAttempts($key, 10)) {
        return response()->json([
            'message' => 'Too many messages. Please wait a moment.'
        ], 429);
    }
    
    RateLimiter::hit($key, 60); // 10 messages per minute
    
    // ... rest of the code
}
```

### Option 3: Implement Message Batching
For very high-volume scenarios, batch messages before broadcasting.

## Testing Checklist

- [ ] Queue worker is running
- [ ] Reverb server is running
- [ ] Can send 1 message successfully
- [ ] Can send 3 messages rapidly (all delivered)
- [ ] Can send 5+ messages rapidly (all delivered)
- [ ] Messages appear in real-time for recipient
- [ ] No errors in Laravel logs
- [ ] No failed jobs in queue
- [ ] Works in both direct and group chats

## Summary

The fix removes synchronous broadcasting which was causing blocking and timeouts after 3 rapid messages. By using the queue system, broadcasts are now asynchronous, non-blocking, and have built-in retry mechanisms. This ensures reliable real-time message delivery regardless of message frequency.
