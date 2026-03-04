import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/groups/{group}/leave'
*/
export const legacy = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: legacy.url(args, options),
    method: 'post',
})

legacy.definition = {
    methods: ["post"],
    url: '/api/groups/{group}/leave',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/groups/{group}/leave'
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
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/groups/{group}/leave'
*/
legacy.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: legacy.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/groups/{group}/leave'
*/
const legacyForm = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: legacy.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:378
* @route '/api/groups/{group}/leave'
*/
legacyForm.post = (args: { group: number | { id: number } } | [group: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: legacy.url(args, options),
    method: 'post',
})

legacy.form = legacyForm

const leave = {
    legacy: Object.assign(legacy, legacy),
}

export default leave