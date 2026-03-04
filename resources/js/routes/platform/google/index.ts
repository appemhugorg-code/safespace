import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PlatformGoogleController::connect
* @see app/Http/Controllers/PlatformGoogleController.php:16
* @route '/platform/google/connect'
*/
export const connect = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: connect.url(options),
    method: 'get',
})

connect.definition = {
    methods: ["get","head"],
    url: '/platform/google/connect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlatformGoogleController::connect
* @see app/Http/Controllers/PlatformGoogleController.php:16
* @route '/platform/google/connect'
*/
connect.url = (options?: RouteQueryOptions) => {
    return connect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlatformGoogleController::connect
* @see app/Http/Controllers/PlatformGoogleController.php:16
* @route '/platform/google/connect'
*/
connect.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: connect.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlatformGoogleController::connect
* @see app/Http/Controllers/PlatformGoogleController.php:16
* @route '/platform/google/connect'
*/
connect.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: connect.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlatformGoogleController::connect
* @see app/Http/Controllers/PlatformGoogleController.php:16
* @route '/platform/google/connect'
*/
const connectForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: connect.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlatformGoogleController::connect
* @see app/Http/Controllers/PlatformGoogleController.php:16
* @route '/platform/google/connect'
*/
connectForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: connect.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlatformGoogleController::connect
* @see app/Http/Controllers/PlatformGoogleController.php:16
* @route '/platform/google/connect'
*/
connectForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: connect.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

connect.form = connectForm

/**
* @see \App\Http\Controllers\PlatformGoogleController::callback
* @see app/Http/Controllers/PlatformGoogleController.php:22
* @route '/platform/google/callback'
*/
export const callback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})

callback.definition = {
    methods: ["get","head"],
    url: '/platform/google/callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlatformGoogleController::callback
* @see app/Http/Controllers/PlatformGoogleController.php:22
* @route '/platform/google/callback'
*/
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlatformGoogleController::callback
* @see app/Http/Controllers/PlatformGoogleController.php:22
* @route '/platform/google/callback'
*/
callback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlatformGoogleController::callback
* @see app/Http/Controllers/PlatformGoogleController.php:22
* @route '/platform/google/callback'
*/
callback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: callback.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlatformGoogleController::callback
* @see app/Http/Controllers/PlatformGoogleController.php:22
* @route '/platform/google/callback'
*/
const callbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: callback.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlatformGoogleController::callback
* @see app/Http/Controllers/PlatformGoogleController.php:22
* @route '/platform/google/callback'
*/
callbackForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: callback.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlatformGoogleController::callback
* @see app/Http/Controllers/PlatformGoogleController.php:22
* @route '/platform/google/callback'
*/
callbackForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: callback.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

callback.form = callbackForm

const google = {
    connect: Object.assign(connect, connect),
    callback: Object.assign(callback, callback),
}

export default google