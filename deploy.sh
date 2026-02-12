#!/bin/bash

# SafeSpace HTTP-Only Production Deployment Script

set -e

# --- Configuration ---
DOMAIN="app.emhug.org"
EMAIL="app.emhug.org@gmail.com"

echo "🚀 Starting SafeSpace HTTP production deployment..."

echo "🔐 Checking SSL Certificate for $DOMAIN..."

WEBROOT_DIR="./certbot/www"
CERT_DIR="./certbot/conf/live/$DOMAIN"

mkdir -p "$WEBROOT_DIR"

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

# Check if the real certificate already exists on the host disk
if [ ! -f "$CERT_DIR/fullchain.pem" ]; then
    echo "📜 Certificate not found. Requesting from Let's Encrypt..."
    
    # Run the request (Nginx MUST be running on Port 80 for this to work)
    docker compose run --rm certbot certonly --webroot \
        --webroot-path=/var/www/certbot \
        -d "$DOMAIN" --email "$EMAIL" \
        --agree-tos --no-eff-email --non-interactive
    
    echo "✅ SSL Certificate obtained! You can now enable SSL in nginx.conf."
else
    echo "✅ SSL Certificate already exists. Checking for renewal..."
    docker compose run --rm certbot renew
fi
# --- END SSL LOGIC ---


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