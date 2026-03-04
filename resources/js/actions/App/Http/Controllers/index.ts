import Auth from './Auth'
import Api from './Api'
import GroupController from './GroupController'
import MessageController from './MessageController'
import UserEmailPreferencesController from './UserEmailPreferencesController'
import Admin from './Admin'
import Therapist from './Therapist'
import Guardian from './Guardian'
import Child from './Child'
import AppointmentController from './AppointmentController'
import NotificationController from './NotificationController'
import HealthController from './HealthController'
import EmailTestController from './EmailTestController'
import ReverbTestController from './ReverbTestController'
import DashboardController from './DashboardController'
import Settings from './Settings'
import PlatformGoogleController from './PlatformGoogleController'
import MoodLogController from './MoodLogController'
import EmergencyController from './EmergencyController'
import PanicAlertController from './PanicAlertController'
import ArticleController from './ArticleController'
import GameController from './GameController'
import AnalyticsController from './AnalyticsController'

const Controllers = {
    Auth: Object.assign(Auth, Auth),
    Api: Object.assign(Api, Api),
    GroupController: Object.assign(GroupController, GroupController),
    MessageController: Object.assign(MessageController, MessageController),
    UserEmailPreferencesController: Object.assign(UserEmailPreferencesController, UserEmailPreferencesController),
    Admin: Object.assign(Admin, Admin),
    Therapist: Object.assign(Therapist, Therapist),
    Guardian: Object.assign(Guardian, Guardian),
    Child: Object.assign(Child, Child),
    AppointmentController: Object.assign(AppointmentController, AppointmentController),
    NotificationController: Object.assign(NotificationController, NotificationController),
    HealthController: Object.assign(HealthController, HealthController),
    EmailTestController: Object.assign(EmailTestController, EmailTestController),
    ReverbTestController: Object.assign(ReverbTestController, ReverbTestController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    Settings: Object.assign(Settings, Settings),
    PlatformGoogleController: Object.assign(PlatformGoogleController, PlatformGoogleController),
    MoodLogController: Object.assign(MoodLogController, MoodLogController),
    EmergencyController: Object.assign(EmergencyController, EmergencyController),
    PanicAlertController: Object.assign(PanicAlertController, PanicAlertController),
    ArticleController: Object.assign(ArticleController, ArticleController),
    GameController: Object.assign(GameController, GameController),
    AnalyticsController: Object.assign(AnalyticsController, AnalyticsController),
}

export default Controllers