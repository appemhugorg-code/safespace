import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Therapist\TherapistController::clients
* @see app/Http/Controllers/Therapist/TherapistController.php:16
* @route '/clients'
*/
export const clients = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clients.url(options),
    method: 'get',
})

clients.definition = {
    methods: ["get","head"],
    url: '/clients',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clients
* @see app/Http/Controllers/Therapist/TherapistController.php:16
* @route '/clients'
*/
clients.url = (options?: RouteQueryOptions) => {
    return clients.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clients
* @see app/Http/Controllers/Therapist/TherapistController.php:16
* @route '/clients'
*/
clients.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clients.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clients
* @see app/Http/Controllers/Therapist/TherapistController.php:16
* @route '/clients'
*/
clients.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: clients.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clients
* @see app/Http/Controllers/Therapist/TherapistController.php:16
* @route '/clients'
*/
const clientsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: clients.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clients
* @see app/Http/Controllers/Therapist/TherapistController.php:16
* @route '/clients'
*/
clientsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: clients.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clients
* @see app/Http/Controllers/Therapist/TherapistController.php:16
* @route '/clients'
*/
clientsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: clients.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

clients.form = clientsForm

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clientDetail
* @see app/Http/Controllers/Therapist/TherapistController.php:172
* @route '/clients/{client}'
*/
export const clientDetail = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clientDetail.url(args, options),
    method: 'get',
})

clientDetail.definition = {
    methods: ["get","head"],
    url: '/clients/{client}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clientDetail
* @see app/Http/Controllers/Therapist/TherapistController.php:172
* @route '/clients/{client}'
*/
clientDetail.url = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { client: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { client: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            client: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        client: typeof args.client === 'object'
        ? args.client.id
        : args.client,
    }

    return clientDetail.definition.url
            .replace('{client}', parsedArgs.client.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clientDetail
* @see app/Http/Controllers/Therapist/TherapistController.php:172
* @route '/clients/{client}'
*/
clientDetail.get = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clientDetail.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clientDetail
* @see app/Http/Controllers/Therapist/TherapistController.php:172
* @route '/clients/{client}'
*/
clientDetail.head = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: clientDetail.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clientDetail
* @see app/Http/Controllers/Therapist/TherapistController.php:172
* @route '/clients/{client}'
*/
const clientDetailForm = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: clientDetail.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clientDetail
* @see app/Http/Controllers/Therapist/TherapistController.php:172
* @route '/clients/{client}'
*/
clientDetailForm.get = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: clientDetail.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistController::clientDetail
* @see app/Http/Controllers/Therapist/TherapistController.php:172
* @route '/clients/{client}'
*/
clientDetailForm.head = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: clientDetail.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

clientDetail.form = clientDetailForm

const TherapistController = { clients, clientDetail }

export default TherapistController