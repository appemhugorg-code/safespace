import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::store
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:293
* @route '/guardian/child-assignments'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/guardian/child-assignments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::store
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:293
* @route '/guardian/child-assignments'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::store
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:293
* @route '/guardian/child-assignments'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::store
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:293
* @route '/guardian/child-assignments'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Guardian\ClientConnectionController::store
* @see app/Http/Controllers/Guardian/ClientConnectionController.php:293
* @route '/guardian/child-assignments'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const childAssignments = {
    store: Object.assign(store, store),
}

export default childAssignments