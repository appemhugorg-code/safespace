<?php

namespace Database\Seeders;

use App\Models\Achievement;
use App\Models\Game;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Games
        $games = [
            [
                'name' => 'Breathing Buddy',
                'slug' => 'breathing-buddy',
                'description' => 'Learn calm breathing techniques with your friendly breathing buddy. Follow along as they guide you through relaxing breaths.',
                'type' => 'breathing',
                'config' => [
                    'breath_in_duration' => 4,
                    'breath_out_duration' => 6,
                    'cycles' => 5,
                    'animation_type' => 'bubble',
                ],
                'difficulty' => 'easy',
                'estimated_duration' => 3,
                'sort_order' => 1,
            ],
            [
                'name' => 'Mood Matcher',
                'slug' => 'mood-matcher',
                'description' => 'Match emotions with their colors and expressions. Learn to identify different feelings in a fun, interactive way.',
                'type' => 'mood-matching',
                'config' => [
                    'emotions' => ['happy', 'sad', 'angry', 'calm', 'excited', 'worried'],
                    'rounds' => 6,
                    'time_limit' => 30,
                ],
                'difficulty' => 'easy',
                'estimated_duration' => 5,
                'sort_order' => 2,
            ],
            [
                'name' => 'Positive Thoughts Garden',
                'slug' => 'positive-thoughts-garden',
                'description' => 'Plant positive affirmations in your virtual garden and watch beautiful flowers grow with each kind thought.',
                'type' => 'affirmations',
                'config' => [
                    'affirmations' => [
                        'I am brave and strong',
                        'I am loved and cared for',
                        'I can handle difficult feelings',
                        'I am good at many things',
                        'It\'s okay to make mistakes',
                        'I am learning and growing every day',
                    ],
                    'garden_size' => 6,
                    'growth_animation' => true,
                ],
                'difficulty' => 'easy',
                'estimated_duration' => 4,
                'sort_order' => 3,
            ],
            [
                'name' => 'Mindful Moments',
                'slug' => 'mindful-moments',
                'description' => 'Practice mindfulness by focusing on the present moment. Notice sounds, feelings, and thoughts without judgment.',
                'type' => 'mindfulness',
                'config' => [
                    'activities' => ['listen', 'feel', 'observe', 'breathe'],
                    'duration_per_activity' => 30,
                    'background_sounds' => ['nature', 'rain', 'ocean'],
                ],
                'difficulty' => 'medium',
                'estimated_duration' => 6,
                'sort_order' => 4,
            ],
            [
                'name' => 'Worry Warriors',
                'slug' => 'worry-warriors',
                'description' => 'Transform your worries into brave warriors! Learn coping strategies to face fears and anxious thoughts.',
                'type' => 'coping-skills',
                'config' => [
                    'worry_types' => ['school', 'friends', 'family', 'future'],
                    'coping_strategies' => [
                        'deep_breathing',
                        'positive_self_talk',
                        'problem_solving',
                        'seeking_help',
                    ],
                    'levels' => 3,
                ],
                'difficulty' => 'medium',
                'estimated_duration' => 8,
                'sort_order' => 5,
            ],
        ];

        foreach ($games as $gameData) {
            Game::firstOrCreate(['slug' => $gameData['slug']], $gameData);
        }

        // Create Achievements
        $achievements = [
            [
                'name' => 'First Steps',
                'slug' => 'first-steps',
                'description' => 'Complete your first game!',
                'icon' => '🌟',
                'badge_color' => 'yellow',
                'criteria' => [
                    'type' => 'games_completed',
                    'count' => 1,
                ],
            ],
            [
                'name' => 'Breathing Expert',
                'slug' => 'breathing-expert',
                'description' => 'Master the art of calm breathing',
                'icon' => '🫁',
                'badge_color' => 'blue',
                'criteria' => [
                    'type' => 'specific_game',
                    'game_slug' => 'breathing-buddy',
                ],
            ],
            [
                'name' => 'Emotion Explorer',
                'slug' => 'emotion-explorer',
                'description' => 'Learn to identify different emotions',
                'icon' => '😊',
                'badge_color' => 'purple',
                'criteria' => [
                    'type' => 'specific_game',
                    'game_slug' => 'mood-matcher',
                ],
            ],
            [
                'name' => 'Garden Keeper',
                'slug' => 'garden-keeper',
                'description' => 'Grow a beautiful garden of positive thoughts',
                'icon' => '🌸',
                'badge_color' => 'green',
                'criteria' => [
                    'type' => 'specific_game',
                    'game_slug' => 'positive-thoughts-garden',
                ],
            ],
            [
                'name' => 'Game Champion',
                'slug' => 'game-champion',
                'description' => 'Complete 5 different games',
                'icon' => '🏆',
                'badge_color' => 'gold',
                'criteria' => [
                    'type' => 'games_completed',
                    'count' => 5,
                ],
            ],
            [
                'name' => 'Daily Player',
                'slug' => 'daily-player',
                'description' => 'Play games for 3 consecutive days',
                'icon' => '📅',
                'badge_color' => 'orange',
                'criteria' => [
                    'type' => 'consecutive_days',
                    'days' => 3,
                ],
            ],
        ];

        foreach ($achievements as $achievementData) {
            Achievement::firstOrCreate(['slug' => $achievementData['slug']], $achievementData);
        }
    }
}
