import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::redirect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:19
* @route '/auth/google'
*/
export const redirect = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})

redirect.definition = {
    methods: ["get","head"],
    url: '/auth/google',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::redirect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:19
* @route '/auth/google'
*/
redirect.url = (options?: RouteQueryOptions) => {
    return redirect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::redirect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:19
* @route '/auth/google'
*/
redirect.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::redirect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:19
* @route '/auth/google'
*/
redirect.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirect.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::redirect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:19
* @route '/auth/google'
*/
const redirectForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirect.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::redirect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:19
* @route '/auth/google'
*/
redirectForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirect.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::redirect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:19
* @route '/auth/google'
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
* @see \App\Http\Controllers\Auth\GoogleAuthController::callback
* @see app/Http/Controllers/Auth/GoogleAuthController.php:36
* @route '/auth/google/callback'
*/
export const callback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})

callback.definition = {
    methods: ["get","head"],
    url: '/auth/google/callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::callback
* @see app/Http/Controllers/Auth/GoogleAuthController.php:36
* @route '/auth/google/callback'
*/
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::callback
* @see app/Http/Controllers/Auth/GoogleAuthController.php:36
* @route '/auth/google/callback'
*/
callback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::callback
* @see app/Http/Controllers/Auth/GoogleAuthController.php:36
* @route '/auth/google/callback'
*/
callback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: callback.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::callback
* @see app/Http/Controllers/Auth/GoogleAuthController.php:36
* @route '/auth/google/callback'
*/
const callbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: callback.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::callback
* @see app/Http/Controllers/Auth/GoogleAuthController.php:36
* @route '/auth/google/callback'
*/
callbackForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: callback.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::callback
* @see app/Http/Controllers/Auth/GoogleAuthController.php:36
* @route '/auth/google/callback'
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

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::disconnect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:72
* @route '/auth/google/disconnect'
*/
export const disconnect = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: disconnect.url(options),
    method: 'post',
})

disconnect.definition = {
    methods: ["post"],
    url: '/auth/google/disconnect',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::disconnect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:72
* @route '/auth/google/disconnect'
*/
disconnect.url = (options?: RouteQueryOptions) => {
    return disconnect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::disconnect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:72
* @route '/auth/google/disconnect'
*/
disconnect.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: disconnect.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::disconnect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:72
* @route '/auth/google/disconnect'
*/
const disconnectForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: disconnect.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::disconnect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:72
* @route '/auth/google/disconnect'
*/
disconnectForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: disconnect.url(options),
    method: 'post',
})

disconnect.form = disconnectForm

const GoogleAuthController = { redirect, callback, disconnect }

export default GoogleAuthController