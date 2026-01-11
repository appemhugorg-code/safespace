# SafeSpace UAT Environment Setup Guide

## Overview

This guide provides step-by-step instructions for setting up a dedicated User Acceptance Testing (UAT) environment for SafeSpace. The UAT environment mirrors production while providing a safe space for comprehensive testing by customer stakeholders.

## Prerequisites

- Docker and Docker Compose installed
- Access to Google Workspace admin console
- Resend account for email testing
- SSL certificates for HTTPS testing
- Minimum 4GB RAM and 20GB disk space

## Environment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    UAT Environment                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Nginx     │  │  SafeSpace  │  │ PostgreSQL  │        │
│  │   Proxy     │  │    App      │  │  Database   │        │
│  │   :443      │  │    :8000    │  │    :5432    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │    Redis    │  │   Laravel   │  │  Monitoring │        │
│  │   Cache     │  │   Queue     │  │    Tools    │        │
│  │   :6379     │  │  Worker     │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## Step 1: Environment Configuration

### 1.1 Create UAT Environment File

Create `.env.uat` with UAT-specific configuration:

```bash
# Application Configuration
APP_NAME="SafeSpace UAT"
APP_ENV=uat
APP_KEY=base64:YOUR_UAT_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://uat.safespace.com

# Database Configuration
DB_CONNECTION=pgsql
DB_HOST=uat-postgres
DB_PORT=5432
DB_DATABASE=safespace_uat
DB_USERNAME=safespace_uat
DB_PASSWORD=YOUR_SECURE_UAT_DB_PASSWORD

# Redis Configuration
REDIS_HOST=uat-redis
REDIS_PASSWORD=YOUR_SECURE_REDIS_PASSWORD
REDIS_PORT=6379

# Mail Configuration (Resend)
MAIL_MAILER=resend
MAIL_FROM_ADDRESS="uat@safespace.com"
MAIL_FROM_NAME="SafeSpace UAT Platform"
RESEND_API_KEY=YOUR_UAT_RESEND_API_KEY

# Google Workspace Integration (UAT)
GOOGLE_CLIENT_ID=YOUR_UAT_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_UAT_GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI=https://uat.safespace.com/auth/google/callback

# Session and Cache
SESSION_DRIVER=redis
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=info

# UAT Specific Settings
UAT_MODE=true
UAT_TEST_DATA_ENABLED=true
UAT_MONITORING_ENABLED=true
```

### 1.2 Create UAT Docker Compose Configuration

Create `docker-compose.uat.yml`:

```yaml
version: '3.8'

services:
  uat-app:
    build:
      context: .
      dockerfile: docker/Dockerfile
    container_name: safespace-uat-app
    restart: unless-stopped
    working_dir: /var/www
    volumes:
      - ./:/var/www
      - ./docker/php/local.ini:/usr/local/etc/php/conf.d/local.ini
    environment:
      - APP_ENV=uat
    networks:
      - uat-network
    depends_on:
      - uat-postgres
      - uat-redis

  uat-nginx:
    image: nginx:alpine
    container_name: safespace-uat-nginx
    restart: unless-stopped
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./:/var/www
      - ./docker/nginx/uat.conf:/etc/nginx/conf.d/default.conf
      - ./docker/ssl:/etc/ssl/certs
    networks:
      - uat-network
    depends_on:
      - uat-app

  uat-postgres:
    image: postgres:15
    container_name: safespace-uat-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: safespace_uat
      POSTGRES_USER: safespace_uat
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - uat-postgres-data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - uat-network
    ports:
      - "5433:5432"

  uat-redis:
    image: redis:7-alpine
    container_name: safespace-uat-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - uat-redis-data:/data
    networks:
      - uat-network
    ports:
      - "6380:6379"

  uat-queue:
    build:
      context: .
      dockerfile: docker/Dockerfile
    container_name: safespace-uat-queue
    restart: unless-stopped
    command: php artisan queue:work --sleep=3 --tries=3
    working_dir: /var/www
    volumes:
      - ./:/var/www
    environment:
      - APP_ENV=uat
    networks:
      - uat-network
    depends_on:
      - uat-postgres
      - uat-redis

  uat-scheduler:
    build:
      context: .
      dockerfile: docker/Dockerfile
    container_name: safespace-uat-scheduler
    restart: unless-stopped
    command: php artisan schedule:work
    working_dir: /var/www
    volumes:
      - ./:/var/www
    environment:
      - APP_ENV=uat
    networks:
      - uat-network
    depends_on:
      - uat-postgres
      - uat-redis

volumes:
  uat-postgres-data:
  uat-redis-data:

networks:
  uat-network:
    driver: bridge
```

