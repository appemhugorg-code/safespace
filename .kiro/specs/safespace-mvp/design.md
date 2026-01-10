# Design Document

## Overview

SafeSpace is a comprehensive mental health management platform built with Laravel 12 backend and React 18 frontend, utilizing ShadCN UI components and TailwindCSS for styling. The system implements a role-based architecture with four distinct user types (Admin, Therapist, Guardian, Child), each with specialized dashboards and functionality. The platform facilitates mental health tracking, therapy appointment management, and secure communication between all stakeholders while maintaining strict approval workflows and data privacy standards.

## Architecture

### Technology Stack
- **Backend**: Laravel 12 with PHP 8.3
- **Frontend**: React 18 with TypeScript
- **UI Framework**: ShadCN UI components with TailwindCSS
- **Database**: SQLite for development, scalable to PostgreSQL/MySQL for production
- **Authentication**: Laravel Sanctum for API authentication
- **Authorization**: Spatie Laravel Permission for role-based access control
- **Real-time Communication**: Laravel Reverb or Pusher for chat functionality
- **Video Integration**: Google Meet API for therapy sessions

### System Architecture Pattern
The application follows a clean architecture pattern with clear separation of concerns:

```
Frontend (React/TypeScript)
├── Components (ShadCN UI)
├── Pages/Views (Role-specific dashboards)
├── Services (API communication)
└── State Management (Context/Zustand)

Backend (Laravel)
├── Controllers (API endpoints)
├── Models (Eloquent ORM)
├── Services (Business logic)
├── Repositories (Data access)
├── Middleware (Authentication/Authorization)
└── Events/Listeners (Real-time features)
```

## Components and Interfaces

### User Management System
- **User Model**: Central user entity with polymorphic role relationships
- **Role-based Authentication**: Spatie permissions for granular access control
- **Approval Workflow**: Admin-controlled user activation system
- **Child Account Management**: Guardian-initiated, admin-approved child accounts

### Dashboard Components

#### Admin Dashboard
- **PendingUsersTable**: Display and manage user approval requests
- **ApprovalActions**: Quick approve/reject functionality with notifications
- **ReportsOverview**: System usage statistics and mood trend analytics
- **UserManagementPanel**: Comprehensive user administration tools

#### Therapist Dashboard
- **SessionSchedule**: Calendar view of upcoming appointments
- **AssignedChildrenList**: Overview of assigned children with quick access to profiles
- **MoodTrendsGraph**: Visual representation of children's mood patterns
- **ChatPanel**: Real-time communication with guardians and children

#### Guardian Dashboard
- **ChildOverviewCards**: Summary cards for each child showing recent activity
- **AddChildForm**: Interface for creating new child accounts
- **MoodHistoryGraph**: Detailed mood tracking visualization
- **AppointmentRequests**: Schedule and manage therapy sessions
- **TherapistChatPanel**: Direct communication with assigned therapist

#### Child Dashboard
- **MoodSelector**: Age-appropriate mood tracking interface
- **DailyMoodChart**: Visual representation of mood history
- **GameSection**: Educational games and activities
- **EncouragementMessages**: Positive reinforcement and motivational content
- **PanicButton**: Emergency alert system for immediate help

### API Design

#### Authentication Endpoints
```
POST /api/register - User registration (Guardian/Therapist)
POST /api/login - User authentication
POST /api/logout - Session termination
GET /api/user - Current user profile
```

#### User Management Endpoints
```
GET /api/admin/pending-users - List pending approvals
POST /api/admin/approve-user/{id} - Approve user account
POST /api/admin/reject-user/{id} - Reject user account
POST /api/guardian/create-child - Create child account
```

#### Mood Tracking Endpoints
```
POST /api/mood-logs - Create mood entry
GET /api/mood-logs - Retrieve mood history
GET /api/mood-trends/{userId} - Get mood analytics
```

#### Appointment Management Endpoints
```
POST /api/appointments - Create appointment request
GET /api/appointments - List user appointments
PUT /api/appointments/{id} - Update appointment status
DELETE /api/appointments/{id} - Cancel appointment
```

#### Communication Endpoints
```
POST /api/messages - Send message
GET /api/conversations - List conversations
GET /api/conversations/{id}/messages - Get conversation history
POST /api/panic-alert - Trigger emergency alert
```

## Data Models

### User Model
```php
class User extends Model
{
    protected $fillable = [
        'name', 'email', 'password', 'status', 'guardian_id'
    ];
    
    protected $casts = [
        'status' => UserStatus::class
    ];
    
    public function children() {
        return $this->hasMany(User::class, 'guardian_id');
    }
    
    public function guardian() {
        return $this->belongsTo(User::class, 'guardian_id');
    }
    
    public function moodLogs() {
        return $this->hasMany(MoodLog::class);
    }
}
```

### MoodLog Model
```php
class MoodLog extends Model
{
    protected $fillable = [
        'user_id', 'mood', 'note', 'created_at'
    ];
    
    protected $casts = [
        'mood' => MoodType::class,
        'created_at' => 'datetime'
    ];
    
    public function user() {
        return $this->belongsTo(User::class);
    }
}
```

