# SafeSpace UAT Test Users Guide

## 🎯 Overview

This document provides comprehensive information about the test user accounts created for SafeSpace UAT. These accounts are designed to simulate realistic usage scenarios and provide comprehensive testing coverage across all user roles.

## 👥 User Account Structure

### Account Naming Convention
- **Email Format**: `{role}{number}-uat@safespace.com`
- **Password Pattern**: `UAT{Role}2024!`
- **Consistent Credentials**: All accounts use predictable patterns for easy testing

### Family Relationships
The test data includes realistic family structures:
- **Smith Family**: Jennifer Smith (Guardian) → Emma Smith (10) + Jordan Taylor (14)
- **Williams Family**: Robert Williams (Guardian) → Alex Williams (12)
- **Garcia Family**: Maria Garcia (Guardian) → Sofia Garcia (8)

### Therapist Assignments
- **Dr. Sarah Johnson**: Assigned to Emma Smith and Alex Williams
- **Dr. Michael Chen**: Assigned to Sofia Garcia
- **Dr. Emily Rodriguez**: Assigned to Jordan Taylor

## 🔐 Test User Accounts

### Admin Users

#### Primary Admin
- **Email**: `admin-uat@safespace.com`
- **Password**: `UATAdmin2024!`
- **Name**: UAT Admin User
- **Role**: System Administrator
- **Created**: 30 days ago
- **Purpose**: Primary admin testing, user management, system oversight

#### Secondary Admin
- **Email**: `admin2-uat@safespace.com`
- **Password**: `UATAdmin2024!`
- **Name**: UAT System Administrator
- **Role**: System Administrator
- **Created**: 25 days ago
- **Purpose**: Multi-admin scenarios, backup admin testing

### Therapist Users

#### Dr. Sarah Johnson
- **Email**: `therapist1-uat@safespace.com`
- **Password**: `UATTherapist2024!`
- **Name**: Dr. Sarah Johnson (UAT)
- **Role**: Therapist
- **License**: PSY-UAT-001
- **Phone**: +1-555-0101
- **Specializations**: Anxiety Disorders, Mood Disorders, ADHD, Family Therapy
- **Bio**: Child psychologist specializing in anxiety and mood disorders. 15+ years experience working with children and adolescents.
- **Clients**: Emma Smith (10), Alex Williams (12)
- **Availability**: Monday-Friday 9 AM-5 PM, Saturday 10 AM-2 PM
- **Created**: 20 days ago

#### Dr. Michael Chen
- **Email**: `therapist2-uat@safespace.com`
- **Password**: `UATTherapist2024!`
- **Name**: Dr. Michael Chen (UAT)
- **Role**: Therapist
- **License**: LCSW-UAT-002
- **Phone**: +1-555-0102
- **Specializations**: Trauma Therapy, Behavioral Issues, Social Skills, Group Therapy
- **Bio**: Licensed clinical social worker with expertise in trauma-informed care and behavioral interventions.
- **Clients**: Sofia Garcia (8)
- **Availability**: Monday-Friday 9 AM-5 PM
- **Created**: 18 days ago

#### Dr. Emily Rodriguez
- **Email**: `therapist3-uat@safespace.com`
- **Password**: `UATTherapist2024!`
- **Name**: Dr. Emily Rodriguez (UAT)
- **Role**: Therapist
- **License**: MD-UAT-003
- **Phone**: +1-555-0103
- **Specializations**: Autism Spectrum, ADHD, Medication Management, Developmental Delays
- **Bio**: Pediatric psychiatrist focusing on developmental disorders and medication management.
- **Clients**: Jordan Taylor (14)
- **Availability**: Monday-Friday 9 AM-5 PM
- **Created**: 15 days ago

### Guardian Users

#### Jennifer Smith
- **Email**: `guardian1-uat@safespace.com`
- **Password**: `UATGuardian2024!`
- **Name**: Jennifer Smith (UAT)
- **Role**: Guardian/Parent
- **Phone**: +1-555-0201
- **Address**: 123 Maple Street, Springfield, IL 62701
- **Emergency Contact**: David Smith (+1-555-0202)
- **Children**: Emma Smith (10), Jordan Taylor (14)
- **Created**: 12 days ago

#### Robert Williams
- **Email**: `guardian2-uat@safespace.com`
- **Password**: `UATGuardian2024!`
- **Name**: Robert Williams (UAT)
- **Role**: Guardian/Parent
- **Phone**: +1-555-0203
- **Address**: 456 Oak Avenue, Springfield, IL 62702
- **Emergency Contact**: Lisa Williams (+1-555-0204)
- **Children**: Alex Williams (12)
- **Created**: 10 days ago

#### Maria Garcia
- **Email**: `guardian3-uat@safespace.com`
- **Password**: `UATGuardian2024!`
- **Name**: Maria Garcia (UAT)
- **Role**: Guardian/Parent
- **Phone**: +1-555-0205
- **Address**: 789 Pine Road, Springfield, IL 62703
- **Emergency Contact**: Carlos Garcia (+1-555-0206)
- **Children**: Sofia Garcia (8)
- **Created**: 8 days ago

### Child Users

#### Emma Smith
- **Email**: `child1-uat@safespace.com`
- **Password**: `UATChild2024!`
- **Name**: Emma Smith (UAT)
- **Role**: Child
- **Age**: 10 years, 3 months
- **Grade**: 5th Grade
- **School**: Springfield Elementary School
- **Guardian**: Jennifer Smith
- **Therapist**: Dr. Sarah Johnson
- **Allergies**: None
- **Medications**: None
- **Mood Data**: 30 days of varied mood entries
- **Created**: 12 days ago

