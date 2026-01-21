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
        Schema::table('users', function (Blueprint $table) {
            $table->string('country_code', 5)->nullable()->after('email'); // e.g., +1, +44, +256
            $table->string('phone_number', 20)->nullable()->after('country_code'); // Local phone number
            $table->string('full_phone_number', 25)->nullable()->after('phone_number'); // Full international format
            $table->timestamp('phone_verified_at')->nullable()->after('full_phone_number');
            
            // Add index for phone number lookups
            $table->index(['country_code', 'phone_number']);
            $table->index('full_phone_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['country_code', 'phone_number']);
            $table->dropIndex(['full_phone_number']);
            $table->dropColumn([
                'country_code',
                'phone_number', 
                'full_phone_number',
                'phone_verified_at'
            ]);
        });
    }
};