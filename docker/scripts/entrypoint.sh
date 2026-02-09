#!/bin/sh

# SafeSpace Application Entrypoint Script

set -e

echo "Starting SafeSpace application setup..."

# Install Composer dependencies if vendor directory doesn't exist
if [ ! -d "/var/www/html/vendor" ] || [ ! -f "/var/www/html/vendor/autoload.php" ]; then
    echo "Installing Composer dependencies..."
    
    # Ensure composer.json and composer.lock exist
    if [ ! -f "/var/www/html/composer.json" ]; then
        echo "ERROR: composer.json not found!"
        exit 1
    fi
    
    # Clear any existing vendor directory first
    #rm -rf /var/www/html/vendor 2>/dev/null || true
    
    # Install dependencies with proper error handling and skip scripts initially
    echo "Installing Composer packages (without scripts)..."
    if COMPOSER_MEMORY_LIMIT=-1 composer install --no-dev --optimize-autoloader --no-interaction --ignore-platform-req=ext-* --no-scripts --verbose; then
        echo "✅ Composer packages installed successfully!"
        
        # Now run the scripts separately with better error handling
        echo "Running Composer scripts..."
        if COMPOSER_MEMORY_LIMIT=-1 composer run-script post-autoload-dump --no-interaction; then
            echo "✅ Composer scripts completed successfully!"
        else
            echo "⚠️  WARNING: Composer scripts failed, trying alternative approach..."
            # Try running package discovery manually
            if php artisan package:discover --ansi; then
                echo "✅ Package discovery completed manually!"
            else
                echo "⚠️  WARNING: Package discovery failed, but continuing..."
                # Create a basic autoload file if needed
                composer dump-autoload --no-interaction --optimize || true
            fi
        fi
    else
        echo "❌ ERROR: Composer installation failed!"
        echo "Trying alternative installation method..."
        
        # Alternative: Install without optimization first
        if COMPOSER_MEMORY_LIMIT=-1 composer install --no-dev --no-interaction --ignore-platform-req=ext-* --no-scripts; then
            echo "✅ Basic Composer installation successful!"
            composer dump-autoload --optimize --no-interaction || true
        else
            echo "❌ ERROR: All Composer installation methods failed!"
            exit 1
        fi
    fi
    
    # Verify installation
    if [ -f "/var/www/html/vendor/autoload.php" ]; then
        echo "✅ Vendor autoload.php verified"
    else
        echo "❌ ERROR: vendor/autoload.php still missing after installation!"
        exit 1
    fi
else
    echo "✅ Composer dependencies already installed."
fi

# Ensure proper permissions for vendor directory
chown -R www-data:www-data /var/www/html/vendor 2>/dev/null || true
chmod -R 755 /var/www/html/vendor 2>/dev/null || true

# Wait for database to be ready
echo "Waiting for database connection..."
DB_READY=0
RETRY_COUNT=0
MAX_RETRIES=60  # Increased from 30 to 60

# First, wait for PostgreSQL service to be available
echo "Checking if PostgreSQL service is available..."
while [ $RETRY_COUNT -lt 30 ]; do
    if nc -z postgres 5432 2>/dev/null; then
        echo "✅ PostgreSQL service is available"
        break
    else
        echo "PostgreSQL service not available, waiting... (attempt $((RETRY_COUNT + 1))/30)"
        sleep 2
        RETRY_COUNT=$((RETRY_COUNT + 1))
    fi
done

# Reset retry count for database connection test
RETRY_COUNT=0

