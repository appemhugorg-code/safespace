import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::store
* @see app/Http/Controllers/Admin/AdminConnectionController.php:87
* @route '/api/admin/connections'
*/
const store2b4f26ee962db5eb66bc8d61deff19bf = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store2b4f26ee962db5eb66bc8d61deff19bf.url(options),
    method: 'post',
})

store2b4f26ee962db5eb66bc8d61deff19bf.definition = {
    methods: ["post"],
    url: '/api/admin/connections',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::store
* @see app/Http/Controllers/Admin/AdminConnectionController.php:87
* @route '/api/admin/connections'
*/
store2b4f26ee962db5eb66bc8d61deff19bf.url = (options?: RouteQueryOptions) => {
    return store2b4f26ee962db5eb66bc8d61deff19bf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::store
* @see app/Http/Controllers/Admin/AdminConnectionController.php:87
* @route '/api/admin/connections'
*/
store2b4f26ee962db5eb66bc8d61deff19bf.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store2b4f26ee962db5eb66bc8d61deff19bf.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::store
* @see app/Http/Controllers/Admin/AdminConnectionController.php:87
* @route '/api/admin/connections'
*/
const store2b4f26ee962db5eb66bc8d61deff19bfForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store2b4f26ee962db5eb66bc8d61deff19bf.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::store
* @see app/Http/Controllers/Admin/AdminConnectionController.php:87
* @route '/api/admin/connections'
*/
store2b4f26ee962db5eb66bc8d61deff19bfForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store2b4f26ee962db5eb66bc8d61deff19bf.url(options),
    method: 'post',
})

store2b4f26ee962db5eb66bc8d61deff19bf.form = store2b4f26ee962db5eb66bc8d61deff19bfForm
/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::store
* @see app/Http/Controllers/Admin/AdminConnectionController.php:87
* @route '/admin/connections'
*/
const storede8ccf68b2b9dad2b39cb94007a0b85d = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storede8ccf68b2b9dad2b39cb94007a0b85d.url(options),
    method: 'post',
})

storede8ccf68b2b9dad2b39cb94007a0b85d.definition = {
    methods: ["post"],
    url: '/admin/connections',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::store
* @see app/Http/Controllers/Admin/AdminConnectionController.php:87
* @route '/admin/connections'
*/
storede8ccf68b2b9dad2b39cb94007a0b85d.url = (options?: RouteQueryOptions) => {
    return storede8ccf68b2b9dad2b39cb94007a0b85d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::store
* @see app/Http/Controllers/Admin/AdminConnectionController.php:87
* @route '/admin/connections'
*/
storede8ccf68b2b9dad2b39cb94007a0b85d.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storede8ccf68b2b9dad2b39cb94007a0b85d.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::store
* @see app/Http/Controllers/Admin/AdminConnectionController.php:87
* @route '/admin/connections'
*/
const storede8ccf68b2b9dad2b39cb94007a0b85dForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storede8ccf68b2b9dad2b39cb94007a0b85d.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::store
* @see app/Http/Controllers/Admin/AdminConnectionController.php:87
* @route '/admin/connections'
*/
storede8ccf68b2b9dad2b39cb94007a0b85dForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storede8ccf68b2b9dad2b39cb94007a0b85d.url(options),
    method: 'post',
})

storede8ccf68b2b9dad2b39cb94007a0b85d.form = storede8ccf68b2b9dad2b39cb94007a0b85dForm

export const store = {
    '/api/admin/connections': store2b4f26ee962db5eb66bc8d61deff19bf,
    '/admin/connections': storede8ccf68b2b9dad2b39cb94007a0b85d,
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/api/admin/connections'
*/
const index2b4f26ee962db5eb66bc8d61deff19bf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index2b4f26ee962db5eb66bc8d61deff19bf.url(options),
    method: 'get',
})

