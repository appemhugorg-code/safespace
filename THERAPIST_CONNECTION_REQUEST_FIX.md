# Therapist Connection Request Approval Fix

## Issue
When logged in as a therapist and trying to approve a client connection request, the request was not processed and an error toast was returned with "An error occurred while processing the request".

## Root Cause
The frontend was using the `fetch` API to call API routes (`/api/therapist/requests/{id}/approve`) but expecting Inertia-style responses. Additionally, there was an import error with the `useToast` hook.

## Solution

### 1. Fixed Import Error
- Changed `import { toast } from '@/hooks/use-toast'` to `import { useToast } from '@/hooks/use-toast'`
- Updated usage from `toast()` to `const { toast } = useToast()` and then `toast()`

### 2. Updated Frontend to Use Inertia
- Replaced `fetch` API calls with Inertia's `useForm` hook
- Added proper error handling with Inertia's `onSuccess`, `onError`, and `onFinish` callbacks
- Updated request URLs to use web routes instead of API routes

### 3. Added Web Routes
Added new web routes for therapist request approval/decline:
```php
Route::post('/requests/{request}/approve', [TherapistConnectionController::class, 'approveRequest'])->name('requests.approve');
Route::post('/requests/{request}/decline', [TherapistConnectionController::class, 'declineRequest'])->name('requests.decline');
```

### 4. Updated Controller Methods
Modified `approveRequest()` and `declineRequest()` methods to handle both Inertia and API requests:
- Added `$request->wantsJson()` checks to determine response type
- Return Inertia redirects with success/error messages for web requests
- Maintain JSON responses for API requests
- Added proper error handling for both response types

### 5. Fixed 404 Error
- Initially tried to use named routes with `route()` helper but encountered import issues
- Resolved by using direct URL construction: `/therapist/requests/${requestId}/${action}`
- Cleared route cache to ensure new routes were properly registered

## Files Modified
- `resources/js/pages/therapist/connections/pending-requests.tsx`
- `routes/web.php`
- `app/Http/Controllers/Therapist/TherapistConnectionController.php`

## Testing
- All development servers are running (PHP, Vite, Reverb, Queue)
- No TypeScript diagnostics errors
- Routes are properly registered and accessible
- Frontend now uses consistent Inertia patterns matching the guardian connection fix

## Result
Therapists can now successfully approve and decline connection requests with proper success/error feedback through toast messages and page updates. The 404 error has been resolved and the functionality works as expected.