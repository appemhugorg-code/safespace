#!/bin/bash

# SafeSpace Real-time Messaging Monitor

echo "🔍 SafeSpace Real-time Messaging Status"
echo "======================================"

# Check if container is running
if ! docker compose ps safespace-app | grep -q "Up"; then
    echo "❌ SafeSpace container is not running!"
    exit 1
fi

echo "✅ SafeSpace container is running"

# Check Supervisor status
echo ""
echo "📋 Supervisor Process Status:"
docker compose exec safespace-app supervisorctl status

# Check Queue Worker specifically
echo ""
echo "📤 Queue Worker Status:"
QUEUE_STATUS=$(docker compose exec safespace-app supervisorctl status laravel-queue-worker:* | grep -c "RUNNING" || echo "0")
echo "Running queue workers: $QUEUE_STATUS/2"

if [ "$QUEUE_STATUS" -eq "0" ]; then
    echo "❌ No queue workers running! Real-time messaging will not work."
    echo "🔧 To restart: docker compose exec safespace-app supervisorctl restart laravel-queue-worker:*"
else
    echo "✅ Queue workers are running"
fi

# Check Reverb Server
echo ""
echo "🔌 Reverb WebSocket Server Status:"
REVERB_STATUS=$(docker compose exec safespace-app supervisorctl status laravel-reverb | grep -c "RUNNING" || echo "0")

if [ "$REVERB_STATUS" -eq "0" ]; then
    echo "❌ Reverb server is not running! Real-time messaging will not work."
    echo "🔧 To restart: docker compose exec safespace-app supervisorctl restart laravel-reverb"
else
    echo "✅ Reverb server is running"
fi

# Test WebSocket connection
echo ""
echo "🌐 Testing WebSocket Connection:"
if curl -s --max-time 5 http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ WebSocket port 8080 is accessible"
else
    echo "❌ WebSocket port 8080 is not accessible"
fi

# Check recent queue jobs
echo ""
echo "📊 Recent Queue Activity:"
docker compose exec safespace-app php artisan queue:monitor --once 2>/dev/null || echo "No recent queue activity"

# Check Redis connection
echo ""
echo "🔴 Redis Connection:"
if docker compose exec safespace-app php artisan tinker --execute="use Illuminate\Support\Facades\Redis; Redis::ping(); echo 'Connected';" 2>/dev/null | grep -q "Connected"; then
    echo "✅ Redis is connected"
else
    echo "❌ Redis connection failed"
fi

echo ""
echo "🔧 Useful Commands:"
echo "  Restart queue workers: docker compose exec safespace-app supervisorctl restart laravel-queue-worker:*"
echo "  Restart Reverb server: docker compose exec safespace-app supervisorctl restart laravel-reverb"
echo "  View logs: docker compose logs -f safespace-app"
echo "  Monitor queue: docker compose exec safespace-app php artisan queue:monitor"
