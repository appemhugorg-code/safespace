<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Queue;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| UAT Routes
|--------------------------------------------------------------------------
|
| These routes are specifically for User Acceptance Testing (UAT) and
| provide health checks, monitoring, and testing utilities for the
| UAT environment.
|
*/

// Health Check Endpoint
Route::get('/health', function () {
    $checks = [
        'database' => false,
        'cache' => false,
        'queue' => false,
        'email' => false,
        'storage' => false,
        'google_workspace' => false,
    ];
    
    $details = [];
    
    // Database check
    try {
        $start = microtime(true);
        DB::connection()->getPdo();
        $dbTime = round((microtime(true) - $start) * 1000, 2);
        
        // Test a simple query
        $userCount = DB::table('users')->count();
        
        $checks['database'] = true;
        $details['database'] = [
            'status' => 'healthy',
            'response_time_ms' => $dbTime,
            'user_count' => $userCount,
            'connection' => DB::connection()->getName(),
        ];
    } catch (\Exception $e) {
        $details['database'] = [
            'status' => 'unhealthy',
            'error' => $e->getMessage(),
        ];
    }
    
    // Cache check
    try {
        $start = microtime(true);
        $testKey = 'health-check-' . time();
        Cache::put($testKey, 'ok', 60);
        $cacheResult = Cache::get($testKey);
        Cache::forget($testKey);
        $cacheTime = round((microtime(true) - $start) * 1000, 2);
        
        $checks['cache'] = $cacheResult === 'ok';
        $details['cache'] = [
            'status' => $checks['cache'] ? 'healthy' : 'unhealthy',
            'response_time_ms' => $cacheTime,
            'driver' => config('cache.default'),
        ];
    } catch (\Exception $e) {
        $details['cache'] = [
            'status' => 'unhealthy',
            'error' => $e->getMessage(),
        ];
    }
    
    // Queue check
    try {
        $queueConnection = config('queue.default');
        $checks['queue'] = !empty($queueConnection);
        $details['queue'] = [
            'status' => $checks['queue'] ? 'healthy' : 'unhealthy',
            'connection' => $queueConnection,
            'driver' => config("queue.connections.{$queueConnection}.driver"),
        ];
    } catch (\Exception $e) {
        $details['queue'] = [
            'status' => 'unhealthy',
            'error' => $e->getMessage(),
        ];
    }
    
    // Email check
    try {
        $mailDriver = config('mail.default');
        $resendKey = config('services.resend.key');
        
        $checks['email'] = $mailDriver === 'resend' && !empty($resendKey) && $resendKey !== 'YOUR_UAT_RESEND_API_KEY';
        $details['email'] = [
            'status' => $checks['email'] ? 'healthy' : 'unhealthy',
            'driver' => $mailDriver,
            'from_address' => config('mail.from.address'),
            'api_key_configured' => !empty($resendKey) && $resendKey !== 'YOUR_UAT_RESEND_API_KEY',
        ];
    } catch (\Exception $e) {
        $details['email'] = [
            'status' => 'unhealthy',
            'error' => $e->getMessage(),
        ];
    }
    
    // Storage check
    try {
        $start = microtime(true);
        $testFile = 'health-check-' . time() . '.txt';
        \Storage::put($testFile, 'health check test');
        $exists = \Storage::exists($testFile);
        \Storage::delete($testFile);
        $storageTime = round((microtime(true) - $start) * 1000, 2);
        
        $checks['storage'] = $exists;
        $details['storage'] = [
            'status' => $checks['storage'] ? 'healthy' : 'unhealthy',
            'response_time_ms' => $storageTime,
            'driver' => config('filesystems.default'),
        ];
    } catch (\Exception $e) {
        $details['storage'] = [
            'status' => 'unhealthy',
            'error' => $e->getMessage(),
        ];
    }
    
    // Google Workspace check
    try {
        $googleClientId = config('services.google.client_id');
        $googleClientSecret = config('services.google.client_secret');
        
        $checks['google_workspace'] = !empty($googleClientId) && 
                                     !empty($googleClientSecret) && 
                                     $googleClientId !== 'YOUR_UAT_GOOGLE_CLIENT_ID';
        
        $details['google_workspace'] = [
            'status' => $checks['google_workspace'] ? 'healthy' : 'unhealthy',
            'client_id_configured' => !empty($googleClientId) && $googleClientId !== 'YOUR_UAT_GOOGLE_CLIENT_ID',
            'client_secret_configured' => !empty($googleClientSecret) && $googleClientSecret !== 'YOUR_UAT_GOOGLE_CLIENT_SECRET',
        ];
    } catch (\Exception $e) {
        $details['google_workspace'] = [
            'status' => 'unhealthy',
            'error' => $e->getMessage(),
        ];
    }
    
    // Overall health status
    $allHealthy = array_reduce($checks, function ($carry, $check) {
        return $carry && $check;
    }, true);
    
    // Calculate health score
    $healthyCount = array_sum($checks);
    $totalChecks = count($checks);
    $healthScore = round(($healthyCount / $totalChecks) * 100, 1);
    
    return response()->json([
        'status' => $allHealthy ? 'healthy' : 'degraded',
        'health_score' => $healthScore,
        'timestamp' => now()->toISOString(),
        'environment' => app()->environment(),
        'version' => config('app.version', '1.0.0'),
        'uptime' => $this->getUptime(),
        'checks' => $checks,
        'details' => $details,
        'system_info' => [
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'memory_usage' => $this->formatBytes(memory_get_usage(true)),
            'memory_peak' => $this->formatBytes(memory_get_peak_usage(true)),
        ],
    ], $allHealthy ? 200 : 503);
})->name('uat.health');

