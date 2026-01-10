# Therapist-Client Connection Management API Documentation

## Overview

The Therapist-Client Connection Management API provides endpoints for managing therapeutic relationships between therapists and clients (guardians and children). This API supports admin assignments, guardian requests, child assignments, and comprehensive connection management across all user roles.

**Version:** 1.0  
**Base URL:** `/api`  
**Authentication:** Laravel Sanctum (Bearer Token)

## Authentication

All endpoints require authentication using Laravel Sanctum tokens. Include the token in the Authorization header:

```
Authorization: Bearer {token}
```

## Request/Response Format

### Content Type
All requests should use `Content-Type: application/json` for POST/PUT requests.

### Standard Headers
All responses include these security headers:
- `X-API-Version: 1.0`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## Error Response Format

All API endpoints return errors in a consistent format:

```json
{
    "success": false,
    "error": {
        "code": "ERROR_CODE",
        "message": "Human-readable error message",
        "details": {
            "field": "Additional context or field-specific information"
        }
    },
    "meta": {
        "timestamp": "2024-01-20T16:00:00Z",
        "request_id": "req_123456789"
    }
}
```

## Success Response Format

Successful API responses follow this format:

```json
{
    "success": true,
    "message": "Operation completed successfully",
    "data": {
        // Response data specific to the endpoint
    },
    "meta": {
        "timestamp": "2024-01-20T16:00:00Z",
        "request_id": "req_123456789"
    }
}
```

## Validation

### Input Validation Rules

All endpoints implement comprehensive input validation:

#### User ID Validation
- Must be a valid integer
- Must exist in the users table
- Must have the appropriate role for the operation
- Must have 'active' status

#### Message Validation
- Optional for most endpoints
- String type, 10-1000 characters when provided
- HTML tags are stripped for security

#### Connection Validation
- Prevents duplicate active connections
- Validates user role compatibility
- Checks guardian-child relationships
- Ensures proper authorization chains

### Validation Error Response
```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_FAILED",
        "message": "The provided data is invalid.",
        "details": {
            "validation_errors": {
                "therapist_id": ["The selected therapist is not active."],
                "message": ["The message must be at least 10 characters."]
            }
        }
    }
}
```

## Error Codes

| Code | Description | HTTP Status | Details |
|------|-------------|-------------|---------|
| `CONNECTION_ALREADY_EXISTS` | Active connection already exists between users | 400 | Includes existing connection details |
| `INVALID_USER_ROLE` | User lacks required role for operation | 400 | Specifies required vs actual role |
| `REQUEST_NOT_FOUND` | Connection request doesn't exist | 404 | Request may have been deleted |
| `REQUEST_ALREADY_PROCESSED` | Request already approved/declined | 400 | Includes current status |
| `REQUEST_ALREADY_EXISTS` | Duplicate pending request exists | 400 | Includes existing request details |
| `INSUFFICIENT_PERMISSIONS` | User lacks permission for operation | 403 | Specifies required permissions |
| `INVALID_CLIENT_TYPE` | Client type doesn't match operation | 400 | Expected vs actual client type |
| `GUARDIAN_CHILD_MISMATCH` | Child doesn't belong to guardian | 403 | Guardian and child IDs provided |
| `GUARDIAN_NOT_CONNECTED` | Guardian must be connected to therapist first | 400 | Required for child assignments |
| `VALIDATION_FAILED` | Input validation failed | 422 | Detailed field-level errors |
| `UNAUTHORIZED` | Authentication required | 401 | Token missing or invalid |
| `FORBIDDEN` | Access denied | 403 | User role insufficient |
| `NOT_FOUND` | Resource not found | 404 | Specific resource type |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 | Retry-after header included |
| `INTERNAL_ERROR` | Server error occurred | 500 | Contact support if persistent |

### Business Logic Error Examples

#### Duplicate Connection
```json
{
    "success": false,
    "error": {
        "code": "CONNECTION_ALREADY_EXISTS",
        "message": "An active connection already exists between this therapist and client.",
        "details": {
            "therapist_id": 123,
            "client_id": 456,
            "existing_connection_id": 789,
            "connection_type": "admin_assigned",
            "assigned_at": "2024-01-15T10:30:00Z"
        }
    }
}
```

