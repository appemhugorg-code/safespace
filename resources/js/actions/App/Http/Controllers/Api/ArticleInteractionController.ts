import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getComments
* @see app/Http/Controllers/Api/ArticleInteractionController.php:36
* @route '/api/articles/{article}/comments'
*/
export const getComments = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getComments.url(args, options),
    method: 'get',
})

getComments.definition = {
    methods: ["get","head"],
    url: '/api/articles/{article}/comments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getComments
* @see app/Http/Controllers/Api/ArticleInteractionController.php:36
* @route '/api/articles/{article}/comments'
*/
getComments.url = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return getComments.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getComments
* @see app/Http/Controllers/Api/ArticleInteractionController.php:36
* @route '/api/articles/{article}/comments'
*/
getComments.get = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getComments.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getComments
* @see app/Http/Controllers/Api/ArticleInteractionController.php:36
* @route '/api/articles/{article}/comments'
*/
getComments.head = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getComments.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getComments
* @see app/Http/Controllers/Api/ArticleInteractionController.php:36
* @route '/api/articles/{article}/comments'
*/
const getCommentsForm = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getComments.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getComments
* @see app/Http/Controllers/Api/ArticleInteractionController.php:36
* @route '/api/articles/{article}/comments'
*/
getCommentsForm.get = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getComments.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getComments
* @see app/Http/Controllers/Api/ArticleInteractionController.php:36
* @route '/api/articles/{article}/comments'
*/
getCommentsForm.head = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getComments.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getComments.form = getCommentsForm

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::createComment
* @see app/Http/Controllers/Api/ArticleInteractionController.php:50
* @route '/api/articles/{article}/comments'
*/
export const createComment = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createComment.url(args, options),
    method: 'post',
})

createComment.definition = {
    methods: ["post"],
    url: '/api/articles/{article}/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::createComment
* @see app/Http/Controllers/Api/ArticleInteractionController.php:50
* @route '/api/articles/{article}/comments'
*/
createComment.url = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return createComment.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::createComment
* @see app/Http/Controllers/Api/ArticleInteractionController.php:50
* @route '/api/articles/{article}/comments'
*/
createComment.post = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createComment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::createComment
* @see app/Http/Controllers/Api/ArticleInteractionController.php:50
* @route '/api/articles/{article}/comments'
*/
const createCommentForm = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createComment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::createComment
* @see app/Http/Controllers/Api/ArticleInteractionController.php:50
* @route '/api/articles/{article}/comments'
*/
createCommentForm.post = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createComment.url(args, options),
    method: 'post',
})

createComment.form = createCommentForm

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::flagComment
* @see app/Http/Controllers/Api/ArticleInteractionController.php:81
* @route '/api/articles/comments/{comment}/flag'
*/
export const flagComment = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flagComment.url(args, options),
    method: 'post',
})

flagComment.definition = {
    methods: ["post"],
    url: '/api/articles/comments/{comment}/flag',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::flagComment
* @see app/Http/Controllers/Api/ArticleInteractionController.php:81
* @route '/api/articles/comments/{comment}/flag'
*/
flagComment.url = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { comment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { comment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            comment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        comment: typeof args.comment === 'object'
        ? args.comment.id
        : args.comment,
    }

    return flagComment.definition.url
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::flagComment
* @see app/Http/Controllers/Api/ArticleInteractionController.php:81
* @route '/api/articles/comments/{comment}/flag'
*/
flagComment.post = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flagComment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::flagComment
* @see app/Http/Controllers/Api/ArticleInteractionController.php:81
* @route '/api/articles/comments/{comment}/flag'
*/
const flagCommentForm = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: flagComment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::flagComment
* @see app/Http/Controllers/Api/ArticleInteractionController.php:81
* @route '/api/articles/comments/{comment}/flag'
*/
flagCommentForm.post = (args: { comment: number | { id: number } } | [comment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: flagComment.url(args, options),
    method: 'post',
})

flagComment.form = flagCommentForm

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::rateArticle
* @see app/Http/Controllers/Api/ArticleInteractionController.php:105
* @route '/api/articles/{article}/rate'
*/
export const rateArticle = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rateArticle.url(args, options),
    method: 'post',
})

