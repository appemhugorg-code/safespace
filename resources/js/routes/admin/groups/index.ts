import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see routes/admin.php:28
* @route '/admin/groups/monitoring'
*/
export const monitoring = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: monitoring.url(options),
    method: 'get',
})

monitoring.definition = {
    methods: ["get","head"],
    url: '/admin/groups/monitoring',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/admin.php:28
* @route '/admin/groups/monitoring'
*/
monitoring.url = (options?: RouteQueryOptions) => {
    return monitoring.definition.url + queryParams(options)
}

/**
* @see routes/admin.php:28
* @route '/admin/groups/monitoring'
*/
monitoring.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: monitoring.url(options),
    method: 'get',
})

/**
* @see routes/admin.php:28
* @route '/admin/groups/monitoring'
*/
monitoring.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: monitoring.url(options),
    method: 'head',
})

/**
* @see routes/admin.php:28
* @route '/admin/groups/monitoring'
*/
const monitoringForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: monitoring.url(options),
    method: 'get',
})

/**
* @see routes/admin.php:28
* @route '/admin/groups/monitoring'
*/
monitoringForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: monitoring.url(options),
    method: 'get',
})

/**
* @see routes/admin.php:28
* @route '/admin/groups/monitoring'
*/
monitoringForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: monitoring.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

monitoring.form = monitoringForm

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/admin/groups/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin/groups/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/admin/groups/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/admin/groups/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/admin/groups/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/admin/groups/dashboard'
*/
const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/admin/groups/dashboard'
*/
dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/admin/groups/dashboard'
*/
dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

dashboard.form = dashboardForm

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::index
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/admin/groups'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/groups',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::index
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/admin/groups'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::index
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/admin/groups'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::index
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/admin/groups'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::index
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/admin/groups'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::index
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/admin/groups'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::index
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/admin/groups'
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
* @see \App\Http\Controllers\Admin\GroupMonitoringController::show
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/admin/groups/{group}'
*/
export const show = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/groups/{group}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::show
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/admin/groups/{group}'
*/
show.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        group: typeof args.group === 'object'
        ? args.group.id
        : args.group,
    }

    return show.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::show
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/admin/groups/{group}'
*/
show.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::show
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/admin/groups/{group}'
*/
show.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::show
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/admin/groups/{group}'
*/
const showForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::show
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/admin/groups/{group}'
*/
showForm.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::show
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/admin/groups/{group}'
*/
showForm.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dissolve
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:152
* @route '/admin/groups/{group}/dissolve'
*/
export const dissolve = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: dissolve.url(args, options),
    method: 'delete',
})

dissolve.definition = {
    methods: ["delete"],
    url: '/admin/groups/{group}/dissolve',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dissolve
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:152
* @route '/admin/groups/{group}/dissolve'
*/
dissolve.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        group: typeof args.group === 'object'
        ? args.group.id
        : args.group,
    }

    return dissolve.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dissolve
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:152
* @route '/admin/groups/{group}/dissolve'
*/
dissolve.delete = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: dissolve.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dissolve
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:152
* @route '/admin/groups/{group}/dissolve'
*/
const dissolveForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: dissolve.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dissolve
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:152
* @route '/admin/groups/{group}/dissolve'
*/
dissolveForm.delete = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: dissolve.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

dissolve.form = dissolveForm

const groups = {
    monitoring: Object.assign(monitoring, monitoring),
    dashboard: Object.assign(dashboard, dashboard),
    index: Object.assign(index, index),
    show: Object.assign(show, show),
    dissolve: Object.assign(dissolve, dissolve),
}

export default groups