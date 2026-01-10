# Implementation Plan

- [x] 1. Create backend controller and routes for therapist appointment scheduling

  - Implement `TherapistAppointmentController` with `create()` and `store()` methods
  - Add route definitions for therapist appointment creation
  - Implement client retrieval logic (children and guardians assigned to therapist)
  - Implement appointment creation with auto-confirmed status
  - _Requirements: 1.1, 1.2, 1.3, 6.1, 6.2_

- [x] 1.1 Implement create() method to load appointment form


  - Query children assigned to therapist with guardian relationships
  - Query guardians who have had appointments with therapist
  - Format client data with type distinction (child/guardian)
  - Return Inertia response with clients and therapist data
  - _Requirements: 1.1, 2.1, 2.4_



- [x] 1.2 Implement store() method to create appointments

  - Validate request data (client_id, client_type, scheduled_at, duration_minutes, notes)
  - Determine child_id and guardian_id based on client type
  - Check for scheduling conflicts using existing Appointment::hasConflict() method


  - Create appointment with status 'confirmed' and appropriate appointment_type
  - _Requirements: 2.2, 2.3, 3.2, 3.3, 6.1, 6.2, 7.2, 8.4_


- [x] 1.3 Implement notification sending logic

  - Call GoogleMeetService to generate meeting link


  - Send email notifications via EmailNotificationService
  - Create in-app notifications for child and/or guardian based on client type
  - Include appointment details and meeting link in notifications


  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.3, 6.4_



- [x] 1.4 Add route definitions

  - Create therapist-prefixed route group with auth and role:therapist middleware
  - Add GET route for /therapist/appointments/create
  - Add POST route for /therapist/appointments
  - _Requirements: 1.1, 1.2_


- [x] 2. Create React component for therapist appointment creation form

  - Create `appointment-create.tsx` component in `resources/js/pages/therapist/`
  - Implement form state management with client selection, date, time, duration, and notes
  - Add client dropdown with visual distinction between children and guardians
  - Implement date picker with minimum date validation
  - Add duration selector with predefined options (30, 60, 90, 120 minutes)


  - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.5, 4.1, 4.2_


- [x] 2.1 Implement client selection dropdown

  - Create dropdown component with client list
  - Display child clients with guardian information
  - Display guardian clients separately
  - Add visual icons to distinguish client types
  - Handle client selection and update form state



  - _Requirements: 2.1, 2.2, 2.3, 2.4_


- [x] 2.2 Implement date and time selection

  - Add date picker with minimum date of tomorrow
  - Fetch available time slots when date and therapist are selected
  - Display loading state while fetching slots

  - Show available time slots in dropdown

  - Display "No available times" message when no slots available

  - Handle time selection and update form state
  - _Requirements: 3.1, 3.2, 3.3, 3.4_



- [ ] 2.3 Implement session notes input
  - Add textarea for session notes
  - Implement character counter (0/500)
  - Update character count as user types


  - Validate maximum length


  - _Requirements: 4.1, 4.2, 4.3, 4.4_


- [ ] 2.4 Implement form validation and submission
  - Add client-side validation for required fields
  - Display inline error messages for validation failures



  - Highlight fields with errors in red
  - Disable submit button when form is invalid or processing
  - Handle form submission with loading state
  - Display backend validation errors

  - Redirect to appointments index on success




  - _Requirements: 7.1, 7.2, 7.3, 7.4, 8.1, 8.2_

- [ ] 2.5 Add informational section and UI polish
  - Create "What happens next?" information box
  - Add success message display after creation


  - Implement loading spinner in submit button
  - Add cancel button that navigates back to appointments
  - Style form with consistent spacing and layout
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 3. Integrate appointment creation button into therapist dashboard and appointments page

  - Add "Schedule Appointment" button to therapist dashboard Quick Actions


  - Add "Schedule Appointment" button to appointments index page for therapists

  - Link buttons to /therapist/appointments/create route
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 3.1 Update therapist dashboard
  - Open `resources/js/pages/dashboard/therapist.tsx`

  - Add "Schedule Appointment" button to Quick Actions section
  - Use Plus icon and link to therapist appointment creation route

  - _Requirements: 1.3_




- [ ] 3.2 Update appointments index page
  - Open `resources/js/pages/appointments/index.tsx`
  - Add conditional "Schedule Appointment" button for therapists
  - Position button next to page title
  - Use Plus icon and link to therapist appointment creation route
  - _Requirements: 1.2_

- [ ]* 4. Write tests for therapist appointment scheduling
  - Create feature tests for appointment creation flow
  - Create unit tests for controller methods
  - Test authorization and validation
  - Test notification sending
  - Test conflict detection
  - _Requirements: All requirements_

- [ ]* 4.1 Create feature tests
  - Test therapist can access create form
  - Test therapist can create appointment with child client
  - Test therapist can create appointment with guardian client
  - Test non-therapists cannot access routes
  - Test appointment notifications are sent
  - Test Google Meet link generation
  - Test conflict prevention
  - _Requirements: 1.1, 2.1, 2.2, 5.1, 5.2, 6.3, 7.2_

- [ ]* 4.2 Create unit tests
  - Test client retrieval logic
  - Test appointment creation with correct status
  - Test child_id and guardian_id assignment based on client type
  - Test validation rules
  - Test conflict detection
  - _Requirements: 2.2, 2.3, 3.2, 6.1, 7.1, 7.2_
