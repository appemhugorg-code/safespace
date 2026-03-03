#!/bin/bash

echo "🚀 SafeSpace Production Quick Fix"
echo "=================================="
echo ""

# Step 1: Clear all caches
echo "1️⃣ Clearing all caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan event:clear

# Step 2: Run any pending migrations
echo ""
echo "2️⃣ Checking for pending migrations..."
php artisan migrate --force

# Step 3: Rebuild optimized caches
echo ""
echo "3️⃣ Rebuilding optimized caches..."
php artisan config:cache
php artisan route:cache
php artisan event:cache

# Step 4: Fix storage permissions
echo ""
echo "4️⃣ Fixing storage permissions..."
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || chown -R $USER:$USER storage bootstrap/cache

# Step 5: Verify routes
echo ""
echo "5️⃣ Verifying critical routes..."
echo "Appointments route:"
php artisan route:list --name=appointments.index --compact
echo ""
echo "Theme API route:"
php artisan route:list --path=api/user/theme --compact
echo ""
echo "Notifications API route:"
php artisan route:list --path=api/notifications/recent --compact

# Step 6: Test database connection
echo ""
echo "6️⃣ Testing database connection..."
php artisan tinker --execute="echo 'DB Connection: ' . (DB::connection()->getPdo() ? 'OK' : 'FAILED');"

echo ""
echo "✅ Quick fix complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Restart your web server (nginx/apache)"
echo "   2. Restart Laravel Reverb: php artisan reverb:restart"
echo "   3. Test the appointments page as a child user"
echo "   4. Check logs: tail -f storage/logs/laravel.log"
