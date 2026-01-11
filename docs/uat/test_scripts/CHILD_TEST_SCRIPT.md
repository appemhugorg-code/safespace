# SafeSpace Child User Test Script

## 🎯 Test Overview
**Role**: Child User (Ages 8-17)
**Duration**: 45 minutes (complete child testing)
**Prerequisites**: UAT environment running, child test accounts available
**Test Accounts**: 
- child1-uat@safespace.com / UATChild2024! (Emma, age 10)
- child4-uat@safespace.com / UATChild2024! (Jordan, age 14)

## 📋 Pre-Test Checklist
- [ ] UAT environment is accessible at http://localhost:8080
- [ ] Child test accounts exist and are approved
- [ ] Guardian and therapist relationships are established
- [ ] Browser is cleared of previous session data
- [ ] Mobile device available for touch testing
- [ ] Adult supervisor present for child safety testing
- [ ] Screen recording software is ready (optional)

---

## 🔐 Test Script 1: Child Authentication and Age-Appropriate Dashboard
**Test Case ID**: TC-AUTH-004
**Estimated Time**: 8 minutes

### Step-by-Step Instructions

#### Step 1: Navigate to Login Page (Younger Child - Emma, Age 10)
1. Open web browser (Chrome, Firefox, or Safari)
2. Navigate to: `http://localhost:8080`
3. **Expected Result**: SafeSpace welcome page loads with child-friendly design
4. Click "Sign In" or "Login" button
5. **Expected Result**: Login form is displayed with simple, clear interface

#### Step 2: Child Login (Emma)
1. Enter email: `child1-uat@safespace.com`
2. Enter password: `UATChild2024!`
3. Click "Sign In" button
4. **Expected Result**: Login successful, redirected to child-friendly dashboard
5. **Verify**: No error messages appear
6. **Verify**: Interface is colorful and age-appropriate

#### Step 3: Verify Child Dashboard Elements (Age 10)
1. **Check Age-Appropriate Design**:
   - [ ] Colorful, engaging interface
   - [ ] Large, easy-to-click buttons
   - [ ] Simple navigation with icons
   - [ ] Child-friendly language and instructions
   - [ ] Fun graphics and emoji usage

2. **Check Dashboard Widgets**:
   - [ ] Mood tracking section with emoji selector
   - [ ] "My Progress" area with achievements
   - [ ] Messages from therapist (Dr. Johnson)
   - [ ] Fun activities or games (if available)
   - [ ] Help/safety button prominently displayed

3. **Check Safety Features**:
   - [ ] Emergency help button is visible and accessible
   - [ ] "Talk to a Grown-up" option available
   - [ ] Safe communication guidelines displayed
   - [ ] Age-appropriate privacy explanations

#### Step 4: Test Teenage Interface (Jordan, Age 14)
1. Logout from Emma's account
2. Login with Jordan's credentials: `child4-uat@safespace.com`
3. **Expected Result**: More sophisticated interface for teenager
4. **Verify Teenage Design Elements**:
   - [ ] More mature color scheme
   - [ ] Advanced mood tracking options
   - [ ] Greater privacy controls
   - [ ] More detailed communication features
   - [ ] Age-appropriate content and resources

#### Step 5: Verify Role-Based Access (Both Ages)
1. Attempt to access admin features
2. **Expected Result**: Access denied or features not visible
3. Attempt to access other children's data
4. **Expected Result**: Cannot access other children's information
5. **Verify**: Only child-appropriate features are accessible

### ✅ Success Criteria
- [ ] Login process is simple and child-friendly
- [ ] Dashboard design is age-appropriate and engaging
- [ ] Safety features are prominently displayed
- [ ] Age differences are respected (10 vs 14)
- [ ] Role-based restrictions protect child privacy

### 📝 Test Results
- **Status**: [ ] Pass [ ] Fail [ ] Blocked
- **Issues Found**: ________________________________
- **Screenshots**: ________________________________
- **Comments**: ___________________________________

