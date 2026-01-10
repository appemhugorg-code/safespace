<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        $title = $this->faker->sentence(6, true);
        
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'body' => $this->faker->paragraphs(5, true),
            'excerpt' => $this->faker->paragraph(3),
            'featured_image' => $this->faker->imageUrl(800, 600, 'health'),
            'author_id' => User::factory(),
            'status' => $this->faker->randomElement(['draft', 'pending', 'published', 'archived']),
            'target_audience' => $this->faker->randomElement(['children', 'guardians', 'therapists', 'all']),
            'categories' => $this->faker->randomElements(['mental-health', 'anxiety', 'depression', 'coping-strategies', 'family'], 2),
            'tags' => $this->faker->randomElements(['mindfulness', 'therapy', 'wellness', 'support', 'guidance'], 3),
            'meta_description' => $this->faker->sentence(15),
            'reading_time' => $this->faker->numberBetween(2, 15),
            'view_count' => $this->faker->numberBetween(0, 1000),
            'published_at' => $this->faker->optional(0.7)->dateTimeBetween('-1 year', 'now'),
            'reviewed_by' => null,
            'reviewed_at' => null,
            'rejection_reason' => null,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'published_at' => null,
        ]);
    }

    public function forChildren(): static
    {
        return $this->state(fn (array $attributes) => [
            'target_audience' => 'children',
        ]);
    }

    public function forGuardians(): static
    {
        return $this->state(fn (array $attributes) => [
            'target_audience' => 'guardians',
        ]);
    }

    public function forTherapists(): static
    {
        return $this->state(fn (array $attributes) => [
            'target_audience' => 'therapists',
        ]);
    }
}