while [ $DB_READY -eq 0 ] && [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if php artisan tinker --execute="try { DB::connection()->getPdo(); echo 'DB_OK'; } catch(Exception \$e) { echo 'DB_FAIL: ' . \$e->getMessage(); }" 2>/dev/null | grep -q "DB_OK"; then
        DB_READY=1
        echo "✅ Database connection established!"
    else
        echo "Database not ready, waiting... (attempt $((RETRY_COUNT + 1))/$MAX_RETRIES)"
        sleep 3  # Increased sleep time
        RETRY_COUNT=$((RETRY_COUNT + 1))
    fi
done

if [ $DB_READY -eq 0 ]; then
    echo "❌ ERROR: Database connection failed after $MAX_RETRIES attempts!"
    echo "Checking database configuration..."
    php artisan tinker --execute="echo 'DB Host: ' . config('database.connections.pgsql.host'); echo 'DB Name: ' . config('database.connections.pgsql.database');"
    exit 1
fi

# Wait for Redis to be ready (REQUIRED)
echo "Waiting for Redis connection..."
REDIS_READY=0
RETRY_COUNT=0
MAX_RETRIES=30  # Reduced for simpler testing

# First, wait for Redis service to be available on the network
echo "Checking if Redis service is available..."
while [ $RETRY_COUNT -lt 15 ]; do
    if nc -z redis 6379 2>/dev/null; then
        echo "✅ Redis service is available on network"
        break
    else
        echo "Redis service not available on network, waiting... (attempt $((RETRY_COUNT + 1))/15)"
        sleep 2
        RETRY_COUNT=$((RETRY_COUNT + 1))
    fi
done

if [ $RETRY_COUNT -eq 15 ]; then
    echo "❌ ERROR: Redis service never became available on network!"
    echo "Debugging network connectivity..."
    echo "Available hosts:"
    getent hosts redis || echo "Redis host not found in DNS"
    echo "Network interfaces:"
    ip addr show | grep -E "(inet|UP)" || echo "Could not show network interfaces"
    echo "Docker network info:"
    cat /etc/hosts | grep redis || echo "Redis not in /etc/hosts"
    exit 1
fi

# Reset retry count for Redis connection test
RETRY_COUNT=0

# Test Redis connection with redis-cli
echo "Testing Redis connection..."
while [ $REDIS_READY -eq 0 ] && [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    # Test with redis-cli ping
    if redis-cli -h redis -p 6379 ping 2>/dev/null | grep -q "PONG"; then
        echo "✅ Redis responds to ping"
        
        # Test Redis write/read operations
        if redis-cli -h redis -p 6379 set test_key "test_value" >/dev/null 2>&1 && \
           redis-cli -h redis -p 6379 get test_key 2>/dev/null | grep -q "test_value"; then
            echo "✅ Redis read/write operations working"
            
            # Clean up test key
            redis-cli -h redis -p 6379 del test_key >/dev/null 2>&1
            
            # Test Laravel Redis connection
            echo "Testing Laravel Redis connection..."
            if php artisan redis:test 2>/dev/null | grep -q "Redis ping successful"; then
                REDIS_READY=1
                echo "✅ Laravel Redis connection established!"
            else
                echo "❌ Laravel Redis connection failed, retrying..."
                sleep 3
                RETRY_COUNT=$((RETRY_COUNT + 1))
            fi
        else
            echo "❌ Redis read/write operations failed"
            sleep 2
            RETRY_COUNT=$((RETRY_COUNT + 1))
        fi
    else
        echo "Redis not responding to ping, waiting... (attempt $((RETRY_COUNT + 1))/$MAX_RETRIES)"
        sleep 2
        RETRY_COUNT=$((RETRY_COUNT + 1))
    fi
done

if [ $REDIS_READY -eq 0 ]; then
    echo "❌ ERROR: Redis connection failed after $MAX_RETRIES attempts!"
    echo "Redis is required for this application. Debugging information:"
    echo "Redis Host: redis"
    echo "Redis Port: 6379"
    
    # Try to get more debugging info
    echo "Testing direct Redis connection..."
    timeout 5 redis-cli -h redis -p 6379 info server 2>/dev/null || echo "Could not get Redis server info"
    
    echo "Checking Redis container status..."
    echo "If this fails, check: docker compose logs redis"
    
    # Run detailed Redis test for debugging
    echo "Running detailed Redis test..."
    php artisan redis:test || echo "Redis test command failed"
    
    exit 1
fi

# Configure Redis (REQUIRED)
echo "Configuring Redis connection..."
if php artisan tinker --execute="
use App\Services\RedisConnectionService;
try {
    if (RedisConnectionService::configureRedisOrFallback()) {
        echo 'REDIS_CONFIG_SUCCESS';
    } else {
        echo 'REDIS_CONFIG_FAIL';
    }
} catch (Exception \$e) {
    echo 'REDIS_CONFIG_ERROR: ' . \$e->getMessage();
}
" 2>/dev/null | grep -q "REDIS_CONFIG_SUCCESS"; then
    echo "✅ Redis configuration successful!"
else
    echo "❌ ERROR: Redis configuration failed!"
    echo "This is a critical error - Redis is required for this application."
    exit 1
fi

# Run Laravel setup commands
echo "Running Laravel setup..."

# Generate application key if not set
if [ "$APP_KEY" = "base64:GENERATE_NEW_KEY_FOR_PRODUCTION" ] || [ -z "$APP_KEY" ]; then
    echo "Generating application key..."
    if php artisan key:generate --force; then
        echo "✅ Application key generated"
    else
        echo "❌ ERROR: Failed to generate application key!"
        exit 1
    fi
fi

# Generate Reverb keys if not set
if [ -z "$REVERB_APP_KEY" ] || [ "$REVERB_APP_KEY" = "your-reverb-app-key" ]; then
    echo "Generating Reverb app key..."
    REVERB_APP_KEY=$(openssl rand -hex 16)
    echo "REVERB_APP_KEY=${REVERB_APP_KEY}" >> .env.production
    export REVERB_APP_KEY
    echo "✅ Reverb app key generated: ${REVERB_APP_KEY}"
fi

if [ -z "$REVERB_APP_SECRET" ] || [ "$REVERB_APP_SECRET" = "your-reverb-app-secret" ]; then
    echo "Generating Reverb app secret..."
    REVERB_APP_SECRET=$(openssl rand -hex 32)
    echo "REVERB_APP_SECRET=${REVERB_APP_SECRET}" >> .env.production
    export REVERB_APP_SECRET
    echo "✅ Reverb app secret generated: ${REVERB_APP_SECRET}"
fi

# Publish Reverb configuration
echo "Publishing Reverb configuration..."
if php artisan vendor:publish --provider="Laravel\Reverb\ReverbServiceProvider" --force; then
    echo "✅ Reverb configuration published"
else
    echo "⚠️  WARNING: Failed to publish Reverb configuration (may already exist)"
fi

# Run database migrations
echo "Running database migrations..."
if php artisan migrate --force; then
    echo "✅ Database migrations completed"
else
    echo "❌ ERROR: Database migrations failed!"
    exit 1
fi

# Create queue tables if they don't exist
echo "Ensuring queue tables exist..."
php artisan queue:table 2>/dev/null || echo "Queue table migration already exists"
if php artisan migrate --force; then
    echo "✅ Queue tables ready"
else
    echo "❌ ERROR: Queue table migrations failed!"
    exit 1
fi

# Seed the database with roles and permissions (only if not already seeded)
echo "Checking if database seeding is needed..."
ROLES_EXIST=$(php artisan tinker --execute="echo \Spatie\Permission\Models\Role::count();" 2>/dev/null | tail -1)
if [ "$ROLES_EXIST" = "0" ]; then
    echo "Seeding database with roles and permissions..."
    php artisan db:seed --class=RolePermissionSeeder --force
    php artisan db:seed --class=TestUserSeeder --force
else
    echo "Roles already exist, skipping seeding..."
fi

# Clear and cache configuration
echo "Optimizing application..."
php artisan config:cache

# Clear route cache before caching to avoid conflicts
php artisan route:clear
php artisan route:cache

php artisan view:cache

# Clear any cached views after asset rebuild
php artisan view:clear

# Always rebuild frontend assets to ensure latest changes
echo "Rebuilding frontend assets..."
cd /var/www/html

# Install/update npm dependencies
echo "Installing npm dependencies..."
if NODE_OPTIONS="--max-old-space-size=2048" npm ci; then
    echo "✅ npm dependencies installed"
else
    echo "❌ ERROR: npm install failed!"
    exit 1
fi

# Build frontend assets with increased memory limit
echo "Building frontend assets..."
if NODE_OPTIONS="--max-old-space-size=2048" npm run build; then
    echo "✅ Frontend assets built successfully"
else
    echo "❌ ERROR: Frontend assets build failed!"
    exit 1
fi

# Verify assets were built
if [ -d "/var/www/html/public/build" ]; then
    echo "✅ Frontend assets verified in public/build/"
    ls -la /var/www/html/public/build/ | head -5
else
    echo "❌ ERROR: Frontend assets build directory missing!"
    exit 1
fi

# Create storage symlink if it doesn't exist
if [ ! -L "/var/www/html/public/storage" ]; then
    echo "Creating storage symlink..."
    php artisan storage:link
fi

# Set proper permissions
echo "Setting file permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Test that the application is working
echo "Testing application health..."
if php artisan tinker --execute="echo 'Application is healthy';" 2>/dev/null | grep -q "Application is healthy"; then
    echo "✅ Application health check passed"
else
    echo "⚠️  WARNING: Application health check failed (may still work)"
fi

# Ensure supervisor directories exist with proper permissions
mkdir -p /var/log/supervisor /run/supervisor
chmod 755 /var/log/supervisor /run/supervisor
chown -R www-data:www-data /var/log/supervisor

echo "🎉 SafeSpace application setup completed successfully!"

# Start Reverb server in the background for WebSocket support (REQUIRED)
echo "Starting Reverb WebSocket server..."

# Wait a bit for everything to be ready
sleep 2

# Test Reverb configuration first
echo "Testing Reverb configuration..."
if php artisan reverb:install --no-interaction 2>/dev/null; then
    echo "✅ Reverb configuration verified"
else
    echo "⚠️  WARNING: Reverb configuration may have issues"
fi

if php artisan reverb:start --host=0.0.0.0 --port=8080 --no-interaction &
then
    REVERB_PID=$!
    echo "✅ Reverb server started with PID: $REVERB_PID"
    
    # Give Reverb a moment to start
    sleep 3
    
    # Verify Reverb is running
    if kill -0 $REVERB_PID 2>/dev/null; then
        echo "✅ Reverb server is running"
    else
        echo "❌ ERROR: Reverb server failed to start properly"
        exit 1
    fi
else
    echo "❌ ERROR: Failed to start Reverb server"
    exit 1
fi

# Start supervisord if it's the main command
if [ "$1" = "/usr/bin/supervisord" ]; then
    echo "Starting supervisord..."
    # Test the configuration first
    supervisord -t -c /etc/supervisor/conf.d/supervisord.conf
    if [ $? -eq 0 ]; then
        echo "Supervisor configuration is valid"
    else
        echo "ERROR: Supervisor configuration is invalid!"
        exit 1
    fi
fi

echo "✅ Setup complete. Creating ready flag."
touch /tmp/app-ready

# Execute the main container process (usually php-fpm)
exec "$@"