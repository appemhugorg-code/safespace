import connections from './connections'
import therapist from './therapist'
import mood from './mood'

const child = {
    connections: Object.assign(connections, connections),
    therapist: Object.assign(therapist, therapist),
    mood: Object.assign(mood, mood),
}

export default child