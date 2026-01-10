<?php

namespace App\Console\Commands;

use App\Models\Appointment;
use App\Services\EmailNotificationService;
use Illuminate\Console\Command;

class SendAppointmentReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'appointments:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send appointment reminder emails (24h and 1h before appointments)';

    private EmailNotificationService $emailService;

    public function __construct(EmailNotificationService $emailService)
    {
        parent::__construct();
        $this->emailService = $emailService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for appointments that need reminders...');

        // Send 24-hour reminders
        $this->send24HourReminders();

        // Send 1-hour reminders
        $this->send1HourReminders();

        $this->info('Appointment reminders sent successfully!');

        return 0;
    }

    /**
     * Send 24-hour reminders.
     */
    private function send24HourReminders(): void
    {
        $targetTime = now()->addHours(24);

        $appointments = Appointment::whereIn('status', ['confirmed', 'requested'])
            ->whereBetween('scheduled_at', [
                $targetTime->copy()->subMinutes(30),
                $targetTime->copy()->addMinutes(30),
            ])
            ->whereDoesntHave('reminders', function ($query) {
                $query->where('type', '24h');
            })
            ->with(['therapist', 'child', 'guardian'])
            ->get();

        foreach ($appointments as $appointment) {
            $this->emailService->sendAppointmentReminder($appointment, '24h');
            $this->line("  ✓ Sent 24h reminder for appointment #{$appointment->id}");
        }

        $this->info("Sent {$appointments->count()} 24-hour reminders");
    }

    /**
     * Send 1-hour reminders.
     */
    private function send1HourReminders(): void
    {
        $targetTime = now()->addHour();

        $appointments = Appointment::whereIn('status', ['confirmed', 'requested'])
            ->whereBetween('scheduled_at', [
                $targetTime->copy()->subMinutes(10),
                $targetTime->copy()->addMinutes(10),
            ])
            ->whereDoesntHave('reminders', function ($query) {
                $query->where('type', '1h');
            })
            ->with(['therapist', 'child', 'guardian'])
            ->get();

        foreach ($appointments as $appointment) {
            $this->emailService->sendAppointmentReminder($appointment, '1h');
            $this->line("  ✓ Sent 1h reminder for appointment #{$appointment->id}");
        }

        $this->info("Sent {$appointments->count()} 1-hour reminders");
    }
}
