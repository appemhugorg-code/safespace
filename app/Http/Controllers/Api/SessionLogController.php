<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SessionLogService;
use App\Models\SessionLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class SessionLogController extends Controller
{
    protected SessionLogService $sessionLogService;

    public function __construct(SessionLogService $sessionLogService)
    {
        $this->sessionLogService = $sessionLogService;
    }

    /**
     * Start a new session.
     */
    public function start(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'session_id' => 'sometimes|uuid',
            'type' => 'required|in:therapy-session,group-session,consultation,crisis-intervention',
            'therapist_id' => 'required|uuid|exists:users,id',
            'client_ids' => 'required|array|min:1',
            'client_ids.*' => 'uuid|exists:users,id',
            'guardian_ids' => 'sometimes|array',
            'guardian_ids.*' => 'uuid|exists:users,id',
            'appointment_id' => 'sometimes|uuid',
            'session_goals' => 'sometimes|array',
            'consent_obtained' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $sessionLog = $this->sessionLogService->startSession($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Session started successfully',
                'data' => [
                    'session' => $sessionLog,
                ],
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to start session: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * End a session.
     */
    public function end(Request $request, string $sessionId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'outcomes' => 'sometimes|array',
            'next_steps' => 'sometimes|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $sessionLog = $this->sessionLogService->endSession($sessionId, $request->all());

            return response()->json([
                'success' => true,
                'message' => 'Session ended successfully',
                'data' => [
                    'session' => $sessionLog,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to end session: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add a participant to the session.
     */
    public function addParticipant(Request $request, string $sessionId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|uuid',
            'name' => 'required|string|max:255',
            'role' => 'required|in:therapist,client,guardian',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $sessionLog = $this->sessionLogService->addParticipant($sessionId, $request->all());

            return response()->json([
                'success' => true,
                'message' => 'Participant added successfully',
                'data' => [
                    'session' => $sessionLog,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add participant: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove a participant from the session.
     */
    public function removeParticipant(string $sessionId, string $participantId): JsonResponse
    {
        try {
            $sessionLog = $this->sessionLogService->removeParticipant($sessionId, $participantId);

            return response()->json([
                'success' => true,
                'message' => 'Participant removed successfully',
                'data' => [
                    'session' => $sessionLog,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove participant: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add a note to the session.
     */
    public function addNote(Request $request, string $sessionId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:2000',
            'type' => 'required|in:session_summary,progress_note,observation,action_item,crisis_note',
            'tags' => 'sometimes|array',
            'tags.*' => 'string|max:50',
            'is_private' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $note = $this->sessionLogService->addNote($sessionId, $request->all(), auth()->user());

            return response()->json([
                'success' => true,
                'message' => 'Note added successfully',
                'data' => [
                    'note' => $note,
                ],
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add note: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get session notes.
     */
    public function getNotes(Request $request, string $sessionId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'type' => 'sometimes|in:session_summary,progress_note,observation,action_item,crisis_note',
            'show_private' => 'sometimes|boolean',
            'tags' => 'sometimes|array',
            'tags.*' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $notes = $this->sessionLogService->getSessionNotes($sessionId, auth()->user(), $request->all());

            return response()->json([
                'success' => true,
                'data' => [
                    'notes' => $notes,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch notes: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update session goals.
     */
    public function updateGoals(Request $request, string $sessionId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'goals' => 'required|array',
            'goals.*' => 'string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $sessionLog = $this->sessionLogService->updateSessionGoals(
                $sessionId,
                $request->goals,
                auth()->user()
            );

            return response()->json([
                'success' => true,
                'message' => 'Session goals updated successfully',
                'data' => [
                    'session' => $sessionLog,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update goals: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update session outcomes.
     */
    public function updateOutcomes(Request $request, string $sessionId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'outcomes' => 'required|array',
            'outcomes.*' => 'string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $sessionLog = $this->sessionLogService->updateSessionOutcomes(
                $sessionId,
                $request->outcomes,
                auth()->user()
            );

            return response()->json([
                'success' => true,
                'message' => 'Session outcomes updated successfully',
                'data' => [
                    'session' => $sessionLog,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update outcomes: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get session details.
     */
    public function show(string $sessionId): JsonResponse
    {
        try {
            $sessionLog = SessionLog::with(['therapist', 'recording', 'notes.author', 'auditTrail'])
                                  ->where('session_id', $sessionId)
                                  ->firstOrFail();

            // Check access permissions
            if (!$sessionLog->hasParticipant(auth()->user())) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied to this session',
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'session' => $sessionLog,
                    'user_role' => $sessionLog->getParticipantRole(auth()->user()),
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Session not found',
            ], 404);
        }
    }

    /**
     * Get user's sessions.
     */
    public function index(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|in:active,completed,terminated,failed',
            'type' => 'sometimes|in:therapy-session,group-session,consultation,crisis-intervention',
            'date_from' => 'sometimes|date',
            'date_to' => 'sometimes|date|after_or_equal:date_from',
            'per_page' => 'sometimes|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $sessions = $this->sessionLogService->getUserSessions(
                auth()->user(),
                $request->all()
            );

            return response()->json([
                'success' => true,
                'data' => $sessions,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch sessions: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get session statistics.
     */
    public function statistics(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'date_from' => 'sometimes|date',
            'date_to' => 'sometimes|date|after_or_equal:date_from',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $statistics = $this->sessionLogService->getSessionStatistics(
                auth()->user(),
                $request->all()
            );

            return response()->json([
                'success' => true,
                'data' => $statistics,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics: ' . $e->getMessage(),
            ], 500);
        }
    }
}