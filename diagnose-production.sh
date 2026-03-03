#!/bin/bash

echo "🔍 SafeSpace Production Diagnostics"
echo "===================================="
echo ""

echo "1️⃣ Checking database connection..."
php artisan db:show 2>&1 | head -n 5

echo ""
echo "2️⃣ Checking migrations status..."
php artisan migrate:status | tail -n 10

echo ""
echo "3️⃣ Testing database query..."
php artisan tinker --execute="echo 'Users count: ' . \App\Models\User::count();"

echo ""
echo "4️⃣ Checking child user status..."
php artisan tinker --execute="\$child = \App\Models\User::role('child')->first(); if(\$child) { echo 'Child: ' . \$child->name . ' | Status: ' . \$child->status . ' | ID: ' . \$child->id; } else { echo 'No child users found'; }"

echo ""
echo "5️⃣ Checking notifications table..."
php artisan tinker --execute="echo 'Notifications count: ' . \App\Models\Notification::count();"

echo ""
echo "6️⃣ Checking API routes..."
php artisan route:list --path=api/user/theme --compact
php artisan route:list --path=api/notifications/recent --compact

echo ""
echo "7️⃣ Checking Laravel logs (last 20 lines)..."
tail -n 20 storage/logs/laravel.log

echo ""
echo "8️⃣ Checking permissions..."
ls -la storage/logs/
ls -la bootstrap/cache/

echo ""
echo "✅ Diagnostics complete!"
