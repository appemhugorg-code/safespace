import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\EmailTestController::email
* @see app/Http/Controllers/EmailTestController.php:10
* @route '/test-email'
*/
export const email = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: email.url(options),
    method: 'get',
})

email.definition = {
    methods: ["get","head"],
    url: '/test-email',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmailTestController::email
* @see app/Http/Controllers/EmailTestController.php:10
* @route '/test-email'
*/
email.url = (options?: RouteQueryOptions) => {
    return email.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmailTestController::email
* @see app/Http/Controllers/EmailTestController.php:10
* @route '/test-email'
*/
email.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: email.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmailTestController::email
* @see app/Http/Controllers/EmailTestController.php:10
* @route '/test-email'
*/
email.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: email.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmailTestController::email
* @see app/Http/Controllers/EmailTestController.php:10
* @route '/test-email'
*/
const emailForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: email.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmailTestController::email
* @see app/Http/Controllers/EmailTestController.php:10
* @route '/test-email'
*/
emailForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: email.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmailTestController::email
* @see app/Http/Controllers/EmailTestController.php:10
* @route '/test-email'
*/
emailForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: email.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

email.form = emailForm

const test = {
    email: Object.assign(email, email),
}

export default test