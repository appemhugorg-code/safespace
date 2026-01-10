<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

/**
 * Standardized API response formatter for connection management endpoints
 */
class ApiResponseFormatter
{
    /**
     * Format a successful response
     */
    public static function success(
        string $message = 'Operation completed successfully',
        array|Collection $data = [],
        int $statusCode = 200,
        array $meta = []
    ): JsonResponse {
        $response = [
            'success' => true,
            'message' => $message,
        ];

        if (!empty($data)) {
            $response['data'] = $data;
        }

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Format an error response
     */
    public static function error(
        string $code,
        string $message,
        array $details = [],
        int $statusCode = 400,
        array $meta = []
    ): JsonResponse {
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

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Format a paginated response
     */
    public static function paginated(
        LengthAwarePaginator $paginator,
        string $message = 'Data retrieved successfully',
        array $meta = []
    ): JsonResponse {
        $response = [
            'success' => true,
            'message' => $message,
            'data' => [
                'items' => $paginator->items(),
                'pagination' => [
                    'current_page' => $paginator->currentPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'last_page' => $paginator->lastPage(),
                    'from' => $paginator->firstItem(),
                    'to' => $paginator->lastItem(),
                    'has_more_pages' => $paginator->hasMorePages(),
                    'links' => [
                        'first' => $paginator->url(1),
                        'last' => $paginator->url($paginator->lastPage()),
                        'prev' => $paginator->previousPageUrl(),
                        'next' => $paginator->nextPageUrl(),
                    ],
                ],
            ],
        ];

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response);
    }

    /**
     * Format a validation error response
     */
    public static function validationError(
        array $errors,
        string $message = 'The provided data is invalid'
    ): JsonResponse {
        return self::error(
            'VALIDATION_FAILED',
            $message,
            ['validation_errors' => $errors],
            422
        );
    }

    /**
     * Format an authorization error response
     */
    public static function unauthorized(
        string $message = 'Authentication required'
    ): JsonResponse {
        return self::error(
            'UNAUTHORIZED',
            $message,
            [],
            401
        );
    }

    /**
     * Format a forbidden error response
     */
    public static function forbidden(
        string $message = 'Access denied'
    ): JsonResponse {
        return self::error(
            'FORBIDDEN',
            $message,
            [],
            403
        );
    }

    /**
     * Format a not found error response
     */
    public static function notFound(
        string $resource = 'Resource',
        string $message = null
    ): JsonResponse {
        $message = $message ?? "{$resource} not found";
        
        return self::error(
            'NOT_FOUND',
            $message,
            [],
            404
        );
    }

    /**
     * Format a server error response
     */
    public static function serverError(
        string $message = 'An internal server error occurred',
        array $details = []
    ): JsonResponse {
        // In production, don't expose internal error details
        if (!config('app.debug')) {
            $details = [];
        }

        return self::error(
            'INTERNAL_ERROR',
            $message,
            $details,
            500
        );
    }

    /**
     * Format a rate limit error response
     */
    public static function rateLimitExceeded(
        int $retryAfter,
        int $limit,
        int $windowMinutes
    ): JsonResponse {
        return self::error(
            'RATE_LIMIT_EXCEEDED',
            'Too many requests. Please try again later.',
            [
                'retry_after' => $retryAfter,
                'limit' => $limit,
                'window_minutes' => $windowMinutes,
            ],
            429
        );
    }

    /**
     * Format a connection-specific error response
     */
    public static function connectionError(
        string $code,
        string $message,
        array $connectionDetails = []
    ): JsonResponse {
        return self::error(
            $code,
            $message,
            $connectionDetails,
            400
        );
    }

    /**
     * Format a webhook response
     */
    public static function webhook(
        string $event,
        array $data,
        string $timestamp = null
    ): array {
        return [
            'event' => $event,
            'timestamp' => $timestamp ?? now()->toISOString(),
            'data' => $data,
        ];
    }

    /**
     * Add standard headers to response
     */
    public static function withStandardHeaders(JsonResponse $response): JsonResponse
    {
        return $response->withHeaders([
            'X-API-Version' => '1.0',
            'X-Content-Type-Options' => 'nosniff',
            'X-Frame-Options' => 'DENY',
            'X-XSS-Protection' => '1; mode=block',
        ]);
    }

    /**
     * Format connection data for API responses
     */
    public static function formatConnection($connection): array
    {
        return [
            'id' => $connection->id,
            'therapist' => [
                'id' => $connection->therapist->id,
                'name' => $connection->therapist->name,
                'email' => $connection->therapist->email,
            ],
            'client' => [
                'id' => $connection->client->id,
                'name' => $connection->client->name,
                'email' => $connection->client->email,
                'type' => $connection->client_type,
            ],
            'connection_type' => $connection->connection_type,
            'status' => $connection->status,
            'assigned_at' => $connection->assigned_at,
            'terminated_at' => $connection->terminated_at,
            'assigned_by' => $connection->assignedBy ? [
                'id' => $connection->assignedBy->id,
                'name' => $connection->assignedBy->name,
            ] : null,
        ];
    }

    /**
     * Format connection request data for API responses
     */
    public static function formatConnectionRequest($request): array
    {
        return [
            'id' => $request->id,
            'requester' => [
                'id' => $request->requester->id,
                'name' => $request->requester->name,
                'email' => $request->requester->email,
            ],
            'target_therapist' => [
                'id' => $request->targetTherapist->id,
                'name' => $request->targetTherapist->name,
                'email' => $request->targetTherapist->email,
            ],
            'target_client' => $request->targetClient ? [
                'id' => $request->targetClient->id,
                'name' => $request->targetClient->name,
                'type' => $request->targetClient->hasRole('child') ? 'child' : 'guardian',
            ] : null,
            'request_type' => $request->request_type,
            'status' => $request->status,
            'message' => $request->message,
            'created_at' => $request->created_at,
            'reviewed_at' => $request->reviewed_at,
            'reviewed_by' => $request->reviewedBy ? [
                'id' => $request->reviewedBy->id,
                'name' => $request->reviewedBy->name,
            ] : null,
        ];
    }
}