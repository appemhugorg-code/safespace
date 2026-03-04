import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import guardian from './guardian'
import therapist from './therapist'
/**
* @see \App\Http\Controllers\MoodLogController::index
* @see app/Http/Controllers/MoodLogController.php:28
* @route '/mood'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mood',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MoodLogController::index
* @see app/Http/Controllers/MoodLogController.php:28
* @route '/mood'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MoodLogController::index
* @see app/Http/Controllers/MoodLogController.php:28
* @route '/mood'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::index
* @see app/Http/Controllers/MoodLogController.php:28
* @route '/mood'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MoodLogController::index
* @see app/Http/Controllers/MoodLogController.php:28
* @route '/mood'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::index
* @see app/Http/Controllers/MoodLogController.php:28
* @route '/mood'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::index
* @see app/Http/Controllers/MoodLogController.php:28
* @route '/mood'
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
* @see \App\Http\Controllers\MoodLogController::store
* @see app/Http/Controllers/MoodLogController.php:52
* @route '/mood'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/mood',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MoodLogController::store
* @see app/Http/Controllers/MoodLogController.php:52
* @route '/mood'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MoodLogController::store
* @see app/Http/Controllers/MoodLogController.php:52
* @route '/mood'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MoodLogController::store
* @see app/Http/Controllers/MoodLogController.php:52
* @route '/mood'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MoodLogController::store
* @see app/Http/Controllers/MoodLogController.php:52
* @route '/mood'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MoodLogController::history
* @see app/Http/Controllers/MoodLogController.php:81
* @route '/mood/history'
*/
export const history = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

history.definition = {
    methods: ["get","head"],
    url: '/mood/history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MoodLogController::history
* @see app/Http/Controllers/MoodLogController.php:81
* @route '/mood/history'
*/
history.url = (options?: RouteQueryOptions) => {
    return history.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MoodLogController::history
* @see app/Http/Controllers/MoodLogController.php:81
* @route '/mood/history'
*/
history.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::history
* @see app/Http/Controllers/MoodLogController.php:81
* @route '/mood/history'
*/
history.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: history.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MoodLogController::history
* @see app/Http/Controllers/MoodLogController.php:81
* @route '/mood/history'
*/
const historyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::history
* @see app/Http/Controllers/MoodLogController.php:81
* @route '/mood/history'
*/
historyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MoodLogController::history
* @see app/Http/Controllers/MoodLogController.php:81
* @route '/mood/history'
*/
historyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: history.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

history.form = historyForm

const mood = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    history: Object.assign(history, history),
    guardian: Object.assign(guardian, guardian),
    therapist: Object.assign(therapist, therapist),
}

export default mood