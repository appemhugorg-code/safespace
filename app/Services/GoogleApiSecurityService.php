<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Exception;

class GoogleApiSecurityService
{
    private const RATE_LIMIT_KEY = 'google_api_requests';
    private const MAX_REQUESTS_PER_MINUTE = 100;
    private const MAX_REQUESTS_PER_HOUR = 1000;

    /**
     * Check if we can make a Google API request (rate limiting).
     */
    public function canMakeRequest(string $operation = 'general'): bool
    {
        $minuteKey = self::RATE_LIMIT_KEY . '_minute_' . $operation;
        $hourKey = self::RATE_LIMIT_KEY . '_hour_' . $operation;

        // Check per-minute limit
        if (RateLimiter::tooManyAttempts($minuteKey, self::MAX_REQUESTS_PER_MINUTE)) {
            Log::warning('Google API rate limit exceeded (per minute)', [
                'operation' => $operation,
                'limit' => self::MAX_REQUESTS_PER_MINUTE,
            ]);
            return false;
        }

        // Check per-hour limit
        if (RateLimiter::tooManyAttempts($hourKey, self::MAX_REQUESTS_PER_HOUR)) {
            Log::warning('Google API rate limit exceeded (per hour)', [
                'operation' => $operation,
                'limit' => self::MAX_REQUESTS_PER_HOUR,
            ]);
            return false;
        }

        return true;
    }

    /**
     * Record a Google API request for rate limiting.
     */
    public function recordRequest(string $operation = 'general'): void
    {
        $minuteKey = self::RATE_LIMIT_KEY . '_minute_' . $operation;
        $hourKey = self::RATE_LIMIT_KEY . '_hour_' . $operation;

        RateLimiter::hit($minuteKey, 60); // 1 minute window
        RateLimiter::hit($hourKey, 3600); // 1 hour window
    }

    /**
     * Validate Google API response for security issues.
     */
    public function validateApiResponse(array $response, string $operation): bool
    {
        // Check for error responses
        if (isset($response['error'])) {
            Log::warning('Google API error response', [
                'operation' => $operation,
                'error' => $response['error'],
            ]);

            // Check for quota exceeded
            if (isset($response['error']['code']) && $response['error']['code'] === 429) {
                $this->handleQuotaExceeded($operation);
            }

            return false;
        }

        // Validate response structure
        if (!is_array($response)) {
            Log::warning('Invalid Google API response format', [
                'operation' => $operation,
                'response_type' => gettype($response),
            ]);
            return false;
        }

        return true;
    }

    /**
     * Sanitize data before sending to Google APIs.
     */
    public function sanitizeApiData(array $data): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            if (is_string($value)) {
                // Remove potentially dangerous content
                $value = strip_tags($value);
                $value = preg_replace('/[^\p{L}\p{N}\s\-_@.]/u', '', $value);
                $value = trim($value);
            }

            if (is_array($value)) {
                $value = $this->sanitizeApiData($value);
            }

            $sanitized[$key] = $value;
        }

        return $sanitized;
    }

    /**
     * Validate Google OAuth token security.
     */
    public function validateOAuthToken(string $token): bool
    {
        // Check token format
        if (empty($token) || strlen($token) < 10) {
            Log::warning('Invalid OAuth token format');
            return false;
        }

        // Check for suspicious patterns
        $suspiciousPatterns = [
            '/[<>]/',           // HTML tags
            '/javascript:/i',   // JavaScript protocol
            '/data:/i',         // Data protocol
            '/\x00/',           // Null bytes
        ];

        foreach ($suspiciousPatterns as $pattern) {
            if (preg_match($pattern, $token)) {
                Log::warning('Suspicious OAuth token detected', [
                    'pattern' => $pattern,
                ]);
                return false;
            }
        }

        return true;
    }

    /**
     * Encrypt Google API credentials before storage.
     */
    public function encryptCredentials(array $credentials): string
    {
        try {
            return encrypt(json_encode($credentials));
        } catch (Exception $e) {
            Log::error('Failed to encrypt Google API credentials', [
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Decrypt Google API credentials after retrieval.
     */
    public function decryptCredentials(string $encryptedCredentials): array
    {
        try {
            $decrypted = decrypt($encryptedCredentials);
            return json_decode($decrypted, true) ?? [];
        } catch (Exception $e) {
            Log::error('Failed to decrypt Google API credentials', [
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Cache Google API responses securely.
     */
    public function cacheResponse(string $key, array $data, int $ttl = 300): void
    {
        // Sanitize cache key
        $key = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $key);
        
        // Encrypt sensitive data before caching
        $encryptedData = encrypt(json_encode($data));
        
        Cache::put("google_api_{$key}", $encryptedData, $ttl);
    }

    /**
     * Retrieve cached Google API response.
     */
    public function getCachedResponse(string $key): ?array
    {
        // Sanitize cache key
        $key = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $key);
        
        $encryptedData = Cache::get("google_api_{$key}");
        
        if (!$encryptedData) {
            return null;
        }

        try {
            $decrypted = decrypt($encryptedData);
            return json_decode($decrypted, true);
        } catch (Exception $e) {
            Log::warning('Failed to decrypt cached Google API response', [
                'key' => $key,
                'error' => $e->getMessage(),
            ]);
            
            // Remove corrupted cache entry
            Cache::forget("google_api_{$key}");
            return null;
        }
    }

    /**
     * Handle quota exceeded scenarios.
     */
    private function handleQuotaExceeded(string $operation): void
    {
        // Implement exponential backoff
        $backoffKey = "google_api_backoff_{$operation}";
        $currentBackoff = Cache::get($backoffKey, 1);
        $newBackoff = min($currentBackoff * 2, 300); // Max 5 minutes

        Cache::put($backoffKey, $newBackoff, $newBackoff);

        Log::warning('Google API quota exceeded, implementing backoff', [
            'operation' => $operation,
            'backoff_seconds' => $newBackoff,
        ]);
    }

    /**
     * Check if operation is in backoff period.
     */
    public function isInBackoff(string $operation): bool
    {
        $backoffKey = "google_api_backoff_{$operation}";
        return Cache::has($backoffKey);
    }

    /**
     * Log Google API security event.
     */
    public function logSecurityEvent(string $event, array $context = []): void
    {
        Log::channel('security')->warning("Google API Security: {$event}", array_merge($context, [
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'user_id' => auth()->id(),
            'timestamp' => now()->toISOString(),
        ]));
    }

    /**
     * Validate meeting link security.
     */
    public function validateMeetingLink(string $link): bool
    {
        // Check if it's a valid Google Meet link
        if (!preg_match('/^https:\/\/meet\.google\.com\/[a-z0-9\-]+$/i', $link)) {
            $this->logSecurityEvent('Invalid meeting link format', [
                'link' => $link,
            ]);
            return false;
        }

        return true;
    }

    /**
     * Generate secure meeting room name.
     */
    public function generateSecureMeetingRoom(): string
    {
        // Generate a secure random room name
        $characters = 'abcdefghijklmnopqrstuvwxyz';
        $roomName = '';
        
        for ($i = 0; $i < 3; $i++) {
            for ($j = 0; $j < 4; $j++) {
                $roomName .= $characters[random_int(0, strlen($characters) - 1)];
            }
            if ($i < 2) {
                $roomName .= '-';
            }
        }

        return $roomName;
    }
}