import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/groups'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/groups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/groups'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/groups'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/groups'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GroupController::store
* @see app/Http/Controllers/GroupController.php:57
* @route '/groups'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const groups = {
    store: Object.assign(store, store),
}

export default groups