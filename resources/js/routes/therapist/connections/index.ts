import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::guardians
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:133
* @route '/therapist/connections/guardians'
*/
export const guardians = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: guardians.url(options),
    method: 'get',
})

guardians.definition = {
    methods: ["get","head"],
    url: '/therapist/connections/guardians',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::guardians
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:133
* @route '/therapist/connections/guardians'
*/
guardians.url = (options?: RouteQueryOptions) => {
    return guardians.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::guardians
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:133
* @route '/therapist/connections/guardians'
*/
guardians.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: guardians.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::guardians
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:133
* @route '/therapist/connections/guardians'
*/
guardians.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: guardians.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::guardians
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:133
* @route '/therapist/connections/guardians'
*/
const guardiansForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: guardians.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::guardians
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:133
* @route '/therapist/connections/guardians'
*/
guardiansForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: guardians.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::guardians
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:133
* @route '/therapist/connections/guardians'
*/
guardiansForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: guardians.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

guardians.form = guardiansForm

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::children
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:189
* @route '/therapist/connections/children'
*/
export const children = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: children.url(options),
    method: 'get',
})

children.definition = {
    methods: ["get","head"],
    url: '/therapist/connections/children',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::children
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:189
* @route '/therapist/connections/children'
*/
children.url = (options?: RouteQueryOptions) => {
    return children.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::children
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:189
* @route '/therapist/connections/children'
*/
children.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: children.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::children
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:189
* @route '/therapist/connections/children'
*/
children.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: children.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::children
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:189
* @route '/therapist/connections/children'
*/
const childrenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: children.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::children
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:189
* @route '/therapist/connections/children'
*/
childrenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: children.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::children
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:189
* @route '/therapist/connections/children'
*/
childrenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: children.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

children.form = childrenForm

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::requests
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:238
* @route '/therapist/connections/requests'
*/
export const requests = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: requests.url(options),
    method: 'get',
})

requests.definition = {
    methods: ["get","head"],
    url: '/therapist/connections/requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::requests
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:238
* @route '/therapist/connections/requests'
*/
requests.url = (options?: RouteQueryOptions) => {
    return requests.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::requests
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:238
* @route '/therapist/connections/requests'
*/
requests.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: requests.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::requests
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:238
* @route '/therapist/connections/requests'
*/
requests.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: requests.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::requests
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:238
* @route '/therapist/connections/requests'
*/
const requestsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: requests.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::requests
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:238
* @route '/therapist/connections/requests'
*/
requestsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: requests.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::requests
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:238
* @route '/therapist/connections/requests'
*/
requestsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: requests.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

requests.form = requestsForm

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::show
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:482
* @route '/therapist/connections/{connection}'
*/
export const show = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/therapist/connections/{connection}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::show
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:482
* @route '/therapist/connections/{connection}'
*/
show.url = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { connection: args }
    }

    if (Array.isArray(args)) {
        args = {
            connection: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        connection: args.connection,
    }

    return show.definition.url
            .replace('{connection}', parsedArgs.connection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::show
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:482
* @route '/therapist/connections/{connection}'
*/
show.get = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::show
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:482
* @route '/therapist/connections/{connection}'
*/
show.head = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::show
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:482
* @route '/therapist/connections/{connection}'
*/
const showForm = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::show
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:482
* @route '/therapist/connections/{connection}'
*/
showForm.get = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::show
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:482
* @route '/therapist/connections/{connection}'
*/
showForm.head = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const connections = {
    guardians: Object.assign(guardians, guardians),
    children: Object.assign(children, children),
    requests: Object.assign(requests, requests),
    show: Object.assign(show, show),
}

export default connections