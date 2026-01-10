# Design Document: Therapist Appointment Scheduling Interface

## Overview

This design document outlines the implementation of a therapist-initiated appointment scheduling interface for the SafeSpace platform. The feature enables therapists to proactively create appointments with their assigned clients (both children and guardians), providing them with full control over their schedule management. The interface will be integrated into the existing appointment system and will leverage the current Appointment model, controllers, and notification services.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Therapist Dashboard                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Quick Actions: "Schedule Appointment" Button        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         Therapist Appointment Creation Interface             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  - Client Selection (Child or Guardian)              │  │
│  │  - Date & Time Picker                                │  │
│  │  - Duration Selection                                │  │
│  │  - Session Notes                                     │  │
│  │  - Conflict Validation                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              AppointmentController (Backend)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  - Validate Input                                    │  │
│  │  - Check Scheduling Conflicts                        │  │
│  │  - Create Appointment (status: confirmed)            │  │
│  │  - Generate Google Meet Link                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Notification Services                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  EmailNotificationService                            │  │
│  │  - Send email to client(s)                           │  │
│  │  - Include appointment details & meeting link        │  │
│  │                                                       │  │
│  │  NotificationService                                 │  │
│  │  - Create in-app notifications                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Flow

1. **Entry Point**: Therapist clicks "Schedule Appointment" button from dashboard or appointments page
2. **Form Rendering**: React component renders appointment creation form
3. **Client Selection**: Therapist selects a child or guardian from their assigned clients
4. **Date/Time Selection**: System displays available time slots based on therapist's schedule
5. **Validation**: Frontend and backend validate for conflicts and required fields
6. **Appointment Creation**: Backend creates appointment with "confirmed" status
7. **Meeting Link Generation**: Google Meet link is automatically generated
8. **Notifications**: Email and in-app notifications sent to relevant parties
9. **Redirect**: Therapist redirected to appointments list with success message

## Components and Interfaces

### Frontend Components

#### 1. TherapistAppointmentCreate Component
**Location**: `resources/js/pages/therapist/appointment-create.tsx`

**Purpose**: Main form component for therapists to create appointments

**Props**:
```typescript
interface Props {
    clients: Client[];  // Both children and guardians assigned to therapist
    therapist: User;
}

interface Client {
    id: number;
    name: string;
    email: string;
    type: 'child' | 'guardian';
    guardian?: {
        id: number;
        name: string;
        email: string;
    };
}
```

**State Management**:
```typescript
const [data, setData] = useState({
    client_id: '',
    client_type: '',  // 'child' or 'guardian'
    date: '',
    time: '',
    duration_minutes: '60',
    notes: '',
});
const [errors, setErrors] = useState<Record<string, string>>({});
const [processing, setProcessing] = useState(false);
const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
const [loadingSlots, setLoadingSlots] = useState(false);
```

**Key Features**:
- Client dropdown with visual distinction between children and guardians
- Date picker with minimum date of tomorrow
- Dynamic time slot loading based on selected date
- Real-time conflict checking
- Duration selection (30, 60, 90, 120 minutes)
- Optional session notes with character counter
- Form validation with error display
- Loading states for async operations

#### 2. Dashboard Integration
**Location**: `resources/js/pages/dashboard/therapist.tsx`

**Modification**: Add "Schedule Appointment" button to Quick Actions section

```typescript
<Button asChild>
    <Link href="/therapist/appointments/create">
        <Plus className="h-4 w-4 mr-2" />
        Schedule Appointment
    </Link>
</Button>
```

#### 3. Appointments Index Integration
**Location**: `resources/js/pages/appointments/index.tsx`

**Modification**: Add "Schedule Appointment" button for therapists

```typescript
{isTherapist && (
    <Button asChild>
        <Link href="/therapist/appointments/create">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Appointment
        </Link>
    </Button>
)}
```

### Backend Components

#### 1. Therapist AppointmentController
**Location**: `app/Http/Controllers/Therapist/AppointmentController.php`

**Methods**:

