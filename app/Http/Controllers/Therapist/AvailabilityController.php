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
            ->get();

        $overrides = TherapistAvailabilityOverride::where('therapist_id', $therapist->id)
            ->where('date', '>=', now()->toDateString())
            ->orderBy('date')
            ->get();

        return Inertia::render('therapist/availability', [
            'availability' => $availability,
            'overrides' => $overrides,
        ]);
    }
}
