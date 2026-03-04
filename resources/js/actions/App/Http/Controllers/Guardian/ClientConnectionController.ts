import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::createRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:181
* @route '/api/guardian/connection-requests'
*/
const createRequest0ebb6d015854bf2ae569fd88b610321a = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createRequest0ebb6d015854bf2ae569fd88b610321a.url(options),
    method: 'post',
})

createRequest0ebb6d015854bf2ae569fd88b610321a.definition = {
    methods: ["post"],
    url: '/api/guardian/connection-requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::createRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:181
* @route '/api/guardian/connection-requests'
*/
createRequest0ebb6d015854bf2ae569fd88b610321a.url = (options?: RouteQueryOptions) => {
    return createRequest0ebb6d015854bf2ae569fd88b610321a.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::createRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:181
* @route '/api/guardian/connection-requests'
*/
createRequest0ebb6d015854bf2ae569fd88b610321a.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createRequest0ebb6d015854bf2ae569fd88b610321a.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::createRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:181
* @route '/api/guardian/connection-requests'
*/
const createRequest0ebb6d015854bf2ae569fd88b610321aForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createRequest0ebb6d015854bf2ae569fd88b610321a.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::createRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:181
* @route '/api/guardian/connection-requests'
*/
createRequest0ebb6d015854bf2ae569fd88b610321aForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createRequest0ebb6d015854bf2ae569fd88b610321a.url(options),
    method: 'post',
})

createRequest0ebb6d015854bf2ae569fd88b610321a.form = createRequest0ebb6d015854bf2ae569fd88b610321aForm
/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::createRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:181
* @route '/guardian/connections/requests'
*/
const createRequestb558984d86a8409a5562266157970e29 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createRequestb558984d86a8409a5562266157970e29.url(options),
    method: 'post',
})

createRequestb558984d86a8409a5562266157970e29.definition = {
    methods: ["post"],
    url: '/guardian/connections/requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::createRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:181
* @route '/guardian/connections/requests'
*/
createRequestb558984d86a8409a5562266157970e29.url = (options?: RouteQueryOptions) => {
    return createRequestb558984d86a8409a5562266157970e29.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::createRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:181
* @route '/guardian/connections/requests'
*/
createRequestb558984d86a8409a5562266157970e29.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createRequestb558984d86a8409a5562266157970e29.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::createRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:181
* @route '/guardian/connections/requests'
*/
const createRequestb558984d86a8409a5562266157970e29Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createRequestb558984d86a8409a5562266157970e29.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::createRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:181
* @route '/guardian/connections/requests'
*/
createRequestb558984d86a8409a5562266157970e29Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createRequestb558984d86a8409a5562266157970e29.url(options),
    method: 'post',
})

createRequestb558984d86a8409a5562266157970e29.form = createRequestb558984d86a8409a5562266157970e29Form

export const createRequest = {
    '/api/guardian/connection-requests': createRequest0ebb6d015854bf2ae569fd88b610321a,
    '/guardian/connections/requests': createRequestb558984d86a8409a5562266157970e29,
}

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::assignChild
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:293
* @route '/api/guardian/child-assignments'
*/
const assignChilda9216355f09872986be5460b8fca3f39 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignChilda9216355f09872986be5460b8fca3f39.url(options),
    method: 'post',
})

assignChilda9216355f09872986be5460b8fca3f39.definition = {
    methods: ["post"],
    url: '/api/guardian/child-assignments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::assignChild
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:293
* @route '/api/guardian/child-assignments'
*/
assignChilda9216355f09872986be5460b8fca3f39.url = (options?: RouteQueryOptions) => {
    return assignChilda9216355f09872986be5460b8fca3f39.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::assignChild
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:293
* @route '/api/guardian/child-assignments'
*/
assignChilda9216355f09872986be5460b8fca3f39.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignChilda9216355f09872986be5460b8fca3f39.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::assignChild
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:293
* @route '/api/guardian/child-assignments'
*/
const assignChilda9216355f09872986be5460b8fca3f39Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: assignChilda9216355f09872986be5460b8fca3f39.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::assignChild
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:293
* @route '/api/guardian/child-assignments'
*/
assignChilda9216355f09872986be5460b8fca3f39Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: assignChilda9216355f09872986be5460b8fca3f39.url(options),
    method: 'post',
})