```php
/**
 * Show the form for creating a new appointment.
 */
public function create()
{
    $therapist = auth()->user();
    
    // Get all children assigned to this therapist
    $children = User::role('child')
        ->where('status', 'active')
        ->whereHas('appointments', function ($query) use ($therapist) {
            $query->where('therapist_id', $therapist->id);
        })
        ->orWhereHas('guardian', function ($query) use ($therapist) {
            $query->whereHas('appointments', function ($q) use ($therapist) {
                $q->where('therapist_id', $therapist->id);
            });
        })
        ->with('guardian')
        ->get();
    
    // Get all guardians who have had appointments with this therapist
    $guardians = User::role('guardian')
        ->where('status', 'active')
        ->whereHas('appointments', function ($query) use ($therapist) {
            $query->where('therapist_id', $therapist->id);
        })
        ->get();
    
    // Combine and format clients
    $clients = $children->map(function ($child) {
        return [
            'id' => $child->id,
            'name' => $child->name,
            'email' => $child->email,
            'type' => 'child',
            'guardian' => $child->guardian ? [
                'id' => $child->guardian->id,
                'name' => $child->guardian->name,
                'email' => $child->guardian->email,
            ] : null,
        ];
    })->concat($guardians->map(function ($guardian) {
        return [
            'id' => $guardian->id,
            'name' => $guardian->name,
            'email' => $guardian->email,
            'type' => 'guardian',
        ];
    }));
    
    return Inertia::render('therapist/appointment-create', [
        'clients' => $clients,
        'therapist' => $therapist,
    ]);
}

/**
 * Store a newly created appointment.
 */
public function store(Request $request)
{
    $therapist = auth()->user();
    
    $validated = $request->validate([
        'client_id' => 'required|exists:users,id',
        'client_type' => 'required|in:child,guardian',
        'scheduled_at' => 'required|date|after:now',
        'duration_minutes' => 'required|integer|in:30,60,90,120',
        'notes' => 'nullable|string|max:500',
    ]);
    
    $client = User::findOrFail($validated['client_id']);
    
    // Determine child_id and guardian_id based on client type
    if ($validated['client_type'] === 'child') {
        $childId = $client->id;
        $guardianId = $client->guardian_id;
    } else {
        $childId = null;
        $guardianId = $client->id;
    }
    
    // Check for scheduling conflicts
    if (Appointment::hasConflict(
        $therapist->id,
        $validated['scheduled_at'],
        $validated['duration_minutes']
    )) {
        return back()->withErrors([
            'scheduled_at' => 'You have a scheduling conflict at this time. Please choose a different time slot.'
        ]);
    }
    
    // Create appointment with confirmed status
    $appointment = Appointment::create([
        'therapist_id' => $therapist->id,
        'child_id' => $childId,
        'guardian_id' => $guardianId,
        'scheduled_at' => $validated['scheduled_at'],
        'duration_minutes' => $validated['duration_minutes'],
        'notes' => $validated['notes'],
        'status' => 'confirmed',
        'appointment_type' => $childId ? 'individual' : 'consultation',
    ]);
    
    // Generate Google Meet link
    $googleMeetService = app(\App\Services\GoogleMeetService::class);
    $googleMeetService->createTherapySession($appointment);
    
    // Send notifications
    $this->sendAppointmentNotifications($appointment);
    
    return redirect()->route('appointments.index')
        ->with('success', 'Appointment scheduled successfully!');
}

/**
 * Send notifications for newly created appointment.
 */
private function sendAppointmentNotifications(Appointment $appointment)
{
    $emailService = app(\App\Services\EmailNotificationService::class);
    $notificationService = app(\App\Services\NotificationService::class);
    
    if ($appointment->child_id) {
        // Appointment with child - notify both child and guardian
        $emailService->sendAppointmentConfirmation($appointment);
        
        $notificationService->createNotification(
            $appointment->child_id,
            'appointment_scheduled',
            'New Appointment Scheduled',
            "Your therapist has scheduled a session for " . 
            $appointment->scheduled_at->format('M d, Y \a\t g:i A')
        );
        
        if ($appointment->guardian_id) {
            $notificationService->createNotification(
                $appointment->guardian_id,
                'appointment_scheduled',
                'Appointment Scheduled for ' . $appointment->child->name,
                "A therapy session has been scheduled for " . 
                $appointment->scheduled_at->format('M d, Y \a\t g:i A')
            );
        }
    } else {
        // Appointment with guardian only
        $emailService->sendAppointmentConfirmation($appointment);
        
        $notificationService->createNotification(
            $appointment->guardian_id,
            'appointment_scheduled',
            'New Consultation Scheduled',
            "Your therapist has scheduled a consultation for " . 
            $appointment->scheduled_at->format('M d, Y \a\t g:i A')
        );
    }
}
```

