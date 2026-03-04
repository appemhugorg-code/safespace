import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::approveRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:279
* @route '/api/therapist/requests/{request}/approve'
*/
const approveRequest609378bd5fb9ef40594703002e8ee64a = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveRequest609378bd5fb9ef40594703002e8ee64a.url(args, options),
    method: 'post',
})

approveRequest609378bd5fb9ef40594703002e8ee64a.definition = {
    methods: ["post"],
    url: '/api/therapist/requests/{request}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::approveRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:279
* @route '/api/therapist/requests/{request}/approve'
*/
approveRequest609378bd5fb9ef40594703002e8ee64a.url = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { request: args }
    }

    if (Array.isArray(args)) {
        args = {
            request: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        request: args.request,
    }

    return approveRequest609378bd5fb9ef40594703002e8ee64a.definition.url
            .replace('{request}', parsedArgs.request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::approveRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:279
* @route '/api/therapist/requests/{request}/approve'
*/
approveRequest609378bd5fb9ef40594703002e8ee64a.post = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveRequest609378bd5fb9ef40594703002e8ee64a.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::approveRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:279
* @route '/api/therapist/requests/{request}/approve'
*/
const approveRequest609378bd5fb9ef40594703002e8ee64aForm = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approveRequest609378bd5fb9ef40594703002e8ee64a.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::approveRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:279
* @route '/api/therapist/requests/{request}/approve'
*/
approveRequest609378bd5fb9ef40594703002e8ee64aForm.post = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approveRequest609378bd5fb9ef40594703002e8ee64a.url(args, options),
    method: 'post',
})

approveRequest609378bd5fb9ef40594703002e8ee64a.form = approveRequest609378bd5fb9ef40594703002e8ee64aForm
/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::approveRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:279
* @route '/therapist/requests/{request}/approve'
*/
const approveRequest6e5482077a781c80ce1b333485f5f6bd = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveRequest6e5482077a781c80ce1b333485f5f6bd.url(args, options),
    method: 'post',
})

approveRequest6e5482077a781c80ce1b333485f5f6bd.definition = {
    methods: ["post"],
    url: '/therapist/requests/{request}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::approveRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:279
* @route '/therapist/requests/{request}/approve'
*/
approveRequest6e5482077a781c80ce1b333485f5f6bd.url = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { request: args }
    }

    if (Array.isArray(args)) {
        args = {
            request: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        request: args.request,
    }

    return approveRequest6e5482077a781c80ce1b333485f5f6bd.definition.url
            .replace('{request}', parsedArgs.request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::approveRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:279
* @route '/therapist/requests/{request}/approve'
*/
approveRequest6e5482077a781c80ce1b333485f5f6bd.post = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveRequest6e5482077a781c80ce1b333485f5f6bd.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::approveRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:279
* @route '/therapist/requests/{request}/approve'
*/
const approveRequest6e5482077a781c80ce1b333485f5f6bdForm = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approveRequest6e5482077a781c80ce1b333485f5f6bd.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::approveRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:279
* @route '/therapist/requests/{request}/approve'
*/
approveRequest6e5482077a781c80ce1b333485f5f6bdForm.post = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approveRequest6e5482077a781c80ce1b333485f5f6bd.url(args, options),
    method: 'post',
})

approveRequest6e5482077a781c80ce1b333485f5f6bd.form = approveRequest6e5482077a781c80ce1b333485f5f6bdForm

export const approveRequest = {
    '/api/therapist/requests/{request}/approve': approveRequest609378bd5fb9ef40594703002e8ee64a,
    '/therapist/requests/{request}/approve': approveRequest6e5482077a781c80ce1b333485f5f6bd,
}

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::declineRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:390
* @route '/api/therapist/requests/{request}/decline'
*/
const declineRequesta0d6edc0829babe385d4c7471645b4e8 = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: declineRequesta0d6edc0829babe385d4c7471645b4e8.url(args, options),
    method: 'post',
})

declineRequesta0d6edc0829babe385d4c7471645b4e8.definition = {
    methods: ["post"],
    url: '/api/therapist/requests/{request}/decline',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::declineRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:390
* @route '/api/therapist/requests/{request}/decline'
*/
declineRequesta0d6edc0829babe385d4c7471645b4e8.url = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { request: args }
    }

    if (Array.isArray(args)) {
        args = {
            request: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        request: args.request,
    }

    return declineRequesta0d6edc0829babe385d4c7471645b4e8.definition.url
            .replace('{request}', parsedArgs.request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::declineRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:390
* @route '/api/therapist/requests/{request}/decline'
*/
declineRequesta0d6edc0829babe385d4c7471645b4e8.post = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: declineRequesta0d6edc0829babe385d4c7471645b4e8.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::declineRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:390
* @route '/api/therapist/requests/{request}/decline'
*/
const declineRequesta0d6edc0829babe385d4c7471645b4e8Form = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: declineRequesta0d6edc0829babe385d4c7471645b4e8.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::declineRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:390
* @route '/api/therapist/requests/{request}/decline'
*/
declineRequesta0d6edc0829babe385d4c7471645b4e8Form.post = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: declineRequesta0d6edc0829babe385d4c7471645b4e8.url(args, options),
    method: 'post',
})

declineRequesta0d6edc0829babe385d4c7471645b4e8.form = declineRequesta0d6edc0829babe385d4c7471645b4e8Form
/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::declineRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:390
* @route '/therapist/requests/{request}/decline'
*/
const declineRequestaef658a54c32c5e0c0c873feb6897a8d = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: declineRequestaef658a54c32c5e0c0c873feb6897a8d.url(args, options),
    method: 'post',
})

