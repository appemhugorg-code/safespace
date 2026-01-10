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
            $table->string('google_event_id')->nullable()->after('meeting_link');
            $table->string('google_meet_link')->nullable()->after('google_event_id');
            $table->text('google_calendar_data')->nullable()->after('google_meet_link');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn(['google_event_id', 'google_meet_link', 'google_calendar_data']);
        });
    }
};