// UAT Environment Info
Route::get('/uat/info', function () {
    if (!app()->environment('uat')) {
        return response()->json(['error' => 'This endpoint is only available in UAT environment'], 403);
    }
    
    return response()->json([
        'environment' => 'UAT',
        'app_name' => config('app.name'),
        'app_url' => config('app.url'),
        'database' => [
            'connection' => DB::connection()->getName(),
            'database' => DB::connection()->getDatabaseName(),
        ],
        'mail' => [
            'driver' => config('mail.default'),
            'from_address' => config('mail.from.address'),
        ],
        'cache' => [
            'driver' => config('cache.default'),
        ],
        'queue' => [
            'driver' => config('queue.default'),
        ],
        'test_users' => [
            'admin' => 'admin-uat@safespace.com',
            'therapist' => 'therapist1-uat@safespace.com',
            'guardian' => 'guardian1-uat@safespace.com',
            'child' => 'child1-uat@safespace.com',
        ],
        'test_credentials' => [
            'admin_password' => 'UATAdmin2024!',
            'therapist_password' => 'UATTherapist2024!',
            'guardian_password' => 'UATGuardian2024!',
            'child_password' => 'UATChild2024!',
        ],
        'documentation' => [
            'setup_guide' => '/docs/uat/UAT_ENVIRONMENT_SETUP.md',
            'quick_start' => '/docs/uat/UAT_QUICK_START.md',
        ],
        'monitoring' => [
            'logs' => 'docker compose -f docker compose.uat.yml logs -f',
            'status' => 'docker compose -f docker compose.uat.yml ps',
        ],
    ]);
})->name('uat.info');

// UAT Test Email Endpoint
Route::post('/uat/test-email', function (Request $request) {
    if (!app()->environment('uat')) {
        return response()->json(['error' => 'This endpoint is only available in UAT environment'], 403);
    }
    
    $request->validate([
        'email' => 'required|email',
        'role' => 'required|in:admin,therapist,guardian,child',
    ]);
    
    try {
        $testId = 'UAT-WEB-' . now()->format('YmdHis') . '-' . rand(1000, 9999);
        
        \Mail::to($request->email)->send(new \App\Mail\UATTestNotification($testId, $request->role));
        
        return response()->json([
            'success' => true,
            'message' => 'UAT test email sent successfully',
            'test_id' => $testId,
            'recipient' => $request->email,
            'role' => $request->role,
            'timestamp' => now()->toISOString(),
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to send UAT test email',
            'error' => $e->getMessage(),
        ], 500);
    }
})->name('uat.test-email');

// Helper function to get system uptime
function getUptime() {
    if (function_exists('sys_getloadavg')) {
        $uptime = shell_exec('uptime');
        if ($uptime) {
            return trim($uptime);
        }
    }
    return 'Unknown';
}

// Helper function to format bytes
function formatBytes($bytes, $precision = 2) {
    $units = array('B', 'KB', 'MB', 'GB', 'TB');
    
    for ($i = 0; $bytes > 1024; $i++) {
        $bytes /= 1024;
    }
    
    return round($bytes, $precision) . ' ' . $units[$i];
}