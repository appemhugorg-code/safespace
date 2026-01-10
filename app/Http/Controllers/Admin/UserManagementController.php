<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\EmailNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    /**
     * Display the admin dashboard with pending users.
     */
    public function index()
    {
        $pendingUsers = User::where('status', 'pending')
            ->with('roles')
            ->orderBy('created_at', 'desc')
            ->get();

        $activeUsers = User::where('status', 'active')
            ->with('roles')
            ->orderBy('created_at', 'desc')
            ->get();

        $suspendedUsers = User::where('status', 'suspended')
            ->with(['roles', 'suspensions' => function ($query) {
                $query->where('is_active', true)
                    ->with('suspendedBy')
                    ->latest();
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/user-management', [
            'pendingUsers' => $pendingUsers,
            'activeUsers' => $activeUsers,
            'suspendedUsers' => $suspendedUsers,
        ]);
    }

    /**
     * Approve a pending user.
     */
    public function approve(User $user, EmailNotificationService $emailService)
    {
        if ($user->status !== 'pending') {
            return back()->with('error', 'User is not pending approval.');
        }

        $user->update(['status' => 'active']);

        // Send appropriate approval email based on user role
        if ($user->hasRole('therapist')) {
            $emailService->sendTherapistActivation($user);
        } elseif ($user->hasRole('child') && $user->guardian) {
            // For child accounts, send child account creation emails
            $emailService->sendChildAccountCreated($user, $user->guardian);
        } else {
            // For guardians and other roles, send account verification
            $emailService->sendAccountVerification($user);
        }

        return back()->with('success', "User {$user->name} has been approved.");
    }

    /**
     * Reject a pending user.
     */
    public function reject(User $user, Request $request)
    {
        $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        if ($user->status !== 'pending') {
            return back()->with('error', 'User is not pending approval.');
        }

        $reason = $request->input('reason');

        // TODO: Send rejection email notification with reason
        // Mail::to($user->email)->send(new UserRejectedMail($user, $reason));

        $user->delete();

        $message = "User {$user->name} has been rejected and removed.";
        if ($reason) {
            $message .= " Reason: {$reason}";
        }

        return back()->with('success', $message);
    }

    /**
     * Suspend an active user.
     */
    public function suspend(User $user, Request $request)
    {
        $request->validate([
            'reason' => 'nullable|string|max:500',
            'duration' => 'nullable|integer|min:1', // Duration in days
        ]);

        if ($user->status !== 'active') {
            return back()->with('error', 'User is not active.');
        }

        // Update user status
        $user->update(['status' => 'suspended']);

        // Create suspension record
        $suspensionData = [
            'user_id' => $user->id,
            'suspended_by' => auth()->id(),
            'reason' => $request->input('reason'),
            'suspended_at' => now(),
            'is_active' => true,
        ];

        // If duration is specified, set suspended_until
        if ($request->filled('duration')) {
            $suspensionData['suspended_until'] = now()->addDays($request->input('duration'));
        }

        \App\Models\UserSuspension::create($suspensionData);

        // TODO: Send suspension email notification
        // Mail::to($user->email)->send(new UserSuspendedMail($user, $request->reason));

        return back()->with('success', "User {$user->name} has been suspended.");
    }

    /**
     * Reactivate a suspended user.
     */
    public function reactivate(User $user)
    {
        if ($user->status !== 'suspended') {
            return back()->with('error', 'User is not suspended.');
        }

        // Update user status
        $user->update(['status' => 'active']);

        // Deactivate current suspension
        $currentSuspension = $user->currentSuspension();
        if ($currentSuspension) {
            $currentSuspension->update(['is_active' => false]);
        }

        // TODO: Send reactivation email notification
        // Mail::to($user->email)->send(new UserReactivatedMail($user));

        return back()->with('success', "User {$user->name} has been reactivated.");
    }
}
