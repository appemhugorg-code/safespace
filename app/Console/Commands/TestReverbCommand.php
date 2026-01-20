<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Exception;

class TestReverbCommand extends Command
{
    protected $signature = 'reverb:test {--host=0.0.0.0} {--port=8080}';
    protected $description = 'Test Reverb WebSocket server connection and functionality';

    public function handle()
    {
        $host = $this->option('host');
        $port = $this->option('port');
        
        $this->info('Testing Reverb WebSocket server...');
        $this->line('Host: ' . $host);
        $this->line('Port: ' . $port);
        $this->line('');
        
        // Test 1: Check if Reverb process is running
        $this->info('1. Checking if Reverb process is running...');
        $processes = shell_exec('ps aux | grep reverb | grep -v grep');
        if ($processes) {
            $this->info('✅ Reverb process found:');
            $this->line($processes);
        } else {
            $this->error('❌ No Reverb process found');
            return 1;
        }
        
        // Test 2: Check if port is listening
        $this->info('2. Checking if port ' . $port . ' is listening...');
        $portCheck = shell_exec("netstat -tlnp 2>/dev/null | grep :$port || ss -tlnp 2>/dev/null | grep :$port");
        if ($portCheck) {
            $this->info('✅ Port ' . $port . ' is listening:');
            $this->line(trim($portCheck));
        } else {
            $this->error('❌ Port ' . $port . ' is not listening');
            return 1;
        }
        
        // Test 3: Test HTTP connection to Reverb
        $this->info('3. Testing HTTP connection to Reverb...');
        try {
            $url = "http://{$host}:{$port}";
            $response = Http::timeout(10)->get($url);
            
            if ($response->successful()) {
                $this->info('✅ HTTP connection successful');
                $this->line('Status: ' . $response->status());
                $this->line('Response: ' . substr($response->body(), 0, 200) . '...');
            } else {
                $this->warn('⚠️  HTTP connection returned status: ' . $response->status());
                $this->line('Response: ' . substr($response->body(), 0, 200));
            }
        } catch (Exception $e) {
            $this->error('❌ HTTP connection failed: ' . $e->getMessage());
        }
        
        // Test 4: Check Reverb configuration
        $this->info('4. Checking Reverb configuration...');
        $this->line('App ID: ' . config('reverb.apps.0.id'));
        $this->line('App Key: ' . config('reverb.apps.0.key'));
        $this->line('App Secret: ' . substr(config('reverb.apps.0.secret'), 0, 10) . '...');
        $this->line('Max Connections: ' . config('reverb.apps.0.max_connections'));
        
        // Test 5: Check broadcasting configuration
        $this->info('5. Checking broadcasting configuration...');
        $this->line('Broadcast Driver: ' . config('broadcasting.default'));
        $this->line('Reverb Host: ' . config('broadcasting.connections.reverb.host'));
        $this->line('Reverb Port: ' . config('broadcasting.connections.reverb.port'));
        
        // Test 6: Test WebSocket connection (basic)
        $this->info('6. Testing WebSocket connection...');
        $wsUrl = "ws://{$host}:{$port}/app/" . config('reverb.apps.0.key');
        $this->line('WebSocket URL: ' . $wsUrl);
        
        // Use curl to test WebSocket upgrade
        $curlCommand = "curl -i -N -H 'Connection: Upgrade' -H 'Upgrade: websocket' -H 'Sec-WebSocket-Version: 13' -H 'Sec-WebSocket-Key: test' http://{$host}:{$port}/app/" . config('reverb.apps.0.key') . " 2>/dev/null | head -10";
        $wsTest = shell_exec($curlCommand);
        
        if (strpos($wsTest, '101 Switching Protocols') !== false) {
            $this->info('✅ WebSocket upgrade successful');
        } else {
            $this->warn('⚠️  WebSocket upgrade test inconclusive');
            $this->line('Response: ' . substr($wsTest, 0, 300));
        }
        
        $this->info('');
        $this->info('Reverb test completed!');
        
        return 0;
    }
}