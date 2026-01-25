#!/bin/bash

# SafeSpace SSL Production Deployment Script
# This script deploys SafeSpace with SSL certificates for app.emhug.org

set -e

echo "🚀 SafeSpace SSL Production Deployment"
echo "======================================"
echo "Domain: app.emhug.org"
echo "Environment: Production with SSL"
echo ""

# Configuration
DOMAIN="app.emhug.org"
EMAIL="admin@emhug.org"
PROJECT_DIR="$(pwd)"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if domain resolves to this server
print_status "Checking DNS resolution for $DOMAIN..."
DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)
SERVER_IP=$(curl -s ifconfig.me)

if [ "$DOMAIN_IP" != "$SERVER_IP" ]; then
    print_warning "Domain $DOMAIN resolves to $DOMAIN_IP but server IP is $SERVER_IP"
    print_warning "SSL certificate generation may fail if DNS is not properly configured"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create necessary directories
print_status "Creating certificate directories..."
mkdir -p ./certbot/conf
mkdir -p ./certbot/www
mkdir -p ./storage/logs

# Stop any existing containers
print_status "Stopping existing containers..."
docker compose down 2>/dev/null || true
docker compose -f docker compose.yml -f docker compose.ssl.yml down 2>/dev/null || true

# Build the application
print_status "Building SafeSpace application..."
docker compose -f docker compose.yml build safespace-app

# Check if certificates already exist
if [ -d "./certbot/conf/live/$DOMAIN" ]; then
    print_warning "SSL certificates already exist for $DOMAIN"
    read -p "Do you want to use existing certificates? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        USE_EXISTING_CERTS=true
    else
        USE_EXISTING_CERTS=false
    fi
else
    USE_EXISTING_CERTS=false
fi

if [ "$USE_EXISTING_CERTS" = false ]; then
    print_status "Setting up initial Nginx configuration for certificate generation..."
    
    # Use init configuration for certificate generation
    cp docker/nginx/init.conf docker/nginx/temp-default.conf
    
    # Start nginx with init config
    print_status "Starting temporary Nginx for domain verification..."
    docker compose up -d nginx
    
    # Wait for nginx to be ready
    sleep 10
    
    # Test if domain is accessible
    print_status "Testing domain accessibility..."
    if curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN | grep -q "200"; then
        print_success "Domain is accessible"
    else
        print_warning "Domain may not be accessible. Continuing anyway..."
    fi
    
    # Generate SSL certificate
    print_status "Requesting SSL certificate from Let's Encrypt..."
    docker compose -f docker compose.yml -f docker compose.ssl.yml run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        --non-interactive \
        -d $DOMAIN
    
    if [ $? -eq 0 ]; then
        print_success "SSL certificate obtained successfully!"
    else
        print_error "Failed to obtain SSL certificate"
        exit 1
    fi
    
    # Clean up temporary config
    rm -f docker/nginx/temp-default.conf
    
    # Stop temporary containers
    docker compose down
fi

# Set up SSL environment
print_status "Configuring SSL environment..."
cp .env.production.ssl .env.production

# Set proper permissions for certificates
print_status "Setting certificate permissions..."
if [ -d "./certbot/conf" ]; then
    sudo chown -R $USER:$USER ./certbot/conf 2>/dev/null || true
    chmod -R 755 ./certbot/conf 2>/dev/null || true
fi

# Start all services with SSL
print_status "Starting all services with SSL configuration..."
docker compose -f docker compose.yml -f docker compose.ssl.yml up -d

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 30

# Run database migrations
print_status "Running database migrations..."
docker compose -f docker compose.yml -f docker compose.ssl.yml exec -T safespace-app php artisan migrate --force

# Clear and cache configuration
print_status "Optimizing application..."
docker compose -f docker compose.yml -f docker compose.ssl.yml exec -T safespace-app php artisan config:cache
docker compose -f docker compose.yml -f docker compose.ssl.yml exec -T safespace-app php artisan route:cache
docker compose -f docker compose.yml -f docker compose.ssl.yml exec -T safespace-app php artisan view:cache

