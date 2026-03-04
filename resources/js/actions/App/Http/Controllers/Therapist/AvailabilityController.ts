import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::index
* @see app/Http/Controllers/Therapist/AvailabilityController.php:16
* @route '/therapist/availability'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/therapist/availability',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::index
* @see app/Http/Controllers/Therapist/AvailabilityController.php:16
* @route '/therapist/availability'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::index
* @see app/Http/Controllers/Therapist/AvailabilityController.php:16
* @route '/therapist/availability'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::index
* @see app/Http/Controllers/Therapist/AvailabilityController.php:16
* @route '/therapist/availability'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::index
* @see app/Http/Controllers/Therapist/AvailabilityController.php:16
* @route '/therapist/availability'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::index
* @see app/Http/Controllers/Therapist/AvailabilityController.php:16
* @route '/therapist/availability'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::index
* @see app/Http/Controllers/Therapist/AvailabilityController.php:16
* @route '/therapist/availability'
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

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::storeOverride
* @see app/Http/Controllers/Therapist/AvailabilityController.php:108
* @route '/therapist/availability/overrides'
*/
export const storeOverride = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeOverride.url(options),
    method: 'post',
})

storeOverride.definition = {
    methods: ["post"],
    url: '/therapist/availability/overrides',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::storeOverride
* @see app/Http/Controllers/Therapist/AvailabilityController.php:108
* @route '/therapist/availability/overrides'
*/
storeOverride.url = (options?: RouteQueryOptions) => {
    return storeOverride.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::storeOverride
* @see app/Http/Controllers/Therapist/AvailabilityController.php:108
* @route '/therapist/availability/overrides'
*/
storeOverride.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeOverride.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::storeOverride
* @see app/Http/Controllers/Therapist/AvailabilityController.php:108
* @route '/therapist/availability/overrides'
*/
const storeOverrideForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeOverride.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::storeOverride
* @see app/Http/Controllers/Therapist/AvailabilityController.php:108
* @route '/therapist/availability/overrides'
*/
storeOverrideForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeOverride.url(options),
    method: 'post',
})

storeOverride.form = storeOverrideForm

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::destroyOverride
* @see app/Http/Controllers/Therapist/AvailabilityController.php:135
* @route '/therapist/availability/overrides/{override}'
*/
export const destroyOverride = (args: { override: number | { id: number } } | [override: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyOverride.url(args, options),
    method: 'delete',
})

destroyOverride.definition = {
    methods: ["delete"],
    url: '/therapist/availability/overrides/{override}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::destroyOverride
* @see app/Http/Controllers/Therapist/AvailabilityController.php:135
* @route '/therapist/availability/overrides/{override}'
*/
destroyOverride.url = (args: { override: number | { id: number } } | [override: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroyOverride.definition.url
            .replace('{override}', parsedArgs.override.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::destroyOverride
* @see app/Http/Controllers/Therapist/AvailabilityController.php:135
* @route '/therapist/availability/overrides/{override}'
*/
destroyOverride.delete = (args: { override: number | { id: number } } | [override: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyOverride.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::destroyOverride
* @see app/Http/Controllers/Therapist/AvailabilityController.php:135
* @route '/therapist/availability/overrides/{override}'
*/
const destroyOverrideForm = (args: { override: number | { id: number } } | [override: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyOverride.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilityController::destroyOverride
* @see app/Http/Controllers/Therapist/AvailabilityController.php:135
* @route '/therapist/availability/overrides/{override}'
*/
destroyOverrideForm.delete = (args: { override: number | { id: number } } | [override: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyOverride.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyOverride.form = destroyOverrideForm

const AvailabilityController = { index, store, update, destroy, storeOverride, destroyOverride }

export default AvailabilityController