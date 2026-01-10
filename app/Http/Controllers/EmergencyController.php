<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\PanicAlertService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EmergencyController extends Controller
{
    protected PanicAlertService $panicAlertService;

    public function __construct(PanicAlertService $panicAlertService)
    {
        $this->panicAlertService = $panicAlertService;
    }

    /**
     * Display the emergency page.
     */
    public function index()
    {
        $user = auth()->user();
        $panicAlerts = [];

        // If user is a child, show their panic alert history
        if ($user->hasRole('child')) {
            $panicAlerts = $this->panicAlertService->getPanicAlertsForUser($user);
        }

        return Inertia::render('emergency/index', [
            'panicAlerts' => $panicAlerts
        ]);
    }

    /**
     * Handle panic button activation.
     */
    public function panic(Request $request)
    {
        $user = auth()->user();

        // Validate location data if provided
        $request->validate([
            'location.latitude' => 'nullable|numeric|between:-90,90',
            'location.longitude' => 'nullable|numeric|between:-180,180',
            'location.accuracy' => 'nullable|numeric|min:0',
        ]);

        // Prepare location data
        $locationData = null;
        if ($request->has('location')) {
            $locationData = [
                'latitude' => $request->input('location.latitude'),
                'longitude' => $request->input('location.longitude'),
                'accuracy' => $request->input('location.accuracy'),
                'timestamp' => now()->toISOString(),
            ];
        }

        // Create panic alert using the service
        $panicAlert = $this->panicAlertService->createPanicAlert($user, $locationData);

        // Get emergency contacts count
        $emergencyContacts = $this->panicAlertService->getEmergencyContacts($user);
        $contactsCount = count($emergencyContacts);

        // Get updated panic alerts for the child
        $panicAlerts = $this->panicAlertService->getPanicAlertsForUser($user);

        return Inertia::render('emergency/index', [
            'panicActivated' => true,
            'contactsNotified' => $contactsCount,
            'message' => 'Emergency alert sent successfully! Your support team has been notified.',
            'panicAlerts' => $panicAlerts,
            'latestAlert' => $panicAlert->load(['resolvedBy', 'notifications'])
        ]);
    }


}
