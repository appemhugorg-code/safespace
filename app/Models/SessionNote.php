<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class SessionNote extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'session_id',
        'author_id',
        'author_role',
        'content',
        'timestamp',
        'type',
        'tags',
        'is_private',
        'encryption_algorithm',
        'encryption_key_id',
        'encrypted',
        'checksum',
    ];

    protected $casts = [
        'timestamp' => 'datetime',
        'tags' => 'array',
        'is_private' => 'boolean',
        'encrypted' => 'boolean',
    ];

    /**
     * Get the session log that owns this note.
     */
    public function sessionLog(): BelongsTo
    {
        return $this->belongsTo(SessionLog::class, 'session_id', 'session_id');
    }

    /**
     * Get the author of this note.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Check if the note is accessible by a user.
     */
    public function isAccessibleBy(User $user): bool
    {
        // Private notes are only accessible by the author
        if ($this->is_private && $user->id !== $this->author_id) {
            return false;
        }

        // Check if user is a participant in the session
        $sessionLog = $this->sessionLog;
        if (!$sessionLog || !$sessionLog->hasParticipant($user)) {
            return false;
        }

        // Crisis notes have special access rules
        if ($this->type === 'crisis_note') {
            // Only therapists and the author can access crisis notes
            $userRole = $sessionLog->getParticipantRole($user);
            return $userRole === 'therapist' || $user->id === $this->author_id;
        }

        return true;
    }

    /**
     * Check if the note can be edited by a user.
     */
    public function canBeEditedBy(User $user): bool
    {
        // Only the author can edit notes
        if ($user->id !== $this->author_id) {
            return false;
        }

        // Notes can only be edited within 24 hours of creation
        return $this->created_at->diffInHours(now()) <= 24;
    }

    /**
     * Get the content length.
     */
    public function getContentLengthAttribute(): int
    {
        return strlen($this->content);
    }

    /**
     * Get formatted timestamp.
     */
    public function getFormattedTimestampAttribute(): string
    {
        return $this->timestamp->format('H:i:s');
    }

    /**
     * Get note type configuration.
     */
    public function getTypeConfigAttribute(): array
    {
        $configs = [
            'session_summary' => ['label' => 'Session Summary', 'color' => 'blue'],
            'progress_note' => ['label' => 'Progress Note', 'color' => 'green'],
            'observation' => ['label' => 'Observation', 'color' => 'purple'],
            'action_item' => ['label' => 'Action Item', 'color' => 'orange'],
            'crisis_note' => ['label' => 'Crisis Note', 'color' => 'red'],
        ];

        return $configs[$this->type] ?? ['label' => 'Unknown', 'color' => 'gray'];
    }

    /**
     * Scope for notes by author.
     */
    public function scopeByAuthor($query, $authorId)
    {
        return $query->where('author_id', $authorId);
    }

    /**
     * Scope for notes by type.
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope for public notes.
     */
    public function scopePublic($query)
    {
        return $query->where('is_private', false);
    }

    /**
     * Scope for private notes.
     */
    public function scopePrivate($query)
    {
        return $query->where('is_private', true);
    }

    /**
     * Scope for notes with specific tags.
     */
    public function scopeWithTag($query, $tag)
    {
        return $query->whereJsonContains('tags', $tag);
    }

    /**
     * Scope for notes within date range.
     */
    public function scopeWithinDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('timestamp', [$startDate, $endDate]);
    }

    /**
     * Scope for crisis notes.
     */
    public function scopeCrisisNotes($query)
    {
        return $query->where('type', 'crisis_note');
    }

    /**
     * Scope for encrypted notes.
     */
    public function scopeEncrypted($query)
    {
        return $query->where('encrypted', true);
    }

    /**
     * Scope for notes accessible by user.
     */
    public function scopeAccessibleBy($query, User $user)
    {
        return $query->whereHas('sessionLog', function ($sessionQuery) use ($user) {
            $sessionQuery->where('therapist_id', $user->id)
                        ->orWhereJsonContains('client_ids', $user->id)
                        ->orWhereJsonContains('guardian_ids', $user->id);
        })->where(function ($noteQuery) use ($user) {
            $noteQuery->where('is_private', false)
                     ->orWhere('author_id', $user->id);
        });
    }
}