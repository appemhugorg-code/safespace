# SafeSpace Therapist User Test Script

## 🎯 Test Overview
**Role**: Licensed Therapist
**Duration**: 75 minutes (complete therapist testing)
**Prerequisites**: UAT environment running, therapist test account available
**Test Account**: therapist1-uat@safespace.com / UATTherapist2024!

## 📋 Pre-Test Checklist
- [ ] UAT environment is accessible at http://localhost:8080
- [ ] Therapist test account exists and is approved
- [ ] Assigned clients exist in system (Emma Smith, Alex Williams)
- [ ] Browser is cleared of previous session data
- [ ] Google Meet integration is configured
- [ ] Screen recording software is ready (optional)

---

## 🔐 Test Script 1: Therapist Authentication and Dashboard Access
**Test Case ID**: TC-AUTH-002
**Estimated Time**: 10 minutes

### Step-by-Step Instructions

#### Step 1: Navigate to Login Page
1. Open web browser (Chrome, Firefox, or Safari)
2. Navigate to: `http://localhost:8080`
3. **Expected Result**: SafeSpace welcome page loads
4. Click "Sign In" or "Login" button
5. **Expected Result**: Login form is displayed

#### Step 2: Therapist Login
1. Enter email: `therapist1-uat@safespace.com`
2. Enter password: `UATTherapist2024!`
3. Click "Sign In" button
4. **Expected Result**: Login successful, redirected to therapist dashboard
5. **Verify**: No error messages appear
6. **Verify**: URL changes to therapist dashboard route

#### Step 3: Verify Therapist Dashboard Elements
1. **Check Navigation Menu**:
   - [ ] Dashboard link visible
   - [ ] My Clients section visible
   - [ ] Appointments accessible
   - [ ] Messages available
   - [ ] Content Creation visible
   - [ ] Availability Settings accessible

2. **Check Dashboard Widgets**:
   - [ ] Assigned clients list
   - [ ] Upcoming appointments
   - [ ] Recent messages
   - [ ] Client progress summaries
   - [ ] Quick action buttons

3. **Check Client Access**:
   - [ ] Can view assigned clients (Emma Smith, Alex Williams)
   - [ ] Cannot access unassigned clients
   - [ ] Client mood data is visible
   - [ ] Recent activity is displayed

#### Step 4: Verify Role-Based Access
1. Attempt to access admin-only features
2. **Expected Result**: Access denied or feature not visible
3. Attempt to access other therapists' clients
4. **Expected Result**: Access denied or clients not visible
5. **Verify**: Only assigned clients and therapist features are accessible

### ✅ Success Criteria
- [ ] Login completes without errors
- [ ] Therapist dashboard loads completely
- [ ] All therapist navigation items are visible
- [ ] Only assigned clients are accessible
- [ ] Role-based restrictions work correctly

### 📝 Test Results
- **Status**: [ ] Pass [ ] Fail [ ] Blocked
- **Issues Found**: ________________________________
- **Screenshots**: ________________________________
- **Comments**: ___________________________________

---

## 📅 Test Script 2: Availability Management and Appointment Scheduling
**Test Case ID**: TC-APPT-001, TC-APPT-003
**Estimated Time**: 20 minutes

### Step-by-Step Instructions

#### Step 1: Access Availability Settings
1. From therapist dashboard, click "Availability" or "Schedule"
2. **Expected Result**: Availability management interface loads
3. **Verify**: Current availability schedule is displayed
4. **Verify**: Calendar view shows available/unavailable times

#### Step 2: Set Weekly Availability
1. Click "Edit Availability" or similar button
2. **Set Monday Schedule**:
   - Start time: 9:00 AM
   - End time: 5:00 PM
   - Mark as available
3. **Repeat for Tuesday through Friday**:
   - Same hours: 9:00 AM - 5:00 PM
4. **Set Saturday Schedule**:
   - Start time: 10:00 AM
   - End time: 2:00 PM
   - Mark as available
5. **Leave Sunday unavailable**
6. Click "Save Availability"
7. **Expected Result**: Schedule saves successfully

