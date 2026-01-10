<?php

namespace App\Providers;

use App\Models\Group;
use App\Observers\GroupObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
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
        // Register model observers
        Group::observe(GroupObserver::class);
        \App\Models\TherapistClientConnection::observe(\App\Observers\TherapistClientConnectionObserver::class);
    }
}
