import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::show
* @see app/Http/Controllers/Api/ThemePreferenceController.php:21
* @route '/api/theme/preferences'
*/
const show7954f4c6f1f409a00fa04861ebb2eb14 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show7954f4c6f1f409a00fa04861ebb2eb14.url(options),
    method: 'get',
})

show7954f4c6f1f409a00fa04861ebb2eb14.definition = {
    methods: ["get","head"],
    url: '/api/theme/preferences',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::show
* @see app/Http/Controllers/Api/ThemePreferenceController.php:21
* @route '/api/theme/preferences'
*/
show7954f4c6f1f409a00fa04861ebb2eb14.url = (options?: RouteQueryOptions) => {
    return show7954f4c6f1f409a00fa04861ebb2eb14.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::show
* @see app/Http/Controllers/Api/ThemePreferenceController.php:21
* @route '/api/theme/preferences'
*/
show7954f4c6f1f409a00fa04861ebb2eb14.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show7954f4c6f1f409a00fa04861ebb2eb14.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::show
* @see app/Http/Controllers/Api/ThemePreferenceController.php:21
* @route '/api/theme/preferences'
*/
show7954f4c6f1f409a00fa04861ebb2eb14.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show7954f4c6f1f409a00fa04861ebb2eb14.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::show
* @see app/Http/Controllers/Api/ThemePreferenceController.php:21
* @route '/api/theme/preferences'
*/
const show7954f4c6f1f409a00fa04861ebb2eb14Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show7954f4c6f1f409a00fa04861ebb2eb14.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::show
* @see app/Http/Controllers/Api/ThemePreferenceController.php:21
* @route '/api/theme/preferences'
*/
show7954f4c6f1f409a00fa04861ebb2eb14Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show7954f4c6f1f409a00fa04861ebb2eb14.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::show
* @see app/Http/Controllers/Api/ThemePreferenceController.php:21
* @route '/api/theme/preferences'
*/
show7954f4c6f1f409a00fa04861ebb2eb14Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show7954f4c6f1f409a00fa04861ebb2eb14.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show7954f4c6f1f409a00fa04861ebb2eb14.form = show7954f4c6f1f409a00fa04861ebb2eb14Form
/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::show
* @see app/Http/Controllers/Api/ThemePreferenceController.php:21
* @route '/api/user/theme'
*/
const show0de137414e225d211ee9ebb68282d6ef = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show0de137414e225d211ee9ebb68282d6ef.url(options),
    method: 'get',
})

show0de137414e225d211ee9ebb68282d6ef.definition = {
    methods: ["get","head"],
    url: '/api/user/theme',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::show
* @see app/Http/Controllers/Api/ThemePreferenceController.php:21
* @route '/api/user/theme'
*/
show0de137414e225d211ee9ebb68282d6ef.url = (options?: RouteQueryOptions) => {
    return show0de137414e225d211ee9ebb68282d6ef.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::show
* @see app/Http/Controllers/Api/ThemePreferenceController.php:21
* @route '/api/user/theme'
*/
show0de137414e225d211ee9ebb68282d6ef.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show0de137414e225d211ee9ebb68282d6ef.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::show
* @see app/Http/Controllers/Api/ThemePreferenceController.php:21
* @route '/api/user/theme'
*/
show0de137414e225d211ee9ebb68282d6ef.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show0de137414e225d211ee9ebb68282d6ef.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::show
* @see app/Http/Controllers/Api/ThemePreferenceController.php:21
* @route '/api/user/theme'
*/
const show0de137414e225d211ee9ebb68282d6efForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show0de137414e225d211ee9ebb68282d6ef.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::show
* @see app/Http/Controllers/Api/ThemePreferenceController.php:21
* @route '/api/user/theme'
*/
show0de137414e225d211ee9ebb68282d6efForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show0de137414e225d211ee9ebb68282d6ef.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::show
* @see app/Http/Controllers/Api/ThemePreferenceController.php:21
* @route '/api/user/theme'
*/
show0de137414e225d211ee9ebb68282d6efForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show0de137414e225d211ee9ebb68282d6ef.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show0de137414e225d211ee9ebb68282d6ef.form = show0de137414e225d211ee9ebb68282d6efForm

export const show = {
    '/api/theme/preferences': show7954f4c6f1f409a00fa04861ebb2eb14,
    '/api/user/theme': show0de137414e225d211ee9ebb68282d6ef,
}

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::store
* @see app/Http/Controllers/Api/ThemePreferenceController.php:0
* @route '/api/theme/preferences'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/theme/preferences',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::store
* @see app/Http/Controllers/Api/ThemePreferenceController.php:0
* @route '/api/theme/preferences'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::store
* @see app/Http/Controllers/Api/ThemePreferenceController.php:0
* @route '/api/theme/preferences'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::store
* @see app/Http/Controllers/Api/ThemePreferenceController.php:0
* @route '/api/theme/preferences'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::store
* @see app/Http/Controllers/Api/ThemePreferenceController.php:0
* @route '/api/theme/preferences'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::update
* @see app/Http/Controllers/Api/ThemePreferenceController.php:40
* @route '/api/theme/preferences'
*/
const update7954f4c6f1f409a00fa04861ebb2eb14 = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update7954f4c6f1f409a00fa04861ebb2eb14.url(options),
    method: 'put',
})

