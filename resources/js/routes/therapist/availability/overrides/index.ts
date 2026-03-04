import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::store
* @see app/Http/Controllers/Therapist/AvailabilityController.php:108
* @route '/therapist/availability/overrides'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/therapist/availability/overrides',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::store
* @see app/Http/Controllers/Therapist/AvailabilityController.php:108
* @route '/therapist/availability/overrides'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::store
* @see app/Http/Controllers/Therapist/AvailabilityController.php:108
* @route '/therapist/availability/overrides'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::store
* @see app/Http/Controllers/Therapist/AvailabilityController.php:108
* @route '/therapist/availability/overrides'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::store
* @see app/Http/Controllers/Therapist/AvailabilityController.php:108
* @route '/therapist/availability/overrides'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::destroy
* @see app/Http/Controllers/Therapist/AvailabilityController.php:135
* @route '/therapist/availability/overrides/{override}'
*/
export const destroy = (args: { override: number | { id: number } } | [override: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/therapist/availability/overrides/{override}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::destroy
* @see app/Http/Controllers/Therapist/AvailabilityController.php:135
* @route '/therapist/availability/overrides/{override}'
*/
destroy.url = (args: { override: number | { id: number } } | [override: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { override: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { override: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            override: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        override: typeof args.override === 'object'
        ? args.override.id
        : args.override,
    }

    return destroy.definition.url
            .replace('{override}', parsedArgs.override.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::destroy
* @see app/Http/Controllers/Therapist/AvailabilityController.php:135
* @route '/therapist/availability/overrides/{override}'
*/
destroy.delete = (args: { override: number | { id: number } } | [override: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::destroy
* @see app/Http/Controllers/Therapist/AvailabilityController.php:135
* @route '/therapist/availability/overrides/{override}'
*/
const destroyForm = (args: { override: number | { id: number } } | [override: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::destroy
* @see app/Http/Controllers/Therapist/AvailabilityController.php:135
* @route '/therapist/availability/overrides/{override}'
*/
destroyForm.delete = (args: { override: number | { id: number } } | [override: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const overrides = {
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default overrides