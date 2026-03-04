import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:535
* @route '/api/groups/{group}/members/{user}'
*/
export const legacy = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: legacy.url(args, options),
    method: 'delete',
})

legacy.definition = {
    methods: ["delete"],
    url: '/api/groups/{group}/members/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:535
* @route '/api/groups/{group}/members/{user}'
*/
legacy.url = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            group: args[0],
            user: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        group: typeof args.group === 'object'
        ? args.group.id
        : args.group,
        user: args.user,
    }

    return legacy.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:535
* @route '/api/groups/{group}/members/{user}'
*/
legacy.delete = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: legacy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:535
* @route '/api/groups/{group}/members/{user}'
*/
const legacyForm = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: legacy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:535
* @route '/api/groups/{group}/members/{user}'
*/
legacyForm.delete = (args: { group: number | { id: number }, user: string | number } | [group: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: legacy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

legacy.form = legacyForm

const removeMember = {
    legacy: Object.assign(legacy, legacy),
}

export default removeMember