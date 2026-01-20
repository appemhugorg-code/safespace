<?php

namespace App\Services;

use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Exception;

class RedisConnectionService
{
    /**
     * Test Redis connection (REQUIRED - no fallbacks)
     */
    public static function configureRedisOrFallback(): bool
    {
        try {
            // Log current configuration
            Log::info('Testing Redis connection with configuration', [
                'client' => config('database.redis.client'),
                'host' => config('database.redis.default.host'),
                'port' => config('database.redis.default.port'),
                'database' => config('database.redis.default.database'),
                'prefix' => config('database.redis.options.prefix'),
            ]);
            
            // Test Redis connection with timeout
            $result = Redis::connection()->ping();
            
            Log::info('Redis ping result', [
                'result' => $result,
                'type' => gettype($result)
            ]);
            
            if ($result === 'PONG' || $result === '+PONG' || $result === true || $result === 1) {
                Log::info('Redis connection successful');
                
                // Test cache operations
                try {
                    $testKey = 'health_check_' . time();
                    $testValue = 'ok_' . uniqid();
                    
                    Redis::set($testKey, $testValue, 'EX', 10);
                    $retrievedValue = Redis::get($testKey);
                    
                    if ($retrievedValue === $testValue) {
                        Log::info('Redis cache operations verified');
                        Redis::del($testKey);
                        return true;
                    } else {
                        Log::error('Redis cache operations failed - value mismatch', [
                            'expected' => $testValue,
                            'retrieved' => $retrievedValue
                        ]);
                        return false;
                    }
                } catch (Exception $cacheException) {
                    Log::error('Redis cache operations failed', [
                        'error' => $cacheException->getMessage(),
                        'class' => get_class($cacheException)
                    ]);
                    return false;
                }
            } else {
                Log::error('Redis ping returned unexpected result', [
                    'result' => $result,
                    'type' => gettype($result)
                ]);
                return false;
            }
        } catch (Exception $e) {
            Log::error('Redis connection failed', [
                'error' => $e->getMessage(),
                'class' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'redis_host' => config('database.redis.default.host'),
                'redis_port' => config('database.redis.default.port'),
                'redis_client' => config('database.redis.client')
            ]);
            return false;
        }
    }
    
    /**
     * Configure fallback drivers when Redis is not available
     */
    private static function configureFallbacks(): void
    {
        // Switch cache to file driver
        Config::set('cache.default', env('CACHE_STORE_FALLBACK', 'file'));
        
        // Switch session to file driver
        Config::set('session.driver', env('SESSION_DRIVER_FALLBACK', 'file'));
        
        // Switch queue to database driver
        Config::set('queue.default', env('QUEUE_CONNECTION_FALLBACK', 'database'));
        
        // Disable broadcasting (Reverb) since it requires Redis
        Config::set('broadcasting.default', 'null');
        
        Log::info('Configured fallback drivers: cache=file, session=file, queue=database, broadcasting=null');
    }
    
    /**
     * Check if Redis is available
     */
    public static function isRedisAvailable(): bool
    {
        try {
            $result = Redis::connection()->ping();
            return $result === 'PONG' || $result === '+PONG' || $result === true;
        } catch (Exception $e) {
            return false;
        }
    }
    
    /**
     * Get Redis status information
     */
    public static function getRedisStatus(): array
    {
        try {
            $info = Redis::info();
            $memory = Redis::info('memory');
            $stats = Redis::info('stats');
            
            return [
                'available' => true,
                'version' => $info['redis_version'] ?? 'unknown',
                'connected_clients' => $info['connected_clients'] ?? 0,
                'used_memory_human' => $memory['used_memory_human'] ?? 'unknown',
                'used_memory_peak_human' => $memory['used_memory_peak_human'] ?? 'unknown',
                'uptime_in_seconds' => $info['uptime_in_seconds'] ?? 0,
                'total_commands_processed' => $stats['total_commands_processed'] ?? 0,
                'keyspace_hits' => $stats['keyspace_hits'] ?? 0,
                'keyspace_misses' => $stats['keyspace_misses'] ?? 0,
                'maxmemory_human' => $memory['maxmemory_human'] ?? 'unknown',
            ];
        } catch (Exception $e) {
            return [
                'available' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}