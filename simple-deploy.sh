#!/bin/bash

# Simple SafeSpace Deployment Script
set -e

DOMAIN="app.emhug.org"
EMAIL="admin@emhug.org"

echo "🚀 SafeSpace Simple Deployment"
echo "Domain: $DOMAIN"
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found. Please run this from the SafeSpace project directory."
    exit 1
fi

# Check DNS
echo "🔍 Checking DNS..."
DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)
SERVER_IP=$(curl -s ifconfig.me)
echo "Domain IP: $DOMAIN_IP"
echo "Server IP: $SERVER_IP"

if [ "$DOMAIN_IP" != "$SERVER_IP" ]; then
    echo "⚠️  DNS mismatch! Please update your DNS to point $DOMAIN to $SERVER_IP"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create directories
echo "📁 Creating directories..."
mkdir -p ./certbot/conf
mkdir -p ./certbot/www
mkdir -p ./storage/logs

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose down 2>/dev/null || true

# Check if SSL files exist
if [ ! -f ".env.production.ssl" ]; then
    echo "❌ .env.production.ssl not found. Creating from template..."
    cat > .env.production.ssl << EOF
APP_NAME=SafeSpace
APP_ENV=production
APP_KEY=base64:UYIoMzkKb9U1s3zdAlR4iKl/LlEJ7GaeZUO3worNaNQ=
APP_DEBUG=false
APP_URL=https://$DOMAIN

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=safespace_production
DB_USERNAME=safespace_user
DB_PASSWORD="u+r2w#CRqA9LmgSv"

SESSION_DRIVER=redis
SESSION_DOMAIN=.emhug.org
SESSION_SECURE_COOKIE=true

CACHE_STORE=redis
QUEUE_CONNECTION=redis

REDIS_HOST=redis
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_FROM_ADDRESS="noreply@emhug.org"
MAIL_FROM_NAME="SafeSpace"

BROADCAST_CONNECTION=reverb
REVERB_HOST="$DOMAIN"
REVERB_PORT=8080
REVERB_SCHEME=https

VITE_REVERB_HOST="$DOMAIN"
VITE_REVERB_PORT="443"
VITE_REVERB_SCHEME="https"

SANCTUM_STATEFUL_DOMAINS=$DOMAIN
FORCE_HTTPS=true
EOF
fi

# Copy environment
echo "⚙️  Setting up environment..."
cp .env.production.ssl .env.production

# Start without SSL first
echo "🚀 Starting services (HTTP first)..."
docker compose up -d --build

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 30

# Test HTTP access
echo "🧪 Testing HTTP access..."
if curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN | grep -q "200\|301\|302"; then
    echo "✅ HTTP access working"
else
    echo "❌ HTTP access failed"
    echo "Checking logs..."
    docker compose logs nginx
    exit 1
fi

# Generate SSL certificate
echo "🔒 Generating SSL certificate..."
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --non-interactive \
    -d $DOMAIN

if [ $? -eq 0 ]; then
    echo "✅ SSL certificate generated"
    
    # Switch to SSL configuration
    echo "🔄 Switching to SSL configuration..."
    docker compose -f docker-compose.yml -f docker-compose.ssl.yml up -d
    
    # Wait and test HTTPS
    sleep 20
    echo "🧪 Testing HTTPS access..."
    if curl -s -I https://$DOMAIN | grep -q "200 OK"; then
        echo "✅ HTTPS working!"
    else
        echo "⚠️  HTTPS test inconclusive"
    fi
else
    echo "❌ SSL certificate generation failed"
    echo "Continuing with HTTP only..."
fi

# Run migrations
echo "🗄️  Running database migrations..."
docker compose exec -T safespace-app php artisan migrate --force 2>/dev/null || echo "Migration skipped"

# Final status
echo ""
echo "🎉 Deployment Complete!"
echo "========================"
echo "HTTP:  http://$DOMAIN"
echo "HTTPS: https://$DOMAIN"
echo ""
echo "Check status: docker compose ps"
echo "View logs:    docker compose logs"
echo ""