# Design Document

## Overview

The SafeSpace MVP completion involves implementing three integrated systems: a comprehensive email notification system, Google Meet integration for therapy sessions, and a content management system for educational resources. These systems will work together to provide a complete mental health platform experience.

The design emphasizes security, scalability, and user experience while integrating with external services (Google Workspace) and maintaining HIPAA-compliant data handling practices.

## Architecture

### System Integration Overview

```
SafeSpace Core Platform
├── Email Notification System
│   ├── Laravel Mail System
│   ├── Queue-based Email Processing
│   ├── Template Management
│   └── Delivery Tracking
├── Google Meet Integration
│   ├── Google Calendar API
│   ├── Google Meet API
│   ├── OAuth 2.0 Authentication
│   └── Meeting Management
└── Content Management System
    ├── Article Creation & Editing
    ├── Content Moderation Workflow
    ├── Category & Tag Management
    └── User Access Control
```

### Technology Stack

**Backend Services:**
- Laravel Mail with Queue Workers for email processing
- Google APIs (Calendar, Meet) via OAuth 2.0
- Rich text editor (TinyMCE/Quill) for content creation
- Image upload and management for articles

**Frontend Components:**
- React components for meeting scheduling
- Rich text editor integration
- Content browsing and search interface
- Email preference management

**External Integrations:**
- Google Workspace APIs
- Email service provider (SendGrid/Mailgun)
- File storage for content media

## Components and Interfaces

### 1. Email Notification System

#### Email Service Architecture
```php
// Core email service structure
EmailNotificationService
├── NotificationTemplateManager
├── EmailQueueProcessor
├── DeliveryTracker
└── UserPreferenceManager
```

#### Email Templates and Types
```php
class EmailNotificationService
{
    // Welcome and account emails
    public function sendWelcomeEmail(User $user): void
    public function sendAccountVerification(User $user): void
    public function sendPasswordReset(User $user, string $token): void
    
    // Appointment and meeting emails
    public function sendAppointmentConfirmation(Appointment $appointment): void
    public function sendAppointmentReminder(Appointment $appointment, string $reminderType): void
    public function sendAppointmentCancellation(Appointment $appointment): void
    
    // Emergency and alert emails
    public function sendPanicAlertNotification(PanicAlert $alert): void
    public function sendEmergencyContactAlert(User $child, string $alertType): void
    
    // Communication emails
    public function sendNewMessageNotification(Message $message): void
    public function sendGroupInvitation(GroupInvitation $invitation): void
    
    // Content and system emails
    public function sendContentPublishedNotification(Article $article): void
    public function sendSystemMaintenanceNotification(array $users): void
}
```

#### Email Template Management
```php
class EmailTemplate extends Model
{
    protected $fillable = [
        'name',
        'subject',
        'html_content',
        'text_content',
        'variables',
        'category',
        'is_active',
        'created_by',
    ];
    
    // Template variables for personalization
    public function getVariables(): array
    {
        return [
            'user_name' => 'Recipient name',
            'appointment_date' => 'Appointment date and time',
            'therapist_name' => 'Therapist name',
            'meeting_link' => 'Google Meet link',
            'platform_url' => 'SafeSpace platform URL',
        ];
    }
}
```

### 2. Google Meet Integration

#### Meeting Management System
```php
class GoogleMeetService
{
    private GoogleCalendarService $calendarService;
    private GoogleMeetApiService $meetService;
    
    public function createTherapySession(array $sessionData): TherapySession
    {
        // Create Google Calendar event
        $calendarEvent = $this->calendarService->createEvent([
            'summary' => 'Therapy Session - ' . $sessionData['title'],
            'start' => $sessionData['start_time'],
            'end' => $sessionData['end_time'],
            'attendees' => $sessionData['participants'],
        ]);
        
        // Create Google Meet link
        $meetLink = $this->meetService->createMeeting($calendarEvent->id);
        
        // Store in database
        return TherapySession::create([
            'therapist_id' => $sessionData['therapist_id'],
            'client_id' => $sessionData['client_id'],
            'scheduled_at' => $sessionData['start_time'],
            'duration' => $sessionData['duration'],
            'google_event_id' => $calendarEvent->id,
            'meet_link' => $meetLink,
            'status' => 'scheduled',
        ]);
    }
}
```

#### Appointment Scheduling System
```php
class AppointmentScheduler
{
    public function getAvailableSlots(int $therapistId, Carbon $date): Collection
    {
        $therapist = User::findOrFail($therapistId);
        $availability = $therapist->availability()->forDate($date)->get();
        $existingAppointments = $therapist->appointments()->forDate($date)->get();
        
        return $this->calculateAvailableSlots($availability, $existingAppointments);
    }
    
    public function bookAppointment(array $appointmentData): Appointment
    {
        DB::transaction(function () use ($appointmentData) {
            // Validate availability
            $this->validateTimeSlot($appointmentData);
            
            // Create appointment
            $appointment = Appointment::create($appointmentData);
            
            // Create Google Meet session
            $session = $this->googleMeetService->createTherapySession([
                'therapist_id' => $appointment->therapist_id,
                'client_id' => $appointment->client_id,
                'start_time' => $appointment->scheduled_at,
                'duration' => $appointment->duration,
                'title' => $appointment->title,
            ]);
            
            // Send confirmation emails
            $this->emailService->sendAppointmentConfirmation($appointment);
            
            return $appointment;
        });
    }
}
```

