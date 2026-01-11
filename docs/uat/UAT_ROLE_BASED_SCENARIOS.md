# SafeSpace UAT Role-Based Test Scenarios

## 🎭 Overview

This document provides comprehensive role-based test scenarios for SafeSpace UAT. Each scenario is designed to validate user workflows from the perspective of specific user roles, ensuring that the platform meets the unique needs and expectations of each user type.

## 👑 Admin User Test Scenarios

### Admin Scenario 1: System Administration and User Management
**Test Case IDs**: TC-AUTH-001, TC-USER-001, TC-USER-004, TC-USER-005
**Duration**: 45 minutes
**Tester Profile**: System administrator with healthcare IT experience

#### Scenario Description
As a SafeSpace system administrator, I need to manage user accounts, approve registrations, and oversee system operations to ensure the platform operates securely and efficiently.

#### Test Flow
1. **Login and Dashboard Access**
   - Navigate to SafeSpace login page
   - Login with admin credentials (admin-uat@safespace.com)
   - Verify admin dashboard displays system overview
   - Confirm access to admin-only navigation items

2. **User Registration Approval**
   - Navigate to pending user approvals
   - Review therapist registration (therapist3-uat@safespace.com)
   - Verify user profile information and credentials
   - Approve therapist registration
   - Confirm approval email is sent

3. **Family Relationship Management**
   - Access user management section
   - Create new guardian account
   - Link child account to guardian
   - Verify family relationship is established
   - Test guardian access to child data

4. **Therapist-Client Assignment**
   - Navigate to therapist management
   - View therapist caseloads
   - Assign child to therapist
   - Verify assignment notifications are sent
   - Confirm therapist can access child data

5. **User Account Management**
   - Search for specific user account
   - Update user profile information
   - Temporarily deactivate user account
   - Reactivate user account
   - Verify account status changes

#### Expected Outcomes
- Admin can successfully manage all user types
- Approval workflows function correctly
- Family relationships are properly established
- Therapist assignments work as expected
- Account management operations complete successfully

#### Success Criteria
- All user management functions work without errors
- Proper notifications are sent for all actions
- Data integrity is maintained throughout operations
- Admin has appropriate access to all system functions

---

### Admin Scenario 2: System Monitoring and Security Oversight
**Test Case IDs**: TC-SEC-004, TC-COMM-002, TC-CONT-002
**Duration**: 30 minutes
**Tester Profile**: Security-focused administrator

#### Scenario Description
As a system administrator, I need to monitor platform security, review flagged content, and ensure compliance with child safety regulations.

#### Test Flow
1. **Security Dashboard Review**
   - Access security monitoring dashboard
   - Review recent login attempts and failures
   - Check audit logs for suspicious activity
   - Verify security alerts are functioning

2. **Content Moderation**
   - Navigate to content moderation queue
   - Review flagged messages and content
   - Approve appropriate content
   - Remove inappropriate content
   - Document moderation decisions

3. **User Safety Monitoring**
   - Review panic alert history
   - Check emergency response logs
   - Verify crisis intervention procedures
   - Confirm guardian notifications are working

#### Expected Outcomes
- Security monitoring tools provide clear visibility
- Content moderation workflow is efficient
- Emergency systems are properly configured
- Audit trails are comprehensive and accessible

---

## 🩺 Therapist User Test Scenarios

### Therapist Scenario 1: Client Management and Session Preparation
**Test Case IDs**: TC-APPT-001, TC-APPT-003, TC-MOOD-006, TC-COMM-001
**Duration**: 40 minutes
**Tester Profile**: Licensed mental health professional

#### Scenario Description
As a therapist, I need to manage my availability, schedule appointments with clients, review their progress, and communicate with families to provide effective mental health support.

#### Test Flow
1. **Availability Management**
   - Login with therapist credentials (therapist1-uat@safespace.com)
   - Navigate to availability settings
   - Set weekly availability schedule (Mon-Fri 9 AM-5 PM)
   - Add Saturday morning availability (10 AM-2 PM)
   - Block out vacation time for next month

2. **Client Progress Review**
   - Access client dashboard
   - Review Emma Smith's mood tracking data
   - Analyze mood trends over past 30 days
   - Identify patterns and concerning periods
   - Prepare session notes based on data