assignChilda9216355f09872986be5460b8fca3f39.form = assignChilda9216355f09872986be5460b8fca3f39Form
/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::assignChild
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:293
* @route '/guardian/child-assignments'
*/
const assignChild481dbfb4325fc8db590fe1b6afd5c0b7 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignChild481dbfb4325fc8db590fe1b6afd5c0b7.url(options),
    method: 'post',
})

assignChild481dbfb4325fc8db590fe1b6afd5c0b7.definition = {
    methods: ["post"],
    url: '/guardian/child-assignments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::assignChild
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:293
* @route '/guardian/child-assignments'
*/
assignChild481dbfb4325fc8db590fe1b6afd5c0b7.url = (options?: RouteQueryOptions) => {
    return assignChild481dbfb4325fc8db590fe1b6afd5c0b7.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::assignChild
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:293
* @route '/guardian/child-assignments'
*/
assignChild481dbfb4325fc8db590fe1b6afd5c0b7.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignChild481dbfb4325fc8db590fe1b6afd5c0b7.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::assignChild
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:293
* @route '/guardian/child-assignments'
*/
const assignChild481dbfb4325fc8db590fe1b6afd5c0b7Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: assignChild481dbfb4325fc8db590fe1b6afd5c0b7.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::assignChild
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:293
* @route '/guardian/child-assignments'
*/
assignChild481dbfb4325fc8db590fe1b6afd5c0b7Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: assignChild481dbfb4325fc8db590fe1b6afd5c0b7.url(options),
    method: 'post',
})

assignChild481dbfb4325fc8db590fe1b6afd5c0b7.form = assignChild481dbfb4325fc8db590fe1b6afd5c0b7Form

export const assignChild = {
    '/api/guardian/child-assignments': assignChilda9216355f09872986be5460b8fca3f39,
    '/guardian/child-assignments': assignChild481dbfb4325fc8db590fe1b6afd5c0b7,
}

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::cancelRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:345
* @route '/api/guardian/requests/{request}'
*/
const cancelRequest6899c325a854292621a332509bd02eab = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: cancelRequest6899c325a854292621a332509bd02eab.url(args, options),
    method: 'delete',
})

cancelRequest6899c325a854292621a332509bd02eab.definition = {
    methods: ["delete"],
    url: '/api/guardian/requests/{request}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::cancelRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:345
* @route '/api/guardian/requests/{request}'
*/
cancelRequest6899c325a854292621a332509bd02eab.url = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return cancelRequest6899c325a854292621a332509bd02eab.definition.url
            .replace('{request}', parsedArgs.request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::cancelRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:345
* @route '/api/guardian/requests/{request}'
*/
cancelRequest6899c325a854292621a332509bd02eab.delete = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: cancelRequest6899c325a854292621a332509bd02eab.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::cancelRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:345
* @route '/api/guardian/requests/{request}'
*/
const cancelRequest6899c325a854292621a332509bd02eabForm = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancelRequest6899c325a854292621a332509bd02eab.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::cancelRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:345
* @route '/api/guardian/requests/{request}'
*/
cancelRequest6899c325a854292621a332509bd02eabForm.delete = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancelRequest6899c325a854292621a332509bd02eab.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

cancelRequest6899c325a854292621a332509bd02eab.form = cancelRequest6899c325a854292621a332509bd02eabForm
/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::cancelRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:345
* @route '/guardian/connections/requests/{request}'
*/
const cancelRequest32317355b2fd680d4927921003f5f251 = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: cancelRequest32317355b2fd680d4927921003f5f251.url(args, options),
    method: 'delete',
})

