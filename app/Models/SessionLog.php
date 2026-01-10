<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class SessionLog extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'session_id',
        'start_time',
        'end_time',
        'duration',
        'status',
        'type',
        'participants',
        'appointment_id',
        'therapist_id',
        'client_ids',
        'guardian_ids',
        'session_goals',
        'outcomes',
        'next_steps',
        'hipaa_compliant',
        'consent_obtained',
        'data_retention_applied',
        'recording_id',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'participants' => 'array',
        'client_ids' => 'array',
        'guardian_ids' => 'array',
        'session_goals' => 'array',
        'outcomes' => 'array',
        'next_steps' => 'array',
        'hipaa_compliant' => 'boolean',
        'consent_obtained' => 'boolean',
        'data_retention_applied' => 'boolean',
    ];

    /**
     * Get the therapist for this session.
     */
    public function therapist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'therapist_id');
    }

    /**
     * Get the clients for this session.
     */
    public function clients()
    {
        return User::whereIn('id', $this->client_ids ?? []);
    }

    /**
     * Get the guardians for this session.
     */
    public function guardians()
    {
        return User::whereIn('id', $this->guardian_ids ?? []);
    }

    /**
     * Get the recording for this session.
     */
    public function recording(): HasOne
    {
        return $this->hasOne(SessionRecording::class, 'session_id', 'session_id');
    }

    /**
     * Get the notes for this session.
     */
    public function notes(): HasMany
    {
        return $this->hasMany(SessionNote::class, 'session_id', 'session_id');
    }

    /**
     * Get the audit trail for this session.
     */
    public function auditTrail(): HasMany
    {
        return $this->hasMany(SessionAuditTrail::class, 'session_id', 'session_id');
    }

    /**
     * Get all participants as User models.
     */
    public function getAllParticipants()
    {
        $participantIds = collect($this->client_ids ?? [])
            ->merge($this->guardian_ids ?? [])
            ->push($this->therapist_id)
            ->unique()
            ->filter();

        return User::whereIn('id', $participantIds)->get();
    }

    /**
     * Check if user is a participant in this session.
     */
    public function hasParticipant(User $user): bool
    {
        return $user->id === $this->therapist_id ||
               in_array($user->id, $this->client_ids ?? []) ||
               in_array($user->id, $this->guardian_ids ?? []);
    }

    /**
     * Get participant role for a user.
     */
    public function getParticipantRole(User $user): ?string
    {
        if ($user->id === $this->therapist_id) {
            return 'therapist';
        }
        
        if (in_array($user->id, $this->client_ids ?? [])) {
            return 'client';
        }
        
        if (in_array($user->id, $this->guardian_ids ?? [])) {
            return 'guardian';
        }
        
        return null;
    }

    /**
     * Add a participant to the session.
     */
    public function addParticipant(array $participantData): void
    {
        $participants = $this->participants ?? [];
        $participants[] = array_merge($participantData, [
            'join_time' => now()->toISOString(),
            'total_duration' => 0,
        ]);
        
        $this->update(['participants' => $participants]);
    }

    /**
     * Update participant leave time.
     */
    public function updateParticipantLeave(string $participantId): void
    {
        $participants = $this->participants ?? [];
        
        foreach ($participants as &$participant) {
            if ($participant['id'] === $participantId && !isset($participant['leave_time'])) {
                $participant['leave_time'] = now()->toISOString();
                $joinTime = new \DateTime($participant['join_time']);
                $leaveTime = now();
                $participant['total_duration'] = $leaveTime->getTimestamp() - $joinTime->getTimestamp();
                break;
            }
        }
        
        $this->update(['participants' => $participants]);
    }

    /**
     * Get the duration in human readable format.
     */
    public function getFormattedDurationAttribute(): string
    {
        $seconds = $this->duration;
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $secs = $seconds % 60;
        
        if ($hours > 0) {
            return sprintf('%d:%02d:%02d', $hours, $minutes, $secs);
        }
        
        return sprintf('%d:%02d', $minutes, $secs);
    }

    /**
     * Check if session is currently active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if session is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if session has recording.
     */
    public function hasRecording(): bool
    {
        return !is_null($this->recording_id) && $this->recording()->exists();
    }

    /**
     * Scope for active sessions.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for completed sessions.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope for sessions by therapist.
     */
    public function scopeByTherapist($query, $therapistId)
    {
        return $query->where('therapist_id', $therapistId);
    }

    /**
     * Scope for sessions by client.
     */
    public function scopeByClient($query, $clientId)
    {
        return $query->whereJsonContains('client_ids', $clientId);
    }

    /**
     * Scope for sessions by guardian.
     */
    public function scopeByGuardian($query, $guardianId)
    {
        return $query->whereJsonContains('guardian_ids', $guardianId);
    }

    /**
     * Scope for sessions by type.
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope for HIPAA compliant sessions.
     */
    public function scopeHipaaCompliant($query)
    {
        return $query->where('hipaa_compliant', true)
                    ->where('consent_obtained', true)
                    ->where('data_retention_applied', true);
    }

    /**
     * Scope for sessions within date range.
     */
    public function scopeWithinDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('start_time', [$startDate, $endDate]);
    }
}