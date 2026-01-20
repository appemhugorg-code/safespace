<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\RedisConnectionService;
use Illuminate\Support\Facades\Log;

class RedisServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Configure Redis connection - REQUIRED in production
        if (app()->environment('production')) {
            try {
                $redisAvailable = RedisConnectionService::configureRedisOrFallback();
                
                if (!$redisAvailable) {
                    Log::critical('Redis connection failed during application boot - this is a critical error');
                    
                    // In production, Redis is required
                    throw new \Exception('Redis connection is required but failed to connect');
                }
                
                Log::info('Redis successfully configured during application boot');
            } catch (\Exception $e) {
                Log::critical('Failed to configure Redis during boot', [
                    'error' => $e->getMessage()
                ]);
                
                // Re-throw the exception to prevent application from starting
                throw $e;
            }
        }
    }
}