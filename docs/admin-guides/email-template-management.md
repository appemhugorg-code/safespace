# Email Template Management Guide

## Overview
This guide covers how to manage email templates in SafeSpace, including creating, editing, and maintaining the automated email system that keeps users informed and engaged.

## Accessing Email Template Management

### Admin Dashboard
1. Log into SafeSpace with admin credentials
2. Navigate to "Admin Dashboard"
3. Select "Email Management" from the sidebar
4. Click on "Email Templates"

### Direct Access
- URL: `/admin/email-templates`
- Requires admin role and active status

## Understanding Email Templates

### Template System Architecture
SafeSpace uses a template-based email system where:
- **Templates** define the structure and content
- **Variables** are replaced with dynamic content
- **Triggers** determine when emails are sent
- **Preferences** control who receives what emails

### Template Categories

#### 1. Authentication & Account (auth)
- **welcome_email:** New user welcome message
- **account_verification:** Email verification requests
- **password_reset:** Password reset instructions
- **therapist_activation:** Therapist account approval
- **child_account_created:** Child account notifications

#### 2. Appointments (appointments)
- **appointment_confirmation:** Booking confirmations
- **appointment_reminder_24h:** 24-hour reminders
- **appointment_reminder_1h:** 1-hour reminders with meeting links
- **appointment_cancelled:** Cancellation notifications
- **appointment_rescheduled:** Rescheduling confirmations

#### 3. Emergency & Alerts (emergency)
- **panic_alert:** Crisis situation notifications
- **emergency_contact:** Emergency contact alerts
- **system_maintenance:** Maintenance notifications

#### 4. Communication (communication)
- **new_message:** Message notifications
- **group_invitation:** Group join invitations
- **comment_notification:** Article comment alerts

#### 5. Content (content)
- **content_published:** New article notifications
- **content_approved:** Author approval notifications
- **content_rejected:** Author rejection notifications
- **newsletter_digest:** Newsletter emails

## Managing Email Templates

### Viewing Templates

#### Template List View
The main template page shows:
- **Template Name:** Descriptive name for identification
- **Category:** Grouping for organization
- **Status:** Active/Inactive status
- **Last Modified:** When template was last updated
- **Usage Count:** How many times template has been used
- **Actions:** Edit, Preview, Duplicate, Delete options

#### Template Details
Click any template to view:
- Full template content (HTML and text versions)
- Available variables and their descriptions
- Usage statistics and performance metrics
- Recent sending history
- Associated triggers and conditions

### Creating New Templates

#### Step 1: Basic Information
1. Click "Create New Template"
2. Enter template details:
   - **Name:** Descriptive internal name
   - **Category:** Select appropriate category
   - **Description:** Purpose and usage notes
   - **Status:** Active or Inactive

#### Step 2: Email Content
**Subject Line:**
- Keep under 50 characters for best display
- Use variables for personalization
- Make it clear and action-oriented
- Test across different email clients

**HTML Content:**
- Use the rich text editor for formatting
- Include SafeSpace branding elements
- Ensure mobile-responsive design
- Add clear call-to-action buttons

**Text Content:**
- Provide plain text alternative
- Include all important information
- Format for readability without HTML
- Test with screen readers

#### Step 3: Variables Setup
**Available Variables:**
- `{{user_name}}` - Recipient's full name
- `{{user_email}}` - Recipient's email address
- `{{platform_url}}` - SafeSpace platform URL
- `{{appointment_date}}` - Formatted appointment date/time
- `{{therapist_name}}` - Assigned therapist name
- `{{child_name}}` - Child's name (for guardian emails)
- `{{meeting_link}}` - Google Meet link
- `{{unsubscribe_url}}` - Unsubscribe link

**Custom Variables:**
- Add template-specific variables as needed
- Document variable purpose and format
- Test variable replacement thoroughly

### Editing Existing Templates

#### Making Changes
1. Select template from list
2. Click "Edit Template"
3. Modify content as needed
4. Preview changes before saving
5. Test with sample data
6. Save and activate

#### Version Control
- All changes are tracked with timestamps
- Previous versions can be restored
- Change log shows who made modifications
- Rollback feature for emergency situations

#### Testing Changes
**Preview Function:**
- See how email will appear to recipients
- Test with different variable values
- Check mobile and desktop rendering
- Verify all links work correctly

**Test Sending:**
- Send test emails to admin accounts
- Verify formatting and content
- Check spam filter compatibility
- Test across different email clients

### Template Variables and Personalization

#### Standard Variables
All templates have access to:
```
{{user_name}} - Full name of recipient
{{user_email}} - Email address
{{user_role}} - User's role (guardian, therapist, etc.)
{{platform_name}} - "SafeSpace"
{{platform_url}} - https://safespace.app
{{support_email}} - support@safespace.app
{{current_date}} - Today's date
{{current_year}} - Current year
```

#### Appointment-Specific Variables
For appointment-related emails:
```
{{appointment_id}} - Unique appointment identifier
{{appointment_date}} - Formatted date (e.g., "Monday, Nov 15, 2025")
{{appointment_time}} - Formatted time (e.g., "2:00 PM EST")
{{appointment_duration}} - Session length (e.g., "60 minutes")
{{therapist_name}} - Therapist's full name
{{therapist_email}} - Therapist's email
{{child_name}} - Child's name (for family appointments)
{{guardian_name}} - Guardian's name
{{meeting_link}} - Google Meet URL
{{appointment_type}} - Individual, family, group, consultation
```

