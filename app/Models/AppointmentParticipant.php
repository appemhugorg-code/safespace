<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AppointmentParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'user_id',
        'role',
        'status',
        'joined_at',
        'left_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
        'left_at' => 'datetime',
    ];

    /**
     * Get the appointment this participant belongs to.
     */
    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    /**
     * Get the user who is participating.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if participant has confirmed attendance.
     */
    public function hasConfirmed(): bool
    {
        return $this->status === 'confirmed';
    }

    /**
     * Check if participant has declined.
     */
    public function hasDeclined(): bool
    {
        return $this->status === 'declined';
    }

    /**
     * Check if participant attended the meeting.
     */
    public function hasAttended(): bool
    {
        return $this->status === 'attended';
    }

    /**
     * Mark participant as confirmed.
     */
    public function confirm(): void
    {
        $this->update(['status' => 'confirmed']);
    }

    /**
     * Mark participant as declined.
     */
    public function decline(): void
    {
        $this->update(['status' => 'declined']);
    }

    /**
     * Mark participant as attended.
     */
    public function markAttended(): void
    {
        $this->update([
            'status' => 'attended',
            'joined_at' => $this->joined_at ?? now(),
        ]);
    }

    /**
     * Mark participant as no-show.
     */
    public function markNoShow(): void
    {
        $this->update(['status' => 'no_show']);
    }

    /**
     * Record when participant joined the meeting.
     */
    public function recordJoin(): void
    {
        $this->update(['joined_at' => now()]);
    }

    /**
     * Record when participant left the meeting.
     */
    public function recordLeave(): void
    {
        $this->update(['left_at' => now()]);
    }

    /**
     * Get role display name.
     */
    public function getRoleDisplayAttribute(): string
    {
        return match ($this->role) {
            'therapist' => 'Therapist',
            'client' => 'Client',
            'guardian' => 'Guardian',
            'observer' => 'Observer',
            default => ucfirst($this->role),
        };
    }

    /**
     * Get status display name.
     */
    public function getStatusDisplayAttribute(): string
    {
        return match ($this->status) {
            'invited' => 'Invited',
            'confirmed' => 'Confirmed',
            'declined' => 'Declined',
            'attended' => 'Attended',
            'no_show' => 'No Show',
            default => ucfirst($this->status),
        };
    }

    /**
     * Get status badge color for UI.
     */
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'invited' => 'bg-gray-100 text-gray-800',
            'confirmed' => 'bg-green-100 text-green-800',
            'declined' => 'bg-red-100 text-red-800',
            'attended' => 'bg-blue-100 text-blue-800',
            'no_show' => 'bg-orange-100 text-orange-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }
}
