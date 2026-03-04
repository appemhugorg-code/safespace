import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ContentModerationController::update
* @see app/Http/Controllers/Admin/ContentModerationController.php:238
* @route '/admin/moderation/filtering'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/moderation/filtering',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::update
* @see app/Http/Controllers/Admin/ContentModerationController.php:238
* @route '/admin/moderation/filtering'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::update
* @see app/Http/Controllers/Admin/ContentModerationController.php:238
* @route '/admin/moderation/filtering'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::update
* @see app/Http/Controllers/Admin/ContentModerationController.php:238
* @route '/admin/moderation/filtering'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContentModerationController::update
* @see app/Http/Controllers/Admin/ContentModerationController.php:238
* @route '/admin/moderation/filtering'
*/
updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const filtering = {
    update: Object.assign(update, update),
}

export default filtering