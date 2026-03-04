import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import requests from './requests'
/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::index
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:43
* @route '/guardian/connections'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/guardian/connections',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::index
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:43
* @route '/guardian/connections'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::index
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:43
* @route '/guardian/connections'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::index
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:43
* @route '/guardian/connections'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::index
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:43
* @route '/guardian/connections'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::index
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:43
* @route '/guardian/connections'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::index
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:43
* @route '/guardian/connections'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::search
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:118
* @route '/guardian/connections/search'
*/
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/guardian/connections/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::search
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:118
* @route '/guardian/connections/search'
*/
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::search
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:118
* @route '/guardian/connections/search'
*/
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::search
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:118
* @route '/guardian/connections/search'
*/
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::search
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:118
* @route '/guardian/connections/search'
*/
const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::search
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:118
* @route '/guardian/connections/search'
*/
searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::search
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:118
* @route '/guardian/connections/search'
*/
searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

search.form = searchForm

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::childAssignment
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:230
* @route '/guardian/connections/child-assignment'
*/
export const childAssignment = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: childAssignment.url(options),
    method: 'get',
})

childAssignment.definition = {
    methods: ["get","head"],
    url: '/guardian/connections/child-assignment',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::childAssignment
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:230
* @route '/guardian/connections/child-assignment'
*/
childAssignment.url = (options?: RouteQueryOptions) => {
    return childAssignment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::childAssignment
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:230
* @route '/guardian/connections/child-assignment'
*/
childAssignment.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: childAssignment.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::childAssignment
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:230
* @route '/guardian/connections/child-assignment'
*/
childAssignment.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: childAssignment.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::childAssignment
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:230
* @route '/guardian/connections/child-assignment'
*/
const childAssignmentForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: childAssignment.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::childAssignment
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:230
* @route '/guardian/connections/child-assignment'
*/
childAssignmentForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: childAssignment.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::childAssignment
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:230
* @route '/guardian/connections/child-assignment'
*/
childAssignmentForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: childAssignment.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

childAssignment.form = childAssignmentForm

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::show
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:397
* @route '/guardian/connections/{connection}'
*/
export const show = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/guardian/connections/{connection}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::show
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:397
* @route '/guardian/connections/{connection}'
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
* @see \App\Http\Controllers\Guardian\ClientConnectionController::show
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:397
* @route '/guardian/connections/{connection}'
*/
show.get = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::show
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:397
* @route '/guardian/connections/{connection}'
*/
show.head = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::show
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:397
* @route '/guardian/connections/{connection}'
*/
const showForm = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::show
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:397
* @route '/guardian/connections/{connection}'
*/
showForm.get = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::show
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:397
* @route '/guardian/connections/{connection}'
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
    index: Object.assign(index, index),
    search: Object.assign(search, search),
    childAssignment: Object.assign(childAssignment, childAssignment),
    show: Object.assign(show, show),
    requests: Object.assign(requests, requests),
}

export default connections