#### Step 3: Block Out Vacation Time
1. Navigate to "Time Off" or "Unavailable Periods"
2. Click "Add Time Off"
3. **Set vacation period**:
   - Start date: Next month, first Monday
   - End date: Next month, first Friday
   - Reason: "Vacation - Conference"
4. Click "Save Time Off"
5. **Expected Result**: Vacation period blocks availability
6. **Verify**: Blocked time shows in calendar view

#### Step 4: Review Appointment Requests
1. Navigate to "Appointment Requests" or "Pending Appointments"
2. **Expected Result**: List of guardian appointment requests
3. **Review request details**:
   - [ ] Client name (should be assigned client)
   - [ ] Requested date and time
   - [ ] Guardian contact information
   - [ ] Appointment reason/notes

#### Step 5: Approve and Schedule Appointment
1. Select an appointment request from guardian
2. Click "Approve" or "Schedule"
3. **Confirm appointment details**:
   - Date and time are within availability
   - Duration is appropriate (60 minutes)
   - Client is assigned to this therapist
4. Click "Confirm Appointment"
5. **Expected Result**: Appointment is scheduled
6. **Verify**: Google Meet link is automatically generated
7. **Verify**: Confirmation emails are sent to all parties

#### Step 6: Manual Appointment Creation
1. Click "New Appointment" or "Schedule Appointment"
2. **Select client**: Emma Smith
3. **Choose date and time**: Within available hours
4. **Set duration**: 60 minutes
5. **Add session notes**: "Follow-up on anxiety management techniques"
6. Click "Create Appointment"
7. **Expected Result**: Appointment created successfully
8. **Verify**: Appointment appears in calendar
9. **Verify**: Google Meet link is generated

### ✅ Success Criteria
- [ ] Availability settings save and display correctly
- [ ] Time off periods block availability appropriately
- [ ] Appointment requests are visible and manageable
- [ ] Google Meet integration works without issues
- [ ] All parties receive appropriate notifications

### 📝 Test Results
- **Status**: [ ] Pass [ ] Fail [ ] Blocked
- **Issues Found**: ________________________________
- **Screenshots**: ________________________________
- **Comments**: ___________________________________

---

## 😊 Test Script 3: Client Progress Review and Mood Analysis
**Test Case ID**: TC-MOOD-006
**Estimated Time**: 20 minutes

### Step-by-Step Instructions

#### Step 1: Access Client Dashboard
1. From main dashboard, click on "Emma Smith" client
2. **Expected Result**: Client profile page loads
3. **Verify client information**:
   - [ ] Basic demographics (age, grade)
   - [ ] Guardian information (Jennifer Smith)
   - [ ] Emergency contacts
   - [ ] Medical information and allergies

#### Step 2: Review Mood Tracking Data
1. Navigate to "Mood History" or "Progress" tab
2. **Expected Result**: Mood tracking visualization loads
3. **Analyze mood data**:
   - [ ] 30-day mood trend chart
   - [ ] Mood frequency distribution
   - [ ] Mood logging consistency
   - [ ] Notable patterns or changes

#### Step 3: Detailed Mood Analysis
1. Click on specific mood entries to view details
2. **Review mood notes**:
   - Read child's notes for context
   - Identify triggers or positive events
   - Note any concerning patterns
3. **Use filtering options**:
   - Filter by date range (last 2 weeks)
   - Filter by mood type (sad entries only)
   - **Expected Result**: Data updates according to filters

#### Step 4: Generate Progress Insights
1. Look for "Generate Report" or "Progress Summary"
2. **Expected Result**: Automated insights are provided
3. **Review insights**:
   - [ ] Mood improvement trends
   - [ ] Concerning patterns identified
   - [ ] Recommendations for intervention
   - [ ] Comparison to previous periods

#### Step 5: Prepare Session Notes
1. Navigate to "Session Notes" or "Clinical Notes"
2. Click "Add New Note"
3. **Document observations**:
   - "Emma's mood data shows improvement in school-related anxiety"
   - "Consistent mood logging indicates good engagement"
   - "Plan to focus on coping strategies in next session"
