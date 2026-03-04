import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import filtering337a8c from './filtering'
/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flags
* @see app/Http/Controllers/Admin/ContentModerationController.php:17
* @route '/admin/moderation/flags'
*/
export const flags = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: flags.url(options),
    method: 'get',
})

flags.definition = {
    methods: ["get","head"],
    url: '/admin/moderation/flags',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flags
* @see app/Http/Controllers/Admin/ContentModerationController.php:17
* @route '/admin/moderation/flags'
*/
flags.url = (options?: RouteQueryOptions) => {
    return flags.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flags
* @see app/Http/Controllers/Admin/ContentModerationController.php:17
* @route '/admin/moderation/flags'
*/
flags.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: flags.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flags
* @see app/Http/Controllers/Admin/ContentModerationController.php:17
* @route '/admin/moderation/flags'
*/
flags.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: flags.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flags
* @see app/Http/Controllers/Admin/ContentModerationController.php:17
* @route '/admin/moderation/flags'
*/
const flagsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: flags.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flags
* @see app/Http/Controllers/Admin/ContentModerationController.php:17
* @route '/admin/moderation/flags'
*/
flagsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: flags.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::flags
* @see app/Http/Controllers/Admin/ContentModerationController.php:17
* @route '/admin/moderation/flags'
*/
flagsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: flags.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

flags.form = flagsForm

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::review
* @see app/Http/Controllers/Admin/ContentModerationController.php:93
* @route '/admin/moderation/flags/{flag}/review'
*/
export const review = (args: { flag: number | { id: number } } | [flag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: review.url(args, options),
    method: 'post',
})

review.definition = {
    methods: ["post"],
    url: '/admin/moderation/flags/{flag}/review',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::review
* @see app/Http/Controllers/Admin/ContentModerationController.php:93
* @route '/admin/moderation/flags/{flag}/review'
*/
review.url = (args: { flag: number | { id: number } } | [flag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { flag: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { flag: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            flag: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        flag: typeof args.flag === 'object'
        ? args.flag.id
        : args.flag,
    }

    return review.definition.url
            .replace('{flag}', parsedArgs.flag.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::review
* @see app/Http/Controllers/Admin/ContentModerationController.php:93
* @route '/admin/moderation/flags/{flag}/review'
*/
review.post = (args: { flag: number | { id: number } } | [flag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: review.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::review
* @see app/Http/Controllers/Admin/ContentModerationController.php:93
* @route '/admin/moderation/flags/{flag}/review'
*/
const reviewForm = (args: { flag: number | { id: number } } | [flag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: review.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::review
* @see app/Http/Controllers/Admin/ContentModerationController.php:93
* @route '/admin/moderation/flags/{flag}/review'
*/
reviewForm.post = (args: { flag: number | { id: number } } | [flag: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: review.url(args, options),
    method: 'post',
})

review.form = reviewForm

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::statistics
* @see app/Http/Controllers/Admin/ContentModerationController.php:145
* @route '/admin/moderation/statistics'
*/
export const statistics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics.url(options),
    method: 'get',
})

statistics.definition = {
    methods: ["get","head"],
    url: '/admin/moderation/statistics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::statistics
* @see app/Http/Controllers/Admin/ContentModerationController.php:145
* @route '/admin/moderation/statistics'
*/
statistics.url = (options?: RouteQueryOptions) => {
    return statistics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::statistics
* @see app/Http/Controllers/Admin/ContentModerationController.php:145
* @route '/admin/moderation/statistics'
*/
statistics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statistics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::statistics
* @see app/Http/Controllers/Admin/ContentModerationController.php:145
* @route '/admin/moderation/statistics'
*/
statistics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: statistics.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::statistics
* @see app/Http/Controllers/Admin/ContentModerationController.php:145
* @route '/admin/moderation/statistics'
*/
const statisticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::statistics
* @see app/Http/Controllers/Admin/ContentModerationController.php:145
* @route '/admin/moderation/statistics'
*/
statisticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::statistics
* @see app/Http/Controllers/Admin/ContentModerationController.php:145
* @route '/admin/moderation/statistics'
*/
statisticsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: statistics.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

statistics.form = statisticsForm

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::filtering
* @see app/Http/Controllers/Admin/ContentModerationController.php:213
* @route '/admin/moderation/filtering'
*/
export const filtering = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: filtering.url(options),
    method: 'get',
})

filtering.definition = {
    methods: ["get","head"],
    url: '/admin/moderation/filtering',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::filtering
* @see app/Http/Controllers/Admin/ContentModerationController.php:213
* @route '/admin/moderation/filtering'
*/
filtering.url = (options?: RouteQueryOptions) => {
    return filtering.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::filtering
* @see app/Http/Controllers/Admin/ContentModerationController.php:213
* @route '/admin/moderation/filtering'
*/
filtering.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: filtering.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::filtering
* @see app/Http/Controllers/Admin/ContentModerationController.php:213
* @route '/admin/moderation/filtering'
*/
filtering.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: filtering.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::filtering
* @see app/Http/Controllers/Admin/ContentModerationController.php:213
* @route '/admin/moderation/filtering'
*/
const filteringForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: filtering.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::filtering
* @see app/Http/Controllers/Admin/ContentModerationController.php:213
* @route '/admin/moderation/filtering'
*/
filteringForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: filtering.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::filtering
* @see app/Http/Controllers/Admin/ContentModerationController.php:213
* @route '/admin/moderation/filtering'
*/
filteringForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: filtering.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

filtering.form = filteringForm

const moderation = {
    flags: Object.assign(flags, flags),
    review: Object.assign(review, review),
    statistics: Object.assign(statistics, statistics),
    filtering: Object.assign(filtering, filtering337a8c),
}

export default moderation