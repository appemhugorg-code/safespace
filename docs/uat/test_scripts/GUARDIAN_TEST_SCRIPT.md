# SafeSpace Guardian User Test Script

## 🎯 Test Overview
**Role**: Parent/Guardian
**Duration**: 60 minutes (complete guardian testing)
**Prerequisites**: UAT environment running, guardian test account available
**Test Account**: guardian1-uat@safespace.com / UATGuardian2024!
**Children**: Emma Smith (age 10), Jordan Taylor (age 14)

## 📋 Pre-Test Checklist
- [ ] UAT environment is accessible at http://localhost:8080
- [ ] Guardian test account exists and is approved
- [ ] Child accounts (Emma, Jordan) are linked to guardian
- [ ] Therapist assignments are in place
- [ ] Browser is cleared of previous session data
- [ ] Mobile device available for responsive testing
- [ ] Screen recording software is ready (optional)

---

## 🔐 Test Script 1: Guardian Authentication and Dashboard Access
**Test Case ID**: TC-AUTH-003
**Estimated Time**: 8 minutes

### Step-by-Step Instructions

#### Step 1: Navigate to Login Page
1. Open web browser (Chrome, Firefox, or Safari)
2. Navigate to: `http://localhost:8080`
3. **Expected Result**: SafeSpace welcome page loads
4. Click "Sign In" or "Login" button
5. **Expected Result**: Login form is displayed

#### Step 2: Guardian Login
1. Enter email: `guardian1-uat@safespace.com`
2. Enter password: `UATGuardian2024!`
3. Click "Sign In" button
4. **Expected Result**: Login successful, redirected to guardian dashboard
5. **Verify**: No error messages appear
6. **Verify**: URL changes to guardian dashboard route

#### Step 3: Verify Guardian Dashboard Elements
1. **Check Navigation Menu**:
   - [ ] Dashboard link visible
   - [ ] My Children section visible
   - [ ] Appointments accessible
   - [ ] Messages available
   - [ ] Resources/Content visible
   - [ ] Profile Settings accessible

2. **Check Dashboard Widgets**:
   - [ ] Children overview cards (Emma and Jordan)
   - [ ] Recent mood summaries
   - [ ] Upcoming appointments
   - [ ] Recent messages from therapists
   - [ ] Quick action buttons

3. **Check Child Access**:
   - [ ] Can view Emma Smith's data
   - [ ] Can view Jordan Taylor's data
   - [ ] Cannot access other children's data
   - [ ] Appropriate privacy controls in place

#### Step 4: Verify Role-Based Access
1. Attempt to access admin-only features
2. **Expected Result**: Access denied or feature not visible
3. Attempt to access therapist-only features
4. **Expected Result**: Access denied or feature not visible
5. **Verify**: Only guardian and child-related features are accessible

### ✅ Success Criteria
- [ ] Login completes without errors
- [ ] Guardian dashboard loads completely
- [ ] All guardian navigation items are visible
- [ ] Only linked children are accessible
- [ ] Role-based restrictions work correctly

### 📝 Test Results
- **Status**: [ ] Pass [ ] Fail [ ] Blocked
- **Issues Found**: ________________________________
- **Screenshots**: ________________________________
- **Comments**: ___________________________________

---

## 😊 Test Script 2: Child Progress Monitoring and Mood Analysis
**Test Case ID**: TC-MOOD-003, TC-MOOD-005
**Estimated Time**: 20 minutes

### Step-by-Step Instructions

#### Step 1: Access Emma's Progress Dashboard
1. From main dashboard, click on "Emma Smith" child card
2. **Expected Result**: Emma's detailed progress page loads
3. **Verify child information displayed**:
   - [ ] Basic information (age, grade, school)
   - [ ] Assigned therapist (Dr. Sarah Johnson)
   - [ ] Recent activity summary
   - [ ] Emergency contact information

#### Step 2: Review Emma's Mood Tracking Data
1. Navigate to "Mood History" or "Progress" tab
2. **Expected Result**: Mood tracking visualization loads
3. **Analyze mood data presentation**:
   - [ ] 30-day mood trend chart (parent-friendly format)
   - [ ] Mood frequency summary
   - [ ] Mood logging consistency indicators
   - [ ] Notable patterns highlighted

#### Step 3: Understand Mood Insights
1. **Review mood trend explanations**:
   - Look for parent-friendly interpretations
   - Check for concerning pattern alerts
   - Verify positive progress indicators
