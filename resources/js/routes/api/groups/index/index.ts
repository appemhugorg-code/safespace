import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/groups'
*/
export const legacy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: legacy.url(options),
    method: 'get',
})

legacy.definition = {
    methods: ["get","head"],
    url: '/api/groups',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/groups'
*/
legacy.url = (options?: RouteQueryOptions) => {
    return legacy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/groups'
*/
legacy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: legacy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/groups'
*/
legacy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: legacy.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/groups'
*/
const legacyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: legacy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/groups'
*/
legacyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: legacy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:26
* @route '/api/groups'
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

const index = {
    legacy: Object.assign(legacy, legacy),
}

export default index