#!/bin/bash

# SafeSpace Production Route Fix Script
# Run this on the production server to clear and rebuild route cache

echo "🔧 Clearing Laravel caches..."
php artisan route:clear
php artisan config:clear
php artisan cache:clear
php artisan view:clear

echo "📦 Rebuilding optimized caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ Cache rebuild complete!"
echo ""
echo "🔍 Verifying appointments route..."
php artisan route:list --name=appointments.index

echo ""
echo "✨ Done! Please test the appointments page now."
