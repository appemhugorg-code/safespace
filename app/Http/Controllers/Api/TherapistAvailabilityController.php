<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TherapistAvailability;
use App\Models\TherapistAvailabilityOverride;
use App\Services\AppointmentScheduler;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TherapistAvailabilityController extends Controller
{
    private AppointmentScheduler $scheduler;

    public function __construct(AppointmentScheduler $scheduler)
    {
        $this->scheduler = $scheduler;
    }

    /**
     * Get therapist's availability schedule.
     */
    public function index(Request $request): JsonResponse
    {
        $therapist = $request->user();

        $availability = TherapistAvailability::where('therapist_id', $therapist->id)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'availability' => $availability,
        ]);
    }

    /**
     * Store new availability slot.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'day_of_week' => 'required|integer|between:0,6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $therapist = $request->user();

        $availability = TherapistAvailability::create([
            'therapist_id' => $therapist->id,
            'day_of_week' => $request->day_of_week,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Availability added successfully',
            'availability' => $availability,
        ], 201);
    }

    /**
     * Update availability slot.
     */
    public function update(Request $request, TherapistAvailability $availability): JsonResponse
    {
        // Ensure therapist owns this availability
        if ($availability->therapist_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'is_active' => 'sometimes|boolean',
        ]);

        $availability->update($request->only(['start_time', 'end_time', 'is_active']));

        return response()->json([
            'message' => 'Availability updated successfully',
            'availability' => $availability,
        ]);
    }

    /**
     * Delete availability slot.
     */
    public function destroy(TherapistAvailability $availability, Request $request): JsonResponse
    {
        // Ensure therapist owns this availability
        if ($availability->therapist_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $availability->delete();

        return response()->json([
            'message' => 'Availability deleted successfully',
        ]);
    }

    /**
     * Get available time slots for a specific date.
     */
    public function availableSlots(Request $request, int $therapistId): JsonResponse
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'duration' => 'sometimes|integer|min:15|max:180',
        ]);

        $date = Carbon::parse($request->date);
        $duration = $request->duration ?? 60;

        $slots = $this->scheduler->getAvailableSlots($therapistId, $date, $duration);

        return response()->json([
            'date' => $date->toDateString(),
            'therapist_id' => $therapistId,
            'duration_minutes' => $duration,
            'slots' => $slots,
        ]);
    }

    /**
     * Get therapist's schedule for a date range.
     */
    public function schedule(Request $request, int $therapistId): JsonResponse
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);

        // Limit to 30 days
        if ($startDate->diffInDays($endDate) > 30) {
            return response()->json([
                'message' => 'Date range cannot exceed 30 days',
            ], 422);
        }

        $schedule = $this->scheduler->getTherapistSchedule($therapistId, $startDate, $endDate);

        return response()->json([
            'therapist_id' => $therapistId,
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'schedule' => $schedule,
        ]);
    }

    /**
     * Get availability overrides.
     */
    public function overrides(Request $request): JsonResponse
    {
        $therapist = $request->user();

        $overrides = TherapistAvailabilityOverride::where('therapist_id', $therapist->id)
            ->where('date', '>=', now()->toDateString())
            ->orderBy('date')
            ->get();

        return response()->json([
            'overrides' => $overrides,
        ]);
    }

    /**
     * Create availability override.
     */
    public function storeOverride(Request $request): JsonResponse
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'type' => 'required|in:unavailable,custom_hours',
            'start_time' => 'required_if:type,custom_hours|date_format:H:i',
            'end_time' => 'required_if:type,custom_hours|date_format:H:i|after:start_time',
            'reason' => 'nullable|string|max:255',
        ]);

        $therapist = $request->user();

        $override = TherapistAvailabilityOverride::create([
            'therapist_id' => $therapist->id,
            'date' => $request->date,
            'type' => $request->type,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'reason' => $request->reason,
        ]);

        return response()->json([
            'message' => 'Override created successfully',
            'override' => $override,
        ], 201);
    }

    /**
     * Delete availability override.
     */
    public function destroyOverride(TherapistAvailabilityOverride $override, Request $request): JsonResponse
    {
        // Ensure therapist owns this override
        if ($override->therapist_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $override->delete();

        return response()->json([
            'message' => 'Override deleted successfully',
        ]);
    }
}
