#!/bin/bash
# Clear all Laravel caches after deployment

php artisan route:clear
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Rebuild optimized caches for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Cache cleared and rebuilt successfully!"
