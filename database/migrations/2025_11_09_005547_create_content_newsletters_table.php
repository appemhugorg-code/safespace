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
        Schema::create('content_newsletters', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('frequency', ['daily', 'weekly', 'monthly'])->default('weekly');
            $table->enum('target_audience', ['children', 'guardians', 'therapists', 'all'])->default('all');
            $table->timestamp('last_sent_at')->nullable();
            $table->timestamp('next_send_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('article_ids')->nullable(); // IDs of articles to include
            $table->integer('subscriber_count')->default(0);
            $table->timestamps();

            // Indexes
            $table->index('frequency');
            $table->index('target_audience');
            $table->index('is_active');
            $table->index('next_send_at');
        });

        // Newsletter subscriptions table
        Schema::create('newsletter_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('newsletter_id')->constrained('content_newsletters')->onDelete('cascade');
            $table->boolean('is_subscribed')->default(true);
            $table->timestamps();

            // Ensure one subscription per user per newsletter
            $table->unique(['user_id', 'newsletter_id']);
            
            // Indexes
            $table->index('user_id');
            $table->index('newsletter_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('newsletter_subscriptions');
        Schema::dropIfExists('content_newsletters');
    }
};
