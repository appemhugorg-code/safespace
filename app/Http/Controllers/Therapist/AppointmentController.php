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
        \Log::info('Appointment creation started', [
            'user_id' => auth()->id(),
            'user_roles' => auth()->user()->roles->pluck('name'),
            'request_data' => $request->all()
        ]);

        $therapist = auth()->user();

        // Verify user has therapist role
        if (!$therapist->hasRole('therapist')) {
            \Log::error('User does not have therapist role', [
                'user_id' => $therapist->id,
                'user_roles' => $therapist->roles->pluck('name')
            ]);
            return back()->withErrors([
                'general' => 'You do not have permission to create appointments.',
            ]);
        }

        try {
            $validated = $request->validate([
                'client_id' => 'required|exists:users,id',
                'client_type' => 'required|in:child,guardian',
                'scheduled_at' => 'required|date|after:now',
                'duration_minutes' => 'required|integer|min:15|max:240',
                'notes' => 'nullable|string|max:500',
            ]);

            \Log::info('Validation passed', ['validated_data' => $validated]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            
            return back()->withErrors($e->errors())->withInput();
        }

        $client = User::findOrFail($validated['client_id']);
        \Log::info('Client found', [
            'client_id' => $client->id,
            'client_name' => $client->name,
            'client_type' => $validated['client_type']
        ]);

        // Validate therapeutic relationship exists
        $hasConnection = $this->connectionService->hasActiveConnection($therapist->id, $client->id);
        \Log::info('Connection check', [
            'therapist_id' => $therapist->id,
            'client_id' => $client->id,
            'has_connection' => $hasConnection
        ]);
        
        if (!$hasConnection) {
            \Log::warning('No therapeutic relationship found');
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

        \Log::info('Appointment participants determined', [
            'child_id' => $childId,
            'guardian_id' => $guardianId,
            'client_type' => $validated['client_type']
        ]);

        // Cast duration to integer
        $durationMinutes = (int) $validated['duration_minutes'];

        // Check for scheduling conflicts
        $hasConflict = Appointment::hasConflict(
            $therapist->id,
            $validated['scheduled_at'],
            $durationMinutes
        );
        
        \Log::info('Conflict check', [
            'therapist_id' => $therapist->id,
            'scheduled_at' => $validated['scheduled_at'],
            'duration_minutes' => $durationMinutes,
            'has_conflict' => $hasConflict
        ]);
        
        if ($hasConflict) {
            \Log::warning('Scheduling conflict detected');
            return back()->withErrors([
                'scheduled_at' => 'You have a scheduling conflict at this time. Please choose a different time slot.',
            ]);
        }

        try {
            \Log::info('Creating appointment with data:', [
                'therapist_id' => $therapist->id,
                'child_id' => $childId,
                'guardian_id' => $guardianId,
                'scheduled_at' => $validated['scheduled_at'],
                'duration_minutes' => $durationMinutes,
                'notes' => $validated['notes'],
                'status' => 'requested',
                'appointment_type' => $childId ? 'individual' : 'consultation',
            ]);

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

            \Log::info('Appointment created successfully:', ['appointment_id' => $appointment->id]);

            // Send notifications (meeting link will be generated when confirmed)
            try {
                $this->sendAppointmentNotifications($appointment);
                \Log::info('Notifications sent successfully');
            } catch (\Exception $notificationError) {
                \Log::error('Failed to send notifications, but appointment was created: ' . $notificationError->getMessage());
                // Don't fail the appointment creation if notifications fail
            }

            \Log::info('Redirecting to appointments index');

            return redirect()->route('appointments.index')
                ->with('success', 'Appointment request sent successfully! Waiting for client confirmation.');

        } catch (\Exception $e) {
            \Log::error('Failed to create appointment: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors([
                'general' => 'Failed to create appointment. Please try again.',
            ])->with('error', 'Failed to create appointment. Please try again.');
        }
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
        try {
            $emailService = app(\App\Services\EmailNotificationService::class);
            
            // Send email confirmation
            $emailService->sendAppointmentConfirmation($appointment);
            \Log::info('Email notification sent successfully');
            
        } catch (\Exception $e) {
            \Log::error('Failed to send email notification: ' . $e->getMessage());
        }

        try {
            $notificationService = app(\App\Services\NotificationService::class);
            
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
                    '/appointments/' . $appointment->id,
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
                        '/appointments/' . $appointment->id,
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
                    '/appointments/' . $appointment->id,
                    'normal'
                );
            }
            
            \Log::info('In-app notifications sent successfully');
            
        } catch (\Exception $e) {
            \Log::error('Failed to send in-app notifications: ' . $e->getMessage());
        }
    }
}
