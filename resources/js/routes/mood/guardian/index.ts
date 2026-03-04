import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\MoodLogController::overview
* @see app/Http/Controllers/MoodLogController.php:278
* @route '/mood/overview'
*/
export const overview = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overview.url(options),
    method: 'get',
})

overview.definition = {
    methods: ["get","head"],
    url: '/mood/overview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MoodLogController::overview
* @see app/Http/Controllers/MoodLogController.php:278
* @route '/mood/overview'
*/
overview.url = (options?: RouteQueryOptions) => {
    return overview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MoodLogController::overview
* @see app/Http/Controllers/MoodLogController.php:278
* @route '/mood/overview'
*/
overview.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overview.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::overview
* @see app/Http/Controllers/MoodLogController.php:278
* @route '/mood/overview'
*/
overview.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: overview.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MoodLogController::overview
* @see app/Http/Controllers/MoodLogController.php:278
* @route '/mood/overview'
*/
const overviewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: overview.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::overview
* @see app/Http/Controllers/MoodLogController.php:278
* @route '/mood/overview'
*/
overviewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: overview.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::overview
* @see app/Http/Controllers/MoodLogController.php:278
* @route '/mood/overview'
*/
overviewForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: overview.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

overview.form = overviewForm

const guardian = {
    overview: Object.assign(overview, overview),
}

export default guardian