import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AnalyticsController::adminDashboard
* @see app/Http/Controllers/AnalyticsController.php:41
* @route '/analytics/admin'
*/
export const adminDashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: adminDashboard.url(options),
    method: 'get',
})

adminDashboard.definition = {
    methods: ["get","head"],
    url: '/analytics/admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalyticsController::adminDashboard
* @see app/Http/Controllers/AnalyticsController.php:41
* @route '/analytics/admin'
*/
adminDashboard.url = (options?: RouteQueryOptions) => {
    return adminDashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::adminDashboard
* @see app/Http/Controllers/AnalyticsController.php:41
* @route '/analytics/admin'
*/
adminDashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: adminDashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::adminDashboard
* @see app/Http/Controllers/AnalyticsController.php:41
* @route '/analytics/admin'
*/
adminDashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: adminDashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalyticsController::adminDashboard
* @see app/Http/Controllers/AnalyticsController.php:41
* @route '/analytics/admin'
*/
const adminDashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: adminDashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::adminDashboard
* @see app/Http/Controllers/AnalyticsController.php:41
* @route '/analytics/admin'
*/
adminDashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: adminDashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::adminDashboard
* @see app/Http/Controllers/AnalyticsController.php:41
* @route '/analytics/admin'
*/
adminDashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: adminDashboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

adminDashboard.form = adminDashboardForm

/**
* @see \App\Http\Controllers\AnalyticsController::therapistDashboard
* @see app/Http/Controllers/AnalyticsController.php:23
* @route '/analytics/therapist'
*/
export const therapistDashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: therapistDashboard.url(options),
    method: 'get',
})

therapistDashboard.definition = {
    methods: ["get","head"],
    url: '/analytics/therapist',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalyticsController::therapistDashboard
* @see app/Http/Controllers/AnalyticsController.php:23
* @route '/analytics/therapist'
*/
therapistDashboard.url = (options?: RouteQueryOptions) => {
    return therapistDashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::therapistDashboard
* @see app/Http/Controllers/AnalyticsController.php:23
* @route '/analytics/therapist'
*/
therapistDashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: therapistDashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::therapistDashboard
* @see app/Http/Controllers/AnalyticsController.php:23
* @route '/analytics/therapist'
*/
therapistDashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: therapistDashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalyticsController::therapistDashboard
* @see app/Http/Controllers/AnalyticsController.php:23
* @route '/analytics/therapist'
*/
const therapistDashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: therapistDashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::therapistDashboard
* @see app/Http/Controllers/AnalyticsController.php:23
* @route '/analytics/therapist'
*/
therapistDashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: therapistDashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::therapistDashboard
* @see app/Http/Controllers/AnalyticsController.php:23
* @route '/analytics/therapist'
*/
therapistDashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: therapistDashboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

therapistDashboard.form = therapistDashboardForm

/**
* @see \App\Http\Controllers\AnalyticsController::guardianDashboard
* @see app/Http/Controllers/AnalyticsController.php:63
* @route '/analytics/guardian'
*/
export const guardianDashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: guardianDashboard.url(options),
    method: 'get',
})

guardianDashboard.definition = {
    methods: ["get","head"],
    url: '/analytics/guardian',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalyticsController::guardianDashboard
* @see app/Http/Controllers/AnalyticsController.php:63
* @route '/analytics/guardian'
*/
guardianDashboard.url = (options?: RouteQueryOptions) => {
    return guardianDashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::guardianDashboard
* @see app/Http/Controllers/AnalyticsController.php:63
* @route '/analytics/guardian'
*/
guardianDashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: guardianDashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::guardianDashboard
* @see app/Http/Controllers/AnalyticsController.php:63
* @route '/analytics/guardian'
*/
guardianDashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: guardianDashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalyticsController::guardianDashboard
* @see app/Http/Controllers/AnalyticsController.php:63
* @route '/analytics/guardian'
*/
const guardianDashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: guardianDashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::guardianDashboard
* @see app/Http/Controllers/AnalyticsController.php:63
* @route '/analytics/guardian'
*/
guardianDashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: guardianDashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::guardianDashboard
* @see app/Http/Controllers/AnalyticsController.php:63
* @route '/analytics/guardian'
*/
guardianDashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: guardianDashboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

guardianDashboard.form = guardianDashboardForm

/**
* @see \App\Http\Controllers\AnalyticsController::articleAnalytics
* @see app/Http/Controllers/AnalyticsController.php:85
* @route '/analytics/articles/{article}'
*/
export const articleAnalytics = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: articleAnalytics.url(args, options),
    method: 'get',
})