## Step 2: Database Setup

### 2.1 Create UAT Database Migration

Create a UAT-specific database seeder:

```bash
php artisan make:seeder UATTestDataSeeder
```

### 2.2 UAT Database Initialization Script

Create `database/seeders/UATTestDataSeeder.php`:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\MoodLog;
use App\Models\Appointment;
use App\Models\Message;
use App\Models\Article;
use Spatie\Permission\Models\Role;
use Carbon\Carbon;

class UATTestDataSeeder extends Seeder
{
    public function run()
    {
        // Create UAT test users with predictable credentials
        $this->createUATUsers();
        
        // Generate realistic test data
        $this->createMoodTrackingData();
        $this->createAppointmentData();
        $this->createMessageData();
        $this->createContentData();
    }

    private function createUATUsers()
    {
        // Admin UAT User
        $admin = User::create([
            'name' => 'UAT Admin User',
            'email' => 'admin-uat@safespace.com',
            'password' => bcrypt('UATAdmin2024!'),
            'email_verified_at' => now(),
            'is_approved' => true,
        ]);
        $admin->assignRole('admin');

        // Therapist UAT Users
        $therapist1 = User::create([
            'name' => 'Dr. Sarah Johnson (UAT)',
            'email' => 'therapist1-uat@safespace.com',
            'password' => bcrypt('UATTherapist2024!'),
            'email_verified_at' => now(),
            'is_approved' => true,
        ]);
        $therapist1->assignRole('therapist');

        $therapist2 = User::create([
            'name' => 'Dr. Michael Chen (UAT)',
            'email' => 'therapist2-uat@safespace.com',
            'password' => bcrypt('UATTherapist2024!'),
            'email_verified_at' => now(),
            'is_approved' => true,
        ]);
        $therapist2->assignRole('therapist');

        // Guardian UAT Users
        $guardian1 = User::create([
            'name' => 'Jennifer Smith (UAT)',
            'email' => 'guardian1-uat@safespace.com',
            'password' => bcrypt('UATGuardian2024!'),
            'email_verified_at' => now(),
            'is_approved' => true,
        ]);
        $guardian1->assignRole('guardian');

        $guardian2 = User::create([
            'name' => 'Robert Williams (UAT)',
            'email' => 'guardian2-uat@safespace.com',
            'password' => bcrypt('UATGuardian2024!'),
            'email_verified_at' => now(),
            'is_approved' => true,
        ]);
        $guardian2->assignRole('guardian');

        // Child UAT Users
        $child1 = User::create([
            'name' => 'Emma Smith (UAT)',
            'email' => 'child1-uat@safespace.com',
            'password' => bcrypt('UATChild2024!'),
            'email_verified_at' => now(),
            'is_approved' => true,
            'guardian_id' => $guardian1->id,
            'date_of_birth' => Carbon::now()->subYears(10),
        ]);
        $child1->assignRole('child');

        $child2 = User::create([
            'name' => 'Alex Williams (UAT)',
            'email' => 'child2-uat@safespace.com',
            'password' => bcrypt('UATChild2024!'),
            'email_verified_at' => now(),
            'is_approved' => true,
            'guardian_id' => $guardian2->id,
            'date_of_birth' => Carbon::now()->subYears(12),
        ]);
        $child2->assignRole('child');
    }

    // Additional methods for creating test data...
}
```

## Step 3: Monitoring and Logging Setup

### 3.1 Create UAT Monitoring Configuration

Create `config/uat-monitoring.php`:

```php
<?php

return [
    'enabled' => env('UAT_MONITORING_ENABLED', false),
    
    'logging' => [
        'channels' => ['uat-file', 'uat-database'],
        'level' => 'info',
    ],
    
    'performance' => [
        'track_requests' => true,
        'track_queries' => true,
        'track_memory' => true,
        'slow_query_threshold' => 1000, // milliseconds
    ],
    
    'alerts' => [
        'email' => env('UAT_ALERT_EMAIL', 'uat-alerts@safespace.com'),
        'error_threshold' => 5, // errors per minute
        'response_time_threshold' => 3000, // milliseconds
    ],
];
```

### 3.2 Create UAT Logging Channel

Add to `config/logging.php`:

```php
'channels' => [
    // ... existing channels
    
    'uat-file' => [
        'driver' => 'single',
        'path' => storage_path('logs/uat.log'),
        'level' => env('LOG_LEVEL', 'debug'),
    ],
    
    'uat-database' => [
        'driver' => 'custom',
        'via' => App\Logging\UATDatabaseLogger::class,
        'level' => env('LOG_LEVEL', 'debug'),
    ],
];
```

## Step 4: Email Testing Configuration

### 4.1 Create UAT Email Templates

Create UAT-specific email templates in `resources/views/emails/uat/`:

```blade
{{-- resources/views/emails/uat/test-notification.blade.php --}}
@extends('emails.layout')