2. **Test date range filtering**:
   - Select "Last 2 weeks" view
   - Select "Last month" view
   - **Expected Result**: Data updates correctly
3. **Check mood details**:
   - Click on specific mood entries
   - **Expected Result**: Can see Emma's notes (age-appropriate)
   - **Verify**: Cannot edit Emma's mood entries

#### Step 4: Compare Children's Progress (Multi-Child Management)
1. Navigate back to main dashboard
2. Click on "Jordan Taylor" child card
3. **Expected Result**: Jordan's progress page loads
4. **Compare data presentation**:
   - [ ] Age-appropriate differences (14 vs 10)
   - [ ] Different therapist assignment (Dr. Rodriguez vs Dr. Johnson)
   - [ ] Separate mood tracking data
   - [ ] Different privacy levels for teenager

#### Step 5: Identify Concerning Patterns
1. **Look for system alerts or notifications**:
   - Mood pattern warnings
   - Missed mood logging alerts
   - Therapist recommendations
2. **Test notification preferences**:
   - Navigate to notification settings
   - **Verify**: Can customize alert thresholds
   - **Verify**: Can set preferred notification methods

#### Step 6: Progress Summary Review
1. Look for "Progress Summary" or "Monthly Report"
2. **Expected Result**: Parent-friendly progress summary
3. **Review summary contents**:
   - [ ] Overall mood trends
   - [ ] Therapy session attendance
   - [ ] Goal progress indicators
   - [ ] Recommendations for home support

### ✅ Success Criteria
- [ ] Child progress data is clearly presented and understandable
- [ ] Mood visualizations are parent-friendly and informative
- [ ] Multi-child management works seamlessly
- [ ] Age-appropriate differences are respected
- [ ] Concerning patterns are highlighted appropriately

### 📝 Test Results
- **Status**: [ ] Pass [ ] Fail [ ] Blocked
- **Issues Found**: ________________________________
- **Screenshots**: ________________________________
- **Comments**: ___________________________________

---

## 📅 Test Script 3: Appointment Booking and Management
**Test Case ID**: TC-APPT-002
**Estimated Time**: 15 minutes

### Step-by-Step Instructions

#### Step 1: Access Appointment Booking
1. From dashboard, click "Appointments" or "Schedule Session"
2. **Expected Result**: Appointment booking interface loads
3. **Verify available options**:
   - [ ] View existing appointments
   - [ ] Book new appointment
   - [ ] Reschedule existing appointments
   - [ ] Cancel appointments (if needed)

#### Step 2: Book New Appointment for Emma
1. Click "Book New Appointment" or "Schedule Session"
2. **Select child**: Emma Smith
3. **Expected Result**: Dr. Sarah Johnson's availability is shown
4. **Review available time slots**:
   - [ ] Current week availability
   - [ ] Next week availability
   - [ ] Blocked/unavailable times are clearly marked

#### Step 3: Select and Confirm Appointment
1. **Choose appointment slot**: Next Tuesday, 2:00 PM
2. **Select session duration**: 60 minutes (standard)
3. **Add appointment notes**: "Follow-up on school anxiety management"
4. **Verify appointment details**:
   - Child: Emma Smith
   - Therapist: Dr. Sarah Johnson
   - Date and time: Next Tuesday, 2:00 PM - 3:00 PM
   - Duration: 60 minutes
5. Click "Book Appointment"
6. **Expected Result**: Appointment booking confirmation

#### Step 4: Verify Appointment Confirmation
1. **Check confirmation details**:
   - [ ] Appointment appears in calendar view
   - [ ] Google Meet link is provided
   - [ ] Confirmation email is sent
   - [ ] Therapist receives booking notification
2. **Test calendar integration**:
   - Look for "Add to Calendar" option
   - **Expected Result**: Can export to personal calendar