rateArticle.definition = {
    methods: ["post"],
    url: '/api/articles/{article}/rate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::rateArticle
* @see app/Http/Controllers/Api/ArticleInteractionController.php:105
* @route '/api/articles/{article}/rate'
*/
rateArticle.url = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return rateArticle.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::rateArticle
* @see app/Http/Controllers/Api/ArticleInteractionController.php:105
* @route '/api/articles/{article}/rate'
*/
rateArticle.post = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rateArticle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::rateArticle
* @see app/Http/Controllers/Api/ArticleInteractionController.php:105
* @route '/api/articles/{article}/rate'
*/
const rateArticleForm = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rateArticle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::rateArticle
* @see app/Http/Controllers/Api/ArticleInteractionController.php:105
* @route '/api/articles/{article}/rate'
*/
rateArticleForm.post = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rateArticle.url(args, options),
    method: 'post',
})

rateArticle.form = rateArticleForm

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getRatingStats
* @see app/Http/Controllers/Api/ArticleInteractionController.php:139
* @route '/api/articles/{article}/rating-stats'
*/
export const getRatingStats = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRatingStats.url(args, options),
    method: 'get',
})

getRatingStats.definition = {
    methods: ["get","head"],
    url: '/api/articles/{article}/rating-stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getRatingStats
* @see app/Http/Controllers/Api/ArticleInteractionController.php:139
* @route '/api/articles/{article}/rating-stats'
*/
getRatingStats.url = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return getRatingStats.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getRatingStats
* @see app/Http/Controllers/Api/ArticleInteractionController.php:139
* @route '/api/articles/{article}/rating-stats'
*/
getRatingStats.get = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRatingStats.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getRatingStats
* @see app/Http/Controllers/Api/ArticleInteractionController.php:139
* @route '/api/articles/{article}/rating-stats'
*/
getRatingStats.head = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getRatingStats.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getRatingStats
* @see app/Http/Controllers/Api/ArticleInteractionController.php:139
* @route '/api/articles/{article}/rating-stats'
*/
const getRatingStatsForm = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getRatingStats.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getRatingStats
* @see app/Http/Controllers/Api/ArticleInteractionController.php:139
* @route '/api/articles/{article}/rating-stats'
*/
getRatingStatsForm.get = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getRatingStats.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getRatingStats
* @see app/Http/Controllers/Api/ArticleInteractionController.php:139
* @route '/api/articles/{article}/rating-stats'
*/
getRatingStatsForm.head = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getRatingStats.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getRatingStats.form = getRatingStatsForm

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getTopRated
* @see app/Http/Controllers/Api/ArticleInteractionController.php:153
* @route '/api/articles/top-rated'
*/
export const getTopRated = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTopRated.url(options),
    method: 'get',
})

getTopRated.definition = {
    methods: ["get","head"],
    url: '/api/articles/top-rated',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getTopRated
* @see app/Http/Controllers/Api/ArticleInteractionController.php:153
* @route '/api/articles/top-rated'
*/
getTopRated.url = (options?: RouteQueryOptions) => {
    return getTopRated.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getTopRated
* @see app/Http/Controllers/Api/ArticleInteractionController.php:153
* @route '/api/articles/top-rated'
*/
getTopRated.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getTopRated.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getTopRated
* @see app/Http/Controllers/Api/ArticleInteractionController.php:153
* @route '/api/articles/top-rated'
*/
getTopRated.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getTopRated.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getTopRated
* @see app/Http/Controllers/Api/ArticleInteractionController.php:153
* @route '/api/articles/top-rated'
*/
const getTopRatedForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getTopRated.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getTopRated
* @see app/Http/Controllers/Api/ArticleInteractionController.php:153
* @route '/api/articles/top-rated'
*/
getTopRatedForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getTopRated.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getTopRated
* @see app/Http/Controllers/Api/ArticleInteractionController.php:153
* @route '/api/articles/top-rated'
*/
getTopRatedForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getTopRated.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getTopRated.form = getTopRatedForm

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::shareArticle
* @see app/Http/Controllers/Api/ArticleInteractionController.php:166
* @route '/api/articles/{article}/share'
*/
export const shareArticle = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: shareArticle.url(args, options),
    method: 'get',
})

