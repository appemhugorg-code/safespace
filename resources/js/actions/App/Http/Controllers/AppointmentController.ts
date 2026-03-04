import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AppointmentController::availableSlots
* @see app/Http/Controllers/AppointmentController.php:418
* @route '/api/appointments/available-slots'
*/
export const availableSlots = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableSlots.url(options),
    method: 'get',
})

availableSlots.definition = {
    methods: ["get","head"],
    url: '/api/appointments/available-slots',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AppointmentController::availableSlots
* @see app/Http/Controllers/AppointmentController.php:418
* @route '/api/appointments/available-slots'
*/
availableSlots.url = (options?: RouteQueryOptions) => {
    return availableSlots.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppointmentController::availableSlots
* @see app/Http/Controllers/AppointmentController.php:418
* @route '/api/appointments/available-slots'
*/
availableSlots.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableSlots.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppointmentController::availableSlots
* @see app/Http/Controllers/AppointmentController.php:418
* @route '/api/appointments/available-slots'
*/
availableSlots.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: availableSlots.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AppointmentController::availableSlots
* @see app/Http/Controllers/AppointmentController.php:418
* @route '/api/appointments/available-slots'
*/
const availableSlotsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableSlots.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppointmentController::availableSlots
* @see app/Http/Controllers/AppointmentController.php:418
* @route '/api/appointments/available-slots'
*/
availableSlotsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableSlots.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppointmentController::availableSlots
* @see app/Http/Controllers/AppointmentController.php:418
* @route '/api/appointments/available-slots'
*/
availableSlotsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableSlots.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

availableSlots.form = availableSlotsForm

/**
* @see \App\Http\Controllers\AppointmentController::availableDates
* @see app/Http/Controllers/AppointmentController.php:492
* @route '/api/appointments/available-dates'
*/
export const availableDates = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableDates.url(options),
    method: 'get',
})

availableDates.definition = {
    methods: ["get","head"],
    url: '/api/appointments/available-dates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AppointmentController::availableDates
* @see app/Http/Controllers/AppointmentController.php:492
* @route '/api/appointments/available-dates'
*/
availableDates.url = (options?: RouteQueryOptions) => {
    return availableDates.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppointmentController::availableDates
* @see app/Http/Controllers/AppointmentController.php:492
* @route '/api/appointments/available-dates'
*/
availableDates.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableDates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppointmentController::availableDates
* @see app/Http/Controllers/AppointmentController.php:492
* @route '/api/appointments/available-dates'
*/
availableDates.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: availableDates.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AppointmentController::availableDates
* @see app/Http/Controllers/AppointmentController.php:492
* @route '/api/appointments/available-dates'
*/
const availableDatesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableDates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppointmentController::availableDates
* @see app/Http/Controllers/AppointmentController.php:492
* @route '/api/appointments/available-dates'
*/
availableDatesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableDates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppointmentController::availableDates
* @see app/Http/Controllers/AppointmentController.php:492
* @route '/api/appointments/available-dates'
*/
availableDatesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableDates.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

availableDates.form = availableDatesForm

/**
* @see \App\Http\Controllers\AppointmentController::index
* @see app/Http/Controllers/AppointmentController.php:29
* @route '/appointments'
*/
const indexe7ddd6b1bac7a26288996d16d0724198 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexe7ddd6b1bac7a26288996d16d0724198.url(options),
    method: 'get',
})

indexe7ddd6b1bac7a26288996d16d0724198.definition = {
    methods: ["get","head"],
    url: '/appointments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AppointmentController::index
* @see app/Http/Controllers/AppointmentController.php:29
* @route '/appointments'
*/
indexe7ddd6b1bac7a26288996d16d0724198.url = (options?: RouteQueryOptions) => {
    return indexe7ddd6b1bac7a26288996d16d0724198.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppointmentController::index
* @see app/Http/Controllers/AppointmentController.php:29
* @route '/appointments'
*/
indexe7ddd6b1bac7a26288996d16d0724198.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexe7ddd6b1bac7a26288996d16d0724198.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppointmentController::index
* @see app/Http/Controllers/AppointmentController.php:29
* @route '/appointments'
*/
indexe7ddd6b1bac7a26288996d16d0724198.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexe7ddd6b1bac7a26288996d16d0724198.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AppointmentController::index
* @see app/Http/Controllers/AppointmentController.php:29
* @route '/appointments'
*/
const indexe7ddd6b1bac7a26288996d16d0724198Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexe7ddd6b1bac7a26288996d16d0724198.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppointmentController::index
* @see app/Http/Controllers/AppointmentController.php:29
* @route '/appointments'
*/
indexe7ddd6b1bac7a26288996d16d0724198Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexe7ddd6b1bac7a26288996d16d0724198.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppointmentController::index
* @see app/Http/Controllers/AppointmentController.php:29
* @route '/appointments'
*/
indexe7ddd6b1bac7a26288996d16d0724198Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexe7ddd6b1bac7a26288996d16d0724198.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

indexe7ddd6b1bac7a26288996d16d0724198.form = indexe7ddd6b1bac7a26288996d16d0724198Form
/**
* @see \App\Http\Controllers\AppointmentController::index
* @see app/Http/Controllers/AppointmentController.php:29
* @route '/appointments-v2'
*/
const index9908705d05088b7f4bdf97070cb36153 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index9908705d05088b7f4bdf97070cb36153.url(options),
    method: 'get',
})