update7954f4c6f1f409a00fa04861ebb2eb14.definition = {
    methods: ["put"],
    url: '/api/theme/preferences',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::update
* @see app/Http/Controllers/Api/ThemePreferenceController.php:40
* @route '/api/theme/preferences'
*/
update7954f4c6f1f409a00fa04861ebb2eb14.url = (options?: RouteQueryOptions) => {
    return update7954f4c6f1f409a00fa04861ebb2eb14.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::update
* @see app/Http/Controllers/Api/ThemePreferenceController.php:40
* @route '/api/theme/preferences'
*/
update7954f4c6f1f409a00fa04861ebb2eb14.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update7954f4c6f1f409a00fa04861ebb2eb14.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::update
* @see app/Http/Controllers/Api/ThemePreferenceController.php:40
* @route '/api/theme/preferences'
*/
const update7954f4c6f1f409a00fa04861ebb2eb14Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update7954f4c6f1f409a00fa04861ebb2eb14.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::update
* @see app/Http/Controllers/Api/ThemePreferenceController.php:40
* @route '/api/theme/preferences'
*/
update7954f4c6f1f409a00fa04861ebb2eb14Form.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update7954f4c6f1f409a00fa04861ebb2eb14.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update7954f4c6f1f409a00fa04861ebb2eb14.form = update7954f4c6f1f409a00fa04861ebb2eb14Form
/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::update
* @see app/Http/Controllers/Api/ThemePreferenceController.php:40
* @route '/api/user/theme'
*/
const update0de137414e225d211ee9ebb68282d6ef = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update0de137414e225d211ee9ebb68282d6ef.url(options),
    method: 'patch',
})

update0de137414e225d211ee9ebb68282d6ef.definition = {
    methods: ["patch"],
    url: '/api/user/theme',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::update
* @see app/Http/Controllers/Api/ThemePreferenceController.php:40
* @route '/api/user/theme'
*/
update0de137414e225d211ee9ebb68282d6ef.url = (options?: RouteQueryOptions) => {
    return update0de137414e225d211ee9ebb68282d6ef.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::update
* @see app/Http/Controllers/Api/ThemePreferenceController.php:40
* @route '/api/user/theme'
*/
update0de137414e225d211ee9ebb68282d6ef.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update0de137414e225d211ee9ebb68282d6ef.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::update
* @see app/Http/Controllers/Api/ThemePreferenceController.php:40
* @route '/api/user/theme'
*/
const update0de137414e225d211ee9ebb68282d6efForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update0de137414e225d211ee9ebb68282d6ef.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::update
* @see app/Http/Controllers/Api/ThemePreferenceController.php:40
* @route '/api/user/theme'
*/
update0de137414e225d211ee9ebb68282d6efForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update0de137414e225d211ee9ebb68282d6ef.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update0de137414e225d211ee9ebb68282d6ef.form = update0de137414e225d211ee9ebb68282d6efForm

export const update = {
    '/api/theme/preferences': update7954f4c6f1f409a00fa04861ebb2eb14,
    '/api/user/theme': update0de137414e225d211ee9ebb68282d6ef,
}

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::destroy
* @see app/Http/Controllers/Api/ThemePreferenceController.php:0
* @route '/api/theme/preferences'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/theme/preferences',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::destroy
* @see app/Http/Controllers/Api/ThemePreferenceController.php:0
* @route '/api/theme/preferences'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::destroy
* @see app/Http/Controllers/Api/ThemePreferenceController.php:0
* @route '/api/theme/preferences'
*/
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::destroy
* @see app/Http/Controllers/Api/ThemePreferenceController.php:0
* @route '/api/theme/preferences'
*/
const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::destroy
* @see app/Http/Controllers/Api/ThemePreferenceController.php:0
* @route '/api/theme/preferences'
*/
destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::reset
* @see app/Http/Controllers/Api/ThemePreferenceController.php:79
* @route '/api/user/theme/reset'
*/
export const reset = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(options),
    method: 'post',
})

