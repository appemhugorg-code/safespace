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
        Schema::create('video_session_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_session_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained();
            $table->string('name');
            $table->enum('role', ['therapist', 'client', 'guardian', 'admin']);
            $table->boolean('is_audio_enabled')->default(true);
            $table->boolean('is_video_enabled')->default(true);
            $table->boolean('is_screen_sharing')->default(false);
            $table->enum('connection_state', ['connecting', 'connected', 'disconnected', 'failed'])->default('connecting');
            $table->timestamp('joined_at')->nullable();
            $table->timestamp('left_at')->nullable();
            $table->integer('total_duration')->nullable(); // in minutes
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index(['video_session_id', 'user_id']);
            $table->index(['user_id', 'created_at']);
            $table->index('connection_state');
            $table->unique(['video_session_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_session_participants');
    }
};