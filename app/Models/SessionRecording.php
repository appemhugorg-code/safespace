<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class SessionRecording extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'session_id',
        'start_time',
        'end_time',
        'duration',
        'file_size',
        'status',
        'encryption_algorithm',
        'encryption_key_id',
        'encrypted',
        'checksum',
        'retention_period',
        'auto_delete',
        'compliance_level',
        'archive_after',
        'storage_path',
        'storage_provider',
        'storage_metadata',
        'quality_settings',
        'network_stats',
        'events',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'encrypted' => 'boolean',
        'auto_delete' => 'boolean',
        'storage_metadata' => 'array',
        'quality_settings' => 'array',
        'network_stats' => 'array',
        'events' => 'array',
    ];

    /**
     * Get the session log that owns this recording.
     */
    public function sessionLog(): BelongsTo
    {
        return $this->belongsTo(SessionLog::class, 'session_id', 'session_id');
    }

    /**
     * Get the access controls for this recording.
     */
    public function accessControls(): HasMany
    {
        return $this->hasMany(SessionRecordingAccess::class);
    }

    /**
     * Check if the recording is accessible by a user.
     */
    public function isAccessibleBy(User $user): bool
    {
        return $this->accessControls()
            ->where('user_id', $user->id)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->exists();
    }

    /**
     * Get user's permissions for this recording.
     */
    public function getPermissionsFor(User $user): array
    {
        $access = $this->accessControls()
            ->where('user_id', $user->id)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->first();

        return $access ? $access->permissions : [];
    }

    /**
     * Check if recording is expired based on retention policy.
     */
    public function isExpired(): bool
    {
        if (!$this->auto_delete) {
            return false;
        }

        $expiryDate = $this->start_time->addDays($this->retention_period);
        return now()->isAfter($expiryDate);
    }

    /**
     * Check if recording should be archived.
     */
    public function shouldBeArchived(): bool
    {
        $archiveDate = $this->start_time->addDays($this->archive_after);
        return now()->isAfter($archiveDate) && $this->status === 'completed';
    }

    /**
     * Get the file size in human readable format.
     */
    public function getFormattedFileSizeAttribute(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
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
     * Scope for active recordings.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'recording');
    }

    /**
     * Scope for completed recordings.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope for recordings that need archiving.
     */
    public function scopeNeedsArchiving($query)
    {
        return $query->where('status', 'completed')
                    ->whereRaw('DATE_ADD(start_time, INTERVAL archive_after DAY) <= NOW()');
    }

    /**
     * Scope for expired recordings.
     */
    public function scopeExpired($query)
    {
        return $query->where('auto_delete', true)
                    ->whereRaw('DATE_ADD(start_time, INTERVAL retention_period DAY) <= NOW()');
    }

    /**
     * Scope for HIPAA compliant recordings.
     */
    public function scopeHipaaCompliant($query)
    {
        return $query->where('encrypted', true)
                    ->whereIn('compliance_level', ['HIPAA', 'BOTH']);
    }
}