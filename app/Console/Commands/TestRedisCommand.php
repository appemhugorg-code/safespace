<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;
use App\Services\RedisConnectionService;

class TestRedisCommand extends Command
{
    protected $signature = 'redis:test';
    protected $description = 'Test Redis connection and configuration';

    public function handle()
    {
        $this->info('Testing Redis connection...');
        
        // Show configuration
        $this->info('Redis Configuration:');
        $this->line('  Client: ' . config('database.redis.client'));
        $this->line('  Host: ' . config('database.redis.default.host'));
        $this->line('  Port: ' . config('database.redis.default.port'));
        $this->line('  Database: ' . config('database.redis.default.database'));
        $this->line('  Prefix: ' . config('database.redis.options.prefix'));
        
        // Check if Redis extension is loaded
        $this->info('PHP Redis Extensions:');
        $this->line('  phpredis loaded: ' . (extension_loaded('redis') ? 'YES' : 'NO'));
        $this->line('  predis available: ' . (class_exists('Predis\Client') ? 'YES' : 'NO'));
        
        // Test connection
        $this->info('Testing Redis connection...');
        try {
            $result = Redis::ping();
            $this->info('✅ Redis ping successful: ' . var_export($result, true));
            
            // Test read/write
            $testKey = 'test_' . time();
            $testValue = 'value_' . uniqid();
            
            Redis::set($testKey, $testValue, 'EX', 60);
            $retrievedValue = Redis::get($testKey);
            
            if ($retrievedValue === $testValue) {
                $this->info('✅ Redis read/write test successful');
                Redis::del($testKey);
            } else {
                $this->error('❌ Redis read/write test failed');
                $this->line('  Expected: ' . $testValue);
                $this->line('  Retrieved: ' . $retrievedValue);
            }
            
            // Test service
            $this->info('Testing RedisConnectionService...');
            if (RedisConnectionService::configureRedisOrFallback()) {
                $this->info('✅ RedisConnectionService test successful');
            } else {
                $this->error('❌ RedisConnectionService test failed');
            }
            
            // Show Redis info
            $status = RedisConnectionService::getRedisStatus();
            $this->info('Redis Status:');
            foreach ($status as $key => $value) {
                $this->line('  ' . $key . ': ' . (is_array($value) ? json_encode($value) : $value));
            }
            
        } catch (\Exception $e) {
            $this->error('❌ Redis connection failed: ' . $e->getMessage());
            $this->line('Exception class: ' . get_class($e));
            $this->line('File: ' . $e->getFile() . ':' . $e->getLine());
        }
        
        return 0;
    }
}