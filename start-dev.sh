#!/bin/bash

# SafeSpace Development Server Startup Script
# This script starts all required services for real-time messaging

echo "🚀 Starting SafeSpace Development Environment"
echo "=============================================="
echo ""

# Function to check if a process is running
check_process() {
    if pgrep -f "$1" > /dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to kill process gracefully
kill_process() {
    pkill -f "$1" 2>/dev/null
    sleep 1
}

# Clean up function
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill_process "artisan serve"
    kill_process "artisan queue:work"
    kill_process "artisan reverb:start"
    kill_process "vite"
    echo "✅ All services stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

# Kill any existing processes
echo "1. Cleaning up existing processes..."
kill_process "artisan serve"
kill_process "artisan queue:work"
kill_process "artisan reverb:start"
echo "   ✅ Cleanup complete"
echo ""

# Start Laravel server
echo "2. Starting Laravel server..."
php artisan serve > storage/logs/server.log 2>&1 &
sleep 2
if check_process "artisan serve"; then
    echo "   ✅ Laravel server started at http://localhost:8000"
else
    echo "   ❌ Failed to start Laravel server"
    exit 1
fi
echo ""

# Start Reverb server
echo "3. Starting Reverb WebSocket server..."
php artisan reverb:start > storage/logs/reverb.log 2>&1 &
sleep 2
if check_process "artisan reverb:start"; then
    echo "   ✅ Reverb server started at ws://localhost:8080"
else
    echo "   ❌ Failed to start Reverb server"
    cleanup
    exit 1
fi
echo ""

# Start Queue worker
echo "4. Starting Queue worker..."
php artisan queue:work --tries=3 --timeout=90 > storage/logs/queue.log 2>&1 &
sleep 2
if check_process "artisan queue:work"; then
    echo "   ✅ Queue worker started"
else
    echo "   ❌ Failed to start Queue worker"
    cleanup
    exit 1
fi
echo ""

# Start Vite (optional)
echo "5. Starting Vite dev server (optional)..."
if command -v npm &> /dev/null; then
    npm run dev > storage/logs/vite.log 2>&1 &
    sleep 3
    if check_process "vite"; then
        echo "   ✅ Vite dev server started at http://localhost:5173"
    else
        echo "   ⚠️  Vite dev server not started (optional)"
    fi
else
    echo "   ⚠️  npm not found, skipping Vite"
fi
echo ""

echo "=============================================="
echo "✅ All services started successfully!"
echo ""
echo "📝 Access Points:"
echo "   - Application: http://localhost:8000"
echo "   - WebSocket: ws://localhost:8080"
echo "   - Vite HMR: http://localhost:5173"
echo ""
echo "📊 Logs:"
echo "   - Server: storage/logs/server.log"
echo "   - Reverb: storage/logs/reverb.log"
echo "   - Queue: storage/logs/queue.log"
echo "   - Vite: storage/logs/vite.log"
echo "   - Laravel: storage/logs/laravel.log"
echo ""
echo "🔍 Monitor logs:"
echo "   tail -f storage/logs/laravel.log"
echo "   tail -f storage/logs/queue.log"
echo ""
echo "🧪 Test messaging:"
echo "   1. Open http://localhost:8000 in two browsers"
echo "   2. Login as different users"
echo "   3. Send multiple messages rapidly"
echo ""
echo "Press Ctrl+C to stop all services"
echo "=============================================="
echo ""

# Keep script running
while true; do
    sleep 1
    
    # Check if services are still running
    if ! check_process "artisan serve"; then
        echo "❌ Laravel server stopped unexpectedly"
        cleanup
    fi
    
    if ! check_process "artisan reverb:start"; then
        echo "❌ Reverb server stopped unexpectedly"
        cleanup
    fi
    
    if ! check_process "artisan queue:work"; then
        echo "❌ Queue worker stopped unexpectedly"
        cleanup
    fi
done