3. **Appointment Scheduling**
   - View appointment requests from guardians
   - Approve appointment request for Alex Williams
   - Schedule follow-up session with Emma Smith
   - Verify Google Meet links are generated
   - Confirm appointment confirmations are sent

4. **Family Communication**
   - Send message to Jennifer Smith about Emma's progress
   - Respond to guardian questions about therapy approach
   - Share session summary with appropriate family members
   - Schedule family consultation session

#### Expected Outcomes
- Therapist can efficiently manage their schedule
- Client data is easily accessible and analyzable
- Appointment system works seamlessly
- Communication with families is secure and effective

#### Success Criteria
- Availability settings save and display correctly
- Mood data visualization is clear and actionable
- Google Meet integration works without issues
- Messages are delivered securely to appropriate recipients

---

### Therapist Scenario 2: Content Creation and Crisis Response
**Test Case IDs**: TC-CONT-001, TC-COMM-005, TC-EMAIL-003
**Duration**: 35 minutes
**Tester Profile**: Experienced child therapist

#### Scenario Description
As a therapist, I need to create educational content for families and respond appropriately to crisis situations involving my clients.

#### Test Flow
1. **Educational Content Creation**
   - Navigate to content management section
   - Create new article: "Managing School Anxiety in Children"
   - Add appropriate tags and categories
   - Set target audience (guardians and children)
   - Submit for admin approval

2. **Crisis Response Simulation**
   - Receive panic alert notification from child client
   - Access emergency response dashboard
   - Review child's location and recent mood data
   - Contact guardian immediately
   - Document crisis intervention steps
   - Follow up with appropriate resources

3. **Resource Sharing**
   - Share relevant articles with specific families
   - Create personalized resource recommendations
   - Send coping strategy reminders to children
   - Schedule check-in appointments

#### Expected Outcomes
- Content creation workflow is intuitive and efficient
- Crisis alerts are received immediately and clearly
- Emergency response tools are readily accessible
- Resource sharing enhances family support

---

## 👨‍👩‍👧‍👦 Guardian User Test Scenarios

### Guardian Scenario 1: Child Monitoring and Appointment Management
**Test Case IDs**: TC-MOOD-003, TC-MOOD-005, TC-APPT-002, TC-COMM-001
**Duration**: 35 minutes
**Tester Profile**: Parent of child receiving mental health services

#### Scenario Description
As a guardian, I need to monitor my child's emotional wellbeing, schedule therapy appointments, and communicate with their therapist to support their mental health journey.

#### Test Flow
1. **Child Progress Monitoring**
   - Login with guardian credentials (guardian1-uat@safespace.com)
   - Access child dashboard for Emma Smith
   - Review recent mood entries and trends
   - Check mood logging consistency
   - Identify concerning patterns or improvements

2. **Appointment Scheduling**
   - Navigate to appointment booking
   - View Dr. Johnson's available time slots
   - Schedule weekly therapy session for Emma
   - Request specific time preference
   - Confirm appointment details and Google Meet link

3. **Therapist Communication**
   - Send message to Dr. Johnson about Emma's recent behavior
   - Ask questions about therapy progress
   - Share observations from home environment
   - Request guidance on supporting Emma

4. **Family Coordination**
   - Check if other family members need access
   - Review emergency contact information
   - Update child's school and medical information
   - Ensure all family data is current

#### Expected Outcomes
- Guardian can easily monitor child's progress
- Appointment booking is straightforward and reliable
- Communication with therapist is secure and responsive
- Family information management is comprehensive

#### Success Criteria
- Mood data is clearly visualized and understandable
- Available appointment slots are accurate and bookable
- Messages are delivered securely and promptly
- Family data updates save correctly

---

### Guardian Scenario 2: Multi-Child Management and Emergency Response
**Test Case IDs**: TC-USER-003, TC-COMM-005, TC-EMAIL-003
**Duration**: 30 minutes
**Tester Profile**: Parent with multiple children in the system

#### Scenario Description
As a guardian with multiple children, I need to manage different therapeutic relationships and respond appropriately to emergency situations.

