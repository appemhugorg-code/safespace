import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/admin/connections'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/connections',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/admin/connections'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/admin/connections'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/admin/connections'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/admin/connections'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/admin/connections'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/admin/connections'
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
* @see \App\Http\Controllers\Admin\AdminConnectionController::store
* @see app/Http/Controllers/Admin/AdminConnectionController.php:87
* @route '/admin/connections'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/connections',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::store
* @see app/Http/Controllers/Admin/AdminConnectionController.php:87
* @route '/admin/connections'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::store
* @see app/Http/Controllers/Admin/AdminConnectionController.php:87
* @route '/admin/connections'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::store
* @see app/Http/Controllers/Admin/AdminConnectionController.php:87
* @route '/admin/connections'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::store
* @see app/Http/Controllers/Admin/AdminConnectionController.php:87
* @route '/admin/connections'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/admin/connections/analytics'
*/
export const analytics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})

analytics.definition = {
    methods: ["get","head"],
    url: '/admin/connections/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/admin/connections/analytics'
*/
analytics.url = (options?: RouteQueryOptions) => {
    return analytics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/admin/connections/analytics'
*/
analytics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/admin/connections/analytics'
*/
analytics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analytics.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/admin/connections/analytics'
*/
const analyticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/admin/connections/analytics'
*/
analyticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/admin/connections/analytics'
*/
analyticsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

analytics.form = analyticsForm

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/admin/connections/available-clients'
*/
export const availableClients = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableClients.url(options),
    method: 'get',
})

availableClients.definition = {
    methods: ["get","head"],
    url: '/admin/connections/available-clients',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/admin/connections/available-clients'
*/
availableClients.url = (options?: RouteQueryOptions) => {
    return availableClients.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/admin/connections/available-clients'
*/
availableClients.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableClients.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/admin/connections/available-clients'
*/
availableClients.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: availableClients.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/admin/connections/available-clients'
*/
const availableClientsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableClients.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/admin/connections/available-clients'
*/
availableClientsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableClients.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/admin/connections/available-clients'
*/
availableClientsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableClients.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

availableClients.form = availableClientsForm

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/admin/connections/available-therapists'
*/
export const availableTherapists = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableTherapists.url(options),
    method: 'get',
})

availableTherapists.definition = {
    methods: ["get","head"],
    url: '/admin/connections/available-therapists',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/admin/connections/available-therapists'
*/
availableTherapists.url = (options?: RouteQueryOptions) => {
    return availableTherapists.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/admin/connections/available-therapists'
*/
availableTherapists.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableTherapists.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/admin/connections/available-therapists'
*/
availableTherapists.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: availableTherapists.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/admin/connections/available-therapists'
*/
const availableTherapistsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableTherapists.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/admin/connections/available-therapists'
*/
availableTherapistsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableTherapists.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/admin/connections/available-therapists'
*/
availableTherapistsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableTherapists.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

availableTherapists.form = availableTherapistsForm

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/admin/connections/{connection}'
*/
export const show = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/connections/{connection}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/admin/connections/{connection}'
*/
show.url = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { connection: args }
    }

    if (Array.isArray(args)) {
        args = {
            connection: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        connection: args.connection,
    }

    return show.definition.url
            .replace('{connection}', parsedArgs.connection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/admin/connections/{connection}'
*/
show.get = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/admin/connections/{connection}'
*/
show.head = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/admin/connections/{connection}'
*/
const showForm = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/admin/connections/{connection}'
*/
showForm.get = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/admin/connections/{connection}'
*/
showForm.head = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\AdminConnectionController::destroy
* @see app/Http/Controllers/Admin/AdminConnectionController.php:166
* @route '/admin/connections/{connection}'
*/
export const destroy = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/connections/{connection}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::destroy
* @see app/Http/Controllers/Admin/AdminConnectionController.php:166
* @route '/admin/connections/{connection}'
*/
destroy.url = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { connection: args }
    }

    if (Array.isArray(args)) {
        args = {
            connection: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        connection: args.connection,
    }

    return destroy.definition.url
            .replace('{connection}', parsedArgs.connection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::destroy
* @see app/Http/Controllers/Admin/AdminConnectionController.php:166
* @route '/admin/connections/{connection}'
*/
destroy.delete = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::destroy
* @see app/Http/Controllers/Admin/AdminConnectionController.php:166
* @route '/admin/connections/{connection}'
*/
const destroyForm = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::destroy
* @see app/Http/Controllers/Admin/AdminConnectionController.php:166
* @route '/admin/connections/{connection}'
*/
destroyForm.delete = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const connections = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    analytics: Object.assign(analytics, analytics),
    availableClients: Object.assign(availableClients, availableClients),
    availableTherapists: Object.assign(availableTherapists, availableTherapists),
    show: Object.assign(show, show),
    destroy: Object.assign(destroy, destroy),
}

export default connections