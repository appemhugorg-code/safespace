import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AnalyticsController::admin
* @see app/Http/Controllers/AnalyticsController.php:41
* @route '/analytics/admin'
*/
export const admin = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: admin.url(options),
    method: 'get',
})

admin.definition = {
    methods: ["get","head"],
    url: '/analytics/admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalyticsController::admin
* @see app/Http/Controllers/AnalyticsController.php:41
* @route '/analytics/admin'
*/
admin.url = (options?: RouteQueryOptions) => {
    return admin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::admin
* @see app/Http/Controllers/AnalyticsController.php:41
* @route '/analytics/admin'
*/
admin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: admin.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::admin
* @see app/Http/Controllers/AnalyticsController.php:41
* @route '/analytics/admin'
*/
admin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: admin.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalyticsController::admin
* @see app/Http/Controllers/AnalyticsController.php:41
* @route '/analytics/admin'
*/
const adminForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: admin.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::admin
* @see app/Http/Controllers/AnalyticsController.php:41
* @route '/analytics/admin'
*/
adminForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: admin.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::admin
* @see app/Http/Controllers/AnalyticsController.php:41
* @route '/analytics/admin'
*/
adminForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: admin.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

admin.form = adminForm

/**
* @see \App\Http\Controllers\AnalyticsController::therapist
* @see app/Http/Controllers/AnalyticsController.php:23
* @route '/analytics/therapist'
*/
export const therapist = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: therapist.url(options),
    method: 'get',
})

therapist.definition = {
    methods: ["get","head"],
    url: '/analytics/therapist',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalyticsController::therapist
* @see app/Http/Controllers/AnalyticsController.php:23
* @route '/analytics/therapist'
*/
therapist.url = (options?: RouteQueryOptions) => {
    return therapist.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::therapist
* @see app/Http/Controllers/AnalyticsController.php:23
* @route '/analytics/therapist'
*/
therapist.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: therapist.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::therapist
* @see app/Http/Controllers/AnalyticsController.php:23
* @route '/analytics/therapist'
*/
therapist.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: therapist.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalyticsController::therapist
* @see app/Http/Controllers/AnalyticsController.php:23
* @route '/analytics/therapist'
*/
const therapistForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: therapist.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::therapist
* @see app/Http/Controllers/AnalyticsController.php:23
* @route '/analytics/therapist'
*/
therapistForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: therapist.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::therapist
* @see app/Http/Controllers/AnalyticsController.php:23
* @route '/analytics/therapist'
*/
therapistForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: therapist.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

therapist.form = therapistForm

/**
* @see \App\Http\Controllers\AnalyticsController::guardian
* @see app/Http/Controllers/AnalyticsController.php:63
* @route '/analytics/guardian'
*/
export const guardian = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: guardian.url(options),
    method: 'get',
})

guardian.definition = {
    methods: ["get","head"],
    url: '/analytics/guardian',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalyticsController::guardian
* @see app/Http/Controllers/AnalyticsController.php:63
* @route '/analytics/guardian'
*/
guardian.url = (options?: RouteQueryOptions) => {
    return guardian.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::guardian
* @see app/Http/Controllers/AnalyticsController.php:63
* @route '/analytics/guardian'
*/
guardian.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: guardian.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::guardian
* @see app/Http/Controllers/AnalyticsController.php:63
* @route '/analytics/guardian'
*/
guardian.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: guardian.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalyticsController::guardian
* @see app/Http/Controllers/AnalyticsController.php:63
* @route '/analytics/guardian'
*/
const guardianForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: guardian.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::guardian
* @see app/Http/Controllers/AnalyticsController.php:63
* @route '/analytics/guardian'
*/
guardianForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: guardian.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::guardian
* @see app/Http/Controllers/AnalyticsController.php:63
* @route '/analytics/guardian'
*/
guardianForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: guardian.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

guardian.form = guardianForm

/**
* @see \App\Http\Controllers\AnalyticsController::article
* @see app/Http/Controllers/AnalyticsController.php:85
* @route '/analytics/articles/{article}'
*/
export const article = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: article.url(args, options),
    method: 'get',
})

