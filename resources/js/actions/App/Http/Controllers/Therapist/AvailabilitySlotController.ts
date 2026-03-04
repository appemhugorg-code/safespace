import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Therapist\AvailabilitySlotController::index
* @see app/Http/Controllers/Therapist/AvailabilitySlotController.php:13
* @route '/therapist/availability-slots'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/therapist/availability-slots',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Therapist\AvailabilitySlotController::index
* @see app/Http/Controllers/Therapist/AvailabilitySlotController.php:13
* @route '/therapist/availability-slots'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\AvailabilitySlotController::index
* @see app/Http/Controllers/Therapist/AvailabilitySlotController.php:13
* @route '/therapist/availability-slots'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilitySlotController::index
* @see app/Http/Controllers/Therapist/AvailabilitySlotController.php:13
* @route '/therapist/availability-slots'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilitySlotController::index
* @see app/Http/Controllers/Therapist/AvailabilitySlotController.php:13
* @route '/therapist/availability-slots'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilitySlotController::index
* @see app/Http/Controllers/Therapist/AvailabilitySlotController.php:13
* @route '/therapist/availability-slots'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilitySlotController::index
* @see app/Http/Controllers/Therapist/AvailabilitySlotController.php:13
* @route '/therapist/availability-slots'
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
* @see \App\Http\Controllers\Therapist\AvailabilitySlotController::store
* @see app/Http/Controllers/Therapist/AvailabilitySlotController.php:37
* @route '/therapist/availability-slots'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/therapist/availability-slots',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Therapist\AvailabilitySlotController::store
* @see app/Http/Controllers/Therapist/AvailabilitySlotController.php:37
* @route '/therapist/availability-slots'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\AvailabilitySlotController::store
* @see app/Http/Controllers/Therapist/AvailabilitySlotController.php:37
* @route '/therapist/availability-slots'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilitySlotController::store
* @see app/Http/Controllers/Therapist/AvailabilitySlotController.php:37
* @route '/therapist/availability-slots'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilitySlotController::store
* @see app/Http/Controllers/Therapist/AvailabilitySlotController.php:37
* @route '/therapist/availability-slots'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Therapist\AvailabilitySlotController::destroy
* @see app/Http/Controllers/Therapist/AvailabilitySlotController.php:99
* @route '/therapist/availability-slots/{slot}'
*/
export const destroy = (args: { slot: number | { id: number } } | [slot: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/therapist/availability-slots/{slot}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Therapist\AvailabilitySlotController::destroy
* @see app/Http/Controllers/Therapist/AvailabilitySlotController.php:99
* @route '/therapist/availability-slots/{slot}'
*/
destroy.url = (args: { slot: number | { id: number } } | [slot: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slot: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { slot: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            slot: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slot: typeof args.slot === 'object'
        ? args.slot.id
        : args.slot,
    }

    return destroy.definition.url
            .replace('{slot}', parsedArgs.slot.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\AvailabilitySlotController::destroy
* @see app/Http/Controllers/Therapist/AvailabilitySlotController.php:99
* @route '/therapist/availability-slots/{slot}'
*/
destroy.delete = (args: { slot: number | { id: number } } | [slot: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilitySlotController::destroy
* @see app/Http/Controllers/Therapist/AvailabilitySlotController.php:99
* @route '/therapist/availability-slots/{slot}'
*/
const destroyForm = (args: { slot: number | { id: number } } | [slot: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\AvailabilitySlotController::destroy
* @see app/Http/Controllers/Therapist/AvailabilitySlotController.php:99
* @route '/therapist/availability-slots/{slot}'
*/
destroyForm.delete = (args: { slot: number | { id: number } } | [slot: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const AvailabilitySlotController = { index, store, destroy }

export default AvailabilitySlotController