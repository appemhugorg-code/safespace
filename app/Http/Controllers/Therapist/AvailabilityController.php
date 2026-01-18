<?php

namespace App\Http\Controllers\Therapist;

use App\Http\Controllers\Controller;
use App\Models\TherapistAvailability;
use App\Models\TherapistAvailabilityOverride;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AvailabilityController extends Controller
{
    /**
     * Display the therapist's availability management page.
     */
    public function index(Request $request)
    {
        $therapist = $request->user();

        $availability = TherapistAvailability::where('therapist_id', $therapist->id)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get()
            ->map(function ($item) {
                $item->day_name = $this->getDayName($item->day_of_week);
                $item->time_range = date('g:i A', strtotime($item->start_time)) . ' - ' . date('g:i A', strtotime($item->end_time));
                return $item;
            });

        $overrides = TherapistAvailabilityOverride::where('therapist_id', $therapist->id)
            ->where('date', '>=', now()->toDateString())
            ->orderBy('date')
            ->get();

        return Inertia::render('therapist/availability', [
            'availability' => $availability,
            'overrides' => $overrides,
        ]);
    }

    /**
     * Store new availability slot.
     */
    public function store(Request $request)
    {
        $request->validate([
            'day_of_week' => 'required|integer|between:0,6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $therapist = $request->user();

        TherapistAvailability::create([
            'therapist_id' => $therapist->id,
            'day_of_week' => $request->day_of_week,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Availability slot added successfully');
    }

    /**
     * Update availability slot.
     */
    public function update(Request $request, TherapistAvailability $availability)
    {
        // Ensure therapist owns this availability
        if ($availability->therapist_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'day_of_week' => 'required|integer|between:0,6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $availability->update([
            'day_of_week' => $request->day_of_week,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
        ]);

        return redirect()->back()->with('success', 'Availability slot updated successfully');
    }

    /**
     * Delete availability slot.
     */
    public function destroy(TherapistAvailability $availability, Request $request)
    {
        // Ensure therapist owns this availability
        if ($availability->therapist_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $availability->delete();

        return redirect()->back()->with('success', 'Availability slot deleted successfully');
    }

    /**
     * Create availability override.
     */
    public function storeOverride(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'type' => 'required|in:unavailable,custom_hours',
            'start_time' => 'required_if:type,custom_hours|date_format:H:i',
            'end_time' => 'required_if:type,custom_hours|date_format:H:i|after:start_time',
            'reason' => 'nullable|string|max:255',
        ]);

        $therapist = $request->user();

        TherapistAvailabilityOverride::create([
            'therapist_id' => $therapist->id,
            'date' => $request->date,
            'type' => $request->type,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'reason' => $request->reason,
        ]);

        return redirect()->back()->with('success', 'Override added successfully');
    }

    /**
     * Delete availability override.
     */
    public function destroyOverride(TherapistAvailabilityOverride $override, Request $request)
    {
        // Ensure therapist owns this override
        if ($override->therapist_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $override->delete();

        return redirect()->back()->with('success', 'Override deleted successfully');
    }

    /**
     * Get day name from day of week number.
     */
    private function getDayName(int $dayOfWeek): string
    {
        $days = [
            0 => 'Sunday',
            1 => 'Monday',
            2 => 'Tuesday',
            3 => 'Wednesday',
            4 => 'Thursday',
            5 => 'Friday',
            6 => 'Saturday',
        ];

        return $days[$dayOfWeek] ?? 'Unknown';
    }
}
