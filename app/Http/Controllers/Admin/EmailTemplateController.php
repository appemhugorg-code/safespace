<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class EmailTemplateController extends Controller
{
    /**
     * Display a listing of email templates.
     */
    public function index(Request $request): JsonResponse
    {
        $query = EmailTemplate::query();

        // Filter by active status
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        // Search by name or subject
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        $templates = $query->orderBy('name')->paginate(20);

        return response()->json($templates);
    }

    /**
     * Store a newly created email template.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:email_templates,name',
            'subject' => 'required|string|max:255',
            'body_html' => 'required|string',
            'body_text' => 'nullable|string',
            'variables' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $template = EmailTemplate::create($validated);

        return response()->json([
            'message' => 'Email template created successfully',
            'template' => $template,
        ], 201);
    }

    /**
     * Display the specified email template.
     */
    public function show(EmailTemplate $emailTemplate): JsonResponse
    {
        return response()->json($emailTemplate);
    }

    /**
     * Update the specified email template.
     */
    public function update(Request $request, EmailTemplate $emailTemplate): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('email_templates')->ignore($emailTemplate->id)],
            'subject' => 'required|string|max:255',
            'body_html' => 'required|string',
            'body_text' => 'nullable|string',
            'variables' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $emailTemplate->update($validated);

        return response()->json([
            'message' => 'Email template updated successfully',
            'template' => $emailTemplate,
        ]);
    }

    /**
     * Remove the specified email template.
     */
    public function destroy(EmailTemplate $emailTemplate): JsonResponse
    {
        // Don't allow deletion of system templates
        $systemTemplates = [
            'welcome_email',
            'account_verification',
            'password_reset',
            'appointment_confirmation',
            'appointment_reminder_24h',
            'appointment_reminder_1h',
            'panic_alert_notification',
        ];

        if (in_array($emailTemplate->name, $systemTemplates)) {
            return response()->json([
                'message' => 'System email templates cannot be deleted',
            ], 403);
        }

        $emailTemplate->delete();

        return response()->json([
            'message' => 'Email template deleted successfully',
        ]);
    }

    /**
     * Preview email template with sample variables.
     */
    public function preview(EmailTemplate $emailTemplate): JsonResponse
    {
        $sampleVariables = [
            'user_name' => 'John Doe',
            'platform_url' => config('app.url'),
            'verification_url' => config('app.url') . '/verify',
            'reset_url' => config('app.url') . '/reset',
            'appointment_date' => 'December 15, 2024',
            'appointment_time' => '2:00 PM',
            'therapist_name' => 'Dr. Sarah Johnson',
            'client_name' => 'John Doe',
            'duration' => '60 minutes',
            'meet_link' => 'https://meet.google.com/sample-link',
            'child_name' => 'Emma Doe',
            'alert_time' => 'December 15, 2024 3:30 PM',
            'alert_message' => 'I need help right now',
            'alert_url' => config('app.url') . '/panic-alerts/1',
        ];

        $compiled = $emailTemplate->compile($sampleVariables);

        return response()->json([
            'preview' => $compiled,
            'sample_variables' => $sampleVariables,
        ]);
    }
}
