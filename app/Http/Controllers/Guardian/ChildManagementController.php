<?php

namespace App\Http\Controllers\Guardian;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ConnectionRequest;
use App\Services\EmailNotificationService;
use App\Services\ConnectionManagementService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class ChildManagementController extends Controller
{
    /**
     * Display the guardian's children.
     */
    public function index()
    {
        $guardian = auth()->user();

        $children = User::where('guardian_id', $guardian->id)
            ->with('roles')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('guardian/children', [
            'children' => $children,
        ]);
    }

    /**
     * Show the form for creating a new child account.
     */
    public function create()
    {
        return Inertia::render('guardian/create-child');
    }

    /**
     * Store a newly created child account.
     */
    public function store(Request $request, EmailNotificationService $emailService)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'age' => 'required|integer|min:5|max:18',
            'terms_accepted' => 'required|accepted',
            'country_code' => 'nullable|string|max:5',
            'phone_number' => 'nullable|string|max:20',
        ]);

        $guardian = auth()->user();

        // Prepare child data
        $childData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => 'pending', // Child accounts also need admin approval
            'guardian_id' => $guardian->id,
            'terms_accepted' => true,
            'terms_accepted_at' => now(),
            'terms_version' => '1.0',
        ];

        // Add phone number if provided by guardian
        if ($request->country_code && $request->phone_number) {
            $childData['country_code'] = $request->country_code;
            $childData['phone_number'] = $request->phone_number;
            $childData['full_phone_number'] = $request->country_code . $request->phone_number;
        }

        $child = User::create($childData);

        $child->assignRole('child');

        // Send child account creation emails
        $emailService->sendChildAccountCreated($child, $guardian);

        event(new Registered($child));

        return redirect()->route('guardian.children.index')
            ->with('success', "Child account for {$child->name} has been created and is pending admin approval.");
    }

    /**
     * Display the specified child.
     */
    public function show(User $child, ConnectionManagementService $connectionService)
    {
        // Ensure the child belongs to the authenticated guardian
        if ($child->guardian_id !== auth()->id()) {
            abort(403, 'Unauthorized access to child account.');
        }

        $child->load('roles');
        $guardian = auth()->user();

        // Get child's current therapist connections
        $childConnections = $connectionService->getClientConnections($child->id);
        $connectedTherapists = $childConnections->map(function ($connection) {
            return [
                'id' => $connection->therapist->id,
                'name' => $connection->therapist->name,
                'connection_id' => $connection->id,
                'assigned_at' => $connection->assigned_at,
                'specialization' => 'General Therapy', // Placeholder for future profile fields
            ];
        });

        // Get pending assignment requests for this child
        $pendingAssignments = ConnectionRequest::where('target_client_id', $child->id)
            ->where('status', 'pending')
            ->where('request_type', 'guardian_child_assignment')
            ->with(['targetTherapist'])
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'therapist_name' => $request->targetTherapist->name,
                    'created_at' => $request->created_at,
                ];
            });

        // Get guardian's connected therapists that are available for assignment
        $guardianConnections = $connectionService->getClientConnections($guardian->id);
        $connectedTherapistIds = $connectedTherapists->pluck('id')->toArray();
        
        $availableTherapists = $guardianConnections->filter(function ($connection) use ($connectedTherapistIds) {
            return !in_array($connection->therapist->id, $connectedTherapistIds);
        })->map(function ($connection) {
            return [
                'id' => $connection->therapist->id,
                'name' => $connection->therapist->name,
                'email' => $connection->therapist->email,
                'specialization' => 'General Therapy', // Placeholder for future profile fields
                'connection_id' => $connection->id,
                'assigned_at' => $connection->assigned_at,
            ];
        });

        return Inertia::render('guardian/child-details', [
            'child' => $child,
            'therapistAssignment' => [
                'connectedTherapists' => $connectedTherapists,
                'pendingAssignments' => $pendingAssignments,
                'availableTherapists' => $availableTherapists,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified child.
     */
    public function edit(User $child)
    {
        // Ensure the child belongs to the authenticated guardian
        if ($child->guardian_id !== auth()->id()) {
            abort(403, 'Unauthorized access to child account.');
        }

        return Inertia::render('guardian/edit-child', [
            'child' => $child,
        ]);
    }

    /**
     * Update the specified child.
     */
    public function update(Request $request, User $child)
    {
        // Ensure the child belongs to the authenticated guardian
        if ($child->guardian_id !== auth()->id()) {
            abort(403, 'Unauthorized access to child account.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,'.$child->id,
            'country_code' => 'nullable|string|max:5',
            'phone_number' => 'nullable|string|max:20',
        ]);

        // Prepare update data
        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        // Update phone number if provided
        if ($request->country_code && $request->phone_number) {
            $updateData['country_code'] = $request->country_code;
            $updateData['phone_number'] = $request->phone_number;
            $updateData['full_phone_number'] = $request->country_code . $request->phone_number;
        } elseif ($request->has('country_code') && $request->has('phone_number')) {
            // Clear phone number if empty values are submitted
            $updateData['country_code'] = null;
            $updateData['phone_number'] = null;
            $updateData['full_phone_number'] = null;
            $updateData['phone_verified_at'] = null;
        }

        $child->update($updateData);

        return redirect()->route('guardian.children.show', $child)
            ->with('success', "Child account for {$child->name} has been updated.");
    }

    /**
     * Display the child's progress overview.
     */
    public function progress(User $child)
    {
        // Ensure the child belongs to the authenticated guardian
        if ($child->guardian_id !== auth()->id()) {
            abort(403, 'Unauthorized access to child account.');
        }

        $child->load('roles');

        // Get basic progress data
        $progressData = [
            'mood_logs_count' => \App\Models\MoodLog::where('user_id', $child->id)->count(),
            'recent_mood_logs' => \App\Models\MoodLog::where('user_id', $child->id)
                ->orderBy('mood_date', 'desc')
                ->limit(7)
                ->get(),
            'appointments_count' => \App\Models\Appointment::where('child_id', $child->id)->count(),
            'recent_appointments' => \App\Models\Appointment::where('child_id', $child->id)
                ->with(['therapist'])
                ->orderBy('scheduled_at', 'desc')
                ->limit(5)
                ->get(),
            'messages_count' => \App\Models\Message::where('sender_id', $child->id)
                ->orWhere('recipient_id', $child->id)
                ->count(),
        ];

        return Inertia::render('guardian/child-progress', [
            'child' => $child,
            'progressData' => $progressData,
        ]);
    }
}