#### Step 5: Manage Existing Appointments
1. Navigate to "My Appointments" or "Upcoming Sessions"
2. **Expected Result**: List of scheduled appointments
3. **Test appointment management**:
   - View appointment details
   - Access Google Meet link (don't join, just verify link works)
   - Check appointment reminders settings
4. **Test rescheduling** (if available):
   - Select an appointment
   - Click "Reschedule"
   - **Expected Result**: New time slot selection available

#### Step 6: Emergency Appointment Request
1. Look for "Urgent Appointment" or "Emergency Session" option
2. **Test urgent booking process**:
   - Select child needing urgent care
   - Specify urgency reason
   - Request immediate therapist contact
3. **Expected Result**: Urgent request is processed with appropriate priority

### ✅ Success Criteria
- [ ] Appointment booking interface is intuitive and user-friendly
- [ ] Available time slots are accurate and up-to-date
- [ ] Google Meet integration works seamlessly
- [ ] Confirmation process is clear and comprehensive
- [ ] Appointment management features are functional

### 📝 Test Results
- **Status**: [ ] Pass [ ] Fail [ ] Blocked
- **Issues Found**: ________________________________
- **Screenshots**: ________________________________
- **Comments**: ___________________________________

---

## 💬 Test Script 4: Therapist Communication and Family Coordination
**Test Case ID**: TC-COMM-001
**Estimated Time**: 12 minutes

### Step-by-Step Instructions

#### Step 1: Access Messaging System
1. From dashboard, click "Messages" or "Communication"
2. **Expected Result**: Messaging interface loads
3. **Verify message organization**:
   - [ ] Conversations with Emma's therapist (Dr. Johnson)
   - [ ] Conversations with Jordan's therapist (Dr. Rodriguez)
   - [ ] Messages from children (if age-appropriate)
   - [ ] Group conversations (family sessions)

#### Step 2: Communicate with Emma's Therapist
1. Click on conversation with Dr. Sarah Johnson
2. **Review conversation history**:
   - Previous discussions about Emma's progress
   - Therapist recommendations and guidance
   - Session summaries and follow-up actions
3. **Send new message about Emma's recent behavior**:
   - "Hi Dr. Johnson, I wanted to update you on Emma's week..."
   - "She's been using the breathing techniques you taught her..."
   - "I noticed she's more confident about the upcoming test."
4. Click "Send Message"
5. **Expected Result**: Message sends successfully

#### Step 3: Ask Questions and Seek Guidance
1. **Send follow-up message with questions**:
   - "I have a few questions about supporting Emma at home..."
   - "Should we continue the current bedtime routine?"
   - "How can I help her with test anxiety?"
2. **Expected Result**: Message is delivered to therapist
3. **Verify**: Message thread maintains conversation context

#### Step 4: Coordinate Family Session
1. Look for "Family Session" or "Group Meeting" option
2. **Request family consultation**:
   - Include: Emma, Jennifer (guardian), Dr. Johnson
   - Purpose: "Discuss Emma's progress and home strategies"
   - Preferred timing: Weekend or evening
3. **Expected Result**: Family session request is sent to therapist

#### Step 5: Emergency Communication Test
1. **Test urgent communication feature**:
   - Look for "Urgent Message" or "Emergency Contact"
   - Send urgent message about concerning behavior
   - **Expected Result**: Message is flagged as urgent
   - **Verify**: Therapist receives immediate notification

#### Step 6: Communication with Teenager (Jordan)
1. Navigate to Jordan's communication options
2. **Verify age-appropriate communication**:
   - [ ] More privacy controls for teenager
   - [ ] Direct communication with Jordan (if enabled)
   - [ ] Appropriate oversight without invasion of privacy
3. **Test family communication balance**:
   - Guardian can communicate with therapist about Jordan
   - Jordan has some direct communication with therapist
   - Privacy boundaries are respected

### ✅ Success Criteria
- [ ] Messaging system facilitates effective family-therapist communication
- [ ] Messages are delivered securely and promptly
- [ ] Age-appropriate communication controls work correctly
- [ ] Emergency communication features are accessible
- [ ] Family coordination tools support therapeutic goals

### 📝 Test Results
- **Status**: [ ] Pass [ ] Fail [ ] Blocked
- **Issues Found**: ________________________________
- **Screenshots**: ________________________________
- **Comments**: ___________________________________

---

## 🚨 Test Script 5: Emergency Response and Crisis Management
**Test Case ID**: TC-COMM-005, TC-EMAIL-003
**Estimated Time**: 5 minutes

### Step-by-Step Instructions

#### Step 1: Understand Emergency Features
1. Navigate to "Safety" or "Emergency" section
2. **Expected Result**: Emergency resources and procedures displayed
3. **Review emergency information**:
   - [ ] Crisis hotline numbers
   - [ ] Emergency contact procedures
   - [ ] When to use panic button (child education)
   - [ ] Local emergency resources

#### Step 2: Emergency Contact Information
1. **Verify emergency contacts are current**:
   - Primary guardian contact
   - Secondary emergency contact
   - Child's school contact information
   - Therapist emergency contact
2. **Test contact update process**:
   - Update emergency phone number
   - **Expected Result**: Changes save successfully

#### Step 3: Crisis Response Simulation
1. **Simulate receiving panic alert** (if test feature available)
2. **Expected Result**: Immediate notification received
3. **Review crisis information provided**:
   - [ ] Which child triggered alert
   - [ ] Location information (if available)
   - [ ] Time of alert
   - [ ] Recommended immediate actions

#### Step 4: Crisis Response Actions
1. **Follow emergency response checklist**:
   - Contact child immediately
   - Notify therapist of situation
   - Document incident details
   - Follow up with appropriate resources
2. **Verify support resources**:
   - [ ] Crisis intervention contacts
   - [ ] Local emergency services
   - [ ] Mental health crisis resources
   - [ ] School emergency procedures

### ✅ Success Criteria
- [ ] Emergency features are easily accessible and understandable
- [ ] Crisis alerts provide clear, actionable information
- [ ] Emergency contact management is straightforward
- [ ] Crisis response procedures are comprehensive
- [ ] Support resources are readily available

### 📝 Test Results
- **Status**: [ ] Pass [ ] Fail [ ] Blocked
- **Issues Found**: ________________________________
- **Screenshots**: ________________________________
- **Comments**: ___________________________________

---

## 📱 Mobile Responsiveness Test (Bonus)
**Test Case ID**: TC-MOBILE-001
**Estimated Time**: 10 minutes (if time permits)

### Step-by-Step Instructions

#### Step 1: Access Platform on Mobile Device
1. Open mobile browser (Safari on iOS or Chrome on Android)
2. Navigate to: `http://localhost:8080`
3. **Expected Result**: Mobile-optimized interface loads
4. Login with guardian credentials

#### Step 2: Test Mobile Navigation
1. **Verify mobile menu functionality**:
   - [ ] Hamburger menu works correctly
   - [ ] Navigation items are touch-friendly
   - [ ] Scrolling is smooth and responsive
2. **Test dashboard on mobile**:
   - [ ] Child cards display properly
   - [ ] Touch targets are appropriately sized
   - [ ] Content is readable without zooming

#### Step 3: Test Key Mobile Functions
1. **Mood tracking review**:
   - View child's mood data on mobile
   - **Verify**: Charts and graphs are mobile-friendly
2. **Appointment booking**:
   - Test booking process on mobile
   - **Verify**: Calendar interface works with touch
3. **Messaging**:
   - Send message to therapist from mobile
   - **Verify**: Text input and sending work correctly

### ✅ Success Criteria
- [ ] Mobile interface is fully functional and user-friendly
- [ ] All key features work correctly on mobile devices
- [ ] Touch interactions are responsive and accurate
- [ ] Content is appropriately sized and readable

---

## 📋 Guardian Testing Summary

### Overall Test Results
- **Total Test Scripts**: 5 (+ 1 bonus mobile test)
- **Estimated Total Time**: 60 minutes
- **Critical Test Cases**: 2
- **High Priority Test Cases**: 3

### Test Completion Checklist
- [ ] Authentication and dashboard access verified
- [ ] Child progress monitoring confirmed
- [ ] Appointment booking and management validated
- [ ] Therapist communication systems tested
- [ ] Emergency response features verified
- [ ] Mobile responsiveness tested (bonus)

### Final Guardian Role Validation
- [ ] All guardian-specific features are accessible
- [ ] Child data access is properly restricted to linked children
- [ ] Multi-child management works effectively
- [ ] Communication tools support family-therapist collaboration
- [ ] Emergency features provide appropriate safety net

### Family Experience Assessment
- [ ] Platform supports effective parental involvement
- [ ] Child progress information is clear and actionable
- [ ] Appointment management reduces administrative burden
- [ ] Communication enhances therapeutic relationship
- [ ] Emergency features provide peace of mind

### Issues Summary
**Critical Issues**: ___________________________
**High Priority Issues**: ____________________
**Medium Priority Issues**: __________________
**Low Priority Issues**: _____________________

### Recommendations
_________________________________________________
_________________________________________________
_________________________________________________

### Tester Sign-off
**Tester Name**: ____________________________
**Relationship to Child**: ___________________
**Date Completed**: _________________________
**Overall Status**: [ ] Pass [ ] Fail [ ] Conditional Pass
**Family Approval**: [ ] Suitable for family use
**Signature**: ______________________________