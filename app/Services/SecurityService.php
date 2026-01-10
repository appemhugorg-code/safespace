<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use HTMLPurifier;
use HTMLPurifier_Config;

class SecurityService
{
    private HTMLPurifier $purifier;

    public function __construct()
    {
        $config = HTMLPurifier_Config::createDefault();
        
        // Configure allowed HTML tags and attributes
        $config->set('HTML.Allowed', 'p,br,strong,em,u,ol,ul,li,a[href],h1,h2,h3,h4,h5,h6,blockquote');
        $config->set('HTML.AllowedAttributes', 'a.href');
        $config->set('URI.AllowedSchemes', 'http,https,mailto');
        $config->set('HTML.Nofollow', true);
        $config->set('HTML.TargetBlank', true);
        
        // Cache configuration
        $config->set('Cache.SerializerPath', storage_path('app/htmlpurifier'));
        
        $this->purifier = new HTMLPurifier($config);
    }

    /**
     * Sanitize HTML content for safe display.
     */
    public function sanitizeHtml(string $content): string
    {
        return $this->purifier->purify($content);
    }

    /**
     * Sanitize email content before sending.
     */
    public function sanitizeEmailContent(string $content): string
    {
        // Remove potentially dangerous content
        $content = $this->sanitizeHtml($content);
        
        // Remove script tags and event handlers
        $content = preg_replace('/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/mi', '', $content);
        $content = preg_replace('/on\w+="[^"]*"/i', '', $content);
        
        return $content;
    }

    /**
     * Validate email addresses.
     */
    public function validateEmail(string $email): bool
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        // Check for suspicious patterns
        $suspiciousPatterns = [
            '/[<>]/',           // HTML tags
            '/javascript:/i',   // JavaScript protocol
            '/data:/i',         // Data protocol
            '/vbscript:/i',     // VBScript protocol
        ];

        foreach ($suspiciousPatterns as $pattern) {
            if (preg_match($pattern, $email)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Sanitize user input for database storage.
     */
    public function sanitizeInput(string $input): string
    {
        // Remove null bytes
        $input = str_replace("\0", '', $input);
        
        // Trim whitespace
        $input = trim($input);
        
        // Remove control characters except newlines and tabs
        $input = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $input);
        
        return $input;
    }

    /**
     * Generate secure random token.
     */
    public function generateSecureToken(int $length = 32): string
    {
        return Str::random($length);
    }

    /**
     * Validate file upload security.
     */
    public function validateFileUpload(string $filename, string $mimeType, int $fileSize): array
    {
        $errors = [];

        // Check file extension
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'];
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        
        if (!in_array($extension, $allowedExtensions)) {
            $errors[] = 'File type not allowed';
        }

        // Check MIME type
        $allowedMimeTypes = [
            'image/jpeg',
            'image/png', 
            'image/gif',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (!in_array($mimeType, $allowedMimeTypes)) {
            $errors[] = 'Invalid file type';
        }

        // Check file size (10MB limit)
        if ($fileSize > 10 * 1024 * 1024) {
            $errors[] = 'File size too large';
        }

        // Check for suspicious filename patterns
        $suspiciousPatterns = [
            '/\.php$/i',
            '/\.exe$/i',
            '/\.bat$/i',
            '/\.sh$/i',
            '/\.js$/i',
        ];

        foreach ($suspiciousPatterns as $pattern) {
            if (preg_match($pattern, $filename)) {
                $errors[] = 'Suspicious file type detected';
                break;
            }
        }

        return $errors;
    }

    /**
     * Log security event.
     */
    public function logSecurityEvent(string $event, array $context = []): void
    {
        Log::channel('security')->warning($event, array_merge($context, [
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'user_id' => auth()->id(),
            'timestamp' => now()->toISOString(),
        ]));
    }

    /**
     * Check for suspicious activity patterns.
     */
    public function detectSuspiciousActivity(string $activity, array $context = []): bool
    {
        $suspicious = false;

        // Check for rapid requests (basic rate limiting detection)
        $cacheKey = 'security_activity_' . request()->ip() . '_' . $activity;
        $attempts = cache()->get($cacheKey, 0);
        
        if ($attempts > 10) { // More than 10 attempts in the time window
            $suspicious = true;
        }

        cache()->put($cacheKey, $attempts + 1, now()->addMinutes(5));

        if ($suspicious) {
            $this->logSecurityEvent("Suspicious activity detected: {$activity}", $context);
        }

        return $suspicious;
    }

    /**
     * Validate API request authenticity.
     */
    public function validateApiRequest(array $headers): bool
    {
        // Check for required headers
        $requiredHeaders = ['User-Agent', 'Accept'];
        
        foreach ($requiredHeaders as $header) {
            if (!isset($headers[$header])) {
                $this->logSecurityEvent('Missing required header in API request', [
                    'missing_header' => $header
                ]);
                return false;
            }
        }

        // Check for suspicious user agents
        $suspiciousAgents = [
            'curl',
            'wget',
            'python-requests',
            'bot',
            'crawler',
            'spider'
        ];

        $userAgent = strtolower($headers['User-Agent'] ?? '');
        
        foreach ($suspiciousAgents as $agent) {
            if (strpos($userAgent, $agent) !== false) {
                $this->logSecurityEvent('Suspicious user agent detected', [
                    'user_agent' => $userAgent
                ]);
                // Don't block, just log for now
                break;
            }
        }

        return true;
    }

    /**
     * Encrypt sensitive data before storage.
     */
    public function encryptSensitiveData(string $data): string
    {
        return encrypt($data);
    }

    /**
     * Decrypt sensitive data after retrieval.
     */
    public function decryptSensitiveData(string $encryptedData): string
    {
        try {
            return decrypt($encryptedData);
        } catch (\Exception $e) {
            $this->logSecurityEvent('Failed to decrypt sensitive data', [
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Generate content security policy header.
     */
    public function generateCSPHeader(): string
    {
        $isLocal = app()->environment('local');
        
        if ($isLocal) {
            // Very permissive CSP for local development
            $directives = [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5173 ws://localhost:5173 https://cdn.jsdelivr.net",
                "script-src-elem 'self' 'unsafe-inline' http://localhost:5173",
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.bunny.net",
                "font-src 'self' https://fonts.gstatic.com https://fonts.bunny.net",
                "img-src 'self' data: https:",
                "connect-src 'self' http://localhost:5173 ws://localhost:5173 wss://localhost:8080",
                "frame-ancestors 'none'",
                "base-uri 'self'",
                "form-action 'self'"
            ];
        } else {
            // Strict CSP for production
            $directives = [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.bunny.net",
                "font-src 'self' https://fonts.gstatic.com https://fonts.bunny.net",
                "img-src 'self' data: https:",
                "connect-src 'self' ws: wss:",
                "frame-ancestors 'none'",
                "base-uri 'self'",
                "form-action 'self'"
            ];
        }

        return implode('; ', $directives);
    }
}