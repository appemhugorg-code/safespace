import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/groups/search/available'
*/
export const legacy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: legacy.url(options),
    method: 'get',
})

legacy.definition = {
    methods: ["get","head"],
    url: '/api/groups/search/available',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/groups/search/available'
*/
legacy.url = (options?: RouteQueryOptions) => {
    return legacy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/groups/search/available'
*/
legacy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: legacy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/groups/search/available'
*/
legacy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: legacy.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/groups/search/available'
*/
const legacyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: legacy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/groups/search/available'
*/
legacyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: legacy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:167
* @route '/api/groups/search/available'
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

const search = {
    legacy: Object.assign(legacy, legacy),
}

export default search