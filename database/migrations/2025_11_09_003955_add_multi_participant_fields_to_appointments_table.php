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
        Schema::table('appointments', function (Blueprint $table) {
            // Add appointment type for different session types
            $table->enum('appointment_type', ['individual', 'family', 'group', 'consultation'])
                ->default('individual')
                ->after('status');
            
            // Add title and description for better context
            $table->string('title')->nullable()->after('appointment_type');
            $table->text('description')->nullable()->after('title');
            
            // Add cancelled_by to track who cancelled
            $table->foreignId('cancelled_by')->nullable()->after('cancellation_reason')->constrained('users');
            
            // Add index for appointment type
            $table->index('appointment_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropForeign(['cancelled_by']);
            $table->dropColumn(['appointment_type', 'title', 'description', 'cancelled_by']);
        });
    }
};
