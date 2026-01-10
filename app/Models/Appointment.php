<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'therapist_id',
        'child_id',
        'guardian_id',
        'scheduled_at',
        'duration_minutes',
        'status',
        'appointment_type',
        'title',
        'description',
        'notes',
        'therapist_notes',
        'meeting_link',
        'google_event_id',
        'google_meet_link',
        'google_calendar_data',
        'cancellation_reason',
        'cancelled_at',
        'cancelled_by',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'google_calendar_data' => 'array',
    ];

    /**
     * Get the therapist for this appointment.
     */
    public function therapist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'therapist_id');
    }

    /**
     * Get the child for this appointment.
     */
    public function child(): BelongsTo
    {
        return $this->belongsTo(User::class, 'child_id');
    }

    /**
     * Get the guardian for this appointment.
     */
    public function guardian(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guardian_id');
    }

    /**
     * Get the reminders sent for this appointment.
     */
    public function reminders()
    {
        return $this->hasMany(AppointmentReminder::class);
    }

    /**
     * Get all participants for this appointment.
     */
    public function participants()
    {
        return $this->hasMany(AppointmentParticipant::class);
    }

    /**
     * Get the user who cancelled the appointment.
     */
    public function cancelledBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    /**
     * Get the end time of the appointment.
     */
    public function getEndTimeAttribute(): Carbon
    {
        return $this->scheduled_at->addMinutes($this->duration_minutes);
    }

    /**
     * Check if appointment is in the past.
     */
    public function isPast(): bool
    {
        return $this->scheduled_at->isPast();
    }

    /**
     * Check if appointment is today.
     */
    public function isToday(): bool
    {
        return $this->scheduled_at->isToday();
    }

    /**
     * Check if appointment is upcoming (within next 24 hours).
     */
    public function isUpcoming(): bool
    {
        return $this->scheduled_at->isFuture() && $this->scheduled_at->diffInHours(now()) <= 24;
    }

    /**
     * Check if appointment can be cancelled.
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['requested', 'confirmed']) &&
               $this->scheduled_at->isFuture();
    }

    /**
     * Check if appointment can be confirmed.
     */
    public function canBeConfirmed(): bool
    {
        return $this->status === 'requested' && $this->scheduled_at->isFuture();
    }

    /**
     * Get status badge color for UI.
     */
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'requested' => 'bg-yellow-100 text-yellow-800',
            'confirmed' => 'bg-green-100 text-green-800',
            'cancelled' => 'bg-red-100 text-red-800',
            'completed' => 'bg-blue-100 text-blue-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    /**
     * Get status display name.
     */
    public function getStatusDisplayAttribute(): string
    {
        return match ($this->status) {
            'requested' => 'Pending Approval',
            'confirmed' => 'Confirmed',
            'cancelled' => 'Cancelled',
            'completed' => 'Completed',
            default => ucfirst($this->status),
        };
    }

    /**
     * Scope to get appointments for a specific therapist.
     */
    public function scopeForTherapist($query, $therapistId)
    {
        return $query->where('therapist_id', $therapistId);
    }

    /**
     * Scope to get appointments for a specific child.
     */
    public function scopeForChild($query, $childId)
    {
        return $query->where('child_id', $childId);
    }

    /**
     * Scope to get appointments for a specific guardian.
     */
    public function scopeForGuardian($query, $guardianId)
    {
        return $query->where(function ($q) use ($guardianId) {
            $q->where('guardian_id', $guardianId)
              ->orWhereHas('child', function ($childQuery) use ($guardianId) {
                  $childQuery->where('guardian_id', $guardianId);
              });
        });
    }

    /**
     * Scope to get appointments within a date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('scheduled_at', [$startDate, $endDate]);
    }

    /**
     * Scope to get upcoming appointments.
     */
    public function scopeUpcoming($query)
    {
        return $query->where('scheduled_at', '>', now())
            ->whereIn('status', ['requested', 'confirmed']);
    }

    /**
     * Check if this is a multi-participant appointment.
     */
    public function isMultiParticipant(): bool
    {
        return in_array($this->appointment_type, ['family', 'group', 'consultation']);
    }

    /**
     * Check if this is a group therapy session.
     */
    public function isGroupTherapy(): bool
    {
        return $this->appointment_type === 'group';
    }

    /**
     * Check if this is a family session.
     */
    public function isFamilySession(): bool
    {
        return $this->appointment_type === 'family';
    }

    /**
     * Check if this is a consultation.
     */
    public function isConsultation(): bool
    {
        return $this->appointment_type === 'consultation';
    }

    /**
     * Add a participant to the appointment.
     */
    public function addParticipant($userId, $role = 'client', $status = 'invited')
    {
        return $this->participants()->create([
            'user_id' => $userId,
            'role' => $role,
            'status' => $status,
        ]);
    }

    /**
     * Remove a participant from the appointment.
     */
    public function removeParticipant($userId)
    {
        return $this->participants()->where('user_id', $userId)->delete();
    }

    /**
     * Get all confirmed participants.
     */
    public function confirmedParticipants()
    {
        return $this->participants()->where('status', 'confirmed')->get();
    }

    /**
     * Get all invited participants.
     */
    public function invitedParticipants()
    {
        return $this->participants()->where('status', 'invited')->get();
    }

    /**
     * Get participant count.
     */
    public function getParticipantCountAttribute(): int
    {
        return $this->participants()->count();
    }

    /**
     * Get confirmed participant count.
     */
    public function getConfirmedParticipantCountAttribute(): int
    {
        return $this->participants()->where('status', 'confirmed')->count();
    }

    /**
     * Check for scheduling conflicts.
     */
    public static function hasConflict($therapistId, $scheduledAt, $durationMinutes, $excludeId = null)
    {
        $endTime = Carbon::parse($scheduledAt)->addMinutes($durationMinutes);

        $query = static::where('therapist_id', $therapistId)
            ->whereIn('status', ['requested', 'confirmed'])
            ->where(function ($q) use ($scheduledAt, $endTime) {
                $q->whereBetween('scheduled_at', [$scheduledAt, $endTime])
                    ->orWhere(function ($q2) use ($scheduledAt) {
                        $q2->where('scheduled_at', '<=', $scheduledAt)
                            ->whereRaw('datetime(scheduled_at, "+" || duration_minutes || " minutes") > ?', [$scheduledAt]);
                    });
            });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }
}
