<?php

namespace App\Http\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use Exception;

/**
 * Trait for handling connection-related errors consistently across controllers
 */
trait ConnectionErrorHandler
{
    /**
     * Handle connection-related exceptions and return appropriate JSON responses
     */
    protected function handleConnectionError(Exception $e, string $defaultMessage = 'An error occurred'): JsonResponse
    {
        // Handle validation exceptions
        if ($e instanceof ValidationException) {
            return $this->handleValidationError($e);
        }

        // Handle invalid argument exceptions (business logic errors)
        if ($e instanceof InvalidArgumentException) {
            return $this->handleBusinessLogicError($e);
        }

        // Handle general exceptions
        return $this->handleGeneralError($e, $defaultMessage);
    }

    /**
     * Handle validation errors
     */
    protected function handleValidationError(ValidationException $e): JsonResponse
    {
        $errors = $e->errors();
        
        // Check if this is a structured error with error code
        if (isset($errors['error'][0])) {
            $errorData = json_decode($errors['error'][0], true);
            if ($errorData && isset($errorData['code'])) {
                return response()->json([
                    'success' => false,
                    'error' => $errorData
                ], 422);
            }
        }

        // Standard validation error response
        return response()->json([
            'success' => false,
            'error' => [
                'code' => 'VALIDATION_FAILED',
                'message' => 'The provided data is invalid.',
                'details' => $errors
            ]
        ], 422);
    }

    /**
     * Handle business logic errors (InvalidArgumentException)
     */
    protected function handleBusinessLogicError(InvalidArgumentException $e): JsonResponse
    {
        $message = $e->getMessage();
        $code = $this->getErrorCodeFromMessage($message);
        
        return response()->json([
            'success' => false,
            'error' => [
                'code' => $code,
                'message' => $message,
            ]
        ], 400);
    }

    /**
     * Handle general errors
     */
    protected function handleGeneralError(Exception $e, string $defaultMessage): JsonResponse
    {
        // Log the error for debugging
        logger()->error('Connection management error', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'error' => [
                'code' => 'INTERNAL_ERROR',
                'message' => config('app.debug') ? $e->getMessage() : $defaultMessage,
            ]
        ], 500);
    }

    /**
     * Get error code based on error message patterns
     */
    protected function getErrorCodeFromMessage(string $message): string
    {
        $patterns = [
            'already exists' => 'CONNECTION_ALREADY_EXISTS',
            'not found' => 'REQUEST_NOT_FOUND',
            'already processed' => 'REQUEST_ALREADY_PROCESSED',
            'invalid role' => 'INVALID_USER_ROLE',
            'not authorized' => 'INSUFFICIENT_PERMISSIONS',
            'does not belong' => 'GUARDIAN_CHILD_MISMATCH',
            'not connected' => 'GUARDIAN_NOT_CONNECTED',
            'invalid client type' => 'INVALID_CLIENT_TYPE',
        ];

        foreach ($patterns as $pattern => $code) {
            if (str_contains(strtolower($message), $pattern)) {
                return $code;
            }
        }

        return 'BUSINESS_LOGIC_ERROR';
    }

    /**
     * Return success response with consistent format
     */
    protected function successResponse(string $message, array $data = [], int $status = 200): JsonResponse
    {
        $response = [
            'success' => true,
            'message' => $message,
        ];

        if (!empty($data)) {
            $response['data'] = $data;
        }

        return response()->json($response, $status);
    }

    /**
     * Return error response with consistent format
     */
    protected function errorResponse(string $code, string $message, array $details = [], int $status = 400): JsonResponse
    {
        $response = [
            'success' => false,
            'error' => [
                'code' => $code,
                'message' => $message,
            ]
        ];

        if (!empty($details)) {
            $response['error']['details'] = $details;
        }

        return response()->json($response, $status);
    }

    /**
     * Handle authorization errors
     */
    protected function handleAuthorizationError(string $message = 'Access denied'): JsonResponse
    {
        return $this->errorResponse(
            'INSUFFICIENT_PERMISSIONS',
            $message,
            [],
            403
        );
    }

    /**
     * Handle not found errors
     */
    protected function handleNotFoundError(string $resource = 'Resource'): JsonResponse
    {
        return $this->errorResponse(
            'NOT_FOUND',
            "{$resource} not found.",
            [],
            404
        );
    }

    /**
     * Handle rate limiting errors
     */
    protected function handleRateLimitError(): JsonResponse
    {
        return $this->errorResponse(
            'RATE_LIMIT_EXCEEDED',
            'Too many requests. Please try again later.',
            [],
            429
        );
    }

    /**
     * Validate request ownership (for requests that belong to specific users)
     */
    protected function validateRequestOwnership($request, int $userId, string $userField = 'requester_id'): bool
    {
        return $request && $request->{$userField} === $userId;
    }

    /**
     * Validate connection ownership (for connections that belong to specific users)
     */
    protected function validateConnectionOwnership($connection, int $userId, array $allowedFields = ['therapist_id', 'client_id']): bool
    {
        if (!$connection) {
            return false;
        }

        foreach ($allowedFields as $field) {
            if ($connection->{$field} === $userId) {
                return true;
            }
        }

        return false;
    }

    /**
     * Handle permission validation for connection operations
     */
    protected function validateConnectionPermission($connection, int $userId, string $operation = 'view'): JsonResponse|bool
    {
        if (!$connection) {
            return $this->handleNotFoundError('Connection');
        }

        // Check if user has access to this connection
        $hasAccess = $this->validateConnectionOwnership($connection, $userId);
        
        if (!$hasAccess) {
            return $this->handleAuthorizationError('You do not have access to this connection.');
        }

        return true;
    }

    /**
     * Handle request permission validation
     */
    protected function validateRequestPermission($request, int $userId, string $operation = 'view'): JsonResponse|bool
    {
        if (!$request) {
            return $this->handleNotFoundError('Request');
        }

        // For most operations, check if user is the requester or target therapist
        $hasAccess = $this->validateRequestOwnership($request, $userId, 'requester_id') ||
                    $this->validateRequestOwnership($request, $userId, 'target_therapist_id');
        
        if (!$hasAccess) {
            return $this->handleAuthorizationError('You do not have access to this request.');
        }

        return true;
    }
}