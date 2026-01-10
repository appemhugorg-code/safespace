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
        Schema::create('session_audit_trails', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('session_id');
            $table->unsignedBigInteger('user_id'); // Changed from uuid to unsignedBigInteger
            $table->string('user_role');
            $table->string('action');
            $table->json('details')->nullable();
            $table->string('ip_address');
            $table->text('user_agent');
            $table->timestamp('timestamp');
            $table->timestamps();
            
            // Indexes
            $table->index('session_id');
            $table->index('user_id');
            $table->index('action');
            $table->index('timestamp');
            
            // Foreign key constraints
            $table->foreign('session_id')->references('session_id')->on('session_logs')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('session_audit_trails');
    }
};
