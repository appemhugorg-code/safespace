<?php

namespace App\Console\Commands;

use App\Models\Appointment;
use App\Models\EmailTemplate;
use Illuminate\Console\Command;

class ShowAppointmentEmail extends Command
{
    protected $signature = 'show:appointment-email {appointment_id}';
    protected $description = 'Show the email content for an appointment';

    public function handle()
    {
        $appointmentId = $this->argument('appointment_id');
        $appointment = Appointment::with(['child', 'therapist', 'guardian'])->find($appointmentId);
        
        if (!$appointment) {
            $this->error("Appointment not found!");
            return 1;
        }
        
        $template = EmailTemplate::findByName('appointment_confirmation');
        
        if (!$template) {
            $this->error("Email template not found!");
            return 1;
        }
        
        $clientName = $appointment->child ? $appointment->child->name : ($appointment->guardian ? $appointment->guardian->name : 'Client');
        
        $variables = [
            'user_name' => $appointment->child->name,
            'appointment_date' => $appointment->scheduled_at->format('F j, Y'),
            'appointment_time' => $appointment->scheduled_at->format('g:i A'),
            'therapist_name' => $appointment->therapist->name ?? 'Therapist',
            'client_name' => $clientName,
            'duration' => $appointment->duration_minutes.' minutes',
            'meet_link' => $appointment->google_meet_link ?? $appointment->meeting_link ?? 'Will be provided closer to appointment time',
            'platform_url' => config('app.url'),
        ];
        
        $compiled = $template->compile($variables);
        
        $this->info("=== EMAIL PREVIEW ===");
        $this->newLine();
        $this->info("To: {$appointment->child->email}");
        $this->info("Subject: {$compiled['subject']}");
        $this->newLine();
        $this->line("--- TEXT VERSION ---");
        $this->line($compiled['body_text']);
        $this->newLine();
        $this->line("--- HTML VERSION (raw) ---");
        $this->line($compiled['body_html']);
        
        return 0;
    }
}
