<?php

namespace Database\Factories;

use App\Models\ContentNewsletter;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContentNewsletterFactory extends Factory
{
    protected $model = ContentNewsletter::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(),
            'frequency' => $this->faker->randomElement(['daily', 'weekly', 'monthly']),
            'target_audience' => $this->faker->randomElement(['children', 'guardians', 'therapists', 'all']),
            'last_sent_at' => $this->faker->optional(0.7)->dateTimeBetween('-1 month', 'now'),
            'next_send_at' => $this->faker->dateTimeBetween('now', '+1 week'),
            'is_active' => $this->faker->boolean(80), // 80% chance of being active
            'article_ids' => $this->faker->optional()->randomElements([1, 2, 3, 4, 5], 3),
            'subscriber_count' => $this->faker->numberBetween(0, 500),
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    public function daily(): static
    {
        return $this->state(fn (array $attributes) => [
            'frequency' => 'daily',
            'next_send_at' => now()->addDay(),
        ]);
    }

    public function weekly(): static
    {
        return $this->state(fn (array $attributes) => [
            'frequency' => 'weekly',
            'next_send_at' => now()->addWeek(),
        ]);
    }

    public function monthly(): static
    {
        return $this->state(fn (array $attributes) => [
            'frequency' => 'monthly',
            'next_send_at' => now()->addMonth(),
        ]);
    }

    public function due(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
            'next_send_at' => $this->faker->dateTimeBetween('-1 hour', 'now'),
        ]);
    }

    public function notDue(): static
    {
        return $this->state(fn (array $attributes) => [
            'next_send_at' => $this->faker->dateTimeBetween('+1 hour', '+1 week'),
        ]);
    }

    public function forChildren(): static
    {
        return $this->state(fn (array $attributes) => [
            'target_audience' => 'children',
            'title' => 'Kids Mental Health Tips',
        ]);
    }

    public function forGuardians(): static
    {
        return $this->state(fn (array $attributes) => [
            'target_audience' => 'guardians',
            'title' => 'Parenting Support Newsletter',
        ]);
    }

    public function forTherapists(): static
    {
        return $this->state(fn (array $attributes) => [
            'target_audience' => 'therapists',
            'title' => 'Professional Development Updates',
        ]);
    }
}