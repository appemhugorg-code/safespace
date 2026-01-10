<?php

namespace App\Services;

use App\Models\VideoSession;
use App\Models\VideoSessionParticipant;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VideoSessionService
{
    /**
     * Create a new video session room
     */
    public function createRoom(string $name, string $type, int $maxParticipants, array $metadata, int $createdBy): VideoSession
    {
        return DB::transaction(function () use ($name, $type, $maxParticipants, $metadata, $createdBy) {
            $roomId = $this->generateRoomId();
            
            $session = VideoSession::create([
                'room_id' => $roomId,
                'name' => $name,
                'type' => $type,
                'status' => 'waiting',
                'max_participants' => $maxParticipants,
                'scheduled_duration' => $metadata['scheduledDuration'] ?? 60,
                'metadata' => $metadata,
                'created_by' => $createdBy,
                'therapist_id' => $metadata['therapistId'],
                'client_id' => $metadata['clientId'] ?? null,
                'guardian_id' => $metadata['guardianId'] ?? null,
                'appointment_id' => $metadata['appointmentId'] ?? null,
            ]);

            Log::info('Video session room created', [
                'room_id' => $roomId,
                'type' => $type,
                'therapist_id' => $metadata['therapistId'],
            ]);

            return $session;
        });
    }

    /**
     * Join a video session room
     */
    public function joinRoom(string $roomId, int $userId, array $participantData): array
    {
        return DB::transaction(function () use ($roomId, $userId, $participantData) {
            $session = VideoSession::where('room_id', $roomId)->firstOrFail();
            $user = User::findOrFail($userId);

            // Validate room capacity
            if ($session->participants()->active()->count() >= $session->max_participants) {
                throw new \Exception('Room is at maximum capacity');
            }

            // Validate user permissions
            $this->validateRoomAccess($roomId, $userId);

            // Check if user is already in the room
            $existingParticipant = $session->participants()
                ->where('user_id', $userId)
                ->active()
                ->first();

            if ($existingParticipant) {
                throw new \Exception('User is already in the room');
            }

            // Add participant
            $participant = $session->addParticipant($user, $participantData);

            // Start session if this is the first participant and it's waiting
            if ($session->status === 'waiting' && $session->participants()->active()->count() === 1) {
                $session->update([
                    'status' => 'active',
                    'start_time' => now(),
                ]);
            }

            // Calculate permissions
            $permissions = $this->calculatePermissions($participantData['role'], $session);

            Log::info('User joined video session', [
                'room_id' => $roomId,
                'user_id' => $userId,
                'role' => $participantData['role'],
            ]);

            return [
                'room' => $session->fresh(),
                'permissions' => $permissions,
            ];
        });
    }

    /**
     * Leave a video session room
     */
    public function leaveRoom(string $roomId, int $userId): void
    {
        DB::transaction(function () use ($roomId, $userId) {
            $session = VideoSession::where('room_id', $roomId)->firstOrFail();
            
            $participant = $session->participants()
                ->where('user_id', $userId)
                ->active()
                ->first();

            if ($participant) {
                $participant->leave();

                Log::info('User left video session', [
                    'room_id' => $roomId,
                    'user_id' => $userId,
                ]);

                // End session if no active participants remain
                if ($session->participants()->active()->count() === 0) {
                    $session->endSession();
                    
                    Log::info('Video session ended - no active participants', [
                        'room_id' => $roomId,
                    ]);
                }
            }
        });
    }

    /**
     * End a video session
     */
    public function endSession(string $roomId, int $userId, string $sessionNotes = null, string $endTime = null): void
    {
        DB::transaction(function () use ($roomId, $userId, $sessionNotes, $endTime) {
            $session = VideoSession::where('room_id', $roomId)->firstOrFail();

            // Validate permissions (only therapist or creator can end session)
            if ($session->therapist_id !== $userId && $session->created_by !== $userId) {
                throw new \Exception('Insufficient permissions to end session');
            }

            $session->endSession($sessionNotes);

            Log::info('Video session ended by user', [
                'room_id' => $roomId,
                'ended_by' => $userId,
                'duration' => $session->actual_duration,
            ]);
        });
    }

    /**
     * Update participant in room
     */
    public function updateParticipant(string $roomId, string $participantId, array $updates): VideoSessionParticipant
    {
        $session = VideoSession::where('room_id', $roomId)->firstOrFail();
        
        $participant = $session->participants()
            ->where('user_id', $participantId)
            ->firstOrFail();

        $participant->update($updates);

        return $participant->fresh();
    }

    /**
     * Mute/unmute participant
     */
    public function muteParticipant(string $roomId, string $participantId, bool $muted, int $requesterId): void
    {
        $session = VideoSession::where('room_id', $roomId)->firstOrFail();

        // Validate permissions (only therapist can mute others)
        if ($session->therapist_id !== $requesterId && $participantId !== $requesterId) {
            throw new \Exception('Insufficient permissions to mute participant');
        }

        $participant = $session->participants()
            ->where('user_id', $participantId)
            ->firstOrFail();

        $participant->toggleAudio(!$muted);

        Log::info('Participant mute status changed', [
            'room_id' => $roomId,
            'participant_id' => $participantId,
            'muted' => $muted,
            'requester_id' => $requesterId,
        ]);
    }

    /**
     * Kick participant from room
     */
    public function kickParticipant(string $roomId, string $participantId, int $requesterId, string $reason = null): void
    {
        $session = VideoSession::where('room_id', $roomId)->firstOrFail();

        // Validate permissions (only therapist can kick participants)
        if ($session->therapist_id !== $requesterId) {
            throw new \Exception('Insufficient permissions to kick participant');
        }

        $participant = $session->participants()
            ->where('user_id', $participantId)
            ->active()
            ->firstOrFail();

        $participant->update([
            'left_at' => now(),
            'connection_state' => 'disconnected',
            'metadata' => array_merge($participant->metadata ?? [], [
                'kicked_by' => $requesterId,
                'kick_reason' => $reason,
                'kicked_at' => now()->toISOString(),
            ]),
        ]);

        Log::info('Participant kicked from session', [
            'room_id' => $roomId,
            'participant_id' => $participantId,
            'kicked_by' => $requesterId,
            'reason' => $reason,
        ]);
    }

    /**
     * Start recording session
     */
    public function startRecording(string $roomId, int $userId): string
    {
        $session = VideoSession::where('room_id', $roomId)->firstOrFail();

        // Validate permissions
        if ($session->therapist_id !== $userId) {
            throw new \Exception('Insufficient permissions to start recording');
        }

        // Check recording consent
        if (!($session->metadata['recordingConsent'] ?? false)) {
            throw new \Exception('Recording consent not provided');
        }

        if ($session->is_recording) {
            throw new \Exception('Session is already being recorded');
        }

        $session->startRecording();

        $recordingId = Str::uuid()->toString();

        Log::info('Session recording started', [
            'room_id' => $roomId,
            'recording_id' => $recordingId,
            'started_by' => $userId,
        ]);

        return $recordingId;
    }

    /**
     * Stop recording session
     */
    public function stopRecording(string $roomId, int $userId): array
    {
        $session = VideoSession::where('room_id', $roomId)->firstOrFail();

        // Validate permissions
        if ($session->therapist_id !== $userId) {
            throw new \Exception('Insufficient permissions to stop recording');
        }

        if (!$session->is_recording) {
            throw new \Exception('Session is not being recorded');
        }

        // Generate mock recording URL and duration
        $recordingUrl = "/recordings/{$roomId}/" . Str::uuid() . ".mp4";
        $duration = $session->start_time ? now()->diffInSeconds($session->start_time) : 0;

        $session->stopRecording($recordingUrl, $duration);

        Log::info('Session recording stopped', [
            'room_id' => $roomId,
            'recording_url' => $recordingUrl,
            'duration' => $duration,
            'stopped_by' => $userId,
        ]);

        return [
            'url' => $recordingUrl,
            'duration' => $duration,
        ];
    }

    /**
     * Get participant's room history
     */
    public function getParticipantRooms(string $participantId, int $limit = 10): Collection
    {
        return VideoSession::byParticipant($participantId)
            ->with(['participants', 'therapist', 'client'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get active rooms
     */
    public function getActiveRooms(): Collection
    {
        return VideoSession::active()
            ->with(['participants', 'therapist', 'client'])
            ->orderBy('start_time', 'desc')
            ->get();
    }

    /**
     * Validate room access
     */
    public function validateRoomAccess(string $roomId, string $participantId): bool
    {
        $session = VideoSession::where('room_id', $roomId)->first();
        
        if (!$session) {
            return false;
        }

        $user = User::find($participantId);
        
        if (!$user) {
            return false;
        }

        // Check if user is therapist, client, or guardian for this session
        if ($session->therapist_id == $participantId ||
            $session->client_id == $participantId ||
            $session->guardian_id == $participantId) {
            return true;
        }

        // Check if user has admin role
        if ($user->hasRole('admin')) {
            return true;
        }

        return false;
    }

    /**
     * Calculate permissions for participant
     */
    private function calculatePermissions(string $role, VideoSession $session): array
    {
        $isTherapist = $role === 'therapist';
        $isGuardian = $role === 'guardian';
        $isAdmin = $role === 'admin';

        return [
            'canMute' => $isTherapist || $isAdmin,
            'canKick' => $isTherapist || $isAdmin,
            'canRecord' => $isTherapist || $isAdmin,
            'canShareScreen' => $isTherapist || $isGuardian || $isAdmin,
            'canInvite' => $isTherapist || $isAdmin,
            'canEndSession' => $isTherapist || $isAdmin,
        ];
    }

    /**
     * Generate unique room ID
     */
    private function generateRoomId(): string
    {
        do {
            $roomId = 'room_' . Str::random(12);
        } while (VideoSession::where('room_id', $roomId)->exists());

        return $roomId;
    }
}