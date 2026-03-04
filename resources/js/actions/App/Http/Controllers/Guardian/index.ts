import ClientConnectionController from './ClientConnectionController'
import ChildManagementController from './ChildManagementController'

const Guardian = {
    ClientConnectionController: Object.assign(ClientConnectionController, ClientConnectionController),
    ChildManagementController: Object.assign(ChildManagementController, ChildManagementController),
}

export default Guardian