#!/bin/bash

# SafeSpace UAT Deployment Script
set -e

echo "🚀 Starting SafeSpace UAT Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

command -v docker >/dev/null 2>&1 || { 
    print_error "Docker is required but not installed. Aborting."
    exit 1
}

command -v docker compose >/dev/null 2>&1 || { 
    print_error "Docker Compose is required but not installed. Aborting."
    exit 1
}

print_success "Prerequisites check passed"

# Check for UAT environment file
if [ ! -f .env.uat ]; then
    print_error ".env.uat file not found."
    print_status "Creating .env.uat from example..."
    
    if [ -f .env.uat.example ]; then
        cp .env.uat.example .env.uat
        print_warning "Please update .env.uat with your UAT-specific values before continuing."
        print_status "Required updates:"
        echo "  - APP_KEY (run: php artisan key:generate)"
        echo "  - DB_PASSWORD"
        echo "  - REDIS_PASSWORD"
        echo "  - RESEND_API_KEY"
        echo "  - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET"
        exit 1
    else
        print_error ".env.uat.example file not found. Cannot create UAT environment file."
        exit 1
    fi
fi

print_success "UAT environment file found"

# Load environment variables
export $(cat .env.uat | grep -v '#' | grep -v '^$' | xargs)
print_success "Loaded UAT environment variables"

# Stop existing UAT containers if running
print_status "Stopping existing UAT containers..."
docker compose -f docker compose.uat.yml down --remove-orphans || true

# Build containers
print_status "Building UAT containers..."
docker compose -f docker compose.uat.yml build --no-cache

# Start services
print_status "Starting UAT services..."
docker compose -f docker compose.uat.yml up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check if database is ready
print_status "Checking database connectivity..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker compose -f docker compose.uat.yml exec -T uat-postgres pg_isready -U safespace_uat -d safespace_uat >/dev/null 2>&1; then
        print_success "Database is ready"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        print_error "Database failed to become ready after $max_attempts attempts"
        exit 1
    fi
    
    print_status "Waiting for database... (attempt $attempt/$max_attempts)"
    sleep 2
    ((attempt++))
done

# Install PHP dependencies
print_status "Installing PHP dependencies..."
docker compose -f docker compose.uat.yml exec -T uat-app composer install --no-dev --optimize-autoloader

# Generate application key if needed
if grep -q "YOUR_UAT_APP_KEY_HERE" .env.uat; then
    print_status "Generating application key..."
    docker compose -f docker compose.uat.yml exec -T uat-app php artisan key:generate --force
fi

# Run migrations
print_status "Running database migrations..."
docker compose -f docker compose.uat.yml exec -T uat-app php artisan migrate:fresh --force

# Seed UAT test data
print_status "Seeding UAT test data..."
docker compose -f docker compose.uat.yml exec -T uat-app php artisan db:seed --force

# Clear application caches
print_status "Clearing application caches..."
docker compose -f docker compose.uat.yml exec -T uat-app php artisan config:clear
docker compose -f docker compose.uat.yml exec -T uat-app php artisan cache:clear
docker compose -f docker compose.uat.yml exec -T uat-app php artisan route:clear
docker compose -f docker compose.uat.yml exec -T uat-app php artisan view:clear

# Install Node.js dependencies and build assets
print_status "Installing Node.js dependencies..."
docker compose -f docker compose.uat.yml exec -T uat-app npm ci

print_status "Building frontend assets..."
docker compose -f docker compose.uat.yml exec -T uat-app npm run build

# Set proper permissions
print_status "Setting proper permissions..."
docker compose -f docker compose.uat.yml exec -T uat-app chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Test email configuration (optional)
if [ ! -z "$RESEND_API_KEY" ] && [ "$RESEND_API_KEY" != "YOUR_UAT_RESEND_API_KEY" ]; then
    print_status "Testing email configuration..."
    docker compose -f docker compose.uat.yml exec -T uat-app php artisan uat:test-email admin-uat@safespace.com --role=admin || print_warning "Email test failed - check configuration"
else
    print_warning "Skipping email test - RESEND_API_KEY not configured"
fi

# Health check
print_status "Performing health check..."
sleep 10

# Try to access the health endpoint
health_url="http://localhost:8080/health"
if curl -f -s "$health_url" > /dev/null 2>&1; then
    print_success "UAT environment health check passed!"
else
    print_warning "Health check failed. The application may still be starting up."
    print_status "You can check the status manually at: $health_url"
fi

# Display deployment summary
print_success "🎉 UAT deployment completed!"
echo ""
echo "📋 UAT Environment Details:"
echo "   🌐 URL: http://localhost:8080 (or https://uat.safespace.com if configured)"
echo "   🗄️  Database: PostgreSQL on port 5433"
echo "   🔄 Redis: Available on port 6380"
echo "   📡 WebSocket: Available on port 8081"
echo ""
echo "👥 Test User Accounts:"
echo "   👑 Admin: admin-uat@safespace.com / UATAdmin2024!"
echo "   🩺 Therapist: therapist1-uat@safespace.com / UATTherapist2024!"
echo "   👨‍👩‍👧‍👦 Guardian: guardian1-uat@safespace.com / UATGuardian2024!"
echo "   🧒 Child: child1-uat@safespace.com / UATChild2024!"
echo ""
echo "🛠️  Management Commands:"
echo "   📊 View logs: docker compose -f docker compose.uat.yml logs -f"
echo "   📈 Check status: docker compose -f docker compose.uat.yml ps"
echo "   🔄 Restart: docker compose -f docker compose.uat.yml restart"
echo "   🛑 Stop: docker compose -f docker compose.uat.yml down"
echo ""
echo "🏥 Health Check: curl http://localhost:8080/health"
echo ""
print_success "UAT environment is ready for acceptance testing!"