import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::store
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:181
* @route '/guardian/connections/requests'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/guardian/connections/requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::store
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:181
* @route '/guardian/connections/requests'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::store
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:181
* @route '/guardian/connections/requests'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::store
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:181
* @route '/guardian/connections/requests'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::store
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:181
* @route '/guardian/connections/requests'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::destroy
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:345
* @route '/guardian/connections/requests/{request}'
*/
export const destroy = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/guardian/connections/requests/{request}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::destroy
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:345
* @route '/guardian/connections/requests/{request}'
*/
destroy.url = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { request: args }
    }

    if (Array.isArray(args)) {
        args = {
            request: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        request: args.request,
    }

    return destroy.definition.url
            .replace('{request}', parsedArgs.request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::destroy
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:345
* @route '/guardian/connections/requests/{request}'
*/
destroy.delete = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::destroy
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:345
* @route '/guardian/connections/requests/{request}'
*/
const destroyForm = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::destroy
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:345
* @route '/guardian/connections/requests/{request}'
*/
destroyForm.delete = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const requests = {
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default requests