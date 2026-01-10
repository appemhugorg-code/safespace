<?php

namespace App\Http\Controllers;

use App\Models\PanicAlert;
use App\Services\PanicAlertService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PanicAlertController extends Controller
{
    protected PanicAlertService $panicAlertService;

    public function __construct(PanicAlertService $panicAlertService)
    {
        $this->panicAlertService = $panicAlertService;
    }

    /**
     * Display panic alerts for the current user.
     */
    public function index()
    {
        $user = auth()->user();
        $panicAlerts = $this->panicAlertService->getPanicAlertsForUser($user);
        $unviewedCount = $this->panicAlertService->getUnviewedAlertsCount($user);

        return Inertia::render('panic-alerts/index', [
            'panicAlerts' => $panicAlerts,
            'unviewedCount' => $unviewedCount,
        ]);
    }

    /**
     * Show a specific panic alert.
     */
    public function show(PanicAlert $panicAlert)
    {
        $user = auth()->user();

        // Check if user has permission to view this alert
        if (!$this->canViewAlert($user, $panicAlert)) {
            abort(403, 'Unauthorized to view this panic alert.');
        }

        // Mark notification as viewed
        $this->panicAlertService->markNotificationAsViewed($panicAlert, $user);

        $panicAlert->load(['child', 'resolvedBy', 'notifications.notifiedUser']);

        return Inertia::render('panic-alerts/show', [
            'panicAlert' => $panicAlert,
        ]);
    }

    /**
     * Acknowledge a panic alert.
     */
    public function acknowledge(PanicAlert $panicAlert)
    {
        $user = auth()->user();

        // Check if user has permission to acknowledge this alert
        if (!$this->canManageAlert($user, $panicAlert)) {
            abort(403, 'Unauthorized to acknowledge this panic alert.');
        }

        $success = $this->panicAlertService->acknowledgePanicAlert($panicAlert, $user);

        if ($success) {
            return back()->with('success', 'Panic alert acknowledged successfully.');
        }

        return back()->with('error', 'Unable to acknowledge panic alert.');
    }

    /**
     * Resolve a panic alert.
     */
    public function resolve(PanicAlert $panicAlert, Request $request)
    {
        $user = auth()->user();

        // Check if user has permission to resolve this alert
        if (!$this->canManageAlert($user, $panicAlert)) {
            abort(403, 'Unauthorized to resolve this panic alert.');
        }

        $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        $success = $this->panicAlertService->resolvePanicAlert(
            $panicAlert,
            $user,
            $request->input('notes')
        );

        if ($success) {
            return back()->with('success', 'Panic alert resolved successfully.');
        }

        return back()->with('error', 'Unable to resolve panic alert.');
    }

    /**
     * Get unviewed alerts count for navigation badge.
     */
    public function getUnviewedCount()
    {
        $user = auth()->user();
        $count = $this->panicAlertService->getUnviewedAlertsCount($user);

        return response()->json(['count' => $count]);
    }

    /**
     * Check if user can view a specific alert.
     */
    private function canViewAlert($user, PanicAlert $panicAlert): bool
    {
        // Admins can view all alerts
        if ($user->hasRole('admin')) {
            return true;
        }

        // Guardians can view their children's alerts
        if ($user->hasRole('guardian')) {
            return $user->children->contains($panicAlert->child_id);
        }

        // Therapists can view alerts for their assigned children
        if ($user->hasRole('therapist')) {
            return $user->assignedChildren->contains($panicAlert->child_id);
        }

        // Children can view their own alerts
        if ($user->hasRole('child')) {
            return $user->id === $panicAlert->child_id;
        }

        return false;
    }

    /**
     * Check if user can manage (acknowledge/resolve) an alert.
     */
    private function canManageAlert($user, PanicAlert $panicAlert): bool
    {
        // Children cannot manage alerts
        if ($user->hasRole('child')) {
            return false;
        }

        // Use the same logic as viewing for other roles
        return $this->canViewAlert($user, $panicAlert);
    }
}
