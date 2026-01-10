<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use App\Models\ContentEngagement;
use App\Models\Game;
use App\Models\GameProgress;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    /**
     * Display the games index page
     */
    public function index(): Response
    {
        $user = Auth::user();

        // Get all active games with user progress
        $games = Game::active()
            ->ordered()
            ->with(['progress' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }])
            ->get()
            ->map(function ($game) {
                $progress = $game->progress->first();

                return [
                    'id' => $game->id,
                    'name' => $game->name,
                    'slug' => $game->slug,
                    'description' => $game->description,
                    'type' => $game->type,
                    'difficulty' => $game->difficulty,
                    'estimated_duration' => $game->estimated_duration,
                    'completed' => $progress ? $progress->completed : false,
                    'score' => $progress ? $progress->score : null,
                    'completion_rate' => $game->completion_rate,
                ];
            });

        // Get user achievements
        $achievements = $user->achievements()
            ->orderBy('user_achievements.earned_at', 'desc')
            ->get();

        // Get user stats
        $stats = [
            'total_games' => Game::active()->count(),
            'completed_games' => $user->gameProgress()->where('completed', true)->count(),
            'total_achievements' => $achievements->count(),
            'total_play_time' => 0, // We'll implement this later
        ];

        return Inertia::render('games/index', [
            'games' => $games,
            'achievements' => $achievements,
            'stats' => $stats,
        ]);
    }

    /**
     * Show a specific game
     */
    public function show(Game $game): Response
    {
        $user = Auth::user();

        // Get or create progress record
        $progress = GameProgress::firstOrCreate(
            ['user_id' => $user->id, 'game_id' => $game->id],
            ['completed' => false]
        );

        // Track game view engagement
        ContentEngagement::track(
            $user->id,
            'game',
            $game->id,
            'view',
            ['game_name' => $game->name, 'game_type' => $game->type]
        );

        return Inertia::render('games/show', [
            'game' => [
                'id' => $game->id,
                'name' => $game->name,
                'slug' => $game->slug,
                'description' => $game->description,
                'type' => $game->type,
                'config' => $game->config,
                'difficulty' => $game->difficulty,
                'estimated_duration' => $game->estimated_duration,
            ],
            'progress' => [
                'id' => $progress->id,
                'completed' => $progress->completed,
                'score' => $progress->score,
                'game_data' => $progress->session_data,
            ],
        ]);
    }

    /**
     * Update game progress
     */
    public function updateProgress(Request $request, Game $game)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'completed' => 'boolean',
            'score' => 'nullable|integer|min:0',
            'session_data' => 'nullable|array',
        ]);

        $progress = GameProgress::where('user_id', $user->id)
            ->where('game_id', $game->id)
            ->first();

        if (! $progress) {
            $progress = GameProgress::create([
                'user_id' => $user->id,
                'game_id' => $game->id,
                ...$validated,
            ]);
        } else {
            $progress->update($validated);
        }

        // Track engagement based on action
        $action = $validated['completed'] ? 'complete' : 'start';
        ContentEngagement::track(
            $user->id,
            'game',
            $game->id,
            $action,
            [
                'score' => $validated['score'] ?? null,
                'session_data' => $validated['session_data'] ?? null,
            ]
        );

        // Mark as completed if specified
        if ($validated['completed'] ?? false) {
            $progress->markCompleted($validated['score'] ?? null);

            // Check for new achievements
            $this->checkAchievements($user);
        }

        return back()->with('success', 'Progress updated successfully!');
    }

    /**
     * Check and award achievements
     */
    private function checkAchievements(User $user): void
    {
        $achievements = Achievement::active()->get();

        foreach ($achievements as $achievement) {
            if ($achievement->isEarnedByUser($user->id)) {
                continue; // Already earned
            }

            if ($achievement->checkCriteria($user)) {
                $achievement->awardToUser($user->id);
            }
        }
    }
}
