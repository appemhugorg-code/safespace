#!/bin/bash

# SafeSpace Production Docker Fix Script
# Run this on your production server where Docker is running

echo "🐳 SafeSpace Docker Production Fix"
echo "===================================="
echo ""

# Get the container name
CONTAINER="safespace-app"

echo "1️⃣ Clearing Laravel caches..."
docker exec $CONTAINER php artisan cache:clear
docker exec $CONTAINER php artisan config:clear
docker exec $CONTAINER php artisan route:clear
docker exec $CONTAINER php artisan view:clear
docker exec $CONTAINER php artisan event:clear

echo ""
echo "2️⃣ Running migrations..."
docker exec $CONTAINER php artisan migrate --force

echo ""
echo "3️⃣ Rebuilding optimized caches..."
docker exec $CONTAINER php artisan config:cache
docker exec $CONTAINER php artisan route:cache
docker exec $CONTAINER php artisan event:cache

echo ""
echo "4️⃣ Fixing storage permissions..."
docker exec $CONTAINER chmod -R 775 storage bootstrap/cache
docker exec $CONTAINER chown -R www-data:www-data storage bootstrap/cache

echo ""
echo "5️⃣ Verifying routes..."
echo "Appointments route:"
docker exec $CONTAINER php artisan route:list --name=appointments.index --compact

echo ""
echo "6️⃣ Restarting Reverb (WebSocket server)..."
docker exec $CONTAINER php artisan reverb:restart

echo ""
echo "✅ Fix complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Test: https://app.emhug.org/appointments (as child user)"
echo "   2. Check logs: docker logs safespace-app -f"
echo "   3. If still broken, run: ./docker-diagnose.sh"
