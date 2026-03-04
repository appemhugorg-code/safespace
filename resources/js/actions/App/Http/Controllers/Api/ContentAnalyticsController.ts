import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::myAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:40
* @route '/api/content/analytics/my-analytics'
*/
export const myAnalytics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myAnalytics.url(options),
    method: 'get',
})

myAnalytics.definition = {
    methods: ["get","head"],
    url: '/api/content/analytics/my-analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::myAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:40
* @route '/api/content/analytics/my-analytics'
*/
myAnalytics.url = (options?: RouteQueryOptions) => {
    return myAnalytics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::myAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:40
* @route '/api/content/analytics/my-analytics'
*/
myAnalytics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myAnalytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::myAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:40
* @route '/api/content/analytics/my-analytics'
*/
myAnalytics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: myAnalytics.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::myAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:40
* @route '/api/content/analytics/my-analytics'
*/
const myAnalyticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: myAnalytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::myAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:40
* @route '/api/content/analytics/my-analytics'
*/
myAnalyticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: myAnalytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::myAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:40
* @route '/api/content/analytics/my-analytics'
*/
myAnalyticsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: myAnalytics.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

myAnalytics.form = myAnalyticsForm

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::articleAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:23
* @route '/api/content/analytics/articles/{article}'
*/
export const articleAnalytics = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: articleAnalytics.url(args, options),
    method: 'get',
})

articleAnalytics.definition = {
    methods: ["get","head"],
    url: '/api/content/analytics/articles/{article}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::articleAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:23
* @route '/api/content/analytics/articles/{article}'
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
* @see \App\Http\Controllers\Api\ContentAnalyticsController::articleAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:23
* @route '/api/content/analytics/articles/{article}'
*/
articleAnalytics.get = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: articleAnalytics.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::articleAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:23
* @route '/api/content/analytics/articles/{article}'
*/
articleAnalytics.head = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: articleAnalytics.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::articleAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:23
* @route '/api/content/analytics/articles/{article}'
*/
const articleAnalyticsForm = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: articleAnalytics.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::articleAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:23
* @route '/api/content/analytics/articles/{article}'
*/
articleAnalyticsForm.get = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: articleAnalytics.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::articleAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:23
* @route '/api/content/analytics/articles/{article}'
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
* @see \App\Http\Controllers\Api\ContentAnalyticsController::platformAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:75
* @route '/api/content/analytics/platform'
*/
export const platformAnalytics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: platformAnalytics.url(options),
    method: 'get',
})

