import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:315
* @route '/api/groups/{group}/join-requests/{request}'
*/
export const legacy = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: legacy.url(args, options),
    method: 'put',
})

legacy.definition = {
    methods: ["put"],
    url: '/api/groups/{group}/join-requests/{request}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:315
* @route '/api/groups/{group}/join-requests/{request}'
*/
legacy.url = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            group: args[0],
            request: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        group: typeof args.group === 'object'
        ? args.group.id
        : args.group,
        request: args.request,
    }

    return legacy.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{request}', parsedArgs.request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:315
* @route '/api/groups/{group}/join-requests/{request}'
*/
legacy.put = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: legacy.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:315
* @route '/api/groups/{group}/join-requests/{request}'
*/
const legacyForm = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: legacy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:315
* @route '/api/groups/{group}/join-requests/{request}'
*/
legacyForm.put = (args: { group: number | { id: number }, request: string | number } | [group: number | { id: number }, request: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: legacy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

legacy.form = legacyForm

const reviewJoinRequest = {
    legacy: Object.assign(legacy, legacy),
}

export default reviewJoinRequest