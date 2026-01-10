<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EmailTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'subject',
        'body_html',
        'body_text',
        'variables',
        'is_active',
    ];

    protected $casts = [
        'variables' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Compile the email template with provided variables.
     */
    public function compile(array $variables = []): array
    {
        $subject = $this->replaceVariables($this->subject, $variables);
        $bodyHtml = $this->replaceVariables($this->body_html, $variables);
        $bodyText = $this->body_text ? $this->replaceVariables($this->body_text, $variables) : null;

        return [
            'subject' => $subject,
            'body_html' => $bodyHtml,
            'body_text' => $bodyText,
        ];
    }

    /**
     * Replace template variables with actual values.
     */
    private function replaceVariables(string $content, array $variables): string
    {
        foreach ($variables as $key => $value) {
            $content = str_replace("{{$key}}", $value, $content);
        }

        return $content;
    }

    /**
     * Get active templates only.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Find template by name.
     */
    public static function findByName(string $name): ?self
    {
        return static::where('name', $name)->where('is_active', true)->first();
    }
}
