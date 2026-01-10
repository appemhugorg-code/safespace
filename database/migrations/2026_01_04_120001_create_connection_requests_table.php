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
        Schema::create('connection_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requester_id')->constrained('users')->onDelete('cascade');
            $table->enum('requester_type', ['guardian'])->default('guardian');
            $table->foreignId('target_therapist_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('target_client_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->enum('request_type', ['guardian_to_therapist', 'guardian_child_assignment']);
            $table->enum('status', ['pending', 'approved', 'declined', 'cancelled'])->default('pending');
            $table->text('message')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index(['target_therapist_id', 'status']);
            $table->index(['requester_id', 'status']);
            $table->index(['status', 'created_at']);
            
            // Prevent duplicate pending requests
            $table->unique(['requester_id', 'target_therapist_id', 'target_client_id', 'status'], 'unique_pending_request');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('connection_requests');
    }
};