shareArticle.definition = {
    methods: ["get","head"],
    url: '/api/articles/{article}/share',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::shareArticle
* @see app/Http/Controllers/Api/ArticleInteractionController.php:166
* @route '/api/articles/{article}/share'
*/
shareArticle.url = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return shareArticle.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::shareArticle
* @see app/Http/Controllers/Api/ArticleInteractionController.php:166
* @route '/api/articles/{article}/share'
*/
shareArticle.get = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: shareArticle.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::shareArticle
* @see app/Http/Controllers/Api/ArticleInteractionController.php:166
* @route '/api/articles/{article}/share'
*/
shareArticle.head = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: shareArticle.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::shareArticle
* @see app/Http/Controllers/Api/ArticleInteractionController.php:166
* @route '/api/articles/{article}/share'
*/
const shareArticleForm = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: shareArticle.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::shareArticle
* @see app/Http/Controllers/Api/ArticleInteractionController.php:166
* @route '/api/articles/{article}/share'
*/
shareArticleForm.get = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: shareArticle.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::shareArticle
* @see app/Http/Controllers/Api/ArticleInteractionController.php:166
* @route '/api/articles/{article}/share'
*/
shareArticleForm.head = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: shareArticle.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

shareArticle.form = shareArticleForm

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getNewsletters
* @see app/Http/Controllers/Api/ArticleInteractionController.php:182
* @route '/api/newsletters'
*/
export const getNewsletters = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getNewsletters.url(options),
    method: 'get',
})

getNewsletters.definition = {
    methods: ["get","head"],
    url: '/api/newsletters',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getNewsletters
* @see app/Http/Controllers/Api/ArticleInteractionController.php:182
* @route '/api/newsletters'
*/
getNewsletters.url = (options?: RouteQueryOptions) => {
    return getNewsletters.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getNewsletters
* @see app/Http/Controllers/Api/ArticleInteractionController.php:182
* @route '/api/newsletters'
*/
getNewsletters.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getNewsletters.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getNewsletters
* @see app/Http/Controllers/Api/ArticleInteractionController.php:182
* @route '/api/newsletters'
*/
getNewsletters.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getNewsletters.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getNewsletters
* @see app/Http/Controllers/Api/ArticleInteractionController.php:182
* @route '/api/newsletters'
*/
const getNewslettersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getNewsletters.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getNewsletters
* @see app/Http/Controllers/Api/ArticleInteractionController.php:182
* @route '/api/newsletters'
*/
getNewslettersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getNewsletters.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getNewsletters
* @see app/Http/Controllers/Api/ArticleInteractionController.php:182
* @route '/api/newsletters'
*/
getNewslettersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getNewsletters.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getNewsletters.form = getNewslettersForm

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getMySubscriptions
* @see app/Http/Controllers/Api/ArticleInteractionController.php:220
* @route '/api/newsletters/my-subscriptions'
*/
export const getMySubscriptions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getMySubscriptions.url(options),
    method: 'get',
})