@section('content')
<h1>UAT Test Notification</h1>
<p>This is a test email sent from the SafeSpace UAT environment.</p>

<div class="test-info">
    <h3>Test Information:</h3>
    <ul>
        <li><strong>Environment:</strong> UAT</li>
        <li><strong>Timestamp:</strong> {{ now()->format('Y-m-d H:i:s T') }}</li>
        <li><strong>Test ID:</strong> {{ $testId ?? 'N/A' }}</li>
        <li><strong>User Role:</strong> {{ $userRole ?? 'N/A' }}</li>
    </ul>
</div>

<p>If you received this email, the UAT email system is working correctly.</p>
@endsection
```

### 4.2 Create UAT Email Testing Command

Create `app/Console/Commands/UATEmailTestCommand.php`:

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Mail\UATTestNotification;

class UATEmailTestCommand extends Command
{
    protected $signature = 'uat:test-email {email} {--role=admin}';
    protected $description = 'Send a test email for UAT validation';

    public function handle()
    {
        $email = $this->argument('email');
        $role = $this->option('role');
        
        $testId = 'UAT-' . now()->format('YmdHis') . '-' . rand(1000, 9999);
        
        try {
            Mail::to($email)->send(new UATTestNotification($testId, $role));
            
            $this->info("UAT test email sent successfully!");
            $this->info("Test ID: {$testId}");
            $this->info("Recipient: {$email}");
            $this->info("Role: {$role}");
            
        } catch (\Exception $e) {
            $this->error("Failed to send UAT test email: " . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
}
```

## Step 5: Google Workspace UAT Integration

### 5.1 Create UAT Google Workspace Configuration

Create `config/google-uat.php`:

```php
<?php

return [
    'client_id' => env('GOOGLE_UAT_CLIENT_ID'),
    'client_secret' => env('GOOGLE_UAT_CLIENT_SECRET'),
    'redirect_uri' => env('GOOGLE_UAT_REDIRECT_URI'),
    
    'calendar' => [
        'calendar_id' => env('GOOGLE_UAT_CALENDAR_ID', 'primary'),
        'timezone' => env('GOOGLE_UAT_TIMEZONE', 'UTC'),
    ],
    
    'meet' => [
        'default_duration' => 60, // minutes
        'buffer_time' => 15, // minutes between appointments
    ],
    
    'scopes' => [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
    ],
];
```

## Step 6: UAT Deployment Scripts

### 6.1 Create UAT Deployment Script

Create `scripts/deploy-uat.sh`:

```bash
#!/bin/bash

# SafeSpace UAT Deployment Script
set -e

echo "🚀 Starting SafeSpace UAT Deployment..."

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose is required but not installed. Aborting." >&2; exit 1; }

# Load environment variables
if [ -f .env.uat ]; then
    export $(cat .env.uat | grep -v '#' | xargs)
    echo "✅ Loaded UAT environment variables"
else
    echo "❌ .env.uat file not found. Please create it first."
    exit 1
fi

# Build and start containers
echo "🔨 Building UAT containers..."
docker-compose -f docker-compose.uat.yml build --no-cache

echo "🚀 Starting UAT services..."
docker-compose -f docker-compose.uat.yml up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 30

# Run migrations and seeders
echo "🗄️ Running database migrations..."
docker-compose -f docker-compose.uat.yml exec uat-app php artisan migrate:fresh --force

echo "🌱 Seeding UAT test data..."
docker-compose -f docker-compose.uat.yml exec uat-app php artisan db:seed --class=UATTestDataSeeder

# Clear caches
echo "🧹 Clearing application caches..."
docker-compose -f docker-compose.uat.yml exec uat-app php artisan config:clear
docker-compose -f docker-compose.uat.yml exec uat-app php artisan cache:clear
docker-compose -f docker-compose.uat.yml exec uat-app php artisan route:clear
docker-compose -f docker-compose.uat.yml exec uat-app php artisan view:clear

# Build frontend assets
echo "🎨 Building frontend assets..."
docker-compose -f docker-compose.uat.yml exec uat-app npm install
docker-compose -f docker-compose.uat.yml exec uat-app npm run build

# Test email configuration
echo "📧 Testing email configuration..."
docker-compose -f docker-compose.uat.yml exec uat-app php artisan uat:test-email admin-uat@safespace.com --role=admin

# Health check
echo "🏥 Performing health check..."
sleep 10
if curl -f -s https://uat.safespace.com/health > /dev/null; then
    echo "✅ UAT environment is healthy and ready!"
else
    echo "⚠️ Health check failed. Please check the logs."
fi

echo "🎉 UAT deployment completed!"
echo ""
echo "📋 UAT Environment Details:"
echo "   URL: https://uat.safespace.com"
echo "   Admin: admin-uat@safespace.com / UATAdmin2024!"
echo "   Therapist: therapist1-uat@safespace.com / UATTherapist2024!"
echo "   Guardian: guardian1-uat@safespace.com / UATGuardian2024!"
echo "   Child: child1-uat@safespace.com / UATChild2024!"
echo ""
echo "📊 Monitoring:"
echo "   Logs: docker-compose -f docker-compose.uat.yml logs -f"
echo "   Status: docker-compose -f docker-compose.uat.yml ps"
echo ""
```

