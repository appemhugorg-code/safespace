import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmergencyController::index
* @see app/Http/Controllers/EmergencyController.php:23
* @route '/emergency'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/emergency',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmergencyController::index
* @see app/Http/Controllers/EmergencyController.php:23
* @route '/emergency'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmergencyController::index
* @see app/Http/Controllers/EmergencyController.php:23
* @route '/emergency'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmergencyController::index
* @see app/Http/Controllers/EmergencyController.php:23
* @route '/emergency'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmergencyController::index
* @see app/Http/Controllers/EmergencyController.php:23
* @route '/emergency'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmergencyController::index
* @see app/Http/Controllers/EmergencyController.php:23
* @route '/emergency'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmergencyController::index
* @see app/Http/Controllers/EmergencyController.php:23
* @route '/emergency'
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
* @see \App\Http\Controllers\EmergencyController::panic
* @see app/Http/Controllers/EmergencyController.php:41
* @route '/emergency/panic'
*/
export const panic = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: panic.url(options),
    method: 'post',
})

panic.definition = {
    methods: ["post"],
    url: '/emergency/panic',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmergencyController::panic
* @see app/Http/Controllers/EmergencyController.php:41
* @route '/emergency/panic'
*/
panic.url = (options?: RouteQueryOptions) => {
    return panic.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmergencyController::panic
* @see app/Http/Controllers/EmergencyController.php:41
* @route '/emergency/panic'
*/
panic.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: panic.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmergencyController::panic
* @see app/Http/Controllers/EmergencyController.php:41
* @route '/emergency/panic'
*/
const panicForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: panic.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmergencyController::panic
* @see app/Http/Controllers/EmergencyController.php:41
* @route '/emergency/panic'
*/
panicForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: panic.url(options),
    method: 'post',
})

panic.form = panicForm

const EmergencyController = { index, panic }

export default EmergencyController