<?php

namespace App\Services;

use App\Models\SessionRecording;
use App\Models\SessionLog;
use App\Models\SessionNote;
use App\Models\SessionRecordingAccess;
use App\Models\SessionAuditTrail;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SessionRecordingService
{
    /**
     * Start a new session recording.
     */
    public function startRecording(array $data): SessionRecording
    {
        $recording = SessionRecording::create([
            'session_id' => $data['session_id'],
            'start_time' => now(),
            'status' => 'recording',
            'encryption_algorithm' => 'AES-256-GCM',
            'encryption_key_id' => Str::uuid(),
            'encrypted' => $data['encryption'] ?? true,
            'checksum' => '',
            'retention_period' => $data['retention_period'] ?? 2555, // 7 years
            'auto_delete' => $data['auto_delete'] ?? true,
            'compliance_level' => $data['compliance_level'] ?? 'HIPAA',
            'archive_after' => $data['archive_after'] ?? 365, // 1 year
            'storage_provider' => config('filesystems.default'),
            'quality_settings' => $this->getQualitySettings($data['quality'] ?? 'medium'),
            'network_stats' => [],
            'events' => [],
        ]);

        // Create default access controls
        $this->createDefaultAccessControls($recording, $data);

        // Log the recording start
        $this->logAuditEntry($data['session_id'], [
            'action' => 'recording_started',
            'details' => [
                'recording_id' => $recording->id,
                'quality' => $data['quality'] ?? 'medium',
                'encrypted' => $recording->encrypted,
            ],
        ]);

        Log::info('Session recording started', [
            'recording_id' => $recording->id,
            'session_id' => $data['session_id'],
        ]);

        return $recording;
    }

    /**
     * Stop a session recording.
     */
    public function stopRecording(string $recordingId, array $data = []): SessionRecording
    {
        $recording = SessionRecording::findOrFail($recordingId);
        
        if ($recording->status !== 'recording') {
            throw new \Exception('Recording is not in recording state');
        }

        $recording->update([
            'end_time' => now(),
            'duration' => $data['duration'] ?? 0,
            'file_size' => $data['file_size'] ?? 0,
            'status' => 'processing',
            'checksum' => $data['checksum'] ?? '',
            'storage_path' => $data['storage_path'] ?? null,
            'storage_metadata' => $data['storage_metadata'] ?? null,
            'network_stats' => $data['network_stats'] ?? [],
            'events' => $data['events'] ?? [],
        ]);

        // Process the recording file if provided
        if (isset($data['file_content'])) {
            $this->processRecordingFile($recording, $data['file_content']);
        }

        $recording->update(['status' => 'completed']);

        // Log the recording stop
        $this->logAuditEntry($recording->session_id, [
            'action' => 'recording_stopped',
            'details' => [
                'recording_id' => $recording->id,
                'duration' => $recording->duration,
                'file_size' => $recording->file_size,
            ],
        ]);

        Log::info('Session recording stopped', [
            'recording_id' => $recording->id,
            'duration' => $recording->duration,
        ]);

        return $recording;
    }

    /**
     * Process and store the recording file.
     */
    protected function processRecordingFile(SessionRecording $recording, $fileContent): void
    {
        $filename = "recordings/{$recording->session_id}/{$recording->id}.webm";
        
        // Encrypt the file if encryption is enabled
        if ($recording->encrypted) {
            $fileContent = $this->encryptFile($fileContent, $recording->encryption_key_id);
            $filename .= '.encrypted';
        }

        // Store the file
        $stored = Storage::put($filename, $fileContent);
        
        if ($stored) {
            $recording->update([
                'storage_path' => $filename,
                'storage_metadata' => [
                    'original_name' => $recording->id . '.webm',
                    'mime_type' => 'video/webm',
                    'encrypted' => $recording->encrypted,
                    'stored_at' => now()->toISOString(),
                ],
            ]);
        } else {
            throw new \Exception('Failed to store recording file');
        }
    }

    /**
     * Encrypt file content.
     */
    protected function encryptFile($content, string $keyId): string
    {
        // In a real implementation, this would use proper key management
        // For now, we'll use Laravel's built-in encryption
        return Crypt::encrypt($content);
    }

    /**
     * Decrypt file content.
     */
    protected function decryptFile(string $encryptedContent, string $keyId): string
    {
        // In a real implementation, this would use proper key management
        return Crypt::decrypt($encryptedContent);
    }

    /**
     * Get recording file content.
     */
    public function getRecordingFile(string $recordingId, User $user): ?string
    {
        $recording = SessionRecording::findOrFail($recordingId);
        
        // Check access permissions
        if (!$recording->isAccessibleBy($user)) {
            throw new \Exception('Access denied to recording');
        }

        $permissions = $recording->getPermissionsFor($user);
        if (!in_array('view', $permissions) && !in_array('download', $permissions)) {
            throw new \Exception('Insufficient permissions to access recording');
        }

        if (!$recording->storage_path || !Storage::exists($recording->storage_path)) {
            throw new \Exception('Recording file not found');
        }

        $content = Storage::get($recording->storage_path);
        
        // Decrypt if encrypted
        if ($recording->encrypted) {
            $content = $this->decryptFile($content, $recording->encryption_key_id);
        }

        // Log access
        $this->logAuditEntry($recording->session_id, [
            'action' => 'recording_accessed',
            'details' => [
                'recording_id' => $recording->id,
                'access_type' => 'file_download',
            ],
        ]);

        return $content;
    }

    /**
     * Create default access controls for a recording.
     */
    protected function createDefaultAccessControls(SessionRecording $recording, array $sessionData): void
    {
        $sessionLog = SessionLog::where('session_id', $recording->session_id)->first();
        
        if (!$sessionLog) {
            return;
        }

        // Therapist gets full access
        SessionRecordingAccess::create([
            'recording_id' => $recording->id,
            'user_id' => $sessionLog->therapist_id,
            'role' => 'therapist',
            'permissions' => ['view', 'download', 'delete', 'share'],
            'granted_by' => $sessionLog->therapist_id,
            'granted_at' => now(),
        ]);

        // Clients get view access with expiration
        foreach ($sessionLog->client_ids ?? [] as $clientId) {
            SessionRecordingAccess::create([
                'recording_id' => $recording->id,
                'user_id' => $clientId,
                'role' => 'client',
                'permissions' => ['view'],
                'expires_at' => now()->addDays(30),
                'granted_by' => $sessionLog->therapist_id,
                'granted_at' => now(),
            ]);
        }

        // Guardians get view access
        foreach ($sessionLog->guardian_ids ?? [] as $guardianId) {
            SessionRecordingAccess::create([
                'recording_id' => $recording->id,
                'user_id' => $guardianId,
                'role' => 'guardian',
                'permissions' => ['view'],
                'expires_at' => now()->addDays(90),
                'granted_by' => $sessionLog->therapist_id,
                'granted_at' => now(),
            ]);
        }
    }

    /**
     * Get quality settings based on quality level.
     */
    protected function getQualitySettings(string $quality): array
    {
        $settings = [
            'low' => [
                'video' => ['width' => 640, 'height' => 360, 'bitrate' => 500000, 'frameRate' => 24],
                'audio' => ['bitrate' => 64000, 'sampleRate' => 44100],
            ],
            'medium' => [
                'video' => ['width' => 1280, 'height' => 720, 'bitrate' => 1500000, 'frameRate' => 30],
                'audio' => ['bitrate' => 128000, 'sampleRate' => 44100],
            ],
            'high' => [
                'video' => ['width' => 1920, 'height' => 1080, 'bitrate' => 3000000, 'frameRate' => 30],
                'audio' => ['bitrate' => 192000, 'sampleRate' => 48000],
            ],
        ];

        return $settings[$quality] ?? $settings['medium'];
    }

    /**
     * Update recording access permissions.
     */
    public function updateRecordingAccess(string $recordingId, string $userId, array $permissions, User $grantedBy): SessionRecordingAccess
    {
        $recording = SessionRecording::findOrFail($recordingId);
        
        // Check if the user granting access has permission to do so
        $granterPermissions = $recording->getPermissionsFor($grantedBy);
        if (!in_array('share', $granterPermissions)) {
            throw new \Exception('Insufficient permissions to grant access');
        }

        $access = SessionRecordingAccess::updateOrCreate(
            [
                'recording_id' => $recordingId,
                'user_id' => $userId,
            ],
            [
                'permissions' => $permissions['permissions'] ?? ['view'],
                'expires_at' => isset($permissions['expires_at']) ? Carbon::parse($permissions['expires_at']) : null,
                'granted_by' => $grantedBy->id,
                'granted_at' => now(),
            ]
        );

        // Log the access change
        $this->logAuditEntry($recording->session_id, [
            'action' => 'recording_access_updated',
            'details' => [
                'recording_id' => $recordingId,
                'target_user_id' => $userId,
                'permissions' => $permissions['permissions'] ?? ['view'],
                'granted_by' => $grantedBy->id,
            ],
        ]);

        return $access;
    }

    /**
     * Delete a recording.
     */
    public function deleteRecording(string $recordingId, User $user): bool
    {
        $recording = SessionRecording::findOrFail($recordingId);
        
        // Check delete permissions
        $permissions = $recording->getPermissionsFor($user);
        if (!in_array('delete', $permissions)) {
            throw new \Exception('Insufficient permissions to delete recording');
        }

        // Delete the file from storage
        if ($recording->storage_path && Storage::exists($recording->storage_path)) {
            Storage::delete($recording->storage_path);
        }

        // Log the deletion before deleting the record
        $this->logAuditEntry($recording->session_id, [
            'action' => 'recording_deleted',
            'details' => [
                'recording_id' => $recordingId,
                'deleted_by' => $user->id,
                'file_size' => $recording->file_size,
                'duration' => $recording->duration,
            ],
        ]);

        // Delete the database record
        $deleted = $recording->delete();

        Log::info('Session recording deleted', [
            'recording_id' => $recordingId,
            'deleted_by' => $user->id,
        ]);

        return $deleted;
    }

    /**
     * Get recordings for a user.
     */
    public function getUserRecordings(User $user, array $filters = [])
    {
        $query = SessionRecording::whereHas('accessControls', function ($q) use ($user) {
            $q->where('user_id', $user->id)->active();
        });

        // Apply filters
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['date_from'])) {
            $query->where('start_time', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->where('start_time', '<=', $filters['date_to']);
        }

        if (isset($filters['session_type'])) {
            $query->whereHas('sessionLog', function ($q) use ($filters) {
                $q->where('type', $filters['session_type']);
            });
        }

        return $query->with(['sessionLog', 'accessControls'])
                    ->orderBy('start_time', 'desc')
                    ->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Clean up expired recordings.
     */
    public function cleanupExpiredRecordings(): int
    {
        $expiredRecordings = SessionRecording::expired()->get();
        $deletedCount = 0;

        foreach ($expiredRecordings as $recording) {
            try {
                // Delete the file from storage
                if ($recording->storage_path && Storage::exists($recording->storage_path)) {
                    Storage::delete($recording->storage_path);
                }

                // Log the cleanup
                $this->logAuditEntry($recording->session_id, [
                    'action' => 'recording_auto_deleted',
                    'details' => [
                        'recording_id' => $recording->id,
                        'reason' => 'retention_policy_expired',
                        'retention_period' => $recording->retention_period,
                    ],
                ]);

                $recording->delete();
                $deletedCount++;

                Log::info('Expired recording cleaned up', [
                    'recording_id' => $recording->id,
                ]);

            } catch (\Exception $e) {
                Log::error('Failed to cleanup expired recording', [
                    'recording_id' => $recording->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $deletedCount;
    }

    /**
     * Archive old recordings.
     */
    public function archiveOldRecordings(): int
    {
        $recordingsToArchive = SessionRecording::needsArchiving()->get();
        $archivedCount = 0;

        foreach ($recordingsToArchive as $recording) {
            try {
                // Move to archive storage (implementation depends on storage provider)
                $this->moveToArchiveStorage($recording);
                
                // Update status
                $recording->update(['status' => 'archived']);

                // Log the archival
                $this->logAuditEntry($recording->session_id, [
                    'action' => 'recording_archived',
                    'details' => [
                        'recording_id' => $recording->id,
                        'archive_after' => $recording->archive_after,
                    ],
                ]);

                $archivedCount++;

                Log::info('Recording archived', [
                    'recording_id' => $recording->id,
                ]);

            } catch (\Exception $e) {
                Log::error('Failed to archive recording', [
                    'recording_id' => $recording->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $archivedCount;
    }

    /**
     * Move recording to archive storage.
     */
    protected function moveToArchiveStorage(SessionRecording $recording): void
    {
        if (!$recording->storage_path || !Storage::exists($recording->storage_path)) {
            return;
        }

        $archivePath = str_replace('recordings/', 'archive/recordings/', $recording->storage_path);
        
        // Copy to archive location
        Storage::copy($recording->storage_path, $archivePath);
        
        // Update storage path
        $recording->update(['storage_path' => $archivePath]);
        
        // Optionally delete from original location to save space
        // Storage::delete($recording->storage_path);
    }

    /**
     * Log audit entry for session recording actions.
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