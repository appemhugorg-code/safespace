import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\HealthController::index
* @see app/Http/Controllers/HealthController.php:14
* @route '/health'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/health',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HealthController::index
* @see app/Http/Controllers/HealthController.php:14
* @route '/health'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HealthController::index
* @see app/Http/Controllers/HealthController.php:14
* @route '/health'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HealthController::index
* @see app/Http/Controllers/HealthController.php:14
* @route '/health'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HealthController::index
* @see app/Http/Controllers/HealthController.php:14
* @route '/health'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HealthController::index
* @see app/Http/Controllers/HealthController.php:14
* @route '/health'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HealthController::index
* @see app/Http/Controllers/HealthController.php:14
* @route '/health'
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
* @see \App\Http\Controllers\HealthController::ping
* @see app/Http/Controllers/HealthController.php:79
* @route '/ping'
*/
export const ping = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ping.url(options),
    method: 'get',
})

ping.definition = {
    methods: ["get","head"],
    url: '/ping',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HealthController::ping
* @see app/Http/Controllers/HealthController.php:79
* @route '/ping'
*/
ping.url = (options?: RouteQueryOptions) => {
    return ping.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HealthController::ping
* @see app/Http/Controllers/HealthController.php:79
* @route '/ping'
*/
ping.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ping.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HealthController::ping
* @see app/Http/Controllers/HealthController.php:79
* @route '/ping'
*/
ping.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ping.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\HealthController::ping
* @see app/Http/Controllers/HealthController.php:79
* @route '/ping'
*/
const pingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ping.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HealthController::ping
* @see app/Http/Controllers/HealthController.php:79
* @route '/ping'
*/
pingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ping.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\HealthController::ping
* @see app/Http/Controllers/HealthController.php:79
* @route '/ping'
*/
pingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ping.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

ping.form = pingForm

const HealthController = { index, ping }

export default HealthController