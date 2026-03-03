#!/bin/bash

# SafeSpace Deployment Script
# This script ensures all caches are cleared and the application is properly configured

echo "🚀 Starting SafeSpace deployment..."

# Clear all caches
echo "🧹 Clearing caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize for production
echo "⚡ Optimizing for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
echo "📊 Running migrations..."
php artisan migrate --force

# Build frontend assets
echo "🎨 Building frontend assets..."
npm run build

echo "✅ Deployment complete!"
