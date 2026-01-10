<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\AppointmentParticipant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MultiParticipantAppointmentService
{
    protected ConnectionManagementService $connectionService;

    public function __construct(ConnectionManagementService $connectionService)
    {
        $this->connectionService = $connectionService;
    }
    /**
     * Create a group therapy session with multiple participants.
     */
    public function createGroupTherapySession(array $data): Appointment
    {
        return DB::transaction(function () use ($data) {
            // Validate therapeutic connections for all clients
            $this->validateTherapistClientConnections($data['therapist_id'], $data['client_ids'] ?? []);

            // Create the appointment
            $appointment = Appointment::create([
                'therapist_id' => $data['therapist_id'],
                'child_id' => $data['primary_client_id'] ?? null,
                'guardian_id' => $data['guardian_id'] ?? null,
                'scheduled_at' => $data['scheduled_at'],
                'duration_minutes' => $data['duration_minutes'] ?? 60,
                'status' => $data['status'] ?? 'requested',
                'appointment_type' => 'group',
                'title' => $data['title'] ?? 'Group Therapy Session',
                'description' => $data['description'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            // Add the therapist as a participant
            $appointment->addParticipant($data['therapist_id'], 'therapist', 'confirmed');

            // Add all client participants
            if (isset($data['client_ids']) && is_array($data['client_ids'])) {
                foreach ($data['client_ids'] as $clientId) {
                    $appointment->addParticipant($clientId, 'client', 'invited');
                }
            }

            // Add observers if any
            if (isset($data['observer_ids']) && is_array($data['observer_ids'])) {
                foreach ($data['observer_ids'] as $observerId) {
                    $appointment->addParticipant($observerId, 'observer', 'invited');
                }
            }

            Log::info('Group therapy session created', [
                'appointment_id' => $appointment->id,
                'participant_count' => $appointment->participants()->count(),
            ]);

            return $appointment->load('participants.user');
        });
    }

    /**
     * Create a family session (guardian + child + therapist).
     */
    public function createFamilySession(array $data): Appointment
    {
        return DB::transaction(function () use ($data) {
            // Validate therapeutic connections
            $this->validateTherapistClientConnections($data['therapist_id'], [$data['child_id'], $data['guardian_id']]);

            // Create the appointment
            $appointment = Appointment::create([
                'therapist_id' => $data['therapist_id'],
                'child_id' => $data['child_id'],
                'guardian_id' => $data['guardian_id'],
                'scheduled_at' => $data['scheduled_at'],
                'duration_minutes' => $data['duration_minutes'] ?? 60,
                'status' => $data['status'] ?? 'requested',
                'appointment_type' => 'family',
                'title' => $data['title'] ?? 'Family Therapy Session',
                'description' => $data['description'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            // Add participants
            $appointment->addParticipant($data['therapist_id'], 'therapist', 'confirmed');
            $appointment->addParticipant($data['child_id'], 'client', 'invited');
            $appointment->addParticipant($data['guardian_id'], 'guardian', 'invited');

            Log::info('Family session created', [
                'appointment_id' => $appointment->id,
                'child_id' => $data['child_id'],
                'guardian_id' => $data['guardian_id'],
            ]);

            return $appointment->load('participants.user');
        });
    }

    /**
     * Create a consultation session (e.g., therapist-guardian, admin-therapist).
     */
    public function createConsultationSession(array $data): Appointment
    {
        return DB::transaction(function () use ($data) {
            // Create the appointment
            $appointment = Appointment::create([
                'therapist_id' => $data['organizer_id'],
                'scheduled_at' => $data['scheduled_at'],
                'duration_minutes' => $data['duration_minutes'] ?? 60,
                'status' => $data['status'] ?? 'requested',
                'appointment_type' => 'consultation',
                'title' => $data['title'] ?? 'Consultation',
                'description' => $data['description'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            // Add organizer - map admin role to observer
            $organizerRole = $data['organizer_role'] ?? 'therapist';
            if ($organizerRole === 'admin') {
                $organizerRole = 'observer';
            }
            $appointment->addParticipant($data['organizer_id'], $organizerRole, 'confirmed');

            // Add all other participants
            if (isset($data['participant_ids']) && is_array($data['participant_ids'])) {
                foreach ($data['participant_ids'] as $participantId) {
                    $user = User::find($participantId);
                    $role = $this->determineParticipantRole($user);
                    $appointment->addParticipant($participantId, $role, 'invited');
                }
            }

            Log::info('Consultation session created', [
                'appointment_id' => $appointment->id,
                'organizer_id' => $data['organizer_id'],
            ]);

            return $appointment->load('participants.user');
        });
    }

    /**
     * Add a participant to an existing appointment.
     */
    public function addParticipant(Appointment $appointment, int $userId, string $role = 'client'): AppointmentParticipant
    {
        // Check if user is already a participant
        $existing = $appointment->participants()->where('user_id', $userId)->first();
        
        if ($existing) {
            Log::warning('User already a participant', [
                'appointment_id' => $appointment->id,
                'user_id' => $userId,
            ]);
            return $existing;
        }

        $participant = $appointment->addParticipant($userId, $role, 'invited');

        Log::info('Participant added to appointment', [
            'appointment_id' => $appointment->id,
            'user_id' => $userId,
            'role' => $role,
        ]);

        return $participant;
    }

    /**
     * Remove a participant from an appointment.
     */
    public function removeParticipant(Appointment $appointment, int $userId): bool
    {
        $removed = $appointment->removeParticipant($userId);

        if ($removed) {
            Log::info('Participant removed from appointment', [
                'appointment_id' => $appointment->id,
                'user_id' => $userId,
            ]);
        }

        return $removed > 0;
    }

    /**
     * Confirm participant attendance.
     */
    public function confirmParticipant(Appointment $appointment, int $userId): void
    {
        $participant = $appointment->participants()->where('user_id', $userId)->first();
        
        if ($participant) {
            $participant->confirm();
            
            Log::info('Participant confirmed', [
                'appointment_id' => $appointment->id,
                'user_id' => $userId,
            ]);
        }
    }

    /**
     * Decline participant attendance.
     */
    public function declineParticipant(Appointment $appointment, int $userId): void
    {
        $participant = $appointment->participants()->where('user_id', $userId)->first();
        
        if ($participant) {
            $participant->decline();
            
            Log::info('Participant declined', [
                'appointment_id' => $appointment->id,
                'user_id' => $userId,
            ]);
        }
    }

    /**
     * Get all participants for an appointment with their details.
     */
    public function getParticipants(Appointment $appointment)
    {
        return $appointment->participants()
            ->with('user')
            ->get()
            ->map(function ($participant) {
                return [
                    'id' => $participant->id,
                    'user_id' => $participant->user_id,
                    'name' => $participant->user->name,
                    'email' => $participant->user->email,
                    'role' => $participant->role,
                    'role_display' => $participant->role_display,
                    'status' => $participant->status,
                    'status_display' => $participant->status_display,
                    'status_color' => $participant->status_color,
                    'joined_at' => $participant->joined_at,
                    'left_at' => $participant->left_at,
                ];
            });
    }

    /**
     * Determine participant role based on user.
     */
    private function determineParticipantRole(User $user): string
    {
        if ($user->hasRole('therapist')) {
            return 'therapist';
        } elseif ($user->hasRole('guardian')) {
            return 'guardian';
        } elseif ($user->hasRole('child')) {
            return 'client';
        } elseif ($user->hasRole('admin')) {
            return 'observer'; // Admins participate as observers
        } else {
            return 'observer';
        }
    }

    /**
     * Check if all required participants have confirmed.
     */
    public function allParticipantsConfirmed(Appointment $appointment): bool
    {
        $totalParticipants = $appointment->participants()->count();
        $confirmedParticipants = $appointment->participants()->where('status', 'confirmed')->count();
        
        return $totalParticipants > 0 && $totalParticipants === $confirmedParticipants;
    }

    /**
     * Get appointment statistics.
     */
    public function getAppointmentStats(Appointment $appointment): array
    {
        return [
            'total_participants' => $appointment->participants()->count(),
            'confirmed' => $appointment->participants()->where('status', 'confirmed')->count(),
            'invited' => $appointment->participants()->where('status', 'invited')->count(),
            'declined' => $appointment->participants()->where('status', 'declined')->count(),
            'attended' => $appointment->participants()->where('status', 'attended')->count(),
            'no_show' => $appointment->participants()->where('status', 'no_show')->count(),
        ];
    }

    /**
     * Validate that therapeutic connections exist between therapist and all clients.
     */
    private function validateTherapistClientConnections(int $therapistId, array $clientIds): void
    {
        // Skip validation for admin users
        $currentUser = auth()->user();
        if ($currentUser && $currentUser->hasRole('admin')) {
            return;
        }

        foreach ($clientIds as $clientId) {
            $hasConnection = $this->connectionService->hasActiveConnection($therapistId, $clientId);
            if (!$hasConnection) {
                $client = User::find($clientId);
                $clientName = $client ? $client->name : "Client ID {$clientId}";
                throw new \Exception("No active therapeutic relationship exists between the therapist and {$clientName}");
            }
        }
    }
}
