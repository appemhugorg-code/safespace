import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MessageController::legacy
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/groups/{group}/flagged-messages'
*/
export const legacy = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: legacy.url(args, options),
    method: 'get',
})

legacy.definition = {
    methods: ["get","head"],
    url: '/api/groups/{group}/flagged-messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MessageController::legacy
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/groups/{group}/flagged-messages'
*/
legacy.url = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return legacy.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MessageController::legacy
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/groups/{group}/flagged-messages'
*/
legacy.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: legacy.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::legacy
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/groups/{group}/flagged-messages'
*/
legacy.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: legacy.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MessageController::legacy
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/groups/{group}/flagged-messages'
*/
const legacyForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: legacy.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::legacy
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/groups/{group}/flagged-messages'
*/
legacyForm.get = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: legacy.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MessageController::legacy
* @see app/Http/Controllers/MessageController.php:516
* @route '/api/groups/{group}/flagged-messages'
*/
legacyForm.head = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: legacy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

legacy.form = legacyForm

const flaggedMessages = {
    legacy: Object.assign(legacy, legacy),
}

export default flaggedMessages