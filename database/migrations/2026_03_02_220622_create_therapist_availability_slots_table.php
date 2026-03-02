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
        Schema::create('therapist_availability_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('therapist_id')->constrained('users')->onDelete('cascade');
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('is_booked')->default(false);
            $table->foreignId('appointment_id')->nullable()->constrained('appointments')->onDelete('set null');
            $table->timestamps();
            
            $table->index(['therapist_id', 'date']);
            $table->index(['therapist_id', 'is_booked']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('therapist_availability_slots');
    }
};
