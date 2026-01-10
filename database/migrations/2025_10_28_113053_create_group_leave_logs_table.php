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
        Schema::create('group_leave_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('groups')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('reason', [
                'no_longer_relevant',
                'too_busy',
                'found_better_support',
                'privacy_concerns',
                'other',
            ]);
            $table->text('custom_reason')->nullable();
            $table->timestamp('left_at')->useCurrent();
            $table->timestamps();

            // Index for analytics and admin review
            $table->index(['group_id', 'left_at']);
            $table->index(['user_id', 'left_at']);
            $table->index(['reason', 'left_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_leave_logs');
    }
};
