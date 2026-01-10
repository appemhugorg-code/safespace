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
        Schema::create('session_notes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('session_id');
            $table->unsignedBigInteger('author_id'); // Changed from uuid to unsignedBigInteger
            $table->enum('author_role', ['therapist', 'client', 'guardian']);
            $table->text('content'); // Encrypted content
            $table->timestamp('timestamp');
            $table->enum('type', ['session_summary', 'progress_note', 'observation', 'action_item', 'crisis_note']);
            $table->json('tags')->nullable();
            $table->boolean('is_private')->default(false);
            
            // Encryption information
            $table->string('encryption_algorithm')->default('AES-256-GCM');
            $table->string('encryption_key_id');
            $table->boolean('encrypted')->default(true);
            $table->string('checksum');
            
            $table->timestamps();
            
            // Indexes
            $table->index('session_id');
            $table->index('author_id');
            $table->index('author_role');
            $table->index('type');
            $table->index('timestamp');
            $table->index(['session_id', 'type']);
            $table->index(['session_id', 'is_private']);
            
            // Foreign key constraints
            $table->foreign('session_id')->references('session_id')->on('session_logs')->onDelete('cascade');
            $table->foreign('author_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('session_notes');
    }
};