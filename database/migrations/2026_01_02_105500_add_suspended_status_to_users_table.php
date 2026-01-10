<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For SQLite, we need to recreate the table with the new enum values
        if (DB::getDriverName() === 'sqlite') {
            // First, let's get the current table structure
            $columns = DB::select('PRAGMA table_info(users)');
            
            // Create a temporary table with the new enum values
            Schema::create('users_temp', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email')->unique();
                $table->timestamp('email_verified_at')->nullable();
                $table->string('password');
                $table->enum('status', ['pending', 'active', 'suspended', 'disabled', 'deleted'])->default('pending');
                $table->foreignId('guardian_id')->nullable()->constrained('users')->nullOnDelete();
                $table->rememberToken();
                $table->timestamps();
                
                // Add other columns that exist in the users table
                $table->string('two_factor_secret')->nullable();
                $table->text('two_factor_recovery_codes')->nullable();
                $table->timestamp('two_factor_confirmed_at')->nullable();
                $table->boolean('terms_accepted')->default(false);
                $table->timestamp('terms_accepted_at')->nullable();
                $table->string('terms_version')->nullable();
                $table->json('theme_preferences')->nullable();
            });

            // Copy data from original table to temp table with explicit column mapping
            DB::statement('INSERT INTO users_temp (id, name, email, email_verified_at, password, status, guardian_id, remember_token, created_at, updated_at, two_factor_secret, two_factor_recovery_codes, two_factor_confirmed_at, terms_accepted, terms_accepted_at, terms_version, theme_preferences) 
                          SELECT id, name, email, email_verified_at, password, status, guardian_id, remember_token, created_at, updated_at, two_factor_secret, two_factor_recovery_codes, two_factor_confirmed_at, terms_accepted, terms_accepted_at, terms_version, theme_preferences 
                          FROM users');

            // Drop the original table
            Schema::drop('users');

            // Rename temp table to original name
            Schema::rename('users_temp', 'users');
        } elseif (DB::getDriverName() === 'pgsql') {
            // For PostgreSQL, we need to drop the existing check constraint and create a new one
            // First, find the constraint name
            $constraintResult = DB::select("
                SELECT conname 
                FROM pg_constraint 
                WHERE conrelid = (SELECT oid FROM pg_class WHERE relname = 'users') 
                AND contype = 'c' 
                AND pg_get_constraintdef(oid) LIKE '%status%'
            ");
            
            if (!empty($constraintResult)) {
                // Drop the existing constraint
                DB::statement("ALTER TABLE users DROP CONSTRAINT {$constraintResult[0]->conname}");
            }
            
            // Add the new constraint with 'suspended' included
            DB::statement("ALTER TABLE users ADD CONSTRAINT users_status_check CHECK (status::text = ANY (ARRAY['pending'::character varying, 'active'::character varying, 'suspended'::character varying, 'disabled'::character varying, 'deleted'::character varying]::text[]))");
        } else {
            // For MySQL, we can modify the enum directly
            DB::statement("ALTER TABLE users MODIFY COLUMN status ENUM('pending', 'active', 'suspended', 'disabled', 'deleted') DEFAULT 'pending'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // For SQLite, we need to recreate the table without 'suspended'
        if (DB::getDriverName() === 'sqlite') {
            // Create a temporary table with the original enum values
            Schema::create('users_temp', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email')->unique();
                $table->timestamp('email_verified_at')->nullable();
                $table->string('password');
                $table->enum('status', ['pending', 'active', 'disabled', 'deleted'])->default('pending');
                $table->foreignId('guardian_id')->nullable()->constrained('users')->nullOnDelete();
                $table->rememberToken();
                $table->timestamps();
                
                // Add other columns that exist in the users table
                $table->string('two_factor_secret')->nullable();
                $table->text('two_factor_recovery_codes')->nullable();
                $table->timestamp('two_factor_confirmed_at')->nullable();
                $table->boolean('terms_accepted')->default(false);
                $table->timestamp('terms_accepted_at')->nullable();
                $table->string('terms_version')->nullable();
                $table->json('theme_preferences')->nullable();
            });

            // Copy data from original table to temp table (convert 'suspended' to 'disabled')
            DB::statement("INSERT INTO users_temp (id, name, email, email_verified_at, password, status, guardian_id, remember_token, created_at, updated_at, two_factor_secret, two_factor_recovery_codes, two_factor_confirmed_at, terms_accepted, terms_accepted_at, terms_version, theme_preferences) 
                          SELECT id, name, email, email_verified_at, password, CASE WHEN status = 'suspended' THEN 'disabled' ELSE status END, guardian_id, remember_token, created_at, updated_at, two_factor_secret, two_factor_recovery_codes, two_factor_confirmed_at, terms_accepted, terms_accepted_at, terms_version, theme_preferences 
                          FROM users");

            // Drop the original table
            Schema::drop('users');

            // Rename temp table to original name
            Schema::rename('users_temp', 'users');
        } elseif (DB::getDriverName() === 'pgsql') {
            // For PostgreSQL, drop the constraint and recreate without 'suspended'
            $constraintResult = DB::select("
                SELECT conname 
                FROM pg_constraint 
                WHERE conrelid = (SELECT oid FROM pg_class WHERE relname = 'users') 
                AND contype = 'c' 
                AND pg_get_constraintdef(oid) LIKE '%status%'
            ");
            
            if (!empty($constraintResult)) {
                DB::statement("ALTER TABLE users DROP CONSTRAINT {$constraintResult[0]->conname}");
            }
            
            // Add the original constraint without 'suspended'
            DB::statement("ALTER TABLE users ADD CONSTRAINT users_status_check CHECK (status::text = ANY (ARRAY['pending'::character varying, 'active'::character varying, 'disabled'::character varying, 'deleted'::character varying]::text[]))");
        } else {
            // For MySQL, modify the enum back
            DB::statement("ALTER TABLE users MODIFY COLUMN status ENUM('pending', 'active', 'disabled', 'deleted') DEFAULT 'pending'");
        }
    }
};