getMySubscriptions.definition = {
    methods: ["get","head"],
    url: '/api/newsletters/my-subscriptions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getMySubscriptions
* @see app/Http/Controllers/Api/ArticleInteractionController.php:220
* @route '/api/newsletters/my-subscriptions'
*/
getMySubscriptions.url = (options?: RouteQueryOptions) => {
    return getMySubscriptions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getMySubscriptions
* @see app/Http/Controllers/Api/ArticleInteractionController.php:220
* @route '/api/newsletters/my-subscriptions'
*/
getMySubscriptions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getMySubscriptions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getMySubscriptions
* @see app/Http/Controllers/Api/ArticleInteractionController.php:220
* @route '/api/newsletters/my-subscriptions'
*/
getMySubscriptions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getMySubscriptions.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getMySubscriptions
* @see app/Http/Controllers/Api/ArticleInteractionController.php:220
* @route '/api/newsletters/my-subscriptions'
*/
const getMySubscriptionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getMySubscriptions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getMySubscriptions
* @see app/Http/Controllers/Api/ArticleInteractionController.php:220
* @route '/api/newsletters/my-subscriptions'
*/
getMySubscriptionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getMySubscriptions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::getMySubscriptions
* @see app/Http/Controllers/Api/ArticleInteractionController.php:220
* @route '/api/newsletters/my-subscriptions'
*/
getMySubscriptionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getMySubscriptions.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getMySubscriptions.form = getMySubscriptionsForm

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::subscribeNewsletter
* @see app/Http/Controllers/Api/ArticleInteractionController.php:192
* @route '/api/newsletters/{newsletter}/subscribe'
*/
export const subscribeNewsletter = (args: { newsletter: number | { id: number } } | [newsletter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: subscribeNewsletter.url(args, options),
    method: 'post',
})

subscribeNewsletter.definition = {
    methods: ["post"],
    url: '/api/newsletters/{newsletter}/subscribe',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::subscribeNewsletter
* @see app/Http/Controllers/Api/ArticleInteractionController.php:192
* @route '/api/newsletters/{newsletter}/subscribe'
*/
subscribeNewsletter.url = (args: { newsletter: number | { id: number } } | [newsletter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { newsletter: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { newsletter: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            newsletter: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        newsletter: typeof args.newsletter === 'object'
        ? args.newsletter.id
        : args.newsletter,
    }

    return subscribeNewsletter.definition.url
            .replace('{newsletter}', parsedArgs.newsletter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::subscribeNewsletter
* @see app/Http/Controllers/Api/ArticleInteractionController.php:192
* @route '/api/newsletters/{newsletter}/subscribe'
*/
subscribeNewsletter.post = (args: { newsletter: number | { id: number } } | [newsletter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: subscribeNewsletter.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::subscribeNewsletter
* @see app/Http/Controllers/Api/ArticleInteractionController.php:192
* @route '/api/newsletters/{newsletter}/subscribe'
*/
const subscribeNewsletterForm = (args: { newsletter: number | { id: number } } | [newsletter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: subscribeNewsletter.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::subscribeNewsletter
* @see app/Http/Controllers/Api/ArticleInteractionController.php:192
* @route '/api/newsletters/{newsletter}/subscribe'
*/
subscribeNewsletterForm.post = (args: { newsletter: number | { id: number } } | [newsletter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: subscribeNewsletter.url(args, options),
    method: 'post',
})

subscribeNewsletter.form = subscribeNewsletterForm

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::unsubscribeNewsletter
* @see app/Http/Controllers/Api/ArticleInteractionController.php:206
* @route '/api/newsletters/{newsletter}/unsubscribe'
*/
export const unsubscribeNewsletter = (args: { newsletter: number | { id: number } } | [newsletter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unsubscribeNewsletter.url(args, options),
    method: 'post',
})

unsubscribeNewsletter.definition = {
    methods: ["post"],
    url: '/api/newsletters/{newsletter}/unsubscribe',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::unsubscribeNewsletter
* @see app/Http/Controllers/Api/ArticleInteractionController.php:206
* @route '/api/newsletters/{newsletter}/unsubscribe'
*/
unsubscribeNewsletter.url = (args: { newsletter: number | { id: number } } | [newsletter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { newsletter: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { newsletter: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            newsletter: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        newsletter: typeof args.newsletter === 'object'
        ? args.newsletter.id
        : args.newsletter,
    }

    return unsubscribeNewsletter.definition.url
            .replace('{newsletter}', parsedArgs.newsletter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::unsubscribeNewsletter
* @see app/Http/Controllers/Api/ArticleInteractionController.php:206
* @route '/api/newsletters/{newsletter}/unsubscribe'
*/
unsubscribeNewsletter.post = (args: { newsletter: number | { id: number } } | [newsletter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unsubscribeNewsletter.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::unsubscribeNewsletter
* @see app/Http/Controllers/Api/ArticleInteractionController.php:206
* @route '/api/newsletters/{newsletter}/unsubscribe'
*/
const unsubscribeNewsletterForm = (args: { newsletter: number | { id: number } } | [newsletter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unsubscribeNewsletter.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ArticleInteractionController::unsubscribeNewsletter
* @see app/Http/Controllers/Api/ArticleInteractionController.php:206
* @route '/api/newsletters/{newsletter}/unsubscribe'
*/
unsubscribeNewsletterForm.post = (args: { newsletter: number | { id: number } } | [newsletter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unsubscribeNewsletter.url(args, options),
    method: 'post',
})

unsubscribeNewsletter.form = unsubscribeNewsletterForm

const ArticleInteractionController = { getComments, createComment, flagComment, rateArticle, getRatingStats, getTopRated, shareArticle, getNewsletters, getMySubscriptions, subscribeNewsletter, unsubscribeNewsletter }

export default ArticleInteractionController