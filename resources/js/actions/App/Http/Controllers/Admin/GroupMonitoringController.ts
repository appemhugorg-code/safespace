import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/api/admin/groups/dashboard'
*/
const dashboardf6f905ce868cb2b4ddc19513fc2076d0 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardf6f905ce868cb2b4ddc19513fc2076d0.url(options),
    method: 'get',
})

dashboardf6f905ce868cb2b4ddc19513fc2076d0.definition = {
    methods: ["get","head"],
    url: '/api/admin/groups/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/api/admin/groups/dashboard'
*/
dashboardf6f905ce868cb2b4ddc19513fc2076d0.url = (options?: RouteQueryOptions) => {
    return dashboardf6f905ce868cb2b4ddc19513fc2076d0.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/api/admin/groups/dashboard'
*/
dashboardf6f905ce868cb2b4ddc19513fc2076d0.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardf6f905ce868cb2b4ddc19513fc2076d0.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/api/admin/groups/dashboard'
*/
dashboardf6f905ce868cb2b4ddc19513fc2076d0.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboardf6f905ce868cb2b4ddc19513fc2076d0.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/api/admin/groups/dashboard'
*/
const dashboardf6f905ce868cb2b4ddc19513fc2076d0Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboardf6f905ce868cb2b4ddc19513fc2076d0.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/api/admin/groups/dashboard'
*/
dashboardf6f905ce868cb2b4ddc19513fc2076d0Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboardf6f905ce868cb2b4ddc19513fc2076d0.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/api/admin/groups/dashboard'
*/
dashboardf6f905ce868cb2b4ddc19513fc2076d0Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboardf6f905ce868cb2b4ddc19513fc2076d0.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

dashboardf6f905ce868cb2b4ddc19513fc2076d0.form = dashboardf6f905ce868cb2b4ddc19513fc2076d0Form
/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/admin/groups/dashboard'
*/
const dashboardeb8b964604bb20eebe6efe16dff89f6b = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardeb8b964604bb20eebe6efe16dff89f6b.url(options),
    method: 'get',
})

dashboardeb8b964604bb20eebe6efe16dff89f6b.definition = {
    methods: ["get","head"],
    url: '/admin/groups/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/admin/groups/dashboard'
*/
dashboardeb8b964604bb20eebe6efe16dff89f6b.url = (options?: RouteQueryOptions) => {
    return dashboardeb8b964604bb20eebe6efe16dff89f6b.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/admin/groups/dashboard'
*/
dashboardeb8b964604bb20eebe6efe16dff89f6b.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardeb8b964604bb20eebe6efe16dff89f6b.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/admin/groups/dashboard'
*/
dashboardeb8b964604bb20eebe6efe16dff89f6b.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboardeb8b964604bb20eebe6efe16dff89f6b.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/admin/groups/dashboard'
*/
const dashboardeb8b964604bb20eebe6efe16dff89f6bForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboardeb8b964604bb20eebe6efe16dff89f6b.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/admin/groups/dashboard'
*/
dashboardeb8b964604bb20eebe6efe16dff89f6bForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboardeb8b964604bb20eebe6efe16dff89f6b.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dashboard
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:19
* @route '/admin/groups/dashboard'
*/
dashboardeb8b964604bb20eebe6efe16dff89f6bForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboardeb8b964604bb20eebe6efe16dff89f6b.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

dashboardeb8b964604bb20eebe6efe16dff89f6b.form = dashboardeb8b964604bb20eebe6efe16dff89f6bForm

export const dashboard = {
    '/api/admin/groups/dashboard': dashboardf6f905ce868cb2b4ddc19513fc2076d0,
    '/admin/groups/dashboard': dashboardeb8b964604bb20eebe6efe16dff89f6b,
}

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::allGroups
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/api/admin/groups'
*/
const allGroups753161db47e96cda4f7f8f2cca5745c5 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: allGroups753161db47e96cda4f7f8f2cca5745c5.url(options),
    method: 'get',
})

