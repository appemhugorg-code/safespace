<?php

namespace App\Http\Requests;

use App\Services\ConnectionManagementService;
use App\Services\ConnectionRequestService;
use App\Models\User;

/**
 * Validation for guardian connection requests
 */
class CreateConnectionRequestRequest extends ConnectionValidationRules
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
        return [
            'therapist_id' => $this->therapistIdRules(),
            'message' => $this->messageRules(),
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if (!$validator->errors()->has('therapist_id')) {
                $guardianId = $this->user()->id;
                $therapistId = $this->therapist_id;

                // Check for existing active connection
                $connectionService = app(ConnectionManagementService::class);
                if ($connectionService->hasActiveConnection($guardianId, $therapistId)) {
                    $validator->errors()->add('therapist_id', json_encode([
                        'code' => 'CONNECTION_ALREADY_EXISTS',
                        'message' => 'You already have an active connection with this therapist.',
                        'details' => [
                            'therapist_id' => $therapistId,
                            'guardian_id' => $guardianId,
                        ]
                    ]));
                    return;
                }

                // Check for existing pending request
                $requestService = app(ConnectionRequestService::class);
                if ($requestService->hasPendingRequest($guardianId, $therapistId)) {
                    $validator->errors()->add('therapist_id', json_encode([
                        'code' => 'REQUEST_ALREADY_EXISTS',
                        'message' => 'You already have a pending request with this therapist.',
                        'details' => [
                            'therapist_id' => $therapistId,
                            'guardian_id' => $guardianId,
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
            'therapist_id.unique_connection' => 'You already have a connection or pending request with this therapist.',
        ]);
    }
}