articleAnalytics.definition = {
    methods: ["get","head"],
    url: '/analytics/articles/{article}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalyticsController::articleAnalytics
* @see app/Http/Controllers/AnalyticsController.php:85
* @route '/analytics/articles/{article}'
*/
articleAnalytics.url = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { article: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { article: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            article: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        article: typeof args.article === 'object'
        ? args.article.slug
        : args.article,
    }

    return articleAnalytics.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::articleAnalytics
* @see app/Http/Controllers/AnalyticsController.php:85
* @route '/analytics/articles/{article}'
*/
articleAnalytics.get = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: articleAnalytics.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::articleAnalytics
* @see app/Http/Controllers/AnalyticsController.php:85
* @route '/analytics/articles/{article}'
*/
articleAnalytics.head = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: articleAnalytics.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalyticsController::articleAnalytics
* @see app/Http/Controllers/AnalyticsController.php:85
* @route '/analytics/articles/{article}'
*/
const articleAnalyticsForm = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: articleAnalytics.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::articleAnalytics
* @see app/Http/Controllers/AnalyticsController.php:85
* @route '/analytics/articles/{article}'
*/
articleAnalyticsForm.get = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: articleAnalytics.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::articleAnalytics
* @see app/Http/Controllers/AnalyticsController.php:85
* @route '/analytics/articles/{article}'
*/
articleAnalyticsForm.head = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: articleAnalytics.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

articleAnalytics.form = articleAnalyticsForm

/**
* @see \App\Http\Controllers\AnalyticsController::gameAnalytics
* @see app/Http/Controllers/AnalyticsController.php:102
* @route '/analytics/games/{game}'
*/
export const gameAnalytics = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: gameAnalytics.url(args, options),
    method: 'get',
})

