<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use App\Models\User;

class UATStatusCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'uat:status {--detailed : Show detailed status information}';

    /**
     * The console command description.
     */
    protected $description = 'Check UAT environment status and health';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🏥 SafeSpace UAT Environment Status');
        $this->info('===================================');
        $this->newLine();

        // Basic environment check
        $this->checkEnvironment();
        
        // Database connectivity
        $this->checkDatabase();
        
        // Cache system
        $this->checkCache();
        
        // Email configuration
        $this->checkEmail();
        
        // Test users
        $this->checkTestUsers();
        
        // Application health
        $this->checkApplicationHealth();
        
        if ($this->option('detailed')) {
            $this->showDetailedStatus();
        }

        $this->newLine();
        $this->info('✅ UAT status check completed');
        
        return Command::SUCCESS;
    }

    /**
     * Check environment configuration
     */
    private function checkEnvironment(): void
    {
        $this->info('🌍 Environment Configuration:');
        
        $env = app()->environment();
        $appName = config('app.name');
        $appUrl = config('app.url');
        $debug = config('app.debug') ? 'Enabled' : 'Disabled';
        
        $this->info("   Environment: {$env}");
        $this->info("   App Name: {$appName}");
        $this->info("   App URL: {$appUrl}");
        $this->info("   Debug Mode: {$debug}");
        
        if ($env !== 'uat') {
            $this->warn('   ⚠️  Warning: Not running in UAT environment');
        } else {
            $this->info('   ✅ Running in UAT environment');
        }
        
        $this->newLine();
    }

    /**
     * Check database connectivity and data
     */
    private function checkDatabase(): void
    {
        $this->info('🗄️  Database Status:');
        
        try {
            $connection = DB::connection();
            $pdo = $connection->getPdo();
            $dbName = $connection->getDatabaseName();
            
            $this->info("   Connection: ✅ Connected to {$dbName}");
            
            // Check user counts
            $totalUsers = User::count();
            $adminCount = User::role('admin')->count();
            $therapistCount = User::role('therapist')->count();
            $guardianCount = User::role('guardian')->count();
            $childCount = User::role('child')->count();
            
            $this->info("   Total Users: {$totalUsers}");
            $this->info("     👑 Admins: {$adminCount}");
            $this->info("     🩺 Therapists: {$therapistCount}");
            $this->info("     👨‍👩‍👧‍👦 Guardians: {$guardianCount}");
            $this->info("     🧒 Children: {$childCount}");
            
            if ($totalUsers === 0) {
                $this->warn('   ⚠️  No users found. Run: php artisan uat:setup');
            } else {
                $this->info('   ✅ Test users are present');
            }
            
        } catch (\Exception $e) {
            $this->error('   ❌ Database connection failed: ' . $e->getMessage());
        }
        
        $this->newLine();
    }

    /**
     * Check cache system
     */
    private function checkCache(): void
    {
        $this->info('🔄 Cache System:');
        
        try {
            $cacheDriver = config('cache.default');
            $this->info("   Driver: {$cacheDriver}");
            
            // Test cache functionality
            $testKey = 'uat-status-test-' . time();
            $testValue = 'test-value';
            
            Cache::put($testKey, $testValue, 60);
            $retrieved = Cache::get($testKey);
            Cache::forget($testKey);
            
            if ($retrieved === $testValue) {
                $this->info('   ✅ Cache is working correctly');
            } else {
                $this->warn('   ⚠️  Cache test failed');
            }
            
        } catch (\Exception $e) {
            $this->error('   ❌ Cache system error: ' . $e->getMessage());
        }
        
        $this->newLine();
    }

    /**
     * Check email configuration
     */
    private function checkEmail(): void
    {
        $this->info('📧 Email Configuration:');
        
        $mailDriver = config('mail.default');
        $fromAddress = config('mail.from.address');
        $fromName = config('mail.from.name');
        $resendKey = config('services.resend.key');
        
        $this->info("   Driver: {$mailDriver}");
        $this->info("   From Address: {$fromAddress}");
        $this->info("   From Name: {$fromName}");
        
        if ($mailDriver === 'resend') {
            if (!empty($resendKey) && $resendKey !== 'YOUR_UAT_RESEND_API_KEY') {
                $this->info('   ✅ Resend API key configured');
            } else {
                $this->warn('   ⚠️  Resend API key not configured');
            }
        }
        
        $this->newLine();
    }

    /**
     * Check test users
     */
    private function checkTestUsers(): void
    {
        $this->info('👥 Test User Accounts:');
        
        $testUsers = [
            'admin-uat@safespace.com' => 'admin',
            'therapist1-uat@safespace.com' => 'therapist',
            'guardian1-uat@safespace.com' => 'guardian',
            'child1-uat@safespace.com' => 'child',
        ];
        
        foreach ($testUsers as $email => $expectedRole) {
            $user = User::where('email', $email)->first();
            
            if ($user) {
                $hasRole = $user->hasRole($expectedRole);
                $status = $hasRole ? '✅' : '⚠️';
                $roleInfo = $hasRole ? $expectedRole : 'incorrect role';
                $this->info("   {$status} {$email} ({$roleInfo})");
            } else {
                $this->warn("   ❌ {$email} (missing)");
            }
        }
        
        $this->newLine();
    }

    /**
     * Check application health via HTTP
     */
    private function checkApplicationHealth(): void
    {
        $this->info('🏥 Application Health:');
        
        try {
            $appUrl = config('app.url');
            $healthUrl = $appUrl . '/health';
            
            $response = Http::timeout(10)->get($healthUrl);
            
            if ($response->successful()) {
                $healthData = $response->json();
                $status = $healthData['status'] ?? 'unknown';
                $healthScore = $healthData['health_score'] ?? 0;
                
                $this->info("   Health Status: {$status}");
                $this->info("   Health Score: {$healthScore}%");
                
                if ($status === 'healthy') {
                    $this->info('   ✅ Application is healthy');
                } else {
                    $this->warn('   ⚠️  Application health issues detected');
                }
                
                // Show individual check results
                if (isset($healthData['checks'])) {
                    foreach ($healthData['checks'] as $check => $result) {
                        $icon = $result ? '✅' : '❌';
                        $this->info("     {$icon} {$check}");
                    }
                }
                
            } else {
                $this->error('   ❌ Health check endpoint returned: ' . $response->status());
            }
            
        } catch (\Exception $e) {
            $this->error('   ❌ Could not reach health endpoint: ' . $e->getMessage());
            $this->info('   💡 Make sure the application is running');
        }
        
        $this->newLine();
    }

    /**
     * Show detailed status information
     */
    private function showDetailedStatus(): void
    {
        $this->info('📊 Detailed Status Information:');
        $this->info('==============================');
        $this->newLine();
        
        // System information
        $this->info('🖥️  System Information:');
        $this->info('   PHP Version: ' . PHP_VERSION);
        $this->info('   Laravel Version: ' . app()->version());
        $this->info('   Memory Usage: ' . $this->formatBytes(memory_get_usage(true)));
        $this->info('   Memory Peak: ' . $this->formatBytes(memory_get_peak_usage(true)));
        $this->newLine();
        
        // Configuration details
        $this->info('⚙️  Configuration Details:');
        $this->info('   Queue Driver: ' . config('queue.default'));
        $this->info('   Session Driver: ' . config('session.driver'));
        $this->info('   Broadcast Driver: ' . config('broadcasting.default'));
        $this->info('   Log Channel: ' . config('logging.default'));
        $this->newLine();
        
        // Database tables
        $this->info('📋 Database Tables:');
        try {
            $tables = DB::select('SHOW TABLES');
            $tableCount = count($tables);
            $this->info("   Total Tables: {$tableCount}");
            
            // Show key table row counts
            $keyTables = ['users', 'roles', 'mood_logs', 'appointments', 'messages', 'articles'];
            foreach ($keyTables as $table) {
                if (DB::getSchemaBuilder()->hasTable($table)) {
                    $count = DB::table($table)->count();
                    $this->info("   {$table}: {$count} records");
                }
            }
        } catch (\Exception $e) {
            $this->warn('   Could not retrieve table information');
        }
        
        $this->newLine();
        
        // Recent activity
        $this->info('📈 Recent Activity:');
        try {
            $recentUsers = User::where('created_at', '>=', now()->subDays(7))->count();
            $this->info("   New users (7 days): {$recentUsers}");
            
            if (DB::getSchemaBuilder()->hasTable('mood_logs')) {
                $recentMoods = DB::table('mood_logs')
                    ->where('created_at', '>=', now()->subDays(7))
                    ->count();
                $this->info("   Mood logs (7 days): {$recentMoods}");
            }
            
            if (DB::getSchemaBuilder()->hasTable('appointments')) {
                $upcomingAppointments = DB::table('appointments')
                    ->where('scheduled_at', '>=', now())
                    ->where('status', 'scheduled')
                    ->count();
                $this->info("   Upcoming appointments: {$upcomingAppointments}");
            }
            
        } catch (\Exception $e) {
            $this->warn('   Could not retrieve activity information');
        }
        
        $this->newLine();
    }

    /**
     * Format bytes to human readable format
     */
    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }
}