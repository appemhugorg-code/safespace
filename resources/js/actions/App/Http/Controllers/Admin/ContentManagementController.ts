import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ContentManagementController::index
* @see app/Http/Controllers/Admin/ContentManagementController.php:23
* @route '/admin/content'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/content',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::index
* @see app/Http/Controllers/Admin/ContentManagementController.php:23
* @route '/admin/content'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::index
* @see app/Http/Controllers/Admin/ContentManagementController.php:23
* @route '/admin/content'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::index
* @see app/Http/Controllers/Admin/ContentManagementController.php:23
* @route '/admin/content'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::index
* @see app/Http/Controllers/Admin/ContentManagementController.php:23
* @route '/admin/content'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::index
* @see app/Http/Controllers/Admin/ContentManagementController.php:23
* @route '/admin/content'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::index
* @see app/Http/Controllers/Admin/ContentManagementController.php:23
* @route '/admin/content'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::analytics
* @see app/Http/Controllers/Admin/ContentManagementController.php:76
* @route '/admin/content/analytics'
*/
export const analytics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})

analytics.definition = {
    methods: ["get","head"],
    url: '/admin/content/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::analytics
* @see app/Http/Controllers/Admin/ContentManagementController.php:76
* @route '/admin/content/analytics'
*/
analytics.url = (options?: RouteQueryOptions) => {
    return analytics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::analytics
* @see app/Http/Controllers/Admin/ContentManagementController.php:76
* @route '/admin/content/analytics'
*/
analytics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::analytics
* @see app/Http/Controllers/Admin/ContentManagementController.php:76
* @route '/admin/content/analytics'
*/
analytics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analytics.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::analytics
* @see app/Http/Controllers/Admin/ContentManagementController.php:76
* @route '/admin/content/analytics'
*/
const analyticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::analytics
* @see app/Http/Controllers/Admin/ContentManagementController.php:76
* @route '/admin/content/analytics'
*/
analyticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::analytics
* @see app/Http/Controllers/Admin/ContentManagementController.php:76
* @route '/admin/content/analytics'
*/
analyticsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

analytics.form = analyticsForm

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::search
* @see app/Http/Controllers/Admin/ContentManagementController.php:152
* @route '/admin/content/search'
*/
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/admin/content/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::search
* @see app/Http/Controllers/Admin/ContentManagementController.php:152
* @route '/admin/content/search'
*/
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::search
* @see app/Http/Controllers/Admin/ContentManagementController.php:152
* @route '/admin/content/search'
*/
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::search
* @see app/Http/Controllers/Admin/ContentManagementController.php:152
* @route '/admin/content/search'
*/
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::search
* @see app/Http/Controllers/Admin/ContentManagementController.php:152
* @route '/admin/content/search'
*/
const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::search
* @see app/Http/Controllers/Admin/ContentManagementController.php:152
* @route '/admin/content/search'
*/
searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::search
* @see app/Http/Controllers/Admin/ContentManagementController.php:152
* @route '/admin/content/search'
*/
searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

search.form = searchForm

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::show
* @see app/Http/Controllers/Admin/ContentManagementController.php:62
* @route '/admin/content/{article}'
*/
export const show = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/content/{article}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::show
* @see app/Http/Controllers/Admin/ContentManagementController.php:62
* @route '/admin/content/{article}'
*/
show.url = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::show
* @see app/Http/Controllers/Admin/ContentManagementController.php:62
* @route '/admin/content/{article}'
*/
show.get = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::show
* @see app/Http/Controllers/Admin/ContentManagementController.php:62
* @route '/admin/content/{article}'
*/
show.head = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::show
* @see app/Http/Controllers/Admin/ContentManagementController.php:62
* @route '/admin/content/{article}'
*/
const showForm = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::show
* @see app/Http/Controllers/Admin/ContentManagementController.php:62
* @route '/admin/content/{article}'
*/
showForm.get = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::show
* @see app/Http/Controllers/Admin/ContentManagementController.php:62
* @route '/admin/content/{article}'
*/
showForm.head = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::approve
* @see app/Http/Controllers/Admin/ContentManagementController.php:90
* @route '/admin/content/{article}/approve'
*/
export const approve = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/admin/content/{article}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::approve
* @see app/Http/Controllers/Admin/ContentManagementController.php:90
* @route '/admin/content/{article}/approve'
*/
approve.url = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return approve.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::approve
* @see app/Http/Controllers/Admin/ContentManagementController.php:90
* @route '/admin/content/{article}/approve'
*/
approve.post = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::approve
* @see app/Http/Controllers/Admin/ContentManagementController.php:90
* @route '/admin/content/{article}/approve'
*/
const approveForm = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::approve
* @see app/Http/Controllers/Admin/ContentManagementController.php:90
* @route '/admin/content/{article}/approve'
*/
approveForm.post = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::reject
* @see app/Http/Controllers/Admin/ContentManagementController.php:100
* @route '/admin/content/{article}/reject'
*/
export const reject = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/admin/content/{article}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::reject
* @see app/Http/Controllers/Admin/ContentManagementController.php:100
* @route '/admin/content/{article}/reject'
*/
reject.url = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return reject.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::reject
* @see app/Http/Controllers/Admin/ContentManagementController.php:100
* @route '/admin/content/{article}/reject'
*/
reject.post = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::reject
* @see app/Http/Controllers/Admin/ContentManagementController.php:100
* @route '/admin/content/{article}/reject'
*/
const rejectForm = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::reject
* @see app/Http/Controllers/Admin/ContentManagementController.php:100
* @route '/admin/content/{article}/reject'
*/
rejectForm.post = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

reject.form = rejectForm

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::archive
* @see app/Http/Controllers/Admin/ContentManagementController.php:114
* @route '/admin/content/{article}/archive'
*/
export const archive = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: archive.url(args, options),
    method: 'post',
})

