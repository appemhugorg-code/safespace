<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Database\Seeders\UATTestDataSeeder;

class UATSetupCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'uat:setup {--fresh : Run fresh migrations before seeding} {--force : Force the operation in production}';

    /**
     * The console command description.
     */
    protected $description = 'Set up UAT environment with test data and configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Check if we're in UAT environment
        if (!app()->environment('uat') && !$this->option('force')) {
            $this->error('❌ This command should only be run in UAT environment.');
            $this->info('Use --force flag to override this check.');
            return Command::FAILURE;
        }

        $this->info('🧪 Setting up SafeSpace UAT Environment...');
        $this->newLine();

        // Confirm if running fresh migrations
        if ($this->option('fresh')) {
            if (!$this->confirm('⚠️  This will drop all existing data. Are you sure?')) {
                $this->info('Operation cancelled.');
                return Command::SUCCESS;
            }

            $this->info('🗄️  Running fresh migrations...');
            Artisan::call('migrate:fresh', ['--force' => true]);
            $this->info('✅ Migrations completed');
        }

        // Run UAT-specific seeders
        $this->info('🌱 Seeding UAT test data...');
        
        try {
            // First run the basic seeders if they exist
            if (class_exists('Database\Seeders\RoleSeeder')) {
                Artisan::call('db:seed', ['--class' => 'RoleSeeder', '--force' => true]);
                $this->info('✅ Roles seeded');
            }

            // Run the UAT test data seeder
            Artisan::call('db:seed', ['--class' => 'UATTestDataSeeder', '--force' => true]);
            
        } catch (\Exception $e) {
            $this->error('❌ Error seeding data: ' . $e->getMessage());
            return Command::FAILURE;
        }

        // Clear caches
        $this->info('🧹 Clearing caches...');
        Artisan::call('config:clear');
        Artisan::call('cache:clear');
        Artisan::call('route:clear');
        Artisan::call('view:clear');
        $this->info('✅ Caches cleared');

        // Test email configuration
        $this->info('📧 Testing email configuration...');
        try {
            Artisan::call('uat:test-email', [
                'email' => 'admin-uat@safespace.com',
                '--role' => 'admin'
            ]);
            $this->info('✅ Email test completed');
        } catch (\Exception $e) {
            $this->warn('⚠️  Email test failed: ' . $e->getMessage());
        }

        // Display environment summary
        $this->displayEnvironmentSummary();

        $this->newLine();
        $this->info('🎉 UAT environment setup completed successfully!');
        
        return Command::SUCCESS;
    }

    /**
     * Display environment summary
     */
    private function displayEnvironmentSummary(): void
    {
        $this->newLine();
        $this->info('📊 UAT Environment Summary:');
        $this->info('==========================');

        // Database stats
        try {
            $userCount = DB::table('users')->count();
            $adminCount = DB::table('model_has_roles')
                ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                ->where('roles.name', 'admin')
                ->count();
            $therapistCount = DB::table('model_has_roles')
                ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                ->where('roles.name', 'therapist')
                ->count();
            $guardianCount = DB::table('model_has_roles')
                ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                ->where('roles.name', 'guardian')
                ->count();
            $childCount = DB::table('model_has_roles')
                ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                ->where('roles.name', 'child')
                ->count();

            $this->info("👥 Total Users: {$userCount}");
            $this->info("   👑 Admins: {$adminCount}");
            $this->info("   🩺 Therapists: {$therapistCount}");
            $this->info("   👨‍👩‍👧‍👦 Guardians: {$guardianCount}");
            $this->info("   🧒 Children: {$childCount}");

            // Additional stats
            if (DB::getSchemaBuilder()->hasTable('mood_logs')) {
                $moodCount = DB::table('mood_logs')->count();
                $this->info("😊 Mood Logs: {$moodCount}");
            }

            if (DB::getSchemaBuilder()->hasTable('appointments')) {
                $appointmentCount = DB::table('appointments')->count();
                $this->info("📅 Appointments: {$appointmentCount}");
            }

            if (DB::getSchemaBuilder()->hasTable('messages')) {
                $messageCount = DB::table('messages')->count();
                $this->info("💬 Messages: {$messageCount}");
            }

            if (DB::getSchemaBuilder()->hasTable('articles')) {
                $articleCount = DB::table('articles')->count();
                $this->info("📚 Articles: {$articleCount}");
            }

        } catch (\Exception $e) {
            $this->warn('⚠️  Could not retrieve database statistics');
        }

        $this->newLine();
        $this->info('🔗 Quick Links:');
        $this->info('   🌐 Application: ' . config('app.url'));
        $this->info('   🏥 Health Check: ' . config('app.url') . '/health');
        $this->info('   ℹ️  Environment Info: ' . config('app.url') . '/uat/info');

        $this->newLine();
        $this->info('📋 Test Accounts (all use same password pattern):');
        $this->info('   👑 admin-uat@safespace.com / UATAdmin2024!');
        $this->info('   🩺 therapist1-uat@safespace.com / UATTherapist2024!');
        $this->info('   👨‍👩‍👧‍👦 guardian1-uat@safespace.com / UATGuardian2024!');
        $this->info('   🧒 child1-uat@safespace.com / UATChild2024!');

        $this->newLine();
        $this->info('🛠️  Management Commands:');
        $this->info('   📊 Check Status: php artisan uat:status');
        $this->info('   📧 Test Email: php artisan uat:test-email <email> --role=<role>');
        $this->info('   🔄 Reset Data: php artisan uat:setup --fresh');
    }
}