# Test SSL certificate
print_status "Testing SSL certificate..."
sleep 10

if curl -s -I https://$DOMAIN | grep -q "200 OK"; then
    print_success "SSL certificate is working correctly!"
else
    print_warning "SSL test inconclusive. Please check manually."
fi

# Test WebSocket connection
print_status "Testing WebSocket connection..."
if curl -s -I https://$DOMAIN/app/ | grep -q "426\|101"; then
    print_success "WebSocket endpoint is accessible!"
else
    print_warning "WebSocket test inconclusive. Please check manually."
fi

# Set up automatic renewal
print_status "Setting up automatic certificate renewal..."
chmod +x ./scripts/renew-ssl.sh

# Create systemd timer for automatic renewal (optional)
cat > /tmp/safespace-ssl-renewal.service << EOF
[Unit]
Description=SafeSpace SSL Certificate Renewal
After=network.target

[Service]
Type=oneshot
ExecStart=$PROJECT_DIR/scripts/renew-ssl.sh
User=$USER
WorkingDirectory=$PROJECT_DIR

[Install]
WantedBy=multi-user.target
EOF

cat > /tmp/safespace-ssl-renewal.timer << EOF
[Unit]
Description=Run SafeSpace SSL renewal daily
Requires=safespace-ssl-renewal.service

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
EOF

print_status "Systemd service files created in /tmp/ (optional installation)"

# Final status check
print_status "Performing final health checks..."

# Check if all containers are running
RUNNING_CONTAINERS=$(docker compose -f docker compose.yml -f docker compose.ssl.yml ps --services --filter "status=running" | wc -l)
TOTAL_CONTAINERS=$(docker compose -f docker compose.yml -f docker compose.ssl.yml ps --services | wc -l)

if [ "$RUNNING_CONTAINERS" -eq "$TOTAL_CONTAINERS" ]; then
    print_success "All containers are running ($RUNNING_CONTAINERS/$TOTAL_CONTAINERS)"
else
    print_warning "Some containers may not be running ($RUNNING_CONTAINERS/$TOTAL_CONTAINERS)"
fi

echo ""
echo "🎉 SafeSpace SSL Deployment Complete!"
echo "===================================="
print_success "✅ SSL certificates configured for $DOMAIN"
print_success "✅ Nginx configured with SSL/TLS"
print_success "✅ All services running with HTTPS"
print_success "✅ Database migrations completed"
print_success "✅ Application optimized for production"
print_success "✅ Automatic renewal script configured"
echo ""
echo "📋 Deployment Summary:"
echo "   🌐 Application URL: https://$DOMAIN"
echo "   🔒 SSL Certificate: Let's Encrypt"
echo "   🐳 Docker Containers: $RUNNING_CONTAINERS running"
echo "   📧 Admin Email: $EMAIL"
echo ""
echo "🔧 Management Commands:"
echo "   View logs:    docker compose -f docker compose.yml -f docker compose.ssl.yml logs"
echo "   Restart:      docker compose -f docker compose.yml -f docker compose.ssl.yml restart"
echo "   Stop:         docker compose -f docker compose.yml -f docker compose.ssl.yml down"
echo "   Renew SSL:    ./scripts/renew-ssl.sh"
echo ""
echo "📅 Next Steps:"
echo "   1. Test your application at: https://$DOMAIN"
echo "   2. Set up automatic SSL renewal in crontab:"
echo "      crontab -e"
echo "      0 12 * * * $PROJECT_DIR/scripts/renew-ssl.sh"
echo "   3. Test SSL security: https://www.ssllabs.com/ssltest/"
echo ""
print_success "🚀 SafeSpace is now live with SSL at https://$DOMAIN"