index9908705d05088b7f4bdf97070cb36153.definition = {
    methods: ["get","head"],
    url: '/appointments-v2',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AppointmentController::index
* @see app/Http/Controllers/AppointmentController.php:29
* @route '/appointments-v2'
*/
index9908705d05088b7f4bdf97070cb36153.url = (options?: RouteQueryOptions) => {
    return index9908705d05088b7f4bdf97070cb36153.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppointmentController::index
* @see app/Http/Controllers/AppointmentController.php:29
* @route '/appointments-v2'
*/
index9908705d05088b7f4bdf97070cb36153.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index9908705d05088b7f4bdf97070cb36153.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppointmentController::index
* @see app/Http/Controllers/AppointmentController.php:29
* @route '/appointments-v2'
*/
index9908705d05088b7f4bdf97070cb36153.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index9908705d05088b7f4bdf97070cb36153.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AppointmentController::index
* @see app/Http/Controllers/AppointmentController.php:29
* @route '/appointments-v2'
*/
const index9908705d05088b7f4bdf97070cb36153Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index9908705d05088b7f4bdf97070cb36153.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppointmentController::index
* @see app/Http/Controllers/AppointmentController.php:29
* @route '/appointments-v2'
*/
index9908705d05088b7f4bdf97070cb36153Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index9908705d05088b7f4bdf97070cb36153.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppointmentController::index
* @see app/Http/Controllers/AppointmentController.php:29
* @route '/appointments-v2'
*/
index9908705d05088b7f4bdf97070cb36153Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index9908705d05088b7f4bdf97070cb36153.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index9908705d05088b7f4bdf97070cb36153.form = index9908705d05088b7f4bdf97070cb36153Form

export const index = {
    '/appointments': indexe7ddd6b1bac7a26288996d16d0724198,
    '/appointments-v2': index9908705d05088b7f4bdf97070cb36153,
}

/**
* @see \App\Http\Controllers\AppointmentController::create
* @see app/Http/Controllers/AppointmentController.php:86
* @route '/appointments/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/appointments/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AppointmentController::create
* @see app/Http/Controllers/AppointmentController.php:86
* @route '/appointments/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppointmentController::create
* @see app/Http/Controllers/AppointmentController.php:86
* @route '/appointments/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppointmentController::create
* @see app/Http/Controllers/AppointmentController.php:86
* @route '/appointments/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AppointmentController::create
* @see app/Http/Controllers/AppointmentController.php:86
* @route '/appointments/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppointmentController::create
* @see app/Http/Controllers/AppointmentController.php:86
* @route '/appointments/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppointmentController::create
* @see app/Http/Controllers/AppointmentController.php:86
* @route '/appointments/create'
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
* @see \App\Http\Controllers\AppointmentController::store
* @see app/Http/Controllers/AppointmentController.php:152
* @route '/appointments'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/appointments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AppointmentController::store
* @see app/Http/Controllers/AppointmentController.php:152
* @route '/appointments'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppointmentController::store
* @see app/Http/Controllers/AppointmentController.php:152
* @route '/appointments'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AppointmentController::store
* @see app/Http/Controllers/AppointmentController.php:152
* @route '/appointments'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AppointmentController::store
* @see app/Http/Controllers/AppointmentController.php:152
* @route '/appointments'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AppointmentController::show
* @see app/Http/Controllers/AppointmentController.php:249
* @route '/appointments/{appointment}'
*/
export const show = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/appointments/{appointment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AppointmentController::show
* @see app/Http/Controllers/AppointmentController.php:249
* @route '/appointments/{appointment}'
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
* @see \App\Http\Controllers\AppointmentController::show
* @see app/Http/Controllers/AppointmentController.php:249
* @route '/appointments/{appointment}'
*/
show.get = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppointmentController::show
* @see app/Http/Controllers/AppointmentController.php:249
* @route '/appointments/{appointment}'
*/
show.head = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AppointmentController::show
* @see app/Http/Controllers/AppointmentController.php:249
* @route '/appointments/{appointment}'
*/
const showForm = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppointmentController::show
* @see app/Http/Controllers/AppointmentController.php:249
* @route '/appointments/{appointment}'
*/
showForm.get = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppointmentController::show
* @see app/Http/Controllers/AppointmentController.php:249
* @route '/appointments/{appointment}'
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
* @see \App\Http\Controllers\AppointmentController::confirm
* @see app/Http/Controllers/AppointmentController.php:299
* @route '/appointments/{appointment}/confirm'
*/
export const confirm = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: confirm.url(args, options),
    method: 'patch',
})

confirm.definition = {
    methods: ["patch"],
    url: '/appointments/{appointment}/confirm',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AppointmentController::confirm
* @see app/Http/Controllers/AppointmentController.php:299
* @route '/appointments/{appointment}/confirm'
*/
confirm.url = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return confirm.definition.url
            .replace('{appointment}', parsedArgs.appointment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppointmentController::confirm
* @see app/Http/Controllers/AppointmentController.php:299
* @route '/appointments/{appointment}/confirm'
*/
confirm.patch = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: confirm.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AppointmentController::confirm
* @see app/Http/Controllers/AppointmentController.php:299
* @route '/appointments/{appointment}/confirm'
*/
const confirmForm = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: confirm.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AppointmentController::confirm
* @see app/Http/Controllers/AppointmentController.php:299
* @route '/appointments/{appointment}/confirm'
*/
confirmForm.patch = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: confirm.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

confirm.form = confirmForm

/**
* @see \App\Http\Controllers\AppointmentController::complete
* @see app/Http/Controllers/AppointmentController.php:395
* @route '/appointments/{appointment}/complete'
*/
export const complete = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: complete.url(args, options),
    method: 'patch',
})

complete.definition = {
    methods: ["patch"],
    url: '/appointments/{appointment}/complete',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AppointmentController::complete
* @see app/Http/Controllers/AppointmentController.php:395
* @route '/appointments/{appointment}/complete'
*/
complete.url = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return complete.definition.url
            .replace('{appointment}', parsedArgs.appointment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppointmentController::complete
* @see app/Http/Controllers/AppointmentController.php:395
* @route '/appointments/{appointment}/complete'
*/
complete.patch = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: complete.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AppointmentController::complete
* @see app/Http/Controllers/AppointmentController.php:395
* @route '/appointments/{appointment}/complete'
*/
const completeForm = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: complete.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AppointmentController::complete
* @see app/Http/Controllers/AppointmentController.php:395
* @route '/appointments/{appointment}/complete'
*/
completeForm.patch = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: complete.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

complete.form = completeForm

/**
* @see \App\Http\Controllers\AppointmentController::cancel
* @see app/Http/Controllers/AppointmentController.php:352
* @route '/appointments/{appointment}/cancel'
*/
export const cancel = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancel.url(args, options),
    method: 'patch',
})

cancel.definition = {
    methods: ["patch"],
    url: '/appointments/{appointment}/cancel',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AppointmentController::cancel
* @see app/Http/Controllers/AppointmentController.php:352
* @route '/appointments/{appointment}/cancel'
*/
cancel.url = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return cancel.definition.url
            .replace('{appointment}', parsedArgs.appointment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppointmentController::cancel
* @see app/Http/Controllers/AppointmentController.php:352
* @route '/appointments/{appointment}/cancel'
*/
cancel.patch = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancel.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AppointmentController::cancel
* @see app/Http/Controllers/AppointmentController.php:352
* @route '/appointments/{appointment}/cancel'
*/
const cancelForm = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancel.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AppointmentController::cancel
* @see app/Http/Controllers/AppointmentController.php:352
* @route '/appointments/{appointment}/cancel'
*/
cancelForm.patch = (args: { appointment: number | { id: number } } | [appointment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancel.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

cancel.form = cancelForm

const AppointmentController = { availableSlots, availableDates, index, create, store, show, confirm, complete, cancel }

export default AppointmentController