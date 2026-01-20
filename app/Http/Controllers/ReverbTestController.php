<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class ReverbTestController extends Controller
{
    /**
     * Show simple Reverb test page
     */
    public function index()
    {
        return view('reverb-test-simple');
    }
    
    /**
     * Get Reverb status via API
     */
    public function status(): JsonResponse
    {
        $status = [
            'timestamp' => now()->toISOString(),
            'reverb_config' => [
                'app_id' => env('REVERB_APP_ID'),
                'app_key' => env('REVERB_APP_KEY'),
                'host' => env('REVERB_HOST'),
                'port' => env('REVERB_PORT'),
                'scheme' => env('REVERB_SCHEME'),
            ],
            'server_checks' => []
        ];
        
        // Check if Reverb process is running
        $processes = shell_exec('ps aux | grep "reverb:start" | grep -v grep');
        $status['server_checks']['process_running'] = !empty(trim($processes));
        $status['server_checks']['process_details'] = trim($processes) ?: 'No process found';
        
        // Check if port is listening
        $port = env('REVERB_PORT', 8080);
        $portCheck = shell_exec("netstat -tlnp 2>/dev/null | grep :$port || ss -tlnp 2>/dev/null | grep :$port");
        $status['server_checks']['port_listening'] = !empty(trim($portCheck));
        $status['server_checks']['port_details'] = trim($portCheck) ?: 'Port not listening';
        
        // Try HTTP connection to Reverb
        try {
            $host = env('REVERB_HOST', 'localhost');
            $url = "http://{$host}:{$port}";
            
            $response = Http::timeout(5)->get($url);
            $status['server_checks']['http_accessible'] = true;
            $status['server_checks']['http_status'] = $response->status();
            $status['server_checks']['http_response'] = substr($response->body(), 0, 100);
            
        } catch (\Exception $e) {
            $status['server_checks']['http_accessible'] = false;
            $status['server_checks']['http_error'] = $e->getMessage();
        }
        
        // Overall status
        $status['overall_status'] = $status['server_checks']['process_running'] && 
                                   $status['server_checks']['port_listening'] ? 'RUNNING' : 'NOT_RUNNING';
        
        return response()->json($status, 200, [], JSON_PRETTY_PRINT);
    }
}