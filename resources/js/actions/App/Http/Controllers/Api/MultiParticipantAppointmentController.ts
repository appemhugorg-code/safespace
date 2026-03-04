import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::createGroupSession
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:23
* @route '/api/appointments/group-session'
*/
export const createGroupSession = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createGroupSession.url(options),
    method: 'post',
})

createGroupSession.definition = {
    methods: ["post"],
    url: '/api/appointments/group-session',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::createGroupSession
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:23
* @route '/api/appointments/group-session'
*/
createGroupSession.url = (options?: RouteQueryOptions) => {
    return createGroupSession.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::createGroupSession
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:23
* @route '/api/appointments/group-session'
*/
createGroupSession.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createGroupSession.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::createGroupSession
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:23
* @route '/api/appointments/group-session'
*/
const createGroupSessionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createGroupSession.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::createGroupSession
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:23
* @route '/api/appointments/group-session'
*/
createGroupSessionForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createGroupSession.url(options),
    method: 'post',
})

createGroupSession.form = createGroupSessionForm

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::createFamilySession
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:64
* @route '/api/appointments/family-session'
*/
export const createFamilySession = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createFamilySession.url(options),
    method: 'post',
})

createFamilySession.definition = {
    methods: ["post"],
    url: '/api/appointments/family-session',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::createFamilySession
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:64
* @route '/api/appointments/family-session'
*/
createFamilySession.url = (options?: RouteQueryOptions) => {
    return createFamilySession.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::createFamilySession
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:64
* @route '/api/appointments/family-session'
*/
createFamilySession.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createFamilySession.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::createFamilySession
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:64
* @route '/api/appointments/family-session'
*/
const createFamilySessionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createFamilySession.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::createFamilySession
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:64
* @route '/api/appointments/family-session'
*/
createFamilySessionForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createFamilySession.url(options),
    method: 'post',
})

createFamilySession.form = createFamilySessionForm

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::createConsultation
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:103
* @route '/api/appointments/consultation'
*/
export const createConsultation = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createConsultation.url(options),
    method: 'post',
})

createConsultation.definition = {
    methods: ["post"],
    url: '/api/appointments/consultation',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::createConsultation
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:103
* @route '/api/appointments/consultation'
*/
createConsultation.url = (options?: RouteQueryOptions) => {
    return createConsultation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::createConsultation
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:103
* @route '/api/appointments/consultation'
*/
createConsultation.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createConsultation.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::createConsultation
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:103
* @route '/api/appointments/consultation'
*/
const createConsultationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createConsultation.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::createConsultation
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:103
* @route '/api/appointments/consultation'
*/
createConsultationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createConsultation.url(options),
    method: 'post',
})

createConsultation.form = createConsultationForm

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::addParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:143
* @route '/api/appointments/{appointment}/participants'
*/
export const addParticipant = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addParticipant.url(args, options),
    method: 'post',
})

