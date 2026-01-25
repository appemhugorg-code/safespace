#!/bin/bash
# Automatic SSL certificate renewal script for SafeSpace

echo "🔄 Renewing SSL certificates for app.emhug.org..."

# Navigate to project directory
cd "$(dirname "$0")/.."

# Renew certificates
docker compose -f docker compose.yml -f docker compose.ssl.yml run --rm certbot renew

# Reload nginx to use new certificates
echo "🔄 Reloading nginx with new certificates..."
docker compose -f docker compose.yml -f docker compose.ssl.yml exec nginx nginx -s reload

echo "✅ SSL renewal completed successfully!"
echo "📅 Next renewal check: $(date -d '+60 days' '+%Y-%m-%d')"