allGroups753161db47e96cda4f7f8f2cca5745c5.definition = {
    methods: ["get","head"],
    url: '/api/admin/groups',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::allGroups
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/api/admin/groups'
*/
allGroups753161db47e96cda4f7f8f2cca5745c5.url = (options?: RouteQueryOptions) => {
    return allGroups753161db47e96cda4f7f8f2cca5745c5.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::allGroups
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/api/admin/groups'
*/
allGroups753161db47e96cda4f7f8f2cca5745c5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: allGroups753161db47e96cda4f7f8f2cca5745c5.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::allGroups
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/api/admin/groups'
*/
allGroups753161db47e96cda4f7f8f2cca5745c5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: allGroups753161db47e96cda4f7f8f2cca5745c5.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::allGroups
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/api/admin/groups'
*/
const allGroups753161db47e96cda4f7f8f2cca5745c5Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: allGroups753161db47e96cda4f7f8f2cca5745c5.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::allGroups
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/api/admin/groups'
*/
allGroups753161db47e96cda4f7f8f2cca5745c5Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: allGroups753161db47e96cda4f7f8f2cca5745c5.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::allGroups
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/api/admin/groups'
*/
allGroups753161db47e96cda4f7f8f2cca5745c5Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: allGroups753161db47e96cda4f7f8f2cca5745c5.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

allGroups753161db47e96cda4f7f8f2cca5745c5.form = allGroups753161db47e96cda4f7f8f2cca5745c5Form
/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::allGroups
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/admin/groups'
*/
const allGroups078da37b80c13cb88f76d9465f0a9075 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: allGroups078da37b80c13cb88f76d9465f0a9075.url(options),
    method: 'get',
})

allGroups078da37b80c13cb88f76d9465f0a9075.definition = {
    methods: ["get","head"],
    url: '/admin/groups',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::allGroups
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/admin/groups'
*/
allGroups078da37b80c13cb88f76d9465f0a9075.url = (options?: RouteQueryOptions) => {
    return allGroups078da37b80c13cb88f76d9465f0a9075.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::allGroups
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/admin/groups'
*/
allGroups078da37b80c13cb88f76d9465f0a9075.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: allGroups078da37b80c13cb88f76d9465f0a9075.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::allGroups
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/admin/groups'
*/
allGroups078da37b80c13cb88f76d9465f0a9075.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: allGroups078da37b80c13cb88f76d9465f0a9075.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::allGroups
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/admin/groups'
*/
const allGroups078da37b80c13cb88f76d9465f0a9075Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: allGroups078da37b80c13cb88f76d9465f0a9075.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::allGroups
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/admin/groups'
*/
allGroups078da37b80c13cb88f76d9465f0a9075Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: allGroups078da37b80c13cb88f76d9465f0a9075.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::allGroups
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:73
* @route '/admin/groups'
*/
allGroups078da37b80c13cb88f76d9465f0a9075Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: allGroups078da37b80c13cb88f76d9465f0a9075.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

allGroups078da37b80c13cb88f76d9465f0a9075.form = allGroups078da37b80c13cb88f76d9465f0a9075Form

export const allGroups = {
    '/api/admin/groups': allGroups753161db47e96cda4f7f8f2cca5745c5,
    '/admin/groups': allGroups078da37b80c13cb88f76d9465f0a9075,
}

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::groupDetails
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/api/admin/groups/{group}'
*/
const groupDetailsb8c4f0e2a2e6ae283011140814f9c738 = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: groupDetailsb8c4f0e2a2e6ae283011140814f9c738.url(args, options),
    method: 'get',
})