### Appointment Model
```php
class Appointment extends Model
{
    protected $fillable = [
        'therapist_id', 'child_id', 'scheduled_at', 'status'
    ];
    
    protected $casts = [
        'scheduled_at' => 'datetime',
        'status' => AppointmentStatus::class
    ];
    
    public function therapist() {
        return $this->belongsTo(User::class, 'therapist_id');
    }
    
    public function child() {
        return $this->belongsTo(User::class, 'child_id');
    }
}
```

### Article Model
```php
class Article extends Model
{
    protected $fillable = [
        'title', 'body', 'author_id', 'published_at'
    ];
    
    protected $casts = [
        'published_at' => 'datetime'
    ];
    
    public function author() {
        return $this->belongsTo(User::class, 'author_id');
    }
}
```

## Frontend Architecture

### Component Structure
```
src/
├── components/
│   ├── ui/ (ShadCN components)
│   ├── dashboard/ (Role-specific dashboard components)
│   ├── forms/ (Form components)
│   └── common/ (Shared components)
├── pages/
│   ├── auth/ (Login/Register pages)
│   ├── dashboard/ (Role-specific dashboards)
│   └── landing/ (Public landing page)
├── services/
│   ├── api.ts (API client)
│   ├── auth.ts (Authentication service)
│   └── websocket.ts (Real-time communication)
├── types/
│   └── index.ts (TypeScript definitions)
└── utils/
    └── helpers.ts (Utility functions)
```

### State Management
- **Authentication State**: User session and role information
- **Dashboard State**: Role-specific data and UI state
- **Real-time State**: Chat messages and notifications
- **Form State**: Form validation and submission handling

## Landing Page Design

### Design Principles
- **Calming Aesthetic**: Soft colors, gentle gradients, and supportive imagery
- **Clear Value Proposition**: Immediately communicate the platform's purpose
- **Easy Navigation**: Clear paths for different user types to register
- **Trust Building**: Professional design that instills confidence in mental health services
- **Accessibility**: WCAG 2.1 AA compliant design

### Landing Page Sections
1. **Hero Section**: Welcoming message with clear call-to-action buttons
2. **Features Overview**: Key benefits for each user type
3. **How It Works**: Simple 3-step process explanation
4. **Testimonials**: (Future feature) User success stories
5. **Registration CTA**: Prominent buttons for Guardian and Therapist registration

## Error Handling

### Frontend Error Handling
- **API Error Interceptors**: Centralized error handling for API responses
- **Form Validation**: Real-time validation with user-friendly error messages
- **Network Error Handling**: Graceful degradation for connectivity issues
- **Authentication Errors**: Automatic redirect to login for expired sessions

### Backend Error Handling
- **Validation Errors**: Structured error responses with field-specific messages
- **Authorization Errors**: Clear messaging for insufficient permissions
- **Database Errors**: Graceful handling with user-friendly messages
- **Rate Limiting**: Protection against abuse with informative responses

## Security Considerations

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication with refresh mechanism
- **Role-based Access Control**: Granular permissions using Spatie Laravel Permission
- **Session Management**: Secure session handling with appropriate timeouts
- **Password Security**: Bcrypt hashing with strong password requirements

### Data Protection
- **HTTPS Enforcement**: All communications encrypted in transit
- **Data Encryption**: Sensitive data encrypted at rest
- **Input Sanitization**: Protection against XSS and injection attacks
- **CSRF Protection**: Laravel's built-in CSRF protection enabled

### Privacy Compliance
- **Data Minimization**: Collect only necessary information
- **User Consent**: Clear consent mechanisms for data processing
- **Data Retention**: Appropriate retention policies for mental health data
- **Audit Logging**: Comprehensive logging for security and compliance

## Testing Strategy

### Backend Testing
- **Unit Tests**: Model validation, service logic, and utility functions
- **Feature Tests**: API endpoint functionality and business logic
- **Integration Tests**: Database interactions and external service integration
- **Security Tests**: Authentication, authorization, and input validation

### Frontend Testing
- **Component Tests**: Individual component functionality and rendering
- **Integration Tests**: User workflows and component interactions
- **E2E Tests**: Critical user journeys across the entire application
- **Accessibility Tests**: WCAG compliance and screen reader compatibility

### Performance Testing
- **Load Testing**: API performance under expected user loads
- **Database Performance**: Query optimization and indexing strategies
- **Frontend Performance**: Bundle size optimization and rendering performance
- **Real-time Features**: WebSocket connection handling and message delivery

## Deployment Architecture

### Development Environment
- **Local Development**: Docker containers for consistent development environment
- **Database**: SQLite for simplicity and portability
- **Hot Reloading**: Vite for fast frontend development cycles

### Production Environment
- **Application Server**: Laravel application with PHP-FPM
- **Database**: PostgreSQL for production scalability
- **Web Server**: Nginx for static file serving and reverse proxy
- **Real-time Services**: Laravel Reverb or Pusher for WebSocket connections
- **CDN**: Static asset delivery optimization

### Monitoring & Logging
- **Application Monitoring**: Error tracking and performance monitoring
- **Database Monitoring**: Query performance and connection pooling
- **Security Monitoring**: Failed authentication attempts and suspicious activity
- **User Analytics**: Usage patterns and feature adoption tra