4. **Set note privacy level**: Therapist only
5. Click "Save Note"
6. **Expected Result**: Note saves successfully

#### Step 6: Review Second Client (Alex Williams)
1. Navigate back to client list
2. Click on "Alex Williams"
3. **Compare mood patterns**:
   - Different age group (12 vs 10)
   - Different mood patterns
   - Different intervention needs
4. **Verify data separation**:
   - [ ] Each client's data is separate
   - [ ] No data mixing between clients
   - [ ] Appropriate privacy controls

### ✅ Success Criteria
- [ ] Client data is easily accessible and well-organized
- [ ] Mood data visualization is clear and actionable
- [ ] Filtering and analysis tools work correctly
- [ ] Session notes can be created and saved securely
- [ ] Client data privacy is maintained

### 📝 Test Results
- **Status**: [ ] Pass [ ] Fail [ ] Blocked
- **Issues Found**: ________________________________
- **Screenshots**: ________________________________
- **Comments**: ___________________________________

---

## 💬 Test Script 4: Family Communication and Collaboration
**Test Case ID**: TC-COMM-001
**Estimated Time**: 15 minutes

### Step-by-Step Instructions

#### Step 1: Access Messaging System
1. From dashboard, click "Messages" or "Communication"
2. **Expected Result**: Messaging interface loads
3. **Verify message threads**:
   - [ ] Conversations with guardians
   - [ ] Messages from children
   - [ ] Group conversations (if applicable)