addParticipant.definition = {
    methods: ["post"],
    url: '/api/appointments/{appointment}/participants',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::addParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:143
* @route '/api/appointments/{appointment}/participants'
*/
addParticipant.url = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { appointment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { appointment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            appointment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        appointment: typeof args.appointment === 'object'
        ? args.appointment.id
        : args.appointment,
    }

    return addParticipant.definition.url
            .replace('{appointment}', parsedArgs.appointment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::addParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:143
* @route '/api/appointments/{appointment}/participants'
*/
addParticipant.post = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addParticipant.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::addParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:143
* @route '/api/appointments/{appointment}/participants'
*/
const addParticipantForm = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addParticipant.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::addParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:143
* @route '/api/appointments/{appointment}/participants'
*/
addParticipantForm.post = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: addParticipant.url(args, options),
    method: 'post',
})

addParticipant.form = addParticipantForm

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::removeParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:179
* @route '/api/appointments/{appointment}/participants/{userId}'
*/
export const removeParticipant = (args: { appointment: number | { id: number }, userId: string | number } | [appointment: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeParticipant.url(args, options),
    method: 'delete',
})

removeParticipant.definition = {
    methods: ["delete"],
    url: '/api/appointments/{appointment}/participants/{userId}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::removeParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:179
* @route '/api/appointments/{appointment}/participants/{userId}'
*/
removeParticipant.url = (args: { appointment: number | { id: number }, userId: string | number } | [appointment: number | { id: number }, userId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            appointment: args[0],
            userId: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        appointment: typeof args.appointment === 'object'
        ? args.appointment.id
        : args.appointment,
        userId: args.userId,
    }

    return removeParticipant.definition.url
            .replace('{appointment}', parsedArgs.appointment.toString())
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::removeParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:179
* @route '/api/appointments/{appointment}/participants/{userId}'
*/
removeParticipant.delete = (args: { appointment: number | { id: number }, userId: string | number } | [appointment: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeParticipant.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::removeParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:179
* @route '/api/appointments/{appointment}/participants/{userId}'
*/
const removeParticipantForm = (args: { appointment: number | { id: number }, userId: string | number } | [appointment: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeParticipant.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::removeParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:179
* @route '/api/appointments/{appointment}/participants/{userId}'
*/
removeParticipantForm.delete = (args: { appointment: number | { id: number }, userId: string | number } | [appointment: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeParticipant.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

removeParticipant.form = removeParticipantForm

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::confirmParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:204
* @route '/api/appointments/{appointment}/participants/{userId}/confirm'
*/
export const confirmParticipant = (args: { appointment: number | { id: number }, userId: string | number } | [appointment: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmParticipant.url(args, options),
    method: 'post',
})

confirmParticipant.definition = {
    methods: ["post"],
    url: '/api/appointments/{appointment}/participants/{userId}/confirm',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::confirmParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:204
* @route '/api/appointments/{appointment}/participants/{userId}/confirm'
*/
confirmParticipant.url = (args: { appointment: number | { id: number }, userId: string | number } | [appointment: number | { id: number }, userId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            appointment: args[0],
            userId: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        appointment: typeof args.appointment === 'object'
        ? args.appointment.id
        : args.appointment,
        userId: args.userId,
    }

    return confirmParticipant.definition.url
            .replace('{appointment}', parsedArgs.appointment.toString())
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::confirmParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:204
* @route '/api/appointments/{appointment}/participants/{userId}/confirm'
*/
confirmParticipant.post = (args: { appointment: number | { id: number }, userId: string | number } | [appointment: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmParticipant.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::confirmParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:204
* @route '/api/appointments/{appointment}/participants/{userId}/confirm'
*/
const confirmParticipantForm = (args: { appointment: number | { id: number }, userId: string | number } | [appointment: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: confirmParticipant.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::confirmParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:204
* @route '/api/appointments/{appointment}/participants/{userId}/confirm'
*/
confirmParticipantForm.post = (args: { appointment: number | { id: number }, userId: string | number } | [appointment: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: confirmParticipant.url(args, options),
    method: 'post',
})

confirmParticipant.form = confirmParticipantForm

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::declineParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:223
* @route '/api/appointments/{appointment}/participants/{userId}/decline'
*/
export const declineParticipant = (args: { appointment: number | { id: number }, userId: string | number } | [appointment: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: declineParticipant.url(args, options),
    method: 'post',
})

declineParticipant.definition = {
    methods: ["post"],
    url: '/api/appointments/{appointment}/participants/{userId}/decline',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::declineParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:223
* @route '/api/appointments/{appointment}/participants/{userId}/decline'
*/
declineParticipant.url = (args: { appointment: number | { id: number }, userId: string | number } | [appointment: number | { id: number }, userId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            appointment: args[0],
            userId: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        appointment: typeof args.appointment === 'object'
        ? args.appointment.id
        : args.appointment,
        userId: args.userId,
    }

    return declineParticipant.definition.url
            .replace('{appointment}', parsedArgs.appointment.toString())
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::declineParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:223
* @route '/api/appointments/{appointment}/participants/{userId}/decline'
*/
declineParticipant.post = (args: { appointment: number | { id: number }, userId: string | number } | [appointment: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: declineParticipant.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::declineParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:223
* @route '/api/appointments/{appointment}/participants/{userId}/decline'
*/
const declineParticipantForm = (args: { appointment: number | { id: number }, userId: string | number } | [appointment: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: declineParticipant.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::declineParticipant
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:223
* @route '/api/appointments/{appointment}/participants/{userId}/decline'
*/
declineParticipantForm.post = (args: { appointment: number | { id: number }, userId: string | number } | [appointment: number | { id: number }, userId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: declineParticipant.url(args, options),
    method: 'post',
})

declineParticipant.form = declineParticipantForm

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::getParticipants
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:242
* @route '/api/appointments/{appointment}/participants'
*/
export const getParticipants = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getParticipants.url(args, options),
    method: 'get',
})

getParticipants.definition = {
    methods: ["get","head"],
    url: '/api/appointments/{appointment}/participants',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::getParticipants
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:242
* @route '/api/appointments/{appointment}/participants'
*/
getParticipants.url = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { appointment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { appointment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            appointment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        appointment: typeof args.appointment === 'object'
        ? args.appointment.id
        : args.appointment,
    }

    return getParticipants.definition.url
            .replace('{appointment}', parsedArgs.appointment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::getParticipants
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:242
* @route '/api/appointments/{appointment}/participants'
*/
getParticipants.get = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getParticipants.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::getParticipants
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:242
* @route '/api/appointments/{appointment}/participants'
*/
getParticipants.head = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getParticipants.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::getParticipants
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:242
* @route '/api/appointments/{appointment}/participants'
*/
const getParticipantsForm = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getParticipants.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::getParticipants
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:242
* @route '/api/appointments/{appointment}/participants'
*/
getParticipantsForm.get = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getParticipants.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::getParticipants
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:242
* @route '/api/appointments/{appointment}/participants'
*/
getParticipantsForm.head = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getParticipants.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getParticipants.form = getParticipantsForm

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::getStats
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:262
* @route '/api/appointments/{appointment}/stats'
*/
export const getStats = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStats.url(args, options),
    method: 'get',
})

getStats.definition = {
    methods: ["get","head"],
    url: '/api/appointments/{appointment}/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::getStats
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:262
* @route '/api/appointments/{appointment}/stats'
*/
getStats.url = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { appointment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { appointment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            appointment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        appointment: typeof args.appointment === 'object'
        ? args.appointment.id
        : args.appointment,
    }

    return getStats.definition.url
            .replace('{appointment}', parsedArgs.appointment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::getStats
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:262
* @route '/api/appointments/{appointment}/stats'
*/
getStats.get = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStats.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::getStats
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:262
* @route '/api/appointments/{appointment}/stats'
*/
getStats.head = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getStats.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::getStats
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:262
* @route '/api/appointments/{appointment}/stats'
*/
const getStatsForm = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getStats.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::getStats
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:262
* @route '/api/appointments/{appointment}/stats'
*/
getStatsForm.get = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getStats.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\MultiParticipantAppointmentController::getStats
* @see app/Http/Controllers/Api/MultiParticipantAppointmentController.php:262
* @route '/api/appointments/{appointment}/stats'
*/
getStatsForm.head = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getStats.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getStats.form = getStatsForm

const MultiParticipantAppointmentController = { createGroupSession, createFamilySession, createConsultation, addParticipant, removeParticipant, confirmParticipant, declineParticipant, getParticipants, getStats }

export default MultiParticipantAppointmentController