#### Invalid User Role
```json
{
    "success": false,
    "error": {
        "code": "INVALID_USER_ROLE",
        "message": "Selected user is not a therapist.",
        "details": {
            "user_id": 123,
            "required_role": "therapist",
            "actual_roles": ["guardian"]
        }
    }
}
```

#### Guardian-Child Mismatch
```json
{
    "success": false,
    "error": {
        "code": "GUARDIAN_CHILD_MISMATCH",
        "message": "You can only assign your own children.",
        "details": {
            "guardian_id": 123,
            "child_id": 456,
            "child_guardian_id": 789
        }
    }
}
```

---

## Therapist Endpoints

### GET /api/therapist/connections

Get all connections for the authenticated therapist.

**Authentication:** Required (Therapist role)

**Response:**
```json
{
    "success": true,
    "data": {
        "guardians": [
            {
                "id": 1,
                "client": {
                    "id": 2,
                    "name": "John Doe",
                    "email": "john@example.com",
                    "status": "active"
                },
                "connection_type": "admin_assigned",
                "assigned_at": "2024-01-15T10:30:00Z",
                "assigned_by": {
                    "id": 1,
                    "name": "Admin User"
                },
                "children_count": 2
            }
        ],
        "children": [
            {
                "id": 2,
                "client": {
                    "id": 3,
                    "name": "Jane Doe",
                    "email": "jane@example.com",
                    "status": "active",
                    "age": 12
                },
                "guardian": {
                    "id": 2,
                    "name": "John Doe",
                    "email": "john@example.com"
                },
                "connection_type": "guardian_child_assignment",
                "assigned_at": "2024-01-16T14:20:00Z",
                "recent_mood_entries": [
                    {
                        "mood": "happy",
                        "mood_date": "2024-01-20",
                        "notes": "Had a good day at school"
                    }
                ]
            }
        ],
        "pending_requests": [
            {
                "id": 1,
                "requester": {
                    "id": 4,
                    "name": "Sarah Smith",
                    "email": "sarah@example.com"
                },
                "request_type": "guardian_to_therapist",
                "message": "Looking for support with anxiety management",
                "created_at": "2024-01-19T09:15:00Z"
            }
        ],
        "stats": {
            "total_guardians": 5,
            "total_children": 8,
            "pending_requests": 2,
            "total_connections": 13
        }
    }
}
```

### GET /api/therapist/connections/guardians

Get connected guardians for the authenticated therapist.

**Authentication:** Required (Therapist role)

**Response:**
```json
{
    "success": true,
    "data": {
        "guardians": [
            {
                "id": 1,
                "guardian": {
                    "id": 2,
                    "name": "John Doe",
                    "email": "john@example.com",
                    "status": "active",
                    "phone": "+1234567890"
                },
                "connection_type": "admin_assigned",
                "assigned_at": "2024-01-15T10:30:00Z",
                "children": [
                    {
                        "id": 3,
                        "name": "Jane Doe",
                        "age": 12,
                        "connection_id": 2,
                        "assigned_at": "2024-01-16T14:20:00Z"
                    }
                ],
                "total_children": 2,
                "recent_activity": {
                    "last_login": null,
                    "recent_messages": 3,
                    "recent_appointments": 1
                }
            }
        ],
        "stats": {
            "total_guardians": 5,
            "total_connected_children": 8
        }
    }
}
```

### GET /api/therapist/connections/children

Get connected children for the authenticated therapist.

**Authentication:** Required (Therapist role)

**Response:**
```json
{
    "success": true,
    "data": {
        "children": [
            {
                "id": 2,
                "child": {
                    "id": 3,
                    "name": "Jane Doe",
                    "email": "jane@example.com",
                    "status": "active",
                    "age": 12,
                    "date_of_birth": "2012-03-15"
                },
                "guardian": {
                    "id": 2,
                    "name": "John Doe",
                    "email": "john@example.com",
                    "phone": "+1234567890"
                },
                "connection_type": "guardian_child_assignment",
                "assigned_at": "2024-01-16T14:20:00Z",
                "mood_data": {
                    "recent_entries": [
                        {
                            "mood": "happy",
                            "mood_date": "2024-01-20",
                            "notes": "Had a good day at school"
                        }
                    ],
                    "total_entries": 15,
                    "streak": 7,
                    "trend": "improving"
                },
                "recent_appointments": [
                    {
                        "id": 1,
                        "scheduled_at": "2024-01-18T15:00:00Z",
                        "duration_minutes": 60,
                        "status": "completed",
                        "notes": "Good progress on anxiety management"
                    }
                ]
            }
        ],
        "stats": {
            "total_children": 8,
            "active_children": 7
        }
    }
}
```

