<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AuditLog;
use App\Models\User;
use App\Services\ConnectionManagementService;
use App\Services\ConnectionPermissionService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    protected ConnectionManagementService $connectionService;
    protected ConnectionPermissionService $permissionService;

    public function __construct(
        ConnectionManagementService $connectionService,
        ConnectionPermissionService $permissionService
    ) {
        $this->connectionService = $connectionService;
        $this->permissionService = $permissionService;
    }
    /**
     * Display appointments for the authenticated user.
     */
    public function index()
    {
        $user = auth()->user();

        // Use permission service to get accessible appointments
        $appointments = $this->permissionService->getAccessibleAppointments($user);

        // Transform appointments to ensure all relationships are present
        $appointments = $appointments->map(function ($appointment) {
            return [
                'id' => $appointment->id,
                'scheduled_at' => $appointment->scheduled_at,
                'duration_minutes' => $appointment->duration_minutes,
                'status' => $appointment->status,
                'appointment_type' => $appointment->appointment_type,
                'notes' => $appointment->notes,
                'therapist' => $appointment->therapist ? [
                    'id' => $appointment->therapist->id,
                    'name' => $appointment->therapist->name,
                    'email' => $appointment->therapist->email,
                ] : null,
                'child' => $appointment->child ? [
                    'id' => $appointment->child->id,
                    'name' => $appointment->child->name,
                    'email' => $appointment->child->email,
                ] : null,
                'guardian' => $appointment->guardian ? [
                    'id' => $appointment->guardian->id,
                    'name' => $appointment->guardian->name,
                    'email' => $appointment->guardian->email,
                ] : null,
            ];
        });

        return Inertia::render('appointments/index', [
            'appointments' => $appointments,
            'currentUser' => $user->load('roles'),
        ]);
    }

    /**
     * Show the form for creating a new appointment.
     */
    public function create()
    {
        $user = auth()->user();

        if ($user->hasRole('guardian')) {
            $children = $user->children()->where('status', 'active')->get();
            
            // Only show therapists that the guardian has active connections with
            $connectedTherapistIds = $this->connectionService->getClientConnections($user->id)
                ->pluck('therapist_id')
                ->toArray();
            
            $therapists = User::role('therapist')
                ->where('status', 'active')
                ->whereIn('id', $connectedTherapistIds)
                ->get();

            return Inertia::render('appointments/create-universal', [
                'children' => $children,
                'therapists' => $therapists,
                'userRole' => 'guardian',
            ]);
        }

        if ($user->hasRole('therapist')) {
            // Get all children/patients that this therapist has active connections with
            $connectedChildIds = $this->connectionService->getTherapistChildConnections($user->id)
                ->pluck('client_id')
                ->toArray();
            
            $patients = User::role('child')
                ->where('status', 'active')
                ->whereIn('id', $connectedChildIds)
                ->get();

            return Inertia::render('appointments/create-universal', [
                'patients' => $patients,
                'therapist' => $user,
                'userRole' => 'therapist',
            ]);
        }

        if ($user->hasRole('child')) {
            // Children can only schedule with therapists they have active connections with
            $connectedTherapistIds = $this->connectionService->getClientConnections($user->id)
                ->pluck('therapist_id')
                ->toArray();
            
            $therapists = User::role('therapist')
                ->where('status', 'active')
                ->whereIn('id', $connectedTherapistIds)
                ->get();

            return Inertia::render('appointments/create-universal', [
                'therapists' => $therapists,
                'child' => $user,
                'userRole' => 'child',
            ]);
        }

        abort(403, 'Unable to create appointments');
    }

    /**
     * Store a newly created appointment.
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        if (! $user->hasAnyRole(['guardian', 'therapist', 'child'])) {
            abort(403, 'You do not have permission to create appointments');
        }

        $request->validate([
            'child_id' => 'required|exists:users,id',
            'therapist_id' => 'required|exists:users,id',
            'scheduled_at' => 'required|date|after:now',
            'duration_minutes' => 'required|integer|min:30|max:120',
            'notes' => 'nullable|string|max:500',
        ]);

        $therapistId = $request->therapist_id;
        $childId = $request->child_id;
        $guardianId = null;
        $status = 'requested'; // Default status

        // Validate therapeutic relationships exist
        $this->validateTherapeuticRelationship($user, $therapistId, $childId);

        // If user is guardian, verify child belongs to them
        if ($user->hasRole('guardian')) {
            $child = $user->children()->findOrFail($childId);
            $guardianId = $user->id;
            $status = 'requested'; // Needs therapist confirmation
        }

        // If user is therapist, verify they are the therapist and get guardian
        if ($user->hasRole('therapist')) {
            if ($therapistId != $user->id) {
                abort(403, 'You can only create appointments for yourself');
            }
            $child = User::findOrFail($childId);
            $guardianId = $child->guardian_id;
            $status = 'requested'; // Needs guardian/child confirmation
        }

        // If user is child, verify they are scheduling for themselves
        if ($user->hasRole('child')) {
            if ($childId != $user->id) {
                abort(403, 'You can only create appointments for yourself');
            }
            $guardianId = $user->guardian_id;
            $status = 'requested'; // Needs therapist confirmation
        }

        // Check for conflicts
        if (Appointment::hasConflict($therapistId, $request->scheduled_at, $request->duration_minutes)) {
            return back()->withErrors(['scheduled_at' => 'The therapist is not available at this time.']);
        }

        $appointment = Appointment::create([
            'therapist_id' => $therapistId,
            'child_id' => $childId,
            'guardian_id' => $guardianId,
            'scheduled_at' => $request->scheduled_at,
            'duration_minutes' => $request->duration_minutes,
            'notes' => $request->notes,
            'status' => $status,
        ]);

        // If appointment is confirmed (therapist-created), create Google Meet link and send emails
        if ($status === 'confirmed') {
            $googleMeetService = app(\App\Services\GoogleMeetService::class);
            $googleMeetService->createTherapySession($appointment);

            $emailService = app(\App\Services\EmailNotificationService::class);
            $emailService->sendAppointmentConfirmation($appointment);
        }

        $message = $status === 'confirmed'
            ? 'Appointment scheduled successfully!'
            : 'Appointment request submitted successfully!';

        return redirect()->route('appointments.index')
            ->with('success', $message);
    }

    /**
     * Display the specified appointment.
     */
    public function show(Appointment $appointment)
    {
        $user = auth()->user();

        // Check if user has access to this appointment
        if (! $this->userCanAccessAppointment($user, $appointment)) {
            abort(403, 'Unauthorized access to appointment');
        }

        $appointment->load(['child', 'therapist', 'guardian']);

        // Transform appointment data to ensure all fields are present
        $appointmentData = [
            'id' => $appointment->id,
            'scheduled_at' => $appointment->scheduled_at,
            'duration_minutes' => $appointment->duration_minutes,
            'status' => $appointment->status,
            'appointment_type' => $appointment->appointment_type,
            'notes' => $appointment->notes,
            'therapist_notes' => $appointment->therapist_notes,
            'meeting_link' => $appointment->meeting_link,
            'google_meet_link' => $appointment->google_meet_link,
            'cancellation_reason' => $appointment->cancellation_reason,
            'therapist' => $appointment->therapist ? [
                'id' => $appointment->therapist->id,
                'name' => $appointment->therapist->name,
                'email' => $appointment->therapist->email,
            ] : null,
            'child' => $appointment->child ? [
                'id' => $appointment->child->id,
                'name' => $appointment->child->name,
                'email' => $appointment->child->email,
            ] : null,
            'guardian' => $appointment->guardian ? [
                'id' => $appointment->guardian->id,
                'name' => $appointment->guardian->name,
                'email' => $appointment->guardian->email,
            ] : null,
        ];

        return Inertia::render('appointments/show', [
            'appointment' => $appointmentData,
            'currentUser' => $user->load('roles'),
        ]);
    }

    /**
     * Confirm an appointment.
     * Any participant can confirm the appointment.
     */
    public function confirm(Appointment $appointment)
    {
        $user = auth()->user();

        // Check if user is a participant in this appointment
        $isParticipant = ($appointment->therapist_id === $user->id) ||
                        ($appointment->guardian_id === $user->id) ||
                        ($appointment->child_id === $user->id);

        if (! $isParticipant) {
            abort(403, 'You are not a participant in this appointment');
        }

        if (! $appointment->canBeConfirmed()) {
            return back()->withErrors(['status' => 'Appointment cannot be confirmed']);
        }

        $appointment->update([
            'status' => 'confirmed',
        ]);

        // Create Google Meet link and send confirmation emails
        try {
            $googleMeetService = app(\App\Services\GoogleMeetService::class);
            $success = $googleMeetService->createTherapySession($appointment);
            
            // If Google Meet creation failed, create a placeholder link
            if (!$success || !$appointment->google_meet_link) {
                $appointment->update([
                    'meeting_link' => 'https://meet.google.com/' . \Str::random(10),
                ]);
            }

            $emailService = app(\App\Services\EmailNotificationService::class);
            $emailService->sendAppointmentConfirmation($appointment);
        } catch (\Exception $e) {
            // Log error and create fallback meeting link
            \Log::error('Failed to create meeting link or send emails: ' . $e->getMessage());
            
            // Create a placeholder meeting link so appointment can still proceed
            if (!$appointment->meeting_link && !$appointment->google_meet_link) {
                $appointment->update([
                    'meeting_link' => 'https://meet.google.com/' . \Str::random(10),
                ]);
            }
        }

        return back()->with('success', 'Appointment confirmed successfully!');
    }

    /**
     * Cancel an appointment.
     */
    public function cancel(Request $request, Appointment $appointment)
    {
        $user = auth()->user();

        if (! $this->userCanAccessAppointment($user, $appointment)) {
            abort(403, 'Unauthorized action');
        }

        if (! $appointment->canBeCancelled()) {
            return back()->withErrors(['status' => 'Appointment cannot be cancelled']);
        }

        $request->validate([
            'cancellation_reason' => 'required|string|max:500',
        ]);

        // Store old values for audit
        $oldValues = $appointment->toArray();

        $appointment->update([
            'status' => 'cancelled',
            'cancellation_reason' => $request->cancellation_reason,
            'cancelled_at' => now(),
        ]);

        // Log the cancellation
        AuditLog::logAction(
            'appointment_cancelled',
            $appointment,
            $oldValues,
            $appointment->fresh()->toArray(),
            [
                'cancellation_reason' => $request->cancellation_reason,
                'cancelled_by_role' => $user->roles->first()?->name,
            ]
        );

        return back()->with('success', 'Appointment cancelled successfully.');
    }

    /**
     * Mark appointment as completed (therapist only).
     */
    public function complete(Request $request, Appointment $appointment)
    {
        $user = auth()->user();

        if (! $user->hasRole('therapist') || $appointment->therapist_id !== $user->id) {
            abort(403, 'Unauthorized action');
        }

        $request->validate([
            'therapist_notes' => 'nullable|string|max:1000',
        ]);

        $appointment->update([
            'status' => 'completed',
            'therapist_notes' => $request->therapist_notes,
        ]);

        return back()->with('success', 'Appointment marked as completed.');
    }

    /**
     * Get available time slots for a therapist.
     */
    public function availableSlots(Request $request)
    {
        try {
            $request->validate([
                'therapist_id' => 'required|exists:users,id',
                'date' => 'required|date_format:Y-m-d',
            ]);

            $user = auth()->user();
            $therapistId = $request->therapist_id;
            $requestedDate = Carbon::parse($request->date);

            // Check if date is not too far in the past (allow some flexibility)
            if ($requestedDate->lt(Carbon::today()->subDay())) {
                return response()->json(['error' => 'Cannot schedule appointments for past dates'], 400);
            }

            // Validate that the user has an active connection with the therapist
            if (!$user->hasRole('admin')) {
                $hasConnection = false;
                
                if ($user->hasRole('therapist') && $user->id == $therapistId) {
                    $hasConnection = true; // Therapist checking their own slots
                } else {
                    $hasConnection = $this->connectionService->hasActiveConnection($user->id, $therapistId);
                }
                
                if (!$hasConnection) {
                    return response()->json(['error' => 'You do not have an active connection with this therapist'], 403);
                }
            }

            $date = Carbon::parse($request->date);

            // Use AppointmentScheduler service to get available slots
            $scheduler = app(\App\Services\AppointmentScheduler::class);
            $slots = $scheduler->getAvailableSlots($therapistId, $date);

            // Transform slots to match frontend expectations
            $availableSlots = $slots->map(function ($slot) {
                return [
                    'time' => $slot['start']->format('H:i'),
                    'datetime' => $slot['start']->toISOString(),
                    'display' => $slot['formatted_range'],
                    'duration_minutes' => $slot['duration_minutes'],
                ];
            });

            return response()->json($availableSlots);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 400);
        } catch (\Exception $e) {
            \Log::error('Available slots error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch available slots', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Check if user can access appointment.
     */
    private function userCanAccessAppointment($user, $appointment)
    {
        if ($user->hasRole('therapist')) {
            return $appointment->therapist_id === $user->id;
        }

        if ($user->hasRole('guardian')) {
            return $appointment->guardian_id === $user->id;
        }

        if ($user->hasRole('child')) {
            return $appointment->child_id === $user->id;
        }

        if ($user->hasRole('admin')) {
            return true;
        }

        return false;
    }

    /**
     * Validate that therapeutic relationships exist for appointment creation.
     */
    private function validateTherapeuticRelationship($user, $therapistId, $childId)
    {
        // Admin users can create appointments without connection validation
        if ($user->hasRole('admin')) {
            return;
        }

        $therapist = User::findOrFail($therapistId);
        $child = User::findOrFail($childId);

        // Use permission service to check if appointment scheduling is allowed
        if (!$this->permissionService->canScheduleAppointment($user, $therapist)) {
            abort(403, 'You do not have an active therapeutic relationship with this therapist');
        }

        // Check therapist-child connection
        if (!$this->permissionService->canScheduleAppointment($therapist, $child)) {
            abort(403, 'The therapist does not have an active therapeutic relationship with this child');
        }

        // For guardian creating appointment, also verify child belongs to them
        if ($user->hasRole('guardian')) {
            $userChild = $user->children()->find($childId);
            if (!$userChild) {
                abort(403, 'You can only create appointments for your own children');
            }
        }

        // For child creating appointment, verify they are scheduling for themselves
        if ($user->hasRole('child') && $user->id != $childId) {
            abort(403, 'You can only create appointments for yourself');
        }

        // For therapist creating appointment, verify they are the therapist
        if ($user->hasRole('therapist') && $user->id != $therapistId) {
            abort(403, 'You can only create appointments for yourself');
        }
    }
}
