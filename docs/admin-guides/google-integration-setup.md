# Google Workspace Integration Setup Guide

## Overview
This comprehensive guide covers setting up and maintaining Google Workspace integration for SafeSpace, including Google Meet for video therapy sessions and Google Calendar for appointment management.

## Prerequisites

### Google Workspace Requirements
- **Google Workspace Account:** Business or Enterprise plan recommended
- **Admin Access:** Super Admin privileges in Google Workspace
- **Domain Verification:** Verified domain for your organization
- **API Access:** Enabled Google Cloud Console access

### SafeSpace Requirements
- **Admin Access:** SafeSpace admin account
- **Server Access:** Ability to configure environment variables
- **SSL Certificate:** HTTPS required for OAuth callbacks
- **Storage Access:** File system access for credential storage

## Initial Setup Process

### Step 1: Google Cloud Console Configuration

#### Create New Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project details:
   - **Project Name:** "SafeSpace Integration"
   - **Organization:** Your organization
   - **Location:** Your organization folder
4. Click "Create"

#### Enable Required APIs
Navigate to "APIs & Services" → "Library" and enable:
1. **Google Calendar API**
   - Manages appointment scheduling
   - Creates and updates calendar events
   - Handles availability checking

2. **Google Meet API** (if available)
   - Creates meeting links
   - Manages meeting settings
   - Handles participant management

3. **Google Drive API** (optional)
   - For file sharing during sessions
   - Document collaboration features

#### Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "Internal" for Google Workspace users
3. Fill in application information:
   - **App Name:** SafeSpace
   - **User Support Email:** Your support email
   - **Developer Contact:** Your technical contact
   - **App Domain:** Your SafeSpace domain
   - **Privacy Policy:** Link to your privacy policy
   - **Terms of Service:** Link to your terms

4. Add scopes:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
   - `https://www.googleapis.com/auth/meetings.space.created`

### Step 2: Create OAuth Credentials

#### Generate Client Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Configure application:
   - **Application Type:** Web application
   - **Name:** SafeSpace OAuth Client
   - **Authorized JavaScript Origins:**
     - `https://your-domain.com`
     - `https://safespace.yourdomain.com`
   - **Authorized Redirect URIs:**
     - `https://your-domain.com/auth/google/callback`
     - `https://your-domain.com/api/auth/google/callback`

4. Download credentials JSON file
5. Save securely for server configuration

#### Service Account Setup (Optional)
For server-to-server operations:
1. Create Service Account in Google Cloud Console
2. Generate and download service account key
3. Grant necessary permissions in Google Workspace Admin

### Step 3: SafeSpace Configuration

#### Environment Variables
Add to your `.env` file:
```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=https://your-domain.com/auth/google/callback

# Google API Configuration
GOOGLE_CALENDAR_API_KEY=your_api_key_here
GOOGLE_MEET_API_KEY=your_meet_api_key_here

# Service Account (if using)
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=/path/to/service-account-key.json

# Integration Settings
GOOGLE_INTEGRATION_ENABLED=true
GOOGLE_CALENDAR_INTEGRATION=true
GOOGLE_MEET_INTEGRATION=true
```

#### Credential File Storage
1. Create secure directory: `/storage/app/google-credentials/`
2. Set proper permissions (600 for files, 700 for directory)
3. Store credentials JSON file securely
4. Add to `.gitignore` to prevent version control exposure

#### Database Configuration
Run migrations to add Google integration fields:
```bash
php artisan migrate
```

This adds fields to appointments table:
- `google_event_id` - Calendar event identifier
- `google_meet_link` - Meeting URL
- `google_calendar_data` - Additional event metadata

## Google Workspace Admin Configuration

### Domain-Wide Delegation (if using Service Account)

#### Enable API Access
1. Go to Google Workspace Admin Console
2. Navigate to "Security" → "API Controls"
3. Click "Domain-wide Delegation"
4. Add new API client:
   - **Client ID:** Your service account client ID
   - **OAuth Scopes:** Required scopes (comma-separated)

#### Required Scopes
```
https://www.googleapis.com/auth/calendar,
https://www.googleapis.com/auth/calendar.events,
https://www.googleapis.com/auth/meetings.space.created
```

### User Access Configuration

#### Calendar Sharing Settings
1. Go to "Apps" → "Google Workspace" → "Calendar"
2. Configure sharing settings:
   - **External Sharing:** Allow as needed
   - **Default Visibility:** Private
   - **Meeting Room Management:** Enable if using rooms

#### Meet Settings
1. Navigate to "Apps" → "Google Workspace" → "Meet"
2. Configure meeting settings:
   - **External Meetings:** Allow for therapy sessions
   - **Recording:** Configure based on compliance needs
   - **Live Streaming:** Disable for privacy
   - **Meeting Length:** Set appropriate limits

## Testing the Integration

### OAuth Flow Testing

#### Test Authentication
1. Navigate to SafeSpace admin panel
2. Go to "Google Integration" settings
3. Click "Test Google Connection"
4. Complete OAuth flow
5. Verify successful authentication

#### Verify Permissions
Check that SafeSpace can:
- Read calendar availability
- Create calendar events
- Generate meeting links
- Update event details
- Delete events when appointments are cancelled

### Calendar Integration Testing

#### Create Test Appointment
1. Schedule a test therapy appointment
2. Verify calendar event is created
3. Check that meeting link is generated
4. Confirm all participants receive invitations
5. Test event updates and cancellations

