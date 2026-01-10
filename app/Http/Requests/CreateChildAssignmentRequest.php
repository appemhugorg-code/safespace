<?php

namespace App\Http\Requests;

use App\Services\ConnectionManagementService;
use App\Services\ConnectionRequestService;

/**
 * Validation for child assignment requests
 */
class CreateChildAssignmentRequest extends ConnectionValidationRules
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole('guardian');
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $guardianId = $this->user()->id;
        
        return [
            'child_id' => $this->childIdRules($guardianId),
            'therapist_id' => $this->therapistIdRules(),
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if (!$validator->errors()->has('child_id') && !$validator->errors()->has('therapist_id')) {
                $guardianId = $this->user()->id;
                $childId = $this->child_id;
                $therapistId = $this->therapist_id;

                $connectionService = app(ConnectionManagementService::class);

                // Check if guardian is connected to therapist
                if (!$connectionService->hasActiveConnection($guardianId, $therapistId)) {
                    $validator->errors()->add('therapist_id', json_encode([
                        'code' => 'GUARDIAN_NOT_CONNECTED',
                        'message' => 'You must be connected to the therapist before assigning your child.',
                        'details' => [
                            'therapist_id' => $therapistId,
                            'guardian_id' => $guardianId,
                        ]
                    ]));
                    return;
                }

                // Check for existing active connection between child and therapist
                if ($connectionService->hasActiveConnection($childId, $therapistId)) {
                    $validator->errors()->add('child_id', json_encode([
                        'code' => 'CONNECTION_ALREADY_EXISTS',
                        'message' => 'Your child already has an active connection with this therapist.',
                        'details' => [
                            'child_id' => $childId,
                            'therapist_id' => $therapistId,
                        ]
                    ]));
                    return;
                }

                // Check for existing pending request
                $requestService = app(ConnectionRequestService::class);
                if ($requestService->hasPendingChildAssignment($guardianId, $childId, $therapistId)) {
                    $validator->errors()->add('child_id', json_encode([
                        'code' => 'REQUEST_ALREADY_EXISTS',
                        'message' => 'You already have a pending assignment request for this child with this therapist.',
                        'details' => [
                            'child_id' => $childId,
                            'therapist_id' => $therapistId,
                        ]
                    ]));
                }
            }
        });
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return array_merge(parent::messages(), [
            'child_id.guardian_ownership' => 'You can only assign your own children.',
            'therapist_id.guardian_connection' => 'You must be connected to the therapist first.',
        ]);
    }
}