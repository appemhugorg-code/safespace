<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class VideoSession extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'room_id',
        'name',
        'type',
        'status',
        'max_participants',
        'is_recording',
        'recording_url',
        'recording_duration',
        'start_time',
        'end_time',
        'scheduled_duration',
        'actual_duration',
        'session_notes',
        'metadata',
        'created_by',
        'therapist_id',
        'client_id',
        'guardian_id',
        'appointment_id',
    ];

    protected $casts = [
        'metadata' => 'array',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_recording' => 'boolean',
        'recording_duration' => 'integer',
        'scheduled_duration' => 'integer',
        'actual_duration' => 'integer',
    ];

    protected $dates = [
        'start_time',
        'end_time',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    // Relationships
    public function participants(): HasMany
    {
        return $this->hasMany(VideoSessionParticipant::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function therapist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'therapist_id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function guardian(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guardian_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByTherapist($query, $therapistId)
    {
        return $query->where('therapist_id', $therapistId);
    }

    public function scopeByParticipant($query, $userId)
    {
        return $query->whereHas('participants', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        });
    }

    // Accessors & Mutators
    public function getIsActiveAttribute(): bool
    {
        return $this->status === 'active';
    }

    public function getParticipantCountAttribute(): int
    {
        return $this->participants()->count();
    }

    public function getCanRecordAttribute(): bool
    {
        return $this->metadata['recordingConsent'] ?? false;
    }

    // Methods
    public function addParticipant(User $user, array $participantData): VideoSessionParticipant
    {
        return $this->participants()->create([
            'user_id' => $user->id,
            'name' => $participantData['name'] ?? $user->name,
            'role' => $participantData['role'] ?? 'client',
            'is_audio_enabled' => $participantData['isAudioEnabled'] ?? true,
            'is_video_enabled' => $participantData['isVideoEnabled'] ?? true,
            'is_screen_sharing' => $participantData['isScreenSharing'] ?? false,
            'connection_state' => $participantData['connectionState'] ?? 'connecting',
            'joined_at' => now(),
        ]);
    }

    public function removeParticipant(string $userId): bool
    {
        $participant = $this->participants()->where('user_id', $userId)->first();
        
        if ($participant) {
            $participant->update([
                'left_at' => now(),
                'connection_state' => 'disconnected',
            ]);
            return true;
        }

        return false;
    }

    public function startRecording(): void
    {
        $this->update([
            'is_recording' => true,
            'metadata' => array_merge($this->metadata ?? [], [
                'recording_started_at' => now()->toISOString(),
            ]),
        ]);
    }

    public function stopRecording(string $recordingUrl, int $duration): void
    {
        $this->update([
            'is_recording' => false,
            'recording_url' => $recordingUrl,
            'recording_duration' => $duration,
            'metadata' => array_merge($this->metadata ?? [], [
                'recording_stopped_at' => now()->toISOString(),
            ]),
        ]);
    }

    public function endSession(string $sessionNotes = null): void
    {
        $endTime = now();
        $actualDuration = $this->start_time ? 
            $this->start_time->diffInMinutes($endTime) : 0;

        $this->update([
            'status' => 'completed',
            'end_time' => $endTime,
            'actual_duration' => $actualDuration,
            'session_notes' => $sessionNotes,
        ]);

        // Mark all participants as left
        $this->participants()->whereNull('left_at')->update([
            'left_at' => $endTime,
            'connection_state' => 'disconnected',
        ]);
    }

    public function toArray(): array
    {
        return [
            'id' => $this->room_id,
            'name' => $this->name,
            'type' => $this->type,
            'participants' => $this->participants->map(function ($participant) {
                return [
                    'id' => $participant->user_id,
                    'name' => $participant->name,
                    'role' => $participant->role,
                    'isAudioEnabled' => $participant->is_audio_enabled,
                    'isVideoEnabled' => $participant->is_video_enabled,
                    'isScreenSharing' => $participant->is_screen_sharing,
                    'connectionState' => $participant->connection_state,
                ];
            })->toArray(),
            'maxParticipants' => $this->max_participants,
            'isRecording' => $this->is_recording,
            'startTime' => $this->start_time,
            'endTime' => $this->end_time,
            'metadata' => $this->metadata,
        ];
    }
}