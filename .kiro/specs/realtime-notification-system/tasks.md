# Implementation Plan

- [x] 1. Create database schema and migrations for notification system





  - Create notifications table migration with all required fields
  - Create notification_preferences table migration
  - Add indexes for performance optimization
  - Run migrations to create tables
  - _Requirements: All requirements (foundation)_

- [x] 2. Create Notification model and relationships


  - Create Notification model with fillable fields and casts
  - Add relationship methods (user)
  - Implement helper methods (markAsRead, markAsUnread, isRead, isUnread)
  - Add query scopes (unread, read, forUser, ofType, recent)
  - _Requirements: 1.1, 4.1, 5.1, 5.2, 7.1_

- [x] 3. Create NotificationPreference model


  - Create NotificationPreference model with fillable fields
  - Add relationship to User model
  - Implement helper methods (isInQuietHours, wantsNotification)
  - Add default preferences on user creation
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 4. Implement NotificationService


  - Create NotificationService class with type constants
  - Implement create() method for single notifications
  - Implement createBatch() method for multiple users
  - Implement getUnreadCount() method
  - Implement getRecent() method
  - Implement markAsRead() and markAllAsRead() methods
  - Implement delete() and deleteAllRead() methods
  - Add getIconForType() helper method
  - _Requirements: 8.1-8.7, 12.1-12.6_

- [x] 5. Create NotificationCreated event for real-time broadcasting


  - Create NotificationCreated event class
  - Implement ShouldBroadcast interface
  - Configure private channel broadcasting (user.{id})
  - Define broadcast data structure
  - Test event broadcasting with Reverb
  - _Requirements: 3.1, 3.2, 3.4, 3.5_

- [x] 6. Create NotificationController with API endpoints


  - Create NotificationController class
  - Implement index() method for notifications page
  - Implement recent() method for dropdown API
  - Implement markAsRead() method
  - Implement markAllAsRead() method
  - Implement destroy() method for deleting notifications
  - Implement deleteAllRead() method
  - Add authorization checks for all methods
  - _Requirements: 2.1, 4.1, 4.4, 5.1, 5.3, 6.1, 6.4, 7.1_

- [x] 7. Add API routes for notification endpoints


  - Add GET /notifications route for index page
  - Add GET /api/notifications/recent route for dropdown
  - Add POST /api/notifications/{id}/read route
  - Add POST /api/notifications/mark-all-read route
  - Add DELETE /api/notifications/{id} route
  - Add DELETE /api/notifications/clear-read route
  - Apply auth middleware to all routes
  - _Requirements: 2.1, 4.1, 5.1, 6.1_

- [x] 8. Create useNotifications React hook


  - Create useNotifications hook with state management
  - Implement fetchNotifications() function
  - Set up Laravel Echo listener for real-time notifications
  - Implement markAsRead() function with API call
  - Implement deleteNotification() function with API call
  - Add toast notification display for high-priority notifications
  - Add notification sound playback
  - Handle cleanup on unmount
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1_

- [x] 9. Create NotificationBell component


  - Create NotificationBell component with bell icon
  - Display unread count badge
  - Handle badge display for counts > 99
  - Add click handler to toggle dropdown
  - Style unread indicator
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 10. Create NotificationDropdown component



  - Create dropdown panel component
  - Display list of recent notifications (10 max)
  - Show notification icon, title, message, and timestamp
  - Distinguish unread notifications visually
  - Add "View All" link to full notifications page
  - Add "Mark All as Read" button
  - Implement click handlers for notifications
  - Handle dropdown close on outside click
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 5.3_


- [x] 11. Create NotificationItem component

  - Create individual notification item component
  - Display notification icon based on type
  - Display title, message, and relative timestamp
  - Add visual distinction for unread notifications
  - Implement click handler to navigate and mark as read
  - Add delete button with confirmation
  - Add mark as read/unread toggle
  - _Requirements: 2.3, 4.1, 4.2, 4.3, 5.1, 5.2, 6.1_


- [x] 12. Create ToastNotification component

  - Create toast notification component
  - Position in bottom-right corner
  - Auto-dismiss after 5 seconds
  - Add close button
  - Support different priority styles
  - Implement slide-in animation
  - Stack multiple toasts
  - _Requirements: 3.2, 8.7_

- [x] 13. Create notifications index page


  - Create notifications/index.tsx page component
  - Display all notifications with pagination
  - Add filter by type dropdown
  - Add filter by read/unread status
  - Implement "Mark All as Read" button
  - Implement "Clear All Read" button
  - Show empty state when no notifications
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 14. Integrate NotificationBell into app layout


  - Add NotificationBell component to AppLayout header
  - Position next to user menu
  - Ensure proper z-index for dropdown
  - Test on all pages
  - _Requirements: 1.1_

- [x] 15. Update existing features to use NotificationService


  - Update TherapistAppointmentController to use NotificationService
  - Update appointment confirmation to create notifications
  - Update panic alert system to create notifications
  - Update message system to create notifications
  - Update article publishing to create notifications
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 12.1_

- [x] 16. Create notification preferences page


  - Create notification-preferences.tsx page
  - Add toggles for each notification type
  - Add toggle for real-time notifications
  - Add toggle for notification sounds
  - Add toggle for push notifications
  - Add quiet hours time pickers
  - Implement save functionality
  - Show success message on save
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [x] 17. Implement notification sound system



  - Add notification sound file to public/sounds
  - Create sound playback utility function
  - Check user preferences before playing
  - Handle audio playback errors gracefully
  - Add volume control option
  - _Requirements: 3.3, 9.4_

- [ ]* 18. Implement browser push notifications
  - Request notification permission from user
  - Store push subscription in database
  - Implement push notification sending in NotificationService
  - Handle push notification clicks
  - Test on different browsers
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ]* 19. Implement notification grouping
  - Add grouping logic to NotificationService
  - Group similar notifications within time window
  - Display grouped notifications with count
  - Implement expand/collapse for grouped notifications
  - Limit grouping to 10 notifications per group
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ]* 20. Add accessibility features
  - Add ARIA labels to all notification components
  - Implement keyboard navigation (Tab, Enter, Escape)
  - Add screen reader announcements for new notifications
  - Test with screen readers
  - Add high contrast mode support
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ]* 21. Implement performance optimizations
  - Add database indexes for common queries
  - Implement notification caching with Redis
  - Add lazy loading for notification list
  - Optimize WebSocket message size
  - Create job to archive old notifications (>90 days)
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ]* 22. Create admin notification interface
  - Create admin page for sending system notifications
  - Add user/role selector for targeting
  - Add priority and expiration fields
  - Add notification preview
  - Implement scheduled notification sending
  - Track delivery status
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

- [ ]* 23. Write tests for notification system
  - Write unit tests for NotificationService
  - Write unit tests for Notification model
  - Write feature tests for notification creation
  - Write feature tests for API endpoints
  - Write integration tests for real-time delivery
  - Test WebSocket broadcasting
  - Test notification preferences
  - _Requirements: All requirements_
