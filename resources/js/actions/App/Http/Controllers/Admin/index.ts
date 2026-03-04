import EmailTemplateController from './EmailTemplateController'
import AdminConnectionController from './AdminConnectionController'
import GroupMonitoringController from './GroupMonitoringController'
import UserManagementController from './UserManagementController'
import ContentModerationController from './ContentModerationController'
import MultiParticipantAppointmentController from './MultiParticipantAppointmentController'
import ContentManagementController from './ContentManagementController'
import CommentModerationController from './CommentModerationController'
import SystemReportsController from './SystemReportsController'

const Admin = {
    EmailTemplateController: Object.assign(EmailTemplateController, EmailTemplateController),
    AdminConnectionController: Object.assign(AdminConnectionController, AdminConnectionController),
    GroupMonitoringController: Object.assign(GroupMonitoringController, GroupMonitoringController),
    UserManagementController: Object.assign(UserManagementController, UserManagementController),
    ContentModerationController: Object.assign(ContentModerationController, ContentModerationController),
    MultiParticipantAppointmentController: Object.assign(MultiParticipantAppointmentController, MultiParticipantAppointmentController),
    ContentManagementController: Object.assign(ContentManagementController, ContentManagementController),
    CommentModerationController: Object.assign(CommentModerationController, CommentModerationController),
    SystemReportsController: Object.assign(SystemReportsController, SystemReportsController),
}

export default Admin