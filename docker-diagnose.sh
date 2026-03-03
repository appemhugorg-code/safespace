#!/bin/bash

# SafeSpace Docker Diagnostics Script

echo "🔍 SafeSpace Docker Diagnostics"
echo "================================"
echo ""

CONTAINER="safespace-app"

echo "1️⃣ Container status..."
docker ps | grep safespace

echo ""
echo "2️⃣ Database connection..."
docker exec $CONTAINER php artisan tinker --execute="echo 'DB: ' . (DB::connection()->getPdo() ? 'Connected' : 'Failed');"

echo ""
echo "3️⃣ Migrations status..."
docker exec $CONTAINER php artisan migrate:status | tail -n 10

echo ""
echo "4️⃣ Child user check..."
docker exec $CONTAINER php artisan tinker --execute="\$child = \App\Models\User::role('child')->first(); if(\$child) { echo 'Child: ' . \$child->name . ' | Status: ' . \$child->status; } else { echo 'No child users'; }"

echo ""
echo "5️⃣ Routes check..."
docker exec $CONTAINER php artisan route:list --path=appointments --compact

echo ""
echo "6️⃣ Recent logs (last 30 lines)..."
docker logs $CONTAINER --tail 30

echo ""
echo "7️⃣ Storage permissions..."
docker exec $CONTAINER ls -la storage/logs/

echo ""
echo "✅ Diagnostics complete!"
