import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PlatformGoogleController::redirect
* @see app/Http/Controllers/PlatformGoogleController.php:16
* @route '/platform/google/connect'
*/
export const redirect = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})

redirect.definition = {
    methods: ["get","head"],
    url: '/platform/google/connect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlatformGoogleController::redirect
* @see app/Http/Controllers/PlatformGoogleController.php:16
* @route '/platform/google/connect'
*/
redirect.url = (options?: RouteQueryOptions) => {
    return redirect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlatformGoogleController::redirect
* @see app/Http/Controllers/PlatformGoogleController.php:16
* @route '/platform/google/connect'
*/
redirect.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlatformGoogleController::redirect
* @see app/Http/Controllers/PlatformGoogleController.php:16
* @route '/platform/google/connect'
*/
redirect.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirect.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlatformGoogleController::redirect
* @see app/Http/Controllers/PlatformGoogleController.php:16
* @route '/platform/google/connect'
*/
const redirectForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirect.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlatformGoogleController::redirect
* @see app/Http/Controllers/PlatformGoogleController.php:16
* @route '/platform/google/connect'
*/
redirectForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirect.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlatformGoogleController::redirect
* @see app/Http/Controllers/PlatformGoogleController.php:16
* @route '/platform/google/connect'
*/
redirectForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirect.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

redirect.form = redirectForm

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

const PlatformGoogleController = { redirect, callback }

export default PlatformGoogleController