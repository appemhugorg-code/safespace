<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\User;
use Exception;
use Google_Client;
use Google_Service_Calendar;
use Google_Service_Calendar_ConferenceData;
use Google_Service_Calendar_ConferenceSolutionKey;
use Google_Service_Calendar_CreateConferenceRequest;
use Google_Service_Calendar_Event;
use Google_Service_Calendar_EventAttendee;
use Google_Service_Calendar_EventDateTime;
use Illuminate\Support\Facades\Log;

class GoogleCalendarService
{
    private Google_Client $client;

    private Google_Service_Calendar $service;

    public function __construct()
    {
        $this->client = new Google_Client;
        $this->configureClient();
        $this->service = new Google_Service_Calendar($this->client);
    }

    /**
     * Configure the Google Client with credentials.
     */
    private function configureClient(): void
    {
        $this->client->setApplicationName(config('app.name'));
        $this->client->setScopes([
            Google_Service_Calendar::CALENDAR,
            Google_Service_Calendar::CALENDAR_EVENTS,
        ]);

        $this->client->setClientId(config('services.google.client_id'));
        $this->client->setClientSecret(config('services.google.client_secret'));
        $this->client->setRedirectUri(config('services.google.redirect'));

        $this->client->setAccessType('offline');
        $this->client->setPrompt('select_account consent');
    }

    /**
     * Create a calendar event for an appointment.
     */
    public function createEvent(Appointment $appointment): ?array
    {
        try {
            $event = new Google_Service_Calendar_Event([
                'summary' => $this->getEventSummary($appointment),
                'description' => $this->getEventDescription($appointment),
                'start' => new Google_Service_Calendar_EventDateTime([
                    'dateTime' => $appointment->scheduled_at->toRfc3339String(),
                    'timeZone' => config('app.timezone'),
                ]),
                'end' => new Google_Service_Calendar_EventDateTime([
                    'dateTime' => $appointment->scheduled_at->addMinutes($appointment->duration_minutes)->toRfc3339String(),
                    'timeZone' => config('app.timezone'),
                ]),
                'attendees' => $this->getAttendees($appointment),
                'conferenceData' => $this->createConferenceData(),
                'reminders' => [
                    'useDefault' => false,
                    'overrides' => [
                        ['method' => 'email', 'minutes' => 24 * 60], // 24 hours
                        ['method' => 'popup', 'minutes' => 60], // 1 hour
                    ],
                ],
            ]);

            $calendarId = 'primary';
            $createdEvent = $this->service->events->insert(
                $calendarId,
                $event,
                ['conferenceDataVersion' => 1]
            );

            return [
                'event_id' => $createdEvent->getId(),
                'meet_link' => $createdEvent->getHangoutLink(),
                'html_link' => $createdEvent->getHtmlLink(),
                'event_data' => $createdEvent->toSimpleObject(),
            ];

        } catch (Exception $e) {
            Log::error('Failed to create Google Calendar event', [
                'appointment_id' => $appointment->id,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Update an existing calendar event.
     */
    public function updateEvent(Appointment $appointment): ?array
    {
        if (! $appointment->google_event_id) {
            return $this->createEvent($appointment);
        }

        try {
            $event = $this->service->events->get('primary', $appointment->google_event_id);

            $event->setSummary($this->getEventSummary($appointment));
            $event->setDescription($this->getEventDescription($appointment));

            $event->setStart(new Google_Service_Calendar_EventDateTime([
                'dateTime' => $appointment->scheduled_at->toRfc3339String(),
                'timeZone' => config('app.timezone'),
            ]));

            $event->setEnd(new Google_Service_Calendar_EventDateTime([
                'dateTime' => $appointment->scheduled_at->addMinutes($appointment->duration_minutes)->toRfc3339String(),
                'timeZone' => config('app.timezone'),
            ]));

            $updatedEvent = $this->service->events->update('primary', $appointment->google_event_id, $event);

            return [
                'event_id' => $updatedEvent->getId(),
                'meet_link' => $updatedEvent->getHangoutLink(),
                'html_link' => $updatedEvent->getHtmlLink(),
                'event_data' => $updatedEvent->toSimpleObject(),
            ];

        } catch (Exception $e) {
            Log::error('Failed to update Google Calendar event', [
                'appointment_id' => $appointment->id,
                'event_id' => $appointment->google_event_id,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Delete a calendar event.
     */
    public function deleteEvent(string $eventId): bool
    {
        try {
            $this->service->events->delete('primary', $eventId);

            return true;
        } catch (Exception $e) {
            Log::error('Failed to delete Google Calendar event', [
                'event_id' => $eventId,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Get event summary for appointment.
     */
    private function getEventSummary(Appointment $appointment): string
    {
        return "SafeSpace Therapy Session - {$appointment->child->name}";
    }

    /**
     * Get event description for appointment.
     */
    private function getEventDescription(Appointment $appointment): string
    {
        $description = "Therapy session on SafeSpace platform\n\n";
        $description .= "Therapist: {$appointment->therapist->name}\n";
        $description .= "Client: {$appointment->child->name}\n";

        if ($appointment->guardian) {
            $description .= "Guardian: {$appointment->guardian->name}\n";
        }

        if ($appointment->notes) {
            $description .= "\nNotes: {$appointment->notes}";
        }

        return $description;
    }

    /**
     * Get attendees for the event.
     */
    private function getAttendees(Appointment $appointment): array
    {
        $attendees = [
            new Google_Service_Calendar_EventAttendee([
                'email' => $appointment->therapist->email,
                'displayName' => $appointment->therapist->name,
            ]),
            new Google_Service_Calendar_EventAttendee([
                'email' => $appointment->child->email,
                'displayName' => $appointment->child->name,
            ]),
        ];

        if ($appointment->guardian) {
            $attendees[] = new Google_Service_Calendar_EventAttendee([
                'email' => $appointment->guardian->email,
                'displayName' => $appointment->guardian->name,
            ]);
        }

        return $attendees;
    }

    /**
     * Create conference data for Google Meet.
     */
    private function createConferenceData(): Google_Service_Calendar_ConferenceData
    {
        $conferenceRequest = new Google_Service_Calendar_CreateConferenceRequest;
        $conferenceRequest->setRequestId(uniqid());

        $conferenceSolution = new Google_Service_Calendar_ConferenceSolutionKey;
        $conferenceSolution->setType('hangoutsMeet');
        $conferenceRequest->setConferenceSolutionKey($conferenceSolution);

        $conferenceData = new Google_Service_Calendar_ConferenceData;
        $conferenceData->setCreateRequest($conferenceRequest);

        return $conferenceData;
    }

    /**
     * Set access token for authenticated user.
     */
    public function setAccessToken(string $token): void
    {
        $this->client->setAccessToken($token);
    }

    /**
     * Get authorization URL for OAuth flow.
     */
    public function getAuthorizationUrl(): string
    {
        return $this->client->createAuthUrl();
    }

    /**
     * Exchange authorization code for access token.
     */
    public function authenticate(string $code): array
    {
        $token = $this->client->fetchAccessTokenWithAuthCode($code);

        if (isset($token['error'])) {
            throw new Exception('Failed to authenticate: '.$token['error']);
        }

        return $token;
    }
}
