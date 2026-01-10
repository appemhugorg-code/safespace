<?php

namespace App\Http\Requests;

use App\Services\ConnectionManagementService;
use App\Models\User;

/**
 * Validation for admin connection creation
 */
class CreateAdminConnectionRequest extends ConnectionValidationRules
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole('admin');
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'therapist_id' => $this->therapistIdRules(),
            'client_id' => $this->adminClientIdRules(), // Use admin-specific client validation
        ];
    }

    /**
     * Admin-specific validation rules for client ID (guardians only)
     */
    protected function adminClientIdRules(): array
    {
        return [
            'required',
            'integer',
            'exists:users,id',
            function ($attribute, $value, $fail) {
                $user = User::find($value);
                if (!$user || !$user->hasRole('guardian')) {
                    $fail('Admins can only create connections with guardians. Guardians are responsible for assigning their children.');
                }
                if ($user->status !== 'active') {
                    $fail('The selected guardian is not active.');
                }
            },
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Check for existing active connection
            if (!$validator->errors()->has('therapist_id') && !$validator->errors()->has('client_id')) {
                $connectionService = app(ConnectionManagementService::class);
                
                if ($connectionService->hasActiveConnection($this->client_id, $this->therapist_id)) {
                    $validator->errors()->add('general', json_encode([
                        'code' => 'CONNECTION_ALREADY_EXISTS',
                        'message' => 'An active connection already exists between this therapist and client.',
                        'details' => [
                            'therapist_id' => $this->therapist_id,
                            'client_id' => $this->client_id,
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
            'general' => 'Connection validation failed.',
        ]);
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator): void
    {
        $response = response()->json([
            'success' => false,
            'error' => [
                'code' => 'VALIDATION_FAILED',
                'message' => 'The provided data is invalid.',
                'details' => [
                    'validation_errors' => $validator->errors()->toArray()
                ]
            ]
        ], 422);

        throw new \Illuminate\Validation\ValidationException($validator, $response);
    }
}