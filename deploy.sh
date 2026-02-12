#!/bin/bash

# SafeSpace HTTP-Only Production Deployment Script

set -e

# --- Configuration ---
DOMAIN="app.emhug.org"
EMAIL="app.emhug.org@gmail.com"
CERT_DIR="./certbot/conf/live/$DOMAIN"
WEBROOT_DIR="./certbot/www"

echo "🚀 Starting SafeSpace HTTP production deployment..."

# 1. PRE-FLIGHT: Ensure directories and SSL exist
echo "📂 Preparing SSL directories..."
mkdir -p "$CERT_DIR"
mkdir -p "$WEBROOT_DIR"

if [ ! -f "$CERT_DIR/fullchain.pem" ]; then
    echo "📜 SSL Certificate missing. Creating dummy cert for initial Nginx boot..."
    
    # Create a 1-day dummy certificate so Nginx doesn't crash if SSL config is active
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout "$CERT_DIR/privkey.pem" \
        -out "$CERT_DIR/fullchain.pem" \
        -subj "/CN=localhost"
    DUMMY_ACTIVE=true
else
    echo "✅ SSL Certificate found."
    DUMMY_ACTIVE=false
fi

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

# --- ADD SSL LOGIC START, SSL UPGRADE (Only if dummy was used)
if [ "$DUMMY_ACTIVE" = true ]; then
    echo "🌐 Upgrading dummy certificate to real Let's Encrypt cert..."
    
    # Run certbot via docker using the shared webroot
    docker compose run --rm certbot certonly --webroot \
        --webroot-path=/var/www/certbot \
        -d "$DOMAIN" --email "$EMAIL" \
        --agree-tos --no-eff-email --non-interactive

    echo "🔄 Real certificate obtained. Reloading Nginx..."
    docker compose exec -T nginx nginx -s reload
fi
# --- ADD SSL LOGIC END ---

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