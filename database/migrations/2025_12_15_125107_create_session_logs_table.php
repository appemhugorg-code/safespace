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
        Schema::create('session_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('session_id')->unique();
            $table->timestamp('start_time');
            $table->timestamp('end_time')->nullable();
            $table->integer('duration')->default(0); // in seconds
            $table->enum('status', ['active', 'completed', 'terminated', 'failed'])->default('active');
            $table->enum('type', ['therapy-session', 'group-session', 'consultation', 'crisis-intervention']);
            
            // Participants information
            $table->json('participants');
            
            // Session metadata
            $table->uuid('appointment_id')->nullable();
            $table->uuid('therapist_id');
            $table->json('client_ids');
            $table->json('guardian_ids')->nullable();
            $table->json('session_goals')->nullable();
            $table->json('outcomes')->nullable();
            $table->json('next_steps')->nullable();
            
            // Compliance information
            $table->boolean('hipaa_compliant')->default(true);
            $table->boolean('consent_obtained')->default(true);
            $table->boolean('data_retention_applied')->default(true);
            
            // Recording reference
            $table->uuid('recording_id')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('session_id');
            $table->index('therapist_id');
            $table->index('appointment_id');
            $table->index('status');
            $table->index('type');
            $table->index('start_time');
            
            // Foreign key constraints
            $table->foreign('recording_id')->references('id')->on('session_recordings')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('session_logs');
    }
};