### GET /api/therapist/requests/pending

Get pending connection requests for the authenticated therapist.

**Authentication:** Required (Therapist role)

**Response:**
```json
{
    "success": true,
    "data": {
        "requests": [
            {
                "id": 1,
                "requester": {
                    "id": 4,
                    "name": "Sarah Smith",
                    "email": "sarah@example.com",
                    "phone": "+1987654321"
                },
                "target_client": null,
                "request_type": "guardian_to_therapist",
                "message": "Looking for support with anxiety management",
                "created_at": "2024-01-19T09:15:00Z",
                "is_guardian_to_therapist": true,
                "is_child_assignment": false
            },
            {
                "id": 2,
                "requester": {
                    "id": 2,
                    "name": "John Doe",
                    "email": "john@example.com"
                },
                "target_client": {
                    "id": 5,
                    "name": "Tommy Doe",
                    "age": 8
                },
                "request_type": "guardian_child_assignment",
                "message": null,
                "created_at": "2024-01-19T11:30:00Z",
                "is_guardian_to_therapist": false,
                "is_child_assignment": true
            }
        ],
        "stats": {
            "total_pending": 2,
            "guardian_requests": 1,
            "child_assignments": 1
        }
    }
}
```

### POST /api/therapist/requests/{id}/approve

Approve a connection request.

**Authentication:** Required (Therapist role)

**Parameters:**
- `id` (integer, required): Connection request ID

**Request Body:** None

**Response:**
```json
{
    "success": true,
    "message": "Connection request approved successfully.",
    "data": {
        "connection": {
            "id": 15,
            "therapist_id": 1,
            "client_id": 4,
            "status": "active",
            "connection_type": "guardian_requested",
            "assigned_at": "2024-01-20T10:15:00Z"
        }
    }
}
```

**Error Responses:**
```json
{
    "success": false,
    "error": {
        "code": "REQUEST_NOT_FOUND",
        "message": "Connection request not found or already processed."
    }
}
```

### POST /api/therapist/requests/{id}/decline

Decline a connection request.

**Authentication:** Required (Therapist role)

**Parameters:**
- `id` (integer, required): Connection request ID

**Request Body:** None

**Response:**
```json
{
    "success": true,
    "message": "Connection request declined successfully."
}
```

---

## Guardian Endpoints

### GET /api/guardian/connections

Get all connections for the authenticated guardian.

**Authentication:** Required (Guardian role)

**Response:**
```json
{
    "success": true,
    "data": {
        "connections": [
            {
                "id": 1,
                "therapist": {
                    "id": 1,
                    "name": "Dr. Smith",
                    "email": "dr.smith@example.com",
                    "status": "active"
                },
                "connection_type": "admin_assigned",
                "assigned_at": "2024-01-15T10:30:00Z",
                "specialization": "Child Psychology",
                "availability_status": "available"
            }
        ],
        "pending_requests": [
            {
                "id": 1,
                "therapist": {
                    "id": 2,
                    "name": "Dr. Johnson",
                    "email": "dr.johnson@example.com"
                },
                "request_type": "guardian_to_therapist",
                "status": "pending",
                "message": "Looking for anxiety support",
                "created_at": "2024-01-19T09:15:00Z",
                "is_guardian_to_therapist": true
            }
        ],
        "stats": {
            "total_connections": 1,
            "pending_requests": 1,
            "approved_requests": 0,
            "declined_requests": 0
        }
    }
}
```

### GET /api/guardian/therapists/search

Search available therapists with optional filtering.

**Authentication:** Required (Guardian role)

**Query Parameters:**
- `specialization` (string, optional): Filter by therapist specialization
- `availability` (string, optional): Filter by availability status
- `location` (string, optional): Filter by location (future feature)

