<?php

namespace App\Providers;

use App\Mail\ResetPasswordMail;
use App\Mail\VerifyEmailMail;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Configure Fortify views
        Fortify::loginView(fn () => Inertia::render('auth/login'));
        Fortify::registerView(fn () => Inertia::render('auth/register'));
        Fortify::requestPasswordResetLinkView(fn () => Inertia::render('auth/forgot-password'));
        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]));
        Fortify::verifyEmailView(fn () => Inertia::render('auth/verify-email'));
        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));
        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));

        // Custom authentication logic to prevent pending users from logging in
        Fortify::authenticateUsing(function (Request $request) {
            $user = User::where('email', $request->email)->first();

            if ($user && \Hash::check($request->password, $user->password)) {
                // Check if user status allows login
                if ($user->status !== 'active') {
                    $message = match ($user->status) {
                        'pending' => 'Your account is pending approval. Please wait for admin approval before signing in.',
                        'suspended' => 'Your account has been suspended. Please contact support for more information.',
                        'disabled' => 'Your account has been disabled. Please contact support.',
                        'deleted' => 'Your account has been deleted.',
                        default => 'Your account is not active. Please contact support.',
                    };

                    // Throw validation exception to show error on login form
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'email' => [$message],
                    ]);
                }

                return $user;
            }

            return null;
        });

        // Customize email verification notification
        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            try {
                return (new VerifyEmailMail($notifiable, $url))->to($notifiable->email);
            } catch (\Exception $e) {
                // Log error and send to fallback email
                \Log::warning('Email verification failed, using fallback', [
                    'original_email' => $notifiable->email,
                    'fallback_email' => 'straycat.ai@gmail.com',
                    'error' => $e->getMessage()
                ]);
                
                return (new VerifyEmailMail($notifiable, $url))->to('straycat.ai@gmail.com');
            }
        });

        // Customize password reset notification
        ResetPassword::toMailUsing(function (object $notifiable, string $token) {
            $url = url(route('password.reset', [
                'token' => $token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false));

            try {
                return (new ResetPasswordMail($notifiable, $url, $token))->to($notifiable->email);
            } catch (\Exception $e) {
                // Log error and send to fallback email
                \Log::warning('Password reset email failed, using fallback', [
                    'original_email' => $notifiable->email,
                    'fallback_email' => 'straycat.ai@gmail.com',
                    'error' => $e->getMessage()
                ]);
                
                return (new ResetPasswordMail($notifiable, $url, $token))->to('straycat.ai@gmail.com');
            }
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });
    }
}
