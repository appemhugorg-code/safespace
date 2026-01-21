<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the profile settings page.
     */
    public function edit(): Response
    {
        return Inertia::render('settings/profile');
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Determine if phone number is required based on user role
        $isPhoneRequired = $user->hasAnyRole(['therapist', 'guardian']);

        $validationRules = [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
        ];

        // Add phone number validation
        if ($isPhoneRequired) {
            $validationRules['country_code'] = 'required|string|max:5';
            $validationRules['phone_number'] = 'required|string|max:20';
        } else {
            $validationRules['country_code'] = 'nullable|string|max:5';
            $validationRules['phone_number'] = 'nullable|string|max:20';
        }

        $validated = $request->validate($validationRules);

        // Check if email changed and reset verification
        if ($user->email !== $validated['email']) {
            $user->email_verified_at = null;
        }

        // Update basic information
        $user->name = $validated['name'];
        $user->email = $validated['email'];

        // Update phone number if provided
        if (!empty($validated['country_code']) && !empty($validated['phone_number'])) {
            // Check if phone number changed and reset verification
            if ($user->country_code !== $validated['country_code'] || 
                $user->phone_number !== $validated['phone_number']) {
                $user->phone_verified_at = null;
            }

            $user->country_code = $validated['country_code'];
            $user->phone_number = $validated['phone_number'];
            $user->full_phone_number = $validated['country_code'] . $validated['phone_number'];
        } else {
            // Clear phone number if not provided (and not required)
            if (!$isPhoneRequired) {
                $user->country_code = null;
                $user->phone_number = null;
                $user->full_phone_number = null;
                $user->phone_verified_at = null;
            }
        }

        $user->save();

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Send phone verification code.
     */
    public function sendPhoneVerification(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (!$user->hasPhoneNumber()) {
            return back()->withErrors(['phone' => 'Please add a phone number first.']);
        }

        if ($user->hasVerifiedPhoneNumber()) {
            return back()->withErrors(['phone' => 'Phone number is already verified.']);
        }

        // TODO: Implement SMS verification service
        // For now, just return success message
        return back()->with('success', 'Verification code sent to your phone number.');
    }

    /**
     * Verify phone number with code.
     */
    public function verifyPhone(Request $request): RedirectResponse
    {
        $request->validate([
            'verification_code' => 'required|string|size:6',
        ]);

        $user = $request->user();

        if (!$user->hasPhoneNumber()) {
            return back()->withErrors(['phone' => 'No phone number to verify.']);
        }

        if ($user->hasVerifiedPhoneNumber()) {
            return back()->withErrors(['phone' => 'Phone number is already verified.']);
        }

        // TODO: Implement actual verification code checking
        // For now, just mark as verified
        $user->markPhoneAsVerified();

        return back()->with('success', 'Phone number verified successfully.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        // Log out the user
        auth()->logout();

        // Soft delete or mark as deleted
        $user->update(['status' => 'deleted']);

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('success', 'Your account has been deleted.');
    }
}