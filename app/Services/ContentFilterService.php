<?php

namespace App\Services;

use App\Models\Message;
use App\Models\MessageFlag;

class ContentFilterService
{
    /**
     * Profanity and inappropriate content patterns.
     */
    private array $profanityPatterns = [
        // Basic profanity detection patterns
        '/\b(damn|hell|crap|stupid|idiot|moron)\b/i',
        // Add more patterns as needed
    ];

    /**
     * Spam detection patterns.
     */
    private array $spamPatterns = [
        '/\b(buy now|click here|free money|make money fast|urgent|limited time)\b/i',
        '/(.)\1{4,}/', // Repeated characters
        '/[A-Z]{5,}/', // Excessive caps
    ];

    /**
     * Harassment detection patterns.
     */
    private array $harassmentPatterns = [
        '/\b(kill yourself|kys|die|hate you|worthless|pathetic)\b/i',
        '/\b(shut up|go away|nobody likes you|loser)\b/i',
    ];

    /**
     * Self-harm detection patterns.
     */
    private array $selfHarmPatterns = [
        '/\b(want to die|kill myself|end it all|suicide|self harm|cut myself)\b/i',
        '/\b(not worth living|better off dead|hurt myself)\b/i',
    ];

    /**
     * Violence and threats detection patterns.
     */
    private array $violencePatterns = [
        '/\b(kill you|hurt you|beat you up|gonna get you)\b/i',
        '/\b(violence|attack|fight|punch|hit)\b/i',
    ];

    /**
     * Filter settings.
     */
    private array $settings = [
        'profanity' => ['enabled' => true, 'sensitivity' => 'medium'],
        'spam' => ['enabled' => true, 'sensitivity' => 'high'],
        'harassment' => ['enabled' => true, 'sensitivity' => 'high'],
        'self_harm' => ['enabled' => true, 'sensitivity' => 'high'],
        'violence' => ['enabled' => true, 'sensitivity' => 'high'],
    ];

    /**
     * Analyze message content for inappropriate content.
     */
    public function analyzeMessage(Message $message): array
    {
        $content = strtolower($message->content);
        $flags = [];

        // Check for profanity
        if ($this->settings['profanity']['enabled'] && $this->detectProfanity($content)) {
            $flags[] = [
                'type' => 'inappropriate',
                'confidence' => $this->calculateConfidence('profanity', $content),
                'reason' => 'Inappropriate language detected',
            ];
        }

        // Check for spam
        if ($this->settings['spam']['enabled'] && $this->detectSpam($content)) {
            $flags[] = [
                'type' => 'spam',
                'confidence' => $this->calculateConfidence('spam', $content),
                'reason' => 'Spam content detected',
            ];
        }

        // Check for harassment
        if ($this->settings['harassment']['enabled'] && $this->detectHarassment($content)) {
            $flags[] = [
                'type' => 'harassment',
                'confidence' => $this->calculateConfidence('harassment', $content),
                'reason' => 'Harassment detected',
            ];
        }

        // Check for self-harm content
        if ($this->settings['self_harm']['enabled'] && $this->detectSelfHarm($content)) {
            $flags[] = [
                'type' => 'self_harm',
                'confidence' => $this->calculateConfidence('self_harm', $content),
                'reason' => 'Self-harm content detected',
            ];
        }

        // Check for violence/threats
        if ($this->settings['violence']['enabled'] && $this->detectViolence($content)) {
            $flags[] = [
                'type' => 'violence',
                'confidence' => $this->calculateConfidence('violence', $content),
                'reason' => 'Violence or threats detected',
            ];
        }

        return $flags;
    }

    /**
     * Auto-flag message if confidence is high enough.
     */
    public function autoFlagIfNeeded(Message $message): void
    {
        $analysis = $this->analyzeMessage($message);

        foreach ($analysis as $flag) {
            // Auto-flag if confidence is high (>= 0.8)
            if ($flag['confidence'] >= 0.8) {
                MessageFlag::create([
                    'message_id' => $message->id,
                    'flagged_by' => null, // System flag
                    'flag_type' => $flag['type'],
                    'reason' => $flag['reason'].' (Auto-detected)',
                    'status' => 'pending',
                ]);

                // Mark message as flagged
                $message->update(['is_flagged' => true]);
            }
        }
    }

    /**
     * Detect profanity in content.
     */
    private function detectProfanity(string $content): bool
    {
        foreach ($this->profanityPatterns as $pattern) {
            if (preg_match($pattern, $content)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Detect spam in content.
     */
    private function detectSpam(string $content): bool
    {
        foreach ($this->spamPatterns as $pattern) {
            if (preg_match($pattern, $content)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Detect harassment in content.
     */
    private function detectHarassment(string $content): bool
    {
        foreach ($this->harassmentPatterns as $pattern) {
            if (preg_match($pattern, $content)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Detect self-harm content.
     */
    private function detectSelfHarm(string $content): bool
    {
        foreach ($this->selfHarmPatterns as $pattern) {
            if (preg_match($pattern, $content)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Detect violence/threats in content.
     */
    private function detectViolence(string $content): bool
    {
        foreach ($this->violencePatterns as $pattern) {
            if (preg_match($pattern, $content)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Calculate confidence score for a detection type.
     */
    private function calculateConfidence(string $type, string $content): float
    {
        $patterns = match ($type) {
            'profanity' => $this->profanityPatterns,
            'spam' => $this->spamPatterns,
            'harassment' => $this->harassmentPatterns,
            'self_harm' => $this->selfHarmPatterns,
            'violence' => $this->violencePatterns,
            default => [],
        };

        $matches = 0;
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $content)) {
                $matches++;
            }
        }

        // Base confidence on number of pattern matches and sensitivity setting
        $sensitivity = $this->settings[$type]['sensitivity'] ?? 'medium';
        $baseConfidence = min($matches / count($patterns), 1.0);

        return match ($sensitivity) {
            'low' => $baseConfidence * 0.6,
            'medium' => $baseConfidence * 0.8,
            'high' => $baseConfidence * 1.0,
            default => $baseConfidence * 0.8,
        };
    }

    /**
     * Update filter settings.
     */
    public function updateSettings(array $settings): void
    {
        $this->settings = array_merge($this->settings, $settings);
    }

    /**
     * Get current filter settings.
     */
    public function getSettings(): array
    {
        return $this->settings;
    }
}
