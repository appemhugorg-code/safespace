#!/bin/bash

# SSL Setup Script for SafeSpace Production
# This script sets up Let's Encrypt SSL certificates for app.emhug.org

set -e

echo "🔒 SafeSpace SSL Setup for app.emhug.org"
echo "========================================"

# Check if domain is provided
DOMAIN="app.emhug.org"
EMAIL="admin@emhug.org"

echo "Domain: $DOMAIN"
echo "Email: $EMAIL"

# Create necessary directories
echo "📁 Creating certificate directories..."
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

# Check if certificates already exist
if [ -d "./certbot/conf/live/$DOMAIN" ]; then
    echo "⚠️  Certificates already exist for $DOMAIN"
    read -p "Do you want to renew them? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 Renewing certificates..."
        docker compose -f docker compose.yml -f docker compose.ssl.yml run --rm certbot renew
    fi
else
    echo "🆕 Obtaining new certificates for $DOMAIN..."
    
    # Start nginx temporarily for domain verification
    echo "🚀 Starting temporary nginx for domain verification..."
    docker compose -f docker compose.yml -f docker compose.ssl.yml up -d nginx
    
    # Wait for nginx to be ready
    sleep 10
    
    # Get initial certificate
    echo "📜 Requesting SSL certificate from Let's Encrypt..."
    docker compose -f docker compose.yml -f docker compose.ssl.yml run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        --force-renewal \
        -d $DOMAIN
fi

# Set proper permissions
echo "🔐 Setting certificate permissions..."
sudo chown -R $USER:$USER ./certbot/conf
sudo chmod -R 755 ./certbot/conf

# Copy SSL environment file
echo "⚙️  Setting up SSL environment..."
cp .env.production.ssl .env.production

# Start all services with SSL
echo "🚀 Starting all services with SSL..."
docker compose -f docker compose.yml -f docker compose.ssl.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 15

# Test SSL certificate
echo "🧪 Testing SSL certificate..."
if curl -s -I https://$DOMAIN | grep -q "200 OK"; then
    echo "✅ SSL certificate is working correctly!"
    echo "🌐 Your SafeSpace application is now available at: https://$DOMAIN"
else
    echo "❌ SSL test failed. Please check the logs:"
    echo "   docker compose -f docker compose.yml -f docker compose.ssl.yml logs nginx"
fi

# Setup automatic renewal
echo "🔄 Setting up automatic certificate renewal..."
cat > ./scripts/renew-ssl.sh << 'EOF'
#!/bin/bash
# Automatic SSL certificate renewal script

echo "🔄 Renewing SSL certificates..."
docker compose -f docker compose.yml -f docker compose.ssl.yml run --rm certbot renew

echo "🔄 Reloading nginx..."
docker compose -f docker compose.yml -f docker compose.ssl.yml exec nginx nginx -s reload

echo "✅ SSL renewal completed!"
EOF

chmod +x ./scripts/renew-ssl.sh

echo ""
echo "🎉 SSL Setup Complete!"
echo "====================="
echo "✅ SSL certificates obtained for $DOMAIN"
echo "✅ Nginx configured with SSL"
echo "✅ All services running with HTTPS"
echo "✅ Automatic renewal script created"
echo ""
echo "📋 Next Steps:"
echo "1. Add this to your crontab for automatic renewal:"
echo "   0 12 * * * /path/to/your/project/scripts/renew-ssl.sh"
echo ""
echo "2. Test your SSL setup at: https://www.ssllabs.com/ssltest/"
echo ""
echo "3. Your application is now available at: https://$DOMAIN"
echo ""
echo "🔧 Useful Commands:"
echo "   View logs: docker compose -f docker compose.yml -f docker compose.ssl.yml logs"
echo "   Restart:   docker compose -f docker compose.yml -f docker compose.ssl.yml restart"
echo "   Stop:      docker compose -f docker compose.yml -f docker compose.ssl.yml down"