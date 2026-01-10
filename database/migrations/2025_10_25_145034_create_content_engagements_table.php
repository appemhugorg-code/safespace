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
        Schema::create('content_engagements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('content_type'); // 'article', 'game'
            $table->unsignedBigInteger('content_id');
            $table->string('action'); // 'view', 'start', 'complete', 'pause', 'resume'
            $table->integer('duration_seconds')->nullable(); // Time spent
            $table->integer('progress_percentage')->default(0);
            $table->json('metadata')->nullable(); // Additional tracking data
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'content_type', 'content_id']);
            $table->index(['content_type', 'content_id', 'action']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('content_engagements');
    }
};
