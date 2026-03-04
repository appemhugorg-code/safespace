import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReverbTestController::index
* @see app/Http/Controllers/ReverbTestController.php:14
* @route '/reverb-test'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reverb-test',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReverbTestController::index
* @see app/Http/Controllers/ReverbTestController.php:14
* @route '/reverb-test'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReverbTestController::index
* @see app/Http/Controllers/ReverbTestController.php:14
* @route '/reverb-test'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReverbTestController::index
* @see app/Http/Controllers/ReverbTestController.php:14
* @route '/reverb-test'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReverbTestController::index
* @see app/Http/Controllers/ReverbTestController.php:14
* @route '/reverb-test'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReverbTestController::index
* @see app/Http/Controllers/ReverbTestController.php:14
* @route '/reverb-test'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReverbTestController::index
* @see app/Http/Controllers/ReverbTestController.php:14
* @route '/reverb-test'
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
* @see \App\Http\Controllers\ReverbTestController::status
* @see app/Http/Controllers/ReverbTestController.php:22
* @route '/reverb/status'
*/
export const status = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/reverb/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReverbTestController::status
* @see app/Http/Controllers/ReverbTestController.php:22
* @route '/reverb/status'
*/
status.url = (options?: RouteQueryOptions) => {
    return status.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReverbTestController::status
* @see app/Http/Controllers/ReverbTestController.php:22
* @route '/reverb/status'
*/
status.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReverbTestController::status
* @see app/Http/Controllers/ReverbTestController.php:22
* @route '/reverb/status'
*/
status.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReverbTestController::status
* @see app/Http/Controllers/ReverbTestController.php:22
* @route '/reverb/status'
*/
const statusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReverbTestController::status
* @see app/Http/Controllers/ReverbTestController.php:22
* @route '/reverb/status'
*/
statusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReverbTestController::status
* @see app/Http/Controllers/ReverbTestController.php:22
* @route '/reverb/status'
*/
statusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

status.form = statusForm

const ReverbTestController = { index, status }

export default ReverbTestController