declineRequestaef658a54c32c5e0c0c873feb6897a8d.definition = {
    methods: ["post"],
    url: '/therapist/requests/{request}/decline',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::declineRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:390
* @route '/therapist/requests/{request}/decline'
*/
declineRequestaef658a54c32c5e0c0c873feb6897a8d.url = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { request: args }
    }

    if (Array.isArray(args)) {
        args = {
            request: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        request: args.request,
    }

    return declineRequestaef658a54c32c5e0c0c873feb6897a8d.definition.url
            .replace('{request}', parsedArgs.request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::declineRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:390
* @route '/therapist/requests/{request}/decline'
*/
declineRequestaef658a54c32c5e0c0c873feb6897a8d.post = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: declineRequestaef658a54c32c5e0c0c873feb6897a8d.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::declineRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:390
* @route '/therapist/requests/{request}/decline'
*/
const declineRequestaef658a54c32c5e0c0c873feb6897a8dForm = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: declineRequestaef658a54c32c5e0c0c873feb6897a8d.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::declineRequest
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:390
* @route '/therapist/requests/{request}/decline'
*/
declineRequestaef658a54c32c5e0c0c873feb6897a8dForm.post = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: declineRequestaef658a54c32c5e0c0c873feb6897a8d.url(args, options),
    method: 'post',
})

declineRequestaef658a54c32c5e0c0c873feb6897a8d.form = declineRequestaef658a54c32c5e0c0c873feb6897a8dForm

export const declineRequest = {
    '/api/therapist/requests/{request}/decline': declineRequesta0d6edc0829babe385d4c7471645b4e8,
    '/therapist/requests/{request}/decline': declineRequestaef658a54c32c5e0c0c873feb6897a8d,
}

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::index
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:33
* @route '/therapist/connections'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/therapist/connections',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::index
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:33
* @route '/therapist/connections'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::index
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:33
* @route '/therapist/connections'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::index
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:33
* @route '/therapist/connections'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::index
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:33
* @route '/therapist/connections'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::index
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:33
* @route '/therapist/connections'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::index
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:33
* @route '/therapist/connections'
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
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::guardians
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:133
* @route '/therapist/connections/guardians'
*/
export const guardians = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: guardians.url(options),
    method: 'get',
})

guardians.definition = {
    methods: ["get","head"],
    url: '/therapist/connections/guardians',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::guardians
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:133
* @route '/therapist/connections/guardians'
*/
guardians.url = (options?: RouteQueryOptions) => {
    return guardians.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::guardians
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:133
* @route '/therapist/connections/guardians'
*/
guardians.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: guardians.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::guardians
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:133
* @route '/therapist/connections/guardians'
*/
guardians.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: guardians.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::guardians
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:133
* @route '/therapist/connections/guardians'
*/
const guardiansForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: guardians.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::guardians
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:133
* @route '/therapist/connections/guardians'
*/
guardiansForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: guardians.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::guardians
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:133
* @route '/therapist/connections/guardians'
*/
guardiansForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: guardians.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

guardians.form = guardiansForm

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::children
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:189
* @route '/therapist/connections/children'
*/
export const children = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: children.url(options),
    method: 'get',
})

children.definition = {
    methods: ["get","head"],
    url: '/therapist/connections/children',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::children
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:189
* @route '/therapist/connections/children'
*/
children.url = (options?: RouteQueryOptions) => {
    return children.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::children
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:189
* @route '/therapist/connections/children'
*/
children.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: children.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::children
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:189
* @route '/therapist/connections/children'
*/
children.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: children.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::children
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:189
* @route '/therapist/connections/children'
*/
const childrenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: children.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::children
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:189
* @route '/therapist/connections/children'
*/
childrenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: children.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::children
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:189
* @route '/therapist/connections/children'
*/
childrenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: children.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

children.form = childrenForm

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::pendingRequests
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:238
* @route '/therapist/connections/requests'
*/
export const pendingRequests = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingRequests.url(options),
    method: 'get',
})

pendingRequests.definition = {
    methods: ["get","head"],
    url: '/therapist/connections/requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::pendingRequests
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:238
* @route '/therapist/connections/requests'
*/
pendingRequests.url = (options?: RouteQueryOptions) => {
    return pendingRequests.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::pendingRequests
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:238
* @route '/therapist/connections/requests'
*/
pendingRequests.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingRequests.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::pendingRequests
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:238
* @route '/therapist/connections/requests'
*/
pendingRequests.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pendingRequests.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::pendingRequests
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:238
* @route '/therapist/connections/requests'
*/
const pendingRequestsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pendingRequests.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::pendingRequests
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:238
* @route '/therapist/connections/requests'
*/
pendingRequestsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pendingRequests.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::pendingRequests
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:238
* @route '/therapist/connections/requests'
*/
pendingRequestsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pendingRequests.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

pendingRequests.form = pendingRequestsForm

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::show
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:482
* @route '/therapist/connections/{connection}'
*/
export const show = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/therapist/connections/{connection}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::show
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:482
* @route '/therapist/connections/{connection}'
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
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::show
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:482
* @route '/therapist/connections/{connection}'
*/
show.get = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::show
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:482
* @route '/therapist/connections/{connection}'
*/
show.head = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::show
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:482
* @route '/therapist/connections/{connection}'
*/
const showForm = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::show
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:482
* @route '/therapist/connections/{connection}'
*/
showForm.get = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Therapist\TherapistConnectionController::show
* @see app/Http/Controllers/Therapist/TherapistConnectionController.php:482
* @route '/therapist/connections/{connection}'
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

const TherapistConnectionController = { approveRequest, declineRequest, index, guardians, children, pendingRequests, show }

export default TherapistConnectionController