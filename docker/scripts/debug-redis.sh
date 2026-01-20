#!/bin/sh

# Redis Debug Script for SafeSpace Production

echo "=== Redis Debug Information ==="
echo "Date: $(date)"
echo ""

echo "1. Docker Network Connectivity:"
echo "   Testing Redis host resolution..."
getent hosts redis || echo "   ❌ Redis host not found in DNS"

echo "   Testing Redis port connectivity..."
if nc -z redis 6379 2>/dev/null; then
    echo "   ✅ Redis port 6379 is reachable"
else
    echo "   ❌ Redis port 6379 is not reachable"
fi

echo ""
echo "2. Redis Service Status:"
echo "   Testing Redis ping..."
if redis-cli -h redis -p 6379 ping 2>/dev/null | grep -q "PONG"; then
    echo "   ✅ Redis responds to ping"
else
    echo "   ❌ Redis does not respond to ping"
fi

echo "   Testing Redis info..."
redis-cli -h redis -p 6379 info server 2>/dev/null | head -10 || echo "   ❌ Could not get Redis server info"

echo ""
echo "3. Redis Memory and Performance:"
redis-cli -h redis -p 6379 info memory 2>/dev/null | grep -E "(used_memory_human|maxmemory_human)" || echo "   ❌ Could not get Redis memory info"

echo ""
echo "4. Redis Configuration:"
redis-cli -h redis -p 6379 config get "*" 2>/dev/null | grep -E "(maxmemory|save|appendonly)" || echo "   ❌ Could not get Redis config"

echo ""
echo "5. Laravel Redis Configuration:"
if [ -f "/var/www/html/artisan" ]; then
    php /var/www/html/artisan tinker --execute="
    echo 'Redis Host: ' . config('database.redis.default.host');
    echo 'Redis Port: ' . config('database.redis.default.port');
    echo 'Redis DB: ' . config('database.redis.default.database');
    echo 'Redis Max Retries: ' . config('database.redis.default.max_retries');
    echo 'Cache Driver: ' . config('cache.default');
    echo 'Session Driver: ' . config('session.driver');
    echo 'Queue Driver: ' . config('queue.default');
    " 2>/dev/null || echo "   ❌ Could not check Laravel Redis config"
else
    echo "   ❌ Laravel not available"
fi

echo ""
echo "6. Laravel Redis Connection Test:"
if [ -f "/var/www/html/artisan" ]; then
    php /var/www/html/artisan tinker --execute="
    try {
        use Illuminate\Support\Facades\Redis;
        \$result = Redis::ping();
        echo 'Laravel Redis Ping: ' . var_export(\$result, true);
        
        Redis::set('debug_test', 'working', 'EX', 10);
        \$value = Redis::get('debug_test');
        echo 'Laravel Redis Read/Write: ' . (\$value === 'working' ? 'SUCCESS' : 'FAILED');
        Redis::del('debug_test');
    } catch (Exception \$e) {
        echo 'Laravel Redis Error: ' . \$e->getMessage();
    }
    " 2>/dev/null || echo "   ❌ Could not test Laravel Redis connection"
else
    echo "   ❌ Laravel not available"
fi

echo ""
echo "7. Docker Container Status:"
echo "   Current container processes:"
ps aux | grep -E "(redis|php|nginx)" | grep -v grep || echo "   No relevant processes found"

echo ""
echo "8. Network Information:"
echo "   Container IP addresses:"
ip addr show | grep -E "inet.*eth0" || echo "   Could not get container IP"

echo "   /etc/hosts entries:"
grep redis /etc/hosts || echo "   No Redis entries in /etc/hosts"

echo ""
echo "=== End Redis Debug Information ==="