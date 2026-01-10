<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\ArticleRating;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ArticleRatingFactory extends Factory
{
    protected $model = ArticleRating::class;

    public function definition(): array
    {
        return [
            'article_id' => Article::factory(),
            'user_id' => User::factory(),
            'rating' => $this->faker->numberBetween(1, 5),
            'feedback' => $this->faker->optional(0.6)->paragraph(),
        ];
    }

    public function fiveStars(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating' => 5,
            'feedback' => $this->faker->sentence() . ' Excellent article!',
        ]);
    }

    public function fourStars(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating' => 4,
            'feedback' => $this->faker->sentence() . ' Very helpful.',
        ]);
    }

    public function threeStars(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating' => 3,
            'feedback' => $this->faker->sentence() . ' Good information.',
        ]);
    }

    public function twoStars(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating' => 2,
            'feedback' => $this->faker->sentence() . ' Could be better.',
        ]);
    }

    public function oneStar(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating' => 1,
            'feedback' => $this->faker->sentence() . ' Not very helpful.',
        ]);
    }

    public function withFeedback(): static
    {
        return $this->state(fn (array $attributes) => [
            'feedback' => $this->faker->paragraph(),
        ]);
    }

    public function withoutFeedback(): static
    {
        return $this->state(fn (array $attributes) => [
            'feedback' => null,
        ]);
    }
}