---

## 😊 Test Script 2: Daily Mood Tracking and Emotional Expression
**Test Case ID**: TC-MOOD-001, TC-MOOD-002
**Estimated Time**: 15 minutes

### Step-by-Step Instructions (Testing with Emma, Age 10)

#### Step 1: Access Mood Tracking
1. From Emma's dashboard, click "How I Feel Today" or mood tracking section
2. **Expected Result**: Mood selector interface loads with emoji options
3. **Verify Interface Elements**:
   - [ ] Large, colorful emoji for each mood
   - [ ] Simple mood labels (Very Sad, Sad, Okay, Happy, Very Happy)
   - [ ] Clear instructions in child-friendly language
   - [ ] Optional note-taking area

#### Step 2: Log Today's Mood
1. **Select mood**: Click on "Happy" emoji 😊
2. **Expected Result**: Emoji is highlighted/selected with visual feedback
3. **Add optional note**: "Had fun at recess with my friends!"
4. **Verify note features**:
   - [ ] Text box is appropriately sized
   - [ ] Character limit is reasonable for child
   - [ ] Spell-check or simple suggestions available
5. Click "Save My Mood" button
6. **Expected Result**: Mood is saved with encouraging confirmation message

#### Step 3: View Mood History (Child-Friendly)
1. Navigate to "My Mood Story" or "How I've Been Feeling"
2. **Expected Result**: Child-friendly mood history display
3. **Verify Visualization**:
   - [ ] Simple chart with emoji and colors
   - [ ] Easy-to-understand time periods (This Week, Last Week)
   - [ ] Positive reinforcement for mood logging
   - [ ] Celebration of mood streaks or improvements

#### Step 4: Mood Streak and Achievements
1. Look for "Mood Streak" or "My Achievements" section
2. **Expected Result**: Gamified progress tracking
3. **Verify Achievement Features**:
   - [ ] Streak counter for consecutive mood logs
   - [ ] Badges or rewards for consistent logging
   - [ ] Encouraging messages for participation
   - [ ] Visual progress indicators

#### Step 5: Test Mood Editing (Same Day)
1. Try to log mood again for the same day
2. **Expected Result**: System shows existing mood entry
3. **Test editing capability**:
   - Can update mood if needed
   - Can add or edit notes
   - Changes are saved properly
4. **Verify**: Only one mood entry per day is allowed

#### Step 6: Teenage Mood Tracking (Jordan, Age 14)
1. Switch to Jordan's account
2. **Access mood tracking for teenager**:
   - More detailed mood options
   - Longer note-taking capability
   - More sophisticated visualization
   - Privacy controls for mood sharing
3. **Verify Age-Appropriate Differences**:
   - [ ] More mature interface design
   - [ ] Advanced mood categories or scales
   - [ ] Greater control over data sharing
   - [ ] More detailed progress analysis

### ✅ Success Criteria
- [ ] Mood logging is fun and engaging for children
- [ ] Interface is intuitive and requires minimal instruction
- [ ] Visual feedback encourages continued use
- [ ] Age-appropriate differences are implemented
- [ ] Data is saved accurately and securely

### 📝 Test Results
- **Status**: [ ] Pass [ ] Fail [ ] Blocked
- **Issues Found**: ________________________________
- **Screenshots**: ________________________________
- **Comments**: ___________________________________

---

## 💬 Test Script 3: Safe Communication with Therapist and Family
**Test Case ID**: TC-COMM-001
**Estimated Time**: 12 minutes

### Step-by-Step Instructions (Testing with Emma, Age 10)

#### Step 1: Access Messaging System
1. From dashboard, click "Messages" or "Talk to Dr. Johnson"
2. **Expected Result**: Child-friendly messaging interface loads
3. **Verify Safety Features**:
   - [ ] Clear guidelines about safe communication
   - [ ] Reminder that messages are monitored for safety
   - [ ] Simple, age-appropriate language
   - [ ] Easy-to-understand privacy explanations

