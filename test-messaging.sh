#!/bin/bash

echo "🔧 SafeSpace Messaging Fix - Testing Script"
echo "============================================"
echo ""

# Check if queue worker is running
echo "1. Checking queue worker status..."
if pgrep -f "artisan queue:work" > /dev/null; then
    echo "   ✅ Queue worker is running"
else
    echo "   ❌ Queue worker is NOT running"
    echo "   Starting queue worker..."
    php artisan queue:work --daemon &
    sleep 2
    echo "   ✅ Queue worker started"
fi

echo ""

# Check if Reverb is running
echo "2. Checking Reverb server status..."
if pgrep -f "artisan reverb:start" > /dev/null; then
    echo "   ✅ Reverb server is running"
else
    echo "   ❌ Reverb server is NOT running"
    echo "   Please start Reverb in another terminal: php artisan reverb:start"
fi

echo ""

# Check queue jobs
echo "3. Checking pending queue jobs..."
PENDING_JOBS=$(php artisan queue:monitor database --max=1 2>&1 | grep -o '[0-9]* jobs' | grep -o '[0-9]*' || echo "0")
echo "   Pending jobs: $PENDING_JOBS"

echo ""

# Check database for recent messages
echo "4. Checking recent messages in database..."
php artisan tinker --execute="echo 'Last 5 messages: '; \App\Models\Message::latest()->take(5)->get(['id', 'sender_id', 'recipient_id', 'created_at'])->each(function(\$m) { echo \"ID: {\$m->id}, From: {\$m->sender_id}, To: {\$m->recipient_id}, At: {\$m->created_at}\n\"; });"

echo ""
echo "============================================"
echo "✅ Fix Applied:"
echo "   - Removed 'sync' connection from MessageSent event"
echo "   - Removed 'sync' connection from GroupMessageSent event"
echo "   - Broadcasts now use queue (database driver)"
echo ""
echo "📝 To test:"
echo "   1. Make sure queue worker is running: php artisan queue:work"
echo "   2. Make sure Reverb is running: php artisan reverb:start"
echo "   3. Send 5+ messages rapidly in the chat"
echo "   4. All messages should be delivered in real-time"
echo ""
echo "🔍 Monitor queue jobs: php artisan queue:monitor database"
echo "🔍 Check logs: tail -f storage/logs/laravel.log"