#### Step 2: Communicate with Guardian
1. Click on conversation with Jennifer Smith (Emma's guardian)
2. **Review conversation history**:
   - Previous messages about Emma's progress
   - Guardian questions and concerns
   - Therapist responses and guidance
3. **Send new message**:
   - "Hi Jennifer, I've reviewed Emma's mood data from this week..."
   - "She's showing great improvement in managing school anxiety..."
   - "Let's discuss this in our next family session."
4. Click "Send Message"
5. **Expected Result**: Message sends successfully
6. **Verify**: Message appears in conversation thread

#### Step 3: Respond to Child Message
1. Navigate to messages from Emma Smith
2. **Review child's message**:
   - Age-appropriate language
   - Questions about upcoming session
   - Sharing of positive experiences
3. **Send encouraging response**:
   - "That's wonderful, Emma! I'm so proud of you..."
   - "Keep using those breathing techniques we practiced..."
   - "See you at our session on Thursday!"
4. **Expected Result**: Message sends with appropriate tone
5. **Verify**: Content filtering allows appropriate therapeutic communication

#### Step 4: Schedule Family Consultation
1. Look for "Schedule Meeting" or "Family Session" option
2. Click to create family consultation
3. **Include participants**:
   - Emma Smith (child)
   - Jennifer Smith (guardian)
   - Dr. Sarah Johnson (therapist)
4. **Set meeting details**:
   - Date: Next week
   - Duration: 90 minutes
   - Purpose: "Family therapy session - anxiety management"
5. Click "Schedule Session"
6. **Expected Result**: Family session is scheduled
7. **Verify**: All participants receive invitations

#### Step 5: Share Resources with Family
1. Navigate to "Resources" or "Share Content"
2. **Select appropriate article**: "Managing School Anxiety in Children"
3. **Choose recipients**: Jennifer Smith (guardian)
4. **Add personal note**: "This article aligns with what we've been working on..."
5. Click "Share Resource"
6. **Expected Result**: Resource is shared successfully
7. **Verify**: Guardian receives notification about shared resource

### ✅ Success Criteria
- [ ] Messaging system works reliably across all user types
- [ ] Messages are delivered securely and promptly
- [ ] Family sessions can be scheduled effectively
- [ ] Resource sharing enhances therapeutic support
- [ ] All communication maintains appropriate professional boundaries

### 📝 Test Results
- **Status**: [ ] Pass [ ] Fail [ ] Blocked
- **Issues Found**: ________________________________
- **Screenshots**: ________________________________
- **Comments**: ___________________________________

---

## 📚 Test Script 5: Content Creation and Crisis Response
**Test Case ID**: TC-CONT-001, TC-COMM-005
**Estimated Time**: 10 minutes

### Step-by-Step Instructions

#### Step 1: Access Content Creation
1. Navigate to "Content" or "Resources" section
2. Click "Create New Article" or "Add Content"
3. **Expected Result**: Content creation interface loads
4. **Verify editor features**:
   - [ ] Rich text editing capabilities
   - [ ] Image upload functionality
   - [ ] Formatting options available

#### Step 2: Create Educational Article
1. **Enter article details**:
   - Title: "Helping Children Cope with Test Anxiety"
   - Category: "Anxiety Management"
   - Target Audience: "Guardians and Children"
2. **Write article content**:
   - Introduction about test anxiety in children
   - Practical coping strategies
   - When to seek additional help
3. **Add tags**: anxiety, school, coping-strategies, children
4. **Set publication status**: Submit for review
5. Click "Save Draft" or "Submit for Approval"
6. **Expected Result**: Article is saved and submitted for admin review

#### Step 3: Crisis Response Simulation
1. **Simulate receiving panic alert** (if test alert available)
2. **Expected Result**: Immediate notification received
3. **Access emergency dashboard**:
   - [ ] Client information displayed
   - [ ] Location data available (if provided)
   - [ ] Recent mood data context
   - [ ] Emergency contact information

#### Step 4: Crisis Response Actions
1. **Review crisis information**:
   - Child: Alex Williams (age 12)
   - Location: Springfield Middle School
   - Time: During school hours
2. **Take immediate actions**:
   - Contact guardian (Robert Williams) immediately
   - Document crisis response steps
   - Coordinate with school counselor (simulated)
   - Schedule emergency follow-up session
3. **Expected Result**: All crisis response tools are accessible and functional

### ✅ Success Criteria
- [ ] Content creation tools are intuitive and functional
- [ ] Articles can be created and submitted for approval
- [ ] Crisis alerts are received immediately and clearly
- [ ] Emergency response tools are readily accessible
- [ ] Crisis documentation is comprehensive

### 📝 Test Results
- **Status**: [ ] Pass [ ] Fail [ ] Blocked
- **Issues Found**: ________________________________
- **Screenshots**: ________________________________
- **Comments**: ___________________________________

---

## 📋 Therapist Testing Summary

### Overall Test Results
- **Total Test Scripts**: 5
- **Estimated Total Time**: 75 minutes
- **Critical Test Cases**: 2
- **High Priority Test Cases**: 3

### Test Completion Checklist
- [ ] Authentication and dashboard access verified
- [ ] Availability and appointment management confirmed
- [ ] Client progress review and analysis validated
- [ ] Family communication systems tested
- [ ] Content creation and crisis response verified

### Final Therapist Role Validation
- [ ] All therapist-specific features are accessible
- [ ] Client data access is properly restricted to assigned clients
- [ ] Appointment and availability management works seamlessly
- [ ] Communication tools support therapeutic relationships
- [ ] Crisis response systems are immediately accessible

### Issues Summary
**Critical Issues**: ___________________________
**High Priority Issues**: ____________________
**Medium Priority Issues**: __________________
**Low Priority Issues**: _____________________

### Clinical Workflow Assessment
- [ ] Platform supports effective therapeutic practice
- [ ] Client data is comprehensive and actionable
- [ ] Family engagement tools are appropriate
- [ ] Crisis response capabilities are adequate
- [ ] Documentation and note-taking meet clinical standards

### Recommendations
_________________________________________________
_________________________________________________
_________________________________________________

### Tester Sign-off
**Tester Name**: ____________________________
**Professional License**: ___________________
**Date Completed**: _________________________
**Overall Status**: [ ] Pass [ ] Fail [ ] Conditional Pass
**Clinical Approval**: [ ] Suitable for therapeutic practice
**Signature**: ______________________________