<?php

namespace App\Services;

use App\Models\Appointment;
use Illuminate\Support\Facades\Log;

class GoogleMeetService
{
    private GoogleCalendarService $calendarService;

    public function __construct(GoogleCalendarService $calendarService)
    {
        $this->calendarService = $calendarService;
    }

    /**
     * Create a therapy session with Google Meet integration.
     * Uses platform's Google account, not therapist's personal account.
     */
    public function createTherapySession(Appointment $appointment): bool
    {
        try {
            // Use platform's Google account (from .env)
            // This allows creating meetings even if therapist doesn't have Google
            $platformToken = $this->getPlatformGoogleToken();
            
            if (!$platformToken) {
                Log::warning('Platform Google token not configured', [
                    'appointment_id' => $appointment->id,
                ]);
                return false;
            }
            
            $this->calendarService->setAccessToken($platformToken);
            
            $eventData = $this->calendarService->createEvent($appointment);

            if (! $eventData) {
                return false;
            }

            // Update appointment with Google integration data
            $appointment->update([
                'google_event_id' => $eventData['event_id'],
                'google_meet_link' => $eventData['meet_link'],
                'google_calendar_data' => $eventData['event_data'],
                'meeting_link' => $eventData['meet_link'],
            ]);

            Log::info('Google Meet session created', [
                'appointment_id' => $appointment->id,
                'event_id' => $eventData['event_id'],
                'meet_link' => $eventData['meet_link'],
            ]);

            return true;

        } catch (\Exception $e) {
            Log::error('Failed to create Google Meet session', [
                'appointment_id' => $appointment->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Get platform's Google access token.
     * This is a centralized account for creating all meetings.
     */
    private function getPlatformGoogleToken(): ?string
    {
        $token = config('services.google.platform_token');
        
        if (!$token) {
            // Try to get from admin user or platform settings
            $adminUser = \App\Models\User::where('email', config('services.google.platform_email'))
                ->first();
            
            if ($adminUser && $adminUser->google_access_token) {
                return decrypt($adminUser->google_access_token);
            }
        }
        
        return $token;
    }

    /**
     * Update an existing therapy session.
     */
    public function updateTherapySession(Appointment $appointment): bool
    {
        try {
            $eventData = $this->calendarService->updateEvent($appointment);

            if (! $eventData) {
                return false;
            }

            // Update appointment with new data
            $appointment->update([
                'google_event_id' => $eventData['event_id'],
                'google_meet_link' => $eventData['meet_link'],
                'google_calendar_data' => $eventData['event_data'],
                'meeting_link' => $eventData['meet_link'],
            ]);

            Log::info('Google Meet session updated', [
                'appointment_id' => $appointment->id,
                'event_id' => $eventData['event_id'],
            ]);

            return true;

        } catch (\Exception $e) {
            Log::error('Failed to update Google Meet session', [
                'appointment_id' => $appointment->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Cancel a therapy session and remove Google Meet link.
     */
    public function cancelTherapySession(Appointment $appointment): bool
    {
        if (! $appointment->google_event_id) {
            return true; // Nothing to cancel
        }

        try {
            $deleted = $this->calendarService->deleteEvent($appointment->google_event_id);

            if ($deleted) {
                // Clear Google integration data
                $appointment->update([
                    'google_event_id' => null,
                    'google_meet_link' => null,
                    'google_calendar_data' => null,
                ]);

                Log::info('Google Meet session cancelled', [
                    'appointment_id' => $appointment->id,
                ]);
            }

            return $deleted;

        } catch (\Exception $e) {
            Log::error('Failed to cancel Google Meet session', [
                'appointment_id' => $appointment->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Get the meeting link for an appointment.
     */
    public function getMeetingLink(Appointment $appointment): ?string
    {
        return $appointment->google_meet_link ?? $appointment->meeting_link;
    }

    /**
     * Check if appointment has a valid Google Meet link.
     */
    public function hasValidMeetLink(Appointment $appointment): bool
    {
        return ! empty($appointment->google_meet_link) && ! empty($appointment->google_event_id);
    }
}
