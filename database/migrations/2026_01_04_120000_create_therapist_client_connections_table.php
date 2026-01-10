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
        Schema::create('therapist_client_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('therapist_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->enum('client_type', ['guardian', 'child']);
            $table->enum('connection_type', ['admin_assigned', 'guardian_requested', 'guardian_child_assignment']);
            $table->enum('status', ['active', 'inactive', 'terminated'])->default('active');
            $table->foreignId('assigned_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('assigned_at')->useCurrent();
            $table->timestamp('terminated_at')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index(['therapist_id', 'status']);
            $table->index(['client_id', 'status']);
            $table->index(['therapist_id', 'client_type', 'status']);
            
            // Prevent duplicate active connections
            $table->unique(['therapist_id', 'client_id', 'status'], 'unique_active_connection');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('therapist_client_connections');
    }
};