archive.definition = {
    methods: ["post"],
    url: '/admin/content/{article}/archive',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::archive
* @see app/Http/Controllers/Admin/ContentManagementController.php:114
* @route '/admin/content/{article}/archive'
*/
archive.url = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return archive.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::archive
* @see app/Http/Controllers/Admin/ContentManagementController.php:114
* @route '/admin/content/{article}/archive'
*/
archive.post = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: archive.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::archive
* @see app/Http/Controllers/Admin/ContentManagementController.php:114
* @route '/admin/content/{article}/archive'
*/
const archiveForm = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: archive.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::archive
* @see app/Http/Controllers/Admin/ContentManagementController.php:114
* @route '/admin/content/{article}/archive'
*/
archiveForm.post = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: archive.url(args, options),
    method: 'post',
})

archive.form = archiveForm

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::restore
* @see app/Http/Controllers/Admin/ContentManagementController.php:124
* @route '/admin/content/{article}/restore'
*/
export const restore = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

restore.definition = {
    methods: ["post"],
    url: '/admin/content/{article}/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::restore
* @see app/Http/Controllers/Admin/ContentManagementController.php:124
* @route '/admin/content/{article}/restore'
*/
restore.url = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return restore.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::restore
* @see app/Http/Controllers/Admin/ContentManagementController.php:124
* @route '/admin/content/{article}/restore'
*/
restore.post = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::restore
* @see app/Http/Controllers/Admin/ContentManagementController.php:124
* @route '/admin/content/{article}/restore'
*/
const restoreForm = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restore.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::restore
* @see app/Http/Controllers/Admin/ContentManagementController.php:124
* @route '/admin/content/{article}/restore'
*/
restoreForm.post = (args: { article: string | { slug: string } } | [article: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restore.url(args, options),
    method: 'post',
})

restore.form = restoreForm

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::bulkArchive
* @see app/Http/Controllers/Admin/ContentManagementController.php:134
* @route '/admin/content/bulk-archive'
*/
export const bulkArchive = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkArchive.url(options),
    method: 'post',
})

bulkArchive.definition = {
    methods: ["post"],
    url: '/admin/content/bulk-archive',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::bulkArchive
* @see app/Http/Controllers/Admin/ContentManagementController.php:134
* @route '/admin/content/bulk-archive'
*/
bulkArchive.url = (options?: RouteQueryOptions) => {
    return bulkArchive.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::bulkArchive
* @see app/Http/Controllers/Admin/ContentManagementController.php:134
* @route '/admin/content/bulk-archive'
*/
bulkArchive.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkArchive.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::bulkArchive
* @see app/Http/Controllers/Admin/ContentManagementController.php:134
* @route '/admin/content/bulk-archive'
*/
const bulkArchiveForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkArchive.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentManagementController::bulkArchive
* @see app/Http/Controllers/Admin/ContentManagementController.php:134
* @route '/admin/content/bulk-archive'
*/
bulkArchiveForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkArchive.url(options),
    method: 'post',
})

bulkArchive.form = bulkArchiveForm

const ContentManagementController = { index, analytics, search, show, approve, reject, archive, restore, bulkArchive }

export default ContentManagementController