article.definition = {
    methods: ["get","head"],
    url: '/analytics/articles/{article}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalyticsController::article
* @see app/Http/Controllers/AnalyticsController.php:85
* @route '/analytics/articles/{article}'
*/
article.url = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return article.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::article
* @see app/Http/Controllers/AnalyticsController.php:85
* @route '/analytics/articles/{article}'
*/
article.get = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: article.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::article
* @see app/Http/Controllers/AnalyticsController.php:85
* @route '/analytics/articles/{article}'
*/
article.head = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: article.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalyticsController::article
* @see app/Http/Controllers/AnalyticsController.php:85
* @route '/analytics/articles/{article}'
*/
const articleForm = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: article.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::article
* @see app/Http/Controllers/AnalyticsController.php:85
* @route '/analytics/articles/{article}'
*/
articleForm.get = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: article.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::article
* @see app/Http/Controllers/AnalyticsController.php:85
* @route '/analytics/articles/{article}'
*/
articleForm.head = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: article.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

article.form = articleForm

/**
* @see \App\Http\Controllers\AnalyticsController::game
* @see app/Http/Controllers/AnalyticsController.php:102
* @route '/analytics/games/{game}'
*/
export const game = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: game.url(args, options),
    method: 'get',
})

game.definition = {
    methods: ["get","head"],
    url: '/analytics/games/{game}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalyticsController::game
* @see app/Http/Controllers/AnalyticsController.php:102
* @route '/analytics/games/{game}'
*/
game.url = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return game.definition.url
            .replace('{game}', parsedArgs.game.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::game
* @see app/Http/Controllers/AnalyticsController.php:102
* @route '/analytics/games/{game}'
*/
game.get = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: game.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::game
* @see app/Http/Controllers/AnalyticsController.php:102
* @route '/analytics/games/{game}'
*/
game.head = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: game.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalyticsController::game
* @see app/Http/Controllers/AnalyticsController.php:102
* @route '/analytics/games/{game}'
*/
const gameForm = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: game.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::game
* @see app/Http/Controllers/AnalyticsController.php:102
* @route '/analytics/games/{game}'
*/
gameForm.get = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: game.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::game
* @see app/Http/Controllers/AnalyticsController.php:102
* @route '/analytics/games/{game}'
*/
gameForm.head = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: game.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

game.form = gameForm

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
* @see \App\Http\Controllers\AnalyticsController::track
* @see app/Http/Controllers/AnalyticsController.php:158
* @route '/analytics/track'
*/
export const track = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: track.url(options),
    method: 'post',
})

track.definition = {
    methods: ["post"],
    url: '/analytics/track',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AnalyticsController::track
* @see app/Http/Controllers/AnalyticsController.php:158
* @route '/analytics/track'
*/
track.url = (options?: RouteQueryOptions) => {
    return track.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::track
* @see app/Http/Controllers/AnalyticsController.php:158
* @route '/analytics/track'
*/
track.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: track.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AnalyticsController::track
* @see app/Http/Controllers/AnalyticsController.php:158
* @route '/analytics/track'
*/
const trackForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: track.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AnalyticsController::track
* @see app/Http/Controllers/AnalyticsController.php:158
* @route '/analytics/track'
*/
trackForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: track.url(options),
    method: 'post',
})

track.form = trackForm

/**
* @see \App\Http\Controllers\AnalyticsController::trends
* @see app/Http/Controllers/AnalyticsController.php:196
* @route '/analytics/trends'
*/
export const trends = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trends.url(options),
    method: 'get',
})

trends.definition = {
    methods: ["get","head"],
    url: '/analytics/trends',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalyticsController::trends
* @see app/Http/Controllers/AnalyticsController.php:196
* @route '/analytics/trends'
*/
trends.url = (options?: RouteQueryOptions) => {
    return trends.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::trends
* @see app/Http/Controllers/AnalyticsController.php:196
* @route '/analytics/trends'
*/
trends.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trends.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::trends
* @see app/Http/Controllers/AnalyticsController.php:196
* @route '/analytics/trends'
*/
trends.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: trends.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnalyticsController::trends
* @see app/Http/Controllers/AnalyticsController.php:196
* @route '/analytics/trends'
*/
const trendsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: trends.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::trends
* @see app/Http/Controllers/AnalyticsController.php:196
* @route '/analytics/trends'
*/
trendsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: trends.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnalyticsController::trends
* @see app/Http/Controllers/AnalyticsController.php:196
* @route '/analytics/trends'
*/
trendsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: trends.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

trends.form = trendsForm

const analytics = {
    admin: Object.assign(admin, admin),
    therapist: Object.assign(therapist, therapist),
    guardian: Object.assign(guardian, guardian),
    article: Object.assign(article, article),
    game: Object.assign(game, game),
    userEngagement: Object.assign(userEngagement, userEngagement),
    recommendations: Object.assign(recommendations, recommendations),
    track: Object.assign(track, track),
    trends: Object.assign(trends, trends),
}

export default analytics