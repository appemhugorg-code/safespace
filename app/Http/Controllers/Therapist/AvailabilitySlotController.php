<?php

namespace App\Http\Controllers\Therapist;

use App\Http\Controllers\Controller;
use App\Models\TherapistAvailabilitySlot;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AvailabilitySlotController extends Controller
{
    public function index()
    {
        $therapist = auth()->user();
        
        $slots = TherapistAvailabilitySlot::where('therapist_id', $therapist->id)
            ->future()
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();

        return Inertia::render('therapist/availability-slots', [
            'slots' => $slots,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $therapist = auth()->user();

        // Check for overlapping slots
        $overlapping = TherapistAvailabilitySlot::where('therapist_id', $therapist->id)
            ->forDate($request->date)
            ->where(function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('start_time', '<', $request->end_time)
                      ->where('end_time', '>', $request->start_time);
                });
            })
            ->exists();

        if ($overlapping) {
            return back()->withErrors(['time' => 'This time slot overlaps with an existing slot.']);
        }

        TherapistAvailabilitySlot::create([
            'therapist_id' => $therapist->id,
            'date' => $request->date,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
        ]);

        return back()->with('success', 'Availability slot created successfully.');
    }

    public function destroy(TherapistAvailabilitySlot $slot)
    {
        $therapist = auth()->user();

        if ($slot->therapist_id !== $therapist->id) {
            abort(403);
        }

        if ($slot->is_booked) {
            return back()->withErrors(['slot' => 'Cannot delete a booked slot.']);
        }

        $slot->delete();

        return back()->with('success', 'Availability slot deleted successfully.');
    }
}
