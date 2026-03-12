# Messaging Permission Fix

## Issue
Users were getting "You cannot message this user. A therapeutic connection is required." error when trying to access chats.

## Root Cause
1. Test database didn't have any therapeutic connections seeded
2. Guardian-Therapist messaging wasn't allowed even when therapist had connection with guardian's child

## Solution

### 1. Created Test Connection Seeder
**File:** `database/seeders/TestConnectionSeeder.php`

Seeds an active therapeutic connection between test therapist and test child.

**Run it:**
```bash
php artisan db:seed --class=TestConnectionSeeder
```

### 2. Enhanced Permission Logic
**File:** `app/Services/ConnectionPermissionService.php`

Added `hasIndirectConnection()` method to check for guardian-therapist connections through children.

**New messaging rules:**
- ✅ Admin can message anyone
- ✅ Therapist ↔ Child (with active connection)
- ✅ Guardian ↔ Child (family relationship)
- ✅ Guardian ↔ Therapist (if therapist treats guardian's child)
- ❌ All other combinations require explicit connection

## Testing

### Test Users (password: `password`)
- `admin@safespace.test` - Can message anyone
- `therapist@safespace.test` - Can message child and guardian
- `guardian@safespace.test` - Can message child and therapist
- `child@safespace.test` - Can message guardian and therapist

### Test Scenarios

1. **Therapist → Child**: ✅ Works (active connection)
2. **Guardian → Child**: ✅ Works (family relationship)
3. **Guardian → Therapist**: ✅ Works (indirect connection through child)
4. **Admin → Anyone**: ✅ Works (admin privilege)

## Database Changes

Run the full seeder to set up test data:
```bash
php artisan migrate:fresh --seed
```

Or just add connections to existing data:
```bash
php artisan db:seed --class=TestConnectionSeeder
```

## Verification

Check connections in database:
```bash
php artisan tinker
>>> \App\Models\TherapistClientConnection::with(['therapist', 'client'])->get()
```

Test messaging permission:
```bash
php artisan tinker
>>> $therapist = User::where('email', 'therapist@safespace.test')->first();
>>> $child = User::where('email', 'child@safespace.test')->first();
>>> app(\App\Services\ConnectionPermissionService::class)->canMessage($therapist, $child);
// Should return: true
```
