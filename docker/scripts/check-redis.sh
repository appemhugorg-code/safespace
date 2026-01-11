#!/bin/bash

# Redis Health Check Script

echo "🔍 Redis Health Check"
echo "===================="

# Check if Redis service is reachable
echo "1. Checking Redis service availability..."
if nc -z redis 6379; then
    echo "✅ Redis service is reachable on redis:6379"
else
    echo "❌ Redis service is NOT reachable on redis:6379"
    exit 1
fi

# Check Redis with redis-cli
echo "2. Testing Redis with redis-cli..."
if redis-cli -h redis -p 6379 ping; then
    echo "✅ Redis responds to ping via redis-cli"
else
    echo "❌ Redis does NOT respond to ping via redis-cli"
fi

# Check Redis info
echo "3. Getting Redis info..."
redis-cli -h redis -p 6379 info server | head -10

# Check Laravel Redis connection
echo "4. Testing Laravel Redis connection..."
php artisan tinker --execute="
try {
    use Illuminate\Support\Facades\Redis;
    \$result = Redis::ping();
    echo 'Laravel Redis ping result: ' . \$result . PHP_EOL;
    echo '✅ Laravel can connect to Redis' . PHP_EOL;
} catch(Exception \$e) {
    echo '❌ Laravel Redis connection failed: ' . \$e->getMessage() . PHP_EOL;
}
"

echo "🏁 Redis health check completed"