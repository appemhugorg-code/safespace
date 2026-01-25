# SafeSpace UAT Quick Start Guide

## 🎯 Overview

This guide provides UAT coordinators and testers with everything needed to quickly start testing SafeSpace. The UAT environment is pre-configured with realistic test data and ready for comprehensive acceptance testing.

## 🚀 Getting Started

### 1. Access the UAT Environment

**UAT Environment URL:** `http://localhost:8080` (or your configured domain)

**Health Check:** `http://localhost:8080/health`

**Environment Info:** `http://localhost:8080/uat/info`

### 2. Test User Accounts

All test accounts use the same password pattern for easy testing:

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| **Admin** | `admin-uat@safespace.com` | `UATAdmin2024!` | System administration and user management |
| **Therapist 1** | `therapist1-uat@safespace.com` | `UATTherapist2024!` | Primary therapist workflow testing |
| **Therapist 2** | `therapist2-uat@safespace.com` | `UATTherapist2024!` | Multi-therapist scenario testing |
| **Guardian 1** | `guardian1-uat@safespace.com` | `UATGuardian2024!` | Parent/guardian workflow testing |
| **Guardian 2** | `guardian2-uat@safespace.com` | `UATGuardian2024!` | Multi-family scenario testing |
| **Child 1** | `child1-uat@safespace.com` | `UATChild2024!` | Child user experience (10 years old) |
| **Child 2** | `child2-uat@safespace.com` | `UATChild2024!` | Child user experience (12 years old) |

### 3. Family Relationships

The test data includes realistic family relationships:

- **Guardian 1** (Jennifer Smith) → **Child 1** (Emma Smith)
- **Guardian 2** (Robert Williams) → **Child 2** (Alex Williams)
- **Therapist 1** (Dr. Sarah Johnson) → Assigned to both children
- **Therapist 2** (Dr. Michael Chen) → Available for additional testing

## 📋 UAT Testing Checklist

### Phase 1: Basic Functionality (Week 1)

#### Authentication & User Management
- [ ] **Admin Login** - Test admin dashboard access and user management
- [ ] **Therapist Registration** - Test therapist signup and approval workflow
- [ ] **Guardian Registration** - Test guardian account creation and child linking
- [ ] **Child Account Creation** - Test child account setup with guardian approval
- [ ] **Password Reset** - Test forgot password functionality for all roles
- [ ] **Email Verification** - Test email verification process

#### Role-Based Access Control
- [ ] **Admin Permissions** - Verify admin can access all system functions
- [ ] **Therapist Permissions** - Verify therapist can only access assigned clients
- [ ] **Guardian Permissions** - Verify guardian can only access their children's data
- [ ] **Child Permissions** - Verify child can only access age-appropriate features

### Phase 2: Core Features (Week 2)

#### Mood Tracking System
- [ ] **Daily Mood Logging** - Test child mood entry with emoji selector
- [ ] **Mood History** - Test mood trend visualization and analytics
- [ ] **Streak Tracking** - Test mood logging streak rewards
- [ ] **Guardian Monitoring** - Test guardian access to child mood data
- [ ] **Therapist Analytics** - Test therapist mood trend analysis tools

#### Appointment Management
- [ ] **Therapist Availability** - Test therapist schedule management
- [ ] **Appointment Booking** - Test guardian appointment request process
- [ ] **Google Meet Integration** - Test video session link generation
- [ ] **Appointment Reminders** - Test email notifications (24h and 1h before)
- [ ] **Calendar Sync** - Test Google Calendar integration
- [ ] **Appointment Cancellation** - Test cancellation and rescheduling

#### Communication System
- [ ] **Real-time Messaging** - Test instant messaging between users
- [ ] **Message Moderation** - Test content filtering and flagging
- [ ] **Group Conversations** - Test family and therapy team chats
- [ ] **Emergency Alerts** - Test panic button and crisis notifications
- [ ] **Message History** - Test conversation archiving and search

### Phase 3: Advanced Features (Week 3)

#### Content Management
- [ ] **Article Creation** - Test content creation by therapists
- [ ] **Content Moderation** - Test admin content approval workflow
- [ ] **Content Discovery** - Test search and filtering functionality
- [ ] **User Bookmarks** - Test content saving and organization
- [ ] **Reading Analytics** - Test view tracking and engagement metrics

#### Email Notifications
- [ ] **Welcome Emails** - Test new user onboarding emails
- [ ] **Appointment Confirmations** - Test booking confirmation emails
- [ ] **Panic Alert Emails** - Test emergency notification delivery
- [ ] **Email Preferences** - Test notification settings management
- [ ] **Email Templates** - Test professional formatting and branding

#### Security & Privacy
- [ ] **Data Encryption** - Test secure data transmission
- [ ] **COPPA Compliance** - Test child data protection measures
- [ ] **Content Filtering** - Test inappropriate content detection
- [ ] **Audit Logging** - Test activity tracking and monitoring
- [ ] **Privacy Controls** - Test data visibility and access controls

### Phase 4: Integration & Performance (Week 4)

