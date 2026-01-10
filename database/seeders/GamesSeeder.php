<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Seeder;

class GamesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $games = [
            [
                'name' => 'Breathing Buddy',
                'slug' => 'breathing-buddy',
                'description' => 'Learn to calm down with guided breathing exercises. Follow the bubble as it grows and shrinks!',
                'type' => 'breathing',
                'config' => [
                    'breath_in_duration' => 4,
                    'breath_out_duration' => 6,
                    'cycles' => 5,
                ],
                'difficulty' => 'easy',
                'estimated_duration' => 3,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Mood Matcher',
                'slug' => 'mood-matcher',
                'description' => 'Match emotions with their colors and learn about different feelings!',
                'type' => 'mood-matching',
                'config' => [
                    'levels' => 3,
                    'emotions' => ['happy', 'sad', 'angry', 'calm', 'excited', 'scared'],
                ],
                'difficulty' => 'easy',
                'estimated_duration' => 5,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Positive Thoughts',
                'slug' => 'positive-thoughts',
                'description' => 'Practice positive self-talk with fun affirmations and encouraging messages!',
                'type' => 'affirmations',
                'config' => [
                    'affirmations' => [
                        'I am brave and strong',
                        'I can handle difficult feelings',
                        'I am loved and cared for',
                        'I can ask for help when I need it',
                        'I am learning and growing every day',
                    ],
                ],
                'difficulty' => 'easy',
                'estimated_duration' => 4,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Feeling Detective',
                'slug' => 'feeling-detective',
                'description' => 'Become a detective and identify different emotions in fun scenarios!',
                'type' => 'emotion-recognition',
                'config' => [
                    'scenarios' => 5,
                    'difficulty_levels' => ['easy', 'medium'],
                ],
                'difficulty' => 'medium',
                'estimated_duration' => 7,
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Calm Garden',
                'slug' => 'calm-garden',
                'description' => 'Create a peaceful garden while practicing mindfulness and relaxation techniques.',
                'type' => 'mindfulness',
                'config' => [
                    'garden_elements' => ['flowers', 'trees', 'butterflies', 'birds'],
                    'meditation_prompts' => true,
                ],
                'difficulty' => 'easy',
                'estimated_duration' => 8,
                'is_active' => true,
                'sort_order' => 5,
            ],
        ];

        foreach ($games as $gameData) {
            Game::create($gameData);
        }

        $this->command->info('✅ Sample games seeded successfully!');
    }
}
