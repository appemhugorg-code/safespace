<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\ArticleComment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ArticleCommentFactory extends Factory
{
    protected $model = ArticleComment::class;

    public function definition(): array
    {
        return [
            'article_id' => Article::factory(),
            'user_id' => User::factory(),
            'parent_id' => null,
            'content' => $this->faker->paragraph(3),
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected', 'flagged']),
            'moderated_by' => null,
            'moderated_at' => null,
            'moderation_reason' => null,
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'moderated_by' => User::factory(),
            'moderated_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'moderated_by' => User::factory(),
            'moderated_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
            'moderation_reason' => $this->faker->sentence(),
        ]);
    }

    public function flagged(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'flagged',
            'moderation_reason' => $this->faker->sentence(),
        ]);
    }

    public function reply(): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => ArticleComment::factory(),
        ]);
    }
}