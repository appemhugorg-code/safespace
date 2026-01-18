#!/bin/bash

# SafeSpace Production Deployment Script

set -e

echo "🚀 Starting SafeSpace production deployment..."

# Stop existing containers
echo "📦 Stopping existing containers..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml down

# Remove old application image to force rebuild
echo "🔄 Removing old application image..."
docker rmi safespace_safespace-app:latest 2>/dev/null || echo "No existing image to remove"

# Build and start containers
echo "🏗️  Building and starting containers..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Run fresh migrations (CAUTION: This will drop all data!)
# echo "�️  Rtunning fresh migrations..."
# docker compose -f docker-compose.yml -f docker-compose.prod.yml exec -T safespace-app php artisan migrate:fresh --force --seed

# Check container status
echo "�  Container status:"
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps

# Show application logs
echo "📋 Application startup logs:"
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs --tail=50 safespace-app

echo "✅ Deployment completed!"
echo "🌐 Application should be available at: http://155.138.228.28"
echo ""
echo "📋 Useful commands:"
echo "  Monitor logs: docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f"
echo "  Check status: docker compose -f docker-compose.yml -f docker-compose.prod.yml ps"
echo "  Clear caches: docker compose -f docker-compose.yml -f docker-compose.prod.yml exec safespace-app php artisan optimize:clear"