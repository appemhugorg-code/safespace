# Requirements Document

## Introduction

This document outlines the requirements for a therapist appointment scheduling interface that enables therapists to directly create and schedule appointments with their assigned clients. Currently, therapists can only view appointments requested by guardians, but they lack the ability to proactively schedule sessions themselves. This feature will provide therapists with full control over their schedule management.

## Glossary

- **Therapist Dashboard**: The main interface where therapists view their practice overview and access key functions
- **Appointment Scheduler**: The interface component that allows therapists to create new appointments
- **Client**: Either a child user or a guardian assigned to the therapist who receives therapy services
- **Guardian**: The parent or legal guardian of a child client
- **Child**: A minor user who receives therapy services under guardian supervision
- **Session**: A scheduled therapy appointment between a therapist and client
- **Time Slot**: A specific date and time period available for scheduling appointments
- **Appointment System**: The backend service that manages appointment creation, validation, and storage

## Requirements

### Requirement 1

**User Story:** As a therapist, I want to access an appointment creation interface from my dashboard, so that I can proactively schedule sessions with my clients.

#### Acceptance Criteria

1. WHEN the therapist clicks "Manage Schedule" on the dashboard, THE Therapist Dashboard SHALL display a navigation option to create new appointments
2. THE Appointment Scheduler SHALL be accessible via a clearly labeled button or link in the appointments view
3. THE Therapist Dashboard SHALL provide quick access to the appointment creation interface from the Quick Actions section

### Requirement 2

**User Story:** As a therapist, I want to select which client to schedule an appointment for, so that I can organize sessions for specific individuals.

#### Acceptance Criteria

1. THE Appointment Scheduler SHALL display a dropdown list of all clients (children and guardians) assigned to the therapist
2. WHEN the therapist selects a child client, THE Appointment Scheduler SHALL load and display the child's guardian information
3. WHEN the therapist selects a guardian client, THE Appointment Scheduler SHALL proceed without requiring child selection
4. THE Appointment Scheduler SHALL display the selected client's name and relevant details for confirmation
5. THE Appointment Scheduler SHALL prevent selection of clients not assigned to the therapist

### Requirement 3

**User Story:** As a therapist, I want to choose a date and time for the appointment, so that I can schedule sessions according to my availability.

#### Acceptance Criteria

1. THE Appointment Scheduler SHALL provide a date picker that prevents selection of past dates
2. THE Appointment Scheduler SHALL display available time slots for the selected date
3. WHEN the therapist selects a date, THE Appointment System SHALL check for scheduling conflicts
4. THE Appointment Scheduler SHALL indicate which time slots are already booked
5. THE Appointment Scheduler SHALL allow selection of appointment duration (30, 60, 90, or 120 minutes)

### Requirement 4

**User Story:** As a therapist, I want to add notes or session objectives when creating an appointment, so that I can prepare for the session and communicate the purpose to the guardian.

#### Acceptance Criteria

1. THE Appointment Scheduler SHALL provide a text input field for session notes with a 500 character limit
2. THE Appointment Scheduler SHALL display the remaining character count as the therapist types
3. THE Appointment System SHALL store the notes with the appointment record
4. THE Appointment Scheduler SHALL allow the notes field to remain empty if no notes are needed

### Requirement 5

**User Story:** As a therapist, I want the system to automatically notify the client when I create an appointment, so that they are informed of the scheduled session.

#### Acceptance Criteria

1. WHEN the therapist creates an appointment for a child, THE Appointment System SHALL send email notifications to both the child and their guardian
2. WHEN the therapist creates an appointment for a guardian, THE Appointment System SHALL send an email notification to the guardian only
3. THE Appointment System SHALL include the appointment date, time, duration, and any notes in the notification
4. WHEN the therapist creates an appointment for a child, THE Appointment System SHALL create in-app notifications for both the guardian and the child
5. WHEN the therapist creates an appointment for a guardian, THE Appointment System SHALL create an in-app notification for the guardian only

### Requirement 6

**User Story:** As a therapist, I want appointments I create to be automatically confirmed, so that I don't need to approve my own scheduling decisions.

#### Acceptance Criteria

1. WHEN the therapist creates an appointment, THE Appointment System SHALL set the appointment status to "confirmed"
2. THE Appointment System SHALL bypass the approval workflow for therapist-created appointments
3. THE Appointment System SHALL generate a meeting link immediately upon creation
4. THE Appointment System SHALL include the meeting link in all notifications sent to participants

### Requirement 7

**User Story:** As a therapist, I want to see validation errors if I try to create an invalid appointment, so that I can correct issues before submission.

#### Acceptance Criteria

1. WHEN the therapist submits the form with missing required fields, THE Appointment Scheduler SHALL display specific error messages for each missing field
2. WHEN the therapist selects a time slot that conflicts with an existing appointment, THE Appointment System SHALL display a conflict error message
3. THE Appointment Scheduler SHALL prevent form submission until all validation errors are resolved
4. THE Appointment Scheduler SHALL highlight fields with validation errors in red

### Requirement 8

**User Story:** As a therapist, I want to be redirected to my appointments list after successfully creating an appointment, so that I can see the newly created session in context with my schedule.

#### Acceptance Criteria

1. WHEN the appointment is successfully created, THE Appointment System SHALL redirect the therapist to the appointments index page
2. THE Appointment System SHALL display a success message confirming the appointment creation
3. THE Appointment Scheduler SHALL show the newly created appointment at the top of the upcoming appointments list
4. THE Appointment System SHALL clear the form data after successful submission