#### Step 2: Send Message to Therapist
1. Click "New Message" or "Send Message to Dr. Johnson"
2. **Write child-appropriate message**:
   - "Hi Dr. Johnson! I used the breathing thing you taught me today!"
   - "It helped when I felt worried about my math test."
   - "Can we practice it again in our next meeting?"
3. **Verify Message Features**:
   - [ ] Text box is appropriately sized for child
   - [ ] Simple formatting options (if any)
   - [ ] Emoji support for expression
   - [ ] Spell-check or simple corrections
4. Click "Send Message"
5. **Expected Result**: Message sends with confirmation

#### Step 3: Receive and Read Therapist Response
1. **Simulate therapist response** (or check existing messages)
2. **Expected Result**: Therapist message appears in child-friendly format
3. **Verify Response Display**:
   - [ ] Clear indication of who sent the message
   - [ ] Easy-to-read formatting
   - [ ] Appropriate content filtering
   - [ ] Encouraging and supportive tone

#### Step 4: Family Communication (Age-Appropriate)
1. Look for messages from guardian (Jennifer Smith)
2. **Verify Family Communication**:
   - [ ] Can receive messages from guardian
   - [ ] Messages are appropriate and supportive
   - [ ] Privacy controls respect child's age
   - [ ] Family messages are clearly identified

#### Step 5: Communication Safety Features
1. **Test content filtering** (if possible):
   - Try to send inappropriate content (mild test)
   - **Expected Result**: Content is filtered or flagged
   - Receive guidance about appropriate communication
2. **Verify Safety Reporting**:
   - [ ] "Report Problem" button is visible
   - [ ] Easy way to get help if uncomfortable
   - [ ] Clear instructions for seeking adult help

#### Step 6: Teenage Communication (Jordan, Age 14)
1. Switch to Jordan's account
2. **Test teenage communication features**:
   - More sophisticated messaging interface
   - Greater privacy controls
   - Direct communication with therapist
   - Appropriate level of guardian oversight
3. **Verify Age-Appropriate Privacy**:
   - [ ] More private communication with therapist
   - [ ] Appropriate boundaries with guardian access
   - [ ] Respect for developing independence
   - [ ] Still maintains safety monitoring

### ✅ Success Criteria
- [ ] Communication tools are safe and age-appropriate
- [ ] Messages are delivered securely and promptly
- [ ] Content filtering protects children appropriately
- [ ] Safety reporting features are easily accessible
- [ ] Age differences in privacy are respected

### 📝 Test Results
- **Status**: [ ] Pass [ ] Fail [ ] Blocked
- **Issues Found**: ________________________________
- **Screenshots**: ________________________________
- **Comments**: ___________________________________

---

## 🚨 Test Script 4: Emergency Features and Safety Tools
**Test Case ID**: TC-COMM-005
**Estimated Time**: 8 minutes

### Step-by-Step Instructions

#### Step 1: Locate Emergency Features
1. From Emma's dashboard, look for emergency/help features
2. **Expected Result**: Emergency button is prominently displayed
3. **Verify Emergency Button Design**:
   - [ ] Bright, attention-getting color (red or orange)
   - [ ] Large, easy-to-click size
   - [ ] Clear, simple label ("Get Help Now" or "Emergency")
   - [ ] Accessible from all main pages

#### Step 2: Understand Emergency Procedures (DO NOT ACTIVATE)
1. Look for "When to Get Help" or safety information
2. **Expected Result**: Child-friendly safety education
3. **Verify Safety Education**:
   - [ ] Simple explanations of when to seek help
   - [ ] Clear instructions about emergency button
   - [ ] Reassuring language about getting help
   - [ ] Contact information for trusted adults

#### Step 3: Practice Safety Scenarios (Educational)
1. Look for safety practice or educational games
2. **Expected Result**: Interactive safety learning tools
3. **Verify Safety Learning**:
   - [ ] Scenarios about when to ask for help
   - [ ] Practice identifying trusted adults
   - [ ] Understanding of appropriate vs. inappropriate situations
   - [ ] Encouragement to speak up about concerns

