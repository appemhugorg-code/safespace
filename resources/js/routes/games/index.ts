import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\GameController::index
* @see app/Http/Controllers/GameController.php:20
* @route '/games'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/games',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GameController::index
* @see app/Http/Controllers/GameController.php:20
* @route '/games'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameController::index
* @see app/Http/Controllers/GameController.php:20
* @route '/games'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GameController::index
* @see app/Http/Controllers/GameController.php:20
* @route '/games'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GameController::index
* @see app/Http/Controllers/GameController.php:20
* @route '/games'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GameController::index
* @see app/Http/Controllers/GameController.php:20
* @route '/games'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GameController::index
* @see app/Http/Controllers/GameController.php:20
* @route '/games'
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
* @see \App\Http\Controllers\GameController::show
* @see app/Http/Controllers/GameController.php:71
* @route '/games/{game}'
*/
export const show = (args: { game: string | { slug: string } } | [game: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/games/{game}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GameController::show
* @see app/Http/Controllers/GameController.php:71
* @route '/games/{game}'
*/
show.url = (args: { game: string | { slug: string } } | [game: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { game: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { game: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            game: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        game: typeof args.game === 'object'
        ? args.game.slug
        : args.game,
    }

    return show.definition.url
            .replace('{game}', parsedArgs.game.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameController::show
* @see app/Http/Controllers/GameController.php:71
* @route '/games/{game}'
*/
show.get = (args: { game: string | { slug: string } } | [game: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GameController::show
* @see app/Http/Controllers/GameController.php:71
* @route '/games/{game}'
*/
show.head = (args: { game: string | { slug: string } } | [game: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GameController::show
* @see app/Http/Controllers/GameController.php:71
* @route '/games/{game}'
*/
const showForm = (args: { game: string | { slug: string } } | [game: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GameController::show
* @see app/Http/Controllers/GameController.php:71
* @route '/games/{game}'
*/
showForm.get = (args: { game: string | { slug: string } } | [game: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GameController::show
* @see app/Http/Controllers/GameController.php:71
* @route '/games/{game}'
*/
showForm.head = (args: { game: string | { slug: string } } | [game: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\GameController::progress
* @see app/Http/Controllers/GameController.php:113
* @route '/games/{game}/progress'
*/
export const progress = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: progress.url(args, options),
    method: 'post',
})

progress.definition = {
    methods: ["post"],
    url: '/games/{game}/progress',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GameController::progress
* @see app/Http/Controllers/GameController.php:113
* @route '/games/{game}/progress'
*/
progress.url = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return progress.definition.url
            .replace('{game}', parsedArgs.game.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameController::progress
* @see app/Http/Controllers/GameController.php:113
* @route '/games/{game}/progress'
*/
progress.post = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: progress.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GameController::progress
* @see app/Http/Controllers/GameController.php:113
* @route '/games/{game}/progress'
*/
const progressForm = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: progress.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GameController::progress
* @see app/Http/Controllers/GameController.php:113
* @route '/games/{game}/progress'
*/
progressForm.post = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: progress.url(args, options),
    method: 'post',
})

progress.form = progressForm

const games = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
    progress: Object.assign(progress, progress),
}

export default games