#### 2. Route Definitions
**Location**: `routes/web.php`

```php
// Therapist appointment routes
Route::middleware(['auth', 'role:therapist'])->prefix('therapist')->name('therapist.')->group(function () {
    Route::get('/appointments/create', [TherapistAppointmentController::class, 'create'])
        ->name('appointments.create');
    Route::post('/appointments', [TherapistAppointmentController::class, 'store'])
        ->name('appointments.store');
});
```

## Data Models

### Existing Appointment Model
**Location**: `app/Models/Appointment.php`

The existing Appointment model already supports all required fields:
- `therapist_id`: ID of the therapist
- `child_id`: ID of the child (nullable for guardian-only appointments)
- `guardian_id`: ID of the guardian
- `scheduled_at`: DateTime of the appointment
- `duration_minutes`: Duration in minutes
- `status`: Appointment status (will be set to 'confirmed')
- `appointment_type`: Type of appointment ('individual' or 'consultation')
- `notes`: Session notes
- `meeting_link`: Google Meet link
- `google_event_id`: Google Calendar event ID

**No database migrations required** - the existing schema supports this feature.

### Client Data Structure

For the frontend, we'll format client data as:

```typescript
interface Client {
    id: number;
    name: string;
    email: string;
    type: 'child' | 'guardian';
    guardian?: {
        id: number;
        name: string;
        email: string;
    };
}
```

## Error Handling

### Frontend Validation

1. **Required Fields**:
   - Client selection
   - Date selection
   - Time selection
   - Duration selection

2. **Business Rules**:
   - Date must be in the future (minimum tomorrow)
   - Time slot must be available
   - Notes must not exceed 500 characters

3. **Error Display**:
   - Inline error messages below each field
   - Red border highlighting for fields with errors
   - Disabled submit button until all errors are resolved

### Backend Validation

1. **Request Validation**:
```php
$validated = $request->validate([
    'client_id' => 'required|exists:users,id',
    'client_type' => 'required|in:child,guardian',
    'scheduled_at' => 'required|date|after:now',
    'duration_minutes' => 'required|integer|in:30,60,90,120',
    'notes' => 'nullable|string|max:500',
]);
```

2. **Conflict Checking**:
   - Use existing `Appointment::hasConflict()` method
   - Return specific error message for scheduling conflicts
   - Suggest alternative time slots if available

3. **Authorization**:
   - Verify user is a therapist
   - Verify client is assigned to the therapist
   - Return 403 Forbidden for unauthorized access

### Error Messages

| Error Type | Message |
|------------|---------|
| Missing client | "Please select a client for this appointment" |
| Missing date | "Please select a date for the appointment" |
| Missing time | "Please select a time slot" |
| Past date | "Appointment date must be in the future" |
| Scheduling conflict | "You have a scheduling conflict at this time. Please choose a different time slot." |
| Notes too long | "Notes cannot exceed 500 characters" |
| Unauthorized client | "You do not have permission to schedule appointments with this client" |
| System error | "An error occurred while creating the appointment. Please try again." |

## Testing Strategy

### Unit Tests

**Location**: `tests/Unit/TherapistAppointmentTest.php`

1. **Test appointment creation with child client**
   - Verify appointment is created with correct data
   - Verify status is set to 'confirmed'
   - Verify child_id and guardian_id are set correctly

2. **Test appointment creation with guardian client**
   - Verify appointment is created with correct data
   - Verify child_id is null
   - Verify guardian_id is set correctly

3. **Test conflict detection**
   - Create overlapping appointments
   - Verify conflict is detected
   - Verify error is returned

4. **Test validation rules**
   - Test required fields
   - Test date validation
   - Test duration validation
   - Test notes length validation

### Feature Tests

**Location**: `tests/Feature/TherapistAppointmentSchedulingTest.php`

