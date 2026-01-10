<?php

namespace App\Http\Controllers\Therapist;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TherapistController extends Controller
{
    /**
     * Display the therapist's clients.
     */
    public function clients(Request $request)
    {
        $therapist = $request->user();

        // Get clients who have had appointments with this therapist
        $clientIds = Appointment::where('therapist_id', $therapist->id)
            ->whereIn('status', ['confirmed', 'completed'])
            ->distinct()
            ->pluck('child_id')
            ->filter(); // Remove null values

        // Get the actual client users with their guardians and recent mood data
        $clients = User::whereIn('id', $clientIds)
            ->with([
                'guardian:id,name,email',
                'moodLogs' => function ($query) {
                    $query->latest()->limit(5);
                }
            ])
            ->get()
            ->map(function ($client) use ($therapist) {
                // Get appointment statistics for this client
                $appointments = Appointment::where('therapist_id', $therapist->id)
                    ->where('child_id', $client->id);

                $totalAppointments = $appointments->count();
                $completedAppointments = $appointments->where('status', 'completed')->count();
                $upcomingAppointments = $appointments->where('status', 'confirmed')
                    ->where('scheduled_at', '>', now())
                    ->count();

                // Get latest appointment
                $latestAppointment = $appointments->latest('scheduled_at')->first();

                // Get recent mood trend
                $recentMoods = $client->moodLogs->take(7);
                $moodTrend = $this->calculateMoodTrend($recentMoods);

                return [
                    'id' => $client->id,
                    'name' => $client->name,
                    'email' => $client->email,
                    'status' => $client->status,
                    'guardian' => $client->guardian,
                    'statistics' => [
                        'total_appointments' => $totalAppointments,
                        'completed_appointments' => $completedAppointments,
                        'upcoming_appointments' => $upcomingAppointments,
                        'latest_appointment' => $latestAppointment ? [
                            'id' => $latestAppointment->id,
                            'scheduled_at' => $latestAppointment->scheduled_at,
                            'status' => $latestAppointment->status,
                        ] : null,
                    ],
                    'mood_data' => [
                        'recent_moods' => $recentMoods->map(function ($mood) {
                            return [
                                'mood' => $mood->mood,
                                'mood_date' => $mood->mood_date,
                                'created_at' => $mood->created_at,
                            ];
                        }),
                        'trend' => $moodTrend,
                        'streak' => $this->calculateMoodStreak($client->id),
                    ],
                ];
            });

        // Get overall statistics
        $stats = [
            'total_clients' => $clients->count(),
            'active_clients' => $clients->where('status', 'active')->count(),
            'total_appointments_this_month' => Appointment::where('therapist_id', $therapist->id)
                ->whereMonth('scheduled_at', now()->month)
                ->whereYear('scheduled_at', now()->year)
                ->count(),
            'completed_appointments_this_month' => Appointment::where('therapist_id', $therapist->id)
                ->where('status', 'completed')
                ->whereMonth('scheduled_at', now()->month)
                ->whereYear('scheduled_at', now()->year)
                ->count(),
        ];

        return Inertia::render('therapist/clients', [
            'clients' => $clients,
            'stats' => $stats,
        ]);
    }

    /**
     * Calculate mood trend from recent moods.
     */
    private function calculateMoodTrend($moods)
    {
        if ($moods->count() < 2) {
            return 'stable';
        }

        $moodValues = [
            'very_sad' => 1,
            'sad' => 2,
            'neutral' => 3,
            'happy' => 4,
            'very_happy' => 5,
        ];

        $recent = $moods->take(3)->avg(function ($mood) use ($moodValues) {
            return $moodValues[$mood->mood] ?? 3;
        });

        $older = $moods->skip(3)->take(3)->avg(function ($mood) use ($moodValues) {
            return $moodValues[$mood->mood] ?? 3;
        });

        if ($recent > $older + 0.5) {
            return 'improving';
        } elseif ($recent < $older - 0.5) {
            return 'declining';
        }

        return 'stable';
    }

    /**
     * Calculate mood streak for a client.
     */
    private function calculateMoodStreak($clientId)
    {
        $moods = \App\Models\MoodLog::where('user_id', $clientId)
            ->orderBy('mood_date', 'desc')
            ->get();

        if ($moods->isEmpty()) {
            return 0;
        }

        $streak = 0;
        $currentDate = now()->startOfDay();

        foreach ($moods as $mood) {
            $moodDate = $mood->mood_date->startOfDay();
            
            if ($moodDate->eq($currentDate)) {
                $streak++;
                $currentDate = $currentDate->subDay();
            } else {
                break;
            }
        }

        return $streak;
    }

    /**
     * Display detailed information about a specific client.
     */
    public function clientDetail(Request $request, User $client)
    {
        $therapist = $request->user();

        // Verify this therapist has worked with this client
        $hasAppointment = Appointment::where('therapist_id', $therapist->id)
            ->where('child_id', $client->id)
            ->exists();

        if (!$hasAppointment) {
            abort(403, 'You do not have access to this client\'s information.');
        }

        // Load detailed client information
        $client->load([
            'guardian:id,name,email',
            'moodLogs' => function ($query) {
                $query->latest()->limit(30);
            }
        ]);

        // Get all appointments with this client
        $appointments = Appointment::where('therapist_id', $therapist->id)
            ->where('child_id', $client->id)
            ->orderBy('scheduled_at', 'desc')
            ->get();

        // Calculate detailed statistics
        $stats = [
            'total_appointments' => $appointments->count(),
            'completed_appointments' => $appointments->where('status', 'completed')->count(),
            'upcoming_appointments' => $appointments->where('status', 'confirmed')
                ->where('scheduled_at', '>', now())
                ->count(),
            'cancelled_appointments' => $appointments->where('status', 'cancelled')->count(),
            'mood_entries_count' => $client->moodLogs->count(),
            'mood_streak' => $this->calculateMoodStreak($client->id),
        ];

        return Inertia::render('therapist/client-detail', [
            'client' => [
                'id' => $client->id,
                'name' => $client->name,
                'email' => $client->email,
                'status' => $client->status,
                'guardian' => $client->guardian,
                'mood_logs' => $client->moodLogs->map(function ($mood) {
                    return [
                        'id' => $mood->id,
                        'mood' => $mood->mood,
                        'mood_date' => $mood->mood_date,
                        'note' => $mood->notes,
                        'created_at' => $mood->created_at,
                    ];
                }),
            ],
            'appointments' => $appointments->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'scheduled_at' => $appointment->scheduled_at,
                    'duration_minutes' => $appointment->duration_minutes,
                    'status' => $appointment->status,
                    'notes' => $appointment->notes,
                    'therapist_notes' => $appointment->therapist_notes,
                ];
            }),
            'stats' => $stats,
        ]);
    }
}