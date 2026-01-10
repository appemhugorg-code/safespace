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
        Schema::table('articles', function (Blueprint $table) {
            // Only add columns if they don't already exist
            if (!Schema::hasColumn('articles', 'slug')) {
                $table->string('slug')->unique()->after('title');
            }
            if (!Schema::hasColumn('articles', 'featured_image')) {
                $table->string('featured_image')->nullable()->after('excerpt');
            }
            if (!Schema::hasColumn('articles', 'meta_description')) {
                $table->string('meta_description')->nullable()->after('tags');
            }
            if (!Schema::hasColumn('articles', 'reading_time')) {
                $table->integer('reading_time')->nullable()->after('meta_description');
            }
            if (!Schema::hasColumn('articles', 'view_count')) {
                $table->integer('view_count')->default(0)->after('reading_time');
            }
            if (!Schema::hasColumn('articles', 'reviewed_by')) {
                $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null')->after('published_at');
            }
            if (!Schema::hasColumn('articles', 'reviewed_at')) {
                $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            }
            if (!Schema::hasColumn('articles', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable()->after('reviewed_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            // Check if columns exist before dropping them
            if (Schema::hasColumn('articles', 'slug')) {
                $table->dropUnique(['slug']); // Drop unique constraint first
                $table->dropColumn('slug');
            }
            if (Schema::hasColumn('articles', 'featured_image')) {
                $table->dropColumn('featured_image');
            }
            if (Schema::hasColumn('articles', 'meta_description')) {
                $table->dropColumn('meta_description');
            }
            if (Schema::hasColumn('articles', 'reading_time')) {
                $table->dropColumn('reading_time');
            }
            if (Schema::hasColumn('articles', 'view_count')) {
                $table->dropColumn('view_count');
            }
            if (Schema::hasColumn('articles', 'reviewed_by')) {
                $table->dropForeign(['reviewed_by']); // Drop foreign key first
                $table->dropColumn('reviewed_by');
            }
            if (Schema::hasColumn('articles', 'reviewed_at')) {
                $table->dropColumn('reviewed_at');
            }
            if (Schema::hasColumn('articles', 'rejection_reason')) {
                $table->dropColumn('rejection_reason');
            }
        });
    }
};
