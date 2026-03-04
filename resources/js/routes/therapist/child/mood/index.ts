import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MoodLogController::data
* @see app/Http/Controllers/MoodLogController.php:154
* @route '/therapist/child/{child}/mood'
*/
export const data = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: data.url(args, options),
    method: 'get',
})

data.definition = {
    methods: ["get","head"],
    url: '/therapist/child/{child}/mood',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MoodLogController::data
* @see app/Http/Controllers/MoodLogController.php:154
* @route '/therapist/child/{child}/mood'
*/
data.url = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { child: args }
    }

    if (Array.isArray(args)) {
        args = {
            child: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        child: args.child,
    }

    return data.definition.url
            .replace('{child}', parsedArgs.child.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MoodLogController::data
* @see app/Http/Controllers/MoodLogController.php:154
* @route '/therapist/child/{child}/mood'
*/
data.get = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: data.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::data
* @see app/Http/Controllers/MoodLogController.php:154
* @route '/therapist/child/{child}/mood'
*/
data.head = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: data.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MoodLogController::data
* @see app/Http/Controllers/MoodLogController.php:154
* @route '/therapist/child/{child}/mood'
*/
const dataForm = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: data.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::data
* @see app/Http/Controllers/MoodLogController.php:154
* @route '/therapist/child/{child}/mood'
*/
dataForm.get = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: data.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::data
* @see app/Http/Controllers/MoodLogController.php:154
* @route '/therapist/child/{child}/mood'
*/
dataForm.head = (args: { child: string | number } | [child: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: data.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

data.form = dataForm

const mood = {
    data: Object.assign(data, data),
}

export default mood