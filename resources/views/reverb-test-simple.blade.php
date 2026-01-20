<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reverb Status Test</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .status { padding: 15px; margin: 10px 0; border-radius: 5px; font-weight: bold; }
        .running { background-color: #d4edda; color: #155724; }
        .not-running { background-color: #f8d7da; color: #721c24; }
        .loading { background-color: #fff3cd; color: #856404; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
        button:hover { background: #0056b3; }
    </style>
</head>
<body>
    <h1>🔄 Reverb WebSocket Server Status</h1>
    
    <div id="status" class="status loading">Loading...</div>
    
    <button onclick="checkStatus()">Refresh Status</button>
    
    <h2>📊 Detailed Status</h2>
    <pre id="details">Loading...</pre>
    
    <h2>🧪 WebSocket Test</h2>
    <p>WebSocket URL: <code>ws://{{ env('REVERB_HOST') }}:{{ env('REVERB_PORT') }}/app/{{ env('REVERB_APP_KEY') }}</code></p>
    <button onclick="testWebSocket()">Test WebSocket Connection</button>
    <div id="ws-status" class="status loading" style="display:none;">Testing...</div>

    <script>
        function checkStatus() {
            document.getElementById('status').textContent = 'Loading...';
            document.getElementById('status').className = 'status loading';
            
            fetch('/reverb/status')
                .then(response => response.json())
                .then(data => {
                    const statusDiv = document.getElementById('status');
                    const detailsDiv = document.getElementById('details');
                    
                    if (data.overall_status === 'RUNNING') {
                        statusDiv.textContent = '✅ Reverb is RUNNING';
                        statusDiv.className = 'status running';
                    } else {
                        statusDiv.textContent = '❌ Reverb is NOT RUNNING';
                        statusDiv.className = 'status not-running';
                    }
                    
                    detailsDiv.textContent = JSON.stringify(data, null, 2);
                })
                .catch(error => {
                    document.getElementById('status').textContent = '❌ Error checking status: ' + error.message;
                    document.getElementById('status').className = 'status not-running';
                });
        }
        
        function testWebSocket() {
            const wsStatusDiv = document.getElementById('ws-status');
            wsStatusDiv.style.display = 'block';
            wsStatusDiv.textContent = 'Testing WebSocket connection...';
            wsStatusDiv.className = 'status loading';
            
            const wsUrl = 'ws://{{ env("REVERB_HOST") }}:{{ env("REVERB_PORT") }}/app/{{ env("REVERB_APP_KEY") }}';
            const ws = new WebSocket(wsUrl);
            
            const timeout = setTimeout(() => {
                ws.close();
                wsStatusDiv.textContent = '⚠️ WebSocket connection timeout';
                wsStatusDiv.className = 'status not-running';
            }, 10000);
            
            ws.onopen = function() {
                clearTimeout(timeout);
                wsStatusDiv.textContent = '✅ WebSocket connected successfully!';
                wsStatusDiv.className = 'status running';
                ws.close();
            };
            
            ws.onerror = function(error) {
                clearTimeout(timeout);
                wsStatusDiv.textContent = '❌ WebSocket connection failed';
                wsStatusDiv.className = 'status not-running';
            };
            
            ws.onclose = function() {
                // Connection closed (normal after successful test)
            };
        }
        
        // Auto-load status on page load
        window.onload = checkStatus;
    </script>
</body>
</html>