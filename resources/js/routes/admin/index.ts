import users from './users'
import groups from './groups'
import moderation from './moderation'
import appointments from './appointments'
import content from './content'
import comments from './comments'
import connections from './connections'
import reports from './reports'

const admin = {
    users: Object.assign(users, users),
    groups: Object.assign(groups, groups),
    moderation: Object.assign(moderation, moderation),
    appointments: Object.assign(appointments, appointments),
    content: Object.assign(content, content),
    comments: Object.assign(comments, comments),
    connections: Object.assign(connections, connections),
    reports: Object.assign(reports, reports),
}

export default admin