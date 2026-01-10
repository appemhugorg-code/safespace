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
        Schema::table('messages', function (Blueprint $table) {
            // Add group support columns
            $table->foreignId('group_id')->nullable()->constrained('groups')->onDelete('cascade');
            $table->enum('message_type', ['direct', 'group'])->default('direct');

            // Make recipient_id nullable since group messages don't have a single recipient
            $table->foreignId('recipient_id')->nullable()->change();

            // Add index for group message queries
            $table->index(['group_id', 'created_at']);
            $table->index(['message_type', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['group_id']);
            $table->dropIndex(['group_id', 'created_at']);
            $table->dropIndex(['message_type', 'created_at']);
            $table->dropColumn(['group_id', 'message_type']);

            // Restore recipient_id as required
            $table->foreignId('recipient_id')->nullable(false)->change();
        });
    }
};
