<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TherapistAvailabilitySlot extends Model
{
    protected $fillable = [
        'therapist_id',
        'date',
        'start_time',
        'end_time',
        'is_booked',
        'appointment_id',
    ];

    protected $casts = [
        'date' => 'date',
        'is_booked' => 'boolean',
    ];

    public function therapist()
    {
        return $this->belongsTo(User::class, 'therapist_id');
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function scopeAvailable($query)
    {
        return $query->where('is_booked', false);
    }

    public function scopeForDate($query, $date)
    {
        return $query->whereDate('date', $date);
    }

    public function scopeFuture($query)
    {
        return $query->where('date', '>=', now()->toDateString());
    }
}
