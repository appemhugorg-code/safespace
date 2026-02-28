<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class ConnectPlatformGoogle extends Command
{
    protected $signature = 'google:connect-platform';
    protected $description = 'Connect platform Google account for creating meetings';

    public function handle()
    {
        $platformEmail = config('services.google.platform_email');
        
        $this->info("🔗 Connecting Platform Google Account");
        $this->info("Platform Email: {$platformEmail}");
        $this->newLine();
        
        // Check if admin user exists with this email
        $adminUser = User::where('email', $platformEmail)->first();
        
        if (!$adminUser) {
            $this->warn("No user found with email: {$platformEmail}");
            $this->info("Creating admin user for platform Google account...");
            
            $adminUser = User::create([
                'name' => 'SafeSpace Platform',
                'email' => $platformEmail,
                'password' => bcrypt('platform-' . uniqid()),
                'email_verified_at' => now(),
            ]);
            
            $adminUser->assignRole('admin');
            $this->info("✅ Admin user created");
        }
        
        $this->newLine();
        $this->info("📋 Steps to connect:");
        $this->info("1. Start your Laravel server: php artisan serve");
        $this->info("2. Login as admin (admin@safespace.test / password)");
        $this->info("3. Visit: http://localhost:8000/auth/google");
        $this->info("4. Authorize with: {$platformEmail}");
        $this->newLine();
        
        if ($adminUser->google_access_token) {
            $this->info("✅ Platform Google account is already connected!");
            $this->info("You can now create appointments with Google Meet links.");
        } else {
            $this->warn("⚠️  Platform Google account not yet connected.");
            $this->info("Follow the steps above to connect.");
        }
        
        return 0;
    }
}
