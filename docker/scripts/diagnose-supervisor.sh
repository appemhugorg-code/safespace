#!/bin/bash

# SafeSpace Supervisor Diagnostic Script

echo "🔍 Diagnosing supervisord issues..."

echo ""
echo "📋 Checking if supervisord is running..."
if docker compose exec safespace-app pgrep supervisord > /dev/null; then
    echo "✅ supervisord process is running"
    docker compose exec safespace-app ps aux | grep supervisord
else
    echo "❌ supervisord process is NOT running"
fi

echo ""
echo "📁 Checking supervisor socket file..."
docker compose exec safespace-app ls -la /run/ | grep supervisor || echo "❌ No supervisor socket found in /run/"
docker compose exec safespace-app ls -la /var/run/ | grep supervisor || echo "❌ No supervisor socket found in /var/run/"

echo ""
echo "📄 Checking supervisor configuration..."
docker compose exec safespace-app cat /etc/supervisor/conf.d/supervisord.conf | head -10

echo ""
echo "📝 Checking supervisor logs..."
docker compose exec safespace-app ls -la /var/log/supervisor/ || echo "❌ No supervisor log directory"
if docker compose exec safespace-app test -f /var/log/supervisor/supervisord.log; then
    echo "📄 Supervisor log contents:"
    docker compose exec safespace-app tail -20 /var/log/supervisor/supervisord.log
else
    echo "❌ No supervisor log file found"
fi

echo ""
echo "🔧 Checking if supervisor is installed..."
docker compose exec safespace-app which supervisord || echo "❌ supervisord not found in PATH"
docker compose exec safespace-app supervisord --version || echo "❌ Cannot get supervisord version"

echo ""
echo "🐳 Checking container processes..."
docker compose exec safespace-app ps aux

echo ""
echo "📊 Container resource usage..."
docker stats --no-stream safespace-app

echo ""
echo "🔍 Diagnosis complete!"
