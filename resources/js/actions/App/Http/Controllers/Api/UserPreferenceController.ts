import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\UserPreferenceController::index
* @see app/Http/Controllers/Api/UserPreferenceController.php:20
* @route '/api/preferences'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/preferences',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::index
* @see app/Http/Controllers/Api/UserPreferenceController.php:20
* @route '/api/preferences'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::index
* @see app/Http/Controllers/Api/UserPreferenceController.php:20
* @route '/api/preferences'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::index
* @see app/Http/Controllers/Api/UserPreferenceController.php:20
* @route '/api/preferences'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::index
* @see app/Http/Controllers/Api/UserPreferenceController.php:20
* @route '/api/preferences'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::index
* @see app/Http/Controllers/Api/UserPreferenceController.php:20
* @route '/api/preferences'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::index
* @see app/Http/Controllers/Api/UserPreferenceController.php:20
* @route '/api/preferences'
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
* @see \App\Http\Controllers\Api\UserPreferenceController::update
* @see app/Http/Controllers/Api/UserPreferenceController.php:41
* @route '/api/preferences'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/preferences',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::update
* @see app/Http/Controllers/Api/UserPreferenceController.php:41
* @route '/api/preferences'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::update
* @see app/Http/Controllers/Api/UserPreferenceController.php:41
* @route '/api/preferences'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::update
* @see app/Http/Controllers/Api/UserPreferenceController.php:41
* @route '/api/preferences'
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
* @see \App\Http\Controllers\Api\UserPreferenceController::update
* @see app/Http/Controllers/Api/UserPreferenceController.php:41
* @route '/api/preferences'
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

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::sync
* @see app/Http/Controllers/Api/UserPreferenceController.php:89
* @route '/api/preferences/sync'
*/
export const sync = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(options),
    method: 'post',
})

sync.definition = {
    methods: ["post"],
    url: '/api/preferences/sync',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::sync
* @see app/Http/Controllers/Api/UserPreferenceController.php:89
* @route '/api/preferences/sync'
*/
sync.url = (options?: RouteQueryOptions) => {
    return sync.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::sync
* @see app/Http/Controllers/Api/UserPreferenceController.php:89
* @route '/api/preferences/sync'
*/
sync.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::sync
* @see app/Http/Controllers/Api/UserPreferenceController.php:89
* @route '/api/preferences/sync'
*/
const syncForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sync.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::sync
* @see app/Http/Controllers/Api/UserPreferenceController.php:89
* @route '/api/preferences/sync'
*/
syncForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sync.url(options),
    method: 'post',
})

sync.form = syncForm

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::conflicts
* @see app/Http/Controllers/Api/UserPreferenceController.php:130
* @route '/api/preferences/conflicts'
*/
export const conflicts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conflicts.url(options),
    method: 'get',
})

conflicts.definition = {
    methods: ["get","head"],
    url: '/api/preferences/conflicts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::conflicts
* @see app/Http/Controllers/Api/UserPreferenceController.php:130
* @route '/api/preferences/conflicts'
*/
conflicts.url = (options?: RouteQueryOptions) => {
    return conflicts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::conflicts
* @see app/Http/Controllers/Api/UserPreferenceController.php:130
* @route '/api/preferences/conflicts'
*/
conflicts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conflicts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::conflicts
* @see app/Http/Controllers/Api/UserPreferenceController.php:130
* @route '/api/preferences/conflicts'
*/
conflicts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: conflicts.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::conflicts
* @see app/Http/Controllers/Api/UserPreferenceController.php:130
* @route '/api/preferences/conflicts'
*/
const conflictsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: conflicts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::conflicts
* @see app/Http/Controllers/Api/UserPreferenceController.php:130
* @route '/api/preferences/conflicts'
*/
conflictsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: conflicts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::conflicts
* @see app/Http/Controllers/Api/UserPreferenceController.php:130
* @route '/api/preferences/conflicts'
*/
conflictsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: conflicts.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

conflicts.form = conflictsForm

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::resolveConflicts
* @see app/Http/Controllers/Api/UserPreferenceController.php:151
* @route '/api/preferences/conflicts/resolve'
*/
export const resolveConflicts = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolveConflicts.url(options),
    method: 'post',
})

resolveConflicts.definition = {
    methods: ["post"],
    url: '/api/preferences/conflicts/resolve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::resolveConflicts
* @see app/Http/Controllers/Api/UserPreferenceController.php:151
* @route '/api/preferences/conflicts/resolve'
*/
resolveConflicts.url = (options?: RouteQueryOptions) => {
    return resolveConflicts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::resolveConflicts
* @see app/Http/Controllers/Api/UserPreferenceController.php:151
* @route '/api/preferences/conflicts/resolve'
*/
resolveConflicts.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolveConflicts.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::resolveConflicts
* @see app/Http/Controllers/Api/UserPreferenceController.php:151
* @route '/api/preferences/conflicts/resolve'
*/
const resolveConflictsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolveConflicts.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::resolveConflicts
* @see app/Http/Controllers/Api/UserPreferenceController.php:151
* @route '/api/preferences/conflicts/resolve'
*/
resolveConflictsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolveConflicts.url(options),
    method: 'post',
})

resolveConflicts.form = resolveConflictsForm

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::exportMethod
* @see app/Http/Controllers/Api/UserPreferenceController.php:199
* @route '/api/preferences/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/api/preferences/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::exportMethod
* @see app/Http/Controllers/Api/UserPreferenceController.php:199
* @route '/api/preferences/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::exportMethod
* @see app/Http/Controllers/Api/UserPreferenceController.php:199
* @route '/api/preferences/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::exportMethod
* @see app/Http/Controllers/Api/UserPreferenceController.php:199
* @route '/api/preferences/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::exportMethod
* @see app/Http/Controllers/Api/UserPreferenceController.php:199
* @route '/api/preferences/export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::exportMethod
* @see app/Http/Controllers/Api/UserPreferenceController.php:199
* @route '/api/preferences/export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::exportMethod
* @see app/Http/Controllers/Api/UserPreferenceController.php:199
* @route '/api/preferences/export'
*/
exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportMethod.form = exportMethodForm

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::importMethod
* @see app/Http/Controllers/Api/UserPreferenceController.php:220
* @route '/api/preferences/import'
*/
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

importMethod.definition = {
    methods: ["post"],
    url: '/api/preferences/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::importMethod
* @see app/Http/Controllers/Api/UserPreferenceController.php:220
* @route '/api/preferences/import'
*/
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::importMethod
* @see app/Http/Controllers/Api/UserPreferenceController.php:220
* @route '/api/preferences/import'
*/
importMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::importMethod
* @see app/Http/Controllers/Api/UserPreferenceController.php:220
* @route '/api/preferences/import'
*/
const importMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: importMethod.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\UserPreferenceController::importMethod
* @see app/Http/Controllers/Api/UserPreferenceController.php:220
* @route '/api/preferences/import'
*/
importMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: importMethod.url(options),
    method: 'post',
})

importMethod.form = importMethodForm

const UserPreferenceController = { index, update, sync, conflicts, resolveConflicts, exportMethod, importMethod, export: exportMethod, import: importMethod }

export default UserPreferenceController