reset.definition = {
    methods: ["post"],
    url: '/api/user/theme/reset',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::reset
* @see app/Http/Controllers/Api/ThemePreferenceController.php:79
* @route '/api/user/theme/reset'
*/
reset.url = (options?: RouteQueryOptions) => {
    return reset.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::reset
* @see app/Http/Controllers/Api/ThemePreferenceController.php:79
* @route '/api/user/theme/reset'
*/
reset.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::reset
* @see app/Http/Controllers/Api/ThemePreferenceController.php:79
* @route '/api/user/theme/reset'
*/
const resetForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reset.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::reset
* @see app/Http/Controllers/Api/ThemePreferenceController.php:79
* @route '/api/user/theme/reset'
*/
resetForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reset.url(options),
    method: 'post',
})

reset.form = resetForm

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::analytics
* @see app/Http/Controllers/Api/ThemePreferenceController.php:108
* @route '/api/admin/theme/analytics'
*/
export const analytics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})

analytics.definition = {
    methods: ["get","head"],
    url: '/api/admin/theme/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::analytics
* @see app/Http/Controllers/Api/ThemePreferenceController.php:108
* @route '/api/admin/theme/analytics'
*/
analytics.url = (options?: RouteQueryOptions) => {
    return analytics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::analytics
* @see app/Http/Controllers/Api/ThemePreferenceController.php:108
* @route '/api/admin/theme/analytics'
*/
analytics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::analytics
* @see app/Http/Controllers/Api/ThemePreferenceController.php:108
* @route '/api/admin/theme/analytics'
*/
analytics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analytics.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::analytics
* @see app/Http/Controllers/Api/ThemePreferenceController.php:108
* @route '/api/admin/theme/analytics'
*/
const analyticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::analytics
* @see app/Http/Controllers/Api/ThemePreferenceController.php:108
* @route '/api/admin/theme/analytics'
*/
analyticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::analytics
* @see app/Http/Controllers/Api/ThemePreferenceController.php:108
* @route '/api/admin/theme/analytics'
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
* @see \App\Http\Controllers\Api\ThemePreferenceController::bulkUpdate
* @see app/Http/Controllers/Api/ThemePreferenceController.php:140
* @route '/api/admin/theme/bulk-update'
*/
export const bulkUpdate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkUpdate.url(options),
    method: 'post',
})

bulkUpdate.definition = {
    methods: ["post"],
    url: '/api/admin/theme/bulk-update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::bulkUpdate
* @see app/Http/Controllers/Api/ThemePreferenceController.php:140
* @route '/api/admin/theme/bulk-update'
*/
bulkUpdate.url = (options?: RouteQueryOptions) => {
    return bulkUpdate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::bulkUpdate
* @see app/Http/Controllers/Api/ThemePreferenceController.php:140
* @route '/api/admin/theme/bulk-update'
*/
bulkUpdate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkUpdate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::bulkUpdate
* @see app/Http/Controllers/Api/ThemePreferenceController.php:140
* @route '/api/admin/theme/bulk-update'
*/
const bulkUpdateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkUpdate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::bulkUpdate
* @see app/Http/Controllers/Api/ThemePreferenceController.php:140
* @route '/api/admin/theme/bulk-update'
*/
bulkUpdateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkUpdate.url(options),
    method: 'post',
})

bulkUpdate.form = bulkUpdateForm

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::defaults
* @see app/Http/Controllers/Api/ThemePreferenceController.php:127
* @route '/api/theme/defaults'
*/
export const defaults = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: defaults.url(options),
    method: 'get',
})

defaults.definition = {
    methods: ["get","head"],
    url: '/api/theme/defaults',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::defaults
* @see app/Http/Controllers/Api/ThemePreferenceController.php:127
* @route '/api/theme/defaults'
*/
defaults.url = (options?: RouteQueryOptions) => {
    return defaults.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::defaults
* @see app/Http/Controllers/Api/ThemePreferenceController.php:127
* @route '/api/theme/defaults'
*/
defaults.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: defaults.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::defaults
* @see app/Http/Controllers/Api/ThemePreferenceController.php:127
* @route '/api/theme/defaults'
*/
defaults.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: defaults.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::defaults
* @see app/Http/Controllers/Api/ThemePreferenceController.php:127
* @route '/api/theme/defaults'
*/
const defaultsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: defaults.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::defaults
* @see app/Http/Controllers/Api/ThemePreferenceController.php:127
* @route '/api/theme/defaults'
*/
defaultsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: defaults.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\ThemePreferenceController::defaults
* @see app/Http/Controllers/Api/ThemePreferenceController.php:127
* @route '/api/theme/defaults'
*/
defaultsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: defaults.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

defaults.form = defaultsForm

const ThemePreferenceController = { show, store, update, destroy, reset, analytics, bulkUpdate, defaults }

export default ThemePreferenceController