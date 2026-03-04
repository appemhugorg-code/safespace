import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\GameController::updateProgress
* @see app/Http/Controllers/GameController.php:113
* @route '/games/{game}/progress'
*/
export const updateProgress = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateProgress.url(args, options),
    method: 'post',
})

updateProgress.definition = {
    methods: ["post"],
    url: '/games/{game}/progress',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GameController::updateProgress
* @see app/Http/Controllers/GameController.php:113
* @route '/games/{game}/progress'
*/
updateProgress.url = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateProgress.definition.url
            .replace('{game}', parsedArgs.game.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameController::updateProgress
* @see app/Http/Controllers/GameController.php:113
* @route '/games/{game}/progress'
*/
updateProgress.post = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateProgress.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GameController::updateProgress
* @see app/Http/Controllers/GameController.php:113
* @route '/games/{game}/progress'
*/
const updateProgressForm = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateProgress.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GameController::updateProgress
* @see app/Http/Controllers/GameController.php:113
* @route '/games/{game}/progress'
*/
updateProgressForm.post = (args: { game: number | { id: number } } | [game: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateProgress.url(args, options),
    method: 'post',
})

updateProgress.form = updateProgressForm

const GameController = { index, show, updateProgress }

export default GameController