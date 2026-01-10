<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Dashboard Customization
            $table->json('dashboard_layout')->nullable(); // Widget positions and visibility
            $table->json('dashboard_widgets')->nullable(); // Enabled widgets and their settings
            
            // Notification Preferences
            $table->json('notification_settings')->nullable(); // Email, SMS, push preferences
            $table->json('notification_schedule')->nullable(); // Quiet hours and timing
            $table->boolean('email_notifications')->default(true);
            $table->boolean('sms_notifications')->default(false);
            $table->boolean('push_notifications')->default(true);
            
            // Accessibility Preferences
            $table->enum('font_size', ['small', 'medium', 'large', 'extra-large'])->default('medium');
            $table->enum('contrast_level', ['normal', 'high', 'extra-high'])->default('normal');
            $table->boolean('reduced_motion')->default(false);
            $table->boolean('screen_reader_optimized')->default(false);
            $table->boolean('keyboard_navigation')->default(false);
            
            // Interface Preferences
            $table->enum('language', ['en', 'es', 'fr', 'de'])->default('en');
            $table->enum('timezone', [
                'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
                'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo'
            ])->default('America/New_York');
            $table->enum('date_format', ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'])->default('MM/DD/YYYY');
            $table->enum('time_format', ['12h', '24h'])->default('12h');
            
            // Privacy & Security Preferences
            $table->boolean('profile_visibility')->default(true);
            $table->boolean('activity_tracking')->default(true);
            $table->boolean('analytics_consent')->default(false);
            $table->boolean('marketing_consent')->default(false);
            
            // Therapeutic Preferences
            $table->json('mood_tracking_settings')->nullable(); // Frequency, reminders, etc.
            $table->json('goal_preferences')->nullable(); // Goal categories, visibility, etc.
            $table->json('resource_preferences')->nullable(); // Content types, difficulty levels
            
            // Sync and Backup
            $table->boolean('cross_device_sync')->default(true);
            $table->timestamp('last_synced_at')->nullable();
            $table->json('sync_conflicts')->nullable(); // Track any sync conflicts
            
            $table->timestamps();
            
            // Indexes for performance
            $table->index('user_id');
            $table->index(['user_id', 'updated_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_preferences');
    }
};