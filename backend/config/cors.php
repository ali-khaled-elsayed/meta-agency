<?php

return [

    'paths' => ['api/*'],

    'allowed_methods' => ['GET', 'POST', 'OPTIONS'],

    'allowed_origins' => array_filter(array_map('trim', explode(',', (string) env('CORS_ALLOWED_ORIGINS', env('FRONTEND_URL', 'http://localhost:3000'))))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Accept', 'Accept-Language', 'Content-Type', 'X-Requested-With'],

    'exposed_headers' => [],

    'max_age' => 3600,

    'supports_credentials' => false,

];
