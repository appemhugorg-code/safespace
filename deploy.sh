#!/bin/bash

# SafeSpace HTTP-Only Production Deployment Script

set -e

echo "🚀 Starting SafeSpace HTTP production deployment..."

# Stop existing containers
echo "📦 Stopping existing containers..."
docker compose down

# Remove old application image to force rebuild
echo "🔄 Removing old application image..."
docker rmi safe-space-app-safespace-app:latest 2>/dev/null || echo "No existing image to remove"

# Build and start containers (HTTP only)
echo "🏗️  Building and starting containers..."
docker compose -f docker-compose.yml up -d --build

# Wait for services to be ready
echo "⏳ Waiting for entrypoint.sh to finish (DB/Redis/Discovery)..."
until docker compose exec -T safespace-app test -f /tmp/app-ready; do
    echo "Setup still in progress... (checking again in 5s)"
    sleep 5
done

# Run database migrations
echo "🗄️  Running database migrations..."
docker compose exec -T safespace-app php artisan migrate --force

# Optimize Laravel
echo "⚡ Optimizing Laravel application..."
docker compose exec -T safespace-app php artisan config:cache
docker compose exec -T safespace-app php artisan route:cache
docker compose exec -T safespace-app php artisan view:cache

# Check container status
echo "📊 Container status:"
docker compose ps

# Test HTTP access
echo "🧪 Testing HTTP access..."
sleep 5
if curl -s -I http://app.emhug.org | grep -q "200\|403"; then
    echo "✅ HTTP access working!"
else
    echo "⚠️  HTTP access test inconclusive"
fi

# Show application logs
echo "📋 Application startup logs:"
docker compose logs --tail=20 safespace-app

echo ""
echo "✅ HTTP Deployment completed!"
echo "🌐 Application should be available at: http://app.emhug.org"
echo ""
echo "📋 Useful commands:"
echo "  Monitor logs: docker compose logs -f"
echo "  Check status: docker compose ps"
echo "  Clear caches: docker compose exec safespace-app php artisan optimize:clear"
echo "  Restart nginx: docker compose restart nginx"
echo ""
echo "🔒 To add SSL later, run: ./deploy-ssl.sh"