platformAnalytics.definition = {
    methods: ["get","head"],
    url: '/api/content/analytics/platform',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::platformAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:75
* @route '/api/content/analytics/platform'
*/
platformAnalytics.url = (options?: RouteQueryOptions) => {
    return platformAnalytics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::platformAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:75
* @route '/api/content/analytics/platform'
*/
platformAnalytics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: platformAnalytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::platformAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:75
* @route '/api/content/analytics/platform'
*/
platformAnalytics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: platformAnalytics.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::platformAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:75
* @route '/api/content/analytics/platform'
*/
const platformAnalyticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: platformAnalytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::platformAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:75
* @route '/api/content/analytics/platform'
*/
platformAnalyticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: platformAnalytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::platformAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:75
* @route '/api/content/analytics/platform'
*/
platformAnalyticsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: platformAnalytics.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

platformAnalytics.form = platformAnalyticsForm

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::authorAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:58
* @route '/api/content/analytics/authors/{author}'
*/
export const authorAnalytics = (args: { author: number | { id: number } } | [author: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: authorAnalytics.url(args, options),
    method: 'get',
})

authorAnalytics.definition = {
    methods: ["get","head"],
    url: '/api/content/analytics/authors/{author}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::authorAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:58
* @route '/api/content/analytics/authors/{author}'
*/
authorAnalytics.url = (args: { author: number | { id: number } } | [author: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { author: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { author: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            author: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        author: typeof args.author === 'object'
        ? args.author.id
        : args.author,
    }

    return authorAnalytics.definition.url
            .replace('{author}', parsedArgs.author.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::authorAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:58
* @route '/api/content/analytics/authors/{author}'
*/
authorAnalytics.get = (args: { author: number | { id: number } } | [author: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: authorAnalytics.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::authorAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:58
* @route '/api/content/analytics/authors/{author}'
*/
authorAnalytics.head = (args: { author: number | { id: number } } | [author: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: authorAnalytics.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::authorAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:58
* @route '/api/content/analytics/authors/{author}'
*/
const authorAnalyticsForm = (args: { author: number | { id: number } } | [author: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: authorAnalytics.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::authorAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:58
* @route '/api/content/analytics/authors/{author}'
*/
authorAnalyticsForm.get = (args: { author: number | { id: number } } | [author: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: authorAnalytics.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::authorAnalytics
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:58
* @route '/api/content/analytics/authors/{author}'
*/
authorAnalyticsForm.head = (args: { author: number | { id: number } } | [author: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: authorAnalytics.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

authorAnalytics.form = authorAnalyticsForm

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::articlesNeedingAttention
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:92
* @route '/api/content/analytics/articles-needing-attention'
*/
export const articlesNeedingAttention = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: articlesNeedingAttention.url(options),
    method: 'get',
})

articlesNeedingAttention.definition = {
    methods: ["get","head"],
    url: '/api/content/analytics/articles-needing-attention',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::articlesNeedingAttention
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:92
* @route '/api/content/analytics/articles-needing-attention'
*/
articlesNeedingAttention.url = (options?: RouteQueryOptions) => {
    return articlesNeedingAttention.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::articlesNeedingAttention
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:92
* @route '/api/content/analytics/articles-needing-attention'
*/
articlesNeedingAttention.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: articlesNeedingAttention.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::articlesNeedingAttention
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:92
* @route '/api/content/analytics/articles-needing-attention'
*/
articlesNeedingAttention.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: articlesNeedingAttention.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::articlesNeedingAttention
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:92
* @route '/api/content/analytics/articles-needing-attention'
*/
const articlesNeedingAttentionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: articlesNeedingAttention.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::articlesNeedingAttention
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:92
* @route '/api/content/analytics/articles-needing-attention'
*/
articlesNeedingAttentionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: articlesNeedingAttention.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::articlesNeedingAttention
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:92
* @route '/api/content/analytics/articles-needing-attention'
*/
articlesNeedingAttentionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: articlesNeedingAttention.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

articlesNeedingAttention.form = articlesNeedingAttentionForm

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::archiveOldArticles
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:115
* @route '/api/content/analytics/archive-old-articles'
*/
export const archiveOldArticles = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: archiveOldArticles.url(options),
    method: 'post',
})

archiveOldArticles.definition = {
    methods: ["post"],
    url: '/api/content/analytics/archive-old-articles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::archiveOldArticles
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:115
* @route '/api/content/analytics/archive-old-articles'
*/
archiveOldArticles.url = (options?: RouteQueryOptions) => {
    return archiveOldArticles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::archiveOldArticles
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:115
* @route '/api/content/analytics/archive-old-articles'
*/
archiveOldArticles.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: archiveOldArticles.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::archiveOldArticles
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:115
* @route '/api/content/analytics/archive-old-articles'
*/
const archiveOldArticlesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: archiveOldArticles.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ContentAnalyticsController::archiveOldArticles
* @see app/Http/Controllers/Api/ContentAnalyticsController.php:115
* @route '/api/content/analytics/archive-old-articles'
*/
archiveOldArticlesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: archiveOldArticles.url(options),
    method: 'post',
})

archiveOldArticles.form = archiveOldArticlesForm

const ContentAnalyticsController = { myAnalytics, articleAnalytics, platformAnalytics, authorAnalytics, articlesNeedingAttention, archiveOldArticles }

export default ContentAnalyticsController