<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Reverb Server
    |--------------------------------------------------------------------------
    |
    | This option controls the default server used by Reverb to handle
    | WebSocket connections. This server is used when no server is
    | specified when starting the Reverb server.
    |
    */

    'default' => env('REVERB_SERVER', 'reverb'),

    /*
    |--------------------------------------------------------------------------
    | Reverb Servers
    |--------------------------------------------------------------------------
    |
    | Here you may define details for each of the servers used by your
    | application. Below is an example configuration for a server that
    | provides support for your application's broadcasting.
    |
    */

    'servers' => [

        'reverb' => [
            'host' => env('REVERB_HOST', '0.0.0.0'),
            'port' => env('REVERB_PORT', 8080),
            'hostname' => env('REVERB_HOSTNAME'),
            'options' => [
                'tls' => [],
            ],
            'max_request_size' => env('REVERB_MAX_REQUEST_SIZE', 10_000),
            'scaling' => [
                'enabled' => env('REVERB_SCALING_ENABLED', false),
                'channel' => env('REVERB_SCALING_CHANNEL', 'reverb'),
                'server' => [
                    'url' => env('REDIS_URL'),
                    'host' => env('REDIS_HOST', '127.0.0.1'),
                    'port' => env('REDIS_PORT', 6379),
                    'username' => env('REDIS_USERNAME'),
                    'password' => env('REDIS_PASSWORD'),
                    'database' => env('REDIS_DB', 0),
                ],
            ],
            'pulse_ingest_interval' => env('REVERB_PULSE_INGEST_INTERVAL', 15),
            'telescope_ingest_interval' => env('REVERB_TELESCOPE_INGEST_INTERVAL', 15),
            'pulse' => [
                'enabled' => env('REVERB_PULSE_ENABLED', true),
                'interval' => env('REVERB_PULSE_INTERVAL', 60),
                'ingest_interval' => env('REVERB_PULSE_INGEST_INTERVAL', 15),
            ],
            'telescope' => [
                'enabled' => env('REVERB_TELESCOPE_ENABLED', false),
                'ingest_interval' => env('REVERB_TELESCOPE_INGEST_INTERVAL', 15),
            ],
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Reverb Applications
    |--------------------------------------------------------------------------
    |
    | Here you may define how Reverb applications are managed. A default
    | configuration has been defined for you which uses the local driver
    | to manage a single application within the local environment.
    |
    */

    'apps' => [

        'provider' => 'config',

        'apps' => [
            [
                'key' => env('REVERB_APP_KEY'),
                'secret' => env('REVERB_APP_SECRET'),
                'app_id' => env('REVERB_APP_ID'),
                'options' => [
                    'host' => env('REVERB_HOST'),
                    'port' => env('REVERB_PORT', 443),
                    'scheme' => env('REVERB_SCHEME', 'https'),
                    'useTLS' => env('REVERB_SCHEME', 'https') === 'https',
                    'max_message_size' => env('REVERB_APP_MAX_MESSAGE_SIZE', 10_000),
                    'max_request_size' => env('REVERB_MAX_REQUEST_SIZE', 10000),
                ],
                'allowed_origins' => ['*'],
                'ping_interval' => env('REVERB_PING_INTERVAL', 60),
                'activity_timeout' => env('REVERB_ACTIVITY_TIMEOUT', 30),
            ],
        ],

    ],

];