### 3. Content Management System

#### Article Management
```php
class Article extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'featured_image',
        'author_id',
        'category_id',
        'tags',
        'target_audience', // 'children', 'guardians', 'therapists', 'all'
        'status', // 'draft', 'pending', 'published', 'archived'
        'published_at',
        'meta_description',
        'reading_time',
    ];
    
    protected $casts = [
        'tags' => 'array',
        'published_at' => 'datetime',
    ];
    
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
    
    public function category(): BelongsTo
    {
        return $this->belongsTo(ArticleCategory::class);
    }
    
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                    ->where('published_at', '<=', now());
    }
    
    public function scopeForAudience($query, string $audience)
    {
        return $query->where(function ($q) use ($audience) {
            $q->where('target_audience', $audience)
              ->orWhere('target_audience', 'all');
        });
    }
}
```

#### Content Creation Workflow
```php
class ContentModerationService
{
    public function submitForReview(Article $article): void
    {
        $article->update(['status' => 'pending']);
        
        // Notify admins of pending content
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            $this->emailService->sendContentReviewNotification($admin, $article);
        }
    }
    
    public function approveContent(Article $article, User $reviewer): void
    {
        $article->update([
            'status' => 'published',
            'published_at' => now(),
            'reviewed_by' => $reviewer->id,
        ]);
        
        // Notify author of approval
        $this->emailService->sendContentApprovedNotification($article);
        
        // Notify subscribers of new content
        $this->notifyContentSubscribers($article);
    }
    
    public function rejectContent(Article $article, User $reviewer, string $reason): void
    {
        $article->update([
            'status' => 'draft',
            'rejection_reason' => $reason,
            'reviewed_by' => $reviewer->id,
        ]);
        
        // Notify author of rejection
        $this->emailService->sendContentRejectedNotification($article, $reason);
    }
}
```

## Data Models

### Enhanced Database Schema

#### Email System Tables
```sql
-- Email templates
CREATE TABLE email_templates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html_content LONGTEXT NOT NULL,
    text_content LONGTEXT,
    variables JSON,
    category VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Email delivery tracking
CREATE TABLE email_deliveries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    template_id BIGINT UNSIGNED,
    subject VARCHAR(255) NOT NULL,
    status ENUM('pending', 'sent', 'delivered', 'failed', 'bounced') DEFAULT 'pending',
    sent_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    error_message TEXT NULL,
    external_id VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (template_id) REFERENCES email_templates(id)
);

-- User email preferences
CREATE TABLE user_email_preferences (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    appointment_reminders BOOLEAN DEFAULT TRUE,
    message_notifications BOOLEAN DEFAULT TRUE,
    content_updates BOOLEAN DEFAULT TRUE,
    emergency_alerts BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user_preferences (user_id)
);
```

#### Appointment and Meeting Tables
```sql
-- Therapist availability
CREATE TABLE therapist_availability (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    therapist_id BIGINT UNSIGNED NOT NULL,
    day_of_week TINYINT NOT NULL, -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (therapist_id) REFERENCES users(id),
    INDEX idx_therapist_day (therapist_id, day_of_week)
);

-- Appointments
CREATE TABLE appointments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    therapist_id BIGINT UNSIGNED NOT NULL,
    client_id BIGINT UNSIGNED NOT NULL,
    guardian_id BIGINT UNSIGNED NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60, -- minutes
    status ENUM('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show') DEFAULT 'scheduled',
    appointment_type ENUM('individual', 'family', 'group', 'consultation') DEFAULT 'individual',
    google_event_id VARCHAR(255) NULL,
    meet_link VARCHAR(500) NULL,
    notes TEXT NULL,
    cancelled_at TIMESTAMP NULL,
    cancelled_by BIGINT UNSIGNED NULL,
    cancellation_reason TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (therapist_id) REFERENCES users(id),
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (guardian_id) REFERENCES users(id),
    FOREIGN KEY (cancelled_by) REFERENCES users(id),
    INDEX idx_therapist_date (therapist_id, scheduled_at),
    INDEX idx_client_date (client_id, scheduled_at)
);

-- Appointment participants (for group sessions)
CREATE TABLE appointment_participants (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    appointment_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    role ENUM('therapist', 'client', 'guardian', 'observer') NOT NULL,
    status ENUM('invited', 'confirmed', 'declined', 'attended', 'no_show') DEFAULT 'invited',
    joined_at TIMESTAMP NULL,
    left_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_appointment_user (appointment_id, user_id)
);
```

