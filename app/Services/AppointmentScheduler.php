<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\TherapistAvailability;
use App\Models\TherapistAvailabilityOverride;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AppointmentScheduler
{
    private GoogleMeetService $googleMeetService;

    private EmailNotificationService $emailService;

    private ConnectionManagementService $connectionService;

    public function __construct(
        GoogleMeetService $googleMeetService,
        EmailNotificationService $emailService,
        ConnectionManagementService $connectionService
    ) {
        $this->googleMeetService = $googleMeetService;
        $this->emailService = $emailService;
        $this->connectionService = $connectionService;
    }

    /**
     * Get available time slots for a therapist on a specific date.
     */
    public function getAvailableSlots(int $therapistId, Carbon $date, int $durationMinutes = 60): Collection
    {
        $therapist = User::findOrFail($therapistId);

        // Check for override on this date
        $override = TherapistAvailabilityOverride::where('therapist_id', $therapistId)
            ->forDate($date)
            ->first();

        if ($override && $override->isUnavailable()) {
            return collect(); // No slots available
        }

        // Get regular availability for this day of week
        $availabilities = TherapistAvailability::where('therapist_id', $therapistId)
            ->forDay($date->dayOfWeek)
            ->active()
            ->get();

        if ($availabilities->isEmpty() && ! $override) {
            return collect(); // No availability set
        }

        // Use override times if custom hours, otherwise use regular availability
        if ($override && $override->isCustomHours()) {
            $timeRanges = collect([[
                'start' => Carbon::parse($override->start_time),
                'end' => Carbon::parse($override->end_time),
            ]]);
        } else {
            $timeRanges = $availabilities->map(function ($availability) {
                return [
                    'start' => Carbon::parse($availability->start_time),
                    'end' => Carbon::parse($availability->end_time),
                ];
            });
        }

        // Get existing appointments for this therapist on this date
        $existingAppointments = Appointment::where('therapist_id', $therapistId)
            ->whereDate('scheduled_at', $date)
            ->whereIn('status', ['requested', 'confirmed'])
            ->get();

        // Generate time slots
        $slots = collect();

        foreach ($timeRanges as $range) {
            $currentTime = $date->copy()->setTimeFrom($range['start']);
            $endTime = $date->copy()->setTimeFrom($range['end']);

            while ($currentTime->copy()->addMinutes($durationMinutes)->lte($endTime)) {
                $slotEnd = $currentTime->copy()->addMinutes($durationMinutes);

                // Check if slot conflicts with existing appointments
                $hasConflict = $existingAppointments->contains(function ($appointment) use ($currentTime, $slotEnd) {
                    $appointmentStart = $appointment->scheduled_at;
                    $appointmentEnd = $appointment->scheduled_at->copy()->addMinutes($appointment->duration_minutes);

                    return $currentTime->lt($appointmentEnd) && $slotEnd->gt($appointmentStart);
                });

                if (! $hasConflict && $currentTime->isFuture()) {
                    $slots->push([
                        'start' => $currentTime->copy(),
                        'end' => $slotEnd->copy(),
                        'formatted_time' => $currentTime->format('g:i A'),
                        'available' => true,
                    ]);
                }

                $currentTime->addMinutes($durationMinutes);
            }
        }

        return $slots;
    }

    /**
     * Book an appointment.
     */
    public function bookAppointment(array $data): ?Appointment
    {
        return DB::transaction(function () use ($data) {
            // Validate therapeutic relationships exist (unless admin is booking)
            $bookingUser = auth()->user();
            if (!$bookingUser || !$bookingUser->hasRole('admin')) {
                $this->validateTherapeuticRelationships($data['therapist_id'], $data['child_id']);
            }

            // Validate time slot availability
            if (! $this->isSlotAvailable(
                $data['therapist_id'],
                Carbon::parse($data['scheduled_at']),
                $data['duration_minutes'] ?? 60
            )) {
                throw new \Exception('Selected time slot is not available');
            }

            // Create appointment
            $appointment = Appointment::create([
                'therapist_id' => $data['therapist_id'],
                'child_id' => $data['child_id'],
                'guardian_id' => $data['guardian_id'] ?? null,
                'scheduled_at' => $data['scheduled_at'],
                'duration_minutes' => $data['duration_minutes'] ?? 60,
                'status' => $data['status'] ?? 'requested',
                'notes' => $data['notes'] ?? null,
            ]);

            // Create Google Meet session if appointment is confirmed
            if ($appointment->status === 'confirmed') {
                $this->googleMeetService->createTherapySession($appointment);
            }

            // Send confirmation emails
            $this->emailService->sendAppointmentConfirmation($appointment);

            return $appointment;
        });
    }

    /**
     * Reschedule an appointment.
     */
    public function rescheduleAppointment(Appointment $appointment, Carbon $newDateTime): bool
    {
        return DB::transaction(function () use ($appointment, $newDateTime) {
            // Validate new time slot
            if (! $this->isSlotAvailable(
                $appointment->therapist_id,
                $newDateTime,
                $appointment->duration_minutes,
                $appointment->id
            )) {
                throw new \Exception('New time slot is not available');
            }

            // Update appointment
            $appointment->update([
                'scheduled_at' => $newDateTime,
            ]);

            // Update Google Meet session
            if ($appointment->google_event_id) {
                $this->googleMeetService->updateTherapySession($appointment);
            }

            // Send notification emails
            $this->emailService->sendAppointmentConfirmation($appointment);

            return true;
        });
    }

    /**
     * Cancel an appointment.
     */
    public function cancelAppointment(Appointment $appointment, ?string $reason = null): bool
    {
        return DB::transaction(function () use ($appointment, $reason) {
            $appointment->update([
                'status' => 'cancelled',
                'cancellation_reason' => $reason,
                'cancelled_at' => now(),
            ]);

            // Cancel Google Meet session
            if ($appointment->google_event_id) {
                $this->googleMeetService->cancelTherapySession($appointment);
            }

            // Send cancellation emails
            $this->emailService->sendAppointmentCancellation($appointment);

            return true;
        });
    }

    /**
     * Check if a time slot is available.
     */
    public function isSlotAvailable(
        int $therapistId,
        Carbon $dateTime,
        int $durationMinutes,
        ?int $excludeAppointmentId = null
    ): bool {
        // Check if time falls within therapist availability
        $dayOfWeek = $dateTime->dayOfWeek;
        $time = $dateTime->format('H:i:s');

        // Check for override
        $override = TherapistAvailabilityOverride::where('therapist_id', $therapistId)
            ->forDate($dateTime)
            ->first();

        if ($override && $override->isUnavailable()) {
            return false;
        }

        // Check regular availability
        $hasAvailability = TherapistAvailability::where('therapist_id', $therapistId)
            ->forDay($dayOfWeek)
            ->active()
            ->where('start_time', '<=', $time)
            ->where('end_time', '>=', $dateTime->copy()->addMinutes($durationMinutes)->format('H:i:s'))
            ->exists();

        if (! $hasAvailability && ! ($override && $override->isCustomHours())) {
            return false;
        }

        // Check for conflicts with existing appointments
        return ! Appointment::hasConflict($therapistId, $dateTime, $durationMinutes, $excludeAppointmentId);
    }

    /**
     * Get therapist's schedule for a date range.
     */
    public function getTherapistSchedule(int $therapistId, Carbon $startDate, Carbon $endDate): array
    {
        $period = CarbonPeriod::create($startDate, $endDate);
        $schedule = [];

        foreach ($period as $date) {
            $slots = $this->getAvailableSlots($therapistId, $date);
            $appointments = Appointment::where('therapist_id', $therapistId)
                ->whereDate('scheduled_at', $date)
                ->whereIn('status', ['requested', 'confirmed'])
                ->get();

            $schedule[$date->toDateString()] = [
                'date' => $date,
                'available_slots' => $slots,
                'appointments' => $appointments,
                'total_slots' => $slots->count(),
                'booked_slots' => $appointments->count(),
            ];
        }

        return $schedule;
    }

    /**
     * Confirm a requested appointment.
     */
    public function confirmAppointment(Appointment $appointment): bool
    {
        if ($appointment->status !== 'requested') {
            return false;
        }

        return DB::transaction(function () use ($appointment) {
            $appointment->update(['status' => 'confirmed']);

            // Create Google Meet session
            $this->googleMeetService->createTherapySession($appointment);

            // Send confirmation email
            $this->emailService->sendAppointmentConfirmation($appointment);

            return true;
        });
    }

    /**
     * Validate that therapeutic relationships exist for appointment booking.
     */
    private function validateTherapeuticRelationships(int $therapistId, int $childId): void
    {
        // Check if therapist has active connection with child
        $hasConnection = $this->connectionService->hasActiveConnection($therapistId, $childId);
        
        if (!$hasConnection) {
            throw new \Exception('No active therapeutic relationship exists between the therapist and child');
        }
    }
}