#### Availability Testing
1. Set therapist availability in SafeSpace
2. Verify availability reflects in Google Calendar
3. Test conflict detection
4. Check busy time blocking

### Meeting Integration Testing

#### Meeting Creation
1. Create appointment with Google Meet
2. Verify meeting link generation
3. Test meeting access for all participants
4. Check meeting settings and permissions

#### Meeting Management
1. Test meeting link updates
2. Verify participant management
3. Check meeting recording settings (if enabled)
4. Test meeting deletion on appointment cancellation

## Ongoing Maintenance

### Regular Monitoring

#### API Usage Monitoring
1. Monitor Google Cloud Console quotas
2. Track API usage patterns
3. Set up alerts for quota limits
4. Review usage reports monthly

#### Error Monitoring
- Set up logging for Google API errors
- Monitor authentication failures
- Track meeting creation failures
- Alert on high error rates

### Security Maintenance

#### Credential Rotation
**OAuth Credentials:**
- Rotate client secrets annually
- Update redirect URIs as needed
- Monitor for unauthorized access

**Service Account Keys:**
- Rotate service account keys every 90 days
- Use key rotation automation if possible
- Maintain secure key storage

#### Access Review
- Review Google Workspace permissions quarterly
- Audit service account access
- Remove unused credentials
- Update user access as needed

### Performance Optimization

#### API Efficiency
- Implement request caching where appropriate
- Use batch operations for multiple events
- Optimize calendar queries
- Monitor response times

#### Rate Limit Management
- Implement exponential backoff
- Use request queuing for high volume
- Monitor quota usage
- Plan for peak usage periods

## Troubleshooting Common Issues

### Authentication Problems

#### "OAuth Error: Invalid Client"
**Causes:**
- Incorrect client ID or secret
- Mismatched redirect URI
- Expired or revoked credentials

**Solutions:**
1. Verify client credentials in Google Cloud Console
2. Check redirect URI configuration
3. Regenerate credentials if necessary
4. Update SafeSpace configuration

#### "Insufficient Permissions"
**Causes:**
- Missing required scopes
- User hasn't granted permissions
- Service account lacks domain-wide delegation

**Solutions:**
1. Review and update OAuth scopes
2. Re-authenticate users
3. Configure domain-wide delegation
4. Check Google Workspace admin settings

### Calendar Integration Issues

#### "Events Not Creating"
**Diagnostic Steps:**
1. Check Google Calendar API quotas
2. Verify calendar permissions
3. Review error logs for API responses
4. Test with minimal event data

**Common Fixes:**
- Ensure calendar exists and is accessible
- Check event data format and required fields
- Verify timezone handling
- Update API credentials

#### "Availability Not Syncing"
**Troubleshooting:**
1. Check calendar sharing settings
2. Verify busy time detection
3. Review calendar access permissions
4. Test with different calendar views

### Meeting Integration Issues

#### "Meeting Links Not Generating"
**Possible Causes:**
- Google Meet API not enabled
- Insufficient permissions
- Meeting creation limits reached
- Invalid meeting parameters

**Resolution Steps:**
1. Verify Google Meet API status
2. Check meeting creation quotas
3. Review meeting parameters
4. Test with minimal meeting data

#### "Participants Can't Join"
**Common Issues:**
- Meeting link expired or invalid
- Participant not authorized
- Meeting settings too restrictive
- Network connectivity issues

**Solutions:**
1. Regenerate meeting links
2. Check participant permissions
3. Review meeting access settings
4. Provide alternative access methods

### Performance Issues

#### "Slow API Responses"
**Optimization Strategies:**
- Implement response caching
- Use batch API requests
- Optimize query parameters
- Monitor API performance metrics

#### "Quota Exceeded Errors"
**Management Approaches:**
- Implement request queuing
- Use exponential backoff
- Monitor quota usage patterns
- Request quota increases if needed

## Security Best Practices

### Credential Security
- Store credentials in secure, encrypted storage
- Use environment variables for sensitive data
- Implement credential rotation policies
- Monitor for credential exposure

### API Security
- Use HTTPS for all API communications
- Implement proper error handling
- Log security events
- Regular security audits

### User Privacy
- Minimize data collection and storage
- Implement data retention policies
- Provide user control over data sharing
- Comply with healthcare privacy regulations

## Compliance Considerations

### HIPAA Compliance
- Ensure Google Workspace BAA is in place
- Configure appropriate data handling
- Implement audit logging
- Regular compliance reviews

### Data Protection
- Understand data residency requirements
- Implement appropriate data controls
- Regular privacy impact assessments
- User consent management

## Support and Resources

### Google Support
- **Google Workspace Support:** For admin and configuration issues
- **Google Cloud Support:** For API and technical issues
- **Developer Documentation:** Latest API documentation and guides

### SafeSpace Support
- **Technical Support:** For integration configuration help
- **Documentation:** Internal guides and troubleshooting
- **Community:** Developer forums and discussions

### Emergency Procedures
- **Service Outage:** Fallback procedures for Google service interruptions
- **Security Incident:** Response procedures for security issues
- **Data Breach:** Incident response and notification procedures

---

*Last updated: November 2025*
*This guide should be reviewed quarterly and updated as Google APIs and SafeSpace features evolve.*