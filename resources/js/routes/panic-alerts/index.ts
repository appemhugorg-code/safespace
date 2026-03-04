import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PanicAlertController::index
* @see app/Http/Controllers/PanicAlertController.php:22
* @route '/panic-alerts'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/panic-alerts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PanicAlertController::index
* @see app/Http/Controllers/PanicAlertController.php:22
* @route '/panic-alerts'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PanicAlertController::index
* @see app/Http/Controllers/PanicAlertController.php:22
* @route '/panic-alerts'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PanicAlertController::index
* @see app/Http/Controllers/PanicAlertController.php:22
* @route '/panic-alerts'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PanicAlertController::index
* @see app/Http/Controllers/PanicAlertController.php:22
* @route '/panic-alerts'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PanicAlertController::index
* @see app/Http/Controllers/PanicAlertController.php:22
* @route '/panic-alerts'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PanicAlertController::index
* @see app/Http/Controllers/PanicAlertController.php:22
* @route '/panic-alerts'
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
* @see \App\Http\Controllers\PanicAlertController::show
* @see app/Http/Controllers/PanicAlertController.php:38
* @route '/panic-alerts/{panicAlert}'
*/
export const show = (args: { panicAlert: number | { id: number } } | [panicAlert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/panic-alerts/{panicAlert}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PanicAlertController::show
* @see app/Http/Controllers/PanicAlertController.php:38
* @route '/panic-alerts/{panicAlert}'
*/
show.url = (args: { panicAlert: number | { id: number } } | [panicAlert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { panicAlert: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { panicAlert: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            panicAlert: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        panicAlert: typeof args.panicAlert === 'object'
        ? args.panicAlert.id
        : args.panicAlert,
    }

    return show.definition.url
            .replace('{panicAlert}', parsedArgs.panicAlert.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PanicAlertController::show
* @see app/Http/Controllers/PanicAlertController.php:38
* @route '/panic-alerts/{panicAlert}'
*/
show.get = (args: { panicAlert: number | { id: number } } | [panicAlert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PanicAlertController::show
* @see app/Http/Controllers/PanicAlertController.php:38
* @route '/panic-alerts/{panicAlert}'
*/
show.head = (args: { panicAlert: number | { id: number } } | [panicAlert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PanicAlertController::show
* @see app/Http/Controllers/PanicAlertController.php:38
* @route '/panic-alerts/{panicAlert}'
*/
const showForm = (args: { panicAlert: number | { id: number } } | [panicAlert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PanicAlertController::show
* @see app/Http/Controllers/PanicAlertController.php:38
* @route '/panic-alerts/{panicAlert}'
*/
showForm.get = (args: { panicAlert: number | { id: number } } | [panicAlert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PanicAlertController::show
* @see app/Http/Controllers/PanicAlertController.php:38
* @route '/panic-alerts/{panicAlert}'
*/
showForm.head = (args: { panicAlert: number | { id: number } } | [panicAlert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\PanicAlertController::acknowledge
* @see app/Http/Controllers/PanicAlertController.php:60
* @route '/panic-alerts/{panicAlert}/acknowledge'
*/
export const acknowledge = (args: { panicAlert: number | { id: number } } | [panicAlert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: acknowledge.url(args, options),
    method: 'patch',
})

acknowledge.definition = {
    methods: ["patch"],
    url: '/panic-alerts/{panicAlert}/acknowledge',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PanicAlertController::acknowledge
* @see app/Http/Controllers/PanicAlertController.php:60
* @route '/panic-alerts/{panicAlert}/acknowledge'
*/
acknowledge.url = (args: { panicAlert: number | { id: number } } | [panicAlert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { panicAlert: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { panicAlert: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            panicAlert: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        panicAlert: typeof args.panicAlert === 'object'
        ? args.panicAlert.id
        : args.panicAlert,
    }

    return acknowledge.definition.url
            .replace('{panicAlert}', parsedArgs.panicAlert.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PanicAlertController::acknowledge
* @see app/Http/Controllers/PanicAlertController.php:60
* @route '/panic-alerts/{panicAlert}/acknowledge'
*/
acknowledge.patch = (args: { panicAlert: number | { id: number } } | [panicAlert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: acknowledge.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\PanicAlertController::acknowledge
* @see app/Http/Controllers/PanicAlertController.php:60
* @route '/panic-alerts/{panicAlert}/acknowledge'
*/
const acknowledgeForm = (args: { panicAlert: number | { id: number } } | [panicAlert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: acknowledge.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PanicAlertController::acknowledge
* @see app/Http/Controllers/PanicAlertController.php:60
* @route '/panic-alerts/{panicAlert}/acknowledge'
*/
acknowledgeForm.patch = (args: { panicAlert: number | { id: number } } | [panicAlert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: acknowledge.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

acknowledge.form = acknowledgeForm

/**
* @see \App\Http\Controllers\PanicAlertController::resolve
* @see app/Http/Controllers/PanicAlertController.php:81
* @route '/panic-alerts/{panicAlert}/resolve'
*/
export const resolve = (args: { panicAlert: number | { id: number } } | [panicAlert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resolve.url(args, options),
    method: 'patch',
})

resolve.definition = {
    methods: ["patch"],
    url: '/panic-alerts/{panicAlert}/resolve',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PanicAlertController::resolve
* @see app/Http/Controllers/PanicAlertController.php:81
* @route '/panic-alerts/{panicAlert}/resolve'
*/
resolve.url = (args: { panicAlert: number | { id: number } } | [panicAlert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { panicAlert: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { panicAlert: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            panicAlert: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        panicAlert: typeof args.panicAlert === 'object'
        ? args.panicAlert.id
        : args.panicAlert,
    }

    return resolve.definition.url
            .replace('{panicAlert}', parsedArgs.panicAlert.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PanicAlertController::resolve
* @see app/Http/Controllers/PanicAlertController.php:81
* @route '/panic-alerts/{panicAlert}/resolve'
*/
resolve.patch = (args: { panicAlert: number | { id: number } } | [panicAlert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resolve.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\PanicAlertController::resolve
* @see app/Http/Controllers/PanicAlertController.php:81
* @route '/panic-alerts/{panicAlert}/resolve'
*/
const resolveForm = (args: { panicAlert: number | { id: number } } | [panicAlert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PanicAlertController::resolve
* @see app/Http/Controllers/PanicAlertController.php:81
* @route '/panic-alerts/{panicAlert}/resolve'
*/
resolveForm.patch = (args: { panicAlert: number | { id: number } } | [panicAlert: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

resolve.form = resolveForm

/**
* @see \App\Http\Controllers\PanicAlertController::unviewedCount
* @see app/Http/Controllers/PanicAlertController.php:110
* @route '/api/panic-alerts/unviewed-count'
*/
export const unviewedCount = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unviewedCount.url(options),
    method: 'get',
})

unviewedCount.definition = {
    methods: ["get","head"],
    url: '/api/panic-alerts/unviewed-count',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PanicAlertController::unviewedCount
* @see app/Http/Controllers/PanicAlertController.php:110
* @route '/api/panic-alerts/unviewed-count'
*/
unviewedCount.url = (options?: RouteQueryOptions) => {
    return unviewedCount.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PanicAlertController::unviewedCount
* @see app/Http/Controllers/PanicAlertController.php:110
* @route '/api/panic-alerts/unviewed-count'
*/
unviewedCount.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unviewedCount.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PanicAlertController::unviewedCount
* @see app/Http/Controllers/PanicAlertController.php:110
* @route '/api/panic-alerts/unviewed-count'
*/
unviewedCount.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: unviewedCount.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PanicAlertController::unviewedCount
* @see app/Http/Controllers/PanicAlertController.php:110
* @route '/api/panic-alerts/unviewed-count'
*/
const unviewedCountForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: unviewedCount.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PanicAlertController::unviewedCount
* @see app/Http/Controllers/PanicAlertController.php:110
* @route '/api/panic-alerts/unviewed-count'
*/
unviewedCountForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: unviewedCount.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PanicAlertController::unviewedCount
* @see app/Http/Controllers/PanicAlertController.php:110
* @route '/api/panic-alerts/unviewed-count'
*/
unviewedCountForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: unviewedCount.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

unviewedCount.form = unviewedCountForm

const panicAlerts = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
    acknowledge: Object.assign(acknowledge, acknowledge),
    resolve: Object.assign(resolve, resolve),
    unviewedCount: Object.assign(unviewedCount, unviewedCount),
}

export default panicAlerts