#### Content Management Tables
```sql
-- Article categories
CREATE TABLE article_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    parent_id BIGINT UNSIGNED NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (parent_id) REFERENCES article_categories(id)
);

-- Articles
CREATE TABLE articles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content LONGTEXT NOT NULL,
    excerpt TEXT NULL,
    featured_image VARCHAR(500) NULL,
    author_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NULL,
    tags JSON NULL,
    target_audience ENUM('children', 'guardians', 'therapists', 'all') DEFAULT 'all',
    status ENUM('draft', 'pending', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    meta_description VARCHAR(500) NULL,
    reading_time INTEGER NULL, -- estimated reading time in minutes
    view_count INTEGER DEFAULT 0,
    reviewed_by BIGINT UNSIGNED NULL,
    reviewed_at TIMESTAMP NULL,
    rejection_reason TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES article_categories(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id),
    INDEX idx_status_published (status, published_at),
    INDEX idx_author (author_id),
    INDEX idx_category (category_id),
    FULLTEXT KEY ft_search (title, content, excerpt)
);

-- Article views tracking
CREATE TABLE article_views (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    article_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_article_date (article_id, viewed_at)
);

-- User bookmarks
CREATE TABLE user_bookmarks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    article_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_article (user_id, article_id)
);
```

## API Design

### Email Notification Endpoints
```
POST /api/admin/email-templates - Create email template
GET /api/admin/email-templates - List email templates
PUT /api/admin/email-templates/{id} - Update email template
DELETE /api/admin/email-templates/{id} - Delete email template

GET /api/user/email-preferences - Get user email preferences
PUT /api/user/email-preferences - Update email preferences

GET /api/admin/email-deliveries - View email delivery reports
POST /api/admin/email-deliveries/resend/{id} - Resend failed email
```

### Appointment and Meeting Endpoints
```
GET /api/therapists/{id}/availability - Get therapist availability
POST /api/therapists/{id}/availability - Set therapist availability
PUT /api/therapists/{id}/availability/{id} - Update availability

GET /api/appointments - List user's appointments
POST /api/appointments - Create new appointment
GET /api/appointments/{id} - Get appointment details
PUT /api/appointments/{id} - Update appointment
DELETE /api/appointments/{id} - Cancel appointment

POST /api/appointments/{id}/join - Join meeting (get meet link)
POST /api/appointments/{id}/reschedule - Reschedule appointment
POST /api/appointments/{id}/complete - Mark appointment as completed
```

### Content Management Endpoints
```
GET /api/articles - List published articles (public)
GET /api/articles/{slug} - Get article by slug (public)
POST /api/articles/{id}/view - Track article view

POST /api/content/articles - Create new article (therapist/admin)
GET /api/content/articles - List user's articles
PUT /api/content/articles/{id} - Update article
DELETE /api/content/articles/{id} - Delete article

POST /api/content/articles/{id}/submit - Submit for review
POST /api/admin/articles/{id}/approve - Approve article
POST /api/admin/articles/{id}/reject - Reject article

GET /api/content/categories - List article categories
POST /api/admin/categories - Create category (admin only)

POST /api/user/bookmarks/{articleId} - Bookmark article
DELETE /api/user/bookmarks/{articleId} - Remove bookmark
GET /api/user/bookmarks - List user bookmarks
```

## Security and Privacy Considerations

### Google Integration Security
- OAuth 2.0 with minimal scope requests (calendar.events, meet.readonly)
- Encrypted storage of Google tokens and refresh tokens
- Meeting links expire after session completion
- No recording or data retention in Google services

### Email Security
- All emails sent via encrypted SMTP
- No sensitive personal information in email content
- Unsubscribe links in all non-critical emails
- Email delivery tracking without content logging

### Content Security
- XSS protection in rich text editor
- Image upload validation and scanning
- Content approval workflow for all published material
- Version control and audit trails for content changes

## Performance and Scalability

### Email System Optimization
- Queue-based email processing with Redis
- Batch email sending for bulk notifications
- Email template caching
- Delivery retry logic with exponential backoff

### Meeting System Performance
- Google API rate limiting and caching
- Appointment conflict detection with database locks
- Calendar sync optimization
- Meeting link pre-generation for scheduled sessions

### Content System Optimization
- Full-text search indexing for articles
- Image optimization and CDN integration
- Content caching for published articles
- Lazy loading for article lists and search results

## Testing Strategy

### Email System Testing
- Email template rendering tests
- Queue processing tests
- Delivery tracking verification
- Spam filter compliance testing

### Google Integration Testing
- OAuth flow testing
- Calendar event creation/modification tests
- Meeting link generation verification
- API error handling and fallback testing

### Content Management Testing
- Rich text editor functionality
- Content approval workflow testing
- Search and filtering accuracy
- Access control verification

## Deployment Considerations

### Environment Configuration
- Google Workspace API credentials
- Email service provider configuration
- File storage for content media
- Queue worker scaling for email processing

### Monitoring and Alerting
- Email delivery rate monitoring
- Google API quota usage tracking
- Content publication workflow monitoring
- Meeting system availability alerts
