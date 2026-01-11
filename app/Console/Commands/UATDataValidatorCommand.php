<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\MoodLog;
use App\Models\Appointment;
use App\Models\Message;
use App\Models\Article;
use App\Models\TherapistAvailability;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UATDataValidatorCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'uat:validate-data {--fix : Attempt to fix data integrity issues}';

    /**
     * The console command description.
     */
    protected $description = 'Validate UAT test data integrity and relationships';

    private int $errors = 0;
    private int $warnings = 0;
    private int $fixes = 0;

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔍 Validating UAT Test Data Integrity...');
        $this->newLine();

        // Reset counters
        $this->errors = 0;
        $this->warnings = 0;
        $this->fixes = 0;

        // Run validation checks
        $this->validateUsers();
        $this->validateRoleAssignments();
        $this->validateFamilyRelationships();
        $this->validateTherapistAssignments();
        $this->validateMoodData();
        $this->validateAppointments();
        $this->validateMessages();
        $this->validateContent();
        $this->validateTherapistAvailability();

        // Summary
        $this->displayValidationSummary();

        return $this->errors > 0 ? Command::FAILURE : Command::SUCCESS;
    }

    /**
     * Validate user accounts
     */
    private function validateUsers(): void
    {
        $this->info('👥 Validating user accounts...');

        // Check required UAT users exist
        $requiredUsers = [
            'admin-uat@safespace.com' => 'admin',
            'therapist1-uat@safespace.com' => 'therapist',
            'guardian1-uat@safespace.com' => 'guardian',
            'child1-uat@safespace.com' => 'child',
        ];

        foreach ($requiredUsers as $email => $expectedRole) {
            $user = User::where('email', $email)->first();
            
            if (!$user) {
                $this->logError("   ❌ Missing required user: {$email}");
                $this->errors++;
                
                if ($this->option('fix')) {
                    $this->info("   🔧 Run 'php artisan uat:setup' to create missing users");
                }
            } else {
                if (!$user->hasRole($expectedRole)) {
                    $this->logError("   ❌ User {$email} has incorrect role (expected: {$expectedRole})");
                    $this->errors++;
                }
                
                if (!$user->email_verified_at) {
                    $this->warn("   ⚠️  User {$email} email not verified");
                    $this->warnings++;
                    
                    if ($this->option('fix')) {
                        $user->update(['email_verified_at' => now()]);
                        $this->info("   ✅ Fixed: Email verified for {$email}");
                        $this->fixes++;
                    }
                }
                
                if (!$user->is_approved) {
                    $this->warn("   ⚠️  User {$email} not approved");
                    $this->warnings++;
                    
                    if ($this->option('fix')) {
                        $user->update(['is_approved' => true]);
                        $this->info("   ✅ Fixed: Approved user {$email}");
                        $this->fixes++;
                    }
                }
            }
        }

        // Check for duplicate emails
        $duplicates = User::select('email')
            ->groupBy('email')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('email');

        foreach ($duplicates as $email) {
            $this->logError("   ❌ Duplicate email found: {$email}");
            $this->errors++;
        }

        $this->info('   ✅ User validation completed');
    }

    /**
     * Validate role assignments
     */
    private function validateRoleAssignments(): void
    {
        $this->info('🎭 Validating role assignments...');

        $expectedCounts = [
            'admin' => ['min' => 1, 'max' => 5],
            'therapist' => ['min' => 2, 'max' => 10],
            'guardian' => ['min' => 2, 'max' => 10],
            'child' => ['min' => 2, 'max' => 20],
        ];

        foreach ($expectedCounts as $role => $limits) {
            $count = User::role($role)->count();
            
            if ($count < $limits['min']) {
                $this->logError("   ❌ Too few {$role} users: {$count} (minimum: {$limits['min']})");
                $this->errors++;
            } elseif ($count > $limits['max']) {
                $this->warn("   ⚠️  Many {$role} users: {$count} (maximum recommended: {$limits['max']})");
                $this->warnings++;
            } else {
                $this->info("   ✅ {$role} count: {$count}");
            }
        }

        // Check for users without roles
        $usersWithoutRoles = User::whereDoesntHave('roles')->count();
        if ($usersWithoutRoles > 0) {
            $this->logError("   ❌ {$usersWithoutRoles} users without roles");
            $this->errors++;
        }

        $this->info('   ✅ Role assignment validation completed');
    }

    /**
     * Validate family relationships
     */
    private function validateFamilyRelationships(): void
    {
        $this->info('👨‍👩‍👧‍👦 Validating family relationships...');

        // Check children have valid guardians
        $childrenWithoutGuardians = User::role('child')
            ->whereNull('guardian_id')
            ->count();

        if ($childrenWithoutGuardians > 0) {
            $this->logError("   ❌ {$childrenWithoutGuardians} children without guardians");
            $this->errors++;
        }

        // Check guardian references are valid
        $childrenWithInvalidGuardians = User::role('child')
            ->whereNotNull('guardian_id')
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('users as guardians')
                    ->whereColumn('guardians.id', 'users.guardian_id')
                    ->whereExists(function ($subQuery) {
                        $subQuery->select(DB::raw(1))
                            ->from('model_has_roles')
                            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                            ->whereColumn('model_has_roles.model_id', 'guardians.id')
                            ->where('roles.name', 'guardian');
                    });
            })
            ->count();

        if ($childrenWithInvalidGuardians > 0) {
            $this->logError("   ❌ {$childrenWithInvalidGuardians} children with invalid guardian references");
            $this->errors++;
        }

        // Check guardians have children
        $guardiansWithoutChildren = User::role('guardian')
            ->whereDoesntHave('children')
            ->count();

        if ($guardiansWithoutChildren > 0) {
            $this->warn("   ⚠️  {$guardiansWithoutChildren} guardians without children");
            $this->warnings++;
        }

        $this->info('   ✅ Family relationship validation completed');
    }

    /**
     * Validate therapist assignments
     */
    private function validateTherapistAssignments(): void
    {
        $this->info('🩺 Validating therapist assignments...');

        // Check children have therapists
        $childrenWithoutTherapists = User::role('child')
            ->whereNull('therapist_id')
            ->count();

        if ($childrenWithoutTherapists > 0) {
            $this->warn("   ⚠️  {$childrenWithoutTherapists} children without assigned therapists");
            $this->warnings++;
        }

        // Check therapist references are valid
        $childrenWithInvalidTherapists = User::role('child')
            ->whereNotNull('therapist_id')
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('users as therapists')
                    ->whereColumn('therapists.id', 'users.therapist_id')
                    ->whereExists(function ($subQuery) {
                        $subQuery->select(DB::raw(1))
                            ->from('model_has_roles')
                            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                            ->whereColumn('model_has_roles.model_id', 'therapists.id')
                            ->where('roles.name', 'therapist');
                    });
            })
            ->count();

        if ($childrenWithInvalidTherapists > 0) {
            $this->logError("   ❌ {$childrenWithInvalidTherapists} children with invalid therapist references");
            $this->errors++;
        }

        // Check therapist workload distribution
        $therapists = User::role('therapist')->withCount('assignedChildren')->get();
        
        foreach ($therapists as $therapist) {
            if ($therapist->assigned_children_count === 0) {
                $this->warn("   ⚠️  Therapist {$therapist->name} has no assigned children");
                $this->warnings++;
            } elseif ($therapist->assigned_children_count > 10) {
                $this->warn("   ⚠️  Therapist {$therapist->name} has many children ({$therapist->assigned_children_count})");
                $this->warnings++;
            } else {
                $this->info("   ✅ {$therapist->name}: {$therapist->assigned_children_count} children");
            }
        }

        $this->info('   ✅ Therapist assignment validation completed');
    }

    /**
     * Validate mood tracking data
     */
    private function validateMoodData(): void
    {
        $this->info('😊 Validating mood tracking data...');

        $children = User::role('child')->get();
        
        foreach ($children as $child) {
            $moodCount = MoodLog::where('user_id', $child->id)->count();
            
            if ($moodCount === 0) {
                $this->warn("   ⚠️  {$child->name} has no mood logs");
                $this->warnings++;
            } elseif ($moodCount < 10) {
                $this->warn("   ⚠️  {$child->name} has few mood logs ({$moodCount})");
                $this->warnings++;
            } else {
                $this->info("   ✅ {$child->name}: {$moodCount} mood logs");
            }

            // Check for invalid mood values
            $invalidMoods = MoodLog::where('user_id', $child->id)
                ->whereNotIn('mood', ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'])
                ->count();

            if ($invalidMoods > 0) {
                $this->logError("   ❌ {$child->name} has {$invalidMoods} invalid mood values");
                $this->errors++;
            }

            // Check for future mood logs
            $futureMoods = MoodLog::where('user_id', $child->id)
                ->where('logged_at', '>', now()->format('Y-m-d'))
                ->count();

            if ($futureMoods > 0) {
                $this->logError("   ❌ {$child->name} has {$futureMoods} future mood logs");
                $this->errors++;
            }
        }

        $this->info('   ✅ Mood data validation completed');
    }

    /**
     * Validate appointment data
     */
    private function validateAppointments(): void
    {
        $this->info('📅 Validating appointment data...');

        // Check for appointments with invalid therapist references
        $invalidTherapistAppointments = Appointment::whereNotExists(function ($query) {
            $query->select(DB::raw(1))
                ->from('users')
                ->whereColumn('users.id', 'appointments.therapist_id')
                ->whereExists(function ($subQuery) {
                    $subQuery->select(DB::raw(1))
                        ->from('model_has_roles')
                        ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                        ->whereColumn('model_has_roles.model_id', 'users.id')
                        ->where('roles.name', 'therapist');
                });
        })->count();

        if ($invalidTherapistAppointments > 0) {
            $this->logError("   ❌ {$invalidTherapistAppointments} appointments with invalid therapist references");
            $this->errors++;
        }

        // Check for appointments with invalid child references
        $invalidChildAppointments = Appointment::whereNotExists(function ($query) {
            $query->select(DB::raw(1))
                ->from('users')
                ->whereColumn('users.id', 'appointments.child_id')
                ->whereExists(function ($subQuery) {
                    $subQuery->select(DB::raw(1))
                        ->from('model_has_roles')
                        ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                        ->whereColumn('model_has_roles.model_id', 'users.id')
                        ->where('roles.name', 'child');
                });
        })->count();

        if ($invalidChildAppointments > 0) {
            $this->logError("   ❌ {$invalidChildAppointments} appointments with invalid child references");
            $this->errors++;
        }

        // Check appointment status values
        $invalidStatuses = Appointment::whereNotIn('status', ['scheduled', 'completed', 'cancelled', 'no_show'])
            ->count();

        if ($invalidStatuses > 0) {
            $this->logError("   ❌ {$invalidStatuses} appointments with invalid status values");
            $this->errors++;
        }

        // Check for overlapping appointments
        $overlappingAppointments = DB::select("
            SELECT COUNT(*) as count FROM (
                SELECT a1.therapist_id, a1.scheduled_at, a1.duration_minutes
                FROM appointments a1
                JOIN appointments a2 ON a1.therapist_id = a2.therapist_id 
                    AND a1.id != a2.id
                    AND a1.status = 'scheduled'
                    AND a2.status = 'scheduled'
                    AND a1.scheduled_at < DATE_ADD(a2.scheduled_at, INTERVAL a2.duration_minutes MINUTE)
                    AND a2.scheduled_at < DATE_ADD(a1.scheduled_at, INTERVAL a1.duration_minutes MINUTE)
                GROUP BY a1.therapist_id, a1.scheduled_at, a1.duration_minutes
            ) as overlaps
        ");

        $overlapCount = $overlappingAppointments[0]->count ?? 0;
        if ($overlapCount > 0) {
            $this->logError("   ❌ {$overlapCount} overlapping appointments detected");
            $this->errors++;
        }

        $totalAppointments = Appointment::count();
        $this->info("   ✅ Validated {$totalAppointments} appointments");
    }

    /**
     * Validate message data
     */
    private function validateMessages(): void
    {
        $this->info('💬 Validating message data...');

        // Check for messages with invalid sender references
        $invalidSenders = Message::whereNotExists(function ($query) {
            $query->select(DB::raw(1))
                ->from('users')
                ->whereColumn('users.id', 'messages.sender_id');
        })->count();

        if ($invalidSenders > 0) {
            $this->logError("   ❌ {$invalidSenders} messages with invalid sender references");
            $this->errors++;
        }

        // Check for messages with invalid recipient references
        $invalidRecipients = Message::whereNotExists(function ($query) {
            $query->select(DB::raw(1))
                ->from('users')
                ->whereColumn('users.id', 'messages.recipient_id');
        })->count();

        if ($invalidRecipients > 0) {
            $this->logError("   ❌ {$invalidRecipients} messages with invalid recipient references");
            $this->errors++;
        }

        // Check for empty messages
        $emptyMessages = Message::where(function ($query) {
            $query->whereNull('content')
                ->orWhere('content', '')
                ->orWhere('content', 'like', '%   %'); // Only whitespace
        })->count();

        if ($emptyMessages > 0) {
            $this->warn("   ⚠️  {$emptyMessages} messages with empty or whitespace-only content");
            $this->warnings++;
        }

        $totalMessages = Message::count();
        $this->info("   ✅ Validated {$totalMessages} messages");
    }

    /**
     * Validate content data
     */
    private function validateContent(): void
    {
        $this->info('📚 Validating content data...');

        // Check for articles with invalid author references
        $invalidAuthors = Article::whereNotExists(function ($query) {
            $query->select(DB::raw(1))
                ->from('users')
                ->whereColumn('users.id', 'articles.author_id')
                ->whereExists(function ($subQuery) {
                    $subQuery->select(DB::raw(1))
                        ->from('model_has_roles')
                        ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                        ->whereColumn('model_has_roles.model_id', 'users.id')
                        ->where('roles.name', 'therapist');
                });
        })->count();

        if ($invalidAuthors > 0) {
            $this->logError("   ❌ {$invalidAuthors} articles with invalid author references");
            $this->errors++;
        }

        // Check article status values
        $invalidStatuses = Article::whereNotIn('status', ['draft', 'pending', 'published', 'archived'])
            ->count();

        if ($invalidStatuses > 0) {
            $this->logError("   ❌ {$invalidStatuses} articles with invalid status values");
            $this->errors++;
        }

        // Check for published articles without publish date
        $publishedWithoutDate = Article::where('status', 'published')
            ->whereNull('published_at')
            ->count();

        if ($publishedWithoutDate > 0) {
            $this->warn("   ⚠️  {$publishedWithoutDate} published articles without publish date");
            $this->warnings++;
            
            if ($this->option('fix')) {
                Article::where('status', 'published')
                    ->whereNull('published_at')
                    ->update(['published_at' => now()]);
                $this->info("   ✅ Fixed: Added publish dates to {$publishedWithoutDate} articles");
                $this->fixes++;
            }
        }

        $totalArticles = Article::count();
        $publishedArticles = Article::where('status', 'published')->count();
        $this->info("   ✅ Validated {$totalArticles} articles ({$publishedArticles} published)");
    }

    /**
     * Validate therapist availability
     */
    private function validateTherapistAvailability(): void
    {
        $this->info('⏰ Validating therapist availability...');

        $therapists = User::role('therapist')->get();
        
        foreach ($therapists as $therapist) {
            $availabilityCount = TherapistAvailability::where('therapist_id', $therapist->id)->count();
            
            if ($availabilityCount === 0) {
                $this->warn("   ⚠️  {$therapist->name} has no availability schedule");
                $this->warnings++;
            } else {
                $this->info("   ✅ {$therapist->name}: {$availabilityCount} availability slots");
            }

            // Check for invalid day_of_week values
            $invalidDays = TherapistAvailability::where('therapist_id', $therapist->id)
                ->where(function ($query) {
                    $query->where('day_of_week', '<', 1)
                        ->orWhere('day_of_week', '>', 7);
                })
                ->count();

            if ($invalidDays > 0) {
                $this->logError("   ❌ {$therapist->name} has {$invalidDays} invalid day_of_week values");
                $this->errors++;
            }

            // Check for invalid time ranges
            $invalidTimes = TherapistAvailability::where('therapist_id', $therapist->id)
                ->whereRaw('start_time >= end_time')
                ->count();

            if ($invalidTimes > 0) {
                $this->logError("   ❌ {$therapist->name} has {$invalidTimes} invalid time ranges");
                $this->errors++;
            }
        }

        $this->info('   ✅ Therapist availability validation completed');
    }

    /**
     * Display validation summary
     */
    private function displayValidationSummary(): void
    {
        $this->newLine();
        $this->info('📊 Validation Summary:');
        $this->info('=====================');
        
        if ($this->errors === 0 && $this->warnings === 0) {
            $this->info('🎉 All validations passed! UAT data is in excellent condition.');
        } else {
            if ($this->errors > 0) {
                $this->logError("❌ Errors: {$this->errors}");
            }
            
            if ($this->warnings > 0) {
                $this->warn("⚠️  Warnings: {$this->warnings}");
            }
            
            if ($this->fixes > 0) {
                $this->info("✅ Fixes Applied: {$this->fixes}");
            }
        }
        
        $this->newLine();
        
        if ($this->errors > 0) {
            $this->logError('🚨 Critical issues found that need attention!');
            $this->info('💡 Run with --fix flag to attempt automatic repairs.');
            $this->info('💡 For missing data, run: php artisan uat:setup');
        } elseif ($this->warnings > 0) {
            $this->warn('⚠️  Minor issues found - UAT can proceed but consider addressing warnings.');
        } else {
            $this->info('✅ UAT data validation completed successfully!');
        }
    }

    /**
     * Helper methods
     */
    private function logError(string $message): void
    {
        $this->line($message, null, 'error');
    }

    private function warn(string $message): void
    {
        $this->line($message, null, 'comment');
    }
}