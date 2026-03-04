import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import overrides from './overrides'
/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::store
* @see app/Http/Controllers/Therapist/AvailabilityController.php:44
* @route '/therapist/availability'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/therapist/availability',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::store
* @see app/Http/Controllers/Therapist/AvailabilityController.php:44
* @route '/therapist/availability'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::store
* @see app/Http/Controllers/Therapist/AvailabilityController.php:44
* @route '/therapist/availability'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::store
* @see app/Http/Controllers/Therapist/AvailabilityController.php:44
* @route '/therapist/availability'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::store
* @see app/Http/Controllers/Therapist/AvailabilityController.php:44
* @route '/therapist/availability'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::update
* @see app/Http/Controllers/Therapist/AvailabilityController.php:68
* @route '/therapist/availability/{availability}'
*/
export const update = (args: { availability: number | { id: number } } | [availability: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/therapist/availability/{availability}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::update
* @see app/Http/Controllers/Therapist/AvailabilityController.php:68
* @route '/therapist/availability/{availability}'
*/
update.url = (args: { availability: number | { id: number } } | [availability: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { availability: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { availability: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            availability: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        availability: typeof args.availability === 'object'
        ? args.availability.id
        : args.availability,
    }

    return update.definition.url
            .replace('{availability}', parsedArgs.availability.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::update
* @see app/Http/Controllers/Therapist/AvailabilityController.php:68
* @route '/therapist/availability/{availability}'
*/
update.put = (args: { availability: number | { id: number } } | [availability: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::update
* @see app/Http/Controllers/Therapist/AvailabilityController.php:68
* @route '/therapist/availability/{availability}'
*/
const updateForm = (args: { availability: number | { id: number } } | [availability: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::update
* @see app/Http/Controllers/Therapist/AvailabilityController.php:68
* @route '/therapist/availability/{availability}'
*/
updateForm.put = (args: { availability: number | { id: number } } | [availability: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::destroy
* @see app/Http/Controllers/Therapist/AvailabilityController.php:93
* @route '/therapist/availability/{availability}'
*/
export const destroy = (args: { availability: number | { id: number } } | [availability: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/therapist/availability/{availability}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::destroy
* @see app/Http/Controllers/Therapist/AvailabilityController.php:93
* @route '/therapist/availability/{availability}'
*/
destroy.url = (args: { availability: number | { id: number } } | [availability: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { availability: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { availability: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            availability: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        availability: typeof args.availability === 'object'
        ? args.availability.id
        : args.availability,
    }

    return destroy.definition.url
            .replace('{availability}', parsedArgs.availability.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::destroy
* @see app/Http/Controllers/Therapist/AvailabilityController.php:93
* @route '/therapist/availability/{availability}'
*/
destroy.delete = (args: { availability: number | { id: number } } | [availability: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::destroy
* @see app/Http/Controllers/Therapist/AvailabilityController.php:93
* @route '/therapist/availability/{availability}'
*/
const destroyForm = (args: { availability: number | { id: number } } | [availability: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/Therapist/AvailabilityController.php:93
* @route '/therapist/availability/{availability}'
*/
destroyForm.delete = (args: { availability: number | { id: number } } | [availability: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const availability = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    overrides: Object.assign(overrides, overrides),
}

export default availability