**Response:**
```json
{
    "success": true,
    "data": {
        "therapists": [
            {
                "id": 2,
                "name": "Dr. Johnson",
                "email": "dr.johnson@example.com",
                "status": "active",
                "specialization": "Anxiety Disorders",
                "availability": [
                    {
                        "day_of_week": 1,
                        "start_time": "09:00:00",
                        "end_time": "17:00:00",
                        "day_name": "Monday"
                    }
                ],
                "active_connections": 12,
                "rating": null,
                "years_experience": null
            }
        ],
        "recommended_therapists": [
            {
                "id": 3,
                "name": "Dr. Williams",
                "specialization": "Family Therapy",
                "availability_slots": 15,
                "recommendation_score": 85
            }
        ],
        "search_stats": {
            "total_available": 8,
            "filtered_results": 1
        }
    }
}
```

### POST /api/guardian/connection-requests

Create a connection request to a therapist.

**Authentication:** Required (Guardian role)

**Request Body:**
```json
{
    "therapist_id": 2,
    "message": "Looking for support with my child's anxiety issues"
}
```

**Validation Rules:**
- `therapist_id`: required, integer, must exist in users table with therapist role
- `message`: optional, string, max 1000 characters

**Response:**
```json
{
    "success": true,
    "message": "Connection request sent successfully.",
    "data": {
        "request": {
            "id": 5,
            "therapist_name": "Dr. Johnson",
            "status": "pending",
            "created_at": "2024-01-20T14:30:00Z"
        }
    }
}
```

**Error Responses:**
```json
{
    "success": false,
    "error": {
        "code": "CONNECTION_ALREADY_EXISTS",
        "message": "You already have an active connection with this therapist.",
        "details": {
            "therapist_id": 2,
            "existing_connection_id": 1
        }
    }
}
```

### POST /api/guardian/child-assignments

Request to assign a child to a connected therapist.

**Authentication:** Required (Guardian role)

**Request Body:**
```json
{
    "child_id": 3,
    "therapist_id": 1
}
```

**Validation Rules:**
- `child_id`: required, integer, must exist and belong to the guardian
- `therapist_id`: required, integer, must be connected to the guardian

**Response:**
```json
{
    "success": true,
    "message": "Child assignment request sent successfully.",
    "data": {
        "request": {
            "id": 6,
            "child_name": "Jane Doe",
            "therapist_name": "Dr. Smith",
            "status": "pending",
            "created_at": "2024-01-20T15:45:00Z"
        }
    }
}
```

### DELETE /api/guardian/requests/{id}

Cancel a pending connection request.

**Authentication:** Required (Guardian role)

**Parameters:**
- `id` (integer, required): Request ID (must belong to the guardian)

**Response:**
```json
{
    "success": true,
    "message": "Request cancelled successfully."
}
```

---

## Child Endpoints

### GET /api/child/therapists

Get connected therapists for the authenticated child.

**Authentication:** Required (Child role)

**Response:**
```json
{
    "success": true,
    "data": {
        "therapists": [
            {
                "id": 1,
                "therapist": {
                    "id": 1,
                    "name": "Dr. Smith",
                    "friendly_name": "Dr. Smith",
                    "description": "A caring helper who listens to you",
                    "status": "active"
                },
                "connection_type": "admin_assigned",
                "assigned_at": "2024-01-15T10:30:00Z",
                "is_available": true,
                "can_chat": true,
                "can_schedule": true,
                "last_interaction": {
                    "type": "message",
                    "date": "2024-01-19T16:20:00Z",
                    "description": "Last message"
                }
            }
        ],
        "guardian": {
            "id": 2,
            "name": "John Doe",
            "has_same_therapists": true
        },
        "stats": {
            "total_therapists": 1,
            "available_now": 1,
            "recent_chats": 3,
            "upcoming_appointments": 1
        },
        "encouragement_message": "You have a therapist who cares about you and wants to help!"
    }
}
```

### GET /api/child/therapist/{id}/features

Get available communication features with a specific therapist.

**Authentication:** Required (Child role)

**Parameters:**
- `id` (integer, required): Therapist ID (must be connected)