### 6.2 Create UAT Health Check Endpoint

Create `routes/uat.php`:

```php
<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

Route::get('/health', function () {
    $checks = [
        'database' => false,
        'cache' => false,
        'queue' => false,
        'email' => false,
    ];
    
    // Database check
    try {
        DB::connection()->getPdo();
        $checks['database'] = true;
    } catch (\Exception $e) {
        // Database connection failed
    }
    
    // Cache check
    try {
        Cache::put('health-check', 'ok', 60);
        $checks['cache'] = Cache::get('health-check') === 'ok';
    } catch (\Exception $e) {
        // Cache connection failed
    }
    
    // Queue check (simplified)
    $checks['queue'] = true; // Assume queue is working if no errors
    
    // Email check (simplified)
    $checks['email'] = config('mail.mailer') === 'resend' && !empty(config('services.resend.key'));
    
    $allHealthy = array_reduce($checks, function ($carry, $check) {
        return $carry && $check;
    }, true);
    
    return response()->json([
        'status' => $allHealthy ? 'healthy' : 'unhealthy',
        'timestamp' => now()->toISOString(),
        'environment' => app()->environment(),
        'checks' => $checks,
    ], $allHealthy ? 200 : 503);
});
```

## Step 7: UAT Documentation

### 7.1 Create UAT Quick Start Guide

Create `docs/uat/UAT_QUICK_START.md`:

```markdown
# SafeSpace UAT Quick Start Guide

## For UAT Coordinators

### 1. Access UAT Environment
- **URL:** https://uat.safespace.com
- **Environment:** Dedicated UAT staging environment
- **Data:** Realistic test data, refreshed daily

### 2. Test User Accounts

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Admin | admin-uat@safespace.com | UATAdmin2024! | System administration testing |
| Therapist | therapist1-uat@safespace.com | UATTherapist2024! | Therapist workflow testing |
| Guardian | guardian1-uat@safespace.com | UATGuardian2024! | Parent/guardian testing |
| Child | child1-uat@safespace.com | UATChild2024! | Child user experience testing |

### 3. Testing Checklist
- [ ] Login with each user role
- [ ] Verify role-appropriate dashboard access
- [ ] Test core functionality for each role
- [ ] Validate email notifications
- [ ] Check mobile responsiveness
- [ ] Test Google Meet integration
- [ ] Verify security and privacy controls

### 4. Issue Reporting
- Use the UAT issue tracking system
- Include screenshots and steps to reproduce
- Specify user role and browser information
- Mark severity level (Critical/High/Medium/Low)

### 5. Support Contacts
- **Technical Issues:** uat-support@safespace.com
- **Process Questions:** uat-coordinator@safespace.com
- **Emergency:** +1-XXX-XXX-XXXX
```

## Completion

The UAT environment setup is now complete with:

✅ **Docker-based UAT environment** with all services configured
✅ **Dedicated UAT database** with realistic test data
✅ **Email testing configuration** with Resend integration
✅ **Google Workspace UAT setup** for Calendar and Meet testing
✅ **Monitoring and logging** for UAT session tracking
✅ **Automated deployment scripts** for easy environment management
✅ **Health check endpoints** for environment validation
✅ **Comprehensive documentation** for UAT coordinators

The UAT environment is ready for customer acceptance testing with professional-grade infrastructure and comprehensive test data.