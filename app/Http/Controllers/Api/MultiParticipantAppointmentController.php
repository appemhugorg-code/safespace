<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Services\MultiParticipantAppointmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MultiParticipantAppointmentController extends Controller
{
    protected MultiParticipantAppointmentService $service;

    public function __construct(MultiParticipantAppointmentService $service)
    {
        $this->service = $service;
    }

    /**
     * Create a group therapy session.
     */
    public function createGroupSession(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'therapist_id' => 'required|exists:users,id',
            'client_ids' => 'required|array|min:2',
            'client_ids.*' => 'exists:users,id',
            'observer_ids' => 'nullable|array',
            'observer_ids.*' => 'exists:users,id',
            'scheduled_at' => 'required|date|after:now',
            'duration_minutes' => 'nullable|integer|min:15|max:240',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $appointment = $this->service->createGroupTherapySession($request->all());

            return response()->json([
                'message' => 'Group therapy session created successfully',
                'appointment' => $appointment,
                'participants' => $this->service->getParticipants($appointment),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create group session',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create a family session.
     */
    public function createFamilySession(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'therapist_id' => 'required|exists:users,id',
            'child_id' => 'required|exists:users,id',
            'guardian_id' => 'required|exists:users,id',
            'scheduled_at' => 'required|date|after:now',
            'duration_minutes' => 'nullable|integer|min:15|max:240',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $appointment = $this->service->createFamilySession($request->all());

            return response()->json([
                'message' => 'Family session created successfully',
                'appointment' => $appointment,
                'participants' => $this->service->getParticipants($appointment),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create family session',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create a consultation session.
     */
    public function createConsultation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'organizer_id' => 'required|exists:users,id',
            'organizer_role' => 'nullable|in:therapist,admin,guardian',
            'participant_ids' => 'required|array|min:1',
            'participant_ids.*' => 'exists:users,id',
            'scheduled_at' => 'required|date|after:now',
            'duration_minutes' => 'nullable|integer|min:15|max:240',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $appointment = $this->service->createConsultationSession($request->all());

            return response()->json([
                'message' => 'Consultation created successfully',
                'appointment' => $appointment,
                'participants' => $this->service->getParticipants($appointment),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create consultation',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add a participant to an appointment.
     */
    public function addParticipant(Request $request, Appointment $appointment)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:therapist,client,guardian,observer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $participant = $this->service->addParticipant(
                $appointment,
                $request->user_id,
                $request->role
            );

            return response()->json([
                'message' => 'Participant added successfully',
                'participant' => $participant->load('user'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add participant',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove a participant from an appointment.
     */
    public function removeParticipant(Appointment $appointment, $userId)
    {
        try {
            $removed = $this->service->removeParticipant($appointment, $userId);

            if ($removed) {
                return response()->json([
                    'message' => 'Participant removed successfully',
                ], 200);
            }

            return response()->json([
                'message' => 'Participant not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to remove participant',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Confirm participant attendance.
     */
    public function confirmParticipant(Appointment $appointment, $userId)
    {
        try {
            $this->service->confirmParticipant($appointment, $userId);

            return response()->json([
                'message' => 'Attendance confirmed',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to confirm attendance',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Decline participant attendance.
     */
    public function declineParticipant(Appointment $appointment, $userId)
    {
        try {
            $this->service->declineParticipant($appointment, $userId);

            return response()->json([
                'message' => 'Attendance declined',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to decline attendance',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all participants for an appointment.
     */
    public function getParticipants(Appointment $appointment)
    {
        try {
            $participants = $this->service->getParticipants($appointment);

            return response()->json([
                'participants' => $participants,
                'stats' => $this->service->getAppointmentStats($appointment),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to get participants',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get appointment statistics.
     */
    public function getStats(Appointment $appointment)
    {
        try {
            $stats = $this->service->getAppointmentStats($appointment);

            return response()->json($stats, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to get statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