cancelRequest32317355b2fd680d4927921003f5f251.definition = {
    methods: ["delete"],
    url: '/guardian/connections/requests/{request}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::cancelRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:345
* @route '/guardian/connections/requests/{request}'
*/
cancelRequest32317355b2fd680d4927921003f5f251.url = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return cancelRequest32317355b2fd680d4927921003f5f251.definition.url
            .replace('{request}', parsedArgs.request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::cancelRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:345
* @route '/guardian/connections/requests/{request}'
*/
cancelRequest32317355b2fd680d4927921003f5f251.delete = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: cancelRequest32317355b2fd680d4927921003f5f251.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::cancelRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:345
* @route '/guardian/connections/requests/{request}'
*/
const cancelRequest32317355b2fd680d4927921003f5f251Form = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancelRequest32317355b2fd680d4927921003f5f251.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::cancelRequest
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:345
* @route '/guardian/connections/requests/{request}'
*/
cancelRequest32317355b2fd680d4927921003f5f251Form.delete = (args: { request: string | number } | [request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancelRequest32317355b2fd680d4927921003f5f251.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

cancelRequest32317355b2fd680d4927921003f5f251.form = cancelRequest32317355b2fd680d4927921003f5f251Form

export const cancelRequest = {
    '/api/guardian/requests/{request}': cancelRequest6899c325a854292621a332509bd02eab,
    '/guardian/connections/requests/{request}': cancelRequest32317355b2fd680d4927921003f5f251,
}

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::index
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:43
* @route '/guardian/connections'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/guardian/connections',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::index
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:43
* @route '/guardian/connections'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::index
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:43
* @route '/guardian/connections'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::index
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:43
* @route '/guardian/connections'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::index
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:43
* @route '/guardian/connections'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::index
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:43
* @route '/guardian/connections'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::index
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:43
* @route '/guardian/connections'
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
* @see \App\Http\Controllers\Guardian\ClientConnectionController::searchTherapists
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:118
* @route '/guardian/connections/search'
*/
export const searchTherapists = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchTherapists.url(options),
    method: 'get',
})

searchTherapists.definition = {
    methods: ["get","head"],
    url: '/guardian/connections/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::searchTherapists
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:118
* @route '/guardian/connections/search'
*/
searchTherapists.url = (options?: RouteQueryOptions) => {
    return searchTherapists.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::searchTherapists
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:118
* @route '/guardian/connections/search'
*/
searchTherapists.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchTherapists.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::searchTherapists
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:118
* @route '/guardian/connections/search'
*/
searchTherapists.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: searchTherapists.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::searchTherapists
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:118
* @route '/guardian/connections/search'
*/
const searchTherapistsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: searchTherapists.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::searchTherapists
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:118
* @route '/guardian/connections/search'
*/
searchTherapistsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: searchTherapists.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::searchTherapists
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:118
* @route '/guardian/connections/search'
*/
searchTherapistsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: searchTherapists.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

searchTherapists.form = searchTherapistsForm

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::childAssignment
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:230
* @route '/guardian/connections/child-assignment'
*/
export const childAssignment = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: childAssignment.url(options),
    method: 'get',
})

childAssignment.definition = {
    methods: ["get","head"],
    url: '/guardian/connections/child-assignment',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::childAssignment
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:230
* @route '/guardian/connections/child-assignment'
*/
childAssignment.url = (options?: RouteQueryOptions) => {
    return childAssignment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::childAssignment
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:230
* @route '/guardian/connections/child-assignment'
*/
childAssignment.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: childAssignment.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::childAssignment
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:230
* @route '/guardian/connections/child-assignment'
*/
childAssignment.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: childAssignment.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::childAssignment
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:230
* @route '/guardian/connections/child-assignment'
*/
const childAssignmentForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: childAssignment.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::childAssignment
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:230
* @route '/guardian/connections/child-assignment'
*/
childAssignmentForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: childAssignment.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::childAssignment
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:230
* @route '/guardian/connections/child-assignment'
*/
childAssignmentForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: childAssignment.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

childAssignment.form = childAssignmentForm

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::show
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:397
* @route '/guardian/connections/{connection}'
*/
export const show = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/guardian/connections/{connection}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::show
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:397
* @route '/guardian/connections/{connection}'
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
* @see \App\Http\Controllers\Guardian\ClientConnectionController::show
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:397
* @route '/guardian/connections/{connection}'
*/
show.get = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::show
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:397
* @route '/guardian/connections/{connection}'
*/
show.head = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::show
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:397
* @route '/guardian/connections/{connection}'
*/
const showForm = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::show
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:397
* @route '/guardian/connections/{connection}'
*/
showForm.get = (args: { connection: string | number } | [connection: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::show
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:397
* @route '/guardian/connections/{connection}'
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

const ClientConnectionController = { createRequest, assignChild, cancelRequest, index, searchTherapists, childAssignment, show }

export default ClientConnectionController