groupDetailsb8c4f0e2a2e6ae283011140814f9c738.definition = {
    methods: ["get","head"],
    url: '/api/admin/groups/{group}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::groupDetails
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/api/admin/groups/{group}'
*/
groupDetailsb8c4f0e2a2e6ae283011140814f9c738.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return groupDetailsb8c4f0e2a2e6ae283011140814f9c738.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::groupDetails
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/api/admin/groups/{group}'
*/
groupDetailsb8c4f0e2a2e6ae283011140814f9c738.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: groupDetailsb8c4f0e2a2e6ae283011140814f9c738.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::groupDetails
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/api/admin/groups/{group}'
*/
groupDetailsb8c4f0e2a2e6ae283011140814f9c738.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: groupDetailsb8c4f0e2a2e6ae283011140814f9c738.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::groupDetails
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/api/admin/groups/{group}'
*/
const groupDetailsb8c4f0e2a2e6ae283011140814f9c738Form = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: groupDetailsb8c4f0e2a2e6ae283011140814f9c738.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::groupDetails
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/api/admin/groups/{group}'
*/
groupDetailsb8c4f0e2a2e6ae283011140814f9c738Form.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: groupDetailsb8c4f0e2a2e6ae283011140814f9c738.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::groupDetails
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/api/admin/groups/{group}'
*/
groupDetailsb8c4f0e2a2e6ae283011140814f9c738Form.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: groupDetailsb8c4f0e2a2e6ae283011140814f9c738.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

groupDetailsb8c4f0e2a2e6ae283011140814f9c738.form = groupDetailsb8c4f0e2a2e6ae283011140814f9c738Form
/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::groupDetails
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/admin/groups/{group}'
*/
const groupDetailsa33b13e00cfbb2bc268ce57deb3757f4 = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: groupDetailsa33b13e00cfbb2bc268ce57deb3757f4.url(args, options),
    method: 'get',
})

groupDetailsa33b13e00cfbb2bc268ce57deb3757f4.definition = {
    methods: ["get","head"],
    url: '/admin/groups/{group}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::groupDetails
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/admin/groups/{group}'
*/
groupDetailsa33b13e00cfbb2bc268ce57deb3757f4.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return groupDetailsa33b13e00cfbb2bc268ce57deb3757f4.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::groupDetails
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/admin/groups/{group}'
*/
groupDetailsa33b13e00cfbb2bc268ce57deb3757f4.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: groupDetailsa33b13e00cfbb2bc268ce57deb3757f4.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::groupDetails
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/admin/groups/{group}'
*/
groupDetailsa33b13e00cfbb2bc268ce57deb3757f4.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: groupDetailsa33b13e00cfbb2bc268ce57deb3757f4.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::groupDetails
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/admin/groups/{group}'
*/
const groupDetailsa33b13e00cfbb2bc268ce57deb3757f4Form = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: groupDetailsa33b13e00cfbb2bc268ce57deb3757f4.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::groupDetails
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/admin/groups/{group}'
*/
groupDetailsa33b13e00cfbb2bc268ce57deb3757f4Form.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: groupDetailsa33b13e00cfbb2bc268ce57deb3757f4.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::groupDetails
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:45
* @route '/admin/groups/{group}'
*/
groupDetailsa33b13e00cfbb2bc268ce57deb3757f4Form.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: groupDetailsa33b13e00cfbb2bc268ce57deb3757f4.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

groupDetailsa33b13e00cfbb2bc268ce57deb3757f4.form = groupDetailsa33b13e00cfbb2bc268ce57deb3757f4Form

export const groupDetails = {
    '/api/admin/groups/{group}': groupDetailsb8c4f0e2a2e6ae283011140814f9c738,
    '/admin/groups/{group}': groupDetailsa33b13e00cfbb2bc268ce57deb3757f4,
}

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dissolveGroup
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:152
* @route '/api/admin/groups/{group}/dissolve'
*/
const dissolveGroup5081b2f5596ad25bd32eb19cd535019c = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: dissolveGroup5081b2f5596ad25bd32eb19cd535019c.url(args, options),
    method: 'delete',
})

