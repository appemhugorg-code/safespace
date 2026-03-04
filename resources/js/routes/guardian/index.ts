import children from './children'
import childAssignments from './child-assignments'
import connections from './connections'

const guardian = {
    children: Object.assign(children, children),
    childAssignments: Object.assign(childAssignments, childAssignments),
    connections: Object.assign(connections, connections),
}

export default guardian