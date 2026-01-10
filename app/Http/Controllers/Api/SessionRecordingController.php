<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SessionRecordingService;
use App\Models\SessionRecording;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class SessionRecordingController extends Controller
{
    protected SessionRecordingService $recordingService;

    public function __construct(SessionRecordingService $recordingService)
    {
        $this->recordingService = $recordingService;
    }

    /**
     * Start a new session recording.
     */
    public function start(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'session_id' => 'required|uuid',
            'quality' => 'sometimes|in:low,medium,high',
            'encryption' => 'sometimes|boolean',
            'retention_period' => 'sometimes|integer|min:1|max:3650',
            'compliance_level' => 'sometimes|in:HIPAA,GDPR,BOTH',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $recording = $this->recordingService->startRecording($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Recording started successfully',
                'data' => [
                    'recording' => $recording,
                ],
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to start recording: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Stop a session recording.
     */
    public function stop(Request $request, string $recordingId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'duration' => 'sometimes|integer|min:0',
            'file_size' => 'sometimes|integer|min:0',
            'checksum' => 'sometimes|string',
            'file_content' => 'sometimes|string',
            'network_stats' => 'sometimes|array',
            'events' => 'sometimes|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $recording = $this->recordingService->stopRecording($recordingId, $request->all());

            return response()->json([
                'success' => true,
                'message' => 'Recording stopped successfully',
                'data' => [
                    'recording' => $recording,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to stop recording: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get recording details.
     */
    public function show(string $recordingId): JsonResponse
    {
        try {
            $recording = SessionRecording::with(['sessionLog', 'accessControls.user'])
                                       ->findOrFail($recordingId);

            // Check access permissions
            if (!$recording->isAccessibleBy(auth()->user())) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied to this recording',
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'recording' => $recording,
                    'permissions' => $recording->getPermissionsFor(auth()->user()),
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Recording not found',
            ], 404);
        }
    }

    /**
     * Download recording file.
     */
    public function download(string $recordingId): JsonResponse
    {
        try {
            $content = $this->recordingService->getRecordingFile($recordingId, auth()->user());
            $recording = SessionRecording::findOrFail($recordingId);

            return response()->json([
                'success' => true,
                'data' => [
                    'content' => base64_encode($content),
                    'filename' => $recording->id . '.webm',
                    'size' => $recording->file_size,
                    'mime_type' => 'video/webm',
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to download recording: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update recording access permissions.
     */
    public function updateAccess(Request $request, string $recordingId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|uuid|exists:users,id',
            'permissions' => 'required|array',
            'permissions.*' => 'in:view,download,delete,share',
            'expires_at' => 'sometimes|date|after:now',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $access = $this->recordingService->updateRecordingAccess(
                $recordingId,
                $request->user_id,
                $request->all(),
                auth()->user()
            );

            return response()->json([
                'success' => true,
                'message' => 'Access permissions updated successfully',
                'data' => [
                    'access' => $access,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update access: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a recording.
     */
    public function destroy(string $recordingId): JsonResponse
    {
        try {
            $deleted = $this->recordingService->deleteRecording($recordingId, auth()->user());

            return response()->json([
                'success' => true,
                'message' => 'Recording deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete recording: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user's recordings.
     */
    public function index(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|in:recording,stopped,processing,completed,failed',
            'date_from' => 'sometimes|date',
            'date_to' => 'sometimes|date|after_or_equal:date_from',
            'session_type' => 'sometimes|in:therapy-session,group-session,consultation,crisis-intervention',
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
            $recordings = $this->recordingService->getUserRecordings(
                auth()->user(),
                $request->all()
            );

            return response()->json([
                'success' => true,
                'data' => $recordings,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recordings: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get recording statistics.
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
            $user = auth()->user();
            $filters = $request->all();
            
            $recordings = $this->recordingService->getUserRecordings($user, $filters);
            
            $statistics = [
                'total_recordings' => $recordings->total(),
                'total_duration' => $recordings->sum('duration'),
                'total_file_size' => $recordings->sum('file_size'),
                'average_duration' => $recordings->avg('duration'),
                'recordings_by_status' => $recordings->groupBy('status')->map->count(),
                'recordings_by_quality' => $recordings->groupBy(function ($recording) {
                    return $recording->quality_settings['video']['height'] ?? 'unknown';
                })->map->count(),
            ];

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