dissolveGroup5081b2f5596ad25bd32eb19cd535019c.definition = {
    methods: ["delete"],
    url: '/api/admin/groups/{group}/dissolve',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dissolveGroup
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:152
* @route '/api/admin/groups/{group}/dissolve'
*/
dissolveGroup5081b2f5596ad25bd32eb19cd535019c.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return dissolveGroup5081b2f5596ad25bd32eb19cd535019c.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dissolveGroup
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:152
* @route '/api/admin/groups/{group}/dissolve'
*/
dissolveGroup5081b2f5596ad25bd32eb19cd535019c.delete = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: dissolveGroup5081b2f5596ad25bd32eb19cd535019c.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dissolveGroup
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:152
* @route '/api/admin/groups/{group}/dissolve'
*/
const dissolveGroup5081b2f5596ad25bd32eb19cd535019cForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: dissolveGroup5081b2f5596ad25bd32eb19cd535019c.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dissolveGroup
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:152
* @route '/api/admin/groups/{group}/dissolve'
*/
dissolveGroup5081b2f5596ad25bd32eb19cd535019cForm.delete = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: dissolveGroup5081b2f5596ad25bd32eb19cd535019c.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

dissolveGroup5081b2f5596ad25bd32eb19cd535019c.form = dissolveGroup5081b2f5596ad25bd32eb19cd535019cForm
/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dissolveGroup
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:152
* @route '/admin/groups/{group}/dissolve'
*/
const dissolveGroup6032540114579e93866ef6e361e4af90 = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: dissolveGroup6032540114579e93866ef6e361e4af90.url(args, options),
    method: 'delete',
})

dissolveGroup6032540114579e93866ef6e361e4af90.definition = {
    methods: ["delete"],
    url: '/admin/groups/{group}/dissolve',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dissolveGroup
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:152
* @route '/admin/groups/{group}/dissolve'
*/
dissolveGroup6032540114579e93866ef6e361e4af90.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return dissolveGroup6032540114579e93866ef6e361e4af90.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dissolveGroup
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:152
* @route '/admin/groups/{group}/dissolve'
*/
dissolveGroup6032540114579e93866ef6e361e4af90.delete = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: dissolveGroup6032540114579e93866ef6e361e4af90.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dissolveGroup
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:152
* @route '/admin/groups/{group}/dissolve'
*/
const dissolveGroup6032540114579e93866ef6e361e4af90Form = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: dissolveGroup6032540114579e93866ef6e361e4af90.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::dissolveGroup
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:152
* @route '/admin/groups/{group}/dissolve'
*/
dissolveGroup6032540114579e93866ef6e361e4af90Form.delete = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: dissolveGroup6032540114579e93866ef6e361e4af90.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

dissolveGroup6032540114579e93866ef6e361e4af90.form = dissolveGroup6032540114579e93866ef6e361e4af90Form

export const dissolveGroup = {
    '/api/admin/groups/{group}/dissolve': dissolveGroup5081b2f5596ad25bd32eb19cd535019c,
    '/admin/groups/{group}/dissolve': dissolveGroup6032540114579e93866ef6e361e4af90,
}

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::flaggedMessages
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:126
* @route '/api/admin/groups/flagged-messages'
*/
export const flaggedMessages = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: flaggedMessages.url(options),
    method: 'get',
})

flaggedMessages.definition = {
    methods: ["get","head"],
    url: '/api/admin/groups/flagged-messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::flaggedMessages
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:126
* @route '/api/admin/groups/flagged-messages'
*/
flaggedMessages.url = (options?: RouteQueryOptions) => {
    return flaggedMessages.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::flaggedMessages
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:126
* @route '/api/admin/groups/flagged-messages'
*/
flaggedMessages.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: flaggedMessages.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::flaggedMessages
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:126
* @route '/api/admin/groups/flagged-messages'
*/
flaggedMessages.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: flaggedMessages.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::flaggedMessages
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:126
* @route '/api/admin/groups/flagged-messages'
*/
const flaggedMessagesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: flaggedMessages.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::flaggedMessages
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:126
* @route '/api/admin/groups/flagged-messages'
*/
flaggedMessagesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: flaggedMessages.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GroupMonitoringController::flaggedMessages
* @see app/Http/Controllers/Admin/GroupMonitoringController.php:126
* @route '/api/admin/groups/flagged-messages'
*/
flaggedMessagesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: flaggedMessages.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

flaggedMessages.form = flaggedMessagesForm

const GroupMonitoringController = { dashboard, allGroups, groupDetails, dissolveGroup, flaggedMessages }

export default GroupMonitoringController