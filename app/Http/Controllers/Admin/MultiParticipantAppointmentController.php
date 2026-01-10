<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\User;
use App\Services\MultiParticipantAppointmentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MultiParticipantAppointmentController extends Controller
{
    protected MultiParticipantAppointmentService $service;

    public function __construct(MultiParticipantAppointmentService $service)
    {
        $this->service = $service;
    }

    /**
     * Show the multi-participant appointment creation form.
     */
    public function create()
    {
        $therapists = User::role('therapist')->where('status', 'active')->get(['id', 'name', 'email']);
        $guardians = User::role('guardian')->where('status', 'active')->get(['id', 'name', 'email']);
        $children = User::role('child')->where('status', 'active')->get(['id', 'name', 'email']);

        return Inertia::render('Admin/MultiParticipantAppointment/Create', [
            'therapists' => $therapists,
            'guardians' => $guardians,
            'children' => $children,
        ]);
    }

    /**
     * Store a new multi-participant appointment.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'appointment_type' => 'required|in:group,family,consultation',
            'therapist_id' => 'required|exists:users,id',
            'scheduled_at' => 'required|date|after:now',
            'duration_minutes' => 'required|integer|min:15|max:240',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'notes' => 'nullable|string',
            'participants' => 'required|array|min:1',
            'participants.*.user_id' => 'required|exists:users,id',
            'participants.*.role' => 'required|in:therapist,client,guardian,observer',
        ]);

        try {
            $appointment = null;

            switch ($validated['appointment_type']) {
                case 'group':
                    $clientIds = collect($validated['participants'])
                        ->where('role', 'client')
                        ->pluck('user_id')
                        ->toArray();

                    $appointment = $this->service->createGroupTherapySession([
                        'therapist_id' => $validated['therapist_id'],
                        'client_ids' => $clientIds,
                        'scheduled_at' => $validated['scheduled_at'],
                        'duration_minutes' => $validated['duration_minutes'],
                        'title' => $validated['title'],
                        'description' => $validated['description'] ?? null,
                        'notes' => $validated['notes'] ?? null,
                    ]);
                    break;

                case 'family':
                    $childId = collect($validated['participants'])
                        ->where('role', 'client')
                        ->first()['user_id'] ?? null;

                    $guardianId = collect($validated['participants'])
                        ->where('role', 'guardian')
                        ->first()['user_id'] ?? null;

                    if (!$childId || !$guardianId) {
                        return back()->withErrors(['participants' => 'Family session requires both a child and a guardian.']);
                    }

                    $appointment = $this->service->createFamilySession([
                        'therapist_id' => $validated['therapist_id'],
                        'child_id' => $childId,
                        'guardian_id' => $guardianId,
                        'scheduled_at' => $validated['scheduled_at'],
                        'duration_minutes' => $validated['duration_minutes'],
                        'title' => $validated['title'],
                        'description' => $validated['description'] ?? null,
                        'notes' => $validated['notes'] ?? null,
                    ]);
                    break;

                case 'consultation':
                    $participantIds = collect($validated['participants'])
                        ->pluck('user_id')
                        ->toArray();

                    $appointment = $this->service->createConsultationSession([
                        'organizer_id' => $validated['therapist_id'],
                        'participant_ids' => $participantIds,
                        'scheduled_at' => $validated['scheduled_at'],
                        'duration_minutes' => $validated['duration_minutes'],
                        'title' => $validated['title'],
                        'description' => $validated['description'] ?? null,
                        'notes' => $validated['notes'] ?? null,
                    ]);
                    break;
            }

            return redirect()->route('admin.appointments.index')
                ->with('success', 'Multi-participant appointment created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create appointment: ' . $e->getMessage()]);
        }
    }

    /**
     * Show appointment details with participants.
     */
    public function show(Appointment $appointment)
    {
        $appointment->load(['therapist', 'child', 'guardian', 'participants.user']);

        $participants = $this->service->getParticipants($appointment);
        $stats = $this->service->getAppointmentStats($appointment);

        return Inertia::render('Admin/MultiParticipantAppointment/Show', [
            'appointment' => $appointment,
            'participants' => $participants,
            'stats' => $stats,
        ]);
    }

    /**
     * Manage participants for an appointment.
     */
    public function manageParticipants(Appointment $appointment)
    {
        $appointment->load(['therapist', 'participants.user']);

        $availableUsers = User::whereNotIn('id', $appointment->participants->pluck('user_id'))
            ->where('status', 'active')
            ->get(['id', 'name', 'email']);

        $participants = $this->service->getParticipants($appointment);
        $stats = $this->service->getAppointmentStats($appointment);

        return Inertia::render('Admin/MultiParticipantAppointment/ManageParticipants', [
            'appointment' => $appointment,
            'participants' => $participants,
            'availableUsers' => $availableUsers,
            'stats' => $stats,
        ]);
    }
}
