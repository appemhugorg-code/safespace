<?php

namespace App\Services;

use App\Models\SessionLog;
use App\Models\SessionNote;
use App\Models\SessionAuditTrail;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SessionLogService
{
    /**
     * Start a new session.
     */
    public function startSession(array $data): SessionLog
    {
        $sessionLog = SessionLog::create([
            'session_id' => $data['session_id'] ?? Str::uuid(),
            'start_time' => now(),
            'status' => 'active',
            'type' => $data['type'] ?? 'therapy-session',
            'participants' => [],
            'appointment_id' => $data['appointment_id'] ?? null,
            'therapist_id' => $data['therapist_id'],
            'client_ids' => $data['client_ids'] ?? [],
            'guardian_ids' => $data['guardian_ids'] ?? [],
            'session_goals' => $data['session_goals'] ?? [],
            'hipaa_compliant' => true,
            'consent_obtained' => $data['consent_obtained'] ?? true,
            'data_retention_applied' => true,
        ]);

        // Log session start
        $this->logAuditEntry($sessionLog->session_id, [
            'action' => 'session_started',
            'details' => [
                'session_type' => $sessionLog->type,
                'participant_count' => count($sessionLog->client_ids) + 1,
                'appointment_id' => $sessionLog->appointment_id,
            ],
        ]);

        Log::info('Session started', [
            'session_id' => $sessionLog->session_id,
            'type' => $sessionLog->type,
            'therapist_id' => $sessionLog->therapist_id,
        ]);

        return $sessionLog;
    }

    /**
     * End a session.
     */
    public function endSession(string $sessionId, array $data = []): SessionLog
    {
        $sessionLog = SessionLog::where('session_id', $sessionId)->firstOrFail();
        
        if ($sessionLog->status !== 'active') {
            throw new \Exception('Session is not active');
        }

        $endTime = now();
        $duration = $endTime->diffInSeconds($sessionLog->start_time);

        $sessionLog->update([
            'end_time' => $endTime,
            'duration' => $duration,
            'status' => 'completed',
            'outcomes' => $data['outcomes'] ?? [],
            'next_steps' => $data['next_steps'] ?? [],
        ]);

        // Log session end
        $this->logAuditEntry($sessionLog->session_id, [
            'action' => 'session_ended',
            'details' => [
                'duration' => $duration,
                'participant_count' => count($sessionLog->participants),
                'notes_count' => $sessionLog->notes()->count(),
                'outcomes' => $data['outcomes'] ?? [],
            ],
        ]);

        Log::info('Session ended', [
            'session_id' => $sessionLog->session_id,
            'duration' => $duration,
        ]);

        return $sessionLog;
    }

    /**
     * Add a participant to the session.
     */
    public function addParticipant(string $sessionId, array $participantData): SessionLog
    {
        $sessionLog = SessionLog::where('session_id', $sessionId)->firstOrFail();
        
        if ($sessionLog->status !== 'active') {
            throw new \Exception('Cannot add participant to inactive session');
        }

        $sessionLog->addParticipant($participantData);

        // Log participant join
        $this->logAuditEntry($sessionLog->session_id, [
            'action' => 'participant_joined',
            'details' => [
                'participant_id' => $participantData['id'],
                'participant_name' => $participantData['name'],
                'participant_role' => $participantData['role'],
            ],
        ]);

        Log::info('Participant joined session', [
            'session_id' => $sessionLog->session_id,
            'participant_id' => $participantData['id'],
            'role' => $participantData['role'],
        ]);

        return $sessionLog;
    }

    /**
     * Remove a participant from the session.
     */
    public function removeParticipant(string $sessionId, string $participantId): SessionLog
    {
        $sessionLog = SessionLog::where('session_id', $sessionId)->firstOrFail();
        
        $sessionLog->updateParticipantLeave($participantId);

        // Log participant leave
        $this->logAuditEntry($sessionLog->session_id, [
            'action' => 'participant_left',
            'details' => [
                'participant_id' => $participantId,
            ],
        ]);

        Log::info('Participant left session', [
            'session_id' => $sessionLog->session_id,
            'participant_id' => $participantId,
        ]);

        return $sessionLog;
    }

    /**
     * Add a note to the session.
     */
    public function addNote(string $sessionId, array $noteData, User $author): SessionNote
    {
        $sessionLog = SessionLog::where('session_id', $sessionId)->firstOrFail();
        
        // Verify author is a participant
        if (!$sessionLog->hasParticipant($author)) {
            throw new \Exception('Author is not a participant in this session');
        }

        $note = SessionNote::create([
            'session_id' => $sessionId,
            'author_id' => $author->id,
            'author_role' => $sessionLog->getParticipantRole($author),
            'content' => $this->encryptContent($noteData['content']),
            'timestamp' => now(),
            'type' => $noteData['type'],
            'tags' => $noteData['tags'] ?? [],
            'is_private' => $noteData['is_private'] ?? false,
            'encryption_algorithm' => 'AES-256-GCM',
            'encryption_key_id' => Str::uuid(),
            'encrypted' => true,
            'checksum' => $this->calculateChecksum($noteData['content']),
        ]);

        // Log note addition
        $this->logAuditEntry($sessionLog->session_id, [
            'action' => 'note_added',
            'details' => [
                'note_id' => $note->id,
                'note_type' => $note->type,
                'content_length' => strlen($noteData['content']),
                'is_private' => $note->is_private,
                'author_role' => $note->author_role,
            ],
        ]);

        Log::info('Session note added', [
            'session_id' => $sessionLog->session_id,
            'note_id' => $note->id,
            'type' => $note->type,
            'author_id' => $author->id,
        ]);

        return $note;
    }

    /**
     * Get session notes for a user.
     */
    public function getSessionNotes(string $sessionId, User $user, array $filters = [])
    {
        $sessionLog = SessionLog::where('session_id', $sessionId)->firstOrFail();
        
        // Verify user is a participant
        if (!$sessionLog->hasParticipant($user)) {
            throw new \Exception('User is not a participant in this session');
        }

        $query = SessionNote::where('session_id', $sessionId)
                           ->accessibleBy($user);

        // Apply filters
        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['show_private']) && !$filters['show_private']) {
            $query->where('is_private', false);
        }

        if (isset($filters['tags'])) {
            foreach ($filters['tags'] as $tag) {
                $query->withTag($tag);
            }
        }

        $notes = $query->with('author')
                      ->orderBy('timestamp', 'asc')
                      ->get();

        // Decrypt content for display
        foreach ($notes as $note) {
            if ($note->encrypted) {
                $note->content = $this->decryptContent($note->content);
            }
        }

        return $notes;
    }

    /**
     * Update session goals.
     */
    public function updateSessionGoals(string $sessionId, array $goals, User $user): SessionLog
    {
        $sessionLog = SessionLog::where('session_id', $sessionId)->firstOrFail();
        
        // Only therapists can update session goals
        if ($sessionLog->therapist_id !== $user->id) {
            throw new \Exception('Only the session therapist can update goals');
        }

        $sessionLog->update(['session_goals' => $goals]);

        // Log goal update
        $this->logAuditEntry($sessionLog->session_id, [
            'action' => 'session_goals_updated',
            'details' => [
                'goals_count' => count($goals),
                'updated_by' => $user->id,
            ],
        ]);

        return $sessionLog;
    }

    /**
     * Update session outcomes.
     */
    public function updateSessionOutcomes(string $sessionId, array $outcomes, User $user): SessionLog
    {
        $sessionLog = SessionLog::where('session_id', $sessionId)->firstOrFail();
        
        // Only therapists can update session outcomes
        if ($sessionLog->therapist_id !== $user->id) {
            throw new \Exception('Only the session therapist can update outcomes');
        }

        $sessionLog->update(['outcomes' => $outcomes]);

        // Log outcome update
        $this->logAuditEntry($sessionLog->session_id, [
            'action' => 'session_outcomes_updated',
            'details' => [
                'outcomes_count' => count($outcomes),
                'updated_by' => $user->id,
            ],
        ]);

        return $sessionLog;
    }

    /**
     * Get sessions for a user.
     */
    public function getUserSessions(User $user, array $filters = [])
    {
        $query = SessionLog::query();

        // Filter by user role
        switch ($user->role) {
            case 'therapist':
                $query->where('therapist_id', $user->id);
                break;
            case 'client':
                $query->byClient($user->id);
                break;
            case 'guardian':
                $query->byGuardian($user->id);
                break;
            default:
                // Admin or other roles can see all sessions
                break;
        }

        // Apply additional filters
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['date_from'])) {
            $query->where('start_time', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->where('start_time', '<=', $filters['date_to']);
        }

        return $query->with(['therapist', 'recording', 'notes'])
                    ->orderBy('start_time', 'desc')
                    ->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Get session statistics for a user.
     */
    public function getSessionStatistics(User $user, array $filters = []): array
    {
        $query = SessionLog::query();

        // Filter by user role
        switch ($user->role) {
            case 'therapist':
                $query->where('therapist_id', $user->id);
                break;
            case 'client':
                $query->byClient($user->id);
                break;
            case 'guardian':
                $query->byGuardian($user->id);
                break;
        }

        // Apply date filters
        if (isset($filters['date_from'])) {
            $query->where('start_time', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->where('start_time', '<=', $filters['date_to']);
        }

        $sessions = $query->get();

        return [
            'total_sessions' => $sessions->count(),
            'completed_sessions' => $sessions->where('status', 'completed')->count(),
            'active_sessions' => $sessions->where('status', 'active')->count(),
            'total_duration' => $sessions->sum('duration'),
            'average_duration' => $sessions->where('status', 'completed')->avg('duration'),
            'sessions_with_recordings' => $sessions->whereNotNull('recording_id')->count(),
            'sessions_by_type' => $sessions->groupBy('type')->map->count(),
            'notes_count' => $sessions->sum(function ($session) {
                return $session->notes()->count();
            }),
        ];
    }

    /**
     * Encrypt note content.
     */
    protected function encryptContent(string $content): string
    {
        return Crypt::encrypt($content);
    }

    /**
     * Decrypt note content.
     */
    protected function decryptContent(string $encryptedContent): string
    {
        try {
            return Crypt::decrypt($encryptedContent);
        } catch (\Exception $e) {
            Log::error('Failed to decrypt note content', ['error' => $e->getMessage()]);
            return '[Encrypted content - decryption failed]';
        }
    }

    /**
     * Calculate content checksum.
     */
    protected function calculateChecksum(string $content): string
    {
        return hash('sha256', $content);
    }

    /**
     * Log audit entry for session actions.
     */
    protected function logAuditEntry(string $sessionId, array $data): void
    {
        $user = auth()->user();
        
        if (!$user) {
            return;
        }

        SessionAuditTrail::create([
            'session_id' => $sessionId,
            'user_id' => $user->id,
            'user_role' => $user->role ?? 'unknown',
            'action' => $data['action'],
            'details' => $data['details'] ?? [],
            'ip_address' => request()->ip() ?? '127.0.0.1',
            'user_agent' => request()->userAgent() ?? 'Unknown',
            'timestamp' => now(),
        ]);
    }
}