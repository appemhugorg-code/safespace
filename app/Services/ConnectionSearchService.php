<?php

namespace App\Services;

use App\Models\User;
use App\Models\TherapistAvailability;
use App\Models\TherapistClientConnection;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;

class ConnectionSearchService
{
    /**
     * Search therapists with optional filters
     */
    public function searchTherapists(array $filters = []): Collection
    {
        $query = User::query()
            ->role('therapist')
            ->where('status', 'active')
            ->with(['availability']);

        // Apply filters
        if (!empty($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
        }

        if (!empty($filters['email'])) {
            $query->where('email', 'like', '%' . $filters['email'] . '%');
        }

        // For now, specialization and location would be stored in user profile
        // This is a placeholder for future implementation when profile fields are added
        if (!empty($filters['specialization'])) {
            // Future implementation: $query->where('specialization', 'like', '%' . $filters['specialization'] . '%');
            // For now, we'll filter by name containing the specialization term
            $query->where('name', 'like', '%' . $filters['specialization'] . '%');
        }

        if (!empty($filters['location'])) {
            // Future implementation: $query->where('location', 'like', '%' . $filters['location'] . '%');
            // For now, this is a placeholder
        }

        // Availability filter
        if (!empty($filters['available_day'])) {
            $query->whereHas('availability', function (Builder $availabilityQuery) use ($filters) {
                $availabilityQuery->where('day_of_week', $filters['available_day'])
                    ->where('is_active', true);
            });
        }

        if (!empty($filters['available_time'])) {
            $query->whereHas('availability', function (Builder $availabilityQuery) use ($filters) {
                $availabilityQuery->where('start_time', '<=', $filters['available_time'])
                    ->where('end_time', '>=', $filters['available_time'])
                    ->where('is_active', true);
            });
        }

        // Exclude therapists with maximum connections (if needed)
        if (!empty($filters['exclude_full'])) {
            // This could be implemented based on business rules
            // For example, exclude therapists with more than X active connections
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Get available therapists for a specific guardian
     */
    public function getAvailableTherapists(int $guardianId): Collection
    {
        // Get all active therapists
        $therapists = User::role('therapist')
            ->where('status', 'active')
            ->with(['availability'])
            ->get();

        // Filter out therapists who already have active connections with this guardian
        $connectedTherapistIds = TherapistClientConnection::where('client_id', $guardianId)
            ->where('status', 'active')
            ->pluck('therapist_id')
            ->toArray();

        return $therapists->reject(function ($therapist) use ($connectedTherapistIds) {
            return in_array($therapist->id, $connectedTherapistIds);
        });
    }

    /**
     * Filter therapists by specialization
     */
    public function filterBySpecialization(Collection $therapists, string $specialization): Collection
    {
        // For now, filter by name containing the specialization
        // In the future, this would filter by a dedicated specialization field
        return $therapists->filter(function ($therapist) use ($specialization) {
            return stripos($therapist->name, $specialization) !== false;
        });
    }

    /**
     * Filter therapists by availability
     */
    public function filterByAvailability(Collection $therapists): Collection
    {
        // Filter therapists who have at least one active availability slot
        return $therapists->filter(function ($therapist) {
            return $therapist->availability->where('is_active', true)->isNotEmpty();
        });
    }

    /**
     * Filter therapists available on a specific day
     */
    public function filterByDay(Collection $therapists, int $dayOfWeek): Collection
    {
        return $therapists->filter(function ($therapist) use ($dayOfWeek) {
            return $therapist->availability
                ->where('day_of_week', $dayOfWeek)
                ->where('is_active', true)
                ->isNotEmpty();
        });
    }

    /**
     * Filter therapists available at a specific time on a specific day
     */
    public function filterByDayAndTime(Collection $therapists, int $dayOfWeek, string $time): Collection
    {
        return $therapists->filter(function ($therapist) use ($dayOfWeek, $time) {
            return $therapist->availability
                ->where('day_of_week', $dayOfWeek)
                ->where('is_active', true)
                ->where('start_time', '<=', $time)
                ->where('end_time', '>=', $time)
                ->isNotEmpty();
        });
    }

    /**
     * Get therapists with the most availability
     */
    public function getTherapistsByAvailability(Collection $therapists): Collection
    {
        return $therapists->sortByDesc(function ($therapist) {
            return $therapist->availability->where('is_active', true)->count();
        });
    }

    /**
     * Get therapists with the fewest active connections (for load balancing)
     */
    public function getTherapistsByWorkload(): Collection
    {
        $therapists = User::role('therapist')
            ->where('status', 'active')
            ->withCount(['therapistConnections' => function ($query) {
                $query->where('status', 'active');
            }])
            ->orderBy('therapist_connections_count', 'asc')
            ->get();

        return $therapists;
    }

    /**
     * Search therapists by name or email
     */
    public function searchByNameOrEmail(string $searchTerm): Collection
    {
        return User::role('therapist')
            ->where('status', 'active')
            ->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('email', 'like', '%' . $searchTerm . '%');
            })
            ->with(['availability'])
            ->orderBy('name')
            ->get();
    }

    /**
     * Get recommended therapists for a guardian based on various factors
     */
    public function getRecommendedTherapists(int $guardianId, int $limit = 5): Collection
    {
        // Get available therapists (not already connected)
        $availableTherapists = $this->getAvailableTherapists($guardianId);

        // Filter by those with availability
        $availableTherapists = $this->filterByAvailability($availableTherapists);

        // Sort by workload (fewer connections first) and availability
        $recommendedTherapists = $availableTherapists->map(function ($therapist) {
            $activeConnections = TherapistClientConnection::where('therapist_id', $therapist->id)
                ->where('status', 'active')
                ->count();
            
            $availabilitySlots = $therapist->availability->where('is_active', true)->count();
            
            // Calculate a recommendation score (lower is better)
            $therapist->recommendation_score = $activeConnections - ($availabilitySlots * 0.5);
            
            return $therapist;
        })->sortBy('recommendation_score');

        return $recommendedTherapists->take($limit);
    }

    /**
     * Get search statistics for admin dashboard
     */
    public function getSearchStatistics(): array
    {
        $totalTherapists = User::role('therapist')->where('status', 'active')->count();
        $therapistsWithAvailability = User::role('therapist')
            ->where('status', 'active')
            ->whereHas('availability', function ($query) {
                $query->where('is_active', true);
            })
            ->count();

        $averageConnections = TherapistClientConnection::where('status', 'active')
            ->selectRaw('AVG(connections_count) as avg_connections')
            ->from(function ($query) {
                $query->selectRaw('therapist_id, COUNT(*) as connections_count')
                    ->from('therapist_client_connections')
                    ->where('status', 'active')
                    ->groupBy('therapist_id');
            }, 'connection_counts')
            ->value('avg_connections') ?? 0;

        return [
            'total_therapists' => $totalTherapists,
            'therapists_with_availability' => $therapistsWithAvailability,
            'therapists_without_availability' => $totalTherapists - $therapistsWithAvailability,
            'average_connections_per_therapist' => round($averageConnections, 2),
        ];
    }

    /**
     * Validate search filters
     */
    public function validateFilters(array $filters): array
    {
        $validatedFilters = [];

        // Validate day of week
        if (isset($filters['available_day'])) {
            $day = (int) $filters['available_day'];
            if ($day >= 0 && $day <= 6) {
                $validatedFilters['available_day'] = $day;
            }
        }

        // Validate time format
        if (isset($filters['available_time'])) {
            if (preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $filters['available_time'])) {
                $validatedFilters['available_time'] = $filters['available_time'];
            }
        }

        // Validate text fields
        foreach (['name', 'email', 'specialization', 'location'] as $field) {
            if (isset($filters[$field]) && is_string($filters[$field]) && strlen(trim($filters[$field])) > 0) {
                $validatedFilters[$field] = trim($filters[$field]);
            }
        }

        // Validate boolean fields
        if (isset($filters['exclude_full'])) {
            $validatedFilters['exclude_full'] = (bool) $filters['exclude_full'];
        }

        return $validatedFilters;
    }
}