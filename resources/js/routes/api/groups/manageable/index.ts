import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/groups/manageable/list'
*/
export const legacy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: legacy.url(options),
    method: 'get',
})

legacy.definition = {
    methods: ["get","head"],
    url: '/api/groups/manageable/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/groups/manageable/list'
*/
legacy.url = (options?: RouteQueryOptions) => {
    return legacy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/groups/manageable/list'
*/
legacy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: legacy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/groups/manageable/list'
*/
legacy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: legacy.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/groups/manageable/list'
*/
const legacyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: legacy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/groups/manageable/list'
*/
legacyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: legacy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:193
* @route '/api/groups/manageable/list'
*/
legacyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: legacy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

legacy.form = legacyForm

const manageable = {
    legacy: Object.assign(legacy, legacy),
}

export default manageable