index2b4f26ee962db5eb66bc8d61deff19bf.definition = {
    methods: ["get","head"],
    url: '/api/admin/connections',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/api/admin/connections'
*/
index2b4f26ee962db5eb66bc8d61deff19bf.url = (options?: RouteQueryOptions) => {
    return index2b4f26ee962db5eb66bc8d61deff19bf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/api/admin/connections'
*/
index2b4f26ee962db5eb66bc8d61deff19bf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index2b4f26ee962db5eb66bc8d61deff19bf.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/api/admin/connections'
*/
index2b4f26ee962db5eb66bc8d61deff19bf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index2b4f26ee962db5eb66bc8d61deff19bf.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/api/admin/connections'
*/
const index2b4f26ee962db5eb66bc8d61deff19bfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index2b4f26ee962db5eb66bc8d61deff19bf.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/api/admin/connections'
*/
index2b4f26ee962db5eb66bc8d61deff19bfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index2b4f26ee962db5eb66bc8d61deff19bf.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/api/admin/connections'
*/
index2b4f26ee962db5eb66bc8d61deff19bfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index2b4f26ee962db5eb66bc8d61deff19bf.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index2b4f26ee962db5eb66bc8d61deff19bf.form = index2b4f26ee962db5eb66bc8d61deff19bfForm
/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/admin/connections'
*/
const indexde8ccf68b2b9dad2b39cb94007a0b85d = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexde8ccf68b2b9dad2b39cb94007a0b85d.url(options),
    method: 'get',
})

