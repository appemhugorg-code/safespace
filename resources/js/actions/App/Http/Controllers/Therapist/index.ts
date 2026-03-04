import TherapistConnectionController from './TherapistConnectionController'
import AvailabilityController from './AvailabilityController'
import AvailabilitySlotController from './AvailabilitySlotController'
import ConsultationController from './ConsultationController'
import AppointmentController from './AppointmentController'
import TherapistController from './TherapistController'

const Therapist = {
    TherapistConnectionController: Object.assign(TherapistConnectionController, TherapistConnectionController),
    AvailabilityController: Object.assign(AvailabilityController, AvailabilityController),
    AvailabilitySlotController: Object.assign(AvailabilitySlotController, AvailabilitySlotController),
    ConsultationController: Object.assign(ConsultationController, ConsultationController),
    AppointmentController: Object.assign(AppointmentController, AppointmentController),
    TherapistController: Object.assign(TherapistController, TherapistController),
}

export default Therapist