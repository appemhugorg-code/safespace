import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Child\ChildConnectionController::index
* @see app/Http/Controllers/Child/ChildConnectionController.php:30
* @route '/child/connections'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/child/connections',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::index
* @see app/Http/Controllers/Child/ChildConnectionController.php:30
* @route '/child/connections'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::index
* @see app/Http/Controllers/Child/ChildConnectionController.php:30
* @route '/child/connections'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::index
* @see app/Http/Controllers/Child/ChildConnectionController.php:30
* @route '/child/connections'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::index
* @see app/Http/Controllers/Child/ChildConnectionController.php:30
* @route '/child/connections'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::index
* @see app/Http/Controllers/Child/ChildConnectionController.php:30
* @route '/child/connections'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::index
* @see app/Http/Controllers/Child/ChildConnectionController.php:30
* @route '/child/connections'
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
* @see \App\Http\Controllers\Child\ChildConnectionController::show
* @see app/Http/Controllers/Child/ChildConnectionController.php:87
* @route '/child/connections/{connection}'
*/
export const show = (args: { connection: number | { id: number } } | [connection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/child/connections/{connection}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::show
* @see app/Http/Controllers/Child/ChildConnectionController.php:87
* @route '/child/connections/{connection}'
*/
show.url = (args: { connection: number | { id: number } } | [connection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { connection: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { connection: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            connection: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        connection: typeof args.connection === 'object'
        ? args.connection.id
        : args.connection,
    }

    return show.definition.url
            .replace('{connection}', parsedArgs.connection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::show
* @see app/Http/Controllers/Child/ChildConnectionController.php:87
* @route '/child/connections/{connection}'
*/
show.get = (args: { connection: number | { id: number } } | [connection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::show
* @see app/Http/Controllers/Child/ChildConnectionController.php:87
* @route '/child/connections/{connection}'
*/
show.head = (args: { connection: number | { id: number } } | [connection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::show
* @see app/Http/Controllers/Child/ChildConnectionController.php:87
* @route '/child/connections/{connection}'
*/
const showForm = (args: { connection: number | { id: number } } | [connection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::show
* @see app/Http/Controllers/Child/ChildConnectionController.php:87
* @route '/child/connections/{connection}'
*/
showForm.get = (args: { connection: number | { id: number } } | [connection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Child\ChildConnectionController::show
* @see app/Http/Controllers/Child/ChildConnectionController.php:87
* @route '/child/connections/{connection}'
*/
showForm.head = (args: { connection: number | { id: number } } | [connection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const connections = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
}

export default connections