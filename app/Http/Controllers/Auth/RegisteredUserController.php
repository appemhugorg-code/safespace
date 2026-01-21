<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\EmailNotificationService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request, EmailNotificationService $emailService): RedirectResponse
    {
        $validationRules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:guardian,therapist',
            'terms_accepted' => 'required|accepted',
        ];

        // Add phone number validation for therapists and guardians
        if (in_array($request->role, ['therapist', 'guardian'])) {
            $validationRules['country_code'] = 'required|string|max:5';
            $validationRules['phone_number'] = 'required|string|max:20';
        } else {
            // Optional for other roles
            $validationRules['country_code'] = 'nullable|string|max:5';
            $validationRules['phone_number'] = 'nullable|string|max:20';
        }

        $request->validate($validationRules);

        // Prepare user data
        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => 'pending',
            'terms_accepted' => true,
            'terms_accepted_at' => now(),
            'terms_version' => '1.0',
        ];

        // Add phone number if provided
        if ($request->country_code && $request->phone_number) {
            $userData['country_code'] = $request->country_code;
            $userData['phone_number'] = $request->phone_number;
            $userData['full_phone_number'] = $request->country_code . $request->phone_number;
        }

        $user = User::create($userData);

        $user->assignRole($request->role);

        // Send welcome email
        $emailService->sendWelcomeEmail($user);

        // optional: notify admin
        // Notification::send(User::role('admin')->get(), new NewPendingUser($user));

        event(new Registered($user));

        // DO NOT log in the user - they need admin approval first
        // Auth::login($user);
        // $request->session()->regenerate();

        // Redirect to login page with success message
        return redirect()->route('login')->with('success', 
            'Registration successful! Your account is pending approval. You will be able to sign in once an administrator approves your account.'
        );
    }
}
