import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\EmailPreferencesController::show
* @see app/Http/Controllers/Settings/EmailPreferencesController.php:15
* @route '/settings/email-preferences'
*/
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/settings/email-preferences',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\EmailPreferencesController::show
* @see app/Http/Controllers/Settings/EmailPreferencesController.php:15
* @route '/settings/email-preferences'
*/
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\EmailPreferencesController::show
* @see app/Http/Controllers/Settings/EmailPreferencesController.php:15
* @route '/settings/email-preferences'
*/
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\EmailPreferencesController::show
* @see app/Http/Controllers/Settings/EmailPreferencesController.php:15
* @route '/settings/email-preferences'
*/
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\EmailPreferencesController::show
* @see app/Http/Controllers/Settings/EmailPreferencesController.php:15
* @route '/settings/email-preferences'
*/
const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\EmailPreferencesController::show
* @see app/Http/Controllers/Settings/EmailPreferencesController.php:15
* @route '/settings/email-preferences'
*/
showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\EmailPreferencesController::show
* @see app/Http/Controllers/Settings/EmailPreferencesController.php:15
* @route '/settings/email-preferences'
*/
showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Settings\EmailPreferencesController::update
* @see app/Http/Controllers/Settings/EmailPreferencesController.php:34
* @route '/settings/email-preferences'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/settings/email-preferences',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\EmailPreferencesController::update
* @see app/Http/Controllers/Settings/EmailPreferencesController.php:34
* @route '/settings/email-preferences'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\EmailPreferencesController::update
* @see app/Http/Controllers/Settings/EmailPreferencesController.php:34
* @route '/settings/email-preferences'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Settings\EmailPreferencesController::update
* @see app/Http/Controllers/Settings/EmailPreferencesController.php:34
* @route '/settings/email-preferences'
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
* @see \App\Http\Controllers\Settings\EmailPreferencesController::update
* @see app/Http/Controllers/Settings/EmailPreferencesController.php:34
* @route '/settings/email-preferences'
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

const emailPreferences = {
    show: Object.assign(show, show),
    update: Object.assign(update, update),
}

export default emailPreferences