**Response:**
```json
{
    "success": true,
    "data": {
        "features": {
            "messaging": {
                "available": true,
                "description": "Send messages to your therapist",
                "icon": "message-circle",
                "action_url": "/messages/conversation/1",
                "child_friendly_text": "Chat with Dr. Smith"
            },
            "appointments": {
                "available": true,
                "description": "Schedule time to talk with your therapist",
                "icon": "calendar",
                "action_url": "/appointments/create?therapist=1",
                "child_friendly_text": "Schedule time to talk"
            },
            "mood_sharing": {
                "available": true,
                "description": "Your therapist can see your mood entries to help you",
                "icon": "heart",
                "action_url": "/mood",
                "child_friendly_text": "Share how you feel"
            },
            "games": {
                "available": true,
                "description": "Play therapeutic games together",
                "icon": "gamepad-2",
                "action_url": "/games",
                "child_friendly_text": "Play helpful games"
            }
        },
        "therapist": {
            "id": 1,
            "name": "Dr. Smith",
            "friendly_name": "Dr. Smith"
        }
    }
}
```

---

## Admin Endpoints

### GET /api/admin/connections

Get all connections in the system with analytics.

**Authentication:** Required (Admin role)

**Response:**
```json
{
    "success": true,
    "data": {
        "connections": [
            {
                "id": 1,
                "therapist": {
                    "id": 1,
                    "name": "Dr. Smith",
                    "email": "dr.smith@example.com"
                },
                "client": {
                    "id": 2,
                    "name": "John Doe",
                    "email": "john@example.com",
                    "client_type": "guardian"
                },
                "connection_type": "admin_assigned",
                "status": "active",
                "assigned_at": "2024-01-15T10:30:00Z",
                "assigned_by": {
                    "id": 1,
                    "name": "Admin User"
                }
            }
        ],
        "statistics": {
            "total_connections": 25,
            "active_connections": 23,
            "terminated_connections": 2,
            "pending_requests": 5,
            "connections_by_type": {
                "admin_assigned": 15,
                "guardian_requested": 8,
                "guardian_child_assignment": 2
            },
            "therapist_utilization": {
                "average_connections_per_therapist": 4.2,
                "most_connected_therapist": {
                    "name": "Dr. Smith",
                    "connections": 8
                }
            }
        }
    }
}
```

### POST /api/admin/connections

Create an admin assignment between therapist and client.

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
    "therapist_id": 1,
    "client_id": 2
}
```

**Validation Rules:**
- `therapist_id`: required, integer, must exist with therapist role
- `client_id`: required, integer, must exist with guardian or child role

**Response:**
```json
{
    "success": true,
    "message": "Connection created successfully.",
    "data": {
        "connection": {
            "id": 26,
            "therapist_id": 1,
            "client_id": 2,
            "client_type": "guardian",
            "connection_type": "admin_assigned",
            "status": "active",
            "assigned_at": "2024-01-20T16:00:00Z",
            "assigned_by": {
                "id": 1,
                "name": "Admin User"
            }
        }
    }
}
```

### GET /api/admin/connections/analytics

Get detailed connection analytics.

**Authentication:** Required (Admin role)

**Response:**
```json
{
    "success": true,
    "data": {
        "statistics": {
            "total_connections": 25,
            "active_connections": 23,
            "terminated_connections": 2,
            "pending_requests": 5
        },
        "recent_connections": 8,
        "connections_by_type": {
            "admin_assigned": 15,
            "guardian_requested": 8,
            "guardian_child_assignment": 2
        },
        "monthly_trends": [
            {
                "month": "2024-01",
                "new_connections": 12,
                "terminated_connections": 1
            }
        ],
        "therapist_metrics": [
            {
                "therapist_id": 1,
                "name": "Dr. Smith",
                "total_connections": 8,
                "active_connections": 7,
                "pending_requests": 2
            }
        ]
    }
}
```

### DELETE /api/admin/connections/{id}

Terminate a connection.

**Authentication:** Required (Admin role)

**Parameters:**
- `id` (integer, required): Connection ID

**Response:**
```json
{
    "success": true,
    "message": "Connection terminated successfully.",
    "data": {
        "connection": {
            "id": 1,
            "status": "terminated",
            "terminated_at": "2024-01-20T16:30:00Z",
            "terminated_by": {
                "id": 1,
                "name": "Admin User"
            }
        }
    }
}
```

### GET /api/admin/connections/available-clients

Get available clients for assignment to a specific therapist.

**Authentication:** Required (Admin role)

**Query Parameters:**
- `therapist_id` (integer, required): Therapist ID

**Response:**
```json
{
    "success": true,
    "data": {
        "guardians": [
            {
                "id": 5,
                "name": "Sarah Johnson",
                "email": "sarah@example.com"
            }
        ],
        "children": [
            {
                "id": 6,
                "name": "Tommy Wilson",
                "email": "tommy@example.com",
                "guardian_id": 7,
                "guardian": {
                    "id": 7,
                    "name": "Mike Wilson"
                }
            }
        ]
    }
}
```

### GET /api/admin/connections/available-therapists

Get available therapists for assignment to a specific client.

**Authentication:** Required (Admin role)

**Query Parameters:**
- `client_id` (integer, required): Client ID

**Response:**
```json
{
    "success": true,
    "data": {
        "therapists": [
            {
                "id": 3,
                "name": "Dr. Williams",
                "email": "dr.williams@example.com"
            }
        ]
    }
}
```

---

## Rate Limiting

API endpoints are rate limited to prevent abuse and ensure fair usage:

### Rate Limit Tiers

| User Role | General Endpoints | Search Endpoints | Request Creation | Admin Operations |
|-----------|------------------|------------------|------------------|------------------|
| **Guardian** | 60/min | 30/min | 10/5min | N/A |
| **Therapist** | 60/min | 30/min | 20/5min | N/A |
| **Child** | 60/min | N/A | N/A | N/A |
| **Admin** | 100/min | 60/min | 20/5min | 100/min |

### Rate Limit Headers

All responses include rate limit information:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1642694400
```