1. **Test therapist can access create form**
   - Verify route is accessible to therapists
   - Verify correct clients are loaded
   - Verify non-therapists cannot access

2. **Test therapist can create appointment**
   - Submit valid appointment data
   - Verify appointment is created in database
   - Verify redirect to appointments index
   - Verify success message is displayed

3. **Test appointment notifications are sent**
   - Create appointment
   - Verify email is sent to client(s)
   - Verify in-app notifications are created

4. **Test Google Meet link generation**
   - Create appointment
   - Verify meeting_link is populated
   - Verify google_event_id is set

5. **Test conflict prevention**
   - Create appointment at specific time
   - Attempt to create overlapping appointment
   - Verify error is returned
   - Verify second appointment is not created

### Integration Tests

1. **Test end-to-end appointment creation flow**
   - Login as therapist
   - Navigate to create form
   - Fill out form
   - Submit
   - Verify appointment appears in list
   - Verify notifications are received

2. **Test available slots API**
   - Request available slots for a date
   - Verify booked slots are excluded
   - Verify past times are excluded

## UI/UX Considerations

### Form Layout

```
┌─────────────────────────────────────────────────────────┐
│  Schedule Appointment                                    │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  Client *                                                │
│  [Select a client ▼]                                     │
│                                                          │
│  Date *                                                  │
│  [MM/DD/YYYY 📅]                                         │
│                                                          │
│  Available Times *                                       │
│  [Select a time ▼]                                       │
│                                                          │
│  Session Duration *                                      │
│  [1 hour ▼]                                              │
│                                                          │
│  Session Notes (Optional)                                │
│  [Text area for notes...]                                │
│  0/500 characters                                        │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ ℹ️ What happens next?                              │ │
│  │ • Appointment will be automatically confirmed      │ │
│  │ • Google Meet link will be generated               │ │
│  │ • Client will receive email and in-app notification│ │
│  │ • Appointment will appear in your schedule         │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  [Schedule Appointment]  [Cancel]                        │
└─────────────────────────────────────────────────────────┘
```

### Visual Design Elements

1. **Client Dropdown**:
   - Children shown with 👤 icon
   - Guardians shown with 👨‍👩‍👧 icon
   - Display guardian name below child name for context

2. **Time Slots**:
   - Show loading spinner while fetching
   - Display "No available times" message if none found
   - Format times in 12-hour format (e.g., "2:00 PM")

3. **Success State**:
   - Green toast notification
   - Redirect to appointments list
   - Highlight newly created appointment

4. **Loading States**:
   - Disable submit button while processing
   - Show spinner icon in button
   - Disable form fields during submission

## Security Considerations

1. **Authorization**:
   - Middleware ensures only therapists can access routes
   - Backend verifies therapist can schedule with selected client
   - CSRF protection on form submission

2. **Input Validation**:
   - All inputs validated on backend
   - SQL injection prevention through Eloquent ORM
   - XSS prevention through React's automatic escaping

3. **Data Privacy**:
   - Only show clients assigned to the therapist
   - Appointment details only visible to participants
   - Meeting links only shared with authorized users

## Performance Considerations

1. **Database Queries**:
   - Eager load relationships (guardian, children)
   - Index on therapist_id, scheduled_at for conflict checking
   - Cache available slots for frequently accessed dates

2. **Frontend Optimization**:
   - Debounce available slots API calls
   - Lazy load client list if very large
   - Optimize re-renders with React.memo if needed

3. **API Response Times**:
   - Available slots endpoint should respond < 200ms
   - Appointment creation should complete < 500ms
   - Background jobs for email sending to avoid blocking

## Future Enhancements

1. **Recurring Appointments**:
   - Allow therapists to create weekly/monthly recurring sessions
   - Bulk appointment creation

2. **Calendar View**:
   - Visual calendar interface for appointment creation
   - Drag-and-drop scheduling

3. **Availability Management**:
   - Therapists can set their working hours
   - Block out unavailable times
   - Vacation/time-off management

4. **Appointment Templates**:
   - Save common appointment configurations
   - Quick scheduling with pre-filled data

5. **Waitlist Management**:
   - Allow clients to join waitlist for full time slots
   - Automatic notification when slots become available
