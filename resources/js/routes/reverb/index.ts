import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ReverbTestController::test
* @see app/Http/Controllers/ReverbTestController.php:14
* @route '/reverb-test'
*/
export const test = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: test.url(options),
    method: 'get',
})

test.definition = {
    methods: ["get","head"],
    url: '/reverb-test',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReverbTestController::test
* @see app/Http/Controllers/ReverbTestController.php:14
* @route '/reverb-test'
*/
test.url = (options?: RouteQueryOptions) => {
    return test.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReverbTestController::test
* @see app/Http/Controllers/ReverbTestController.php:14
* @route '/reverb-test'
*/
test.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: test.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReverbTestController::test
* @see app/Http/Controllers/ReverbTestController.php:14
* @route '/reverb-test'
*/
test.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: test.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReverbTestController::test
* @see app/Http/Controllers/ReverbTestController.php:14
* @route '/reverb-test'
*/
const testForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: test.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReverbTestController::test
* @see app/Http/Controllers/ReverbTestController.php:14
* @route '/reverb-test'
*/
testForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: test.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReverbTestController::test
* @see app/Http/Controllers/ReverbTestController.php:14
* @route '/reverb-test'
*/
testForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: test.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

test.form = testForm

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

const reverb = {
    test: Object.assign(test, test),
    status: Object.assign(status, status),
}

export default reverb