### Rate Limit Exceeded Response

```json
{
    "success": false,
    "error": {
        "code": "RATE_LIMIT_EXCEEDED",
        "message": "Too many requests. Please try again later.",
        "details": {
            "retry_after": 45,
            "limit": 60,
            "window_minutes": 1
        }
    }
}
```

**HTTP Headers:**
- `Retry-After: 45` (seconds)
- `X-RateLimit-Reset: 1642694445` (timestamp)

## Security Features

### Input Sanitization
- All text inputs are sanitized to prevent XSS attacks
- HTML tags are stripped from user messages
- SQL injection protection via parameterized queries

### Authorization Checks
- Role-based access control (RBAC) on all endpoints
- Resource ownership validation
- Connection relationship verification

### Data Privacy
- Child data only accessible to connected therapists and guardians
- Therapist information filtered based on user role
- Audit logging for all connection changes

### Request Validation
- Comprehensive input validation on all endpoints
- Business logic validation (duplicate prevention, etc.)
- Malformed request rejection with detailed error messages

## Pagination

List endpoints support pagination using query parameters:

- `page` (integer, default: 1): Page number
- `per_page` (integer, default: 15, max: 100): Items per page

Paginated responses include metadata:
```json
{
    "success": true,
    "data": {
        "items": [...],
        "pagination": {
            "current_page": 1,
            "per_page": 15,
            "total": 45,
            "last_page": 3,
            "from": 1,
            "to": 15
        }
    }
}
```

## Webhooks

The system supports webhooks for real-time notifications of connection events:

### Supported Events

- `connection.created`: New connection established
- `connection.terminated`: Connection terminated
- `request.created`: New connection request submitted
- `request.approved`: Connection request approved
- `request.declined`: Connection request declined

### Webhook Payload

```json
{
    "event": "connection.created",
    "timestamp": "2024-01-20T16:00:00Z",
    "data": {
        "connection": {
            "id": 26,
            "therapist_id": 1,
            "client_id": 2,
            "connection_type": "admin_assigned",
            "status": "active"
        }
    }
}
```

## SDK and Client Libraries

Official SDKs are available for:

- **JavaScript/TypeScript**: `@safespace/connections-sdk`
- **PHP**: `safespace/connections-client`
- **Python**: `safespace-connections`

Example usage (JavaScript):
```javascript
import { ConnectionsClient } from '@safespace/connections-sdk';

const client = new ConnectionsClient({
    baseUrl: 'https://api.safespace.com',
    token: 'your-api-token'
});

// Create a connection request
const request = await client.guardian.createRequest({
    therapist_id: 2,
    message: 'Looking for anxiety support'
});
```