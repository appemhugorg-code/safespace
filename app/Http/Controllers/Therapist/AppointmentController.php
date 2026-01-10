<?php

namespace App\Http\Controllers\Therapist;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\User;
use App\Services\ConnectionManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    protected ConnectionManagementService $connectionService;

    public function __construct(ConnectionManagementService $connectionService)
    {
        $this->connectionService = $connectionService;
    }
    /**
     * Show the form for creating a new appointment.
     */
    public function create()
    {
        $therapist = auth()->user();

        // Get connected children and guardians from therapeutic relationships
        $childConnections = $this->connectionService->getTherapistChildConnections($therapist->id);
        $guardianConnections = $this->connectionService->getTherapistGuardianConnections($therapist->id);

        // Get children with their guardian information
        $children = $childConnections->map(function ($connection) {
            $child = $connection->client;
            return [
                'id' => $child->id,
                'name' => $child->name,
                'email' => $child->email,
                'type' => 'child',
                'guardian' => $child->guardian ? [
                    'id' => $child->guardian->id,
                    'name' => $child->guardian->name,
                    'email' => $child->guardian->email,
                ] : null,
            ];
        });

        // Get guardians
        $guardians = $guardianConnections->map(function ($connection) {
            $guardian = $connection->client;
            return [
                'id' => $guardian->id,
                'name' => $guardian->name,
                'email' => $guardian->email,
                'type' => 'guardian',
            ];
        });

        // Combine clients
        $clients = $children->concat($guardians);

        return Inertia::render('therapist/appointment-create', [
            'clients' => $clients,
            'therapist' => $therapist,
        ]);
    }

    /**
     * Store a newly created appointment.
     */
    public function store(Request $request)
    {
        $therapist = auth()->user();

        $validated = $request->validate([
            'client_id' => 'required|exists:users,id',
            'client_type' => 'required|in:child,guardian',
            'scheduled_at' => 'required|date|after:now',
            'duration_minutes' => 'required|integer|in:30,60,90,120',
            'notes' => 'nullable|string|max:500',
        ]);

        $client = User::findOrFail($validated['client_id']);

        // Validate therapeutic relationship exists
        $hasConnection = $this->connectionService->hasActiveConnection($therapist->id, $client->id);
        if (!$hasConnection) {
            return back()->withErrors([
                'client_id' => 'You do not have an active therapeutic relationship with this client.',
            ]);
        }

        // Determine child_id and guardian_id based on client type
        if ($validated['client_type'] === 'child') {
            $childId = $client->id;
            $guardianId = $client->guardian_id;
        } else {
            $childId = null;
            $guardianId = $client->id;
        }

        // Cast duration to integer
        $durationMinutes = (int) $validated['duration_minutes'];

        // Check for scheduling conflicts
        if (Appointment::hasConflict(
            $therapist->id,
            $validated['scheduled_at'],
            $durationMinutes
        )) {
            return back()->withErrors([
                'scheduled_at' => 'You have a scheduling conflict at this time. Please choose a different time slot.',
            ]);
        }

        // Create appointment with requested status (requires client confirmation)
        $appointment = Appointment::create([
            'therapist_id' => $therapist->id,
            'child_id' => $childId,
            'guardian_id' => $guardianId,
            'scheduled_at' => $validated['scheduled_at'],
            'duration_minutes' => $durationMinutes,
            'notes' => $validated['notes'],
            'status' => 'requested',
            'appointment_type' => $childId ? 'individual' : 'consultation',
        ]);

        // Send notifications (meeting link will be generated when confirmed)
        $this->sendAppointmentNotifications($appointment);

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment request sent! Waiting for client confirmation.');
    }

    /**
     * Process appointment creation: generate meeting link and send notifications.
     */
    private function processAppointmentCreation(Appointment $appointment)
    {
        // Generate Google Meet link
        try {
            $googleMeetService = app(\App\Services\GoogleMeetService::class);
            $googleMeetService->createTherapySession($appointment);
        } catch (\Exception $e) {
            \Log::error('Failed to create Google Meet link: '.$e->getMessage());
        }

        // Send notifications
        $this->sendAppointmentNotifications($appointment);
    }

    /**
     * Send notifications for newly created appointment.
     */
    private function sendAppointmentNotifications(Appointment $appointment)
    {
        $emailService = app(\App\Services\EmailNotificationService::class);
        $notificationService = app(\App\Services\NotificationService::class);

        // Send email confirmation
        $emailService->sendAppointmentConfirmation($appointment);

        // Create in-app notifications using NotificationService
        if ($appointment->child_id) {
            // Appointment with child - notify both child and guardian
            $notificationService->create(
                $appointment->child_id,
                \App\Services\NotificationService::TYPE_APPOINTMENT_SCHEDULED,
                'New Appointment Request',
                'Your therapist has requested a session for '.$appointment->scheduled_at->format('M d, Y \a\t g:i A').'. Please confirm your availability.',
                [
                    'appointment_id' => $appointment->id,
                    'scheduled_at' => $appointment->scheduled_at->toISOString(),
                ],
                route('appointments.show', $appointment->id),
                'normal'
            );

            if ($appointment->guardian_id) {
                $notificationService->create(
                    $appointment->guardian_id,
                    \App\Services\NotificationService::TYPE_APPOINTMENT_SCHEDULED,
                    'Appointment Request for '.$appointment->child->name,
                    'A therapy session has been requested for '.$appointment->scheduled_at->format('M d, Y \a\t g:i A').'. Please confirm availability.',
                    [
                        'appointment_id' => $appointment->id,
                        'child_id' => $appointment->child_id,
                        'scheduled_at' => $appointment->scheduled_at->toISOString(),
                    ],
                    route('appointments.show', $appointment->id),
                    'normal'
                );
            }
        } else {
            // Appointment with guardian only
            $notificationService->create(
                $appointment->guardian_id,
                \App\Services\NotificationService::TYPE_APPOINTMENT_SCHEDULED,
                'New Consultation Request',
                'Your therapist has requested a consultation for '.$appointment->scheduled_at->format('M d, Y \a\t g:i A').'. Please confirm your availability.',
                [
                    'appointment_id' => $appointment->id,
                    'scheduled_at' => $appointment->scheduled_at->toISOString(),
                ],
                route('appointments.show', $appointment->id),
                'normal'
            );
        }
    }
}