#### Step 4: Help and Support Resources
1. Navigate to "Get Help" or "Resources" section
2. **Expected Result**: Child-appropriate help resources
3. **Verify Help Resources**:
   - [ ] Crisis hotline numbers (child-friendly format)
   - [ ] Local emergency contacts
   - [ ] School counselor information
   - [ ] Trusted adult contact list

#### Step 5: Guardian Notification Understanding
1. **Review information about guardian notifications**:
   - When guardians are contacted
   - What information is shared
   - Why safety monitoring is important
2. **Expected Result**: Age-appropriate privacy explanations
3. **Verify Understanding**:
   - [ ] Clear explanation of safety monitoring
   - [ ] Reassurance about getting help
   - [ ] Understanding of guardian involvement
   - [ ] Encouragement to communicate openly

#### Step 6: Teenage Safety Features (Jordan, Age 14)
1. Switch to Jordan's account
2. **Review teenage safety features**:
   - More sophisticated safety resources
   - Age-appropriate crisis information
   - Respect for developing independence
   - Appropriate level of privacy
3. **Verify Teenage Safety Approach**:
   - [ ] More detailed safety information
   - [ ] Respect for teenage privacy needs
   - [ ] Appropriate crisis resources for teens
   - [ ] Balance of safety and independence

### ✅ Success Criteria
- [ ] Emergency features are easily accessible and understandable
- [ ] Safety education is age-appropriate and engaging
- [ ] Help resources are comprehensive and child-friendly
- [ ] Privacy explanations build trust and understanding
- [ ] Age differences in safety approaches are respected

### 📝 Test Results
- **Status**: [ ] Pass [ ] Fail [ ] Blocked
- **Issues Found**: ________________________________
- **Screenshots**: ________________________________
- **Comments**: ___________________________________

---

## 🎮 Test Script 5: Engagement Features and Age-Appropriate Content
**Test Case ID**: TC-CONT-003, TC-MOBILE-002
**Estimated Time**: 12 minutes

### Step-by-Step Instructions

#### Step 1: Explore Fun and Educational Content
1. Look for "Activities," "Games," or "Learn" section
2. **Expected Result**: Age-appropriate educational content
3. **Verify Content Features**:
   - [ ] Mental health education in child-friendly format
   - [ ] Interactive activities or games
   - [ ] Coping strategy practice tools
   - [ ] Positive reinforcement and encouragement

#### Step 2: Test Interactive Features (Emma, Age 10)
1. **Try interactive elements**:
   - Breathing exercise animations
   - Feeling identification games
   - Coping strategy practice
   - Achievement unlocking
2. **Verify Engagement**:
   - [ ] Activities are fun and engaging
   - [ ] Instructions are clear and simple
   - [ ] Feedback is positive and encouraging
   - [ ] Progress is tracked and celebrated

#### Step 3: Content Appropriateness Check
1. **Review all accessible content**:
   - Articles and resources
   - Educational materials
   - Activity instructions
   - Help and safety information
2. **Verify Age Appropriateness**:
   - [ ] Language is suitable for child's reading level
   - [ ] Content is emotionally appropriate
   - [ ] No frightening or overwhelming information
   - [ ] Positive, hopeful messaging throughout

#### Step 4: Mobile Touch Testing (If Available)
1. **Test on mobile device or tablet**:
   - Touch mood emoji selection
   - Swipe through mood history
   - Tap messaging features
   - Access emergency button
2. **Verify Touch Interactions**:
   - [ ] Touch targets are large enough for children
   - [ ] Gestures are simple and intuitive
   - [ ] No accidental activations
   - [ ] Responsive feedback for all touches

#### Step 5: Teenage Content and Features (Jordan, Age 14)
1. Switch to Jordan's account
2. **Explore teenage-appropriate content**:
   - More sophisticated mental health resources
   - Peer-related topics and advice
   - Independence and coping strategies
   - Age-appropriate crisis resources
