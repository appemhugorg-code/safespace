<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        return [
            'therapist_id' => User::factory(),
            'child_id' => User::factory(),
            'guardian_id' => User::factory(),
            'scheduled_at' => $this->faker->dateTimeBetween('now', '+1 month'),
            'duration_minutes' => $this->faker->randomElement([30, 45, 60, 90]),
            'status' => $this->faker->randomElement(['requested', 'confirmed', 'cancelled', 'completed']),
            'appointment_type' => $this->faker->randomElement(['individual', 'family', 'group', 'consultation']),
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->optional()->paragraph(),
            'notes' => $this->faker->optional()->paragraph(),
            'therapist_notes' => $this->faker->optional()->paragraph(),
            'meeting_link' => $this->faker->optional()->url(),
            'google_event_id' => $this->faker->optional()->uuid(),
            'google_meet_link' => $this->faker->optional()->url(),
            'google_calendar_data' => $this->faker->optional()->randomElements(['event_data' => 'sample'], 1),
            'cancellation_reason' => null,
            'cancelled_at' => null,
            'cancelled_by' => null,
        ];
    }

    public function individual(): static
    {
        return $this->state(fn (array $attributes) => [
            'appointment_type' => 'individual',
        ]);
    }

    public function family(): static
    {
        return $this->state(fn (array $attributes) => [
            'appointment_type' => 'family',
        ]);
    }

    public function group(): static
    {
        return $this->state(fn (array $attributes) => [
            'appointment_type' => 'group',
            'child_id' => null, // Group sessions don't have a single child
        ]);
    }

    public function consultation(): static
    {
        return $this->state(fn (array $attributes) => [
            'appointment_type' => 'consultation',
            'child_id' => null, // Consultations might not involve a child
        ]);
    }

    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'cancelled_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
            'cancellation_reason' => $this->faker->sentence(),
        ]);
    }

    public function withGoogleMeet(): static
    {
        return $this->state(fn (array $attributes) => [
            'google_event_id' => $this->faker->uuid(),
            'google_meet_link' => 'https://meet.google.com/' . $this->faker->lexify('???-????-???'),
            'google_calendar_data' => [
                'event_id' => $this->faker->uuid(),
                'calendar_id' => 'primary',
                'created' => now()->toISOString(),
            ],
        ]);
    }

    public function upcoming(): static
    {
        return $this->state(fn (array $attributes) => [
            'scheduled_at' => $this->faker->dateTimeBetween('now', '+2 weeks'),
            'status' => 'confirmed',
        ]);
    }

    public function past(): static
    {
        return $this->state(fn (array $attributes) => [
            'scheduled_at' => $this->faker->dateTimeBetween('-2 months', '-1 day'),
            'status' => 'completed',
        ]);
    }
}