#### Alex Williams
- **Email**: `child2-uat@safespace.com`
- **Password**: `UATChild2024!`
- **Name**: Alex Williams (UAT)
- **Role**: Child
- **Age**: 12 years, 7 months
- **Grade**: 7th Grade
- **School**: Springfield Middle School
- **Guardian**: Robert Williams
- **Therapist**: Dr. Sarah Johnson
- **Allergies**: Peanuts
- **Medications**: Albuterol inhaler as needed
- **Mood Data**: 30 days of varied mood entries
- **Created**: 10 days ago

#### Sofia Garcia
- **Email**: `child3-uat@safespace.com`
- **Password**: `UATChild2024!`
- **Name**: Sofia Garcia (UAT)
- **Role**: Child
- **Age**: 8 years, 11 months
- **Grade**: 3rd Grade
- **School**: Springfield Elementary School
- **Guardian**: Maria Garcia
- **Therapist**: Dr. Michael Chen
- **Allergies**: None
- **Medications**: None
- **Mood Data**: 30 days of varied mood entries
- **Created**: 8 days ago

#### Jordan Taylor
- **Email**: `child4-uat@safespace.com`
- **Password**: `UATChild2024!`
- **Name**: Jordan Taylor (UAT)
- **Role**: Child
- **Age**: 14 years, 2 months
- **Grade**: 9th Grade
- **School**: Springfield High School
- **Guardian**: Jennifer Smith (second child)
- **Therapist**: Dr. Emily Rodriguez
- **Allergies**: Shellfish
- **Medications**: Sertraline 25mg daily
- **Mood Data**: 30 days of varied mood entries
- **Created**: 6 days ago

## 📊 Test Data Overview

### Mood Tracking Data
- **30 days** of historical mood data for each child
- **Realistic patterns** with weekend variations
- **85% completion rate** (some days skipped to simulate real usage)
- **Weighted distribution**: Very Happy (15%), Happy (35%), Neutral (30%), Sad (15%), Very Sad (5%)
- **Contextual notes** for mood entries

### Appointment Data
- **Past appointments** with completed status and session notes
- **Upcoming appointments** with Google Meet links
- **Varied durations**: 45, 60, and 90-minute sessions
- **Realistic scheduling** during therapist availability hours

### Communication Data
- **Multi-party conversations** between guardians, therapists, and children
- **Realistic message content** related to therapy progress and concerns
- **Mixed read/unread status** for testing notification systems
- **Appropriate content** for each user role

### Content Library
- **4 published articles** covering common mental health topics
- **Role-appropriate content** for guardians and children
- **Multiple categories**: anxiety, coping-skills, emotional-development, family-support
- **Authored by different therapists** to test content management

## 🧪 Testing Scenarios

### Authentication Testing
1. **Login with each user role** to verify role-based dashboards
2. **Password reset functionality** for all account types
3. **Email verification process** (if enabled)
4. **Session management** and timeout behavior

### Role-Based Access Control
1. **Admin access** to all system functions and user management
2. **Therapist access** limited to assigned clients only
3. **Guardian access** restricted to their children's data
4. **Child access** to age-appropriate features only

### Family Relationship Testing
1. **Guardian-child data sharing** and privacy controls
2. **Multi-child families** (Jennifer Smith has 2 children)
3. **Therapist-client assignments** and data access
4. **Cross-family data isolation** verification

### Workflow Testing
1. **Mood tracking workflows** with different children
2. **Appointment scheduling** across multiple therapists
3. **Message threading** between different user combinations
4. **Content discovery** and role-appropriate filtering

## 🔧 Account Management

### Resetting Test Data
```bash
# Reset all UAT data (destructive)
php artisan uat:setup --fresh

# Re-seed test data only
php artisan db:seed --class=UATTestDataSeeder
```

### Checking Account Status
```bash
# Check all test accounts
php artisan uat:status

# Detailed status with user information
php artisan uat:status --detailed
```

### Creating Additional Test Users
```bash
# Use the UAT seeder as a template
# Modify database/seeders/UATTestDataSeeder.php
# Add new users following the existing patterns
```

## 🚨 Important Notes

### Security Considerations
- **Test passwords** are intentionally simple for UAT purposes
- **Real production** should use strong, unique passwords
- **Email addresses** use the safespace.com domain for testing
- **Personal data** is fictional and safe for testing

### Data Privacy
- All test data is **fictional** and created specifically for UAT
- No real personal information is used
- Test data can be safely shared with UAT participants
- Data is reset regularly to maintain test environment integrity

### Usage Guidelines
- **Use appropriate test accounts** for each testing scenario
- **Don't modify core test data** during UAT sessions
- **Report any authentication issues** immediately
- **Document any role-based access problems** for resolution

## 📞 Support

### Account Issues
- **Login problems**: Check credentials against this document
- **Role access issues**: Verify user role assignments
- **Data inconsistencies**: Run `php artisan uat:status` to check

### Contact Information
- **UAT Coordinator**: uat-coordinator@safespace.com
- **Technical Support**: uat-support@safespace.com
- **Emergency Contact**: [Phone number for critical issues]

---

**Last Updated**: Generated during UAT setup
**Environment**: UAT Testing Environment
**Version**: 1.0.0