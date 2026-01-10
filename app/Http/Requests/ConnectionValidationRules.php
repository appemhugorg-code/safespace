<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\User;

/**
 * Base validation rules for connection-related requests
 */
abstract class ConnectionValidationRules extends FormRequest
{
    /**
     * Common validation rules for therapist ID
     */
    protected function therapistIdRules(): array
    {
        return [
            'required',
            'integer',
            'exists:users,id',
            function ($attribute, $value, $fail) {
                $user = User::find($value);
                if (!$user || !$user->hasRole('therapist')) {
                    $fail('The selected user is not a therapist.');
                }
                if ($user->status !== 'active') {
                    $fail('The selected therapist is not active.');
                }
            },
        ];
    }

    /**
     * Common validation rules for client ID
     */
    protected function clientIdRules(): array
    {
        return [
            'required',
            'integer',
            'exists:users,id',
            function ($attribute, $value, $fail) {
                $user = User::find($value);
                if (!$user || (!$user->hasRole('guardian') && !$user->hasRole('child'))) {
                    $fail('The selected user is not a valid client (guardian or child).');
                }
                if ($user->status !== 'active') {
                    $fail('The selected client is not active.');
                }
            },
        ];
    }

    /**
     * Common validation rules for child ID with guardian ownership check
     */
    protected function childIdRules(int $guardianId): array
    {
        return [
            'required',
            'integer',
            'exists:users,id',
            function ($attribute, $value, $fail) use ($guardianId) {
                $child = User::find($value);
                if (!$child || !$child->hasRole('child')) {
                    $fail('The selected user is not a child.');
                }
                if ($child->status !== 'active') {
                    $fail('The selected child is not active.');
                }
                if ($child->guardian_id !== $guardianId) {
                    $fail('You can only assign your own children.');
                }
            },
        ];
    }

    /**
     * Common validation rules for connection request message
     */
    protected function messageRules(): array
    {
        return [
            'nullable',
            'string',
            'max:1000',
            'min:10',
        ];
    }

    /**
     * Common validation rules for connection ID with ownership check
     */
    protected function connectionIdRules(int $userId, array $allowedRoles = ['therapist', 'client']): array
    {
        return [
            'required',
            'integer',
            'exists:therapist_client_connections,id',
            function ($attribute, $value, $fail) use ($userId, $allowedRoles) {
                $connection = \App\Models\TherapistClientConnection::find($value);
                if (!$connection) {
                    $fail('Connection not found.');
                    return;
                }

                $hasAccess = false;
                if (in_array('therapist', $allowedRoles) && $connection->therapist_id === $userId) {
                    $hasAccess = true;
                }
                if (in_array('client', $allowedRoles) && $connection->client_id === $userId) {
                    $hasAccess = true;
                }

                if (!$hasAccess) {
                    $fail('You do not have access to this connection.');
                }

                if ($connection->status !== 'active') {
                    $fail('This connection is not active.');
                }
            },
        ];
    }

    /**
     * Common validation rules for request ID with ownership check
     */
    protected function requestIdRules(int $userId, array $allowedRoles = ['requester', 'target_therapist']): array
    {
        return [
            'required',
            'integer',
            'exists:connection_requests,id',
            function ($attribute, $value, $fail) use ($userId, $allowedRoles) {
                $request = \App\Models\ConnectionRequest::find($value);
                if (!$request) {
                    $fail('Request not found.');
                    return;
                }

                $hasAccess = false;
                if (in_array('requester', $allowedRoles) && $request->requester_id === $userId) {
                    $hasAccess = true;
                }
                if (in_array('target_therapist', $allowedRoles) && $request->target_therapist_id === $userId) {
                    $hasAccess = true;
                }

                if (!$hasAccess) {
                    $fail('You do not have access to this request.');
                }

                if ($request->status !== 'pending') {
                    $fail('This request has already been processed.');
                }
            },
        ];
    }

    /**
     * Get custom error messages
     */
    public function messages(): array
    {
        return [
            'therapist_id.required' => 'A therapist must be selected.',
            'therapist_id.integer' => 'Invalid therapist ID format.',
            'therapist_id.exists' => 'The selected therapist does not exist.',
            'client_id.required' => 'A client must be selected.',
            'client_id.integer' => 'Invalid client ID format.',
            'client_id.exists' => 'The selected client does not exist.',
            'child_id.required' => 'A child must be selected.',
            'child_id.integer' => 'Invalid child ID format.',
            'child_id.exists' => 'The selected child does not exist.',
            'message.string' => 'The message must be text.',
            'message.max' => 'The message cannot exceed 1000 characters.',
            'message.min' => 'The message must be at least 10 characters long.',
        ];
    }

    /**
     * Get custom attribute names
     */
    public function attributes(): array
    {
        return [
            'therapist_id' => 'therapist',
            'client_id' => 'client',
            'child_id' => 'child',
            'message' => 'message',
        ];
    }
}