#!/bin/sh

# SafeSpace Application Entrypoint Script

set -e

echo "Starting SafeSpace application setup..."

# Wait for database to be ready
echo "Waiting for database connection..."
until php artisan tinker --execute="DB::connection()->getPdo();" 2>/dev/null; do
    echo "Database not ready, waiting..."
    sleep 2
done

echo "Database connection established!"

# Wait for Redis to be ready
echo "Waiting for Redis connection..."
until php artisan tinker --execute="use Illuminate\Support\Facades\Redis; Redis::ping();" 2>/dev/null; do
    echo "Redis not ready, waiting..."
    sleep 2
done

echo "Redis connection established!"

# Run Laravel setup commands
echo "Running Laravel setup..."

# Generate application key if not set
if [ "$APP_KEY" = "base64:GENERATE_NEW_KEY_FOR_PRODUCTION" ]; then
    echo "Generating application key..."
    php artisan key:generate
fi

# Publish Reverb configuration
echo "Publishing Reverb configuration..."
php artisan vendor:publish --provider="Laravel\Reverb\ReverbServiceProvider" --force

# Run database migrations
echo "Running database migrations..."
if ! php artisan migrate --force; then
    echo "ERROR: Database migrations failed!"
    exit 1
fi

# Create queue tables if they don't exist
echo "Ensuring queue tables exist..."
php artisan queue:table 2>/dev/null || echo "Queue table already exists or created"
if ! php artisan migrate --force; then
    echo "ERROR: Queue table migrations failed!"
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
npm ci

# Build frontend assets with increased memory limit
echo "Building frontend assets..."
NODE_OPTIONS="--max-old-space-size=2048" npm run build

# Verify assets were built
if [ -d "/var/www/html/public/build" ]; then
    echo "✅ Frontend assets built successfully"
    ls -la /var/www/html/public/build/ | head -10
else
    echo "❌ ERROR: Frontend assets build failed!"
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

echo "SafeSpace application setup completed!"

# Test that the application is working
echo "Testing application health..."
if php artisan tinker --execute="echo 'Application is healthy';" 2>/dev/null; then
    echo "✅ Application health check passed"
else
    echo "❌ WARNING: Application health check failed"
fi

# Ensure supervisor directories exist with proper permissions
mkdir -p /var/log/supervisor /run/supervisor
chmod 755 /var/log/supervisor /run/supervisor

# Start Reverb server in the background for WebSocket support
echo "Starting Reverb WebSocket server..."
php artisan reverb:start --host=0.0.0.0 --port=8080 &
REVERB_PID=$!
echo "Reverb server started with PID: $REVERB_PID"

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

# Execute the main command
exec "$@"