#### Test Flow
1. **Multi-Child Dashboard**
   - Access dashboard showing both Emma and Jordan
   - Compare mood trends between children
   - Review different therapist relationships
   - Manage separate appointment schedules

2. **Emergency Response**
   - Receive panic alert from Jordan (teenager)
   - Access emergency response information
   - Contact appropriate therapist (Dr. Rodriguez)
   - Coordinate with school counselor if needed
   - Document incident and follow-up actions

3. **Differential Care Management**
   - Adjust notification preferences for each child
   - Manage age-appropriate content access
   - Coordinate different therapy schedules
   - Ensure privacy between siblings

#### Expected Outcomes
- Multi-child management is intuitive and organized
- Emergency alerts are clear and actionable
- Different therapeutic relationships are well-managed
- Privacy and age-appropriate access is maintained

---

## 🧒 Child User Test Scenarios

### Child Scenario 1: Daily Mood Tracking and Engagement (Ages 8-12)
**Test Case IDs**: TC-MOOD-001, TC-MOOD-002, TC-MOOD-004, TC-COMM-001
**Duration**: 25 minutes
**Tester Profile**: Child user (or adult simulating child behavior)

#### Scenario Description
As a child user, I want to easily log my daily mood, see my progress, and communicate with my therapist in an age-appropriate and engaging way.

#### Test Flow
1. **Daily Mood Logging**
   - Login with child credentials (child1-uat@safespace.com - Emma, age 10)
   - Navigate to mood tracking section
   - Select today's mood using emoji interface
   - Add simple note: "Had fun at recess today!"
   - Save mood entry and see confirmation

2. **Progress Visualization**
   - View mood history in child-friendly format
   - See mood streak counter and achievements
   - Explore mood patterns with simple charts
   - Celebrate positive mood streaks

3. **Therapist Communication**
   - Send simple message to Dr. Johnson
   - Use age-appropriate language and emoji
   - Ask question about upcoming session
   - Share something positive from school

4. **Safety Features**
   - Locate and understand panic button
   - Practice using help resources
   - Understand when to ask for help
   - Know how to contact trusted adults

#### Expected Outcomes
- Mood logging is fun and engaging for children
- Progress visualization motivates continued use
- Communication tools are age-appropriate
- Safety features are accessible and understandable

#### Success Criteria
- Emoji interface is responsive and intuitive
- Mood history displays in child-friendly format
- Messages are sent successfully with appropriate content filtering
- Emergency features are easily accessible

---

### Child Scenario 2: Teenage User Experience (Ages 13-17)
**Test Case IDs**: TC-MOOD-001, TC-COMM-001, TC-CONT-003, TC-MOBILE-001
**Duration**: 30 minutes
**Tester Profile**: Teenage user (or adult simulating teen behavior)

#### Scenario Description
As a teenage user, I want more sophisticated tools for tracking my mental health, greater privacy controls, and age-appropriate resources for managing stress and emotions.

#### Test Flow
1. **Advanced Mood Tracking**
   - Login with teen credentials (child4-uat@safespace.com - Jordan, age 14)
   - Use more detailed mood tracking options
   - Add longer, more complex notes about feelings
   - Explore mood patterns and triggers
   - Set personal mood goals

2. **Privacy Management**
   - Review privacy settings and controls
   - Understand what information is shared with parents
   - Manage communication preferences
   - Control notification settings

3. **Resource Discovery**
   - Browse age-appropriate mental health content
   - Search for articles about teen-specific issues
   - Bookmark helpful resources
   - Share appropriate content with friends (if feature exists)

4. **Mobile Experience**
   - Test platform on mobile device
   - Use touch-friendly interface elements
   - Verify responsive design works well
   - Check that all features are accessible on mobile

#### Expected Outcomes
- Teen interface provides appropriate sophistication
- Privacy controls are clear and functional
- Content is relevant and engaging for teenagers
- Mobile experience is optimized and user-friendly

#### Success Criteria
- Advanced mood tracking options work correctly
- Privacy settings are clearly explained and functional
- Age-appropriate content is easily discoverable
- Mobile interface is fully functional and responsive

---

## 🔄 Cross-Role Integration Scenarios

