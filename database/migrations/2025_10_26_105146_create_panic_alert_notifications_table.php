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
        Schema::create('panic_alert_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('panic_alert_id')->constrained()->onDelete('cascade');
            $table->foreignId('notified_user_id')->constrained('users')->onDelete('cascade');
            $table->enum('notification_type', ['guardian', 'therapist', 'admin']);
            $table->timestamp('viewed_at')->nullable();
            $table->timestamp('acknowledged_at')->nullable();
            $table->timestamps();

            $table->index(['notified_user_id', 'viewed_at']);
            $table->index(['panic_alert_id']);
            $table->unique(['panic_alert_id', 'notified_user_id']); // Prevent duplicate notifications
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('panic_alert_notifications');
    }
};