#### Content-Specific Variables
For content and article emails:
```
{{article_title}} - Article title
{{article_url}} - Direct link to article
{{article_excerpt}} - Brief summary
{{author_name}} - Article author
{{category_name}} - Article category
{{reading_time}} - Estimated reading time
```

#### Emergency Variables
For crisis and emergency emails:
```
{{alert_type}} - Type of emergency alert
{{alert_message}} - Emergency message content
{{child_name}} - Child who triggered alert
{{guardian_name}} - Primary guardian
{{therapist_name}} - Assigned therapist
{{emergency_contacts}} - List of emergency contacts
{{timestamp}} - When alert was triggered
```

### Email Delivery Management

#### Delivery Settings
**Send Timing:**
- Immediate delivery for urgent emails
- Scheduled delivery for reminders
- Batch processing for newsletters
- Queue management for high volume

**Retry Logic:**
- Automatic retry for failed deliveries
- Exponential backoff for temporary failures
- Maximum retry attempts (default: 3)
- Dead letter queue for permanent failures

#### Monitoring Delivery
**Delivery Statistics:**
- Total emails sent per template
- Delivery success rates
- Bounce rates and reasons
- Open rates (when tracking enabled)
- Click-through rates for links

**Failed Delivery Handling:**
- Automatic retry for soft bounces
- Immediate stop for hard bounces
- User notification for delivery issues
- Admin alerts for high failure rates

### Template Performance Analytics

#### Key Metrics
**Engagement Metrics:**
- **Open Rate:** Percentage of emails opened
- **Click Rate:** Percentage who clicked links
- **Unsubscribe Rate:** Percentage who unsubscribed
- **Bounce Rate:** Percentage of failed deliveries

**Performance Tracking:**
- Template usage frequency
- Average delivery time
- Peak sending times
- User engagement patterns

#### Optimization Recommendations
**Subject Line Optimization:**
- A/B test different subject lines
- Monitor open rates by subject
- Avoid spam trigger words
- Keep length under 50 characters

**Content Optimization:**
- Track click-through rates on links
- Monitor time spent reading
- Test different call-to-action buttons
- Optimize for mobile devices

### Compliance and Legal Requirements

#### Email Regulations
**CAN-SPAM Compliance:**
- Include physical address in footer
- Provide clear unsubscribe mechanism
- Honor unsubscribe requests within 10 days
- Use accurate "From" information

**GDPR Compliance:**
- Obtain proper consent for marketing emails
- Provide data processing information
- Allow users to access their email data
- Enable data deletion requests

#### Healthcare Compliance
**HIPAA Considerations:**
- Never include PHI in email content
- Use secure email transmission
- Log all email communications
- Maintain audit trails

**Child Protection:**
- Special handling for emails to minors
- Guardian consent for child communications
- Age-appropriate content filtering
- Enhanced privacy protections

### Troubleshooting Common Issues

#### Template Problems

**"Variables Not Replacing"**
- Check variable syntax (use double curly braces)
- Verify variable names match exactly
- Ensure data is available for replacement
- Test with sample data

**"Emails Look Broken"**
- Check HTML syntax and structure
- Test across different email clients
- Verify CSS compatibility
- Use email-safe HTML practices

**"High Bounce Rate"**
- Verify email addresses are valid
- Check for spam filter issues
- Review email content for spam triggers
- Monitor sender reputation

#### Delivery Issues

**"Emails Not Sending"**
- Check email service configuration
- Verify queue workers are running
- Review error logs for failures
- Test email service connectivity

**"Slow Email Delivery"**
- Monitor queue processing speed
- Check for bottlenecks in system
- Review email service limits
- Optimize template processing

### Best Practices

#### Template Design
**Content Guidelines:**
- Keep emails concise and focused
- Use clear, action-oriented language
- Include relevant SafeSpace branding
- Ensure accessibility compliance

**Technical Best Practices:**
- Always provide text alternative
- Use responsive design principles
- Test across multiple email clients
- Optimize images for email

#### Maintenance Schedule
**Regular Tasks:**
- Review template performance monthly
- Update content for seasonal relevance
- Test all templates quarterly
- Archive unused templates

**Emergency Procedures:**
- Have rollback plan for template changes
- Monitor delivery rates after updates
- Maintain emergency contact procedures
- Document all template modifications

### Security Considerations

#### Template Security
**Access Control:**
- Limit template editing to authorized admins
- Log all template modifications
- Require approval for sensitive templates
- Regular access review and cleanup

**Content Security:**
- Sanitize all user-generated content
- Validate template variables
- Prevent code injection attacks
- Monitor for suspicious template changes

#### Email Security
**Transmission Security:**
- Use encrypted email transmission
- Implement SPF, DKIM, and DMARC
- Monitor for email spoofing attempts
- Regular security audits

---

*Last updated: November 2025*
*This guide should be reviewed and updated quarterly to ensure accuracy and compliance.*