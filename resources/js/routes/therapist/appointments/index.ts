import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Therapist\AppointmentController::create
* @see app/Http/Controllers/Therapist/AppointmentController.php:23
* @route '/therapist/appointments/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/therapist/appointments/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Therapist\AppointmentController::create
* @see app/Http/Controllers/Therapist/AppointmentController.php:23
* @route '/therapist/appointments/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\AppointmentController::create
* @see app/Http/Controllers/Therapist/AppointmentController.php:23
* @route '/therapist/appointments/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\AppointmentController::create
* @see app/Http/Controllers/Therapist/AppointmentController.php:23
* @route '/therapist/appointments/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Therapist\AppointmentController::create
* @see app/Http/Controllers/Therapist/AppointmentController.php:23
* @route '/therapist/appointments/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\AppointmentController::create
* @see app/Http/Controllers/Therapist/AppointmentController.php:23
* @route '/therapist/appointments/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\AppointmentController::create
* @see app/Http/Controllers/Therapist/AppointmentController.php:23
* @route '/therapist/appointments/create'
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
* @see \App\Http\Controllers\Therapist\AppointmentController::store
* @see app/Http/Controllers/Therapist/AppointmentController.php:70
* @route '/therapist/appointments'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/therapist/appointments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Therapist\AppointmentController::store
* @see app/Http/Controllers/Therapist/AppointmentController.php:70
* @route '/therapist/appointments'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\AppointmentController::store
* @see app/Http/Controllers/Therapist/AppointmentController.php:70
* @route '/therapist/appointments'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\AppointmentController::store
* @see app/Http/Controllers/Therapist/AppointmentController.php:70
* @route '/therapist/appointments'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\AppointmentController::store
* @see app/Http/Controllers/Therapist/AppointmentController.php:70
* @route '/therapist/appointments'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const appointments = {
    create: Object.assign(create, create),
    store: Object.assign(store, store),
}

export default appointments