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
        Schema::create('video_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('room_id')->unique();
            $table->string('name');
            $table->enum('type', ['therapy-session', 'group-session', 'consultation']);
            $table->enum('status', ['waiting', 'active', 'completed', 'cancelled'])->default('waiting');
            $table->integer('max_participants')->default(2);
            $table->boolean('is_recording')->default(false);
            $table->string('recording_url')->nullable();
            $table->integer('recording_duration')->nullable(); // in seconds
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->integer('scheduled_duration')->nullable(); // in minutes
            $table->integer('actual_duration')->nullable(); // in minutes
            $table->text('session_notes')->nullable();
            $table->json('metadata')->nullable();
            
            // Foreign keys
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('therapist_id')->constrained('users');
            $table->foreignId('client_id')->nullable()->constrained('users');
            $table->foreignId('guardian_id')->nullable()->constrained('users');
            $table->string('appointment_id')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['status', 'created_at']);
            $table->index(['therapist_id', 'created_at']);
            $table->index(['type', 'status']);
            $table->index('room_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_sessions');
    }
};