# Email Template Management Guide

## Overview

SafeSpace uses a comprehensive email notification system with customizable templates. This guide covers how to manage email templates as an administrator.

## Accessing Email Template Management

1. **Login as Admin**: Use your admin credentials to access the SafeSpace platform
2. **Navigate to Admin Panel**: Go to `/admin/email-templates`
3. **Template Dashboard**: View all available email templates

## Email Template Types

### 1. Authentication & Account Templates
- **Welcome Email**: Sent to new guardians upon registration
- **Account Verification**: Email verification for new accounts
- **Password Reset**: Password reset instructions
- **Therapist Activation**: Account activation for approved therapists

### 2. Appointment & Meeting Templates
- **Appointment Confirmation**: Confirms scheduled therapy sessions
- **Appointment Reminder (24h)**: Reminder sent 24 hours before session
- **Appointment Reminder (1h)**: Final reminder with Google Meet link
- **Appointment Cancellation**: Notifies participants of cancelled sessions

### 3. Emergency & Alert Templates
- **Panic Alert**: Immediate notification for emergency situations
- **Emergency Contact Alert**: Alerts for crisis situations
- **System Maintenance**: Planned maintenance notifications

### 4. Content & Communication Templates
- **Content Published**: Notifies users of new articles
- **Content Review**: Admin notifications for pending content
- **Content Approved/Rejected**: Author notifications for content decisions

## Managing Email Templates

### Creating New Templates

1. **Access Template Creation**:
   ```
   POST /api/admin/email-templates
   ```

2. **Required Fields**:
   - `name`: Unique template identifier
   - `subject`: Email subject line
   - `html_content`: HTML email body
   - `text_content`: Plain text fallback
   - `category`: Template category
   - `variables`: Available template variables

3. **Template Variables**:
   ```json
   {
     "user_name": "Recipient's name",
     "appointment_date": "Appointment date and time",
     "therapist_name": "Therapist's name",
     "meeting_link": "Google Meet link",
     "platform_url": "SafeSpace platform URL",
     "article_title": "Article title",
     "article_url": "Article URL"
   }
   ```

### Editing Existing Templates

1. **Navigate to Template**: Click on template name in admin dashboard
2. **Edit Content**: Modify subject, HTML content, or text content
3. **Preview Changes**: Use preview function to test template
4. **Save Changes**: Click "Save Template"

### Template Variables Usage

Use variables in templates with double curly braces:
```html
<h1>Hello {{user_name}}!</h1>
<p>Your appointment with {{therapist_name}} is scheduled for {{appointment_date}}.</p>
<a href="{{meeting_link}}">Join Meeting</a>
```

### Testing Templates

1. **Preview Function**: Use built-in preview with sample data
2. **Test Send**: Send test email to your admin account
3. **Variable Check**: Ensure all variables are properly replaced

## Email Delivery Management

### Monitoring Email Delivery

1. **Delivery Dashboard**: Access at `/admin/email-deliveries`
2. **Delivery Status**: Track sent, delivered, failed, and bounced emails
3. **Retry Failed Emails**: Manually retry failed deliveries

### Delivery Status Types
- **Pending**: Email queued for sending
- **Sent**: Email sent to provider
- **Delivered**: Email successfully delivered
- **Failed**: Delivery failed (temporary)
- **Bounced**: Email bounced (permanent failure)

### Troubleshooting Delivery Issues

1. **Check Email Provider Status**: Verify SendGrid/Mailgun status
2. **Review Error Messages**: Check delivery logs for specific errors
3. **Validate Email Addresses**: Ensure recipient emails are valid
4. **Check Spam Filters**: Verify emails aren't being filtered

## User Email Preferences

### Managing User Preferences

Users can control their email preferences at `/settings/email-preferences`:

- **Appointment Reminders**: Session notifications
- **Message Notifications**: New message alerts
- **Content Updates**: New article notifications
- **Emergency Alerts**: Crisis notifications (cannot be disabled)
- **Marketing Emails**: Promotional content

### Bulk Preference Management

Admins can view and modify user preferences:
```
GET /api/admin/user-email-preferences
PUT /api/admin/user-email-preferences/{userId}
```

## Email Queue Management

### Queue Configuration

1. **Queue Driver**: Configure in `.env` file
   ```
   QUEUE_CONNECTION=redis
   ```

2. **Queue Workers**: Start queue processing
   ```bash
   php artisan queue:work
   ```

3. **Supervisor Configuration**: Ensure queue workers restart automatically

### Queue Monitoring

1. **Queue Dashboard**: Monitor job processing
2. **Failed Jobs**: Review and retry failed email jobs
3. **Queue Performance**: Monitor processing times and throughput

## Compliance & Best Practices

### GDPR Compliance

1. **Unsubscribe Links**: All non-critical emails include unsubscribe
2. **Data Retention**: Email delivery logs retained for 90 days
3. **User Consent**: Users can opt-out of non-essential emails

### Email Best Practices

1. **Subject Lines**: Keep under 50 characters
2. **Mobile Optimization**: Ensure templates are mobile-responsive
3. **Plain Text**: Always include plain text version
4. **Branding**: Maintain consistent SafeSpace branding
5. **Accessibility**: Use proper HTML structure and alt text

### Security Considerations

1. **Template Validation**: Sanitize all template content
2. **Variable Escaping**: Prevent XSS in dynamic content
3. **Rate Limiting**: Prevent email spam and abuse
4. **Authentication**: Secure admin access to template management

## Troubleshooting Common Issues

### Template Not Sending

1. **Check Template Status**: Ensure template is active
2. **Verify Variables**: Confirm all required variables are provided
3. **Review Queue**: Check if emails are stuck in queue
4. **Test Template**: Send test email to verify functionality

### Variable Not Replacing

1. **Check Variable Name**: Ensure exact match with template variables
2. **Verify Data Source**: Confirm variable data is available
3. **Template Syntax**: Use correct `{{variable_name}}` format

### High Bounce Rate

1. **Email Validation**: Implement stronger email validation
2. **List Hygiene**: Remove invalid email addresses
3. **Content Review**: Check if content triggers spam filters
4. **Sender Reputation**: Monitor email provider reputation

## API Reference

### Template Management Endpoints

```
GET    /api/admin/email-templates          # List all templates
POST   /api/admin/email-templates          # Create new template
GET    /api/admin/email-templates/{id}     # Get specific template
PUT    /api/admin/email-templates/{id}     # Update template
DELETE /api/admin/email-templates/{id}     # Delete template
GET    /api/admin/email-templates/{id}/preview # Preview template
```

### Delivery Management Endpoints

```
GET    /api/admin/email-deliveries         # List deliveries
POST   /api/admin/email-deliveries/resend/{id} # Resend failed email
GET    /api/admin/email-deliveries/stats   # Delivery statistics
```

## Support & Maintenance

### Regular Maintenance Tasks

1. **Weekly**: Review delivery statistics and failed emails
2. **Monthly**: Clean up old delivery logs
3. **Quarterly**: Review and update email templates
4. **Annually**: Audit email compliance and security

### Getting Help

1. **System Logs**: Check Laravel logs for email errors
2. **Provider Logs**: Review SendGrid/Mailgun delivery logs
3. **Documentation**: Refer to email provider documentation
4. **Support**: Contact technical support for complex issues

---

**Last Updated**: November 2025  
**Version**: 1.0  
**Contact**: admin@safespace.app