### Integration Scenario 1: Complete Family Therapy Workflow
**Test Case IDs**: Multiple across all roles
**Duration**: 60 minutes
**Tester Profile**: Multiple testers representing different roles

#### Scenario Description
Test the complete workflow from child mood logging through guardian monitoring to therapist intervention and appointment scheduling.

#### Test Flow
1. **Child Mood Entry** (Child tester)
   - Emma logs concerning mood pattern over several days
   - Adds notes about school stress and anxiety

2. **Guardian Monitoring** (Guardian tester)
   - Jennifer notices concerning mood trend
   - Reviews Emma's mood history
   - Decides to contact therapist

3. **Guardian-Therapist Communication** (Both testers)
   - Jennifer sends message to Dr. Johnson about concerns
   - Dr. Johnson responds with assessment and recommendations
   - They schedule additional appointment

4. **Therapist Intervention** (Therapist tester)
   - Dr. Johnson reviews Emma's complete mood data
   - Prepares targeted intervention strategies
   - Schedules family consultation session

5. **Appointment Execution** (All testers)
   - Appointment reminders sent to all parties
   - Google Meet session initiated successfully
   - Session notes documented by therapist
   - Follow-up actions assigned

#### Expected Outcomes
- Complete workflow functions seamlessly across all roles
- Data flows appropriately between different user types
- Communication is secure and effective
- Appointment system supports the therapeutic process

---

### Integration Scenario 2: Crisis Response and Emergency Management
**Test Case IDs**: TC-COMM-005, TC-EMAIL-003, TC-SEC-002
**Duration**: 45 minutes
**Tester Profile**: Multiple testers coordinating emergency response

#### Scenario Description
Test the platform's response to a child crisis situation, including immediate alerts, communication protocols, and follow-up procedures.

#### Test Flow
1. **Crisis Initiation** (Child tester)
   - Jordan (teenager) activates panic button during school hours
   - System captures location and context information

2. **Immediate Response** (System and Guardian tester)
   - Guardian receives immediate emergency notification
   - Therapist receives crisis alert
   - Admin receives security notification for monitoring

3. **Coordinated Response** (All testers)
   - Guardian contacts Jordan directly
   - Therapist provides immediate support guidance
   - School counselor is notified (simulated)
   - Crisis intervention resources are activated

4. **Follow-up and Documentation** (Therapist and Admin testers)
   - Incident is properly documented
   - Follow-up appointments are scheduled
   - Safety plan is reviewed and updated
   - All parties receive appropriate notifications

#### Expected Outcomes
- Crisis alerts are delivered immediately and reliably
- All stakeholders receive appropriate notifications
- Emergency response procedures are followed correctly
- Documentation and follow-up systems work effectively

---

## 📊 Role-Based Testing Metrics

### Admin Role Testing
- **Test Cases**: 15 scenarios across user management, security, and system administration
- **Critical Focus**: User approval workflows, security monitoring, system oversight
- **Success Criteria**: 100% of admin functions accessible and working correctly

### Therapist Role Testing
- **Test Cases**: 12 scenarios covering client management, content creation, and crisis response
- **Critical Focus**: Client data access, appointment management, family communication
- **Success Criteria**: All therapeutic workflows function smoothly and securely

### Guardian Role Testing
- **Test Cases**: 10 scenarios focusing on child monitoring, appointment booking, and communication
- **Critical Focus**: Child progress visibility, therapist communication, emergency response
- **Success Criteria**: Guardian can effectively support child's mental health journey

### Child Role Testing
- **Test Cases**: 8 scenarios covering mood tracking, communication, and age-appropriate features
- **Critical Focus**: Engaging interface, safety features, age-appropriate functionality
- **Success Criteria**: Children can use platform independently and safely

### Cross-Role Integration Testing
- **Test Cases**: 6 comprehensive scenarios testing multi-role workflows
- **Critical Focus**: Data flow, communication, emergency response, appointment coordination
- **Success Criteria**: All roles work together seamlessly to support therapeutic goals

---

**Document Version**: 1.0
**Last Updated**: UAT Implementation Phase
**Testing Duration**: Estimated 4-6 hours per role for comprehensive coverage
**Maintained By**: UAT Coordination Team