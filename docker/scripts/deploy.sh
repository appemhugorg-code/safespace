#!/bin/bash

# SafeSpace Production Deployment Script

set -e

echo "🚀 Starting SafeSpace production deployment..."

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production file not found!"
    echo "Please copy .env.production.example to .env.production and configure it."
    exit 1
fi

# Build and start services
echo "📦 Building Docker containers..."
docker compose down --remove-orphans

# Clean up any cached assets locally
echo "🧹 Cleaning up local build cache..."
rm -rf public/build/
rm -rf node_modules/.cache/

# Build assets on host machine to avoid memory issues in container
echo "🎨 Building frontend assets on host machine..."
if command -v npm >/dev/null 2>&1; then
    echo "Building assets locally..."
    NODE_OPTIONS="--max-old-space-size=4096" npm ci
    NODE_OPTIONS="--max-old-space-size=4096" npm run build
    echo "✅ Assets built successfully on host"
else
    echo "⚠️  npm not found on host, will build in container instead"
fi

docker compose build --no-cache

echo "🔧 Starting services..."
docker compose -f docker compose.yml -f docker compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Force rebuild frontend assets in production
echo "🎨 Rebuilding frontend assets in production..."
docker compose exec -e NODE_OPTIONS="--max-old-space-size=2048" safespace-app npm run build

# Check service health
echo "🔍 Checking service health..."
docker compose ps

# Check queue worker status
echo "📋 Checking queue worker status..."
docker compose exec safespace-app supervisorctl status laravel-queue-worker:*

# Check Reverb server status
echo "🔌 Checking Reverb server status..."
docker compose exec safespace-app supervisorctl status laravel-reverb

# Test database connection
echo "🗄️ Testing database connection..."
docker compose exec safespace-app php artisan tinker --execute="DB::connection()->getPdo(); echo 'Database connected successfully!';"

# Test Redis connection
echo "🔴 Testing Redis connection..."
docker compose exec safespace-app php artisan tinker --execute="use Illuminate\Support\Facades\Redis; Redis::ping(); echo 'Redis connected successfully!';"

# Test queue functionality
echo "📤 Testing queue functionality..."
docker compose exec safespace-app php artisan queue:work --once --timeout=10

echo "✅ SafeSpace deployment completed successfully!"
echo ""
echo "🌐 Application URL: http://localhost"
echo "🔌 WebSocket URL: ws://localhost:8080"
echo ""
echo "📊 To monitor services:"
echo "  docker compose logs -f safespace-app"
echo "  docker compose exec safespace-app supervisorctl status"
echo ""
echo "🔧 To restart services:"
echo "  docker compose restart safespace-app"