3. **Verify Teenage Engagement**:
   - [ ] Content respects teenage maturity
   - [ ] Topics are relevant to adolescent concerns
   - [ ] Interface is less "childish" but still supportive
   - [ ] Privacy and independence are respected

#### Step 6: Accessibility and Inclusion
1. **Test accessibility features**:
   - Text size adjustment (if available)
   - High contrast options
   - Simple navigation
   - Clear visual hierarchy
2. **Verify Inclusive Design**:
   - [ ] Interface works for different abilities
   - [ ] Content is culturally sensitive
   - [ ] Language is inclusive and welcoming
   - [ ] No barriers to participation

### ✅ Success Criteria
- [ ] Content and activities are engaging and age-appropriate
- [ ] Interactive features work correctly and provide positive feedback
- [ ] Mobile interactions are child-friendly and responsive
- [ ] Age differences are respected in content and design
- [ ] Accessibility features support inclusive participation

### 📝 Test Results
- **Status**: [ ] Pass [ ] Fail [ ] Blocked
- **Issues Found**: ________________________________
- **Screenshots**: ________________________________
- **Comments**: ___________________________________

---

## 📋 Child User Testing Summary

### Overall Test Results
- **Total Test Scripts**: 5
- **Estimated Total Time**: 45 minutes
- **Critical Test Cases**: 2 (Authentication, Emergency Features)
- **High Priority Test Cases**: 3 (Mood Tracking, Communication, Safety)

### Test Completion Checklist
- [ ] Age-appropriate authentication and dashboard verified
- [ ] Mood tracking engagement and functionality confirmed
- [ ] Safe communication systems validated
- [ ] Emergency and safety features tested
- [ ] Content appropriateness and engagement verified

### Child Safety Validation
- [ ] Emergency features are easily accessible
- [ ] Content filtering protects children appropriately
- [ ] Privacy controls are age-appropriate
- [ ] Safety education is comprehensive and understandable
- [ ] Adult oversight is appropriately balanced with child autonomy

### Age-Appropriate Design Assessment
- [ ] Interface design matches developmental needs
- [ ] Language and instructions are clear and simple
- [ ] Visual design is engaging without being overwhelming
- [ ] Interaction patterns are intuitive for children
- [ ] Feedback and encouragement support positive engagement

### Developmental Considerations
**Younger Children (Ages 8-12)**:
- [ ] Simple, colorful interface with large buttons
- [ ] Clear safety guidelines and trusted adult involvement
- [ ] Fun, gamified elements that encourage participation
- [ ] Appropriate content filtering and monitoring

**Teenagers (Ages 13-17)**:
- [ ] More sophisticated interface respecting maturity
- [ ] Greater privacy controls while maintaining safety
- [ ] Age-appropriate content addressing teen concerns
- [ ] Balance of independence and appropriate oversight

### Issues Summary
**Critical Issues**: ___________________________
**High Priority Issues**: ____________________
**Medium Priority Issues**: __________________
**Low Priority Issues**: _____________________

### Child Development Expert Assessment
- [ ] Platform supports healthy emotional development
- [ ] Safety features provide appropriate protection
- [ ] Engagement strategies are developmentally sound
- [ ] Privacy approaches respect developmental needs
- [ ] Content and activities support therapeutic goals

### Recommendations
_________________________________________________
_________________________________________________
_________________________________________________

### Tester Sign-off
**Tester Name**: ____________________________
**Professional Background**: _________________
**Child Development Expertise**: _____________
**Date Completed**: _________________________
**Overall Status**: [ ] Pass [ ] Fail [ ] Conditional Pass
**Child Safety Approval**: [ ] Safe for child use
**Signature**: ______________________________

### Additional Notes
**Observed Child Engagement**: _______________
**Safety Concerns**: _________________________
**Accessibility Observations**: _______________
**Recommendations for Improvement**: __________