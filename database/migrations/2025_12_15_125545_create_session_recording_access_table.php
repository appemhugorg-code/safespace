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
        Schema::create('session_recording_access', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('recording_id');
            $table->unsignedBigInteger('user_id'); // Changed from uuid to unsignedBigInteger
            $table->enum('role', ['therapist', 'client', 'guardian', 'admin']);
            $table->json('permissions'); // ['view', 'download', 'delete', 'share']
            $table->timestamp('expires_at')->nullable();
            $table->unsignedBigInteger('granted_by'); // Changed from uuid to unsignedBigInteger
            $table->timestamp('granted_at');
            $table->timestamps();
            
            // Indexes
            $table->index('recording_id');
            $table->index('user_id');
            $table->index('expires_at');
            $table->unique(['recording_id', 'user_id']);
            
            // Foreign key constraints
            $table->foreign('recording_id')->references('id')->on('session_recordings')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('granted_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('session_recording_access');
    }
};
