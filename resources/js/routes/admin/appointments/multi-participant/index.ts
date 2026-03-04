import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::create
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:24
* @route '/admin/appointments/multi-participant/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/appointments/multi-participant/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::create
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:24
* @route '/admin/appointments/multi-participant/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::create
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:24
* @route '/admin/appointments/multi-participant/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::create
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:24
* @route '/admin/appointments/multi-participant/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::create
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:24
* @route '/admin/appointments/multi-participant/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::create
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:24
* @route '/admin/appointments/multi-participant/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::create
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:24
* @route '/admin/appointments/multi-participant/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::store
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:40
* @route '/admin/appointments/multi-participant'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/appointments/multi-participant',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::store
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:40
* @route '/admin/appointments/multi-participant'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::store
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:40
* @route '/admin/appointments/multi-participant'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::store
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:40
* @route '/admin/appointments/multi-participant'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::store
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:40
* @route '/admin/appointments/multi-participant'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::show
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:128
* @route '/admin/appointments/multi-participant/{appointment}'
*/
export const show = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/appointments/multi-participant/{appointment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::show
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:128
* @route '/admin/appointments/multi-participant/{appointment}'
*/
show.url = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{appointment}', parsedArgs.appointment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::show
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:128
* @route '/admin/appointments/multi-participant/{appointment}'
*/
show.get = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::show
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:128
* @route '/admin/appointments/multi-participant/{appointment}'
*/
show.head = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::show
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:128
* @route '/admin/appointments/multi-participant/{appointment}'
*/
const showForm = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::show
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:128
* @route '/admin/appointments/multi-participant/{appointment}'
*/
showForm.get = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::show
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:128
* @route '/admin/appointments/multi-participant/{appointment}'
*/
showForm.head = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::manageParticipants
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:145
* @route '/admin/appointments/multi-participant/{appointment}/manage-participants'
*/
export const manageParticipants = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageParticipants.url(args, options),
    method: 'get',
})

manageParticipants.definition = {
    methods: ["get","head"],
    url: '/admin/appointments/multi-participant/{appointment}/manage-participants',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::manageParticipants
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:145
* @route '/admin/appointments/multi-participant/{appointment}/manage-participants'
*/
manageParticipants.url = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return manageParticipants.definition.url
            .replace('{appointment}', parsedArgs.appointment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::manageParticipants
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:145
* @route '/admin/appointments/multi-participant/{appointment}/manage-participants'
*/
manageParticipants.get = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageParticipants.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::manageParticipants
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:145
* @route '/admin/appointments/multi-participant/{appointment}/manage-participants'
*/
manageParticipants.head = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manageParticipants.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::manageParticipants
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:145
* @route '/admin/appointments/multi-participant/{appointment}/manage-participants'
*/
const manageParticipantsForm = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageParticipants.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::manageParticipants
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:145
* @route '/admin/appointments/multi-participant/{appointment}/manage-participants'
*/
manageParticipantsForm.get = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageParticipants.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\MultiParticipantAppointmentController::manageParticipants
* @see app/Http/Controllers/Admin/MultiParticipantAppointmentController.php:145
* @route '/admin/appointments/multi-participant/{appointment}/manage-participants'
*/
manageParticipantsForm.head = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageParticipants.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

manageParticipants.form = manageParticipantsForm

const multiParticipant = {
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    manageParticipants: Object.assign(manageParticipants, manageParticipants),
}

export default multiParticipant