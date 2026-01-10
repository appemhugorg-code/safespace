<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UserPreferenceService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class UserPreferenceController extends Controller
{
    public function __construct(
        private UserPreferenceService $preferenceService
    ) {}

    /**
     * Get user preferences.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $preferences = $this->preferenceService->getUserPreferences($request->user());
            
            return response()->json([
                'success' => true,
                'data' => $preferences,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve preferences',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update user preferences.
     */
    public function update(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'preferences' => 'required|array',
            'device_id' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $success = $this->preferenceService->updatePreferences(
                $request->user(),
                $request->input('preferences'),
                $request->input('device_id')
            );

            if ($success) {
                $updatedPreferences = $this->preferenceService->getUserPreferences($request->user());
                
                return response()->json([
                    'success' => true,
                    'message' => 'Preferences updated successfully',
                    'data' => $updatedPreferences,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to update preferences',
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update preferences',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Sync preferences across devices.
     */
    public function sync(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'preferences' => 'required|array',
            'device_id' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $result = $this->preferenceService->syncPreferences(
                $request->user(),
                $request->input('preferences'),
                $request->input('device_id')
            );

            return response()->json([
                'success' => $result['success'],
                'conflicts' => $result['conflicts'],
                'message' => $result['success'] 
                    ? 'Preferences synced successfully' 
                    : 'Sync conflicts detected',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to sync preferences',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get preference conflicts.
     */
    public function conflicts(Request $request): JsonResponse
    {
        try {
            $conflicts = $this->preferenceService->getConflicts($request->user());
            
            return response()->json([
                'success' => true,
                'data' => $conflicts,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve conflicts',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Resolve preference conflicts.
     */
    public function resolveConflicts(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'resolutions' => 'required|array',
            'resolutions.*.field' => 'required|string',
            'resolutions.*.chosen_value' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $success = $this->preferenceService->resolveConflicts(
                $request->user(),
                $request->input('resolutions')
            );

            if ($success) {
                $updatedPreferences = $this->preferenceService->getUserPreferences($request->user());
                
                return response()->json([
                    'success' => true,
                    'message' => 'Conflicts resolved successfully',
                    'data' => $updatedPreferences,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to resolve conflicts',
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to resolve conflicts',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Export user preferences.
     */
    public function export(Request $request): JsonResponse
    {
        try {
            $backup = $this->preferenceService->exportPreferences($request->user());
            
            return response()->json([
                'success' => true,
                'data' => $backup,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export preferences',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Import user preferences.
     */
    public function import(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'backup_data' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $success = $this->preferenceService->importPreferences(
                $request->user(),
                $request->input('backup_data')
            );

            if ($success) {
                $updatedPreferences = $this->preferenceService->getUserPreferences($request->user());
                
                return response()->json([
                    'success' => true,
                    'message' => 'Preferences imported successfully',
                    'data' => $updatedPreferences,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to import preferences',
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to import preferences',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}