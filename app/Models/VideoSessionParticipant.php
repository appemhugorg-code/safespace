<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VideoSessionParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'video_session_id',
        'user_id',
        'name',
        'role',
        'is_audio_enabled',
        'is_video_enabled',
        'is_screen_sharing',
        'connection_state',
        'joined_at',
        'left_at',
        'total_duration',
        'metadata',
    ];

    protected $casts = [
        'is_audio_enabled' => 'boolean',
        'is_video_enabled' => 'boolean',
        'is_screen_sharing' => 'boolean',
        'joined_at' => 'datetime',
        'left_at' => 'datetime',
        'total_duration' => 'integer',
        'metadata' => 'array',
    ];

    protected $dates = [
        'joined_at',
        'left_at',
        'created_at',
        'updated_at',
    ];

    // Relationships
    public function videoSession(): BelongsTo
    {
        return $this->belongsTo(VideoSession::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->whereNull('left_at');
    }

    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    public function scopeConnected($query)
    {
        return $query->where('connection_state', 'connected');
    }

    // Accessors
    public function getIsActiveAttribute(): bool
    {
        return is_null($this->left_at);
    }

    public function getIsConnectedAttribute(): bool
    {
        return $this->connection_state === 'connected';
    }

    public function getDurationInSessionAttribute(): int
    {
        if (!$this->joined_at) {
            return 0;
        }

        $endTime = $this->left_at ?? now();
        return $this->joined_at->diffInMinutes($endTime);
    }

    // Methods
    public function updateConnectionState(string $state): void
    {
        $this->update(['connection_state' => $state]);
    }

    public function toggleAudio(bool $enabled): void
    {
        $this->update(['is_audio_enabled' => $enabled]);
    }

    public function toggleVideo(bool $enabled): void
    {
        $this->update(['is_video_enabled' => $enabled]);
    }

    public function toggleScreenShare(bool $enabled): void
    {
        $this->update(['is_screen_sharing' => $enabled]);
    }

    public function leave(): void
    {
        $this->update([
            'left_at' => now(),
            'connection_state' => 'disconnected',
            'total_duration' => $this->duration_in_session,
        ]);
    }
}