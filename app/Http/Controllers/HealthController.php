<?php

namespace App\Http\Controllers;

use App\Services\RedisConnectionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    /**
     * Get application health status
     */
    public function index(): JsonResponse
    {
        $health = [
            'status' => 'healthy',
            'timestamp' => now()->toISOString(),
            'services' => []
        ];

        // Check database
        try {
            DB::connection()->getPdo();
            $health['services']['database'] = [
                'status' => 'healthy',
                'connection' => config('database.default')
            ];
        } catch (\Exception $e) {
            $health['services']['database'] = [
                'status' => 'unhealthy',
                'error' => $e->getMessage()
            ];
            $health['status'] = 'degraded';
        }

        // Check Redis
        $redisStatus = RedisConnectionService::getRedisStatus();
        $health['services']['redis'] = $redisStatus;
        
        if (!$redisStatus['available']) {
            $health['status'] = 'degraded';
            $health['services']['redis']['fallbacks'] = [
                'cache' => config('cache.default'),
                'session' => config('session.driver'),
                'queue' => config('queue.default'),
                'broadcasting' => config('broadcasting.default')
            ];
        }

        // Check storage
        try {
            $storageWritable = is_writable(storage_path());
            $health['services']['storage'] = [
                'status' => $storageWritable ? 'healthy' : 'unhealthy',
                'writable' => $storageWritable
            ];
            
            if (!$storageWritable) {
                $health['status'] = 'unhealthy';
            }
        } catch (\Exception $e) {
            $health['services']['storage'] = [
                'status' => 'unhealthy',
                'error' => $e->getMessage()
            ];
            $health['status'] = 'unhealthy';
        }

        $statusCode = $health['status'] === 'healthy' ? 200 : 
                     ($health['status'] === 'degraded' ? 200 : 503);

        return response()->json($health, $statusCode);
    }

    /**
     * Simple health check for load balancers
     */
    public function ping(): JsonResponse
    {
        return response()->json(['status' => 'ok']);
    }
}