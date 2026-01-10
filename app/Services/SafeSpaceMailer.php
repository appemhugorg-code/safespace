<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SafeSpaceMailer
{
    private const FALLBACK_EMAIL = 'straycat.ai@gmail.com';

    /**
     * Send email with automatic fallback handling for domain restrictions.
     */
    public static function send(string $email, $mailable, string $emailType = 'notification'): bool
    {
        try {
            Mail::to($email)->send($mailable);
            
            Log::info("Email sent successfully", [
                'email' => $email,
                'email_type' => $emailType,
                'mail_driver' => config('mail.default')
            ]);
            
            return true;
            
        } catch (\Exception $e) {
            // Check if it's a domain restriction error
            if (self::isResendDomainError($e)) {
                return self::sendWithFallback($email, $mailable, $emailType, $e);
            }
            
            // For other errors, log and try fallback anyway
            Log::error("Email sending failed", [
                'email' => $email,
                'email_type' => $emailType,
                'error' => $e->getMessage()
            ]);
            
            return self::sendWithFallback($email, $mailable, $emailType, $e);
        }
    }

    /**
     * Send email to fallback address when original fails.
     */
    private static function sendWithFallback(string $originalEmail, $mailable, string $emailType, \Exception $originalError): bool
    {
        try {
            Mail::to(self::FALLBACK_EMAIL)->send($mailable);
            
            Log::warning("Email redirected to fallback address", [
                'original_email' => $originalEmail,
                'fallback_email' => self::FALLBACK_EMAIL,
                'email_type' => $emailType,
                'original_error' => $originalError->getMessage(),
                'reason' => 'Domain restrictions or email delivery failure'
            ]);
            
            return true;
            
        } catch (\Exception $fallbackException) {
            Log::error("Failed to send email even with fallback", [
                'original_email' => $originalEmail,
                'fallback_email' => self::FALLBACK_EMAIL,
                'email_type' => $emailType,
                'original_error' => $originalError->getMessage(),
                'fallback_error' => $fallbackException->getMessage()
            ]);
            
            return false;
        }
    }

    /**
     * Check if the exception is related to domain restrictions.
     */
    private static function isResendDomainError(\Exception $e): bool
    {
        $message = strtolower($e->getMessage());
        
        return str_contains($message, 'domain is not verified') || 
               str_contains($message, 'can only send testing emails') ||
               str_contains($message, 'verify a domain at resend.com') ||
               str_contains($message, 'transportexception') ||
               str_contains($message, 'resend api failed');
    }

    /**
     * Get the fallback email address.
     */
    public static function getFallbackEmail(): string
    {
        return self::FALLBACK_EMAIL;
    }

    /**
     * Check if we're currently using fallback mode.
     */
    public static function isUsingFallback(): bool
    {
        return config('mail.from.address') === 'onboarding@resend.dev';
    }
}