<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VideoSession;
use App\Models\VideoSessionParticipant;
use App\Services\VideoSessionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class VideoSessionController extends Controller
{
    protected VideoSessionService $videoSessionService;

    public function __construct(VideoSessionService $videoSessionService)
    {
        $this->videoSessionService = $videoSessionService;
    }

    /**
     * Create a new video session room
     */
    public function createRoom(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|in:therapy-session,group-session,consultation',
            'maxParticipants' => 'required|integer|min:2|max:12',
            'metadata' => 'required|array',
            'metadata.therapistId' => 'required|exists:users,id',
            'metadata.sessionType' => 'required|in:individual,group,family,consultation',
            'metadata.scheduledDuration' => 'required|integer|min:15|max:180',
            'metadata.recordingConsent' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $room = $this->videoSessionService->createRoom(
                $request->input('name'),
                $request->input('type'),
                $request->input('maxParticipants'),
                $request->input('metadata'),
                Auth::id()
            );

            return response()->json([
                'success' => true,
                'room' => $room->toArray(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create room: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Join a video session room
     */
    public function joinRoom(Request $request, string $roomId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'participant' => 'required|array',
            'participant.name' => 'required|string|max:255',
            'participant.role' => 'required|in:therapist,client,guardian',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $result = $this->videoSessionService->joinRoom(
                $roomId,
                Auth::id(),
                $request->input('participant')
            );

            return response()->json([
                'success' => true,
                'room' => $result['room']->toArray(),
                'permissions' => $result['permissions'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to join room: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Leave a video session room
     */
    public function leaveRoom(Request $request, string $roomId): JsonResponse
    {
        try {
            $this->videoSessionService->leaveRoom($roomId, Auth::id());

            return response()->json([
                'success' => true,
                'message' => 'Left room successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to leave room: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * End a video session
     */
    public function endSession(Request $request, string $roomId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'sessionNotes' => 'nullable|string|max:5000',
            'endTime' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $this->videoSessionService->endSession(
                $roomId,
                Auth::id(),
                $request->input('sessionNotes'),
                $request->input('endTime')
            );

            return response()->json([
                'success' => true,
                'message' => 'Session ended successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to end session: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Update participant in room
     */
    public function updateParticipant(Request $request, string $roomId, string $participantId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'isAudioEnabled' => 'sometimes|boolean',
            'isVideoEnabled' => 'sometimes|boolean',
            'isScreenSharing' => 'sometimes|boolean',
            'connectionState' => 'sometimes|in:connecting,connected,disconnected,failed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $participant = $this->videoSessionService->updateParticipant(
                $roomId,
                $participantId,
                $request->only(['isAudioEnabled', 'isVideoEnabled', 'isScreenSharing', 'connectionState'])
            );

            return response()->json([
                'success' => true,
                'participant' => $participant->toArray(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update participant: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Mute/unmute participant
     */
    public function muteParticipant(Request $request, string $roomId, string $participantId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'muted' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $this->videoSessionService->muteParticipant(
                $roomId,
                $participantId,
                $request->input('muted'),
                Auth::id()
            );

            return response()->json([
                'success' => true,
                'message' => 'Participant mute status updated',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update mute status: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Kick participant from room
     */
    public function kickParticipant(Request $request, string $roomId, string $participantId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $this->videoSessionService->kickParticipant(
                $roomId,
                $participantId,
                Auth::id(),
                $request->input('reason')
            );

            return response()->json([
                'success' => true,
                'message' => 'Participant removed from room',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to kick participant: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Start recording session
     */
    public function startRecording(Request $request, string $roomId): JsonResponse
    {
        try {
            $recordingId = $this->videoSessionService->startRecording($roomId, Auth::id());

            return response()->json([
                'success' => true,
                'recordingId' => $recordingId,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to start recording: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Stop recording session
     */
    public function stopRecording(Request $request, string $roomId): JsonResponse
    {
        try {
            $result = $this->videoSessionService->stopRecording($roomId, Auth::id());

            return response()->json([
                'success' => true,
                'recordingUrl' => $result['url'],
                'duration' => $result['duration'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to stop recording: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get participant's room history
     */
    public function getParticipantRooms(Request $request, string $participantId): JsonResponse
    {
        $limit = $request->query('limit', 10);

        try {
            $rooms = $this->videoSessionService->getParticipantRooms($participantId, $limit);

            return response()->json([
                'success' => true,
                'rooms' => $rooms->toArray(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get room history: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get active rooms
     */
    public function getActiveRooms(): JsonResponse
    {
        try {
            $rooms = $this->videoSessionService->getActiveRooms();

            return response()->json([
                'success' => true,
                'rooms' => $rooms->toArray(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get active rooms: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Validate room access
     */
    public function validateRoomAccess(string $roomId, string $participantId): JsonResponse
    {
        try {
            $hasAccess = $this->videoSessionService->validateRoomAccess($roomId, $participantId);

            return response()->json([
                'success' => true,
                'hasAccess' => $hasAccess,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to validate access: ' . $e->getMessage(),
            ], 400);
        }
    }
}