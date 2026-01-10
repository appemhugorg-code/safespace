<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ThemePreferenceService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ThemePreferenceController extends Controller
{
    public function __construct(
        private ThemePreferenceService $themeService
    ) {}

    /**
     * Get current user's theme preferences
     */
    public function show(): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $preferences = $this->themeService->getUserThemePreferences($user);

        return response()->json([
            'success' => true,
            'data' => $preferences
        ]);
    }

    /**
     * Update current user's theme preferences
     */
    public function update(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'mode' => ['sometimes', Rule::in(['light', 'dark', 'auto'])],
            'accessibility' => 'sometimes|array',
            'accessibility.fontSize' => ['sometimes', Rule::in(['small', 'medium', 'large', 'extra-large'])],
            'accessibility.contrast' => ['sometimes', Rule::in(['normal', 'high'])],
            'accessibility.focusVisible' => 'sometimes|boolean',
            'animations' => 'sometimes|array',
            'animations.reducedMotion' => 'sometimes|boolean',
        ]);

        $success = $this->themeService->updateUserThemePreferences($user, $validated);

        if (!$success) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to update theme preferences'
            ], 500);
        }

        $updatedPreferences = $this->themeService->getUserThemePreferences($user);

        return response()->json([
            'success' => true,
            'message' => 'Theme preferences updated successfully',
            'data' => $updatedPreferences
        ]);
    }

    /**
     * Reset current user's theme preferences to default
     */
    public function reset(): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $success = $this->themeService->resetUserThemePreferences($user);

        if (!$success) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to reset theme preferences'
            ], 500);
        }

        $defaultPreferences = $this->themeService->getDefaultThemePreferences();

        return response()->json([
            'success' => true,
            'message' => 'Theme preferences reset to default',
            'data' => $defaultPreferences
        ]);
    }

    /**
     * Get theme analytics (admin only)
     */
    public function analytics(): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user || !$user->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $analytics = $this->themeService->getThemeAnalytics();

        return response()->json([
            'success' => true,
            'data' => $analytics
        ]);
    }

    /**
     * Get default theme preferences (public endpoint)
     */
    public function defaults(): JsonResponse
    {
        $defaults = $this->themeService->getDefaultThemePreferences();

        return response()->json([
            'success' => true,
            'data' => $defaults
        ]);
    }

    /**
     * Bulk update theme preferences (admin only)
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user || !$user->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'preferences' => 'required|array',
            'preferences.mode' => ['sometimes', Rule::in(['light', 'dark', 'auto'])],
            'preferences.accessibility' => 'sometimes|array',
            'preferences.accessibility.fontSize' => ['sometimes', Rule::in(['small', 'medium', 'large', 'extra-large'])],
            'preferences.accessibility.contrast' => ['sometimes', Rule::in(['normal', 'high'])],
            'preferences.accessibility.focusVisible' => 'sometimes|boolean',
            'preferences.animations' => 'sometimes|array',
            'preferences.animations.reducedMotion' => 'sometimes|boolean',
        ]);

        $successCount = 0;
        $errors = [];

        foreach ($validated['user_ids'] as $userId) {
            $targetUser = \App\Models\User::find($userId);
            
            if ($targetUser) {
                $success = $this->themeService->updateUserThemePreferences($targetUser, $validated['preferences']);
                
                if ($success) {
                    $successCount++;
                } else {
                    $errors[] = "Failed to update preferences for user {$userId}";
                }
            } else {
                $errors[] = "User {$userId} not found";
            }
        }

        return response()->json([
            'success' => empty($errors),
            'message' => "Updated theme preferences for {$successCount} users",
            'updated_count' => $successCount,
            'errors' => $errors
        ]);
    }
}