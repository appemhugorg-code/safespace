import AuthController from './AuthController'
import UserPreferenceController from './UserPreferenceController'
import ThemePreferenceController from './ThemePreferenceController'
import TherapistAvailabilityController from './TherapistAvailabilityController'
import MultiParticipantAppointmentController from './MultiParticipantAppointmentController'
import ContentAnalyticsController from './ContentAnalyticsController'
import ArticleInteractionController from './ArticleInteractionController'
import VideoSessionController from './VideoSessionController'
import SessionRecordingController from './SessionRecordingController'
import SessionLogController from './SessionLogController'

const Api = {
    AuthController: Object.assign(AuthController, AuthController),
    UserPreferenceController: Object.assign(UserPreferenceController, UserPreferenceController),
    ThemePreferenceController: Object.assign(ThemePreferenceController, ThemePreferenceController),
    TherapistAvailabilityController: Object.assign(TherapistAvailabilityController, TherapistAvailabilityController),
    MultiParticipantAppointmentController: Object.assign(MultiParticipantAppointmentController, MultiParticipantAppointmentController),
    ContentAnalyticsController: Object.assign(ContentAnalyticsController, ContentAnalyticsController),
    ArticleInteractionController: Object.assign(ArticleInteractionController, ArticleInteractionController),
    VideoSessionController: Object.assign(VideoSessionController, VideoSessionController),
    SessionRecordingController: Object.assign(SessionRecordingController, SessionRecordingController),
    SessionLogController: Object.assign(SessionLogController, SessionLogController),
}

export default Api