indexde8ccf68b2b9dad2b39cb94007a0b85d.definition = {
    methods: ["get","head"],
    url: '/admin/connections',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/admin/connections'
*/
indexde8ccf68b2b9dad2b39cb94007a0b85d.url = (options?: RouteQueryOptions) => {
    return indexde8ccf68b2b9dad2b39cb94007a0b85d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/admin/connections'
*/
indexde8ccf68b2b9dad2b39cb94007a0b85d.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexde8ccf68b2b9dad2b39cb94007a0b85d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/admin/connections'
*/
indexde8ccf68b2b9dad2b39cb94007a0b85d.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexde8ccf68b2b9dad2b39cb94007a0b85d.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/admin/connections'
*/
const indexde8ccf68b2b9dad2b39cb94007a0b85dForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexde8ccf68b2b9dad2b39cb94007a0b85d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/admin/connections'
*/
indexde8ccf68b2b9dad2b39cb94007a0b85dForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexde8ccf68b2b9dad2b39cb94007a0b85d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::index
* @see app/Http/Controllers/Admin/AdminConnectionController.php:31
* @route '/admin/connections'
*/
indexde8ccf68b2b9dad2b39cb94007a0b85dForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexde8ccf68b2b9dad2b39cb94007a0b85d.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

indexde8ccf68b2b9dad2b39cb94007a0b85d.form = indexde8ccf68b2b9dad2b39cb94007a0b85dForm

export const index = {
    '/api/admin/connections': index2b4f26ee962db5eb66bc8d61deff19bf,
    '/admin/connections': indexde8ccf68b2b9dad2b39cb94007a0b85d,
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/api/admin/connections/analytics'
*/
const analytics1951b3359012b46bee17528ccec9a5b8 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics1951b3359012b46bee17528ccec9a5b8.url(options),
    method: 'get',
})

analytics1951b3359012b46bee17528ccec9a5b8.definition = {
    methods: ["get","head"],
    url: '/api/admin/connections/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/api/admin/connections/analytics'
*/
analytics1951b3359012b46bee17528ccec9a5b8.url = (options?: RouteQueryOptions) => {
    return analytics1951b3359012b46bee17528ccec9a5b8.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/api/admin/connections/analytics'
*/
analytics1951b3359012b46bee17528ccec9a5b8.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics1951b3359012b46bee17528ccec9a5b8.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/api/admin/connections/analytics'
*/
analytics1951b3359012b46bee17528ccec9a5b8.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analytics1951b3359012b46bee17528ccec9a5b8.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/api/admin/connections/analytics'
*/
const analytics1951b3359012b46bee17528ccec9a5b8Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics1951b3359012b46bee17528ccec9a5b8.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/api/admin/connections/analytics'
*/
analytics1951b3359012b46bee17528ccec9a5b8Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics1951b3359012b46bee17528ccec9a5b8.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/api/admin/connections/analytics'
*/
analytics1951b3359012b46bee17528ccec9a5b8Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics1951b3359012b46bee17528ccec9a5b8.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

analytics1951b3359012b46bee17528ccec9a5b8.form = analytics1951b3359012b46bee17528ccec9a5b8Form
/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/admin/connections/analytics'
*/
const analytics41d5e51c725b3bda47986139d48864fb = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics41d5e51c725b3bda47986139d48864fb.url(options),
    method: 'get',
})

analytics41d5e51c725b3bda47986139d48864fb.definition = {
    methods: ["get","head"],
    url: '/admin/connections/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/admin/connections/analytics'
*/
analytics41d5e51c725b3bda47986139d48864fb.url = (options?: RouteQueryOptions) => {
    return analytics41d5e51c725b3bda47986139d48864fb.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/admin/connections/analytics'
*/
analytics41d5e51c725b3bda47986139d48864fb.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics41d5e51c725b3bda47986139d48864fb.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/admin/connections/analytics'
*/
analytics41d5e51c725b3bda47986139d48864fb.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analytics41d5e51c725b3bda47986139d48864fb.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/admin/connections/analytics'
*/
const analytics41d5e51c725b3bda47986139d48864fbForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics41d5e51c725b3bda47986139d48864fb.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/admin/connections/analytics'
*/
analytics41d5e51c725b3bda47986139d48864fbForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics41d5e51c725b3bda47986139d48864fb.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::analytics
* @see app/Http/Controllers/Admin/AdminConnectionController.php:116
* @route '/admin/connections/analytics'
*/
analytics41d5e51c725b3bda47986139d48864fbForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics41d5e51c725b3bda47986139d48864fb.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

analytics41d5e51c725b3bda47986139d48864fb.form = analytics41d5e51c725b3bda47986139d48864fbForm

export const analytics = {
    '/api/admin/connections/analytics': analytics1951b3359012b46bee17528ccec9a5b8,
    '/admin/connections/analytics': analytics41d5e51c725b3bda47986139d48864fb,
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/api/admin/connections/available-clients'
*/
const availableClients3e52d45f412823b7381396686bba329d = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableClients3e52d45f412823b7381396686bba329d.url(options),
    method: 'get',
})

availableClients3e52d45f412823b7381396686bba329d.definition = {
    methods: ["get","head"],
    url: '/api/admin/connections/available-clients',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/api/admin/connections/available-clients'
*/
availableClients3e52d45f412823b7381396686bba329d.url = (options?: RouteQueryOptions) => {
    return availableClients3e52d45f412823b7381396686bba329d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/api/admin/connections/available-clients'
*/
availableClients3e52d45f412823b7381396686bba329d.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableClients3e52d45f412823b7381396686bba329d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/api/admin/connections/available-clients'
*/
availableClients3e52d45f412823b7381396686bba329d.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: availableClients3e52d45f412823b7381396686bba329d.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/api/admin/connections/available-clients'
*/
const availableClients3e52d45f412823b7381396686bba329dForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableClients3e52d45f412823b7381396686bba329d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/api/admin/connections/available-clients'
*/
availableClients3e52d45f412823b7381396686bba329dForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableClients3e52d45f412823b7381396686bba329d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/api/admin/connections/available-clients'
*/
availableClients3e52d45f412823b7381396686bba329dForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableClients3e52d45f412823b7381396686bba329d.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

availableClients3e52d45f412823b7381396686bba329d.form = availableClients3e52d45f412823b7381396686bba329dForm
/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/admin/connections/available-clients'
*/
const availableClients77559df811761a62efbb05dad1769693 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableClients77559df811761a62efbb05dad1769693.url(options),
    method: 'get',
})

availableClients77559df811761a62efbb05dad1769693.definition = {
    methods: ["get","head"],
    url: '/admin/connections/available-clients',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/admin/connections/available-clients'
*/
availableClients77559df811761a62efbb05dad1769693.url = (options?: RouteQueryOptions) => {
    return availableClients77559df811761a62efbb05dad1769693.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/admin/connections/available-clients'
*/
availableClients77559df811761a62efbb05dad1769693.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableClients77559df811761a62efbb05dad1769693.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/admin/connections/available-clients'
*/
availableClients77559df811761a62efbb05dad1769693.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: availableClients77559df811761a62efbb05dad1769693.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/admin/connections/available-clients'
*/
const availableClients77559df811761a62efbb05dad1769693Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableClients77559df811761a62efbb05dad1769693.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/admin/connections/available-clients'
*/
availableClients77559df811761a62efbb05dad1769693Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableClients77559df811761a62efbb05dad1769693.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableClients
* @see app/Http/Controllers/Admin/AdminConnectionController.php:200
* @route '/admin/connections/available-clients'
*/
availableClients77559df811761a62efbb05dad1769693Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableClients77559df811761a62efbb05dad1769693.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

availableClients77559df811761a62efbb05dad1769693.form = availableClients77559df811761a62efbb05dad1769693Form

export const availableClients = {
    '/api/admin/connections/available-clients': availableClients3e52d45f412823b7381396686bba329d,
    '/admin/connections/available-clients': availableClients77559df811761a62efbb05dad1769693,
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/api/admin/connections/available-therapists'
*/
const availableTherapists37002812ce4e76510294be92f899e986 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableTherapists37002812ce4e76510294be92f899e986.url(options),
    method: 'get',
})

availableTherapists37002812ce4e76510294be92f899e986.definition = {
    methods: ["get","head"],
    url: '/api/admin/connections/available-therapists',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/api/admin/connections/available-therapists'
*/
availableTherapists37002812ce4e76510294be92f899e986.url = (options?: RouteQueryOptions) => {
    return availableTherapists37002812ce4e76510294be92f899e986.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/api/admin/connections/available-therapists'
*/
availableTherapists37002812ce4e76510294be92f899e986.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableTherapists37002812ce4e76510294be92f899e986.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/api/admin/connections/available-therapists'
*/
availableTherapists37002812ce4e76510294be92f899e986.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: availableTherapists37002812ce4e76510294be92f899e986.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/api/admin/connections/available-therapists'
*/
const availableTherapists37002812ce4e76510294be92f899e986Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableTherapists37002812ce4e76510294be92f899e986.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/api/admin/connections/available-therapists'
*/
availableTherapists37002812ce4e76510294be92f899e986Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableTherapists37002812ce4e76510294be92f899e986.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/api/admin/connections/available-therapists'
*/
availableTherapists37002812ce4e76510294be92f899e986Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableTherapists37002812ce4e76510294be92f899e986.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

availableTherapists37002812ce4e76510294be92f899e986.form = availableTherapists37002812ce4e76510294be92f899e986Form
/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/admin/connections/available-therapists'
*/
const availableTherapists209d562f44e054f5b6c37165d3569500 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableTherapists209d562f44e054f5b6c37165d3569500.url(options),
    method: 'get',
})

availableTherapists209d562f44e054f5b6c37165d3569500.definition = {
    methods: ["get","head"],
    url: '/admin/connections/available-therapists',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/admin/connections/available-therapists'
*/
availableTherapists209d562f44e054f5b6c37165d3569500.url = (options?: RouteQueryOptions) => {
    return availableTherapists209d562f44e054f5b6c37165d3569500.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/admin/connections/available-therapists'
*/
availableTherapists209d562f44e054f5b6c37165d3569500.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: availableTherapists209d562f44e054f5b6c37165d3569500.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/admin/connections/available-therapists'
*/
availableTherapists209d562f44e054f5b6c37165d3569500.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: availableTherapists209d562f44e054f5b6c37165d3569500.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/admin/connections/available-therapists'
*/
const availableTherapists209d562f44e054f5b6c37165d3569500Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableTherapists209d562f44e054f5b6c37165d3569500.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/admin/connections/available-therapists'
*/
availableTherapists209d562f44e054f5b6c37165d3569500Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableTherapists209d562f44e054f5b6c37165d3569500.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::availableTherapists
* @see app/Http/Controllers/Admin/AdminConnectionController.php:251
* @route '/admin/connections/available-therapists'
*/
availableTherapists209d562f44e054f5b6c37165d3569500Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: availableTherapists209d562f44e054f5b6c37165d3569500.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

availableTherapists209d562f44e054f5b6c37165d3569500.form = availableTherapists209d562f44e054f5b6c37165d3569500Form

export const availableTherapists = {
    '/api/admin/connections/available-therapists': availableTherapists37002812ce4e76510294be92f899e986,
    '/admin/connections/available-therapists': availableTherapists209d562f44e054f5b6c37165d3569500,
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/api/admin/connections/{connection}'
*/
const show06aef116d83e232e49e5991a22b4d2b6 = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show06aef116d83e232e49e5991a22b4d2b6.url(args, options),
    method: 'get',
})

show06aef116d83e232e49e5991a22b4d2b6.definition = {
    methods: ["get","head"],
    url: '/api/admin/connections/{connection}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/api/admin/connections/{connection}'
*/
show06aef116d83e232e49e5991a22b4d2b6.url = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show06aef116d83e232e49e5991a22b4d2b6.definition.url
            .replace('{connection}', parsedArgs.connection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/api/admin/connections/{connection}'
*/
show06aef116d83e232e49e5991a22b4d2b6.get = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show06aef116d83e232e49e5991a22b4d2b6.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/api/admin/connections/{connection}'
*/
show06aef116d83e232e49e5991a22b4d2b6.head = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show06aef116d83e232e49e5991a22b4d2b6.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/api/admin/connections/{connection}'
*/
const show06aef116d83e232e49e5991a22b4d2b6Form = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show06aef116d83e232e49e5991a22b4d2b6.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/api/admin/connections/{connection}'
*/
show06aef116d83e232e49e5991a22b4d2b6Form.get = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show06aef116d83e232e49e5991a22b4d2b6.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/api/admin/connections/{connection}'
*/
show06aef116d83e232e49e5991a22b4d2b6Form.head = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show06aef116d83e232e49e5991a22b4d2b6.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show06aef116d83e232e49e5991a22b4d2b6.form = show06aef116d83e232e49e5991a22b4d2b6Form
/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/admin/connections/{connection}'
*/
const show4440d2fa4666da70085f556c6cb8c39e = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show4440d2fa4666da70085f556c6cb8c39e.url(args, options),
    method: 'get',
})

show4440d2fa4666da70085f556c6cb8c39e.definition = {
    methods: ["get","head"],
    url: '/admin/connections/{connection}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/admin/connections/{connection}'
*/
show4440d2fa4666da70085f556c6cb8c39e.url = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show4440d2fa4666da70085f556c6cb8c39e.definition.url
            .replace('{connection}', parsedArgs.connection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/admin/connections/{connection}'
*/
show4440d2fa4666da70085f556c6cb8c39e.get = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show4440d2fa4666da70085f556c6cb8c39e.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/admin/connections/{connection}'
*/
show4440d2fa4666da70085f556c6cb8c39e.head = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show4440d2fa4666da70085f556c6cb8c39e.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/admin/connections/{connection}'
*/
const show4440d2fa4666da70085f556c6cb8c39eForm = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show4440d2fa4666da70085f556c6cb8c39e.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/admin/connections/{connection}'
*/
show4440d2fa4666da70085f556c6cb8c39eForm.get = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show4440d2fa4666da70085f556c6cb8c39e.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::show
* @see app/Http/Controllers/Admin/AdminConnectionController.php:150
* @route '/admin/connections/{connection}'
*/
show4440d2fa4666da70085f556c6cb8c39eForm.head = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show4440d2fa4666da70085f556c6cb8c39e.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show4440d2fa4666da70085f556c6cb8c39e.form = show4440d2fa4666da70085f556c6cb8c39eForm

export const show = {
    '/api/admin/connections/{connection}': show06aef116d83e232e49e5991a22b4d2b6,
    '/admin/connections/{connection}': show4440d2fa4666da70085f556c6cb8c39e,
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::destroy
* @see app/Http/Controllers/Admin/AdminConnectionController.php:166
* @route '/api/admin/connections/{connection}'
*/
const destroy06aef116d83e232e49e5991a22b4d2b6 = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy06aef116d83e232e49e5991a22b4d2b6.url(args, options),
    method: 'delete',
})

destroy06aef116d83e232e49e5991a22b4d2b6.definition = {
    methods: ["delete"],
    url: '/api/admin/connections/{connection}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::destroy
* @see app/Http/Controllers/Admin/AdminConnectionController.php:166
* @route '/api/admin/connections/{connection}'
*/
destroy06aef116d83e232e49e5991a22b4d2b6.url = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy06aef116d83e232e49e5991a22b4d2b6.definition.url
            .replace('{connection}', parsedArgs.connection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::destroy
* @see app/Http/Controllers/Admin/AdminConnectionController.php:166
* @route '/api/admin/connections/{connection}'
*/
destroy06aef116d83e232e49e5991a22b4d2b6.delete = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy06aef116d83e232e49e5991a22b4d2b6.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::destroy
* @see app/Http/Controllers/Admin/AdminConnectionController.php:166
* @route '/api/admin/connections/{connection}'
*/
const destroy06aef116d83e232e49e5991a22b4d2b6Form = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy06aef116d83e232e49e5991a22b4d2b6.url(args, {
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
* @route '/api/admin/connections/{connection}'
*/
destroy06aef116d83e232e49e5991a22b4d2b6Form.delete = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy06aef116d83e232e49e5991a22b4d2b6.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy06aef116d83e232e49e5991a22b4d2b6.form = destroy06aef116d83e232e49e5991a22b4d2b6Form
/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::destroy
* @see app/Http/Controllers/Admin/AdminConnectionController.php:166
* @route '/admin/connections/{connection}'
*/
const destroy4440d2fa4666da70085f556c6cb8c39e = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy4440d2fa4666da70085f556c6cb8c39e.url(args, options),
    method: 'delete',
})

destroy4440d2fa4666da70085f556c6cb8c39e.definition = {
    methods: ["delete"],
    url: '/admin/connections/{connection}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::destroy
* @see app/Http/Controllers/Admin/AdminConnectionController.php:166
* @route '/admin/connections/{connection}'
*/
destroy4440d2fa4666da70085f556c6cb8c39e.url = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy4440d2fa4666da70085f556c6cb8c39e.definition.url
            .replace('{connection}', parsedArgs.connection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::destroy
* @see app/Http/Controllers/Admin/AdminConnectionController.php:166
* @route '/admin/connections/{connection}'
*/
destroy4440d2fa4666da70085f556c6cb8c39e.delete = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy4440d2fa4666da70085f556c6cb8c39e.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\AdminConnectionController::destroy
* @see app/Http/Controllers/Admin/AdminConnectionController.php:166
* @route '/admin/connections/{connection}'
*/
const destroy4440d2fa4666da70085f556c6cb8c39eForm = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy4440d2fa4666da70085f556c6cb8c39e.url(args, {
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
destroy4440d2fa4666da70085f556c6cb8c39eForm.delete = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy4440d2fa4666da70085f556c6cb8c39e.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy4440d2fa4666da70085f556c6cb8c39e.form = destroy4440d2fa4666da70085f556c6cb8c39eForm

export const destroy = {
    '/api/admin/connections/{connection}': destroy06aef116d83e232e49e5991a22b4d2b6,
    '/admin/connections/{connection}': destroy4440d2fa4666da70085f556c6cb8c39e,
}

const AdminConnectionController = { store, index, analytics, availableClients, availableTherapists, show, destroy }

export default AdminConnectionController