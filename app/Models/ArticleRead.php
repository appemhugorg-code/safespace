<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticleRead extends Model
{
    protected $fillable = [
        'article_id',
        'user_id',
        'reading_time_seconds',
        'completed',
    ];

    protected $casts = [
        'completed' => 'boolean',
    ];

    /**
     * Get the article that was read
     */
    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }

    /**
     * Get the user who read the article
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
