import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::index
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:25
* @route '/api/therapist/availability'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/therapist/availability',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::index
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:25
* @route '/api/therapist/availability'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::index
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:25
* @route '/api/therapist/availability'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::index
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:25
* @route '/api/therapist/availability'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::index
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:25
* @route '/api/therapist/availability'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::index
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:25
* @route '/api/therapist/availability'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::index
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:25
* @route '/api/therapist/availability'
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
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::store
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:42
* @route '/api/therapist/availability'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/therapist/availability',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::store
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:42
* @route '/api/therapist/availability'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::store
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:42
* @route '/api/therapist/availability'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::store
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:42
* @route '/api/therapist/availability'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::store
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:42
* @route '/api/therapist/availability'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::update
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:69
* @route '/api/therapist/availability/{availability}'
*/
export const update = (args: { availability: number | { id: number } } | [availability: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/therapist/availability/{availability}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::update
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:69
* @route '/api/therapist/availability/{availability}'
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
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::update
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:69
* @route '/api/therapist/availability/{availability}'
*/
update.put = (args: { availability: number | { id: number } } | [availability: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::update
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:69
* @route '/api/therapist/availability/{availability}'
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
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::update
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:69
* @route '/api/therapist/availability/{availability}'
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
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::destroy
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:93
* @route '/api/therapist/availability/{availability}'
*/
export const destroy = (args: { availability: number | { id: number } } | [availability: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/therapist/availability/{availability}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::destroy
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:93
* @route '/api/therapist/availability/{availability}'
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
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::destroy
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:93
* @route '/api/therapist/availability/{availability}'
*/
destroy.delete = (args: { availability: number | { id: number } } | [availability: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::destroy
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:93
* @route '/api/therapist/availability/{availability}'
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
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::destroy
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:93
* @route '/api/therapist/availability/{availability}'
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
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::overrides
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:170
* @route '/api/therapist/availability/overrides'
*/
export const overrides = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overrides.url(options),
    method: 'get',
})

overrides.definition = {
    methods: ["get","head"],
    url: '/api/therapist/availability/overrides',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::overrides
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:170
* @route '/api/therapist/availability/overrides'
*/
overrides.url = (options?: RouteQueryOptions) => {
    return overrides.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::overrides
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:170
* @route '/api/therapist/availability/overrides'
*/
overrides.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overrides.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::overrides
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:170
* @route '/api/therapist/availability/overrides'
*/
overrides.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: overrides.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::overrides
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:170
* @route '/api/therapist/availability/overrides'
*/
const overridesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: overrides.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::overrides
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:170
* @route '/api/therapist/availability/overrides'
*/
overridesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: overrides.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::overrides
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:170
* @route '/api/therapist/availability/overrides'
*/
overridesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: overrides.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

overrides.form = overridesForm

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::storeOverride
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:187
* @route '/api/therapist/availability/overrides'
*/
export const storeOverride = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeOverride.url(options),
    method: 'post',
})

storeOverride.definition = {
    methods: ["post"],
    url: '/api/therapist/availability/overrides',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::storeOverride
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:187
* @route '/api/therapist/availability/overrides'
*/
storeOverride.url = (options?: RouteQueryOptions) => {
    return storeOverride.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::storeOverride
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:187
* @route '/api/therapist/availability/overrides'
*/
storeOverride.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeOverride.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::storeOverride
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:187
* @route '/api/therapist/availability/overrides'
*/
const storeOverrideForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeOverride.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::storeOverride
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:187
* @route '/api/therapist/availability/overrides'
*/
storeOverrideForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeOverride.url(options),
    method: 'post',
})

storeOverride.form = storeOverrideForm

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::destroyOverride
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:217
* @route '/api/therapist/availability/overrides/{override}'
*/
export const destroyOverride = (args: { override: number | { id: number } } | [override: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyOverride.url(args, options),
    method: 'delete',
})

destroyOverride.definition = {
    methods: ["delete"],
    url: '/api/therapist/availability/overrides/{override}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::destroyOverride
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:217
* @route '/api/therapist/availability/overrides/{override}'
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
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::destroyOverride
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:217
* @route '/api/therapist/availability/overrides/{override}'
*/
destroyOverride.delete = (args: { override: number | { id: number } } | [override: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyOverride.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::destroyOverride
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:217
* @route '/api/therapist/availability/overrides/{override}'
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
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::destroyOverride
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:217
* @route '/api/therapist/availability/overrides/{override}'
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

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::availableSlots
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:110
* @route '/api/therapists/{therapist}/available-slots'
*/
export const availableSlots = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableSlots.url(args, options),
    method: 'get',
})

availableSlots.definition = {
    methods: ["get","head"],
    url: '/api/therapists/{therapist}/available-slots',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::availableSlots
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:110
* @route '/api/therapists/{therapist}/available-slots'
*/
availableSlots.url = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { therapist: args }
    }

    if (Array.isArray(args)) {
        args = {
            therapist: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        therapist: args.therapist,
    }

    return availableSlots.definition.url
            .replace('{therapist}', parsedArgs.therapist.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::availableSlots
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:110
* @route '/api/therapists/{therapist}/available-slots'
*/
availableSlots.get = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableSlots.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::availableSlots
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:110
* @route '/api/therapists/{therapist}/available-slots'
*/
availableSlots.head = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: availableSlots.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::availableSlots
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:110
* @route '/api/therapists/{therapist}/available-slots'
*/
const availableSlotsForm = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableSlots.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::availableSlots
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:110
* @route '/api/therapists/{therapist}/available-slots'
*/
availableSlotsForm.get = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableSlots.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::availableSlots
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:110
* @route '/api/therapists/{therapist}/available-slots'
*/
availableSlotsForm.head = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableSlots.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

availableSlots.form = availableSlotsForm

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::schedule
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:140
* @route '/api/therapists/{therapist}/schedule'
*/
export const schedule = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: schedule.url(args, options),
    method: 'get',
})

schedule.definition = {
    methods: ["get","head"],
    url: '/api/therapists/{therapist}/schedule',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::schedule
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:140
* @route '/api/therapists/{therapist}/schedule'
*/
schedule.url = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { therapist: args }
    }

    if (Array.isArray(args)) {
        args = {
            therapist: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        therapist: args.therapist,
    }

    return schedule.definition.url
            .replace('{therapist}', parsedArgs.therapist.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::schedule
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:140
* @route '/api/therapists/{therapist}/schedule'
*/
schedule.get = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: schedule.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::schedule
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:140
* @route '/api/therapists/{therapist}/schedule'
*/
schedule.head = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: schedule.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::schedule
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:140
* @route '/api/therapists/{therapist}/schedule'
*/
const scheduleForm = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: schedule.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::schedule
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:140
* @route '/api/therapists/{therapist}/schedule'
*/
scheduleForm.get = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: schedule.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\TherapistAvailabilityController::schedule
* @see app/Http/Controllers/Api/TherapistAvailabilityController.php:140
* @route '/api/therapists/{therapist}/schedule'
*/
scheduleForm.head = (args: { therapist: string | number } | [therapist: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: schedule.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

schedule.form = scheduleForm

const TherapistAvailabilityController = { index, store, update, destroy, overrides, storeOverride, destroyOverride, availableSlots, schedule }

export default TherapistAvailabilityController