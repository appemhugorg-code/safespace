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
        Schema::create('session_recordings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('session_id');
            $table->timestamp('start_time');
            $table->timestamp('end_time')->nullable();
            $table->integer('duration')->default(0); // in seconds
            $table->bigInteger('file_size')->default(0); // in bytes
            $table->enum('status', ['recording', 'stopped', 'processing', 'completed', 'failed'])->default('recording');
            
            // Encryption information
            $table->string('encryption_algorithm')->default('AES-256-GCM');
            $table->string('encryption_key_id');
            $table->boolean('encrypted')->default(true);
            $table->string('checksum');
            
            // Retention policy
            $table->integer('retention_period')->default(2555); // 7 years in days
            $table->boolean('auto_delete')->default(true);
            $table->enum('compliance_level', ['HIPAA', 'GDPR', 'BOTH'])->default('HIPAA');
            $table->integer('archive_after')->default(365); // 1 year in days
            
            // File storage information
            $table->string('storage_path')->nullable();
            $table->string('storage_provider')->default('local'); // local, s3, azure, etc.
            $table->json('storage_metadata')->nullable();
            
            // Quality settings
            $table->json('quality_settings');
            
            // Network statistics
            $table->json('network_stats')->nullable();
            
            // Events log
            $table->json('events')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('session_id');
            $table->index('status');
            $table->index('start_time');
            $table->index(['encrypted', 'compliance_level']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('session_recordings');
    }
};