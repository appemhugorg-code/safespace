import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/groups'
*/
export const legacy = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: legacy.url(options),
    method: 'post',
})

legacy.definition = {
    methods: ["post"],
    url: '/api/groups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/groups'
*/
legacy.url = (options?: RouteQueryOptions) => {
    return legacy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/groups'
*/
legacy.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: legacy.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/groups'
*/
const legacyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: legacy.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::legacy
* @see app/Http/Controllers/GroupController.php:57
* @route '/api/groups'
*/
legacyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: legacy.url(options),
    method: 'post',
})

legacy.form = legacyForm

const store = {
    legacy: Object.assign(legacy, legacy),
}

export default store