gameAnalytics.definition = {
    methods: ["get","head"],
    url: '/analytics/games/{game}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalyticsController::gameAnalytics
* @see app/Http/Controllers/AnalyticsController.php:102
* @route '/analytics/games/{game}'
*/
gameAnalytics.url = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { game: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { game: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            game: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        game: typeof args.game === 'object'
        ? args.game.id
        : args.game,
    }

    return gameAnalytics.definition.url
            .replace('{game}', parsedArgs.game.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::gameAnalytics
* @see app/Http/Controllers/AnalyticsController.php:102
* @route '/analytics/games/{game}'
*/
gameAnalytics.get = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: gameAnalytics.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::gameAnalytics
* @see app/Http/Controllers/AnalyticsController.php:102
* @route '/analytics/games/{game}'
*/
gameAnalytics.head = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: gameAnalytics.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalyticsController::gameAnalytics
* @see app/Http/Controllers/AnalyticsController.php:102
* @route '/analytics/games/{game}'
*/
const gameAnalyticsForm = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: gameAnalytics.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::gameAnalytics
* @see app/Http/Controllers/AnalyticsController.php:102
* @route '/analytics/games/{game}'
*/
gameAnalyticsForm.get = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: gameAnalytics.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::gameAnalytics
* @see app/Http/Controllers/AnalyticsController.php:102
* @route '/analytics/games/{game}'
*/
gameAnalyticsForm.head = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: gameAnalytics.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

gameAnalytics.form = gameAnalyticsForm

/**
* @see \App\Http\Controllers\AnalyticsController::userEngagement
* @see app/Http/Controllers/AnalyticsController.php:119
* @route '/analytics/user-engagement'
*/
export const userEngagement = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: userEngagement.url(options),
    method: 'get',
})

userEngagement.definition = {
    methods: ["get","head"],
    url: '/analytics/user-engagement',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalyticsController::userEngagement
* @see app/Http/Controllers/AnalyticsController.php:119
* @route '/analytics/user-engagement'
*/
userEngagement.url = (options?: RouteQueryOptions) => {
    return userEngagement.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::userEngagement
* @see app/Http/Controllers/AnalyticsController.php:119
* @route '/analytics/user-engagement'
*/
userEngagement.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: userEngagement.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::userEngagement
* @see app/Http/Controllers/AnalyticsController.php:119
* @route '/analytics/user-engagement'
*/
userEngagement.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: userEngagement.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalyticsController::userEngagement
* @see app/Http/Controllers/AnalyticsController.php:119
* @route '/analytics/user-engagement'
*/
const userEngagementForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userEngagement.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::userEngagement
* @see app/Http/Controllers/AnalyticsController.php:119
* @route '/analytics/user-engagement'
*/
userEngagementForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userEngagement.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::userEngagement
* @see app/Http/Controllers/AnalyticsController.php:119
* @route '/analytics/user-engagement'
*/
userEngagementForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userEngagement.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

userEngagement.form = userEngagementForm

/**
* @see \App\Http\Controllers\AnalyticsController::recommendations
* @see app/Http/Controllers/AnalyticsController.php:147
* @route '/analytics/recommendations'
*/
export const recommendations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recommendations.url(options),
    method: 'get',
})

recommendations.definition = {
    methods: ["get","head"],
    url: '/analytics/recommendations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalyticsController::recommendations
* @see app/Http/Controllers/AnalyticsController.php:147
* @route '/analytics/recommendations'
*/
recommendations.url = (options?: RouteQueryOptions) => {
    return recommendations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::recommendations
* @see app/Http/Controllers/AnalyticsController.php:147
* @route '/analytics/recommendations'
*/
recommendations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recommendations.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::recommendations
* @see app/Http/Controllers/AnalyticsController.php:147
* @route '/analytics/recommendations'
*/
recommendations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: recommendations.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalyticsController::recommendations
* @see app/Http/Controllers/AnalyticsController.php:147
* @route '/analytics/recommendations'
*/
const recommendationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: recommendations.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::recommendations
* @see app/Http/Controllers/AnalyticsController.php:147
* @route '/analytics/recommendations'
*/
recommendationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: recommendations.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::recommendations
* @see app/Http/Controllers/AnalyticsController.php:147
* @route '/analytics/recommendations'
*/
recommendationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: recommendations.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

recommendations.form = recommendationsForm

/**
* @see \App\Http\Controllers\AnalyticsController::trackEngagement
* @see app/Http/Controllers/AnalyticsController.php:158
* @route '/analytics/track'
*/
export const trackEngagement = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: trackEngagement.url(options),
    method: 'post',
})

trackEngagement.definition = {
    methods: ["post"],
    url: '/analytics/track',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AnalyticsController::trackEngagement
* @see app/Http/Controllers/AnalyticsController.php:158
* @route '/analytics/track'
*/
trackEngagement.url = (options?: RouteQueryOptions) => {
    return trackEngagement.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::trackEngagement
* @see app/Http/Controllers/AnalyticsController.php:158
* @route '/analytics/track'
*/
trackEngagement.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: trackEngagement.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AnalyticsController::trackEngagement
* @see app/Http/Controllers/AnalyticsController.php:158
* @route '/analytics/track'
*/
const trackEngagementForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: trackEngagement.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AnalyticsController::trackEngagement
* @see app/Http/Controllers/AnalyticsController.php:158
* @route '/analytics/track'
*/
trackEngagementForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: trackEngagement.url(options),
    method: 'post',
})

trackEngagement.form = trackEngagementForm

/**
* @see \App\Http\Controllers\AnalyticsController::engagementTrends
* @see app/Http/Controllers/AnalyticsController.php:196
* @route '/analytics/trends'
*/
export const engagementTrends = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: engagementTrends.url(options),
    method: 'get',
})

engagementTrends.definition = {
    methods: ["get","head"],
    url: '/analytics/trends',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalyticsController::engagementTrends
* @see app/Http/Controllers/AnalyticsController.php:196
* @route '/analytics/trends'
*/
engagementTrends.url = (options?: RouteQueryOptions) => {
    return engagementTrends.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::engagementTrends
* @see app/Http/Controllers/AnalyticsController.php:196
* @route '/analytics/trends'
*/
engagementTrends.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: engagementTrends.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::engagementTrends
* @see app/Http/Controllers/AnalyticsController.php:196
* @route '/analytics/trends'
*/
engagementTrends.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: engagementTrends.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalyticsController::engagementTrends
* @see app/Http/Controllers/AnalyticsController.php:196
* @route '/analytics/trends'
*/
const engagementTrendsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: engagementTrends.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::engagementTrends
* @see app/Http/Controllers/AnalyticsController.php:196
* @route '/analytics/trends'
*/
engagementTrendsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: engagementTrends.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::engagementTrends
* @see app/Http/Controllers/AnalyticsController.php:196
* @route '/analytics/trends'
*/
engagementTrendsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: engagementTrends.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

engagementTrends.form = engagementTrendsForm

const AnalyticsController = { adminDashboard, therapistDashboard, guardianDashboard, articleAnalytics, gameAnalytics, userEngagement, recommendations, trackEngagement, engagementTrends }

export default AnalyticsController