#### Third-Party Integrations
- [ ] **Google Workspace** - Test Calendar and Meet functionality
- [ ] **Email Delivery** - Test Resend integration reliability
- [ ] **OAuth Authentication** - Test Google login integration
- [ ] **API Endpoints** - Test external service connections

#### Mobile & Accessibility
- [ ] **Mobile Responsiveness** - Test on various screen sizes
- [ ] **Touch Interactions** - Test mobile-friendly interface elements
- [ ] **Accessibility Compliance** - Test screen reader compatibility
- [ ] **Keyboard Navigation** - Test non-mouse navigation
- [ ] **Color Contrast** - Test WCAG 2.1 AA compliance

#### Performance & Scalability
- [ ] **Load Testing** - Test with multiple concurrent users
- [ ] **Response Times** - Test page load and API response speeds
- [ ] **Database Performance** - Test query optimization
- [ ] **Memory Usage** - Test resource consumption under load

## 🛠️ Testing Tools & Resources

### Browser Testing
- **Recommended Browsers:** Chrome, Firefox, Safari, Edge
- **Mobile Testing:** iOS Safari, Android Chrome
- **Screen Sizes:** 320px (mobile), 768px (tablet), 1024px+ (desktop)

### Email Testing
- **Test Email Command:** `docker compose -f docker compose.uat.yml exec uat-app php artisan uat:test-email your-email@example.com --role=admin`
- **Email Clients:** Gmail, Outlook, Apple Mail, mobile clients

### Performance Testing
- **Health Check:** `curl http://localhost:8080/health`
- **Load Testing:** Use browser dev tools or external tools
- **Memory Monitoring:** Check Docker container stats

## 🐛 Issue Reporting

### Issue Categories
- **Critical:** System crashes, data loss, security vulnerabilities
- **High:** Major functionality broken, user workflow blocked
- **Medium:** Minor functionality issues, UI/UX problems
- **Low:** Cosmetic issues, enhancement suggestions

### Required Information
1. **User Role:** Which test account were you using?
2. **Browser:** Browser name and version
3. **Steps to Reproduce:** Detailed step-by-step instructions
4. **Expected Result:** What should have happened?
5. **Actual Result:** What actually happened?
6. **Screenshots:** Visual evidence of the issue
7. **Console Errors:** Any browser console errors

### Issue Reporting Template
```
**Issue Title:** Brief description of the problem

**Severity:** Critical/High/Medium/Low

**User Role:** Admin/Therapist/Guardian/Child

**Browser:** Chrome 120.0.6099.109 (example)

**Steps to Reproduce:**
1. Login as admin-uat@safespace.com
2. Navigate to User Management
3. Click "Approve User" button
4. ...

**Expected Result:** User should be approved and status updated

**Actual Result:** Error message appears and user remains pending

**Screenshots:** [Attach screenshots]

**Console Errors:** [Copy any browser console errors]

**Additional Notes:** Any other relevant information
```

## 📞 Support Contacts

### UAT Coordination Team
- **Primary Contact:** uat-coordinator@safespace.com
- **Technical Issues:** uat-support@safespace.com
- **Emergency Contact:** [Phone number for critical issues]

### Response Times
- **Critical Issues:** 2 hours
- **High Priority:** 4 hours
- **Medium Priority:** 24 hours
- **Low Priority:** 48 hours

## 📊 UAT Progress Tracking

### Daily Standup Questions
1. What did you test yesterday?
2. What are you testing today?
3. Are there any blockers or issues?
4. Do you need any additional resources or support?

### Weekly Review Topics
1. Test completion percentage
2. Critical and high-priority issues
3. Performance and usability feedback
4. Integration testing results
5. Customer satisfaction and concerns

## ✅ Sign-off Criteria

### Minimum Requirements for UAT Approval
- [ ] **95% test pass rate** across all test cases
- [ ] **Zero critical issues** unresolved
- [ ] **Maximum 2 high-priority issues** unresolved
- [ ] **All security requirements** validated
- [ ] **Performance benchmarks** met
- [ ] **Accessibility standards** compliant
- [ ] **Customer stakeholder approval** obtained

### Final Deliverables
1. **UAT Execution Report** - Complete test results and metrics
2. **Issue Register** - All identified issues and their resolution status
3. **Performance Report** - Load testing and benchmark results
4. **Security Assessment** - Vulnerability scan and compliance validation
5. **Customer Approval Certificate** - Formal sign-off documentation

## 🎉 Go-Live Preparation

Once UAT is successfully completed:

1. **Production Deployment** - Deploy to live environment
2. **Data Migration** - Transfer any required data
3. **DNS Configuration** - Point domain to production servers
4. **SSL Certificates** - Install production SSL certificates
5. **Monitoring Setup** - Configure production monitoring and alerts
6. **User Training** - Conduct end-user training sessions
7. **Support Documentation** - Provide ongoing support materials

---

**Happy Testing! 🧪**

*This UAT environment is designed to provide a comprehensive testing experience. If you have any questions or need assistance, don't hesitate to reach out to the UAT coordination team.*