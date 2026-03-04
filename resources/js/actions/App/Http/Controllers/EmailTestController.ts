import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmailTestController::sendTest
* @see app/Http/Controllers/EmailTestController.php:10
* @route '/test-email'
*/
export const sendTest = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sendTest.url(options),
    method: 'get',
})

sendTest.definition = {
    methods: ["get","head"],
    url: '/test-email',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmailTestController::sendTest
* @see app/Http/Controllers/EmailTestController.php:10
* @route '/test-email'
*/
sendTest.url = (options?: RouteQueryOptions) => {
    return sendTest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmailTestController::sendTest
* @see app/Http/Controllers/EmailTestController.php:10
* @route '/test-email'
*/
sendTest.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sendTest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmailTestController::sendTest
* @see app/Http/Controllers/EmailTestController.php:10
* @route '/test-email'
*/
sendTest.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sendTest.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmailTestController::sendTest
* @see app/Http/Controllers/EmailTestController.php:10
* @route '/test-email'
*/
const sendTestForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sendTest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmailTestController::sendTest
* @see app/Http/Controllers/EmailTestController.php:10
* @route '/test-email'
*/
sendTestForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sendTest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmailTestController::sendTest
* @see app/Http/Controllers/EmailTestController.php:10
* @route '/test-email'
*/
sendTestForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sendTest.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

sendTest.form = sendTestForm

const EmailTestController = { sendTest }

export default EmailTestController